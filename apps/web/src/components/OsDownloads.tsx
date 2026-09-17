"use client";

import { useEffect, useState } from "react";

export interface DownloadEntry {
  url: string;
  version: string;
  size: string;
}

export interface Downloads {
  macArm64: DownloadEntry | null;
  macX64: DownloadEntry | null;
  winX64: DownloadEntry | null;
  linux: DownloadEntry | null;
}

type PlatformKey = "mac-arm64" | "mac-x64" | "win-x64" | "linux";

function detectPlatform(): PlatformKey | null {
  const ua = navigator.userAgent;
  const platform = navigator.platform ?? "";
  const isLinux = /Linux/.test(platform) && !/Android/.test(ua);
  const isWin = /Win/.test(platform);
  const isMac = /Mac/.test(platform);
  const isArm =
    /arm|aarch64/i.test(ua) ||
    (isMac && /Apple M/.test(ua));

  if (isWin) return "win-x64";
  if (isLinux) return "linux";
  if (isMac && isArm) return "mac-arm64";
  if (isMac) return "mac-x64";
  return null;
}

const PLATFORM_LABELS: Record<PlatformKey, string> = {
  "mac-arm64": "Descarcă pentru macOS",
  "mac-x64": "Descarcă pentru macOS",
  "win-x64": "Descarcă pentru Windows",
  linux: "Descarcă pentru Linux",
};

function DownloadCard({
  platform,
  label,
  subLabel,
  entry,
  highlighted,
  icon,
}: {
  platform: PlatformKey;
  label: string;
  subLabel: string;
  entry: DownloadEntry | null;
  highlighted: boolean;
  icon: React.ReactNode;
}) {
  const disabled = entry === null;

  const className = [
    "flex items-center gap-4 rounded-xl border p-4 transition-all",
    disabled
      ? "cursor-not-allowed border-white/5 opacity-40"
      : highlighted
        ? "border-accent-500/60 bg-accent-900/20 hover:bg-accent-900/30"
        : "border-white/8 bg-ink-800/40 hover:bg-ink-800/70",
  ].join(" ");

  const inner = (
    <>
      <div className="text-ink-300 text-3xl">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-ink-100">{label}</div>
        <div className="text-sm text-ink-400">{subLabel}</div>
      </div>
      {disabled ? (
        <span className="shrink-0 rounded-full bg-ink-700 px-2.5 py-0.5 text-xs text-ink-400">
          În curând
        </span>
      ) : (
        <div className="shrink-0 text-right text-xs text-ink-400">
          <div className="font-medium text-ink-200">{entry.version}</div>
          <div>{entry.size}</div>
        </div>
      )}
      {!disabled && (
        <svg
          className="shrink-0 text-ink-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )}
    </>
  );

  if (disabled) {
    return (
      <div className={className} aria-label={`${label} — indisponibil`}>
        {inner}
      </div>
    );
  }

  return (
    <a
      href={entry.url}
      className={className}
      data-platform={platform}
      aria-label={`${label} ${entry.version}`}
    >
      {inner}
    </a>
  );
}

const MacIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-7 w-7">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const WinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-7 w-7">
    <path d="M3 5.557L9.938 4.57 9.94 11.28H3.004L3 5.557zm6.937 6.44l.005 6.716L3.004 17.73 3 12.005l6.937-.008zm.683-8.547L20.002 2v9.246h-9.382V3.45zm9.384 8.764v9.232L10.62 20.55l-.014-8.35 9.398.014z" />
  </svg>
);

const LinuxIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-7 w-7">
    <path d="M12.504 0c-.155 0-.315.008-.48.021C7.37.284 5.48 3.14 5.48 6.388c0 1.524.425 3.234 1.47 4.793-.46 1.19-.76 2.34-.76 3.18 0 .57.11 1.01.33 1.29.21.27.52.4.88.4.4 0 .77-.16 1.1-.4.48.69 1.14 1.23 1.9 1.62a8.37 8.37 0 003.68.84c1.28 0 2.5-.28 3.56-.84.76-.39 1.42-.93 1.9-1.62.33.24.7.4 1.1.4.36 0 .67-.13.88-.4.22-.28.33-.72.33-1.29 0-.84-.3-1.99-.76-3.18 1.045-1.56 1.47-3.27 1.47-4.793C18.524 3.14 16.63.284 12.504.021 12.34.008 12.18 0 12.02 0h.484z" />
  </svg>
);

export function OsDownloads({ downloads }: { downloads: Downloads }) {
  const [detected, setDetected] = useState<PlatformKey | null>(null);

  useEffect(() => {
    setDetected(detectPlatform());
  }, []);

  return (
    <>
      {/* Hero CTA */}
      {detected && (
        <div className="mt-6">
          {(() => {
            const entryMap: Record<PlatformKey, DownloadEntry | null> = {
              "mac-arm64": downloads.macArm64,
              "mac-x64": downloads.macX64,
              "win-x64": downloads.winX64,
              linux: downloads.linux,
            };
            const entry = entryMap[detected];
            if (!entry) return null;
            return (
              <a
                href={entry.url}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-semibold text-ink-950 hover:bg-accent-600 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {PLATFORM_LABELS[detected]}
              </a>
            );
          })()}
        </div>
      )}

      {/* Download grid */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <DownloadCard
          platform="mac-arm64"
          label="macOS (Apple Silicon)"
          subLabel=".dmg — Apple M-series"
          entry={downloads.macArm64}
          highlighted={detected === "mac-arm64"}
          icon={<MacIcon />}
        />
        <DownloadCard
          platform="mac-x64"
          label="macOS (Intel)"
          subLabel=".dmg — Intel x64"
          entry={downloads.macX64}
          highlighted={detected === "mac-x64"}
          icon={<MacIcon />}
        />
        <DownloadCard
          platform="win-x64"
          label="Windows"
          subLabel=".exe — NSIS installer, x64"
          entry={downloads.winX64}
          highlighted={detected === "win-x64"}
          icon={<WinIcon />}
        />
        <DownloadCard
          platform="linux"
          label="Linux"
          subLabel=".AppImage · .deb — x86_64"
          entry={downloads.linux}
          highlighted={detected === "linux"}
          icon={<LinuxIcon />}
        />
      </div>

      <p className="mt-4 text-xs text-ink-500">
        Toate versiunile și checksum-urile sunt disponibile pe{" "}
        <a
          href="https://github.com/bogdanmartinescu/thermal-bridge/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink-300"
        >
          pagina GitHub Releases
        </a>
        . Build-uri nesemnate — code-signing este în curs de implementare.
      </p>
    </>
  );
}
