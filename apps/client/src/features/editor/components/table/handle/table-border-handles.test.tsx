// @vitest-environment jsdom
import { act, cleanup, render, waitFor } from "@testing-library/react";
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
  TableDndExtension,
  TableDndKey,
  TableHandleCommandsExtension,
} from "@docmost/editor-ext";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TableHandlesLayer } from "./table-handles-layer";

// Keep the real editor/plugin and visibility hook; floating placement and menu
// rendering are independent of whether a border reveals the correct handle.
vi.mock("./column-handle", () => ({
  ColumnHandle: ({ visible }: { visible: boolean }) => (
    <button
      data-ramzy-table-handle="col"
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      Column
    </button>
  ),
}));
vi.mock("./row-handle", () => ({
  RowHandle: ({ visible }: { visible: boolean }) => (
    <button
      data-ramzy-table-handle="row"
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      Row
    </button>
  ),
}));
vi.mock("./cell-chevron", () => ({
  CellChevron: () => <button>Cell menu</button>,
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
  it("keeps grips hidden for cell contents and text selection; reveals only the relevant perimeter", async () => {
    const { cells } = await setup();
    act(() => editor.commands.setTextSelection(4));
    expect(visible("row")).toBe(false);
    expect(visible("col")).toBe(false);
    move(cells[0], 180, 125);
    expect(visible("row")).toBe(false);
    expect(visible("col")).toBe(false);
    move(cells[2], 103, 175);
    expect(visible("row")).toBe(true);
    expect(visible("col")).toBe(false);
    move(cells[1], 400, 103);
    expect(visible("row")).toBe(false);
    expect(visible("col")).toBe(true);
    move(cells[1], 400, 125);
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

  it("retains a focused grip, an open menu and an active drag, then hides on return to cell content", async () => {
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
      expect(layer.querySelectorAll("button")).toHaveLength(0),
    );
    act(() => editor.unmount());
    expect(() => move(document.body, 50, 50)).not.toThrow();
  });
});
