import { describe, expect, it } from "vitest";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

describe("portfolio pragmatic dnd lifecycle", () => {
  it("can release and rebuild the same source and target after a drop render", () => {
    const source = document.createElement("div");
    const handle = document.createElement("button");
    const target = document.createElement("div");
    source.appendChild(handle);
    document.body.append(source, target);

    const register = () => [
      draggable({ element: source, dragHandle: handle }),
      dropTargetForElements({ element: target }),
    ];

    const first = register();
    first.forEach((cleanup) => cleanup());
    expect(() => {
      const second = register();
      second.forEach((cleanup) => cleanup());
    }).not.toThrow();

    source.remove();
    target.remove();
  });
});
