import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import {
  Stack,
  Text,
  Anchor,
  ActionIcon,
  SimpleGrid,
  Paper,
} from "@mantine/core";
import { IconFileDescription } from "@tabler/icons-react";
import { useGetSidebarPagesQuery } from "@/features/page/queries/page-query";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import classes from "./subpages.module.css";
import styles from "../mention/mention.module.css";
import {
  buildPageUrl,
  buildSharedPageUrl,
} from "@/features/page/page.utils.ts";
import { useTranslation } from "react-i18next";
import { sortPositionKeys } from "@/features/page/tree/utils/utils";
import { useSharedPageSubpages } from "@/features/share/hooks/use-shared-page-subpages";

export default function SubpagesView(props: NodeViewProps) {
  const { editor, node } = props;
  const { spaceSlug, shareId } = useParams();
  const { t } = useTranslation();

  //@ts-ignore
  const currentPageId = editor.storage.pageId;

  // Get subpages from shared tree if we're in a shared context
  const sharedSubpages = useSharedPageSubpages(currentPageId);

  const { data, isLoading, error, refetch } = useGetSidebarPagesQuery(
    shareId ? null : { pageId: currentPageId },
  );

  const subpages = useMemo(() => {
    const pages =
      shareId && sharedSubpages
        ? sharedSubpages.map((node) => ({
            id: node.value,
            slugId: node.slugId,
            title: node.name,
            icon: node.icon,
            position: node.position,
          }))
        : data?.pages
          ? data.pages.flatMap((page) => page.items)
          : [];
    const sorted = sortPositionKeys(pages);
    return node.attrs.sort === "title"
      ? [...sorted].sort((left, right) =>
          String(left.title || "").localeCompare(String(right.title || "")),
        )
      : sorted;
  }, [data, node.attrs.sort, shareId, sharedSubpages]);

  if (isLoading && !shareId) {
    return null;
  }

  if (error && !shareId) {
    return (
      <NodeViewWrapper data-drag-handle>
        <Text c="dimmed" size="md" py="md">
          {t("Failed to load subpages")}
        </Text>
      </NodeViewWrapper>
    );
  }

  if (subpages.length === 0) {
    return (
      <NodeViewWrapper data-drag-handle>
        <div className={classes.container}>
          <Text c="dimmed" size="md" py="md">
            {t("No subpages")}
          </Text>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper data-drag-handle>
      <div className={classes.container}>
        {editor.isEditable && (
          <button
            type="button"
            hidden
            data-ramzy-element-action="refresh-subpages"
            onClick={() => void refetch()}
          />
        )}
        {node.attrs.layout === "cards" ? (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            {subpages.map((page) => (
              <Paper key={page.id} withBorder p="sm" radius="md">
                <Anchor
                  component={Link}
                  fw={600}
                  to={
                    shareId
                      ? buildSharedPageUrl({
                          shareId,
                          pageSlugId: page.slugId,
                          pageTitle: page.title,
                        })
                      : buildPageUrl(spaceSlug, page.slugId, page.title)
                  }
                  underline="never"
                  draggable={false}
                >
                  {node.attrs.showIcons !== false &&
                    (page?.icon ? (
                      <span style={{ marginRight: 6 }}>{page.icon}</span>
                    ) : (
                      <IconFileDescription
                        size={18}
                        style={{ marginRight: 6, verticalAlign: "text-bottom" }}
                      />
                    ))}
                  {page?.title || t("untitled")}
                </Anchor>
              </Paper>
            ))}
          </SimpleGrid>
        ) : (
          <Stack gap={5}>
            {subpages.map((page) => (
              <Anchor
                key={page.id}
                component={Link}
                fw={500}
                to={
                  shareId
                    ? buildSharedPageUrl({
                        shareId,
                        pageSlugId: page.slugId,
                        pageTitle: page.title,
                      })
                    : buildPageUrl(spaceSlug, page.slugId, page.title)
                }
                underline="never"
                className={styles.pageMentionLink}
                draggable={false}
              >
                {node.attrs.showIcons !== false &&
                  (page?.icon ? (
                    <span style={{ marginRight: "4px" }}>{page.icon}</span>
                  ) : (
                    <ActionIcon
                      variant="transparent"
                      color="gray"
                      component="span"
                      size={18}
                      style={{ verticalAlign: "text-bottom" }}
                    >
                      <IconFileDescription size={18} />
                    </ActionIcon>
                  ))}

                <span className={styles.pageMentionText}>
                  {page?.title || t("untitled")}
                </span>
              </Anchor>
            ))}
          </Stack>
        )}
      </div>
    </NodeViewWrapper>
  );
}
