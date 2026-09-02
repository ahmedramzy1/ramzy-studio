import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

export type MediaPlaylistKind = 'audio' | 'video';

export interface VideoCaptionTrack {
  key: string;
  src: string;
  attachmentId?: string;
  label: string;
  language: string;
}

export interface MediaPlaylistItem {
  key: string;
  src: string;
  attachmentId?: string;
  title: string;
  subtitle?: string;
  artwork?: string;
  artworkAttachmentId?: string;
  artworkSource?: 'embedded' | 'custom';
  poster?: string;
  posterAttachmentId?: string;
  captions?: VideoCaptionTrack[];
  artist?: string;
  album?: string;
  description?: string;
  durationSeconds?: number;
  dateAdded?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

export interface MediaPlaylistAttributes {
  kind: MediaPlaylistKind;
  title?: string;
  items: MediaPlaylistItem[];
  activeKey?: string;
  autoplay?: boolean;
  loop?: boolean;
  shuffle?: boolean;
  showQueue?: boolean;
  queueLayout?: 'detailed' | 'compact';
}

export interface MediaPlaylistOptions {
  view: any;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mediaPlaylist: {
      setMediaPlaylist: (
        attributes: Partial<MediaPlaylistAttributes> & {
          kind: MediaPlaylistKind;
        },
      ) => ReturnType;
    };
  }
}

function parseItems(raw: string | null): MediaPlaylistItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const MediaPlaylist = Node.create<MediaPlaylistOptions>({
  name: 'mediaPlaylist',
  group: 'block',
  atom: true,
  isolating: true,
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
      kind: {
        default: 'audio',
        parseHTML: (element) =>
          element.getAttribute('data-kind') === 'video' ? 'video' : 'audio',
        renderHTML: (attributes: MediaPlaylistAttributes) => ({
          'data-kind': attributes.kind,
        }),
      },
      title: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-title') || '',
        renderHTML: (attributes: MediaPlaylistAttributes) => ({
          'data-title': attributes.title || '',
        }),
      },
      items: {
        default: [],
        parseHTML: (element) => parseItems(element.getAttribute('data-items')),
        renderHTML: (attributes: MediaPlaylistAttributes) => ({
          'data-items': JSON.stringify(attributes.items || []),
        }),
      },
      activeKey: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-active-key') || '',
        renderHTML: (attributes: MediaPlaylistAttributes) => ({
          'data-active-key': attributes.activeKey || '',
        }),
      },
      autoplay: {
        default: false,
        parseHTML: (element) =>
          element.getAttribute('data-autoplay') === 'true',
        renderHTML: (attributes: MediaPlaylistAttributes) => ({
          'data-autoplay': attributes.autoplay ? 'true' : 'false',
        }),
      },
      loop: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-loop') === 'true',
        renderHTML: (attributes: MediaPlaylistAttributes) => ({
          'data-loop': attributes.loop ? 'true' : 'false',
        }),
      },
      shuffle: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-shuffle') === 'true',
        renderHTML: (attributes: MediaPlaylistAttributes) => ({
          'data-shuffle': attributes.shuffle ? 'true' : 'false',
        }),
      },
      showQueue: {
        default: true,
        parseHTML: (element) =>
          element.getAttribute('data-show-queue') !== 'false',
        renderHTML: (attributes: MediaPlaylistAttributes) => ({
          'data-show-queue': attributes.showQueue === false ? 'false' : 'true',
        }),
      },
      queueLayout: {
        default: 'detailed',
        parseHTML: (element) =>
          element.getAttribute('data-queue-layout') === 'compact'
            ? 'compact'
            : 'detailed',
        renderHTML: (attributes: MediaPlaylistAttributes) => ({
          'data-queue-layout':
            attributes.queueLayout === 'compact' ? 'compact' : 'detailed',
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-ramzy-media-playlist="true"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { 'data-ramzy-media-playlist': 'true' },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
    ];
  },

  addCommands() {
    return {
      setMediaPlaylist:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              kind: attrs.kind,
              title: attrs.title || '',
              items: attrs.items || [],
              activeKey: attrs.activeKey || '',
              autoplay: attrs.autoplay || false,
              loop: attrs.loop || false,
              shuffle: attrs.shuffle || false,
              showQueue: attrs.showQueue !== false,
              queueLayout:
                attrs.queueLayout === 'compact' ? 'compact' : 'detailed',
            },
          }),
    };
  },

  addNodeView() {
    if (this.options.view) {
      this.editor.isInitialized = true;
      return ReactNodeViewRenderer(this.options.view);
    }

    return ({ node }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-ramzy-media-playlist', 'true');
      dom.textContent = `${node.attrs.kind === 'video' ? 'Video' : 'Audio'} playlist`;
      return { dom };
    };
  },
});
