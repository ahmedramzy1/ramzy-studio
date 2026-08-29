export type DropEdge = "top" | "bottom" | "left" | "right";

export function cloneForPortfolioDndPreview(
  element: HTMLElement,
): HTMLElement {
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
  clone.style.cssText += ";opacity:1;pointer-events:none;width:100%;max-width:100%";
  return clone;
}

function previewColumn(content: HTMLElement): HTMLElement {
  const column = document.createElement("div");
  column.dataset.type = "column";
  column.appendChild(content);
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
    const columns = [
      previewColumn(cloneForPortfolioDndPreview(rowElement)),
      previewColumn(sourceClone),
    ];
    if (edge === "left") columns.reverse();
    row.append(...columns);
    return row;
  }

  const row = cloneForPortfolioDndPreview(rowElement);
  const sourceColumn = sourceElement.closest<HTMLElement>('[data-type="column"]');
  let insertionIndex = edge === "left" ? columnIndex : columnIndex + 1;
  if (sourceColumn?.parentElement === rowElement) {
    const sourceColumnIndex = Array.from(rowElement.children).indexOf(sourceColumn);
    const clonedSourceColumn = row.children[sourceColumnIndex];
    if (clonedSourceColumn) {
      const sourceBlockIndex = Array.from(sourceColumn.children).indexOf(sourceElement);
      clonedSourceColumn.children[sourceBlockIndex]?.remove();
      if (clonedSourceColumn.children.length === 0) {
        clonedSourceColumn.remove();
        if (sourceColumnIndex < insertionIndex) insertionIndex -= 1;
      }
    }
  }

  row.insertBefore(
    previewColumn(sourceClone),
    row.children[Math.max(0, insertionIndex)] ?? null,
  );
  const count = row.children.length;
  row.dataset.layout =
    count === 3
      ? "three_equal"
      : count === 4
        ? "four_equal"
        : count === 5
          ? "five_equal"
          : "two_equal";
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
