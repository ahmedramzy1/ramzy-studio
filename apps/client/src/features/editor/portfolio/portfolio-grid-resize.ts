export type PortfolioGridWidthMode = "normal" | "wide" | "full";

export const MIN_PORTFOLIO_COLUMN_WIDTH = 96;
export const MAX_PORTFOLIO_BLOCK_WIDTH = 1440;
// The drag edge follows the shared 8px spacing foundation. Because outer
// resizing is symmetric, each snap changes total block width by 16px.
export const PORTFOLIO_RESIZE_EDGE_STEP = 8;
export const PORTFOLIO_RESIZE_WIDTH_STEP = PORTFOLIO_RESIZE_EDGE_STEP * 2;
export const PORTFOLIO_VISIBLE_GUIDE_RADIUS = 1;
export const PORTFOLIO_COLUMN_RATIO_STEP_PERCENT = 5;

const PORTFOLIO_COLUMN_RATIO_TARGETS = Array.from(
  { length: 100 / PORTFOLIO_COLUMN_RATIO_STEP_PERCENT - 1 },
  (_, index) => ((index + 1) * PORTFOLIO_COLUMN_RATIO_STEP_PERCENT) / 100,
);

export type PortfolioResizeSnap = {
  width: number;
  mode: PortfolioGridWidthMode | null;
};

export type PortfolioColumnRatioGuide = {
  leftRatio: number;
  rightRatio: number;
  leftWidth: number;
  rightWidth: number;
  label: string;
};

export type PortfolioColumnRatioSnap = {
  leftWidth: number;
  snappedGuide: PortfolioColumnRatioGuide | null;
};

function uniqueSortedWidths(widths: number[]) {
  return Array.from(
    new Set(widths.filter(Number.isFinite).map((width) => Math.round(width))),
  ).sort((left, right) => left - right);
}

export function portfolioResizeGuideWidths(
  minimumWidth: number,
  maximumWidth: number,
): number[] {
  if (
    !Number.isFinite(minimumWidth) ||
    !Number.isFinite(maximumWidth) ||
    maximumWidth < minimumWidth
  ) {
    return [];
  }

  // Anchor the edge rhythm to Normal, not an unrelated zero-width origin.
  const firstGridWidth = minimumWidth;
  const gridWidths: number[] = [];
  for (
    let width = firstGridWidth;
    width <= maximumWidth;
    width += PORTFOLIO_RESIZE_WIDTH_STEP
  ) {
    gridWidths.push(width);
  }

  return uniqueSortedWidths(gridWidths);
}

export function portfolioResizeTargets(
  minimumWidth: number,
  maximumWidth: number,
  modes: Record<PortfolioGridWidthMode, number>,
): number[] {
  const anchors = uniqueSortedWidths([
    minimumWidth,
    maximumWidth,
    ...Object.values(modes),
  ]).filter((width) => width >= minimumWidth && width <= maximumWidth);
  // Exact mode anchors replace a nearby rhythm point instead of adding a
  // nearly coincident guide/extra tiny snap. Both drawing and snapping use this.
  const rhythm = portfolioResizeGuideWidths(minimumWidth, maximumWidth).filter(
    (width) =>
      anchors.every(
        (anchor) => Math.abs(anchor - width) >= PORTFOLIO_RESIZE_WIDTH_STEP / 2,
      ),
  );
  return uniqueSortedWidths([...rhythm, ...anchors]);
}

/**
 * Keep the snap model precise without painting every possible position.
 * The nearest increment and one neighbour on each side remain visible, while
 * the three durable width modes stay available as structural anchors.
 */
export function visiblePortfolioResizeGuideWidths(
  guideWidths: number[],
  currentWidth: number,
  modeWidths: Record<PortfolioGridWidthMode, number>,
  radius = PORTFOLIO_VISIBLE_GUIDE_RADIUS,
): number[] {
  const sorted = uniqueSortedWidths(guideWidths);
  if (!sorted.length) return uniqueSortedWidths(Object.values(modeWidths));

  const closestIndex = sorted.reduce(
    (closest, width, index) =>
      Math.abs(width - currentWidth) < Math.abs(sorted[closest] - currentWidth)
        ? index
        : closest,
    0,
  );
  const safeRadius = Math.max(0, Math.floor(radius));
  const local = sorted.slice(
    Math.max(0, closestIndex - safeRadius),
    closestIndex + safeRadius + 1,
  );
  const modes = Object.values(modeWidths).filter((width) =>
    sorted.includes(Math.round(width)),
  );
  return uniqueSortedWidths([...local, ...modes]);
}

