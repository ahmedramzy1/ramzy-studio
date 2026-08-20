import React from "react";
import type { Editor } from "@tiptap/react";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Box, Menu, Text } from "@mantine/core";
import {
  IconBoxMargin,
  IconCheck,
  IconColumnInsertRight,
  IconColumnRemove,
  IconEraser,
  IconPalette,
  IconRowInsertBottom,
  IconRowRemove,
  IconSquareToggle,
  IconTableRow,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useTableClear } from "../hooks/use-table-clear";
import {
  FAMILY_LABELS,
  INTENSITY_LABELS,
  RAMZY_COLOR_FAMILIES,
  RAMZY_COLOR_INTENSITIES,
  TABLE_COLORS,
} from "../../table-background-color";
import { AlignmentSubmenu } from "./alignment-submenu";

interface CellChevronMenuProps {
  editor: Editor;
  cellPos: number;
  tableNode: ProseMirrorNode;
  tablePos: number;
}

export const CellChevronMenu = React.memo(function CellChevronMenu({
  editor,
  cellPos,
  tableNode,
  tablePos,
}: CellChevronMenuProps) {
  const { t } = useTranslation();

  const clearCell = useTableClear(editor, tableNode, tablePos, {
    kind: "cell",
    cellPos,
  });

  const currentColor =
    editor.getAttributes("tableCell").backgroundColor ||
    editor.getAttributes("tableHeader").backgroundColor ||
    "";

  const setBackground = (color: string, name: string | null) => {
    editor
      .chain()
      .focus()
      .updateAttributes("tableCell", {
        backgroundColor: color || null,
        backgroundColorName: color ? name : null,
      })
      .updateAttributes("tableHeader", {
        backgroundColor: color || null,
        backgroundColorName: color ? name : null,
      })
      .run();
  };

  return (
    <>
      <Menu.Sub position="right-start">
        <Menu.Sub.Target>
          <Menu.Sub.Item leftSection={<IconPalette size={16} />}>
            {t("Background color")}
          </Menu.Sub.Item>
        </Menu.Sub.Target>
        <Menu.Sub.Dropdown>
          <div style={{ padding: 10, minWidth: 380 }}>
            <button
              type="button"
              onClick={() => setBackground("", null)}
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                padding: "4px 6px 10px",
                cursor: "pointer",
                textAlign: "left",
                color: "var(--mantine-color-text)",
                fontSize: 12,
              }}
            >
              {t("Default color")}
            </button>

            <Text size="sm" fw={600} mb="xs">
              {t("Cell background")}
            </Text>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "56px repeat(8, 32px)",
                columnGap: 5,
                rowGap: 5,
                alignItems: "center",
              }}
            >
              <span />
              {RAMZY_COLOR_FAMILIES.map((family) => (
                <Text
                  key={`${family}-label`}
                  size="xs"
                  c="dimmed"
                  ta="center"
                  fw={500}
                  style={{ fontSize: 9, lineHeight: 1.1 }}
                >
                  {FAMILY_LABELS[family]}
                </Text>
              ))}

              {RAMZY_COLOR_INTENSITIES.map((intensity) => (
                <React.Fragment key={intensity}>
                  <Text
                    size="xs"
                    c="dimmed"
                    fw={500}
                    style={{ fontSize: 10, lineHeight: 1.1 }}
                  >
                    {INTENSITY_LABELS[intensity]}
                  </Text>

                  {RAMZY_COLOR_FAMILIES.map((family) => {
                    const color = TABLE_COLORS.find(
                      (item) =>
                        item.family === family && item.intensity === intensity,
                    );

                    if (!color) return <span key={`${family}-${intensity}`} />;

                    const isActive = currentColor === color.color;

                    return (
                      <button
                        key={color.token}
                        type="button"
                        onClick={() => setBackground(color.color, color.token)}
                        aria-label={t(color.name)}
                        aria-pressed={isActive}
                        title={t(color.name)}
                        style={{
                          border: "none",
                          background: "transparent",
                          padding: 0,
                          cursor: "pointer",
                          width: 32,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          style={{
                            width: 32,
                            height: 28,
                            borderRadius: 6,
                            border: isActive
                              ? "2px solid var(--mantine-color-gray-8)"
                              : "1px solid var(--mantine-color-gray-4)",
                            backgroundColor: color.color,
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
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Menu.Sub.Dropdown>
      </Menu.Sub>

      <AlignmentSubmenu editor={editor} />

      <Menu.Item
        leftSection={<IconBoxMargin size={16} />}
        onClick={() => editor.chain().focus().mergeCells().run()}
        disabled={!editor?.can().mergeCells()}
      >
        {t("Merge cells")}
      </Menu.Item>
      <Menu.Item
        leftSection={<IconSquareToggle size={16} />}
        onClick={() => editor.chain().focus().splitCell().run()}
        disabled={!editor?.can().splitCell()}
      >
        {t("Split cell")}
      </Menu.Item>
      <Menu.Item
        leftSection={<IconTableRow size={16} />}
        onClick={() => editor.chain().focus().toggleHeaderCell().run()}
      >
        {t("Toggle header cell")}
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item
        leftSection={<IconColumnInsertRight size={16} />}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        {t("Add column right")}
      </Menu.Item>
      <Menu.Item
        leftSection={<IconRowInsertBottom size={16} />}
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        {t("Add row below")}
      </Menu.Item>

      <Menu.Item leftSection={<IconEraser size={16} />} onClick={clearCell}>
        {t("Clear cell")}
      </Menu.Item>
      <Menu.Item
        leftSection={<IconColumnRemove size={16} />}
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        {t("Delete column")}
      </Menu.Item>
      <Menu.Item
        leftSection={<IconRowRemove size={16} />}
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        {t("Delete row")}
      </Menu.Item>
    </>
  );
});
