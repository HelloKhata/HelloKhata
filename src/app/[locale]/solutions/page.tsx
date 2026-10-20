import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { categoryAccent, categoryGroup, flagshipSlugs } from "@/content/site";
import { groupStatus } from "@/content/capabilities";
import { cn } from "@/lib/cn";
import { Container, StatusBadge } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand, PageHero } from "@/components/pages/PageParts";
import { Storefront } from "@/components/illustrations/Storefront";
import { EcosystemMap } from "@/components/home/EcosystemMap";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).meta.pages.solutions;
  return pageMetadata(locale, "/solutions", m.title, m.description);
}

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  const t = getDict(locale);
  const other = t.solutions.items.other;
  return (
    <>
      <PageHero eyebrow={t.solutions.index.eyebrow} title={t.solutions.index.title} lead={t.solutions.index.lead} />
      <Container className="pb-12">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {flagshipSlugs.map((slug, i) => {
            const item = t.solutions.items[slug];
            const st = groupStatus(categoryGroup[slug]);
            const wide = i >= 3;
            return (
              <Reveal as="li" key={slug} delay={(i % 3) * 0.08} className={cn(wide ? "lg:col-span-3" : "lg:col-span-2")}>
                <Link href={`/${locale}/solutions/${slug}`} className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-white shadow-[var(--shadow-card)] ring-1 ring-ink/5 transition-transform duration-500 ease-[var(--ease-ink)] hover:-translate-y-1.5">
                  <div className="p-4 pb-0" style={{ backgroundColor: categoryAccent[slug].soft }}>
                    <Storefront slug={slug} className="mx-auto w-full max-w-[300px] transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: categoryAccent[slug].ink }}>
                        {t.solutions.detail.flagship}
                      </span>
                      <StatusBadge status={st} label={t.status[st]} />
                    </div>
                    <h2 className="mt-2 text-xl font-semibold text-ink">{item.name}</h2>
                    <p className="mt-1 text-muted">{item.title}</p>
                    <p className="mt-1 text-sm text-muted">{item.short}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold" style={{ color: categoryAccent[slug].ink }}>
                      {t.common.learnMore}
                      <Arrow />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
        <Link href={`/${locale}/solutions/other`} className="group mt-6 flex flex-col items-start gap-4 rounded-[1.6rem] border-2 border-dashed border-ink/15 p-6 transition-colors hover:border-ink/30 sm:flex-row sm:items-center">
          <div className="w-24 shrink-0">
            <Storefront slug="other" className="w-full" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">{other.name}</p>
            <p className="text-sm text-muted">{other.lead}</p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-ink">
            {t.common.learnMore}
            <Arrow />
          </span>
        </Link>
      </Container>
      <EcosystemMap />
      <CtaBand locale={locale} />
    </>
  );
}
