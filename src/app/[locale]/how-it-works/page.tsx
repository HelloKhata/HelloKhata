import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand, PageHero } from "@/components/pages/PageParts";
import { LedgerTransform } from "@/components/home/LedgerTransform";
import { GrowthArt } from "@/components/illustrations/GrowthArt";
import { GrowthStory } from "@/components/home/GrowthStory";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).meta.pages.howItWorks;
  return pageMetadata(locale, "/how-it-works", m.title, m.description);
}

const stepArt = [0, 2, 1, 3];

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  const t = getDict(locale);
  const h = t.howItWorks;
  return (
    <>
      <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} />
      <section className="pb-16" aria-label={h.eyebrow}>
        <Container>
          <ol className="relative space-y-6">
            {h.steps.map((s, i) => (
              <Reveal as="li" key={s.title} className="grid items-center gap-6 rounded-[1.6rem] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/5 sm:grid-cols-[auto_1fr_220px] sm:p-8">
                <span className="font-display flex size-16 items-center justify-center rounded-full bg-leaf-soft text-3xl text-leaf-deep">{locale === "bn" ? "১২৩৪"[i] : i + 1}</span>
                <div>
                  <h2 className="text-2xl font-semibold">{s.title}</h2>
                  <p className="mt-2 text-lg text-muted">{s.body}</p>
                </div>
                <div className="paper-cream hidden rounded-2xl p-2 ring-1 ring-ink/10 sm:block">
                  <GrowthArt stage={i === 3 ? 4 : stepArt[i]} className="w-full" />
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>
      <LedgerTransform title={h.ledgerTitle} />
      <GrowthStory arts={[0, 1, 2, 3, 4].map((i) => <GrowthArt key={i} stage={i} className="w-full" />)} />
      <CtaBand locale={locale} />
    </>
  );
}
