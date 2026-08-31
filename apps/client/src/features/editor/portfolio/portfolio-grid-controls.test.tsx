// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react";
import type { Editor } from "@tiptap/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

class TestPointerEvent extends MouseEvent {
  readonly pointerId: number;
  readonly pointerType: string;

  constructor(type: string, init: PointerEventInit) {
    super(type, init);
    this.pointerId = init.pointerId ?? 0;
    this.pointerType = init.pointerType ?? "";
  }
}

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

function startResize(handle: HTMLElement, clientX = 200, pointerId = 7) {
  fireEvent.pointerDown(handle, { button: 0, clientX, pointerId });
}

function moveResize(clientX: number, pointerId = 7) {
  fireEvent.pointerMove(window, { clientX, pointerId });
}

function finishResize(clientX: number, pointerId = 7) {
  fireEvent.pointerUp(window, { clientX, pointerId });
}

function startMouseResize(handle: HTMLElement, clientX = 200) {
  fireEvent.mouseDown(handle, { button: 0, clientX });
}

function moveMouseResize(clientX: number) {
  fireEvent.mouseMove(window, { buttons: 1, clientX });
}

function finishMouseResize(clientX: number) {
  fireEvent.mouseUp(window, { button: 0, clientX });
}

function setupGrid({ columnCount = 2, gap = 0 } = {}) {
  const editorDom = document.createElement("div");
  editorDom.dataset.testEditorRoot = "true";
  const row = document.createElement("div");
  const columns = Array.from({ length: columnCount }, () =>
    document.createElement("div"),
  );
  row.dataset.type = "columns";
  columns.forEach((column) => {
    column.dataset.type = "column";
    row.append(column);
  });
  editorDom.append(row);
  document.body.append(editorDom);

  const availableWidth = 800 - gap * (columnCount - 1);
  const defaultColumnWidth = availableWidth / columnCount;

  Object.defineProperty(editorDom, "getBoundingClientRect", {
    value: () => rect(100, 800),
  });
  Object.defineProperty(row, "getBoundingClientRect", {
    value: () => rect(100, Number.parseFloat(row.style.width) || 800),
  });
  columns.forEach((column, index) => {
    Object.defineProperty(column, "getBoundingClientRect", {
      value: () => {
        const precedingWidth = columns
          .slice(0, index)
          .reduce(
            (sum, candidate) =>
              sum +
              (Number.parseFloat(candidate.style.width) || defaultColumnWidth),
            0,
          );
        return rect(
          100 + precedingWidth + gap * index,
          Number.parseFloat(column.style.width) || defaultColumnWidth,
        );
      },
    });
  });

  const columnNode = { attrs: {}, nodeSize: 2 };
  const rowNode = {
    type: { name: "columns" },
    attrs: {},
    childCount: columnCount,
    forEach: (
      callback: (
        node: typeof columnNode,
        offset: number,
        index: number,
      ) => void,
    ) => {
      columns.forEach((_column, index) =>
        callback(columnNode, index * 2, index),
      );
    },
  };
  const editorState: Record<string, unknown> = {};
  const transaction = {
    setNodeMarkup: vi.fn().mockReturnThis(),
    setMeta: vi.fn().mockImplementation(function (
      this: { preview?: unknown },
      key: unknown,
      value: unknown,
    ) {
      if (key !== "addToHistory") {
        this.preview = value;
        const pluginKey = key as { key?: string };
        if (pluginKey.key) editorState[pluginKey.key] = value;
      }
      return this;
    }),
  };
  const dispatch = vi.fn(() => {
    const preview = (
      transaction as typeof transaction & {
        preview?:
          | { kind: "block"; width: number }
          | { kind: "columns"; widths: number[] }
          | null;
      }
    ).preview;
    if (preview?.kind === "block") {
      row.style.width = `${preview.width}px`;
    } else if (preview?.kind === "columns") {
      columns.forEach((column, index) => {
        column.style.width = `${preview.widths[index]}px`;
      });
    } else if (preview === null) {
      row.style.width = "";
      columns.forEach((column) => {
        column.style.width = "";
      });
    }
  });
  const editor = {
    isDestroyed: false,
    isEditable: true,
    view: {
      dom: editorDom,
      posAtDOM: () => 0,
      dispatch,
    },
    state: Object.assign(editorState, {
      doc: { nodeAt: () => rowNode },
      tr: transaction,
    }),
    on: vi.fn(),
    off: vi.fn(),
  } as unknown as Editor;

  render(<PortfolioGridControls editor={editor} />);
  fireEvent.pointerMove(row);
  return {
    editor,
    transaction,
    editorDom,
    row,
    columns,
    left: columns[0],
    right: columns[1],
  };
}

