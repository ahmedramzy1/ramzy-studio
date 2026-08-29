import { Fragment } from "@tiptap/pm/model";
import {
  type EditorState,
  NodeSelection,
  type Transaction,
} from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";

type GridSide = "left" | "right";
export type PortfolioDropEdge = GridSide | "top" | "bottom";

interface GridDropTarget {
  side: GridSide;
  topLevelPosition: number;
  topLevelElement: HTMLElement;
  indicatorElement: HTMLElement;
  columnIndex: number | null;
}

const activeIndicators = new WeakMap<EditorView, HTMLElement>();

function topLevelElementAtPoint(
  view: EditorView,
  event: DragEvent,
): HTMLElement | null {
  const hit = document.elementFromPoint(event.clientX, event.clientY);
  if (!(hit instanceof HTMLElement) || !view.dom.contains(hit)) {
    return null;
  }
  let element: HTMLElement = hit;

  while (element.parentElement && element.parentElement !== view.dom) {
    element = element.parentElement as HTMLElement;
  }

  return element.parentElement === view.dom ? element : null;
}

function sideFromPoint(element: HTMLElement, clientX: number): GridSide | null {
  const rect = element.getBoundingClientRect();
  const edgeWidth = Math.min(160, Math.max(64, rect.width * 0.28));
  if (clientX <= rect.left + edgeWidth) return "left";
  if (clientX >= rect.right - edgeWidth) return "right";
  return null;
}

function findGridDropTarget(
  view: EditorView,
  event: DragEvent,
): GridDropTarget | null {
  if (!view.dragging || event.dataTransfer?.files.length) return null;
  if (!(view.state.selection instanceof NodeSelection)) return null;

  const topLevelElement = topLevelElementAtPoint(view, event);
  if (!topLevelElement) return null;

  let topLevelPosition: number;
  try {
    topLevelPosition = view.posAtDOM(topLevelElement, 0);
  } catch {
    return null;
  }

  const topLevelNode = view.state.doc.nodeAt(topLevelPosition);
  if (!topLevelNode) return null;

  const hit = document.elementFromPoint(event.clientX, event.clientY);
  const columnElement =
    hit instanceof HTMLElement
      ? (hit.closest('[data-type="column"]') as HTMLElement | null)
      : null;
  const insideTargetColumns =
    topLevelNode.type.name === "columns" &&
    columnElement?.parentElement?.matches('[data-type="columns"]');
  const indicatorElement = insideTargetColumns
    ? columnElement
    : topLevelElement;
  if (!indicatorElement) return null;

  const side = sideFromPoint(indicatorElement, event.clientX);
  if (!side) return null;

  const selection = view.state.selection;
  if (
    selection.from === topLevelPosition &&
    selection.to === topLevelPosition + topLevelNode.nodeSize
  ) {
    return null;
  }

  let columnIndex: number | null = null;
  if (insideTargetColumns && columnElement?.parentElement) {
    columnIndex = Array.from(columnElement.parentElement.children).indexOf(
      columnElement,
    );
    if (columnIndex < 0) return null;

  }

  return {
    side,
    topLevelPosition,
    topLevelElement,
    indicatorElement,
    columnIndex,
  };
}

function layoutForCount(count: number): string {
  if (count === 3) return "three_equal";
  if (count === 4) return "four_equal";
  return "two_equal";
}

function rebalanceColumnWidths(nodes: readonly import("@tiptap/pm/model").Node[]) {
  const hasManualWidths = nodes.some(
    (node) => typeof node.attrs.width === "number" && node.attrs.width > 0,
  );
  if (!hasManualWidths) {
    return nodes.map((node) =>
      node.type.create({ ...node.attrs, width: null }, node.content, node.marks),
    );
  }

  const fallback = 1;
  const total = nodes.reduce(
    (sum, node) =>
      sum +
      (typeof node.attrs.width === "number" && node.attrs.width > 0
        ? node.attrs.width
        : fallback),
    0,
  );
  const average = total / nodes.length;
  return nodes.map((node) => {
    const width =
      typeof node.attrs.width === "number" && node.attrs.width > 0
        ? node.attrs.width
        : fallback;
    return node.type.create(
      { ...node.attrs, width: Number((width / average).toFixed(4)) },
      node.content,
      node.marks,
    );
  });
}

