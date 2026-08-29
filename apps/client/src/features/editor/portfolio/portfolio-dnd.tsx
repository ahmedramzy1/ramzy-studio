import { useEffect } from "react";
import type { Editor } from "@tiptap/core";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import {
  createPortfolioGridDropTransaction,
  createPortfolioVerticalDropTransaction,
} from "./portfolio-grid-drop";
import {
  resolvePortfolioDropIntent,
  type PortfolioDomDropIntent,
} from "./portfolio-dnd-intent";
import { cloneForPortfolioDndPreview } from "./portfolio-dnd-preview";

const PORTFOLIO_BLOCK = "ramzy-portfolio-block";
const PORTFOLIO_SURFACE = "ramzy-portfolio-surface";

type DragData = {
  type: typeof PORTFOLIO_BLOCK;
  sourcePosition: number;
  sourceElement: HTMLElement;
  label: string;
};

type DropIntent = PortfolioDomDropIntent & {
  targetPosition: number;
};

function isDragData(data: Record<string | symbol, unknown>): data is DragData {
  return (
    data.type === PORTFOLIO_BLOCK &&
    typeof data.sourcePosition === "number" &&
    data.sourceElement instanceof HTMLElement
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

function columnElements(row: HTMLElement): HTMLElement[] {
  return Array.from(row.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.dataset.type === "column",
  );
}

function meaningfulColumnChildCount(column: HTMLElement | null): number {
  if (!column) return 0;
  return Array.from(column.children).filter(
    (child) =>
      !(
        child instanceof HTMLParagraphElement &&
        child.textContent?.trim().length === 0
      ),
  ).length;
}

function cloneColumnWithoutSource(
  column: HTMLElement,
  sourceElement: HTMLElement,
): HTMLElement {
  const clone = cloneForPortfolioDndPreview(column);
  if (!column.contains(sourceElement)) return clone;

  const directSource = Array.from(column.children).find(
    (child) => child === sourceElement || child.contains(sourceElement),
  );
  if (!directSource) return clone;
  const sourceIndex = Array.from(column.children).indexOf(directSource);
  clone.children.item(sourceIndex)?.remove();
  return clone;
}

function previewColumn(sourceElement: HTMLElement): HTMLElement {
  const column = document.createElement("div");
  column.dataset.type = "column";
  column.className = "ramzy-dnd-incoming-column";
  column.append(cloneForPortfolioDndPreview(sourceElement));
  return column;
}

function dropLabel(edge: PortfolioDomDropIntent["edge"]): string {
  if (edge === "left") return "Place on left";
  if (edge === "right") return "Place on right";
  if (edge === "top") return "Place above";
  return "Place below";
}

function createPortfolioPreview(editor: Editor) {
  const host = editor.view.dom.parentElement ?? editor.view.dom;
  const previousHostPosition = host.style.position;
  if (getComputedStyle(host).position === "static") {
    host.style.position = "relative";
  }

  const overlay = document.createElement("div");
  overlay.className = "ramzy-dnd-layout-overlay";
  overlay.setAttribute("contenteditable", "false");
  overlay.setAttribute("aria-hidden", "true");
  host.appendChild(overlay);

  let mutedTarget: HTMLElement | null = null;
  let activeKey = "";

  const clear = () => {
    mutedTarget?.classList.remove("ramzy-dnd-preview-target-muted");
    mutedTarget = null;
    activeKey = "";
    overlay.className = "ramzy-dnd-layout-overlay";
    overlay.replaceChildren();
    overlay.style.display = "none";
    overlay.style.removeProperty("top");
    overlay.style.removeProperty("left");
    overlay.style.removeProperty("width");
    overlay.style.removeProperty("height");
    overlay.style.removeProperty("min-height");
    delete overlay.dataset.dropLabel;
  };

  const positionOverlay = (
    left: number,
    top: number,
    width: number,
    minHeight: number,
  ) => {
    const hostRect = host.getBoundingClientRect();
    overlay.style.display = "block";
    overlay.style.left = `${left - hostRect.left + host.scrollLeft}px`;
    overlay.style.top = `${top - hostRect.top + host.scrollTop}px`;
    overlay.style.width = `${width}px`;
    overlay.style.height = "auto";
    overlay.style.minHeight = `${Math.max(40, minHeight)}px`;
  };

  const renderHorizontal = (sourceElement: HTMLElement, intent: DropIntent) => {
    const row = intent.rowElement;
    const rowRect = row.getBoundingClientRect();
    const grid = document.createElement("div");
    grid.className = "ramzy-dnd-future-grid";

    if (row.matches('[data-type="columns"]')) {
      const columns = columnElements(row);
      const sourceColumn = sourceElement.closest<HTMLElement>(
        '[data-type="column"]',
      );
      const sourceColumnIndex =
        sourceColumn?.parentElement === row
          ? columns.indexOf(sourceColumn)
          : -1;
      const removeSourceColumn =
        sourceColumnIndex >= 0 &&
        meaningfulColumnChildCount(sourceColumn) === 1;
      const visibleColumns = columns
        .map((column, index) => ({ column, index }))
        .filter(
          ({ index }) => !removeSourceColumn || index !== sourceColumnIndex,
        );
      let insertionIndex =
        intent.edge === "left"
          ? (intent.columnIndex ?? 0)
          : (intent.columnIndex ?? columns.length - 1) + 1;
      if (removeSourceColumn && sourceColumnIndex < insertionIndex) {
        insertionIndex -= 1;
      }
      insertionIndex = Math.max(
        0,
        Math.min(insertionIndex, visibleColumns.length),
      );

      const futureColumns = visibleColumns.map(({ column }) =>
        cloneColumnWithoutSource(column, sourceElement),
      );
      futureColumns.splice(insertionIndex, 0, previewColumn(sourceElement));
      grid.style.gridTemplateColumns = `repeat(${futureColumns.length}, minmax(0, 1fr))`;
      futureColumns.forEach((column) => grid.append(column));
    } else {
      const targetColumn = document.createElement("div");
      targetColumn.dataset.type = "column";
      targetColumn.append(cloneForPortfolioDndPreview(row));
      const incoming = previewColumn(sourceElement);
      grid.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
      if (intent.edge === "left") grid.append(incoming, targetColumn);
      else grid.append(targetColumn, incoming);
    }

    overlay.classList.add("ramzy-dnd-layout-overlay-horizontal");
    overlay.append(grid);
    positionOverlay(rowRect.left, rowRect.top, rowRect.width, rowRect.height);
  };

  const renderVertical = (sourceElement: HTMLElement, intent: DropIntent) => {
    const rowRect = intent.rowElement.getBoundingClientRect();
    const sourceRect = sourceElement.getBoundingClientRect();
    const stack = document.createElement("div");
    stack.className = "ramzy-dnd-future-stack";
    const targetClone = cloneForPortfolioDndPreview(intent.rowElement);
    const sourceClone = cloneForPortfolioDndPreview(sourceElement);
    sourceClone.classList.add("ramzy-dnd-vertical-ghost");
    const gap = 16;
    if (intent.edge === "top") stack.append(sourceClone, targetClone);
    else stack.append(targetClone, sourceClone);
    overlay.classList.add("ramzy-dnd-layout-overlay-vertical");
    overlay.append(stack);

    const sourceHeight = Math.max(40, sourceRect.height);
    const top =
      intent.edge === "top" ? rowRect.top - sourceHeight - gap : rowRect.top;
    positionOverlay(
      rowRect.left,
      top,
      rowRect.width,
      rowRect.height + sourceHeight + gap,
    );
  };

  const render = (sourceElement: HTMLElement, intent: DropIntent) => {
    const key = `${intent.targetPosition}:${intent.columnIndex}:${intent.edge}:${sourceElement.dataset.nodeViewContent ?? ""}`;
    if (activeKey === key) return;
    clear();
    activeKey = key;
    mutedTarget = intent.rowElement;
    mutedTarget.classList.add("ramzy-dnd-preview-target-muted");
    overlay.dataset.dropLabel = dropLabel(intent.edge);

    if (intent.edge === "left" || intent.edge === "right") {
      renderHorizontal(sourceElement, intent);
    } else {
      renderVertical(sourceElement, intent);
    }
  };

  return {
    clear,
    render,
    destroy: () => {
      clear();
      overlay.remove();
      host.style.position = previousHostPosition;
    },
  };
}

function resolveIntent(
  editor: Editor,
  source: DragData,
  pointer: { x: number; y: number },
): DropIntent | null {
  const domIntent = resolvePortfolioDropIntent(
    editor.view.dom,
    source.sourceElement,
    pointer,
  );
  if (!domIntent) return null;
  const targetPosition = topLevelPosition(editor, domIntent.rowElement);
  return targetPosition === null ? null : { ...domIntent, targetPosition };
}

export function PortfolioDnd({ editor }: { editor: Editor }) {
  useEffect(() => {
    if (editor.isDestroyed || !editor.isEditable) return;

    const editorDom = editor.view.dom;
    const preview = createPortfolioPreview(editor);
    let sourceElement: HTMLElement | null = null;
    let activeIntent: DropIntent | null = null;
    let draggableCleanups: Array<() => void> = [];
    let reconcileFrame = 0;
    let reconcileTimer = 0;
    let dragging = false;

    const destroyDraggables = () => {
      draggableCleanups.forEach((cleanup) => cleanup());
      draggableCleanups = [];
    };

    const nativePreview = (
      nativeSetDragImage: (element: Element, x: number, y: number) => void,
    ) => {
      setCustomNativeDragPreview({
        nativeSetDragImage,
        getOffset: pointerOutsideOfPreview({ x: "14px", y: "10px" }),
        render: ({ container }) => {
          const card = document.createElement("div");
          card.classList.add("ramzy-dnd-native-preview");
          container.appendChild(card);
        },
      });
    };

    const addDraggable = (
      element: HTMLElement,
      handle: HTMLElement,
      position: number,
    ) => {
      draggableCleanups.push(
        draggable({
          element,
          dragHandle: handle,
          getInitialData: () => ({
            type: PORTFOLIO_BLOCK,
            sourcePosition: position,
            sourceElement: element,
            label: blockLabel(element),
          }),
          onGenerateDragPreview: ({ nativeSetDragImage }) =>
            nativePreview(nativeSetDragImage),
        }),
      );
    };

    const reconcile = () => {
      if (dragging || editor.isDestroyed) return;
      destroyDraggables();

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
      if (!globalHandle) return;

      let prepared: { element: HTMLElement; position: number } | null = null;
      const prepare = (event: PointerEvent) => {
        prepared = elementAtHandlePointer(editor, event.clientX, event.clientY);
      };
      globalHandle.addEventListener("pointerdown", prepare, true);
      draggableCleanups.push(() =>
        globalHandle.removeEventListener("pointerdown", prepare, true),
      );
      draggableCleanups.push(
        draggable({
          element: globalHandle,
          dragHandle: globalHandle,
          canDrag: () => prepared !== null,
          getInitialData: () => ({
            type: PORTFOLIO_BLOCK,
            sourcePosition: prepared?.position ?? -1,
            sourceElement: prepared?.element ?? editorDom,
            label: prepared
              ? blockLabel(prepared.element)
              : "Portfolio element",
          }),
          onGenerateDragPreview: ({ nativeSetDragImage }) =>
            nativePreview(nativeSetDragImage),
        }),
      );
    };

    const scheduleReconcile = () => {
      if (dragging) return;
      cancelAnimationFrame(reconcileFrame);
      window.clearTimeout(reconcileTimer);
      reconcileFrame = requestAnimationFrame(reconcile);
      reconcileTimer = window.setTimeout(reconcile, 120);
    };

    const surfaceCleanup = dropTargetForElements({
      element: editorDom,
      canDrop: ({ source }) => isDragData(source.data),
      getData: () => ({ type: PORTFOLIO_SURFACE }),
      getIsSticky: () => true,
    });

    const monitorCleanup = monitorForElements({
      canMonitor: ({ source }) => isDragData(source.data),
      onDragStart: ({ source }) => {
        if (!isDragData(source.data)) return;
        dragging = true;
        activeIntent = null;
        sourceElement = source.data.sourceElement;
        sourceElement.classList.add("ramzy-dnd-source");
      },
      onDrag: ({ source, location }) => {
        if (!isDragData(source.data)) return;
        activeIntent = resolveIntent(editor, source.data, {
          x: location.current.input.clientX,
          y: location.current.input.clientY,
        });
        if (activeIntent)
          preview.render(source.data.sourceElement, activeIntent);
        else preview.clear();
      },
      onDrop: ({ source, location }) => {
        const sourceData = isDragData(source.data) ? source.data : null;
        const finalIntent = sourceData
          ? (resolveIntent(editor, sourceData, {
              x: location.current.input.clientX,
              y: location.current.input.clientY,
            }) ?? activeIntent)
          : null;

        sourceElement?.classList.remove("ramzy-dnd-source");
        sourceElement = null;
        activeIntent = null;
        preview.clear();
        dragging = false;

        if (!sourceData || !finalIntent) {
          scheduleReconcile();
          return;
        }

        const transaction =
          finalIntent.edge === "left" || finalIntent.edge === "right"
            ? createPortfolioGridDropTransaction(
                editor.state,
                finalIntent.targetPosition,
                finalIntent.edge,
                finalIntent.columnIndex,
                sourceData.sourcePosition,
              )
            : createPortfolioVerticalDropTransaction(
                editor.state,
                finalIntent.targetPosition,
                finalIntent.edge,
                sourceData.sourcePosition,
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
      surfaceCleanup();
      autoScrollCleanup();
      destroyDraggables();
      sourceElement?.classList.remove("ramzy-dnd-source");
      preview.destroy();
    };
  }, [editor]);

  return null;
}
