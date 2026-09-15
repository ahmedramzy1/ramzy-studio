import { expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { ThemeAwareColor } from "../extensions/theme-aware-color";
import { editorTextColors, renderedTextColor } from "./editor-colors";
import { dsTheme } from "../components/media/v8-media-tokens";

function luminance(hex: string) {
  const rgb = hex.slice(1).match(/../g)!.map(n => parseInt(n, 16) / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(a: string, b: string) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
it.each(["light", "dark"] as const)("keeps text and palette readable on %s surfaces", mode => {
  const c = dsTheme(mode);
  for (const bg of [c.bg, c.bgSurface, c.bgSubtle, c.bgCanvas, c.bgElevated]) {
    for (const fg of [c.textPrimary, c.textSecondary, c.textTertiary, c.textLink, c.errorText]) {
      expect(contrast(fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
    for (const [, , light, dark] of editorTextColors) {
      const fg = mode === "dark" ? dark : light;
      expect(contrast(fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
  }
});
it("adapts known palette colours without changing saved identity or custom colours", () => {
  expect(renderedTextColor("rgb(37, 99, 235)")).toBe(renderedTextColor("#2563EB"));
  expect(renderedTextColor("#123456")).toBe("#123456");
  const extensions = [StarterKit, TextStyle, ThemeAwareColor];
  const editor = new Editor({ extensions, content: { type: "doc", content: [{ type: "paragraph", content: [
    { type: "text", text: "Blue", marks: [{ type: "textStyle", attrs: { color: "#2563EB" } }] },
  ] }] } });
  const html = editor.getHTML();
  expect(html).toContain("--ramzy-text-blue");
  const restored = new Editor({ extensions, content: html });
  expect(restored.getJSON()).toEqual(editor.getJSON());
  editor.destroy(); restored.destroy();
});
