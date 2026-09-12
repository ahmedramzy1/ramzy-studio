import { Node, mergeAttributes } from "@tiptap/core";
import { DOMSerializer } from "@tiptap/pm/model";

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

  addNodeView() {
    return ({ HTMLAttributes }) => {
      const { dom } = DOMSerializer.renderSpec(document, [
        "div",
        mergeAttributes(
          { "data-type": this.name, "data-tab-panel": "" },
          this.options.HTMLAttributes,
          HTMLAttributes,
        ),
        0,
      ]);
      // Tabs owns these presentation attributes. Re-parsing them as document
      // edits replaces the panel and causes Tabs' observer to write them again.
      const presentationAttributes = new Set([
        "style", "role", "aria-hidden", "id", "aria-labelledby",
      ]);
      return {
        dom,
        contentDOM: dom as HTMLElement,
        ignoreMutation: (mutation) =>
          mutation.type === "attributes" &&
          mutation.target === dom &&
          presentationAttributes.has(mutation.attributeName ?? ""),
      };
    };
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
