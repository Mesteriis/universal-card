/** Normalize a grid gap without losing an explicit zero or emitting unitless CSS. */
export function normalizeGridGap(value: unknown, fallback: string): string {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value >= 0 ? `${value}px` : fallback;
  }
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}