export function createPortfolioGridDropTransaction(
  state: EditorState,
  targetPosition: number,
  side: GridSide,
  columnIndex: number | null,
): Transaction | null {
  if (!(state.selection instanceof NodeSelection)) return null;

  const draggedNode = state.selection.node;
  const columnsType = state.schema.nodes.columns;
  const columnType = state.schema.nodes.column;
  if (!columnsType || !columnType || !draggedNode.isBlock) return null;

  const originalTargetNode = state.doc.nodeAt(targetPosition);
  const selectionInsideTargetColumns =
    originalTargetNode?.type === columnsType &&
    state.selection.from > targetPosition &&
    state.selection.to < targetPosition + originalTargetNode.nodeSize;

  if (selectionInsideTargetColumns && originalTargetNode) {
    if (columnIndex === null) return null;

    let sourceColumnIndex = -1;
    let sourceBlockIndex = -1;
    let columnPosition = targetPosition + 1;
    for (let columnIndexCursor = 0; columnIndexCursor < originalTargetNode.childCount; columnIndexCursor++) {
      const currentColumn = originalTargetNode.child(columnIndexCursor);
      let blockPosition = columnPosition + 1;
      for (let blockIndex = 0; blockIndex < currentColumn.childCount; blockIndex++) {
        const block = currentColumn.child(blockIndex);
        if (
          state.selection.from === blockPosition &&
          state.selection.to === blockPosition + block.nodeSize
        ) {
          sourceColumnIndex = columnIndexCursor;
          sourceBlockIndex = blockIndex;
          break;
        }
        blockPosition += block.nodeSize;
      }
      if (sourceColumnIndex >= 0) break;
      columnPosition += currentColumn.nodeSize;
    }

    if (sourceColumnIndex < 0 || sourceColumnIndex === columnIndex) return null;

    const children = Array.from(
      { length: originalTargetNode.childCount },
      (_, index) => originalTargetNode.child(index),
    );
    const sourceColumn = children[sourceColumnIndex];
    const remainingBlocks = Array.from(
      { length: sourceColumn.childCount },
      (_, index) => sourceColumn.child(index),
    ).filter((_, index) => index !== sourceBlockIndex);

    let adjustedTargetIndex = columnIndex;
    if (remainingBlocks.length === 0) {
      children.splice(sourceColumnIndex, 1);
      if (sourceColumnIndex < adjustedTargetIndex) adjustedTargetIndex -= 1;
    } else {
      children[sourceColumnIndex] = sourceColumn.type.create(
        sourceColumn.attrs,
        Fragment.from(remainingBlocks),
      );
    }

    const insertionIndex =
      side === "left" ? adjustedTargetIndex : adjustedTargetIndex + 1;
    children.splice(insertionIndex, 0, columnType.create(null, draggedNode));
    if (children.length > 4) return null;

    const balancedChildren = rebalanceColumnWidths(children);

    const replacement = columnsType.create(
      {
        ...originalTargetNode.attrs,
        layout: layoutForCount(children.length),
      },
      Fragment.from(balancedChildren),
    );
    return state.tr
      .replaceWith(
        targetPosition,
        targetPosition + originalTargetNode.nodeSize,
        replacement,
      )
      .scrollIntoView();
  }

  const tr = state.tr.delete(state.selection.from, state.selection.to);
  const mappedTargetPosition = tr.mapping.map(targetPosition);
  const targetNode = tr.doc.nodeAt(mappedTargetPosition);
  if (!targetNode) return null;

  if (targetNode.type === columnsType) {
    if (columnIndex === null || targetNode.childCount >= 4) return null;

    const children = Array.from({ length: targetNode.childCount }, (_, index) =>
      targetNode.child(index),
    );
    const insertionIndex = side === "left" ? columnIndex : columnIndex + 1;
    children.splice(insertionIndex, 0, columnType.create(null, draggedNode));

    const balancedChildren = rebalanceColumnWidths(children);

    const replacement = columnsType.create(
      {
        ...targetNode.attrs,
        layout: layoutForCount(children.length),
      },
      Fragment.from(balancedChildren),
    );
    tr.replaceWith(
      mappedTargetPosition,
      mappedTargetPosition + targetNode.nodeSize,
      replacement,
    );
  } else {
    const draggedColumn = columnType.create(null, draggedNode);
    const targetColumn = columnType.create(null, targetNode);
    const children =
      side === "left"
        ? [draggedColumn, targetColumn]
        : [targetColumn, draggedColumn];
    const replacement = columnsType.create(
      { layout: "two_equal" },
      Fragment.from(children),
    );
    tr.replaceWith(
      mappedTargetPosition,
      mappedTargetPosition + targetNode.nodeSize,
      replacement,
    );
  }

  return tr.scrollIntoView();
}

export function createPortfolioVerticalDropTransaction(
  state: EditorState,
  targetPosition: number,
  edge: "top" | "bottom",
): Transaction | null {
  if (!(state.selection instanceof NodeSelection)) return null;

  const draggedNode = state.selection.node;
  const targetNode = state.doc.nodeAt(targetPosition);
  if (!draggedNode.isBlock || !targetNode) return null;

  if (
    state.selection.from === targetPosition &&
    state.selection.to === targetPosition + targetNode.nodeSize
  ) {
    return null;
  }

  const tr = state.tr.delete(state.selection.from, state.selection.to);
  const mappedTarget = tr.mapping.map(targetPosition);
  const mappedTargetNode = tr.doc.nodeAt(mappedTarget);
  if (!mappedTargetNode) return null;

  const insertionPosition =
    edge === "top" ? mappedTarget : mappedTarget + mappedTargetNode.nodeSize;
  return tr.insert(insertionPosition, draggedNode).scrollIntoView();
}

export function clearPortfolioGridDropIndicator(view: EditorView) {
  const active = activeIndicators.get(view);
  active?.classList.remove(
    "ramzy-grid-drop-left",
    "ramzy-grid-drop-right",
  );
  activeIndicators.delete(view);
}

export function updatePortfolioGridDropIndicator(
  view: EditorView,
  event: DragEvent,
): boolean {
  clearPortfolioGridDropIndicator(view);
  const target = findGridDropTarget(view, event);
  if (!target) return false;

  target.indicatorElement.classList.add(`ramzy-grid-drop-${target.side}`);
  activeIndicators.set(view, target.indicatorElement);
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  return true;
}

export function handlePortfolioGridDrop(
  view: EditorView,
  event: DragEvent,
): boolean {
  const target = findGridDropTarget(view, event);
  clearPortfolioGridDropIndicator(view);
  if (!target || !(view.state.selection instanceof NodeSelection)) {
    return false;
  }

  const tr = createPortfolioGridDropTransaction(
    view.state,
    target.topLevelPosition,
    target.side,
    target.columnIndex,
  );
  if (!tr) return false;

  event.preventDefault();
  event.stopPropagation();
  view.dispatch(tr);
  view.dragging = null;
  return true;
}
