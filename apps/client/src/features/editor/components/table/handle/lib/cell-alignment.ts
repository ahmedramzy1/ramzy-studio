import type { Editor } from "@tiptap/react";
import type { EditorState } from "@tiptap/pm/state";
import { cellAround, CellSelection } from "@tiptap/pm/tables";
import { isEditorReady } from "@docmost/editor-ext";

export type CellAlignmentAxis = "textAlign" | "verticalAlign";
export const cellAlignmentOptions = {
  textAlign: ["left", "center", "right"],
  verticalAlign: ["top", "middle", "bottom"],
} as const;

function selectedCells(state: EditorState) {
  const cells: number[] = [];
  if (state.selection instanceof CellSelection) {
    state.selection.forEachCell((_node, pos) => cells.push(pos));
  } else {
    const cell = cellAround(state.selection.$head);
    if (cell) cells.push(cell.pos);
  }
  return cells;
}

export function currentCellAlignment(
  state: EditorState,
  axis: CellAlignmentAxis,
) {
  const values: string[] = [];
  for (const pos of selectedCells(state)) {
    const cell = state.doc.nodeAt(pos)!;
    const inherited =
      cell.attrs[axis] ?? (axis === "textAlign" ? "left" : "top");
    if (axis === "textAlign") {
      let found = false;
      cell.descendants((node) => {
        if (["paragraph", "heading"].includes(node.type.name)) {
          values.push(node.attrs.textAlign || inherited);
          found = true;
        }
      });
      if (!found) values.push(inherited);
    } else values.push(inherited);
  }
  return values.length && values.every((value) => value === values[0])
    ? (values[0] as string)
    : null;
}

export function setCellAlignment(
  editor: Editor,
  axis: CellAlignmentAxis,
  value: string,
) {
  if (
    !isEditorReady(editor) ||
    !editor.isEditable ||
    !(cellAlignmentOptions[axis] as readonly string[]).includes(value)
  )
    return false;
  const cells = selectedCells(editor.state);
  if (!cells.length) return false;
  const tr = editor.state.tr;
  for (const pos of cells) {
    const cell = tr.doc.nodeAt(pos)!;
    tr.setNodeMarkup(pos, undefined, { ...cell.attrs, [axis]: value });
    if (axis === "textAlign") {
      // A cell action affects all its paragraphs, including existing explicit
      // paragraph alignment. Later paragraph-only formatting can still override.
      cell.descendants((node, offset) => {
        if (
          ["paragraph", "heading"].includes(node.type.name) &&
          node.attrs.textAlign
        ) {
          tr.setNodeMarkup(pos + 1 + offset, undefined, {
            ...node.attrs,
            textAlign: null,
          });
        }
      });
    }
  }
  editor.view.dispatch(tr);
  editor.view.focus();
  return true;
}
