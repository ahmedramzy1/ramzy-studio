import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Group, Loader, Text } from "@mantine/core";
import { useMemo } from "react";
import { getFileUrl } from "@/lib/config.ts";
import { isInternalFileUrl } from "@docmost/editor-ext";
import classes from "./audio-view.module.css";
import { useTranslation } from "react-i18next";
import RamzyAudioPlayer from "./ramzy-audio-player";

export default function AudioView(props: NodeViewProps) {
  const { t } = useTranslation();
  const { editor, node } = props;
  const { src, placeholder } = node.attrs;

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

  const title = placeholder?.name || t("Audio");

  return (
    <NodeViewWrapper data-drag-handle>
      <div className={`${classes.audioWrapper} ${!safeSrc && placeholder ? classes.skeleton : ""}`}>
        {safeSrc && (
          <RamzyAudioPlayer
            src={safeSrc}
            title={title}
          />
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
