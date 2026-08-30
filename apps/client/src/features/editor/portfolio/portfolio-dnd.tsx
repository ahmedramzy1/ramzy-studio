import { useEffect } from "react";
import type { Editor } from "@tiptap/core";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import {
  autoScrollForElements,
  autoScrollWindowForElements,
} from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import type {
  DropTargetRecord,
  Input,
} from "@atlaskit/pragmatic-drag-and-drop/types";
import {
  createPortfolioGridDropTransaction,
  createPortfolioVerticalDropTransaction,
} from "./portfolio-grid-drop";
import {
  setPortfolioDndPreview,
  type PortfolioDndPreviewState,
} from "./portfolio-dnd-preview-extension";

const PORTFOLIO_BLOCK = "ramzy-portfolio-block";
const PORTFOLIO_TARGET = "ramzy-portfolio-target";
const PORTFOLIO_DND_ACTIVE_CLASS = "ramzy-portfolio-dnd-active";
const MAX_COLUMNS = 5;

type SourceData = {
  kind: typeof PORTFOLIO_BLOCK;
  sourcePosition: number;
  sourceElement: HTMLElement;
  sourceHeight: number;
  label: string;
};

type TargetData = {
  kind: typeof PORTFOLIO_TARGET;
  targetPosition: number;
  columnIndex: number | null;
};

type FrozenRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

type FrozenColumnGeometry = {
  element: HTMLElement;
  rect: FrozenRect;
};

type FrozenRowGeometry = {
  element: HTMLElement;
  targetPosition: number;
  rect: FrozenRect;
  columns: FrozenColumnGeometry[];
};

type DragGeometry = {
  rows: FrozenRowGeometry[];
  verticalScrollOffset: number;
};

function isSourceData(data: unknown): data is SourceData {
  return (
    !!data &&
    typeof data === "object" &&
    (data as SourceData).kind === PORTFOLIO_BLOCK
  );
}

