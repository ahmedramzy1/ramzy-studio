import { Schema } from "@tiptap/pm/model";
import { describe, expect, it } from "vitest";
import { portfolioColumnInsertionPoints } from "./portfolio-column-insertion";

const schema = new Schema({
  nodes: {
    doc: { content: "block+" },
    text: { group: "inline" },
    paragraph: { group: "block", content: "text*" },
    media: { group: "block", atom: true },
    columns: { group: "block", content: "column+" },
    column: { content: "block+" },
  },
});

function paragraph(text = "") {
  return schema.nodes.paragraph.create(
    null,
    text ? schema.text(text) : undefined,
  );
}

describe("portfolio column insertion points", () => {
  it("targets every column and reuses a trailing editable paragraph", () => {
    const row = schema.nodes.columns.create(null, [
      schema.nodes.column.create(null, paragraph("A")),
      schema.nodes.column.create(null, [
        schema.nodes.media.create(),
        paragraph(),
      ]),
      schema.nodes.column.create(null, paragraph("C")),
    ]);

    const points = portfolioColumnInsertionPoints(row, 10);

    expect(points).toHaveLength(3);
    expect(points.map((point) => point.columnIndex)).toEqual([0, 1, 2]);
    expect(points[0].emptyParagraphPosition).toBeNull();
    expect(points[1].emptyParagraphPosition).not.toBeNull();
    expect(points[1].insertionPosition).toBe(
      points[1].emptyParagraphPosition! + paragraph().nodeSize,
    );
  });
});
