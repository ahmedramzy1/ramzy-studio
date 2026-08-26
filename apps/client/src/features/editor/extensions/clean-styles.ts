import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { isInternalFileUrl } from "@docmost/editor-ext";

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function safeInternalUrl(value: string | null | undefined): string {
  if (!value) return "";
  const normalized = value.trim();
  return isInternalFileUrl(normalized) ? normalized : "";
}

const legacyMediaMigrationKey = new PluginKey<boolean>("ramzyLegacyMediaPlaylistMigration");

type LegacyMediaEntry = {
  node: ProseMirrorNode;
  offset: number;
  kind: "video" | "audio";
};

function playlistItemFromLegacy(entry: LegacyMediaEntry, index: number) {
  const attrs = entry.node.attrs || {};
  const attachmentId = attrs.attachmentId || "";
  const key = `legacy-${entry.kind}-${attachmentId || entry.offset}-${index}`;

  if (entry.kind === "video") {
    return {
      key,
      src: attrs.src,
      attachmentId: attrs.attachmentId,
      title: attrs.alt || `Video ${index + 1}`,
      subtitle: "Uploaded video",
      poster: attrs.poster || undefined,
      posterAttachmentId: attrs.posterAttachmentId,
      durationSeconds: attrs.durationSeconds,
      width: attrs.width,
      height: attrs.height,
      aspectRatio: attrs.aspectRatio,
    };
  }

  return {
    key,
    src: attrs.src,
    attachmentId: attrs.attachmentId,
    title: attrs.title || `Audio ${index + 1}`,
    subtitle: attrs.artist || attrs.album || "Uploaded audio",
    artist: attrs.artist || undefined,
    album: attrs.album || undefined,
    description: attrs.description || undefined,
    artwork: attrs.artwork || undefined,
    artworkAttachmentId: attrs.artworkAttachmentId,
    artworkSource: attrs.artworkSource || undefined,
    durationSeconds: attrs.durationSeconds,
  };
}

function collectLegacyGroups(doc: ProseMirrorNode): LegacyMediaEntry[][] {
  const entries: LegacyMediaEntry[] = [];
  doc.forEach((node, offset) => {
    if (
      (node.type.name === "video" || node.type.name === "audio") &&
      node.attrs?.src &&
      !node.attrs?.placeholder
    ) {
      entries.push({
        node,
        offset,
        kind: node.type.name as "video" | "audio",
      });
    } else {
      // A non-media top-level block is a hard boundary. Record a sentinel by
      // pushing nothing; grouping below uses actual node offsets/nodeSize to
      // verify physical adjacency rather than merely adjacent entries here.
    }
  });

  const groups: LegacyMediaEntry[][] = [];
  let current: LegacyMediaEntry[] = [];

  for (const entry of entries) {
    const previous = current[current.length - 1];
    const physicallyAdjacent =
      previous && previous.offset + previous.node.nodeSize === entry.offset;
    if (
      previous &&
      previous.kind === entry.kind &&
      physicallyAdjacent
    ) {
      current.push(entry);
    } else {
      if (current.length >= 2) groups.push(current);
      current = [entry];
    }
  }
  if (current.length >= 2) groups.push(current);
  return groups;
}

/**
 * Shared host policy extension.
 *
 * Besides stripping foreign inline styles, this owns Ramzy media metadata that
 * must be present in the same Build + readonly schema. In editable Portfolio
 * sessions it also performs a one-time compatibility migration for the exact
 * pre-playlist failure mode: contiguous standalone videos/audio created by the
 * old multi-file uploader become one mediaPlaylist without re-uploading assets.
 */
export const CleanStyles = Extension.create({
  name: "cleanStyles",
  priority: 80,

  addGlobalAttributes() {
    return [
      {
        types: ["video"],
        attributes: {
          poster: {
            default: "",
            parseHTML: (element) =>
              safeInternalUrl(element.getAttribute("data-poster")),
            renderHTML: (attributes) => ({
              "data-poster": safeInternalUrl(attributes.poster),
            }),
          },
          posterAttachmentId: {
            default: undefined,
            parseHTML: (element) =>
              element.getAttribute("data-poster-attachment-id") || undefined,
            renderHTML: (attributes) => ({
              "data-poster-attachment-id":
                attributes.posterAttachmentId || undefined,
            }),
          },
          durationSeconds: {
            default: null,
            parseHTML: (element) =>
              parseNumber(element.getAttribute("data-duration-seconds")),
            renderHTML: (attributes) => ({
              "data-duration-seconds": attributes.durationSeconds ?? undefined,
            }),
          },
        },
      },
    ];
  },

  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        key: new PluginKey("cleanStyles"),
        props: {
          transformPastedHTML(html) {
            return html.replace(/\s+style="[^"]*"/gi, "");
          },
        },
      }),
      new Plugin<boolean>({
        key: legacyMediaMigrationKey,
        state: {
          init: () => false,
          apply(transaction, migrated) {
            return transaction.getMeta(legacyMediaMigrationKey)?.migrated
              ? true
              : migrated;
          },
        },
        appendTransaction(_transactions, _oldState, newState) {
          if (!editor.isEditable) return null;
          const pluginState = legacyMediaMigrationKey.getState(newState);
          if (pluginState) return null;

          const hasStandaloneMedia = newState.doc.content.content.some(
            (node) =>
              (node.type.name === "video" || node.type.name === "audio") &&
              node.attrs?.src,
          );
          if (!hasStandaloneMedia) return null;

          const tr = newState.tr;
          const playlistType = newState.schema.nodes.mediaPlaylist;
          if (!playlistType) return null;

          const groups = collectLegacyGroups(newState.doc);
          for (const group of [...groups].reverse()) {
            const first = group[0];
            const last = group[group.length - 1];
            const items = group.map(playlistItemFromLegacy);
            const playlist = playlistType.create({
              kind: first.kind,
              title: "",
              items,
              activeKey: items[0]?.key || "",
              autoplay: false,
              loop: false,
            });
            tr.replaceWith(
              first.offset,
              last.offset + last.node.nodeSize,
              playlist,
            );
          }

          tr.setMeta(legacyMediaMigrationKey, { migrated: true });
          return tr;
        },
      }),
    ];
  },
});
