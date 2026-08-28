export interface PlaylistKeyedItem {
  key: string;
}

export function stepPlaylistKey<T extends PlaylistKeyedItem>(
  items: readonly T[],
  currentKey: string,
  direction: -1 | 1,
  loop: boolean,
): string | null {
  if (!items.length) return null;

  const foundIndex = items.findIndex((item) => item.key === currentKey);
  const currentIndex = foundIndex >= 0 ? foundIndex : 0;
  const nextIndex = currentIndex + direction;

  if (nextIndex >= 0 && nextIndex < items.length) {
    return items[nextIndex].key;
  }

  if (!loop || items.length < 2) return null;
  return direction === 1 ? items[0].key : items[items.length - 1].key;
}

export function movePlaylistItem<T extends PlaylistKeyedItem>(
  items: readonly T[],
  key: string,
  direction: -1 | 1,
): T[] {
  const index = items.findIndex((item) => item.key === key);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= items.length) return [...items];

  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function reorderPlaylistItems<T extends PlaylistKeyedItem>(
  items: readonly T[],
  sourceKey: string,
  targetKey: string,
): T[] {
  const from = items.findIndex((item) => item.key === sourceKey);
  const to = items.findIndex((item) => item.key === targetKey);
  if (from < 0 || to < 0 || from === to) return [...items];

  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function removePlaylistItem<T extends PlaylistKeyedItem>(
  items: readonly T[],
  key: string,
  currentActiveKey: string,
): { items: T[]; nextActiveKey: string } {
  const removedIndex = items.findIndex((item) => item.key === key);
  if (removedIndex < 0) {
    return {
      items: [...items],
      nextActiveKey: items.some((item) => item.key === currentActiveKey)
        ? currentActiveKey
        : items[0]?.key || "",
    };
  }

  const next = items.filter((item) => item.key !== key);
  if (key !== currentActiveKey && next.some((item) => item.key === currentActiveKey)) {
    return { items: next, nextActiveKey: currentActiveKey };
  }

  return {
    items: next,
    nextActiveKey:
      next[Math.min(removedIndex, Math.max(next.length - 1, 0))]?.key || "",
  };
}
