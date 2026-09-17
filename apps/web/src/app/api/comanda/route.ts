import { getCloudflareContext } from "@opennextjs/cloudflare";
import { orderSchema } from "@/lib/order-schema";
import { getAvailability } from "@/lib/stock";
import { buildOrderRef } from "@/lib/order-number";
import { getPrinterBySlug } from "@/data/printers";

export const runtime = "edge";

export async function POST(request: Request): Promise<Response> {
  // 1. Parse and validate the request body at the boundary (unknown → typed)
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return Response.json(
      { error: firstError?.message ?? "Date invalide." },
      { status: 422 },
    );
  }

  const order = parsed.data;
  const { env } = getCloudflareContext();

  // 2. Re-check availability server-side to prevent overselling
  const slugs = order.items.map((i) => i.slug);
  const availability = await getAvailability(env.DB, slugs);

  for (const item of order.items) {
    const avail = availability.get(item.slug);
    if (!avail || avail.available < item.qty) {
      const printer = getPrinterBySlug(item.slug);
      return Response.json(
        {
          error: `Stoc insuficient pentru "${printer?.name ?? item.slug}". Disponibil: ${avail?.available ?? 0} buc.`,
        },
        { status: 409 },
      );
    }
  }

  // 3. Generate IDs and references
  const id = crypto.randomUUID();
  const year = new Date().getFullYear();

  // Atomic sequence increment in D1
  await env.DB.prepare(
    `INSERT INTO order_seq(year, seq) VALUES(?, 1)
     ON CONFLICT(year) DO UPDATE SET seq = seq + 1`,
  )
    .bind(year)
    .run();

  const seqRow = await env.DB
    .prepare("SELECT seq FROM order_seq WHERE year = ?")
    .bind(year)
    .first<{ seq: number }>();

  const seq = seqRow?.seq ?? 1;
  const ref = buildOrderRef(year, seq);

  // 4. Compute total
  const totalBani = order.items.reduce(
    (sum, i) => sum + i.unitPriceBani * i.qty,
    0,
  );

  // 5. Insert order and items in a batch
  type D1PreparedStatement = ReturnType<D1Database["prepare"]>;
  const batch: D1PreparedStatement[] = [
    env.DB.prepare(
      `INSERT INTO orders(id, ref, name, phone, email, judet, localitate, adresa, cod_postal, notes, total_bani)
       VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      id,
      ref,
      order.customer.name,
      order.customer.phone,
      order.customer.email,
      order.customer.judet,
      order.customer.localitate,
      order.customer.adresa,
      order.customer.codPostal,
      order.customer.notes ?? null,
      totalBani,
    ),
    ...order.items.map((item) =>
      env.DB.prepare(
        `INSERT INTO order_items(order_id, printer_slug, qty, unit_price_bani)
         VALUES(?, ?, ?, ?)`,
      ).bind(id, item.slug, item.qty, item.unitPriceBani),
    ),
  ];

  await env.DB.batch(batch);

  return Response.json({ ref }, { status: 201 });
}
