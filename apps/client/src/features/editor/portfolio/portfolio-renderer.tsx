import React from "react";
import type { Editor, JSONContent } from "@tiptap/core";
import { RamzyPortfolioRenderer } from "@docmost/editor-ext/portfolio";
import { mainExtensions } from "@/features/editor/extensions/extensions";
import { TransclusionLookupProvider } from "@/features/editor/components/transclusion/transclusion-lookup-context";
import { PortfolioRuntimeProviders } from "@/portfolio-runtime/runtime-providers";

export interface RamzyStudioPortfolioRendererProps {
  content: JSONContent | null | undefined;
  pageId?: string;
  shareId?: string;
  printMode?: boolean;
  onCreate?: (editor: Editor) => void;
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
  withProviders = true,
}: RamzyStudioPortfolioRendererProps) {
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
