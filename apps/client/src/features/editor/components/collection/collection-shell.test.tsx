// @vitest-environment jsdom
import React, { type ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { NodeViewProps } from "@tiptap/react";
import { PhotoCollectionView } from "../photo-collection/portfolio-photo-collections";
import MediaPlaylistView from "../media-playlist/media-playlist-view";
import { uploadFile } from "@/features/page/services/page-service";

vi.mock("@tiptap/react", () => ({
  NodeViewWrapper: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  ReactNodeViewRenderer: vi.fn(),
}));
vi.mock("../common/block-drag-handle", () => ({ BlockDragHandle: () => null }));
vi.mock("@/lib/config", () => ({ getFileUrl: (src: string) => src }));
vi.mock("@/features/page/services/page-service", () => ({
  uploadFile: vi.fn(),
}));
vi.mock("../media/media-authoring-actions", () => ({
  filterMediaFiles: (files: File[]) => files,
  mediaAccept: () => "video/*",
}));
vi.mock("../media/media-ingest", () => ({
  ingestMediaBatch: vi.fn(),
  generateVideoCaptions: vi.fn(),
}));
vi.mock("../audio/ramzy-audio-player", () => ({
  default: () => <div>Audio player</div>,
}));
vi.mock("../video/ramzy-video-player", () => ({
  default: () => <div>Video player</div>,
}));
vi.mock("../media-playlist/ramzy-playlist", () => ({
  default: () => <div data-testid="queue">Queue</div>,
}));

beforeAll(() => {
  Object.defineProperty(document, "fonts", {
    value: { addEventListener: vi.fn(), removeEventListener: vi.fn() },
    configurable: true,
  });
  window.matchMedia = vi
    .fn()
    .mockImplementation(() => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
function props(
  name: string,
  attrs: Record<string, unknown> = {},
  editable = true,
) {
  return {
    editor: { isEditable: editable, storage: { pageId: "page" } },
    node: { type: { name }, attrs },
    selected: false,
    updateAttributes: vi.fn(),
  } as unknown as NodeViewProps;
}
function wrap(child: ReactNode) {
  return render(<MantineProvider env="test">{child}</MantineProvider>);
}

describe("collection authoring contract", () => {
  it.each(["photoGrid", "photoAlbum"])(
    "%s exposes a labelled title and working first-use file action",
    (name) => {
      const p = props(name);
      const { container } = wrap(<PhotoCollectionView {...p} />);
      const input = container.querySelector('input[type="file"]')!;
      const click = vi.spyOn(input as HTMLInputElement, "click");
      fireEvent.click(screen.getByRole("button", { name: "Add photos" }));
      expect(click).toHaveBeenCalledOnce();
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Collection" },
      });
      expect(p.updateAttributes).toHaveBeenCalledWith({ title: "Collection" });
    },
  );
  it("album details edit as one save and cancel preserves existing attributes", async () => {
    const p = props("photoAlbum", {
      description: "Original",
      location: "Cairo",
      date: "2026",
      credit: "Ahmed",
    });
    const { container } = wrap(<PhotoCollectionView {...p} />);
    expect(screen.queryByLabelText("Description")).toBeNull();
    const action = container.querySelector(
      '[data-ramzy-element-action="edit-album-details"]',
    )!;
    fireEvent.click(action);
    fireEvent.change(await screen.findByLabelText("Description"), {
      target: { value: "Cancelled" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(p.updateAttributes).not.toHaveBeenCalled();
    fireEvent.click(action);
    const field = await screen.findByLabelText("Description");
    expect((field as HTMLTextAreaElement).value).toBe("Original");
    fireEvent.change(field, { target: { value: "Updated" } });
    fireEvent.click(screen.getByRole("button", { name: "Save details" }));
    expect(p.updateAttributes).toHaveBeenCalledExactlyOnceWith({
      description: "Updated",
      location: "Cairo",
      date: "2026",
      credit: "Ahmed",
    });
  });
  it("readonly album keeps content metadata but hides editing fields and upload affordances", () => {
    wrap(
      <PhotoCollectionView
        {...props(
          "photoAlbum",
          { title: "Album", description: "Description", credit: "Ahmed" },
          false,
        )}
      />,
    );
    expect(screen.getByText("Album")).toBeTruthy();
    expect(screen.getByText("Photo: Ahmed")).toBeTruthy();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("button", { name: "Add photos" })).toBeNull();
  });
  it.each(["video", "audio"])(
    "empty %s playlist has one upload action and no empty queue",
    (kind) => {
      const { container } = wrap(
        <MediaPlaylistView {...props("mediaPlaylist", { kind, items: [] })} />,
      );
      const input = container.querySelector('input[type="file"]')!;
      const click = vi.spyOn(input as HTMLInputElement, "click");
      fireEvent.click(
        screen.getByRole("button", {
          name: kind === "video" ? "Add videos" : "Add audio",
        }),
      );
      expect(click).toHaveBeenCalledOnce();
      expect(screen.queryByTestId("queue")).toBeNull();
    },
  );
  it("a populated playlist retains its player and queue", () => {
    wrap(
      <MediaPlaylistView
        {...props("mediaPlaylist", {
          kind: "video",
          items: [{ key: "v", src: "/clip.mp4", title: "Clip" }],
        })}
      />,
    );
    expect(screen.getByText("Video player")).toBeTruthy();
    expect(screen.getByTestId("queue")).toBeTruthy();
  });
  it("photo upload failure stays inside the element and allows retry", async () => {
    vi.mocked(uploadFile).mockRejectedValueOnce(new Error("offline"));
    const p = props("photoGrid");
    const { container } = wrap(<PhotoCollectionView {...p} />);
    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [new File(["x"], "a.png", { type: "image/png" })] },
    });
    expect(await screen.findByRole("alert")).toBeTruthy();
    await waitFor(() =>
      expect(
        (
          screen.getByRole("button", {
            name: "Add photos",
          }) as HTMLButtonElement
        ).disabled,
      ).toBe(false),
    );
    expect(p.updateAttributes).not.toHaveBeenCalled();
  });
});
