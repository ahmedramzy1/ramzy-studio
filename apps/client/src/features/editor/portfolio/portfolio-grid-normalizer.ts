import { Extension } from "@tiptap/core";
import { Fragment, type Node as PMNode } from "@tiptap/pm/model";
import { Plugin } from "@tiptap/pm/state";
import type { EditorState, Transaction } from "@tiptap/pm/state";

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

export function normalizePortfolioGridTransaction(
  state: EditorState,
): Transaction | null {
  const columnsType = state.schema.nodes.columns;
  const paragraphType = state.schema.nodes.paragraph;
  if (!columnsType || !paragraphType) return null;

  const rows: Array<{ node: PMNode; position: number }> = [];
  state.doc.forEach((node, position) => {
    if (node.type === columnsType) rows.push({ node, position });
  });
  if (rows.length === 0) return null;

  const tr = state.tr;
  let changed = false;

  for (const row of rows.reverse()) {
    const columns = Array.from({ length: row.node.childCount }, (_, index) =>
      row.node.child(index),
    );

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

    const layoutChanged = layoutCount(row.node.attrs.layout) !== columns.length;
    if (!layoutChanged) continue;

    const replacement = columnsType.create(
      {
        ...row.node.attrs,
        layout: layoutForCount(columns.length),
      },
      Fragment.from(columns),
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
        appendTransaction: (transactions, _oldState, newState) => {
          if (!transactions.some((transaction) => transaction.docChanged)) {
            return null;
          }
          return normalizePortfolioGridTransaction(newState);
        },
      }),
    ];
  },
});
