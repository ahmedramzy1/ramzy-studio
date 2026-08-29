import { Fragment } from "@tiptap/pm/model";
import { type EditorState, type Transaction } from "@tiptap/pm/state";
import { normalizedColumnWeights } from "./portfolio-grid-layout";

type GridSide = "left" | "right";
export type PortfolioDropEdge = GridSide | "top" | "bottom";

const MAX_PORTFOLIO_COLUMNS = 5;

type SelectedBlockLocation =
  | { kind: "top"; topIndex: number; topPosition: number }
  | {
      kind: "column";
      topIndex: number;
      topPosition: number;
      columnIndex: number;
      blockIndex: number;
    };

function layoutForCount(count: number): string {
  if (count === 3) return "three_equal";
  if (count === 4) return "four_equal";
  if (count === 5) return "five_equal";
  return "two_equal";
}

function selectedBlockLocation(
  state: EditorState,
  sourcePosition = state.selection.from,
): SelectedBlockLocation | null {
  const sourceNode = state.doc.nodeAt(sourcePosition);
  if (!sourceNode?.isBlock) return null;

  let result: SelectedBlockLocation | null = null;
  state.doc.forEach((topNode, topPosition, topIndex) => {
    if (result) return;
    if (sourcePosition === topPosition) {
      result = { kind: "top", topIndex, topPosition };
      return;
    }
    if (topNode.type.name !== "columns") return;

    let columnPosition = topPosition + 1;
    for (let columnIndex = 0; columnIndex < topNode.childCount; columnIndex++) {
      const column = topNode.child(columnIndex);
      let blockPosition = columnPosition + 1;
      for (let blockIndex = 0; blockIndex < column.childCount; blockIndex++) {
        const block = column.child(blockIndex);
        if (sourcePosition === blockPosition) {
          result = {
            kind: "column",
            topIndex,
            topPosition,
            columnIndex,
            blockIndex,
          };
          return;
        }
        blockPosition += block.nodeSize;
      }
      columnPosition += column.nodeSize;
    }
  });
  return result;
}

function blocksInColumn(column: import("@tiptap/pm/model").Node) {
  return Array.from({ length: column.childCount }, (_, index) =>
    column.child(index),
  );
}

function isEmptyParagraph(node: import("@tiptap/pm/model").Node): boolean {
  return node.type.name === "paragraph" && node.content.size === 0;
}

function editableColumnForBlock(
  columnType: import("@tiptap/pm/model").NodeType,
  paragraphType: import("@tiptap/pm/model").NodeType,
  block: import("@tiptap/pm/model").Node,
) {
  const content = block.isTextblock
    ? Fragment.from(block)
    : Fragment.from([block, paragraphType.create()]);
  return columnType.create(null, content);
}

function ensureEditableColumn(
  column: import("@tiptap/pm/model").Node,
  paragraphType: import("@tiptap/pm/model").NodeType,
) {
  const last = column.lastChild;
  if (!last || last.isTextblock) return column;
  return column.type.create(
    column.attrs,
    column.content.append(Fragment.from(paragraphType.create())),
    column.marks,
  );
}

function gridAfterRemovingBlock(
  columnsNode: import("@tiptap/pm/model").Node,
  sourceColumnIndex: number,
  sourceBlockIndex: number,
): import("@tiptap/pm/model").Node[] {
  const columns = Array.from({ length: columnsNode.childCount }, (_, index) =>
    columnsNode.child(index),
  );
  const sourceColumn = columns[sourceColumnIndex];
  const remainingBlocks = blocksInColumn(sourceColumn).filter(
    (_, index) => index !== sourceBlockIndex,
  );
  if (remainingBlocks.every(isEmptyParagraph)) {
    columns.splice(sourceColumnIndex, 1);
  } else {
    columns[sourceColumnIndex] = sourceColumn.type.create(
      sourceColumn.attrs,
      Fragment.from(remainingBlocks),
      sourceColumn.marks,
    );
  }

  if (columns.length === 0) return [];
  if (columns.length === 1) return blocksInColumn(columns[0]);
  return [
    columnsNode.type.create(
      { ...columnsNode.attrs, layout: layoutForCount(columns.length) },
      Fragment.from(rebalanceColumnWidths(columns)),
      columnsNode.marks,
    ),
  ];
}

function topLevelNodesWithoutSelection(
  state: EditorState,
  source: SelectedBlockLocation,
) {
  const topNodes = Array.from({ length: state.doc.childCount }, (_, index) =>
    state.doc.child(index),
  );
  if (source.kind === "top") {
    topNodes.splice(source.topIndex, 1);
    return topNodes;
  }

  const sourceRow = state.doc.child(source.topIndex);
  topNodes.splice(
    source.topIndex,
    1,
    ...gridAfterRemovingBlock(sourceRow, source.columnIndex, source.blockIndex),
  );
  return topNodes;
}

function replaceDocumentContent(
  state: EditorState,
  nodes: readonly import("@tiptap/pm/model").Node[],
) {
  return state.tr
    .replaceWith(0, state.doc.content.size, Fragment.from(nodes))
    .scrollIntoView();
}

