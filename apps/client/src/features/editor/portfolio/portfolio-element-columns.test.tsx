// @vitest-environment jsdom

import { Editor, Node, type Extensions, type JSONContent } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { BulletList, ListItem } from "@tiptap/extension-list";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";
// Use the ESM source like the runtime build, keeping ProseMirror identities shared.
import { Column, Columns } from "../../../../../../packages/editor-ext/src/lib/columns";
import { MantineProvider } from "@mantine/core";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  deletePortfolioTopLevelBlock,
  duplicatePortfolioTopLevelBlock,
  getPortfolioTopLevelBlock,
  getPortfolioElementMenuOwner,
  movePortfolioBlockToSection,
  movePortfolioTopLevelBlock,
  triggerPortfolioElementAction,
  updatePortfolioTopLevelBlockAttributes,
  PortfolioCustomElementMenu,
} from "./portfolio-element-menu";
import ColumnsMenu from "../components/columns/columns-menu";

type MenuProps = {
  pluginKey: string;
  editor: Editor;
  shouldShow: (props: { state: Editor["state"] }) => boolean;
  getReferencedVirtualElement: () =>
    | { getBoundingClientRect: () => DOMRect }
    | undefined;
  children: ReactNode;
};
const menus = vi.hoisted(() => new Map<string, MenuProps>());
// Keep the real toolbar React components; capture the positioning plugin's
// contract so assertions do not depend on jsdom's absent browser layout.
vi.mock("@tiptap/react/menus", () => ({
  BubbleMenu: (props: MenuProps) => {
    menus.set(props.pluginKey, props);
    return props.shouldShow({ state: props.editor.state })
      ? props.children
      : null;
  },
}));

// Shared targeting is independent of each node view's rendering implementation.
const elementTypes = [
  "attachment",
  "audio",
  "base",
  "callout",
  "codeBlock",
  "drawio",
  "excalidraw",
  "embed",
  "image",
  "mediaPlaylist",
  "pdf",
  "photoAlbum",
  "photoGrid",
  "subpages",
  "table",
  "tabs",
  "transclusionReference",
  "transclusionSource",
  "video",
  "youtube",
  "horizontalRule",
  "mathBlock",
  "pageBreak",
  "blockquote",
  "bulletList",
  "orderedList",
  "taskList",
  "details",
];
const fixtures = elementTypes.map((name) =>
  Node.create({
    name,
    group: "block",
    atom: true,
    addAttributes: () => ({ id: { default: null }, gap: { default: 8 } }),
    renderHTML: ({ HTMLAttributes }) => [
      "div",
      { ...HTMLAttributes, "data-type": name },
    ],
  }),
);
const paragraph = (text: string): JSONContent => ({
  type: "paragraph",
  content: [{ type: "text", text }],
});
const row = (left: JSONContent[], right: JSONContent[]): JSONContent => ({
  type: "columns",
  content: [
    { type: "column", content: left },
    { type: "column", content: right },
  ],
});
const grid = (id: string): JSONContent => ({
  type: "photoGrid",
  attrs: { id },
});
let editor: Editor;
function create(content: JSONContent[], extraExtensions: Extensions = []) {
  const element = document.createElement("div");
  document.body.append(element);
  editor = new Editor({
    element,
    editorProps: { attributes: { class: "ramzy-portfolio-editor" } },
    extensions: [
      Document,
      Paragraph,
      Heading,
      Text,
      Column,
      Columns,
      ...fixtures.filter(
        (fixture) =>
          !extraExtensions.some((extension) => extension.name === fixture.name),
      ),
      ...extraExtensions,
    ],
    content: { type: "doc", content },
  });
  return editor;
}
function selectId(id: string) {
  let position = -1;
  editor.state.doc.descendants((node, pos) => {
    if (node.attrs.id === id) position = pos;
  });
  expect(position).toBeGreaterThanOrEqual(0);
  editor.commands.setNodeSelection(position);
  return position;
}
afterEach(() => {
  cleanup();
  editor?.destroy();
  document.body.replaceChildren();
  menus.clear();
  vi.unstubAllGlobals();
});

