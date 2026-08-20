import { useEffect, useRef, useState } from "react";
import { ActionIcon, Box, Group, Text, Tooltip } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const MAX_ROWS = 10;
const MAX_COLS = 10;
const DEFAULT_ROWS = 3;
const DEFAULT_COLS = 3;

type TableSizePickerProps = {
  onSelect: (rows: number, cols: number) => void;
  onBack: () => void;
};

export function TableSizePicker({ onSelect, onBack }: TableSizePickerProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusCell = (nextRows: number, nextCols: number) => {
    const boundedRows = Math.min(MAX_ROWS, Math.max(1, nextRows));
    const boundedCols = Math.min(MAX_COLS, Math.max(1, nextCols));
    setRows(boundedRows);
    setCols(boundedCols);
    const index = (boundedRows - 1) * MAX_COLS + (boundedCols - 1);
    requestAnimationFrame(() => cellRefs.current[index]?.focus());
  };

  useEffect(() => {
    const index = (DEFAULT_ROWS - 1) * MAX_COLS + (DEFAULT_COLS - 1);
    cellRefs.current[index]?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusCell(rows, cols + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusCell(rows, cols - 1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focusCell(rows + 1, cols);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusCell(rows - 1, cols);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(rows, cols);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onBack();
    }
  };

  return (
    <Box w={270} p="xs">
      <Group gap="xs" mb="xs" wrap="nowrap">
        <Tooltip label={t("Back")}>
          <ActionIcon
            variant="subtle"
            size="sm"
            aria-label={t("Back")}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onBack}
          >
            <IconArrowLeft size={16} />
          </ActionIcon>
        </Tooltip>
        <Box style={{ minWidth: 0 }}>
          <Text size="sm" fw={600}>
            {t("Insert table")}
          </Text>
          <Text size="xs" c="dimmed">
            {rows} × {cols}
          </Text>
        </Box>
      </Group>

      <Box
        role="grid"
        aria-label={t("Choose table size")}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${MAX_COLS}, 20px)`,
          gap: 4,
          width: "fit-content",
          margin: "0 auto",
          padding: 4,
        }}
      >
        {Array.from({ length: MAX_ROWS * MAX_COLS }, (_, index) => {
          const cellRow = Math.floor(index / MAX_COLS) + 1;
          const cellCol = (index % MAX_COLS) + 1;
          const isSelected = cellRow <= rows && cellCol <= cols;
          const isAnchor = cellRow === rows && cellCol === cols;

          return (
            <Box
              component="button"
              key={`${cellRow}-${cellCol}`}
              ref={(node: HTMLButtonElement | null) => {
                cellRefs.current[index] = node;
              }}
              type="button"
              role="gridcell"
              aria-label={`${cellRow} × ${cellCol}`}
              aria-selected={isSelected}
              tabIndex={isAnchor ? 0 : -1}
              onMouseEnter={() => {
                setRows(cellRow);
                setCols(cellCol);
              }}
              onFocus={() => {
                setRows(cellRow);
                setCols(cellCol);
              }}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(cellRow, cellCol)}
              onKeyDown={handleKeyDown}
              style={{
                appearance: "none",
                width: 20,
                height: 20,
                padding: 0,
                borderRadius: 4,
                border: isSelected
                  ? "1px solid var(--mantine-primary-color-filled)"
                  : "1px solid var(--mantine-color-default-border)",
                background: isSelected
                  ? "var(--mantine-primary-color-light)"
                  : "var(--mantine-color-body)",
                cursor: "pointer",
                transition: "background-color 80ms ease, border-color 80ms ease",
              }}
            />
          );
        })}
      </Box>

      <Text ta="center" size="xs" c="dimmed" mt="xs">
        {t("Move across the grid, then click to insert")}
      </Text>
    </Box>
  );
}
