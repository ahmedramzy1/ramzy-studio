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
  closestPortfolioDropEdge,
  portfolioPreviewColumnPlan,
  portfolioTwoColumnPreviewRects,
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
  restore: () => void;
};

type PreviewSlotRect = Pick<DOMRect, "left" | "top" | "width" | "height">;

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

function createPortfolioDndPreviewLayer(editor: Editor) {
  const host = editor.view.dom.parentElement ?? editor.view.dom;
  const previousHostPosition = host.style.position;
  if (getComputedStyle(host).position === "static") {
    host.style.position = "relative";
  }
  const element = document.createElement("div");
  element.className = "ramzy-dnd-drop-slot";
  element.setAttribute("contenteditable", "false");
  element.setAttribute("aria-hidden", "true");
  host.appendChild(element);

  let active: ActivePreview | null = null;

  const clear = () => {
    active?.restore();
    element.className = "ramzy-dnd-drop-slot";
    delete element.dataset.dropLabel;
    element.replaceChildren();
    element.style.display = "none";
    element.style.removeProperty("min-height");
    active = null;
  };

  const positionSlot = (
    rect: PreviewSlotRect,
    hostRect: DOMRect,
    edge: Edge,
    sourceElement: HTMLElement,
  ) => {
    const ghost = cloneForPortfolioDndPreview(sourceElement);
    ghost.classList.add("ramzy-dnd-landing-ghost");
    element.replaceChildren(ghost);
    element.style.display = "block";
    element.style.top = `${rect.top - hostRect.top + host.scrollTop}px`;
    element.style.left = `${rect.left - hostRect.left + host.scrollLeft}px`;
    element.style.width = `${rect.width}px`;
    element.style.height = "auto";
    element.style.minHeight = `${Math.max(rect.height, 40)}px`;
    element.dataset.dropLabel =
      edge === "left"
        ? "Place on left"
        : edge === "right"
          ? "Place on right"
          : edge === "top"
            ? "Place above"
            : "Place below";
    element.classList.add(`ramzy-dnd-drop-slot-${edge}`);
  };

  const render = (sourceElement: HTMLElement, target: DropData, edge: Edge) => {
    const key = `${target.targetPosition}:${target.columnIndex}:${edge}`;
    if (active?.key === key) return;
    clear();

    const hostRect = host.getBoundingClientRect();
    const row = target.rowElement;
    const rowRect = row.getBoundingClientRect();
    const restoreActions: Array<() => void> = [];

    if (edge === "left" || edge === "right") {
      if (target.columnIndex === null) {
        const gap = 32;
        const geometry = portfolioTwoColumnPreviewRects(rowRect, gap, edge);
        row.style.setProperty(
          "--ramzy-dnd-preview-column-width",
          `${geometry.columnWidth}px`,
        );
        row.style.setProperty(
          "--ramzy-dnd-preview-column-offset",
          `${geometry.targetLeft - rowRect.left}px`,
        );
        row.classList.add(
          "ramzy-dnd-single-target",
          `ramzy-dnd-single-target-${edge}`,
        );
        restoreActions.push(() => {
          row.classList.remove(
            "ramzy-dnd-single-target",
            `ramzy-dnd-single-target-${edge}`,
          );
          row.style.removeProperty("--ramzy-dnd-preview-column-width");
          row.style.removeProperty("--ramzy-dnd-preview-column-offset");
        });
        const resizedRect = row.getBoundingClientRect();
        positionSlot(
          {
            left: geometry.slotLeft,
            top: resizedRect.top,
            width: geometry.columnWidth,
            height: resizedRect.height,
          },
          hostRect,
          edge,
          sourceElement,
        );
      } else {
        const columns = Array.from(row.children).filter(
          (child): child is HTMLElement =>
            child instanceof HTMLElement && child.dataset.type === "column",
        );
        const sourceColumn = sourceElement.closest<HTMLElement>(
          '[data-type="column"]',
        );
        const sourceColumnIndex =
          sourceColumn?.parentElement === row
            ? columns.indexOf(sourceColumn)
            : -1;
        const hideSourceColumn =
          sourceColumnIndex >= 0 && sourceColumn?.childElementCount === 1;
        const plan = portfolioPreviewColumnPlan(
          columns.length,
          target.columnIndex,
          edge,
          sourceColumnIndex,
          hideSourceColumn,
        );

        if (sourceColumnIndex >= 0 && sourceColumn) {
          if (hideSourceColumn) {
            sourceColumn.classList.add("ramzy-dnd-preview-source-column");
            restoreActions.push(() =>
              sourceColumn.classList.remove("ramzy-dnd-preview-source-column"),
            );
          } else {
            sourceElement.classList.add("ramzy-dnd-preview-source-block");
            restoreActions.push(() =>
              sourceElement.classList.remove("ramzy-dnd-preview-source-block"),
            );
          }
        }

        row.classList.add(
          "ramzy-dnd-grid-target",
          `ramzy-dnd-grid-target-${edge}`,
        );
        row.style.setProperty(
          "--ramzy-dnd-preview-order",
          String(plan.insertionIndex * 2),
        );
        restoreActions.push(() => {
          row.classList.remove(
            "ramzy-dnd-grid-target",
            `ramzy-dnd-grid-target-${edge}`,
          );
          row.style.removeProperty("--ramzy-dnd-preview-order");
        });

        columns.forEach((column, index) => {
          const order = plan.orders[index];
          if (order === null) return;
          const previousOrder = column.style.order;
          column.style.order = String(order);
          restoreActions.push(() => {
            column.style.order = previousOrder;
          });
        });

        const nextRect = row.getBoundingClientRect();
        const futureCount = plan.futureColumnCount;
        const gap = Number.parseFloat(getComputedStyle(row).gap) || 32;
        const orderedVisibleColumns = columns
          .map((column, index) => ({
            column,
            order: plan.orders[index],
          }))
          .filter(
            (item): item is { column: HTMLElement; order: number } =>
              item.order !== null,
          )
          .sort((left, right) => left.order - right.order);
        const columnWeights = orderedVisibleColumns.map(({ column }) => {
          const weight = Number.parseFloat(getComputedStyle(column).flexGrow);
          return Number.isFinite(weight) && weight > 0 ? weight : 1;
        });
        const availableWidth =
          nextRect.width - gap * Math.max(0, futureCount - 1);
        const totalWeight =
          columnWeights.reduce((sum, weight) => sum + weight, 0) + 1;
        const slotWidth = Math.max(40, availableWidth / totalWeight);
        const precedingWidth = columnWeights
          .slice(0, plan.insertionIndex)
          .reduce(
            (sum, weight) => sum + (availableWidth * weight) / totalWeight,
            0,
          );
        const slotLeft =
          nextRect.left + precedingWidth + plan.insertionIndex * gap;
        positionSlot(
          {
            left: slotLeft,
            top: nextRect.top,
            width: slotWidth,
            height: nextRect.height,
          },
          hostRect,
          edge,
          sourceElement,
        );
      }
    } else {
      const sourceHeight = Math.max(
        sourceElement.getBoundingClientRect().height,
        40,
      );
      const gap = 16;
      const space = sourceHeight + gap;
      row.style.setProperty("--ramzy-dnd-preview-space", `${space}px`);
      row.classList.add(
        edge === "top"
          ? "ramzy-dnd-preview-space-top"
          : "ramzy-dnd-preview-space-bottom",
      );
      restoreActions.push(() => {
        row.classList.remove(
          "ramzy-dnd-preview-space-top",
          "ramzy-dnd-preview-space-bottom",
        );
        row.style.removeProperty("--ramzy-dnd-preview-space");
      });
      const shiftedRect = row.getBoundingClientRect();
      const slotTop =
        edge === "top" ? shiftedRect.top - space : shiftedRect.bottom + gap;
      positionSlot(
        {
          left: rowRect.left,
          top: slotTop,
          width: rowRect.width,
          height: sourceHeight,
        },
        hostRect,
        edge,
        sourceElement,
      );
    }

    active = {
      key,
      restore: () => restoreActions.reverse().forEach((restore) => restore()),
    };
  };

  return {
    element,
    clear,
    render,
    destroy: () => {
      clear();
      element.remove();
      host.style.position = previousHostPosition;
    },
  };
}

