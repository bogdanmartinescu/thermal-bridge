# Website

The ThermalBridge landing page lives in `web/` and is hosted on Vercel.

## Structure

```
web/
  index.html        Static page — hero, features, printers, downloads, footer
  styles.css        Hand-written CSS using the same design tokens as the desktop app
  vercel.json       Cache headers, security headers, cleanUrls
  assets/
    logo.png        Copied from apps/desktop/resources/icon.png
    banner.jpg      Copied from docs/banner.jpg  (og:image)
    favicon.png     Same as logo.png
```

No build step. Vercel serves the files as-is.

## Vercel setup (one-time)

1. Go to [vercel.com/new](https://vercel.com/new) → **Import Git repository** → select `bogdanmartinescu/thermal-bridge`.
2. Set **Root Directory** to `web`.
3. Set **Framework Preset** to *Other*.
4. Leave **Build Command** empty.
5. Set **Output Directory** to `.` (a single dot).
6. Click **Deploy**. Vercel ignores the pnpm monorepo at the root.

After the first deploy, every push to `master` that touches `web/` will trigger a new Vercel build automatically.

Custom domain: add it under **Settings → Domains** in the Vercel project dashboard.

## Updating download links

Download links in `web/index.html` are maintained inside a fenced block:

```html
<!-- downloads:start -->
… generated cards …
<!-- downloads:end -->
```

The script `scripts/update-downloads.mjs` fetches all GitHub releases and rewrites this block. It resolves each platform (macOS Apple Silicon, macOS Intel, Windows, Linux) **independently** to the newest release that actually contains a matching asset. This means a partial release (e.g. Linux missing from `v1.2.3`) never breaks the page — it falls back to the last release that did include Linux.

### Automatic (recommended)

`.github/workflows/site.yml` triggers on `release: [published]` and re-runs the script, committing `web/index.html` when it changes. Vercel picks up the commit and deploys.

### Manual run

```bash
# Without a token (public repo, 60 req/h limit)
pnpm site:downloads

# With a token (higher rate limit)
GITHUB_TOKEN=ghp_... pnpm site:downloads
```

### Platform fallback behaviour

| Platform | Asset pattern | Current state |
|---|---|---|
| macOS Apple Silicon | `*-mac-arm64.dmg` | ✅ Resolved from latest release |
| macOS Intel | `*-mac-x64.dmg` | ⬜ Never published — card shows "Coming soon" |
| Windows | `*-win-x64.exe` | ✅ Resolved from latest release |
| Linux | `*-linux-x86_64.AppImage` | ✅ Falls back to previous release when missing |

The Intel Mac build is produced by the `macos-13` matrix entry in `.github/workflows/release.yml`. Once it publishes an asset matching `*-mac-x64.dmg`, the card will appear automatically on the next `pnpm site:downloads` run.

## Screenshot slot

The hero section contains a placeholder:

```html
<!-- To add a screenshot: replace the entire .hero-screenshot-slot div with:
     <img src="assets/screenshot.png" alt="ThermalBridge — label editor"
          style="width:100%;display:block;border-radius:var(--radius)"> -->
```

Add `web/assets/screenshot.png` (16:9, ≥1800px wide) and swap the div.

## Local preview

```bash
npx serve web
```

Open http://localhost:3000. Check:

- Hero CTA is labelled for your OS
- Your platform's download card is highlighted
- Intel Mac card is disabled with "Coming soon"
- Mobile layout at 375px width (use browser DevTools)
