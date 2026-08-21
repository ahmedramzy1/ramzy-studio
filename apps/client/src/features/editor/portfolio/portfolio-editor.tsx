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
  HocuspocusProviderWebsocket,
} from "@hocuspocus/provider";
import {
  HocuspocusProviderWebsocketComponent,
  HocuspocusRoom,
  useHocuspocusEvent,
  useHocuspocusProvider,
} from "@hocuspocus/provider-react";
import { IndexeddbPersistence } from "y-indexeddb";
import {
  RamzyPortfolioEditor,
  type RamzyPortfolioSession,
} from "@docmost/editor-ext/portfolio";
import {
  collabExtensions,
  mainExtensions,
} from "@/features/editor/extensions/extensions";
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
import { RamzyStudioPortfolioRenderer } from "./portfolio-renderer";

export interface RamzyStudioPortfolioEditorProps {
  pageId: string;
  session: RamzyPortfolioSession;
  initialContent?: JSONContent | null;
  editable?: boolean;
  onCreate?: (editor: Editor) => void;
  onUpdate?: (content: JSONContent, editor: Editor) => void;
  onSessionExpired?: () => void;
}

/**
 * Complete collaborative Ramzy Studio authoring surface for portfolio hosts.
 *
 * The host supplies only page identity + the short-lived session returned by
 * /api/portfolio/session/exchange. Ramzy Studio owns collaboration, extensions,
 * node views, editor menus, uploads and API routing internally.
 */
export function RamzyStudioPortfolioEditor({
  pageId,
  session,
  initialContent,
  editable = true,
  onCreate,
  onUpdate,
  onSessionExpired,
}: RamzyStudioPortfolioEditorProps) {
  const socket = useMemo(
    () =>
      new HocuspocusProviderWebsocket({
        url: session.collaborationUrl,
        autoConnect: true,
      }),
    [session.collaborationUrl],
  );

  useLayoutEffect(() => {
    return setPortfolioRuntimeHostConfig({
      apiUrl: session.apiUrl,
      collaborationUrl: session.collaborationUrl,
      accessToken: session.accessToken,
    });
  }, [session.accessToken, session.apiUrl, session.collaborationUrl]);

  useEffect(() => {
    return () => {
      socket.destroy();
    };
  }, [socket]);

  return (
    <PortfolioRuntimeProviders>
      <TransclusionLookupProvider>
        <HocuspocusProviderWebsocketComponent websocketProvider={socket}>
          <HocuspocusRoom
            name={`page.${pageId}`}
            token={session.collaborationToken}
            flushDelay={500}
            onAuthenticationFailed={onSessionExpired}
          >
            <CollaborativePortfolioEditor
              pageId={pageId}
              session={session}
              initialContent={initialContent}
              editable={editable}
              onCreate={onCreate}
              onUpdate={onUpdate}
            />
          </HocuspocusRoom>
        </HocuspocusProviderWebsocketComponent>
      </TransclusionLookupProvider>
    </PortfolioRuntimeProviders>
  );
}

function CollaborativePortfolioEditor({
  pageId,
  session,
  initialContent,
  editable,
  onCreate,
  onUpdate,
}: Omit<RamzyStudioPortfolioEditorProps, "onSessionExpired">) {
  const provider = useHocuspocusProvider();
  const editorRef = useRef<Editor | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [remoteSynced, setRemoteSynced] = useState(false);
  const [localSynced, setLocalSynced] = useState(false);

  useEffect(() => {
    const persistence = new IndexeddbPersistence(
      provider.configuration.name,
      provider.document,
    );

    persistence.on("synced", () => setLocalSynced(true));

    return () => {
      persistence.destroy();
    };
  }, [provider]);

  useHocuspocusEvent("synced", ({ state }) => setRemoteSynced(state));

  const extensions = useMemo(
    () => [
      ...mainExtensions,
      ...collabExtensions(provider, session.user as any),
    ],
    [provider, session.user],
  );

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
      onUpdate?.(nextEditor.getJSON(), nextEditor);
    },
    [onUpdate],
  );

  const isSynced = remoteSynced && localSynced;

  if (!isSynced) {
    return (
      <RamzyStudioPortfolioRenderer
        content={initialContent}
        pageId={pageId}
        withProviders={false}
      />
    );
  }

  return (
    <div className="editor-container" style={{ position: "relative" }}>
      <RamzyPortfolioEditor
        pageId={pageId}
        extensions={extensions}
        editable={editable}
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
        <SearchAndReplaceDialog editor={editor} editable={editable} />
      )}

      {editor && editable && (
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
        style={{ paddingBottom: "20vh" }}
      />
    </div>
  );
}
