import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Group, Text, Paper, ActionIcon, Loader, Tooltip } from "@mantine/core";
import { getFileUrl } from "@/lib/config.ts";
import {
  IconDownload,
  IconFileTypePdf,
  IconPaperclip,
} from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";
import { formatBytes } from "@/lib";
import { useTranslation } from "react-i18next";
import { useCallback, useRef, useState } from "react";
import { uploadFile } from "@/features/page/services/page-service";

export default function AttachmentView(props: NodeViewProps) {
  const { t } = useTranslation();
  const { editor, node, getPos, selected, updateAttributes } = props;
  const { url, name, size, mime, attachmentId, placeholder, display } =
    node.attrs;
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacing, setReplacing] = useState(false);
  const { hovered, ref } = useHover();
  const portfolioMode = editor.view.dom.classList.contains(
    "ramzy-portfolio-editor",
  );

  const isPdf =
    mime === "application/pdf" || name?.toLowerCase().endsWith(".pdf");

  const handleEmbedAsPdf = useCallback(() => {
    const pos = getPos();
    if (pos === undefined || !url) return;

    const nodeSize = node.nodeSize;

    editor
      .chain()
      .insertContentAt(
        { from: pos, to: pos + nodeSize },
        {
          type: "pdf",
          attrs: {
            src: url,
            name,
            attachmentId,
            size,
          },
        },
      )
      .run();
  }, [editor, getPos, node, url, name, attachmentId]);

  const replaceFile = useCallback(
    async (file?: File) => {
      if (!file || replacing) return;
      // @ts-ignore portfolio editor storage owns the canonical linked page id.
      const pageId = editor.storage?.pageId as string | undefined;
      if (!pageId) return;
      setReplacing(true);
      try {
        const attachment = await uploadFile(file, pageId);
        updateAttributes({
          url: `/api/files/${attachment.id}/${attachment.fileName}`,
          name: file.name,
          size: file.size,
          mime: file.type || "application/octet-stream",
          attachmentId: attachment.id,
          placeholder: null,
        });
      } finally {
        setReplacing(false);
      }
    },
    [editor, replacing, updateAttributes],
  );

  return (
    <NodeViewWrapper>
      <Paper
        withBorder={display !== "inline"}
        p={display === "inline" ? 0 : "4px"}
        ref={ref}
        data-drag-handle
      >
        <Group
          justify="space-between"
          gap="xl"
          style={{ cursor: "pointer" }}
          wrap="nowrap"
          h={25}
        >
          <Group wrap="nowrap" gap="sm" style={{ minWidth: 0, flex: 1 }}>
            {(!url && placeholder) || replacing ? (
              <Loader size={20} style={{ flexShrink: 0 }} />
            ) : (
              <IconPaperclip size={20} style={{ flexShrink: 0 }} />
            )}

            <Text
              component="span"
              size="md"
              truncate="end"
              style={{ minWidth: 0 }}
            >
              {!url && placeholder ? t("Uploading {{name}}", { name }) : name}
            </Text>

            <Text
              component="span"
              size="sm"
              c="dimmed"
              style={{ flexShrink: 0 }}
            >
              {formatBytes(size)}
            </Text>
          </Group>

          {url && !portfolioMode && (selected || hovered) && (
            <Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
              {isPdf && editor.isEditable && (
                <Tooltip
                  label={t("Embed as PDF")}
                  position="top"
                  withinPortal={false}
                >
                  <ActionIcon
                    variant="default"
                    aria-label={t("Embed as PDF")}
                    onClick={handleEmbedAsPdf}
                  >
                    <IconFileTypePdf size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
              <a href={getFileUrl(url)} target="_blank">
                <ActionIcon variant="default" aria-label="download file">
                  <IconDownload size={18} />
                </ActionIcon>
              </a>
            </Group>
          )}

          {url && portfolioMode && (
            <>
              {isPdf && (
                <button
                  type="button"
                  hidden
                  data-ramzy-element-action="embed-as-pdf"
                  onClick={handleEmbedAsPdf}
                />
              )}
              <a
                hidden
                data-ramzy-element-action="download-file"
                href={getFileUrl(url)}
                target="_blank"
                rel="noreferrer"
              />
              <button
                type="button"
                hidden
                data-ramzy-element-action="replace-file"
                onClick={() => replaceInputRef.current?.click()}
              />
            </>
          )}
        </Group>
        <input
          ref={replaceInputRef}
          type="file"
          hidden
          onChange={(event) => {
            void replaceFile(event.currentTarget.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
      </Paper>
    </NodeViewWrapper>
  );
}
