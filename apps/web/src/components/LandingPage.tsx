import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { homePath } from "@/i18n/config";
import { landingCopy } from "@/i18n/landing";
import downloadsData from "@/data/downloads.json";
import { OsDownloads } from "@/components/OsDownloads";
import { LandingJsonLd } from "@/components/LandingJsonLd";

export function LandingPage({ locale }: { locale: Locale }) {
  const t = landingCopy(locale);
  const home = homePath(locale);

  return (
    <>
      <LandingJsonLd locale={locale} />

      <section className="bg-ink-950 pb-20 pt-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <img
            src="/logo.png"
            alt="ThermalBridge"
            className="mx-auto mb-6 h-20 w-20 rounded-2xl shadow-lg"
            width={80}
            height={80}
          />
          <p className="mb-4 inline-block rounded-full bg-accent-900/60 px-3 py-1 text-xs font-medium text-accent-500">
            {t.hero.eyebrow}
          </p>
          <h1 className="mb-5 text-4xl font-bold tracking-tight text-ink-50 sm:text-5xl">
            {t.hero.h1Lead}{" "}
            <span className="text-accent-500">{t.hero.h1Highlight}</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-ink-300">
            {t.hero.lead}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`${home}#${t.ids.downloads}`}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-semibold text-ink-950 hover:bg-accent-600 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {t.hero.ctaDownload}
            </Link>
            <Link
              href={`${home}#${t.ids.features}`}
              className="rounded-xl border border-white/10 px-6 py-3 font-medium text-ink-200 hover:bg-ink-800 transition-colors"
            >
              {t.hero.ctaLearn}
            </Link>
          </div>
          <p className="mt-6 text-sm text-ink-500">{t.hero.platforms}</p>
        </div>

        <div className="mx-auto mt-14 w-full max-w-5xl px-6">
          <img
            src="/screenshot.png"
            alt={t.hero.screenshotAlt}
            className="w-full rounded-2xl border border-white/8 shadow-2xl"
            width={1800}
            height={1020}
          />
        </div>
      </section>

      <section
        id={t.ids.features}
        className="border-t border-white/5 bg-ink-900 py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-500">
            {t.features.label}
          </p>
          <h2 className="mb-3 max-w-2xl text-3xl font-bold text-ink-50">
            {t.features.heading}
          </h2>
          <p className="mb-12 max-w-xl text-ink-400">{t.features.sub}</p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.items.map((item, index) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/5 bg-ink-800/40 p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-900/60 text-accent-500">
                  <FeatureIcon index={index} />
                </div>
                <h3 className="mb-2 font-semibold text-ink-100">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-400">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id={t.ids.printers}
        className="border-t border-white/5 bg-ink-950 py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-500">
            {t.printers.label}
          </p>
          <h2 className="mb-3 text-3xl font-bold text-ink-50">
            {t.printers.heading}
          </h2>
          <p className="mb-10 max-w-xl text-ink-400">{t.printers.sub}</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-ink-500">
                  <th className="pb-3 pr-6">{t.printers.colPrinter}</th>
                  <th className="pb-3 pr-6">{t.printers.colStatus}</th>
                  <th className="pb-3 pr-6">{t.printers.colDpi}</th>
                  <th className="pb-3 pr-6">{t.printers.colProtocol}</th>
                  <th className="pb-3">{t.printers.colConnectivity}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-ink-300">
                {t.printers.rows.map((row) => (
                  <tr key={row.name} className="hover:bg-white/2">
                    <td className="py-3 pr-6 font-medium text-ink-100">{row.name}</td>
                    <td className="py-3 pr-6">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.status === "available"
                            ? "bg-success/10 text-success"
                            : "bg-ink-700 text-ink-400"
                        }`}
                      >
                        {row.status === "available" ? "✓ " : ""}
                        {row.status === "available"
                          ? t.printers.available
                          : t.printers.planned}
                      </span>
                    </td>
                    <td className="py-3 pr-6">{row.dpi}</td>
                    <td className="py-3 pr-6">{row.protocol}</td>
                    <td className="py-3 text-ink-400">{row.connectivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-14">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-500">
              {t.transports.label}
            </p>
            <h3 className="mb-3 text-2xl font-bold text-ink-50">
              {t.transports.heading}
            </h3>
            <p className="mb-8 max-w-xl text-ink-400">{t.transports.sub}</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-ink-500">
                    <th className="pb-3 pr-6">{t.transports.colTransport}</th>
                    <th className="pb-3">{t.transports.colDescription}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-ink-300">
                  {t.transports.rows.map((row) => (
                    <tr key={row.name} className="hover:bg-white/2">
                      <td className="whitespace-nowrap py-3 pr-6 font-medium text-ink-100">
                        {row.name}
                      </td>
                      <td className="py-3 text-ink-400">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section
        id={t.ids.faq}
        className="border-t border-white/5 bg-ink-900 py-20"
      >
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-500">
            {t.faq.label}
          </p>
          <h2 className="mb-8 text-3xl font-bold text-ink-50">{t.faq.heading}</h2>
          <dl className="space-y-6">
            {t.faq.items.map((item) => (
              <div key={item.q}>
                <dt className="font-semibold text-ink-100">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-400">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id={t.ids.downloads}
        className="border-t border-white/5 bg-ink-950 py-20"
      >
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-500">
            {t.downloads.label}
          </p>
          <h2 className="mb-3 text-3xl font-bold text-ink-50">
            {t.downloads.heading}
          </h2>
          <p className="text-ink-400">{t.downloads.sub}</p>
          <OsDownloads downloads={downloadsData} locale={locale} />
        </div>
      </section>
    </>
  );
}

function FeatureIcon({ index }: { index: number }) {
  const className = "h-5 w-5";
  switch (index) {
    case 0:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="9" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="2" width="20" height="20" rx="2" /><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      );
  }
}
