import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { featureSlugs, relatedFeatures, type FeatureSlug } from "@/content/site";
import { Container, SampleBadge } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand, PageHero } from "@/components/pages/PageParts";
import { FeatureDemo } from "@/components/pages/FeatureDemo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => featureSlugs.map((slug) => ({ locale, slug })));
}

const isFeature = (s: string): s is FeatureSlug => (featureSlugs as readonly string[]).includes(s);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isFeature(slug)) return {};
  const f = getDict(locale).features.items[slug];
  return pageMetadata(locale, `/features/${slug}`, f.name, `${f.title} ${f.lead}`);
}

export default async function FeaturePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isFeature(slug)) notFound();
  const t = getDict(locale);
  const f = t.features.items[slug];
  const d = t.features.detail;
  const num = (i: number) => (locale === "bn" ? "১২৩৪"[i] : String(i + 1));

  return (
    <>
      <PageHero
        eyebrow={f.name}
        title={f.title}
        lead={f.lead}
        crumbLabel={t.common.breadcrumb}
        crumbs={[
          { href: `/${locale}`, label: "HelloKhata" },
          { href: `/${locale}/features`, label: t.nav.features },
        ]}
        aside={
          <Reveal className="rounded-[1.6rem] bg-white p-5 shadow-[var(--shadow-float)] ring-1 ring-ink/5 sm:p-7">
            <div className="mb-4 flex justify-end">
              <SampleBadge>{t.common.sampleData}</SampleBadge>
            </div>
            <FeatureDemo slug={slug} locale={locale} />
          </Reveal>
        }
      />

      <section className="py-16 sm:py-20" aria-labelledby="points-title">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <h2 id="points-title" className="font-display text-3xl sm:text-4xl">
            {d.pointsTitle}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {f.points.map((pt, i) => (
              <Reveal as="li" key={pt} delay={i * 0.06} className="paper-cream rounded-2xl p-5 ring-1 ring-ink/10">
                <svg viewBox="0 0 20 20" className="size-5 text-leaf" aria-hidden="true">
                  <path d="M4 10.5l3.6 3.4L16 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-3 font-semibold text-ink">{pt}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-[#efe8d8] py-16 sm:py-24" aria-labelledby="steps-title">
        <Container>
          <h2 id="steps-title" className="font-display text-3xl sm:text-4xl">
            {d.stepsTitle}
          </h2>
          <ol className="relative mt-10 grid gap-8 md:grid-cols-3">
            <svg className="pointer-events-none absolute top-6 left-0 hidden h-6 w-full md:block" viewBox="0 0 900 24" preserveAspectRatio="none" aria-hidden="true">
              <path d="M40 12 C 200 0, 300 24, 450 12 S 700 2, 860 12" fill="none" stroke="var(--color-leaf)" strokeWidth="2" strokeDasharray="6 8" vectorEffect="non-scaling-stroke" />
            </svg>
            {f.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.12} className="relative">
                <span className="font-display relative flex size-12 items-center justify-center rounded-full bg-leaf-deep text-xl text-white">{num(i)}</span>
                <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="related-title">
        <Container>
          <h2 id="related-title" className="font-display text-3xl sm:text-4xl">
            {d.relatedTitle}
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {relatedFeatures[slug].map((r) => (
              <li key={r}>
                <Link href={`/${locale}/features/${r}`} className="group block h-full rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/5 transition-transform hover:-translate-y-1">
                  <p className="text-lg font-semibold text-ink">{t.features.items[r].name}</p>
                  <p className="mt-1.5 text-muted">{t.features.items[r].short}</p>
                  <span className="mt-4 inline-flex text-leaf-ink">
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand locale={locale} title={d.ctaTitle} body={d.ctaBody} />
    </>
  );
}
