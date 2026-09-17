/**
 * GET  /api/orders/[id]   — fetch a single order with its items
 * PATCH /api/orders/[id]  — update order status
 *
 * Authentication: Authorization: Bearer <ORDERS_API_KEY>
 *
 * PATCH body: { "status": "confirmata" | "expediata" | "livrata" | "anulata" }
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireApiKey } from "@/lib/api-auth";
import { z } from "zod";

export const runtime = "edge";

const VALID_STATUSES = [
  "noua",
  "confirmata",
  "expediata",
  "livrata",
  "anulata",
] as const;

type OrderStatus = (typeof VALID_STATUSES)[number];

const patchSchema = z.object({
  status: z.enum(VALID_STATUSES),
});

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
  printer_slug: string;
  qty: number;
  unit_price_bani: number;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { env } = getCloudflareContext();

  const deny = requireApiKey(request, env);
  if (deny) return deny;

  const { id } = await params;

  const order = await env.DB.prepare(
    `SELECT id, ref, created_at, status,
            name, phone, email,
            judet, localitate, adresa, cod_postal, notes,
            total_bani
     FROM orders WHERE id = ?`,
  )
    .bind(id)
    .first<OrderRow>();

  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  const itemsResult = await env.DB.prepare(
    `SELECT printer_slug, qty, unit_price_bani
     FROM order_items WHERE order_id = ?`,
  )
    .bind(id)
    .all<OrderItemRow>();

  return Response.json({
    id: order.id,
    ref: order.ref,
    createdAt: order.created_at,
    status: order.status,
    customer: {
      name: order.name,
      phone: order.phone,
      email: order.email,
      judet: order.judet,
      localitate: order.localitate,
      adresa: order.adresa,
      codPostal: order.cod_postal,
      notes: order.notes ?? undefined,
    },
    totalBani: order.total_bani,
    items: itemsResult.results.map((i) => ({
      printerSlug: i.printer_slug,
      qty: i.qty,
      unitPriceBani: i.unit_price_bani,
    })),
  });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { env } = getCloudflareContext();

  const deny = requireApiKey(request, env);
  if (deny) return deny;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}.`,
      },
      { status: 422 },
    );
  }

  const newStatus: OrderStatus = parsed.data.status;

  const result = await env.DB.prepare(
    `UPDATE orders SET status = ? WHERE id = ?`,
  )
    .bind(newStatus, id)
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  return Response.json({ id, status: newStatus });
}
