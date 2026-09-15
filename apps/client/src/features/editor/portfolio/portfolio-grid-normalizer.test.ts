import { Schema } from "@tiptap/pm/model";
import { EditorState } from "@tiptap/pm/state";
import { describe, expect, it } from "vitest";
import { normalizePortfolioGridTransaction } from "./portfolio-grid-normalizer";

const schema = new Schema({
  nodes: {
    doc: { content: "block+" },
    text: { group: "inline" },
    paragraph: { group: "block", content: "text*" },
    media: { group: "block", atom: true },
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

function mediaColumn(width: number | null = null) {
  return schema.nodes.column.create({ width }, [
    schema.nodes.media.create(),
    paragraph(),
  ]);
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

  it.each([
    { before: 5, after: 4, layout: "four_equal" },
    { before: 4, after: 3, layout: "three_equal" },
    { before: 3, after: 2, layout: "two_equal" },
  ])(
    "automatically reflows $before columns to $after when a media column is emptied",
    ({ before, after, layout }) => {
      const oldState = stateWithGrid(
        layoutForTestCount(before),
        Array.from({ length: before }, () => mediaColumn(1)),
      );
      const nextColumns = Array.from({ length: before }, (_, index) =>
        index === 1 ? column("", 1) : mediaColumn(1),
      );
      const state = stateWithGrid(layoutForTestCount(before), nextColumns);

      const tr = normalizePortfolioGridTransaction(state, oldState);

      expect(tr).not.toBeNull();
      const row = tr!.doc.firstChild!;
      expect(row.childCount).toBe(after);
      expect(row.attrs.layout).toBe(layout);
      expect(
        Array.from(
          { length: after },
          (_, index) => row.child(index).attrs.width,
        ),
      ).toEqual(Array.from({ length: after }, () => 1));
    },
  );

  it("unwraps a two-column row when one media column is emptied", () => {
    const oldState = stateWithGrid("two_equal", [
      mediaColumn(1),
      mediaColumn(1),
    ]);
    const state = stateWithGrid("two_equal", [mediaColumn(1), column("", 1)]);

    const tr = normalizePortfolioGridTransaction(state, oldState);

    expect(tr).not.toBeNull();
    expect(tr!.doc.firstChild?.type.name).toBe("media");
    expect(tr!.doc.childCount).toBe(2);
  });

  it("does not collapse a column when editable text is cleared", () => {
    const oldState = stateWithGrid("two_equal", [column("A"), column("B")]);
    const state = stateWithGrid("two_equal", [column(""), column("B")]);

    expect(normalizePortfolioGridTransaction(state, oldState)).toBeNull();
  });
});

function layoutForTestCount(count: number) {
  if (count === 5) return "five_equal";
  if (count === 4) return "four_equal";
  if (count === 3) return "three_equal";
  return "two_equal";
}
