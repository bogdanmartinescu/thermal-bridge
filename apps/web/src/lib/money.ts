/**
 * Monetary helpers — all amounts are stored as integer bani (1 RON = 100 bani)
 * to avoid floating-point rounding errors.
 */

/** Format bani as a human-readable RON string, e.g. 129900 → "1.299,00 RON" */
export function formatRON(bani: number): string {
  const ron = bani / 100;
  return ron.toLocaleString("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Multiply bani by an integer quantity */
export function totalBani(unitBani: number, qty: number): number {
  return unitBani * qty;
}
