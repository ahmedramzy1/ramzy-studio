import { Extension, type Editor } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export type PortfolioGridResizePreviewState =
  | {
      kind: "block";
      position: number;
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

export const PORTFOLIO_RESIZABLE_BLOCK_TYPES = [
  "paragraph",
  "heading",
  "blockquote",
  "bulletList",
  "orderedList",
  "taskList",
  "codeBlock",
  "horizontalRule",
  "table",
  "mathBlock",
  "details",
  "youtube",
  "image",
  "video",
  "audio",
  "mediaPlaylist",
  "photoGrid",
  "photoAlbum",
  "callout",
  "attachment",
  "drawio",
  "excalidraw",
  "embed",
  "pdf",
  "pageBreak",
  "subpages",
  "transclusionSource",
  "transclusionReference",
  "base",
] as const;

function validWidth(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.round(value)
    : null;
}

function samePreview(
  current: PortfolioGridResizePreviewState | null,
  next: PortfolioGridResizePreviewState | null,
) {
  if (current === next) return true;
  if (!current || !next || current.kind !== next.kind) return false;
  if (current.kind === "block" && next.kind === "block") {
    return current.position === next.position && current.width === next.width;
  }
  if (current.kind === "columns" && next.kind === "columns") {
    return (
      current.rowPosition === next.rowPosition &&
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
  const decorations: Decoration[] = [];

  state.doc.forEach((node, position) => {
    if (preview?.kind === "block" && preview.position === position) return;
    const width = validWidth(
      node.type.name === "columns"
        ? node.attrs.customWidth
        : node.attrs.portfolioWidth,
    );
    if (!width) return;
    decorations.push(
      Decoration.node(position, position + node.nodeSize, {
        class: "ramzy-portfolio-custom-width",
        style: `--ramzy-portfolio-block-width: ${width}px`,
      }),
    );
  });

  if (!preview) return DecorationSet.create(state.doc, decorations);

  if (preview.kind === "block") {
    const block = state.doc.nodeAt(preview.position);
    if (!block?.isBlock) return DecorationSet.create(state.doc, decorations);
    decorations.push(
      Decoration.node(preview.position, preview.position + block.nodeSize, {
        class: "ramzy-block-resize-preview",
        style: `--ramzy-portfolio-block-width: ${preview.width}px`,
      }),
    );
    return DecorationSet.create(state.doc, decorations);
  }

  const row = state.doc.nodeAt(preview.rowPosition);
  if (!row || row.type.name !== "columns") {
    return DecorationSet.create(state.doc, decorations);
  }
  if (row.childCount !== preview.widths.length) {
    return DecorationSet.create(state.doc, decorations);
  }
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

export const PortfolioBlockWidth = Extension.create({
  name: "portfolioBlockWidth",

  addGlobalAttributes() {
    return [
      {
        types: [...PORTFOLIO_RESIZABLE_BLOCK_TYPES],
        attributes: {
          portfolioWidth: {
            default: null,
            parseHTML: (element) => {
              const value = Number.parseFloat(
                element.getAttribute("data-portfolio-width") || "",
              );
              return validWidth(value);
            },
            renderHTML: (attributes) => {
              const width = validWidth(attributes.portfolioWidth);
              if (!width) return {};
              return {
                "data-portfolio-width": width,
                style: `--ramzy-portfolio-block-width: ${width}px`,
              };
            },
          },
        },
      },
    ];
  },
});

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
