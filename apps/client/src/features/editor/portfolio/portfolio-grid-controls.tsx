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
  MAX_PORTFOLIO_BLOCK_WIDTH,
  MIN_PORTFOLIO_COLUMN_WIDTH,
  nearestPortfolioGridWidthMode,
  portfolioResizeGuideWidths,
  portfolioGridModeLabel,
  resizedColumnPixelWidths,
  resizedColumnWeights,
  snapPortfolioBlockWidth,
  type PortfolioGridWidthMode,
} from "./portfolio-grid-resize";
import { setPortfolioGridResizePreview } from "./portfolio-grid-resize-preview-extension";

type ActiveBlock = {
  element: HTMLElement;
  position: number;
  nodeType: string;
};
type HandleGeometry = { left: number; top: number; height: number };
type BlockGeometry = {
  outer: [HandleGeometry, HandleGeometry];
  dividers: HandleGeometry[];
  badge: { left: number; top: number };
};
type SnapGuide = {
  left: number;
  width: number;
  side: "left" | "right";
  active: boolean;
};

type ColumnResizeSession = {
  kind: "column";
  pointerId: number | null;
  startClientX: number;
  active: ActiveBlock;
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
  active: ActiveBlock;
  handle: HTMLElement;
  side: "left" | "right";
  startWidth: number;
  delta: number;
  widths: Record<PortfolioGridWidthMode, number>;
  minimumWidth: number;
  maximumWidth: number;
  guideWidths: number[];
  latestWidth: number;
  snappedWidth: number | null;
  nextMode: PortfolioGridWidthMode;
};

type ResizeSession = ColumnResizeSession | RowResizeSession;

function topLevelPosition(editor: Editor, element: HTMLElement): number | null {
  try {
    const raw = editor.view.posAtDOM(element, 0);
    let exact: number | null = null;
    let containing: number | null = null;
    if (typeof editor.state.doc.forEach === "function") {
      editor.state.doc.forEach((node, position) => {
        if (position === raw) exact = position;
        if (raw > position && raw < position + node.nodeSize) {
          containing = position;
        }
      });
      if (exact !== null || containing !== null) return exact ?? containing;
    }
    const directNode = editor.state.doc.nodeAt(raw);
    return directNode?.isBlock || directNode?.type.name === "columns"
      ? raw
      : null;
  } catch {
    // The hovered node view can be replaced during an editor update.
  }
  return null;
}

function topLevelElement(editorDom: HTMLElement, target: HTMLElement) {
  let element: HTMLElement | null = target;
  while (element?.parentElement && element.parentElement !== editorDom) {
    element = element.parentElement;
  }
  return element?.parentElement === editorDom ? element : null;
}

function supportsPortfolioWidth(editor: Editor, position: number) {
  const node = editor.state.doc.nodeAt(position);
  return (
    node?.type.name === "columns" ||
    (!!node?.isBlock &&
      Object.prototype.hasOwnProperty.call(
        node.type.spec.attrs ?? {},
        "portfolioWidth",
      ))
  );
}

function columnsIn(element: HTMLElement) {
  return Array.from(element.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.dataset.type === "column",
  );
}

