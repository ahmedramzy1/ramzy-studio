import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react/menus";
import { findParentNode, posToDOMRect, useEditorState } from "@tiptap/react";
import { useCallback, useRef, useState } from "react";
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
  Modal,
  Stack,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconDownload,
  IconEdit,
  IconPhotoEdit,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getFileUrl } from "@/lib/config.ts";
import classes from "../common/toolbar-menu.module.css";
import {
  hasPortfolioElementMenu,
  PortfolioElementActions,
  updatePortfolioTopLevelBlockAttributes,
} from "@/features/editor/portfolio/portfolio-element-menu";
import { ingestAudioFile } from "@/features/editor/components/media/media-ingest";
import { uploadFile } from "@/features/page/services/page-service";
import { isAudioFile } from "@/features/editor/components/media/media-file-utils";

export function AudioMenu({ editor }: EditorMenuProps) {
  const { t } = useTranslation();
  const portfolioMode = hasPortfolioElementMenu(editor);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const [details, setDetails] = useState({
    title: "",
    artist: "",
    album: "",
    description: "",
  });

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return null;
      }

      const audioAttrs = ctx.editor.getAttributes("audio");

      return {
        isAudio: ctx.editor.isActive("audio"),
        src: audioAttrs?.src || null,
        title: audioAttrs?.title || "",
        artist: audioAttrs?.artist || "",
        album: audioAttrs?.album || "",
        description: audioAttrs?.description || "",
        artwork: audioAttrs?.artwork || "",
      };
    },
  });

  const shouldShow = useCallback(
    ({ state }: ShouldShowProps) => {
      if (!state) {
        return false;
      }

      return editor.isActive("audio") && editor.getAttributes("audio").src;
    },
    [editor],
  );

  const getReferencedVirtualElement = useCallback(() => {
    if (!isEditorReady(editor)) return;
    const { selection } = editor.state;
    const predicate = (node: PMNode) => node.type.name === "audio";
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

  const openDetails = () => {
    setDetails({
      title: editorState?.title || "",
      artist: editorState?.artist || "",
      album: editorState?.album || "",
      description: editorState?.description || "",
    });
    setDetailsOpen(true);
  };

  const saveDetails = () => {
    updatePortfolioTopLevelBlockAttributes(editor, details);
    setDetailsOpen(false);
  };

  const replaceAudio = async (file?: File) => {
    if (!file || !isAudioFile(file) || working) return;
    // @ts-ignore portfolio editor storage owns the canonical linked page id.
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId) return;
    setWorking(true);
    try {
      const item = await ingestAudioFile(file, pageId);
      updatePortfolioTopLevelBlockAttributes(editor, {
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
      setWorking(false);
    }
  };

  const replaceArtwork = async (file?: File) => {
    if (!file?.type.startsWith("image/") || working) return;
    // @ts-ignore portfolio editor storage owns the canonical linked page id.
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId) return;
    setWorking(true);
    try {
      const attachment = await uploadFile(file, pageId);
      updatePortfolioTopLevelBlockAttributes(editor, {
        artwork: `/api/files/${attachment.id}/${attachment.fileName}`,
        artworkAttachmentId: attachment.id,
        artworkSource: "custom",
      });
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      <BaseBubbleMenu
        editor={editor}
        pluginKey={`audio-menu`}
        updateDelay={0}
        getReferencedVirtualElement={getReferencedVirtualElement}
        options={{
          placement: portfolioMode ? "bottom" : "top",
          offset: 8,
          flip: false,
        }}
        shouldShow={shouldShow}
      >
        <div className={classes.toolbar}>
          <Tooltip
            position="top"
            label="Edit audio details"
            withinPortal={false}
          >
            <ActionIcon
              onClick={openDetails}
              size="lg"
              aria-label="Edit audio details"
              variant="subtle"
            >
              <IconEdit size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip position="top" label="Replace audio" withinPortal={false}>
            <ActionIcon
              onClick={() => replaceInputRef.current?.click()}
              loading={working}
              size="lg"
              aria-label="Replace audio"
              variant="subtle"
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
              <Tooltip position="top" label="Artwork" withinPortal={false}>
                <ActionIcon
                  size="lg"
                  aria-label="Audio artwork"
                  variant="subtle"
                >
                  <IconPhotoEdit size={18} />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => artworkInputRef.current?.click()}>
                Change artwork
              </Menu.Item>
              <Menu.Item
                color="red"
                disabled={!editorState?.artwork}
                onClick={() =>
                  updatePortfolioTopLevelBlockAttributes(editor, {
                    artwork: "",
                    artworkAttachmentId: null,
                    artworkSource: "",
                  })
                }
              >
                Remove artwork
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
          <input
            ref={replaceInputRef}
            type="file"
            accept="audio/*"
            hidden
            onChange={(event) => {
              void replaceAudio(event.currentTarget.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
          <input
            ref={artworkInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              void replaceArtwork(event.currentTarget.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
        </div>
      </BaseBubbleMenu>
      <Modal
        opened={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Edit audio details"
        centered
        size="md"
      >
        <Stack gap="sm">
          <TextInput
            label="Title"
            value={details.title}
            onChange={(event) =>
              setDetails((current) => ({
                ...current,
                title: event.currentTarget.value,
              }))
            }
          />
          <TextInput
            label="Artist"
            value={details.artist}
            onChange={(event) =>
              setDetails((current) => ({
                ...current,
                artist: event.currentTarget.value,
              }))
            }
          />
          <TextInput
            label="Album"
            value={details.album}
            onChange={(event) =>
              setDetails((current) => ({
                ...current,
                album: event.currentTarget.value,
              }))
            }
          />
          <Textarea
            label="Description"
            minRows={3}
            value={details.description}
            onChange={(event) =>
              setDetails((current) => ({
                ...current,
                description: event.currentTarget.value,
              }))
            }
          />
          <Group justify="flex-end" gap="xs">
            <Button variant="default" onClick={() => setDetailsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveDetails}>Save details</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default AudioMenu;
