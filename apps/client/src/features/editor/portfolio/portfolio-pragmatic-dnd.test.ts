import { describe, expect, it } from "vitest";
import { createPortfolioLayoutPreviewGrid } from "./portfolio-pragmatic-dnd";

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

describe("portfolio live layout preview", () => {
  it("renders a real two-column row in the requested order", () => {
    const target = block("Video");
    const source = block("Audio");
    const preview = createPortfolioLayoutPreviewGrid(
      source,
      target,
      null,
      "right",
    );

    expect(preview.dataset.type).toBe("columns");
    expect(preview.dataset.layout).toBe("two_equal");
    expect(preview.children).toHaveLength(2);
    expect(preview.children[0].textContent).toBe("Video");
    expect(preview.children[1].textContent).toBe("Audio");
  });

  it("shows the exact third slot inside an existing grid", () => {
    const row = document.createElement("div");
    row.dataset.type = "columns";
    row.append(column("Video"), column("Image"));
    const preview = createPortfolioLayoutPreviewGrid(
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
    const source = audio.firstElementChild as HTMLElement;
    const preview = createPortfolioLayoutPreviewGrid(
      source,
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
});
