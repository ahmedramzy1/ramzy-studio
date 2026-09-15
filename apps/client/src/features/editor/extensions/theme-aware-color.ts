import { Color } from "@tiptap/extension-color";
import { renderedTextColor } from "../theme/editor-colors";

// Same schema/commands as Color, including lossless HTML round trips.
export const ThemeAwareColor = Color.extend({
  addGlobalAttributes() {
    return [{ types: this.options.types, attributes: { color: {
      default: null,
      parseHTML: element => element.getAttribute("data-ramzy-text-color") || element.style.color?.replace(/['"]/g, ""),
      renderHTML: attributes => attributes.color ? {
        "data-ramzy-text-color": attributes.color,
        style: `color: ${renderedTextColor(attributes.color)}`,
      } : {},
    } } }];
  },
});
