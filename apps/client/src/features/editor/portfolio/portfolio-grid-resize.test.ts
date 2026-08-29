import { describe, expect, it } from "vitest";
import {
  nearestPortfolioGridWidthMode,
  portfolioGridModeLabel,
  resizedColumnWeights,
} from "./portfolio-grid-resize";

describe("portfolio grid resizing", () => {
  it("resizes only the adjacent columns and preserves the row total", () => {
    const next = resizedColumnWeights([300, 300, 300], 0, 60);
    expect(next).toEqual([1.2, 0.8, 1]);
    expect(next.reduce((sum, width) => sum + width, 0)).toBe(3);
  });

  it("keeps either column above the interactive minimum", () => {
    const next = resizedColumnWeights([200, 200], 0, 500, 96);
    expect(next[0]).toBeCloseTo(1.52);
    expect(next[1]).toBeCloseTo(0.48);
  });

  it("snaps the outer row handles to the nearest durable width mode", () => {
    const modes = { normal: 880, wide: 1120, full: 1440 } as const;
    expect(nearestPortfolioGridWidthMode(900, modes)).toBe("normal");
    expect(nearestPortfolioGridWidthMode(1090, modes)).toBe("wide");
    expect(nearestPortfolioGridWidthMode(1390, modes)).toBe("full");
    expect(portfolioGridModeLabel("normal")).toBe("Centered");
  });
});
