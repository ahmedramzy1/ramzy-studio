import React, { useCallback, useEffect, useRef, useState } from "react";
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

type BuildFeedback =
  | { kind: "building" | "saved" | "error"; message: string }
  | null;

type DocumentSection = {
  label: string;
  start: number;
  end: number;
  content: JSONContent[];
};

function nodeText(node: JSONContent): string {
  if (typeof node.text === "string") return node.text;
  return (node.content || []).map(nodeText).join("");
}

export function splitCapabilityDocument(
  document: JSONContent | null | undefined,
): DocumentSection[] {
  const nodes = document?.content || [];
  if (nodes.length === 0) {
    return [{ label: "AURA", start: 0, end: 0, content: [] }];
  }

  const starts: Array<{ index: number; label: string }> = [];
  nodes.forEach((node, index) => {
    if (node.type === "heading" && Number(node.attrs?.level) === 1) {
      starts.push({
        index,
        label: nodeText(node).trim() || `Section ${starts.length + 1}`,
      });
    }
  });

  if (starts.length <= 1) {
    return [{ label: starts[0]?.label || "AURA", start: 0, end: nodes.length, content: nodes }];
  }

  return starts.map((section, index) => {
    const start = index === 0 ? 0 : section.index;
    const end = starts[index + 1]?.index ?? nodes.length;
    return {
      label: section.label,
      start,
      end,
      content: nodes.slice(start, end),
    };
  });
}

/**
 * The canonical project remains one native Studio document, but BUILD mounts
 * only one H1 section at a time. This bounds React/TipTap node-view work while
 * edits are merged back into and saved as the complete document.
 */
export function RamzyStudioPortfolioEditor(
  props: RamzyStudioPortfolioEditorProps,
) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [feedback, setFeedback] = useState<BuildFeedback>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const attemptedEditorsRef = useRef(new WeakSet<Editor>());
  const fullDocumentRef = useRef<JSONContent>(
    props.initialContent || EMPTY_DOCUMENT,
  );

  useEffect(() => {
    if (!props.initialContent) return;
    const currentSections = splitCapabilityDocument(fullDocumentRef.current);
    const incomingSections = splitCapabilityDocument(props.initialContent);

    // A bounded editor reports its active slice during creation. Never let that
    // transient slice replace the canonical full document held by this wrapper.
    if (currentSections.length > 1 && incomingSections.length <= 1) return;
    fullDocumentRef.current = props.initialContent;
  }, [props.initialContent]);

  const sections = splitCapabilityDocument(fullDocumentRef.current);
  const bounded =
    props.pageId === CANONICAL_AURA_PAGE_ID && sections.length > 1;
  const safeIndex = Math.min(activeSectionIndex, sections.length - 1);
  const activeSection = sections[safeIndex];
  const mountedDocument: JSONContent = bounded
    ? { type: "doc", content: activeSection.content }
    : fullDocumentRef.current;

  const mergeActiveSection = useCallback(
    (sectionDocument: JSONContent): JSONContent => {
      if (!bounded) {
        fullDocumentRef.current = sectionDocument;
        return sectionDocument;
      }

      const current = fullDocumentRef.current;
      const currentSections = splitCapabilityDocument(current);
      const section = currentSections[
        Math.min(activeSectionIndex, currentSections.length - 1)
      ];
      const nodes = current.content || [];
      const merged: JSONContent = {
        ...current,
        content: [
          ...nodes.slice(0, section.start),
          ...(sectionDocument.content || []),
          ...nodes.slice(section.end),
        ],
      };
      fullDocumentRef.current = merged;
      return merged;
    },
    [activeSectionIndex, bounded],
  );

  const handleEditorChange = useCallback(
    (nextEditor: Editor | null) => {
      setEditor(nextEditor);
      props.onEditorChange?.(nextEditor);
    },
    [props.onEditorChange],
  );

  useEffect(() => {
    if (
      bounded ||
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
        fullDocumentRef.current = result.document;
        setFeedback({
          kind: "saved",
          message: "AURA saved. Loading its bounded sections…",
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
    bounded,
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

      {bounded && (
        <nav
          aria-label="AURA document sections"
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            padding: "0 0 12px",
            marginBottom: 12,
            borderBottom: "1px solid var(--mantine-color-default-border)",
          }}
        >
          {sections.map((section, index) => (
            <button
              key={section.label}
              type="button"
              aria-current={index === safeIndex ? "page" : undefined}
              onClick={() => setActiveSectionIndex(index)}
              style={{
                flex: "0 0 auto",
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid var(--mantine-color-default-border)",
                background:
                  index === safeIndex
                    ? "var(--mantine-color-default-hover)"
                    : "transparent",
                color: "inherit",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {section.label}
            </button>
          ))}
        </nav>
      )}

      <PortfolioEditorWithHistory
        key={bounded ? `aura-section-${safeIndex}` : "aura-document"}
        {...props}
        initialContent={mountedDocument}
        transformContentForSave={bounded ? mergeActiveSection : undefined}
        disableHistory={bounded}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
}

export type { RamzyStudioPortfolioEditorProps } from "@/portfolio-runtime/portfolio-editor-with-history";
