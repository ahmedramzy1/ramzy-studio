import { describe, expect, it } from "vitest";
import {
  gridStackColumnWeights,
  PORTFOLIO_GRID_TRACKS,
} from "./portfolio-gridstack-layout";

describe("GridStack portfolio row adapter", () => {
  it.each([2, 3, 4, 5])("creates a balanced %i-column row", (count) => {
    const weights = gridStackColumnWeights(Array(count).fill(1));
    expect(weights).toHaveLength(count);
    expect(weights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(count);
    expect(weights.every((weight) => weight > 0)).toBe(true);
  });

  it("preserves a manually widened column", () => {
    expect(gridStackColumnWeights([2, 1, 1])).toEqual([1.5, 0.75, 0.75]);
  });

  it("uses a sixty-track grid so five columns remain snappable", () => {
    const weights = gridStackColumnWeights([1, 1, 1, 1, 1]);
    const spans = weights.map((weight) =>
      Math.round((weight * PORTFOLIO_GRID_TRACKS) / weights.length),
    );
    expect(spans.reduce((sum, span) => sum + span, 0)).toBe(
      PORTFOLIO_GRID_TRACKS,
    );
  });
});
