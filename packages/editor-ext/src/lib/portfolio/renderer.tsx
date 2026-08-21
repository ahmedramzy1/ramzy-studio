import React, { useMemo } from "react";
import type { AnyExtension, Editor, JSONContent } from "@tiptap/core";
import { EditorProvider } from "@tiptap/react";
import { createPortfolioReadonlyExtensions } from "./extension-profile";

export interface RamzyPortfolioRendererProps {
  content: JSONContent | null | undefined;
  baseExtensions: AnyExtension[];
  pageId?: string;
  printMode?: boolean;
  ariaLabel?: string;
  onCreate?: (editor: Editor) => void;
}

/**
 * Canonical readonly Ramzy Studio document surface.
 *
 * This component deliberately knows nothing about Docmost routes, Jotai atoms,
 * comments, sidebars, workspace state or the portfolio website. Hosts provide
 * the complete Ramzy extension set; this component applies the shared readonly
 * policy and renders the native TipTap document directly.
 *
 * Build uses the same base extension profile, which is the key parity invariant
 * for Preview and the published portfolio.
 */
export function RamzyPortfolioRenderer({
  content,
  baseExtensions,
  pageId,
  printMode = false,
  ariaLabel = "Portfolio document content",
  onCreate,
}: RamzyPortfolioRendererProps) {
  const extensions = useMemo(
    () =>
      createPortfolioReadonlyExtensions(baseExtensions, {
        printMode,
      }),
    [baseExtensions, printMode],
  );

  return (
    <EditorProvider
      editable={false}
      immediatelyRender={true}
      textDirection="auto"
      extensions={extensions}
      content={content ?? { type: "doc", content: [] }}
      editorProps={{
        attributes: {
          "aria-label": ariaLabel,
        },
      }}
      onCreate={({ editor }) => {
        if (pageId) {
          // Page-aware nodes use shared editor storage rather than route state.
          // @ts-ignore
          editor.storage.pageId = pageId;
        }

        onCreate?.(editor);
      }}
    />
  );
}
