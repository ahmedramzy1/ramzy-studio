import { useEffect } from "react";
import type { Editor } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
  type ElementEventPayloadMap,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import {
  createPortfolioGridDropTransaction,
  createPortfolioVerticalDropTransaction,
} from "./portfolio-grid-drop";
import {
  cloneForPortfolioDndPreview,
  createPortfolioDndGridPreview,
} from "./portfolio-dnd-preview";

const PORTFOLIO_BLOCK = "ramzy-portfolio-block";
const PORTFOLIO_TARGET = "ramzy-portfolio-target";

type DragData = {
  type: typeof PORTFOLIO_BLOCK;
  sourcePosition: number;
  sourceElement: HTMLElement;
  label: string;
};

type DropData = {
  type: typeof PORTFOLIO_TARGET;
  targetPosition: number;
  columnIndex: number | null;
  rowElement: HTMLElement;
};

type ActivePreview = {
  key: string;
  target: HTMLElement;
};

function isDragData(data: Record<string | symbol, unknown>): data is DragData {
  return (
    data.type === PORTFOLIO_BLOCK &&
    typeof data.sourcePosition === "number" &&
    data.sourceElement instanceof HTMLElement
  );
}

function isDropData(data: Record<string | symbol, unknown>): data is DropData {
  return (
    data.type === PORTFOLIO_TARGET &&
    typeof data.targetPosition === "number" &&
    data.rowElement instanceof HTMLElement
  );
}

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

function elementAtHandlePointer(
  editor: Editor,
  clientX: number,
  clientY: number,
): { element: HTMLElement; position: number } | null {
  const editorRect = editor.view.dom.getBoundingClientRect();
  const hit = document.elementFromPoint(
    Math.max(editorRect.left + 16, clientX + 56),
    clientY,
  );
  if (!(hit instanceof HTMLElement) || !editor.view.dom.contains(hit)) {
    return null;
  }
  const element =
    hit.closest<HTMLElement>(".react-renderer") ??
    hit.closest<HTMLElement>("p, h1, h2, h3, blockquote, pre, ul, ol, table");
  if (!element) return null;
  const position = selectionPositionForElement(editor, element);
  return position === null ? null : { element, position };
}

function blockLabel(element: HTMLElement): string {
  const handle = element.querySelector<HTMLElement>("[aria-label^='Drag']");
  if (handle?.ariaLabel) return handle.ariaLabel.replace(/^Drag\s+/i, "");
  const text = element.textContent?.trim().replace(/\s+/g, " ");
  return text ? text.slice(0, 54) : "Portfolio element";
}

function getDrop(
  location: ElementEventPayloadMap["onDrag"]["location"],
): { data: DropData; edge: Edge } | null {
  for (const record of location.current.dropTargets) {
    if (!isDropData(record.data)) continue;
    const edge = extractClosestEdge(record.data);
    if (edge) return { data: record.data, edge };
  }
  return null;
}

function createPreviewLayer(editor: Editor) {
  const host = editor.view.dom.parentElement ?? editor.view.dom;
  const element = document.createElement("div");
  element.className =
    "ProseMirror ramzy-portfolio-editor ramzy-dnd-layout-preview";
  element.setAttribute("contenteditable", "false");
  element.setAttribute("aria-hidden", "true");
  host.appendChild(element);

  let active: ActivePreview | null = null;

  const clear = () => {
    if (active) {
      active.target.classList.remove(
        "ramzy-dnd-preview-target",
        "ramzy-dnd-preview-space-top",
        "ramzy-dnd-preview-space-bottom",
      );
      active.target.style.removeProperty("--ramzy-dnd-preview-space");
    }
    element.replaceChildren();
    element.style.display = "none";
    active = null;
  };

  const render = (
    sourceElement: HTMLElement,
    target: DropData,
    edge: Edge,
  ) => {
    const key = `${target.targetPosition}:${target.columnIndex}:${edge}`;
    if (active?.key === key) return;
    clear();

    const hostRect = host.getBoundingClientRect();
    const rowRect = target.rowElement.getBoundingClientRect();
    element.style.display = "block";
    element.style.left = `${rowRect.left - hostRect.left}px`;
    element.style.width = `${rowRect.width}px`;

    if (edge === "left" || edge === "right") {
      const grid = createPortfolioDndGridPreview(
        sourceElement,
        target.rowElement,
        target.columnIndex,
        edge,
      );
      grid.style.margin = "0";
      element.style.top = `${rowRect.top - hostRect.top}px`;
      element.appendChild(grid);
      target.rowElement.classList.add("ramzy-dnd-preview-target");
    } else {
      const clone = cloneForPortfolioDndPreview(sourceElement);
      clone.classList.add("ramzy-dnd-incoming-block");
      clone.dataset.dropEdge = edge;
      const sourceHeight = Math.max(
        sourceElement.getBoundingClientRect().height,
        40,
      );
      const gap = 16;
      const space = sourceHeight + gap;
      target.rowElement.style.setProperty(
        "--ramzy-dnd-preview-space",
        `${space}px`,
      );
      target.rowElement.classList.add(
        edge === "top"
          ? "ramzy-dnd-preview-space-top"
          : "ramzy-dnd-preview-space-bottom",
      );
      element.style.top = `${
        rowRect.top -
        hostRect.top +
        (edge === "top" ? 0 : rowRect.height + gap)
      }px`;
      element.appendChild(clone);
    }

    active = { key, target: target.rowElement };
  };

  return { element, clear, render };
}

