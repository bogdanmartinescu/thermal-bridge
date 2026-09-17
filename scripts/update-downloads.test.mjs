/**
 * update-downloads.test.mjs
 *
 * Run with: node --test scripts/update-downloads.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveDownloads, formatSize, renderDownloads, serializeDownloads } from './update-downloads.mjs';

// ─── Fixtures ────────────────────────────────────────────────────────────────

// Mirrors the real state at the time of writing:
//   v1.2.3 — mac-arm64, win-x64 only (Linux missing, Intel Mac never released)
//   v1.2.2 — mac-arm64, win-x64, linux AppImage + deb
/** @type {import('./update-downloads.mjs').RawRelease[]} */
const RELEASES = [
  {
    tag_name: 'v1.2.3',
    assets: [
      { name: 'ThermalBridge-1.2.3-mac-arm64.dmg',         browser_download_url: 'https://example.com/v1.2.3/mac-arm64.dmg', size: 147_825_529 },
      { name: 'ThermalBridge-1.2.3-mac-arm64.dmg.blockmap', browser_download_url: 'https://example.com/v1.2.3/mac-arm64.dmg.blockmap', size: 152_994 },
      { name: 'ThermalBridge-1.2.3-mac-arm64.zip',          browser_download_url: 'https://example.com/v1.2.3/mac-arm64.zip', size: 146_980_380 },
      { name: 'ThermalBridge-1.2.3-win-x64.exe',            browser_download_url: 'https://example.com/v1.2.3/win-x64.exe',  size: 120_779_371 },
      { name: 'ThermalBridge-1.2.3-win-x64.exe.blockmap',   browser_download_url: 'https://example.com/v1.2.3/win-x64.exe.blockmap', size: 127_661 },
      { name: 'latest-mac.yml',                              browser_download_url: 'https://example.com/v1.2.3/latest-mac.yml', size: 527 },
      { name: 'latest.yml',                                  browser_download_url: 'https://example.com/v1.2.3/latest.yml',    size: 359 },
    ],
  },
  {
    tag_name: 'v1.2.2',
    assets: [
      { name: 'ThermalBridge-1.2.2-mac-arm64.dmg',            browser_download_url: 'https://example.com/v1.2.2/mac-arm64.dmg', size: 146_000_000 },
      { name: 'ThermalBridge-1.2.2-win-x64.exe',              browser_download_url: 'https://example.com/v1.2.2/win-x64.exe',  size: 118_000_000 },
      { name: 'ThermalBridge-1.2.2-linux-x86_64.AppImage',    browser_download_url: 'https://example.com/v1.2.2/linux.AppImage', size: 188_000_000 },
      { name: 'ThermalBridge-1.2.2-linux-amd64.deb',          browser_download_url: 'https://example.com/v1.2.2/linux.deb',    size: 60_000_000 },
      { name: 'ThermalBridge-1.2.2-mac-arm64.zip',            browser_download_url: 'https://example.com/v1.2.2/mac-arm64.zip', size: 145_000_000 },
    ],
  },
];

// ─── resolveDownloads ────────────────────────────────────────────────────────

describe('resolveDownloads', () => {
  it('resolves mac-arm64 to v1.2.3 (newest release with that asset)', () => {
    const result = resolveDownloads(RELEASES);
    assert.equal(result['mac-arm64'].version, '1.2.3');
    assert.ok(result['mac-arm64'].url.includes('1.2.3'));
    assert.equal(result['mac-arm64'].sizeBytes, 147_825_529);
  });

  it('resolves win-x64 to v1.2.3', () => {
    const result = resolveDownloads(RELEASES);
    assert.equal(result['win-x64'].version, '1.2.3');
    assert.ok(result['win-x64'].url.includes('1.2.3'));
  });

  it('falls back to v1.2.2 for linux (missing in v1.2.3)', () => {
    const result = resolveDownloads(RELEASES);
    assert.ok(result['linux'] !== null, 'linux should be resolved from v1.2.2');
    assert.equal(result['linux'].version, '1.2.2');
    assert.ok(result['linux'].url.includes('AppImage'));
  });

  it('includes debUrl for linux', () => {
    const result = resolveDownloads(RELEASES);
    assert.ok(result['linux'].debUrl, 'linux should have a debUrl');
    assert.ok(result['linux'].debUrl.includes('.deb'));
  });

  it('returns null for mac-x64 (never published)', () => {
    const result = resolveDownloads(RELEASES);
    assert.equal(result['mac-x64'], null);
  });

  it('handles an empty releases array without throwing', () => {
    const result = resolveDownloads([]);
    assert.equal(result['mac-arm64'], null);
    assert.equal(result['linux'], null);
  });

  it('handles a release with no assets without throwing', () => {
    const result = resolveDownloads([{ tag_name: 'v9.9.9', assets: [] }]);
    assert.equal(result['mac-arm64'], null);
  });

  it('returns the highest-versioned release for each platform (order matters)', () => {
    // Reversed order should produce different results
    const reversed = [...RELEASES].reverse();
    const result = resolveDownloads(reversed);
    // v1.2.2 comes first, so mac-arm64 should resolve to 1.2.2
    assert.equal(result['mac-arm64'].version, '1.2.2');
    // linux is also in v1.2.2 and comes first
    assert.equal(result['linux'].version, '1.2.2');
  });

  it('strips the v prefix from tag names', () => {
    const result = resolveDownloads(RELEASES);
    assert.ok(!result['mac-arm64'].version.startsWith('v'));
  });
});

