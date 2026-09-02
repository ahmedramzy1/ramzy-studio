import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react/menus";
import { posToDOMRect, findParentNode } from "@tiptap/react";
import { Node as PMNode } from "@tiptap/pm/model";
import React, { useCallback, type JSX } from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Editor } from "@tiptap/core";
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

    const shouldShow = useCallback(
      ({ state }: ShouldShowProps) => {
        if (!state) {
          return false;
        }

        return editor.isActive("subpages");
      },
      [editor]
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
  }
);

export default SubpagesMenu;
