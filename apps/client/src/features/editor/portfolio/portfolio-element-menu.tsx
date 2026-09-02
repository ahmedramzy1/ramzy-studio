import type { Editor } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import { NodeSelection } from "@tiptap/pm/state";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react/menus";
import { ActionIcon, Button, Menu, ScrollArea, Tooltip } from "@mantine/core";
import {
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconDownload,
  IconDots,
  IconEdit,
  IconExternalLink,
  IconFileTypePdf,
  IconPhotoEdit,
  IconPlayerSkipForward,
  IconPlus,
  IconRepeat,
  IconSubtitles,
  IconTrash,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "@/features/editor/components/common/toolbar-menu.module.css";
import { NodeSelector } from "@/features/editor/components/bubble-menu/node-selector";
import { TextAlignmentSelector } from "@/features/editor/components/bubble-menu/text-alignment-selector";
import { CopyButton } from "@/components/common/copy-button";

interface SectionChoice {
  position: number;
  end: number;
  title: string;
}

export interface PortfolioTopLevelBlock {
  position: number;
  node: PMNode;
  isSectionHeading: boolean;
}

export function hasPortfolioElementMenu(editor: Editor) {
  return editor.view.dom.classList.contains("ramzy-portfolio-editor");
}

const SPECIALIST_MENU_NODES = [
  "attachment",
  "audio",
  "callout",
  "codeBlock",
  "columns",
  "drawio",
  "excalidraw",
  "iframe",
  "image",
  "mediaPlaylist",
  "pdf",
  "photoAlbum",
  "photoGrid",
  "subpages",
  "table",
  "video",
  "youtube",
] as const;

const TEXT_BLOCK_NODES = new Set([
  "blockquote",
  "bulletList",
  "details",
  "heading",
  "orderedList",
  "paragraph",
  "taskList",
]);

const BLOCK_LABELS: Record<string, string> = {
  attachment: "File",
  audio: "Audio",
  blockquote: "Quote",
  codeBlock: "Code block",
  heading: "Heading",
  horizontalRule: "Divider",
  iframe: "Embed",
  mathBlock: "Equation",
  mediaPlaylist: "Playlist",
  pageBreak: "Page break",
  paragraph: "Text",
  photoAlbum: "Photo album",
  photoGrid: "Image grid",
  tabs: "Tabs",
  toggle: "Toggle",
  youtube: "YouTube",
};

export function getPortfolioTopLevelBlock(
  editor: Editor,
): PortfolioTopLevelBlock | null {
  const { selection, doc } = editor.state;
  const position =
    selection.$from.depth > 0 ? selection.$from.before(1) : selection.from;
  const node = doc.nodeAt(position);

  if (!node) return null;

  return {
    position,
    node,
    isSectionHeading: node.type.name === "heading" && node.attrs.level === 1,
  };
}

function getSections(editor: Editor): SectionChoice[] {
  const headings: Array<{ position: number; title: string }> = [];

  editor.state.doc.forEach((node, position) => {
    if (node.type.name === "heading" && node.attrs.level === 1) {
      headings.push({
        position,
        title: node.textContent.trim() || "Untitled section",
      });
    }
  });

  return headings.map((heading, index) => ({
    ...heading,
    end: headings[index + 1]?.position ?? editor.state.doc.content.size,
  }));
}

export function deletePortfolioTopLevelBlock(editor: Editor) {
  const control = getPortfolioTopLevelBlock(editor);
  if (!control) return false;
  const section = control.isSectionHeading
    ? getSections(editor).find(
        (candidate) => candidate.position === control.position,
      )
    : null;
  const tr = editor.state.tr.delete(
    control.position,
    section?.end ?? control.position + control.node.nodeSize,
  );
  if (tr.doc.childCount === 0) {
    tr.insert(0, editor.schema.nodes.paragraph.create());
  }
  editor.view.dispatch(tr);
  editor.commands.focus();
  return true;
}

export function movePortfolioBlockToSection(
  editor: Editor,
  section: SectionChoice,
) {
  const control = getPortfolioTopLevelBlock(editor);
  if (!control || control.isSectionHeading) return false;
  const originalSize = control.node.nodeSize;
  let target = section.end;
  const tr = editor.state.tr.delete(
    control.position,
    control.position + originalSize,
  );
  if (control.position < target) target -= originalSize;
  target = Math.max(0, Math.min(target, tr.doc.content.size));
  tr.insert(target, control.node);
  editor.view.dispatch(tr.scrollIntoView());
  editor.commands.focus();
  return true;
}

export function movePortfolioBlockToNewSection(editor: Editor, title: string) {
  const control = getPortfolioTopLevelBlock(editor);
  if (!control || control.isSectionHeading || !title.trim()) return false;
  const tr = editor.state.tr.delete(
    control.position,
    control.position + control.node.nodeSize,
  );
  const heading = editor.schema.nodes.heading.create(
    { level: 1 },
    editor.schema.text(title.trim()),
  );
  const end = tr.doc.content.size;
  tr.insert(end, heading);
  tr.insert(end + heading.nodeSize, control.node);
  editor.view.dispatch(tr.scrollIntoView());
  editor.commands.focus();
  return true;
}

function blockLabel(node: PMNode) {
  if (node.type.name === "heading" && typeof node.attrs.level === "number") {
    return `Heading ${node.attrs.level}`;
  }
  if (node.type.name === "mediaPlaylist") {
    return node.attrs.kind === "audio" ? "Audio playlist" : "Video playlist";
  }
  return BLOCK_LABELS[node.type.name] || "Element";
}

export function updatePortfolioTopLevelBlockAttributes(
  editor: Editor,
  attributes: Record<string, unknown>,
) {
  const control = getPortfolioTopLevelBlock(editor);
  if (!control) return false;
  const tr = editor.state.tr.setNodeMarkup(control.position, undefined, {
    ...control.node.attrs,
    ...attributes,
  });
  editor.view.dispatch(tr);
  return true;
}

export function triggerPortfolioElementAction(editor: Editor, action: string) {
  const control = getPortfolioTopLevelBlock(editor);
  if (!control) return false;
  const dom = editor.view.nodeDOM(control.position);
  if (!(dom instanceof HTMLElement)) return false;
  const actionElement = dom.querySelector<HTMLElement>(
    `[data-ramzy-element-action="${action}"]`,
  );
  if (!actionElement) return false;
  actionElement.click();
  return true;
}

export function PortfolioElementActions({ editor }: { editor: Editor }) {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const [view, setView] = useState<"root" | "sections">("root");

  const elementState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      const block = getPortfolioTopLevelBlock(currentEditor);
      return block
        ? {
            position: block.position,
            isSectionHeading: block.isSectionHeading,
            sections: getSections(currentEditor),
          }
        : null;
    },
  });

  if (!hasPortfolioElementMenu(editor) || !elementState) return null;

  function close() {
    setOpened(false);
    setView("root");
  }

  function deleteBlock() {
    if (deletePortfolioTopLevelBlock(editor)) close();
  }

  function moveToExistingSection(section: SectionChoice) {
    if (movePortfolioBlockToSection(editor, section)) close();
  }

  function moveToNewSection() {
    const title = window.prompt("Name the new section", "New section")?.trim();
    if (!title) return;
    if (movePortfolioBlockToNewSection(editor, title)) close();
  }

  return (
    <Menu
      opened={opened}
      onChange={(nextOpened) => {
        setOpened(nextOpened);
        if (!nextOpened) setView("root");
      }}
      closeOnItemClick={false}
      withinPortal={false}
      position="bottom-end"
      shadow="md"
      width={230}
    >
      <Menu.Target>
        <Tooltip
          position="top"
          label={t("Element actions")}
          withinPortal={false}
        >
          <ActionIcon
            size="lg"
            variant="subtle"
            aria-label={t("Element actions")}
            onMouseDown={(event) => event.preventDefault()}
          >
            <IconDots size={18} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown data-ramzy-block-menu>
        {view === "root" ? (
          <>
            {!elementState.isSectionHeading && (
              <Menu.Item
                leftSection={<IconArrowRight size={16} />}
                rightSection={<span aria-hidden>›</span>}
                onClick={() => setView("sections")}
              >
                {t("Move to section")}
              </Menu.Item>
            )}
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={deleteBlock}
            >
              {t("Delete")}
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item
              leftSection={<span aria-hidden>‹</span>}
              onClick={() => setView("root")}
            >
              <strong>{t("Move to section")}</strong>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconPlus size={16} />}
              onClick={moveToNewSection}
            >
              {t("New section…")}
            </Menu.Item>
            {elementState.sections.map((section) => (
              <Menu.Item
                key={`${section.position}-${section.title}`}
                leftSection={<span aria-hidden>§</span>}
                onClick={() => moveToExistingSection(section)}
              >
                {section.title}
              </Menu.Item>
            ))}
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

export function PortfolioGenericElementMenu({ editor }: { editor: Editor }) {
  const [nodeSelectorOpen, setNodeSelectorOpen] = useState(false);
  const [alignmentOpen, setAlignmentOpen] = useState(false);
  const shouldShow = useCallback(
    ({ state }: { state: Editor["state"] }) => {
      if (!hasPortfolioElementMenu(editor) || !editor.isEditable) return false;
      if (
        !state.selection.empty &&
        !(state.selection instanceof NodeSelection)
      ) {
        return false;
      }
      if (SPECIALIST_MENU_NODES.some((name) => editor.isActive(name))) {
        return false;
      }
      return Boolean(getPortfolioTopLevelBlock(editor));
    },
    [editor],
  );

  const getReferencedVirtualElement = useCallback(() => {
    const control = getPortfolioTopLevelBlock(editor);
    if (!control) return;
    const dom = editor.view.nodeDOM(control.position);
    if (!(dom instanceof HTMLElement)) return;
    const rect = dom.getBoundingClientRect();
    return {
      getBoundingClientRect: () => rect,
      getClientRects: () => [rect],
    };
  }, [editor]);

  const current = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      const block = getPortfolioTopLevelBlock(currentEditor);
      return block
        ? {
            label: blockLabel(block.node),
            supportsTextTools: TEXT_BLOCK_NODES.has(block.node.type.name),
          }
        : null;
    },
  });

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey="portfolio-generic-element-menu"
      updateDelay={0}
      getReferencedVirtualElement={getReferencedVirtualElement}
      options={{ placement: "bottom", offset: 8 }}
      shouldShow={shouldShow}
      style={{ zIndex: 200, position: "relative" }}
    >
      <div className={classes.toolbar} data-ramzy-element-toolbar>
        {current?.supportsTextTools ? (
          <>
            <NodeSelector
              editor={editor}
              isOpen={nodeSelectorOpen}
              setIsOpen={(nextOpen) => {
                const open =
                  typeof nextOpen === "function"
                    ? nextOpen(nodeSelectorOpen)
                    : nextOpen;
                setNodeSelectorOpen(open);
                if (open) setAlignmentOpen(false);
              }}
            />
            <TextAlignmentSelector
              editor={editor}
              isOpen={alignmentOpen}
              setIsOpen={(nextOpen) => {
                const open =
                  typeof nextOpen === "function"
                    ? nextOpen(alignmentOpen)
                    : nextOpen;
                setAlignmentOpen(open);
                if (open) setNodeSelectorOpen(false);
              }}
            />
          </>
        ) : (
          <span className={classes.elementLabel}>
            {current?.label || "Element"}
          </span>
        )}
        <div className={classes.divider} />
        <PortfolioElementActions editor={editor} />
      </div>
    </BaseBubbleMenu>
  );
}

