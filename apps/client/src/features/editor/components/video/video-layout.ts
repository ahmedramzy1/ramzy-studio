export const VIDEO_WIDTH_PRESETS = [100, 75, 50, 25] as const;

export function normalizeVideoWidth(value: unknown): string {
  if (typeof value !== "string" || !value.trim().endsWith("%")) return "100%";
  const numeric = Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return "100%";
  return `${Math.max(25, Math.min(100, numeric))}%`;
}

export function videoAlignmentMargins(align: unknown): {
  marginLeft: number | "auto";
  marginRight: number | "auto";
} {
  if (align === "left") return { marginLeft: 0, marginRight: "auto" };
  if (align === "right") return { marginLeft: "auto", marginRight: 0 };
  return { marginLeft: "auto", marginRight: "auto" };
}

export function normalizeVideoCaption(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, 240);
}
