import { describe, expect, it } from "vitest";
import {
  normalizeVideoCaption,
  normalizeVideoWidth,
  videoAlignmentMargins,
} from "./video-layout";

describe("portfolio video layout", () => {
  it("uses a stable full-width fallback for intrinsic pixel metadata", () => {
    expect(normalizeVideoWidth(1920)).toBe("100%");
    expect(normalizeVideoWidth(undefined)).toBe("100%");
  });

  it("keeps authoring widths in the usable 25–100% range", () => {
    expect(normalizeVideoWidth("75%" )).toBe("75%");
    expect(normalizeVideoWidth("5%" )).toBe("25%");
    expect(normalizeVideoWidth("140%" )).toBe("100%");
  });

  it("maps alignment to deterministic container margins", () => {
    expect(videoAlignmentMargins("left")).toEqual({ marginLeft: 0, marginRight: "auto" });
    expect(videoAlignmentMargins("center")).toEqual({ marginLeft: "auto", marginRight: "auto" });
    expect(videoAlignmentMargins("right")).toEqual({ marginLeft: "auto", marginRight: 0 });
  });

  it("normalizes captions without storing layout-breaking whitespace", () => {
    expect(normalizeVideoCaption("  A  useful\ncaption  ")).toBe("A useful caption");
  });
});
