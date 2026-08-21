import "@/features/editor/styles/index.css";
import React, { useCallback, useEffect, useRef } from "react";
import { EditorProvider } from "@tiptap/react";
import { Document } from "@tiptap/extension-document";
import { Heading } from "@docmost/editor-ext";
import { Text } from "@tiptap/extension-text";
import { Placeholder } from "@tiptap/extension-placeholder";
import { useAtom } from "jotai";
import { readOnlyEditorAtom } from "@/features/editor/atoms/editor-atoms.ts";
import { useEditorScroll } from "./hooks/use-editor-scroll";
import { RamzyStudioPortfolioRenderer } from "@/features/editor/portfolio/portfolio-renderer";

interface PageEditorProps {
  title: string;
  content: any;
  pageId?: string;
  printMode?: boolean;
  /**
   * When rendering inside a public share, pass the share's id (or key). Lookups
   * for transclusion content then resolve against the share graph instead of
   * the viewer's personal permissions, so a share never leaks source content
   * that isn't itself shared.
   */
  shareId?: string;
  /**
   * Portfolio surfaces already render the project title in the website shell,
   * so they can opt into the native Ramzy Studio body renderer only.
   */
  showTitle?: boolean;
}

export default function ReadonlyPageEditor({
  title,
  content,
  pageId,
  printMode = false,
  shareId,
  showTitle = true,
}: PageEditorProps) {
  const [, setReadOnlyEditor] = useAtom(readOnlyEditorAtom);
  const isComponentMounted = useRef(false);
  const editorCreated = useRef(false);

  const canScroll = useCallback(
    () => isComponentMounted.current && editorCreated.current,
    [isComponentMounted, editorCreated],
  );
  const initialScrollTo = window.location.hash
    ? window.location.hash.slice(1)
    : "";
  const { handleScrollTo } = useEditorScroll({ canScroll, initialScrollTo });

  useEffect(() => {
    isComponentMounted.current = true;
  }, []);

  const titleExtensions = [
    Document.extend({
      content: "heading",
    }),
    Heading,
    Text,
    Placeholder.configure({
      placeholder: "Untitled",
      showOnlyWhenEditable: false,
    }),
  ];

  return (
    <>
      {showTitle && (
        <div className="page-title">
          <EditorProvider
            editable={false}
            immediatelyRender={true}
            textDirection="auto"
            extensions={titleExtensions}
            content={title}
          ></EditorProvider>
        </div>
      )}

      <RamzyStudioPortfolioRenderer
        content={content}
        pageId={pageId}
        shareId={shareId}
        printMode={printMode}
        onCreate={(editor) => {
          // Docmost-specific host state remains outside the reusable renderer.
          // @ts-ignore
          setReadOnlyEditor(editor);

          handleScrollTo(editor);
          editorCreated.current = true;
        }}
      />

      {!showTitle && !printMode ? null : (
        <div style={{ paddingBottom: "20vh" }}></div>
      )}
    </>
  );
}