describe("PortfolioGridControls live pointer preview", () => {
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
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
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

    act(() => {
      startResize(handle);
      moveResize(300);
    });

    expect(left.style.getPropertyValue("width")).toBe("500px");
    expect(right.style.getPropertyValue("width")).toBe("300px");
    expect(handle.dataset.resizing).toBe("true");
    await waitFor(() => expect(handle.style.left).toBe("591px"));
  });

  it.each([2, 3, 4, 5])(
    "centres every divider and guide across a %i-column row",
    async (columnCount) => {
      const gap = 32;
      const { columns } = setupGrid({ columnCount, gap });
      const handles = await waitFor(() => {
        const elements = document.querySelectorAll<HTMLElement>(
          '.ramzy-grid-resize-handle[data-kind="divider"]',
        );
        expect(elements).toHaveLength(columnCount - 1);
        return elements;
      });
      const guides = document.querySelectorAll<HTMLElement>(
        ".ramzy-grid-divider-guide",
      );
      expect(guides).toHaveLength(columnCount - 1);

      handles.forEach((handle, index) => {
        const leftRect = columns[index].getBoundingClientRect();
        const rightRect = columns[index + 1].getBoundingClientRect();
        const midpoint = (leftRect.right + rightRect.left) / 2;

        expect(Number.parseFloat(handle.style.left) + 9).toBeCloseTo(midpoint);
        expect(Number.parseFloat(guides[index].style.left)).toBeCloseTo(
          midpoint,
        );
      });
    },
  );

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

    act(() => {
      startResize(rightHandle);
      moveResize(264);
    });

    expect(row.style.getPropertyValue("width")).toBe("928px");
    expect(rightHandle.dataset.resizing).toBe("true");
    await waitFor(() => expect(rightHandle.style.left).toBe("1019px"));
  });

  it("tracks captured handle movement when the window pointer stream is unavailable", async () => {
    const nativeAddEventListener = window.addEventListener.bind(window);
    vi.spyOn(window, "addEventListener").mockImplementation(
      (type, listener, options) => {
        if (type === "pointermove") return;
        nativeAddEventListener(type, listener, options);
      },
    );

    const { row } = setupGrid();
    const rightHandle = await waitFor(() => {
      const element = document.querySelector<HTMLElement>(
        '.ramzy-grid-resize-handle[data-kind="outer"][data-side="right"]',
      );
      expect(element).not.toBeNull();
      return element!;
    });

    act(() => {
      startResize(rightHandle, 900);
      fireEvent.pointerMove(rightHandle, {
        clientX: 964,
        pointerId: 7,
      });
    });

    expect(row.style.width).toBe("928px");
    expect(rightHandle.dataset.resizing).toBe("true");
  });

  it("previews desktop mouse resizing continuously before mouseup", async () => {
    const { row, left, right } = setupGrid();
    const outerRight = await waitFor(() => {
      const element = document.querySelector<HTMLElement>(
        '.ramzy-grid-resize-handle[data-kind="outer"][data-side="right"]',
      );
      expect(element).not.toBeNull();
      return element!;
    });

    act(() => {
      fireEvent.pointerDown(outerRight, {
        button: 0,
        clientX: 900,
        pointerId: 7,
        pointerType: "mouse",
      });
      expect(outerRight.dataset.resizing).toBeUndefined();
      startMouseResize(outerRight, 900);
      moveMouseResize(964);
    });
    expect(row.style.width).toBe("928px");
    expect(outerRight.dataset.resizing).toBe("true");

    act(() => finishMouseResize(964));
    row.style.width = "";

    const divider = document.querySelector<HTMLElement>(
      '.ramzy-grid-resize-handle[data-kind="divider"]',
    )!;
    act(() => {
      startMouseResize(divider, 500);
      moveMouseResize(600);
    });
    expect(left.style.width).toBe("500px");
    expect(right.style.width).toBe("300px");
    expect(divider.dataset.resizing).toBe("true");
  });

  it("persists divider weights only after the live resize", async () => {
    const { transaction, left, right } = setupGrid();
    const handle = await waitFor(() =>
      document.querySelector<HTMLElement>(
        '.ramzy-grid-resize-handle[data-kind="divider"]',
      ),
    );
    expect(handle).not.toBeNull();

    act(() => {
      startResize(handle!);
      moveResize(120);
    });
    expect(left.style.getPropertyValue("width")).toBe("320px");
    expect(right.style.getPropertyValue("width")).toBe("480px");
    expect(transaction.setNodeMarkup).not.toHaveBeenCalled();

    act(() => finishResize(120));
    expect(handle!.dataset.resizing).toBeUndefined();
    expect(transaction.setNodeMarkup).toHaveBeenCalledTimes(2);
  });

  it.each([2, 3, 4, 5])(
    "resizes only the adjacent pair in a %i-column row",
    async (columnCount) => {
      const { columns } = setupGrid({ columnCount });
      const handles = await waitFor(() => {
        const elements = document.querySelectorAll<HTMLElement>(
          '.ramzy-grid-resize-handle[data-kind="divider"]',
        );
        expect(elements).toHaveLength(columnCount - 1);
        return elements;
      });
      const dividerIndex = Math.min(1, handles.length - 1);
      const originalWidths = columns.map(
        (column) => column.getBoundingClientRect().width,
      );

      act(() => {
        startResize(handles[dividerIndex]);
        moveResize(217);
      });

      columns.forEach((column, index) => {
        const width = Number.parseFloat(column.style.width);
        if (index === dividerIndex) {
          expect(width).toBeCloseTo(originalWidths[index] + 17, 1);
        } else if (index === dividerIndex + 1) {
          expect(width).toBeCloseTo(originalWidths[index] - 17, 1);
        } else {
          expect(width).toBeCloseTo(originalWidths[index]);
        }
      });
    },
  );

  it.each([2, 3, 4, 5])(
    "snaps the selected pair to 60/40 with visible feedback in a %i-column row",
    async (columnCount) => {
      const { columns } = setupGrid({ columnCount });
      const handles = await waitFor(() => {
        const elements = document.querySelectorAll<HTMLElement>(
          '.ramzy-grid-resize-handle[data-kind="divider"]',
        );
        expect(elements).toHaveLength(columnCount - 1);
        return elements;
      });
      const dividerIndex = Math.min(1, handles.length - 1);
      const originalWidths = columns.map(
        (column) => column.getBoundingClientRect().width,
      );
      const pairDelta = originalWidths[dividerIndex] * 0.2;

      act(() => {
        startResize(handles[dividerIndex], 200);
        moveResize(200 + pairDelta);
      });

      columns.forEach((column, index) => {
        const width = Number.parseFloat(column.style.width);
        if (index === dividerIndex) {
          expect(width).toBeCloseTo(originalWidths[index] * 1.2, 1);
        } else if (index === dividerIndex + 1) {
          expect(width).toBeCloseTo(originalWidths[index] * 0.8, 1);
        } else {
          expect(width).toBeCloseTo(originalWidths[index], 1);
        }
      });
      expect(
        document.querySelector<HTMLElement>(
          '.ramzy-block-resize-snap-guide[data-kind="column-ratio"][data-active="true"]',
        )?.dataset.ratio,
      ).toBe("60% / 40%");
      expect(
        document.querySelector<HTMLElement>(
          '.ramzy-grid-width-badge[data-kind="column-ratio"]',
        )?.textContent,
      ).toBe("60% / 40%");
    },
  );

  it("mirrors left and right outer-handle movement around the row centre", async () => {
    const { row } = setupGrid();
    const handles = await waitFor(() => {
      const elements = document.querySelectorAll<HTMLElement>(
        '.ramzy-grid-resize-handle[data-kind="outer"]',
      );
      expect(elements).toHaveLength(2);
      return elements;
    });

    act(() => {
      startResize(handles[0], 100);
      moveResize(36);
    });
    expect(row.style.width).toBe("928px");
    act(() => finishResize(36));

    row.style.width = "";
    act(() => {
      startResize(handles[1], 900, 8);
      moveResize(964, 8);
    });
    expect(row.style.width).toBe("928px");
  });

  it("persists the exact outer width so release matches the preview", async () => {
    const { transaction, row } = setupGrid();
    const handle = await waitFor(() =>
      document.querySelector<HTMLElement>(
        '.ramzy-grid-resize-handle[data-kind="outer"][data-side="right"]',
      ),
    );
    expect(handle).not.toBeNull();

    act(() => {
      startResize(handle!);
      moveResize(235);
    });
    expect(row.style.width).toBe("870px");
    expect(transaction.setNodeMarkup).not.toHaveBeenCalled();

    act(() => finishResize(235));
    expect(transaction.setNodeMarkup).toHaveBeenCalledWith(
      0,
      undefined,
      expect.objectContaining({ customWidth: 870 }),
    );
  });

  it("restores the live preview without persisting when cancelled", async () => {
    const { transaction, left, right } = setupGrid();
    const handle = await waitFor(() =>
      document.querySelector<HTMLElement>(
        '.ramzy-grid-resize-handle[data-kind="divider"]',
      ),
    );
    expect(handle).not.toBeNull();

    act(() => {
      startResize(handle!);
      moveResize(280);
    });
    expect(left.style.width).toBe("480px");
    expect(right.style.width).toBe("320px");

    act(() => fireEvent.pointerCancel(window, { pointerId: 7 }));
    expect(left.style.width).toBe("");
    expect(right.style.width).toBe("");
    expect(transaction.setNodeMarkup).not.toHaveBeenCalled();
  });
});
