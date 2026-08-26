import { describe, expect, it, vi } from "vitest";
import {
  PortfolioDraftSaveError,
  savePortfolioDraft,
} from "./portfolio-draft-save";

const content = {
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "Hello" }] }],
};

const mediaContent = {
  type: "doc",
  content: [
    {
      type: "video",
      attrs: {
        src: "/api/files/video-1/demo.mp4",
        attachmentId: "video-1",
        alt: "Demo",
        poster: "/api/files/poster-1/demo-thumbnail.jpg",
        posterAttachmentId: "poster-1",
        durationSeconds: 12.4,
        width: 1920,
        height: 1080,
        aspectRatio: 16 / 9,
      },
    },
    {
      type: "mediaPlaylist",
      attrs: {
        kind: "audio",
        title: "Research interviews",
        activeKey: "audio-a",
        autoplay: true,
        loop: false,
        items: [
          {
            key: "audio-a",
            src: "/api/files/audio-1/interview.m4a",
            attachmentId: "audio-1",
            title: "Interview 01",
            artist: "Participant A",
            album: "Field research",
            artwork: "/api/files/artwork-1/cover.jpg",
            artworkAttachmentId: "artwork-1",
            artworkSource: "embedded",
            durationSeconds: 136,
          },
          {
            key: "audio-b",
            src: "/api/files/audio-2/interview.m4a",
            attachmentId: "audio-2",
            title: "Interview 02",
            durationSeconds: 98,
          },
        ],
      },
    },
  ],
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

  it("preserves enriched standalone media and nested playlist state exactly", async () => {
    const fetchImpl = vi.fn(async (_url, init) => {
      expect(JSON.parse(String(init?.body))).toEqual({
        pageId: "page-media",
        content: mediaContent,
      });
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      };
    }) as unknown as typeof fetch;

    await savePortfolioDraft({
      apiUrl: "/api/ramzy-studio",
      accessToken: "studio-token",
      pageId: "page-media",
      content: mediaContent,
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("marks an expired authoring session explicitly", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: false,
      status: 401,
      json: async () => ({ message: "expired" }),
    })) as unknown as typeof fetch;

    const expectedError: Partial<PortfolioDraftSaveError> = {
      name: "PortfolioDraftSaveError",
      status: 401,
      message: "expired",
    };

    await expect(
      savePortfolioDraft({
        apiUrl: "/api/ramzy-studio",
        accessToken: "expired-token",
        pageId: "page-123",
        content,
        fetchImpl,
      }),
    ).rejects.toMatchObject(expectedError);
  });
});
