import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { interpolate } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { FeatureSlug } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ShelfArt } from "@/components/illustrations/Shelf";
import { DuesDemo, ExpenseDemo, PurchaseDemo, ReportsMini, SalesBillDemo, ShelfDemo } from "./FeatureDemos";

export function FeatureSystem({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const fs = t.home.featuresSection;

  const Card = ({
    slug,
    heading,
    body,
    children,
    className,
    kind = "up",
    delay = 0,
  }: {
    slug: FeatureSlug;
    heading: string;
    body: string;
    children: React.ReactNode;
    className?: string;
    kind?: "up" | "ink" | "fade";
    delay?: number;
  }) => (
    <Reveal kind={kind} delay={delay} as="article" className={cn("group/card flex flex-col rounded-[1.6rem] p-6 sm:p-8", className)}>
      <p className="text-sm font-semibold text-leaf-ink">{t.features.items[slug].name}</p>
      <h3 className="font-display mt-2 text-2xl text-balance text-ink sm:text-[1.9rem]">{heading}</h3>
      <p className="mt-2 max-w-md text-muted">{body}</p>
      <div className="mt-6 flex-1">{children}</div>
      <Link href={`/${locale}/features/${slug}`} className="group mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-leaf-ink underline-offset-4 hover:underline">
        {interpolate(fs.explore, { name: t.features.items[slug].name })}
        <Arrow />
      </Link>
    </Reveal>
  );

  return (
    <section aria-labelledby="features-title" className="paper py-24 sm:py-32">
      <Container>
        <SectionHeading id="features-title" eyebrow={fs.eyebrow} title={fs.title} lead={fs.lead} />
        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          <Card slug="sales" heading={fs.sales.heading} body={fs.sales.body} className="paper-cream ring-1 ring-ink/10 lg:col-span-7">
            <SalesBillDemo />
          </Card>
          <Card slug="inventory" heading={fs.inventory.heading} body={fs.inventory.body} kind="ink" delay={0.1} className="bg-leaf-soft/70 ring-1 ring-leaf/15 lg:col-span-5">
            <ShelfDemo art={<ShelfArt className="w-full" />} />
          </Card>
          <Card slug="purchases" heading={fs.purchases.heading} body={fs.purchases.body} className="bg-marigold-soft/60 ring-1 ring-marigold/20 lg:col-span-5">
            <PurchaseDemo />
          </Card>
          <Card slug="expenses" heading={fs.expenses.heading} body={fs.expenses.body} delay={0.1} className="paper-cream ring-1 ring-ink/10 lg:col-span-7">
            <ExpenseDemo />
          </Card>
          <Card slug="customers" heading={fs.customers.heading} body={fs.customers.body} kind="ink" className="bg-vermilion-soft/45 ring-1 ring-vermilion/15 lg:col-span-7">
            <DuesDemo />
          </Card>
          <Card slug="reports" heading={fs.reports.heading} body={fs.reports.body} delay={0.1} className="paper-cream ring-1 ring-ink/10 lg:col-span-5">
            <ReportsMini />
          </Card>
          <Reveal as="article" className="on-dark relative overflow-hidden rounded-[1.6rem] bg-forest p-8 text-cream sm:p-12 lg:col-span-12">
            <div aria-hidden="true" className="absolute -right-20 -bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(74_222_128/0.25),transparent)]" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="text-sm font-semibold text-leaf-glow">{t.features.items.assistant.name}</p>
                <h3 className="font-display mt-2 text-3xl text-balance sm:text-4xl">{fs.assistant.heading}</h3>
                <p className="mt-3 max-w-lg text-cream/75">{fs.assistant.body}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href="#voice" variant="light" arrow>
                    {fs.assistant.cta}
                  </ButtonLink>
                  <ButtonLink href={`/${locale}/features/assistant`} variant="ghost" className="text-cream hover:bg-white/10">
                    {interpolate(fs.explore, { name: t.features.items.assistant.name })}
                  </ButtonLink>
                </div>
              </div>
              <div className="font-hand relative text-[1.7rem] leading-relaxed text-cream/90 sm:text-[2rem]" aria-hidden="true">
                <span className="text-leaf-glow">“</span>
                {t.home.voice.suggestions[2]}
                <span className="text-leaf-glow">”</span>
                <svg viewBox="0 0 300 20" className="mt-2 h-4 w-3/4" preserveAspectRatio="none">
                  <path d="M2 12 C 50 4, 100 18, 150 9 S 250 6, 298 11" fill="none" stroke="var(--color-leaf-glow)" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
