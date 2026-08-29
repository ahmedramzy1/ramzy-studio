export type PortfolioDropEdge = "top" | "bottom" | "left" | "right";

export type PortfolioDomDropIntent = {
  rowElement: HTMLElement;
  columnIndex: number | null;
  edge: PortfolioDropEdge;
};

type Point = { x: number; y: number };

const MAX_COLUMNS = 5;

function rectContainsY(rect: DOMRect, y: number) {
  return y >= rect.top && y <= rect.bottom;
}

function meaningfulChildren(column: HTMLElement | null) {
  if (!column) return 0;
  return Array.from(column.children).filter(
    (child) =>
      !(
        child instanceof HTMLParagraphElement &&
        child.textContent?.trim().length === 0
      ),
  ).length;
}

function sourceGrid(sourceElement: HTMLElement) {
  const column = sourceElement.closest<HTMLElement>('[data-type="column"]');
  const row = column?.parentElement?.matches('[data-type="columns"]')
    ? column.parentElement
    : null;
  return { column, row };
}

function closestRow(rows: HTMLElement[], pointer: Point): HTMLElement | null {
  const containing = rows.filter((row) =>
    rectContainsY(row.getBoundingClientRect(), pointer.y),
  );
  if (containing.length) {
    return containing.sort((left, right) => {
      const a = left.getBoundingClientRect();
      const b = right.getBoundingClientRect();
      return a.height - b.height;
    })[0];
  }

  const nearby = rows
    .map((row) => {
      const rect = row.getBoundingClientRect();
      return {
        row,
        distance: Math.min(
          Math.abs(pointer.y - rect.top),
          Math.abs(pointer.y - rect.bottom),
        ),
      };
    })
    .sort((left, right) => left.distance - right.distance)[0];
  return nearby && nearby.distance <= 72 ? nearby.row : null;
}

function closestColumn(row: HTMLElement, pointerX: number) {
  const columns = Array.from(row.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.dataset.type === "column",
  );
  const containing = columns.find((column) => {
    const rect = column.getBoundingClientRect();
    return pointerX >= rect.left && pointerX <= rect.right;
  });
  if (containing) return { column: containing, columns };
  const column = columns
    .map((candidate) => {
      const rect = candidate.getBoundingClientRect();
      return {
        candidate,
        distance: Math.min(
          Math.abs(pointerX - rect.left),
          Math.abs(pointerX - rect.right),
        ),
      };
    })
    .sort((left, right) => left.distance - right.distance)[0]?.candidate;
  return column ? { column, columns } : null;
}

export function resolvePortfolioDropIntent(
  editorDom: HTMLElement,
  sourceElement: HTMLElement,
  pointer: Point,
): PortfolioDomDropIntent | null {
  const editorRect = editorDom.getBoundingClientRect();
  if (
    pointer.x < editorRect.left - 48 ||
    pointer.x > editorRect.right + 48 ||
    pointer.y < editorRect.top - 72 ||
    pointer.y > editorRect.bottom + 72
  ) {
    return null;
  }

  const rows = Array.from(editorDom.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement &&
      child.getBoundingClientRect().width > 0 &&
      child.getBoundingClientRect().height > 0,
  );
  const row = closestRow(rows, pointer);
  if (!row) return null;
  const rowRect = row.getBoundingClientRect();
  const source = sourceGrid(sourceElement);

  const verticalBand = Math.min(84, Math.max(32, rowRect.height * 0.18));
  const edgeCandidates: Array<{
    edge: PortfolioDropEdge;
    score: number;
    columnIndex: number | null;
  }> = [];
  const topDistance = Math.abs(pointer.y - rowRect.top);
  const bottomDistance = Math.abs(pointer.y - rowRect.bottom);
  if (topDistance <= verticalBand) {
    edgeCandidates.push({
      edge: "top",
      score: topDistance / verticalBand,
      columnIndex: null,
    });
  }
  if (bottomDistance <= verticalBand) {
    edgeCandidates.push({
      edge: "bottom",
      score: bottomDistance / verticalBand,
      columnIndex: null,
    });
  }

  const grid = row.matches('[data-type="columns"]');
  const target = grid
    ? closestColumn(row, pointer.x)
    : { column: row, columns: [row] };
  if (target) {
    const rect = target.column.getBoundingClientRect();
    const horizontalBand = Math.min(160, Math.max(56, rect.width * 0.34));
    const leftDistance = Math.abs(pointer.x - rect.left);
    const rightDistance = Math.abs(pointer.x - rect.right);
    const sourceIsInsideRow = source.row === row;
    const canAddColumn =
      !grid ||
      target.columns.length < MAX_COLUMNS ||
      (sourceIsInsideRow && meaningfulChildren(source.column) === 1);
    if (canAddColumn && leftDistance <= horizontalBand) {
      edgeCandidates.push({
        edge: "left",
        score: leftDistance / horizontalBand,
        columnIndex: grid ? target.columns.indexOf(target.column) : null,
      });
    }
    if (canAddColumn && rightDistance <= horizontalBand) {
      edgeCandidates.push({
        edge: "right",
        score: rightDistance / horizontalBand,
        columnIndex: grid ? target.columns.indexOf(target.column) : null,
      });
    }
  }

  const selected = edgeCandidates.sort(
    (left, right) => left.score - right.score,
  )[0];
  if (!selected) return null;

  const sourceTopRow = source.row ?? sourceElement;
  if (
    sourceTopRow === row &&
    !source.row &&
    selected.columnIndex === null &&
    (selected.edge === "top" || selected.edge === "bottom")
  ) {
    return null;
  }

  return {
    rowElement: row,
    columnIndex: selected.columnIndex,
    edge: selected.edge,
  };
}
