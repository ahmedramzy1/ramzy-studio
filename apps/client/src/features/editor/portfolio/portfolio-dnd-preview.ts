export type DropEdge = "top" | "bottom" | "left" | "right";

export type PortfolioDropTargetCandidate<T> = {
  element: HTMLElement;
  data: T;
  priority: number;
};

export function portfolioDropTargetAtPoint<T>(
  candidates: PortfolioDropTargetCandidate<T>[],
  pointer: { x: number; y: number },
  hitElements = document.elementsFromPoint(pointer.x, pointer.y),
): PortfolioDropTargetCandidate<T> | null {
  const direct = candidates.filter(({ element }) =>
    hitElements.some((hit) => hit === element || element.contains(hit)),
  );
  const containing = direct.length
    ? direct
    : candidates.filter(({ element }) => {
        const rect = element.getBoundingClientRect();
        return (
          pointer.x >= rect.left &&
          pointer.x <= rect.right &&
          pointer.y >= rect.top &&
          pointer.y <= rect.bottom
        );
      });

  return (
    containing.sort((left, right) => {
      if (left.priority !== right.priority) {
        return right.priority - left.priority;
      }
      const leftRect = left.element.getBoundingClientRect();
      const rightRect = right.element.getBoundingClientRect();
      return (
        leftRect.width * leftRect.height - rightRect.width * rightRect.height
      );
    })[0] ?? null
  );
}

export function portfolioPreviewColumnPlan(
  columnCount: number,
  targetColumnIndex: number,
  edge: "left" | "right",
  sourceColumnIndex = -1,
  sourceColumnBecomesEmpty = false,
) {
  const hiddenSourceIndex =
    sourceColumnBecomesEmpty && sourceColumnIndex >= 0
      ? sourceColumnIndex
      : null;
  const visibleColumnIndexes = Array.from(
    { length: columnCount },
    (_, index) => index,
  ).filter((index) => index !== hiddenSourceIndex);
  let insertionIndex =
    edge === "left" ? targetColumnIndex : targetColumnIndex + 1;
  if (hiddenSourceIndex !== null && hiddenSourceIndex < insertionIndex) {
    insertionIndex -= 1;
  }
  insertionIndex = Math.max(
    0,
    Math.min(insertionIndex, visibleColumnIndexes.length),
  );

  const orders = Array.from(
    { length: columnCount },
    () => null as number | null,
  );
  visibleColumnIndexes.forEach((columnIndex, visibleIndex) => {
    orders[columnIndex] =
      visibleIndex < insertionIndex ? visibleIndex * 2 : (visibleIndex + 1) * 2;
  });

  return {
    hiddenSourceIndex,
    insertionIndex,
    futureColumnCount: visibleColumnIndexes.length + 1,
    orders,
  };
}

export function closestPortfolioDropEdge(
  rect: Pick<DOMRect, "left" | "right" | "top" | "bottom" | "width" | "height">,
  pointer: { x: number; y: number },
  allowedEdges: DropEdge[],
): DropEdge {
  const distances: Record<DropEdge, number> = {
    left: Math.abs(pointer.x - rect.left) / Math.max(rect.width, 1),
    right: Math.abs(rect.right - pointer.x) / Math.max(rect.width, 1),
    top: Math.abs(pointer.y - rect.top) / Math.max(rect.height, 1),
    bottom: Math.abs(rect.bottom - pointer.y) / Math.max(rect.height, 1),
  };
  return allowedEdges.reduce((best, edge) =>
    distances[edge] < distances[best] ? edge : best,
  );
}
