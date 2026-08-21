import React, { useEffect, useLayoutEffect } from "react";
import type { AnyExtension, Editor, EditorOptions, JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";

export interface RamzyPortfolioEditorProps {
  pageId: string;
  content: JSONContent | null | undefined;
  extensions: AnyExtension[];
  editable: boolean;
  ariaLabel?: string;
  editorProps?: EditorOptions["editorProps"];
  onCreate?: (editor: Editor) => void;
  onUpdate?: (editor: Editor) => void;
  onEditorChange?: (editor: Editor | null) => void;
}

/**
 * Canonical editable Ramzy Studio document surface.
 *
 * The component owns TipTap editor creation and document rendering only. Auth,
 * collaboration-token refresh, app caches, comments, sidebars and product
 * chrome are host adapters. This separation lets ahmedramzy.com mount the same
 * editor directly without embedding the Docmost application.
 */
export function RamzyPortfolioEditor({
  pageId,
  content,
  extensions,
  editable,
  ariaLabel = "Portfolio document content",
  editorProps,
  onCreate,
  onUpdate,
  onEditorChange,
}: RamzyPortfolioEditorProps) {
  const editor = useEditor(
    {
      extensions,
      content: content ?? { type: "doc", content: [] },
      editable,
      textDirection: "auto",
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      editorProps: {
        scrollThreshold: 80,
        scrollMargin: 80,
        attributes: {
          "aria-label": ariaLabel,
          ...(editorProps?.attributes ?? {}),
        },
        ...editorProps,
      },
      onCreate({ editor }) {
        // Page-aware extensions consume this stable identity from storage rather
        // than depending on a router implementation.
        // @ts-ignore
        editor.storage.pageId = pageId;
        onCreate?.(editor);
      },
      onUpdate({ editor }) {
        onUpdate?.(editor);
      },
    },
    [pageId, extensions],
  );

  useLayoutEffect(() => {
    if (editor && !editor.isDestroyed) {
      // @ts-ignore
      editor.storage.pageId = pageId;
      onEditorChange?.(editor);
      return;
    }

    onEditorChange?.(null);
  }, [editor, pageId, onEditorChange]);

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  return <EditorContent editor={editor} />;
}
