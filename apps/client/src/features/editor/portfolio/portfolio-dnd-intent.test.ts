// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { resolvePortfolioDropIntent } from "./portfolio-dnd-intent";

function setRect(
  element: HTMLElement,
  left: number,
  top: number,
  width: number,
  height: number,
) {
  Object.defineProperty(element, "getBoundingClientRect", {
    value: () => ({
      left,
      right: left + width,
      top,
      bottom: top + height,
      width,
      height,
      x: left,
      y: top,
      toJSON: () => ({}),
    }),
  });
}

function grid(columnCount: number) {
  const editor = document.createElement("div");
  const row = document.createElement("div");
  row.dataset.type = "columns";
  editor.append(row);
  setRect(editor, 100, 0, 1000, 900);
  setRect(row, 100, 100, 1000, 500);
  for (let index = 0; index < columnCount; index += 1) {
    const column = document.createElement("div");
    column.dataset.type = "column";
    const block = document.createElement("div");
    column.append(block);
    row.append(column);
    const width = 1000 / columnCount;
    setRect(column, 100 + index * width, 100, width, 500);
  }
  return { editor, row };
}

describe("resolvePortfolioDropIntent", () => {
  it.each([
    [2, 3],
    [3, 4],
    [4, 5],
  ])("selects a nested edge to grow %i columns to %i", (count) => {
    const { editor, row } = grid(count);
    const source = document.createElement("div");
    setRect(source, 100, 700, 1000, 100);
    editor.append(source);
    const last = row.lastElementChild as HTMLElement;
    const rect = last.getBoundingClientRect();

    const intent = resolvePortfolioDropIntent(editor, source, {
      x: rect.right - 4,
      y: rect.top + rect.height / 2,
    });

    expect(intent).toMatchObject({
      rowElement: row,
      columnIndex: count - 1,
      edge: "right",
    });
  });

  it("supports left and right insertion symmetrically", () => {
    const { editor, row } = grid(2);
    const source = document.createElement("div");
    setRect(source, 100, 700, 1000, 100);
    editor.append(source);

    expect(
      resolvePortfolioDropIntent(editor, source, { x: 104, y: 350 }),
    ).toMatchObject({ columnIndex: 0, edge: "left" });
    expect(
      resolvePortfolioDropIntent(editor, source, { x: 1096, y: 350 }),
    ).toMatchObject({ columnIndex: 1, edge: "right" });
  });

  it("selects a separate row above or below without horizontal ambiguity", () => {
    const { editor, row } = grid(3);
    const source = row.children[1].firstElementChild as HTMLElement;

    expect(
      resolvePortfolioDropIntent(editor, source, { x: 600, y: 104 }),
    ).toMatchObject({ rowElement: row, columnIndex: null, edge: "top" });
    expect(
      resolvePortfolioDropIntent(editor, source, { x: 600, y: 596 }),
    ).toMatchObject({ rowElement: row, columnIndex: null, edge: "bottom" });
  });

  it("does not create a sixth column from another row", () => {
    const { editor, row } = grid(5);
    const source = document.createElement("div");
    setRect(source, 100, 700, 1000, 100);
    editor.append(source);

    const intent = resolvePortfolioDropIntent(editor, source, {
      x: 1096,
      y: 350,
    });
    expect(intent).toBeNull();
    expect(row.children).toHaveLength(5);
  });
});
