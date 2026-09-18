import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: { ro: SITE_URL, en: `${SITE_URL}/en` } },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: { ro: SITE_URL, en: `${SITE_URL}/en` } },
    },
    { url: `${SITE_URL}/imprimante`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/termeni`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    {
      url: `${SITE_URL}/confidentialitate`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
