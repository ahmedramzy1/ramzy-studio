export type PortfolioGridWidthMode = "normal" | "wide" | "full";

const MIN_COLUMN_WIDTH = 96;

export function resizedColumnWeights(
  widths: number[],
  dividerIndex: number,
  delta: number,
  minWidth = MIN_COLUMN_WIDTH,
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
  minWidth = MIN_COLUMN_WIDTH,
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
