import type { Editor } from "@tiptap/core";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface SectionChoice {
  position: number;
  end: number;
  title: string;
}

interface BlockControl {
  position: number;
  size: number;
  top: number;
  isSectionHeading: boolean;
  usesDedicatedHandle: boolean;
}

interface OpenMenu extends BlockControl {
  view: "root" | "sections";
}

export function PortfolioInsertionControls({ editor }: { editor: Editor }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [blocks, setBlocks] = useState<BlockControl[]>([]);
  const [lastTop, setLastTop] = useState(0);
  const [isDocumentEmpty, setIsDocumentEmpty] = useState(editor.isEmpty);
  const [sections, setSections] = useState<SectionChoice[]>([]);
  const [openMenu, setOpenMenu] = useState<OpenMenu | null>(null);

  const measure = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const overlay = overlayRef.current;
      if (!overlay || editor.isDestroyed) return;
      const overlayRect = overlay.getBoundingClientRect();
      const nextBlocks: BlockControl[] = [];
      const nextSections: SectionChoice[] = [];
      const docNodes: Array<{
        position: number;
        type: string;
        level?: number;
        text: string;
      }> = [];

      editor.state.doc.forEach((node, offset) => {
        docNodes.push({
          position: offset,
          type: node.type.name,
          level: node.attrs.level,
          text: node.textContent,
        });
        const dom = editor.view.nodeDOM(offset);
        if (dom instanceof HTMLElement) {
          const rect = dom.getBoundingClientRect();
          nextBlocks.push({
            position: offset,
            size: node.nodeSize,
            top: rect.top - overlayRect.top,
            isSectionHeading:
              node.type.name === "heading" && node.attrs.level === 1,
            usesDedicatedHandle: [
              "video",
              "audio",
              "image",
              "mediaPlaylist",
              "photoGrid",
              "photoAlbum",
            ].includes(node.type.name),
          });
        }
      });

      docNodes.forEach((entry, index) => {
        if (entry.type !== "heading" || entry.level !== 1) return;
        const nextHeading = docNodes
          .slice(index + 1)
          .find(
            (candidate) =>
              candidate.type === "heading" && candidate.level === 1,
          );
        nextSections.push({
          position: entry.position,
          end: nextHeading?.position ?? editor.state.doc.content.size,
          title: entry.text.trim() || "Untitled section",
        });
      });

      const last = nextBlocks[nextBlocks.length - 1];
      const empty = editor.isEmpty;
      const first = nextBlocks[0];
      const lastDom = last ? editor.view.nodeDOM(last.position) : null;
      const finalTop =
        empty && first
          ? first.top
          : lastDom instanceof HTMLElement
          ? lastDom.getBoundingClientRect().bottom - overlayRect.top + 10
          : 8;

      setBlocks(nextBlocks);
      setSections(nextSections);
      setLastTop(finalTop);
      setIsDocumentEmpty(empty);
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

  useEffect(() => {
    if (!openMenu) return;
    const close = (event: MouseEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("[data-ramzy-block-menu]")
      ) {
        return;
      }
      setOpenMenu(null);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [openMenu]);

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

  function deleteBlock(control: BlockControl) {
    const node = editor.state.doc.nodeAt(control.position);
    if (!node) return;
    const tr = editor.state.tr.delete(
      control.position,
      control.position + node.nodeSize,
    );
    if (tr.doc.childCount === 0) {
      tr.insert(0, editor.schema.nodes.paragraph.create());
    }
    editor.view.dispatch(tr);
    editor.commands.focus();
    setOpenMenu(null);
  }

  function moveToExistingSection(
    control: BlockControl,
    section: SectionChoice,
  ) {
    const node = editor.state.doc.nodeAt(control.position);
    if (!node || control.isSectionHeading) return;
    const originalSize = node.nodeSize;
    let target = section.end;
    const tr = editor.state.tr.delete(
      control.position,
      control.position + originalSize,
    );
    if (control.position < target) target -= originalSize;
    target = Math.max(0, Math.min(target, tr.doc.content.size));
    tr.insert(target, node);
    editor.view.dispatch(tr.scrollIntoView());
    editor.commands.focus();
    setOpenMenu(null);
  }

  function moveToNewSection(control: BlockControl) {
    const node = editor.state.doc.nodeAt(control.position);
    if (!node || control.isSectionHeading) return;
    const title = window.prompt("Name the new section", "New section")?.trim();
    if (!title) return;
    const tr = editor.state.tr.delete(
      control.position,
      control.position + node.nodeSize,
    );
    const heading = editor.schema.nodes.heading.create(
      { level: 1 },
      editor.schema.text(title),
    );
    const end = tr.doc.content.size;
    tr.insert(end, heading);
    tr.insert(end + heading.nodeSize, node);
    editor.view.dispatch(tr.scrollIntoView());
    editor.commands.focus();
    setOpenMenu(null);
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
      {!isDocumentEmpty && blocks.map((block) => (
        <div
          key={`${block.position}-${Math.round(block.top)}`}
          className="ramzy-inline-block-controls"
          style={{
            position: "absolute",
            left: block.usesDedicatedHandle ? -76 : -54,
            right: -34,
            top: block.top,
            height: 28,
            pointerEvents: "none",
          }}
        >
          <button
            type="button"
            style={controlButtonStyle}
            aria-label="Insert content above"
            title="Insert content above"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => insertAt(block.position)}
          >
            <span aria-hidden style={{ fontSize: 20, lineHeight: 1 }}>
              +
            </span>
          </button>
          <button
            type="button"
            style={{
              ...controlButtonStyle,
              position: "absolute",
              right: 0,
              top: 0,
            }}
            aria-label="Element actions"
            title="Element actions"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              setOpenMenu((current) =>
                current?.position === block.position
                  ? null
                  : { ...block, view: "root" },
              )
            }
          >
            <span aria-hidden style={{ fontSize: 13, letterSpacing: -1 }}>
              •••
            </span>
          </button>
        </div>
      ))}

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
          pointerEvents: "auto",
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
          }}
        >
          Type / to insert content
        </button>
      </div>

      {openMenu ? (
        <div
          data-ramzy-block-menu
          role="menu"
          style={{
            position: "absolute",
            left: 0,
            top: openMenu.top + 34,
            width: 230,
            padding: 6,
            border: "1px solid var(--mantine-color-default-border)",
            borderRadius: 8,
            background: "var(--mantine-color-body)",
            boxShadow: "0 10px 28px rgba(0,0,0,.16)",
            pointerEvents: "auto",
          }}
        >
          {openMenu.view === "root" ? (
            <>
              {!openMenu.isSectionHeading ? (
                <button
                  type="button"
                  className="ramzy-block-menu-item"
                  onClick={() => setOpenMenu({ ...openMenu, view: "sections" })}
                >
                  <span aria-hidden>§</span>
                  <span>Move to section</span>
                  <span aria-hidden style={{ marginLeft: "auto" }}>
                    ›
                  </span>
                </button>
              ) : null}
              <button
                type="button"
                className="ramzy-block-menu-item ramzy-block-menu-danger"
                onClick={() => deleteBlock(openMenu)}
              >
                <span aria-hidden>⌫</span>
                <span>Delete</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="ramzy-block-menu-item"
                onClick={() => setOpenMenu({ ...openMenu, view: "root" })}
              >
                <span aria-hidden>‹</span>
                <strong>Move to section</strong>
              </button>
              <div className="ramzy-block-menu-separator" />
              <button
                type="button"
                className="ramzy-block-menu-item"
                onClick={() => moveToNewSection(openMenu)}
              >
                <span aria-hidden>+</span>
                <span>New section…</span>
              </button>
              {sections.map((section) => (
                <button
                  key={`${section.position}-${section.title}`}
                  type="button"
                  className="ramzy-block-menu-item"
                  onClick={() => moveToExistingSection(openMenu, section)}
                >
                  <span aria-hidden>§</span>
                  <span
                    style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {section.title}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      ) : null}

      <style>{`
        .ramzy-inline-block-controls{opacity:.22;transition:opacity 120ms ease}
        .ramzy-inline-block-controls:hover,.ramzy-inline-block-controls:focus-within{opacity:1}
        .ramzy-inline-block-controls button:hover,.ramzy-final-insert-row button:first-child:hover{color:var(--mantine-primary-color-filled)!important;background:var(--mantine-primary-color-light)!important}
        .ramzy-final-insert-row:hover .ramzy-final-insert-prompt,.ramzy-final-insert-row:focus-within .ramzy-final-insert-prompt{opacity:1!important}
        .ramzy-block-menu-item{width:100%;min-height:34px;border:0;border-radius:6px;background:transparent;color:var(--mantine-color-text);display:flex;align-items:center;gap:10px;padding:6px 9px;text-align:left;cursor:pointer}
        .ramzy-block-menu-item:hover{background:var(--mantine-color-default-hover)}
        .ramzy-block-menu-danger{color:var(--mantine-color-red-7)}
        .ramzy-block-menu-separator{height:1px;background:var(--mantine-color-default-border);margin:5px 3px}
      `}</style>
    </div>
  );
}
