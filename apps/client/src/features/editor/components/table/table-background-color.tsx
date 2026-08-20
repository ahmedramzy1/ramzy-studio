import React, { FC } from "react";
import { IconCheck, IconPalette } from "@tabler/icons-react";
import {
  ActionIcon,
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

export interface TableColorItem {
  name: string;
  color: string;
  token: string;
  family: RamzyColorFamily;
  intensity: RamzyColorIntensity;
}

interface TableBackgroundColorProps {
  editor: Editor | null;
}

export const TABLE_COLORS: TableColorItem[] = RAMZY_COLOR_INTENSITIES.flatMap(
  (intensity) =>
    RAMZY_COLOR_FAMILIES.map((family) => {
      const token = `${family}-${intensity}`;
      return {
        name: `${FAMILY_LABELS[family]} · ${INTENSITY_LABELS[intensity]}`,
        color: `var(--ramzy-highlight-${token})`,
        token,
        family,
        intensity,
      };
    }),
);

const COLOR_GRID_COLS = RAMZY_COLOR_FAMILIES.length;

export const TableBackgroundColor: FC<TableBackgroundColorProps> = ({
  editor,
}) => {
  const { t } = useTranslation();
  const [opened, setOpened] = React.useState(false);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return null;
      }

      let currentColor = "";
      if (ctx.editor.isActive("tableCell")) {
        const attrs = ctx.editor.getAttributes("tableCell");
        currentColor = attrs.backgroundColor || "";
      } else if (ctx.editor.isActive("tableHeader")) {
        const attrs = ctx.editor.getAttributes("tableHeader");
        currentColor = attrs.backgroundColor || "";
      }

      return {
        currentColor,
        isTableCell: ctx.editor.isActive("tableCell"),
        isTableHeader: ctx.editor.isActive("tableHeader"),
      };
    },
  });

  if (!editor || !editorState) {
    return null;
  }

  const setTableCellBackground = (color: string, colorName: string | null) => {
    editor
      .chain()
      .focus()
      .updateAttributes("tableCell", {
        backgroundColor: color || null,
        backgroundColorName: color ? colorName : null,
      })
      .updateAttributes("tableHeader", {
        backgroundColor: color || null,
        backgroundColorName: color ? colorName : null,
      })
      .run();
    setOpened(false);
  };

  return (
    <Popover
      width={390}
      position="bottom"
      opened={opened}
      onChange={setOpened}
      withArrow
      trapFocus
      transitionProps={{ transition: "pop" }}
    >
      <Popover.Target>
        <Tooltip label={t("Background color")} withArrow>
          <ActionIcon
            variant="subtle"
            size="lg"
            aria-label={t("Background color")}
            onClick={() => setOpened(!opened)}
          >
            <IconPalette size={18} />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>

      <Popover.Dropdown onMouseDown={(event) => event.preventDefault()}>
        <Stack gap="md" p="2px">
          <Button
            variant="subtle"
            size="compact-sm"
            fullWidth
            onClick={() => setTableCellBackground("", null)}
          >
            {t("Default color")}
          </Button>

          <Box>
            <Text size="sm" fw={600} mb="xs">
              {t("Cell background")}
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
                  key={`${family}-header`}
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
                <React.Fragment key={intensity}>
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
                    const item = TABLE_COLORS[index];
                    const isActive = editorState.currentColor === item.color;

                    return (
                      <Tooltip key={item.token} label={t(item.name)} withArrow>
                        <Box
                          role="button"
                          tabIndex={0}
                          aria-label={t(item.name)}
                          aria-pressed={isActive}
                          onClick={() =>
                            setTableCellBackground(item.color, item.token)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setTableCellBackground(item.color, item.token);
                            }
                          }}
                          style={{
                            width: rem(32),
                            height: rem(28),
                            borderRadius: rem(4),
                            border: isActive
                              ? "2px solid var(--mantine-color-gray-8)"
                              : "1px solid var(--mantine-color-gray-4)",
                            backgroundColor: item.color,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isActive && (
                            <IconCheck
                              size={16}
                              color="var(--mantine-color-gray-9)"
                            />
                          )}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
