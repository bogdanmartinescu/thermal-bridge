"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { localeFromPathname } from "@/i18n/config";

/** Keeps <html lang> in sync after client navigation. */
export function HtmlLang() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = localeFromPathname(pathname);
  }, [pathname]);

  return null;
}
