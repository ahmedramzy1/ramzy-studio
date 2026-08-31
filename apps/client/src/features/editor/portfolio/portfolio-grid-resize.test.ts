import { describe, expect, it } from "vitest";
import {
  MAX_PORTFOLIO_BLOCK_WIDTH,
  nearestPortfolioGridWidthMode,
  portfolioResizeGuideWidths,
  portfolioGridModeLabel,
  resizedColumnPixelWidths,
  resizedColumnWeights,
  snapPortfolioBlockWidth,
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

  it("returns exact live pixel widths while the divider is moving", () => {
    expect(resizedColumnPixelWidths([300, 300, 300], 0, 60)).toEqual([
      360, 240, 300,
    ]);
  });

  it("snaps the outer row handles to the nearest durable width mode", () => {
    const modes = { normal: 880, wide: 1120, full: 1440 } as const;
    expect(nearestPortfolioGridWidthMode(900, modes)).toBe("normal");
    expect(nearestPortfolioGridWidthMode(1090, modes)).toBe("wide");
    expect(nearestPortfolioGridWidthMode(1390, modes)).toBe("full");
    expect(portfolioGridModeLabel("normal")).toBe("Centered");
  });

  it("builds a bounded guide grid that includes every durable width mode", () => {
    const modes = { normal: 800, wide: 1120, full: 1440 } as const;
    const guides = portfolioResizeGuideWidths(240, 1440, modes);

    expect(guides).toContain(256);
    expect(guides).toContain(1024);
    expect(guides).toContain(1120);
    expect(guides).toContain(MAX_PORTFOLIO_BLOCK_WIDTH);
    expect(Math.max(...guides)).toBe(MAX_PORTFOLIO_BLOCK_WIDTH);
  });

  it("moves magnetically onto a nearby guide but stays free between guides", () => {
    const modes = { normal: 800, wide: 1120, full: 1440 } as const;
    const guides = portfolioResizeGuideWidths(240, 1440, modes);

    expect(snapPortfolioBlockWidth(1038, guides, modes)).toEqual({
      width: 1024,
      mode: null,
    });
    expect(snapPortfolioBlockWidth(1070, guides, modes)).toEqual({
      width: 1070,
      mode: null,
    });
    expect(snapPortfolioBlockWidth(1100, guides, modes)).toEqual({
      width: 1120,
      mode: "wide",
    });
  });
});
