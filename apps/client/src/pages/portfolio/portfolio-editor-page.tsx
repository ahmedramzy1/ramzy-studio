import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Center, Loader, Text } from "@mantine/core";
import { IconHistory } from "@tabler/icons-react";
import { useSetAtom } from "jotai";
import PageEditor from "@/features/editor/page-editor";
import { usePageQuery } from "@/features/page/queries/page-query";
import HistoryModal from "@/features/page-history/components/history-modal";
import { historyAtoms } from "@/features/page-history/atoms/history-atoms";
import { extractPageSlugId } from "@/lib";

/**
 * Clean portfolio-authoring surface.
 *
 * This intentionally reuses Docmost's real collaborative PageEditor rather
 * than recreating editing behaviour. It removes Docmost's wiki chrome so this
 * surface can become the Build canvas in the existing portfolio workflow.
 */
export default function PortfolioEditorPage() {
  const { pageSlug = "" } = useParams();
  const [searchParams] = useSearchParams();
  const setHistoryModalOpen = useSetAtom(historyAtoms);
  const pageId = extractPageSlugId(pageSlug);
  const { data: page, isLoading, isError } = usePageQuery({ pageId });
  const requestedTheme = searchParams.get("theme");
  const theme = requestedTheme === "light" ? "light" : "dark";

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousScheme = html.getAttribute("data-mantine-color-scheme");
    const previousHtmlBackground = html.style.background;
    const previousBodyBackground = body.style.background;
    const previousBodyMargin = body.style.margin;

    html.setAttribute("data-mantine-color-scheme", theme);
    html.style.background = "var(--mantine-color-body)";
    body.style.background = "var(--mantine-color-body)";
    body.style.margin = "0";

    return () => {
      if (previousScheme) html.setAttribute("data-mantine-color-scheme", previousScheme);
      else html.removeAttribute("data-mantine-color-scheme");
      html.style.background = previousHtmlBackground;
      body.style.background = previousBodyBackground;
      body.style.margin = previousBodyMargin;
    };
  }, [theme]);

  if (isLoading) {
    return (
      <Center mih="100vh">
        <Loader size="sm" />
      </Center>
    );
  }

  if (isError || !page) {
    return (
      <Center mih="100vh" px="xl">
        <Text c="dimmed" size="sm">
          Portfolio document could not be loaded.
        </Text>
      </Center>
    );
  }

  const canEdit = !page.deletedAt && (page.permissions?.canEdit ?? false);

  return (
    <main
      data-ramzy-portfolio-editor="true"
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "var(--mantine-color-body)",
      }}
    >
      {canEdit && (
        <div
          style={{
            position: "fixed",
            top: 12,
            right: 16,
            zIndex: 100,
          }}
        >
          <Button
            variant="default"
            size="compact-sm"
            leftSection={<IconHistory size={14} />}
            onClick={() => setHistoryModalOpen(true)}
          >
            History
          </Button>
        </div>
      )}

      <div
        style={{
          width: "min(1200px, 100%)",
          margin: "0 auto",
          padding: "32px 0 120px",
        }}
      >
        <PageEditor
          key={page.id}
          pageId={page.id}
          content={page.content}
          editable={canEdit}
          canComment={false}
        />
      </div>

      <HistoryModal pageId={page.id} />
    </main>
  );
}