export function PortfolioCustomElementMenu({ editor }: { editor: Editor }) {
  const shouldShow = useCallback(
    ({ state }: { state: Editor["state"] }) => {
      if (!hasPortfolioElementMenu(editor) || !editor.isEditable) return false;
      if (
        !state.selection.empty &&
        !(state.selection instanceof NodeSelection)
      ) {
        return false;
      }
      return (
        editor.isActive("attachment") ||
        editor.isActive("codeBlock") ||
        editor.isActive("iframe") ||
        editor.isActive("mediaPlaylist") ||
        editor.isActive("photoGrid") ||
        editor.isActive("photoAlbum") ||
        editor.isActive("youtube")
      );
    },
    [editor],
  );

  const getReferencedVirtualElement = useCallback(() => {
    const control = getPortfolioTopLevelBlock(editor);
    if (!control) return;
    const dom = editor.view.nodeDOM(control.position);
    if (!(dom instanceof HTMLElement)) return;
    const rect = dom.getBoundingClientRect();
    return {
      getBoundingClientRect: () => rect,
      getClientRects: () => [rect],
    };
  }, [editor]);

  const current = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      const block = getPortfolioTopLevelBlock(currentEditor);
      if (!block) return null;
      if (block.node.type.name === "attachment") {
        const name = String(block.node.attrs.name || "");
        const mime = String(block.node.attrs.mime || "");
        return {
          type: "attachment" as const,
          canEmbedAsPdf:
            mime === "application/pdf" || name.toLowerCase().endsWith(".pdf"),
          canDownload: Boolean(block.node.attrs.url),
        };
      }
      if (block.node.type.name === "codeBlock") {
        return {
          type: "code" as const,
          language: String(block.node.attrs.language || ""),
          text: block.node.textContent,
        };
      }
      if (block.node.type.name === "iframe") {
        return {
          type: "embed" as const,
          hasSource: Boolean(block.node.attrs.src),
        };
      }
      if (block.node.type.name === "youtube") {
        return {
          type: "youtube" as const,
          source: String(block.node.attrs.src || ""),
        };
      }
      if (block.node.type.name === "mediaPlaylist") {
        const items = Array.isArray(block.node.attrs.items)
          ? block.node.attrs.items
          : [];
        const activeKey = block.node.attrs.activeKey || items[0]?.key;
        const active = items.find(
          (item: { key?: string }) => item.key === activeKey,
        );
        return {
          type: "playlist" as const,
          kind: block.node.attrs.kind === "audio" ? "audio" : "video",
          hasActive: Boolean(active),
          activeHasAttachment: Boolean(active?.attachmentId),
          autoplay: Boolean(block.node.attrs.autoplay),
          loop: Boolean(block.node.attrs.loop),
        };
      }
      if (
        block.node.type.name === "photoGrid" ||
        block.node.type.name === "photoAlbum"
      ) {
        return {
          type: "photos" as const,
          kind: block.node.type.name === "photoAlbum" ? "album" : "grid",
        };
      }
      return null;
    },
  });

  const codeBlockExtension = editor.extensionManager.extensions.find(
    (extension) => extension.name === "codeBlock",
  );
  const codeLanguages = (
    codeBlockExtension?.options as {
      lowlight?: { listLanguages?: () => string[] };
    }
  )?.lowlight?.listLanguages?.() ?? [
    "css",
    "html",
    "javascript",
    "json",
    "markdown",
    "typescript",
  ];

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey="portfolio-collection-element-menu"
      updateDelay={0}
      getReferencedVirtualElement={getReferencedVirtualElement}
      options={{ placement: "bottom", offset: 8 }}
      shouldShow={shouldShow}
      style={{ zIndex: 200, position: "relative" }}
    >
      <div className={classes.toolbar} data-ramzy-element-toolbar>
        {current?.type === "youtube" ? (
          <>
            <Tooltip label="Edit YouTube link" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Edit YouTube link"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  const source = window
                    .prompt("Edit YouTube link", current.source)
                    ?.trim();
                  if (source) {
                    updatePortfolioTopLevelBlockAttributes(editor, {
                      src: source,
                    });
                  }
                }}
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Open on YouTube" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Open on YouTube"
                disabled={!current.source}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  window.open(current.source, "_blank", "noopener,noreferrer")
                }
              >
                <IconExternalLink size={18} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : current?.type === "embed" ? (
          <>
            <Tooltip label="Edit embed link" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Edit embed link"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "edit-embed")
                }
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Open original" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Open original"
                disabled={!current.hasSource}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "open-embed")
                }
              >
                <IconExternalLink size={18} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : current?.type === "code" ? (
          <>
            <Menu
              withinPortal={false}
              position="bottom-start"
              shadow="md"
              width={220}
            >
              <Menu.Target>
                <Button
                  size="compact-sm"
                  variant="subtle"
                  rightSection={<IconChevronDown size={14} />}
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {current.language || "Auto-detect"}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <ScrollArea.Autosize mah={320} type="scroll">
                  <Menu.Item
                    rightSection={
                      !current.language ? <IconCheck size={14} /> : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, {
                        language: null,
                      })
                    }
                  >
                    Auto-detect
                  </Menu.Item>
                  {codeLanguages.map((language) => (
                    <Menu.Item
                      key={language}
                      rightSection={
                        current.language === language ? (
                          <IconCheck size={14} />
                        ) : null
                      }
                      onClick={() =>
                        updatePortfolioTopLevelBlockAttributes(editor, {
                          language,
                        })
                      }
                    >
                      {language}
                    </Menu.Item>
                  ))}
                </ScrollArea.Autosize>
              </Menu.Dropdown>
            </Menu>
            <CopyButton value={current.text} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy code"} position="top">
                  <ActionIcon
                    size="lg"
                    variant="subtle"
                    color={copied ? "teal" : undefined}
                    aria-label="Copy code"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={copy}
                  >
                    {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </>
        ) : current?.type === "attachment" ? (
          <>
            {current.canEmbedAsPdf && (
              <Tooltip label="Embed as PDF" position="top">
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  aria-label="Embed as PDF"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() =>
                    triggerPortfolioElementAction(editor, "embed-as-pdf")
                  }
                >
                  <IconFileTypePdf size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            <Tooltip label="Download file" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Download file"
                disabled={!current.canDownload}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "download-file")
                }
              >
                <IconDownload size={18} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : current?.type === "playlist" ? (
          <>
            <Button
              size="compact-sm"
              variant="subtle"
              leftSection={<IconPlus size={16} />}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => triggerPortfolioElementAction(editor, "add-media")}
            >
              {current.kind === "video" ? "Add videos" : "Add tracks"}
            </Button>
            {current.kind === "video" && current.hasActive && (
              <>
                <Tooltip label="Change thumbnail" position="top">
                  <ActionIcon
                    size="lg"
                    variant="subtle"
                    aria-label="Change thumbnail"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                      triggerPortfolioElementAction(editor, "change-thumbnail")
                    }
                  >
                    <IconPhotoEdit size={18} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Generate captions" position="top">
                  <ActionIcon
                    size="lg"
                    variant="subtle"
                    aria-label="Generate captions"
                    disabled={!current.activeHasAttachment}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                      triggerPortfolioElementAction(editor, "generate-captions")
                    }
                  >
                    <IconSubtitles size={18} />
                  </ActionIcon>
                </Tooltip>
              </>
            )}
            <Tooltip label="Autoplay next" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Autoplay next"
                className={current.autoplay ? classes.active : undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  updatePortfolioTopLevelBlockAttributes(editor, {
                    autoplay: !current.autoplay,
                  })
                }
              >
                <IconPlayerSkipForward size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Loop playlist" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Loop playlist"
                className={current.loop ? classes.active : undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  updatePortfolioTopLevelBlockAttributes(editor, {
                    loop: !current.loop,
                  })
                }
              >
                <IconRepeat size={18} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : current?.type === "photos" ? (
          <Button
            size="compact-sm"
            variant="subtle"
            leftSection={<IconPlus size={16} />}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => triggerPortfolioElementAction(editor, "add-photos")}
          >
            Add photos
          </Button>
        ) : null}
        <div className={classes.divider} />
        <PortfolioElementActions editor={editor} />
      </div>
    </BaseBubbleMenu>
  );
}
