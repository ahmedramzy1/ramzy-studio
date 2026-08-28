import { Schema } from "@tiptap/pm/model";
import { EditorState, NodeSelection } from "@tiptap/pm/state";
import { describe, expect, it } from "vitest";
import { createPortfolioGridDropTransaction } from "./portfolio-grid-drop";

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
    column: { content: "block+" },
  },
});

function paragraph(text: string) {
  return schema.nodes.paragraph.create(null, schema.text(text));
}

function column(text: string) {
  return schema.nodes.column.create(null, paragraph(text));
}

function selectedState(children: ReturnType<typeof paragraph>[]) {
  const doc = schema.nodes.doc.create(null, children);
  return EditorState.create({
    doc,
    selection: NodeSelection.create(doc, 0),
  });
}

describe("portfolio grid drop", () => {
  it("creates a two-column row in the requested order", () => {
    const state = selectedState([paragraph("A"), paragraph("B")]);
    const targetPosition = state.doc.child(0).nodeSize;
    const tr = createPortfolioGridDropTransaction(
      state,
      targetPosition,
      "right",
      null,
    );

    expect(tr).not.toBeNull();
    const columns = tr!.doc.firstChild!;
    expect(columns.type.name).toBe("columns");
    expect(columns.attrs.layout).toBe("two_equal");
    expect(columns.childCount).toBe(2);
    expect(columns.child(0).textContent).toBe("B");
    expect(columns.child(1).textContent).toBe("A");
  });

  it("expands a two-column row to three columns", () => {
    const existingColumns = schema.nodes.columns.create(
      { layout: "two_equal" },
      [column("A"), column("B")],
    );
    const source = paragraph("C");
    const doc = schema.nodes.doc.create(null, [source, existingColumns]);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 0),
    });
    const tr = createPortfolioGridDropTransaction(
      state,
      source.nodeSize,
      "right",
      1,
    );

    expect(tr).not.toBeNull();
    const columns = tr!.doc.firstChild!;
    expect(columns.attrs.layout).toBe("three_equal");
    expect(columns.childCount).toBe(3);
    expect(columns.child(0).textContent).toBe("A");
    expect(columns.child(1).textContent).toBe("B");
    expect(columns.child(2).textContent).toBe("C");
  });

  it("caps drag-created rows at five columns", () => {
    const existingColumns = schema.nodes.columns.create(
      { layout: "five_equal" },
      [column("A"), column("B"), column("C"), column("D"), column("E")],
    );
    const source = paragraph("F");
    const doc = schema.nodes.doc.create(null, [source, existingColumns]);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 0),
    });

    expect(
      createPortfolioGridDropTransaction(
        state,
        source.nodeSize,
        "right",
        4,
      ),
    ).toBeNull();
  });

  it("reorders elements that are already in the same grid", () => {
    const existingColumns = schema.nodes.columns.create(
      { layout: "two_equal" },
      [column("A"), column("B")],
    );
    const doc = schema.nodes.doc.create(null, existingColumns);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 2),
    });
    const tr = createPortfolioGridDropTransaction(
      state,
      0,
      "right",
      1,
    );

    expect(tr).not.toBeNull();
    const columns = tr!.doc.firstChild!;
    expect(columns.childCount).toBe(2);
    expect(columns.child(0).textContent).toBe("B");
    expect(columns.child(1).textContent).toBe("A");
  });
});
