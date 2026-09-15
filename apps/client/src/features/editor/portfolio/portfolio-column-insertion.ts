import type { Node as ProseMirrorNode } from "@tiptap/pm/model";

export type PortfolioColumnInsertionPoint = {
  columnIndex: number;
  insertionPosition: number;
  emptyParagraphPosition: number | null;
};

export function portfolioColumnInsertionPoints(
  row: ProseMirrorNode,
  rowPosition: number,
): PortfolioColumnInsertionPoint[] {
  if (row.type.name !== "columns") return [];

  const points: PortfolioColumnInsertionPoint[] = [];
  let columnPosition = rowPosition + 1;
  row.forEach((column, _columnOffset, columnIndex) => {
    let blockPosition = columnPosition + 1;
    let emptyParagraphPosition: number | null = null;
    column.forEach((block, _blockOffset, blockIndex) => {
      if (
        blockIndex === column.childCount - 1 &&
        block.type.name === "paragraph" &&
        block.content.size === 0
      ) {
        emptyParagraphPosition = blockPosition;
      }
      blockPosition += block.nodeSize;
    });
    points.push({
      columnIndex,
      insertionPosition: columnPosition + column.nodeSize - 1,
      emptyParagraphPosition,
    });
    columnPosition += column.nodeSize;
  });
  return points;
}
