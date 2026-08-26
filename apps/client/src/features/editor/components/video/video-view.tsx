import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Group, Loader, Text } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { getFileUrl } from "@/lib/config.ts";
import clsx from "clsx";
import classes from "./video-view.module.css";
import { useTranslation } from "react-i18next";
import RamzyVideoPlayer from "./ramzy-video-player";
import {
  enrichExistingVideo,
  ingestVideoFile,
} from "@/features/editor/components/media/media-ingest.ts";
import { isVideoFile } from "@/features/editor/components/media/media-file-utils.ts";

export default function VideoView(props: NodeViewProps) {
  const { t } = useTranslation();
  const { editor, node, selected, updateAttributes } = props;
  const { src, width, align, alt, aspectRatio, placeholder, poster } = node.attrs;
  const [replacing, setReplacing] = useState(false);
  const dragDepth = useRef(0);
  const [dropActive, setDropActive] = useState(false);
  const backfillAttempted = useRef("");

  const alignClass = useMemo(() => {
    if (align === "left") return "alignLeft";
    if (align === "right") return "alignRight";
    if (align === "center") return "alignCenter";
    return "alignCenter";
  }, [align]);

  const previewSrc = useMemo(() => {
    editor.storage.shared.videoPreviews =
      editor.storage.shared.videoPreviews || {};

    if (placeholder?.id) {
      return editor.storage.shared.videoPreviews[placeholder.id];
    }

    return null;
  }, [placeholder, editor]);

  const playerStyle = aspectRatio
    ? { aspectRatio: String(aspectRatio) }
    : undefined;

  useEffect(() => {
    if (!editor.isEditable || !src || poster || placeholder) return;
    if (backfillAttempted.current === src) return;
    // @ts-ignore
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId) return;
    backfillAttempted.current = src;

    const fileName = decodeURIComponent(String(src).split("/").pop() || alt || "video");
    void enrichExistingVideo(getFileUrl(src), pageId, fileName).then((enrichment) => {
      if (!enrichment.poster || editor.isDestroyed) return;
      updateAttributes({
        poster: enrichment.poster,
        posterAttachmentId: enrichment.posterAttachmentId,
      });
    });
  }, [alt, editor, placeholder, poster, src, updateAttributes]);

  const replaceFromDrop = async (file: File) => {
    if (!editor.isEditable || replacing || !isVideoFile(file)) return;
    // @ts-ignore
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId) return;

    setReplacing(true);
    try {
      const item = await ingestVideoFile(file, pageId);
      updateAttributes({
        src: item.src,
        attachmentId: item.attachmentId,
        alt: item.title,
        poster: item.poster || "",
        posterAttachmentId: item.posterAttachmentId,
        durationSeconds: item.durationSeconds,
        width: item.width,
        height: item.height,
        aspectRatio: item.aspectRatio,
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
        const file = Array.from(event.dataTransfer.files).find(isVideoFile);
        if (!file) return;
        event.preventDefault();
        event.stopPropagation();
        void replaceFromDrop(file);
      }}
    >
      <div
        className={clsx(
          selected && "ProseMirror-selectednode",
          classes.videoWrapper,
          !src && placeholder && classes.skeleton,
          alignClass,
        )}
        style={{
          aspectRatio: !src && !aspectRatio ? "16 / 9" : undefined,
          width,
          outline: dropActive ? "2px solid #3B5BFF" : undefined,
          outlineOffset: dropActive ? 4 : undefined,
          borderRadius: dropActive ? 8 : undefined,
        }}
      >
        {src && (
          <div style={{ position: "relative" }}>
            <RamzyVideoPlayer
              src={getFileUrl(src)}
              poster={poster ? getFileUrl(poster) : undefined}
              title={alt || t("Video")}
              style={playerStyle}
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
                  background: "rgba(0,0,0,.36)",
                  color: "white",
                }}
              >
                <Loader size={22} color="white" />
                <Text size="sm" c="white">Replacing & processing…</Text>
              </div>
            )}
          </div>
        )}
        {!src && previewSrc && (
          <Group pos="relative" w="100%">
            <RamzyVideoPlayer
              src={previewSrc}
              title={placeholder?.name || t("Video")}
              style={playerStyle}
            />
            <Loader size={20} pos="absolute" top={6} right={6} />
          </Group>
        )}
        {!src && !previewSrc && placeholder && (
          <Group justify="center" wrap="nowrap" gap="xs" maw="100%" px="md">
            <Loader size={20} style={{ flexShrink: 0 }} />
            <Text component="span" size="sm" truncate="end">
              {placeholder?.name
                ? t("Uploading {{name}}", { name: placeholder.name })
                : t("Uploading file")}
            </Text>
          </Group>
        )}
        {!src && !previewSrc && !placeholder && (
          <div style={{ width: "100%", aspectRatio: "16 / 9" }} />
        )}
      </div>
    </NodeViewWrapper>
  );
}
