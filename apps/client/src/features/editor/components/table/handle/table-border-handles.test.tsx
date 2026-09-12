import { UndoRedo } from "@tiptap/extensions";
import { CellSelection, TableMap } from "@tiptap/pm/tables";
import {
  activeTableCell,
  PortfolioTableCellFocus,
  prepareTableCellMenu,
} from "./lib/active-table-cell";
import { insertTableBoundary } from "./table-boundary-insert";
// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table";
import {
  getTableHandlePluginSpec,
  TableDndExtension,
  TableDndKey,
  TableHandleCommandsExtension,
} from "@docmost/editor-ext";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTableMoveRowColumn } from "./hooks/use-table-move-row-column";
import { TableHandlesLayer } from "./table-handles-layer";

// Keep the real editor/plugin and visibility hook; floating placement and menu
// rendering are independent of whether a border reveals the correct handle.
vi.mock("./column-handle", () => ({
  ColumnHandle: ({ visible, quiet }: { visible: boolean; quiet: boolean }) => (
    <button
      data-quiet={quiet}
      data-ramzy-table-handle="col"
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      Column
    </button>
  ),
}));
vi.mock("./row-handle", () => ({
  RowHandle: ({ visible, quiet }: { visible: boolean; quiet: boolean }) => (
    <button
      data-quiet={quiet}
      data-ramzy-table-handle="row"
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      Row
    </button>
  ),
}));
vi.mock("./cell-chevron", () => ({
  CellChevron: ({ cellPos }: { cellPos: number }) => (
    <button data-cell-pos={cellPos}>Cell menu</button>
  ),
}));

let editor: Editor;
const box = (x: number, y: number, w: number, h: number) =>
  new DOMRect(x, y, w, h);
async function setup() {
  const host = document.createElement("div");
  host.className = "editor-container";
  const element = document.createElement("div");
  const layer = document.createElement("div");
  host.append(element, layer);
  document.body.append(host);
  const cell = (text: string) => ({
    type: "tableCell",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  });
  editor = new Editor({
    element,
    extensions: [
      Document,
      Paragraph,
      Text,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      TableDndExtension,
      TableHandleCommandsExtension,
      PortfolioTableCellFocus,
      UndoRedo,
    ],
    content: {
      type: "doc",
      content: [
        {
          type: "table",
          content: [
            { type: "tableRow", content: [cell("A"), cell("B")] },
            { type: "tableRow", content: [cell("C"), cell("D")] },
          ],
        },
      ],
    },
  });
  const table = editor.view.dom.querySelector("table")!;
  vi.spyOn(table, "getBoundingClientRect").mockReturnValue(
    box(100, 100, 400, 100),
  );
  Array.from(table.rows).forEach((row, index) =>
    vi
      .spyOn(row, "getBoundingClientRect")
      .mockReturnValue(box(100, 100 + index * 50, 400, 50)),
  );
  const cells = Array.from(table.querySelectorAll("td"));
  cells.forEach((cell, index) =>
    vi
      .spyOn(cell, "getBoundingClientRect")
      .mockReturnValue(
        box(100 + (index % 2) * 200, 100 + Math.floor(index / 2) * 50, 200, 50),
      ),
  );
  render(<TableHandlesLayer editor={editor} borderOnly />, {
    container: layer,
  });
  await waitFor(() => expect(editor.isInitialized).toBe(true));
  return { cells, host, layer };
}
function move(target: Element, x: number, y: number) {
  const event = new MouseEvent("pointermove", {
    bubbles: true,
    clientX: x,
    clientY: y,
  });
  act(() => target.dispatchEvent(event));
}
const visible = (axis: string) =>
  document.querySelector<HTMLElement>(`[data-ramzy-table-handle="${axis}"]`)
    ?.style.visibility === "visible";

