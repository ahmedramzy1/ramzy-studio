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

export function cloneForPortfolioDndPreview(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll<HTMLElement>(
      "[data-drag-handle], [data-ramzy-block-drag-handle], .drag-handle",
    )
    .forEach((handle) => handle.remove());
  clone.querySelectorAll<HTMLElement>("[id]").forEach((node) => {
    node.removeAttribute("id");
  });
  clone.removeAttribute("id");
  clone.classList.remove("ramzy-dnd-source", "ProseMirror-selectednode");
  clone.setAttribute("aria-hidden", "true");
  clone.style.cssText +=
    ";opacity:1;pointer-events:none;width:100%;max-width:100%";
  return clone;
}

function previewColumn(content: HTMLElement): HTMLElement {
  const column = document.createElement("div");
  column.dataset.type = "column";
  column.appendChild(content);
  return column;
}

function incomingPreviewColumn(
  content: HTMLElement,
  edge: "left" | "right",
): HTMLElement {
  const column = previewColumn(content);
  column.classList.add("ramzy-dnd-incoming-column");
  column.dataset.dropEdge = edge;
  return column;
}

export function createPortfolioDndGridPreview(
  sourceElement: HTMLElement,
  rowElement: HTMLElement,
  columnIndex: number | null,
  edge: "left" | "right",
): HTMLElement {
  const sourceClone = cloneForPortfolioDndPreview(sourceElement);
  if (columnIndex === null) {
    const row = document.createElement("div");
    row.dataset.type = "columns";
    row.dataset.layout = "two_equal";
    row.classList.add("ramzy-dnd-preview-grid");
    const columns = [
      previewColumn(cloneForPortfolioDndPreview(rowElement)),
      incomingPreviewColumn(sourceClone, edge),
    ];
    if (edge === "left") columns.reverse();
    row.append(...columns);
    return row;
  }

  const row = cloneForPortfolioDndPreview(rowElement);
  const sourceColumn = sourceElement.closest<HTMLElement>(
    '[data-type="column"]',
  );
  let insertionIndex = edge === "left" ? columnIndex : columnIndex + 1;
  if (sourceColumn?.parentElement === rowElement) {
    const sourceColumnIndex = Array.from(rowElement.children).indexOf(
      sourceColumn,
    );
    const clonedSourceColumn = row.children[sourceColumnIndex];
    if (clonedSourceColumn) {
      const sourceBlockIndex = Array.from(sourceColumn.children).indexOf(
        sourceElement,
      );
      clonedSourceColumn.children[sourceBlockIndex]?.remove();
      if (clonedSourceColumn.children.length === 0) {
        clonedSourceColumn.remove();
        if (sourceColumnIndex < insertionIndex) insertionIndex -= 1;
      }
    }
  }

  row.classList.add("ramzy-dnd-preview-grid");
  row.insertBefore(
    incomingPreviewColumn(sourceClone, edge),
    row.children[Math.max(0, insertionIndex)] ?? null,
  );
  const count = row.children.length;
  row.dataset.layout =
    count === 3 ? "three_equal" : count === 4 ? "four_equal" : "two_equal";
  return row;
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
