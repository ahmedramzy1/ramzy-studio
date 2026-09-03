import { Schema } from "@tiptap/pm/model";
import { EditorState, NodeSelection } from "@tiptap/pm/state";
import { describe, expect, it } from "vitest";
import {
  createPortfolioGridDropTransaction,
  createPortfolioVerticalDropTransaction,
} from "./portfolio-grid-drop";

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
    column: { content: "block+", attrs: { width: { default: null } } },
  },
});

function paragraph(text: string) {
  return schema.nodes.paragraph.create(
    null,
    text ? schema.text(text) : undefined,
  );
}

function column(text: string) {
  return schema.nodes.column.create(null, paragraph(text));
}

function media() {
  return schema.nodes.media.create();
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

  it("adds an editable paragraph after media placed into a column", () => {
    const source = media();
    const target = paragraph("B");
    const doc = schema.nodes.doc.create(null, [source, target]);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 0),
    });
    const tr = createPortfolioGridDropTransaction(
      state,
      source.nodeSize,
      "right",
      null,
    );

    const mediaColumn = tr!.doc.firstChild!.child(1);
    expect(mediaColumn.childCount).toBe(2);
    expect(mediaColumn.child(0).type.name).toBe("media");
    expect(mediaColumn.child(1).type.name).toBe("paragraph");
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

  it("keeps manual ratios and allocates space to a newly added column", () => {
    const existingColumns = schema.nodes.columns.create(
      { layout: "two_equal" },
      [
        schema.nodes.column.create({ width: 2 }, paragraph("A")),
        schema.nodes.column.create({ width: 1 }, paragraph("B")),
      ],
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
    expect(columns.child(0).attrs.width).toBe(1.5);
    expect(columns.child(1).attrs.width).toBe(0.75);
    expect(columns.child(2).attrs.width).toBe(0.75);
  });

  it("expands a four-column row to the supported five-column layout", () => {
    const existingColumns = schema.nodes.columns.create(
      { layout: "four_equal" },
      [column("A"), column("B"), column("C"), column("D")],
    );
    const source = paragraph("E");
    const doc = schema.nodes.doc.create(null, [source, existingColumns]);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 0),
    });

    const tr = createPortfolioGridDropTransaction(
      state,
      source.nodeSize,
      "right",
      3,
    );

    expect(tr).not.toBeNull();
    const columns = tr!.doc.firstChild!;
    expect(columns.attrs.layout).toBe("five_equal");
    expect(columns.childCount).toBe(5);
    expect(columns.child(4).textContent).toBe("E");
  });

  it("repeats drops from two through five columns without changing selection", () => {
    const initialColumns = schema.nodes.columns.create(
      { layout: "two_equal" },
      [column("A"), column("B")],
    );
    let doc = schema.nodes.doc.create(null, [
      initialColumns,
      paragraph("C"),
      paragraph("D"),
      paragraph("E"),
    ]);

    for (const expectedCount of [3, 4, 5]) {
      const state = EditorState.create({
        doc,
        selection: NodeSelection.create(doc, 0),
      });
      const sourcePosition = doc.firstChild!.nodeSize;
      const tr = createPortfolioGridDropTransaction(
        state,
        0,
        "right",
        expectedCount - 2,
        sourcePosition,
      );
      expect(tr).not.toBeNull();
      doc = tr!.doc;
      expect(doc.firstChild!.childCount).toBe(expectedCount);
      expect(doc.firstChild!.attrs.layout).toBe(
        expectedCount === 3
          ? "three_equal"
          : expectedCount === 4
            ? "four_equal"
            : "five_equal",
      );
    }

    expect(
      Array.from(
        { length: 5 },
        (_, index) => doc.firstChild!.child(index).textContent,
      ),
    ).toEqual(["A", "B", "C", "D", "E"]);
  });

  it.each(
    [2, 3, 4, 5].flatMap((sourceCount) =>
      [2, 3, 4].map((destinationCount) => ({
        sourceCount,
        destinationCount,
      })),
    ),
  )(
    "moves from a $sourceCount-column row into a $destinationCount-column row",
    ({ sourceCount, destinationCount }) => {
      const sourceColumns = Array.from({ length: sourceCount }, (_, index) =>
        column(`Source ${index + 1}`),
      );
      const destinationColumns = Array.from(
        { length: destinationCount },
        (_, index) => column(`Destination ${index + 1}`),
      );
      const sourceRow = schema.nodes.columns.create(
        { layout: `${sourceCount}_columns` },
        sourceColumns,
      );
      const destinationRow = schema.nodes.columns.create(
        { layout: `${destinationCount}_columns` },
        destinationColumns,
      );
      const doc = schema.nodes.doc.create(null, [sourceRow, destinationRow]);
      const sourceColumnIndex = sourceCount - 1;
      const sourcePosition =
        1 +
        sourceColumns
          .slice(0, sourceColumnIndex)
          .reduce(
            (position, sourceColumn) => position + sourceColumn.nodeSize,
            0,
          ) +
        1;
      const state = EditorState.create({ doc });

      const tr = createPortfolioGridDropTransaction(
        state,
        sourceRow.nodeSize,
        "right",
        destinationCount - 1,
        sourcePosition,
      );

      expect(tr).not.toBeNull();
      const destination = tr!.doc.lastChild!;
      expect(destination.type.name).toBe("columns");
      expect(destination.childCount).toBe(destinationCount + 1);
      expect(destination.lastChild?.textContent).toBe(`Source ${sourceCount}`);
      expect(destination.attrs.layout).toBe(
        destinationCount + 1 === 3
          ? "three_equal"
          : destinationCount + 1 === 4
            ? "four_equal"
            : "five_equal",
      );
    },
  );

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
      createPortfolioGridDropTransaction(state, source.nodeSize, "right", 4),
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
    const tr = createPortfolioGridDropTransaction(state, 0, "right", 1);

    expect(tr).not.toBeNull();
    const columns = tr!.doc.firstChild!;
    expect(columns.childCount).toBe(2);
    expect(columns.child(0).textContent).toBe("B");
    expect(columns.child(1).textContent).toBe("A");
  });

  it("swaps the right element to the left in the same grid", () => {
    const existingColumns = schema.nodes.columns.create(
      { layout: "two_equal" },
      [column("A"), column("B")],
    );
    const doc = schema.nodes.doc.create(null, existingColumns);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 7),
    });
    const tr = createPortfolioGridDropTransaction(state, 0, "left", 0);

    expect(tr).not.toBeNull();
    const columns = tr!.doc.firstChild!;
    expect(columns.child(0).textContent).toBe("B");
    expect(columns.child(1).textContent).toBe("A");
  });

  it("splits a block from a populated column into a new adjacent column", () => {
    const firstColumn = schema.nodes.column.create(null, [
      paragraph("A"),
      paragraph("B"),
    ]);
    const existingColumns = schema.nodes.columns.create(
      { layout: "two_equal" },
      [firstColumn, column("C")],
    );
    const doc = schema.nodes.doc.create(null, existingColumns);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 5),
    });
    const tr = createPortfolioGridDropTransaction(state, 0, "right", 0);

    expect(tr).not.toBeNull();
    const columns = tr!.doc.firstChild!;
    expect(columns.attrs.layout).toBe("three_equal");
    expect(columns.childCount).toBe(3);
    expect(columns.child(0).textContent).toBe("A");
    expect(columns.child(1).textContent).toBe("B");
    expect(columns.child(2).textContent).toBe("C");
  });
});

