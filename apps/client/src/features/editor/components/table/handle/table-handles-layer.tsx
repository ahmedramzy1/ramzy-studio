import React, { useCallback, useSyncExternalStore } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import { activeTableCell } from "./lib/active-table-cell";
import { TableBoundaryInsert } from "./table-boundary-insert";
import { useTableHandleState } from "./hooks/use-table-handle-state";
import { ColumnHandle } from "./column-handle";
import { RowHandle } from "./row-handle";
import { useTableBorderHandles } from "./hooks/use-table-border-handles";
import { CellChevron } from "./cell-chevron";

interface TableHandlesLayerProps {
  editor: Editor | null;
  borderOnly?: boolean;
}

export const TableHandlesLayer = React.memo(function TableHandlesLayer({
  editor,
  borderOnly = false,
}: TableHandlesLayerProps) {
  const subscribe = useCallback(
    (notify: () => void) => {
      editor?.on("update", notify);
      return () => {
        editor?.off("update", notify);
      };
    },
    [editor],
  );
  const editable = useSyncExternalStore(
    subscribe,
    () => !!editor?.options.editable,
    () => false,
  );
  const active = useEditorState({
    editor,
    selector: ({ editor }) => (editor ? activeTableCell(editor.state) : null),
  });
  const state = useTableHandleState(editor);
  const visible = useTableBorderHandles(editor, borderOnly);

  if (!editor || !editable) return null;
  if (!state.hoveringCell || !state.tableNode || state.tablePos == null)
    return null;

  const hoverTable = editor.state.doc.nodeAt(state.tablePos);
  if (hoverTable?.type.spec.tableRole !== "table") return null;

  return (
    <>
      <ColumnHandle
        portfolio={borderOnly}
        selected={
          !!active?.colSelected &&
          active.tablePos === state.tablePos &&
          state.hoveringCell.colIndex >= active.range.left &&
          state.hoveringCell.colIndex < active.range.right
        }
        quiet={borderOnly && active?.tablePos === state.tablePos}
        visible={visible.col}
        editor={editor}
        index={state.hoveringCell.colIndex}
        anchorPos={state.hoveringCell.colFirstCellPos}
        tableNode={hoverTable}
        tablePos={state.tablePos!}
      />
      <RowHandle
        portfolio={borderOnly}
        selected={
          !!active?.rowSelected &&
          active.tablePos === state.tablePos &&
          state.hoveringCell.rowIndex >= active.range.top &&
          state.hoveringCell.rowIndex < active.range.bottom
        }
        quiet={borderOnly && active?.tablePos === state.tablePos}
        visible={visible.row}
        editor={editor}
        index={state.hoveringCell.rowIndex}
        anchorPos={state.hoveringCell.rowFirstCellPos}
        tableNode={hoverTable}
        tablePos={state.tablePos!}
      />
      {(!borderOnly || active) && (
        <CellChevron
          editor={editor}
          cellPos={
            borderOnly && active ? active.cellPos : state.hoveringCell.cellPos
          }
          tableNode={borderOnly && active ? active.tableNode : hoverTable}
          tablePos={borderOnly && active ? active.tablePos : state.tablePos!}
        />
      )}
      {borderOnly && <TableBoundaryInsert editor={editor} />}
    </>
  );
});
