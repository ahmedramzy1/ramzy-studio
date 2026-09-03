import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react/menus";
import { findParentNode, posToDOMRect, useEditorState } from "@tiptap/react";
import React, { useCallback, useRef } from "react";
import { Node as PMNode } from "@tiptap/pm/model";
import { isEditorReady } from "@docmost/editor-ext";
import {
  EditorMenuProps,
  ShouldShowProps,
} from "@/features/editor/components/table/types/types.ts";
import { ActionIcon, Button, Menu, Tooltip } from "@mantine/core";
import clsx from "clsx";
import {
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconDownload,
  IconExternalLink,
  IconLink,
  IconArrowsHorizontal,
  IconRefresh,
  IconTextCaption,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getFileUrl } from "@/lib/config.ts";
import { uploadImageAction } from "@/features/editor/components/image/upload-image-action.tsx";
import { useAltTextControl } from "@/features/editor/components/common/use-alt-text-control.tsx";
import classes from "../common/toolbar-menu.module.css";
import {
  hasPortfolioElementMenu,
  PortfolioElementActions,
} from "@/features/editor/portfolio/portfolio-element-menu";

export function ImageMenu({ editor }: EditorMenuProps) {
  const { t } = useTranslation();
  const portfolioMode = hasPortfolioElementMenu(editor);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return null;
      }

      const imageAttrs = ctx.editor.getAttributes("image");

      return {
        isImage: ctx.editor.isActive("image"),
        isAlignLeft: ctx.editor.isActive("image", { align: "left" }),
        isAlignCenter: ctx.editor.isActive("image", { align: "center" }),
        isAlignRight: ctx.editor.isActive("image", { align: "right" }),
        src: imageAttrs?.src || null,
        alt: imageAttrs?.alt || "",
        width: imageAttrs?.width ?? null,
        caption: imageAttrs?.caption || "",
        link: imageAttrs?.link || "",
        fit: imageAttrs?.fit === "cover" ? "cover" : "contain",
      };
    },
  });

  const shouldShow = useCallback(
    ({ state }: ShouldShowProps) => {
      if (!state) {
        return false;
      }

      return editor.isActive("image") && editor.getAttributes("image").src;
    },
    [editor],
  );

  const getReferencedVirtualElement = useCallback(() => {
    if (!isEditorReady(editor)) return;
    const { selection } = editor.state;
    const predicate = (node: PMNode) => node.type.name === "image";
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

  const alignImageLeft = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageAlign("left")
      .run();
  }, [editor]);

  const alignImageCenter = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageAlign("center")
      .run();
  }, [editor]);

  const alignImageRight = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageAlign("right")
      .run();
  }, [editor]);

  const handleDownload = useCallback(() => {
    if (!editorState?.src) return;
    const url = getFileUrl(editorState.src);
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.click();
  }, [editorState]);

  const handleReplace = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // @ts-ignore
      const pageId = editor.storage?.pageId;
      if (pageId) {
        const pos = editor.state.selection.from;
        uploadImageAction(file, editor, pos, pageId);
      }
      // Reset so the same file can be selected again
      e.target.value = "";
    },
    [editor],
  );

  const handleDelete = useCallback(() => {
    editor.commands.deleteSelection();
  }, [editor]);

  const resetImageWidth = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .updateAttributes("image", { width: "100%", height: null })
      .run();
  }, [editor]);

  const {
    button: altTextButton,
    panel: altTextPanel,
    isEditing: isEditingAlt,
  } = useAltTextControl({
    editor,
    nodeName: "image",
    currentAlt: editorState?.alt || "",
  });

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`image-menu`}
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
      ) : (
        <div className={classes.toolbar}>
          <Tooltip position="top" label={t("Auto width")} withinPortal={false}>
            <ActionIcon
              onClick={resetImageWidth}
              size="lg"
              aria-label={t("Auto width")}
              variant="subtle"
              className={clsx({
                [classes.active]: editorState?.width === "100%",
              })}
            >
              <IconArrowsHorizontal size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip position="top" label={t("Align left")} withinPortal={false}>
            <ActionIcon
              onClick={alignImageLeft}
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
              onClick={alignImageCenter}
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
              onClick={alignImageRight}
              size="lg"
              aria-label={t("Align right")}
              variant="subtle"
              className={clsx({ [classes.active]: editorState?.isAlignRight })}
            >
              <IconLayoutAlignRight size={18} />
            </ActionIcon>
          </Tooltip>

          <div className={classes.divider} />

          <Tooltip position="top" label="Preview image" withinPortal={false}>
            <ActionIcon
              onClick={() =>
                editorState?.src &&
                window.open(
                  getFileUrl(editorState.src),
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              size="lg"
              aria-label="Preview image"
              variant="subtle"
            >
              <IconExternalLink size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip position="top" label="Image link" withinPortal={false}>
            <ActionIcon
              onClick={() => {
                const link = window.prompt(
                  "Image link (leave blank to remove)",
                  editorState?.link || "",
                );
                if (link !== null)
                  editor
                    .chain()
                    .focus(undefined, { scrollIntoView: false })
                    .updateAttributes("image", { link: link.trim() })
                    .run();
              }}
              size="lg"
              aria-label="Image link"
              variant="subtle"
              className={editorState?.link ? classes.active : undefined}
            >
              <IconLink size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip position="top" label="Image caption" withinPortal={false}>
            <ActionIcon
              onClick={() => {
                const caption = window.prompt(
                  "Image caption (leave blank to remove)",
                  editorState?.caption || "",
                );
                if (caption !== null)
                  editor
                    .chain()
                    .focus(undefined, { scrollIntoView: false })
                    .updateAttributes("image", { caption: caption.trim() })
                    .run();
              }}
              size="lg"
              aria-label="Image caption"
              variant="subtle"
              className={editorState?.caption ? classes.active : undefined}
            >
              <IconTextCaption size={18} />
            </ActionIcon>
          </Tooltip>
          <Menu
            withinPortal={false}
            position="bottom-start"
            shadow="md"
            width={160}
          >
            <Menu.Target>
              <Button size="compact-sm" variant="subtle">
                {editorState?.fit === "cover" ? "Fill" : "Fit"}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                fw={editorState?.fit === "contain" ? 700 : 400}
                onClick={() =>
                  editor
                    .chain()
                    .focus(undefined, { scrollIntoView: false })
                    .updateAttributes("image", { fit: "contain" })
                    .run()
                }
              >
                Fit image
              </Menu.Item>
              <Menu.Item
                fw={editorState?.fit === "cover" ? 700 : 400}
                onClick={() =>
                  editor
                    .chain()
                    .focus(undefined, { scrollIntoView: false })
                    .updateAttributes("image", { fit: "cover" })
                    .run()
                }
              >
                Fill frame
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

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

          <Tooltip
            position="top"
            label={t("Replace image")}
            withinPortal={false}
          >
            <ActionIcon
              onClick={handleReplace}
              size="lg"
              aria-label={t("Replace image")}
              variant="subtle"
            >
              <IconRefresh size={18} />
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </BaseBubbleMenu>
  );
}

export default ImageMenu;
