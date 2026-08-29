import { describe, expect, it } from "vitest";
import {
  cloneForPortfolioDndPreview,
  closestPortfolioDropEdge,
  portfolioDropTargetAtPoint,
  portfolioPreviewColumnPlan,
  portfolioTwoColumnPreviewRects,
} from "./portfolio-dnd-preview";

describe("portfolio dnd future-layout preview", () => {
  it("creates an inert design-system ghost without duplicate editor controls", () => {
    const source = document.createElement("div");
    source.id = "source";
    source.className = "react-renderer ramzy-dnd-source";
    source.innerHTML =
      '<button id="action">Play</button><span data-ramzy-block-drag-handle>Drag</span><div contenteditable="true">Content</div>';

    const clone = cloneForPortfolioDndPreview(source);

    expect(clone.id).toBe("");
    expect(clone.classList.contains("ramzy-dnd-source")).toBe(false);
    expect(clone.querySelector("[data-ramzy-block-drag-handle]")).toBeNull();
    expect(clone.querySelector("#action")).toBeNull();
    expect(clone.querySelector("button")?.getAttribute("tabindex")).toBe("-1");
    expect(
      clone.querySelector("[contenteditable]")?.getAttribute("contenteditable"),
    ).toBe("false");
  });

  it("uses identical half-row geometry for the live preview on both sides", () => {
    expect(
      portfolioTwoColumnPreviewRects({ left: 100, width: 1000 }, 32, "right"),
    ).toEqual({ columnWidth: 484, targetLeft: 100, slotLeft: 616 });
    expect(
      portfolioTwoColumnPreviewRects({ left: 100, width: 1000 }, 32, "left"),
    ).toEqual({ columnWidth: 484, targetLeft: 616, slotLeft: 100 });
  });

  it("prefers the exact column under the pointer over its containing row", () => {
    const row = document.createElement("div");
    const targetColumn = document.createElement("div");
    const content = document.createElement("div");
    targetColumn.appendChild(content);
    row.appendChild(targetColumn);

    const target = portfolioDropTargetAtPoint(
      [
        { element: row, data: "row", priority: 1 },
        { element: targetColumn, data: "column", priority: 2 },
      ],
      { x: 50, y: 50 },
      [content, targetColumn, row],
    );

    expect(target?.data).toBe("column");
  });

  it("falls back to a target rectangle when the hit list is empty", () => {
    const row = document.createElement("div");
    Object.defineProperty(row, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        right: 200,
        top: 0,
        bottom: 100,
        width: 200,
        height: 100,
      }),
    });

    const target = portfolioDropTargetAtPoint(
      [{ element: row, data: "row", priority: 1 }],
      { x: 80, y: 40 },
      [],
    );

    expect(target?.data).toBe("row");
  });

  it("reserves the exact third slot inside an existing grid", () => {
    const plan = portfolioPreviewColumnPlan(2, 0, "right");
    expect(plan).toEqual({
      hiddenSourceIndex: null,
      insertionIndex: 1,
      futureColumnCount: 3,
      orders: [0, 4],
    });
  });

  it("removes the old slot while previewing a same-grid move", () => {
    const plan = portfolioPreviewColumnPlan(3, 2, "right", 1, true);
    expect(plan).toEqual({
      hiddenSourceIndex: 1,
      insertionIndex: 2,
      futureColumnCount: 3,
      orders: [0, null, 2],
    });
  });

  it("uses the closest normalized edge for tall and wide blocks", () => {
    const rect = {
      left: 100,
      right: 500,
      top: 100,
      bottom: 700,
      width: 400,
      height: 600,
    };

    expect(
      closestPortfolioDropEdge(rect, { x: 110, y: 400 }, [
        "top",
        "bottom",
        "left",
        "right",
      ]),
    ).toBe("left");
    expect(
      closestPortfolioDropEdge(rect, { x: 490, y: 400 }, [
        "top",
        "bottom",
        "left",
        "right",
      ]),
    ).toBe("right");
    expect(
      closestPortfolioDropEdge(rect, { x: 300, y: 110 }, [
        "top",
        "bottom",
        "left",
        "right",
      ]),
    ).toBe("top");
    expect(
      closestPortfolioDropEdge(rect, { x: 300, y: 690 }, [
        "top",
        "bottom",
        "left",
        "right",
      ]),
    ).toBe("bottom");
  });
});
