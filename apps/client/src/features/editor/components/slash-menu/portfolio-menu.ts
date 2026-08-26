import { IconAppWindow, IconMusic, IconVideo } from "@tabler/icons-react";
import getSuggestionItems from "@/features/editor/components/slash-menu/menu-items";
import type {
  SlashMenuGroupedItemsType,
  SlashMenuItemType,
} from "@/features/editor/components/slash-menu/types";
import {
  insertMediaFiles,
  mediaAccept,
} from "@/features/editor/components/media/media-authoring-actions.ts";

/**
 * Portfolio Mode follows the v8 Ramzy Writer ownership model:
 * - block/text styles (Heading 1/2/3...) belong to the text-style selector
 * - slash commands insert content/structural blocks
 *
 * Self-contained document blocks are available here. Workspace relational
 * constructs (Bases/Kanban, subpage relations, mentions, etc.) stay out of the
 * public portfolio authoring contract because they require separate Docmost
 * workspace records rather than portable project-document state.
 */
export const PORTFOLIO_SLASH_MENU_ITEMS = new Set([
  "Text",
  "To-do list",
  "Bullet list",
  "Numbered list",
  "Quote",
  "Divider",
  "Page break",
  "Callout",
  "Toggle block",
  "Image",
  "File attachment",
  "Embed PDF",
  "Table",
  "2 Columns",
  "3 Columns",
  "4 Columns",
  "5 Columns",
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

function mediaPickerCommand(kind: "video" | "audio"): SlashMenuItemType["command"] {
  return ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).run();

    // Portfolio editor storage owns the canonical linked page id.
    // @ts-ignore
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = mediaAccept(kind);
    input.multiple = true;
    input.style.display = "none";
    document.body.appendChild(input);

    input.onchange = async () => {
      try {
        const files = Array.from(input.files || []);
        if (!files.length) return;
        const pos = editor.state.selection.from;
        await insertMediaFiles({ editor, files, pageId, kind, pos });
      } finally {
        input.remove();
      }
    };

    input.click();
  };
}

/**
 * Keep the v8 first-class playlist commands visible before the generic media
 * commands instead of burying them after Docmost's basic command list.
 */
const PORTFOLIO_ONLY_SLASH_ITEMS: SlashMenuItemType[] = [
  {
    title: "Video Playlist",
    description: "One Ramzy Player with a sortable video library.",
    searchTerms: ["video", "playlist", "queue", "media", "player"],
    icon: IconVideo,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setMediaPlaylist({ kind: "video", items: [] })
        .run(),
  },
  {
    title: "Audio Playlist",
    description: "One Ramzy Wave with a sortable audio library.",
    searchTerms: ["audio", "playlist", "music", "tracks", "queue", "wave"],
    icon: IconMusic,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setMediaPlaylist({ kind: "audio", items: [] })
        .run(),
  },
  {
    title: "Video",
    description: "Upload one video; selecting multiple videos creates one playlist.",
    searchTerms: ["video", "mp4", "media", "upload", "player"],
    icon: IconVideo,
    command: mediaPickerCommand("video"),
  },
  {
    title: "Audio",
    description: "Upload one track; selecting multiple tracks creates one playlist.",
    searchTerms: ["audio", "music", "sound", "mp3", "upload", "wave"],
    icon: IconMusic,
    command: mediaPickerCommand("audio"),
  },
  {
    title: "Tabs",
    description: "Organize content into switchable tabs.",
    searchTerms: ["tabs", "tab", "sections", "switch"],
    icon: IconAppWindow,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).insertTabs().run(),
  },
];

function matchesQuery(item: SlashMenuItemType, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [item.title, item.description, ...item.searchTerms].some((value) =>
    value.toLowerCase().includes(normalized),
  );
}

export function isPortfolioAuthoringMode(): boolean {
  if (typeof window === "undefined") return false;

  const path = window.location.pathname;
  return (
    path.startsWith("/portfolio/edit/") ||
    path.startsWith("/admin/projects/") ||
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

  const portfolioOnly = PORTFOLIO_ONLY_SLASH_ITEMS.filter((item) =>
    matchesQuery(item, query),
  );

  if (portfolioOnly.length) {
    portfolioGroups.basic = [
      ...portfolioOnly,
      ...(portfolioGroups.basic ?? []),
    ];
  }

  return portfolioGroups;
}