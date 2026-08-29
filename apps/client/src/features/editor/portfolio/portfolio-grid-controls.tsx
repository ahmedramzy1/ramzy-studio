import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Editor } from "@tiptap/core";
import {
  nearestPortfolioGridWidthMode,
  portfolioGridModeLabel,
  resizedColumnWeights,
  type PortfolioGridWidthMode,
} from "./portfolio-grid-resize";

type ActiveGrid = {
  element: HTMLElement;
  position: number;
};

type HandleGeometry = {
  left: number;
  top: number;
  height: number;
};

type GridGeometry = {
  outer: [HandleGeometry, HandleGeometry];
  dividers: HandleGeometry[];
  badge: { left: number; top: number };
};

function topLevelPosition(editor: Editor, element: HTMLElement): number | null {
  try {
    const position = editor.view.posAtDOM(element, 0);
    return editor.state.doc.nodeAt(position)?.type.name === "columns"
      ? position
      : null;
  } catch {
    return null;
  }
}

function measureGrid(element: HTMLElement): GridGeometry | null {
  if (!element.isConnected) return null;
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  const columns = Array.from(element.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.dataset.type === "column",
  );
  const dividers = columns.slice(0, -1).map((column, index) => {
    const leftRect = column.getBoundingClientRect();
    const rightRect = columns[index + 1].getBoundingClientRect();
    return {
      left: (leftRect.right + rightRect.left) / 2 - 9,
      top: rect.top,
      height: rect.height,
    };
  });
  return {
    outer: [
      { left: rect.left - 9, top: rect.top, height: rect.height },
      { left: rect.right - 9, top: rect.top, height: rect.height },
    ],
    dividers,
    badge: { left: rect.left + rect.width / 2, top: rect.bottom + 8 },
  };
}

function setColumnWidths(
  editor: Editor,
  rowPosition: number,
  weights: number[],
) {
  const row = editor.state.doc.nodeAt(rowPosition);
  if (
    !row ||
    row.type.name !== "columns" ||
    row.childCount !== weights.length
  ) {
    return;
  }
  const tr = editor.state.tr;
  let columnPosition = rowPosition + 1;
  row.forEach((column, _offset, index) => {
    tr.setNodeMarkup(columnPosition, undefined, {
      ...column.attrs,
      width: weights[index],
    });
    columnPosition += column.nodeSize;
  });
  editor.view.dispatch(tr);
}

function setRowWidthMode(
  editor: Editor,
  rowPosition: number,
  widthMode: PortfolioGridWidthMode,
) {
  const row = editor.state.doc.nodeAt(rowPosition);
  if (!row || row.type.name !== "columns") return;
  editor.view.dispatch(
    editor.state.tr.setNodeMarkup(rowPosition, undefined, {
      ...row.attrs,
      widthMode,
    }),
  );
}

