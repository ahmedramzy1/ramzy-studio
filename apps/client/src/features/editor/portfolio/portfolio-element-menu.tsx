import type { Editor } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import { NodeSelection } from "@tiptap/pm/state";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react/menus";
import { ActionIcon, Menu, Tooltip } from "@mantine/core";
import {
  IconArrowRight,
  IconDots,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "@/features/editor/components/common/toolbar-menu.module.css";

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
  "audio",
  "callout",
  "columns",
  "drawio",
  "excalidraw",
  "image",
  "pdf",
  "subpages",
  "table",
  "video",
] as const;

const BLOCK_LABELS: Record<string, string> = {
  attachment: "File",
  audio: "Audio",
  blockquote: "Quote",
  codeBlock: "Code block",
  heading: "Heading",
  horizontalRule: "Divider",
  iframe: "Embed",
  mediaPlaylist: "Playlist",
  paragraph: "Text",
  photoAlbum: "Photo album",
  photoGrid: "Image grid",
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
    isSectionHeading:
      node.type.name === "heading" && node.attrs.level === 1,
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

export function movePortfolioBlockToNewSection(
  editor: Editor,
  title: string,
) {
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
        <Tooltip position="top" label={t("Element actions")} withinPortal={false}>
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
  const shouldShow = useCallback(
    ({ state }: { state: Editor["state"] }) => {
      if (!hasPortfolioElementMenu(editor) || !editor.isEditable) return false;
      if (!state.selection.empty && !(state.selection instanceof NodeSelection)) {
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
      return block ? { label: blockLabel(block.node) } : null;
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
        <span className={classes.elementLabel}>
          {current?.label || "Element"}
        </span>
        <div className={classes.divider} />
        <PortfolioElementActions editor={editor} />
      </div>
    </BaseBubbleMenu>
  );
}
