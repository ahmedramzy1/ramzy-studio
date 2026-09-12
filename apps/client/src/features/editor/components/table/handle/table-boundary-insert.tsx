import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Editor } from "@tiptap/react";
import type { Node } from "@tiptap/pm/model";
import { TextSelection } from "@tiptap/pm/state";
import {
  addRow,
  addColumn,
  TableMap,
  columnResizingPluginKey,
} from "@tiptap/pm/tables";
import { isEditorReady, TableDndKey } from "@docmost/editor-ext";
import classes from "./handle.module.css";

export interface TableBoundary {
  axis: "row" | "col";
  index: number;
  tablePos: number;
  tableNode: Node;
  x: number;
  y: number;
  length: number;
}

/** Resolve insertion from the live table map; one transaction is one undo step. */
export function insertTableBoundary(editor: Editor, target: TableBoundary) {
  if (!isEditorReady(editor) || !editor.isEditable) return false;
  const table = editor.state.doc.nodeAt(target.tablePos);
  if (table !== target.tableNode || table?.type.spec.tableRole !== "table")
    return false;
  const map = TableMap.get(table);
  const count = target.axis === "row" ? map.height : map.width;
  if (target.index < 0 || target.index > count) return false;
  const tr = editor.state.tr;
  const rect = {
    map,
    table,
    tableStart: target.tablePos + 1,
    left: 0,
    top: 0,
    right: map.width,
    bottom: map.height,
  };
  if (target.axis === "row") addRow(tr, rect, target.index);
  else addColumn(tr, rect, target.index);
  const updated = tr.doc.nodeAt(target.tablePos)!;
  const next = TableMap.get(updated);
  // Prefer a new cell in this lane; a spanning cell may cover the first slot.
  const offsets =
    target.axis === "row"
      ? next.map.slice(
          target.index * next.width,
          (target.index + 1) * next.width,
        )
      : Array.from(
          { length: next.height },
          (_, row) => next.map[row * next.width + target.index],
        );
  const cell =
    offsets.find((pos) => {
      const box = next.findCell(pos);
      return target.axis === "row"
        ? box.top === target.index
        : box.left === target.index;
    }) ?? offsets[0];
  tr.setSelection(
    TextSelection.near(tr.doc.resolve(target.tablePos + 2 + cell)),
  );
  editor.view.dispatch(tr.scrollIntoView());
  editor.view.focus();
  return true;
}

