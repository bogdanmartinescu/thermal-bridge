/**
 * Human-readable order reference: TB-YYYY-NNNN
 *
 * ⚠ This is only a display reference. The canonical primary key is
 * a UUID generated with crypto.randomUUID(). The sequential NNNN comes
 * from the D1 auto-increment; it is derived, not used as a primary key.
 */
export function buildOrderRef(year: number, seq: number): string {
  return `TB-${year}-${String(seq).padStart(4, "0")}`;
}
