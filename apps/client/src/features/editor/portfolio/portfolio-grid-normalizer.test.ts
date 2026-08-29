import { Schema } from "@tiptap/pm/model";
import { EditorState } from "@tiptap/pm/state";
import { describe, expect, it } from "vitest";
import { normalizePortfolioGridTransaction } from "./portfolio-grid-normalizer";

const schema = new Schema({
  nodes: {
    doc: { content: "block+" },
    text: { group: "inline" },
    paragraph: { group: "block", content: "text*" },
    columns: {
      group: "block",
      content: "column+",
      attrs: { layout: { default: "two_equal" } },
    },
    column: {
      content: "block+",
      attrs: { width: { default: null } },
    },
  },
});

function paragraph(text = "") {
  return schema.nodes.paragraph.create(
    null,
    text ? schema.text(text) : undefined,
  );
}

function column(text = "", width: number | null = null) {
  return schema.nodes.column.create({ width }, paragraph(text));
}

function stateWithGrid(layout: string, columns: ReturnType<typeof column>[]) {
  return EditorState.create({
    doc: schema.nodes.doc.create(
      null,
      schema.nodes.columns.create({ layout }, columns),
    ),
  });
}

describe("portfolio grid normalizer", () => {
  it.each([
    ["two_equal", 2],
    ["three_equal", 3],
    ["four_equal", 4],
    ["five_equal", 5],
  ])("preserves an empty %s layout for editing", (layout, count) => {
    const state = stateWithGrid(
      layout,
      Array.from({ length: count }, () => column()),
    );

    expect(normalizePortfolioGridTransaction(state)).toBeNull();
  });

  it("preserves a two-column row while one column is waiting for content", () => {
    const state = stateWithGrid("two_equal", [column("A"), column()]);
    const tr = normalizePortfolioGridTransaction(state);

    expect(tr).toBeNull();
  });

  it("preserves manual widths on columns that remain", () => {
    const state = stateWithGrid("three_equal", [
      column("A", 2),
      column(),
      column("B", 1.5),
    ]);
    expect(normalizePortfolioGridTransaction(state)).toBeNull();
  });

  it("leaves an already-correct grid unchanged", () => {
    const state = stateWithGrid("two_equal", [column("A"), column("B")]);

    expect(normalizePortfolioGridTransaction(state)).toBeNull();
  });
});