export function snapPortfolioBlockWidth(
  desiredWidth: number,
  guideWidths: number[],
  modeWidths: Record<PortfolioGridWidthMode, number>,
): PortfolioResizeSnap {
  const closestWidth = guideWidths.reduce<number | null>((closest, width) => {
    if (closest === null) return width;
    return Math.abs(width - desiredWidth) < Math.abs(closest - desiredWidth)
      ? width
      : closest;
  }, null);
  const width = closestWidth ?? desiredWidth;
  const modes: PortfolioGridWidthMode[] = ["normal", "wide", "full"];
  const mode =
    modes.find((candidate) => Math.abs(modeWidths[candidate] - width) < 0.5) ??
    null;
  return { width, mode };
}

export function formatPortfolioColumnRatio(
  leftWidth: number,
  rightWidth: number,
): string {
  const pairWidth = leftWidth + rightWidth;
  if (!Number.isFinite(pairWidth) || pairWidth <= 0) return "50% / 50%";
  const leftPercent = Math.round((leftWidth / pairWidth) * 100);
  return `${leftPercent}% / ${100 - leftPercent}%`;
}

export function portfolioColumnRatioGuides(
  pairWidth: number,
  minWidth = MIN_PORTFOLIO_COLUMN_WIDTH,
): PortfolioColumnRatioGuide[] {
  if (!Number.isFinite(pairWidth) || pairWidth <= minWidth * 2) return [];

  return PORTFOLIO_COLUMN_RATIO_TARGETS.map((leftRatio) => {
    const leftWidth = Number((pairWidth * leftRatio).toFixed(4));
    const rightWidth = Number((pairWidth - leftWidth).toFixed(4));
    return {
      leftRatio,
      rightRatio: 1 - leftRatio,
      leftWidth,
      rightWidth,
      label: formatPortfolioColumnRatio(leftWidth, rightWidth),
    };
  }).filter(
    ({ leftWidth, rightWidth }) =>
      leftWidth >= minWidth && rightWidth >= minWidth,
  );
}

export function snapPortfolioColumnRatio(
  desiredLeftWidth: number,
  guides: PortfolioColumnRatioGuide[],
): PortfolioColumnRatioSnap {
  const closest = guides.reduce<PortfolioColumnRatioGuide | null>(
    (current, guide) => {
      if (!current) return guide;
      return Math.abs(guide.leftWidth - desiredLeftWidth) <
        Math.abs(current.leftWidth - desiredLeftWidth)
        ? guide
        : current;
    },
    null,
  );
  if (closest) {
    return { leftWidth: closest.leftWidth, snappedGuide: closest };
  }
  return { leftWidth: desiredLeftWidth, snappedGuide: null };
}

export function resizedColumnWeights(
  widths: number[],
  dividerIndex: number,
  delta: number,
  minWidth = MIN_PORTFOLIO_COLUMN_WIDTH,
): number[] {
  if (
    dividerIndex < 0 ||
    dividerIndex >= widths.length - 1 ||
    widths.some((width) => !Number.isFinite(width) || width <= 0)
  ) {
    return widths;
  }

  const left = widths[dividerIndex];
  const right = widths[dividerIndex + 1];
  const pairWidth = left + right;
  const boundedLeft = Math.min(
    pairWidth - minWidth,
    Math.max(minWidth, left + delta),
  );
  const next = [...widths];
  next[dividerIndex] = boundedLeft;
  next[dividerIndex + 1] = pairWidth - boundedLeft;

  const average = next.reduce((sum, width) => sum + width, 0) / next.length;
  return next.map((width) => Number((width / average).toFixed(4)));
}

export function resizedColumnPixelWidths(
  widths: number[],
  dividerIndex: number,
  delta: number,
  minWidth = MIN_PORTFOLIO_COLUMN_WIDTH,
): number[] {
  const weights = resizedColumnWeights(widths, dividerIndex, delta, minWidth);
  const average = widths.reduce((sum, width) => sum + width, 0) / widths.length;
  return weights.map((weight) => weight * average);
}

export function nearestPortfolioGridWidthMode(
  desiredWidth: number,
  modeWidths: Record<PortfolioGridWidthMode, number>,
): PortfolioGridWidthMode {
  const modes: PortfolioGridWidthMode[] = ["normal", "wide", "full"];
  return modes.reduce((closest, mode) =>
    Math.abs(modeWidths[mode] - desiredWidth) <
    Math.abs(modeWidths[closest] - desiredWidth)
      ? mode
      : closest,
  );
}

export function portfolioGridModeLabel(mode: PortfolioGridWidthMode): string {
  if (mode === "full") return "Full width";
  if (mode === "wide") return "Wide";
  return "Centered";
}
