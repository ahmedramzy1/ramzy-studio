import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Editor } from "@tiptap/core";
import interact from "interactjs";
import {
  nearestPortfolioGridWidthMode,
  portfolioGridModeLabel,
  resizedColumnPixelWidths,
  resizedColumnWeights,
  type PortfolioGridWidthMode,
} from "./portfolio-grid-resize";

type ActiveGrid = { element: HTMLElement; position: number };
type HandleGeometry = { left: number; top: number; height: number };
type GridGeometry = {
  outer: [HandleGeometry, HandleGeometry];
  dividers: HandleGeometry[];
  badge: { left: number; top: number };
};

type ColumnResizeSession = {
  kind: "column";
  active: ActiveGrid;
  handle: HTMLElement;
  columns: HTMLElement[];
  startWidths: number[];
  originalStyles: Array<{ flex: string; width: string }>;
  dividerIndex: number;
  delta: number;
  latestWeights: number[];
};

type RowResizeSession = {
  kind: "row";
  active: ActiveGrid;
  handle: HTMLElement;
  side: "left" | "right";
  startWidth: number;
  delta: number;
  widths: Record<PortfolioGridWidthMode, number>;
  nextMode: PortfolioGridWidthMode;
  originalStyles: {
    position: string;
    left: string;
    width: string;
    maxWidth: string;
    marginLeft: string;
    marginRight: string;
    transform: string;
  };
};

type ResizeSession = ColumnResizeSession | RowResizeSession;

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
  } catch {
    // The hovered node view can be replaced during an editor update.
  }
  return null;
}

function columnsIn(element: HTMLElement) {
  return Array.from(element.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.dataset.type === "column",
  );
}

