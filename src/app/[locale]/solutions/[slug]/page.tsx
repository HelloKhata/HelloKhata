import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { categoryAccent, categoryModules, categorySlugs, type CategorySlug, type FeatureSlug } from "@/content/site";
import { Container, SampleBadge } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand, PageHero } from "@/components/pages/PageParts";
import { Storefront } from "@/components/illustrations/Storefront";
import { AppPreview } from "@/components/product/AppPreview";
import { CapabilityGrid } from "@/components/solutions/Capabilities";
import { PharmacyDemo } from "@/components/solutions/PharmacyDemo";
import { SupershopPage } from "@/components/solutions/SupershopPage";
import { OnlineStorePage } from "@/components/solutions/OnlineStorePage";
import { FcommercePage } from "@/components/solutions/FcommercePage";
import { GroceryPage } from "@/components/grocery/GroceryPage";
import { PharmacyPage } from "@/components/pharmacy/PharmacyPage";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => categorySlugs.map((slug) => ({ locale, slug })));
}

const isCategory = (s: string): s is CategorySlug => (categorySlugs as readonly string[]).includes(s);
const helpfulFeatures: FeatureSlug[] = ["sales", "inventory", "customers", "reports", "assistant", "purchases"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isCategory(slug)) return {};
  const item = getDict(locale).solutions.items[slug];
  return pageMetadata(locale, `/solutions/${slug}`, item.name, `${item.title} ${item.lead}`);
}

export default async function SolutionPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isCategory(slug)) notFound();
  if (slug === "grocery") return <GroceryPage locale={locale} />;
  if (slug === "pharmacy") return <PharmacyPage locale={locale} />;
  if (slug === "supershop") return <SupershopPage locale={locale} />;
  if (slug === "online-store") return <OnlineStorePage locale={locale} />;
  if (slug === "f-commerce") return <FcommercePage locale={locale} />;

  const t = getDict(locale);
  const item = t.solutions.items[slug];
  const d = t.solutions.detail;
  const accent = categoryAccent[slug];

  return (
    <>
      <PageHero
        eyebrow={item.name}
        title={item.title}
        lead={item.lead}
        crumbLabel={t.common.breadcrumb}
        crumbs={[
          { href: `/${locale}`, label: "HelloKhata" },
          { href: `/${locale}/solutions`, label: t.nav.solutions },
        ]}
        aside={
          <Reveal kind="ink" className="mx-auto w-full max-w-md">
            <div className="rounded-[1.6rem] p-6" style={{ backgroundColor: accent.soft }}>
              <Storefront slug={slug} className="w-full" />
            </div>
          </Reveal>
        }
      />

      {slug !== "other" && (
        <section className="py-12 sm:py-16" aria-labelledby="demo-title">
          <Container>
            <h2 id="demo-title" className="font-display text-3xl sm:text-4xl">
              {d.demoTitle}
            </h2>
            <div className="mt-8">{slug === "pharmacy" ? <PharmacyDemo /> : <AppPreview />}</div>
          </Container>
        </section>
      )}

      <section className="py-12 sm:py-16" aria-labelledby="needs-title">
        <Container className="grid gap-8 lg:grid-cols-2">
          <Reveal className="paper-cream rounded-[1.6rem] p-7 ring-1 ring-ink/10 sm:p-9">
            <h2 id="needs-title" className="font-display text-3xl">
              {d.needsTitle}
            </h2>
            <ul className="mt-6 space-y-4">
              {item.needs.map((n, i) => (
                <li key={n} className="flex items-start gap-4">
                  <span className="font-display flex size-9 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: accent.ink }}>
                    {locale === "bn" ? "১২৩"[i] : i + 1}
                  </span>
                  <span className="pt-1 text-lg">{n}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="rounded-[1.6rem] bg-white p-7 shadow-[var(--shadow-card)] ring-1 ring-ink/5 sm:p-9">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-3xl">{d.helpsTitle}</h2>
              <SampleBadge>{t.common.sampleData}</SampleBadge>
            </div>
            <p className="mt-4 font-semibold" style={{ color: accent.ink }}>
              {item.example.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {item.example.lines.map((l) => (
                <li key={l} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: accent.soft }}>
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: accent.tint }} />
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section className="py-12 sm:py-16" aria-labelledby="caps-title">
        <Container>
          <h2 id="caps-title" className="font-display text-3xl sm:text-4xl">
            {d.capabilitiesTitle}
          </h2>
          <CapabilityGrid locale={locale} modules={categoryModules[slug]} className="mt-8" />
        </Container>
      </section>

      <section className="py-12 sm:py-16" aria-labelledby="sol-features-title">
        <Container>
          <h2 id="sol-features-title" className="font-display text-3xl sm:text-4xl">
            {t.features.index.eyebrow}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {helpfulFeatures.map((f) => (
              <li key={f}>
                <Link href={`/${locale}/features/${f}`} className="group block h-full rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/5 transition-transform hover:-translate-y-1">
                  <p className="font-semibold text-ink">{t.features.items[f].name}</p>
                  <p className="mt-1 text-sm text-muted">{t.features.items[f].short}</p>
                  <span className="mt-3 inline-flex text-leaf-ink">
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
