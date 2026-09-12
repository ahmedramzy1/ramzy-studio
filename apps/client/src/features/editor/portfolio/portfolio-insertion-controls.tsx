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
    const overlayRect = overlay.getBoundingClientRect();
    return {
      ...(found as { position: number; end: number; emptyParagraph: boolean }),
      dom,
      left: rect.left - overlayRect.left - 44,
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
    const activate = (dom: HTMLElement | null) => {
      if (activeDom.current === dom) return;
      activeDom.current = dom;
      measure();
    };
    const pointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || editor.isDestroyed) return;
      modality.current = "mouse";
      if (overlayRef.current?.contains(event.target as globalThis.Node)) return;
      const block = blockFromTarget(editor.view.dom, event.target);
      if (block) {
        activate(block);
        return;
      }
      // Keep the control reachable across the small gap beside its block.
      const rect = activeDom.current?.getBoundingClientRect();
      if (
        rect &&
        event.clientX >= rect.left - 48 &&
        event.clientX <= rect.left &&
        event.clientY >= rect.top &&
        event.clientY <= rect.top + 36
      )
        return;
      activate(null);
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
    const leaveWindow = (event: PointerEvent) => {
      if (!event.relatedTarget && event.pointerType !== "touch") activate(null);
    };
    editor.on("transaction", measure);
    editor.on("update", measure);
    editor.on("selectionUpdate", selectBlock);
    editor.on("focus", selectBlock);
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
        <button
          type="button"
          className="ramzy-context-insert-control"
          aria-label={
            editor.isEmpty ? "Add content" : "Add content below this block"
          }
          title={
            editor.isEmpty ? "Add content" : "Add content below this block"
          }
          onMouseDown={(event) => event.preventDefault()}
          onClick={insertBelow}
          style={{
            position: "absolute",
            left: control.left,
            top: control.top,
            width: 36,
            height: 36,
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
          }}
        >
          <span aria-hidden style={{ fontSize: 20, lineHeight: 1 }}>
            +
          </span>
        </button>
      )}
      <style>{`
        .ramzy-context-insert-control:hover,.ramzy-context-insert-control:focus-visible {
          color:var(--mantine-primary-color-filled)!important;
          background:var(--mantine-primary-color-light)!important;
          outline:2px solid var(--mantine-primary-color-filled);outline-offset:2px;
        }
        @media(pointer:coarse){.ramzy-context-insert-control{min-width:44px;min-height:44px}}
      `}</style>
    </div>
  );
}
