import { useEffect } from "react";
import type { Editor } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import * as liveRegion from "@atlaskit/pragmatic-drag-and-drop-live-region";
import {
  createPortfolioGridDropTransaction,
  createPortfolioVerticalDropTransaction,
} from "./portfolio-grid-drop";

const DRAG_TYPE = "ramzy-portfolio-block";

type TargetData = {
  type: typeof DRAG_TYPE;
  targetPosition: number;
  columnIndex: number | null;
  targetElement: HTMLElement;
  rowElement: HTMLElement;
  columnCount: number;
};

function topLevelPosition(editor: Editor, element: HTMLElement): number | null {
  try {
    const raw = editor.view.posAtDOM(element, 0);
    const $position = editor.state.doc.resolve(raw);
    return $position.depth > 0 ? $position.before(1) : raw;
  } catch {
    return null;
  }
}

function selectionPositionForElement(
  editor: Editor,
  element: HTMLElement,
): number | null {
  try {
    const position = editor.view.posAtDOM(element, 0);
    if (editor.state.doc.nodeAt(position)?.isBlock) return position;
    const $position = editor.state.doc.resolve(position);
    for (let depth = $position.depth; depth > 0; depth -= 1) {
      const before = $position.before(depth);
      if (editor.state.doc.nodeAt(before)?.isBlock) return before;
    }
  } catch {
    return null;
  }
  return null;
}

function selectionPositionAtPointer(
  editor: Editor,
  clientX: number,
  clientY: number,
): number | null {
  const editorRect = editor.view.dom.getBoundingClientRect();
  const hit = document.elementFromPoint(
    Math.max(editorRect.left + 16, clientX + 56),
    clientY,
  );
  if (!(hit instanceof HTMLElement) || !editor.view.dom.contains(hit)) {
    return null;
  }
  const block =
    hit.closest<HTMLElement>(".react-renderer") ??
    hit.closest<HTMLElement>("p, h1, h2, h3, blockquote, pre, ul, ol, table");
  return block ? selectionPositionForElement(editor, block) : null;
}

function blockLabel(element: HTMLElement): string {
  const handle = element.querySelector<HTMLElement>("[aria-label^='Drag']");
  if (handle?.ariaLabel) return handle.ariaLabel.replace(/^Drag\s+/i, "");
  const text = element.textContent?.trim().replace(/\s+/g, " ");
  return text ? text.slice(0, 54) : "Portfolio element";
}

function renderDragPreview(container: HTMLElement, label: string) {
  const preview = document.createElement("div");
  preview.className = "ramzy-pragmatic-drag-preview";
  preview.innerHTML = `<span aria-hidden="true">⠿</span><strong></strong>`;
  preview.querySelector("strong")!.textContent = label;
  container.appendChild(preview);
}

type LayoutPreview = {
  element: HTMLElement;
  transparentRow: HTMLElement | null;
  originalOpacity: string;
  activeKey: string | null;
};

function createLayoutPreview(): LayoutPreview {
  const preview = document.createElement("div");
  preview.className = "ProseMirror ramzy-portfolio-editor ramzy-live-layout-preview";
  document.body.appendChild(preview);
  return {
    element: preview,
    transparentRow: null,
    originalOpacity: "",
    activeKey: null,
  };
}

function hideLayoutPreview(preview: LayoutPreview) {
  if (preview.transparentRow) {
    preview.transparentRow.style.opacity = preview.originalOpacity;
    preview.transparentRow = null;
    preview.originalOpacity = "";
  }
  preview.element.replaceChildren();
  preview.element.style.display = "none";
  preview.element.style.height = "";
  preview.activeKey = null;
}

function cloneForLayoutPreview(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll<HTMLElement>(
      "[data-drag-handle], [data-ramzy-block-drag-handle], .drag-handle",
    )
    .forEach((handle) => handle.remove());
  clone.querySelectorAll<HTMLElement>("[id]").forEach((node) => {
    node.removeAttribute("id");
  });
  clone.removeAttribute("id");
  clone.classList.remove("ramzy-pragmatic-dragging", "ProseMirror-selectednode");
  clone.setAttribute("aria-hidden", "true");
  clone.style.opacity = "1";
  clone.style.pointerEvents = "none";
  clone.style.width = "100%";
  clone.style.maxWidth = "100%";
  return clone;
}

function previewColumn(content: HTMLElement): HTMLElement {
  const column = document.createElement("div");
  column.dataset.type = "column";
  column.appendChild(content);
  return column;
}

