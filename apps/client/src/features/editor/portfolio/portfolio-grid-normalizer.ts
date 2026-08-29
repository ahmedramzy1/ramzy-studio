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

function columnHasContent(column: PMNode): boolean {
  let occupied = false;
  column.forEach((child) => {
    if (child.type.name !== "paragraph" || child.content.size > 0) {
      occupied = true;
    }
  });
  return occupied;
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
    const occupiedColumns = Array.from(
      { length: row.node.childCount },
      (_, index) => row.node.child(index),
    ).filter(columnHasContent);

    if (occupiedColumns.length === 0) {
      tr.replaceWith(
        row.position,
        row.position + row.node.nodeSize,
        paragraphType.create(),
      );
      changed = true;
      continue;
    }

    if (occupiedColumns.length === 1) {
      tr.replaceWith(
        row.position,
        row.position + row.node.nodeSize,
        occupiedColumns[0].content,
      );
      changed = true;
      continue;
    }

    const countChanged = occupiedColumns.length !== row.node.childCount;
    const layoutChanged =
      layoutCount(row.node.attrs.layout) !== occupiedColumns.length;
    if (!countChanged && !layoutChanged) continue;

    const replacement = columnsType.create(
      {
        ...row.node.attrs,
        layout: layoutForCount(occupiedColumns.length),
      },
      Fragment.from(occupiedColumns),
    );
    tr.replaceWith(
      row.position,
      row.position + row.node.nodeSize,
      replacement,
    );
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
