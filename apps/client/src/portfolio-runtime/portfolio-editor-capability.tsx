import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/core";
import {
  RamzyStudioPortfolioEditor as PortfolioEditorWithHistory,
  type RamzyStudioPortfolioEditorProps,
} from "@/portfolio-runtime/portfolio-editor-with-history";
import { seedCapabilityShowcaseIfEmpty } from "@/features/editor/portfolio/capability-mega";

const CANONICAL_AURA_PAGE_ID = "01a026e2-c3cc-721e-a4f1-5dae7db809bc";

type SeedFeedback =
  | { kind: "building" | "saved" | "error"; message: string }
  | null;

/**
 * Local capability-test wrapper for the canonical AURA Studio page.
 *
 * The emptiness decision is deliberately made from the live TipTap editor
 * supplied by Studio after collaboration/Yjs hydration. We never infer empty
 * content from the pre-hydration database/session snapshot. Each concrete
 * editor instance is attempted at most once so React Strict Mode can replace a
 * destroyed first instance without permanently suppressing the seed.
 */
export function RamzyStudioPortfolioEditor(
  props: RamzyStudioPortfolioEditorProps,
) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [feedback, setFeedback] = useState<SeedFeedback>(null);
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
      attemptedEditorsRef.current.has(editor)
    ) {
      return;
    }

    attemptedEditorsRef.current.add(editor);
    let cancelled = false;
    setFeedback({
      kind: "building",
      message: "Building canonical AURA capability document…",
    });

    void seedCapabilityShowcaseIfEmpty(editor, props.pageId)
      .then((result) => {
        if (cancelled || editor.isDestroyed) return;
        if (result.seeded) {
          setFeedback({
            kind: "saved",
            message: "AURA capability document built. Autosaving…",
          });
        } else {
          setFeedback(null);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Could not build the canonical AURA capability document.";
        console.error("AURA capability seed failed", error);
        setFeedback({ kind: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, [editor, props.editable, props.pageId]);

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