// ─── formatSize ─────────────────────────────────────────────────────────────

describe('formatSize', () => {
  it('formats 147825529 bytes as "141 MB"', () => {
    assert.equal(formatSize(147_825_529), '141 MB');
  });

  it('formats 120779371 bytes as "115 MB"', () => {
    assert.equal(formatSize(120_779_371), '115 MB');
  });

  it('formats 188000000 bytes as "179 MB"', () => {
    assert.equal(formatSize(188_000_000), '179 MB');
  });

  it('rounds to nearest whole MB', () => {
    const result = formatSize(1_500_000);
    assert.match(result, /^\d+ MB$/);
  });
});

// ─── renderDownloads ────────────────────────────────────────────────────────

const SAMPLE_HTML = `<html>
<!-- downloads:start -->
<div class="download-grid">
  <a class="dl-card" data-platform="mac-arm64" href="OLD">OLD</a>
</div>
<!-- downloads:end -->
</html>`;

describe('renderDownloads', () => {
  it('replaces the downloads block', () => {
    const downloads = resolveDownloads(RELEASES);
    const result = renderDownloads(SAMPLE_HTML, downloads);
    assert.ok(result.includes('<!-- downloads:start -->'));
    assert.ok(result.includes('<!-- downloads:end -->'));
    assert.ok(!result.includes('>OLD<'), 'old content should be replaced');
  });

  it('includes version badge for mac-arm64', () => {
    const downloads = resolveDownloads(RELEASES);
    const result = renderDownloads(SAMPLE_HTML, downloads);
    assert.ok(result.includes('v1.2.3'));
  });

  it('renders mac-x64 as disabled with "Coming soon"', () => {
    const downloads = resolveDownloads(RELEASES);
    const result = renderDownloads(SAMPLE_HTML, downloads);
    assert.ok(result.includes('dl-disabled'));
    assert.ok(result.includes('Coming soon'));
  });

  it('includes linux download link from v1.2.2', () => {
    const downloads = resolveDownloads(RELEASES);
    const result = renderDownloads(SAMPLE_HTML, downloads);
    assert.ok(result.includes('AppImage'));
  });

  it('is idempotent — running twice produces identical output', () => {
    const downloads = resolveDownloads(RELEASES);
    const first  = renderDownloads(SAMPLE_HTML, downloads);
    const second = renderDownloads(first, downloads);
    assert.equal(first, second);
  });

  it('leaves content outside the marker block unchanged', () => {
    const downloads = resolveDownloads(RELEASES);
    const result = renderDownloads(SAMPLE_HTML, downloads);
    assert.ok(result.startsWith('<html>'));
    assert.ok(result.endsWith('</html>'));
  });
});

// ─── serializeDownloads ─────────────────────────────────────────────────────

describe('serializeDownloads', () => {
  it('produces valid JSON', () => {
    const downloads = resolveDownloads(RELEASES);
    const json = serializeDownloads(downloads);
    assert.doesNotThrow(() => JSON.parse(json));
  });

  it('sets mac-x64 to null (never published)', () => {
    const downloads = resolveDownloads(RELEASES);
    const parsed = JSON.parse(serializeDownloads(downloads));
    assert.equal(parsed.macX64, null);
  });

  it('includes v prefix in version string', () => {
    const downloads = resolveDownloads(RELEASES);
    const parsed = JSON.parse(serializeDownloads(downloads));
    assert.ok(parsed.macArm64.version.startsWith('v'));
  });

  it('sets linux url to the AppImage from v1.2.2', () => {
    const downloads = resolveDownloads(RELEASES);
    const parsed = JSON.parse(serializeDownloads(downloads));
    assert.ok(parsed.linux !== null);
    assert.ok(parsed.linux.url.includes('AppImage'));
    assert.equal(parsed.linux.version, 'v1.2.2');
  });

  it('formats size as MB string', () => {
    const downloads = resolveDownloads(RELEASES);
    const parsed = JSON.parse(serializeDownloads(downloads));
    assert.match(parsed.macArm64.size, /^\d+ MB$/);
  });

  it('is idempotent — serializing twice yields same JSON', () => {
    const downloads = resolveDownloads(RELEASES);
    assert.equal(serializeDownloads(downloads), serializeDownloads(downloads));
  });
});
