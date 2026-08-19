import { Node, mergeAttributes } from "@tiptap/core";
import { Fragment } from "@tiptap/pm/model";
import { TextSelection } from "@tiptap/pm/state";

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
    return ({ node, editor, getPos }) => {
      let currentNode = node;
      let activeIndex = 0;

      const dom = document.createElement("div");
      dom.className = "ramzy-tabs";
      dom.dataset.type = "tabs";

      const tabList = document.createElement("div");
      tabList.className = "ramzy-tabs__list";
      tabList.setAttribute("role", "tablist");
      tabList.contentEditable = "false";

      const contentDOM = document.createElement("div");
      contentDOM.className = "ramzy-tabs__content";

      dom.append(tabList, contentDOM);

      const getParentPos = () => {
        const pos = getPos();
        return typeof pos === "number" ? pos : null;
      };

      const getTabPos = (index: number) => {
        const parentPos = getParentPos();
        if (parentPos === null || index < 0 || index >= currentNode.childCount) {
          return null;
        }

        let offset = 0;
        for (let i = 0; i < index; i += 1) {
          offset += currentNode.child(i).nodeSize;
        }
        return parentPos + 1 + offset;
      };

      const syncPanels = () => {
        Array.from(contentDOM.children).forEach((panel, index) => {
          const isActive = index === activeIndex;
          const element = panel as HTMLElement;
          element.hidden = !isActive;
          element.setAttribute("role", "tabpanel");
          element.setAttribute("aria-hidden", isActive ? "false" : "true");
        });
      };

      const setActiveIndex = (nextIndex: number) => {
        activeIndex = Math.max(
          0,
          Math.min(nextIndex, Math.max(0, currentNode.childCount - 1)),
        );
        renderTabList();
        syncPanels();
      };

      const renameTab = (index: number) => {
        if (!editor.isEditable) return;
        const tab = currentNode.child(index);
        const nextTitle = window.prompt(
          "Rename tab",
          tab.attrs.title || `Tab ${index + 1}`,
        );
        if (!nextTitle?.trim()) return;

        const tabPos = getTabPos(index);
        if (tabPos === null) return;

        editor.view.dispatch(
          editor.state.tr.setNodeMarkup(tabPos, undefined, {
            ...tab.attrs,
            title: nextTitle.trim(),
          }),
        );
      };

      const removeTab = (index: number) => {
        if (!editor.isEditable || currentNode.childCount <= MIN_TABS) return;
        const tabPos = getTabPos(index);
        if (tabPos === null) return;

        const tab = currentNode.child(index);
        editor.view.dispatch(editor.state.tr.delete(tabPos, tabPos + tab.nodeSize));
        activeIndex = Math.min(activeIndex, currentNode.childCount - 2);
      };

      const addTab = () => {
        if (!editor.isEditable || currentNode.childCount >= MAX_TABS) return;
        const parentPos = getParentPos();
        if (parentPos === null) return;

        const insertPos = parentPos + currentNode.nodeSize - 1;
        const newIndex = currentNode.childCount;

        editor
          .chain()
          .focus()
          .insertContentAt(insertPos, {
            type: "tab",
            attrs: { title: `Tab ${newIndex + 1}` },
            content: [{ type: "paragraph" }],
          })
          .run();

        activeIndex = newIndex;
      };

      function renderTabList() {
        tabList.replaceChildren();

        currentNode.forEach((tab, _offset, index) => {
          const item = document.createElement("div");
          item.className = "ramzy-tabs__item";

          const trigger = document.createElement("button");
          trigger.type = "button";
          trigger.className = "ramzy-tabs__trigger";
          trigger.textContent = tab.attrs.title || `Tab ${index + 1}`;
          trigger.setAttribute("role", "tab");
          trigger.setAttribute(
            "aria-selected",
            index === activeIndex ? "true" : "false",
          );
          if (index === activeIndex) trigger.dataset.active = "true";
          trigger.addEventListener("click", () => setActiveIndex(index));
          trigger.addEventListener("dblclick", () => renameTab(index));

          item.append(trigger);

          if (editor.isEditable && currentNode.childCount > MIN_TABS) {
            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "ramzy-tabs__remove";
            remove.setAttribute("aria-label", `Remove ${trigger.textContent}`);
            remove.textContent = "×";
            remove.addEventListener("click", (event) => {
              event.stopPropagation();
              removeTab(index);
            });
            item.append(remove);
          }

          tabList.append(item);
        });

        if (editor.isEditable && currentNode.childCount < MAX_TABS) {
          const add = document.createElement("button");
          add.type = "button";
          add.className = "ramzy-tabs__add";
          add.setAttribute("aria-label", "Add tab");
          add.textContent = "+";
          add.addEventListener("click", addTab);
          tabList.append(add);
        }
      }

      const observer = new MutationObserver(() => syncPanels());
      observer.observe(contentDOM, { childList: true });

      renderTabList();
      queueMicrotask(syncPanels);

      return {
        dom,
        contentDOM,
        update: (updatedNode) => {
          if (updatedNode.type.name !== "tabs") return false;
          currentNode = updatedNode;
          activeIndex = Math.min(activeIndex, currentNode.childCount - 1);
          renderTabList();
          queueMicrotask(syncPanels);
          return true;
        },
        ignoreMutation: (mutation) => {
          const target = mutation.target as globalThis.Node;

          // The tab strip is UI owned by this node view, not ProseMirror
          // document content. Ignoring its child/attribute mutations prevents
          // ProseMirror's DOM observer from trying to reconcile our own UI
          // render back into the document, which can create an update loop.
          if (target === tabList || tabList.contains(target)) {
            return true;
          }

          // Panel visibility/accessibility attributes are also node-view UI.
          if (
            mutation.type === "attributes" &&
            (mutation.attributeName === "hidden" ||
              mutation.attributeName === "role" ||
              mutation.attributeName === "aria-hidden")
          ) {
            return true;
          }

          return false;
        },
        stopEvent: (event) => {
          const target = event.target as globalThis.Node | null;
          return !!target && (target === tabList || tabList.contains(target));
        },
        destroy: () => observer.disconnect(),
      };
    };
  },
});
