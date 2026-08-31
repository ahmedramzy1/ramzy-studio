import { Extension, type Editor } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export type PortfolioGridResizePreviewState =
  | {
      kind: "row";
      rowPosition: number;
      width: number;
    }
  | {
      kind: "columns";
      rowPosition: number;
      widths: number[];
    };

export const portfolioGridResizePreviewKey =
  new PluginKey<PortfolioGridResizePreviewState | null>(
    "portfolioGridResizePreview",
  );

function samePreview(
  current: PortfolioGridResizePreviewState | null,
  next: PortfolioGridResizePreviewState | null,
) {
  if (current === next) return true;
  if (!current || !next || current.kind !== next.kind) return false;
  if (current.rowPosition !== next.rowPosition) return false;
  if (current.kind === "row" && next.kind === "row") {
    return current.width === next.width;
  }
  if (current.kind === "columns" && next.kind === "columns") {
    return (
      current.widths.length === next.widths.length &&
      current.widths.every((width, index) => width === next.widths[index])
    );
  }
  return false;
}

function resizeDecorations(
  state: import("@tiptap/pm/state").EditorState,
  preview: PortfolioGridResizePreviewState | null,
) {
  if (!preview) return DecorationSet.empty;
  const row = state.doc.nodeAt(preview.rowPosition);
  if (!row || row.type.name !== "columns") return DecorationSet.empty;

  if (preview.kind === "row") {
    return DecorationSet.create(state.doc, [
      Decoration.node(preview.rowPosition, preview.rowPosition + row.nodeSize, {
        class: "ramzy-grid-resize-preview-row",
        style: `--ramzy-grid-preview-width: ${preview.width}px`,
      }),
    ]);
  }

  if (row.childCount !== preview.widths.length) return DecorationSet.empty;
  const decorations: Decoration[] = [];
  let columnPosition = preview.rowPosition + 1;
  row.forEach((column, _offset, index) => {
    decorations.push(
      Decoration.node(columnPosition, columnPosition + column.nodeSize, {
        class: "ramzy-grid-resize-preview-column",
        style: `--ramzy-grid-preview-column-width: ${preview.widths[index]}px`,
      }),
    );
    columnPosition += column.nodeSize;
  });
  return DecorationSet.create(state.doc, decorations);
}

export function setPortfolioGridResizePreview(
  editor: Editor,
  preview: PortfolioGridResizePreviewState | null,
) {
  if (editor.isDestroyed) return;
  const current = portfolioGridResizePreviewKey.getState(editor.state) ?? null;
  if (samePreview(current, preview)) return;
  editor.view.dispatch(
    editor.state.tr
      .setMeta(portfolioGridResizePreviewKey, preview)
      .setMeta("addToHistory", false),
  );
}

export const PortfolioGridResizePreview = Extension.create({
  name: "portfolioGridResizePreview",

  addProseMirrorPlugins() {
    return [
      new Plugin<PortfolioGridResizePreviewState | null>({
        key: portfolioGridResizePreviewKey,
        state: {
          init: () => null,
          apply: (transaction, current) => {
            const next = transaction.getMeta(portfolioGridResizePreviewKey) as
              | PortfolioGridResizePreviewState
              | null
              | undefined;
            return next === undefined ? current : next;
          },
        },
        props: {
          decorations(state) {
            return resizeDecorations(
              state,
              portfolioGridResizePreviewKey.getState(state) ?? null,
            );
          },
        },
      }),
    ];
  },
});
