import { getCloudflareContext } from "@opennextjs/cloudflare";
import { orderSchema } from "@/lib/order-schema";
import { getAvailability } from "@/lib/stock";
import { buildOrderRef } from "@/lib/order-number";
import { formatRON } from "@/lib/money";
import { getPrinterBySlug } from "@/data/printers";

type D1Result<T> = { results: T[] };

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

  // 5. Insert order and items inside a batch
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

  // 6. Send confirmation email (awaited — failure is surfaced, not swallowed)
  const itemsHtml = order.items
    .map((item) => {
      const printer = getPrinterBySlug(item.slug);
      return `<tr>
        <td>${printer?.name ?? item.slug}</td>
        <td style="text-align:right">${item.qty}</td>
        <td style="text-align:right">${formatRON(item.unitPriceBani)}</td>
        <td style="text-align:right">${formatRON(item.unitPriceBani * item.qty)}</td>
      </tr>`;
    })
    .join("\n");

  const emailHtml = `
<html><body style="font-family:sans-serif;color:#1a1a1a">
<h2>Comandă nouă — ${ref}</h2>
<p><strong>Client:</strong> ${order.customer.name}<br>
<strong>Telefon:</strong> ${order.customer.phone}<br>
<strong>Email:</strong> ${order.customer.email}</p>
<p><strong>Adresă livrare:</strong><br>
${order.customer.adresa}<br>
${order.customer.localitate}, ${order.customer.judet} ${order.customer.codPostal}</p>
${order.customer.notes ? `<p><strong>Observații:</strong> ${order.customer.notes}</p>` : ""}
<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
<thead><tr><th>Produs</th><th>Cant.</th><th>Preț/buc.</th><th>Total</th></tr></thead>
<tbody>${itemsHtml}</tbody>
<tfoot><tr><td colspan="3"><strong>Total</strong></td><td style="text-align:right"><strong>${formatRON(totalBani)}</strong></td></tr></tfoot>
</table>
<p style="color:#666">Plată: ramburs la livrare.</p>
</body></html>
`;

  const emailText = `Comandă nouă ${ref}\n\n${order.customer.name}\n${order.customer.phone}\n${order.customer.email}\n${order.customer.adresa}, ${order.customer.localitate}, ${order.customer.judet} ${order.customer.codPostal}\n\nTotal: ${formatRON(totalBani)}\nPlată: ramburs`;

  await env.EMAIL.send({
    to: { email: "hi@mlb.ro", name: "ThermalBridge" },
    from: { email: "comenzi@mlb.ro", name: "ThermalBridge" },
    replyTo: { email: order.customer.email, name: order.customer.name },
    subject: `Comandă nouă ${ref}`,
    html: emailHtml,
    text: emailText,
  });

  return Response.json({ ref }, { status: 201 });
}

// D1PreparedStatement is a global in the Workers runtime; type it here for the batch array
type D1PreparedStatement = ReturnType<D1Database["prepare"]>;
