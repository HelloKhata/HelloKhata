import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/pages/PageParts";
import { StreetBack, StreetMid } from "@/components/illustrations/StreetScene";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).meta.pages.about;
  return pageMetadata(locale, "/about", m.title, m.description);
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = getDict(locale);
  const a = t.about;
  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} lead={a.lead} />
      <div className="relative overflow-hidden">
        <svg viewBox="0 0 1440 600" className="w-full text-ink" role="img" aria-label={t.meta.sceneAlt}>
          <g opacity="0.18" filter="url(#hk-wobble)">
            <StreetBack />
          </g>
          <g filter="url(#hk-wobble)">
            <StreetMid />
          </g>
        </svg>
      </div>
      <section className="py-20 sm:py-28" aria-labelledby="story-title">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <h2 id="story-title" className="font-display text-3xl text-balance sm:text-5xl">
            {a.storyTitle}
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-ink-soft sm:text-xl">
            {a.story.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? "first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:leading-none first-letter:text-leaf-deep" : ""}>{p}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <section className="on-dark grain-dark bg-forest py-20 text-cream sm:py-28" aria-labelledby="mission-title">
        <Container className="max-w-4xl text-center">
          <p id="mission-title" className="text-sm font-semibold text-leaf-glow">
            {a.missionTitle}
          </p>
          <p className="font-display mt-6 text-3xl leading-snug text-balance sm:text-5xl sm:leading-tight">{a.mission}</p>
        </Container>
      </section>
      <section className="py-20 sm:py-28" aria-labelledby="values-title">
        <Container>
          <h2 id="values-title" className="font-display text-3xl sm:text-5xl">
            {a.valuesTitle}
          </h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.08} className="paper-cream rounded-[1.4rem] p-6 ring-1 ring-ink/10">
                <span className="font-hand text-3xl text-leaf-deep">{locale === "bn" ? "১২৩৪"[i] : i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{v.title}</h3>
                <p className="mt-2 text-muted">{v.body}</p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-16 flex flex-col items-start gap-4 rounded-[1.6rem] bg-leaf-soft/60 p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-2xl">{a.ctaTitle}</p>
            <ButtonLink href={`/${locale}/contact`} arrow>
              {t.nav.contact}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
