import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Group, Loader, Text } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { getFileUrl } from "@/lib/config.ts";
import { isInternalFileUrl } from "@docmost/editor-ext";
import classes from "./audio-view.module.css";
import { useTranslation } from "react-i18next";
import RamzyAudioPlayer from "./ramzy-audio-player";
import {
  enrichExistingAudio,
  ingestAudioFile,
} from "@/features/editor/components/media/media-ingest.ts";
import { isAudioFile } from "@/features/editor/components/media/media-file-utils.ts";

export default function AudioView(props: NodeViewProps) {
  const { t } = useTranslation();
  const { editor, node, updateAttributes } = props;
  const {
    src,
    placeholder,
    title: storedTitle,
    artist,
    album,
    description,
    artwork,
  } = node.attrs;
  const [replacing, setReplacing] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const [activated, setActivated] = useState(false);
  const dragDepth = useRef(0);
  const backfillAttempted = useRef("");

  const safeSrc = useMemo(() => {
    if (!src || !isInternalFileUrl(src)) return null;
    return getFileUrl(src);
  }, [src]);

  const previewSrc = useMemo(() => {
    editor.storage.shared.audioPreviews =
      editor.storage.shared.audioPreviews || {};

    if (placeholder?.id) {
      return editor.storage.shared.audioPreviews[placeholder.id];
    }

    return null;
  }, [placeholder, editor]);

  const title = storedTitle || placeholder?.name || t("Audio");
  const safeArtwork = artwork && isInternalFileUrl(artwork)
    ? getFileUrl(artwork)
    : undefined;

  useEffect(() => {
    if (!activated || !editor.isEditable || !safeSrc || placeholder) return;
    if (artwork || artist || album) return;
    if (backfillAttempted.current === src) return;
    // @ts-ignore
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId) return;
    backfillAttempted.current = src;

    const fileName = decodeURIComponent(String(src).split("/").pop() || "audio.mp3");
    void enrichExistingAudio(safeSrc, pageId, fileName).then((enrichment) => {
      if (editor.isDestroyed) return;
      const next: Record<string, any> = {};
      if (enrichment.title) next.title = enrichment.title;
      if (enrichment.artist) next.artist = enrichment.artist;
      if (enrichment.album) next.album = enrichment.album;
      if (enrichment.description) next.description = enrichment.description;
      if (enrichment.artwork) next.artwork = enrichment.artwork;
      if (enrichment.artworkAttachmentId) {
        next.artworkAttachmentId = enrichment.artworkAttachmentId;
      }
      if (enrichment.artworkSource) next.artworkSource = enrichment.artworkSource;
      if (enrichment.durationSeconds) next.durationSeconds = enrichment.durationSeconds;
      if (Object.keys(next).length) updateAttributes(next);
    });
  }, [activated, album, artist, artwork, editor, placeholder, safeSrc, src, updateAttributes]);

  const replaceFromDrop = async (file: File) => {
    if (!editor.isEditable || replacing || !isAudioFile(file)) return;
    // @ts-ignore
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId) return;

    setReplacing(true);
    try {
      const item = await ingestAudioFile(file, pageId);
      updateAttributes({
        src: item.src,
        attachmentId: item.attachmentId,
        title: item.title,
        artist: item.artist || "",
        album: item.album || "",
        description: item.description || "",
        artwork: item.artwork || "",
        artworkAttachmentId: item.artworkAttachmentId,
        artworkSource: item.artworkSource || "",
        durationSeconds: item.durationSeconds,
        placeholder: null,
      });
    } finally {
      setReplacing(false);
      setDropActive(false);
      dragDepth.current = 0;
    }
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      onDragEnter={(event) => {
        if (!editor.isEditable || !event.dataTransfer?.types.includes("Files")) return;
        event.preventDefault();
        dragDepth.current += 1;
        setDropActive(true);
      }}
      onDragOver={(event) => {
        if (!editor.isEditable || !event.dataTransfer?.types.includes("Files")) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      }}
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setDropActive(false);
      }}
      onDrop={(event) => {
        if (!editor.isEditable || !event.dataTransfer?.files.length) return;
        const file = Array.from(event.dataTransfer.files).find(isAudioFile);
        if (!file) return;
        event.preventDefault();
        event.stopPropagation();
        void replaceFromDrop(file);
      }}
    >
      <div
        className={`${classes.audioWrapper} ${!safeSrc && placeholder ? classes.skeleton : ""}`}
        style={{
          outline: dropActive ? "2px solid #3B5BFF" : undefined,
          outlineOffset: dropActive ? 4 : undefined,
          borderRadius: dropActive ? 8 : undefined,
        }}
      >
        {safeSrc && !activated && (
          <button
            type="button"
            onClick={() => setActivated(true)}
            style={{ width: "100%", minHeight: 96, border: "1px solid var(--mantine-color-default-border)", borderRadius: 8, background: "var(--mantine-color-default-hover)", color: "inherit", cursor: "pointer", font: "inherit" }}
          >
            Load audio · {title}
          </button>
        )}
        {safeSrc && activated && (
          <div style={{ position: "relative", width: "100%" }}>
            <RamzyAudioPlayer
              src={safeSrc}
              title={title}
              artist={artist || undefined}
              description={description || album || undefined}
              artwork={safeArtwork}
            />
            {replacing && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "rgba(255,255,255,.76)",
                  backdropFilter: "blur(2px)",
                }}
              >
                <Loader size={22} />
                <Text size="sm">Replacing & processing…</Text>
              </div>
            )}
          </div>
        )}
        {!safeSrc && previewSrc && (
          <Group pos="relative" w="100%">
            <RamzyAudioPlayer
              src={previewSrc}
              title={title}
            />
            <Loader size={20} pos="absolute" top={6} right={6} />
          </Group>
        )}
        {!safeSrc && !previewSrc && placeholder && (
          <Group justify="center" wrap="nowrap" gap="xs" maw="100%" px="md" h={54}>
            <Loader size={20} style={{ flexShrink: 0 }} />
            <Text component="span" size="sm" truncate="end">
              {placeholder?.name
                ? t("Uploading {{name}}", { name: placeholder.name })
                : t("Uploading file")}
            </Text>
          </Group>
        )}
        {!safeSrc && !previewSrc && !placeholder && (
          <div style={{ width: "100%", minHeight: 96 }} />
        )}
      </div>
    </NodeViewWrapper>
  );
}
