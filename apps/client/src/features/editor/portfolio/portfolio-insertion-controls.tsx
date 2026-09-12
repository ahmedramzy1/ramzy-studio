import type { Editor } from "@tiptap/core";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface InsertionTarget {
  dom: HTMLElement;
  position: number;
  end: number;
  emptyParagraph: boolean;
  left: number;
  top: number;
}

// Resolve a whole block, never a table cell, media item or nested inline node.
// Direct column children retain insertion inside their own column.
function blockFromTarget(root: HTMLElement, target: EventTarget | null) {
  if (!(target instanceof Element) || !root.contains(target)) return null;
  let block: HTMLElement | null =
    target instanceof HTMLElement ? target : target.parentElement;
  while (block && block !== root) {
    const parent = block.parentElement;
    if (parent === root || parent?.dataset.type === "column") return block;
    block = parent;
  }
  return null;
}

export function PortfolioInsertionControls({ editor }: { editor: Editor }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const activeDom = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const modality = useRef("mouse");
  const dragging = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [control, setControl] = useState<InsertionTarget | null>(null);

  const resolve = useCallback((): InsertionTarget | null => {
    const overlay = overlayRef.current;
    if (!overlay || editor.isDestroyed || !editor.isEditable) return null;
    const root = editor.view.dom;
    const dom =
      activeDom.current ?? (editor.isEmpty ? root.firstElementChild : null);
    if (!(dom instanceof HTMLElement) || !root.contains(dom)) return null;
    let found: {
      position: number;
      end: number;
      emptyParagraph: boolean;
    } | null = null;
    editor.state.doc.descendants((node, position) => {
      if (found) return false;
      if (editor.view.nodeDOM(position) === dom) {
        found = {
          position,
          end: position + node.nodeSize,
          emptyParagraph:
            node.type.name === "paragraph" && node.content.size === 0,
        };
        return false;
      }
      return !node.isAtom;
    });
    if (!found) return null;
    const rect = dom.getBoundingClientRect();
    let row = dom;
    while (row.parentElement && row.parentElement !== root)
      row = row.parentElement;
    const rowRect = row.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    return {
      ...(found as { position: number; end: number; emptyParagraph: boolean }),
      dom,
      left: rowRect.left - overlayRect.left - 52,
      top: rect.top - overlayRect.top,
    };
  }, [editor]);

  const measure = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      setControl(resolve());
    });
  }, [resolve]);

  useEffect(() => {
    const cancelClose = () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
      closeTimer.current = null;
    };
    const activate = (dom: HTMLElement | null) => {
      cancelClose();
      if (activeDom.current === dom) return;
      activeDom.current = dom;
      measure();
    };
    const pointerMove = (event: PointerEvent) => {
      if (
        event.pointerType === "touch" ||
        editor.isDestroyed ||
        dragging.current
      )
        return;
      modality.current = "mouse";
      if (overlayRef.current?.contains(event.target as globalThis.Node)) {
        cancelClose();
        return;
      }
      const block = blockFromTarget(editor.view.dom, event.target);
      if (block) {
        activate(block);
        return;
      }
      // The whole block-to-rail corridor is traversable, including the lower
      // edge of tall blocks and the gap between the two controls.
      const rect = activeDom.current?.getBoundingClientRect();
      const rail = overlayRef.current
        ?.querySelector("[data-ramzy-action-rail]")
        ?.getBoundingClientRect();
      if (
        rect &&
        (overlayRef.current?.contains(document.activeElement) ||
          (event.clientX >=
            Math.min(rail?.left || rect.left - 52, rect.left) - 8 &&
            event.clientX <= rect.left + 8 &&
            event.clientY >= Math.min(rail?.top || rect.top, rect.top) - 8 &&
            event.clientY <=
              Math.max(rail?.bottom || rect.top + 96, rect.bottom) + 8))
      ) {
        cancelClose();
        return;
      }
      if (closeTimer.current === null) {
        closeTimer.current = setTimeout(() => activate(null), 200);
      }
    };
    const pointerDown = (event: PointerEvent) => {
      if (editor.isDestroyed) return;
      modality.current = event.pointerType || "mouse";
      if (overlayRef.current?.contains(event.target as globalThis.Node)) return;
      activate(blockFromTarget(editor.view.dom, event.target));
    };
    const selectBlock = () => {
      if (
        modality.current === "mouse" ||
        !editor.isFocused ||
        editor.isDestroyed
      )
        return;
      const { $from } = editor.state.selection;
      if ($from.depth < 1) return;
      let depth = 1;
      for (let d = 1; d < $from.depth; d++) {
        if ($from.node(d).type.name === "column") depth = d + 1;
      }
      const dom = editor.view.nodeDOM($from.before(depth));
      activate(dom instanceof HTMLElement ? dom : null);
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        activate(null);
        return;
      }
      modality.current = "keyboard";
      selectBlock();
    };
    const focusOut = (event: FocusEvent) => {
      if (editor.isDestroyed) return;
      const next = event.relatedTarget as globalThis.Node | null;
      if (
        next &&
        (editor.view.dom.contains(next) || overlayRef.current?.contains(next))
      )
        return;
      activate(null);
    };
    const dragEnd = () => {
      dragging.current = false;
      measure();
    };
    const leaveWindow = (event: PointerEvent) => {
      if (
        !dragging.current &&
        !event.relatedTarget &&
        event.pointerType !== "touch"
      )
        activate(null);
    };
    editor.on("transaction", measure);
    editor.on("update", measure);
    editor.on("selectionUpdate", selectBlock);
    editor.on("focus", selectBlock);
    document.addEventListener("dragend", dragEnd);
    document.addEventListener("drop", dragEnd);
    document.addEventListener("pointermove", pointerMove);
    document.addEventListener("pointerdown", pointerDown);
    document.addEventListener("pointerout", leaveWindow);
    document.addEventListener("keydown", keyDown);
    document.addEventListener("focusout", focusOut);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    const observer = new ResizeObserver(measure);
    let mountFrame: number | null = null;
    const observeWhenMounted = () => {
      mountFrame = null;
      // Preserve the iPad/React effect-replay fix: never access an absent view.
      if (editor.isDestroyed || !editor.view.dom.isConnected) {
        mountFrame = requestAnimationFrame(observeWhenMounted);
        return;
      }
      observer.observe(editor.view.dom);
      measure();
    };
    observeWhenMounted();
    return () => {
      cancelClose();
      document.removeEventListener("dragend", dragEnd);
      document.removeEventListener("drop", dragEnd);
      editor.off("transaction", measure);
      editor.off("update", measure);
      editor.off("selectionUpdate", selectBlock);
      editor.off("focus", selectBlock);
      document.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("pointerdown", pointerDown);
      document.removeEventListener("pointerout", leaveWindow);
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("focusout", focusOut);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      observer.disconnect();
      if (mountFrame !== null) cancelAnimationFrame(mountFrame);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [editor, measure]);

  function insertBelow() {
    // Resolve again at click time, so edits before this block cannot stale the position.
    const target = resolve();
    if (!target) return;
    const position = target.emptyParagraph ? target.position + 1 : target.end;
    editor
      .chain()
      .focus()
      .insertContentAt(
        position,
        target.emptyParagraph
          ? "/"
          : {
              type: "paragraph",
              content: [{ type: "text", text: "/" }],
            },
      )
      .setTextSelection(position + (target.emptyParagraph ? 1 : 2))
      .run();
    activeDom.current = null;
    setControl(null);
  }

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
      {control && (
        <div
          data-ramzy-action-rail
          style={{
            position: "absolute",
            left: control.left,
            top: control.top,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            pointerEvents: "auto",
          }}
          onPointerEnter={() => {
            if (closeTimer.current !== null) clearTimeout(closeTimer.current);
            closeTimer.current = null;
          }}
        >
          <button
            type="button"
            className="ramzy-block-action ramzy-context-insert-control"
            aria-label={
              editor.isEmpty ? "Add content" : "Add content below this block"
            }
            title={
              editor.isEmpty ? "Add content" : "Add content below this block"
            }
            onMouseDown={(event) => event.preventDefault()}
            onClick={insertBelow}
          >
            <svg
              aria-hidden
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9 3v12M3 9h12" />
            </svg>
          </button>
          <button
            type="button"
            className="ramzy-block-action ramzy-context-drag-control"
            data-ramzy-portfolio-drag-handle
            data-ramzy-node-position={control.position}
            aria-label="Move block"
            title="Drag to move block; use Alt + Arrow Up or Down to reorder"
            onMouseDown={(event) => event.preventDefault()}
            onDragStart={() => {
              dragging.current = true;
              if (closeTimer.current !== null) clearTimeout(closeTimer.current);
              closeTimer.current = null;
            }}
            onKeyDown={(event) => {
              if (
                !event.altKey ||
                !["ArrowUp", "ArrowDown"].includes(event.key)
              )
                return;
              event.preventDefault();
              const target = resolve();
              if (!target) return;
              const { doc } = editor.state;
              const $position = doc.resolve(target.position);
              const index = $position.index();
              const node = doc.nodeAt(target.position);
              const parent = $position.parent;
              const up = event.key === "ArrowUp";
              if (!node || (up ? index === 0 : index >= parent.childCount - 1))
                return;
              const sibling = parent.child(up ? index - 1 : index + 1);
              const from = up
                ? target.position - sibling.nodeSize
                : target.position;
              const to = up ? target.end : target.end + sibling.nodeSize;
              const tr = editor.state.tr.replaceWith(
                from,
                to,
                up ? [node, sibling] : [sibling, node],
              );
              editor.view.dispatch(tr);
              activeDom.current = editor.view.nodeDOM(
                up ? from : from + sibling.nodeSize,
              ) as HTMLElement;
              measure();
            }}
          >
            <svg
              aria-hidden
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="currentColor"
            >
              {[4, 9, 14].flatMap((y) =>
                [6, 12].map((x) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="1.25" />
                )),
              )}
            </svg>
          </button>
        </div>
      )}
      <style>{`
        .ramzy-block-action {
          width:36px;height:36px;flex:none;padding:0;display:grid;place-items:center;
          border:1px solid var(--mantine-color-default-border);border-radius:8px;
          background:var(--mantine-color-body);color:var(--mantine-color-text);
          box-shadow:var(--ramzy-element-shadow,var(--mantine-shadow-sm));cursor:pointer;
        }
        .ramzy-context-drag-control{cursor:grab;touch-action:none}
        .ramzy-context-drag-control:active{cursor:grabbing}
        .ramzy-block-action:hover,.ramzy-block-action:focus-visible {
          color:var(--mantine-primary-color-filled);
          background:var(--mantine-primary-color-light);
        }
        .ramzy-block-action:focus-visible{outline:2px solid var(--mantine-primary-color-filled);outline-offset:2px}
        [data-ramzy-block-actions-host] .ramzy-block-drag-handle{display:none!important}
        @media(pointer:coarse){.ramzy-block-action{width:44px;height:44px}}
      `}</style>
    </div>
  );
}
