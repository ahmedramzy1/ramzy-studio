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
import {
  PortfolioBlockWidth,
  PortfolioGridResizePreview,
} from "./portfolio-grid-resize-preview-extension";

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

const TestPhotoAlbum = Node.create({
  name: "photoAlbum",
  group: "block",
  atom: true,
  parseHTML: () => [{ tag: 'figure[data-type="photoAlbum"]' }],
  renderHTML: ({ HTMLAttributes }) => [
    "figure",
    { ...HTMLAttributes, "data-type": "photoAlbum" },
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
      PortfolioBlockWidth,
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
    value: () => {
      const width = previewWidth(row, "--ramzy-portfolio-block-width", 800);
      return rect(500 - width / 2, width);
    },
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

function setupProseMirrorBlock(nodeType: "paragraph" | "photoAlbum") {
  const element = document.createElement("div");
  document.body.append(element);
  const editor = new TiptapEditor({
    element,
    extensions: [
      Document,
      Paragraph,
      Text,
      TestPhotoAlbum,
      PortfolioBlockWidth,
      PortfolioGridResizePreview,
    ],
    content:
      nodeType === "paragraph"
        ? {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Standalone block" }],
              },
            ],
          }
        : {
            type: "doc",
            content: [{ type: "photoAlbum" }],
          },
  });
  const editorDom = editor.view.dom;
  const block = editorDom.firstElementChild as HTMLElement;
  Object.defineProperty(editorDom, "getBoundingClientRect", {
    value: () => rect(100, 800),
  });
  Object.defineProperty(block, "getBoundingClientRect", {
    value: () => {
      const width = previewWidth(block, "--ramzy-portfolio-block-width", 800);
      return rect(500 - width / 2, width);
    },
  });
  render(<PortfolioGridControls editor={editor} />);
  fireEvent.pointerMove(block);
  return { editor, block };
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

  it("shows internal ratio guides and snaps live to 60/40 before release", async () => {
    const { editor, left, right } = setupProseMirrorGrid();
    const divider = document.querySelector<HTMLElement>(
      '.ramzy-grid-resize-handle[data-kind="divider"]',
    )!;

    act(() => {
      divider.dispatchEvent(pointerEvent("pointerdown", 500, 15));
      window.dispatchEvent(pointerEvent("pointermove", 573, 15));
    });
    await Promise.resolve();

    expect(
      left.style.getPropertyValue("--ramzy-grid-preview-column-width"),
    ).toBe("480px");
    expect(
      right.style.getPropertyValue("--ramzy-grid-preview-column-width"),
    ).toBe("320px");
    expect(
      document.querySelectorAll(
        '.ramzy-block-resize-snap-guide[data-kind="column-ratio"]',
      ).length,
    ).toBeGreaterThan(4);
    const activeGuide = document.querySelector<HTMLElement>(
      '.ramzy-block-resize-snap-guide[data-kind="column-ratio"][data-active="true"]',
    );
    expect(activeGuide?.dataset.ratio).toBe("60% / 40%");
    expect(activeGuide?.style.left).toBe("580px");
    expect(
      document.querySelector<HTMLElement>(
        '.ramzy-grid-width-badge[data-kind="column-ratio"]',
      )?.textContent,
    ).toBe("60% / 40%");
    const columnAttributes = () => {
      const rowNode = editor.state.doc.child(0);
      return Array.from(
        { length: rowNode.childCount },
        (_, index) => rowNode.child(index).attrs,
      );
    };
    expect(columnAttributes()).toEqual([
      expect.objectContaining({ width: null }),
      expect.objectContaining({ width: null }),
    ]);

    act(() => {
      window.dispatchEvent(pointerEvent("pointerup", 573, 15));
    });

    expect(columnAttributes()).toEqual([
      expect.objectContaining({ width: 1.2 }),
      expect.objectContaining({ width: 0.8 }),
    ]);
    expect(
      document.querySelectorAll(
        '.ramzy-block-resize-snap-guide[data-kind="column-ratio"]',
      ),
    ).toHaveLength(0);
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
    expect(row.style.getPropertyValue("--ramzy-portfolio-block-width")).toBe(
      "928px",
    );
    expect(row.classList.contains("ramzy-block-resize-preview")).toBe(true);
    expect(outerRight.dataset.resizing).toBe("true");
    expect(
      document.querySelectorAll(".ramzy-block-resize-snap-guide").length,
    ).toBeGreaterThan(2);
    expect(
      document.querySelector<HTMLElement>(
        '.ramzy-block-resize-snap-guide[data-active="true"][data-side="left"]',
      )?.style.left,
    ).toBe("36px");
    expect(
      document.querySelector<HTMLElement>(
        '.ramzy-block-resize-snap-guide[data-active="true"][data-side="right"]',
      )?.style.left,
    ).toBe("964px");
    expect(editor.getJSON().content?.[0].attrs).toEqual(
      expect.objectContaining({ customWidth: null }),
    );

    act(() => {
      window.dispatchEvent(pointerEvent("pointerup", 964, 10));
    });

    expect(editor.getJSON().content?.[0].attrs).toEqual(
      expect.objectContaining({ customWidth: 928 }),
    );
    const savedRow = editor.view.dom.querySelector<HTMLElement>(
      '[data-type="columns"]',
    )!;
    expect(savedRow.classList.contains("ramzy-block-resize-preview")).toBe(
      false,
    );
    expect(savedRow.classList.contains("ramzy-portfolio-custom-width")).toBe(
      true,
    );
    expect(
      document.querySelectorAll(".ramzy-block-resize-snap-guide"),
    ).toHaveLength(0);
    editor.destroy();
  });

  it.each(["paragraph", "photoAlbum"] as const)(
    "resizes a standalone %s live and persists its exact width",
    async (nodeType) => {
      const { editor, block } = setupProseMirrorBlock(nodeType);
      const outerHandles = document.querySelectorAll<HTMLElement>(
        '.ramzy-grid-resize-handle[data-kind="outer"]',
      );
      const outerRight = document.querySelector<HTMLElement>(
        '.ramzy-grid-resize-handle[data-kind="outer"][data-side="right"]',
      )!;

      expect(outerHandles).toHaveLength(2);
      expect(
        document.querySelectorAll(
          '.ramzy-grid-resize-handle[data-kind="divider"]',
        ),
      ).toHaveLength(0);
      expect(
        document.querySelectorAll(".ramzy-block-resize-snap-guide"),
      ).toHaveLength(0);

      act(() => {
        outerRight.dispatchEvent(pointerEvent("pointerdown", 900, 11));
        window.dispatchEvent(pointerEvent("pointermove", 850, 11));
      });

      await Promise.resolve();
      expect(
        block.style.getPropertyValue("--ramzy-portfolio-block-width"),
      ).toBe("700px");
      expect(block.classList.contains("ramzy-block-resize-preview")).toBe(true);
      expect(
        document.querySelectorAll(".ramzy-block-resize-snap-guide").length,
      ).toBeGreaterThan(2);
      expect(
        document.querySelectorAll(
          '.ramzy-block-resize-snap-guide[data-active="true"]',
        ),
      ).toHaveLength(0);
      expect(editor.getJSON().content?.[0].attrs).toEqual(
        expect.objectContaining({ portfolioWidth: null }),
      );

      act(() => {
        window.dispatchEvent(pointerEvent("pointerup", 850, 11));
      });

      expect(editor.getJSON().content?.[0].attrs).toEqual(
        expect.objectContaining({ portfolioWidth: 700 }),
      );
      const savedBlock = editor.view.dom.firstElementChild as HTMLElement;
      expect(savedBlock.classList.contains("ramzy-block-resize-preview")).toBe(
        false,
      );
      expect(
        savedBlock.classList.contains("ramzy-portfolio-custom-width"),
      ).toBe(true);
      expect(
        savedBlock.style.getPropertyValue("--ramzy-portfolio-block-width"),
      ).toBe("700px");
      expect(
        document.querySelectorAll(".ramzy-block-resize-snap-guide"),
      ).toHaveLength(0);
      editor.destroy();
    },
  );

  it("clears a standalone block preview and guides when resize is cancelled", async () => {
    const { editor, block } = setupProseMirrorBlock("paragraph");
    const outerLeft = document.querySelector<HTMLElement>(
      '.ramzy-grid-resize-handle[data-kind="outer"][data-side="left"]',
    )!;

    act(() => {
      outerLeft.dispatchEvent(pointerEvent("pointerdown", 100, 12));
      window.dispatchEvent(pointerEvent("pointermove", 150, 12));
    });
    await Promise.resolve();
    expect(block.classList.contains("ramzy-block-resize-preview")).toBe(true);
    expect(
      document.querySelectorAll(".ramzy-block-resize-snap-guide").length,
    ).toBeGreaterThan(2);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(editor.getJSON().content?.[0].attrs).toEqual(
      expect.objectContaining({ portfolioWidth: null }),
    );
    expect(block.classList.contains("ramzy-block-resize-preview")).toBe(false);
    expect(
      document.querySelectorAll(".ramzy-block-resize-snap-guide"),
    ).toHaveLength(0);
    editor.destroy();
  });

  it("snaps a standalone block to the visible canvas grid before release", async () => {
    vi.stubGlobal("innerWidth", 1800);
    const { editor, block } = setupProseMirrorBlock("paragraph");
    const outerRight = document.querySelector<HTMLElement>(
      '.ramzy-grid-resize-handle[data-kind="outer"][data-side="right"]',
    )!;

    act(() => {
      outerRight.dispatchEvent(pointerEvent("pointerdown", 900, 13));
      window.dispatchEvent(pointerEvent("pointermove", 1016, 13));
    });
    await Promise.resolve();

    expect(block.style.getPropertyValue("--ramzy-portfolio-block-width")).toBe(
      "1024px",
    );
    expect(
      document.querySelectorAll(
        '.ramzy-block-resize-snap-guide[data-active="true"]',
      ),
    ).toHaveLength(2);

    act(() => {
      window.dispatchEvent(pointerEvent("pointerup", 1016, 13));
    });
    expect(editor.getJSON().content?.[0].attrs).toEqual(
      expect.objectContaining({ portfolioWidth: 1024 }),
    );
    editor.destroy();
  });

  it("never lets a standalone block exceed the safe full-width boundary", async () => {
    vi.stubGlobal("innerWidth", 2048);
    const { editor, block } = setupProseMirrorBlock("photoAlbum");
    const outerRight = document.querySelector<HTMLElement>(
      '.ramzy-grid-resize-handle[data-kind="outer"][data-side="right"]',
    )!;

    act(() => {
      outerRight.dispatchEvent(pointerEvent("pointerdown", 900, 14));
      window.dispatchEvent(pointerEvent("pointermove", 1800, 14));
    });
    await Promise.resolve();

    expect(block.style.getPropertyValue("--ramzy-portfolio-block-width")).toBe(
      "1440px",
    );
    act(() => {
      window.dispatchEvent(pointerEvent("pointerup", 1800, 14));
    });
    expect(editor.getJSON().content?.[0].attrs).toEqual(
      expect.objectContaining({ portfolioWidth: 1440 }),
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
