export interface InitialSyncSource {
  synced?: boolean;
  whenSynced?: Promise<unknown>;
  on?: (event: "synced", callback: () => void) => unknown;
  off?: (event: "synced", callback: () => void) => unknown;
}

/**
 * Observe the initial sync of providers whose ready event may already have fired
 * before React subscribes. The callback is guaranteed to run at most once.
 */
export function observeInitialSync(
  source: InitialSyncSource,
  onSynced: () => void,
): () => void {
  let active = true;
  let completed = false;

  const markSynced = () => {
    if (!active || completed) return;
    completed = true;
    onSynced();
  };

  if (source.synced) {
    markSynced();
  } else {
    source.on?.("synced", markSynced);
    void source.whenSynced?.then(markSynced);
  }

  return () => {
    active = false;
    source.off?.("synced", markSynced);
  };
}
