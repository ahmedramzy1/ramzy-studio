import React, { useCallback, useMemo, useState } from "react";
import type { Editor, JSONContent } from "@tiptap/core";
import {
  RamzyStudioPortfolioEditor as BasePortfolioEditor,
  type RamzyStudioPortfolioEditorProps,
} from "@/features/editor/portfolio/portfolio-editor";
import {
  getPageHistoryById,
  getPageHistoryList,
} from "@/features/page-history/services/page-history-service";
import type { IPageHistory } from "@/features/page-history/types/page.types";

export type { RamzyStudioPortfolioEditorProps } from "@/features/editor/portfolio/portfolio-editor";

function documentText(content: JSONContent | null | undefined): string {
  if (!content) return "";

  const parts: string[] = [];
  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const value = node as { text?: unknown; content?: unknown };

    if (typeof value.text === "string") parts.push(value.text);
    if (Array.isArray(value.content)) value.content.forEach(visit);
  };

  visit(content);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function requestStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  const response = (error as { response?: { status?: unknown } }).response;
  return typeof response?.status === "number" ? response.status : undefined;
}

/**
 * Portfolio-runtime wrapper that exposes Ramzy Studio's real Page History to
 * the embedded BUILD surface used by ahmedramzy.com.
 *
 * Restoring a snapshot writes it back through the same TipTap editor instance,
 * so the existing portfolio autosave contract remains the single canonical
 * draft persistence path.
 */
