// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MantineProvider, Menu } from "@mantine/core";
import { Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import { UndoRedo } from "@tiptap/extensions";
import { Table, TableRow } from "@tiptap/extension-table";
import { CellSelection, TableMap } from "@tiptap/pm/tables";
import { TableCell, TableHeader } from "@docmost/editor-ext";
import { currentCellAlignment, setCellAlignment } from "./lib/cell-alignment";
import { AlignmentSubmenu } from "./menus/alignment-submenu";

const editors: Editor[] = [];
function create(
  content:
    | string
    | object = '<table><tr><th><p>Header</p><p style="text-align:right">Second</p></th><td><p>Neighbour</p></td></tr><tr><td colspan="2"><p>Merged</p></td></tr></table>',
) {
  const editor = new Editor({
    element: document.createElement("div"),
    editorProps: { handleScrollToSelection: () => true },
    extensions: [
      Document,
      Paragraph,
      Text,
      TextAlign.configure({ types: ["paragraph"] }),
      Table,
      TableRow,
      TableCell.extend({ content: "paragraph+" }),
      TableHeader.extend({ content: "paragraph+" }),
      UndoRedo,
    ],
    content,
  });
  document.body.append(editor.view.dom);
  editors.push(editor);
  return editor;
}
function positions(e: Editor) {
  return [...new Set(TableMap.get(e.state.doc.firstChild!).map)].map(
    (p) => p + 1,
  );
}
beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
});
afterEach(() => {
  cleanup();
  editors.splice(0).forEach((e) => e.destroy());
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

it("aligns all active-cell paragraphs, preserves neighbour/selection and undoes in one step", async () => {
  const e = create();
  await waitFor(() => expect(e.isInitialized).toBe(true));
  const [a, b] = positions(e);
  e.commands.setTextSelection(a + 2);
  const before = e.getJSON(),
    selection = e.state.selection.toJSON();
  expect(setCellAlignment(e, "textAlign", "center")).toBe(true);
  expect(e.state.doc.nodeAt(a)!.attrs.textAlign).toBe("center");
  expect(e.state.doc.nodeAt(a)!.child(1).attrs.textAlign).toBeNull();
  expect(e.state.doc.nodeAt(b)!.attrs.textAlign).toBeNull();
  expect(e.state.selection.toJSON()).toEqual(selection);
  expect(e.view.dom.querySelector("th")!.style.textAlign).toBe("center");
  e.commands.undo();
  expect(e.getJSON()).toEqual(before);
});
it("formats a selected range including a merged cell without changing its shape or selection", async () => {
  const e = create();
  await waitFor(() => expect(e.isInitialized).toBe(true));
  const [a, , c] = positions(e);
  e.view.dispatch(
    e.state.tr.setSelection(CellSelection.create(e.state.doc, a, c)),
  );
  const selection = e.state.selection.toJSON();
  setCellAlignment(e, "verticalAlign", "bottom");
  setCellAlignment(e, "textAlign", "right");
  positions(e).forEach((p) =>
    expect(e.state.doc.nodeAt(p)!.attrs).toMatchObject({
      verticalAlign: "bottom",
      textAlign: "right",
    }),
  );
  expect(e.state.doc.nodeAt(c)!.attrs.colspan).toBe(2);
  expect(e.state.selection.toJSON()).toEqual(selection);
});
it("preserves header/body alignment in JSON reload and readonly HTML round trip", async () => {
  const e = create();
  await waitFor(() => expect(e.isInitialized).toBe(true));
  const [a, b] = positions(e);
  e.commands.setTextSelection(a + 2);
  setCellAlignment(e, "verticalAlign", "middle");
  setCellAlignment(e, "textAlign", "center");
  e.commands.setTextSelection(b + 2);
  setCellAlignment(e, "verticalAlign", "bottom");
  for (const content of [e.getJSON(), e.getHTML()]) {
    const restored = create(content);
    restored.setEditable(false);
    expect(restored.view.dom.querySelector("th")!.style.verticalAlign).toBe(
      "middle",
    );
    expect(restored.view.dom.querySelector("th")!.style.textAlign).toBe(
      "center",
    );
    expect(restored.view.dom.querySelector("td")!.style.verticalAlign).toBe(
      "bottom",
    );
  }
});
it("reports default/mixed alignment and refuses invalid, readonly and non-cell requests", async () => {
  const e = create();
  await waitFor(() => expect(e.isInitialized).toBe(true));
  const [a, b] = positions(e);
  e.commands.setTextSelection(a + 2);
  expect(currentCellAlignment(e.state, "verticalAlign")).toBe("top");
  expect(setCellAlignment(e, "verticalAlign", "bogus")).toBe(false);
  setCellAlignment(e, "verticalAlign", "middle");
  e.view.dispatch(
    e.state.tr.setSelection(CellSelection.create(e.state.doc, a, b)),
  );
  expect(currentCellAlignment(e.state, "verticalAlign")).toBeNull();
  e.setEditable(false);
  const before = e.getJSON();
  expect(setCellAlignment(e, "verticalAlign", "bottom")).toBe(false);
  expect(e.getJSON()).toEqual(before);
  const other = create("<p>Outside</p>");
  await waitFor(() => expect(other.isInitialized).toBe(true));
  expect(setCellAlignment(other, "textAlign", "center")).toBe(false);
});
it("rejects unsupported HTML alignment", () => {
  const e = create(
    '<table><tr><td style="vertical-align:baseline;text-align:match-parent"><p>A</p></td></tr></table>',
  );
  expect(e.state.doc.firstChild!.firstChild!.firstChild!.attrs).toMatchObject({
    verticalAlign: null,
    textAlign: null,
  });
});
it.each([
  ["Horizontal alignment", "Align center", "textAlign", "center"],
  ["Vertical alignment", "Align middle", "verticalAlign", "middle"],
])(
  "exposes %s in the actual menu and applies its choice",
  async (label, choice, attr, value) => {
    const e = create();
    await waitFor(() => expect(e.isInitialized).toBe(true));
    const [a] = positions(e);
    e.commands.setTextSelection(a + 2);
    render(
      <MantineProvider>
        <Menu opened>
          <Menu.Target>
            <button>Cell actions</button>
          </Menu.Target>
          <Menu.Dropdown>
            <AlignmentSubmenu editor={e} />
          </Menu.Dropdown>
        </Menu>
      </MantineProvider>,
    );
    fireEvent.click(screen.getByRole("menuitem", { name: label }));
    await waitFor(() => expect(screen.getByText(choice)).toBeTruthy());
    act(() => fireEvent.click(screen.getByText(choice)));
    expect(e.state.doc.nodeAt(a)!.attrs[attr]).toBe(value);
  },
);
