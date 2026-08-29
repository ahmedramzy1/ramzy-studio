// @vitest-environment jsdom

import { act, cleanup, fireEvent, render } from "@testing-library/react";
import type { Editor } from "@tiptap/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PortfolioGridControls } from "./portfolio-grid-controls";

class TestDataTransfer {
  dropEffect = "none";
  effectAllowed = "all";
  files = [];
  items = [];
  private values = new Map<string, string>();
  get types() {
    return [...this.values.keys()];
  }
  clearData() {
    this.values.clear();
  }
  getData(type: string) {
    return this.values.get(type) ?? "";
  }
  setData(type: string, value: string) {
    this.values.set(type, value);
  }
  setDragImage() {}
}

class TestDragEvent extends MouseEvent {
  readonly dataTransfer = new TestDataTransfer() as unknown as DataTransfer;
}

function dragEvent(type: string, clientX: number, clientY = 200) {
  return new TestDragEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
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

describe("portfolio grid resize through Pragmatic Drag and Drop", () => {
  beforeEach(() => {
    vi.stubGlobal("DragEvent", TestDragEvent);
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

  it("updates divider and row widths during the native drag frame", () => {
    const { row, left, right } = setupGrid();
    const divider = document.querySelector<HTMLElement>(
      '.ramzy-grid-resize-handle[data-kind="divider"]',
    )!;
    expect(divider.draggable).toBe(true);

    act(() => {
      divider.dispatchEvent(dragEvent("dragstart", 500));
      document.body.dispatchEvent(dragEvent("dragover", 600));
    });

    expect(left.style.width).toBe("500px");
    expect(right.style.width).toBe("300px");
    expect(divider.dataset.resizing).toBe("true");

    act(() => {
      document.body.dispatchEvent(dragEvent("drop", 600));
    });

    const outerRight = document.querySelector<HTMLElement>(
      '.ramzy-grid-resize-handle[data-kind="outer"][data-side="right"]',
    )!;
    act(() => {
      outerRight.dispatchEvent(dragEvent("dragstart", 900));
      document.body.dispatchEvent(dragEvent("dragover", 964));
    });

    expect(row.style.width).toBe("928px");
    expect(outerRight.dataset.resizing).toBe("true");
  });
});
