/**
 * update-downloads.mjs
 *
 * Fetches the thermal-bridge GitHub releases and rewrites the
 * <!-- downloads:start / downloads:end --> region in web/index.html.
 *
 * Each platform is resolved independently to the newest release that
 * actually contains a matching asset, so a partial release (e.g. v1.2.3
 * missing Linux) never breaks the site.
 *
 * Usage:
 *   node scripts/update-downloads.mjs
 *   GITHUB_TOKEN=ghp_... node scripts/update-downloads.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const HTML_PATH = join(root, 'web', 'index.html');
const JSON_PATH = join(root, 'apps', 'web', 'src', 'data', 'downloads.json');

const OWNER = 'bogdanmartinescu';
const REPO  = 'thermal-bridge';

// ─── Platform definitions ───────────────────────────────────────────────────

/**
 * @returns {Record<string, { pattern: RegExp; debPattern?: RegExp; label: string; type: string; icon: string; osKey: string }>}
 */
export function assetPatterns() {
  const appleIcon = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>`;
  const winIcon   = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5.557L9.938 4.57 9.94 11.28H3.004L3 5.557zm6.937 6.44l.005 6.716L3.004 17.73 3 12.005l6.937-.008zm.683-8.547L20.002 2v9.246h-9.382V3.45zm9.384 8.764v9.232L10.62 20.55l-.014-8.35 9.398.014z"/></svg>`;
  const linuxIcon = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.504 0c-.155 0-.315.008-.48.021C7.37.284 5.48 3.14 5.48 6.388c0 1.524.425 3.234 1.47 4.793-.46 1.19-.76 2.34-.76 3.18 0 .57.11 1.01.33 1.29.21.27.52.4.88.4.4 0 .77-.16 1.1-.4.48.69 1.14 1.23 1.9 1.62a8.37 8.37 0 003.68.84c1.28 0 2.5-.28 3.56-.84.76-.39 1.42-.93 1.9-1.62.33.24.7.4 1.1.4.36 0 .67-.13.88-.4.22-.28.33-.72.33-1.29 0-.84-.3-1.99-.76-3.18 1.045-1.56 1.47-3.27 1.47-4.793C18.524 3.14 16.63.284 12.504.021 12.34.008 12.18 0 12.02 0h.484z"/></svg>`;
  const downloadArrow = `<svg class="dl-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

  return {
    'mac-arm64': {
      pattern: /-mac-arm64\.dmg$/,
      label: 'macOS (Apple Silicon)',
      type: '.dmg — Apple M-series',
      icon: appleIcon,
      arrow: downloadArrow,
    },
    'mac-x64': {
      pattern: /-mac-x64\.dmg$/,
      label: 'macOS (Intel)',
      type: '.dmg — Intel x64',
      icon: appleIcon,
      arrow: downloadArrow,
    },
    'win-x64': {
      pattern: /-win-x64\.exe$/,
      label: 'Windows',
      type: '.exe — NSIS installer, x64',
      icon: winIcon,
      arrow: downloadArrow,
    },
    'linux': {
      pattern: /-linux-x86_64\.AppImage$/,
      debPattern: /-linux-amd64\.deb$/,
      label: 'Linux',
      type: '.AppImage · .deb — x86_64',
      icon: linuxIcon,
      arrow: downloadArrow,
    },
  };
}

// ─── Resolution ─────────────────────────────────────────────────────────────

/**
 * @typedef {{ name: string; browser_download_url: string; size: number }} RawAsset
 * @typedef {{ tag_name: string; assets: RawAsset[] }} RawRelease
 * @typedef {{ url: string; version: string; sizeBytes: number; debUrl?: string }} Resolved
 */

/**
 * Walk releases newest-first; return the best asset per platform.
 *
 * @param {RawRelease[]} releases  Ordered newest-first from the API.
 * @returns {Record<string, Resolved | null>}
 */
export function resolveDownloads(releases) {
  const patterns = assetPatterns();
  /** @type {Record<string, Resolved | null>} */
  const result = {};

  for (const platformKey of Object.keys(patterns)) {
    result[platformKey] = null;
  }

  for (const release of releases) {
    const version = release.tag_name.startsWith('v')
      ? release.tag_name.slice(1)
      : release.tag_name;

    for (const [platformKey, def] of Object.entries(patterns)) {
      if (result[platformKey] !== null) continue; // already found

      const primary = release.assets.find((a) => def.pattern.test(a.name));
      if (!primary) continue;

      /** @type {Resolved} */
      const resolved = {
        url: primary.browser_download_url,
        version,
        sizeBytes: primary.size,
      };

      if (def.debPattern) {
        const deb = release.assets.find((a) => def.debPattern.test(a.name));
        if (deb) resolved.debUrl = deb.browser_download_url;
      }

      result[platformKey] = resolved;
    }

    // Stop early if all platforms are resolved
    if (Object.values(result).every((v) => v !== null)) break;
  }

  return result;
}

// ─── Formatting ─────────────────────────────────────────────────────────────

/**
 * Format a byte count as a human-readable MB string.
 * @param {number} bytes
 * @returns {string}
 */
export function formatSize(bytes) {
  const mb = bytes / (1024 * 1024);
  return `${Math.round(mb)} MB`;
}

// ─── HTML rendering ─────────────────────────────────────────────────────────

/**
 * Re-render the downloads:start/downloads:end block inside `html`.
 *
 * @param {string} html
 * @param {Record<string, Resolved | null>} downloads
 * @returns {string}
 */
export function renderDownloads(html, downloads) {
  const patterns = assetPatterns();
  const cards = Object.entries(patterns).map(([platformKey, def]) => {
    const resolved = downloads[platformKey];
    const disabled = resolved === null;

    if (disabled) {
      return `      <a class="dl-card dl-disabled" data-platform="${platformKey}" href="#downloads" aria-disabled="true">
        <div class="dl-os-icon">${def.icon}</div>
        <div>
          <div class="dl-platform-name">${def.label}</div>
          <div class="dl-package-type">${def.type}</div>
        </div>
        <div class="dl-meta"><span class="dl-soon">Coming soon</span></div>
      </a>`;
    }

    const meta = `<span class="dl-version">v${resolved.version}</span>
          <span class="dl-size">${formatSize(resolved.sizeBytes)}</span>`;

    return `      <a class="dl-card" data-platform="${platformKey}" href="${resolved.url}">
        <div class="dl-os-icon">${def.icon}</div>
        <div>
          <div class="dl-platform-name">${def.label}</div>
          <div class="dl-package-type">${def.type}</div>
        </div>
        <div class="dl-meta">
          ${meta}
        </div>
        ${def.arrow}
      </a>`;
  });

  const block = `    <div class="download-grid">\n${cards.join('\n\n')}\n    </div>`;
  return html.replace(
    /<!-- downloads:start -->[\s\S]*?<!-- downloads:end -->/,
    `<!-- downloads:start -->\n${block}\n    <!-- downloads:end -->`,
  );
}

// ─── JSON serialization ─────────────────────────────────────────────────────

/**
 * Serialize resolved downloads to the JSON schema consumed by apps/web.
 *
 * @param {Record<string, Resolved | null>} downloads
 * @returns {string} JSON string (prettified)
 */
export function serializeDownloads(downloads) {
  const macArm64 = downloads['mac-arm64'];
  const macX64   = downloads['mac-x64'];
  const winX64   = downloads['win-x64'];
  const linux    = downloads['linux'];

  const toEntry = (resolved) =>
    resolved === null
      ? null
      : {
          url: resolved.url,
          version: `v${resolved.version}`,
          size: formatSize(resolved.sizeBytes),
        };

  return JSON.stringify(
    {
      macArm64: toEntry(macArm64),
      macX64:   toEntry(macX64),
      winX64:   toEntry(winX64),
      linux:    toEntry(linux),
    },
    null,
    2,
  ) + '\n';
}

// ─── GitHub API fetch ────────────────────────────────────────────────────────

/**
 * Fetch the latest releases from the GitHub API.
 *
 * @param {string} owner
 * @param {string} repo
 * @param {string | undefined} token
 * @returns {Promise<RawRelease[]>}
 */
export async function fetchReleases(owner, repo, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=20`;
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'thermal-bridge-site-updater',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// ─── CLI entry ───────────────────────────────────────────────────────────────

import { pathToFileURL } from 'node:url';

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const token = process.env.GITHUB_TOKEN;

  process.stdout.write(`Fetching releases from ${OWNER}/${REPO}…\n`);
  const releases = await fetchReleases(OWNER, REPO, token);
  process.stdout.write(`Found ${releases.length} release(s).\n`);

  const downloads = resolveDownloads(releases);

  for (const [platform, resolved] of Object.entries(downloads)) {
    if (resolved) {
      process.stdout.write(`  ${platform}: v${resolved.version} (${formatSize(resolved.sizeBytes)})\n`);
    } else {
      process.stdout.write(`  ${platform}: no asset found\n`);
    }
  }

  // Update web/index.html (legacy — kept while the static site exists)
  try {
    const html = readFileSync(HTML_PATH, 'utf8');
    const updated = renderDownloads(html, downloads);
    if (updated === html) {
      process.stdout.write('No changes to web/index.html.\n');
    } else {
      writeFileSync(HTML_PATH, updated, 'utf8');
      process.stdout.write('Updated web/index.html.\n');
    }
  } catch (err) {
    if (/** @type {any} */(err).code === 'ENOENT') {
      process.stdout.write('web/index.html not found — skipping HTML update.\n');
    } else {
      throw err;
    }
  }

  // Update apps/web/src/data/downloads.json (Next.js site)
  const json = serializeDownloads(downloads);
  let existingJson = null;
  try {
    existingJson = readFileSync(JSON_PATH, 'utf8');
  } catch { /* file may not exist yet */ }
  if (json === existingJson) {
    process.stdout.write('No changes to apps/web/src/data/downloads.json.\n');
  } else {
    writeFileSync(JSON_PATH, json, 'utf8');
    process.stdout.write('Updated apps/web/src/data/downloads.json.\n');
  }
}
