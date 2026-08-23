import type { JSONContent } from "@tiptap/core";

export interface PortfolioOutlineItem {
  id: string;
  label: string;
  level: number;
}

export interface PortfolioOutlineOptions {
  /** Heading levels that should appear in portfolio navigation. */
  levels?: number[];
}

function nodeText(node: JSONContent): string {
  if (typeof node.text === "string") {
    return node.text;
  }

  return (node.content ?? []).map(nodeText).join("");
}

/**
 * Derive portfolio navigation from the document itself.
 *
 * Headings are the canonical section structure; there is no second section
 * array to keep synchronized. UniqueID supplies the stable anchor used by both
 * Preview and the public renderer. `navigationLabel` is optional so Ramzy
 * Studio can preserve the legacy builder's shorter-nav-label capability.
 */
export function getPortfolioOutline(
  document: JSONContent | null | undefined,
  options: PortfolioOutlineOptions = {},
): PortfolioOutlineItem[] {
  const levels = new Set(options.levels ?? [1, 2, 3]);
  const outline: PortfolioOutlineItem[] = [];

  const visit = (node: JSONContent) => {
    if (node.type === "heading") {
      const level = Number(node.attrs?.level);
      const id =
        typeof node.attrs?.id === "string" ? node.attrs.id.trim() : "";
      const authoredNavigationLabel =
        typeof node.attrs?.navigationLabel === "string"
          ? node.attrs.navigationLabel.trim()
          : "";
      const visibleLabel = nodeText(node).trim();
      const label = authoredNavigationLabel || visibleLabel;

      if (id && label && Number.isFinite(level) && levels.has(level)) {
        outline.push({ id, label, level });
      }
    }

    for (const child of node.content ?? []) {
      visit(child);
    }
  };

  if (document) {
    visit(document);
  }

  return outline;
}
