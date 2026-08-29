import { Node, mergeAttributes } from "@tiptap/core";

function photoCollectionNode(name: "photoGrid" | "photoAlbum", tag: string) {
  return Node.create({
    name,
    group: "block",
    atom: true,
    draggable: true,
    addAttributes() {
      return {
        images: { default: [] },
        title: { default: "" },
        description: { default: "" },
        location: { default: "" },
        date: { default: "" },
        credit: { default: "" },
        activeKey: { default: null },
      };
    },
    parseHTML() {
      return [{ tag: `[data-type="${name}"]` }];
    },
    renderHTML({ HTMLAttributes }) {
      return [tag, mergeAttributes(HTMLAttributes, { "data-type": name })];
    },
  });
}

/** Shared schema definitions used by both Studio authoring and server Yjs. */
export const PortfolioPhotoGrid = photoCollectionNode("photoGrid", "div");
export const PortfolioPhotoAlbum = photoCollectionNode("photoAlbum", "figure");
