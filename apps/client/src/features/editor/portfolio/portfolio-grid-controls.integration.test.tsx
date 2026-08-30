// @vitest-environment jsdom

import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { Editor as TiptapEditor, type Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Column, Columns } from "@docmost/editor-ext";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PortfolioGridControls } from "./portfolio-grid-controls";

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

function setupGrid() {
  const editorDom = document.createElement("div");
  const row = document.createElement("div");
  const left = document.createElement("div");
  const right = document.createElement("div");
  row.dataset.type = "columns";
  left.dataset.type = "column";
  right.dataset.type = "column";
  row.append(left, right);
  editorDom.append(row);
  document.body.append(editorDom);

  Object.defineProperty(editorDom, "getBoundingClientRect", {
    value: () => rect(100, 800),
  });
  Object.defineProperty(row, "getBoundingClientRect", {
    value: () => rect(100, Number.parseFloat(row.style.width) || 800),
  });
  Object.defineProperty(left, "getBoundingClientRect", {
    value: () => rect(100, Number.parseFloat(left.style.width) || 400),
  });
  Object.defineProperty(right, "getBoundingClientRect", {
    value: () =>
      rect(
        100 + (Number.parseFloat(left.style.width) || 400),
        Number.parseFloat(right.style.width) || 400,
      ),
  });

  const columnNode = { attrs: {}, nodeSize: 2 };
  const rowNode = {
    type: { name: "columns" },
    attrs: {},
    childCount: 2,
    forEach: (
      callback: (
        node: typeof columnNode,
        offset: number,
        index: number,
      ) => void,
    ) => {
      callback(columnNode, 0, 0);
      callback(columnNode, 2, 1);
    },
  };
  const editor = {
    isDestroyed: false,
    isEditable: true,
    view: {
      dom: editorDom,
      posAtDOM: () => 0,
      dispatch: vi.fn(),
    },
    state: {
      doc: { nodeAt: () => rowNode },
      tr: { setNodeMarkup: vi.fn().mockReturnThis() },
    },
    on: vi.fn(),
    off: vi.fn(),
  } as unknown as Editor;

  render(<PortfolioGridControls editor={editor} />);
  fireEvent.pointerMove(row);
  return { row, left, right };
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

  it("updates divider and row widths during native pointer movement", () => {
    const { row, left, right } = setupGrid();
    const divider = document.querySelector<HTMLElement>(
      '.ramzy-grid-resize-handle[data-kind="divider"]',
    )!;
    act(() => {
      divider.dispatchEvent(pointerEvent("pointerdown", 500));
      window.dispatchEvent(pointerEvent("pointermove", 600));
    });

    expect(left.style.width).toBe("500px");
    expect(right.style.width).toBe("300px");
    expect(divider.dataset.resizing).toBe("true");

    act(() => {
      window.dispatchEvent(pointerEvent("pointerup", 600));
    });

    const outerRight = document.querySelector<HTMLElement>(
      '.ramzy-grid-resize-handle[data-kind="outer"][data-side="right"]',
    )!;
    act(() => {
      outerRight.dispatchEvent(pointerEvent("pointerdown", 900, 10));
      window.dispatchEvent(pointerEvent("pointermove", 964, 10));
    });

    expect(row.style.width).toBe("928px");
    expect(outerRight.dataset.resizing).toBe("true");
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
    expect(editor.getHTML()).toContain(
      "--ramzy-columns-custom-width: 870px",
    );

    editor.commands.setTextSelection(2);
    expect(editor.commands.setColumnsWidthMode("normal")).toBe(true);
    expect(editor.getJSON().content?.[0].attrs).toEqual(
      expect.objectContaining({ customWidth: null, widthMode: "normal" }),
    );
    editor.destroy();
  });
});
