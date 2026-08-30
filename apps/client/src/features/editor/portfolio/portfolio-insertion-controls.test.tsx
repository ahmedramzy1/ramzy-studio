// @vitest-environment jsdom

import { Editor, Node } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PortfolioInsertionControls } from "./portfolio-insertion-controls";

const TestColumns = Node.create({
  name: "columns",
  group: "block",
  content: "column+",
  parseHTML: () => [{ tag: 'div[data-type="columns"]' }],
  renderHTML: () => ["div", { "data-type": "columns" }, 0],
});

const TestColumn = Node.create({
  name: "column",
  content: "block+",
  parseHTML: () => [{ tag: 'div[data-type="column"]' }],
  renderHTML: () => ["div", { "data-type": "column" }, 0],
});

function createEditor(content: Record<string, unknown>[]) {
  const element = document.createElement("div");
  document.body.append(element);
  return new Editor({
    element,
    extensions: [Document, Paragraph, Text, TestColumns, TestColumn],
    content: { type: "doc", content },
  });
}

describe("portfolio insertion controls", () => {
  let editor: Editor | null = null;

  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(performance.now()), 0),
    );
    vi.stubGlobal("cancelAnimationFrame", (id: number) =>
      window.clearTimeout(id),
    );
  });

  afterEach(() => {
    cleanup();
    editor?.destroy();
    editor = null;
    document.body.replaceChildren();
    vi.unstubAllGlobals();
  });

  it("keeps column actions but removes the redundant boundary plus after a grid", async () => {
    editor = createEditor([
      {
        type: "columns",
        content: [
          {
            type: "column",
            content: [
              { type: "paragraph", content: [{ type: "text", text: "Left" }] },
            ],
          },
          {
            type: "column",
            content: [
              { type: "paragraph", content: [{ type: "text", text: "Right" }] },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "After grid" }],
      },
    ]);

    const { container } = render(
      <PortfolioInsertionControls editor={editor} />,
    );

    await waitFor(() => {
      expect(
        container.querySelectorAll(".ramzy-column-insert-control"),
      ).toHaveLength(2);
    });
    expect(
      container.querySelectorAll(".ramzy-boundary-insert-control"),
    ).toHaveLength(1);
  });

  it("preserves generic boundary insertion away from grids", async () => {
    editor = createEditor([
      {
        type: "paragraph",
        content: [{ type: "text", text: "First" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Second" }],
      },
    ]);

    const { container } = render(
      <PortfolioInsertionControls editor={editor} />,
    );

    await waitFor(() => {
      expect(
        container.querySelectorAll(".ramzy-boundary-insert-control"),
      ).toHaveLength(2);
    });
  });
});
