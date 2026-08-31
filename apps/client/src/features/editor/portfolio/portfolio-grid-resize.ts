export type PortfolioGridWidthMode = "normal" | "wide" | "full";

export const MIN_PORTFOLIO_COLUMN_WIDTH = 96;
export const MAX_PORTFOLIO_BLOCK_WIDTH = 1440;
export const PORTFOLIO_RESIZE_GUIDE_STEP = 128;
export const PORTFOLIO_RESIZE_SNAP_THRESHOLD = 24;

export type PortfolioResizeSnap = {
  width: number;
  mode: PortfolioGridWidthMode | null;
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
