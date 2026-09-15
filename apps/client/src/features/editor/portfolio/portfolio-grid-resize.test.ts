import { describe, expect, it } from "vitest";
import {
  MAX_PORTFOLIO_BLOCK_WIDTH,
  PORTFOLIO_RESIZE_EDGE_STEP,
  PORTFOLIO_RESIZE_WIDTH_STEP,
  formatPortfolioColumnRatio,
  nearestPortfolioGridWidthMode,
  portfolioColumnRatioGuides,
  portfolioResizeGuideWidths,
  portfolioResizeTargets,
  portfolioGridModeLabel,
  resizedColumnPixelWidths,
  resizedColumnWeights,
  snapPortfolioBlockWidth,
  snapPortfolioColumnRatio,
  visiblePortfolioResizeGuideWidths,
} from "./portfolio-grid-resize";

describe("portfolio grid resizing", () => {
  it("anchors the 8px edge rhythm to the actual 980px reading width", () => {
    expect(portfolioResizeGuideWidths(980, 1040)).toEqual([
      980, 996, 1012, 1028,
    ]);
  });

  it("uses the same exact bounded targets for guides and snaps, including off-grid modes", () => {
    const modes = { normal: 980, wide: 1120, full: 1397 };
    const targets = portfolioResizeTargets(980, 1397, modes);
    expect(targets).toContain(1120);
    expect(targets).not.toContain(1124);
    for (let desired = 980; desired <= 1397; desired++) {
      const snap = snapPortfolioBlockWidth(desired, targets, modes);
      const visible = visiblePortfolioResizeGuideWidths(
        targets,
        snap.width,
        modes,
      );
      expect(visible).toContain(snap.width);
      expect(visible.every((width) => targets.includes(width))).toBe(true);
      for (const width of visible) {
        expect(snapPortfolioBlockWidth(width, targets, modes).width).toBe(
          width,
        );
      }
    }
    expect(snapPortfolioBlockWidth(1120, targets, modes).mode).toBe("wide");
  });

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

  it("builds a bounded grid with 8px between symmetric edge positions", () => {
    const modes = { normal: 800, wide: 1120, full: 1440 } as const;
    const guides = portfolioResizeGuideWidths(240, 1440);

    expect(guides).toContain(256);
    expect(guides).toContain(1024);
    expect(guides).toContain(MAX_PORTFOLIO_BLOCK_WIDTH);
    expect(Math.max(...guides)).toBe(MAX_PORTFOLIO_BLOCK_WIDTH);
    expect(PORTFOLIO_RESIZE_WIDTH_STEP).toBe(16);
    expect(PORTFOLIO_RESIZE_EDGE_STEP).toBe(8);
    expect(
      guides.every(
        (width, index) => index === 0 || width - guides[index - 1] === 16,
      ),
    ).toBe(true);
  });

  it("shows only nearby snap increments plus durable width modes", () => {
    const modes = { normal: 800, wide: 1120, full: 1440 } as const;
    const guides = portfolioResizeGuideWidths(240, 1440);

    expect(visiblePortfolioResizeGuideWidths(guides, 1038, modes)).toEqual([
      800, 1024, 1040, 1056, 1120, 1440,
    ]);
  });

  it("always snaps outer resizing to the nearest equal-width step", () => {
    const modes = { normal: 800, wide: 1120, full: 1440 } as const;
    const guides = portfolioResizeGuideWidths(240, 1440);

    expect(snapPortfolioBlockWidth(1038, guides, modes)).toEqual({
      width: 1040,
      mode: null,
    });
    expect(snapPortfolioBlockWidth(1070, guides, modes)).toEqual({
      width: 1072,
      mode: null,
    });
    expect(snapPortfolioBlockWidth(1100, guides, modes)).toEqual({
      width: 1104,
      mode: null,
    });
  });
});
