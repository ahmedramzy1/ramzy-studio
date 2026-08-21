import getSuggestionItems from "@/features/editor/components/slash-menu/menu-items";
import type { SlashMenuGroupedItemsType } from "@/features/editor/components/slash-menu/types";

/**
 * Portfolio Mode deliberately exposes only commands that help author a strong
 * product-design case study. Docmost keeps its full command set everywhere
 * else; this is a curated authoring profile, not a fork of the editor engine.
 *
 * Portfolio-specific nodes (gallery, comparison, metrics, device frames, etc.)
 * will be added to this list as they are implemented.
 */
export const PORTFOLIO_SLASH_MENU_ITEMS = new Set([
  "Text",
  "Heading 1",
  "Heading 2",
  "Heading 3",
  "Bullet list",
  "Numbered list",
  "Quote",
  "Divider",
  "Callout",
  "Toggle block",
  "Image",
  "Video",
  "Audio",
  "Embed PDF",
  "Table",
  "2 Columns",
  "3 Columns",
  "4 Columns",
  "Iframe embed",
  "Figma",
  "Framer",
  "YouTube",
  "Vimeo",
  "Loom",
  "Miro",
  "Code",
  "Mermaid diagram",
  "Draw.io (diagrams.net)",
  "Excalidraw (Whiteboard)",
  "Math inline",
  "Math block",
  "Footnote",
]);

export function isPortfolioAuthoringMode(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.location.pathname.startsWith("/portfolio/edit/") ||
    new URLSearchParams(window.location.search).get("portfolio") === "1"
  );
}

export function getPortfolioSuggestionItems({
  query,
}: {
  query: string;
}): SlashMenuGroupedItemsType {
  const groups = getSuggestionItems({ query });
  const portfolioGroups: SlashMenuGroupedItemsType = {};

  for (const [group, items] of Object.entries(groups)) {
    const filtered = items.filter((item) =>
      PORTFOLIO_SLASH_MENU_ITEMS.has(item.title),
    );

    if (filtered.length) {
      portfolioGroups[group] = filtered;
    }
  }

  return portfolioGroups;
}
