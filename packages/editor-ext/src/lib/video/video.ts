import { ReactNodeViewRenderer } from "@tiptap/react";
import { Range, Node } from "@tiptap/core";
import type { ResizableNodeViewDirection } from "../resizable-nodeview";

export type VideoResizeOptions = {
  enabled: boolean;
  directions?: ResizableNodeViewDirection[];
  minWidth?: number;
  minHeight?: number;
  alwaysPreserveAspectRatio?: boolean;
  createCustomHandle?: (direction: ResizableNodeViewDirection) => HTMLElement;
  className?: {
    container?: string;
    wrapper?: string;
    handle?: string;
    resizing?: string;
  };
};

export interface VideoOptions {
  view: any;
  HTMLAttributes: Record<string, any>;
  resize: VideoResizeOptions | false;
}

export interface VideoAttributes {
  src?: string;
  source?: "upload" | "youtube" | "vimeo";
  externalUrl?: string;
  alt?: string;
  align?: string;
  attachmentId?: string;
  poster?: string;
  posterAttachmentId?: string;
  durationSeconds?: number;
  size?: number;
  width?: number | string;
  height?: number;
  aspectRatio?: number;
  placeholder?: {
    id: string;
    name: string;
  };
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoBlock: {
      setVideo: (attributes: VideoAttributes) => ReturnType;
      setVideoAt: (
        attributes: VideoAttributes & { pos: number | Range }
      ) => ReturnType;
      setVideoAlign: (align: "left" | "center" | "right") => ReturnType;
      setVideoWidth: (width: number) => ReturnType;
      setVideoSize: (width: number, height: number) => ReturnType;
    };
  }
}

export const TiptapVideo = Node.create<VideoOptions>({
  name: "video",

  group: "block",
  isolating: true,
  atom: true,
  defining: true,
  draggable: true,

  addOptions() {
    return {
      view: null,
      HTMLAttributes: {},
      resize: false,
    };
  },

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => ({ src: attributes.src }),
      },
      source: {
        default: "upload",
        parseHTML: (element) => element.getAttribute("data-source") || "upload",
        renderHTML: (attributes: VideoAttributes) => ({
          "data-source": attributes.source || "upload",
        }),
      },
      externalUrl: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-external-url") || "",
        renderHTML: (attributes: VideoAttributes) => ({
          "data-external-url": attributes.externalUrl || "",
        }),
      },
      alt: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("aria-label"),
        renderHTML: (attributes: VideoAttributes) => ({
          "aria-label": attributes.alt,
        }),
      },
      attachmentId: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-attachment-id"),
        renderHTML: (attributes: VideoAttributes) => ({
          "data-attachment-id": attributes.attachmentId,
        }),
      },
      poster: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-poster") || "",
        renderHTML: (attributes: VideoAttributes) => ({
          "data-poster": attributes.poster || "",
        }),
      },
      posterAttachmentId: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-poster-attachment-id"),
        renderHTML: (attributes: VideoAttributes) => ({
          "data-poster-attachment-id": attributes.posterAttachmentId,
        }),
      },
      durationSeconds: {
        default: null,
        parseHTML: (element) => {
          const value = Number(element.getAttribute("data-duration-seconds"));
          return Number.isFinite(value) ? value : null;
        },
        renderHTML: (attributes: VideoAttributes) => ({
          "data-duration-seconds": attributes.durationSeconds,
        }),
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const raw = element.getAttribute("width");
          if (!raw) return null;
          if (raw.endsWith("%")) return raw;
          const num = parseFloat(raw);
          return isNaN(num) ? null : num;
        },
        renderHTML: (attributes: VideoAttributes) => ({ width: attributes.width }),
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const raw = element.getAttribute("height");
          if (!raw) return null;
          const num = parseFloat(raw);
          return isNaN(num) ? null : num;
        },
        renderHTML: (attributes: VideoAttributes) => ({ height: attributes.height }),
      },
      size: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-size"),
        renderHTML: (attributes: VideoAttributes) => ({ "data-size": attributes.size }),
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align"),
        renderHTML: (attributes: VideoAttributes) => ({ "data-align": attributes.align }),
      },
      aspectRatio: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-aspect-ratio"),
        renderHTML: (attributes: VideoAttributes) => ({
          "data-aspect-ratio": attributes.aspectRatio,
        }),
      },
      placeholder: {
        default: null,
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [{ tag: "video" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      { controls: "true", ...HTMLAttributes },
      ["source", HTMLAttributes],
    ];
  },

  addCommands() {
    return {
      setVideo:
        (attrs: VideoAttributes) =>
        ({ commands }) =>
          commands.insertContent({ type: "video", attrs }),

      setVideoAlign:
        (align) =>
        ({ commands }) =>
          commands.updateAttributes("video", { align }),

      setVideoWidth:
        (width) =>
        ({ commands }) =>
          commands.updateAttributes("video", {
            width: `${Math.max(0, Math.min(100, width))}%`,
          }),

      setVideoSize:
        (width, height) =>
        ({ commands }) =>
          commands.updateAttributes("video", { width, height }),
    };
  },

  addNodeView() {
    // The old resize-enabled path replaced the configured React node view with
    // a hand-built native <video controls> element as soon as an upload gained
    // a real src. That made portfolio BUILD silently bypass Ramzy Player.
    //
    // Keep the configured React node view authoritative for uploaded media.
    // Video resizing will be reintroduced around this branded node view under
    // the dedicated Media authoring UX roadmap item instead of replacing it.
    this.editor.isInitialized = true;
    return ReactNodeViewRenderer(this.options.view);
  },
});
