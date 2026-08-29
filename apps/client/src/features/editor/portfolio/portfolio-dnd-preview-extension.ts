import { Extension, type Editor } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export type PortfolioDndPreviewState = {
  sourcePosition: number;
  targetPosition: number;
  edge: "top" | "bottom" | "left" | "right";
  columnIndex: number | null;
  sourceHeight: number;
};

export const portfolioDndPreviewKey =
  new PluginKey<PortfolioDndPreviewState | null>("portfolioDndPreview");

function isEmptyParagraph(node: import("@tiptap/pm/model").Node) {
  return node.type.name === "paragraph" && node.content.size === 0;
}

function sourceColumnDecoration(
  state: import("@tiptap/pm/state").EditorState,
  preview: PortfolioDndPreviewState,
) {
  const target = state.doc.nodeAt(preview.targetPosition);
  if (target?.type.name !== "columns") return null;

  let columnPosition = preview.targetPosition + 1;
  for (let columnIndex = 0; columnIndex < target.childCount; columnIndex += 1) {
    const column = target.child(columnIndex);
    let blockPosition = columnPosition + 1;
    for (let blockIndex = 0; blockIndex < column.childCount; blockIndex += 1) {
      const block = column.child(blockIndex);
      if (blockPosition === preview.sourcePosition) {
        const remaining = Array.from(
          { length: column.childCount },
          (_, index) => column.child(index),
        ).filter((_, index) => index !== blockIndex);
        if (remaining.every(isEmptyParagraph)) {
          return Decoration.node(
            columnPosition,
            columnPosition + column.nodeSize,
            { class: "ramzy-dnd-source-column-vacated" },
          );
        }
        return null;
      }
      blockPosition += block.nodeSize;
    }
    columnPosition += column.nodeSize;
  }
  return null;
}

function columnInsertionPosition(
  row: import("@tiptap/pm/model").Node,
  rowPosition: number,
  columnIndex: number,
  edge: "left" | "right",
) {
  const insertionIndex = Math.max(
    0,
    Math.min(columnIndex + (edge === "right" ? 1 : 0), row.childCount),
  );
  let position = rowPosition + 1;
  for (let index = 0; index < insertionIndex; index += 1) {
    position += row.child(index).nodeSize;
  }
  return position;
}

function slot(height: number, className: string) {
  const element = document.createElement("div");
  element.className = className;
  element.setAttribute("contenteditable", "false");
  element.setAttribute("aria-hidden", "true");
  element.style.setProperty("--ramzy-dnd-source-height", `${height}px`);
  return element;
}

function decorationsForPortfolioDndPreview(
  state: import("@tiptap/pm/state").EditorState,
  preview: PortfolioDndPreviewState | null,
) {
  if (!preview) return DecorationSet.empty;
  const source = state.doc.nodeAt(preview.sourcePosition);
  const target = state.doc.nodeAt(preview.targetPosition);
  if (!source?.isBlock || !target?.isBlock) return DecorationSet.empty;

  const decorations: Decoration[] = [
    Decoration.node(
      preview.sourcePosition,
      preview.sourcePosition + source.nodeSize,
      { class: "ramzy-dnd-source" },
    ),
  ];

  if (preview.edge === "left" || preview.edge === "right") {
    if (target.type.name === "columns" && preview.columnIndex !== null) {
      decorations.push(
        Decoration.node(
          preview.targetPosition,
          preview.targetPosition + target.nodeSize,
          { class: "ramzy-dnd-preview-row" },
        ),
        Decoration.widget(
          columnInsertionPosition(
            target,
            preview.targetPosition,
            preview.columnIndex,
            preview.edge,
          ),
          () => slot(preview.sourceHeight, "ramzy-dnd-column-slot"),
          { key: "ramzy-dnd-column-slot", side: -1 },
        ),
      );
      const vacated = sourceColumnDecoration(state, preview);
      if (vacated) decorations.push(vacated);
    } else {
      decorations.push(
        Decoration.node(
          preview.targetPosition,
          preview.targetPosition + target.nodeSize,
          {
            class: "ramzy-dnd-preview-single-row",
            "data-ramzy-drop-edge": preview.edge,
          },
        ),
      );
    }
  } else {
    const position =
      preview.edge === "top"
        ? preview.targetPosition
        : preview.targetPosition + target.nodeSize;
    decorations.push(
      Decoration.widget(
        position,
        () => slot(preview.sourceHeight, "ramzy-dnd-row-slot"),
        {
          key: `ramzy-dnd-row-slot-${preview.targetPosition}-${preview.edge}`,
          side: preview.edge === "top" ? -1 : 1,
        },
      ),
    );
  }

  return DecorationSet.create(state.doc, decorations);
}

export function setPortfolioDndPreview(
  editor: Editor,
  preview: PortfolioDndPreviewState | null,
) {
  if (editor.isDestroyed) return;
  const current = portfolioDndPreviewKey.getState(editor.state) ?? null;
  if (
    current === preview ||
    (current !== null &&
      preview !== null &&
      current.sourcePosition === preview.sourcePosition &&
      current.targetPosition === preview.targetPosition &&
      current.edge === preview.edge &&
      current.columnIndex === preview.columnIndex &&
      current.sourceHeight === preview.sourceHeight)
  ) {
    return;
  }
  editor.view.dispatch(
    editor.state.tr.setMeta(portfolioDndPreviewKey, preview),
  );
}

export const PortfolioDndPreview = Extension.create({
  name: "portfolioDndPreview",

  addProseMirrorPlugins() {
    return [
      new Plugin<PortfolioDndPreviewState | null>({
        key: portfolioDndPreviewKey,
        state: {
          init: () => null,
          apply: (transaction, current) => {
            const next = transaction.getMeta(portfolioDndPreviewKey) as
              | PortfolioDndPreviewState
              | null
              | undefined;
            return next === undefined ? current : next;
          },
        },
        props: {
          handleDOMEvents: {
            dragstart: (_view, event) => {
              const target = event.target;
              return (
                target instanceof Element &&
                !!target.closest("[data-ramzy-block-drag-handle]")
              );
            },
            drop: (_view, event) => event.defaultPrevented,
          },
          decorations(state) {
            return decorationsForPortfolioDndPreview(
              state,
              portfolioDndPreviewKey.getState(state) ?? null,
            );
          },
        },
      }),
    ];
  },
});
