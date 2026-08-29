import { GridStackEngine } from "gridstack/dist/gridstack-engine";
import type { GridStackNode } from "gridstack/dist/types";

export const PORTFOLIO_GRID_TRACKS = 60;
export const PORTFOLIO_GRID_MIN_TRACKS = 6;

function integerSpans(weights: readonly number[]) {
  const safe = weights.map((weight) =>
    Number.isFinite(weight) && weight > 0 ? weight : 1,
  );
  const total = safe.reduce((sum, weight) => sum + weight, 0);
  const exact = safe.map((weight) => (weight / total) * PORTFOLIO_GRID_TRACKS);
  const spans = exact.map((span) =>
    Math.max(PORTFOLIO_GRID_MIN_TRACKS, Math.floor(span)),
  );
  let remaining =
    PORTFOLIO_GRID_TRACKS - spans.reduce((sum, span) => sum + span, 0);

  const order = exact
    .map((span, index) => ({ index, remainder: span - Math.floor(span) }))
    .sort((left, right) => right.remainder - left.remainder);
  let cursor = 0;
  while (remaining > 0) {
    spans[order[cursor % order.length].index] += 1;
    cursor += 1;
    remaining -= 1;
  }
  while (remaining < 0) {
    const candidate = order
      .slice()
      .reverse()
      .find(({ index }) => spans[index] > PORTFOLIO_GRID_MIN_TRACKS);
    if (!candidate) break;
    spans[candidate.index] -= 1;
    remaining += 1;
  }
  return spans;
}

/**
 * Converts persisted proportional widths into a single GridStack row.
 * GridStack owns the collision-safe track model; Tiptap persists the result as
 * relative weights so the public renderer stays framework independent.
 */
export function gridStackColumnWeights(weights: readonly number[]) {
  if (weights.length < 2 || weights.length > 5) {
    throw new RangeError("Portfolio rows support between two and five columns");
  }

  const spans = integerSpans(weights);
  const engine = new GridStackEngine({
    column: PORTFOLIO_GRID_TRACKS,
    maxRow: 1,
    float: true,
  });
  let x = 0;
  spans.forEach((width, index) => {
    engine.addNode({
      id: String(index),
      x,
      y: 0,
      w: width,
      h: 1,
      minW: PORTFOLIO_GRID_MIN_TRACKS,
      maxH: 1,
    });
    x += width;
  });

  const nodes = engine
    .save(false)
    .slice()
    .sort((left, right) => Number(left.id) - Number(right.id));
  const average = PORTFOLIO_GRID_TRACKS / nodes.length;
  return nodes.map((node: GridStackNode) =>
    Number(((node.w ?? average) / average).toFixed(4)),
  );
}
