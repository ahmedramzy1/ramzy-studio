import {
  useDebugValue,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

type Subscribe = (onStoreChange: () => void) => () => void;
type EqualityFn<T> = (a: T, b: T) => boolean;

/**
 * Browser-native ESM replacement for
 * `use-sync-external-store/shim/with-selector`.
 *
 * It deliberately builds on React 19's native useSyncExternalStore so the
 * published Ramzy Studio runtime never carries a CommonJS React shim.
 */
export function useSyncExternalStoreWithSelector<Snapshot, Selection>(
  subscribe: Subscribe,
  getSnapshot: () => Snapshot,
  getServerSnapshot: (() => Snapshot) | undefined,
  selector: (snapshot: Snapshot) => Selection,
  isEqual?: EqualityFn<Selection>,
): Selection {
  const instanceRef = useRef<{ hasValue: boolean; value: Selection | undefined } | null>(
    null,
  );

  if (instanceRef.current === null) {
    instanceRef.current = { hasValue: false, value: undefined };
  }

  const instance = instanceRef.current;

  const [getSelection, getServerSelection] = useMemo(() => {
    let hasMemo = false;
    let memoizedSnapshot: Snapshot;
    let memoizedSelection: Selection;

    const memoizedSelector = (nextSnapshot: Snapshot): Selection => {
      if (!hasMemo) {
        hasMemo = true;
        memoizedSnapshot = nextSnapshot;
        const nextSelection = selector(nextSnapshot);

        if (
          isEqual &&
          instance.hasValue &&
          instance.value !== undefined &&
          isEqual(instance.value, nextSelection)
        ) {
          memoizedSelection = instance.value;
          return instance.value;
        }

        memoizedSelection = nextSelection;
        return nextSelection;
      }

      if (Object.is(memoizedSnapshot, nextSnapshot)) {
        return memoizedSelection;
      }

      const nextSelection = selector(nextSnapshot);
      if (isEqual && isEqual(memoizedSelection, nextSelection)) {
        memoizedSnapshot = nextSnapshot;
        return memoizedSelection;
      }

      memoizedSnapshot = nextSnapshot;
      memoizedSelection = nextSelection;
      return nextSelection;
    };

    const clientSelection = () => memoizedSelector(getSnapshot());
    const serverSelection = getServerSnapshot
      ? () => memoizedSelector(getServerSnapshot())
      : undefined;

    return [clientSelection, serverSelection] as const;
  }, [getSnapshot, getServerSnapshot, selector, isEqual, instance]);

  const value = useSyncExternalStore(
    subscribe,
    getSelection,
    getServerSelection,
  );

  useEffect(() => {
    instance.hasValue = true;
    instance.value = value;
  }, [instance, value]);

  useDebugValue(value);
  return value;
}

export default {
  useSyncExternalStoreWithSelector,
};
