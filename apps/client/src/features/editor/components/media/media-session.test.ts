import { describe, expect, it, vi } from "vitest";
import {
  activateRamzyMediaSession,
  isRamzyMediaSessionActive,
  registerRamzyMediaSession,
} from "./media-session";

describe("Ramzy media session", () => {
  it("pauses the previous player when another media session starts", () => {
    const pauseA = vi.fn();
    const pauseB = vi.fn();
    const unregisterA = registerRamzyMediaSession("test-a", { pause: pauseA });
    const unregisterB = registerRamzyMediaSession("test-b", { pause: pauseB });

    activateRamzyMediaSession("test-a");
    expect(isRamzyMediaSessionActive("test-a")).toBe(true);
    expect(pauseA).not.toHaveBeenCalled();

    activateRamzyMediaSession("test-b");
    expect(pauseA).toHaveBeenCalledTimes(1);
    expect(pauseB).not.toHaveBeenCalled();
    expect(isRamzyMediaSessionActive("test-b")).toBe(true);

    unregisterA();
    unregisterB();
  });
});
