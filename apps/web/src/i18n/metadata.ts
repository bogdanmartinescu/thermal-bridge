import type { Metadata } from "next";
import type { Locale } from "./config";
import { SITE_URL } from "./config";
import { landingCopy } from "./landing";

export function landingMetadata(locale: Locale): Metadata {
  const copy = landingCopy(locale);
  const path = locale === "en" ? "/en" : "/";
  const ogLocale = locale === "en" ? "en_US" : "ro_RO";

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    keywords: [
      "thermal label software",
      "etichete termice",
      "Marklife X4",
      "Phomemo M110",
      "TSPL",
      "barcode label printer",
      "AWB",
      locale === "ro" ? "software imprimantă termică" : "thermal printer app",
    ],
    alternates: {
      canonical: path,
      languages: {
        ro: "/",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      title: copy.meta.ogTitle,
      description: copy.meta.ogDescription,
      url: `${SITE_URL}${path}`,
      siteName: "ThermalBridge",
      locale: ogLocale,
      alternateLocale: locale === "en" ? ["ro_RO"] : ["en_US"],
      type: "website",
      images: [
        {
          url: "/screenshot.png",
          width: 1800,
          height: 1020,
          alt: copy.hero.screenshotAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.meta.ogTitle,
      description: copy.meta.ogDescription,
      images: ["/screenshot.png"],
    },
  };
}
