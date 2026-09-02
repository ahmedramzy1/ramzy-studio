import type { Editor } from "@tiptap/core";
import { Fragment, Node as PMNode } from "@tiptap/pm/model";
import { NodeSelection } from "@tiptap/pm/state";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react/menus";
import { ActionIcon, Button, Menu, ScrollArea, Tooltip } from "@mantine/core";
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconArrowsShuffle,
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconCheck,
  IconChevronDown,
  IconClipboard,
  IconCopy,
  IconCut,
  IconDownload,
  IconDots,
  IconEdit,
  IconExternalLink,
  IconFileTypePdf,
  IconLink,
  IconLinkOff,
  IconListDetails,
  IconListNumbers,
  IconPlayerSkipForward,
  IconPlus,
  IconRefresh,
  IconRepeat,
  IconTrash,
  IconTextWrap,
  IconArrowsMinimize,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "@/features/editor/components/common/toolbar-menu.module.css";
import { NodeSelector } from "@/features/editor/components/bubble-menu/node-selector";
import { TextAlignmentSelector } from "@/features/editor/components/bubble-menu/text-alignment-selector";
import { CopyButton } from "@/components/common/copy-button";
import { getFileUrl } from "@/lib/config";

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
  "base",
  "callout",
  "codeBlock",
  "columns",
  "drawio",
  "excalidraw",
  "embed",
  "image",
  "mediaPlaylist",
  "pdf",
  "photoAlbum",
  "photoGrid",
  "subpages",
  "table",
  "tabs",
  "transclusionReference",
  "transclusionSource",
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
  base: "Database",
  blockquote: "Quote",
  codeBlock: "Code block",
  heading: "Heading",
  horizontalRule: "Divider",
  embed: "Embed",
  mathBlock: "Equation",
  mediaPlaylist: "Playlist",
  pageBreak: "Page break",
  paragraph: "Text",
  photoAlbum: "Photo album",
  photoGrid: "Image grid",
  tabs: "Tabs",
  transclusionReference: "Synced block",
  transclusionSource: "Synced block source",
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

interface PortfolioBlockRange extends PortfolioTopLevelBlock {
  end: number;
}

function getPortfolioTopLevelBlockRange(
  editor: Editor,
): PortfolioBlockRange | null {
  const control = getPortfolioTopLevelBlock(editor);
  if (!control) return null;
  const section = control.isSectionHeading
    ? getSections(editor).find(
        (candidate) => candidate.position === control.position,
      )
    : null;

  return {
    ...control,
    end: section?.end ?? control.position + control.node.nodeSize,
  };
}

function cloneNodeWithoutId(node: PMNode): PMNode {
  if (node.isText) {
    return node.type.schema.text(node.text || "", node.marks);
  }
  const attrs = { ...node.attrs };
  if (Object.prototype.hasOwnProperty.call(attrs, "id")) attrs.id = null;
  const children: PMNode[] = [];
  node.content.forEach((child) => children.push(cloneNodeWithoutId(child)));
  return node.type.create(
    attrs,
    children.length ? Fragment.fromArray(children) : undefined,
    node.marks,
  );
}

export function duplicatePortfolioTopLevelBlock(editor: Editor) {
  const range = getPortfolioTopLevelBlockRange(editor);
  if (!range) return false;
  const copies: PMNode[] = [];
  editor.state.doc.forEach((node, position) => {
    if (position >= range.position && position < range.end) {
      copies.push(cloneNodeWithoutId(node));
    }
  });
  if (!copies.length) return false;
  editor.view.dispatch(
    editor.state.tr
      .insert(range.end, Fragment.fromArray(copies))
      .scrollIntoView(),
  );
  editor.commands.focus();
  return true;
}

