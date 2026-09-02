import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react/menus";
import { findParentNode, posToDOMRect, useEditorState } from "@tiptap/react";
import { useCallback, useRef, useState } from "react";
import { Node as PMNode } from "@tiptap/pm/model";
import { isEditorReady } from "@docmost/editor-ext";
import {
  EditorMenuProps,
  ShouldShowProps,
} from "@/features/editor/components/table/types/types.ts";
import { ActionIcon, Button, Menu, Tooltip } from "@mantine/core";
import {
  IconCheck,
  IconDownload,
  IconEdit,
  IconExternalLink,
  IconPaperclip,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import classes from "../common/toolbar-menu.module.css";
import {
  hasPortfolioElementMenu,
  PortfolioElementActions,
  updatePortfolioTopLevelBlockAttributes,
} from "@/features/editor/portfolio/portfolio-element-menu";
import { getFileUrl } from "@/lib/config";
import { uploadFile } from "@/features/page/services/page-service";

export function PdfMenu({ editor }: EditorMenuProps) {
  const { t } = useTranslation();
  const portfolioMode = hasPortfolioElementMenu(editor);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return null;
      }

      const pdfAttrs = ctx.editor.getAttributes("pdf");

      return {
        isPdf: ctx.editor.isActive("pdf"),
        src: pdfAttrs?.src || null,
        name: pdfAttrs?.name || null,
        attachmentId: pdfAttrs?.attachmentId || null,
        width: Number(pdfAttrs?.width || 800),
        height: Number(pdfAttrs?.height || 600),
      };
    },
  });

  const shouldShow = useCallback(
    ({ state }: ShouldShowProps) => {
      if (!state || !isEditorReady(editor)) return false;
      if (!editor.isActive("pdf")) return false;

      const { selection } = state;
      const dom = editor.view.nodeDOM(selection.from) as HTMLElement | null;
      if (!dom) return false;

      return portfolioMode || !!dom.querySelector("[data-pdf-error]");
    },
    [editor, portfolioMode],
  );

  const getReferencedVirtualElement = useCallback(() => {
    if (!isEditorReady(editor)) return;
    const { selection } = editor.state;
    const predicate = (node: PMNode) => node.type.name === "pdf";
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

  const handleConvertToAttachment = useCallback(() => {
    if (!editorState?.src) return;

    const { selection } = editor.state;
    const { from } = selection;
    const node = editor.state.doc.nodeAt(from);
    if (!node || node.type.name !== "pdf") return;

    editor
      .chain()
      .insertContentAt(
        { from, to: from + node.nodeSize },
        {
          type: "attachment",
          attrs: {
            url: node.attrs.src,
            name: node.attrs.name,
            attachmentId: node.attrs.attachmentId,
            size: node.attrs.size,
            mime: "application/pdf",
          },
        },
      )
      .run();
  }, [editor, editorState]);

  const handleDelete = useCallback(() => {
    editor.commands.deleteSelection();
  }, [editor]);

  const handleOpen = () => {
    if (editorState?.src) {
      window.open(getFileUrl(editorState.src), "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = () => {
    if (!editorState?.src) return;
    const anchor = document.createElement("a");
    anchor.href = getFileUrl(editorState.src);
    anchor.download = editorState.name || "document.pdf";
    anchor.click();
  };

  const handleRename = () => {
    const name = window
      .prompt("Rename PDF", editorState?.name || "document.pdf")
      ?.trim();
    if (name) updatePortfolioTopLevelBlockAttributes(editor, { name });
  };

  const handleReplace = async (file?: File) => {
    if (!file || file.type !== "application/pdf" || uploading) return;
    // @ts-ignore portfolio editor storage owns the canonical linked page id.
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId) return;
    setUploading(true);
    try {
      const attachment = await uploadFile(file, pageId);
      updatePortfolioTopLevelBlockAttributes(editor, {
        src: `/api/files/${attachment.id}/${attachment.fileName}`,
        name: file.name,
        attachmentId: attachment.id,
        size: file.size,
        placeholder: null,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`pdf-menu`}
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
        <Tooltip position="top" label="Open PDF" withinPortal={false}>
          <ActionIcon
            onClick={handleOpen}
            disabled={!editorState?.src}
            size="lg"
            aria-label="Open PDF"
            variant="subtle"
          >
            <IconExternalLink size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip position="top" label="Download PDF" withinPortal={false}>
          <ActionIcon
            onClick={handleDownload}
            disabled={!editorState?.src}
            size="lg"
            aria-label="Download PDF"
            variant="subtle"
          >
            <IconDownload size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip position="top" label="Rename PDF" withinPortal={false}>
          <ActionIcon
            onClick={handleRename}
            size="lg"
            aria-label="Rename PDF"
            variant="subtle"
          >
            <IconEdit size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip position="top" label="Replace PDF" withinPortal={false}>
          <ActionIcon
            onClick={() => replaceInputRef.current?.click()}
            loading={uploading}
            size="lg"
            aria-label="Replace PDF"
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
            <Button size="compact-sm" variant="subtle">
              {editorState?.width || 800}px
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>PDF size</Menu.Label>
            {[480, 800, 1200].map((width) => (
              <Menu.Item
                key={width}
                rightSection={
                  editorState?.width === width ? <IconCheck size={14} /> : null
                }
                onClick={() =>
                  updatePortfolioTopLevelBlockAttributes(editor, {
                    width,
                    height: Math.round(width * 0.75),
                  })
                }
              >
                {width === 480
                  ? "Compact"
                  : width === 800
                    ? "Standard"
                    : "Wide"}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        <Tooltip
          position="top"
          label={t("Convert to attachment")}
          withinPortal={false}
        >
          <ActionIcon
            onClick={handleConvertToAttachment}
            size="lg"
            aria-label={t("Convert to attachment")}
            variant="subtle"
          >
            <IconPaperclip size={18} />
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
          accept="application/pdf,.pdf"
          hidden
          onChange={(event) => {
            void handleReplace(event.currentTarget.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
      </div>
    </BaseBubbleMenu>
  );
}

export default PdfMenu;
