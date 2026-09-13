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
    expect(playlist).toContain("@container ramzy-playlist (max-width: 620px)");
    expect(playlist).toContain("min-height: 44px");
    expect(view).toContain("collection.mediaPlaylist");
  });
});
