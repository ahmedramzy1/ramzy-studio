// @vitest-environment jsdom

import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { afterEach, describe, expect, it } from "vitest";
import {
  deletePortfolioTopLevelBlock,
  getPortfolioTopLevelBlock,
  movePortfolioBlockToNewSection,
  movePortfolioBlockToSection,
  triggerPortfolioElementAction,
  updatePortfolioTopLevelBlockAttributes,
} from "./portfolio-element-menu";

function createEditor(content: Record<string, unknown>[]) {
  const element = document.createElement("div");
  document.body.append(element);
  const editor = new Editor({
    element,
    extensions: [Document, Paragraph, Heading, Text],
    content: { type: "doc", content },
  });
  editor.view.dom.classList.add("ramzy-portfolio-editor");
  return editor;
}

function heading(text: string) {
  return {
    type: "heading",
    attrs: { level: 1 },
    content: [{ type: "text", text }],
  };
}

function paragraph(text: string) {
  return {
    type: "paragraph",
    content: [{ type: "text", text }],
  };
}

describe("portfolio element menu commands", () => {
  let editor: Editor | null = null;

  afterEach(() => {
    editor?.destroy();
    editor = null;
    document.body.replaceChildren();
  });

  it("resolves the selected top-level element", () => {
    editor = createEditor([paragraph("First"), paragraph("Second")]);
    const secondPosition = editor.state.doc.child(0).nodeSize;
    editor.commands.setTextSelection(secondPosition + 1);

    const block = getPortfolioTopLevelBlock(editor);

    expect(block?.position).toBe(secondPosition);
    expect(block?.node.textContent).toBe("Second");
  });

  it("keeps section deletion behavior in the shared overflow menu", () => {
    editor = createEditor([
      heading("First section"),
      paragraph("Delete with section"),
      heading("Keep section"),
      paragraph("Keep content"),
    ]);
    editor.commands.setNodeSelection(0);

    expect(deletePortfolioTopLevelBlock(editor)).toBe(true);
    expect(editor.getText()).toContain("Keep section");
    expect(editor.getText()).toContain("Keep content");
    expect(editor.getText()).not.toContain("First section");
    expect(editor.getText()).not.toContain("Delete with section");
  });

  it("moves an element into an existing section without changing its content", () => {
    editor = createEditor([
      heading("First section"),
      paragraph("Move me"),
      heading("Target section"),
      paragraph("Target content"),
    ]);
    const sourcePosition = editor.state.doc.child(0).nodeSize;
    const targetPosition = sourcePosition + editor.state.doc.child(1).nodeSize;
    editor.commands.setNodeSelection(sourcePosition);

    expect(
      movePortfolioBlockToSection(editor, {
        position: targetPosition,
        end: editor.state.doc.content.size,
        title: "Target section",
      }),
    ).toBe(true);
    expect(editor.getJSON().content?.map((node) => node.type)).toEqual([
      "heading",
      "heading",
      "paragraph",
      "paragraph",
    ]);
    expect(editor.state.doc.lastChild?.textContent).toBe("Move me");
  });

  it("moves an element into a newly named section", () => {
    editor = createEditor([heading("First section"), paragraph("Move me")]);
    editor.commands.setNodeSelection(editor.state.doc.child(0).nodeSize);

    expect(movePortfolioBlockToNewSection(editor, "New section")).toBe(true);
    expect(editor.getText()).toContain("New section");
    expect(editor.state.doc.lastChild?.textContent).toBe("Move me");
  });

  it("updates the selected top-level element attributes", () => {
    editor = createEditor([heading("Change me")]);
    editor.commands.setNodeSelection(0);

    expect(updatePortfolioTopLevelBlockAttributes(editor, { level: 2 })).toBe(
      true,
    );
    expect(editor.state.doc.firstChild?.attrs.level).toBe(2);
  });

  it("routes contextual toolbar actions to the selected node view", () => {
    editor = createEditor([paragraph("Act on me")]);
    editor.commands.setNodeSelection(0);
    const nodeDom = editor.view.nodeDOM(0);
    expect(nodeDom).toBeInstanceOf(HTMLElement);

    let clicked = false;
    const action = document.createElement("button");
    action.dataset.ramzyElementAction = "add-media";
    action.addEventListener("click", () => {
      clicked = true;
    });
    (nodeDom as HTMLElement).append(action);

    expect(triggerPortfolioElementAction(editor, "add-media")).toBe(true);
    expect(clicked).toBe(true);
  });
});