export function TableBoundaryInsert({ editor }: { editor: Editor }) {
  const [target, setTarget] = useState<TableBoundary | null>(null);
  useEffect(() => {
    let frame: number | null = null;
    let point: { x: number; y: number; target: EventTarget | null } | null =
      null;
    const clear = () => {
      point = null;
      setTarget(null);
    };
    const update = () => {
      if (!isEditorReady(editor) || !editor.isEditable) {
        setTarget(null);
        return;
      }
      const state = TableDndKey.getState(editor.state);
      const resizing = columnResizingPluginKey.getState(editor.state);
      if (state?.dragging || state?.frozen || resizing?.dragging) {
        setTarget(null);
        return;
      }
      if (!point) {
        setTarget(null);
        return;
      }
      if (
        point.target instanceof Element &&
        point.target.closest("[data-table-boundary-insert]")
      ) {
        setTarget((old) =>
          old && editor.state.doc.nodeAt(old.tablePos) === old.tableNode
            ? old
            : null,
        );
        return;
      }
      const hovered = state?.hoveringCell;
      const dom = hovered ? editor.view.nodeDOM(hovered.cellPos) : null;
      const table = dom instanceof HTMLElement ? dom.closest("table") : null;
      if (!table || !state?.tableNode || state.tablePos == null) {
        setTarget(null);
        return;
      }
      const liveTable = editor.state.doc.nodeAt(state.tablePos);
      if (liveTable?.type.spec.tableRole !== "table") {
        setTarget(null);
        return;
      }
      const rect = table.getBoundingClientRect();
      const map = TableMap.get(liveTable);
      let next: TableBoundary | null = null;
      // Row insertion is reached from the left perimeter, column insertion from the top.
      for (const axis of ["row", "col"] as const) {
        const near =
          axis === "row"
            ? point.x >= rect.left - 20 && point.x <= rect.left + 6
            : point.y >= rect.top - 20 && point.y <= rect.top + 6;
        if (!near) continue;
        const count = axis === "row" ? map.height : map.width;
        for (let index = 0; index <= count; index++) {
          const pos =
            map.map[
              axis === "row"
                ? Math.min(index, count - 1) * map.width
                : Math.min(index, count - 1)
            ];
          const cell = editor.view.nodeDOM(state.tablePos + 1 + pos);
          if (!(cell instanceof HTMLElement)) continue;
          const cellRect = cell.getBoundingClientRect();
          // Merged cells may span multiple lanes; interpolate the actual table grid.
          const cellNode = liveTable.nodeAt(pos);
          const span =
            axis === "row"
              ? cellNode?.attrs.rowspan || 1
              : cellNode?.attrs.colspan || 1;
          const cellBox = map.findCell(pos);
          const lane = index - (axis === "row" ? cellBox.top : cellBox.left);
          const rowRect =
            table.rows[
              Math.min(index, map.height - 1)
            ]?.getBoundingClientRect();
          const columnRect = table
            .querySelectorAll("colgroup > col")
            [Math.min(index, map.width - 1)]?.getBoundingClientRect();
          const edge =
            axis === "row" && rowRect && rowRect.height > 0
              ? index === map.height
                ? rowRect.bottom
                : rowRect.top
              : axis === "col" && columnRect && columnRect.width > 0
                ? index === map.width
                  ? columnRect.right
                  : columnRect.left
                : axis === "row"
                  ? cellRect.top + (cellRect.height * lane) / span
                  : cellRect.left + (cellRect.width * lane) / span;
          if (Math.abs((axis === "row" ? point.y : point.x) - edge) > 6)
            continue;
          next = {
            axis,
            index,
            tablePos: state.tablePos,
            tableNode: liveTable,
            x: axis === "row" ? rect.left : edge,
            y: axis === "row" ? edge : rect.top,
            length: axis === "row" ? rect.width : rect.height,
          };
          break;
        }
        if (next) break;
      }
      setTarget((old) =>
        old?.axis === next?.axis &&
        old?.index === next?.index &&
        old?.tableNode === next?.tableNode &&
        old?.x === next?.x &&
        old?.y === next?.y &&
        old?.length === next?.length
          ? old
          : next,
      );
    };
    const schedule = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = null;
        update();
      });
    };
    const pointer = (event: PointerEvent) => {
      point = { x: event.clientX, y: event.clientY, target: event.target };
      update();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") clear();
    };
    document.addEventListener("pointermove", pointer);
    document.addEventListener("keydown", key);
    window.addEventListener("scroll", clear, true);
    window.addEventListener("resize", clear);
    window.addEventListener("blur", clear);
    editor.on("transaction", schedule);
    return () => {
      document.removeEventListener("pointermove", pointer);
      document.removeEventListener("keydown", key);
      window.removeEventListener("scroll", clear, true);
      window.removeEventListener("resize", clear);
      window.removeEventListener("blur", clear);
      editor.off("transaction", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [editor]);
  if (!target) return null;
  const row = target.axis === "row";
  return createPortal(
    <div data-table-boundary-insert>
      <div
        className={classes.insertGuide}
        style={{
          left: target.x,
          top: target.y,
          width: row ? target.length : 2,
          height: row ? 2 : target.length,
        }}
      />
      <button
        type="button"
        className={classes.insertBoundary}
        style={{
          left: target.x - (row ? 10 : 0),
          top: target.y - (row ? 0 : 10),
        }}
        aria-label={`Insert ${row ? "row" : "column"} ${target.index + 1}`}
        title={`Insert ${row ? "row" : "column"}`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          insertTableBoundary(editor, target);
          setTarget(null);
        }}
      >
        +
      </button>
    </div>,
    document.body,
  );
}
