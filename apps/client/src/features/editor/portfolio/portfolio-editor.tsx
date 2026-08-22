import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Editor, EditorOptions, JSONContent } from "@tiptap/core";
import {
  RamzyPortfolioEditor,
  type RamzyPortfolioSession,
} from "@docmost/editor-ext/portfolio";
import { mainExtensions } from "@/features/editor/extensions/extensions";
import { handleFileDrop, handlePaste } from "@/features/editor/components/common/editor-paste-handler";
import { EditorBubbleMenu } from "@/features/editor/components/bubble-menu/bubble-menu";
import { EditorLinkMenu } from "@/features/editor/components/link/link-menu";
import TableMenu from "@/features/editor/components/table/table-menu";
import { TableHandlesLayer } from "@/features/editor/components/table/handle/table-handles-layer";
import ImageMenu from "@/features/editor/components/image/image-menu";
import VideoMenu from "@/features/editor/components/video/video-menu";
import PdfMenu from "@/features/editor/components/pdf/pdf-menu";
import CalloutMenu from "@/features/editor/components/callout/callout-menu";
import SubpagesMenu from "@/features/editor/components/subpages/subpages-menu";
import ExcalidrawMenu from "@/features/editor/components/excalidraw/excalidraw-menu-lazy";
import DrawioMenu from "@/features/editor/components/drawio/drawio-menu";
import ColumnsMenu from "@/features/editor/components/columns/columns-menu";
import SearchAndReplaceDialog from "@/features/editor/components/search-and-replace/search-and-replace-dialog";
import { TransclusionLookupProvider } from "@/features/editor/components/transclusion/transclusion-lookup-context";
import { PortfolioRuntimeProviders } from "@/portfolio-runtime/runtime-providers";
import { setPortfolioRuntimeHostConfig } from "@/lib/portfolio-runtime-config";

export type RamzyPortfolioSaveState = "idle" | "saving" | "saved" | "error";

export interface RamzyStudioPortfolioEditorProps {
  pageId: string;
  session: RamzyPortfolioSession;
  initialContent?: JSONContent | null;
  editable?: boolean;
  onCreate?: (editor: Editor) => void;
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
  const lastSavedJsonRef = useRef(
    JSON.stringify(initialContent ?? { type: "doc", content: [{ type: "paragraph" }] }),
  );

  useEffect(() => {
    mountedRef.current = true;
    onSaveStateChange?.("idle");

    return () => {
      mountedRef.current = false;
    };
  }, [onSaveStateChange]);

  const extensions = useMemo(() => [...mainExtensions], []);

  const persistDraft = useCallback(
    async (content: JSONContent, version: number) => {
      const apiBase = session.apiUrl.replace(/\/+$/, "");
      const response = await fetch(`${apiBase}/portfolio/draft/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ pageId, content }),
      });

      if (response.status === 401) {
        onSessionExpired?.();
        throw new Error("Ramzy Studio session expired. Reconnecting…");
      }

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message =
          body && typeof body === "object" && "message" in body
            ? String(body.message)
            : `Ramzy Studio autosave failed (${response.status})`;
        throw new Error(message);
      }

      lastSavedJsonRef.current = JSON.stringify(content);

      if (mountedRef.current && version === saveVersionRef.current) {
        onSaveStateChange?.("saved");
      }
    },
    [onSaveStateChange, onSessionExpired, pageId, session.accessToken, session.apiUrl],
  );

  const enqueueSave = useCallback(
    (content: JSONContent) => {
      const serialized = JSON.stringify(content);
      if (serialized === lastSavedJsonRef.current) {
        if (mountedRef.current) onSaveStateChange?.("saved");
        return;
      }

      const version = ++saveVersionRef.current;
      if (mountedRef.current) onSaveStateChange?.("saving");

      saveChainRef.current = saveChainRef.current
        .catch(() => undefined)
        .then(() => persistDraft(content, version))
        .catch((error) => {
          if (mountedRef.current && version === saveVersionRef.current) {
            onSaveStateChange?.(
              "error",
              error instanceof Error ? error.message : "Ramzy Studio autosave failed.",
            );
          }
        });
    },
    [onSaveStateChange, persistDraft],
  );

  const scheduleSave = useCallback(
    (content: JSONContent) => {
      pendingContentRef.current = content;

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      if (mountedRef.current) onSaveStateChange?.("saving");

      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        const pending = pendingContentRef.current;
        pendingContentRef.current = null;
        if (pending) enqueueSave(pending);
      }, 450);
    },
    [enqueueSave, onSaveStateChange],
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
        }}
      />

      {editor && (
        <SearchAndReplaceDialog editor={editor} editable={editable ?? true} />
      )}

      {editor && (editable ?? true) && (
        <>
          <EditorLinkMenu editor={editor} />
          <EditorBubbleMenu editor={editor} />
          <TableMenu editor={editor} />
          <TableHandlesLayer editor={editor} />
          <ImageMenu editor={editor} />
          <VideoMenu editor={editor} />
          <PdfMenu editor={editor} />
          <CalloutMenu editor={editor} />
          <SubpagesMenu editor={editor} />
          <ExcalidrawMenu editor={editor} />
          <DrawioMenu editor={editor} />
          <ColumnsMenu editor={editor} />
        </>
      )}

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
