import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { featureSlugs } from "@/content/site";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand, PageHero } from "@/components/pages/PageParts";
import { FeatureDemo } from "@/components/pages/FeatureDemo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).meta.pages.features;
  return pageMetadata(locale, "/features", m.title, m.description);
}

export default async function FeaturesPage({ params }: Props) {
  const { locale } = await params;
  const t = getDict(locale);
  return (
    <>
      <PageHero eyebrow={t.features.index.eyebrow} title={t.features.index.title} lead={t.features.index.lead}>
        <ul className="mt-8 flex flex-wrap gap-2">
          {featureSlugs.map((s) => (
            <li key={s}>
              <a href={`#${s}`} className="inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-soft ring-1 ring-ink/10 transition-colors hover:text-leaf-ink hover:ring-leaf/40">
                {t.features.items[s].name}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>
      <Container className="space-y-6 pb-8">
        {featureSlugs.map((slug, i) => {
          const f = t.features.items[slug];
          return (
            <Reveal as="article" key={slug} className={cn("scroll-mt-28 rounded-[1.8rem] p-6 sm:p-10", i % 2 ? "bg-white shadow-[var(--shadow-card)] ring-1 ring-ink/5" : "paper-cream ring-1 ring-ink/10")}>
              <div id={slug} className={cn("grid items-center gap-10 lg:grid-cols-2", i % 2 === 1 && "lg:[&>*:first-child]:order-2")}>
                <div>
                  <p className="text-sm font-semibold text-leaf-ink">{f.name}</p>
                  <h2 className="font-display mt-2 text-3xl text-balance sm:text-4xl">{f.title}</h2>
                  <p className="mt-3 text-lg text-muted">{f.lead}</p>
                  <ul className="mt-6 space-y-2.5">
                    {f.points.map((pt) => (
                      <li key={pt} className="flex gap-3">
                        <svg viewBox="0 0 20 20" className="mt-1 size-4 shrink-0 text-leaf" aria-hidden="true">
                          <path d="M4 10.5l3.6 3.4L16 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${locale}/features/${slug}`} className="group mt-7 inline-flex items-center gap-2 font-semibold text-leaf-ink underline-offset-4 hover:underline">
                    {t.common.learnMore}
                    <span className="sr-only">: {f.name}</span>
                    <Arrow />
                  </Link>
                </div>
                <div>
                  <FeatureDemo slug={slug} locale={locale} />
                </div>
              </div>
            </Reveal>
          );
        })}
      </Container>
      <CtaBand locale={locale} title={t.features.detail.ctaTitle} body={t.features.detail.ctaBody} />
    </>
  );
}
