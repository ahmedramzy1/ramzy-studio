// @vitest-environment jsdom
import { act, cleanup, render, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";
import {
  TableDndExtension,
  TableHandleCommandsExtension,
  TableDndKey,
} from "@docmost/editor-ext";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TableHandlesLayer } from "./table-handles-layer";
let editor: Editor;
beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
});
afterEach(() => {
  cleanup();
  editor?.destroy();
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});
it.each(["Row", "Column"])(
  "keeps the real %s drag source outside editor stacking and mounted through a drag",
  async (axis) => {
    const host = document.createElement("div");
    host.className = "editor-container";
    host.style.isolation = "isolate";
    const mount = document.createElement("div");
    const layer = document.createElement("div");
    host.append(mount, layer);
    document.body.append(host);
    editor = new Editor({
      element: mount,
      extensions: [
        Document,
        Paragraph,
        Text,
        Table,
        TableRow,
        TableCell,
        TableHeader,
        TableDndExtension,
        TableHandleCommandsExtension,
      ],
      content:
        "<table><tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></table>",
    });
    render(
      <MantineProvider>
        <TableHandlesLayer editor={editor} borderOnly />
      </MantineProvider>,
      { container: layer },
    );
    await waitFor(() => expect(editor.isInitialized).toBe(true));
    const cell = editor.view.dom.querySelector("td")!;
    act(() =>
      cell.dispatchEvent(
        new MouseEvent("pointermove", {
          bubbles: true,
          clientX: 100,
          clientY: 100,
        }),
      ),
    );
    const selector = `[data-ramzy-table-handle="${axis === "Row" ? "row" : "col"}"]`;
    await waitFor(() =>
      expect(document.querySelector(selector)).not.toBeNull(),
    );
    const grip = document.querySelector<HTMLElement>(selector)!;
    await waitFor(() => expect(grip.getAttribute("draggable")).toBe("true"));
    expect(host.contains(grip)).toBe(false);
    expect(grip.style.position).toBe("fixed");
    act(() =>
      editor.view.dispatch(
        editor.state.tr.setMeta(TableDndKey, {
          dragging: { orientation: axis === "Row" ? "row" : "col", index: 0 },
        }),
      ),
    );
    act(() =>
      document.body.dispatchEvent(
        new MouseEvent("pointermove", {
          bubbles: true,
          clientX: 900,
          clientY: 900,
        }),
      ),
    );
    expect(document.querySelector(selector)).toBe(grip);
    expect(grip.getAttribute("draggable")).toBe("true");
    act(() => editor.setEditable(false));
    await waitFor(() =>
      expect(document.querySelector("[data-ramzy-table-handle]")).toBeNull(),
    );
  },
);
