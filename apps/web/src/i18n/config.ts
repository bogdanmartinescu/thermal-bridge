export const LOCALES = ["ro", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ro";

/** Canonical origin used in sitemap, hreflang and Open Graph. */
export const SITE_URL = "https://thermalbridge.mlb.ro";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ro";
}

export function homePath(locale: Locale): string {
  return locale === "en" ? "/en" : "/";
}

export function localizedUrl(locale: Locale, path = ""): string {
  const prefix = homePath(locale);
  if (!path) return prefix;
  return prefix === "/" ? path : `${prefix}${path}`;
}
