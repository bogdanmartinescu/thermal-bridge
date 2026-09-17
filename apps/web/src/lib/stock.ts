import { getPrinterBySlug } from "@/data/printers";

export interface StockResult {
  slug: string;
  stockTotal: number;
  sold: number;
  available: number;
}

/**
 * Derive availability for a list of slugs from D1.
 *
 * available(slug) = printers[slug].stock
 *                  - SUM(order_items.qty WHERE slug AND order.status != 'anulata')
 *
 * This prevents overselling: the static file sets the ceiling; sold units reduce it.
 */
export async function getAvailability(
  db: D1Database,
  slugs: string[],
): Promise<Map<string, StockResult>> {
  if (slugs.length === 0) return new Map();

  const placeholders = slugs.map(() => "?").join(", ");
  const rows = await db
    .prepare(
      `SELECT oi.printer_slug, COALESCE(SUM(oi.qty), 0) AS sold
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       WHERE o.status != 'anulata'
         AND oi.printer_slug IN (${placeholders})
       GROUP BY oi.printer_slug`,
    )
    .bind(...slugs)
    .all<{ printer_slug: string; sold: number }>();

  const soldMap = new Map<string, number>();
  for (const row of rows.results) {
    soldMap.set(row.printer_slug, row.sold);
  }

  const result = new Map<string, StockResult>();
  for (const slug of slugs) {
    const printer = getPrinterBySlug(slug);
    const stockTotal = printer?.stock ?? 0;
    const sold = soldMap.get(slug) ?? 0;
    result.set(slug, {
      slug,
      stockTotal,
      sold,
      available: Math.max(0, stockTotal - sold),
    });
  }
  return result;
}

/** Convenience: get availability for a single slug */
export async function getAvailableQty(
  db: D1Database,
  slug: string,
): Promise<number> {
  const map = await getAvailability(db, [slug]);
  return map.get(slug)?.available ?? 0;
}
