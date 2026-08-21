import { useSyncExternalStore } from "react";

/**
 * Browser-native ESM bridge for packages that still import
 * `use-sync-external-store/shim`.
 *
 * React 19 already ships useSyncExternalStore natively, so the legacy
 * CommonJS shim must never cross the Ramzy Studio package boundary.
 */
export { useSyncExternalStore };

export default {
  useSyncExternalStore,
};
