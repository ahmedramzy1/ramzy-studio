import { describe, expect, it } from "vitest";
import {
  MAX_PORTFOLIO_BLOCK_WIDTH,
  PORTFOLIO_RESIZE_EDGE_STEP,
  PORTFOLIO_RESIZE_WIDTH_STEP,
  formatPortfolioColumnRatio,
  nearestPortfolioGridWidthMode,
  portfolioColumnRatioGuides,
  portfolioResizeGuideWidths,
  portfolioGridModeLabel,
  resizedColumnPixelWidths,
  resizedColumnWeights,
  snapPortfolioBlockWidth,
  snapPortfolioColumnRatio,
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

  it("builds exact 5% pair-ratio guides without violating minimum widths", () => {
    const guides = portfolioColumnRatioGuides(800, 96);

    expect(guides.map((guide) => guide.label)).toEqual([
      "15% / 85%",
      "20% / 80%",
      "25% / 75%",
      "30% / 70%",
      "35% / 65%",
      "40% / 60%",
      "45% / 55%",
      "50% / 50%",
      "55% / 45%",
      "60% / 40%",
      "65% / 35%",
      "70% / 30%",
      "75% / 25%",
      "80% / 20%",
      "85% / 15%",
    ]);
    expect(guides.every((guide) => guide.leftWidth >= 96)).toBe(true);
    expect(guides.every((guide) => guide.rightWidth >= 96)).toBe(true);
  });

  it("always snaps an internal divider to its nearest 5% ratio", () => {
    const guides = portfolioColumnRatioGuides(800);

    expect(snapPortfolioColumnRatio(473, guides)).toEqual({
      leftWidth: 480,
      snappedGuide: expect.objectContaining({ label: "60% / 40%" }),
    });
    expect(snapPortfolioColumnRatio(445, guides)).toEqual({
      leftWidth: 440,
      snappedGuide: expect.objectContaining({ label: "55% / 45%" }),
    });
    expect(formatPortfolioColumnRatio(445, 355)).toBe("56% / 44%");
  });

  it("snaps the outer row handles to the nearest durable width mode", () => {
    const modes = { normal: 880, wide: 1120, full: 1440 } as const;
    expect(nearestPortfolioGridWidthMode(900, modes)).toBe("normal");
    expect(nearestPortfolioGridWidthMode(1090, modes)).toBe("wide");
    expect(nearestPortfolioGridWidthMode(1390, modes)).toBe("full");
    expect(portfolioGridModeLabel("normal")).toBe("Centered");
  });

  it("builds a bounded grid with 16px between symmetric edge positions", () => {
    const modes = { normal: 800, wide: 1120, full: 1440 } as const;
    const guides = portfolioResizeGuideWidths(240, 1440);

    expect(guides).toContain(256);
    expect(guides).toContain(1024);
    expect(guides).toContain(MAX_PORTFOLIO_BLOCK_WIDTH);
    expect(Math.max(...guides)).toBe(MAX_PORTFOLIO_BLOCK_WIDTH);
    expect(PORTFOLIO_RESIZE_WIDTH_STEP).toBe(32);
    expect(PORTFOLIO_RESIZE_EDGE_STEP).toBe(16);
    expect(
      guides.every(
        (width, index) => index === 0 || width - guides[index - 1] === 32,
      ),
    ).toBe(true);
  });

  it("always snaps outer resizing to the nearest equal-width step", () => {
    const modes = { normal: 800, wide: 1120, full: 1440 } as const;
    const guides = portfolioResizeGuideWidths(240, 1440);

    expect(snapPortfolioBlockWidth(1038, guides, modes)).toEqual({
      width: 1024,
      mode: null,
    });
    expect(snapPortfolioBlockWidth(1070, guides, modes)).toEqual({
      width: 1056,
      mode: null,
    });
    expect(snapPortfolioBlockWidth(1100, guides, modes)).toEqual({
      width: 1088,
      mode: null,
    });
  });
});
