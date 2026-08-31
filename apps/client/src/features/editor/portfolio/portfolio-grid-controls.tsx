import {
  Fragment,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { Editor } from "@tiptap/core";
import {
  MIN_PORTFOLIO_COLUMN_WIDTH,
  nearestPortfolioGridWidthMode,
  portfolioGridModeLabel,
  resizedColumnPixelWidths,
  resizedColumnWeights,
  type PortfolioGridWidthMode,
} from "./portfolio-grid-resize";
import { setPortfolioGridResizePreview } from "./portfolio-grid-resize-preview-extension";

type ActiveGrid = { element: HTMLElement; position: number };
type HandleGeometry = { left: number; top: number; height: number };
type GridGeometry = {
  outer: [HandleGeometry, HandleGeometry];
  dividers: HandleGeometry[];
  badge: { left: number; top: number };
};

type ColumnResizeSession = {
  kind: "column";
  pointerId: number | null;
  startClientX: number;
  active: ActiveGrid;
  handle: HTMLElement;
  columns: HTMLElement[];
  startWidths: number[];
  dividerIndex: number;
  delta: number;
  latestWeights: number[];
};

type RowResizeSession = {
  kind: "row";
  pointerId: number | null;
  startClientX: number;
  active: ActiveGrid;
  handle: HTMLElement;
  side: "left" | "right";
  startWidth: number;
  delta: number;
  widths: Record<PortfolioGridWidthMode, number>;
  minimumWidth: number;
  maximumWidth: number;
  latestWidth: number;
  nextMode: PortfolioGridWidthMode;
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

function setRowWidth(
  editor: Editor,
  rowPosition: number,
  widthMode: PortfolioGridWidthMode,
  customWidth: number,
) {
  const row = editor.state.doc.nodeAt(rowPosition);
  if (!row || row.type.name !== "columns") return;
  editor.view.dispatch(
    editor.state.tr.setNodeMarkup(rowPosition, undefined, {
      ...row.attrs,
      widthMode,
      customWidth: Math.round(customWidth),
    }),
  );
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

  const moveTo = useCallback(
    (delta: number) => {
      const session = sessionRef.current;
      if (!session) return;
      session.delta = delta;
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
        setPortfolioGridResizePreview(editor, {
          kind: "columns",
          rowPosition: session.active.position,
          widths: pixels,
        });
        setGeometry(measureGrid(session.active.element));
        return;
      }

      const requested =
        session.startWidth +
        (session.side === "right" ? session.delta * 2 : -session.delta * 2);
      const desired = Math.min(
        session.maximumWidth,
        Math.max(session.minimumWidth, requested),
      );
      session.latestWidth = desired;
      session.nextMode = nearestPortfolioGridWidthMode(desired, session.widths);
      setPortfolioGridResizePreview(editor, {
        kind: "row",
        rowPosition: session.active.position,
        width: desired,
      });
      setWidthLabel(
        `${portfolioGridModeLabel(session.nextMode)} · ${Math.round(desired)} px`,
      );
      setGeometry(measureGrid(session.active.element));
    },
    [editor],
  );

  const endResize = useCallback(
    (commit: boolean) => {
      const session = sessionRef.current;
      if (!session) return;
      delete session.handle.dataset.resizing;
      try {
        if (
          session.pointerId !== null &&
          session.handle.hasPointerCapture(session.pointerId)
        ) {
          session.handle.releasePointerCapture(session.pointerId);
        }
      } catch {
        // Capture can already be gone after a browser-level cancellation.
      }
      sessionRef.current = null;
      if (session.kind === "column") {
        if (commit) {
          setColumnWidths(
            editor,
            session.active.position,
            session.latestWeights,
          );
        }
        setPortfolioGridResizePreview(editor, null);
        setGeometry(measureGrid(session.active.element));
      } else {
        setWidthLabel(null);
        if (commit) {
          setRowWidth(
            editor,
            session.active.position,
            session.nextMode,
            session.latestWidth,
          );
        }
        setPortfolioGridResizePreview(editor, null);
        setGeometry(measureGrid(session.active.element));
      }
    },
    [editor],
  );

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const session = sessionRef.current;
      if (
        !session ||
        session.pointerId === null ||
        session.pointerId !== event.pointerId
      )
        return;
      event.preventDefault();
      moveTo(event.clientX - session.startClientX);
    };
    const onPointerUp = (event: PointerEvent) => {
      const session = sessionRef.current;
      if (
        !session ||
        session.pointerId === null ||
        session.pointerId !== event.pointerId
      )
        return;
      event.preventDefault();
      moveTo(event.clientX - session.startClientX);
      endResize(true);
    };
    const onPointerCancel = (event: PointerEvent) => {
      if (sessionRef.current?.pointerId !== event.pointerId) return;
      endResize(false);
    };
    const onMouseMove = (event: MouseEvent) => {
      const session = sessionRef.current;
      if (!session || session.pointerId !== null) return;
      event.preventDefault();
      moveTo(event.clientX - session.startClientX);
    };
    const onMouseUp = (event: MouseEvent) => {
      const session = sessionRef.current;
      if (!session || session.pointerId !== null) return;
      event.preventDefault();
      moveTo(event.clientX - session.startClientX);
      endResize(true);
    };
    const onBlur = () => endResize(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && sessionRef.current) {
        event.preventDefault();
        endResize(false);
      }
    };

    window.addEventListener("pointermove", onPointerMove, {
      capture: true,
      passive: false,
    });
    window.addEventListener("pointerup", onPointerUp, {
      capture: true,
      passive: false,
    });
    window.addEventListener("pointercancel", onPointerCancel, true);
    window.addEventListener("mousemove", onMouseMove, {
      capture: true,
      passive: false,
    });
    window.addEventListener("mouseup", onMouseUp, {
      capture: true,
      passive: false,
    });
    window.addEventListener("blur", onBlur);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", onPointerUp, true);
      window.removeEventListener("pointercancel", onPointerCancel, true);
      window.removeEventListener("mousemove", onMouseMove, true);
      window.removeEventListener("mouseup", onMouseUp, true);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("keydown", onKeyDown, true);
      endResize(false);
    };
  }, [endResize, moveTo]);

  const moveResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = sessionRef.current;
    if (
      !session ||
      session.pointerId === null ||
      session.pointerId !== event.pointerId
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    moveTo(event.clientX - session.startClientX);
  };

  const finishResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = sessionRef.current;
    if (
      !session ||
      session.pointerId === null ||
      session.pointerId !== event.pointerId
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    moveTo(event.clientX - session.startClientX);
    endResize(true);
  };

  const cancelResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (sessionRef.current?.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    endResize(false);
  };

  const beginResize = (
    handle: HTMLDivElement,
    clientX: number,
    pointerId: number | null,
  ) => {
    if (!active || sessionRef.current) return;
    handle.dataset.resizing = "true";
    if (pointerId !== null) {
      try {
        handle.setPointerCapture(pointerId);
      } catch {
        // Window-level pointer listeners still keep the gesture continuous.
      }
    }

    if (handle.dataset.kind === "divider") {
      const dividerIndex = Number(handle.dataset.index);
      const columns = columnsIn(active.element);
      const startWidths = columns.map(
        (column) => column.getBoundingClientRect().width,
      );
      sessionRef.current = {
        kind: "column",
        pointerId,
        startClientX: clientX,
        active,
        handle,
        columns,
        startWidths,
        dividerIndex,
        delta: 0,
        latestWeights: resizedColumnWeights(startWidths, dividerIndex, 0),
      };
      return;
    }

    const startWidth = active.element.getBoundingClientRect().width;
    const editorWidth = editor.view.dom.getBoundingClientRect().width;
    const available = Math.max(editorWidth, window.innerWidth - 96);
    const columns = columnsIn(active.element);
    const occupiedColumnWidth = columns.reduce(
      (total, column) => total + column.getBoundingClientRect().width,
      0,
    );
    const totalGapWidth = Math.max(0, startWidth - occupiedColumnWidth);
    const minimumWidth =
      columns.length * MIN_PORTFOLIO_COLUMN_WIDTH + totalGapWidth;
    const nextMode = (active.element.dataset.widthMode ||
      "normal") as PortfolioGridWidthMode;
    sessionRef.current = {
      kind: "row",
      pointerId,
      startClientX: clientX,
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
      minimumWidth,
      maximumWidth: Math.max(minimumWidth, Math.min(1440, available)),
      latestWidth: startWidth,
      nextMode,
    };
    setWidthLabel(
      `${portfolioGridModeLabel(nextMode)} · ${Math.round(startWidth)} px`,
    );
  };

  const startPointerResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    if (!active || event.button !== 0 || sessionRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    beginResize(event.currentTarget, event.clientX, event.pointerId);
  };

  const startMouseResize = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!active || event.button !== 0 || sessionRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    beginResize(event.currentTarget, event.clientX, null);
  };

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
          onMouseDown={startMouseResize}
          onPointerDown={startPointerResize}
          onPointerMove={moveResize}
          onPointerUp={finishResize}
          onPointerCancel={cancelResize}
          style={{ left: handle.left, top: handle.top, height: handle.height }}
        />
      ))}
      {geometry.dividers.map((handle, index) => (
        <Fragment key={`divider-${index}`}>
          <div
            className="ramzy-grid-divider-guide"
            data-index={index}
            style={{
              left: handle.left + 9,
              top: handle.top,
              height: handle.height,
            }}
          />
          <div
            className="ramzy-grid-resize-handle"
            data-kind="divider"
            data-index={index}
            title="Drag to resize columns"
            onMouseDown={startMouseResize}
            onPointerDown={startPointerResize}
            onPointerMove={moveResize}
            onPointerUp={finishResize}
            onPointerCancel={cancelResize}
            style={{
              left: handle.left,
              top: handle.top,
              height: handle.height,
            }}
          />
        </Fragment>
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
