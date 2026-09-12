import React, { useCallback, useSyncExternalStore } from "react";
import type { Editor } from "@tiptap/react";
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
  const state = useTableHandleState(editor);
  const visible = useTableBorderHandles(editor, borderOnly);

  if (!editor || !editable) return null;
  if (!state.hoveringCell || !state.tableNode || state.tablePos == null)
    return null;

  return (
    <>
      <ColumnHandle
        visible={visible.col}
        editor={editor}
        index={state.hoveringCell.colIndex}
        anchorPos={state.hoveringCell.colFirstCellPos}
        tableNode={state.tableNode!}
        tablePos={state.tablePos!}
      />
      <RowHandle
        visible={visible.row}
        editor={editor}
        index={state.hoveringCell.rowIndex}
        anchorPos={state.hoveringCell.rowFirstCellPos}
        tableNode={state.tableNode!}
        tablePos={state.tablePos!}
      />
      <CellChevron
        editor={editor}
        cellPos={state.hoveringCell.cellPos}
        tableNode={state.tableNode!}
        tablePos={state.tablePos!}
      />
    </>
  );
});
