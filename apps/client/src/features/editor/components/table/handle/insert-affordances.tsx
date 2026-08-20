import React, { useCallback, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";
import { useFloating, autoUpdate, hide, offset } from "@floating-ui/react";
import { UnstyledButton } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { isEditorReady } from "@docmost/editor-ext";
import classes from "./handle.module.css";

interface InsertAffordancesProps {
  editor: Editor;
  cellPos: number;
  colAnchorPos: number;
  rowAnchorPos: number;
}

export const InsertAffordances = React.memo(function InsertAffordances({
  editor,
  cellPos,
  colAnchorPos,
  rowAnchorPos,
}: InsertAffordancesProps) {
  const columnAnchor = isEditorReady(editor)
    ? editor.view.nodeDOM(colAnchorPos)
    : null;
  const rowAnchor = isEditorReady(editor)
    ? editor.view.nodeDOM(rowAnchorPos)
    : null;

  const columnCell =
    columnAnchor instanceof HTMLElement ? columnAnchor : null;
  const rowCell = rowAnchor instanceof HTMLElement ? rowAnchor : null;

  const columnFloating = useFloating({
    placement: "top-end",
    middleware: [
      offset({ mainAxis: -9, crossAxis: 9 }),
      hide(),
    ],
    whileElementsMounted: autoUpdate,
    strategy: "absolute",
  });

  const rowFloating = useFloating({
    placement: "bottom-start",
    middleware: [
      offset({ mainAxis: -9, crossAxis: -9 }),
      hide(),
    ],
    whileElementsMounted: autoUpdate,
    strategy: "absolute",
  });

  useEffect(() => {
    columnFloating.refs.setReference(columnCell);
  }, [columnCell, columnFloating.refs]);

  useEffect(() => {
    rowFloating.refs.setReference(rowCell);
  }, [rowCell, rowFloating.refs]);

  const putCursorInHoveredCell = useCallback(() => {
    if (!isEditorReady(editor)) return false;

    try {
      const $inside = editor.state.doc.resolve(cellPos + 1);
      const selection = TextSelection.near($inside, 1);
      editor.view.dispatch(editor.state.tr.setSelection(selection));
      return true;
    } catch {
      return false;
    }
  }, [editor, cellPos]);

  const insertColumnAfter = useCallback(() => {
    if (!putCursorInHoveredCell()) return;
    editor.chain().focus().addColumnAfter().run();
    editor.commands.unfreezeHandles();
  }, [editor, putCursorInHoveredCell]);

  const insertRowAfter = useCallback(() => {
    if (!putCursorInHoveredCell()) return;
    editor.chain().focus().addRowAfter().run();
    editor.commands.unfreezeHandles();
  }, [editor, putCursorInHoveredCell]);

  const preserveHover = useCallback(() => {
    if (!isEditorReady(editor)) return;
    editor.commands.freezeHandles();
  }, [editor]);

  const releaseHover = useCallback(() => {
    if (!isEditorReady(editor)) return;
    editor.commands.unfreezeHandles();
  }, [editor]);

  if (!columnCell || !rowCell) return null;

  const columnHidden =
    !!columnFloating.middlewareData.hide?.referenceHidden;
  const rowHidden = !!rowFloating.middlewareData.hide?.referenceHidden;

  return (
    <>
      <UnstyledButton
        ref={columnFloating.refs.setFloating}
        style={{
          ...columnFloating.floatingStyles,
          ...(columnHidden ? { visibility: "hidden" as const } : {}),
        }}
        className={classes.insertAffordance}
        aria-label="Insert column after"
        title="Insert column"
        onMouseEnter={preserveHover}
        onMouseLeave={releaseHover}
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          insertColumnAfter();
        }}
      >
        <IconPlus size={12} stroke={2.4} />
      </UnstyledButton>

      <UnstyledButton
        ref={rowFloating.refs.setFloating}
        style={{
          ...rowFloating.floatingStyles,
          ...(rowHidden ? { visibility: "hidden" as const } : {}),
        }}
        className={classes.insertAffordance}
        aria-label="Insert row after"
        title="Insert row"
        onMouseEnter={preserveHover}
        onMouseLeave={releaseHover}
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          insertRowAfter();
        }}
      >
        <IconPlus size={12} stroke={2.4} />
      </UnstyledButton>
    </>
  );
});
