import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SlashMenuGroupedItemsType,
  SlashMenuItemType,
} from "@/features/editor/components/slash-menu/types";
import {
  ActionIcon,
  Badge,
  Group,
  Paper,
  ScrollArea,
  Text,
  Tooltip,
  UnstyledButton,
  VisuallyHidden,
} from "@mantine/core";
import classes from "./slash-menu.module.css";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useHasFeature } from "@/ee/hooks/use-feature";
import { Feature } from "@/ee/features";
import { useUpgradeLabel } from "@/ee/hooks/use-upgrade-label";
import TableSizePicker from "./table-size-picker";
import { isPortfolioAuthoringMode } from "./portfolio-menu";

type CommandListProps = {
  items: SlashMenuGroupedItemsType;
  command: any;
  editor: any;
  range: any;
};

export type CommandListHandle = {
  onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
};

const portfolioHeadingStyle = (
  title: string,
): React.CSSProperties | undefined => {
  if (!isPortfolioAuthoringMode()) return undefined;

  if (title === "Heading 1") {
    return {
      fontFamily: '"Fraunces", Georgia, serif',
      fontSize: 46,
      fontWeight: 400,
      letterSpacing: "-0.025em",
      lineHeight: 1.08,
    };
  }

  if (title === "Heading 2") {
    return {
      fontFamily: '"Fraunces", Georgia, serif',
      fontSize: 32,
      fontWeight: 400,
      letterSpacing: "-0.025em",
      lineHeight: 1.16,
    };
  }

  if (title === "Heading 3") {
    return {
      fontFamily: '"Fraunces", Georgia, serif',
      fontSize: 25,
      fontWeight: 400,
      letterSpacing: "-0.025em",
      lineHeight: 1.22,
    };
  }

  if (title === "Text") {
    return {
      fontFamily: '"DM Sans", system-ui, sans-serif',
      fontSize: 19,
      fontWeight: 400,
      lineHeight: 1.45,
    };
  }

  return undefined;
};