function rebalanceColumnWidths(
  nodes: readonly import("@tiptap/pm/model").Node[],
) {
  const weights = normalizedColumnWeights(
    nodes.map((node) =>
      typeof node.attrs.width === "number" && node.attrs.width > 0
        ? node.attrs.width
        : 1,
    ),
  );
  return nodes.map((node, index) => {
    return node.type.create(
      { ...node.attrs, width: weights[index] },
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
  sourcePosition = state.selection.from,
): Transaction | null {
  const draggedNode = state.doc.nodeAt(sourcePosition);
  const columnsType = state.schema.nodes.columns;
  const columnType = state.schema.nodes.column;
  const paragraphType = state.schema.nodes.paragraph;
  if (!columnsType || !columnType || !paragraphType || !draggedNode?.isBlock) {
    return null;
  }

  const source = selectedBlockLocation(state, sourcePosition);
  if (!source || draggedNode.type === columnsType) return null;

  const originalTargetNode = state.doc.nodeAt(targetPosition);
  const selectionInsideTargetColumns =
    source.kind === "column" && source.topPosition === targetPosition;

  if (selectionInsideTargetColumns && originalTargetNode) {
    if (columnIndex === null) return null;

    const sourceColumnIndex = source.columnIndex;
    const sourceBlockIndex = source.blockIndex;

    const children = Array.from(
      { length: originalTargetNode.childCount },
      (_, index) => originalTargetNode.child(index),
    );
    const sourceColumn = children[sourceColumnIndex];
    const remainingBlocks = blocksInColumn(sourceColumn).filter(
      (_, index) => index !== sourceBlockIndex,
    );

    if (
      sourceColumnIndex === columnIndex &&
      remainingBlocks.every(isEmptyParagraph)
    ) {
      return null;
    }

    let adjustedTargetIndex = columnIndex;
    if (remainingBlocks.every(isEmptyParagraph)) {
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
    children.splice(
      insertionIndex,
      0,
      editableColumnForBlock(columnType, paragraphType, draggedNode),
    );
    if (children.length > MAX_PORTFOLIO_COLUMNS) return null;

    const balancedChildren = rebalanceColumnWidths(
      children.map((column) => ensureEditableColumn(column, paragraphType)),
    );

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

  const targetNode = originalTargetNode;
  if (!targetNode) return null;
  const topNodes = topLevelNodesWithoutSelection(state, source);
  const targetIndex = topNodes.indexOf(targetNode);
  if (targetIndex < 0) return null;

  if (targetNode.type === columnsType) {
    if (
      columnIndex === null ||
      targetNode.childCount >= MAX_PORTFOLIO_COLUMNS
    ) {
      return null;
    }

    const children = Array.from({ length: targetNode.childCount }, (_, index) =>
      targetNode.child(index),
    );
    const insertionIndex = side === "left" ? columnIndex : columnIndex + 1;
    children.splice(
      insertionIndex,
      0,
      editableColumnForBlock(columnType, paragraphType, draggedNode),
    );

    const balancedChildren = rebalanceColumnWidths(
      children.map((column) => ensureEditableColumn(column, paragraphType)),
    );

    const replacement = columnsType.create(
      {
        ...targetNode.attrs,
        layout: layoutForCount(children.length),
      },
      Fragment.from(balancedChildren),
    );
    topNodes.splice(targetIndex, 1, replacement);
  } else {
    const draggedColumn = editableColumnForBlock(
      columnType,
      paragraphType,
      draggedNode,
    );
    const targetColumn = editableColumnForBlock(
      columnType,
      paragraphType,
      targetNode,
    );
    const children =
      side === "left"
        ? [draggedColumn, targetColumn]
        : [targetColumn, draggedColumn];
    const replacement = columnsType.create(
      { layout: "two_equal" },
      Fragment.from(children),
    );
    topNodes.splice(targetIndex, 1, replacement);
  }

  return replaceDocumentContent(state, topNodes);
}

export function createPortfolioVerticalDropTransaction(
  state: EditorState,
  targetPosition: number,
  edge: "top" | "bottom",
  sourcePosition = state.selection.from,
): Transaction | null {
  const draggedNode = state.doc.nodeAt(sourcePosition);
  const targetNode = state.doc.nodeAt(targetPosition);
  if (!draggedNode?.isBlock || !targetNode) return null;

  const source = selectedBlockLocation(state, sourcePosition);
  if (!source || draggedNode.type.name === "columns") return null;

  if (sourcePosition === targetPosition) {
    return null;
  }

  if (source.kind === "column" && source.topPosition === targetPosition) {
    const topNodes = Array.from({ length: state.doc.childCount }, (_, index) =>
      state.doc.child(index),
    );
    const remaining = gridAfterRemovingBlock(
      targetNode,
      source.columnIndex,
      source.blockIndex,
    );
    const replacement =
      edge === "top"
        ? [draggedNode, ...remaining]
        : [...remaining, draggedNode];
    topNodes.splice(source.topIndex, 1, ...replacement);
    return replaceDocumentContent(state, topNodes);
  }

  const topNodes = topLevelNodesWithoutSelection(state, source);
  const targetIndex = topNodes.indexOf(targetNode);
  if (targetIndex < 0) return null;
  topNodes.splice(
    edge === "top" ? targetIndex : targetIndex + 1,
    0,
    draggedNode,
  );
  return replaceDocumentContent(state, topNodes);
}
