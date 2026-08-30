// @vitest-environment jsdom

import { Editor, Node } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PortfolioDnd } from "./portfolio-dnd";
import { PortfolioDndPreview } from "./portfolio-dnd-preview-extension";

const TestColumns = Node.create({
  name: "columns",
  group: "block",
  content: "column+",
  addAttributes: () => ({ layout: { default: "two_equal" } }),
  parseHTML: () => [{ tag: 'div[data-type="columns"]' }],
  renderHTML: () => ["div", { "data-type": "columns" }, 0],
});

const TestColumn = Node.create({
  name: "column",
  group: "block",
  content: "block+",
  addAttributes: () => ({ width: { default: null } }),
  parseHTML: () => [{ tag: 'div[data-type="column"]' }],
  renderHTML: () => ["div", { "data-type": "column" }, 0],
});

const TestMedia = Node.create({
  name: "media",
  group: "block",
  atom: true,
  addAttributes: () => ({ label: { default: "Media" } }),
  parseHTML: () => [{ tag: 'div[data-type="media"]' }],
  renderHTML: ({ node }) => [
    "div",
    { "data-type": "media", class: "react-renderer" },
    [
      "button",
      {
        type: "button",
        "data-drag-handle": "",
        "data-ramzy-block-drag-handle": "",
      },
      "Drag",
    ],
    ["span", {}, node.attrs.label],
  ],
});

class TestDataTransfer {
  dropEffect = "none";
  effectAllowed = "all";
  files = [];
  items = [];
  private values = new Map<string, string>();

  get types() {
    return [...this.values.keys()];
  }

  clearData(type?: string) {
    if (type) this.values.delete(type);
    else this.values.clear();
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
  readonly dataTransfer: DataTransfer;

  constructor(type: string, init: MouseEventInit = {}) {
    super(type, init);
    this.dataTransfer = new TestDataTransfer() as unknown as DataTransfer;
  }
}

function rect(left: number, top: number, width: number, height: number) {
  return {
    left,
    right: left + width,
    top,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

function dragEvent(type: string, clientX: number, clientY: number) {
  return new TestDragEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
  });
}

function setRect(
  element: HTMLElement,
  left: number,
  top: number,
  width: number,
  height: number,
) {
  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => rect(left, top, width, height),
  });
}

function createEditor(mediaLabels = ["Dragged media"]) {
  const element = document.createElement("div");
  document.body.append(element);
  return new Editor({
    element,
    extensions: [
      Document,
      Paragraph,
      Text,
      TestColumns,
      TestColumn,
      TestMedia,
      PortfolioDndPreview,
    ],
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Target" }],
        },
        ...mediaLabels.map((label) => ({
          type: "media",
          attrs: { label },
        })),
      ],
    },
  });
}

function createTwoColumnEditor() {
  const element = document.createElement("div");
  document.body.append(element);
  return new Editor({
    element,
    extensions: [
      Document,
      Paragraph,
      Text,
      TestColumns,
      TestColumn,
      TestMedia,
      PortfolioDndPreview,
    ],
    content: {
      type: "doc",
      content: [
        {
          type: "columns",
          attrs: { layout: "two_equal" },
          content: [
            {
              type: "column",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Target" }],
                },
              ],
            },
            {
              type: "column",
              content: [
                { type: "media", attrs: { label: "Dragged media" } },
                { type: "paragraph" },
              ],
            },
          ],
        },
      ],
    },
  });
}

function createTwoAtomColumnEditor() {
  const element = document.createElement("div");
  document.body.append(element);
  return new Editor({
    element,
    extensions: [
      Document,
      Paragraph,
      Text,
      TestColumns,
      TestColumn,
      TestMedia,
      PortfolioDndPreview,
    ],
    content: {
      type: "doc",
      content: [
        {
          type: "columns",
          attrs: { layout: "two_equal" },
          content: [
            {
              type: "column",
              content: [
                { type: "media", attrs: { label: "Remaining album" } },
                { type: "paragraph" },
              ],
            },
            {
              type: "column",
              content: [
                { type: "media", attrs: { label: "Extracted album" } },
                { type: "paragraph" },
              ],
            },
          ],
        },
      ],
    },
  });
}

