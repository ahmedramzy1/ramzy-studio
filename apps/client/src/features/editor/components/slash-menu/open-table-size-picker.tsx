import React from "react";
import { createRoot } from "react-dom/client";
import { Paper } from "@mantine/core";
import type { Editor } from "@tiptap/react";
import type { Range } from "@tiptap/core";
import { TableSizePicker } from "./table-size-picker";

export function openTableSizePicker(editor: Editor, range: Range) {
  const host = document.createElement("div");
  host.setAttribute("data-ramzy-table-size-picker", "true");
  host.style.position = "absolute";
  host.style.zIndex = "250";

  const coords = editor.view.coordsAtPos(range.from);
  const width = 286;
  const viewportPadding = 12;
  const left = Math.max(
    viewportPadding,
    Math.min(coords.left, window.innerWidth - width - viewportPadding),
  );

  host.style.left = `${left + window.scrollX}px`;
  host.style.top = `${coords.bottom + 8 + window.scrollY}px`;
  document.body.appendChild(host);

  const root = createRoot(host);
  let closed = false;

  const close = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener("mousedown", handleOutsideMouseDown, true);
    document.removeEventListener("keydown", handleEscape, true);
    root.unmount();
    host.remove();
  };

  const handleOutsideMouseDown = (event: MouseEvent) => {
    if (!host.contains(event.target as Node)) close();
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
      editor.commands.focus();
    }
  };

  root.render(
    <Paper shadow="md" withBorder p={0}>
      <TableSizePicker
        onBack={() => {
          close();
          editor.commands.focus();
        }}
        onSelect={(rows, cols) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertTable({ rows, cols, withHeaderRow: true })
            .run();
          close();
        }}
      />
    </Paper>,
  );

  // Register after the originating click/keypress has completed so it does
  // not immediately count as an outside interaction.
  window.setTimeout(() => {
    if (closed) return;
    document.addEventListener("mousedown", handleOutsideMouseDown, true);
    document.addEventListener("keydown", handleEscape, true);
  }, 0);
}
