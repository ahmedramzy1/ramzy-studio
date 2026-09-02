import type { Editor } from "@tiptap/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { portfolioColumnInsertionPoints } from "./portfolio-column-insertion";

interface BlockControl {
  position: number;
  top: number;
  bottom: number;
  insertionTop: number;
  followsColumns: boolean;
  isEmptyTextBlock: boolean;
  usesDedicatedHandle: boolean;
}

interface ColumnControl {
  key: string;
  insertionPosition: number;
  emptyParagraphPosition: number | null;
  left: number;
  top: number;
}

export function PortfolioInsertionControls({ editor }: { editor: Editor }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [blocks, setBlocks] = useState<BlockControl[]>([]);
  const [columns, setColumns] = useState<ColumnControl[]>([]);
  const [lastTop, setLastTop] = useState(0);
  const [isDocumentEmpty, setIsDocumentEmpty] = useState(editor.isEmpty);
  const [isEditingLastBlock, setIsEditingLastBlock] = useState(false);
  const [editingBlockPosition, setEditingBlockPosition] = useState<
    number | null
  >(null);
  const [hasTrailingEmptyTextBlock, setHasTrailingEmptyTextBlock] =
    useState(false);

  const measure = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const overlay = overlayRef.current;
      if (!overlay || editor.isDestroyed) return;
      const overlayRect = overlay.getBoundingClientRect();
      const nextBlocks: BlockControl[] = [];
      const nextColumns: ColumnControl[] = [];
      let previousTopLevelType: string | null = null;

      editor.state.doc.forEach((node, offset) => {
        const dom = editor.view.nodeDOM(offset);
        if (dom instanceof HTMLElement) {
          const rect = dom.getBoundingClientRect();
          const top = rect.top - overlayRect.top;
          const previous = nextBlocks[nextBlocks.length - 1];
          nextBlocks.push({
            position: offset,
            top,
            bottom: rect.bottom - overlayRect.top,
            insertionTop: previous
              ? (previous.bottom + top) / 2 - 14
              : top - 38,
            followsColumns: previousTopLevelType === "columns",
            isEmptyTextBlock: node.isTextblock && node.textContent.length === 0,
            usesDedicatedHandle: [
              "video",
              "audio",
              "image",
              "mediaPlaylist",
              "photoGrid",
              "photoAlbum",
            ].includes(node.type.name),
          });

          if (node.type.name === "columns") {
            const columnElements = Array.from(dom.children).filter(
              (child): child is HTMLElement =>
                child instanceof HTMLElement && child.dataset.type === "column",
            );
            portfolioColumnInsertionPoints(node, offset).forEach((point) => {
              const columnIndex = point.columnIndex;
              const columnElement = columnElements[columnIndex];
              if (columnElement) {
                const columnRect = columnElement.getBoundingClientRect();
                nextColumns.push({
                  key: `${offset}-${columnIndex}`,
                  insertionPosition: point.insertionPosition,
                  emptyParagraphPosition: point.emptyParagraphPosition,
                  left:
                    columnRect.left -
                    overlayRect.left +
                    columnRect.width / 2 -
                    14,
                  top: columnRect.bottom - overlayRect.top + 6,
                });
              }
            });
          }
        }
        previousTopLevelType = node.type.name;
      });

      const last = nextBlocks[nextBlocks.length - 1];
      const empty = editor.isEmpty;
      const first = nextBlocks[0];
      const lastNode = last ? editor.state.doc.nodeAt(last.position) : null;
      const selection = editor.state.selection;
      const selectionBlockPosition =
        selection.$from.depth > 0 ? selection.$from.before(1) : -1;
      const lastDom = last ? editor.view.nodeDOM(last.position) : null;
      const finalTop =
        empty && first
          ? first.top
          : lastDom instanceof HTMLElement
            ? lastDom.getBoundingClientRect().bottom - overlayRect.top + 10
            : 8;

      setBlocks(nextBlocks);
      setColumns(nextColumns);
      setLastTop(finalTop);
      setIsDocumentEmpty(empty);
      setEditingBlockPosition(
        editor.isFocused && selectionBlockPosition >= 0
          ? selectionBlockPosition
          : null,
      );
      setIsEditingLastBlock(
        editor.isFocused &&
          Boolean(lastNode?.isTextblock) &&
          selectionBlockPosition === last?.position,
      );
      setHasTrailingEmptyTextBlock(
        Boolean(lastNode?.isTextblock && !lastNode.textContent),
      );
    });
  }, [editor]);

  useEffect(() => {
    measure();
    editor.on("transaction", measure);
    editor.on("selectionUpdate", measure);
    editor.on("focus", measure);
    editor.on("blur", measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    const observer = new ResizeObserver(measure);
    observer.observe(editor.view.dom);
    return () => {
      editor.off("transaction", measure);
      editor.off("selectionUpdate", measure);
      editor.off("focus", measure);
      editor.off("blur", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [editor, measure]);

  function insertAt(position: number) {
    if (editor.isDestroyed || !editor.isEditable) return;
    editor
      .chain()
      .focus()
      .insertContentAt(position, {
        type: "paragraph",
        content: [{ type: "text", text: "/" }],
      })
      .setTextSelection(position + 2)
      .run();
  }

  function insertAtEnd() {
    if (editor.isDestroyed || !editor.isEditable) return;
    if (editor.isEmpty) {
      editor.chain().focus("start").insertContent("/").run();
      return;
    }
    insertAt(editor.state.doc.content.size);
  }

  function insertInColumn(control: ColumnControl) {
    if (editor.isDestroyed || !editor.isEditable) return;
    if (control.emptyParagraphPosition !== null) {
      editor
        .chain()
        .focus()
        .insertContentAt(control.emptyParagraphPosition + 1, "/")
        .setTextSelection(control.emptyParagraphPosition + 2)
        .run();
      return;
    }
    insertAt(control.insertionPosition);
  }

  const controlButtonStyle: React.CSSProperties = {
    width: 28,
    height: 28,
    border: 0,
    borderRadius: 6,
    background: "var(--mantine-color-body)",
    color: "var(--mantine-color-dimmed)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    pointerEvents: "auto",
    padding: 0,
    boxShadow: "0 1px 2px rgba(0,0,0,.08)",
  };

  return (
    <div
      ref={overlayRef}
      aria-label="Block actions"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 25,
      }}
    >
      {!isDocumentEmpty &&
        blocks.map((block) => (
          <React.Fragment key={`${block.position}-${Math.round(block.top)}`}>
            {!block.followsColumns &&
            !block.isEmptyTextBlock &&
            block.position !== editingBlockPosition ? (
              <button
                type="button"
                className="ramzy-boundary-insert-control"
                style={{
                  ...controlButtonStyle,
                  position: "absolute",
                  left: block.usesDedicatedHandle ? -76 : -54,
                  top: block.insertionTop,
                }}
                aria-label="Insert content here"
                title="Insert content here"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => insertAt(block.position)}
              >
                <span aria-hidden style={{ fontSize: 20, lineHeight: 1 }}>
                  +
                </span>
              </button>
            ) : null}
          </React.Fragment>
        ))}

      {!isDocumentEmpty &&
        columns.map((column) => (
          <button
            key={column.key}
            type="button"
            className="ramzy-column-insert-control"
            style={{
              ...controlButtonStyle,
              position: "absolute",
              left: column.left,
              top: column.top,
            }}
            aria-label="Add content to column"
            title="Add content to column"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => insertInColumn(column)}
          >
            <span aria-hidden style={{ fontSize: 20, lineHeight: 1 }}>
              +
            </span>
          </button>
        ))}

      {isDocumentEmpty ||
      (!isEditingLastBlock && !hasTrailingEmptyTextBlock) ? (
        <div
          className="ramzy-final-insert-row"
          style={{
            position: "absolute",
            left: -68,
            right: 0,
            top: lastTop,
            minHeight: 38,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            pointerEvents: "none",
          }}
        >
          <button
            type="button"
            style={controlButtonStyle}
            aria-label="Add content below"
            title="Add content below"
            onMouseDown={(event) => event.preventDefault()}
            onClick={insertAtEnd}
          >
            <span aria-hidden style={{ fontSize: 20, lineHeight: 1 }}>
              +
            </span>
          </button>
          {!isDocumentEmpty ? (
            <button
              type="button"
              className="ramzy-final-insert-prompt"
              onMouseDown={(event) => event.preventDefault()}
              onClick={insertAtEnd}
              style={{
                border: 0,
                background: "transparent",
                color: "var(--mantine-color-dimmed)",
                padding: "5px 0",
                cursor: "text",
                opacity: 0,
                pointerEvents: "auto",
              }}
            >
              Type / to insert content
            </button>
          ) : null}
        </div>
      ) : null}

      <style>{`
        .ramzy-boundary-insert-control{opacity:.22;transition:opacity 120ms ease}
        .ramzy-boundary-insert-control:hover,.ramzy-boundary-insert-control:focus-visible{opacity:1;color:var(--mantine-primary-color-filled)!important;background:var(--mantine-primary-color-light)!important}
        .ramzy-final-insert-row button:first-child:hover{color:var(--mantine-primary-color-filled)!important;background:var(--mantine-primary-color-light)!important}
        .ramzy-final-insert-row:hover .ramzy-final-insert-prompt,.ramzy-final-insert-row:focus-within .ramzy-final-insert-prompt{opacity:1!important}
      `}</style>
    </div>
  );
}