function createRoadEditor() {
  const element = document.createElement("div");
  document.body.append(element);
  return new Editor({
    element,
    extensions: [
      Document,
      Paragraph,
      Text,
      TestColumns,
      TestColumn,
      TestMedia,
      PortfolioDndPreview,
    ],
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Road above" }],
        },
        {
          type: "columns",
          attrs: { layout: "two_equal" },
          content: [
            {
              type: "column",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Remaining lane" }],
                },
              ],
            },
            {
              type: "column",
              content: [
                { type: "media", attrs: { label: "Dragged lane" } },
                { type: "paragraph" },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Road below" }],
        },
      ],
    },
  });
}

describe("portfolio Pragmatic Drag and Drop integration", () => {
  let editor: Editor | null = null;

  beforeEach(() => {
    vi.stubGlobal("DragEvent", TestDragEvent);
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(performance.now()), 0),
    );
    vi.stubGlobal("cancelAnimationFrame", (id: number) =>
      window.clearTimeout(id),
    );
    if (!(DOMRect as typeof DOMRect & { fromRect?: unknown }).fromRect) {
      Object.defineProperty(DOMRect, "fromRect", {
        configurable: true,
        value: ({ x = 0, y = 0, width = 0, height = 0 }) =>
          rect(x, y, width, height),
      });
    }
  });

  afterEach(() => {
    cleanup();
    editor?.destroy();
    editor = null;
    document.body.replaceChildren();
    vi.unstubAllGlobals();
  });

  it.each([
    { edge: "left", x: 120, expected: ["media", "paragraph"] },
    { edge: "right", x: 880, expected: ["paragraph", "media"] },
  ] as const)(
    "shows the exact $edge slot and commits that side",
    ({ edge, x, expected }) => {
      editor = createEditor();
      render(<PortfolioDnd editor={editor} />);

      const target = editor.view.dom.children[0] as HTMLElement;
      const source = editor.view.dom.children[1] as HTMLElement;
      const handle = source.querySelector<HTMLElement>(
        "[data-ramzy-block-drag-handle]",
      )!;
      setRect(target, 100, 100, 800, 300);
      setRect(source, 100, 440, 800, 180);

      expect(handle.draggable).toBe(true);
      expect(editor.view.posAtDOM(source, 0)).toBe(
        editor.state.doc.firstChild!.nodeSize,
      );
      expect(editor.view.dom.hasAttribute("data-drop-target-for-element")).toBe(
        true,
      );

      handle.dispatchEvent(dragEvent("dragstart", 130, 470));
      target.dispatchEvent(dragEvent("dragover", x, 240));

      expect(target.classList.contains("ramzy-dnd-preview-single-row")).toBe(
        true,
      );
      expect(target.dataset.ramzyDropEdge).toBe(edge);
      expect(source.classList.contains("ramzy-dnd-source")).toBe(true);

      target.dispatchEvent(dragEvent("drop", x, 240));

      expect(editor!.state.doc.firstChild?.type.name).toBe("columns");
      expect(editor!.state.doc.firstChild?.childCount).toBe(2);
      expect(
        Array.from(
          { length: 2 },
          (_, index) =>
            editor!.state.doc.firstChild!.child(index).firstChild?.type.name,
        ),
      ).toEqual(expected);
    },
  );

  it.each([
    { edge: "left", x: 350 },
    { edge: "right", x: 650 },
  ] as const)(
    "uses the broad middle of a single block for the first $edge column snap",
    ({ edge, x }) => {
      editor = createEditor();
      render(<PortfolioDnd editor={editor} />);

      const target = editor.view.dom.children[0] as HTMLElement;
      const source = editor.view.dom.children[1] as HTMLElement;
      const handle = source.querySelector<HTMLElement>(
        "[data-ramzy-block-drag-handle]",
      )!;
      setRect(target, 100, 100, 800, 300);
      setRect(source, 100, 440, 800, 180);

      handle.dispatchEvent(dragEvent("dragstart", 130, 470));
      target.dispatchEvent(dragEvent("dragover", x, 250));

      expect(target.dataset.ramzyDropEdge).toBe(edge);
      expect(target.classList.contains("ramzy-dnd-preview-single-row")).toBe(
        true,
      );
    },
  );

  it.each([
    {
      edge: "left",
      x: 350,
      previewRect: [500, 100, 400, 300] as const,
    },
    {
      edge: "right",
      x: 650,
      previewRect: [100, 100, 400, 300] as const,
    },
  ] as const)(
    "keeps the first $edge column snap stable after its preview reshapes the target",
    ({ edge, x, previewRect }) => {
      editor = createEditor();
      render(<PortfolioDnd editor={editor} />);

      const target = editor.view.dom.children[0] as HTMLElement;
      const source = editor.view.dom.children[1] as HTMLElement;
      const handle = source.querySelector<HTMLElement>(
        "[data-ramzy-block-drag-handle]",
      )!;
      setRect(target, 100, 100, 800, 300);
      setRect(source, 100, 440, 800, 180);

      handle.dispatchEvent(dragEvent("dragstart", 130, 470));
      target.dispatchEvent(dragEvent("dragover", x, 250));
      expect(target.dataset.ramzyDropEdge).toBe(edge);

      // The live preview turns the target into one half of the future row.
      // Hit-testing must continue to use the original full-row safe zone.
      setRect(
        target,
        previewRect[0],
        previewRect[1],
        previewRect[2],
        previewRect[3],
      );
      target.dispatchEvent(dragEvent("dragover", x, 250));

      expect(target.dataset.ramzyDropEdge).toBe(edge);
      expect(target.classList.contains("ramzy-dnd-preview-single-row")).toBe(
        true,
      );
    },
  );

  it("keeps dragging after every drop while growing from two to five columns", async () => {
    editor = createEditor(["B", "C", "D", "E"]);
    render(<PortfolioDnd editor={editor} />);

    for (const expectedCount of [2, 3, 4, 5]) {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      const row = editor.view.dom.children[0] as HTMLElement;
      const source = editor.view.dom.children[1] as HTMLElement;
      const handle = source.querySelector<HTMLElement>(
        "[data-ramzy-block-drag-handle]",
      )!;
      const isGrid = row.dataset.type === "columns";
      const target = isGrid ? (row.lastElementChild as HTMLElement) : row;

      setRect(row, 100, 100, 1000, 400);
      if (isGrid) {
        Array.from(row.children).forEach((column, index, columns) => {
          setRect(
            column as HTMLElement,
            100 + (1000 / columns.length) * index,
            100,
            1000 / columns.length,
            400,
          );
        });
      }
      setRect(source, 100, 540, 1000, 180);

      expect(handle.draggable).toBe(true);
      expect(editor.view.posAtDOM(source, 0)).toBe(
        editor.state.doc.firstChild!.nodeSize,
      );
      expect(
        editor.view.dom.hasAttribute("data-drop-target-for-element"),
        `column ${expectedCount} target should stay registered after the previous drop`,
      ).toBe(true);

      const targetRect = target.getBoundingClientRect();
      const clientX = targetRect.right - 3;
      const clientY = targetRect.top + 180;
      const sourceRect = source.getBoundingClientRect();
      handle.dispatchEvent(
        dragEvent("dragstart", sourceRect.left + 30, sourceRect.top + 30),
      );
      const dragOver = dragEvent("dragover", clientX, clientY);
      target.dispatchEvent(dragOver);
      expect(
        dragOver.defaultPrevented,
        `column ${expectedCount} should be accepted by Pragmatic Drag and Drop`,
      ).toBe(true);
      expect(
        editor.view.dom.querySelector(
          ".ramzy-dnd-preview-single-row, .ramzy-dnd-preview-row",
        ),
        `column ${expectedCount} should show a live destination before drop`,
      ).not.toBeNull();
      expect(target.isConnected).toBe(true);
      target.dispatchEvent(dragEvent("drop", clientX, clientY));

      expect(editor.state.doc.firstChild?.type.name).toBe("columns");
      expect(editor.state.doc.firstChild?.childCount).toBe(expectedCount);
    }

    expect(
      Array.from(
        { length: 5 },
        (_, index) =>
          editor!.state.doc.firstChild!.child(index).firstChild?.type.name,
      ),
    ).toEqual(["paragraph", "media", "media", "media", "media"]);
  });

  it("previews and extracts a grid item back to a full-width row", () => {
    editor = createTwoColumnEditor();
    render(<PortfolioDnd editor={editor} />);

    const row = editor.view.dom.firstElementChild as HTMLElement;
    const columns = Array.from(row.children) as HTMLElement[];
    const source = columns[1].querySelector<HTMLElement>(
      '.react-renderer[data-type="media"]',
    )!;
    const handle = source.querySelector<HTMLElement>(
      "[data-ramzy-block-drag-handle]",
    )!;
    setRect(row, 100, 100, 800, 400);
    setRect(columns[0], 100, 100, 390, 400);
    setRect(columns[1], 510, 100, 390, 400);
    setRect(source, 510, 180, 390, 180);

    handle.dispatchEvent(dragEvent("dragstart", 540, 220));
    row.dispatchEvent(dragEvent("dragover", 700, 492));

    expect(editor.view.dom.querySelector(".ramzy-dnd-row-slot")).not.toBeNull();

    row.dispatchEvent(dragEvent("drop", 700, 492));

    expect(editor.state.doc.childCount).toBe(2);
    expect(editor.state.doc.child(0).type.name).toBe("paragraph");
    expect(editor.state.doc.child(0).textContent).toBe("Target");
    expect(editor.state.doc.child(1).type.name).toBe("media");
  });

  it("extracts one of two atom cards without creating a paragraph between them", () => {
    editor = createTwoAtomColumnEditor();
    render(<PortfolioDnd editor={editor} />);

    const row = editor.view.dom.firstElementChild as HTMLElement;
    const columns = Array.from(row.children) as HTMLElement[];
    const source = columns[1].querySelector<HTMLElement>(
      '.react-renderer[data-type="media"]',
    )!;
    const handle = source.querySelector<HTMLElement>(
      "[data-ramzy-block-drag-handle]",
    )!;
    setRect(row, 100, 100, 800, 400);
    setRect(columns[0], 100, 100, 390, 400);
    setRect(columns[1], 510, 100, 390, 400);
    setRect(source, 510, 180, 390, 180);

    handle.dispatchEvent(dragEvent("dragstart", 540, 220));
    row.dispatchEvent(dragEvent("dragover", 700, 492));
    row.dispatchEvent(dragEvent("drop", 700, 492));

    expect(editor.state.doc.childCount).toBe(2);
    expect(
      Array.from(
        { length: editor.state.doc.childCount },
        (_, index) => editor!.state.doc.child(index).type.name,
      ),
    ).toEqual(["media", "media"]);
  });

  it.each([
    {
      direction: "above",
      targetIndex: 0,
      clientY: 80,
      expected: ["Road above", "", "Remaining lane", "Road below"],
      expectedTypes: ["paragraph", "media", "paragraph", "paragraph"],
    },
    {
      direction: "below",
      targetIndex: 2,
      clientY: 760,
      expected: ["Road above", "Remaining lane", "", "Road below"],
      expectedTypes: ["paragraph", "paragraph", "media", "paragraph"],
    },
  ] as const)(
    "keeps a grid card scoped to its road when extracting $direction",
    ({ targetIndex, clientY, expected, expectedTypes }) => {
      editor = createRoadEditor();
      render(<PortfolioDnd editor={editor} />);

      const unrelatedTarget = editor.view.dom.children[
        targetIndex
      ] as HTMLElement;
      const row = editor.view.dom.children[1] as HTMLElement;
      const columns = Array.from(row.children) as HTMLElement[];
      const source = columns[1].querySelector<HTMLElement>(
        '.react-renderer[data-type="media"]',
      )!;
      const handle = source.querySelector<HTMLElement>(
        "[data-ramzy-block-drag-handle]",
      )!;

      setRect(editor.view.dom.children[0] as HTMLElement, 100, 20, 800, 140);
      setRect(row, 100, 200, 800, 400);
      setRect(columns[0], 100, 200, 390, 400);
      setRect(columns[1], 510, 200, 390, 400);
      setRect(source, 510, 280, 390, 180);
      setRect(editor.view.dom.children[2] as HTMLElement, 100, 650, 800, 220);

      handle.dispatchEvent(dragEvent("dragstart", 540, 320));
      unrelatedTarget.dispatchEvent(dragEvent("dragover", 500, clientY));

      expect(document.body.classList).toContain("ramzy-portfolio-dnd-active");

      expect(
        editor.view.dom.querySelectorAll(".ramzy-dnd-row-slot"),
      ).toHaveLength(1);
      expect(
        editor.view.dom.querySelector(".ramzy-dnd-column-slot"),
      ).toBeNull();
      expect(
        unrelatedTarget.classList.contains("ramzy-dnd-preview-single-row"),
      ).toBe(false);
      expect(columns[1].classList).toContain("ramzy-dnd-source-column-vacated");

      unrelatedTarget.dispatchEvent(dragEvent("drop", 500, clientY));

      expect(document.body.classList).not.toContain(
        "ramzy-portfolio-dnd-active",
      );

      expect(
        Array.from(
          { length: editor.state.doc.childCount },
          (_, index) => editor!.state.doc.child(index).textContent,
        ),
      ).toEqual(expected);
      expect(editor.state.doc.childCount).toBe(4);
      expect(
        Array.from(
          { length: editor.state.doc.childCount },
          (_, index) => editor!.state.doc.child(index).type.name,
        ),
      ).toEqual(expectedTypes);
    },
  );

  it("keeps one extraction destination when the pointer leaves the row width", () => {
    editor = createRoadEditor();
    render(<PortfolioDnd editor={editor} />);

    const row = editor.view.dom.children[1] as HTMLElement;
    const columns = Array.from(row.children) as HTMLElement[];
    const source = columns[1].querySelector<HTMLElement>(
      '.react-renderer[data-type="media"]',
    )!;
    const handle = source.querySelector<HTMLElement>(
      "[data-ramzy-block-drag-handle]",
    )!;

    setRect(editor.view.dom.children[0] as HTMLElement, 100, 20, 800, 140);
    setRect(row, 100, 200, 800, 400);
    setRect(columns[0], 100, 200, 390, 400);
    setRect(columns[1], 510, 200, 390, 400);
    setRect(source, 510, 280, 390, 180);
    setRect(editor.view.dom.children[2] as HTMLElement, 100, 650, 800, 220);

    handle.dispatchEvent(dragEvent("dragstart", 540, 320));
    editor.view.dom.dispatchEvent(dragEvent("dragover", 980, 760));

    expect(
      editor.view.dom.querySelectorAll(
        ".ramzy-dnd-row-slot, .ramzy-dnd-column-slot",
      ),
    ).toHaveLength(1);
    expect(editor.view.dom.querySelector(".ramzy-dnd-row-slot")).not.toBeNull();

    editor.view.dom.dispatchEvent(dragEvent("drop", 980, 760));

    expect(editor.state.doc.child(2).type.name).toBe("media");
    expect(document.body.classList).not.toContain("ramzy-portfolio-dnd-active");
  });

  it("keeps unrelated editor guides suppressed through a no-op lane", () => {
    editor = createTwoColumnEditor();
    render(<PortfolioDnd editor={editor} />);

    const row = editor.view.dom.firstElementChild as HTMLElement;
    const columns = Array.from(row.children) as HTMLElement[];
    const source = columns[1].querySelector<HTMLElement>(
      '.react-renderer[data-type="media"]',
    )!;
    const handle = source.querySelector<HTMLElement>(
      "[data-ramzy-block-drag-handle]",
    )!;
    setRect(row, 100, 100, 800, 400);
    setRect(columns[0], 100, 100, 390, 400);
    setRect(columns[1], 510, 100, 390, 400);
    setRect(source, 510, 180, 390, 180);

    handle.dispatchEvent(dragEvent("dragstart", 540, 220));
    columns[1].dispatchEvent(dragEvent("dragover", 700, 300));

    expect(document.body.classList).toContain("ramzy-portfolio-dnd-active");
    expect(
      editor.view.dom.querySelector(
        ".ramzy-dnd-row-slot, .ramzy-dnd-column-slot",
      ),
    ).toBeNull();

    handle.dispatchEvent(dragEvent("dragend", 700, 300));
    expect(document.body.classList).not.toContain("ramzy-portfolio-dnd-active");
  });

  it("previews and swaps the right grid item to the left", () => {
    editor = createTwoColumnEditor();
    render(<PortfolioDnd editor={editor} />);

    const row = editor.view.dom.firstElementChild as HTMLElement;
    const columns = Array.from(row.children) as HTMLElement[];
    const source = columns[1].querySelector<HTMLElement>(
      '.react-renderer[data-type="media"]',
    )!;
    const handle = source.querySelector<HTMLElement>(
      "[data-ramzy-block-drag-handle]",
    )!;
    setRect(row, 100, 100, 800, 400);
    setRect(columns[0], 100, 100, 390, 400);
    setRect(columns[1], 510, 100, 390, 400);
    setRect(source, 510, 180, 390, 180);

    handle.dispatchEvent(dragEvent("dragstart", 540, 220));
    columns[0].dispatchEvent(dragEvent("dragover", 104, 300));

    expect(
      editor.view.dom.querySelector(".ramzy-dnd-column-slot"),
    ).not.toBeNull();

    columns[0].dispatchEvent(dragEvent("drop", 104, 300));

    expect(editor.state.doc.firstChild?.childCount).toBe(2);
    expect(editor.state.doc.firstChild?.child(0).firstChild?.type.name).toBe(
      "media",
    );
    expect(editor.state.doc.firstChild?.child(1).textContent).toBe("Target");
  });
});
