import { describe, expect, it, vi } from "vitest";
import { observeInitialSync, type InitialSyncSource } from "./portfolio-sync";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((nextResolve) => {
    resolve = nextResolve;
  });
  return { promise, resolve };
}

describe("observeInitialSync", () => {
  it("handles providers that were already synced before subscription", () => {
    const onSynced = vi.fn();
    const source: InitialSyncSource = { synced: true };

    observeInitialSync(source, onSynced);

    expect(onSynced).toHaveBeenCalledTimes(1);
  });

  it("uses whenSynced so a missed event cannot leave BUILD loading forever", async () => {
    const ready = deferred();
    const onSynced = vi.fn();
    const source: InitialSyncSource = {
      synced: false,
      whenSynced: ready.promise,
      on: vi.fn(),
      off: vi.fn(),
    };

    observeInitialSync(source, onSynced);
    expect(onSynced).not.toHaveBeenCalled();

    ready.resolve();
    await ready.promise;
    await Promise.resolve();

    expect(onSynced).toHaveBeenCalledTimes(1);
  });

  it("does not update state after the observer is disposed", async () => {
    const ready = deferred();
    const onSynced = vi.fn();
    const source: InitialSyncSource = {
      synced: false,
      whenSynced: ready.promise,
      on: vi.fn(),
      off: vi.fn(),
    };

    const dispose = observeInitialSync(source, onSynced);
    dispose();
    ready.resolve();
    await ready.promise;
    await Promise.resolve();

    expect(onSynced).not.toHaveBeenCalled();
  });
});
