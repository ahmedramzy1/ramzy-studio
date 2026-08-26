import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { normalizeFileUrl } from "../media-utils";
import { sanitizeUrl, isInternalFileUrl } from "../utils";

export interface AudioOptions {
  view: any;
  HTMLAttributes: Record<string, any>;
}

export interface AudioAttributes {
  src?: string;
  attachmentId?: string;
  size?: number;
  title?: string;
  artist?: string;
  album?: string;
  description?: string;
  artwork?: string;
  artworkAttachmentId?: string;
  artworkSource?: "embedded" | "custom";
  durationSeconds?: number;
  placeholder?: {
    id: string;
    name: string;
  };
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    audioBlock: {
      setAudio: (attributes: AudioAttributes) => ReturnType;
    };
  }
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export const TiptapAudio = Node.create<AudioOptions>({
  name: "audio",

  group: "block",
  isolating: true,
  atom: true,
  defining: true,
  draggable: true,

  addOptions() {
    return {
      view: null,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element) => {
          const src = element.getAttribute("src");
          const sanitized = sanitizeUrl(src);
          return isInternalFileUrl(sanitized) ? sanitized : "";
        },
        renderHTML: (attributes) => ({
          src: isInternalFileUrl(attributes.src)
            ? sanitizeUrl(attributes.src)
            : "",
        }),
      },
      attachmentId: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-attachment-id"),
        renderHTML: (attributes: AudioAttributes) => ({
          "data-attachment-id": attributes.attachmentId,
        }),
      },
      size: {
        default: null,
        parseHTML: (element) => parseNumber(element.getAttribute("data-size")),
        renderHTML: (attributes: AudioAttributes) => ({
          "data-size": attributes.size,
        }),
      },
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title") || "",
        renderHTML: (attributes: AudioAttributes) => ({
          "data-title": attributes.title || "",
        }),
      },
      artist: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-artist") || "",
        renderHTML: (attributes: AudioAttributes) => ({
          "data-artist": attributes.artist || "",
        }),
      },
      album: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-album") || "",
        renderHTML: (attributes: AudioAttributes) => ({
          "data-album": attributes.album || "",
        }),
      },
      description: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-description") || "",
        renderHTML: (attributes: AudioAttributes) => ({
          "data-description": attributes.description || "",
        }),
      },
      artwork: {
        default: "",
        parseHTML: (element) => {
          const value = sanitizeUrl(element.getAttribute("data-artwork"));
          return isInternalFileUrl(value) ? value : "";
        },
        renderHTML: (attributes: AudioAttributes) => ({
          "data-artwork": isInternalFileUrl(attributes.artwork)
            ? sanitizeUrl(attributes.artwork)
            : "",
        }),
      },
      artworkAttachmentId: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-artwork-attachment-id"),
        renderHTML: (attributes: AudioAttributes) => ({
          "data-artwork-attachment-id": attributes.artworkAttachmentId,
        }),
      },
      artworkSource: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-artwork-source") || "",
        renderHTML: (attributes: AudioAttributes) => ({
          "data-artwork-source": attributes.artworkSource || "",
        }),
      },
      durationSeconds: {
        default: null,
        parseHTML: (element) => parseNumber(element.getAttribute("data-duration-seconds")),
        renderHTML: (attributes: AudioAttributes) => ({
          "data-duration-seconds": attributes.durationSeconds,
        }),
      },
      placeholder: {
        default: null,
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [{ tag: "audio" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "audio",
      mergeAttributes(
        { controls: "true", preload: "metadata" },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      ["source", { src: HTMLAttributes.src }],
    ];
  },

  addCommands() {
    return {
      setAudio:
        (attrs: AudioAttributes) =>
        ({ commands }) =>
          commands.insertContent({
            type: "audio",
            attrs,
          }),
    };
  },

  addNodeView() {
    if (this.options.view) {
      this.editor.isInitialized = true;
      return ReactNodeViewRenderer(this.options.view);
    }

    return ({ node }) => {
      const dom = document.createElement("div");
      const audio = document.createElement("audio");
      const src = node.attrs.src;
      if (src && isInternalFileUrl(src)) {
        audio.src = normalizeFileUrl(src);
      }
      audio.controls = true;
      audio.preload = "metadata";
      audio.style.width = "100%";
      dom.append(audio);
      return { dom };
    };
  },
});
