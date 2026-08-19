import React, { Dispatch, FC, SetStateAction } from "react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import {
  Box,
  Button,
  Popover,
  rem,
  SimpleGrid,
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
  token?: string;
}

interface ColorSelectorProps {
  editor: Editor | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function createRamzyColors(kind: "text" | "highlight"): BubbleColorMenuItem[] {
  return [
    { name: "Default", color: "" },
    ...RAMZY_COLOR_FAMILIES.flatMap((family) =>
      RAMZY_COLOR_INTENSITIES.map((intensity) => {
        const token = `${family}-${intensity}`;
        return {
          name: `${FAMILY_LABELS[family]} · ${INTENSITY_LABELS[intensity]}`,
          token,
          color: `var(--ramzy-${kind}-${token})`,
        };
      }),
    ),
  ];
}

const TEXT_COLORS = createRamzyColors("text");
const HIGHLIGHT_COLORS = createRamzyColors("highlight");
const COLOR_GRID_COLS = 5;

function focusSwatch(grid: "text" | "highlight", index: number) {
  const el = document.querySelector<HTMLElement>(
    `[data-color-grid="${grid}"][data-color-index="${index}"]`,
  );
  el?.focus();
}

function handleColorKeyNav(
  e: React.KeyboardEvent<HTMLDivElement>,
  index: number,
  grid: "text" | "highlight",
) {
  const total =
    grid === "text" ? TEXT_COLORS.length : HIGHLIGHT_COLORS.length;
  const col = index % COLOR_GRID_COLS;

  if (e.key === "ArrowRight") {
    e.preventDefault();
    if (index < total - 1) focusSwatch(grid, index + 1);
    return;
  }

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (index > 0) focusSwatch(grid, index - 1);
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const next = index + COLOR_GRID_COLS;
    if (next < total) {
      focusSwatch(grid, next);
    } else if (grid === "text") {
      focusSwatch("highlight", Math.min(col, HIGHLIGHT_COLORS.length - 1));
    } else {
      document
        .querySelector<HTMLElement>('[data-color-grid="remove"]')
        ?.focus();
    }
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    const prev = index - COLOR_GRID_COLS;
    if (prev >= 0) {
      focusSwatch(grid, prev);
    } else if (grid === "highlight") {
      const lastRowStart =
        Math.floor((TEXT_COLORS.length - 1) / COLOR_GRID_COLS) *
        COLOR_GRID_COLS;
      focusSwatch(
        "text",
        Math.min(lastRowStart + col, TEXT_COLORS.length - 1),
      );
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

  return (
    <Popover
      width={220}
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
          <Box>
            <Text size="sm" fw={600} mb="xs">
              {t("Text color")}
            </Text>
            <SimpleGrid cols={COLOR_GRID_COLS} spacing="xs">
              {TEXT_COLORS.map(({ name, color }, index) => {
                const applyTextColor = () => {
                  if (!isEditorReady(editor)) return;

                  if (!color) {
                    editor.commands.unsetColor();
                  } else {
                    editor.chain().focus().setColor(color).run();
                  }
                  setIsOpen(false);
                };

                return (
                  <Tooltip key={name} label={t(name)} withArrow>
                    <Box
                      role="button"
                      tabIndex={0}
                      data-autofocus={index === 0 ? true : undefined}
                      data-color-grid="text"
                      data-color-index={index}
                      className={classes.colorSwatch}
                      aria-label={t(name)}
                      aria-pressed={!!editorState[`text_${color}`]}
                      onClick={applyTextColor}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          applyTextColor();
                          return;
                        }
                        handleColorKeyNav(e, index, "text");
                      }}
                      style={{
                        width: rem(28),
                        height: rem(28),
                        borderRadius: rem(6),
                        border: editorState[`text_${color}`]
                          ? "2px solid var(--mantine-color-gray-8)"
                          : "1px solid var(--mantine-color-gray-4)",
                        cursor: "pointer",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: rem(16),
                        fontWeight: 600,
                        color: color || "var(--mantine-color-gray-8)",
                      }}
                    >
                      A
                    </Box>
                  </Tooltip>
                );
              })}
            </SimpleGrid>
          </Box>

          <Box>
            <Text size="sm" fw={600} mb="xs">
              {t("Highlight color")}
            </Text>
            <SimpleGrid cols={COLOR_GRID_COLS} spacing="xs">
              {HIGHLIGHT_COLORS.map(({ name, color, token }, index) => {
                const applyHighlight = () => {
                  if (!isEditorReady(editor)) return;

                  if (!color) {
                    editor.commands.unsetHighlight();
                  } else {
                    editor
                      .chain()
                      .focus()
                      .toggleMark("highlight", {
                        color,
                        colorName: token || "",
                      })
                      .run();
                  }
                  setIsOpen(false);
                };

                return (
                  <Tooltip key={name} label={t(name)} withArrow>
                    <Box
                      role="button"
                      tabIndex={0}
                      data-color-grid="highlight"
                      data-color-index={index}
                      className={classes.colorSwatch}
                      aria-label={t(name)}
                      aria-pressed={!!editorState[`highlight_${color}`]}
                      onClick={applyHighlight}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          applyHighlight();
                          return;
                        }
                        handleColorKeyNav(e, index, "highlight");
                      }}
                      style={{
                        width: rem(28),
                        height: rem(28),
                        borderRadius: rem(4),
                        backgroundColor:
                          color || "var(--mantine-color-gray-2)",
                        border: "1px solid var(--mantine-color-gray-4)",
                        cursor: "pointer",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: rem(16),
                        fontWeight: 600,
                        color: "var(--mantine-color-gray-8)",
                      }}
                    >
                      {editorState[`highlight_${color}`] ? (
                        <IconCheck
                          size={16}
                          color="var(--mantine-color-green-7)"
                        />
                      ) : (
                        "A"
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
            </SimpleGrid>
          </Box>

          <Button
            variant="default"
            fullWidth
            data-color-grid="remove"
            className={classes.removeColor}
            onClick={() => {
              if (isEditorReady(editor)) {
                editor.commands.unsetColor();
                editor.commands.unsetHighlight();
              }
              setIsOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                const lastRowStart =
                  Math.floor(
                    (HIGHLIGHT_COLORS.length - 1) / COLOR_GRID_COLS,
                  ) * COLOR_GRID_COLS;
                focusSwatch("highlight", lastRowStart);
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
