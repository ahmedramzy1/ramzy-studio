import { describe, expect, it, vi } from "vitest";
import {
  PortfolioDraftSaveError,
  savePortfolioDraft,
} from "./portfolio-draft-save";

const content = {
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "Hello" }] }],
};

describe("savePortfolioDraft", () => {
  it("persists the canonical document through the authenticated Studio API", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    })) as unknown as typeof fetch;

    await savePortfolioDraft({
      apiUrl: "/api/ramzy-studio/",
      accessToken: "studio-token",
      pageId: "page-123",
      content,
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledWith(
      "/api/ramzy-studio/portfolio/draft/save",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer studio-token",
        },
        body: JSON.stringify({ pageId: "page-123", content }),
      }),
    );
  });

  it("marks an expired authoring session explicitly", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: false,
      status: 401,
      json: async () => ({ message: "expired" }),
    })) as unknown as typeof fetch;

    await expect(
      savePortfolioDraft({
        apiUrl: "/api/ramzy-studio",
        accessToken: "expired-token",
        pageId: "page-123",
        content,
        fetchImpl,
      }),
    ).rejects.toMatchObject<Partial<PortfolioDraftSaveError>>({
      name: "PortfolioDraftSaveError",
      status: 401,
      message: "expired",
    });
  });
});
