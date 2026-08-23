import { describe, expect, it } from "vitest";
import { getPortfolioOutline } from "@docmost/editor-ext";

describe("Ramzy portfolio outline", () => {
  it("derives navigation from heading ids and authored navigation labels", () => {
    const document = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: {
            id: "overview",
            level: 1,
            navigationLabel: "Overview",
          },
          content: [{ type: "text", text: "01 — Product overview" }],
        },
        {
          type: "paragraph",
          attrs: { id: "paragraph-1" },
          content: [{ type: "text", text: "Body copy" }],
        },
        {
          type: "heading",
          attrs: { id: "research", level: 2 },
          content: [
            { type: "text", text: "Research " },
            { type: "text", text: "and testing" },
          ],
        },
      ],
    };

    expect(getPortfolioOutline(document)).toEqual([
      { id: "overview", label: "Overview", level: 1 },
      { id: "research", label: "Research and testing", level: 2 },
    ]);
  });

  it("never invents unstable anchors for headings without persisted ids", () => {
    const document = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Missing stable id" }],
        },
      ],
    };

    expect(getPortfolioOutline(document)).toEqual([]);
  });
});
