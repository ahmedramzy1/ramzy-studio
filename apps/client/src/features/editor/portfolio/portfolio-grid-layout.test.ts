import { describe, expect, it } from "vitest";
import { normalizedColumnWeights } from "./portfolio-grid-layout";

describe("normalizedColumnWeights", () => {
  it.each([2, 3, 4, 5])("creates an equal %i-column row", (count) => {
    expect(normalizedColumnWeights(Array(count).fill(1))).toEqual(
      Array(count).fill(1),
    );
  });

  it("preserves manual proportions", () => {
    expect(normalizedColumnWeights([2, 1, 1])).toEqual([1.5, 0.75, 0.75]);
  });

  it("repairs invalid weights without invalidating the row", () => {
    expect(normalizedColumnWeights([Number.NaN, -1, 2])).toEqual([
      0.75, 0.75, 1.5,
    ]);
  });

  it("rejects unsupported column counts", () => {
    expect(() => normalizedColumnWeights([1])).toThrow(RangeError);
    expect(() => normalizedColumnWeights([1, 1, 1, 1, 1, 1])).toThrow(
      RangeError,
    );
  });
});
