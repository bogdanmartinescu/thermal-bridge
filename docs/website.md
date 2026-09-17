# ThermalBridge website

The ThermalBridge website is a Romanian-language **Next.js 16** app at `apps/web`, deployed on **Cloudflare Workers** via [@opennextjs/cloudflare](https://github.com/opennextjs/cloudflare). It serves as both the product landing page and an e-commerce store (printer catalog, cart, COD checkout).

---

## Architecture

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Hosting | Cloudflare Workers |
| Adapter | @opennextjs/cloudflare 1.20.6 |
| Styling | Tailwind CSS 4 (same ink/accent tokens as the desktop app) |
| Database | Cloudflare D1 (orders + order_items) |
| Email | Cloudflare Email Service (send_email binding) |
| Cart | React context + localStorage (client-side) |

---

## First-time setup (one-time, per Cloudflare account)

### 1. Create the D1 database

```bash
cd apps/web
npx wrangler d1 create thermalbridge-orders
```

Copy the `database_id` from the output and paste it into `apps/web/wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "thermalbridge-orders",
    "database_id": "<PASTE_YOUR_ID_HERE>",   // ← replace this
    "migrations_dir": "./migrations"
  }
],
```

### 2. Apply the D1 schema

```bash
npx wrangler d1 migrations apply thermalbridge-orders --remote
```

### 3. Enable Email Sending

```bash
npx wrangler email sending enable mlb.ro
```

This requires that you own and control `mlb.ro`. Follow the Cloudflare dashboard instructions to add the required **SPF, DKIM, and DMARC DNS records** on that domain. Without these records, emails will not send.

### 4. Regenerate Cloudflare env types (after any binding change)

```bash
npx wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts
```

---

## Deployment: Cloudflare Workers Builds (recommended)

1. Go to **Cloudflare Dashboard → Workers & Pages → Create → Connect to Git**.
2. Choose the `marklife-x4-desktop-app` GitHub repo.
3. Set **Build root** to `apps/web`.
4. Set **Build command** to `npm run build` (this runs `opennextjs-cloudflare build`).
5. Set **Deploy command** to `npm run deploy`.
6. Add the `DB` and `EMAIL` bindings in the Worker settings.

Push to `master` triggers an automatic deploy.

### CLI fallback

```bash
cd apps/web
pnpm build      # runs next build + opennextjs-cloudflare build
pnpm deploy     # uploads to Cloudflare
```

### Local dev

```bash
cd apps/web
pnpm dev        # Next.js dev server on http://localhost:3000
```

> Note: `pnpm preview` (Cloudflare Workers runtime preview) requires `workerd` to be built. Run `pnpm approve-builds` in `apps/web` and select `workerd`.

---

## Updating download links

`scripts/update-downloads.mjs` fetches GitHub Releases and writes `apps/web/src/data/downloads.json` (consumed by the Next.js landing page). It also updates `web/index.html` if that file still exists.

Run manually:

```bash
GITHUB_TOKEN=ghp_... pnpm site:downloads
```

Or automatically: the **`.github/workflows/site.yml`** workflow triggers on every published GitHub Release and commits the updated `downloads.json`.

---

## Catalog and stock

`apps/web/src/data/printers.ts` is the single source of truth for the printer catalog. Edit it to:

- Set real selling prices (in **bani**, e.g. `129900` = 1.299,00 RON)
- Update stock counts when new units arrive
- Replace `/placeholder-printer.png` with real product photos placed in `apps/web/public/`

Stock availability shown on the site is **derived** at request time:

```
available(slug) = printers[slug].stock - SUM(order_items.qty WHERE slug AND order.status != 'anulata')
```

This prevents overselling without requiring the catalog file to be mutated.

---

## Legal (required before going live)

`/termeni` and `/confidentialitate` are scaffolded with placeholders. Before launch:

- Have a Romanian lawyer review both documents.
- Fill in the missing sections (standard withdrawal model form, specific warranty terms, full sub-processor list).
- Add a cookie consent banner if you add analytics.

---

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXTJS_ENV` | `.dev.vars` | Local dev indicator |
| `DB` | Wrangler binding | D1 database |
| `EMAIL` | Wrangler binding | Email Service |
| `ASSETS` | Wrangler binding | Static assets |
| `WORKER_SELF_REFERENCE` | Wrangler binding | Self-service dispatch |

---

## Running tests

```bash
# From repo root
pnpm test

# From apps/web only
cd apps/web && pnpm test
```

Tests cover: money formatting, order number generation, order Zod schema (including Romanian phone/postal code shapes), cart totals, and quantity clamping.
