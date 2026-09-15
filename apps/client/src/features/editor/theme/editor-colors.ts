// Palette colour identity is stored unchanged. Only its rendered foreground
// adapts to the surface; custom author colours remain custom colours.
export const editorTextColors = [
  ["blue", "#2563eb", "#2563EB", "#93C5FD"],
  ["green", "#008a00", "#087A08", "#86EFAC"],
  ["purple", "#9333ea", "#7E22CE", "#D8B4FE"],
  ["red", "#e00000", "#C81E1E", "#FCA5A5"],
  ["yellow", "#eab308", "#856000", "#FDE68A"],
  ["orange", "#ffa500", "#A13F08", "#FDBA74"],
  ["pink", "#ba4081", "#A62C6C", "#F9A8D4"],
  ["gray", "#a8a29e", "#68655C", "#D6D3D1"],
  ["brown", "#92400e", "#92400E", "#E7C4A5"],
] as const;
export function textColorVariables(mode: "light" | "dark") {
  return Object.fromEntries(editorTextColors.map(([name, , light, dark]) => [
    `--ramzy-text-${name}`, mode === "dark" ? dark : light,
  ]));
}
export function renderedTextColor(color: string): string {
  let normalized = color.toLowerCase().replace(/\s/g, "");
  const rgb = /^rgb\((\d+),(\d+),(\d+)\)$/.exec(normalized);
  if (rgb) normalized = "#" + rgb.slice(1).map(n => Number(n).toString(16).padStart(2, "0")).join("");
  const match = editorTextColors.find(([, saved]) => saved === normalized);
  return match ? `var(--ramzy-text-${match[0]}, ${match[2]})` : color;
}
