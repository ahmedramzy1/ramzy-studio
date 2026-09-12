// @vitest-environment jsdom

import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Editor, Node } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react";
import { StrictMode } from "react";
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
    Range.prototype.getClientRects = () => [] as unknown as DOMRectList;
    Range.prototype.getBoundingClientRect = () => new DOMRect();
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

  it("waits for a detached TipTap view and resumes controls after remount", async () => {
    editor = createEditor([
      { type: "paragraph", content: [{ type: "text", text: "First" }] },
    ]);
    editor.unmount();
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = observe;
        disconnect = disconnect;
      },
    );

    const { container, unmount } = render(
      <StrictMode>
        <PortfolioInsertionControls editor={editor} />
      </StrictMode>,
    );
    expect(observe).not.toHaveBeenCalled();
    const element = document.createElement("div");
    document.body.append(element);
    act(() => editor!.mount(element));
    await waitFor(() => {
      expect(observe).toHaveBeenCalledWith(editor!.view.dom);
      expect(
        container.querySelectorAll(".ramzy-context-insert-control"),
      ).toHaveLength(0);
    });
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(2);
  });

  it("cancels the pending mount wait when controls unmount", () => {
    vi.useFakeTimers();
    try {
      editor = createEditor([]);
      editor.unmount();
      vi.clearAllTimers();
      const { unmount } = render(
        <StrictMode>
          <PortfolioInsertionControls editor={editor} />
        </StrictMode>,
      );
      expect(vi.getTimerCount()).toBeGreaterThan(0);
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  const paragraph = (text: string) => ({
    type: "paragraph",
    content: [{ type: "text", text }],
  });
  const texts = (node: ProseMirrorNode) => {
    const values: string[] = [];
    node.forEach((child) => values.push(child.textContent));
    return values;
  };
  const hover = (target: Element) => fireEvent.pointerMove(target);

  it("shows one plus on hover, switches target, and inserts below it", async () => {
    editor = createEditor([paragraph("First"), paragraph("Second")]);
    const { container, getByRole } = render(
      <PortfolioInsertionControls editor={editor} />,
    );
    expect(
      container.querySelectorAll(".ramzy-context-insert-control"),
    ).toHaveLength(0);
    hover(editor.view.dom.children[0]);
    await waitFor(() =>
      expect(
        container.querySelectorAll(".ramzy-context-insert-control"),
      ).toHaveLength(1),
    );
    hover(editor.view.dom.children[1]);
    fireEvent.click(getByRole("button", { name: /Add content/ }));
    expect(texts(editor.state.doc)).toEqual(["First", "Second", "/"]);
  });

  it("hides outside the block and keeps the gutter reachable", async () => {
    editor = createEditor([paragraph("First")]);
    const block = editor.view.dom.children[0];
    vi.spyOn(block, "getBoundingClientRect").mockReturnValue({
      left: 100,
      top: 100,
      right: 500,
      bottom: 600,
      width: 400,
      height: 500,
    } as DOMRect);
    const { container } = render(
      <PortfolioInsertionControls editor={editor} />,
    );
    hover(block);
    await waitFor(() =>
      expect(
        container.querySelectorAll(".ramzy-context-insert-control"),
      ).toHaveLength(1),
    );
    const move = new Event("pointermove", { bubbles: true });
    Object.assign(move, { clientX: 75, clientY: 550, pointerType: "mouse" });
    fireEvent(document.body, move);
    hover(container.querySelector("button")!);
    expect(
      container.querySelectorAll(".ramzy-context-insert-control"),
    ).toHaveLength(1);
    hover(document.body);
    await waitFor(() =>
      expect(
        container.querySelectorAll(".ramzy-context-insert-control"),
      ).toHaveLength(0),
    );
  });

  it("inserts below a column child inside that column, with no permanent pluses", async () => {
    editor = createEditor([
      {
        type: "columns",
        content: [
          { type: "column", content: [paragraph("Left"), paragraph("Lower")] },
          { type: "column", content: [paragraph("Right")] },
        ],
      },
      paragraph("After"),
    ]);
    const { container, getByRole } = render(
      <PortfolioInsertionControls editor={editor} />,
    );
    expect(
      container.querySelectorAll(".ramzy-context-insert-control"),
    ).toHaveLength(0);
    hover(editor.view.dom.querySelector('[data-type="column"] p')!);
    await waitFor(() =>
      expect(
        container.querySelectorAll(".ramzy-context-insert-control"),
      ).toHaveLength(1),
    );
    fireEvent.click(getByRole("button", { name: /Add content/ }));
    const doc = editor.state.doc;
    expect(texts(doc.child(0).child(0))).toEqual(["Left", "/", "Lower"]);
    expect(doc.child(0).child(1).textContent).toBe("Right");
  });

  it("reveals on touch and reuses an empty paragraph", async () => {
    editor = createEditor([paragraph("First"), { type: "paragraph" }]);
    const { getByRole, container } = render(
      <PortfolioInsertionControls editor={editor} />,
    );
    const tap = new Event("pointerdown", { bubbles: true });
    Object.assign(tap, { pointerType: "touch" });
    fireEvent(editor.view.dom.children[1], tap);
    await waitFor(() =>
      expect(
        container.querySelectorAll(".ramzy-context-insert-control"),
      ).toHaveLength(1),
    );
    fireEvent.click(getByRole("button", { name: /Add content/ }));
    expect(texts(editor.state.doc)).toEqual(["First", "/"]);
  });

  it("keeps an empty start action and hides actions in readonly", async () => {
    editor = createEditor([{ type: "paragraph" }]);
    const { container, getByRole } = render(
      <PortfolioInsertionControls editor={editor} />,
    );
    await waitFor(() =>
      expect(getByRole("button", { name: "Add content" })).toBeTruthy(),
    );
    act(() => editor!.setEditable(false));
    await waitFor(() =>
      expect(
        container.querySelectorAll(".ramzy-context-insert-control"),
      ).toHaveLength(0),
    );
  });

  it("resolves insertion again after preceding text changes", async () => {
    editor = createEditor([paragraph("First"), paragraph("Second")]);
    const { getByRole } = render(
      <PortfolioInsertionControls editor={editor} />,
    );
    hover(editor.view.dom.children[1]);
    await waitFor(() =>
      expect(getByRole("button", { name: /Add content/ })).toBeTruthy(),
    );
    act(() => {
      editor!.commands.insertContentAt(1, "Longer ");
    });
    fireEvent.click(getByRole("button", { name: /Add content/ }));
    expect(texts(editor.state.doc)).toEqual(["Longer First", "Second", "/"]);
  });

  it("keeps matching actions reachable while focused and supports keyboard reordering", async () => {
    editor = createEditor([paragraph("First"), paragraph("Second")]);
    const { getByRole } = render(
      <PortfolioInsertionControls editor={editor} />,
    );
    hover(editor.view.dom.children[1]);
    const plus = await waitFor(() =>
      getByRole("button", { name: /Add content/ }),
    );
    const grip = getByRole("button", { name: "Move block" });
    expect(plus.classList.contains("ramzy-block-action")).toBe(true);
    expect(grip.classList.contains("ramzy-block-action")).toBe(true);
    expect(grip.parentElement).toBe(plus.parentElement);
    expect(grip.parentElement!.style.gap).toBe("8px");
    act(() => grip.focus());
    hover(document.body);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });
    expect(grip.isConnected).toBe(true);
    fireEvent.keyDown(grip, { key: "ArrowUp", altKey: true });
    expect(texts(editor.state.doc)).toEqual(["Second", "First"]);
    fireEvent.keyDown(grip, { key: "ArrowDown", altKey: true });
    expect(texts(editor.state.doc)).toEqual(["First", "Second"]);
  });

  it("reveals for keyboard users and dismisses with Escape", async () => {
    editor = createEditor([paragraph("First")]);
    const { container } = render(
      <PortfolioInsertionControls editor={editor} />,
    );
    act(() => {
      editor!.view.dom.focus();
    });
    fireEvent.keyDown(editor.view.dom, { key: "ArrowRight" });
    await waitFor(() =>
      expect(
        container.querySelectorAll(".ramzy-context-insert-control"),
      ).toHaveLength(1),
    );
    fireEvent.keyDown(editor.view.dom, { key: "Escape" });
    await waitFor(() =>
      expect(
        container.querySelectorAll(".ramzy-context-insert-control"),
      ).toHaveLength(0),
    );
  });
});