export function movePortfolioTopLevelBlock(
  editor: Editor,
  direction: "up" | "down",
) {
  const range = getPortfolioTopLevelBlockRange(editor);
  if (!range) return false;
  const nodes: Array<{ node: PMNode; position: number }> = [];
  editor.state.doc.forEach((node, position) => nodes.push({ node, position }));

  if (range.isSectionHeading) {
    const sections = getSections(editor);
    const index = sections.findIndex(
      (section) => section.position === range.position,
    );
    const sibling = sections[index + (direction === "up" ? -1 : 1)];
    if (!sibling) return false;
    const content = editor.state.doc.slice(range.position, range.end).content;
    const tr = editor.state.tr.delete(range.position, range.end);
    const target =
      direction === "up"
        ? sibling.position
        : range.position + (sibling.end - sibling.position);
    tr.insert(target, content);
    editor.view.dispatch(tr.scrollIntoView());
    editor.commands.setNodeSelection(target);
    editor.commands.focus();
    return true;
  }

  const index = nodes.findIndex((entry) => entry.position === range.position);
  const sibling = nodes[index + (direction === "up" ? -1 : 1)];
  if (!sibling) return false;
  const content = editor.state.doc.slice(range.position, range.end).content;
  const tr = editor.state.tr.delete(range.position, range.end);
  const target =
    direction === "up"
      ? sibling.position
      : range.position + sibling.node.nodeSize;
  tr.insert(target, content);
  editor.view.dispatch(tr.scrollIntoView());
  editor.commands.setNodeSelection(target);
  editor.commands.focus();
  return true;
}

function copyPortfolioTopLevelBlock(editor: Editor, cut: boolean) {
  const range = getPortfolioTopLevelBlockRange(editor);
  if (!range || typeof document.execCommand !== "function") return false;
  editor.commands.setNodeSelection(range.position);
  const copied = document.execCommand("copy");
  if (copied && cut) deletePortfolioTopLevelBlock(editor);
  return copied;
}