export function PortfolioGridControls({ editor }: { editor: Editor }) {
  const [active, setActive] = useState<ActiveGrid | null>(null);
  const [geometry, setGeometry] = useState<GridGeometry | null>(null);
  const [widthLabel, setWidthLabel] = useState<string | null>(null);
  const resizeCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (editor.isDestroyed || !editor.isEditable) return;
    const editorDom = editor.view.dom;

    const activateFromTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) {
        setActive(null);
        return;
      }
      const element = target.closest<HTMLElement>('[data-type="columns"]');
      if (!element || !editorDom.contains(element)) {
        setActive(null);
        return;
      }
      const position = topLevelPosition(editor, element);
      if (position === null) return;
      setActive((current) =>
        current?.element === element && current.position === position
          ? current
          : { element, position },
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!resizeCleanupRef.current) activateFromTarget(event.target);
    };
    const onFocus = () => {
      const selection = window.getSelection();
      activateFromTarget(selection?.anchorNode?.parentElement ?? null);
    };
    editorDom.addEventListener("pointermove", onPointerMove, true);
    editorDom.addEventListener("focusin", onFocus, true);
    return () => {
      editorDom.removeEventListener("pointermove", onPointerMove, true);
      editorDom.removeEventListener("focusin", onFocus, true);
      resizeCleanupRef.current?.();
    };
  }, [editor]);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = measureGrid(active.element);
        setGeometry(next);
        if (!next) setActive(null);
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(active.element);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    editor.on("update", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
      editor.off("update", measure);
    };
  }, [active, editor]);

  const beginColumnResize = (
    event: React.PointerEvent,
    dividerIndex: number,
  ) => {
    if (!active) return;
    event.preventDefault();
    event.stopPropagation();
    const columns = Array.from(active.element.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && child.dataset.type === "column",
    );
    const startWidths = columns.map(
      (column) => column.getBoundingClientRect().width,
    );
    const startX = event.clientX;

    const onMove = (moveEvent: PointerEvent) => {
      const weights = resizedColumnWeights(
        startWidths,
        dividerIndex,
        moveEvent.clientX - startX,
      );
      columns.forEach((column, index) => {
        column.style.flex = String(weights[index]);
      });
    };
    const finish = (upEvent: PointerEvent) => {
      const weights = resizedColumnWeights(
        startWidths,
        dividerIndex,
        upEvent.clientX - startX,
      );
      cleanup();
      setColumnWidths(editor, active.position, weights);
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", finish, true);
      window.removeEventListener("pointercancel", finish, true);
      resizeCleanupRef.current = null;
    };
    resizeCleanupRef.current = cleanup;
    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerup", finish, true);
    window.addEventListener("pointercancel", finish, true);
  };

  const beginRowResize = (
    event: React.PointerEvent,
    side: "left" | "right",
  ) => {
    if (!active) return;
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = active.element.getBoundingClientRect().width;
    const editorWidth = editor.view.dom.getBoundingClientRect().width;
    const available = Math.max(editorWidth, window.innerWidth - 96);
    const widths: Record<PortfolioGridWidthMode, number> = {
      normal: editorWidth,
      wide: Math.min(1120, Math.max(editorWidth, window.innerWidth - 352)),
      full: Math.min(1440, available),
    };
    let nextMode = (active.element.dataset.widthMode ||
      "normal") as PortfolioGridWidthMode;
    setWidthLabel(portfolioGridModeLabel(nextMode));

    const onMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX;
      const desired = startWidth + (side === "right" ? delta * 2 : -delta * 2);
      nextMode = nearestPortfolioGridWidthMode(desired, widths);
      if (nextMode === "normal") delete active.element.dataset.widthMode;
      else active.element.dataset.widthMode = nextMode;
      setWidthLabel(portfolioGridModeLabel(nextMode));
    };
    const finish = () => {
      cleanup();
      setWidthLabel(null);
      setRowWidthMode(editor, active.position, nextMode);
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", finish, true);
      window.removeEventListener("pointercancel", finish, true);
      resizeCleanupRef.current = null;
    };
    resizeCleanupRef.current = cleanup;
    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerup", finish, true);
    window.addEventListener("pointercancel", finish, true);
  };

  if (!active || !geometry) return null;

  return createPortal(
    <div className="ramzy-grid-resize-layer" aria-hidden="true">
      {geometry.outer.map((handle, index) => (
        <div
          key={index === 0 ? "outer-left" : "outer-right"}
          className="ramzy-grid-resize-handle"
          data-kind="outer"
          title="Drag to change row width"
          style={{ left: handle.left, top: handle.top, height: handle.height }}
          onPointerDown={(event) =>
            beginRowResize(event, index === 0 ? "left" : "right")
          }
        />
      ))}
      {geometry.dividers.map((handle, index) => (
        <div
          key={`divider-${index}`}
          className="ramzy-grid-resize-handle"
          data-kind="divider"
          title="Drag to resize columns"
          style={{ left: handle.left, top: handle.top, height: handle.height }}
          onPointerDown={(event) => beginColumnResize(event, index)}
        />
      ))}
      {widthLabel && (
        <div
          className="ramzy-grid-width-badge"
          style={{
            left: geometry.badge.left,
            top: geometry.badge.top,
            transform: "translateX(-50%)",
          }}
        >
          {widthLabel}
        </div>
      )}
    </div>,
    document.body,
  );
}
