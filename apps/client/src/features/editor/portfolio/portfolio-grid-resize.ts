export type PortfolioGridWidthMode = "normal" | "wide" | "full";

export const MIN_PORTFOLIO_COLUMN_WIDTH = 96;
export const MAX_PORTFOLIO_BLOCK_WIDTH = 1440;
export const PORTFOLIO_RESIZE_GUIDE_STEP = 128;
export const PORTFOLIO_RESIZE_SNAP_THRESHOLD = 24;
export const PORTFOLIO_COLUMN_RATIO_SNAP_THRESHOLD = 12;

const PORTFOLIO_COLUMN_RATIO_TARGETS = [
  0.1,
  0.2,
  0.25,
  0.3,
  1 / 3,
  0.4,
  0.5,
  0.6,
  2 / 3,
  0.7,
  0.75,
  0.8,
  0.9,
] as const;

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
  modeWidths: Record<PortfolioGridWidthMode, number>,
): number[] {
  if (
    !Number.isFinite(minimumWidth) ||
    !Number.isFinite(maximumWidth) ||
    maximumWidth < minimumWidth
  ) {
    return [];
  }

  const firstGridWidth =
    Math.ceil(minimumWidth / PORTFOLIO_RESIZE_GUIDE_STEP) *
    PORTFOLIO_RESIZE_GUIDE_STEP;
  const gridWidths: number[] = [];
  for (
    let width = firstGridWidth;
    width <= maximumWidth;
    width += PORTFOLIO_RESIZE_GUIDE_STEP
  ) {
    gridWidths.push(width);
  }

  return uniqueSortedWidths([
    minimumWidth,
    ...gridWidths,
    modeWidths.normal,
    modeWidths.wide,
    modeWidths.full,
    maximumWidth,
  ]).filter((width) => width >= minimumWidth && width <= maximumWidth);
}

export function snapPortfolioBlockWidth(
  desiredWidth: number,
  guideWidths: number[],
  modeWidths: Record<PortfolioGridWidthMode, number>,
  threshold = PORTFOLIO_RESIZE_SNAP_THRESHOLD,
): PortfolioResizeSnap {
  const closestWidth = guideWidths.reduce<number | null>((closest, width) => {
    if (closest === null) return width;
    return Math.abs(width - desiredWidth) < Math.abs(closest - desiredWidth)
      ? width
      : closest;
  }, null);
  const width =
    closestWidth !== null && Math.abs(closestWidth - desiredWidth) <= threshold
      ? closestWidth
      : desiredWidth;
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
    const leftWidth = pairWidth * leftRatio;
    const rightWidth = pairWidth - leftWidth;
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
  threshold = PORTFOLIO_COLUMN_RATIO_SNAP_THRESHOLD,
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
  if (closest && Math.abs(closest.leftWidth - desiredLeftWidth) <= threshold) {
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
