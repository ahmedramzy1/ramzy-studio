import { useEffect, useState } from "react";
import {
  NodeViewContent,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";

const MIN_TABS = 2;
const MAX_TABS = 8;

export default function TabsView({ node, editor, getPos }: NodeViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex((current) =>
      Math.max(0, Math.min(current, Math.max(0, node.childCount - 1))),
    );
  }, [node.childCount]);

  const getParentPos = () => {
    const pos = getPos();
    return typeof pos === "number" ? pos : null;
  };

  const getTabPos = (index: number) => {
    const parentPos = getParentPos();
    if (parentPos === null || index < 0 || index >= node.childCount) {
      return null;
    }

    let offset = 0;
    for (let i = 0; i < index; i += 1) {
      offset += node.child(i).nodeSize;
    }
    return parentPos + 1 + offset;
  };

  const renameTab = (index: number) => {
    if (!editor.isEditable) return;
    const tab = node.child(index);
    const currentTitle = tab.attrs.title || `Tab ${index + 1}`;
    const nextTitle = window.prompt("Rename tab", currentTitle);
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
    if (!editor.isEditable || node.childCount <= MIN_TABS) return;
    const tabPos = getTabPos(index);
    if (tabPos === null) return;

    const tab = node.child(index);
    editor.view.dispatch(editor.state.tr.delete(tabPos, tabPos + tab.nodeSize));
    setActiveIndex((current) =>
      Math.max(0, Math.min(current, node.childCount - 2)),
    );
  };

  const addTab = () => {
    if (!editor.isEditable || node.childCount >= MAX_TABS) return;
    const parentPos = getParentPos();
    if (parentPos === null) return;

    const newIndex = node.childCount;
    const insertPos = parentPos + node.nodeSize - 1;

    editor
      .chain()
      .insertContentAt(insertPos, {
        type: "tab",
        attrs: { title: `Tab ${newIndex + 1}` },
        content: [{ type: "paragraph" }],
      })
      .run();

    setActiveIndex(newIndex);
  };

  return (
    <NodeViewWrapper
      className="ramzy-tabs"
      data-type="tabs"
      data-active-index={activeIndex}
    >
      <div
        className="ramzy-tabs__list"
        role="tablist"
        contentEditable={false}
        onMouseDown={(event) => event.preventDefault()}
      >
        {Array.from({ length: node.childCount }, (_, index) => {
          const tab = node.child(index);
          const title = tab.attrs.title || `Tab ${index + 1}`;
          const isActive = index === activeIndex;

          return (
            <div className="ramzy-tabs__item" key={`${index}-${title}`}>
              <button
                type="button"
                className="ramzy-tabs__trigger"
                role="tab"
                aria-selected={isActive}
                data-active={isActive ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
                onDoubleClick={() => renameTab(index)}
              >
                {title}
              </button>
              {editor.isEditable && node.childCount > MIN_TABS && (
                <button
                  type="button"
                  className="ramzy-tabs__remove"
                  aria-label={`Remove ${title}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeTab(index);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}

        {editor.isEditable && node.childCount < MAX_TABS && (
          <button
            type="button"
            className="ramzy-tabs__add"
            aria-label="Add tab"
            onClick={addTab}
          >
            +
          </button>
        )}
      </div>

      <NodeViewContent className="ramzy-tabs__content" />
    </NodeViewWrapper>
  );
}
