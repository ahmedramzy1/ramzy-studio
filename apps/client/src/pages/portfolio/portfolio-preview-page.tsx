import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Center, Loader, Text } from "@mantine/core";
import ReadonlyPageEditor from "@/features/editor/readonly-page-editor";
import { usePageQuery } from "@/features/page/queries/page-query";
import { extractPageSlugId } from "@/lib";

/**
 * Clean portfolio preview surface for an authenticated Ramzy Studio document.
 * Build and Preview both read the same Docmost page; the only difference is
 * editable PageEditor vs ReadonlyPageEditor.
 */
export default function PortfolioPreviewPage() {
  const { pageSlug = "" } = useParams();
  const [searchParams] = useSearchParams();
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

  return (
    <main
      data-ramzy-portfolio-preview="true"
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "var(--mantine-color-body)",
      }}
    >
      <div
        style={{
          width: "min(1200px, 100%)",
          margin: "0 auto",
          padding: "32px 0 120px",
        }}
      >
        <ReadonlyPageEditor
          key={page.id}
          title={page.title}
          content={page.content}
          pageId={page.id}
          showTitle={false}
        />
      </div>
    </main>
  );
}