export function RamzyStudioPortfolioEditor(
  props: RamzyStudioPortfolioEditorProps,
) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<IPageHistory[]>([]);
  const [selectedHistory, setSelectedHistory] =
    useState<IPageHistory | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  const selectedPreview = useMemo(
    () => documentText(selectedHistory?.content),
    [selectedHistory],
  );

  const handleCreate = useCallback(
    (nextEditor: Editor) => {
      setEditor(nextEditor);
      props.onCreate?.(nextEditor);
    },
    [props.onCreate],
  );

  const loadHistoryDetail = useCallback(
    async (historyId: string) => {
      setDetailLoading(true);
      setHistoryError(null);

      try {
        const detail = await getPageHistoryById(historyId);
        setSelectedHistory(detail);
      } catch (error) {
        if (requestStatus(error) === 401) props.onSessionExpired?.();
        setHistoryError("Could not load this Studio history version.");
      } finally {
        setDetailLoading(false);
      }
    },
    [props.onSessionExpired],
  );

  const openHistory = useCallback(async () => {
    setHistoryOpen(true);
    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const result = await getPageHistoryList(props.pageId);
      setHistoryItems(result.items);

      if (result.items.length > 0) {
        await loadHistoryDetail(result.items[0].id);
      } else {
        setSelectedHistory(null);
      }
    } catch (error) {
      if (requestStatus(error) === 401) props.onSessionExpired?.();
      setHistoryError("Could not load Studio page history.");
    } finally {
      setHistoryLoading(false);
    }
  }, [loadHistoryDetail, props.onSessionExpired, props.pageId]);

  const restoreSelected = useCallback(() => {
    if (
      !editor ||
      editor.isDestroyed ||
      !editor.isEditable ||
      !selectedHistory?.content
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Restore this Studio version? The current BUILD draft will be replaced, then autosaved as the new draft.",
    );
    if (!confirmed) return;

    setRestoring(true);
    try {
      editor
        .chain()
        .focus()
        .setContent(selectedHistory.content, { emitUpdate: true })
        .run();
      setHistoryOpen(false);
    } finally {
      setRestoring(false);
    }
  }, [editor, selectedHistory]);

  return (
    <div style={{ position: "relative" }}>
      {props.editable !== false && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: 8,
          }}
        >
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={openHistory}
            style={{
              border: "1px solid var(--mantine-color-default-border)",
              borderRadius: "var(--mantine-radius-sm)",
              background: "transparent",
              color: "inherit",
              padding: "0.25rem 0.5rem",
              font: "inherit",
              fontSize: "var(--mantine-font-size-xs)",
              lineHeight: 1.4,
              cursor: "pointer",
            }}
          >
            History
          </button>
        </div>
      )}

      <BasePortfolioEditor {...props} onCreate={handleCreate} />

      {historyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Studio page history"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "grid",
            placeItems: "center",
            padding: 24,
            background: "rgba(0, 0, 0, 0.58)",
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setHistoryOpen(false);
          }}
        >
          <div
            style={{
              width: "min(920px, calc(100vw - 48px))",
              maxHeight: "min(720px, calc(100vh - 48px))",
              overflow: "hidden",
              display: "grid",
              gridTemplateRows: "auto minmax(0, 1fr) auto",
              border: "1px solid var(--mantine-color-default-border)",
              borderRadius: 12,
              background: "var(--mantine-color-body)",
              color: "var(--mantine-color-text)",
              boxShadow: "0 24px 80px rgba(0,0,0,.32)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "16px 18px",
                borderBottom: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Studio History</div>
                <div style={{ marginTop: 2, opacity: 0.62, fontSize: 12 }}>
                  Select a saved version, verify its content, then restore it to BUILD.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                aria-label="Close history"
                style={{
                  border: 0,
                  background: "transparent",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: 22,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                minHeight: 0,
                display: "grid",
                gridTemplateColumns: "280px minmax(0, 1fr)",
              }}
            >
              <div
                style={{
                  minHeight: 0,
                  overflowY: "auto",
                  borderRight: "1px solid var(--mantine-color-default-border)",
                  padding: 10,
                }}
              >
                {historyLoading && historyItems.length === 0 ? (
                  <div style={{ padding: 12, opacity: 0.65, fontSize: 13 }}>
                    Loading history…
                  </div>
                ) : historyItems.length === 0 ? (
                  <div style={{ padding: 12, opacity: 0.65, fontSize: 13 }}>
                    No saved history versions yet.
                  </div>
                ) : (
                  historyItems.map((item) => {
                    const active = selectedHistory?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => loadHistoryDetail(item.id)}
                        style={{
                          width: "100%",
                          display: "block",
                          textAlign: "left",
                          border: active
                            ? "1px solid var(--mantine-primary-color-filled)"
                            : "1px solid transparent",
                          borderRadius: 8,
                          background: active
                            ? "var(--mantine-color-default-hover)"
                            : "transparent",
                          color: "inherit",
                          padding: "10px 11px",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 600 }}>
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                        <div style={{ marginTop: 3, opacity: 0.6, fontSize: 11 }}>
                          Version {item.version}
                          {item.lastUpdatedBy?.name
                            ? ` · ${item.lastUpdatedBy.name}`
                            : ""}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <div style={{ minHeight: 0, overflowY: "auto", padding: 22 }}>
                {historyError ? (
                  <div style={{ color: "var(--mantine-color-red-6)", fontSize: 13 }}>
                    {historyError}
                  </div>
                ) : detailLoading ? (
                  <div style={{ opacity: 0.65, fontSize: 13 }}>
                    Loading version…
                  </div>
                ) : selectedHistory ? (
                  <>
                    <div style={{ fontSize: 12, opacity: 0.58, marginBottom: 8 }}>
                      Saved {new Date(selectedHistory.createdAt).toLocaleString()}
                    </div>
                    <div
                      style={{
                        whiteSpace: "pre-wrap",
                        fontSize: 14,
                        lineHeight: 1.65,
                        opacity: selectedPreview ? 0.9 : 0.58,
                      }}
                    >
                      {selectedPreview || "This version contains no readable text preview."}
                    </div>
                  </>
                ) : (
                  <div style={{ opacity: 0.65, fontSize: 13 }}>
                    Select a history version to inspect it.
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                padding: "12px 18px",
                borderTop: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                style={{
                  border: "1px solid var(--mantine-color-default-border)",
                  borderRadius: 7,
                  background: "transparent",
                  color: "inherit",
                  padding: "7px 12px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedHistory?.content || detailLoading || restoring}
                onClick={restoreSelected}
                style={{
                  border: 0,
                  borderRadius: 7,
                  background: "var(--mantine-primary-color-filled)",
                  color: "var(--mantine-color-white)",
                  padding: "7px 12px",
                  cursor:
                    !selectedHistory?.content || detailLoading || restoring
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    !selectedHistory?.content || detailLoading || restoring ? 0.5 : 1,
                }}
              >
                {restoring ? "Restoring…" : "Restore selected version"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
