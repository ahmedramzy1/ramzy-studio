// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Column, Columns } from "@docmost/editor-ext";

const dndHarness = vi.hoisted(() => ({
  monitor: null as null | Record<string, (...args: any[]) => void>,
}));

vi.mock("@atlaskit/pragmatic-drag-and-drop/element/adapter", () => ({
  draggable: () => () => undefined,
  dropTargetForElements: () => () => undefined,
  monitorForElements: (monitor: Record<string, (...args: any[]) => void>) => {
    dndHarness.monitor = monitor;
    return () => undefined;
  },
}));

vi.mock("@atlaskit/pragmatic-drag-and-drop-auto-scroll/element", () => ({
  autoScrollWindowForElements: () => () => undefined,
}));

vi.mock(
  "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview",
  () => ({ setCustomNativeDragPreview: () => undefined }),
);

vi.mock(
  "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview",
  () => ({ pointerOutsideOfPreview: () => () => ({ x: 0, y: 0 }) }),
);

import { PortfolioDnd } from "./portfolio-dnd";

function setRect(
  element: HTMLElement,
  left: number,
  top: number,
  width: number,
  height: number,
) {
  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      left,
      right: left + width,
      top,
      bottom: top + height,
      width,
      height,
      x: left,
      y: top,
      toJSON: () => ({}),
    }),
  });
}

function topLevelByText(editor: Editor, text: string) {
  return Array.from(editor.view.dom.children).find(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.textContent === text,
  )!;
}

function layoutEditor(editor: Editor) {
  setRect(editor.view.dom, 100, 0, 1000, 1400);
  let top = 100;
  Array.from(editor.view.dom.children).forEach((element) => {
    if (!(element instanceof HTMLElement)) return;
    const isGrid = element.dataset.type === "columns";
    const height = isGrid ? 320 : 100;
    setRect(element, 100, top, 1000, height);
    if (isGrid) {
      const columns = Array.from(element.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement,
      );
      const width = 1000 / columns.length;
      columns.forEach((column, index) =>
        setRect(column, 100 + width * index, top, width, height),
      );
    }
    top += height + 100;
  });
}

function dragData(editor: Editor, sourceElement: HTMLElement) {
  const raw = editor.view.posAtDOM(sourceElement, 0);
  let sourcePosition = raw;
  if (!editor.state.doc.nodeAt(raw)?.isBlock) {
    const $position = editor.state.doc.resolve(raw);
    for (let depth = $position.depth; depth > 0; depth -= 1) {
      const before = $position.before(depth);
      if (editor.state.doc.nodeAt(before)?.isBlock) {
        sourcePosition = before;
        break;
      }
    }
  }
  return {
    type: "ramzy-portfolio-block",
    sourcePosition,
    sourceElement,
    label: sourceElement.textContent || "block",
  };
}

function dragToRight(editor: Editor, sourceText: string) {
  layoutEditor(editor);
  const sourceElement = topLevelByText(editor, sourceText);
  const target = editor.view.dom.firstElementChild as HTMLElement;
  const targetColumn =
    target.dataset.type === "columns"
      ? (target.lastElementChild as HTMLElement)
      : target;
  const rect = targetColumn.getBoundingClientRect();
  const source = { data: dragData(editor, sourceElement) };
  const location = {
    current: {
      input: {
        clientX: rect.right - 4,
        clientY: rect.top + rect.height / 2,
      },
    },
  };

  dndHarness.monitor!.onDragStart({ source });
  dndHarness.monitor!.onDrag({ source, location });
  return { source, location, target };
}

describe("PortfolioDnd stable surface integration", () => {
  let editor: Editor;

  beforeEach(() => {
    const element = document.createElement("div");
    document.body.append(element);
    editor = new Editor({
      element,
      extensions: [Document, Paragraph, Text, Columns, Column],
      content: {
        type: "doc",
        content: ["A", "B", "C", "D", "E"].map((text) => ({
          type: "paragraph",
          content: [{ type: "text", text }],
        })),
      },
    });
    render(<PortfolioDnd editor={editor} />);
  });

  afterEach(() => {
    cleanup();
    editor.destroy();
    document.body.replaceChildren();
    dndHarness.monitor = null;
  });

  it("previews without moving the target and completes repeated 2-to-5-column drops", () => {
    const first = dragToRight(editor, "B");
    expect(first.target.style.width).toBe("");
    expect(first.target.style.left).toBe("");
    expect(first.target.style.order).toBe("");
    expect(
      document.querySelectorAll(
        ".ramzy-dnd-layout-overlay .ramzy-dnd-future-grid > [data-type='column']",
      ),
    ).toHaveLength(2);
    dndHarness.monitor!.onDrop(first);

    for (const [sourceText, expectedColumns] of [
      ["C", 3],
      ["D", 4],
      ["E", 5],
    ] as const) {
      const drag = dragToRight(editor, sourceText);
      expect(
        document.querySelectorAll(
          ".ramzy-dnd-layout-overlay .ramzy-dnd-future-grid > [data-type='column']",
        ),
      ).toHaveLength(expectedColumns);
      dndHarness.monitor!.onDrop(drag);
      expect(editor.state.doc.firstChild!.childCount).toBe(expectedColumns);
    }

    const row = editor.state.doc.firstChild!;
    expect(row.type.name).toBe("columns");
    expect(row.attrs.layout).toBe("five_equal");
    expect(
      Array.from({ length: 5 }, (_, index) => row.child(index).textContent),
    ).toEqual(["A", "B", "C", "D", "E"]);
  });
});
