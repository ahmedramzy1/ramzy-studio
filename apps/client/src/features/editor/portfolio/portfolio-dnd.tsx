import { useEffect } from "react";
import type { Editor } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";
import {
  DragDropManager,
  Draggable,
  Droppable,
  Feedback,
  type DragEndEvent,
  type DragMoveEvent,
} from "@dnd-kit/dom";
import {
  createPortfolioGridDropTransaction,
  createPortfolioVerticalDropTransaction,
} from "./portfolio-grid-drop";
import {
  cloneForPortfolioDndPreview,
  closestPortfolioDropEdge,
  createPortfolioDndGridPreview,
  type DropEdge,
} from "./portfolio-dnd-preview";

const PORTFOLIO_BLOCK = "ramzy-portfolio-block";

type DragData = {
  sourcePosition: number | null;
  sourceElement: HTMLElement | null;
  label: string;
};

type DropData = {
  targetPosition: number;
  columnIndex: number | null;
  rowElement: HTMLElement;
  allowedEdges: DropEdge[];
};

type PreviewState = {
  element: HTMLElement;
  key: string | null;
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

function createPreview(): PreviewState {
  const element = document.createElement("div");
  element.className = "ProseMirror ramzy-portfolio-editor ramzy-dnd-layout-preview";
  document.body.appendChild(element);
  return { element, key: null };
}

function hidePreview(preview: PreviewState) {
  preview.element.replaceChildren();
  preview.element.style.display = "none";
  preview.element.style.height = "";
  preview.key = null;
}

function showPreview(
  preview: PreviewState,
  sourceElement: HTMLElement,
  target: DropData,
  edge: DropEdge,
) {
  const key = `${target.targetPosition}:${target.columnIndex}:${edge}`;
  if (preview.key === key) return;
  hidePreview(preview);
  preview.key = key;

  const rowRect = target.rowElement.getBoundingClientRect();
  preview.element.style.display = "block";
  preview.element.style.width = `${rowRect.width}px`;
  preview.element.style.transform = `translate3d(${rowRect.left}px, ${rowRect.top}px, 0)`;

  if (edge === "left" || edge === "right") {
    const grid = createPortfolioDndGridPreview(
      sourceElement,
      target.rowElement,
      target.columnIndex,
      edge,
    );
    grid.style.margin = "0";
    preview.element.appendChild(grid);
    return;
  }

  const clone = cloneForPortfolioDndPreview(sourceElement);
  const sourceHeight = Math.max(sourceElement.getBoundingClientRect().height, 40);
  const gap = 16;
  const y =
    edge === "top"
      ? rowRect.top - sourceHeight - gap
      : rowRect.bottom + gap;
  preview.element.style.height = `${sourceHeight}px`;
  preview.element.style.transform = `translate3d(${rowRect.left}px, ${y}px, 0)`;
  preview.element.appendChild(clone);
}

function dragData(
  draggable: { type?: unknown; data: Record<string, unknown> } | null,
): DragData | null {
  return draggable?.type === PORTFOLIO_BLOCK
    ? (draggable.data as DragData)
    : null;
}

function dropData(
  droppable: { type?: unknown; data: Record<string, unknown> } | null,
): DropData | null {
  return droppable?.type === PORTFOLIO_BLOCK
    ? (droppable.data as DropData)
    : null;
}

export function PortfolioDnd({ editor }: { editor: Editor }) {
  useEffect(() => {
    if (editor.isDestroyed || !editor.isEditable) return;

    const manager = new DragDropManager({
      plugins: (defaults) =>
        defaults.map((plugin) =>
          plugin === Feedback
            ? Feedback.configure({ feedback: "clone", dropAnimation: null })
            : plugin,
        ),
    });
    const preview = createPreview();
    let entities: Array<Draggable | Droppable> = [];
    let sourceElement: HTMLElement | null = null;
    let pointer = { x: 0, y: 0 };
    let reconcileFrame = 0;
    let reconcileTimer = 0;
    let dropIsSuspended = false;
    let globalHandleCleanup: (() => void) | null = null;

    const destroyEntities = () => {
      globalHandleCleanup?.();
      globalHandleCleanup = null;
      entities.forEach((entity) => entity.destroy());
      entities = [];
    };

    const addDraggable = (
      id: string,
      element: HTMLElement,
      handle: HTMLElement,
      position: number,
    ) => {
      entities.push(
        new Draggable<DragData>(
          {
            id,
            element,
            handle,
            type: PORTFOLIO_BLOCK,
            data: {
              sourcePosition: position,
              sourceElement: element,
              label: blockLabel(element),
            },
          },
          manager,
        ),
      );
    };

    const addDroppable = (
      id: string,
      element: HTMLElement,
      data: DropData,
      collisionPriority: number,
    ) => {
      entities.push(
        new Droppable<DropData>(
          {
            id,
            element,
            type: PORTFOLIO_BLOCK,
            data,
            collisionPriority,
            accept: (source) => {
              const sourceData = dragData(source);
              return (
                sourceData?.sourcePosition !== null &&
                (data.columnIndex !== null ||
                  sourceData?.sourcePosition !== data.targetPosition)
              );
            },
          },
          manager,
        ),
      );
    };

    const reconcile = () => {
      if (dropIsSuspended || manager.dragOperation.status.dragging) return;
      destroyEntities();
      const editorDom = editor.view.dom;

      editorDom
        .querySelectorAll<HTMLElement>("[data-ramzy-block-drag-handle]")
        .forEach((handle, index) => {
          const element = handle.closest<HTMLElement>(".react-renderer");
          if (!element) return;
          const position = selectionPositionForElement(editor, element);
          if (position === null) return;
          addDraggable(`block:${position}:${index}`, element, handle, position);
        });

      const globalHandle = editorDom.parentElement?.querySelector<HTMLElement>(
        ":scope > .drag-handle",
      );
      if (globalHandle) {
        const globalDraggable = new Draggable<DragData>(
          {
            id: "block:global",
            element: globalHandle,
            handle: globalHandle,
            type: PORTFOLIO_BLOCK,
            data: {
              sourcePosition: null,
              sourceElement: null,
              label: "Portfolio element",
            },
          },
          manager,
        );
        entities.push(globalDraggable);
        const prepareGlobalDrag = (event: PointerEvent) => {
          const hit = elementAtHandlePointer(editor, event.clientX, event.clientY);
          if (!hit) return;
          globalDraggable.element = hit.element;
          globalDraggable.data = {
            sourcePosition: hit.position,
            sourceElement: hit.element,
            label: blockLabel(hit.element),
          };
        };
        globalHandle.addEventListener("pointerdown", prepareGlobalDrag, true);
        globalHandleCleanup = () =>
          globalHandle.removeEventListener("pointerdown", prepareGlobalDrag, true);
      }

      Array.from(editorDom.children).forEach((row, rowIndex) => {
        if (!(row instanceof HTMLElement)) return;
        const position = topLevelPosition(editor, row);
        if (position === null) return;
        const columns = row.matches('[data-type="columns"]') ? row : null;
        if (!columns) {
          addDroppable(
            `row:${position}:${rowIndex}`,
            row,
            {
              targetPosition: position,
              columnIndex: null,
              rowElement: row,
              allowedEdges: ["top", "bottom", "left", "right"],
            },
            1,
          );
          return;
        }

        addDroppable(
          `row:${position}:${rowIndex}`,
          columns,
          {
            targetPosition: position,
            columnIndex: null,
            rowElement: columns,
            allowedEdges: ["top", "bottom"],
          },
          1,
        );
        Array.from(columns.children).forEach((column, columnIndex) => {
          if (!(column instanceof HTMLElement)) return;
          addDroppable(
            `column:${position}:${columnIndex}`,
            column,
            {
              targetPosition: position,
              columnIndex,
              rowElement: columns,
              allowedEdges: ["top", "bottom", "left", "right"],
            },
            2,
          );
        });
      });
    };

    const scheduleReconcile = () => {
      if (dropIsSuspended || manager.dragOperation.status.dragging) return;
      cancelAnimationFrame(reconcileFrame);
      window.clearTimeout(reconcileTimer);
      reconcileFrame = requestAnimationFrame(reconcile);
      reconcileTimer = window.setTimeout(reconcile, 120);
    };

    const renderCurrentPreview = (event: DragMoveEvent) => {
      const source = dragData(event.operation.source);
      const target = dropData(event.operation.target);
      if (!source?.sourceElement || !target) {
        hidePreview(preview);
        return;
      }
      const edge = closestPortfolioDropEdge(
        (event.operation.target!.element as Element).getBoundingClientRect(),
        pointer,
        target.allowedEdges,
      );
      showPreview(preview, source.sourceElement, target, edge);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
    };
    const onDragStart = ({ operation }: { operation: DragMoveEvent["operation"] }) => {
      const source = dragData(operation.source);
      if (!source?.sourceElement || source.sourcePosition === null) return;
      sourceElement = source.sourceElement;
      sourceElement.classList.add("ramzy-dnd-source");
      try {
        editor.view.dispatch(
          editor.state.tr.setSelection(
            NodeSelection.create(editor.state.doc, source.sourcePosition),
          ),
        );
      } catch {
        sourceElement.classList.remove("ramzy-dnd-source");
        sourceElement = null;
      }
    };
    const onDragEnd = (event: DragEndEvent) => {
      sourceElement?.classList.remove("ramzy-dnd-source");
      sourceElement = null;
      hidePreview(preview);
      const source = dragData(event.operation.source);
      const target = dropData(event.operation.target);
      if (
        event.canceled ||
        source?.sourcePosition === null ||
        !target ||
        !(editor.state.selection instanceof NodeSelection)
      ) {
        scheduleReconcile();
        return;
      }

      const targetElement = event.operation.target?.element;
      if (!(targetElement instanceof Element)) return;
      const edge = closestPortfolioDropEdge(
        targetElement.getBoundingClientRect(),
        pointer,
        target.allowedEdges,
      );
      const suspension = event.suspend();
      dropIsSuspended = true;
      requestAnimationFrame(() => {
        const transaction =
          edge === "left" || edge === "right"
            ? createPortfolioGridDropTransaction(
                editor.state,
                target.targetPosition,
                edge,
                target.columnIndex,
              )
            : createPortfolioVerticalDropTransaction(
                editor.state,
                target.targetPosition,
                edge,
              );
        if (transaction) editor.view.dispatch(transaction);
        requestAnimationFrame(() => {
          dropIsSuspended = false;
          suspension.resume();
          scheduleReconcile();
        });
      });
    };

    const cleanups = [
      manager.monitor.addEventListener("dragstart", onDragStart),
      manager.monitor.addEventListener("dragmove", renderCurrentPreview),
      manager.monitor.addEventListener("dragover", renderCurrentPreview),
      manager.monitor.addEventListener("dragend", onDragEnd),
    ];
    window.addEventListener("pointermove", onPointerMove, true);
    editor.on("update", scheduleReconcile);
    reconcile();
    requestAnimationFrame(scheduleReconcile);

    return () => {
      editor.off("update", scheduleReconcile);
      window.removeEventListener("pointermove", onPointerMove, true);
      cleanups.forEach((cleanup) => cleanup());
      cancelAnimationFrame(reconcileFrame);
      window.clearTimeout(reconcileTimer);
      destroyEntities();
      manager.destroy();
      sourceElement?.classList.remove("ramzy-dnd-source");
      hidePreview(preview);
      preview.element.remove();
    };
  }, [editor]);

  return null;
}