function measureGrid(element: HTMLElement): GridGeometry | null {
  if (!element.isConnected) return null;
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  const columns = columnsIn(element);
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
  if (!row || row.type.name !== "columns" || row.childCount !== weights.length)
    return;
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

function restoreRowStyles(session: RowResizeSession) {
  const { element } = session.active;
  element.style.position = session.originalStyles.position;
  element.style.left = session.originalStyles.left;
  element.style.width = session.originalStyles.width;
  element.style.maxWidth = session.originalStyles.maxWidth;
  element.style.marginLeft = session.originalStyles.marginLeft;
  element.style.marginRight = session.originalStyles.marginRight;
  element.style.transform = session.originalStyles.transform;
}

export function PortfolioGridControls({ editor }: { editor: Editor }) {
  const [active, setActive] = useState<ActiveGrid | null>(null);
  const [geometry, setGeometry] = useState<GridGeometry | null>(null);
  const [widthLabel, setWidthLabel] = useState<string | null>(null);
  const sessionRef = useRef<ResizeSession | null>(null);

  useEffect(() => {
    if (editor.isDestroyed || !editor.isEditable) return;
    const editorDom = editor.view.dom;
    const activateFromTarget = (target: EventTarget | null) => {
      if (sessionRef.current || !(target instanceof HTMLElement)) return;
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
    const onPointerMove = (event: PointerEvent) =>
      activateFromTarget(event.target);
    const onFocus = () => {
      const selection = window.getSelection();
      activateFromTarget(selection?.anchorNode?.parentElement ?? null);
    };
    editorDom.addEventListener("pointermove", onPointerMove, true);
    editorDom.addEventListener("focusin", onFocus, true);
    return () => {
      editorDom.removeEventListener("pointermove", onPointerMove, true);
      editorDom.removeEventListener("focusin", onFocus, true);
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

  useEffect(() => {
    if (!active || !geometry) return;
    const handles = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".ramzy-grid-resize-layer .ramzy-grid-resize-handle",
      ),
    );

    const start = (handle: HTMLElement) => {
      handle.dataset.resizing = "true";
      if (handle.dataset.kind === "divider") {
        const dividerIndex = Number(handle.dataset.index);
        const columns = columnsIn(active.element);
        const startWidths = columns.map(
          (column) => column.getBoundingClientRect().width,
        );
        sessionRef.current = {
          kind: "column",
          active,
          handle,
          columns,
          startWidths,
          originalStyles: columns.map((column) => ({
            flex: column.style.flex,
            width: column.style.width,
          })),
          dividerIndex,
          delta: 0,
          latestWeights: resizedColumnWeights(startWidths, dividerIndex, 0),
        };
        return;
      }

      const startWidth = active.element.getBoundingClientRect().width;
      const editorWidth = editor.view.dom.getBoundingClientRect().width;
      const available = Math.max(editorWidth, window.innerWidth - 96);
      const nextMode = (active.element.dataset.widthMode ||
        "normal") as PortfolioGridWidthMode;
      sessionRef.current = {
        kind: "row",
        active,
        handle,
        side: handle.dataset.side === "left" ? "left" : "right",
        startWidth,
        delta: 0,
        widths: {
          normal: editorWidth,
          wide: Math.min(1120, Math.max(editorWidth, window.innerWidth - 352)),
          full: Math.min(1440, available),
        },
        nextMode,
        originalStyles: {
          position: active.element.style.position,
          left: active.element.style.left,
          width: active.element.style.width,
          maxWidth: active.element.style.maxWidth,
          marginLeft: active.element.style.marginLeft,
          marginRight: active.element.style.marginRight,
          transform: active.element.style.transform,
        },
      };
      setWidthLabel(portfolioGridModeLabel(nextMode));
    };

    const move = (dx: number) => {
      const session = sessionRef.current;
      if (!session) return;
      session.delta += dx;
      if (session.kind === "column") {
        session.latestWeights = resizedColumnWeights(
          session.startWidths,
          session.dividerIndex,
          session.delta,
        );
        const pixels = resizedColumnPixelWidths(
          session.startWidths,
          session.dividerIndex,
          session.delta,
        );
        session.columns.forEach((column, index) => {
          column.style.setProperty(
            "flex",
            `0 0 ${pixels[index]}px`,
            "important",
          );
          column.style.setProperty("width", `${pixels[index]}px`, "important");
        });
        setGeometry(measureGrid(session.active.element));
        return;
      }

      const requested =
        session.startWidth +
        (session.side === "right" ? session.delta * 2 : -session.delta * 2);
      const minimum = Math.min(...Object.values(session.widths));
      const maximum = Math.max(...Object.values(session.widths));
      const desired = Math.min(maximum, Math.max(minimum, requested));
      session.nextMode = nearestPortfolioGridWidthMode(desired, session.widths);
      const { element } = session.active;
      element.style.setProperty("position", "relative", "important");
      element.style.setProperty("left", "50%", "important");
      element.style.setProperty("width", `${desired}px`, "important");
      element.style.setProperty("max-width", "none", "important");
      element.style.setProperty("margin-left", "0", "important");
      element.style.setProperty("margin-right", "0", "important");
      element.style.setProperty("transform", "translateX(-50%)", "important");
      setWidthLabel(portfolioGridModeLabel(session.nextMode));
      setGeometry(measureGrid(element));
    };

    const end = () => {
      const session = sessionRef.current;
      if (!session) return;
      delete session.handle.dataset.resizing;
      sessionRef.current = null;
      if (session.kind === "column") {
        setColumnWidths(editor, session.active.position, session.latestWeights);
        requestAnimationFrame(() => {
          columnsIn(session.active.element).forEach((column, index) => {
            column.style.setProperty(
              "flex",
              String(session.latestWeights[index]),
            );
            column.style.removeProperty("width");
          });
        });
      } else {
        setWidthLabel(null);
        setRowWidthMode(editor, session.active.position, session.nextMode);
        requestAnimationFrame(() => restoreRowStyles(session));
      }
    };

    handles.forEach((handle) => {
      interact(handle).draggable({
        listeners: {
          start: () => start(handle),
          move: (event) => move(event.dx),
          end,
        },
      });
    });
    return () => handles.forEach((handle) => interact(handle).unset());
  }, [active, editor, geometry?.dividers.length]);

  if (!active || !geometry) return null;
  return createPortal(
    <div className="ramzy-grid-resize-layer" aria-hidden="true">
      {geometry.outer.map((handle, index) => (
        <div
          key={index === 0 ? "outer-left" : "outer-right"}
          className="ramzy-grid-resize-handle"
          data-kind="outer"
          data-side={index === 0 ? "left" : "right"}
          title="Drag to change row width"
          style={{ left: handle.left, top: handle.top, height: handle.height }}
        />
      ))}
      {geometry.dividers.map((handle, index) => (
        <div
          key={`divider-${index}`}
          className="ramzy-grid-resize-handle"
          data-kind="divider"
          data-index={index}
          title="Drag to resize columns"
          style={{ left: handle.left, top: handle.top, height: handle.height }}
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
