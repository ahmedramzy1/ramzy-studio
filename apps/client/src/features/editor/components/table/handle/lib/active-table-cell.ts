import type { Editor } from "@tiptap/react";
import { isEditorReady } from "@docmost/editor-ext";
import { Extension } from "@tiptap/core";
import {
  Plugin,
  PluginKey,
  TextSelection,
  type EditorState,
} from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { cellAround, CellSelection, TableMap } from "@tiptap/pm/tables";

/** Selection owns the cell menu; pointer hover owns the row/column controls. */
export function activeTableCell(state: EditorState) {
  const selection = state.selection;
  const $cell =
    selection instanceof CellSelection
      ? selection.$headCell
      : cellAround(selection.$head);
  if (!$cell) return null;
  const tableNode = $cell.node(-1);
  const tablePos = $cell.before(-1);
  const map = TableMap.get(tableNode);
  const rect = map.findCell($cell.pos - tablePos - 1);
  const range =
    selection instanceof CellSelection
      ? map.rectBetween(
          selection.$anchorCell.pos - tablePos - 1,
          selection.$headCell.pos - tablePos - 1,
        )
      : rect;
  return {
    rowSelected:
      selection instanceof CellSelection && selection.isRowSelection(),
    colSelected:
      selection instanceof CellSelection && selection.isColSelection(),
    range,
    cellPos: $cell.pos,
    tableNode,
    tablePos,
    rowIndex: rect.top,
    colIndex: rect.left,
  };
}

export const PortfolioTableCellFocus = Extension.create({
  name: "portfolioTableCellFocus",
  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        key: new PluginKey("portfolioTableCellFocus"),
        props: {
          decorations(state) {
            if (
              !editor.options.editable ||
              state.selection instanceof CellSelection
            )
              return null;
            const active = activeTableCell(state);
            const node = active && state.doc.nodeAt(active.cellPos);
            return active && node
              ? DecorationSet.create(state.doc, [
                  Decoration.node(
                    active.cellPos,
                    active.cellPos + node.nodeSize,
                    { class: "ramzy-active-table-cell" },
                  ),
                ])
              : null;
          },
        },
      }),
    ];
  },
});

export function prepareTableCellMenu(editor: Editor, cellPos: number) {
  if (!isEditorReady(editor)) return;
  const current = editor.state.selection;
  let preserve = activeTableCell(editor.state)?.cellPos === cellPos;
  if (current instanceof CellSelection)
    current.forEachCell((_node, pos) => {
      if (pos === cellPos) preserve = true;
    });
  if (!preserve) {
    const node = editor.state.doc.nodeAt(cellPos);
    if (!["cell", "header_cell"].includes(node?.type.spec.tableRole ?? ""))
      return;
    editor.view.dispatch(
      editor.state.tr.setSelection(
        TextSelection.near(editor.state.doc.resolve(cellPos + 1)),
      ),
    );
  }
  editor.commands.freezeHandles();
}
