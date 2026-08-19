import React, { Dispatch, FC, SetStateAction } from "react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import {
  Box,
  Button,
  Popover,
  rem,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { useTranslation } from "react-i18next";
import { isEditorReady } from "@docmost/editor-ext";
import clsx from "clsx";
import classes from "./bubble-menu.module.css";

const RAMZY_COLOR_FAMILIES = [
  "ink",
  "cobalt",
  "azure",
  "teal",
  "verdant",
  "amber",
  "coral",
  "violet",
] as const;

const RAMZY_COLOR_INTENSITIES = ["soft", "medium", "strong"] as const;

type RamzyColorFamily = (typeof RAMZY_COLOR_FAMILIES)[number];
type RamzyColorIntensity = (typeof RAMZY_COLOR_INTENSITIES)[number];
type ColorGrid = "text" | "highlight";

const FAMILY_LABELS: Record<RamzyColorFamily, string> = {
  ink: "Ink",
  cobalt: "Cobalt",
  azure: "Azure",
  teal: "Teal",
  verdant: "Verdant",
  amber: "Amber",
  coral: "Coral",
  violet: "Violet",
};

const INTENSITY_LABELS: Record<RamzyColorIntensity, string> = {
  soft: "Soft",
  medium: "Medium",
  strong: "Strong",
};

export interface BubbleColorMenuItem {
  name: string;
  color: string;
  token: string;
  family: RamzyColorFamily;
  intensity: RamzyColorIntensity;
}

interface ColorSelectorProps {
  editor: Editor | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function createRamzyColors(kind: ColorGrid): BubbleColorMenuItem[] {
  return RAMZY_COLOR_INTENSITIES.flatMap((intensity) =>
    RAMZY_COLOR_FAMILIES.map((family) => {
      const token = `${family}-${intensity}`;
      return {
        name: `${FAMILY_LABELS[family]} · ${INTENSITY_LABELS[intensity]}`,
        token,
        family,
        intensity,
        color: `var(--ramzy-${kind}-${token})`,
      };
    }),
  );
}

const TEXT_COLORS = createRamzyColors("text");
const HIGHLIGHT_COLORS = createRamzyColors("highlight");
const COLOR_GRID_COLS = RAMZY_COLOR_FAMILIES.length;
const COLOR_GRID_ROWS = RAMZY_COLOR_INTENSITIES.length;

function focusSwatch(grid: ColorGrid, index: number) {
  document
    .querySelector<HTMLElement>(
      `[data-color-grid="${grid}"][data-color-index="${index}"]`,
    )
    ?.focus();
}

function handleColorKeyNav(
  e: React.KeyboardEvent<HTMLDivElement>,
  index: number,
  grid: ColorGrid,
) {
  const row = Math.floor(index / COLOR_GRID_COLS);
  const col = index % COLOR_GRID_COLS;

  if (e.key === "ArrowRight") {
    e.preventDefault();
    if (col < COLOR_GRID_COLS - 1) focusSwatch(grid, index + 1);
    return;
  }

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (col > 0) focusSwatch(grid, index - 1);
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (row < COLOR_GRID_ROWS - 1) {
      focusSwatch(grid, index + COLOR_GRID_COLS);
    } else if (grid === "text") {
      focusSwatch("highlight", col);
    } else {
      document
        .querySelector<HTMLElement>('[data-color-grid="remove"]')
        ?.focus();
    }
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (row > 0) {
      focusSwatch(grid, index - COLOR_GRID_COLS);
    } else if (grid === "highlight") {
      focusSwatch("text", (COLOR_GRID_ROWS - 1) * COLOR_GRID_COLS + col);
    } else {
      document
        .querySelector<HTMLElement>('[data-color-grid="default"]')
        ?.focus();
    }
  }
}

