import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Container } from "@mantine/core";
import { useSharePageQuery } from "@/features/share/queries/share-query.ts";
import { extractPageSlugId } from "@/lib";
import ReadonlyPageEditor from "@/features/editor/readonly-page-editor.tsx";
import { Error404 } from "@/components/ui/error-404.tsx";

const RESIZE_MESSAGE = "ramzy-studio:portfolio-resize";

export default function PortfolioEmbedPage() {
  const { pageSlug = "" } = useParams();
  const [searchParams] = useSearchParams();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const requestedTheme = searchParams.get("theme");
  const theme = requestedTheme === "light" ? "light" : "dark";

  const { data, isLoading, isError, error } = useSharePageQuery({
    pageId: extractPageSlugId(pageSlug),
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousScheme = html.getAttribute("data-mantine-color-scheme");
    const previousHtmlBackground = html.style.background;
    const previousBodyBackground = body.style.background;
    const previousBodyMargin = body.style.margin;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlColorScheme = html.style.colorScheme;
    const previousBodyColorScheme = body.style.colorScheme;

    html.setAttribute("data-mantine-color-scheme", theme);
    html.style.colorScheme = theme;
    body.style.colorScheme = theme;
    html.style.background = "transparent";
    body.style.background = "transparent";
    body.style.margin = "0";
    body.style.overflow = "hidden";

    return () => {
      if (previousScheme) {
        html.setAttribute("data-mantine-color-scheme", previousScheme);
      } else {
        html.removeAttribute("data-mantine-color-scheme");
      }
      html.style.background = previousHtmlBackground;
      body.style.background = previousBodyBackground;
      body.style.margin = previousBodyMargin;
      body.style.overflow = previousBodyOverflow;
      html.style.colorScheme = previousHtmlColorScheme;
      body.style.colorScheme = previousBodyColorScheme;
    };
  }, [theme]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const notifyParent = () => {
      const height = Math.max(
        root.scrollHeight,
        root.getBoundingClientRect().height,
        document.documentElement.scrollHeight,
      );

      window.parent.postMessage(
        {
          type: RESIZE_MESSAGE,
          pageSlug: extractPageSlugId(pageSlug),
          height: Math.ceil(height),
        },
        "*",
      );
    };

    notifyParent();

    const resizeObserver = new ResizeObserver(notifyParent);
    resizeObserver.observe(root);

    window.addEventListener("load", notifyParent);
    const delayed = window.setTimeout(notifyParent, 250);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("load", notifyParent);
      window.clearTimeout(delayed);
    };
  }, [pageSlug, data]);

  if (isLoading) {
    return <div ref={rootRef} style={{ minHeight: 1 }} />;
  }

  if (isError || !data) {
    if ([401, 403, 404].includes(error?.["status"])) {
      return (
        <div ref={rootRef}>
          <Error404 />
        </div>
      );
    }

    return (
      <div ref={rootRef} style={{ padding: 24 }}>
        Error fetching portfolio content.
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="ramzy-portfolio-embed"
      data-ramzy-portfolio-embed="true"
      style={{ width: "100%", background: "transparent" }}
    >
      <Container size={900} p={0}>
        <ReadonlyPageEditor
          key={data.page.id}
          title={data.page.title}
          content={data.page.content}
          pageId={data.page.id}
          shareId={data.share.id}
          showTitle={false}
        />
      </Container>

      <style>{`
        html,
        body,
        #root,
        .ramzy-portfolio-embed {
          background: transparent !important;
        }

        .ramzy-portfolio-embed .ProseMirror {
          background: transparent !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .ramzy-portfolio-embed .ProseMirror > :first-child {
          margin-top: 0 !important;
        }

        .ramzy-portfolio-embed .ProseMirror > :last-child {
          margin-bottom: 0 !important;
        }
      `}</style>
    </div>
  );
}