export function PortfolioDnd({ editor }: { editor: Editor }) {
  useEffect(() => {
    if (editor.isDestroyed || !editor.isEditable) return;

    const preview = createPreviewLayer(editor);
    let sourceElement: HTMLElement | null = null;
    let cleanups: Array<() => void> = [];
    let reconcileFrame = 0;
    let reconcileTimer = 0;
    let dragging = false;

    const destroyEntities = () => {
      cleanups.forEach((cleanup) => cleanup());
      cleanups = [];
    };

    const addDraggable = (
      element: HTMLElement,
      handle: HTMLElement,
      position: number,
    ) => {
      cleanups.push(
        draggable({
          element,
          dragHandle: handle,
          getInitialData: () => ({
            type: PORTFOLIO_BLOCK,
            sourcePosition: position,
            sourceElement: element,
            label: blockLabel(element),
          }),
          onGenerateDragPreview: ({ nativeSetDragImage }) => {
            setCustomNativeDragPreview({
              nativeSetDragImage,
              getOffset: pointerOutsideOfPreview({ x: "14px", y: "10px" }),
              render: ({ container }) => {
                const card = cloneForPortfolioDndPreview(element);
                card.classList.add("ramzy-dnd-native-preview");
                card.style.width = `${Math.min(
                  element.getBoundingClientRect().width,
                  360,
                )}px`;
                container.appendChild(card);
              },
            });
          },
        }),
      );
    };

    const addDropTarget = (
      element: HTMLElement,
      data: DropData,
      allowedEdges: Edge[],
    ) => {
      cleanups.push(
        dropTargetForElements({
          element,
          canDrop: ({ source }) =>
            isDragData(source.data) &&
            !(
              data.columnIndex === null &&
              source.data.sourcePosition === data.targetPosition
            ),
          getData: ({ input, element: targetElement, source }) => {
            const sourceData = isDragData(source.data) ? source.data : null;
            const sourceRow = sourceData?.sourceElement.closest<HTMLElement>(
              '[data-type="columns"]',
            );
            const rowIsFull =
              data.columnIndex !== null &&
              data.rowElement.childElementCount >= 4 &&
              sourceRow !== data.rowElement;
            return attachClosestEdge(data, {
              input,
              element: targetElement,
              allowedEdges: rowIsFull ? ["top", "bottom"] : allowedEdges,
            });
          },
          getIsSticky: () => true,
        }),
      );
    };

    const reconcile = () => {
      if (dragging || editor.isDestroyed) return;
      destroyEntities();
      const editorDom = editor.view.dom;

      editorDom
        .querySelectorAll<HTMLElement>("[data-ramzy-block-drag-handle]")
        .forEach((handle) => {
          const element = handle.closest<HTMLElement>(".react-renderer");
          if (!element) return;
          const position = selectionPositionForElement(editor, element);
          if (position !== null) addDraggable(element, handle, position);
        });

      const globalHandle = editorDom.parentElement?.querySelector<HTMLElement>(
        ":scope > .drag-handle",
      );
      if (globalHandle) {
        let prepared: { element: HTMLElement; position: number } | null = null;
        const prepare = (event: PointerEvent) => {
          prepared = elementAtHandlePointer(editor, event.clientX, event.clientY);
        };
        globalHandle.addEventListener("pointerdown", prepare, true);
        cleanups.push(() =>
          globalHandle.removeEventListener("pointerdown", prepare, true),
        );
        cleanups.push(
          draggable({
            element: globalHandle,
            dragHandle: globalHandle,
            canDrag: () => prepared !== null,
            getInitialData: () => ({
              type: PORTFOLIO_BLOCK,
              sourcePosition: prepared?.position ?? -1,
              sourceElement: prepared?.element ?? editorDom,
              label: prepared ? blockLabel(prepared.element) : "Portfolio element",
            }),
          }),
        );
      }

      Array.from(editorDom.children).forEach((row) => {
        if (!(row instanceof HTMLElement)) return;
        const position = topLevelPosition(editor, row);
        if (position === null) return;
        const data: DropData = {
          type: PORTFOLIO_TARGET,
          targetPosition: position,
          columnIndex: null,
          rowElement: row,
        };
        addDropTarget(
          row,
          data,
          row.matches('[data-type="columns"]')
            ? ["top", "bottom"]
            : ["top", "bottom", "left", "right"],
        );

        if (!row.matches('[data-type="columns"]')) return;
        Array.from(row.children).forEach((column, columnIndex) => {
          if (!(column instanceof HTMLElement)) return;
          addDropTarget(
            column,
            { ...data, columnIndex },
            ["top", "bottom", "left", "right"],
          );
        });
      });
    };

    const scheduleReconcile = () => {
      if (dragging) return;
      cancelAnimationFrame(reconcileFrame);
      window.clearTimeout(reconcileTimer);
      reconcileFrame = requestAnimationFrame(reconcile);
      reconcileTimer = window.setTimeout(reconcile, 120);
    };

    const monitorCleanup = monitorForElements({
      canMonitor: ({ source }) => isDragData(source.data),
      onDragStart: ({ source }) => {
        if (!isDragData(source.data)) return;
        dragging = true;
        sourceElement = source.data.sourceElement;
        sourceElement.classList.add("ramzy-dnd-source");
        try {
          editor.view.dispatch(
            editor.state.tr.setSelection(
              NodeSelection.create(editor.state.doc, source.data.sourcePosition),
            ),
          );
        } catch {
          sourceElement.classList.remove("ramzy-dnd-source");
          sourceElement = null;
        }
      },
      onDrag: ({ source, location }) => {
        if (!isDragData(source.data)) return;
        const destination = getDrop(location);
        if (!destination) {
          preview.clear();
          return;
        }
        preview.render(
          source.data.sourceElement,
          destination.data,
          destination.edge,
        );
      },
      onDrop: ({ source, location }) => {
        const destination = getDrop(location);
        sourceElement?.classList.remove("ramzy-dnd-source");
        sourceElement = null;
        preview.clear();
        dragging = false;

        if (
          !isDragData(source.data) ||
          !destination ||
          !(editor.state.selection instanceof NodeSelection)
        ) {
          scheduleReconcile();
          return;
        }

        const transaction =
          destination.edge === "left" || destination.edge === "right"
            ? createPortfolioGridDropTransaction(
                editor.state,
                destination.data.targetPosition,
                destination.edge,
                destination.data.columnIndex,
              )
            : createPortfolioVerticalDropTransaction(
                editor.state,
                destination.data.targetPosition,
                destination.edge,
              );
        if (transaction) editor.view.dispatch(transaction);
        requestAnimationFrame(scheduleReconcile);
      },
    });

    const autoScrollCleanup = autoScrollWindowForElements({
      canScroll: ({ source }) => isDragData(source.data),
      getAllowedAxis: () => "vertical",
    });

    editor.on("update", scheduleReconcile);
    reconcile();

    return () => {
      editor.off("update", scheduleReconcile);
      cancelAnimationFrame(reconcileFrame);
      window.clearTimeout(reconcileTimer);
      monitorCleanup();
      autoScrollCleanup();
      destroyEntities();
      sourceElement?.classList.remove("ramzy-dnd-source");
      preview.clear();
      preview.element.remove();
    };
  }, [editor]);

  return null;
}