beforeEach(() => {
  vi.spyOn(window, "scrollBy").mockImplementation(() => {});
  Range.prototype.getClientRects = () => [] as unknown as DOMRectList;
  Range.prototype.getBoundingClientRect = () => new DOMRect();
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 0),
  );
  vi.stubGlobal("cancelAnimationFrame", clearTimeout);
});
afterEach(() => {
  cleanup();
  editor?.destroy();
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

describe("portfolio table border handles", () => {
  it("reveals both axes on any cell hover without requiring a border approach", async () => {
    const { cells } = await setup();
    act(() => editor.commands.setTextSelection(4));
    expect(visible("row")).toBe(false);
    expect(visible("col")).toBe(false);
    move(cells[0], 180, 125);
    expect(visible("row")).toBe(true);
    expect(visible("col")).toBe(true);
    move(cells[3], 400, 175);
    expect(visible("row")).toBe(true);
    expect(visible("col")).toBe(true);
    expect(TableDndKey.getState(editor.state)!.hoveringCell).toMatchObject({
      rowIndex: 1,
      colIndex: 1,
    });
    move(document.body, 700, 300);
    await waitFor(() => expect(visible("col")).toBe(false));
    expect(editor.getText()).toContain("A");
  });

  it("keeps the hovered cell stable across its border gutter even when another cell is selected", async () => {
    const { cells } = await setup();
    act(() => editor.commands.setTextSelection(4));
    move(cells[2], 103, 175);
    const target = TableDndKey.getState(editor.state)!.hoveringCell!.cellPos;
    move(editor.view.dom, 92, 175);
    expect(TableDndKey.getState(editor.state)!.hoveringCell!.cellPos).toBe(
      target,
    );
    expect(visible("row")).toBe(true);
    move(document.querySelector('[data-ramzy-table-handle="row"]')!, 91, 175);
    expect(visible("row")).toBe(true);
    move(document.body, 30, 300);
    expect(visible("row")).toBe(false);
  });

  it("retains a focused grip, an open menu and an active drag, then hides outside the table", async () => {
    const { cells } = await setup();
    move(cells[0], 103, 125);
    const grip = document.querySelector<HTMLElement>(
      '[data-ramzy-table-handle="row"]',
    )!;
    act(() => grip.focus());
    move(cells[0], 180, 125);
    expect(visible("row")).toBe(true);
    act(() => {
      grip.blur();
      editor.commands.freezeHandles();
    });
    move(cells[1], 400, 125);
    expect(visible("row")).toBe(true);
    act(() => editor.commands.unfreezeHandles());
    move(document.body, 700, 600);
    await waitFor(() => expect(visible("row")).toBe(false));
    move(cells[0], 103, 125);
    act(() =>
      editor.view.dispatch(
        editor.state.tr.setMeta(TableDndKey, {
          dragging: { orientation: "row", index: 0 },
        }),
      ),
    );
    move(document.body, 700, 600);
    expect(visible("row")).toBe(true);
    expect(grip.isConnected).toBe(true);
    act(() =>
      editor.view.dispatch(
        editor.state.tr.setMeta(TableDndKey, { dragging: null }),
      ),
    );
    await waitFor(() => expect(visible("row")).toBe(false));
  });

  it("hides table actions in readonly and safely detaches", async () => {
    const { cells, layer } = await setup();
    move(cells[0], 103, 125);
    act(() => editor.setEditable(false));
    await waitFor(() =>
      expect(
        document.querySelectorAll("[data-ramzy-table-handle]"),
      ).toHaveLength(0),
    );
    act(() => editor.unmount());
    expect(() => move(document.body, 50, 50)).not.toThrow();
  });
});

describe("Confluence reference cell interactions", () => {
  it("anchors the outline/menu to the caret cell while axis hover follows the pointer", async () => {
    const { cells } = await setup();
    act(() => editor.commands.setTextSelection(4));
    const selected = activeTableCell(editor.state)!.cellPos;
    move(cells[3], 400, 175);
    expect(screen.getByText("Cell menu").getAttribute("data-cell-pos")).toBe(
      String(selected),
    );
    expect(cells[0].classList.contains("ramzy-active-table-cell")).toBe(true);
    expect(cells[3].classList.contains("ramzy-active-table-cell")).toBe(false);
    expect(
      document
        .querySelector('[data-ramzy-table-handle="row"]')
        ?.getAttribute("data-quiet"),
    ).toBe("true");
    expect(visible("row")).toBe(true);
    act(() => editor.commands.goToNextCell());
    expect(activeTableCell(editor.state)!.cellPos).not.toBe(selected);
    expect(cells[1].classList.contains("ramzy-active-table-cell")).toBe(true);
  });

  it("preserves the caret and a multi-cell selection when opening the cell menu", async () => {
    await setup();
    act(() => editor.commands.setTextSelection(4));
    const selection = editor.state.selection;
    act(() =>
      prepareTableCellMenu(editor, activeTableCell(editor.state)!.cellPos),
    );
    expect(editor.state.selection.eq(selection)).toBe(true);
    act(() => editor.commands.unfreezeHandles());
    const table = editor.state.doc.firstChild!;
    const map = TableMap.get(table);
    act(() =>
      editor.view.dispatch(
        editor.state.tr.setSelection(
          CellSelection.create(
            editor.state.doc,
            1 + map.map[0],
            1 + map.map[3],
          ),
        ),
      ),
    );
    const range = editor.state.selection;
    act(() => prepareTableCellMenu(editor, 1 + map.map[0]));
    expect(editor.state.selection.eq(range)).toBe(true);
  });

  it("reveals one row-boundary plus, keeps it reachable, inserts there and undoes once", async () => {
    const { cells } = await setup();
    move(cells[0], 180, 125);
    expect(screen.queryByRole("button", { name: /Insert row/ })).toBeNull();
    act(() => editor.commands.insertContent("Typed before insertion"));
    move(cells[0], 102, 150);
    const button = screen.getByRole("button", { name: "Insert row 2" });
    move(button, 90, 150);
    const original = editor.getJSON();
    fireEvent.click(button);
    expect(editor.state.doc.firstChild!.childCount).toBe(3);
    expect(editor.state.doc.firstChild!.child(1).textContent).toBe("");
    expect(editor.state.doc.firstChild!.child(2).textContent).toBe("CD");
    expect(activeTableCell(editor.state)!.rowIndex).toBe(1);
    act(() => editor.commands.undo());
    expect(editor.getJSON()).toEqual(original);
  });

  it("inserts columns before the first and after the last without losing content", async () => {
    await setup();
    const insert = (index: number) =>
      act(() => {
        expect(
          insertTableBoundary(editor, {
            axis: "col",
            index,
            tablePos: 0,
            tableNode: editor.state.doc.firstChild!,
            x: 0,
            y: 0,
            length: 0,
          }),
        ).toBe(true);
      });
    insert(0);
    expect(TableMap.get(editor.state.doc.firstChild!).width).toBe(3);
    expect(editor.state.doc.firstChild!.child(0).child(1).textContent).toBe(
      "A",
    );
    insert(3);
    expect(TableMap.get(editor.state.doc.firstChild!).width).toBe(4);
    expect(editor.state.doc.firstChild!.child(1).child(2).textContent).toBe(
      "D",
    );
  });

  it("inserts at an internal rowspan boundary and rejects stale or readonly targets", async () => {
    await setup();
    const p = (text: string) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    });
    act(() =>
      editor.commands.setContent({
        type: "doc",
        content: [
          {
            type: "table",
            content: [
              {
                type: "tableRow",
                content: [
                  {
                    type: "tableCell",
                    attrs: { rowspan: 2 },
                    content: [p("Spanning")],
                  },
                  { type: "tableCell", content: [p("B")] },
                ],
              },
              {
                type: "tableRow",
                content: [{ type: "tableCell", content: [p("D")] }],
              },
            ],
          },
        ],
      }),
    );
    const target = {
      axis: "row" as const,
      index: 1,
      tablePos: 0,
      tableNode: editor.state.doc.firstChild!,
      x: 0,
      y: 0,
      length: 0,
    };
    act(() => expect(insertTableBoundary(editor, target)).toBe(true));
    expect(editor.state.doc.firstChild!.child(0).child(0).attrs.rowspan).toBe(
      3,
    );
    expect(editor.state.doc.firstChild!.child(1).textContent).toBe("");
    expect(editor.state.doc.firstChild!.child(2).textContent).toBe("D");
    expect(insertTableBoundary(editor, target)).toBe(false);
    act(() => editor.setEditable(false));
    expect(
      insertTableBoundary(editor, {
        ...target,
        tableNode: editor.state.doc.firstChild!,
      }),
    ).toBe(false);
  });
});

