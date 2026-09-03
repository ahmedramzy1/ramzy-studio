import { Fragment, Node as PMNode } from '@tiptap/pm/model';
import { TextSelection } from '@tiptap/pm/state';
import { Node as TiptapNode, mergeAttributes } from '@tiptap/core';

export interface TabsOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tabs: {
      insertTabs: (count?: number) => ReturnType;
    };
  }
}

let tabsViewSequence = 0;

function childPosition(
  parent: PMNode,
  parentPos: number,
  index: number,
): number {
  let position = parentPos + 1;

  for (let childIndex = 0; childIndex < index; childIndex += 1) {
    position += parent.child(childIndex).nodeSize;
  }

  return position;
}

export const Tabs = TiptapNode.create<TabsOptions>({
  name: 'tabs',
  group: 'block',
  content: 'tabPanel+',
  defining: true,
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { 'data-type': this.name },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      0,
    ];
  },

  addCommands() {
    return {
      insertTabs:
        (count = 2) =>
        ({ tr, state, dispatch }) => {
          const tabPanelType = state.schema.nodes.tabPanel;
          const paragraphType = state.schema.nodes.paragraph;

          if (!tabPanelType || !paragraphType) return false;

          const safeCount = Math.min(10, Math.max(2, Math.round(count)));
          const panels = Array.from({ length: safeCount }, (_, index) =>
            tabPanelType.create(
              { label: `Tab ${index + 1}` },
              paragraphType.create(),
            ),
          );
          const tabsNode = this.type.create(null, Fragment.from(panels));

          const stepsBefore = tr.steps.length;
          tr.replaceSelectionWith(tabsNode);

          if (tr.steps.length > stepsBefore) {
            const stepMap = tr.steps[tr.steps.length - 1].getMap();
            let insertStart = 0;
            stepMap.forEach((_from, _to, newFrom) => {
              insertStart = newFrom;
            });

            tr.setSelection(
              TextSelection.near(tr.doc.resolve(insertStart + 2), 1),
            );
          }

          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },

  addNodeView() {
    return ({ editor, node, getPos }) => {
      let currentNode = node;
      let activeIndex = 0;
      const viewId = `ramzy-tabs-${++tabsViewSequence}`;

      const dom = document.createElement('div');
      dom.setAttribute('data-type', 'tabs');
      dom.style.border = '1px solid var(--mantine-color-default-border)';
      dom.style.borderRadius = '8px';
      dom.style.overflow = 'hidden';
      dom.style.margin = '12px 0';
      dom.style.background = 'var(--mantine-color-body)';

      const tabList = document.createElement('div');
      tabList.setAttribute('data-tabs-list', '');
      tabList.setAttribute('contenteditable', 'false');
      tabList.style.display = 'flex';
      tabList.style.alignItems = 'center';
      tabList.style.gap = '4px';
      tabList.style.padding = '6px';
      tabList.style.overflowX = 'auto';
      tabList.style.borderBottom =
        '1px solid var(--mantine-color-default-border)';
      tabList.style.background = 'var(--mantine-color-default-hover)';

      const contentDOM = document.createElement('div');
      contentDOM.setAttribute('data-tabs-content', '');
      contentDOM.style.padding = '16px';
      contentDOM.style.minHeight = '72px';

      const actionContainer = document.createElement('div');
      actionContainer.setAttribute('contenteditable', 'false');
      actionContainer.hidden = true;

      dom.append(tabList, contentDOM, actionContainer);

      const resolveParentPos = () => {
        const position = getPos();
        return typeof position === 'number' ? position : null;
      };

      const syncPanels = () => {
        const panelElements = Array.from(contentDOM.children) as HTMLElement[];

        panelElements.forEach((panel, index) => {
          const active = index === activeIndex;
          panel.style.display = active ? 'block' : 'none';
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-hidden', active ? 'false' : 'true');
          panel.id = `${viewId}-panel-${index}`;
          panel.setAttribute('aria-labelledby', `${viewId}-tab-${index}`);
        });
      };

      const syncHeaderStates = () => {
        const headers = Array.from(
          tabList.querySelectorAll<HTMLElement>('[data-tab-index]'),
        );

        headers.forEach((header) => {
          const index = Number(header.dataset.tabIndex);
          const active = index === activeIndex;
          header.style.background = active
            ? 'var(--mantine-color-body)'
            : 'transparent';
          header.style.boxShadow = active
            ? '0 0 0 1px var(--mantine-color-default-border)'
            : 'none';
          header.setAttribute('aria-selected', active ? 'true' : 'false');
        });
      };

      const activateTab = (index: number) => {
        activeIndex = Math.min(
          Math.max(0, index),
          Math.max(0, currentNode.childCount - 1),
        );
        syncHeaderStates();
        syncPanels();
      };

      const focusPanel = (index: number) => {
        if (!editor.isEditable) return;

        const parentPos = resolveParentPos();
        if (parentPos === null || index >= currentNode.childCount) return;

        const position = childPosition(currentNode, parentPos, index) + 1;
        const selection = TextSelection.near(
          editor.state.doc.resolve(position),
          1,
        );
        editor.view.dispatch(editor.state.tr.setSelection(selection));
        editor.commands.focus();
      };

      const updatePanelLabel = (index: number, labelInput: string) => {
        if (!editor.isEditable || index >= currentNode.childCount) return;

        const parentPos = resolveParentPos();
        if (parentPos === null) return;

        const panel = currentNode.child(index);
        const position = childPosition(currentNode, parentPos, index);
        const label = labelInput.trim() || `Tab ${index + 1}`;
        const transaction = editor.state.tr.setNodeMarkup(position, undefined, {
          ...panel.attrs,
          label,
        });

        editor.view.dispatch(transaction);
      };

      const addPanel = () => {
        if (!editor.isEditable) return;

        const parentPos = resolveParentPos();
        if (parentPos === null) return;

        const tabPanelType = editor.state.schema.nodes.tabPanel;
        const paragraphType = editor.state.schema.nodes.paragraph;
        if (!tabPanelType || !paragraphType) return;

        const nextIndex = currentNode.childCount;
        const insertPos = parentPos + currentNode.nodeSize - 1;
        const panel = tabPanelType.create(
          { label: `Tab ${nextIndex + 1}` },
          paragraphType.create(),
        );

        editor.view.dispatch(editor.state.tr.insert(insertPos, panel));
        activeIndex = nextIndex;

        requestAnimationFrame(() => {
          activateTab(nextIndex);
          focusPanel(nextIndex);
        });
      };

      const removePanel = (index: number) => {
        if (
          !editor.isEditable ||
          currentNode.childCount <= 1 ||
          index >= currentNode.childCount
        ) {
          return;
        }

        const parentPos = resolveParentPos();
        if (parentPos === null) return;

        const panel = currentNode.child(index);
        const from = childPosition(currentNode, parentPos, index);
        const to = from + panel.nodeSize;

        if (index < activeIndex) activeIndex -= 1;
        else if (index === activeIndex) {
          activeIndex = Math.min(index, currentNode.childCount - 2);
        }

        editor.view.dispatch(editor.state.tr.delete(from, to));

        requestAnimationFrame(() => {
          activateTab(activeIndex);
          focusPanel(activeIndex);
        });
      };

      const duplicatePanel = (index: number) => {
        if (!editor.isEditable || index >= currentNode.childCount) return;
        const parentPos = resolveParentPos();
        if (parentPos === null) return;
        const panel = currentNode.child(index);
        const insertPos =
          childPosition(currentNode, parentPos, index) + panel.nodeSize;
        const duplicate = panel.type.create(
          {
            ...panel.attrs,
            label: `${panel.attrs.label || `Tab ${index + 1}`} copy`,
          },
          panel.content,
          panel.marks,
        );
        editor.view.dispatch(editor.state.tr.insert(insertPos, duplicate));
        activeIndex = index + 1;
        requestAnimationFrame(() => activateTab(activeIndex));
      };

      const movePanel = (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction;
        if (
          !editor.isEditable ||
          index >= currentNode.childCount ||
          targetIndex < 0 ||
          targetIndex >= currentNode.childCount
        )
          return;
        const parentPos = resolveParentPos();
        if (parentPos === null) return;
        const panel = currentNode.child(index);
        const sibling = currentNode.child(targetIndex);
        const from = childPosition(currentNode, parentPos, index);
        const to = from + panel.nodeSize;
        const transaction = editor.state.tr.delete(from, to);
        const target =
          direction === -1
            ? childPosition(currentNode, parentPos, targetIndex)
            : from + sibling.nodeSize;
        transaction.insert(target, panel);
        editor.view.dispatch(transaction);
        activeIndex = targetIndex;
        requestAnimationFrame(() => activateTab(activeIndex));
      };

      const renameActivePanel = () => {
        if (activeIndex >= currentNode.childCount) return;
        const panel = currentNode.child(activeIndex);
        const label = window.prompt(
          'Rename tab',
          String(panel.attrs.label || `Tab ${activeIndex + 1}`),
        );
        if (label !== null) updatePanelLabel(activeIndex, label);
      };

      const registerAction = (action: string, handler: () => void) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.ramzyElementAction = action;
        button.addEventListener('click', handler);
        actionContainer.appendChild(button);
      };

      registerAction('add-tab', addPanel);
      registerAction('rename-tab', renameActivePanel);
      registerAction('duplicate-tab', () => duplicatePanel(activeIndex));
      registerAction('move-tab-left', () => movePanel(activeIndex, -1));
      registerAction('move-tab-right', () => movePanel(activeIndex, 1));
      registerAction('remove-tab', () => removePanel(activeIndex));

      const renderHeaders = () => {
        tabList.replaceChildren();

        currentNode.forEach((panel, _offset, index) => {
          const header = document.createElement('div');
          header.dataset.tabIndex = String(index);
          header.setAttribute('role', 'tab');
          header.id = `${viewId}-tab-${index}`;
          header.setAttribute('aria-controls', `${viewId}-panel-${index}`);
          header.style.display = 'flex';
          header.style.alignItems = 'center';
          header.style.gap = '2px';
          header.style.padding = '3px';
          header.style.borderRadius = '6px';
          header.style.flex = '0 0 auto';

          const label = String(panel.attrs.label || `Tab ${index + 1}`);

          if (editor.isEditable) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = label;
            input.setAttribute('aria-label', `Tab ${index + 1} label`);
            input.spellcheck = false;
            input.style.width = `${Math.max(64, Math.min(180, label.length * 8 + 24))}px`;
            input.style.border = '0';
            input.style.outline = '0';
            input.style.background = 'transparent';
            input.style.color = 'var(--mantine-color-text)';
            input.style.font = 'inherit';
            input.style.fontSize = '13px';
            input.style.fontWeight = '500';
            input.style.padding = '4px 6px';

            input.addEventListener('focus', () => activateTab(index));
            input.addEventListener('input', () => {
              input.style.width = `${Math.max(
                64,
                Math.min(180, input.value.length * 8 + 24),
              )}px`;
            });
            input.addEventListener('change', () =>
              updatePanelLabel(index, input.value),
            );
            input.addEventListener('keydown', (event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                input.blur();
                focusPanel(index);
              }
            });

            header.appendChild(input);

            if (currentNode.childCount > 1) {
              const removeButton = document.createElement('button');
              removeButton.type = 'button';
              removeButton.textContent = '×';
              removeButton.setAttribute('aria-label', `Remove ${label}`);
              removeButton.style.border = '0';
              removeButton.style.background = 'transparent';
              removeButton.style.color = 'var(--mantine-color-dimmed)';
              removeButton.style.cursor = 'pointer';
              removeButton.style.fontSize = '16px';
              removeButton.style.lineHeight = '1';
              removeButton.style.padding = '2px 5px';
              removeButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                removePanel(index);
              });
              header.appendChild(removeButton);
            }
          } else {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = label;
            button.style.border = '0';
            button.style.background = 'transparent';
            button.style.color = 'var(--mantine-color-text)';
            button.style.cursor = 'pointer';
            button.style.font = 'inherit';
            button.style.fontSize = '13px';
            button.style.fontWeight = '500';
            button.style.padding = '4px 8px';
            button.addEventListener('click', () => activateTab(index));
            header.appendChild(button);
          }

          header.addEventListener('mousedown', () => activateTab(index));
          tabList.appendChild(header);
        });

        if (editor.isEditable) {
          const addButton = document.createElement('button');
          addButton.type = 'button';
          addButton.textContent = '+';
          addButton.setAttribute('aria-label', 'Add tab');
          addButton.style.border = '0';
          addButton.style.background = 'transparent';
          addButton.style.color = 'var(--mantine-color-dimmed)';
          addButton.style.cursor = 'pointer';
          addButton.style.fontSize = '18px';
          addButton.style.lineHeight = '1';
          addButton.style.padding = '4px 8px';
          addButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            addPanel();
          });
          tabList.appendChild(addButton);
        }

        syncHeaderStates();
        requestAnimationFrame(syncPanels);
      };

      const syncActiveFromSelection = () => {
        const parentPos = resolveParentPos();
        if (parentPos === null) return;

        const selectionPos = editor.state.selection.from;

        for (let index = 0; index < currentNode.childCount; index += 1) {
          const panel = currentNode.child(index);
          const from = childPosition(currentNode, parentPos, index);
          const to = from + panel.nodeSize;

          if (selectionPos > from && selectionPos < to) {
            if (activeIndex !== index) activateTab(index);
            return;
          }
        }
      };

      const observer = new MutationObserver(() => syncPanels());
      observer.observe(contentDOM, { childList: true });
      editor.on('selectionUpdate', syncActiveFromSelection);

      renderHeaders();

      return {
        dom,
        contentDOM,
        update: (updatedNode) => {
          if (updatedNode.type !== currentNode.type) return false;

          currentNode = updatedNode;
          activeIndex = Math.min(
            activeIndex,
            Math.max(0, currentNode.childCount - 1),
          );
          renderHeaders();
          return true;
        },
        stopEvent: (event) =>
          tabList.contains(event.target as globalThis.Node) ||
          actionContainer.contains(event.target as globalThis.Node),
        ignoreMutation: (mutation) =>
          tabList.contains(mutation.target as globalThis.Node),
        destroy: () => {
          observer.disconnect();
          editor.off('selectionUpdate', syncActiveFromSelection);
        },
      };
    };
  },
});
