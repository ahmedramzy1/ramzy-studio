const MIN_COLUMNS = 2;
const MAX_COLUMNS = 5;

/**
 * Normalizes persisted column proportions without introducing a second DOM
 * layout engine. CSS owns rendering; ProseMirror owns persisted weights.
 */
export function normalizedColumnWeights(weights: readonly number[]) {
  if (weights.length < MIN_COLUMNS || weights.length > MAX_COLUMNS) {
    throw new RangeError("Portfolio rows support between two and five columns");
  }

  const safe = weights.map((weight) =>
    Number.isFinite(weight) && weight > 0 ? weight : 1,
  );
  const average = safe.reduce((sum, weight) => sum + weight, 0) / safe.length;
  return safe.map((weight) => Number((weight / average).toFixed(4)));
}
