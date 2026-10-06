/** Parse only a bounded viewport fraction. Never emit arbitrary user CSS. */
export function drawerSizePercent(value: unknown): number | null {
  let ratio: number;
  if (typeof value === 'number') {
    ratio = value;
  } else if (typeof value === 'string') {
    const text = value.trim();
    if (text === 'full') return 100;
    const fraction = /^(\d+)\s*\/\s*(\d+)$/.exec(text);
    const percent = /^(\d+(?:\.\d+)?)%$/.exec(text);
    if (fraction) ratio = Number(fraction[1]) / Number(fraction[2]);
    else if (percent) ratio = Number(percent[1]) / 100;
    else return null;
  } else return null;
  return Number.isFinite(ratio) && ratio > 0 && ratio <= 1 ? ratio * 100 : null;
}
