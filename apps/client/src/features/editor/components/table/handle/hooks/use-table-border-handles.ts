import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import { isEditorReady, TableDndKey } from "@docmost/editor-ext";

const HIDDEN = { row: false, col: false };
const BOTH = { row: true, col: true };
const BORDER_ZONE = 8;

/** Only the perimeter of a row/column reveals its grip; cell contents stay quiet. */
export function useTableBorderHandles(editor: Editor | null, enabled: boolean) {
  const [visible, setVisible] = useState(HIDDEN);

  useEffect(() => {
    if (!editor || !enabled) return;
    let point: { x: number; y: number; target: EventTarget | null } | null =
      null;
    let frame: number | null = null;
    const update = () => {
      if (!isEditorReady(editor)) return;
      const state = TableDndKey.getState(editor.state);
      if (state?.dragging || state?.frozen) return;
      const root = editor.view.dom;
      const host = root.closest(".editor-container") ?? root.parentElement;
      const onHandle = (target: EventTarget | null) =>
        target instanceof Element &&
        host?.contains(target) &&
        !!target.closest("[data-ramzy-table-handle]");
      // Handles stay mounted: hiding/unmounting a native drag source cancels DnD.
      if (onHandle(document.activeElement) || onHandle(point?.target ?? null))
        return;
      let next = HIDDEN;
      const cell = state?.hoveringCell;
      if (point && cell && editor.isEditable) {
        const rowCell = editor.view.nodeDOM(cell.rowFirstCellPos);
        const colCell = editor.view.nodeDOM(cell.colFirstCellPos);
        if (rowCell instanceof HTMLElement && colCell instanceof HTMLElement) {
          const row = rowCell.getBoundingClientRect();
          const col = colCell.getBoundingClientRect();
          // Include the floating grip and the small border-to-grip crossing.
          next = {
            row:
              point.x >= row.left - 20 &&
              point.x <= row.left + BORDER_ZONE &&
              point.y >= row.top &&
              point.y <= row.bottom,
            col:
              point.y >= col.top - 20 &&
              point.y <= col.top + BORDER_ZONE &&
              point.x >= col.left &&
              point.x <= col.right,
          };
        }
      }
      setVisible((old) =>
        old.row === next.row && old.col === next.col ? old : next,
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
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        point = null;
        update();
      }
    };
    const reposition = () => {
      // A stale event target must not keep a grip lit after the page scrolls.
      if (point) point.target = null;
      schedule();
    };
    document.addEventListener("pointermove", pointer);
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("pointerout", leave);
    document.addEventListener("focusout", schedule);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    editor.on("transaction", schedule);
    return () => {
      document.removeEventListener("pointermove", pointer);
      document.removeEventListener("pointerdown", pointer);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("focusout", schedule);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      editor.off("transaction", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [editor, enabled]);

  return enabled ? visible : BOTH;
}
