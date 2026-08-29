import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import type { Editor } from "@tiptap/core";
import {
  DragDropProvider,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/react";
import {
  createPortfolioGridDropTransaction,
  createPortfolioVerticalDropTransaction,
} from "./portfolio-grid-drop";
import {
  setPortfolioDndPreview,
  type PortfolioDndPreviewState,
} from "./portfolio-dnd-preview-extension";

const PORTFOLIO_BLOCK = "ramzy-portfolio-block";
const PORTFOLIO_ZONE = "ramzy-portfolio-zone";
const MAX_COLUMNS = 5;

type SourceData = {
  kind: typeof PORTFOLIO_BLOCK;
  sourcePosition: number;
  sourceElement: HTMLElement;
  sourceHeight: number;
  label: string;
};

type ZoneData = {
  kind: typeof PORTFOLIO_ZONE;
  targetPosition: number;
  columnIndex: number | null;
  edge: "top" | "bottom" | "left" | "right";
};

type DropZone = ZoneData & {
  id: string;
  rect: { left: number; top: number; width: number; height: number };
};

function isSourceData(data: unknown): data is SourceData {
  return (
    !!data &&
    typeof data === "object" &&
    (data as SourceData).kind === PORTFOLIO_BLOCK
  );
}

function isZoneData(data: unknown): data is ZoneData {
  return (
    !!data &&
    typeof data === "object" &&
    (data as ZoneData).kind === PORTFOLIO_ZONE
  );
}

function selectionPositionForElement(editor: Editor, element: HTMLElement) {
  try {
    const raw = editor.view.posAtDOM(element, 0);
    if (editor.state.doc.nodeAt(raw)?.isBlock) return raw;
    const $position = editor.state.doc.resolve(raw);
    for (let depth = $position.depth; depth > 0; depth -= 1) {
      const before = $position.before(depth);
      if (editor.state.doc.nodeAt(before)?.isBlock) return before;
    }
  } catch {
    // A React node view can be replaced between pointer movement and activation.
  }
  return null;
}

function elementAtHandlePointer(
  editor: Editor,
  clientX: number,
  clientY: number,
) {
  const editorRect = editor.view.dom.getBoundingClientRect();
  const hit = document.elementFromPoint(
    Math.max(editorRect.left + 16, clientX + 56),
    clientY,
  );
  if (!(hit instanceof HTMLElement) || !editor.view.dom.contains(hit)) {
    return null;
  }
  const element =
    hit.closest<HTMLElement>(".react-renderer") ??
    hit.closest<HTMLElement>("p, h1, h2, h3, blockquote, pre, ul, ol, table");
  if (!element) return null;
  const position = selectionPositionForElement(editor, element);
  return position === null ? null : { element, position };
}

function blockLabel(element: HTMLElement) {
  const text = element.textContent?.trim().replace(/\s+/g, " ");
  return text ? text.slice(0, 54) : "Portfolio element";
}

function topLevelPosition(editor: Editor, element: HTMLElement) {
  try {
    const raw = editor.view.posAtDOM(element, 0);
    const $position = editor.state.doc.resolve(raw);
    return $position.depth > 0 ? $position.before(1) : raw;
  } catch {
    return null;
  }
}

function columnElements(row: HTMLElement) {
  return Array.from(row.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.dataset.type === "column",
  );
}

function sourceCanReplaceOwnColumn(source: SourceData, row: HTMLElement) {
  const sourceColumn = source.sourceElement.closest<HTMLElement>(
    '[data-type="column"]',
  );
  if (sourceColumn?.parentElement !== row) return false;
  const meaningful = Array.from(sourceColumn.children).filter(
    (child) =>
      !(
        child instanceof HTMLParagraphElement &&
        child.textContent?.trim().length === 0
      ),
  );
  return meaningful.length === 1;
}

function zoneRect(rect: DOMRect, edge: ZoneData["edge"]) {
  if (edge === "top" || edge === "bottom") {
    const height = Math.min(48, Math.max(24, rect.height * 0.16));
    return {
      left: rect.left,
      top: edge === "top" ? rect.top - height / 2 : rect.bottom - height / 2,
      width: rect.width,
      height,
    };
  }
  const width = Math.min(180, Math.max(72, rect.width * 0.34));
  return {
    left: edge === "left" ? rect.left : rect.right - width,
    top: rect.top,
    width,
    height: rect.height,
  };
}

function collectDropZones(editor: Editor, source: SourceData): DropZone[] {
  const zones: DropZone[] = [];
  Array.from(editor.view.dom.children).forEach((child, rowIndex) => {
    if (!(child instanceof HTMLElement)) return;
    const targetPosition = topLevelPosition(editor, child);
    const rowRect = child.getBoundingClientRect();
    if (targetPosition === null || rowRect.width <= 0 || rowRect.height <= 0) {
      return;
    }

    (["top", "bottom"] as const).forEach((edge) => {
      zones.push({
        id: `row-${rowIndex}-${edge}`,
        kind: PORTFOLIO_ZONE,
        targetPosition,
        columnIndex: null,
        edge,
        rect: zoneRect(rowRect, edge),
      });
    });

    const isGrid = child.matches('[data-type="columns"]');
    const columns = isGrid ? columnElements(child) : [child];
    const canAdd =
      columns.length < MAX_COLUMNS || sourceCanReplaceOwnColumn(source, child);
    if (!canAdd) return;

    columns.forEach((column, columnIndex) => {
      const rect = column.getBoundingClientRect();
      (["left", "right"] as const).forEach((edge) => {
        zones.push({
          id: `row-${rowIndex}-column-${columnIndex}-${edge}`,
          kind: PORTFOLIO_ZONE,
          targetPosition,
          columnIndex: isGrid ? columnIndex : null,
          edge,
          rect: zoneRect(rect, edge),
        });
      });
    });
  });
  return zones;
}

function GlobalHandleBinding({
  editor,
  source,
  setSource,
}: {
  editor: Editor;
  source: SourceData | null;
  setSource: (source: SourceData | null) => void;
}) {
  const handle =
    editor.view.dom.parentElement?.querySelector<HTMLElement>(
      ":scope > .drag-handle",
    ) ?? null;

  useEffect(() => {
    if (!handle) return;
    const sourceFromPointer = (event: PointerEvent): SourceData | null => {
      const match = elementAtHandlePointer(
        editor,
        event.clientX,
        event.clientY,
      );
      return match
        ? {
            kind: PORTFOLIO_BLOCK,
            sourcePosition: match.position,
            sourceElement: match.element,
            sourceHeight: match.element.getBoundingClientRect().height,
            label: blockLabel(match.element),
          }
        : null;
    };
    const prepare = (event: PointerEvent) => {
      setSource(sourceFromPointer(event));
    };
    const prepareSynchronously = (event: PointerEvent) => {
      flushSync(() => {
        setSource(sourceFromPointer(event));
      });
    };
    handle.addEventListener("pointermove", prepare, { passive: true });
    handle.addEventListener("pointerdown", prepareSynchronously, true);
    return () => {
      handle.removeEventListener("pointermove", prepare);
      handle.removeEventListener("pointerdown", prepareSynchronously, true);
    };
  }, [editor, handle, setSource]);

  useDraggable({
    id: "ramzy-portfolio-global-handle",
    type: PORTFOLIO_BLOCK,
    element: handle,
    handle,
    data: source ?? { kind: "inactive" },
    disabled: !handle,
  });
  return null;
}

function Zone({ zone }: { zone: DropZone }) {
  const { ref, isDropTarget } = useDroppable<ZoneData>({
    id: zone.id,
    type: PORTFOLIO_ZONE,
    accept: PORTFOLIO_BLOCK,
    data: zone,
  });
  return (
    <div
      ref={ref}
      className="ramzy-dnd-drop-zone"
      data-active={isDropTarget || undefined}
      style={{
        left: zone.rect.left,
        top: zone.rect.top,
        width: zone.rect.width,
        height: zone.rect.height,
      }}
    />
  );
}

function DropZones({ zones }: { zones: DropZone[] }) {
  if (!zones.length) return null;
  return createPortal(
    <div className="ramzy-dnd-drop-zone-layer" aria-hidden="true">
      {zones.map((zone) => (
        <Zone key={zone.id} zone={zone} />
      ))}
    </div>,
    document.body,
  );
}

function PortfolioDndController({ editor }: { editor: Editor }) {
  const [preparedSource, setPreparedSource] = useState<SourceData | null>(null);
  const [activeSource, setActiveSource] = useState<SourceData | null>(null);
  const [zones, setZones] = useState<DropZone[]>([]);

  const clear = useCallback(() => {
    setPortfolioDndPreview(editor, null);
    setActiveSource(null);
    setZones([]);
  }, [editor]);

  useEffect(() => () => setPortfolioDndPreview(editor, null), [editor]);

  useEffect(() => {
    if (!activeSource) return;
    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          setZones(collectDropZones(editor, activeSource));
        }
      });
    };
    window.addEventListener("scroll", refresh, true);
    window.addEventListener("resize", refresh);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", refresh, true);
      window.removeEventListener("resize", refresh);
    };
  }, [activeSource, editor]);

  const sensors = useMemo(() => [PointerSensor], []);

  return (
    <DragDropProvider
      sensors={sensors}
      onDragStart={({ operation }) => {
        const source = operation.source?.data;
        if (!isSourceData(source)) return;
        setActiveSource(source);
        setZones(collectDropZones(editor, source));
      }}
      onDragOver={({ operation }) => {
        const source = operation.source?.data;
        const target = operation.target?.data;
        if (!isSourceData(source) || !isZoneData(target)) {
          setPortfolioDndPreview(editor, null);
          return;
        }
        const preview: PortfolioDndPreviewState = {
          sourcePosition: source.sourcePosition,
          targetPosition: target.targetPosition,
          edge: target.edge,
          columnIndex: target.columnIndex,
          sourceHeight: source.sourceHeight,
        };
        setPortfolioDndPreview(editor, preview);
      }}
      onDragEnd={({ operation, canceled }) => {
        const source = operation.source?.data;
        const target = operation.target?.data;
        clear();
        if (canceled || !isSourceData(source) || !isZoneData(target)) return;

        const transaction =
          target.edge === "left" || target.edge === "right"
            ? createPortfolioGridDropTransaction(
                editor.state,
                target.targetPosition,
                target.edge,
                target.columnIndex,
                source.sourcePosition,
              )
            : createPortfolioVerticalDropTransaction(
                editor.state,
                target.targetPosition,
                target.edge,
                source.sourcePosition,
              );
        if (transaction) editor.view.dispatch(transaction);
      }}
    >
      <GlobalHandleBinding
        editor={editor}
        source={preparedSource}
        setSource={setPreparedSource}
      />
      <DropZones zones={zones} />
      <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
        {activeSource ? (
          <div className="ramzy-dnd-drag-overlay">{activeSource.label}</div>
        ) : null}
      </DragOverlay>
    </DragDropProvider>
  );
}

export function PortfolioDnd({ editor }: { editor: Editor }) {
  if (editor.isDestroyed || !editor.isEditable) return null;
  return <PortfolioDndController editor={editor} />;
}