describe("table movement without selection", () => {
  it.each(["row", "col"] as const)(
    "drags a %s, leaves a caret and undoes in one step",
    async (axis) => {
      const { cells } = await setup();
      move(cells[0], 180, 125);
      const original = editor.getJSON();
      const spec = getTableHandlePluginSpec(editor)!;
      act(() => {
        expect(
          spec.startDragFromHandle(
            axis,
            axis === "row" ? 100 : 200,
            axis === "row" ? 125 : 100,
          ),
        ).toBe(true);
        spec.updateDragPosition(400, 175);
        spec.commitDrop();
        spec.endDrag();
      });
      expect(editor.state.doc.firstChild!.child(0).textContent).toBe(
        axis === "row" ? "CD" : "BA",
      );
      expect(editor.state.selection.empty).toBe(true);
      expect(editor.state.selection instanceof CellSelection).toBe(false);
      expect(document.querySelectorAll(".selectedCell")).toHaveLength(0);
      expect(
        activeTableCell(editor.state)![
          axis === "row" ? "rowIndex" : "colIndex"
        ],
      ).toBe(1);
      act(() => editor.commands.undo());
      expect(editor.getJSON()).toEqual(original);
    },
  );

  it.each(["row", "col"] as const)(
    "menu moves a selected %s without keeping the axis selected",
    async (axis) => {
      await setup();
      const table = editor.state.doc.firstChild!;
      const map = TableMap.get(table);
      act(() =>
        editor.view.dispatch(
          editor.state.tr.setSelection(
            CellSelection.create(
              editor.state.doc,
              1 + map.map[0],
              1 + map.map[axis === "row" ? 1 : 2],
            ),
          ),
        ),
      );
      const { result } = renderHook(() =>
        useTableMoveRowColumn(
          editor,
          axis,
          0,
          axis === "row" ? "down" : "right",
          table,
          0,
        ),
      );
      act(() => result.current.handleMove());
      expect(editor.state.doc.firstChild!.child(0).textContent).toBe(
        axis === "row" ? "CD" : "BA",
      );
      expect(editor.state.selection.empty).toBe(true);
      expect(editor.state.selection instanceof CellSelection).toBe(false);
    },
  );
});
