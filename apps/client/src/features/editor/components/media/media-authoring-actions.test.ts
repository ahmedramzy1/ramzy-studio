import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  uploadVideoAction: vi.fn(),
  uploadAudioAction: vi.fn(),
  ingestMediaBatch: vi.fn(),
}));

vi.mock("@/features/editor/components/video/upload-video-action.tsx", () => ({
  uploadVideoAction: mocks.uploadVideoAction,
}));
vi.mock("@/features/editor/components/audio/upload-audio-action.tsx", () => ({
  uploadAudioAction: mocks.uploadAudioAction,
}));
vi.mock("./media-ingest", () => ({ ingestMediaBatch: mocks.ingestMediaBatch }));
vi.mock("@/lib/config.ts", () => ({ getFileUploadSizeLimit: () => 1024 * 1024 * 1024 }));
vi.mock("@/lib", () => ({ formatBytes: (value: number) => String(value) }));
vi.mock("@/i18n.ts", () => ({ default: { t: (value: string) => value } }));
vi.mock("@mantine/notifications", () => ({
  notifications: { show: vi.fn(), update: vi.fn() },
}));

import { insertMediaFiles } from "./media-authoring-actions";

function makeEditor() {
  const inserted: Array<{ pos: number; content: any }> = [];
  const chain: any = {
    focus: vi.fn(() => chain),
    insertContentAt: vi.fn((pos: number, content: any) => {
      inserted.push({ pos, content });
      return chain;
    }),
    run: vi.fn(() => true),
  };

  return {
    editor: {
      state: { selection: { from: 7 } },
      chain: () => chain,
    } as any,
    inserted,
  };
}

function mediaItem(key: string, kind: "video" | "audio") {
  return {
    key,
    src: `/api/files/${key}/${kind}.${kind === "video" ? "mp4" : "mp3"}`,
    attachmentId: key,
    title: key,
  };
}

describe("Ramzy Studio media authoring insertion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("keeps a single video as a standalone video node upload", async () => {
    const { editor, inserted } = makeEditor();
    const file = new File(["video"], "one.mp4", { type: "video/mp4" });

    await insertMediaFiles({
      editor,
      files: [file],
      pageId: "page-1",
      kind: "video",
      pos: 11,
    });

    expect(mocks.uploadVideoAction).toHaveBeenCalledOnce();
    expect(mocks.uploadVideoAction).toHaveBeenCalledWith(file, editor, 11, "page-1");
    expect(mocks.ingestMediaBatch).not.toHaveBeenCalled();
    expect(inserted).toEqual([]);
  });

  it("composes two or more selected videos into one video playlist", async () => {
    const { editor, inserted } = makeEditor();
    const files = [
      new File(["a"], "a.mp4", { type: "video/mp4" }),
      new File(["b"], "b.webm", { type: "video/webm" }),
      new File(["c"], "c.mov", { type: "video/quicktime" }),
    ];
    const successful = [
      mediaItem("a", "video"),
      mediaItem("b", "video"),
      mediaItem("c", "video"),
    ];
    mocks.ingestMediaBatch.mockResolvedValue({ successful, failed: [] });

    await insertMediaFiles({
      editor,
      files,
      pageId: "page-1",
      kind: "video",
      pos: 13,
    });

    expect(mocks.uploadVideoAction).not.toHaveBeenCalled();
    expect(mocks.ingestMediaBatch).toHaveBeenCalledWith(files, "video", "page-1");
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toEqual({
      pos: 13,
      content: {
        type: "mediaPlaylist",
        attrs: {
          kind: "video",
          title: "",
          items: successful,
          activeKey: "a",
          autoplay: false,
          loop: false,
        },
      },
    });
  });

  it("composes multiple selected audio files into one audio playlist", async () => {
    const { editor, inserted } = makeEditor();
    const files = [
      new File(["a"], "a.mp3", { type: "audio/mpeg" }),
      new File(["b"], "b.m4a", { type: "audio/mp4" }),
    ];
    const successful = [mediaItem("a", "audio"), mediaItem("b", "audio")];
    mocks.ingestMediaBatch.mockResolvedValue({ successful, failed: [] });

    await insertMediaFiles({
      editor,
      files,
      pageId: "page-2",
      kind: "audio",
    });

    expect(mocks.uploadAudioAction).not.toHaveBeenCalled();
    expect(inserted[0].content.attrs.kind).toBe("audio");
    expect(inserted[0].content.attrs.items).toEqual(successful);
    expect(inserted[0].content.attrs.activeKey).toBe("a");
  });
});