function isTargetData(data: unknown): data is TargetData {
  return (
    !!data &&
    typeof data === "object" &&
    (data as TargetData).kind === PORTFOLIO_TARGET
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
    // A node view can be replaced between registration and drag activation.
  }
  return null;
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

function blockLabel(element: HTMLElement) {
  const text = element.textContent?.trim().replace(/\s+/g, " ");
  return text ? text.slice(0, 54) : "Portfolio element";
}

function cloneForNativePreview(sourceElement: HTMLElement) {
  const clone = sourceElement.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.classList.remove("ramzy-dnd-source", "ProseMirror-selectednode");
  clone.setAttribute("aria-hidden", "true");
  clone.setAttribute("contenteditable", "false");
  clone
    .querySelectorAll<HTMLElement>(
      "[data-ramzy-block-drag-handle], [data-drag-handle], .drag-handle",
    )
    .forEach((handle) => handle.remove());
  clone.querySelectorAll<HTMLElement>("[id]").forEach((element) => {
    element.removeAttribute("id");
  });
  clone
    .querySelectorAll<HTMLElement>("[contenteditable]")
    .forEach((element) => element.setAttribute("contenteditable", "false"));
  clone
    .querySelectorAll<HTMLElement>("button, a, input, textarea, select")
    .forEach((element) => element.setAttribute("tabindex", "-1"));
  clone.querySelectorAll<HTMLMediaElement>("video, audio").forEach((media) => {
    media.removeAttribute("autoplay");
    media.muted = true;
  });
  return clone;
}

function sourceForHandle(
  editor: Editor,
  handle: HTMLElement,
): SourceData | null {
  const internal = handle.hasAttribute("data-ramzy-block-drag-handle");
  const parent =
    handle.closest<HTMLElement>(".react-renderer") ?? handle.parentElement;
  const position = internal
    ? parent
      ? selectionPositionForElement(editor, parent)
      : null
    : Number.isFinite(Number(handle.dataset.ramzyNodePosition))
      ? Number(handle.dataset.ramzyNodePosition)
      : null;
  if (position === null) return null;
  const node = editor.state.doc.nodeAt(position);
  const dom = editor.view.nodeDOM(position);
  if (!node?.isBlock || !(dom instanceof HTMLElement)) return null;
  return {
    kind: PORTFOLIO_BLOCK,
    sourcePosition: position,
    sourceElement: dom,
    sourceHeight: dom.getBoundingClientRect().height,
    label: blockLabel(dom),
  };
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

function previewFromLocation(
  source: SourceData,
  dropTargets: readonly DropTargetRecord[],
): PortfolioDndPreviewState | null {
  const record = dropTargets.find((target) => isTargetData(target.data));
  if (!record || !isTargetData(record.data)) return null;
  const edge = extractClosestEdge(record.data);
  if (!edge) return null;
  return {
    sourcePosition: source.sourcePosition,
    targetPosition: record.data.targetPosition,
    edge,
    columnIndex: record.data.columnIndex,
    sourceHeight: source.sourceHeight,
  };
}

function containsPoint(rect: FrozenRect, input: Input) {
  return (
    input.clientX >= rect.left &&
    input.clientX <= rect.right &&
    input.clientY >= rect.top &&
    input.clientY <= rect.bottom
  );
}

function verticalDropBand(rect: FrozenRect) {
  return Math.min(72, Math.max(24, rect.height * 0.16), rect.height * 0.35);
}

function freezeRect(rect: DOMRect): FrozenRect {
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function verticalScrollContainers(root: HTMLElement) {
  const containers: HTMLElement[] = [];
  for (
    let element: HTMLElement | null = root;
    element;
    element = element.parentElement
  ) {
    const overflowY = window.getComputedStyle(element).overflowY;
    if (
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowY === "overlay"
    ) {
      containers.push(element);
    }
  }
  return containers;
}

function verticalScrollOffset(scrollContainers: readonly HTMLElement[]) {
  return (
    window.scrollY +
    scrollContainers.reduce((offset, element) => offset + element.scrollTop, 0)
  );
}

function captureDragGeometry(
  editor: Editor,
  scrollContainers: readonly HTMLElement[],
): DragGeometry {
  const root = editor.view.dom;
  return {
    verticalScrollOffset: verticalScrollOffset(scrollContainers),
    rows: Array.from(root.children).flatMap((child) => {
      if (!(child instanceof HTMLElement)) return [];
      const targetPosition = topLevelPosition(editor, child);
      if (targetPosition === null) return [];
      return [
        {
          element: child,
          targetPosition,
          rect: freezeRect(child.getBoundingClientRect()),
          columns: columnElements(child).map((element) => ({
            element,
            rect: freezeRect(element.getBoundingClientRect()),
          })),
        },
      ];
    }),
  };
}

function inputForFrozenGeometry(
  scrollContainers: readonly HTMLElement[],
  geometry: DragGeometry,
  input: Input,
) {
  const scrollDelta =
    verticalScrollOffset(scrollContainers) - geometry.verticalScrollOffset;
  return scrollDelta === 0
    ? input
    : { ...input, clientY: input.clientY + scrollDelta };
}

function rowGeometryAtInput(geometry: DragGeometry, input: Input) {
  return geometry.rows.find((row) => containsPoint(row.rect, input));
}

function sourceRowGeometry(
  geometry: DragGeometry,
  source: SourceData,
): FrozenRowGeometry | null {
  return (
    geometry.rows.find((row) =>
      row.columns.some((column) =>
        column.element.contains(source.sourceElement),
      ),
    ) ?? null
  );
}

function edgeForSingleRow(rect: FrozenRect, input: Input) {
  const verticalBand = verticalDropBand(rect);
  if (input.clientY <= rect.top + verticalBand) return "top" as const;
  if (input.clientY >= rect.bottom - verticalBand) return "bottom" as const;
  return input.clientX < rect.left + rect.width / 2
    ? ("left" as const)
    : ("right" as const);
}

function targetForVerticalRowExit(
  row: FrozenRowGeometry,
  input: Input,
  edge: "top" | "bottom",
) {
  return attachClosestEdge(
    {
      kind: PORTFOLIO_TARGET,
      targetPosition: row.targetPosition,
      columnIndex: null,
    },
    { input, element: row.element, allowedEdges: [edge] },
  );
}

function targetForColumnLane(
  source: SourceData,
  row: FrozenRowGeometry,
  input: Input,
): Record<string | symbol, unknown> | null {
  const columns = row.columns;
  const column =
    columns.find((candidate) => containsPoint(candidate.rect, input)) ??
    columns.reduce<FrozenColumnGeometry | null>((nearest, candidate) => {
      if (!nearest) return candidate;
      const candidateDistance = Math.abs(
        input.clientX - (candidate.rect.left + candidate.rect.right) / 2,
      );
      const nearestDistance = Math.abs(
        input.clientX - (nearest.rect.left + nearest.rect.right) / 2,
      );
      return candidateDistance < nearestDistance ? candidate : nearest;
    }, null);
  if (!column) return null;
  if (source.sourceElement.closest('[data-type="column"]') === column.element) {
    return null;
  }
  if (
    columns.length >= MAX_COLUMNS &&
    !sourceCanReplaceOwnColumn(source, row.element)
  ) {
    return null;
  }
  return attachClosestEdge(
    {
      kind: PORTFOLIO_TARGET,
      targetPosition: row.targetPosition,
      columnIndex: columns.indexOf(column),
    },
    {
      input,
      element: column.element,
      allowedEdges: [
        input.clientX < column.rect.left + column.rect.width / 2
          ? "left"
          : "right",
      ],
    },
  );
}

function targetForGridSource(
  source: SourceData,
  row: FrozenRowGeometry,
  input: Input,
): Record<string | symbol, unknown> | null {
  // While the pointer remains in the source row, vertical movement extracts
  // the block and horizontal movement reorders its lanes.
  const verticalBand = verticalDropBand(row.rect);
  if (input.clientY <= row.rect.top + verticalBand) {
    return targetForVerticalRowExit(row, input, "top");
  }
  if (input.clientY >= row.rect.bottom - verticalBand) {
    return targetForVerticalRowExit(row, input, "bottom");
  }
  if (input.clientX < row.rect.left || input.clientX > row.rect.right) {
    return null;
  }
  return targetForColumnLane(source, row, input);
}

function targetForDestinationRow(
  source: SourceData,
  rowGeometry: FrozenRowGeometry,
  input: Input,
): Record<string | symbol, unknown> | null {
  const { element: row, targetPosition, rect: rowRect } = rowGeometry;

  if (!row.matches('[data-type="columns"]')) {
    if (source.sourcePosition === targetPosition) return null;
    const edge = edgeForSingleRow(rowRect, input);
    return attachClosestEdge(
      { kind: PORTFOLIO_TARGET, targetPosition, columnIndex: null },
      {
        input,
        element: row,
        // The single allowed edge encodes the result without remeasuring the
        // preview-mutated element inside `attachClosestEdge`.
        allowedEdges: [edge],
      },
    );
  }

  const verticalBand = verticalDropBand(rowRect);
  if (
    input.clientY <= rowRect.top + verticalBand ||
    input.clientY >= rowRect.bottom - verticalBand
  ) {
    const edge =
      input.clientY < rowRect.top + rowRect.height / 2 ? "top" : "bottom";
    return attachClosestEdge(
      { kind: PORTFOLIO_TARGET, targetPosition, columnIndex: null },
      { input, element: row, allowedEdges: [edge] },
    );
  }

  return targetForColumnLane(source, rowGeometry, input);
}

function targetDataAtInput(
  source: SourceData,
  input: Input,
  geometry: DragGeometry,
): Record<string | symbol, unknown> | null {
  const sourceRow = sourceRowGeometry(geometry, source);
  const rowGeometry = rowGeometryAtInput(geometry, input);
  if (rowGeometry && rowGeometry !== sourceRow) {
    return targetForDestinationRow(source, rowGeometry, input);
  }
  if (sourceRow) return targetForGridSource(source, sourceRow, input);
  return rowGeometry
    ? targetForDestinationRow(source, rowGeometry, input)
    : null;
}

function PortfolioDndController({ editor }: { editor: Editor }) {
  useEffect(() => {
    const root = editor.view.dom;
    const scrollContainers = verticalScrollContainers(root);
    const handleCleanups = new Map<HTMLElement, () => void>();
    let dragGeometry: DragGeometry | null = null;

    const registerHandle = (handle: HTMLElement) => {
      if (handleCleanups.has(handle)) return;
      const cleanup = draggable({
        element: handle,
        getInitialData: () =>
          sourceForHandle(editor, handle) ?? { kind: "inactive" },
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          const source = sourceForHandle(editor, handle);
          if (!source) return;
          const width = Math.min(
            520,
            Math.max(240, source.sourceElement.getBoundingClientRect().width),
          );
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({ x: "16px", y: "12px" }),
            render: ({ container }) => {
              const preview = document.createElement("div");
              preview.className = "ramzy-dnd-native-preview";
              preview.style.width = `${width}px`;
              const clone = cloneForNativePreview(source.sourceElement);
              clone.style.width = "100%";
              clone.style.maxWidth = "none";
              clone.style.margin = "0";
              preview.appendChild(clone);
              container.appendChild(preview);
            },
          });
        },
      });
      handleCleanups.set(handle, cleanup);
    };

    const refreshRegistrations = () => {
      for (const [element, cleanup] of handleCleanups) {
        if (!element.isConnected) {
          cleanup();
          handleCleanups.delete(element);
        }
      }
      const globalHandle = root.parentElement?.querySelector<HTMLElement>(
        ":scope > .drag-handle",
      );
      if (globalHandle) registerHandle(globalHandle);
      root
        .querySelectorAll<HTMLElement>("[data-ramzy-block-drag-handle]")
        .forEach(registerHandle);
    };

    refreshRegistrations();
    const observer = new MutationObserver(refreshRegistrations);
    const observerRoot = root.parentElement?.querySelector(
      ":scope > .drag-handle",
    )
      ? root.parentElement
      : root;
    observer.observe(observerRoot, {
      childList: true,
      subtree: true,
    });

    const clearPreview = () => setPortfolioDndPreview(editor, null);
    const setDragUiActive = (active: boolean) => {
      document.body.classList.toggle(PORTFOLIO_DND_ACTIVE_CLASS, active);
    };
    // Native lifecycle listeners cover deliberate no-op lanes where Pragmatic
    // DnD correctly exposes no target and therefore may not advance its target
    // callbacks. The editor's unrelated resize/drop guides must still remain
    // hidden until the physical drag ends.
    const onNativeDragStart = (event: DragEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("[data-ramzy-block-drag-handle]")
      ) {
        setDragUiActive(true);
      }
    };
    const onNativeDragEnd = () => setDragUiActive(false);
    root.addEventListener("dragstart", onNativeDragStart, true);
    root.addEventListener("dragend", onNativeDragEnd, true);
    const dataAtInput = (source: SourceData, input: Input) => {
      dragGeometry ??= captureDragGeometry(editor, scrollContainers);
      return targetDataAtInput(
        source,
        inputForFrozenGeometry(scrollContainers, dragGeometry, input),
        dragGeometry,
      );
    };
    const targetCleanup = dropTargetForElements({
      element: root,
      canDrop: ({ source, input }) =>
        isSourceData(source.data) && dataAtInput(source.data, input) !== null,
      getData: ({ source, input }) =>
        isSourceData(source.data)
          ? (dataAtInput(source.data, input) ?? { kind: "inactive" })
          : { kind: "inactive" },
    });
    const monitorCleanup = monitorForElements({
      canMonitor: ({ source }) => isSourceData(source.data),
      onDragStart: () => {
        clearPreview();
        setDragUiActive(true);
        dragGeometry = captureDragGeometry(editor, scrollContainers);
      },
      onDropTargetChange: ({ source, location }) => {
        if (!isSourceData(source.data)) return;
        setPortfolioDndPreview(
          editor,
          previewFromLocation(source.data, location.current.dropTargets),
        );
      },
      onDrag: ({ source, location }) => {
        if (!isSourceData(source.data)) return;
        setPortfolioDndPreview(
          editor,
          previewFromLocation(source.data, location.current.dropTargets),
        );
      },
      onDrop: ({ source, location }) => {
        setDragUiActive(false);
        if (!isSourceData(source.data)) return;
        const preview = previewFromLocation(
          source.data,
          location.current.dropTargets,
        );
        clearPreview();
        dragGeometry = null;
        if (!preview) return;
        const transaction =
          preview.edge === "left" || preview.edge === "right"
            ? createPortfolioGridDropTransaction(
                editor.state,
                preview.targetPosition,
                preview.edge,
                preview.columnIndex,
                source.data.sourcePosition,
              )
            : createPortfolioVerticalDropTransaction(
                editor.state,
                preview.targetPosition,
                preview.edge,
                source.data.sourcePosition,
              );
        if (transaction) editor.view.dispatch(transaction);
      },
    });

    const autoScrollCleanups = scrollContainers.map((element) =>
      autoScrollForElements({
        element,
        canScroll: ({ source }) => isSourceData(source.data),
        getAllowedAxis: () => "vertical",
      }),
    );
    const cleanup = combine(
      targetCleanup,
      monitorCleanup,
      autoScrollWindowForElements({
        canScroll: ({ source }) => isSourceData(source.data),
        getAllowedAxis: () => "vertical",
      }),
      ...autoScrollCleanups,
    );
    return () => {
      observer.disconnect();
      root.removeEventListener("dragstart", onNativeDragStart, true);
      root.removeEventListener("dragend", onNativeDragEnd, true);
      cleanup();
      handleCleanups.forEach((unbind) => unbind());
      dragGeometry = null;
      setDragUiActive(false);
      clearPreview();
    };
  }, [editor]);

  return null;
}

export function PortfolioDnd({ editor }: { editor: Editor }) {
  if (editor.isDestroyed || !editor.isEditable) return null;
  return <PortfolioDndController editor={editor} />;
}
