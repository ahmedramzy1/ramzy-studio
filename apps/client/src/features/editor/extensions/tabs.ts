import { Node, mergeAttributes } from "@tiptap/core";
import { Fragment } from "@tiptap/pm/model";
import { TextSelection } from "@tiptap/pm/state";
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

          const tabsNode = this.type.create(null, Fragment.from(tabs));
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

  addNodeView() {
    return ReactNodeViewRenderer(TabsView);
  },
});