async function copyPortfolioTopLevelBlockLink(editor: Editor) {
  const control = getPortfolioTopLevelBlock(editor);
  if (!control) return false;
  let id =
    typeof control.node.attrs.id === "string" ? control.node.attrs.id : "";
  if (!id) {
    id = window.crypto.randomUUID();
    updatePortfolioTopLevelBlockAttributes(editor, { id });
  }
  const url = `${window.location.href.split("#")[0]}#${id}`;
  await navigator.clipboard.writeText(url);
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

function replacePortfolioTopLevelBlock(editor: Editor, type: string) {
  const control = getPortfolioTopLevelBlock(editor);
  if (!control || !editor.schema.nodes[type]) return false;
  return editor
    .chain()
    .focus()
    .insertContentAt(
      {
        from: control.position,
        to: control.position + control.node.nodeSize,
      },
      { type },
    )
    .run();
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
            canMoveUp: block.position > 0,
            canMoveDown:
              (block.isSectionHeading
                ? getSections(currentEditor).find(
                    (section) => section.position === block.position,
                  )?.end
                : block.position + block.node.nodeSize) !==
              currentEditor.state.doc.content.size,
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

  function runAndClose(action: () => boolean | Promise<boolean>) {
    void Promise.resolve(action()).then((completed) => {
      if (completed) close();
    });
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
            <Menu.Item
              leftSection={<IconCopy size={16} />}
              onClick={() =>
                runAndClose(() => duplicatePortfolioTopLevelBlock(editor))
              }
            >
              {t("Duplicate")}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconClipboard size={16} />}
              onClick={() =>
                runAndClose(() => copyPortfolioTopLevelBlock(editor, false))
              }
            >
              {t("Copy")}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconCut size={16} />}
              onClick={() =>
                runAndClose(() => copyPortfolioTopLevelBlock(editor, true))
              }
            >
              {t("Cut")}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconArrowUp size={16} />}
              disabled={!elementState.canMoveUp}
              onClick={() =>
                runAndClose(() => movePortfolioTopLevelBlock(editor, "up"))
              }
            >
              {elementState.isSectionHeading
                ? t("Move section up")
                : t("Move up")}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconArrowDown size={16} />}
              disabled={!elementState.canMoveDown}
              onClick={() =>
                runAndClose(() => movePortfolioTopLevelBlock(editor, "down"))
              }
            >
              {elementState.isSectionHeading
                ? t("Move section down")
                : t("Move down")}
            </Menu.Item>
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
              leftSection={<IconLink size={16} />}
              onClick={() =>
                runAndClose(() => copyPortfolioTopLevelBlockLink(editor))
              }
            >
              {t("Copy link to element")}
            </Menu.Item>
            <Menu.Divider />
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
            name: block.node.type.name,
            label: blockLabel(block.node),
            supportsTextTools: TEXT_BLOCK_NODES.has(block.node.type.name),
            isSectionHeading: block.isSectionHeading,
            navigationLabel: String(block.node.attrs.navigationLabel || ""),
            open: Boolean(block.node.attrs.open),
            mathText: String(block.node.attrs.text || ""),
            align: String(block.node.attrs.align || "center"),
            dividerStyle: String(block.node.attrs.style || "solid"),
            dividerThickness: Number(block.node.attrs.thickness || 1),
            dividerWidth: Number(block.node.attrs.width || 100),
            dividerColor: String(block.node.attrs.color || "default"),
            dividerSpacing: String(block.node.attrs.spacing || "standard"),
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
        {current?.isSectionHeading && (
          <Button
            size="compact-sm"
            variant="subtle"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              const navigationLabel = window.prompt(
                "Navigation label (leave blank to use the section title)",
                current.navigationLabel,
              );
              if (navigationLabel !== null) {
                updatePortfolioTopLevelBlockAttributes(editor, {
                  navigationLabel: navigationLabel.trim() || null,
                });
              }
            }}
          >
            Navigation label
          </Button>
        )}
        {current?.name === "details" && (
          <Button
            size="compact-sm"
            variant="subtle"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              updatePortfolioTopLevelBlockAttributes(editor, {
                open: !current.open,
              })
            }
          >
            {current.open ? "Open by default" : "Closed by default"}
          </Button>
        )}
        {current?.name === "mathBlock" && (
          <>
            <CopyButton value={current.mathText} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Copied" : "Copy LaTeX"}
                  position="top"
                >
                  <ActionIcon
                    size="lg"
                    variant="subtle"
                    color={copied ? "teal" : undefined}
                    aria-label="Copy LaTeX"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={copy}
                  >
                    {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
            <Menu
              withinPortal={false}
              position="bottom-start"
              shadow="md"
              width={160}
            >
              <Menu.Target>
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  aria-label="Equation alignment"
                >
                  {current.align === "left" ? (
                    <IconAlignLeft size={18} />
                  ) : current.align === "right" ? (
                    <IconAlignRight size={18} />
                  ) : (
                    <IconAlignCenter size={18} />
                  )}
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {(["left", "center", "right"] as const).map((align) => (
                  <Menu.Item
                    key={align}
                    rightSection={
                      current.align === align ? <IconCheck size={14} /> : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, { align })
                    }
                  >
                    {align[0].toUpperCase() + align.slice(1)}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </>
        )}
        {current?.name === "pageBreak" && (
          <Button
            size="compact-sm"
            variant="subtle"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              replacePortfolioTopLevelBlock(editor, "horizontalRule")
            }
          >
            Convert to divider
          </Button>
        )}
        {current?.name === "horizontalRule" && (
          <>
            <Menu
              withinPortal={false}
              position="bottom-start"
              shadow="md"
              width={230}
            >
              <Menu.Target>
                <Button size="compact-sm" variant="subtle">
                  Divider style
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Line</Menu.Label>
                {(["solid", "dashed", "dotted"] as const).map((style) => (
                  <Menu.Item
                    key={style}
                    rightSection={
                      current.dividerStyle === style ? (
                        <IconCheck size={14} />
                      ) : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, { style })
                    }
                  >
                    {style[0].toUpperCase() + style.slice(1)}
                  </Menu.Item>
                ))}
                <Menu.Divider />
                <Menu.Label>Thickness</Menu.Label>
                {[1, 2, 4].map((thickness) => (
                  <Menu.Item
                    key={thickness}
                    rightSection={
                      current.dividerThickness === thickness ? (
                        <IconCheck size={14} />
                      ) : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, {
                        thickness,
                      })
                    }
                  >
                    {thickness}px
                  </Menu.Item>
                ))}
                <Menu.Divider />
                <Menu.Label>Width</Menu.Label>
                {[25, 50, 75, 100].map((width) => (
                  <Menu.Item
                    key={width}
                    rightSection={
                      current.dividerWidth === width ? (
                        <IconCheck size={14} />
                      ) : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, { width })
                    }
                  >
                    {width}%
                  </Menu.Item>
                ))}
                <Menu.Divider />
                <Menu.Label>Colour</Menu.Label>
                {(["default", "muted", "accent"] as const).map((color) => (
                  <Menu.Item
                    key={color}
                    rightSection={
                      current.dividerColor === color ? (
                        <IconCheck size={14} />
                      ) : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, { color })
                    }
                  >
                    {color[0].toUpperCase() + color.slice(1)}
                  </Menu.Item>
                ))}
                <Menu.Divider />
                <Menu.Label>Spacing</Menu.Label>
                {(["compact", "standard", "wide"] as const).map((spacing) => (
                  <Menu.Item
                    key={spacing}
                    rightSection={
                      current.dividerSpacing === spacing ? (
                        <IconCheck size={14} />
                      ) : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, {
                        spacing,
                      })
                    }
                  >
                    {spacing[0].toUpperCase() + spacing.slice(1)}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            <Button
              size="compact-sm"
              variant="subtle"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => replacePortfolioTopLevelBlock(editor, "pageBreak")}
            >
              Convert to page break
            </Button>
          </>
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
        editor.isActive("base") ||
        editor.isActive("codeBlock") ||
        editor.isActive("embed") ||
        editor.isActive("mediaPlaylist") ||
        editor.isActive("photoGrid") ||
        editor.isActive("photoAlbum") ||
        editor.isActive("tabs") ||
        editor.isActive("transclusionReference") ||
        editor.isActive("transclusionSource") ||
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
          name,
          source: String(block.node.attrs.url || ""),
          display: block.node.attrs.display === "inline" ? "inline" : "card",
          canEmbedAsPdf:
            mime === "application/pdf" || name.toLowerCase().endsWith(".pdf"),
          canDownload: Boolean(block.node.attrs.url),
        };
      }
      if (block.node.type.name === "base") {
        return {
          type: "base" as const,
          hasSource: Boolean(block.node.attrs.pageId),
        };
      }
      if (block.node.type.name === "transclusionSource") {
        return { type: "sync-source" as const };
      }
      if (block.node.type.name === "transclusionReference") {
        return {
          type: "sync-reference" as const,
          hasSource: Boolean(block.node.attrs.sourcePageId),
        };
      }
      if (block.node.type.name === "codeBlock") {
        return {
          type: "code" as const,
          language: String(block.node.attrs.language || ""),
          text: block.node.textContent,
          wrap: Boolean(block.node.attrs.wrap),
          lineNumbers: Boolean(block.node.attrs.lineNumbers),
          theme: block.node.attrs.theme === "light" ? "light" : "dark",
          collapsed: Boolean(block.node.attrs.collapsed),
        };
      }
      if (block.node.type.name === "embed") {
        return {
          type: "embed" as const,
          hasSource: Boolean(block.node.attrs.src),
          align: String(block.node.attrs.align || "center"),
          width: Number(block.node.attrs.width || 800),
        };
      }
      if (block.node.type.name === "youtube") {
        return {
          type: "youtube" as const,
          source: String(block.node.attrs.src || ""),
          width: Number(block.node.attrs.width || 640),
          start: Number(block.node.attrs.start || 0),
        };
      }
      if (block.node.type.name === "mediaPlaylist") {
        return {
          type: "playlist" as const,
          kind: block.node.attrs.kind === "audio" ? "audio" : "video",
          autoplay: Boolean(block.node.attrs.autoplay),
          loop: Boolean(block.node.attrs.loop),
          shuffle: Boolean(block.node.attrs.shuffle),
          showQueue: block.node.attrs.showQueue !== false,
          queueLayout:
            block.node.attrs.queueLayout === "compact" ? "compact" : "detailed",
        };
      }
      if (
        block.node.type.name === "photoGrid" ||
        block.node.type.name === "photoAlbum"
      ) {
        return {
          type: "photos" as const,
          kind: block.node.type.name === "photoAlbum" ? "album" : "grid",
          columns: Number(block.node.attrs.columns || 0),
          gap: Number(block.node.attrs.gap ?? 10),
          aspect: String(block.node.attrs.aspect || "auto"),
          fit: block.node.attrs.fit === "contain" ? "contain" : "cover",
          lightbox: block.node.attrs.lightbox !== false,
          thumbnailPosition:
            block.node.attrs.thumbnailPosition === "bottom"
              ? "bottom"
              : "right",
          autoplay: Boolean(block.node.attrs.autoplay),
          interval: Number(block.node.attrs.interval || 5),
        };
      }
      if (block.node.type.name === "tabs") {
        return { type: "tabs" as const };
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
        {current?.type === "sync-source" ? (
          <>
            <span className={classes.elementLabel}>Synced block source</span>
            <Tooltip label="Copy synced block" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Copy synced block"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "copy-synced-block")
                }
              >
                <IconCopy size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Unsync block" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Unsync block"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "unsync-block")
                }
              >
                <IconLinkOff size={18} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : current?.type === "sync-reference" ? (
          <>
            <span className={classes.elementLabel}>Synced block</span>
            <Tooltip label="Refresh synced block" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Refresh synced block"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "refresh-synced-block")
                }
              >
                <IconRefresh size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Open source" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Open synced block source"
                disabled={!current.hasSource}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "open-synced-source")
                }
              >
                <IconExternalLink size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Unsync block" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Unsync block"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "unsync-block")
                }
              >
                <IconLinkOff size={18} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : current?.type === "base" ? (
          <>
            <span className={classes.elementLabel}>Database</span>
            <Tooltip label="Open source database" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Open source database"
                disabled={!current.hasSource}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "open-base")
                }
              >
                <IconExternalLink size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Refresh database" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Refresh database"
                disabled={!current.hasSource}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "refresh-base")
                }
              >
                <IconRefresh size={18} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : current?.type === "tabs" ? (
          <>
            <Button
              size="compact-sm"
              variant="subtle"
              leftSection={<IconPlus size={16} />}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => triggerPortfolioElementAction(editor, "add-tab")}
            >
              Add tab
            </Button>
            <Tooltip label="Rename active tab" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Rename active tab"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "rename-tab")
                }
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Duplicate active tab" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Duplicate active tab"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "duplicate-tab")
                }
              >
                <IconCopy size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Move tab left" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Move tab left"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "move-tab-left")
                }
              >
                <IconArrowLeft size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Move tab right" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Move tab right"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "move-tab-right")
                }
              >
                <IconArrowRight size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Remove active tab" position="top">
              <ActionIcon
                color="red"
                size="lg"
                variant="subtle"
                aria-label="Remove active tab"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "remove-tab")
                }
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : current?.type === "youtube" ? (
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
            <Menu
              withinPortal={false}
              position="bottom-start"
              shadow="md"
              width={180}
            >
              <Menu.Target>
                <Button size="compact-sm" variant="subtle">
                  {current.width}px
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {[480, 640, 800, 1200].map((width) => (
                  <Menu.Item
                    key={width}
                    rightSection={
                      current.width === width ? <IconCheck size={14} /> : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, {
                        width,
                        height: Math.round((width * 9) / 16),
                      })
                    }
                  >
                    {width}px
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            <Button
              size="compact-sm"
              variant="subtle"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                const value = window.prompt(
                  "Start time in seconds",
                  String(current.start),
                );
                if (value === null) return;
                const start = Math.max(0, Math.round(Number(value) || 0));
                updatePortfolioTopLevelBlockAttributes(editor, { start });
              }}
            >
              Start {current.start}s
            </Button>
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
            <Menu
              withinPortal={false}
              position="bottom-start"
              shadow="md"
              width={170}
            >
              <Menu.Target>
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  aria-label="Embed alignment"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {current.align === "left" ? (
                    <IconAlignLeft size={18} />
                  ) : current.align === "right" ? (
                    <IconAlignRight size={18} />
                  ) : (
                    <IconAlignCenter size={18} />
                  )}
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {(["left", "center", "right"] as const).map((align) => (
                  <Menu.Item
                    key={align}
                    leftSection={
                      align === "left" ? (
                        <IconAlignLeft size={16} />
                      ) : align === "right" ? (
                        <IconAlignRight size={16} />
                      ) : (
                        <IconAlignCenter size={16} />
                      )
                    }
                    rightSection={
                      current.align === align ? <IconCheck size={14} /> : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, { align })
                    }
                  >
                    {align[0].toUpperCase() + align.slice(1)}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            <Menu
              withinPortal={false}
              position="bottom-start"
              shadow="md"
              width={180}
            >
              <Menu.Target>
                <Button size="compact-sm" variant="subtle">
                  {current.width}px
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {[
                  { label: "Compact", width: 480, height: 360 },
                  { label: "Standard", width: 800, height: 600 },
                  { label: "Wide", width: 1200, height: 675 },
                ].map((preset) => (
                  <Menu.Item
                    key={preset.label}
                    rightSection={
                      current.width === preset.width ? (
                        <IconCheck size={14} />
                      ) : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, {
                        width: preset.width,
                        height: preset.height,
                      })
                    }
                  >
                    {preset.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            <Tooltip label="Refresh embed" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Refresh embed"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "refresh-embed")
                }
              >
                <IconRefresh size={18} />
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
            <Tooltip label="Wrap lines" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Wrap lines"
                className={current.wrap ? classes.active : undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  updatePortfolioTopLevelBlockAttributes(editor, {
                    wrap: !current.wrap,
                  })
                }
              >
                <IconTextWrap size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Show line numbers" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Show line numbers"
                className={current.lineNumbers ? classes.active : undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  updatePortfolioTopLevelBlockAttributes(editor, {
                    lineNumbers: !current.lineNumbers,
                  })
                }
              >
                <IconListNumbers size={18} />
              </ActionIcon>
            </Tooltip>
            <Menu
              withinPortal={false}
              position="bottom-start"
              shadow="md"
              width={170}
            >
              <Menu.Target>
                <Button size="compact-sm" variant="subtle">
                  {current.theme === "light" ? "Light" : "Dark"}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  rightSection={
                    current.theme === "dark" ? <IconCheck size={14} /> : null
                  }
                  onClick={() =>
                    updatePortfolioTopLevelBlockAttributes(editor, {
                      theme: "dark",
                    })
                  }
                >
                  Dark theme
                </Menu.Item>
                <Menu.Item
                  rightSection={
                    current.theme === "light" ? <IconCheck size={14} /> : null
                  }
                  onClick={() =>
                    updatePortfolioTopLevelBlockAttributes(editor, {
                      theme: "light",
                    })
                  }
                >
                  Light theme
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Tooltip
              label={current.collapsed ? "Expand code" : "Collapse code"}
              position="top"
            >
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label={current.collapsed ? "Expand code" : "Collapse code"}
                className={current.collapsed ? classes.active : undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  updatePortfolioTopLevelBlockAttributes(editor, {
                    collapsed: !current.collapsed,
                  })
                }
              >
                <IconArrowsMinimize size={18} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : current?.type === "attachment" ? (
          <>
            <Tooltip label="Rename file" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Rename file"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  const name = window
                    .prompt("Rename file", current.name)
                    ?.trim();
                  if (name)
                    updatePortfolioTopLevelBlockAttributes(editor, { name });
                }}
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Replace file" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Replace file"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  triggerPortfolioElementAction(editor, "replace-file")
                }
              >
                <IconRefresh size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Open file" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Open file"
                disabled={!current.source}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  window.open(
                    getFileUrl(current.source),
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <IconExternalLink size={18} />
              </ActionIcon>
            </Tooltip>
            <CopyButton
              value={current.source ? getFileUrl(current.source) : ""}
              timeout={2000}
            >
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Copied" : "Copy file link"}
                  position="top"
                >
                  <ActionIcon
                    size="lg"
                    variant="subtle"
                    color={copied ? "teal" : undefined}
                    aria-label="Copy file link"
                    disabled={!current.source}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={copy}
                  >
                    {copied ? <IconCheck size={18} /> : <IconLink size={18} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
            <Menu
              withinPortal={false}
              position="bottom-start"
              shadow="md"
              width={170}
            >
              <Menu.Target>
                <Button size="compact-sm" variant="subtle">
                  {current.display === "inline" ? "Inline" : "Card"}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {(["card", "inline"] as const).map((display) => (
                  <Menu.Item
                    key={display}
                    rightSection={
                      current.display === display ? (
                        <IconCheck size={14} />
                      ) : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, {
                        display,
                      })
                    }
                  >
                    {display === "card" ? "Card" : "Inline"}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
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
            <Tooltip label="Shuffle playback" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Shuffle playback"
                className={current.shuffle ? classes.active : undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  updatePortfolioTopLevelBlockAttributes(editor, {
                    shuffle: !current.shuffle,
                  })
                }
              >
                <IconArrowsShuffle size={18} />
              </ActionIcon>
            </Tooltip>
            <Menu
              withinPortal={false}
              position="bottom-start"
              shadow="md"
              width={210}
            >
              <Menu.Target>
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  aria-label="Playlist display"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <IconListDetails size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Playlist display</Menu.Label>
                <Menu.Item
                  rightSection={
                    current.showQueue ? <IconCheck size={14} /> : null
                  }
                  onClick={() =>
                    updatePortfolioTopLevelBlockAttributes(editor, {
                      showQueue: !current.showQueue,
                    })
                  }
                >
                  Show queue
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  rightSection={
                    current.queueLayout === "detailed" ? (
                      <IconCheck size={14} />
                    ) : null
                  }
                  onClick={() =>
                    updatePortfolioTopLevelBlockAttributes(editor, {
                      queueLayout: "detailed",
                    })
                  }
                >
                  Detailed queue
                </Menu.Item>
                <Menu.Item
                  rightSection={
                    current.queueLayout === "compact" ? (
                      <IconCheck size={14} />
                    ) : null
                  }
                  onClick={() =>
                    updatePortfolioTopLevelBlockAttributes(editor, {
                      queueLayout: "compact",
                    })
                  }
                >
                  Compact queue
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>
        ) : current?.type === "photos" ? (
          <>
            <Button
              size="compact-sm"
              variant="subtle"
              leftSection={<IconPlus size={16} />}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() =>
                triggerPortfolioElementAction(editor, "add-photos")
              }
            >
              Add photos
            </Button>
            {current.kind === "grid" && (
              <Menu
                withinPortal={false}
                position="bottom-start"
                shadow="md"
                width={175}
              >
                <Menu.Target>
                  <Button size="compact-sm" variant="subtle">
                    {current.columns
                      ? `${current.columns} columns`
                      : "Auto layout"}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {[0, 1, 2, 3, 4].map((columns) => (
                    <Menu.Item
                      key={columns}
                      rightSection={
                        current.columns === columns ? (
                          <IconCheck size={14} />
                        ) : null
                      }
                      onClick={() =>
                        updatePortfolioTopLevelBlockAttributes(editor, {
                          columns,
                        })
                      }
                    >
                      {columns === 0
                        ? "Auto layout"
                        : `${columns} column${columns === 1 ? "" : "s"}`}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
            <Menu
              withinPortal={false}
              position="bottom-start"
              shadow="md"
              width={180}
            >
              <Menu.Target>
                <Button size="compact-sm" variant="subtle">
                  {current.fit === "contain" ? "Fit" : "Fill"}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  rightSection={
                    current.fit === "cover" ? <IconCheck size={14} /> : null
                  }
                  onClick={() =>
                    updatePortfolioTopLevelBlockAttributes(editor, {
                      fit: "cover",
                    })
                  }
                >
                  Fill frame
                </Menu.Item>
                <Menu.Item
                  rightSection={
                    current.fit === "contain" ? <IconCheck size={14} /> : null
                  }
                  onClick={() =>
                    updatePortfolioTopLevelBlockAttributes(editor, {
                      fit: "contain",
                    })
                  }
                >
                  Fit image
                </Menu.Item>
                {current.kind === "grid" && (
                  <>
                    <Menu.Divider />
                    {[
                      ["auto", "Natural ratio"],
                      ["square", "Square"],
                      ["landscape", "Landscape"],
                      ["portrait", "Portrait"],
                    ].map(([aspect, label]) => (
                      <Menu.Item
                        key={aspect}
                        rightSection={
                          current.aspect === aspect ? (
                            <IconCheck size={14} />
                          ) : null
                        }
                        onClick={() =>
                          updatePortfolioTopLevelBlockAttributes(editor, {
                            aspect,
                          })
                        }
                      >
                        {label}
                      </Menu.Item>
                    ))}
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
            <Menu
              withinPortal={false}
              position="bottom-start"
              shadow="md"
              width={190}
            >
              <Menu.Target>
                <Button size="compact-sm" variant="subtle">
                  Spacing {current.gap}px
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {[0, 8, 16, 24].map((gap) => (
                  <Menu.Item
                    key={gap}
                    rightSection={
                      current.gap === gap ? <IconCheck size={14} /> : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, { gap })
                    }
                  >
                    {gap === 0 ? "No gap" : `${gap}px gap`}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            {current.kind === "album" && (
              <Menu
                withinPortal={false}
                position="bottom-start"
                shadow="md"
                width={200}
              >
                <Menu.Target>
                  <Button size="compact-sm" variant="subtle">
                    Album settings
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Thumbnails</Menu.Label>
                  <Menu.Item
                    rightSection={
                      current.thumbnailPosition === "right" ? (
                        <IconCheck size={14} />
                      ) : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, {
                        thumbnailPosition: "right",
                      })
                    }
                  >
                    Right side
                  </Menu.Item>
                  <Menu.Item
                    rightSection={
                      current.thumbnailPosition === "bottom" ? (
                        <IconCheck size={14} />
                      ) : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, {
                        thumbnailPosition: "bottom",
                      })
                    }
                  >
                    Below photo
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    rightSection={
                      current.autoplay ? <IconCheck size={14} /> : null
                    }
                    onClick={() =>
                      updatePortfolioTopLevelBlockAttributes(editor, {
                        autoplay: !current.autoplay,
                      })
                    }
                  >
                    Autoplay slideshow
                  </Menu.Item>
                  {[3, 5, 8].map((interval) => (
                    <Menu.Item
                      key={interval}
                      disabled={!current.autoplay}
                      rightSection={
                        current.interval === interval ? (
                          <IconCheck size={14} />
                        ) : null
                      }
                      onClick={() =>
                        updatePortfolioTopLevelBlockAttributes(editor, {
                          interval,
                        })
                      }
                    >
                      {interval} seconds
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
            <Tooltip label="Open images in lightbox" position="top">
              <ActionIcon
                size="lg"
                variant="subtle"
                aria-label="Open images in lightbox"
                className={current.lightbox ? classes.active : undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  updatePortfolioTopLevelBlockAttributes(editor, {
                    lightbox: !current.lightbox,
                  })
                }
              >
                <IconExternalLink size={18} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : null}
        <div className={classes.divider} />
        <PortfolioElementActions editor={editor} />
      </div>
    </BaseBubbleMenu>
  );
}
