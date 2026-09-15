import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react/menus";
import { findParentNode, posToDOMRect, useEditorState } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Node as PMNode } from "@tiptap/pm/model";
import { isEditorReady } from "@docmost/editor-ext";
import {
  EditorMenuProps,
  ShouldShowProps,
} from "@/features/editor/components/table/types/types.ts";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Paper,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import clsx from "clsx";
import {
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconDownload,
  IconArrowsHorizontal,
  IconPhotoEdit,
  IconRefresh,
  IconSubtitles,
  IconTextCaption,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getFileUrl } from "@/lib/config.ts";
import { useAltTextControl } from "@/features/editor/components/common/use-alt-text-control.tsx";
import classes from "../common/toolbar-menu.module.css";
import { normalizeVideoCaption, VIDEO_WIDTH_PRESETS } from "./video-layout";
import { uploadFile } from "@/features/page/services/page-service.ts";
import {
  generateVideoCaptions,
  ingestVideoFile,
} from "@/features/editor/components/media/media-ingest.ts";
import { isVideoFile } from "@/features/editor/components/media/media-file-utils";
import {
  hasPortfolioElementMenu,
  PortfolioElementActions,
} from "@/features/editor/portfolio/portfolio-element-menu";

export function VideoMenu({ editor }: EditorMenuProps) {
  const { t } = useTranslation();
  const portfolioMode = hasPortfolioElementMenu(editor);
  const [captionEditing, setCaptionEditing] = useState(false);
  const [captionDraft, setCaptionDraft] = useState("");
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [captionsGenerating, setCaptionsGenerating] = useState(false);
  const [videoReplacing, setVideoReplacing] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return null;
      }

      const videoAttrs = ctx.editor.getAttributes("video");

      return {
        isVideo: ctx.editor.isActive("video"),
        isAlignLeft: ctx.editor.isActive("video", { align: "left" }),
        isAlignCenter: ctx.editor.isActive("video", { align: "center" }),
        isAlignRight: ctx.editor.isActive("video", { align: "right" }),
        src: videoAttrs?.src || null,
        alt: videoAttrs?.alt || "",
        caption: videoAttrs?.caption || "",
        width: videoAttrs?.width || "100%",
        attachmentId: videoAttrs?.attachmentId || "",
        captions: Array.isArray(videoAttrs?.captions)
          ? videoAttrs.captions
          : [],
      };
    },
  });

  const shouldShow = useCallback(
    ({ state }: ShouldShowProps) => {
      if (!state) {
        return false;
      }

      return editor.isActive("video") && editor.getAttributes("video").src;
    },
    [editor],
  );

  const getReferencedVirtualElement = useCallback(() => {
    if (!isEditorReady(editor)) return;
    const { selection } = editor.state;
    const predicate = (node: PMNode) => node.type.name === "video";
    const parent = findParentNode(predicate)(selection);

    if (parent) {
      const dom = editor.view.nodeDOM(parent?.pos) as HTMLElement;
      const domRect = dom.getBoundingClientRect();
      return {
        getBoundingClientRect: () => domRect,
        getClientRects: () => [domRect],
      };
    }

    const domRect = posToDOMRect(editor.view, selection.from, selection.to);
    return {
      getBoundingClientRect: () => domRect,
      getClientRects: () => [domRect],
    };
  }, [editor]);

  const alignLeft = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setVideoAlign("left")
      .run();
  }, [editor]);

  const alignCenter = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setVideoAlign("center")
      .run();
  }, [editor]);

  const alignRight = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setVideoAlign("right")
      .run();
  }, [editor]);

  const handleDownload = useCallback(() => {
    if (!editorState?.src) return;
    const url = getFileUrl(editorState.src);
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.click();
  }, [editorState?.src]);

  const handleDelete = useCallback(() => {
    editor.commands.deleteSelection();
  }, [editor]);

  const uploadThumbnail = useCallback(
    async (file?: File) => {
      if (!file || !file.type.startsWith("image/") || thumbnailUploading)
        return;
      // @ts-ignore portfolio editor storage owns the canonical linked page id.
      const pageId = editor.storage?.pageId as string | undefined;
      if (!pageId) return;
      setThumbnailUploading(true);
      try {
        const attachment = await uploadFile(file, pageId);
        editor
          .chain()
          .focus(undefined, { scrollIntoView: false })
          .updateAttributes("video", {
            poster: `/api/files/${attachment.id}/${attachment.fileName}`,
            posterAttachmentId: attachment.id,
          })
          .run();
      } finally {
        setThumbnailUploading(false);
      }
    },
    [editor, thumbnailUploading],
  );

  const generateCaptions = useCallback(async () => {
    if (!editorState?.attachmentId || captionsGenerating) return;
    // @ts-ignore portfolio editor storage owns the canonical linked page id.
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId) return;
    const language = window.prompt(
      "Caption language (leave blank to detect automatically)",
      "",
    );
    if (language === null) return;
    setCaptionsGenerating(true);
    try {
      const track = await generateVideoCaptions(
        editorState.attachmentId,
        pageId,
        language,
      );
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .updateAttributes("video", {
          captions: [...editorState.captions, track],
        })
        .run();
    } finally {
      setCaptionsGenerating(false);
    }
  }, [captionsGenerating, editor, editorState]);

  const replaceVideo = useCallback(
    async (file?: File) => {
      if (!file || !isVideoFile(file) || videoReplacing) return;
      // @ts-ignore portfolio editor storage owns the canonical linked page id.
      const pageId = editor.storage?.pageId as string | undefined;
      if (!pageId) return;
      setVideoReplacing(true);
      try {
        const item = await ingestVideoFile(file, pageId);
        editor
          .chain()
          .focus(undefined, { scrollIntoView: false })
          .updateAttributes("video", {
            src: item.src,
            attachmentId: item.attachmentId,
            size: file.size,
            poster: item.poster || "",
            posterAttachmentId: item.posterAttachmentId,
            width: item.width,
            height: item.height,
            aspectRatio: item.aspectRatio,
            placeholder: null,
          })
          .run();
      } finally {
        setVideoReplacing(false);
      }
    },
    [editor, videoReplacing],
  );

  const setWidth = useCallback(
    (width: number) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setVideoWidth(width)
        .run();
    },
    [editor],
  );

  const openCaption = useCallback(() => {
    setCaptionDraft(editorState?.caption || "");
    setCaptionEditing(true);
  }, [editorState?.caption]);

  const saveCaption = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setVideoCaption(normalizeVideoCaption(captionDraft))
      .run();
    setCaptionEditing(false);
  }, [captionDraft, editor]);

  useEffect(() => {
    const handleSelectionUpdate = () => {
      if (!editor.isActive("video")) setCaptionEditing(false);
    };
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor]);

  const {
    button: altTextButton,
    panel: altTextPanel,
    isEditing: isEditingAlt,
  } = useAltTextControl({
    editor,
    nodeName: "video",
    currentAlt: editorState?.alt || "",
  });

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`video-menu`}
      updateDelay={0}
      getReferencedVirtualElement={getReferencedVirtualElement}
      options={{
        placement: portfolioMode ? "bottom" : "top",
        offset: 8,
        flip: false,
      }}
      shouldShow={shouldShow}
    >
      {isEditingAlt ? (
        altTextPanel
      ) : captionEditing ? (
        <Paper withBorder shadow="md" radius={6} p="sm" w={340}>
          <Text size="sm" fw={600} mb={2}>
            {t("Video caption")}
          </Text>
          <Text size="xs" c="dimmed" mb="xs">
            {t("Shown below the video in Build, Preview and Public.")}
          </Text>
          <Textarea
            size="xs"
            value={captionDraft}
            onChange={(event) => setCaptionDraft(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setCaptionEditing(false);
              } else if (
                event.key === "Enter" &&
                (event.metaKey || event.ctrlKey)
              ) {
                event.preventDefault();
                saveCaption();
              }
            }}
            autoFocus
            autosize
            minRows={2}
            maxRows={4}
            maxLength={240}
          />
          <Group justify="flex-end" gap="xs" mt="xs">
            <Button
              size="compact-xs"
              variant="default"
              onClick={() => setCaptionEditing(false)}
            >
              {t("Cancel")}
            </Button>
            <Button size="compact-xs" onClick={saveCaption}>
              {t("Save")}
            </Button>
          </Group>
        </Paper>
      ) : (
        <div className={classes.toolbar}>
          <Tooltip position="top" label={t("Align left")} withinPortal={false}>
            <ActionIcon
              onClick={alignLeft}
              size="lg"
              aria-label={t("Align left")}
              variant="subtle"
              className={clsx({ [classes.active]: editorState?.isAlignLeft })}
            >
              <IconLayoutAlignLeft size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip
            position="top"
            label={t("Align center")}
            withinPortal={false}
          >
            <ActionIcon
              onClick={alignCenter}
              size="lg"
              aria-label={t("Align center")}
              variant="subtle"
              className={clsx({ [classes.active]: editorState?.isAlignCenter })}
            >
              <IconLayoutAlignCenter size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip position="top" label={t("Align right")} withinPortal={false}>
            <ActionIcon
              onClick={alignRight}
              size="lg"
              aria-label={t("Align right")}
              variant="subtle"
              className={clsx({ [classes.active]: editorState?.isAlignRight })}
            >
              <IconLayoutAlignRight size={18} />
            </ActionIcon>
          </Tooltip>

          <div className={classes.divider} />

          <Menu withinPortal={false} position="bottom-start" shadow="md">
            <Menu.Target>
              <ActionIcon
                size="lg"
                aria-label={t("Video width")}
                title={t("Video width")}
                variant="subtle"
              >
                <IconArrowsHorizontal size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {VIDEO_WIDTH_PRESETS.map((width) => (
                <Menu.Item
                  key={width}
                  onClick={() => setWidth(width)}
                  fw={String(editorState?.width) === `${width}%` ? 700 : 400}
                >
                  {width}%
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          <Tooltip position="top" label={t("Caption")} withinPortal={false}>
            <ActionIcon
              onClick={openCaption}
              size="lg"
              aria-label={t("Caption")}
              variant="subtle"
            >
              <IconTextCaption size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip
            position="top"
            label={videoReplacing ? "Replacing video…" : "Replace video"}
            withinPortal={false}
          >
            <ActionIcon
              onClick={() => replaceInputRef.current?.click()}
              size="lg"
              aria-label="Replace video"
              variant="subtle"
              loading={videoReplacing}
            >
              <IconRefresh size={18} />
            </ActionIcon>
          </Tooltip>

          <Menu
            withinPortal={false}
            position="bottom-start"
            shadow="md"
            width={190}
          >
            <Menu.Target>
              <Tooltip
                position="top"
                label={
                  thumbnailUploading
                    ? t("Uploading thumbnail…")
                    : t("Thumbnail")
                }
                withinPortal={false}
              >
                <ActionIcon
                  size="lg"
                  aria-label={t("Thumbnail")}
                  variant="subtle"
                  loading={thumbnailUploading}
                >
                  <IconPhotoEdit size={18} />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => thumbnailInputRef.current?.click()}>
                Change thumbnail
              </Menu.Item>
              <Menu.Item
                color="red"
                onClick={() =>
                  editor
                    .chain()
                    .focus(undefined, { scrollIntoView: false })
                    .updateAttributes("video", {
                      poster: "",
                      posterAttachmentId: null,
                    })
                    .run()
                }
              >
                Remove thumbnail
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Menu
            withinPortal={false}
            position="bottom-start"
            shadow="md"
            width={240}
          >
            <Menu.Target>
              <Tooltip
                position="top"
                label={
                  captionsGenerating ? t("Generating captions…") : t("Captions")
                }
                withinPortal={false}
              >
                <ActionIcon
                  size="lg"
                  aria-label={t("Captions")}
                  variant="subtle"
                  loading={captionsGenerating}
                >
                  <IconSubtitles size={18} />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                disabled={!editorState?.attachmentId}
                onClick={() => void generateCaptions()}
              >
                Generate captions…
              </Menu.Item>
              {editorState?.captions.length ? <Menu.Divider /> : null}
              {editorState?.captions.map(
                (track: { key: string; label?: string; language?: string }) => (
                  <Menu.Item
                    key={track.key}
                    color="red"
                    onClick={() =>
                      editor
                        .chain()
                        .focus(undefined, { scrollIntoView: false })
                        .updateAttributes("video", {
                          captions: editorState.captions.filter(
                            (candidate: { key?: string }) =>
                              candidate.key !== track.key,
                          ),
                        })
                        .run()
                    }
                  >
                    Remove {track.label || track.language || "caption track"}
                  </Menu.Item>
                ),
              )}
            </Menu.Dropdown>
          </Menu>

          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              void uploadThumbnail(event.currentTarget.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
          <input
            ref={replaceInputRef}
            type="file"
            accept="video/*"
            hidden
            onChange={(event) => {
              void replaceVideo(event.currentTarget.files?.[0]);
              event.currentTarget.value = "";
            }}
          />

          <div className={classes.divider} />

          {altTextButton}

          <div className={classes.divider} />

          <Tooltip position="top" label={t("Download")} withinPortal={false}>
            <ActionIcon
              onClick={handleDownload}
              size="lg"
              aria-label={t("Download")}
              variant="subtle"
            >
              <IconDownload size={18} />
            </ActionIcon>
          </Tooltip>

          {!portfolioMode && (
            <Tooltip position="top" label={t("Delete")} withinPortal={false}>
              <ActionIcon
                onClick={handleDelete}
                size="lg"
                aria-label={t("Delete")}
                variant="subtle"
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          )}
          {portfolioMode && (
            <>
              <div className={classes.divider} />
              <PortfolioElementActions editor={editor} />
            </>
          )}
        </div>
      )}
    </BaseBubbleMenu>
  );
}

export default VideoMenu;
