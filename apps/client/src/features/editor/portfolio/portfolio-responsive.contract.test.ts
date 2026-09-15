import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("portfolio responsive composition", () => {
  it("uses canvas container queries for document typography and columns", () => {
    const elements = readFileSync(
      "src/features/editor/styles/portfolio-elements.css",
      "utf8",
    );
    const typography = readFileSync(
      "src/features/editor/styles/portfolio-typography.css",
      "utf8",
    );
    const columns = readFileSync(
      "src/features/editor/styles/columns.css",
      "utf8",
    );

    expect(elements).toContain("container: ramzy-document / inline-size");
    expect(typography).toContain("@container ramzy-document (max-width: 720px)");
    expect(columns.match(/@container ramzy-document/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("gives media playlists a wide sidecar and compact queue contract", () => {
    const collection = readFileSync(
      "src/features/editor/components/collection/collection-shell.module.css",
      "utf8",
    );
    const playlist = readFileSync(
      "src/features/editor/components/media-playlist/ramzy-playlist.module.css",
      "utf8",
    );
    const view = readFileSync(
      "src/features/editor/components/media-playlist/media-playlist-view.tsx",
      "utf8",
    );

    expect(collection).toContain("@container collection (min-width: 800px)");
    expect(collection).toContain("grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.85fr)");
    expect(collection).toContain("--ramzy-playlist-pair-height: clamp(440px, 48cqi, 500px)");
    expect(collection).toContain("height: var(--ramzy-playlist-pair-height) !important");
    expect(playlist).toContain("@container ramzy-playlist (max-width: 620px)");
    expect(playlist).toContain("grid-template-rows: auto auto minmax(0, 1fr)");
    expect(playlist).toContain("grid-template-columns: 44px 44px minmax(0, 1fr) 44px");
    expect(playlist).toContain("min-height: 44px");
    expect(view).toContain("collection.mediaPlaylist");
  });

  it("fits compact tables and scrolls genuinely wide tables", () => {
    const table = readFileSync(
      "src/features/editor/styles/table.css",
      "utf8",
    );

    expect(columns).toContain("container: ramzy-column / inline-size");
    expect(table).toContain("@container (max-width: 720px)");
    expect(table).not.toContain("@container ramzy-document");
    expect(table).toContain("table:not(:has(colgroup > col:nth-child(4)))");
    expect(table).toContain("table:has(colgroup > col:nth-child(4))");
    expect(table).toContain("table-layout: auto");
    expect(table).not.toContain(
      "table:not(:has(colgroup > col:nth-child(4))) col",
    );
    expect(table).toContain("overflow-wrap: break-word");
    expect(table).toContain("word-break: normal");
    expect(table).toContain(
      "table:has(colgroup > col:nth-child(3)):not(:has(colgroup > col:nth-child(4)))",
    );
  });

  it("adapts audio and video controls to their rendered player width", () => {
    const audio = readFileSync(
      "src/features/editor/components/audio/ramzy-audio-player.tsx",
      "utf8",
    );
    const video = readFileSync(
      "src/features/editor/components/video/ramzy-video-player.tsx",
      "utf8",
    );

    expect(audio).toContain('container: "ramzy-audio / inline-size"');
    expect(audio).toContain("@container ramzy-audio (max-width: 640px)");
    expect(audio).toContain("@container ramzy-audio (max-width: 380px)");
    expect(video).toContain('container: "ramzy-video / inline-size"');
    expect(video).toContain("@container ramzy-video (max-width: 390px)");
  });
});
