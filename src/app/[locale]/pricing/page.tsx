import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Section";
import { CtaBand, Faq, PageHero } from "@/components/pages/PageParts";
import { PricingModules, PricingPlans } from "@/components/pricing/PricingPlans";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).meta.pages.pricing;
  return pageMetadata(locale, "/pricing", m.title, m.description);
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  const t = getDict(locale);
  return (
    <>
      <PageHero eyebrow={t.pricing.eyebrow} title={t.pricing.title} lead={t.pricing.lead} />
      <Container className="pb-16">
        <PricingPlans locale={locale} headingLevel="h2" />
        <PricingModules locale={locale} />
      </Container>
      <Container className="max-w-4xl py-16">
        <Faq title={t.pricing.faqTitle} items={t.pricing.faq} />
      </Container>
      <CtaBand locale={locale} />
    </>
  );
}
