import { Extension } from "@tiptap/core";
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
 * Host-owned enrichment attributes for the upstream Docmost video node.
 *
 * Keeping this as a global attribute extension means Build and readonly
 * rendering can share the upstream TiptapVideo implementation while Ramzy
 * Studio persists richer portfolio metadata without forking that whole node.
 */
export const RamzyMediaMetadata = Extension.create({
  name: "ramzyMediaMetadata",

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
});
