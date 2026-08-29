import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Editor } from "@tiptap/core";
import {
  nearestPortfolioGridWidthMode,
  portfolioGridModeLabel,
  resizedColumnPixelWidths,
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
    const raw = editor.view.posAtDOM(element, 0);
    if (editor.state.doc.nodeAt(raw)?.type.name === "columns") return raw;
    const $position = editor.state.doc.resolve(raw);
    for (let depth = $position.depth; depth > 0; depth -= 1) {
      const before = $position.before(depth);
      if (editor.state.doc.nodeAt(before)?.type.name === "columns") {
        return before;
      }
    }
    return null;
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
    const handle = event.currentTarget as HTMLElement;
    const pointerId = event.pointerId;
    handle.dataset.resizing = "true";
    handle.setPointerCapture?.(pointerId);
    const originalStyles = columns.map((column) => ({
      flex: column.style.flex,
      width: column.style.width,
    }));
    let liveFrame = 0;
    let latestClientX = startX;
    let latestWeights = resizedColumnWeights(startWidths, dividerIndex, 0);

    const renderLiveWidths = (clientX: number) => {
      latestWeights = resizedColumnWeights(
        startWidths,
        dividerIndex,
        clientX - startX,
      );
      const pixelWidths = resizedColumnPixelWidths(
        startWidths,
        dividerIndex,
        clientX - startX,
      );
      columns.forEach((column, index) => {
        column.style.setProperty(
          "flex",
          `0 0 ${pixelWidths[index]}px`,
          "important",
        );
        column.style.setProperty(
          "width",
          `${pixelWidths[index]}px`,
          "important",
        );
      });
    };

    const onMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return;
      moveEvent.preventDefault();
      latestClientX = moveEvent.clientX;
      cancelAnimationFrame(liveFrame);
      liveFrame = requestAnimationFrame(() => renderLiveWidths(latestClientX));
    };
    const finish = (upEvent: PointerEvent) => {
      if (upEvent.pointerId !== pointerId) return;
      cancelAnimationFrame(liveFrame);
      renderLiveWidths(upEvent.clientX);
      cleanup(false);
      setColumnWidths(editor, active.position, latestWeights);
      requestAnimationFrame(() => {
        const renderedColumns = Array.from(active.element.children).filter(
          (child): child is HTMLElement =>
            child instanceof HTMLElement && child.dataset.type === "column",
        );
        renderedColumns.forEach((column, index) => {
          column.style.setProperty("flex", String(latestWeights[index]));
          column.style.removeProperty("width");
        });
      });
    };
    const cancel = (cancelEvent: PointerEvent) => {
      if (cancelEvent.pointerId !== pointerId) return;
      cleanup(true);
    };
    const cleanup = (restore = true) => {
      cancelAnimationFrame(liveFrame);
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", finish, true);
      window.removeEventListener("pointercancel", cancel, true);
      delete handle.dataset.resizing;
      if (handle.hasPointerCapture?.(pointerId)) {
        handle.releasePointerCapture(pointerId);
      }
      if (restore) {
        columns.forEach((column, index) => {
          column.style.flex = originalStyles[index].flex;
          column.style.width = originalStyles[index].width;
        });
      }
      resizeCleanupRef.current = null;
    };
    resizeCleanupRef.current = cleanup;
    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerup", finish, true);
    window.addEventListener("pointercancel", cancel, true);
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
    const handle = event.currentTarget as HTMLElement;
    const pointerId = event.pointerId;
    handle.dataset.resizing = "true";
    handle.setPointerCapture?.(pointerId);
    const originalStyles = {
      position: active.element.style.position,
      left: active.element.style.left,
      width: active.element.style.width,
      maxWidth: active.element.style.maxWidth,
      marginLeft: active.element.style.marginLeft,
      marginRight: active.element.style.marginRight,
      transform: active.element.style.transform,
    };
    let liveFrame = 0;
    let latestClientX = startX;
    let nextMode = (active.element.dataset.widthMode ||
      "normal") as PortfolioGridWidthMode;
    setWidthLabel(portfolioGridModeLabel(nextMode));

    const renderLiveWidth = (clientX: number) => {
      const delta = clientX - startX;
      const requested =
        startWidth + (side === "right" ? delta * 2 : -delta * 2);
      const minimum = Math.min(...Object.values(widths));
      const maximum = Math.max(...Object.values(widths));
      const desired = Math.min(maximum, Math.max(minimum, requested));
      nextMode = nearestPortfolioGridWidthMode(desired, widths);
      active.element.style.setProperty("position", "relative", "important");
      active.element.style.setProperty("left", "50%", "important");
      active.element.style.setProperty("width", `${desired}px`, "important");
      active.element.style.setProperty("max-width", "none", "important");
      active.element.style.setProperty("margin-left", "0", "important");
      active.element.style.setProperty("margin-right", "0", "important");
      active.element.style.setProperty(
        "transform",
        "translateX(-50%)",
        "important",
      );
      setWidthLabel(portfolioGridModeLabel(nextMode));
    };

    const onMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return;
      moveEvent.preventDefault();
      latestClientX = moveEvent.clientX;
      cancelAnimationFrame(liveFrame);
      liveFrame = requestAnimationFrame(() => renderLiveWidth(latestClientX));
    };
    const finish = (upEvent: PointerEvent) => {
      if (upEvent.pointerId !== pointerId) return;
      cancelAnimationFrame(liveFrame);
      renderLiveWidth(upEvent.clientX);
      cleanup(false);
      setWidthLabel(null);
      setRowWidthMode(editor, active.position, nextMode);
      requestAnimationFrame(() => restoreOriginalStyles());
    };
    const restoreOriginalStyles = () => {
      active.element.style.position = originalStyles.position;
      active.element.style.left = originalStyles.left;
      active.element.style.width = originalStyles.width;
      active.element.style.maxWidth = originalStyles.maxWidth;
      active.element.style.marginLeft = originalStyles.marginLeft;
      active.element.style.marginRight = originalStyles.marginRight;
      active.element.style.transform = originalStyles.transform;
    };
    const cancel = (cancelEvent: PointerEvent) => {
      if (cancelEvent.pointerId !== pointerId) return;
      cleanup(true);
      setWidthLabel(null);
    };
    const cleanup = (restore = true) => {
      cancelAnimationFrame(liveFrame);
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", finish, true);
      window.removeEventListener("pointercancel", cancel, true);
      delete handle.dataset.resizing;
      if (handle.hasPointerCapture?.(pointerId)) {
        handle.releasePointerCapture(pointerId);
      }
      if (restore) restoreOriginalStyles();
      resizeCleanupRef.current = null;
    };
    resizeCleanupRef.current = cleanup;
    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerup", finish, true);
    window.addEventListener("pointercancel", cancel, true);
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