function measureBlock(element: HTMLElement): BlockGeometry | null {
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

function setBlockWidth(
  editor: Editor,
  position: number,
  widthMode: PortfolioGridWidthMode,
  customWidth: number,
) {
  const node = editor.state.doc.nodeAt(position);
  if (!node || (!node.isBlock && node.type.name !== "columns")) return;
  const attributes =
    node.type.name === "columns"
      ? {
          ...node.attrs,
          widthMode,
          customWidth: Math.round(customWidth),
        }
      : {
          ...node.attrs,
          portfolioWidth: Math.round(customWidth),
        };
  editor.view.dispatch(
    editor.state.tr.setNodeMarkup(position, undefined, attributes),
  );
}

export function PortfolioGridControls({ editor }: { editor: Editor }) {
  const [active, setActive] = useState<ActiveBlock | null>(null);
  const [geometry, setGeometry] = useState<BlockGeometry | null>(null);
  const [widthLabel, setWidthLabel] = useState<string | null>(null);
  const [outerResizing, setOuterResizing] = useState(false);
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
  const sessionRef = useRef<ResizeSession | null>(null);

  useEffect(() => {
    if (editor.isDestroyed || !editor.isEditable) return;
    const editorDom = editor.view.dom;
    const activateFromTarget = (target: EventTarget | null) => {
      if (sessionRef.current || !(target instanceof HTMLElement)) return;
      const element = topLevelElement(editorDom, target);
      if (!element) {
        setActive(null);
        return;
      }
      const position = topLevelPosition(editor, element);
      if (position === null || !supportsPortfolioWidth(editor, position)) {
        setActive(null);
        return;
      }
      const nodeType = editor.state.doc.nodeAt(position)!.type.name;
      setActive((current) =>
        current?.element === element &&
        current.position === position &&
        current.nodeType === nodeType
          ? current
          : { element, position, nodeType },
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
        const next = measureBlock(active.element);
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
        setGeometry(measureBlock(session.active.element));
        return;
      }

      const requested =
        session.startWidth +
        (session.side === "right" ? session.delta * 2 : -session.delta * 2);
      const bounded = Math.min(
        session.maximumWidth,
        Math.max(session.minimumWidth, requested),
      );
      const snapped = snapPortfolioBlockWidth(
        bounded,
        session.guideWidths,
        session.widths,
      );
      const desired = snapped.width;
      session.latestWidth = desired;
      session.snappedWidth =
        Math.abs(desired - bounded) > 0.5 || snapped.mode !== null
          ? desired
          : null;
      session.nextMode = nearestPortfolioGridWidthMode(desired, session.widths);
      setPortfolioGridResizePreview(editor, {
        kind: "block",
        position: session.active.position,
        width: desired,
      });
      setWidthLabel(
        session.active.nodeType === "columns"
          ? snapped.mode
            ? `${portfolioGridModeLabel(snapped.mode)} · ${Math.round(desired)} px`
            : `${Math.round(desired)} px`
          : `${Math.round(desired)} px`,
      );
      const center =
        session.active.element.getBoundingClientRect().left + desired / 2;
      setSnapGuides(
        session.guideWidths.flatMap((width) => [
          {
            left: center - width / 2,
            width,
            side: "left" as const,
            active: session.snappedWidth === width,
          },
          {
            left: center + width / 2,
            width,
            side: "right" as const,
            active: session.snappedWidth === width,
          },
        ]),
      );
      setGeometry(measureBlock(session.active.element));
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
      setOuterResizing(false);
      setSnapGuides([]);
      if (session.kind === "column") {
        if (commit) {
          setColumnWidths(
            editor,
            session.active.position,
            session.latestWeights,
          );
        }
        setPortfolioGridResizePreview(editor, null);
        setGeometry(measureBlock(session.active.element));
      } else {
        setWidthLabel(null);
        if (commit) {
          setBlockWidth(
            editor,
            session.active.position,
            session.nextMode,
            session.latestWidth,
          );
        }
        setPortfolioGridResizePreview(editor, null);
        setGeometry(measureBlock(session.active.element));
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

    setOuterResizing(true);
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
      active.nodeType === "columns"
        ? columns.length * MIN_PORTFOLIO_COLUMN_WIDTH + totalGapWidth
        : 240;
    const nextMode = (active.element.dataset.widthMode ||
      "normal") as PortfolioGridWidthMode;
    const widths: Record<PortfolioGridWidthMode, number> = {
      normal: Math.min(editorWidth, MAX_PORTFOLIO_BLOCK_WIDTH),
      wide: Math.min(1120, Math.max(editorWidth, window.innerWidth - 352)),
      full: Math.min(MAX_PORTFOLIO_BLOCK_WIDTH, available),
    };
    const maximumWidth = Math.max(minimumWidth, widths.full);
    const guideWidths = portfolioResizeGuideWidths(
      minimumWidth,
      maximumWidth,
      widths,
    );
    const center = active.element.getBoundingClientRect().left + startWidth / 2;
    sessionRef.current = {
      kind: "row",
      pointerId,
      startClientX: clientX,
      active,
      handle,
      side: handle.dataset.side === "left" ? "left" : "right",
      startWidth,
      delta: 0,
      widths,
      minimumWidth,
      maximumWidth,
      guideWidths,
      latestWidth: Math.min(maximumWidth, Math.max(minimumWidth, startWidth)),
      snappedWidth: null,
      nextMode,
    };
    setSnapGuides(
      guideWidths.flatMap((width) => [
        {
          left: center - width / 2,
          width,
          side: "left" as const,
          active: false,
        },
        {
          left: center + width / 2,
          width,
          side: "right" as const,
          active: false,
        },
      ]),
    );
    setWidthLabel(
      active.nodeType === "columns"
        ? `${portfolioGridModeLabel(nextMode)} · ${Math.round(startWidth)} px`
        : `${Math.round(startWidth)} px`,
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
      {outerResizing &&
        snapGuides.map((guide) => (
          <div
            key={`${guide.width}-${guide.side}`}
            className="ramzy-block-resize-snap-guide"
            data-side={guide.side}
            data-width={guide.width}
            data-active={guide.active ? "true" : undefined}
            style={{
              left: guide.left,
              top: Math.max(0, editor.view.dom.getBoundingClientRect().top),
              height:
                window.innerHeight -
                Math.max(0, editor.view.dom.getBoundingClientRect().top),
            }}
          />
        ))}
      {geometry.outer.map((handle, index) => (
        <div
          key={index === 0 ? "outer-left" : "outer-right"}
          className="ramzy-grid-resize-handle"
          data-kind="outer"
          data-side={index === 0 ? "left" : "right"}
          title="Drag to change block width"
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
