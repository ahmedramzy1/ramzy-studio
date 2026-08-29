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
  it("shrinks a three-column row to two columns after one is emptied", () => {
    const state = stateWithGrid("three_equal", [
      column("A"),
      column(),
      column("B"),
    ]);
    const tr = normalizePortfolioGridTransaction(state);

    expect(tr).not.toBeNull();
    const row = tr!.doc.firstChild!;
    expect(row.type.name).toBe("columns");
    expect(row.attrs.layout).toBe("two_equal");
    expect(row.childCount).toBe(2);
    expect(row.child(0).textContent).toBe("A");
    expect(row.child(1).textContent).toBe("B");
  });

  it("unwraps the last grid item into a normal full-width row", () => {
    const state = stateWithGrid("two_equal", [column("A"), column()]);
    const tr = normalizePortfolioGridTransaction(state);

    expect(tr).not.toBeNull();
    expect(tr!.doc.childCount).toBe(1);
    expect(tr!.doc.firstChild!.type.name).toBe("paragraph");
    expect(tr!.doc.firstChild!.textContent).toBe("A");
  });

  it("preserves manual widths on columns that remain", () => {
    const state = stateWithGrid("three_equal", [
      column("A", 2),
      column(),
      column("B", 1.5),
    ]);
    const tr = normalizePortfolioGridTransaction(state);
    const row = tr!.doc.firstChild!;

    expect(row.child(0).attrs.width).toBe(2);
    expect(row.child(1).attrs.width).toBe(1.5);
  });

  it("leaves an already-correct grid unchanged", () => {
    const state = stateWithGrid("two_equal", [column("A"), column("B")]);

    expect(normalizePortfolioGridTransaction(state)).toBeNull();
  });
});
