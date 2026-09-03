import { describe, expect, it } from "vitest";
import {
  movePlaylistItem,
  removePlaylistItem,
  reorderPlaylistItems,
  stepPlaylistKey,
} from "./playlist-state";

const items = [{ key: "a" }, { key: "b" }, { key: "c" }];

describe("portfolio playlist state", () => {
  it("steps between items and stops at non-looping boundaries", () => {
    expect(stepPlaylistKey(items, "b", -1, false)).toBe("a");
    expect(stepPlaylistKey(items, "b", 1, false)).toBe("c");
    expect(stepPlaylistKey(items, "a", -1, false)).toBeNull();
    expect(stepPlaylistKey(items, "c", 1, false)).toBeNull();
  });

  it("wraps only when playlist looping is enabled", () => {
    expect(stepPlaylistKey(items, "a", -1, true)).toBe("c");
    expect(stepPlaylistKey(items, "c", 1, true)).toBe("a");
    expect(stepPlaylistKey([{ key: "a" }], "a", 1, true)).toBeNull();
  });

  it("moves and drag-reorders without mutating the source list", () => {
    expect(movePlaylistItem(items, "b", -1).map((item) => item.key)).toEqual(["b", "a", "c"]);
    expect(reorderPlaylistItems(items, "a", "c").map((item) => item.key)).toEqual(["b", "c", "a"]);
    expect(items.map((item) => item.key)).toEqual(["a", "b", "c"]);
  });

  it("selects the next predictable item when the active item is removed", () => {
    expect(removePlaylistItem(items, "b", "b")).toEqual({
      items: [{ key: "a" }, { key: "c" }],
      nextActiveKey: "c",
    });
    expect(removePlaylistItem(items, "c", "c").nextActiveKey).toBe("b");
    expect(removePlaylistItem(items, "a", "c").nextActiveKey).toBe("c");
  });
});
