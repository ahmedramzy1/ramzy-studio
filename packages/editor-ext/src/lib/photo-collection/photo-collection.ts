import { Node, mergeAttributes } from '@tiptap/core';

function photoCollectionNode(name: 'photoGrid' | 'photoAlbum', tag: string) {
  return Node.create({
    name,
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
      return {
        images: { default: [] },
        title: { default: '' },
        description: { default: '' },
        location: { default: '' },
        date: { default: '' },
        credit: { default: '' },
        activeKey: { default: null },
        columns: { default: 0 },
        gap: { default: 10 },
        aspect: { default: 'auto' },
        fit: { default: name === 'photoAlbum' ? 'contain' : 'cover' },
        lightbox: { default: true },
        thumbnailPosition: { default: 'right' },
        autoplay: { default: false },
        interval: { default: 5 },
      };
    },
    parseHTML() {
      return [{ tag: `[data-type="${name}"]` }];
    },
    renderHTML({ HTMLAttributes }) {
      return [tag, mergeAttributes(HTMLAttributes, { 'data-type': name })];
    },
  });
}

/** Shared schema definitions used by both Studio authoring and server Yjs. */
export const PortfolioPhotoGrid = photoCollectionNode('photoGrid', 'div');
export const PortfolioPhotoAlbum = photoCollectionNode('photoAlbum', 'figure');
