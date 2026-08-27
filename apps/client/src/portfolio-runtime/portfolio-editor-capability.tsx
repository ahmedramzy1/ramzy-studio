import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Editor, JSONContent } from "@tiptap/core";
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
const EMPTY_DOCUMENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};
const GENERATED_AURA_SIGNATURE =
  "AURA is a concept for calm spatial intelligence";

type BuildFeedback =
  | { kind: "building" | "saved" | "error"; message: string }
  | null;

function documentContainsText(
  content: JSONContent | null | undefined,
  expected: string,
): boolean {
  if (!content) return false;

  let found = false;
  const visit = (node: JSONContent) => {
    if (found) return;
    if (typeof node.text === "string" && node.text.includes(expected)) {
      found = true;
      return;
    }
    node.content?.forEach(visit);
  };

  visit(content);
  return found;
}

/**
 * Canonical AURA builder with frozen-draft recovery.
 *
 * The original all-at-once generated draft is intercepted before TipTap mounts
 * it. BUILD starts from a safe blank document, clears that exact generated
 * draft through Studio's authenticated save path, then reconstructs AURA using
 * the bounded idle-time builder. User-authored documents are never cleared.
 */
export function RamzyStudioPortfolioEditor(
  props: RamzyStudioPortfolioEditorProps,
) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [feedback, setFeedback] = useState<BuildFeedback>(null);
  const attemptedEditorsRef = useRef(new WeakSet<Editor>());

  const shouldRecover = useMemo(
    () =>
      props.editable !== false &&
      props.pageId === CANONICAL_AURA_PAGE_ID &&
      documentContainsText(props.initialContent, GENERATED_AURA_SIGNATURE),
    [props.editable, props.initialContent, props.pageId],
  );

  const effectiveInitialContent = shouldRecover
    ? EMPTY_DOCUMENT
    : props.initialContent;

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

    if (
      !shouldRecover &&
      !isCapabilityDocumentEmpty(editor.getJSON())
    ) {
      return;
    }

    attemptedEditorsRef.current.add(editor);
    let cancelled = false;
    setFeedback({
      kind: "building",
      message: shouldRecover
        ? "Recovering and rebuilding AURA safely…"
        : "Building AURA in responsive sections…",
    });

    const rebuild = async () => {
      if (shouldRecover) {
        await savePortfolioDraft({
          apiUrl: props.session.apiUrl,
          accessToken: props.session.accessToken,
          pageId: props.pageId,
          content: EMPTY_DOCUMENT,
        });
      }

      if (cancelled || editor.isDestroyed) return;
      const result = await seedCapabilityShowcaseIfEmpty(editor, props.pageId);

      if (cancelled || editor.isDestroyed) return;
      setFeedback(
        result.seeded
          ? {
              kind: "saved",
              message: "AURA capability document built. Autosaving…",
            }
          : null,
      );
    };

    void rebuild().catch((error) => {
      if (cancelled) return;
      const message =
        error instanceof Error
          ? error.message
          : "Could not build the canonical AURA capability document.";
      console.error("AURA capability build failed", error);
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
    shouldRecover,
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
        initialContent={effectiveInitialContent}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
}

export type { RamzyStudioPortfolioEditorProps } from "@/portfolio-runtime/portfolio-editor-with-history";
