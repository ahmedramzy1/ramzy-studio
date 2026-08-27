import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Editor, EditorOptions, JSONContent } from "@tiptap/core";
import { UndoRedo } from "@tiptap/extensions";
import {
  RamzyPortfolioEditor,
  type RamzyPortfolioSession,
} from "@docmost/editor-ext/portfolio";
import { mainExtensions } from "@/features/editor/extensions/extensions";
import { handleFileDrop, handlePaste } from "@/features/editor/components/common/editor-paste-handler";
import { TransclusionLookupProvider } from "@/features/editor/components/transclusion/transclusion-lookup-context";
import { PortfolioRuntimeProviders } from "@/portfolio-runtime/runtime-providers";
import { setPortfolioRuntimeHostConfig } from "@/lib/portfolio-runtime-config";
import {
  PortfolioDraftSaveError,
  savePortfolioDraft,
} from "./portfolio-draft-save";

export type RamzyPortfolioSaveState = "idle" | "saving" | "saved" | "error";

export interface RamzyStudioPortfolioEditorProps {
  pageId: string;
  session: RamzyPortfolioSession;
  initialContent?: JSONContent | null;
  editable?: boolean;
  onCreate?: (editor: Editor) => void;
  /**
   * Reports the current live TipTap instance whenever React/TipTap replaces it.
   * This is intentionally distinct from onCreate: development Strict Mode can
   * destroy an initially-created instance and replace it while the editor stays
   * mounted. Consumers that perform commands after creation (History restore,
   * for example) must use the live lifecycle rather than retain a stale editor.
   */
  onEditorChange?: (editor: Editor | null) => void;
  onUpdate?: (content: JSONContent, editor: Editor) => void;
  onSessionExpired?: () => void;
  onSaveStateChange?: (
    state: RamzyPortfolioSaveState,
    error?: string,
  ) => void;
}

/**
 * Native Ramzy Studio authoring surface for external portfolio hosts.
 *
 * The editor deliberately does not require Docmost's collaboration WebSocket.
 * ahmedramzy.com is a single-user authoring host, so the native ProseMirror JSON
 * is edited with the exact same Studio extensions/menus and autosaved through a
 * short-lived authenticated Studio API session. Standalone Ramzy Studio keeps
 * its normal Hocuspocus/Yjs collaboration path.
 */
export function RamzyStudioPortfolioEditor({
  pageId,
  session,
  initialContent,
  editable = true,
  onCreate,
  onEditorChange,
  onUpdate,
  onSessionExpired,
  onSaveStateChange,
}: RamzyStudioPortfolioEditorProps) {
  useLayoutEffect(() => {
    return setPortfolioRuntimeHostConfig({
      apiUrl: session.apiUrl,
      collaborationUrl: session.collaborationUrl,
      accessToken: session.accessToken,
    });
  }, [session.accessToken, session.apiUrl, session.collaborationUrl]);

  return (
    <PortfolioRuntimeProviders>
      <TransclusionLookupProvider>
        <DirectPortfolioEditor
          pageId={pageId}
          session={session}
          initialContent={initialContent}
          editable={editable}
          onCreate={onCreate}
          onEditorChange={onEditorChange}
          onUpdate={onUpdate}
          onSessionExpired={onSessionExpired}
          onSaveStateChange={onSaveStateChange}
        />
      </TransclusionLookupProvider>
    </PortfolioRuntimeProviders>
  );
}