const CommandList = forwardRef<CommandListHandle, CommandListProps>(
  ({ items, command, editor, range }, ref) => {
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tablePickerOpen, setTablePickerOpen] = useState(false);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [countAnnouncement, setCountAnnouncement] = useState("");
    const [selectionAnnouncement, setSelectionAnnouncement] = useState("");

    const hasBases = useHasFeature(Feature.BASES);
    const upgradeLabel = useUpgradeLabel();
    // Without the bases entitlement the item stays visible but inert; an
    // expired license the client can't detect falls through to a handled
    // create failure.
    const isItemDisabled = (item: SlashMenuItemType) =>
      !hasBases && item.requiresBases === true;

    const flatItems = useMemo(() => {
      return Object.values(items).flat();
    }, [items]);

    const selectItem = useCallback(
      (index: number) => {
        const item = flatItems[index];
        if (item && !isItemDisabled(item)) {
          if (item.title === "Table") {
            setTablePickerOpen(true);
            return;
          }

          command(item);
        }
      },
      [command, flatItems, hasBases],
    );

    const onKeyDown = useCallback(
      ({ event }: { event: KeyboardEvent }) => {
        if (tablePickerOpen || flatItems.length === 0) return false;

        if (event.key === "ArrowUp") {
          event.preventDefault();
          setSelectedIndex(
            (selectedIndex + flatItems.length - 1) % flatItems.length,
          );
          return true;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setSelectedIndex((selectedIndex + 1) % flatItems.length);
          return true;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          selectItem(selectedIndex);
          return true;
        }

        return false;
      },
      [flatItems.length, selectedIndex, selectItem, tablePickerOpen],
    );

    // TipTap's Suggestion plugin asks the rendered menu whether it consumed a
    // key event. Handling Enter here is critical: it prevents ProseMirror from
    // inserting a paragraph before the slash command has a chance to execute.
    useImperativeHandle(ref, () => ({ onKeyDown }), [onKeyDown]);

    useEffect(() => {
      setSelectedIndex(0);
      setTablePickerOpen(false);
    }, [flatItems]);

    useEffect(() => {
      if (flatItems.length === 0) {
        setCountAnnouncement("");
        return;
      }
      setCountAnnouncement(
        t("{{count}} command available", { count: flatItems.length }),
      );
    }, [flatItems.length, t]);

    useEffect(() => {
      const item = flatItems[selectedIndex];
      if (!item) {
        setSelectionAnnouncement("");
        return;
      }
      setSelectionAnnouncement(`${t(item.title)}, ${t(item.description)}`);
    }, [selectedIndex, flatItems, t]);

    useEffect(() => {
      if (tablePickerOpen) return;

      viewportRef.current
        ?.querySelector(`[data-item-index="${selectedIndex}"]`)
        ?.scrollIntoView({ block: "nearest" });
    }, [selectedIndex, tablePickerOpen]);

    if (tablePickerOpen) {
      return (
        <TableSizePicker
          editor={editor}
          range={range}
          onCancel={() => setTablePickerOpen(false)}
        />
      );
    }

    return flatItems.length > 0 ? (
      <Paper
        id="slash-command"
        shadow="md"
        p="xs"
        withBorder
        role="listbox"
        aria-label={t("Slash commands")}
        aria-activedescendant={`slash-command-option-${selectedIndex}`}
      >
        <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
          {countAnnouncement}
        </VisuallyHidden>
        <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
          {selectionAnnouncement}
        </VisuallyHidden>
        <ScrollArea
          viewportRef={viewportRef}
          h={350}
          w={340}
          scrollbarSize={8}
          overscrollBehavior="contain"
        >
          {(() => {
            let flatIndex = -1;
            return Object.entries(items).map(([category, categoryItems]) => (
              <div key={category} role="group" aria-label={category}>
                <Text c="dimmed" mb={4} fw={500} tt="capitalize">
                  {category}
                </Text>
                {categoryItems.map((item: SlashMenuItemType) => {
                  flatIndex += 1;
                  const itemIndex = flatIndex;
                  const disabled = isItemDisabled(item);
                  const previewStyle = portfolioHeadingStyle(item.title);
                  return (
                    <Tooltip
                      key={itemIndex}
                      label={upgradeLabel}
                      disabled={!disabled}
                      position="right"
                    >
                      <UnstyledButton
                        data-item-index={itemIndex}
                        id={`slash-command-option-${itemIndex}`}
                        role="option"
                        aria-selected={itemIndex === selectedIndex}
                        aria-disabled={disabled}
                        onClick={() => selectItem(itemIndex)}
                        className={clsx(classes.menuBtn, {
                          [classes.selectedItem]: itemIndex === selectedIndex,
                          [classes.gatedItem]: disabled,
                        })}
                      >
                        <Group wrap="nowrap" align="flex-start">
                          <ActionIcon
                            variant="default"
                            component="div"
                            aria-hidden="true"
                            mt={previewStyle ? 4 : 0}
                          >
                            <item.icon size={18} />
                          </ActionIcon>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={
                                previewStyle ?? {
                                  fontSize: 14,
                                  fontWeight: 500,
                                  lineHeight: 1.4,
                                }
                              }
                            >
                              {t(item.title)}
                            </div>

                            <Text c="dimmed" size="xs" mt={previewStyle ? 4 : 0}>
                              {t(item.description)}
                            </Text>
                          </div>

                          {disabled && (
                            <Badge size="xs" variant="light" color="gray">
                              {t("Upgrade")}
                            </Badge>
                          )}
                        </Group>
                      </UnstyledButton>
                    </Tooltip>
                  );
                })}
              </div>
            ));
          })()}
        </ScrollArea>
      </Paper>
    ) : null;
  },
);

CommandList.displayName = "CommandList";

export default CommandList;
