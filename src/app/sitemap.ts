import type { MetadataRoute } from "next";
import { locales, localeMeta } from "@/i18n/config";
import { categorySlugs, featureSlugs } from "@/content/site";
import { siteUrl } from "@/lib/site";

// Sign-in and draft legal pages are intentionally excluded (they are noindex).
const paths = ["", "/features", "/solutions", "/pricing", "/how-it-works", "/about", "/resources", "/contact", "/get-started", ...featureSlugs.map((s) => `/features/${s}`), ...categorySlugs.map((s) => `/solutions/${s}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, `${siteUrl}/${l}${path}`])) },
    })),
  );
}
