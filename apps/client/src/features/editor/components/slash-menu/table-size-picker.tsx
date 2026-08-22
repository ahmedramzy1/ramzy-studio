import { Paper, Text } from "@mantine/core";
import type { Editor, Range } from "@tiptap/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const MAX_ROWS = 10;
const MAX_COLS = 10;
const DEFAULT_ROWS = 3;
const DEFAULT_COLS = 3;

export type TableSizePickerProps = {
  editor: Editor;
  range: Range;
  onCancel: () => void;
};

export function TableSizePicker({
  editor,
  range,
  onCancel,
}: TableSizePickerProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pickerRef.current?.focus();
  }, []);

  const insertTable = useCallback(
    (nextRows = rows, nextCols = cols) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({
          rows: nextRows,
          cols: nextCols,
          withHeaderRow: true,
        })
        .run();
    },
    [cols, editor, range, rows],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCancel();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        insertTable();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        setCols((value) => Math.min(MAX_COLS, value + 1));
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        setCols((value) => Math.max(1, value - 1));
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        event.stopPropagation();
        setRows((value) => Math.min(MAX_ROWS, value + 1));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        event.stopPropagation();
        setRows((value) => Math.max(1, value - 1));
      }
    },
    [insertTable, onCancel],
  );

  return (
    <Paper shadow="md" p="sm" withBorder w={270}>
      <div
        ref={pickerRef}
        tabIndex={0}
        role="dialog"
        aria-label={t("Choose table size")}
        onKeyDown={handleKeyDown}
        style={{ outline: "none" }}
      >
        <Text size="sm" fw={600} mb={2}>
          {t("Table")}
        </Text>
        <Text size="xs" c="dimmed" mb="sm" aria-live="polite">
          {rows} × {cols}
        </Text>

        <div
          role="grid"
          aria-label={t("Table dimensions")}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${MAX_COLS}, 1fr)`,
            gap: 4,
          }}
        >
          {Array.from({ length: MAX_ROWS * MAX_COLS }, (_, index) => {
            const row = Math.floor(index / MAX_COLS) + 1;
            const col = (index % MAX_COLS) + 1;
            const selected = row <= rows && col <= cols;

            return (
              <button
                key={`${row}-${col}`}
                type="button"
                role="gridcell"
                aria-label={t("{{rows}} rows by {{cols}} columns", {
                  rows: row,
                  cols: col,
                })}
                aria-selected={selected}
                onMouseEnter={() => {
                  setRows(row);
                  setCols(col);
                }}
                onFocus={() => {
                  setRows(row);
                  setCols(col);
                }}
                onClick={() => insertTable(row, col)}
                style={{
                  aspectRatio: "1 / 1",
                  minWidth: 0,
                  borderRadius: 3,
                  border: selected
                    ? "1px solid var(--mantine-primary-color-filled)"
                    : "1px solid var(--mantine-color-default-border)",
                  background: selected
                    ? "var(--mantine-primary-color-light)"
                    : "var(--mantine-color-body)",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            );
          })}
        </div>

        <Text size="xs" c="dimmed" mt="sm">
          {t("Use arrow keys to resize, Enter to insert, or Escape to go back.")}
        </Text>
      </div>
    </Paper>
  );
}

export default TableSizePicker;