describe("portfolio elements in columns", () => {
  it.each(elementTypes)(
    "targets either %s without selecting its row or neighbour",
    (type) => {
      create([
        row(
          [{ type, attrs: { id: "left" } }],
          [{ type, attrs: { id: "right" } }],
        ),
      ]);
      for (const id of ["left", "right"]) {
        const position = selectId(id);
        expect(getPortfolioTopLevelBlock(editor)).toMatchObject({
          position,
          node: { type: { name: type }, attrs: { id } },
          isSectionHeading: false,
        });
        updatePortfolioTopLevelBlockAttributes(editor, { gap: 24 });
        expect(editor.state.doc.nodeAt(position)?.attrs.gap).toBe(24);
      }
      expect(editor.state.doc.firstChild?.type.name).toBe("columns");
    },
  );

  it("duplicates and deletes only the selected grid", () => {
    create([row([grid("left")], [grid("right")])]);
    selectId("right");
    expect(duplicatePortfolioTopLevelBlock(editor)).toBe(true);
    expect(editor.state.doc.firstChild?.child(0).childCount).toBe(1);
    expect(editor.state.doc.firstChild?.child(1).childCount).toBe(2);
    expect(editor.state.doc.firstChild?.child(1).child(1).attrs.id).toBeNull();
    selectId("right");
    deletePortfolioTopLevelBlock(editor);
    expect(editor.state.doc.firstChild?.child(1).childCount).toBe(1);
    expect(editor.state.doc.firstChild?.child(0).firstChild?.attrs.id).toBe(
      "left",
    );
    editor.state.doc.check();
  });

  it("moves among siblings within one column and stops at its boundaries", () => {
    create([row([grid("left")], [grid("first"), grid("second")])]);
    selectId("first");
    expect(movePortfolioTopLevelBlock(editor, "up")).toBe(false);
    expect(movePortfolioTopLevelBlock(editor, "down")).toBe(true);
    expect(editor.state.doc.firstChild?.child(1).firstChild?.attrs.id).toBe(
      "second",
    );
    expect(movePortfolioTopLevelBlock(editor, "down")).toBe(false);
    expect(movePortfolioTopLevelBlock(editor, "up")).toBe(true);
    expect(editor.state.doc.firstChild?.child(0).firstChild?.attrs.id).toBe(
      "left",
    );
    editor.state.doc.check();
  });

  it("routes an action to the selected grid DOM only", () => {
    create([row([grid("left")], [grid("right")])]);
    const actions = [vi.fn(), vi.fn()];
    for (const [index, id] of ["left", "right"].entries()) {
      const position = selectId(id);
      const button = document.createElement("button");
      button.dataset.ramzyElementAction = "add-photos";
      button.onclick = actions[index];
      (editor.view.nodeDOM(position) as HTMLElement).append(button);
    }
    expect(triggerPortfolioElementAction(editor, "add-photos")).toBe(true);
    expect(actions[0]).not.toHaveBeenCalled();
    expect(actions[1]).toHaveBeenCalledOnce();
  });

  it("keeps nested headings local and explicitly selected rows intact", () => {
    create([
      row(
        [paragraph("left")],
        [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "nested" }],
          },
        ],
      ),
      paragraph("outside"),
    ]);
    let headingPosition = 0;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "heading") headingPosition = pos;
    });
    editor.commands.setTextSelection(headingPosition + 2);
    expect(getPortfolioTopLevelBlock(editor)).toMatchObject({
      position: headingPosition,
      isSectionHeading: false,
      node: { type: { name: "heading" } },
    });
    deletePortfolioTopLevelBlock(editor);
    expect(editor.state.doc.lastChild?.textContent).toBe("outside");
    expect(editor.state.doc.firstChild?.child(1).firstChild?.type.name).toBe(
      "paragraph",
    );
    editor.commands.setNodeSelection(0);
    expect(getPortfolioTopLevelBlock(editor)?.node.type.name).toBe("columns");
    editor.state.doc.check();
  });

  it("finds the child of the innermost nested column", () => {
    create([
      row([grid("outer")], [row([grid("inner-left")], [grid("inner-right")])]),
    ]);
    const position = selectId("inner-right");
    expect(getPortfolioTopLevelBlock(editor)?.position).toBe(position);
  });

  it.each([
    {
      type: "bulletList",
      extensions: [BulletList, ListItem],
      content: [{ type: "listItem", content: [paragraph("inside")] }],
    },
    {
      type: "table",
      extensions: [Table, TableRow, TableCell, TableHeader],
      content: [
        {
          type: "tableRow",
          content: [{ type: "tableCell", content: [paragraph("inside")] }],
        },
      ],
    },
  ])(
    "retains a whole $type when selecting text inside it in a column",
    ({ type, extensions, content }) => {
      create([row([grid("left")], [{ type, content }])], extensions);
      let textPosition = 0;
      let blockPosition = 0;
      editor.state.doc.descendants((node, pos) => {
        if (node.isText) textPosition = pos;
        if (node.type.name === type) blockPosition = pos;
      });
      editor.commands.setTextSelection(textPosition + 1);
      expect(getPortfolioTopLevelBlock(editor)).toMatchObject({
        position: blockPosition,
        node: { type: { name: type } },
      });
      expect(getPortfolioElementMenuOwner(editor)).toBe(
        type === "table" ? "table" : "generic",
      );
      duplicatePortfolioTopLevelBlock(editor);
      expect(editor.state.doc.firstChild?.child(1).childCount).toBe(2);
      editor.state.doc.check();
    },
  );

  it("moves the only column child to a section while retaining a valid empty column", () => {
    create([
      row([grid("left")], [grid("right")]),
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Target" }],
      },
      paragraph("existing"),
    ]);
    const position = editor.state.doc.firstChild!.nodeSize;
    selectId("right");
    movePortfolioBlockToSection(editor, {
      position,
      title: "Target",
      end: editor.state.doc.content.size,
    });
    expect(editor.state.doc.lastChild?.attrs.id).toBe("right");
    expect(editor.state.doc.firstChild?.child(1).firstChild?.type.name).toBe(
      "paragraph",
    );
    expect(editor.state.doc.child(2).textContent).toBe("existing");
    editor.state.doc.check();
  });

  it.each(elementTypes)(
    "chooses the same toolbar for %s inside or outside columns",
    (type) => {
      create([
        { type, attrs: { id: "standalone" } },
        row(
          [{ type, attrs: { id: "left" } }],
          [{ type, attrs: { id: "right" } }],
        ),
      ]);
      selectId("standalone");
      const owner = getPortfolioElementMenuOwner(editor);
      for (const id of ["left", "right"]) {
        selectId(id);
        expect(getPortfolioElementMenuOwner(editor)).toBe(owner);
        expect(owner).not.toBe("columns");
      }
    },
  );

  it("retains full image-grid controls and anchors them to the right grid", async () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    create([row([grid("left")], [grid("right")])]);
    const right = selectId("right");
    await waitFor(() => expect(editor.isInitialized).toBe(true));
    const rect = new DOMRect(500, 40, 430, 350);
    vi.spyOn(
      editor.view.nodeDOM(right) as HTMLElement,
      "getBoundingClientRect",
    ).mockReturnValue(rect);
    render(
      <MantineProvider>
        <PortfolioCustomElementMenu editor={editor} />
        <ColumnsMenu editor={editor} />
      </MantineProvider>,
    );
    expect(screen.getByRole("button", { name: "Add photos" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Spacing: 8px" })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Open images in lightbox" }),
    ).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Column count" })).toBeNull();
    expect(
      menus
        .get("portfolio-collection-element-menu")
        ?.getReferencedVirtualElement()
        ?.getBoundingClientRect(),
    ).toBe(rect);

    // Selection changes refresh the same toolbar, without inheriting neighbour attributes.
    act(() => {
      updatePortfolioTopLevelBlockAttributes(editor, { gap: 24 });
    });
    expect(screen.getByRole("button", { name: "Spacing: 24px" })).toBeTruthy();
    act(() => {
      selectId("left");
    });
    expect(screen.getByRole("button", { name: "Spacing: 8px" })).toBeTruthy();

    vi.spyOn(editor.view.nodeDOM(0) as HTMLElement, "getBoundingClientRect")
      .mockReturnValue(new DOMRect(20, 40, 910, 350));
    act(() => { editor.commands.setNodeSelection(0); });
    expect(screen.queryByRole("button", { name: "Add photos" })).toBeNull();
    expect(screen.getByRole("button", { name: "Column count" })).toBeTruthy();
  });

  it("keeps row layout controls usable when the row itself is selected", () => {
    create([row([grid("left")], [grid("right")])]);
    editor.commands.setNodeSelection(0);
    expect(getPortfolioElementMenuOwner(editor)).toBe("columns");
    expect(editor.commands.setColumnsLayout("two_left_sidebar")).toBe(true);
    expect(editor.state.doc.firstChild?.attrs.layout).toBe("two_left_sidebar");
    expect(getPortfolioElementMenuOwner(editor)).toBe("columns");
    expect(editor.commands.setColumnCount(3)).toBe(true);
    expect(editor.state.doc.firstChild?.childCount).toBe(3);
    expect(getPortfolioElementMenuOwner(editor)).toBe("columns");
    expect(editor.state.doc.firstChild?.child(0).firstChild?.attrs.id).toBe(
      "left",
    );
    expect(editor.state.doc.firstChild?.child(1).firstChild?.attrs.id).toBe(
      "right",
    );
  });
});