describe("portfolio vertical drop", () => {
  it("moves a block onto a separate row below another block", () => {
    const state = selectedState([paragraph("A"), paragraph("B")]);
    const targetPosition = state.doc.child(0).nodeSize;
    const tr = createPortfolioVerticalDropTransaction(
      state,
      targetPosition,
      "bottom",
    );

    expect(tr).not.toBeNull();
    expect(tr!.doc.childCount).toBe(2);
    expect(tr!.doc.child(0).textContent).toBe("B");
    expect(tr!.doc.child(1).textContent).toBe("A");
  });

  it("moves a block onto a separate row above another block", () => {
    const doc = schema.nodes.doc.create(null, [paragraph("A"), paragraph("B")]);
    const secondPosition = doc.child(0).nodeSize;
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, secondPosition),
    });
    const tr = createPortfolioVerticalDropTransaction(state, 0, "top");

    expect(tr).not.toBeNull();
    expect(tr!.doc.child(0).textContent).toBe("B");
    expect(tr!.doc.child(1).textContent).toBe("A");
  });

  it("extracts a column block into a full-width row and rebalances 3 to 2", () => {
    const existingColumns = schema.nodes.columns.create(
      { layout: "three_equal" },
      [column("A"), column("B"), column("C")],
    );
    const doc = schema.nodes.doc.create(null, existingColumns);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 7),
    });
    const tr = createPortfolioVerticalDropTransaction(state, 0, "bottom");

    expect(tr).not.toBeNull();
    expect(tr!.doc.childCount).toBe(2);
    expect(tr!.doc.child(0).type.name).toBe("columns");
    expect(tr!.doc.child(0).attrs.layout).toBe("two_equal");
    expect(tr!.doc.child(0).child(0).textContent).toBe("A");
    expect(tr!.doc.child(0).child(1).textContent).toBe("C");
    expect(tr!.doc.child(1).textContent).toBe("B");
  });

  it("automatically rebalances 4 to 3 when a grid item moves to its own row", () => {
    const existingColumns = schema.nodes.columns.create(
      { layout: "four_equal" },
      [column("A"), column("B"), column("C"), column("D")],
    );
    const doc = schema.nodes.doc.create(null, existingColumns);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 7),
    });

    const tr = createPortfolioVerticalDropTransaction(state, 0, "bottom");

    expect(tr).not.toBeNull();
    const row = tr!.doc.firstChild!;
    expect(row.type.name).toBe("columns");
    expect(row.attrs.layout).toBe("three_equal");
    expect(row.childCount).toBe(3);
    expect(
      Array.from({ length: 3 }, (_, index) => row.child(index).attrs.width),
    ).toEqual([1, 1, 1]);
    expect(tr!.doc.child(1).textContent).toBe("B");
  });

  it("unwraps the remaining element when extracting from a two-column row", () => {
    const existingColumns = schema.nodes.columns.create(
      { layout: "two_equal" },
      [column("A"), column("B")],
    );
    const doc = schema.nodes.doc.create(null, existingColumns);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 2),
    });
    const tr = createPortfolioVerticalDropTransaction(state, 0, "bottom");

    expect(tr).not.toBeNull();
    expect(tr!.doc.childCount).toBe(2);
    expect(tr!.doc.child(0).type.name).toBe("paragraph");
    expect(tr!.doc.child(0).textContent).toBe("B");
    expect(tr!.doc.child(1).textContent).toBe("A");
  });

  it("removes a media column whose only remainder is its editable placeholder", () => {
    const mediaColumn = schema.nodes.column.create(null, [
      media(),
      paragraph(""),
    ]);
    const existingColumns = schema.nodes.columns.create(
      { layout: "two_equal" },
      [mediaColumn, column("B")],
    );
    const doc = schema.nodes.doc.create(null, existingColumns);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 2),
    });
    const tr = createPortfolioVerticalDropTransaction(state, 0, "bottom");

    expect(tr).not.toBeNull();
    expect(tr!.doc.childCount).toBe(2);
    expect(tr!.doc.child(0).textContent).toBe("B");
    expect(tr!.doc.child(1).type.name).toBe("media");
  });

  it("does not unwrap an atom column's editable placeholder between extracted rows", () => {
    const editableAtomColumn = () =>
      schema.nodes.column.create(null, [media(), paragraph("")]);
    const existingColumns = schema.nodes.columns.create(
      { layout: "two_equal" },
      [editableAtomColumn(), editableAtomColumn()],
    );
    const doc = schema.nodes.doc.create(null, existingColumns);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 7),
    });

    const tr = createPortfolioVerticalDropTransaction(state, 0, "bottom");

    expect(tr).not.toBeNull();
    expect(tr!.doc.childCount).toBe(2);
    expect(tr!.doc.child(0).type.name).toBe("media");
    expect(tr!.doc.child(1).type.name).toBe("media");
  });
});