export function PortfolioDnd({ editor }: { editor: Editor }) {
  useEffect(() => {
    if (editor.isDestroyed || !editor.isEditable) return;

    const preview = createPortfolioDndPreviewLayer(editor);
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
                const card = document.createElement("div");
                card.classList.add("ramzy-dnd-native-preview");
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
          canDrop: ({ source }) => {
            if (!isDragData(source.data)) return false;
            if (
              data.columnIndex === null &&
              source.data.sourcePosition === data.targetPosition
            ) {
              return false;
            }
            if (data.columnIndex !== null) {
              const sourceColumn =
                source.data.sourceElement.closest<HTMLElement>(
                  '[data-type="column"]',
                );
              if (sourceColumn === data.rowElement.children[data.columnIndex]) {
                return false;
              }
            }
            return true;
          },
          getData: ({ input, element: targetElement, source }) => {
            const sourceData = isDragData(source.data) ? source.data : null;
            const sourceRow = sourceData?.sourceElement.closest<HTMLElement>(
              '[data-type="columns"]',
            );
            const rowIsFull =
              data.columnIndex !== null &&
              data.rowElement.childElementCount >= 4 &&
              sourceRow !== data.rowElement;
            const availableEdges: Edge[] = rowIsFull
              ? ["top", "bottom"]
              : allowedEdges;
            const preferredEdge = closestPortfolioDropEdge(
              targetElement.getBoundingClientRect(),
              { x: input.clientX, y: input.clientY },
              availableEdges,
            );
            return attachClosestEdge(data, {
              input,
              element: targetElement,
              allowedEdges: [preferredEdge],
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
          prepared = elementAtHandlePointer(
            editor,
            event.clientX,
            event.clientY,
          );
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
              label: prepared
                ? blockLabel(prepared.element)
                : "Portfolio element",
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
          addDropTarget(column, { ...data, columnIndex }, [
            "top",
            "bottom",
            "left",
            "right",
          ]);
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
              NodeSelection.create(
                editor.state.doc,
                source.data.sourcePosition,
              ),
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
      preview.destroy();
    };
  }, [editor]);

  return null;
}
