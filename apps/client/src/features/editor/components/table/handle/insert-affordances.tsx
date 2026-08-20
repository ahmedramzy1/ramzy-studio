import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";
import { IconPlus } from "@tabler/icons-react";
import { isEditorReady } from "@docmost/editor-ext";
import classes from "./handle.module.css";

interface InsertAffordancesProps {
  editor: Editor;
  cellPos: number;
}

type ActiveEdge =
  | {
      kind: "column";
      cellPos: number;
      lineLeft: number;
      lineTop: number;
      lineLength: number;
      buttonLeft: number;
      buttonTop: number;
    }
  | {
      kind: "row";
      cellPos: number;
      lineLeft: number;
      lineTop: number;
      lineLength: number;
      buttonLeft: number;
      buttonTop: number;
    };

const EDGE_DISTANCE = 12;
const OUTSIDE_DISTANCE = 14;
const INSIDE_DISTANCE = 7;
const HIT_TARGET_SIZE = 28;

function getCellPos(editor: Editor, cell: HTMLElement) {
  try {
    // posAtDOM(cell, 0) resolves immediately inside the table cell node.
    return editor.view.posAtDOM(cell, 0) - 1;
  } catch {
    return null;
  }
}

export const InsertAffordances = React.memo(function InsertAffordances({
  editor,
  cellPos,
}: InsertAffordancesProps) {
  const [activeEdge, setActiveEdge] = useState<ActiveEdge | null>(null);
  const frozenByUs = useRef(false);

  const hoveredDom = isEditorReady(editor) ? editor.view.nodeDOM(cellPos) : null;
  const hoveredCell = hoveredDom instanceof HTMLElement ? hoveredDom : null;
  const table = hoveredCell?.closest("table") as HTMLTableElement | null;

  const freeze = useCallback(() => {
    if (!isEditorReady(editor) || frozenByUs.current) return;
    frozenByUs.current = true;
    editor.commands.freezeHandles();
  }, [editor]);

  const unfreeze = useCallback(() => {
    if (!isEditorReady(editor) || !frozenByUs.current) return;
    frozenByUs.current = false;
    editor.commands.unfreezeHandles();
  }, [editor]);

  const clearEdge = useCallback(() => {
    setActiveEdge(null);
    unfreeze();
  }, [unfreeze]);

  useEffect(() => {
    if (!table) {
      clearEdge();
      return;
    }

    const findColumnEdge = (
      clientX: number,
      clientY: number,
      tableRect: DOMRect,
    ): ActiveEdge | null => {
      // Confluence-style interaction: column insertion is acquired from a
      // slim strip around the TOP boundary of the table, not from anywhere
      // inside the hovered cell. This avoids fighting normal cell editing and
      // column resizing.
      if (
        clientY < tableRect.top - OUTSIDE_DISTANCE ||
        clientY > tableRect.top + INSIDE_DISTANCE
      ) {
        return null;
      }

      const firstRow = table.rows.item(0);
      if (!firstRow) return null;

      let nearest:
        | { distance: number; x: number; cell: HTMLTableCellElement }
        | null = null;

      Array.from(firstRow.cells).forEach((cell) => {
        const rect = cell.getBoundingClientRect();
        const distance = Math.abs(clientX - rect.right);
        if (distance > EDGE_DISTANCE) return;
        if (!nearest || distance < nearest.distance) {
          nearest = { distance, x: rect.right, cell };
        }
      });

      if (!nearest) return null;
      const target = nearest as {
        distance: number;
        x: number;
        cell: HTMLTableCellElement;
      };
      const targetPos = getCellPos(editor, target.cell);
      if (targetPos == null) return null;

      return {
        kind: "column",
        cellPos: targetPos,
        lineLeft: target.x,
        lineTop: tableRect.top,
        lineLength: tableRect.height,
        buttonLeft: target.x - HIT_TARGET_SIZE / 2,
        buttonTop: tableRect.top - HIT_TARGET_SIZE / 2,
      };
    };

    const findRowEdge = (
      clientX: number,
      clientY: number,
      tableRect: DOMRect,
    ): ActiveEdge | null => {
      // Row insertion mirrors Confluence on the LEFT boundary: the visual
      // line spans the table, while the generous hit target stays at the edge.
      if (
        clientX < tableRect.left - OUTSIDE_DISTANCE ||
        clientX > tableRect.left + INSIDE_DISTANCE
      ) {
        return null;
      }

      let nearest:
        | { distance: number; y: number; cell: HTMLTableCellElement }
        | null = null;

      Array.from(table.rows).forEach((row) => {
        const firstCell = row.cells.item(0);
        if (!firstCell) return;
        const rect = row.getBoundingClientRect();
        const distance = Math.abs(clientY - rect.bottom);
        if (distance > EDGE_DISTANCE) return;
        if (!nearest || distance < nearest.distance) {
          nearest = { distance, y: rect.bottom, cell: firstCell };
        }
      });

      if (!nearest) return null;
      const target = nearest as {
        distance: number;
        y: number;
        cell: HTMLTableCellElement;
      };
      const targetPos = getCellPos(editor, target.cell);
      if (targetPos == null) return null;

      return {
        kind: "row",
        cellPos: targetPos,
        lineLeft: tableRect.left,
        lineTop: target.y,
        lineLength: tableRect.width,
        buttonLeft: tableRect.left - HIT_TARGET_SIZE / 2,
        buttonTop: target.y - HIT_TARGET_SIZE / 2,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isEditorReady(editor)) return;

      const tableRect = table.getBoundingClientRect();
      const columnEdge = findColumnEdge(event.clientX, event.clientY, tableRect);
      const rowEdge = findRowEdge(event.clientX, event.clientY, tableRect);

      const next = columnEdge ?? rowEdge;
      if (next) {
        freeze();
        setActiveEdge(next);
        return;
      }

      clearEdge();
    };

    document.addEventListener("pointermove", onPointerMove, true);
    return () => {
      document.removeEventListener("pointermove", onPointerMove, true);
      if (frozenByUs.current && isEditorReady(editor)) {
        frozenByUs.current = false;
        editor.commands.unfreezeHandles();
      }
    };
  }, [editor, table, freeze, clearEdge]);

  const insertAtEdge = useCallback(() => {
    if (!activeEdge || !isEditorReady(editor)) return;

    try {
      const $inside = editor.state.doc.resolve(activeEdge.cellPos + 1);
      const selection = TextSelection.near($inside, 1);
      editor.view.dispatch(editor.state.tr.setSelection(selection));

      if (activeEdge.kind === "column") {
        editor.chain().focus().addColumnAfter().run();
      } else {
        editor.chain().focus().addRowAfter().run();
      }
    } finally {
      clearEdge();
    }
  }, [activeEdge, editor, clearEdge]);

  if (!activeEdge) return null;

  const isColumn = activeEdge.kind === "column";

  return (
    <>
      <div
        className={classes.insertEdgeLine}
        aria-hidden="true"
        style={
          isColumn
            ? {
                position: "fixed",
                left: activeEdge.lineLeft,
                top: activeEdge.lineTop,
                height: activeEdge.lineLength,
                width: 2,
              }
            : {
                position: "fixed",
                left: activeEdge.lineLeft,
                top: activeEdge.lineTop,
                width: activeEdge.lineLength,
                height: 2,
              }
        }
      />

      <button
        type="button"
        className={classes.insertEdgeHitTarget}
        aria-label={isColumn ? "Insert column" : "Insert row"}
        title={isColumn ? "Insert column" : "Insert row"}
        style={{
          position: "fixed",
          left: activeEdge.buttonLeft,
          top: activeEdge.buttonTop,
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          insertAtEdge();
        }}
      >
        <span className={classes.insertEdgeButton}>
          <IconPlus size={13} stroke={2.5} />
        </span>
      </button>
    </>
  );
});
