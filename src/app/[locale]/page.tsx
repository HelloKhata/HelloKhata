import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { categorySlugs, type CategorySlug } from "@/content/site";
import { Hero } from "@/components/home/Hero";
import { Pillars } from "@/components/home/Pillars";
import { LedgerTransform } from "@/components/home/LedgerTransform";
import { ProductDemo } from "@/components/home/ProductDemo";
import { VoiceDemo } from "@/components/home/VoiceDemo";
import { FeatureSystem } from "@/components/home/FeatureSystem";
import { SolutionsShowcase } from "@/components/home/SolutionsShowcase";
import { GrowthChapters } from "@/components/home/GrowthChapters";
import { EcosystemMap } from "@/components/home/EcosystemMap";
import { TrustSection } from "@/components/home/TrustSection";
import { FinalCta } from "@/components/home/FinalCta";
import { PricingModules, PricingPlans } from "@/components/pricing/PricingPlans";
import { Storefront } from "@/components/illustrations/Storefront";
import { Container, SectionHeading } from "@/components/ui/Section";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "/");
}

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "bn";
  const t = getDict(locale);

  const storefronts = Object.fromEntries(categorySlugs.map((s) => [s, <Storefront key={s} slug={s} className="h-full w-full" />])) as Record<CategorySlug, React.ReactNode>;

  return (
    <>
      <Hero locale={locale} />
      <Pillars locale={locale} />
      <LedgerTransform />
      <ProductDemo locale={locale} />
      <VoiceDemo />
      <FeatureSystem locale={locale} />
      <SolutionsShowcase arts={storefronts} />
      <GrowthChapters locale={locale} />
      <EcosystemMap />
      <TrustSection locale={locale} />
      <section aria-labelledby="pricing-title" className="paper py-24 sm:py-32">
        <Container>
          <SectionHeading id="pricing-title" eyebrow={t.pricing.eyebrow} title={t.pricing.title} lead={t.pricing.lead} align="center" className="mb-12" />
          <PricingPlans locale={locale} />
          <PricingModules locale={locale} />
        </Container>
      </section>
      <FinalCta locale={locale} />
    </>
  );
}
