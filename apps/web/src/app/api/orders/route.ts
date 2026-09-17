/**
 * GET /api/orders
 *
 * Returns orders newest-first, with their items embedded.
 * Intended for the desktop companion app to poll for new orders.
 *
 * Authentication: Authorization: Bearer <ORDERS_API_KEY>
 *
 * Query params:
 *   status   — filter by order status (noua | confirmata | expediata | livrata | anulata)
 *   since    — ISO-8601 datetime; only orders created after this timestamp
 *   limit    — max results (default 50, max 200)
 *   offset   — pagination offset (default 0)
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireApiKey } from "@/lib/api-auth";

export const runtime = "edge";

interface OrderRow {
  id: string;
  ref: string;
  created_at: string;
  status: string;
  name: string;
  phone: string;
  email: string;
  judet: string;
  localitate: string;
  adresa: string;
  cod_postal: string;
  notes: string | null;
  total_bani: number;
}

interface OrderItemRow {
  order_id: string;
  printer_slug: string;
  qty: number;
  unit_price_bani: number;
}

export async function GET(request: Request): Promise<Response> {
  const { env } = getCloudflareContext();

  const deny = requireApiKey(request, env);
  if (deny) return deny;

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const since = url.searchParams.get("since");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "50"), 200);
  const offset = Number(url.searchParams.get("offset") ?? "0");

  // Build parameterised WHERE clauses
  const conditions: string[] = [];
  const bindings: (string | number)[] = [];

  if (status) {
    conditions.push("o.status = ?");
    bindings.push(status);
  }
  if (since) {
    conditions.push("o.created_at > ?");
    bindings.push(since);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const ordersResult = await env.DB.prepare(
    `SELECT o.id, o.ref, o.created_at, o.status,
            o.name, o.phone, o.email,
            o.judet, o.localitate, o.adresa, o.cod_postal, o.notes,
            o.total_bani
     FROM orders o
     ${where}
     ORDER BY o.created_at DESC
     LIMIT ? OFFSET ?`,
  )
    .bind(...bindings, limit, offset)
    .all<OrderRow>();

  if (ordersResult.results.length === 0) {
    return Response.json({ orders: [], total: 0 });
  }

  // Fetch items for all returned orders in one query
  const orderIds = ordersResult.results.map((o) => o.id);
  const placeholders = orderIds.map(() => "?").join(", ");
  const itemsResult = await env.DB.prepare(
    `SELECT order_id, printer_slug, qty, unit_price_bani
     FROM order_items
     WHERE order_id IN (${placeholders})`,
  )
    .bind(...orderIds)
    .all<OrderItemRow>();

  // Group items by order_id
  const itemsByOrder = new Map<string, OrderItemRow[]>();
  for (const item of itemsResult.results) {
    const list = itemsByOrder.get(item.order_id) ?? [];
    list.push(item);
    itemsByOrder.set(item.order_id, list);
  }

  const orders = ordersResult.results.map((o) => ({
    id: o.id,
    ref: o.ref,
    createdAt: o.created_at,
    status: o.status,
    customer: {
      name: o.name,
      phone: o.phone,
      email: o.email,
      judet: o.judet,
      localitate: o.localitate,
      adresa: o.adresa,
      codPostal: o.cod_postal,
      notes: o.notes ?? undefined,
    },
    totalBani: o.total_bani,
    items: (itemsByOrder.get(o.id) ?? []).map((i) => ({
      printerSlug: i.printer_slug,
      qty: i.qty,
      unitPriceBani: i.unit_price_bani,
    })),
  }));

  // Return total count for pagination
  const countResult = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM orders o ${where}`,
  )
    .bind(...bindings)
    .first<{ total: number }>();

  return Response.json({
    orders,
    total: countResult?.total ?? orders.length,
    limit,
    offset,
  });
}
