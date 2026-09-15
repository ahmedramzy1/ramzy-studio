// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlockDragHandle } from "./block-drag-handle";

describe("BlockDragHandle", () => {
  it("uses the shared compact handle contract without inline geometry", () => {
    const { getByRole } = render(<BlockDragHandle label="Drag photo album" />);
    const handle = getByRole("button", { name: "Drag photo album" });

    expect(handle.classList.contains("ramzy-block-drag-handle")).toBe(true);
    expect(handle.hasAttribute("data-ramzy-block-drag-handle")).toBe(true);
    expect(handle.hasAttribute("style")).toBe(false);
    expect(handle.querySelectorAll("circle")).toHaveLength(6);
  });
});
