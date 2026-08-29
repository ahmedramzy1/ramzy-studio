import { describe, expect, it } from "vitest";
import {
  closestPortfolioDropEdge,
  createPortfolioDndGridPreview,
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
  it("renders a real two-column row in the requested order", () => {
    const preview = createPortfolioDndGridPreview(
      block("Audio"),
      block("Video"),
      null,
      "right",
    );

    expect(preview.dataset.type).toBe("columns");
    expect(preview.dataset.layout).toBe("two_equal");
    expect(Array.from(preview.children).map((item) => item.textContent)).toEqual([
      "Video",
      "Audio",
    ]);
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
    expect(Array.from(preview.children).map((item) => item.textContent)).toEqual([
      "Video",
      "Audio",
      "Image",
    ]);
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
    expect(Array.from(preview.children).map((item) => item.textContent)).toEqual([
      "Video",
      "Image",
      "Audio",
    ]);
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

    expect(closestPortfolioDropEdge(rect, { x: 110, y: 400 }, ["top", "bottom", "left", "right"])).toBe("left");
    expect(closestPortfolioDropEdge(rect, { x: 490, y: 400 }, ["top", "bottom", "left", "right"])).toBe("right");
    expect(closestPortfolioDropEdge(rect, { x: 300, y: 110 }, ["top", "bottom", "left", "right"])).toBe("top");
    expect(closestPortfolioDropEdge(rect, { x: 300, y: 690 }, ["top", "bottom", "left", "right"])).toBe("bottom");
  });
});
