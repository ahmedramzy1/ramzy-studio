// @vitest-environment jsdom

import { Editor as TiptapEditor, Node } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PortfolioGridResizePreview,
  setPortfolioGridResizePreview,
} from "./portfolio-grid-resize-preview-extension";

const content = {
  type: "doc",
  content: [
    {
      type: "columns",
      attrs: { layout: "two_equal" },
      content: [
        { type: "column", content: [{ type: "paragraph" }] },
        { type: "column", content: [{ type: "paragraph" }] },
      ],
    },
  ],
};

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
  parseHTML: () => [{ tag: 'div[data-type="column"]' }],
  renderHTML: () => ["div", { "data-type": "column" }, 0],
});

const editors: TiptapEditor[] = [];

function createEditor(onUpdate = vi.fn()) {
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
    content,
    onUpdate,
  });
  editors.push(editor);
  return { editor, element, onUpdate };
}

afterEach(() => {
  editors.splice(0).forEach((editor) => editor.destroy());
  document.body.replaceChildren();
});

describe("PortfolioGridResizePreview", () => {
  it("renders and clears an editor-owned row width without changing the document", () => {
    const { editor, element, onUpdate } = createEditor();
    const before = editor.getJSON();
    const row = element.querySelector<HTMLElement>('[data-type="columns"]')!;

    setPortfolioGridResizePreview(editor, {
      kind: "row",
      rowPosition: 0,
      width: 928,
    });

    expect(row.classList.contains("ramzy-grid-resize-preview-row")).toBe(true);
    expect(row.style.getPropertyValue("--ramzy-grid-preview-width")).toBe(
      "928px",
    );
    expect(editor.getJSON()).toEqual(before);
    expect(onUpdate).not.toHaveBeenCalled();

    setPortfolioGridResizePreview(editor, null);
    expect(row.classList.contains("ramzy-grid-resize-preview-row")).toBe(false);
    expect(row.style.getPropertyValue("--ramzy-grid-preview-width")).toBe("");
  });

  it("renders every intermediate divider width through column decorations", () => {
    const { editor, element, onUpdate } = createEditor();
    const columns = Array.from(
      element.querySelectorAll<HTMLElement>('[data-type="column"]'),
    );

    setPortfolioGridResizePreview(editor, {
      kind: "columns",
      rowPosition: 0,
      widths: [500, 300],
    });

    expect(
      columns.map((column) =>
        column.style.getPropertyValue("--ramzy-grid-preview-column-width"),
      ),
    ).toEqual(["500px", "300px"]);
    expect(
      columns.every((column) =>
        column.classList.contains("ramzy-grid-resize-preview-column"),
      ),
    ).toBe(true);
    expect(onUpdate).not.toHaveBeenCalled();

    setPortfolioGridResizePreview(editor, {
      kind: "columns",
      rowPosition: 0,
      widths: [540, 260],
    });
    expect(
      columns.map((column) =>
        column.style.getPropertyValue("--ramzy-grid-preview-column-width"),
      ),
    ).toEqual(["540px", "260px"]);
  });
});
