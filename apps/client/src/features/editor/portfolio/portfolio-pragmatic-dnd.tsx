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

function createSnapPreview() {
  const preview = document.createElement("div");
  preview.className = "ramzy-pragmatic-snap-preview";
  const label = document.createElement("span");
  preview.appendChild(label);
  document.body.appendChild(preview);
  return preview;
}

function hideSnapPreview(preview: HTMLElement) {
  preview.className = "ramzy-pragmatic-snap-preview";
  preview.style.display = "none";
}

function showSnapPreview(
  preview: HTMLElement,
  target: TargetData,
  edge: Edge,
) {
  const targetRect = target.targetElement.getBoundingClientRect();
  const rowRect = target.rowElement.getBoundingClientRect();
  const label = preview.firstElementChild as HTMLElement;
  const vertical = edge === "top" || edge === "bottom";

  preview.style.display = "block";
  preview.className = `ramzy-pragmatic-snap-preview ramzy-snap-${edge}`;

  if (vertical) {
    preview.style.left = `${rowRect.left}px`;
    preview.style.top = `${edge === "top" ? rowRect.top - 7 : rowRect.bottom - 7}px`;
    preview.style.width = `${rowRect.width}px`;
    preview.style.height = "14px";
    label.textContent = edge === "top" ? "Place above" : "Place below";
    return;
  }

  if (target.columnIndex !== null) {
    const nextCount = Math.min(5, target.columnCount + 1);
    const slotWidth = rowRect.width / nextCount;
    const insertionIndex =
      edge === "left" ? target.columnIndex : target.columnIndex + 1;
    preview.style.left = `${rowRect.left + slotWidth * insertionIndex + 4}px`;
    preview.style.top = `${rowRect.top}px`;
    preview.style.width = `${Math.max(32, slotWidth - 8)}px`;
    preview.style.height = `${rowRect.height}px`;
  } else {
    preview.style.left = `${edge === "left" ? targetRect.left : targetRect.left + targetRect.width / 2 + 4}px`;
    preview.style.top = `${targetRect.top}px`;
    preview.style.width = `${Math.max(32, targetRect.width / 2 - 4)}px`;
    preview.style.height = `${targetRect.height}px`;
  }
  label.textContent = edge === "left" ? "Place left" : "Place right";
}

function targetData(value: Record<string, unknown>): TargetData | null {
  return value.type === DRAG_TYPE ? (value as TargetData) : null;
}

export function PortfolioPragmaticDnd({ editor }: { editor: Editor }) {
  useEffect(() => {
    if (editor.isDestroyed || !editor.isEditable) return;

    const snapPreview = createSnapPreview();
    const registrations = new Map<HTMLElement, () => void>();
    let sourceElement: HTMLElement | null = null;
    let scanFrame = 0;

    const registerDraggable = (
      element: HTMLElement,
      handle: HTMLElement,
      getPosition: (input: { clientX: number; clientY: number }) => number | null,
    ) => {
      if (registrations.has(handle)) return;
      const cleanup = draggable({
        element,
        dragHandle: handle === element ? undefined : handle,
        getInitialData: ({ input }) => ({
          type: DRAG_TYPE,
          sourcePosition: getPosition(input),
          label: blockLabel(element),
        }),
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
            sourceElement = element;
            element.classList.add("ramzy-pragmatic-dragging");
          } catch {
            sourceElement = null;
          }
        },
        onDrop: () => {
          sourceElement?.classList.remove("ramzy-pragmatic-dragging");
          sourceElement = null;
          hideSnapPreview(snapPreview);
        },
      });
      registrations.set(handle, cleanup);
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
          typeof source.data.sourcePosition === "number",
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
      cancelAnimationFrame(scanFrame);
      scanFrame = requestAnimationFrame(scan);
    };
    scan();
    const observer = new MutationObserver(scheduleScan);
    observer.observe(editor.view.dom, { childList: true, subtree: true });

    const monitorCleanup = combine(
      monitorForElements({
        canMonitor: ({ source }) => source.data.type === DRAG_TYPE,
        onDrag: ({ location }) => {
          const current = location.current.dropTargets[0];
          const data = current ? targetData(current.data) : null;
          const edge = current ? extractClosestEdge(current.data) : null;
          if (!data || !edge) {
            hideSnapPreview(snapPreview);
            return;
          }
          showSnapPreview(snapPreview, data, edge);
        },
        onDrop: ({ location }) => {
          const current = location.current.dropTargets[0];
          const data = current ? targetData(current.data) : null;
          const edge = current ? extractClosestEdge(current.data) : null;
          hideSnapPreview(snapPreview);
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
          triggerPostMoveFlash(data.rowElement);
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
      observer.disconnect();
      cancelAnimationFrame(scanFrame);
      monitorCleanup();
      for (const cleanup of registrations.values()) cleanup();
      registrations.clear();
      sourceElement?.classList.remove("ramzy-pragmatic-dragging");
      snapPreview.remove();
    };
  }, [editor]);

  return null;
}
