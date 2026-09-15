import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react/menus";
import { posToDOMRect, findParentNode } from "@tiptap/react";
import { Node as PMNode } from "@tiptap/pm/model";
import React, { useCallback, type JSX } from "react";
import { ActionIcon, Menu, Tooltip } from "@mantine/core";
import {
  IconCheck,
  IconFileDescription,
  IconLayoutCards,
  IconList,
  IconRefresh,
  IconSortAscending,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { isEditorReady } from "@docmost/editor-ext";
import classes from "../common/toolbar-menu.module.css";
import {
  hasPortfolioElementMenu,
  PortfolioElementActions,
} from "@/features/editor/portfolio/portfolio-element-menu";

interface SubpagesMenuProps {
  editor: Editor;
}

interface ShouldShowProps {
  state: any;
  from?: number;
  to?: number;
}

export const SubpagesMenu = React.memo(
  ({ editor }: SubpagesMenuProps): JSX.Element => {
    const { t } = useTranslation();
    const portfolioMode = hasPortfolioElementMenu(editor);
    const current = useEditorState({
      editor,
      selector: ({ editor: currentEditor }) => {
        const attrs = currentEditor.getAttributes("subpages");
        return {
          sort: attrs.sort === "title" ? "title" : "position",
          showIcons: attrs.showIcons !== false,
          layout: attrs.layout === "cards" ? "cards" : "list",
        };
      },
    });

    const shouldShow = useCallback(
      ({ state }: ShouldShowProps) => {
        if (!state) {
          return false;
        }

        return editor.isActive("subpages");
      },
      [editor],
    );

    const getReferencedVirtualElement = useCallback(() => {
      if (!isEditorReady(editor)) return;
      const { selection } = editor.state;
      const predicate = (node: PMNode) => node.type.name === "subpages";
      const parent = findParentNode(predicate)(selection);

      if (parent) {
        const dom = editor.view.nodeDOM(parent?.pos) as HTMLElement;
        const rect = dom.getBoundingClientRect();
        return {
          getBoundingClientRect: () => rect,
          getClientRects: () => [rect],
        };
      }

      const rect = posToDOMRect(editor.view, selection.from, selection.to);
      return {
        getBoundingClientRect: () => rect,
        getClientRects: () => [rect],
      };
    }, [editor]);

    const deleteNode = useCallback(() => {
      const { selection } = editor.state;
      editor
        .chain()
        .focus()
        .setNodeSelection(selection.from)
        .deleteSelection()
        .run();
    }, [editor]);

    return (
      <BaseBubbleMenu
        editor={editor}
        pluginKey={`subpages-menu`}
        updateDelay={0}
        getReferencedVirtualElement={getReferencedVirtualElement}
        options={{ placement: portfolioMode ? "bottom" : "top", offset: 8 }}
        shouldShow={shouldShow}
      >
        <div className={classes.toolbar}>
          {portfolioMode && (
            <>
              <Tooltip position="top" label="Refresh subpages">
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  aria-label="Refresh subpages"
                  onClick={() => {
                    const dom = editor.view.nodeDOM(
                      editor.state.selection.from,
                    ) as HTMLElement | null;
                    dom
                      ?.querySelector<HTMLElement>(
                        '[data-ramzy-element-action="refresh-subpages"]',
                      )
                      ?.click();
                  }}
                >
                  <IconRefresh size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip position="top" label="Show page icons">
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  aria-label="Show page icons"
                  className={current.showIcons ? classes.active : undefined}
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .updateAttributes("subpages", {
                        showIcons: !current.showIcons,
                      })
                      .run()
                  }
                >
                  <IconFileDescription size={18} />
                </ActionIcon>
              </Tooltip>
              <Menu
                withinPortal={false}
                position="bottom-start"
                shadow="md"
                width={180}
              >
                <Menu.Target>
                  <ActionIcon
                    size="lg"
                    variant="subtle"
                    aria-label="Subpage sorting"
                  >
                    <IconSortAscending size={18} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    rightSection={
                      current.sort === "position" ? (
                        <IconCheck size={14} />
                      ) : null
                    }
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .updateAttributes("subpages", { sort: "position" })
                        .run()
                    }
                  >
                    Page order
                  </Menu.Item>
                  <Menu.Item
                    rightSection={
                      current.sort === "title" ? <IconCheck size={14} /> : null
                    }
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .updateAttributes("subpages", { sort: "title" })
                        .run()
                    }
                  >
                    Alphabetical
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
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
                    aria-label="Subpage layout"
                  >
                    {current.layout === "cards" ? (
                      <IconLayoutCards size={18} />
                    ) : (
                      <IconList size={18} />
                    )}
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconList size={16} />}
                    rightSection={
                      current.layout === "list" ? <IconCheck size={14} /> : null
                    }
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .updateAttributes("subpages", { layout: "list" })
                        .run()
                    }
                  >
                    List
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconLayoutCards size={16} />}
                    rightSection={
                      current.layout === "cards" ? (
                        <IconCheck size={14} />
                      ) : null
                    }
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .updateAttributes("subpages", { layout: "cards" })
                        .run()
                    }
                  >
                    Cards
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          )}
          {!portfolioMode && (
            <Tooltip position="top" label={t("Delete")}>
              <ActionIcon
                onClick={deleteNode}
                variant="default"
                size="lg"
                color="red"
                aria-label={t("Delete")}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          )}
          {portfolioMode && <PortfolioElementActions editor={editor} />}
        </div>
      </BaseBubbleMenu>
    );
  },
);

export default SubpagesMenu;