export const ColorSelector: FC<ColorSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const { t } = useTranslation();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return null;

      const activeColors: Record<string, boolean> = {};

      TEXT_COLORS.forEach(({ color }) => {
        activeColors[`text_${color}`] = ctx.editor.isActive("textStyle", {
          color,
        });
      });

      HIGHLIGHT_COLORS.forEach(({ color }) => {
        activeColors[`highlight_${color}`] = ctx.editor.isActive("highlight", {
          color,
        });
      });

      return activeColors;
    },
  });

  if (!editor || !editorState) return null;

  const activeColorItem = TEXT_COLORS.find(
    ({ color }) => editorState[`text_${color}`],
  );
  const activeHighlightItem = HIGHLIGHT_COLORS.find(
    ({ color }) => editorState[`highlight_${color}`],
  );

  const resetColors = () => {
    if (!isEditorReady(editor)) return;
    editor.commands.unsetColor();
    editor.commands.unsetHighlight();
    setIsOpen(false);
  };

  const renderGrid = (kind: ColorGrid) => {
    const colors = kind === "text" ? TEXT_COLORS : HIGHLIGHT_COLORS;

    return (
      <Box>
        <Text size="sm" fw={600} mb="xs">
          {t(kind === "text" ? "Text color" : "Highlight color")}
        </Text>

        <Box
          style={{
            display: "grid",
            gridTemplateColumns: `${rem(56)} repeat(${COLOR_GRID_COLS}, ${rem(32)})`,
            columnGap: rem(5),
            rowGap: rem(5),
            alignItems: "center",
          }}
        >
          <Box aria-hidden />
          {RAMZY_COLOR_FAMILIES.map((family) => (
            <Text
              key={`${kind}-${family}-header`}
              size="xs"
              ta="center"
              c="dimmed"
              fw={500}
              style={{ fontSize: rem(9), lineHeight: 1.1 }}
            >
              {FAMILY_LABELS[family]}
            </Text>
          ))}

          {RAMZY_COLOR_INTENSITIES.map((intensity, rowIndex) => (
            <React.Fragment key={`${kind}-${intensity}`}>
              <Text
                size="xs"
                c="dimmed"
                fw={500}
                style={{ fontSize: rem(10), lineHeight: 1.1 }}
              >
                {INTENSITY_LABELS[intensity]}
              </Text>

              {RAMZY_COLOR_FAMILIES.map((family, colIndex) => {
                const index = rowIndex * COLOR_GRID_COLS + colIndex;
                const { name, color, token } = colors[index];
                const isActive = !!editorState[`${kind}_${color}`];

                const applyColor = () => {
                  if (!isEditorReady(editor)) return;

                  if (kind === "text") {
                    editor.chain().focus().setColor(color).run();
                  } else {
                    editor
                      .chain()
                      .focus()
                      .toggleMark("highlight", { color, colorName: token })
                      .run();
                  }
                  setIsOpen(false);
                };

                return (
                  <Tooltip key={`${kind}-${family}-${intensity}`} label={t(name)} withArrow>
                    <Box
                      role="button"
                      tabIndex={0}
                      data-autofocus={kind === "text" && index === 0 ? true : undefined}
                      data-color-grid={kind}
                      data-color-index={index}
                      className={classes.colorSwatch}
                      aria-label={t(name)}
                      aria-pressed={isActive}
                      onClick={applyColor}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          applyColor();
                          return;
                        }
                        handleColorKeyNav(e, index, kind);
                      }}
                      style={{
                        width: rem(32),
                        height: rem(28),
                        borderRadius: rem(kind === "text" ? 6 : 4),
                        border: isActive
                          ? "2px solid var(--mantine-color-gray-8)"
                          : "1px solid var(--mantine-color-gray-4)",
                        backgroundColor:
                          kind === "highlight"
                            ? color
                            : "var(--mantine-color-body)",
                        cursor: "pointer",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: rem(16),
                        fontWeight: 600,
                        color:
                          kind === "text"
                            ? color
                            : "var(--mantine-color-gray-8)",
                      }}
                    >
                      {kind === "highlight" && isActive ? (
                        <IconCheck size={16} color="var(--mantine-color-gray-9)" />
                      ) : (
                        "A"
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Popover
      width={390}
      opened={isOpen}
      onChange={setIsOpen}
      trapFocus
      withArrow
    >
      <Popover.Target>
        <Tooltip label={t("Text color")} withArrow>
          <Button
            variant="default"
            radius="0"
            rightSection={<IconChevronDown size={16} />}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsOpen(!isOpen)}
            data-text-color={activeColorItem?.color || ""}
            data-highlight-color={activeHighlightItem?.color || ""}
            className={clsx(["color-selector-trigger", classes.buttonRoot])}
            style={{ fontWeight: 500, fontSize: rem(16) }}
            aria-label={t("Text color")}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
          >
            A
          </Button>
        </Tooltip>
      </Popover.Target>

      <Popover.Dropdown onMouseDown={(e) => e.preventDefault()}>
        <Stack gap="md" p="2px">
          <Button
            variant="subtle"
            size="compact-sm"
            fullWidth
            data-color-grid="default"
            onClick={resetColors}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                focusSwatch("text", 0);
              }
            }}
          >
            {t("Default color")}
          </Button>

          {renderGrid("text")}
          {renderGrid("highlight")}

          <Button
            variant="default"
            fullWidth
            data-color-grid="remove"
            className={classes.removeColor}
            onClick={resetColors}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                focusSwatch(
                  "highlight",
                  (COLOR_GRID_ROWS - 1) * COLOR_GRID_COLS,
                );
              }
            }}
          >
            {t("Remove color")}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
