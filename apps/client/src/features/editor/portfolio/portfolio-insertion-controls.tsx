import type { Editor } from "@tiptap/core";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface InsertionPoint {
  position: number;
  top: number;
}

export function PortfolioInsertionControls({ editor }: { editor: Editor }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [points, setPoints] = useState<InsertionPoint[]>([]);

  const measure = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const overlay = overlayRef.current;
      if (!overlay || editor.isDestroyed) return;
      const overlayRect = overlay.getBoundingClientRect();
      const blocks: Array<{ position: number; rect: DOMRect }> = [];

      editor.state.doc.forEach((node, offset) => {
        const dom = editor.view.nodeDOM(offset);
        if (dom instanceof HTMLElement) {
          blocks.push({ position: offset + node.nodeSize, rect: dom.getBoundingClientRect() });
        }
      });

      setPoints(
        blocks.map((block, index) => {
          const next = blocks[index + 1];
          const boundaryY = next
            ? block.rect.bottom + Math.max(0, next.rect.top - block.rect.bottom) / 2
            : block.rect.bottom + 14;
          return { position: block.position, top: boundaryY - overlayRect.top };
        }),
      );
    });
  }, [editor]);

  useEffect(() => {
    measure();
    editor.on("transaction", measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    const observer = new ResizeObserver(measure);
    observer.observe(editor.view.dom);
    return () => {
      editor.off("transaction", measure);
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

  return (
    <div ref={overlayRef} aria-label="Insert content between blocks" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {points.map((point) => (
        <button
          key={`${point.position}-${Math.round(point.top)}`}
          type="button"
          className="ramzy-block-insert-control"
          aria-label="Add content here"
          title="Add content here"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => insertAt(point.position)}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: point.top,
            height: 28,
            padding: 0,
            transform: "translateY(-50%)",
            border: 0,
            background: "transparent",
            color: "var(--mantine-primary-color-filled)",
            cursor: "pointer",
            pointerEvents: "auto",
            opacity: 0.42,
          }}
        >
          <span style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "currentColor", opacity: 0.34 }} />
          <span style={{ position: "relative", width: 24, height: 24, margin: "0 auto", border: "1px solid currentColor", borderRadius: 999, background: "var(--mantine-color-body)", display: "grid", placeItems: "center", fontSize: 18, lineHeight: 1 }}>+</span>
        </button>
      ))}
      <style>{`.ramzy-block-insert-control:hover,.ramzy-block-insert-control:focus-visible{opacity:1!important}.ramzy-block-insert-control:focus-visible{outline:2px solid var(--mantine-primary-color-filled);outline-offset:2px}`}</style>
    </div>
  );
}
