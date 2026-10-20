import type { Metadata } from "next";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { siteUrl } from "./site";

/** Build per-page metadata with canonical URL, hreflang alternates and Open Graph. */
export function pageMetadata(locale: Locale, path: string, title?: string, description?: string): Metadata {
  const t = getDict(locale);
  const clean = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeMeta[l].htmlLang] = `${siteUrl}/${l}${clean}`;
  languages["x-default"] = `${siteUrl}/bn${clean}`;
  const desc = description ?? t.meta.defaultDescription;

  return {
    title: title ?? { absolute: t.meta.defaultTitle },
    description: desc,
    alternates: { canonical: `${siteUrl}/${locale}${clean}`, languages },
    openGraph: {
      type: "website",
      siteName: t.meta.siteName,
      title: title ? `${title} · HelloKhata` : t.meta.defaultTitle,
      description: desc,
      url: `${siteUrl}/${locale}${clean}`,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].ogLocale),
      images: [{ url: `${siteUrl}/${locale}/opengraph-image`, width: 1200, height: 630, alt: t.meta.defaultTitle }],
    },
    twitter: { card: "summary_large_image", title: title ?? t.meta.defaultTitle, description: desc, images: [`${siteUrl}/${locale}/opengraph-image`] },
  };
}
