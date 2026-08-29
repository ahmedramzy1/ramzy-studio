import { Extension } from "@tiptap/core";
import { Fragment, type Node as PMNode } from "@tiptap/pm/model";
import { Plugin } from "@tiptap/pm/state";
import type { EditorState, Transaction } from "@tiptap/pm/state";
import { normalizedColumnWeights } from "./portfolio-grid-layout";

function layoutForCount(count: number): string {
  if (count === 3) return "three_equal";
  if (count === 4) return "four_equal";
  if (count === 5) return "five_equal";
  return "two_equal";
}

function layoutCount(layout: unknown): number {
  if (typeof layout !== "string") return 2;
  if (layout.startsWith("five")) return 5;
  if (layout.startsWith("four")) return 4;
  if (layout.startsWith("three")) return 3;
  return 2;
}

function isEmptyParagraph(node: PMNode) {
  return node.type.name === "paragraph" && node.content.size === 0;
}

function isEmptyColumn(column: PMNode) {
  return Array.from({ length: column.childCount }, (_, index) =>
    column.child(index),
  ).every(isEmptyParagraph);
}

function containedNonTextBlock(column: PMNode) {
  return Array.from({ length: column.childCount }, (_, index) =>
    column.child(index),
  ).some((node) => !node.isTextblock);
}

function rebalanceColumns(columns: readonly PMNode[]) {
  const weights = normalizedColumnWeights(
    columns.map((column) =>
      typeof column.attrs.width === "number" && column.attrs.width > 0
        ? column.attrs.width
        : 1,
    ),
  );
  return columns.map((column, index) =>
    column.type.create(
      { ...column.attrs, width: weights[index] },
      column.content,
      column.marks,
    ),
  );
}

export function normalizePortfolioGridTransaction(
  state: EditorState,
  previousState?: EditorState,
): Transaction | null {
  const columnsType = state.schema.nodes.columns;
  const paragraphType = state.schema.nodes.paragraph;
  if (!columnsType || !paragraphType) return null;

  const rows: Array<{ node: PMNode; position: number; index: number }> = [];
  state.doc.forEach((node, position, index) => {
    if (node.type === columnsType) rows.push({ node, position, index });
  });
  if (rows.length === 0) return null;

  const tr = state.tr;
  let changed = false;

  for (const row of rows.reverse()) {
    let columns = Array.from({ length: row.node.childCount }, (_, index) =>
      row.node.child(index),
    );
    const previousRow =
      previousState && row.index < previousState.doc.childCount
        ? previousState.doc.child(row.index)
        : null;
    if (
      previousRow?.type === columnsType &&
      previousRow.childCount === row.node.childCount
    ) {
      columns = columns.filter((column, index) => {
        const previousColumn = previousRow.child(index);
        return !(
          isEmptyColumn(column) && containedNonTextBlock(previousColumn)
        );
      });
    }

    if (columns.length === 0) {
      tr.replaceWith(
        row.position,
        row.position + row.node.nodeSize,
        paragraphType.create(),
      );
      changed = true;
      continue;
    }

    if (columns.length === 1) {
      tr.replaceWith(
        row.position,
        row.position + row.node.nodeSize,
        columns[0].content,
      );
      changed = true;
      continue;
    }

    const columnRemoved = columns.length !== row.node.childCount;
    const layoutChanged = layoutCount(row.node.attrs.layout) !== columns.length;
    if (!columnRemoved && !layoutChanged) continue;

    const normalizedColumns = columnRemoved
      ? rebalanceColumns(columns)
      : columns;

    const replacement = columnsType.create(
      {
        ...row.node.attrs,
        layout: layoutForCount(columns.length),
      },
      Fragment.from(normalizedColumns),
    );
    tr.replaceWith(row.position, row.position + row.node.nodeSize, replacement);
    changed = true;
  }

  return changed ? tr : null;
}

export const PortfolioGridNormalizer = Extension.create({
  name: "portfolioGridNormalizer",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction: (transactions, oldState, newState) => {
          if (!transactions.some((transaction) => transaction.docChanged)) {
            return null;
          }
          return normalizePortfolioGridTransaction(newState, oldState);
        },
      }),
    ];
  },
});
