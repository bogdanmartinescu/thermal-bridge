import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/i18n/config";
import { landingCopy } from "@/i18n/landing";

export function LandingJsonLd({ locale }: { locale: Locale }) {
  const copy = landingCopy(locale);
  const url = locale === "en" ? `${SITE_URL}/en` : SITE_URL;

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ThermalBridge",
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "macOS, Windows, Linux",
    description: copy.meta.description,
    image: `${SITE_URL}/screenshot.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RON",
    },
    publisher: {
      "@type": "Organization",
      name: "MLB Digital Commerce SRL",
      url: "https://www.mlb.ro",
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
