import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

export interface SubpagesOptions {
  HTMLAttributes: Record<string, any>;
  view: any;
}

export interface SubpagesAttributes {
  sort?: 'position' | 'title';
  showIcons?: boolean;
  layout?: 'list' | 'cards';
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    subpages: {
      insertSubpages: (attributes?: SubpagesAttributes) => ReturnType;
    };
  }
}

export const Subpages = Node.create<SubpagesOptions>({
  name: 'subpages',

  addOptions() {
    return {
      HTMLAttributes: {},
      view: null,
    };
  },

  group: 'block',
  atom: true,
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      sort: {
        default: 'position',
        parseHTML: (element) =>
          element.getAttribute('data-sort') === 'title' ? 'title' : 'position',
        renderHTML: (attributes: SubpagesAttributes) => ({
          'data-sort': attributes.sort === 'title' ? 'title' : 'position',
        }),
      },
      showIcons: {
        default: true,
        parseHTML: (element) =>
          element.getAttribute('data-show-icons') !== 'false',
        renderHTML: (attributes: SubpagesAttributes) => ({
          'data-show-icons': attributes.showIcons === false ? 'false' : 'true',
        }),
      },
      layout: {
        default: 'list',
        parseHTML: (element) =>
          element.getAttribute('data-layout') === 'cards' ? 'cards' : 'list',
        renderHTML: (attributes: SubpagesAttributes) => ({
          'data-layout': attributes.layout === 'cards' ? 'cards' : 'list',
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { 'data-type': this.name },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
    ];
  },

  addCommands() {
    return {
      insertSubpages:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },

  addNodeView() {
    // Force the react node view to render immediately using flush sync (https://github.com/ueberdosis/tiptap/blob/b4db352f839e1d82f9add6ee7fb45561336286d8/packages/react/src/ReactRenderer.tsx#L183-L191)
    this.editor.isInitialized = true;

    return ReactNodeViewRenderer(this.options.view);
  },
});
