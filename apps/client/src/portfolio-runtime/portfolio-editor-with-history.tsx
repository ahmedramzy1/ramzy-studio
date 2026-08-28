import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Editor, JSONContent } from "@tiptap/core";
import {
  RamzyStudioPortfolioEditor as BasePortfolioEditor,
  type RamzyPortfolioSaveState,
  type RamzyStudioPortfolioEditorProps as BaseRamzyStudioPortfolioEditorProps,
} from "@/features/editor/portfolio/portfolio-editor";
import {
  getPageHistoryById,
  getPageHistoryList,
} from "@/features/page-history/services/page-history-service";
import type { IPageHistory } from "@/features/page-history/types/page.types";

export interface RamzyStudioPortfolioHeaderActions {
  openHistory: () => void;
  addSection: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface RamzyStudioPortfolioEditorProps
  extends BaseRamzyStudioPortfolioEditorProps {
  onHeaderActionsChange?: (
    actions: RamzyStudioPortfolioHeaderActions | null,
  ) => void;
}

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

type RestoreFeedback =
  | { kind: "saving" | "success" | "error"; message: string }
  | null;

/**
 * Portfolio-runtime wrapper that exposes Ramzy Studio's real Page History to
 * the embedded BUILD surface used by ahmedramzy.com.
 *
 * History commands always target the editor instance reported by the live
 * editor lifecycle. `onCreate` is not sufficient here because React Strict
 * Mode can destroy the first TipTap instance and replace it while BUILD remains
 * mounted. The restored snapshot then flows through the normal editor update +
 * authenticated autosave path; success is reported only after autosave says the
 * draft is saved.
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
  const [restoreFeedback, setRestoreFeedback] =
    useState<RestoreFeedback>(null);
  const restorePendingRef = useRef(false);
  const restoredVersionRef = useRef<string | number | null>(null);

  const selectedPreview = useMemo(
    () => documentText(selectedHistory?.content),
    [selectedHistory],
  );

  const editorReady = Boolean(
    editor && !editor.isDestroyed && editor.isEditable,
  );

  const addSection = useCallback(() => {
    if (!editor || editor.isDestroyed || !editor.isEditable) return;
    editor
      .chain()
      .focus("end")
      .insertContent([
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "New section" }],
        },
        { type: "paragraph" },
      ])
      .run();
  }, [editor]);

  const handleCreate = useCallback(
    (nextEditor: Editor) => {
      props.onCreate?.(nextEditor);
    },
    [props.onCreate],
  );

  const handleEditorChange = useCallback(
    (nextEditor: Editor | null) => {
      setEditor(nextEditor);
      props.onEditorChange?.(nextEditor);
    },
    [props.onEditorChange],
  );

  const handleSaveStateChange = useCallback(
    (state: RamzyPortfolioSaveState, error?: string) => {
      props.onSaveStateChange?.(state, error);

      if (!restorePendingRef.current) return;

      if (state === "saving") {
        setRestoreFeedback({
          kind: "saving",
          message: "Restored into BUILD. Saving the recovered draft…",
        });
        return;
      }

      if (state === "saved") {
        const version = restoredVersionRef.current;
        restorePendingRef.current = false;
        restoredVersionRef.current = null;
        setRestoring(false);
        setHistoryOpen(false);
        setHistoryError(null);
        setRestoreFeedback({
          kind: "success",
          message: version
            ? `History version ${version} restored and saved.`
            : "History version restored and saved.",
        });
        return;
      }

      if (state === "error") {
        restorePendingRef.current = false;
        restoredVersionRef.current = null;
        setRestoring(false);
        const message = error || "The restored version could not be autosaved.";
        setHistoryError(message);
        setRestoreFeedback({ kind: "error", message });
      }
    },
    [props.onSaveStateChange],
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
    setRestoreFeedback(null);

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

  useEffect(() => {
    if (!editorReady || !editor) {
      props.onHeaderActionsChange?.(null);
      return;
    }

    const actions: RamzyStudioPortfolioHeaderActions = {
      openHistory: () => void openHistory(),
      addSection,
      undo: () => editor.chain().focus().undo().run(),
      redo: () => editor.chain().focus().redo().run(),
      canUndo: true,
      canRedo: true,
    };

    props.onHeaderActionsChange?.(actions);
    return () => {
      props.onHeaderActionsChange?.(null);
    };
  }, [addSection, editor, editorReady, openHistory, props.onHeaderActionsChange]);

  const restoreSelected = useCallback(() => {
    if (!selectedHistory?.content) {
      setHistoryError("Select a history version with restorable content first.");
      return;
    }

    if (!editor || editor.isDestroyed || !editor.isEditable) {
      setHistoryError(
        "BUILD is not holding a live editable Studio instance yet. Close History, wait for the editor to finish loading, then reopen it.",
      );
      return;
    }

    const confirmed = window.confirm(
      "Restore this Studio version? The current BUILD draft will be replaced and saved as the new draft. Nothing will be published.",
    );
    if (!confirmed) return;

    setHistoryError(null);
    setRestoring(true);
    restorePendingRef.current = true;
    restoredVersionRef.current = selectedHistory.version;
    setRestoreFeedback({
      kind: "saving",
      message: "Applying the selected Studio version…",
    });

    try {
      const applied = editor
        .chain()
        .focus()
        .setContent(selectedHistory.content, { emitUpdate: true })
        .run();

      if (!applied) {
        throw new Error("TipTap rejected the selected history document.");
      }
    } catch (error) {
      restorePendingRef.current = false;
      restoredVersionRef.current = null;
      setRestoring(false);
      const message =
        error instanceof Error
          ? error.message
          : "The selected Studio version could not be applied.";
      setHistoryError(message);
      setRestoreFeedback({ kind: "error", message });
    }
  }, [editor, selectedHistory]);

  const restoreDisabled =
    !editorReady || !selectedHistory?.content || detailLoading || restoring;

  return (
    <div style={{ position: "relative" }}>
      {restoreFeedback && (
        <div
          role={restoreFeedback.kind === "error" ? "alert" : "status"}
          style={{
            marginBottom: 8,
            fontSize: 12,
            color:
              restoreFeedback.kind === "error"
                ? "var(--mantine-color-red-6)"
                : restoreFeedback.kind === "success"
                  ? "var(--mantine-color-green-7)"
                  : "inherit",
            opacity: restoreFeedback.kind === "saving" ? 0.68 : 0.9,
          }}
        >
          {restoreFeedback.message}
        </div>
      )}

      <BasePortfolioEditor
        {...props}
        onCreate={handleCreate}
        onEditorChange={handleEditorChange}
        onSaveStateChange={handleSaveStateChange}
      />

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
            if (event.target === event.currentTarget && !restoring) {
              setHistoryOpen(false);
            }
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
                disabled={restoring}
                onClick={() => setHistoryOpen(false)}
                aria-label="Close history"
                style={{
                  border: 0,
                  background: "transparent",
                  color: "inherit",
                  cursor: restoring ? "not-allowed" : "pointer",
                  fontSize: 22,
                  lineHeight: 1,
                  opacity: restoring ? 0.4 : 1,
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
                        disabled={restoring}
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
                          cursor: restoring ? "not-allowed" : "pointer",
                          opacity: restoring ? 0.65 : 1,
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
                  <div role="alert" style={{ color: "var(--mantine-color-red-6)", fontSize: 13 }}>
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
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "12px 18px",
                borderTop: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.66 }}>
                {!editorReady
                  ? "Restore is disabled until BUILD has a live editable Studio instance."
                  : restoring
                    ? "Waiting for the recovered draft to autosave…"
                    : "Restore changes BUILD only. It does not publish."}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  disabled={restoring}
                  onClick={() => setHistoryOpen(false)}
                  style={{
                    border: "1px solid var(--mantine-color-default-border)",
                    borderRadius: 7,
                    background: "transparent",
                    color: "inherit",
                    padding: "7px 12px",
                    cursor: restoring ? "not-allowed" : "pointer",
                    opacity: restoring ? 0.5 : 1,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={restoreDisabled}
                  onClick={restoreSelected}
                  style={{
                    border: 0,
                    borderRadius: 7,
                    background: "var(--mantine-primary-color-filled)",
                    color: "var(--mantine-color-white)",
                    padding: "7px 12px",
                    cursor: restoreDisabled ? "not-allowed" : "pointer",
                    opacity: restoreDisabled ? 0.5 : 1,
                  }}
                >
                  {restoring
                    ? "Restoring & saving…"
                    : !editorReady
                      ? "Editor not ready"
                      : "Restore selected version"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
