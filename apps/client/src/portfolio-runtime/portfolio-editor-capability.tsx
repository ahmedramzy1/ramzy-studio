import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/core";
import {
  RamzyStudioPortfolioEditor as PortfolioEditorWithHistory,
  type RamzyStudioPortfolioEditorProps,
} from "@/portfolio-runtime/portfolio-editor-with-history";
import {
  isCapabilityDocumentEmpty,
  seedCapabilityShowcaseIfEmpty,
} from "@/features/editor/portfolio/capability-mega";
import { savePortfolioDraft } from "@/features/editor/portfolio/portfolio-draft-save";

const CANONICAL_AURA_PAGE_ID = "01a026e2-221d-7944-bf2c-9341efe88db9";

type BuildFeedback =
  | { kind: "building" | "saved" | "error"; message: string }
  | null;

/**
 * Builds the canonical AURA document outside the live TipTap transaction loop,
 * persists it once, then reloads the completed draft.
 */
export function RamzyStudioPortfolioEditor(
  props: RamzyStudioPortfolioEditorProps,
) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [feedback, setFeedback] = useState<BuildFeedback>(null);
  const attemptedEditorsRef = useRef(new WeakSet<Editor>());

  const handleEditorChange = useCallback(
    (nextEditor: Editor | null) => {
      setEditor(nextEditor);
      props.onEditorChange?.(nextEditor);
    },
    [props.onEditorChange],
  );

  useEffect(() => {
    if (
      props.editable === false ||
      props.pageId !== CANONICAL_AURA_PAGE_ID ||
      !editor ||
      editor.isDestroyed ||
      !editor.isEditable ||
      attemptedEditorsRef.current.has(editor) ||
      !isCapabilityDocumentEmpty(editor.getJSON())
    ) {
      return;
    }

    attemptedEditorsRef.current.add(editor);
    let cancelled = false;
    setFeedback({
      kind: "building",
      message: "Building and validating AURA off-screen…",
    });

    void seedCapabilityShowcaseIfEmpty(editor, props.pageId)
      .then(async (result) => {
        if (cancelled || !result.seeded) return;

        await savePortfolioDraft({
          apiUrl: props.session.apiUrl,
          accessToken: props.session.accessToken,
          pageId: props.pageId,
          content: result.document,
        });

        if (cancelled) return;
        setFeedback({
          kind: "saved",
          message: "AURA saved. Loading the completed document…",
        });

        window.setTimeout(() => window.location.reload(), 150);
      })
      .catch((error) => {
        if (cancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Could not build the canonical AURA capability document.";
        console.error("AURA off-screen build failed", error);
        setFeedback({ kind: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, [
    editor,
    props.editable,
    props.pageId,
    props.session.accessToken,
    props.session.apiUrl,
  ]);

  return (
    <div>
      {feedback && (
        <div
          role={feedback.kind === "error" ? "alert" : "status"}
          style={{
            marginBottom: 8,
            fontSize: 12,
            lineHeight: 1.5,
            color:
              feedback.kind === "error"
                ? "var(--mantine-color-red-6)"
                : feedback.kind === "saved"
                  ? "var(--mantine-color-green-7)"
                  : "inherit",
            opacity: feedback.kind === "building" ? 0.7 : 0.9,
          }}
        >
          {feedback.message}
        </div>
      )}

      <PortfolioEditorWithHistory
        {...props}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
}

export type { RamzyStudioPortfolioEditorProps } from "@/portfolio-runtime/portfolio-editor-with-history";
