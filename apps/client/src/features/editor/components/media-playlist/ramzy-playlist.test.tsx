// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import React, { type ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import RamzyPlaylist from "./ramzy-playlist";

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
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

function wrap(child: ReactNode) {
  return render(<MantineProvider env="test">{child}</MantineProvider>);
}

const items = [
  {
    key: "discover",
    title: "Discover: establish the direction",
    durationSeconds: 8,
    dateAdded: "2026-09-11",
  },
];

describe("RamzyPlaylist item actions", () => {
  it("opens a portal menu with safe playback actions in readonly Preview", async () => {
    const onPlay = vi.fn();
    const onDownload = vi.fn();
    const { container } = wrap(
      <RamzyPlaylist
        items={items}
        editable={false}
        kind="video"
        onPlay={onPlay}
        onDownload={onDownload}
      />,
    );

    const root = container.querySelector('[data-ramzy-playlist="true"]')!;
    const action = screen.getByRole("button", {
      name: "Actions for Discover: establish the direction",
    });

    fireEvent.click(action);

    const menu = await screen.findByRole("menu");
    expect(root.contains(menu)).toBe(false);
    expect(screen.getByRole("menuitem", { name: "Play" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Download" })).toBeTruthy();
    expect(screen.queryByRole("menuitem", { name: "Edit details" })).toBeNull();

    fireEvent.click(screen.getByRole("menuitem", { name: "Play" }));
    expect(onPlay).toHaveBeenCalledExactlyOnceWith("discover");
  });

  it("keeps mutation actions in Build while using the same unclipped menu surface", async () => {
    const onEditDetails = vi.fn();
    wrap(
      <RamzyPlaylist
        items={items}
        editable
        kind="audio"
        onPlay={vi.fn()}
        onDownload={vi.fn()}
        onEditDetails={onEditDetails}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Actions for Discover: establish the direction",
      }),
    );

    const edit = await screen.findByRole("menuitem", { name: "Edit details" });
    expect(edit).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Replace audio" })).toBeTruthy();
    fireEvent.click(edit);
    expect(onEditDetails).toHaveBeenCalledExactlyOnceWith("discover");
  });

  it("reserves a visible end column and touch-sized action targets at compact widths", () => {
    const styles = readFileSync(
      new URL("./ramzy-playlist.module.css", import.meta.url),
      "utf8",
    );
    expect(styles).toContain(
      "grid-template-columns: 44px minmax(0, 1fr) 44px !important",
    );
    expect(styles).toContain(
      "grid-template-columns: 40px minmax(0, 1fr) 44px !important",
    );
    expect(styles).toContain("width: 44px !important");
    expect(styles).toContain('actionButton[aria-expanded="true"]');
  });
});
