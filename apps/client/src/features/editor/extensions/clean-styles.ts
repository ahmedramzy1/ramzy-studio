import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
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

/**
 * Shared host policy extension.
 *
 * It still strips foreign inline styles on paste, and it also owns the small
 * set of Ramzy-specific global attributes that must exist in the exact same
 * schema for editable Build and readonly Preview/Public. Keeping these global
 * attributes here avoids forking the upstream Docmost video node or creating a
 * second extension registry.
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
    return [
      new Plugin({
        key: new PluginKey("cleanStyles"),
        props: {
          transformPastedHTML(html) {
            return html.replace(/\s+style="[^"]*"/gi, "");
          },
        },
      }),
    ];
  },
});