function DirectPortfolioEditor({
  pageId,
  session,
  initialContent,
  editable,
  onCreate,
  onEditorChange,
  onUpdate,
  onSessionExpired,
  onSaveStateChange,
}: RamzyStudioPortfolioEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const mountedRef = useRef(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingContentRef = useRef<JSONContent | null>(null);
  const saveVersionRef = useRef(0);
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());
  const onSaveStateChangeRef = useRef(onSaveStateChange);
  const onSessionExpiredRef = useRef(onSessionExpired);
  const lastSavedJsonRef = useRef(
    JSON.stringify(initialContent ?? { type: "doc", content: [{ type: "paragraph" }] }),
  );

  useEffect(() => {
    onSaveStateChangeRef.current = onSaveStateChange;
  }, [onSaveStateChange]);

  useEffect(() => {
    onSessionExpiredRef.current = onSessionExpired;
  }, [onSessionExpired]);

  const notifySaveState = useCallback(
    (state: RamzyPortfolioSaveState, error?: string) => {
      onSaveStateChangeRef.current?.(state, error);
    },
    [],
  );

  useEffect(() => {
    mountedRef.current = true;
    notifySaveState("idle");

    return () => {
      mountedRef.current = false;
    };
  }, [notifySaveState]);

  const extensions = useMemo(() => [...mainExtensions, UndoRedo], []);

  const persistDraft = useCallback(
    async (content: JSONContent, version: number) => {
      try {
        await savePortfolioDraft({
          apiUrl: session.apiUrl,
          accessToken: session.accessToken,
          pageId,
          content,
        });
      } catch (error) {
        if (error instanceof PortfolioDraftSaveError && error.sessionExpired) {
          onSessionExpiredRef.current?.();
        }
        throw error;
      }

      lastSavedJsonRef.current = JSON.stringify(content);

      if (mountedRef.current && version === saveVersionRef.current) {
        notifySaveState("saved");
      }
    },
    [notifySaveState, pageId, session.accessToken, session.apiUrl],
  );

  const enqueueSave = useCallback(
    (content: JSONContent) => {
      const serialized = JSON.stringify(content);
      if (serialized === lastSavedJsonRef.current) {
        if (mountedRef.current) notifySaveState("saved");
        return;
      }

      const version = ++saveVersionRef.current;
      if (mountedRef.current) notifySaveState("saving");

      // Serialize writes so an older request can never finish after a newer one
      // and overwrite the newest document state.
      saveChainRef.current = saveChainRef.current
        .catch(() => undefined)
        .then(() => persistDraft(content, version))
        .catch((error) => {
          if (mountedRef.current && version === saveVersionRef.current) {
            notifySaveState(
              "error",
              error instanceof Error ? error.message : "Ramzy Studio autosave failed.",
            );
          }
        });
    },
    [notifySaveState, persistDraft],
  );

  const scheduleSave = useCallback(
    (content: JSONContent) => {
      pendingContentRef.current = content;

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      if (mountedRef.current) notifySaveState("saving");

      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        const pending = pendingContentRef.current;
        pendingContentRef.current = null;
        if (pending) enqueueSave(pending);
      }, 450);
    },
    [enqueueSave, notifySaveState],
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }

      const pending = pendingContentRef.current;
      pendingContentRef.current = null;
      if (pending) enqueueSave(pending);
    };
  }, [enqueueSave]);

  const editorProps = useMemo<EditorOptions["editorProps"]>(
    () => ({
      attributes: {
        class: "ramzy-portfolio-editor",
      },
      handlePaste: (_view, event) => {
        if (!editorRef.current) return false;
        return handlePaste(
          editorRef.current,
          event,
          pageId,
          session.user.id,
        );
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (!editorRef.current) return false;
        return handleFileDrop(editorRef.current, event, moved, pageId);
      },
    }),
    [pageId, session.user.id],
  );

  const handleCreate = useCallback(
    (nextEditor: Editor) => {
      editorRef.current = nextEditor;
      setEditor(nextEditor);
      onCreate?.(nextEditor);
      onUpdate?.(nextEditor.getJSON(), nextEditor);
    },
    [onCreate, onUpdate],
  );

  const handleUpdate = useCallback(
    (nextEditor: Editor) => {
      const content = nextEditor.getJSON();
      onUpdate?.(content, nextEditor);
      scheduleSave(content);
    },
    [onUpdate, scheduleSave],
  );

  return (
    <div className="editor-container" style={{ position: "relative", minHeight: 240 }}>
      {editor && (editable ?? true) && (
        <div className="ramzy-portfolio-history-controls" aria-label="Editing history">
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo (Ctrl+Z)"
          >
            Undo
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo (Ctrl+Shift+Z)"
          >
            Redo
          </button>
        </div>
      )}

      <RamzyPortfolioEditor
        pageId={pageId}
        content={initialContent ?? { type: "doc", content: [{ type: "paragraph" }] }}
        extensions={extensions}
        editable={editable ?? true}
        ariaLabel="Portfolio document content"
        editorProps={editorProps}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onEditorChange={(nextEditor) => {
          editorRef.current = nextEditor;
          setEditor(nextEditor);
          onEditorChange?.(nextEditor);
        }}
      />

      {/*
        The embedded portfolio runtime intentionally excludes Studio's floating
        BubbleMenu/TableHandle plugin layer. Native editing, slash commands,
        keyboard shortcuts, autosave, history and undo/redo remain available.
      */}

      <div
        onClick={() => {
          if (editor && !editor.isDestroyed) {
            editor.commands.focus("end");
          }
        }}
        style={{ minHeight: 160, paddingBottom: "20vh", cursor: "text" }}
      />
    </div>
  );
}
