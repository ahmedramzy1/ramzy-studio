// @vitest-environment jsdom

import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import type { Editor } from "@tiptap/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const interactHarness = vi.hoisted(() => ({
  listeners: new Map<
    HTMLElement,
    Record<string, (event: { dx: number }) => void>
  >(),
}));

vi.mock("interactjs", () => ({
  default: (element: HTMLElement) => ({
    draggable: (options: {
      listeners: Record<string, (event: { dx: number }) => void>;
    }) => {
      interactHarness.listeners.set(element, options.listeners);
    },
    unset: () => interactHarness.listeners.delete(element),
  }),
}));

import { PortfolioGridControls } from "./portfolio-grid-controls";

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
  editorDom.dataset.testEditorRoot = "true";
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
  const transaction = {
    setNodeMarkup: vi.fn().mockReturnThis(),
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
      tr: transaction,
    },
    on: vi.fn(),
    off: vi.fn(),
  } as unknown as Editor;

  render(<PortfolioGridControls editor={editor} />);
  fireEvent.pointerMove(row);
  return { editorDom, row, left, right };
}

describe("PortfolioGridControls live pointer preview", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    cleanup();
    document
      .querySelectorAll<HTMLElement>('[data-test-editor-root="true"]')
      .forEach((element) => element.remove());
    vi.unstubAllGlobals();
    interactHarness.listeners.clear();
  });

  it("changes adjacent column pixels before pointer release", async () => {
    const { left, right } = setupGrid();
    const handle = await waitFor(() => {
      const element = document.querySelector<HTMLElement>(
        '.ramzy-grid-resize-handle[data-kind="divider"]',
      );
      expect(element).not.toBeNull();
      return element!;
    });

    const listeners = interactHarness.listeners.get(handle)!;
    listeners.start({ dx: 0 });
    listeners.move({ dx: 100 });

    expect(left.style.getPropertyValue("width")).toBe("500px");
    expect(right.style.getPropertyValue("width")).toBe("300px");
    expect(handle.dataset.resizing).toBe("true");
    await waitFor(() => expect(handle.style.left).toBe("591px"));
  });

  it("changes the full row width before pointer release", async () => {
    const { row } = setupGrid();
    const handles = await waitFor(() => {
      const elements = document.querySelectorAll<HTMLElement>(
        '.ramzy-grid-resize-handle[data-kind="outer"]',
      );
      expect(elements).toHaveLength(2);
      return elements;
    });
    const rightHandle = handles[1];

    const listeners = interactHarness.listeners.get(rightHandle)!;
    listeners.start({ dx: 0 });
    listeners.move({ dx: 64 });

    expect(row.style.getPropertyValue("width")).toBe("928px");
    expect(rightHandle.dataset.resizing).toBe("true");
    await waitFor(() => expect(rightHandle.style.left).toBe("1019px"));
  });
});
