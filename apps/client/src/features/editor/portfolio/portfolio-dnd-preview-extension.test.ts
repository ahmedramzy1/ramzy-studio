// @vitest-environment jsdom

import { Editor, Node } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { afterEach, describe, expect, it } from "vitest";
import {
  PortfolioDndPreview,
  setPortfolioDndPreview,
} from "./portfolio-dnd-preview-extension";

const TestColumns = Node.create({
  name: "columns",
  group: "block",
  content: "column+",
  addAttributes: () => ({ layout: { default: "two_equal" } }),
  parseHTML: () => [{ tag: 'div[data-type="columns"]' }],
  renderHTML: () => ["div", { "data-type": "columns" }, 0],
});

const TestColumn = Node.create({
  name: "column",
  group: "block",
  content: "block+",
  parseHTML: () => [{ tag: 'div[data-type="column"]' }],
  renderHTML: () => ["div", { "data-type": "column" }, 0],
});

function createEditor(content: Record<string, unknown>) {
  const element = document.createElement("div");
  document.body.append(element);
  return new Editor({
    element,
    extensions: [
      Document,
      Paragraph,
      Text,
      TestColumns,
      TestColumn,
      PortfolioDndPreview,
    ],
    content,
  });
}

describe("portfolio drag preview decorations", () => {
  let editor: Editor | null = null;

  afterEach(() => {
    editor?.destroy();
    editor = null;
    document.body.replaceChildren();
  });

  it("uses the real target at half width and a dotted side guide", () => {
    editor = createEditor({
      type: "doc",
      content: ["A", "B"].map((text) => ({
        type: "paragraph",
        content: [{ type: "text", text }],
      })),
    });
    const first = editor.state.doc.child(0);
    const secondPosition = first.nodeSize;
    const preview = {
      sourcePosition: secondPosition,
      targetPosition: 0,
      edge: "right" as const,
      columnIndex: null,
      sourceHeight: 120,
    };
    setPortfolioDndPreview(editor, {
      ...preview,
    });

    expect(
      editor.view.dom.firstElementChild?.classList.contains(
        "ramzy-dnd-preview-single-row",
      ),
    ).toBe(true);
    expect(
      editor.view.dom.firstElementChild?.getAttribute("data-ramzy-drop-edge"),
    ).toBe("right");
    expect(
      editor.view.dom.lastElementChild?.classList.contains("ramzy-dnd-source"),
    ).toBe(true);
  });

  it("inserts an editor-owned placeholder into an existing grid", () => {
    editor = createEditor({
      type: "doc",
      content: [
        {
          type: "columns",
          attrs: { layout: "two_equal" },
          content: ["A", "B"].map((text) => ({
            type: "column",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text }],
              },
            ],
          })),
        },
        { type: "paragraph", content: [{ type: "text", text: "C" }] },
      ],
    });
    const row = editor.state.doc.child(0);
    setPortfolioDndPreview(editor, {
      sourcePosition: row.nodeSize,
      targetPosition: 0,
      edge: "right",
      columnIndex: 1,
      sourceHeight: 180,
    });

    expect(
      editor.view.dom.querySelectorAll(
        ":scope > [data-type='columns'] > .ramzy-dnd-column-slot",
      ),
    ).toHaveLength(1);
    expect(
      editor.view.dom.firstElementChild?.classList.contains(
        "ramzy-dnd-preview-row",
      ),
    ).toBe(true);
  });

  it("clears all temporary layout decorations without changing the document", () => {
    editor = createEditor({
      type: "doc",
      content: ["A", "B"].map((text) => ({
        type: "paragraph",
        content: [{ type: "text", text }],
      })),
    });
    const before = editor.getJSON();
    setPortfolioDndPreview(editor, {
      sourcePosition: editor.state.doc.child(0).nodeSize,
      targetPosition: 0,
      edge: "bottom",
      columnIndex: null,
      sourceHeight: 90,
    });
    setPortfolioDndPreview(editor, null);

    expect(editor.getJSON()).toEqual(before);
    expect(editor.view.dom.querySelector(".ramzy-dnd-row-slot")).toBeNull();
    expect(editor.view.dom.querySelector(".ramzy-dnd-source")).toBeNull();
  });
});
