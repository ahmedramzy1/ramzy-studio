import type { Editor } from "@tiptap/core";
import { isEditorReady } from "@docmost/editor-ext";

export function isPortfolioEditor(editor: Editor | null | undefined): boolean {
  if (!editor || editor.isDestroyed) return false;

  const attributes = editor.options?.editorProps?.attributes;
  if (attributes && typeof attributes !== "function") {
    const className = attributes.class;
    if (
      typeof className === "string" &&
      className.split(/\s+/).includes("ramzy-portfolio-editor")
    ) {
      return true;
    }
  }

  if (!isEditorReady(editor)) return false;

  try {
    return editor.view.dom.classList.contains("ramzy-portfolio-editor");
  } catch {
    return false;
  }
}

export function getMountedPortfolioEditorDom(
  editor: Editor | null | undefined,
): HTMLElement | null {
  if (!isEditorReady(editor) || editor.isDestroyed) return null;

  try {
    const dom = editor.view.dom;
    return dom.isConnected ? dom : null;
  } catch {
    return null;
  }
}
