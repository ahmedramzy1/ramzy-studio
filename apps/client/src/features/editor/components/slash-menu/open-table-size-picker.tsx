import type { Editor } from "@tiptap/react";
import type { Range } from "@tiptap/core";

const MAX_ROWS = 10;
const MAX_COLS = 10;
const DEFAULT_ROWS = 3;
const DEFAULT_COLS = 3;

export function openTableSizePicker(editor: Editor, range: Range) {
  document
    .querySelectorAll<HTMLElement>("[data-ramzy-table-size-picker]")
    .forEach((node) => node.remove());

  const coords = editor.view.coordsAtPos(range.from);
  const width = 286;
  const viewportPadding = 12;
  const left = Math.max(
    viewportPadding,
    Math.min(coords.left, window.innerWidth - width - viewportPadding),
  );

  const host = document.createElement("div");
  host.setAttribute("data-ramzy-table-size-picker", "true");
  host.tabIndex = -1;
  Object.assign(host.style, {
    position: "fixed",
    zIndex: "400",
    left: `${left}px`,
    top: `${Math.min(coords.bottom + 8, window.innerHeight - 330)}px`,
    width: `${width}px`,
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid var(--mantine-color-default-border, #dee2e6)",
    borderRadius: "8px",
    background: "var(--mantine-color-body, #fff)",
    color: "var(--mantine-color-text, #212529)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.14)",
    fontFamily: "inherit",
  });

  const header = document.createElement("div");
  Object.assign(header.style, {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  });

  const back = document.createElement("button");
  back.type = "button";
  back.textContent = "←";
  back.setAttribute("aria-label", "Back");
  Object.assign(back.style, {
    width: "28px",
    height: "28px",
    border: "0",
    borderRadius: "6px",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    fontSize: "18px",
    lineHeight: "1",
  });

  const headingWrap = document.createElement("div");
  const title = document.createElement("div");
  title.textContent = "Insert table";
  Object.assign(title.style, {
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "1.2",
  });

  const sizeLabel = document.createElement("div");
  Object.assign(sizeLabel.style, {
    marginTop: "2px",
    fontSize: "12px",
    color: "var(--mantine-color-dimmed, #868e96)",
  });

  headingWrap.append(title, sizeLabel);
  header.append(back, headingWrap);

  const grid = document.createElement("div");
  grid.setAttribute("role", "grid");
  grid.setAttribute("aria-label", "Choose table size");
  Object.assign(grid.style, {
    display: "grid",
    gridTemplateColumns: `repeat(${MAX_COLS}, 20px)`,
    gap: "4px",
    width: "fit-content",
    margin: "0 auto",
    padding: "4px",
  });

  const helper = document.createElement("div");
  helper.textContent = "Move across the grid, then click to insert";
  Object.assign(helper.style, {
    marginTop: "8px",
    textAlign: "center",
    fontSize: "12px",
    color: "var(--mantine-color-dimmed, #868e96)",
  });

  host.append(header, grid, helper);
  document.body.appendChild(host);

  let rows = DEFAULT_ROWS;
  let cols = DEFAULT_COLS;
  let closed = false;
  const cells: HTMLButtonElement[] = [];

  const close = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener("mousedown", handleOutsideMouseDown, true);
    document.removeEventListener("keydown", handleKeyDown, true);
    host.remove();
  };

  const updateGrid = () => {
    sizeLabel.textContent = `${rows} × ${cols}`;

    cells.forEach((cell, index) => {
      const cellRow = Math.floor(index / MAX_COLS) + 1;
      const cellCol = (index % MAX_COLS) + 1;
      const selected = cellRow <= rows && cellCol <= cols;
      cell.setAttribute("aria-selected", String(selected));
      cell.style.border = selected
        ? "1px solid var(--mantine-primary-color-filled, #228be6)"
        : "1px solid var(--mantine-color-default-border, #dee2e6)";
      cell.style.background = selected
        ? "var(--mantine-primary-color-light, #e7f5ff)"
        : "var(--mantine-color-body, #fff)";
    });
  };

  const insert = (selectedRows: number, selectedCols: number) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertTable({
        rows: selectedRows,
        cols: selectedCols,
        withHeaderRow: true,
      })
      .run();
    close();
  };

  for (let index = 0; index < MAX_ROWS * MAX_COLS; index += 1) {
    const cellRow = Math.floor(index / MAX_COLS) + 1;
    const cellCol = (index % MAX_COLS) + 1;
    const cell = document.createElement("button");
    cell.type = "button";
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("aria-label", `${cellRow} × ${cellCol}`);
    Object.assign(cell.style, {
      appearance: "none",
      width: "20px",
      height: "20px",
      padding: "0",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 80ms ease, border-color 80ms ease",
    });

    cell.addEventListener("mouseenter", () => {
      rows = cellRow;
      cols = cellCol;
      updateGrid();
    });
    cell.addEventListener("focus", () => {
      rows = cellRow;
      cols = cellCol;
      updateGrid();
    });
    cell.addEventListener("click", () => insert(cellRow, cellCol));

    cells.push(cell);
    grid.appendChild(cell);
  }

  back.addEventListener("click", () => {
    close();
    editor.commands.focus();
  });

  const handleOutsideMouseDown = (event: MouseEvent) => {
    if (!host.contains(event.target as Node)) close();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
      editor.commands.focus();
      return;
    }

    let nextRows = rows;
    let nextCols = cols;
    if (event.key === "ArrowRight") nextCols += 1;
    else if (event.key === "ArrowLeft") nextCols -= 1;
    else if (event.key === "ArrowDown") nextRows += 1;
    else if (event.key === "ArrowUp") nextRows -= 1;
    else if (event.key === "Enter") {
      event.preventDefault();
      insert(rows, cols);
      return;
    } else {
      return;
    }

    event.preventDefault();
    rows = Math.min(MAX_ROWS, Math.max(1, nextRows));
    cols = Math.min(MAX_COLS, Math.max(1, nextCols));
    updateGrid();
  };

  updateGrid();
  cells[(DEFAULT_ROWS - 1) * MAX_COLS + (DEFAULT_COLS - 1)]?.focus();

  window.setTimeout(() => {
    if (closed) return;
    document.addEventListener("mousedown", handleOutsideMouseDown, true);
    document.addEventListener("keydown", handleKeyDown, true);
  }, 0);
}
