import React, { useLayoutEffect, useState } from "react";
import type { Editor, JSONContent } from "@tiptap/core";
import {
  RamzyPortfolioRenderer,
  type RamzyPortfolioSession,
} from "@docmost/editor-ext/portfolio";
import { mainExtensions } from "@/features/editor/extensions/extensions";
import { TransclusionLookupProvider } from "@/features/editor/components/transclusion/transclusion-lookup-context";
import { PortfolioRuntimeProviders } from "@/portfolio-runtime/runtime-providers";
import { setPortfolioRuntimeHostConfig } from "@/lib/portfolio-runtime-config";

export interface RamzyStudioPortfolioRendererProps {
  content: JSONContent | null | undefined;
  pageId?: string;
  shareId?: string;
  printMode?: boolean;
  onCreate?: (editor: Editor) => void;
  /**
   * External preview surfaces pass the same short-lived session used by Build.
   * This keeps Ramzy-hosted assets, transclusions and API lookups routed to
   * Ramzy Studio even when the editable surface itself is unmounted.
   */
  session?: RamzyPortfolioSession;
  /**
   * External hosts need Ramzy Studio's Mantine/query/i18n provider stack.
   * Standalone Ramzy Studio already owns those providers and opts out.
   */
  withProviders?: boolean;
}

/**
 * High-level Ramzy Studio portfolio renderer.
 *
 * Hosts do not provide TipTap extensions or Docmost node views. Ramzy Studio
 * owns that implementation detail and guarantees that the same extension
 * family used by Build is used by Preview/public rendering.
 */
export function RamzyStudioPortfolioRenderer({
  content,
  pageId,
  shareId,
  printMode = false,
  onCreate,
  session,
  withProviders = true,
}: RamzyStudioPortfolioRendererProps) {
  const [hostReady, setHostReady] = useState(!session);

  useLayoutEffect(() => {
    if (!session) {
      setHostReady(true);
      return;
    }

    const cleanup = setPortfolioRuntimeHostConfig({
      apiUrl: session.apiUrl,
      collaborationUrl: session.collaborationUrl,
      accessToken: session.accessToken,
    });

    setHostReady(true);

    return () => {
      setHostReady(false);
      cleanup();
    };
  }, [session?.accessToken, session?.apiUrl, session?.collaborationUrl]);

  if (!hostReady) {
    return null;
  }

  const renderer = (
    <TransclusionLookupProvider shareId={shareId}>
      <RamzyPortfolioRenderer
        content={content}
        baseExtensions={mainExtensions}
        pageId={pageId}
        printMode={printMode}
        onCreate={onCreate}
      />
    </TransclusionLookupProvider>
  );

  if (!withProviders) {
    return renderer;
  }

  return <PortfolioRuntimeProviders>{renderer}</PortfolioRuntimeProviders>;
}