// Exported for DOM-level regression coverage of the real preview structure.
// eslint-disable-next-line react-refresh/only-export-components
export function createPortfolioLayoutPreviewGrid(
  sourceElement: HTMLElement,
  rowElement: HTMLElement,
  columnIndex: number | null,
  edge: "left" | "right",
): HTMLElement {
  const sourceClone = cloneForLayoutPreview(sourceElement);
  if (columnIndex === null) {
    const row = document.createElement("div");
    row.dataset.type = "columns";
    row.dataset.layout = "two_equal";
    const targetClone = cloneForLayoutPreview(rowElement);
    const columns = [previewColumn(targetClone), previewColumn(sourceClone)];
    if (edge === "left") columns.reverse();
    row.append(...columns);
    return row;
  }

  const row = cloneForLayoutPreview(rowElement);
  const sourceColumn = sourceElement.closest<HTMLElement>('[data-type="column"]');
  let insertionIndex =
    edge === "left" ? columnIndex : columnIndex + 1;

  if (sourceColumn?.parentElement === rowElement) {
    const sourceColumnIndex = Array.from(rowElement.children).indexOf(
      sourceColumn,
    );
    const clonedSourceColumn = row.children[sourceColumnIndex] as
      | HTMLElement
      | undefined;
    if (clonedSourceColumn) {
      const sourceBlockIndex = Array.from(sourceColumn.children).indexOf(
        sourceElement,
      );
      clonedSourceColumn.children[sourceBlockIndex]?.remove();
      if (clonedSourceColumn.children.length === 0) {
        clonedSourceColumn.remove();
        if (sourceColumnIndex < insertionIndex) insertionIndex -= 1;
      }
    }
  }

  row.insertBefore(
    previewColumn(sourceClone),
    row.children[Math.max(0, insertionIndex)] ?? null,
  );
  const count = row.children.length;
  row.dataset.layout =
    count === 3
      ? "three_equal"
      : count === 4
        ? "four_equal"
        : count === 5
          ? "five_equal"
          : "two_equal";
  return row;
}

function showLayoutPreview(
  preview: LayoutPreview,
  sourceElement: HTMLElement,
  target: TargetData,
  edge: Edge,
) {
  const key = `${target.targetPosition}:${target.columnIndex}:${edge}`;
  if (preview.activeKey === key) return;
  hideLayoutPreview(preview);
  preview.activeKey = key;

  const rowRect = target.rowElement.getBoundingClientRect();
  const sourceRect = sourceElement.getBoundingClientRect();
  preview.element.style.display = "block";
  preview.element.style.left = `${rowRect.left}px`;
  preview.element.style.width = `${rowRect.width}px`;

  if (edge === "left" || edge === "right") {
    const grid = createPortfolioLayoutPreviewGrid(
      sourceElement,
      target.rowElement,
      target.columnIndex,
      edge,
    );
    grid.style.margin = "0";
    preview.element.style.top = `${rowRect.top}px`;
    preview.element.appendChild(grid);
    // Keep the registered drop target in exactly the same place so pointer
    // hit-testing remains stable. Opacity (unlike visibility/display) keeps
    // the target hittable while allowing the cloned future layout to be the
    // only pixels shown beneath the pointer.
    preview.transparentRow = target.rowElement;
    preview.originalOpacity = target.rowElement.style.opacity;
    target.rowElement.style.opacity = "0";
    return;
  }

  const clone = cloneForLayoutPreview(sourceElement);
  const gap = 16;
  const height = Math.max(sourceRect.height, 40);
  preview.element.style.top = `${
    edge === "top" ? rowRect.top - height - gap : rowRect.bottom + gap
  }px`;
  preview.element.style.height = `${height}px`;
  preview.element.appendChild(clone);
}

function targetData(value: Record<string, unknown>): TargetData | null {
  return value.type === DRAG_TYPE ? (value as TargetData) : null;
}

