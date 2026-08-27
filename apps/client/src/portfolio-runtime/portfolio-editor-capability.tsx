import React, { useEffect, useMemo, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import {
  RamzyStudioPortfolioEditor as PortfolioEditorWithHistory,
  type RamzyStudioPortfolioEditorProps,
} from "@/portfolio-runtime/portfolio-editor-with-history";
import { savePortfolioDraft } from "@/features/editor/portfolio/portfolio-draft-save";

const CANONICAL_AURA_PAGE_ID = "01a026e2-221d-7944-bf2c-9341efe88db9";
const EMPTY_DOCUMENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};
const BROKEN_AURA_SIGNATURE =
  "AURA is a concept for calm spatial intelligence";

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
 * Emergency recovery guard for the first all-at-once AURA capability seed.
 *
 * That generated document can lock the browser while TipTap mounts it. Detect
 * only that exact generated draft, keep it away from the editor's first render,
 * and replace it through Studio's normal authenticated draft-save lifecycle.
 * Empty and user-authored AURA drafts are never cleared.
 *
 * Capability construction is deliberately no longer automatic on page load.
 * The replacement builder must be explicit, cancellable, and validated in
 * bounded sections before it is enabled again.
 */
export function RamzyStudioPortfolioEditor(
  props: RamzyStudioPortfolioEditorProps,
) {
  const shouldRecover = useMemo(
    () =>
      props.editable !== false &&
      props.pageId === CANONICAL_AURA_PAGE_ID &&
      documentContainsText(props.initialContent, BROKEN_AURA_SIGNATURE),
    [props.editable, props.initialContent, props.pageId],
  );
  const recoveryStartedRef = useRef(false);
  const [recoveryState, setRecoveryState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldRecover || recoveryStartedRef.current) return;

    recoveryStartedRef.current = true;
    setRecoveryState("saving");

    void savePortfolioDraft({
      apiUrl: props.session.apiUrl,
      accessToken: props.session.accessToken,
      pageId: props.pageId,
      content: EMPTY_DOCUMENT,
    })
      .then(() => {
        setRecoveryState("saved");
      })
      .catch((error) => {
        console.error("AURA draft recovery failed", error);
        setRecoveryError(
          error instanceof Error
            ? error.message
            : "Could not recover the AURA Studio draft.",
        );
        setRecoveryState("error");
      });
  }, [
    props.pageId,
    props.session.accessToken,
    props.session.apiUrl,
    shouldRecover,
  ]);

  return (
    <div>
      {shouldRecover && recoveryState !== "idle" && (
        <div
          role={recoveryState === "error" ? "alert" : "status"}
          style={{
            marginBottom: 8,
            fontSize: 12,
            lineHeight: 1.5,
            color:
              recoveryState === "error"
                ? "var(--mantine-color-red-6)"
                : recoveryState === "saved"
                  ? "var(--mantine-color-green-7)"
                  : "inherit",
            opacity: recoveryState === "saving" ? 0.7 : 0.9,
          }}
        >
          {recoveryState === "saving"
            ? "Recovering the AURA draft…"
            : recoveryState === "saved"
              ? "AURA draft recovered. Automatic capability building is paused."
              : recoveryError || "Could not recover the AURA Studio draft."}
        </div>
      )}

      <PortfolioEditorWithHistory
        {...props}
        initialContent={shouldRecover ? EMPTY_DOCUMENT : props.initialContent}
      />
    </div>
  );
}

export type { RamzyStudioPortfolioEditorProps } from "@/portfolio-runtime/portfolio-editor-with-history";
