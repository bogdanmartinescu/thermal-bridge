"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { homePath, localeFromPathname } from "@/i18n/config";
import { landingCopy } from "@/i18n/landing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Footer() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const t = landingCopy(locale);
  const home = homePath(locale);

  return (
    <footer className="border-t border-white/5 bg-ink-950 text-ink-400">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold text-ink-100">
              <img src="/logo.png" alt="ThermalBridge" className="h-7 w-7 rounded-lg" />
              ThermalBridge
            </div>
            <address className="not-italic text-sm leading-relaxed">
              <strong className="text-ink-300">MLB Digital Commerce SRL</strong>
              <br />
              CUI: 50914870
              <br />
              Calea Moșilor nr. 88, București
              <br />
              <a href="mailto:hi@mlb.ro" className="hover:text-ink-200 transition-colors">
                hi@mlb.ro
              </a>{" "}
              ·{" "}
              <a
                href="https://www.mlb.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-200 transition-colors"
              >
                www.mlb.ro
              </a>
            </address>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-ink-300">{t.footer.app}</span>
              <Link href={`${home}#${t.ids.features}`} className="hover:text-ink-200 transition-colors">
                {t.footer.features}
              </Link>
              <Link href={`${home}#${t.ids.printers}`} className="hover:text-ink-200 transition-colors">
                {t.footer.printers}
              </Link>
              <Link href={`${home}#${t.ids.downloads}`} className="hover:text-ink-200 transition-colors">
                {t.footer.downloads}
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-ink-300">{t.footer.shop}</span>
              <Link href="/imprimante" className="hover:text-ink-200 transition-colors">
                {t.footer.shopPrinters}
              </Link>
              <Link href="/cos" className="hover:text-ink-200 transition-colors">
                {t.footer.cart}
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-ink-300">{t.footer.legal}</span>
              <Link href="/termeni" className="hover:text-ink-200 transition-colors">
                {t.footer.terms}
              </Link>
              <Link href="/confidentialitate" className="hover:text-ink-200 transition-colors">
                {t.footer.privacy}
              </Link>
              <a
                href="https://anpc.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-200 transition-colors"
              >
                ANPC
              </a>
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-200 transition-colors"
              >
                SOL (UE)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/5 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.copy}</p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
