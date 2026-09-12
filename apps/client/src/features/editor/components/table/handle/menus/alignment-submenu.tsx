import React from "react";
import { type Editor, useEditorState } from "@tiptap/react";
import { Menu } from "@mantine/core";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconAlignBoxTopCenter,
  IconAlignBoxCenterMiddle,
  IconAlignBoxBottomCenter,
  IconCheck,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { currentCellAlignment, setCellAlignment } from "../lib/cell-alignment";

interface AlignmentSubmenuProps {
  editor: Editor;
}

const groups = [
  {
    axis: "textAlign" as const,
    label: "Horizontal alignment",
    icon: IconAlignLeft,
    options: [
      { value: "left", label: "Align left", icon: IconAlignLeft },
      { value: "center", label: "Align center", icon: IconAlignCenter },
      { value: "right", label: "Align right", icon: IconAlignRight },
    ],
  },
  {
    axis: "verticalAlign" as const,
    label: "Vertical alignment",
    icon: IconAlignBoxCenterMiddle,
    options: [
      {
        value: "top",
        label: "Align top (default)",
        icon: IconAlignBoxTopCenter,
      },
      {
        value: "middle",
        label: "Align middle",
        icon: IconAlignBoxCenterMiddle,
      },
      {
        value: "bottom",
        label: "Align bottom",
        icon: IconAlignBoxBottomCenter,
      },
    ],
  },
];

export const AlignmentSubmenu = React.memo(function AlignmentSubmenu({
  editor,
}: AlignmentSubmenuProps) {
  const { t } = useTranslation();
  const [openAxis, setOpenAxis] = React.useState<string | null>(null);
  const alignment = useEditorState({
    editor,
    selector: ({ editor }) => ({
      textAlign: currentCellAlignment(editor.state, "textAlign"),
      verticalAlign: currentCellAlignment(editor.state, "verticalAlign"),
    }),
  });

  return (
    <>
      {groups.map((group) => (
        <Menu.Sub
          key={group.axis}
          position="right-start"
          opened={openAxis === group.axis}
          onChange={(opened) => setOpenAxis((current) =>
            opened ? group.axis : current === group.axis ? null : current,
          )}
        >
          <Menu.Sub.Target>
            <Menu.Sub.Item
              leftSection={<group.icon size={16} />}
              closeMenuOnClick={false}
              onClick={() => setOpenAxis(group.axis)}
            >
              {t(group.label)}
            </Menu.Sub.Item>
          </Menu.Sub.Target>
          <Menu.Sub.Dropdown>
            {group.options.map((option) => (
              <Menu.Item
                key={option.value}
                role="menuitemradio"
                aria-checked={alignment[group.axis] === option.value}
                leftSection={<option.icon size={16} />}
                rightSection={
                  alignment[group.axis] === option.value ? (
                    <IconCheck size={14} />
                  ) : undefined
                }
                onClick={() =>
                  setCellAlignment(editor, group.axis, option.value)
                }
              >
                {t(option.label)}
              </Menu.Item>
            ))}
          </Menu.Sub.Dropdown>
        </Menu.Sub>
      ))}
    </>
  );
});
