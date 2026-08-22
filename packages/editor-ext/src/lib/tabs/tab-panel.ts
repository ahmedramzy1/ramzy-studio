import { Node, mergeAttributes } from "@tiptap/core";

export interface TabPanelOptions {
  HTMLAttributes: Record<string, unknown>;
}

export interface TabPanelAttributes {
  label?: string;
}

export const TabPanel = Node.create<TabPanelOptions>({
  name: "tabPanel",
  content: "block+",
  defining: true,
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      label: {
        default: "Tab",
        parseHTML: (element) => element.getAttribute("data-label") || "Tab",
        renderHTML: (attributes: TabPanelAttributes) => ({
          "data-label": attributes.label || "Tab",
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
      "div",
      mergeAttributes(
        { "data-type": this.name, "data-tab-panel": "" },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      0,
    ];
  },
});
