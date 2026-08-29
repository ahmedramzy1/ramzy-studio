import { describe, expect, it } from "vitest";
import {
  closestPortfolioDropEdge,
  createPortfolioDndGridPreview,
  portfolioDropTargetAtPoint,
} from "./portfolio-dnd-preview";

function block(label: string) {
  const element = document.createElement("div");
  element.className = "react-renderer";
  element.textContent = label;
  return element;
}

function column(label: string) {
  const element = document.createElement("div");
  element.dataset.type = "column";
  element.appendChild(block(label));
  return element;
}

describe("portfolio dnd future-layout preview", () => {
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

  it("renders a real two-column row in the requested order", () => {
    const preview = createPortfolioDndGridPreview(
      block("Audio"),
      block("Video"),
      null,
      "right",
    );

    expect(preview.dataset.type).toBe("columns");
    expect(preview.dataset.layout).toBe("two_equal");
    expect(
      Array.from(preview.children).map((item) => item.textContent),
    ).toEqual(["Video", "Audio"]);
    expect(
      preview.lastElementChild?.classList.contains("ramzy-dnd-incoming-column"),
    ).toBe(true);
    expect((preview.lastElementChild as HTMLElement).dataset.dropEdge).toBe(
      "right",
    );
  });

  it("shows the exact third slot inside an existing grid", () => {
    const row = document.createElement("div");
    row.dataset.type = "columns";
    row.append(column("Video"), column("Image"));
    const preview = createPortfolioDndGridPreview(
      block("Audio"),
      row,
      0,
      "right",
    );

    expect(preview.dataset.layout).toBe("three_equal");
    expect(
      Array.from(preview.children).map((item) => item.textContent),
    ).toEqual(["Video", "Audio", "Image"]);
  });

  it("removes the old slot while previewing a same-grid move", () => {
    const row = document.createElement("div");
    row.dataset.type = "columns";
    const video = column("Video");
    const audio = column("Audio");
    const image = column("Image");
    row.append(video, audio, image);
    const preview = createPortfolioDndGridPreview(
      audio.firstElementChild as HTMLElement,
      row,
      2,
      "right",
    );

    expect(preview.children).toHaveLength(3);
    expect(
      Array.from(preview.children).map((item) => item.textContent),
    ).toEqual(["Video", "Image", "Audio"]);
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
