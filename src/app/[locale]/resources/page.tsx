import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/pages/PageParts";
import { HelpCenter } from "@/components/forms/HelpCenter";
import { HelpDeskArt } from "@/components/illustrations/HelpArt";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).meta.pages.resources;
  return pageMetadata(locale, "/resources", m.title, m.description);
}

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  const t = getDict(locale);
  const r = t.resources;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: r.articles.map((a) => ({ "@type": "Question", name: a.q, acceptedAnswer: { "@type": "Answer", text: a.a } })),
  };
  return (
    <>
      <PageHero eyebrow={r.eyebrow} title={r.title} lead={r.lead} aside={<HelpDeskArt className="mx-auto w-full max-w-md lg:max-w-none" alt={r.artAlt} />} />
      <Container className="pb-20">
        <HelpCenter />
        <div className="paper-cream mt-16 flex flex-col items-start gap-4 rounded-[1.6rem] p-8 ring-1 ring-ink/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-2xl">{r.contactTitle}</p>
          <ButtonLink href={`/${locale}/contact`} arrow>
            {r.contactCta}
          </ButtonLink>
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