export function PortfolioPragmaticDnd({ editor }: { editor: Editor }) {
  useEffect(() => {
    if (editor.isDestroyed || !editor.isEditable) return;

    const layoutPreview = createLayoutPreview();
    const registrations = new Map<HTMLElement, () => void>();
    let sourceElement: HTMLElement | null = null;
    let scanFrame = 0;
    let scanPending = false;
    const postDropTimers = new Set<number>();

    const schedulePostDropRebind = () => {
      // TipTap node views do not all commit in the same frame as the document
      // transaction. Re-scan across the short settling window so handles
      // created by the drop remain draggable for the next operation.
      [0, 80, 220].forEach((delay) => {
        const timer = window.setTimeout(() => {
          postDropTimers.delete(timer);
          scheduleScan();
        }, delay);
        postDropTimers.add(timer);
      });
    };

    const registerDraggable = (
      element: HTMLElement,
      handle: HTMLElement,
      getPosition: (input: { clientX: number; clientY: number }) => number | null,
    ) => {
      if (registrations.has(handle)) return;
      handle.dataset.ramzyPragmaticReady = "";
      const draggableCleanup = draggable({
        element,
        dragHandle: handle === element ? undefined : handle,
        getInitialData: ({ input }) => {
          const sourcePosition = getPosition(input);
          const nodeDom =
            sourcePosition === null ? null : editor.view.nodeDOM(sourcePosition);
          return {
            type: DRAG_TYPE,
            sourcePosition,
            label: blockLabel(
              nodeDom instanceof HTMLElement ? nodeDom : element,
            ),
          };
        },
        onGenerateDragPreview: ({ nativeSetDragImage, source }) => {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({ x: "16px", y: "8px" }),
            render: ({ container }) =>
              renderDragPreview(container, String(source.data.label)),
          });
        },
        onDragStart: ({ source }) => {
          const position = source.data.sourcePosition;
          if (typeof position !== "number") return;
          try {
            editor.view.dispatch(
              editor.state.tr.setSelection(
                NodeSelection.create(editor.state.doc, position),
              ),
            );
            const nodeDom = editor.view.nodeDOM(position);
            sourceElement =
              nodeDom instanceof HTMLElement ? nodeDom : element;
            sourceElement.classList.add("ramzy-pragmatic-dragging");
          } catch {
            sourceElement = null;
          }
        },
        onDrop: () => {
          sourceElement?.classList.remove("ramzy-pragmatic-dragging");
          sourceElement = null;
          hideLayoutPreview(layoutPreview);
          if (scanPending) scheduleScan();
          schedulePostDropRebind();
        },
      });
      registrations.set(handle, () => {
        delete handle.dataset.ramzyPragmaticReady;
        draggableCleanup();
      });
    };

    const registerTarget = (
      element: HTMLElement,
      rowElement: HTMLElement,
      position: number,
      columnIndex: number | null,
      columnCount: number,
      allowedEdges: Edge[],
    ) => {
      if (registrations.has(element)) return;
      const cleanup = dropTargetForElements({
        element,
        canDrop: ({ source }) =>
          source.data.type === DRAG_TYPE &&
          typeof source.data.sourcePosition === "number" &&
          (columnIndex !== null || source.data.sourcePosition !== position),
        getData: ({ input, element: targetElement }) =>
          attachClosestEdge(
            {
              type: DRAG_TYPE,
              targetPosition: position,
              columnIndex,
              targetElement,
              rowElement,
              columnCount,
            },
            { input, element: targetElement, allowedEdges },
          ),
      });
      registrations.set(element, cleanup);
    };

    const scan = () => {
      for (const cleanup of registrations.values()) cleanup();
      registrations.clear();

      const editorDom = editor.view.dom;
      for (const handle of editorDom.querySelectorAll<HTMLElement>(
        "[data-ramzy-block-drag-handle]",
      )) {
        const element = handle.closest<HTMLElement>(".react-renderer");
        if (!element) continue;
        registerDraggable(element, handle, () =>
          selectionPositionForElement(editor, element),
        );
      }

      const globalHandle = editorDom.parentElement?.querySelector<HTMLElement>(
        ":scope > .drag-handle",
      );
      if (globalHandle) {
        registerDraggable(globalHandle, globalHandle, (input) =>
          selectionPositionAtPointer(editor, input.clientX, input.clientY),
        );
      }

      for (const row of Array.from(editorDom.children)) {
        if (!(row instanceof HTMLElement)) continue;
        const position = topLevelPosition(editor, row);
        if (position === null) continue;
        const columns = row.matches('[data-type="columns"]') ? row : null;
        if (!columns) {
          registerTarget(row, row, position, null, 1, [
            "top",
            "bottom",
            "left",
            "right",
          ]);
          continue;
        }

        registerTarget(columns, columns, position, null, columns.children.length, [
          "top",
          "bottom",
        ]);
        Array.from(columns.children).forEach((column, columnIndex) => {
          if (!(column instanceof HTMLElement)) return;
          registerTarget(
            column,
            columns,
            position,
            columnIndex,
            columns.children.length,
            ["top", "bottom", "left", "right"],
          );
        });
      }
    };

    const scheduleScan = () => {
      if (sourceElement) {
        scanPending = true;
        return;
      }
      scanPending = false;
      cancelAnimationFrame(scanFrame);
      scanFrame = requestAnimationFrame(scan);
    };
    scan();
    // Rebind only when the ProseMirror document changes. Observing the whole
    // DOM subtree also reacts to waveform/video rendering and can rebuild drag
    // registrations dozens of times per second. Selection-only transactions
    // (including drag start) must not tear down an active draggable either.
    editor.on("update", scheduleScan);

    const structuralSelector =
      "[data-ramzy-block-drag-handle], .react-renderer, [data-type='columns'], [data-type='column']";
    const structuralObserver = new MutationObserver((mutations) => {
      const changed = mutations.some((mutation) =>
        [...mutation.addedNodes, ...mutation.removedNodes].some(
          (node) =>
            node instanceof HTMLElement &&
            (node.matches(structuralSelector) ||
              node.querySelector(structuralSelector) !== null),
        ),
      );
      if (changed) scheduleScan();
    });
    structuralObserver.observe(editor.view.dom, {
      childList: true,
      subtree: true,
    });

    const blockUnregisteredNativeDrag = (event: DragEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const handle = target.closest<HTMLElement>(
        "[data-ramzy-block-drag-handle]",
      );
      if (!handle || "ramzyPragmaticReady" in handle.dataset) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      scheduleScan();
    };
    editor.view.dom.addEventListener(
      "dragstart",
      blockUnregisteredNativeDrag,
      true,
    );

    // React node views can finish mounting just after the editor instance is
    // reported. These two cheap structural scans close that initial window.
    requestAnimationFrame(scheduleScan);
    const settledScan = window.setTimeout(scheduleScan, 120);

    const monitorCleanup = combine(
      monitorForElements({
        canMonitor: ({ source }) => source.data.type === DRAG_TYPE,
        onDrag: ({ location }) => {
          const current = location.current.dropTargets[0];
          const data = current ? targetData(current.data) : null;
          const edge = current ? extractClosestEdge(current.data) : null;
          if (!data || !edge) {
            hideLayoutPreview(layoutPreview);
            return;
          }
          if (!sourceElement) return;
          showLayoutPreview(layoutPreview, sourceElement, data, edge);
        },
        onDrop: ({ location }) => {
          const current = location.current.dropTargets[0];
          const data = current ? targetData(current.data) : null;
          const edge = current ? extractClosestEdge(current.data) : null;
          hideLayoutPreview(layoutPreview);
          if (!data || !edge || !(editor.state.selection instanceof NodeSelection)) {
            return;
          }

          const tr =
            edge === "left" || edge === "right"
              ? createPortfolioGridDropTransaction(
                  editor.state,
                  data.targetPosition,
                  edge,
                  data.columnIndex,
                )
              : createPortfolioVerticalDropTransaction(
                  editor.state,
                  data.targetPosition,
                  edge,
                );
          if (!tr) return;
          editor.view.dispatch(tr);
          const movedPosition = editor.state.selection.from;
          const movedDom = editor.view.nodeDOM(movedPosition);
          if (movedDom instanceof HTMLElement && movedDom.isConnected) {
            triggerPostMoveFlash(movedDom);
          }
          schedulePostDropRebind();
          liveRegion.announce(
            edge === "left" || edge === "right"
              ? `Moved element ${edge}`
              : `Moved element ${edge === "top" ? "above" : "below"}`,
          );
        },
      }),
      autoScrollWindowForElements({ getAllowedAxis: () => "vertical" }),
    );

    return () => {
      editor.off("update", scheduleScan);
      structuralObserver.disconnect();
      window.clearTimeout(settledScan);
      for (const timer of postDropTimers) window.clearTimeout(timer);
      postDropTimers.clear();
      editor.view.dom.removeEventListener(
        "dragstart",
        blockUnregisteredNativeDrag,
        true,
      );
      cancelAnimationFrame(scanFrame);
      monitorCleanup();
      for (const cleanup of registrations.values()) cleanup();
      registrations.clear();
      sourceElement?.classList.remove("ramzy-pragmatic-dragging");
      hideLayoutPreview(layoutPreview);
      layoutPreview.element.remove();
    };
  }, [editor]);

  return null;
}
