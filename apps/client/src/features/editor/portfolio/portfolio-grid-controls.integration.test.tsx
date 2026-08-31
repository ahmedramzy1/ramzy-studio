// @vitest-environment jsdom

import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { Editor as TiptapEditor, Node } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import StarterKit from "@tiptap/starter-kit";
import { Column, Columns } from "@docmost/editor-ext";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PortfolioGridControls } from "./portfolio-grid-controls";
import { PortfolioGridResizePreview } from "./portfolio-grid-resize-preview-extension";

class TestPointerEvent extends MouseEvent {
  readonly pointerId: number;

  constructor(type: string, init: PointerEventInit) {
    super(type, init);
    this.pointerId = init.pointerId ?? 0;
  }
}

function pointerEvent(
  type: string,
  clientX: number,
  pointerId = 9,
  clientY = 200,
) {
  return new TestPointerEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    clientX,
    clientY,
    pointerId,
  });
}

function rect(left: number, width: number, height = 300): DOMRect {
  return {
    left,
    right: left + width,
    top: 100,
    bottom: 100 + height,
    width,
    height,
    x: left,
    y: 100,
    toJSON: () => ({}),
  };
}

const TestColumns = Node.create({
  name: "columns",
  group: "block",
  content: "column+",
  addAttributes: () => ({
    layout: { default: "two_equal" },
    widthMode: { default: "normal" },
    customWidth: { default: null },
  }),
  parseHTML: () => [{ tag: 'div[data-type="columns"]' }],
  renderHTML: ({ HTMLAttributes }) => [
    "div",
    { ...HTMLAttributes, "data-type": "columns" },
    0,
  ],
});

const TestColumn = Node.create({
  name: "column",
  group: "block",
  content: "block+",
  addAttributes: () => ({ width: { default: null } }),
  parseHTML: () => [{ tag: 'div[data-type="column"]' }],
  renderHTML: ({ HTMLAttributes }) => [
    "div",
    { ...HTMLAttributes, "data-type": "column" },
    0,
  ],
});

function previewWidth(
  element: HTMLElement,
  property: string,
  fallback: number,
) {
  return (
    Number.parseFloat(element.style.getPropertyValue(property)) || fallback
  );
}

function setupProseMirrorGrid() {
  const element = document.createElement("div");
  document.body.append(element);
  const editor = new TiptapEditor({
    element,
    extensions: [
      Document,
      Paragraph,
      Text,
      TestColumns,
      TestColumn,
      PortfolioGridResizePreview,
    ],
    content: {
      type: "doc",
      content: [
        {
          type: "columns",
          content: [
            { type: "column", content: [{ type: "paragraph" }] },
            { type: "column", content: [{ type: "paragraph" }] },
          ],
        },
      ],
    },
  });
  const editorDom = editor.view.dom;
  const row = editorDom.querySelector<HTMLElement>('[data-type="columns"]')!;
  const [left, right] = Array.from(
    row.querySelectorAll<HTMLElement>('[data-type="column"]'),
  );
  Object.defineProperty(editorDom, "getBoundingClientRect", {
    value: () => rect(100, 800),
  });
  Object.defineProperty(row, "getBoundingClientRect", {
    value: () =>
      rect(100, previewWidth(row, "--ramzy-grid-preview-width", 800)),
  });
  Object.defineProperty(left, "getBoundingClientRect", {
    value: () =>
      rect(100, previewWidth(left, "--ramzy-grid-preview-column-width", 400)),
  });
  Object.defineProperty(right, "getBoundingClientRect", {
    value: () => {
      const leftWidth = previewWidth(
        left,
        "--ramzy-grid-preview-column-width",
        400,
      );
      return rect(
        100 + leftWidth,
        previewWidth(right, "--ramzy-grid-preview-column-width", 400),
      );
    },
  });
  render(<PortfolioGridControls editor={editor} />);
  fireEvent.pointerMove(row);
  return { editor, row, left, right };
}

describe("portfolio grid resize through browser pointer events", () => {
  beforeEach(() => {
    vi.stubGlobal("PointerEvent", TestPointerEvent);
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(performance.now());
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    cleanup();
    document.body.replaceChildren();
    vi.unstubAllGlobals();
  });

  it("keeps live divider widths after ProseMirror observes the DOM and before release", async () => {
    const { editor, left, right } = setupProseMirrorGrid();
    const divider = document.querySelector<HTMLElement>(
      '.ramzy-grid-resize-handle[data-kind="divider"]',
    )!;
    act(() => {
      divider.dispatchEvent(pointerEvent("pointerdown", 500));
      window.dispatchEvent(pointerEvent("pointermove", 600));
    });

    await Promise.resolve();
    expect(
      left.style.getPropertyValue("--ramzy-grid-preview-column-width"),
    ).toBe("500px");
    expect(
      right.style.getPropertyValue("--ramzy-grid-preview-column-width"),
    ).toBe("300px");
    expect(left.classList.contains("ramzy-grid-resize-preview-column")).toBe(
      true,
    );
    expect(divider.dataset.resizing).toBe("true");

    act(() => {
      window.dispatchEvent(pointerEvent("pointerup", 600));
    });

    const rowNode = editor.state.doc.child(0);
    expect(
      Array.from(
        { length: rowNode.childCount },
        (_, index) => rowNode.child(index).attrs,
      ),
    ).toEqual([
      expect.objectContaining({ width: 1.25 }),
      expect.objectContaining({ width: 0.75 }),
    ]);
    editor.destroy();
  });

  it("keeps the live outer width after ProseMirror observes the DOM and before release", async () => {
    const { editor, row } = setupProseMirrorGrid();

    const outerRight = document.querySelector<HTMLElement>(
      '.ramzy-grid-resize-handle[data-kind="outer"][data-side="right"]',
    )!;
    act(() => {
      outerRight.dispatchEvent(pointerEvent("pointerdown", 900, 10));
      window.dispatchEvent(pointerEvent("pointermove", 964, 10));
    });

    await Promise.resolve();
    expect(row.style.getPropertyValue("--ramzy-grid-preview-width")).toBe(
      "928px",
    );
    expect(row.classList.contains("ramzy-grid-resize-preview-row")).toBe(true);
    expect(outerRight.dataset.resizing).toBe("true");
    expect(editor.getJSON().content?.[0].attrs).toEqual(
      expect.objectContaining({ customWidth: null }),
    );
    editor.destroy();
  });

  it("serializes exact row width and lets a width preset reset it", () => {
    const editor = new TiptapEditor({
      extensions: [StarterKit, Columns, Column],
      content: {
        type: "doc",
        content: [
          {
            type: "columns",
            attrs: {
              layout: "two_equal",
              widthMode: "wide",
              customWidth: 870,
            },
            content: [
              { type: "column", content: [{ type: "paragraph" }] },
              { type: "column", content: [{ type: "paragraph" }] },
            ],
          },
        ],
      },
    });

    expect(editor.getHTML()).toContain('data-custom-width="870"');
    expect(editor.getHTML()).toContain("--ramzy-columns-custom-width: 870px");

    editor.commands.setTextSelection(2);
    expect(editor.commands.setColumnsWidthMode("normal")).toBe(true);
    expect(editor.getJSON().content?.[0].attrs).toEqual(
      expect.objectContaining({ customWidth: null, widthMode: "normal" }),
    );
    editor.destroy();
  });
});
