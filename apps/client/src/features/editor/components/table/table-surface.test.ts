// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { UndoRedo } from "@tiptap/extensions";
import { TableRow } from "@tiptap/extension-table";
import { CustomTable, TableCell, TableHeader, TableView } from "@docmost/editor-ext";

const editors: Editor[] = [];
function create(content: string | object, editable = true) {
  const e = new Editor({
    element: document.createElement("div"), editable,
    editorProps: { handleScrollToSelection: () => true },
    extensions: [Document, Paragraph, Text, UndoRedo,
      CustomTable.configure({ resizable: true, View: TableView }), TableRow,
      TableCell.extend({ content: "paragraph+" }),
      TableHeader.extend({ content: "paragraph+" })],
    content,
  });
  editors.push(e);
  return e;
}
afterEach(() => editors.splice(0).forEach(e => e.destroy()));
function edge(e: Editor, name: string) {
  return [...e.view.dom.querySelectorAll(`[data-table-edge~="${name}"]`)]
    .map(cell => cell.textContent);
}
const merged = '<table><tr><th rowspan="2"><p>Left</p></th><th><p>Top</p></th><th rowspan="2"><p>Right</p></th></tr><tr><td><p>Middle</p></td></tr></table>';
it("rounds the actual corner owners through rowspans, in editable and readonly views", () => {
  for (const editable of [true, false]) {
    const e = create(merged, editable);
    expect(e.view.dom.querySelector(".ramzy-rounded-table > table")).not.toBeNull();
    expect(edge(e, "top-left")).toEqual(["Left"]);
    expect(edge(e, "bottom-left")).toEqual(["Left"]);
    expect(edge(e, "top-right")).toEqual(["Right"]);
    expect(edge(e, "bottom-right")).toEqual(["Right"]);
    expect(edge(e, "right")).toEqual(["Right"]);
    expect(edge(e, "bottom")).toEqual(["Left", "Right", "Middle"]);
    expect(e.getJSON()).toEqual(create(e.getHTML(), editable).getJSON());
    expect(JSON.stringify(e.getJSON())).not.toContain("data-table-edge");
  }
});
it("gives a single merged cell all four corners and keeps separate tables independent", () => {
  const e = create('<table><tr><td colspan="2"><p>Only</p></td></tr></table><p>Between</p>'+merged);
  for (const corner of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
    expect(edge(e, corner)[0]).toBe("Only");
  }
  expect(e.view.dom.querySelectorAll(".ramzy-rounded-table")).toHaveLength(2);
});
it("recomputes edges after structural edits and undo without persisting styling in the document", () => {
  const e = create('<table><tr><td><p>A</p></td><td><p>B</p></td></tr><tr><td><p>C</p></td><td><p>D</p></td></tr></table>');
  e.commands.setTextSelection(4);
  const before = e.getJSON();
  e.commands.addRowBefore();
  expect(edge(e, "top-left")).toEqual([""]);
  expect(edge(e, "bottom-left")).toEqual(["C"]);
  e.commands.undo();
  expect(e.getJSON()).toEqual(before);
  expect(edge(e, "top-left")).toEqual(["A"]);
  e.commands.addColumnBefore();
  expect(edge(e, "top-left")).toEqual([""]);
  expect(edge(e, "top-right")).toEqual(["B"]);
  e.commands.undo();
  expect(e.getJSON()).toEqual(before);
});
