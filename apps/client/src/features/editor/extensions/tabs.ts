import { Node, mergeAttributes } from "@tiptap/core";
import { Fragment } from "@tiptap/pm/model";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { ReactNodeViewRenderer } from "@tiptap/react";
import TabsView from "@/features/editor/components/tabs/tabs-view";

const MIN_TABS = 2;
const MAX_TABS = 8;

type InsertTabsOptions = {
  count?: number;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tabs: {
      insertTabs: (options?: InsertTabsOptions) => ReturnType;
    };
  }
}

export const Tab = Node.create({
  name: "tab",
  group: "block",
  content: "block+",
  defining: true,
  isolating: true,
  selectable: false,

  addAttributes() {
    return {
      title: {
        default: "Tab",
        parseHTML: (element) => element.getAttribute("data-tab-title") || "Tab",
        renderHTML: (attributes) => ({
          "data-tab-title": attributes.title,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="tab"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-type": "tab" }, HTMLAttributes),
      0,
    ];
  },
});

export const Tabs = Node.create({
  name: "tabs",
  group: "block",
  content: "tab{2,8}",
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      activeIndex: {
        default: 0,
        parseHTML: (element) => {
          const value = Number(element.getAttribute("data-active-index"));
          return Number.isInteger(value) ? value : 0;
        },
        renderHTML: (attributes) => ({
          "data-active-index": attributes.activeIndex ?? 0,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="tabs"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-type": "tabs" }, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      insertTabs:
        (options = {}) =>
        ({ tr, state, dispatch }) => {
          const requestedCount = options.count ?? 3;
          const count = Math.max(MIN_TABS, Math.min(MAX_TABS, requestedCount));
          const tabType = state.schema.nodes.tab;
          const paragraphType = state.schema.nodes.paragraph;

          if (!tabType || !paragraphType) return false;

          const tabs = Array.from({ length: count }, (_, index) =>
            tabType.create(
              { title: `Tab ${index + 1}` },
              paragraphType.create(),
            ),
          );

          const tabsNode = this.type.create(
            { activeIndex: 0 },
            Fragment.from(tabs),
          );
          const stepsBefore = tr.steps.length;
          tr.replaceSelectionWith(tabsNode);

          if (tr.steps.length > stepsBefore) {
            const stepMap = tr.steps[tr.steps.length - 1].getMap();
            let insertStart = 0;
            stepMap.forEach((_from, _to, newFrom) => {
              insertStart = newFrom;
            });
            tr.setSelection(TextSelection.near(tr.doc.resolve(insertStart + 2), 1));
          }

          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("ramzyTabsVisibility"),
        props: {
          decorations: (state) => {
            const decorations: Decoration[] = [];

            state.doc.descendants((node, pos) => {
              if (node.type.name !== "tabs") return true;

              const requestedIndex = Number(node.attrs.activeIndex ?? 0);
              const activeIndex = Math.max(
                0,
                Math.min(
                  Number.isInteger(requestedIndex) ? requestedIndex : 0,
                  Math.max(0, node.childCount - 1),
                ),
              );

              let childOffset = 0;
              node.forEach((child, _offset, index) => {
                if (child.type.name !== "tab") {
                  childOffset += child.nodeSize;
                  return;
                }

                const childPos = pos + 1 + childOffset;
                const isActive = index === activeIndex;
                decorations.push(
                  Decoration.node(childPos, childPos + child.nodeSize, {
                    class: isActive
                      ? "ramzy-tab--active"
                      : "ramzy-tab--inactive",
                    "aria-hidden": isActive ? "false" : "true",
                  }),
                );
                childOffset += child.nodeSize;
              });

              return false;
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TabsView);
  },
});
