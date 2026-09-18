"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { homePath, localeFromPathname, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-white/10 p-0.5 text-xs font-medium"
      role="navigation"
      aria-label="Language"
    >
      <LangLink locale="ro" current={locale}>
        RO
      </LangLink>
      <LangLink locale="en" current={locale}>
        EN
      </LangLink>
    </div>
  );
}

function LangLink({
  locale,
  current,
  children,
}: {
  locale: Locale;
  current: Locale;
  children: string;
}) {
  const active = locale === current;
  return (
    <Link
      href={homePath(locale)}
      hrefLang={locale}
      lang={locale}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "rounded-md bg-ink-700 px-2 py-1 text-ink-50"
          : "rounded-md px-2 py-1 text-ink-400 hover:text-ink-100 transition-colors"
      }
    >
      {children}
    </Link>
  );
}
