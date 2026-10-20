import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Galada, Hind_Siliguri, Manrope, Nothing_You_Could_Do, Tiro_Bangla } from "next/font/google";
import "../globals.css";
import { isLocale, locales, localeMeta } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/client";
import { contactInfo, siteUrl } from "@/lib/site";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InkDefs } from "@/components/illustrations/InkDefs";
import { MotionProvider } from "@/components/ui/MotionProvider";

const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-hind", display: "swap" });
const tiro = Tiro_Bangla({ subsets: ["bengali", "latin"], weight: "400", style: ["normal"], variable: "--font-tiro", display: "swap" });
const galada = Galada({ subsets: ["bengali", "latin"], weight: "400", variable: "--font-galada", display: "swap" });
// Pen handwriting for the sample prescription only; not preloaded.
const scrawl = Nothing_You_Could_Do({ subsets: ["latin"], weight: "400", variable: "--font-scrawl", display: "swap", preload: false });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#f7f2e7",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.defaultTitle, template: t.meta.titleTemplate },
    description: t.meta.defaultDescription,
    applicationName: "HelloKhata",
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HelloKhata",
    url: siteUrl,
    description: t.meta.defaultDescription,
    email: contactInfo.email.display,
    telephone: "+8801734114388",
    address: {
      "@type": "PostalAddress",
      streetAddress: "38 Shah Makhdum Avenue, Sector 13, Uttara",
      addressLocality: "Dhaka",
      postalCode: "1230",
      addressCountry: "BD",
    },
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer support", telephone: "+8801734114388", email: contactInfo.email.display, availableLanguage: ["bn", "en"] },
      { "@type": "ContactPoint", contactType: "customer support", telephone: "+8801922557436", name: "WhatsApp", availableLanguage: ["bn", "en"] },
    ],
  };

  return (
    <html lang={localeMeta[locale].htmlLang} className={`${hind.variable} ${tiro.variable} ${galada.variable} ${scrawl.variable} ${manrope.variable}`}>
      <body className="paper min-h-dvh">
        <I18nProvider locale={locale} dict={t}>
          <MotionProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-cream"
            >
              {t.common.skipToContent}
            </a>
            <InkDefs />
            <SiteNav />
            <main id="main">{children}</main>
            <SiteFooter locale={locale} />
          </MotionProvider>
        </I18nProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
