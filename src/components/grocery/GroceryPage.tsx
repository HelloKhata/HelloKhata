import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { fmtTaka } from "@/lib/format";
import { today, weekSales } from "@/content/demo-data";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { InkStroke, Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/pages/PageParts";
import { CounterArt, DeliveryArt, GroceryHeroArt, ProductShelfArt, RegularCustomerArt } from "@/components/illustrations/GroceryArt";
import { HeroStage, LedgerToPhone } from "./HeroAndLedger";
import { DuesDemo, MobileTour, PurchaseDemo, SalesEntryDemo, StockShelfDemo, VoiceAssistantDemo } from "./GroceryDemos";

/**
 * Grocery & Retail solution page — for the everyday মুদি ও খুচরা দোকানদার using a phone.
 * Every figure on the page is sample data; voice is a scripted demo (see VoiceAssistantDemo).
 */
export function GroceryPage({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const g = t.grocery;
  const start = `/${locale}/get-started`;

  const Split = ({ eyebrow, title, lead, points, children, reverse, tone = "paper", note, id, extra }: { eyebrow: string; title: string; lead: string; points?: string[]; children: React.ReactNode; reverse?: boolean; tone?: "paper" | "cream" | "green"; note?: string; id?: string; extra?: React.ReactNode }) => (
    <section id={id} className={cn("scroll-mt-20 py-20 sm:py-28", tone === "cream" && "paper-cream", tone === "green" && "bg-leaf-soft/40")}>
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className={reverse ? "lg:order-2" : ""}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display mt-4 text-[2rem] leading-snug text-balance sm:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-muted">{lead}</p>
          {points && (
            <ul className="mt-6 space-y-2.5">
              {points.map((p) => (
                <li key={p} className="flex gap-3">
                  <svg viewBox="0 0 20 20" className="mt-1 size-4 shrink-0 text-leaf" aria-hidden="true">
                    <path d="M4 10.5l3.6 3.4L16 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          )}
          {note && <p className="mt-5 text-sm text-muted">{note}</p>}
          {extra && <div className="mt-8">{extra}</div>}
        </Reveal>
        <div>{children}</div>
      </Container>
    </section>
  );

  const b = g.benefits.items;
  const max = Math.max(...weekSales);

  return (
    <>
      {/* A — Hero */}
      <section aria-labelledby="g-hero" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pb-24">
        <Container className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative z-10">
            <Eyebrow>{g.hero.eyebrow}</Eyebrow>
            <h1 id="g-hero" className="font-display mt-5 text-[2.5rem] leading-[1.2] text-ink sm:text-6xl lg:text-[3.6rem] lg:leading-[1.18] xl:text-[4rem]">
              <span className="hk-rise block">{g.hero.title1}</span>
              <span className="hk-rise relative inline-block text-leaf-deep [animation-delay:120ms] sm:whitespace-nowrap">
                {g.hero.title2}
                <svg viewBox="0 0 300 22" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-4 w-full" aria-hidden="true">
                  <path d="M4 15 C 60 6, 120 18, 180 9 S 270 7, 296 12" pathLength={1} fill="none" stroke="var(--color-leaf)" strokeWidth="5" strokeLinecap="round" className="hk-draw [animation-delay:700ms]" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg text-pretty text-ink-soft sm:text-xl">{g.hero.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={start} size="lg" arrow className="w-full sm:w-auto">
                {g.hero.primary}
              </ButtonLink>
              <ButtonLink href="#how" variant="secondary" size="lg" className="w-full sm:w-auto">
                {g.hero.secondary}
              </ButtonLink>
            </div>
            <p className="mt-6 flex items-center gap-3 text-ink-soft">
              <span className="font-hand text-2xl text-leaf-deep">{g.hero.note}</span>
            </p>
            <p className="mt-1 text-sm text-muted">{g.hero.tagline}</p>
          </div>
          <HeroStage art={<GroceryHeroArt className="h-full w-full" alt={g.hero.sceneAlt} />} />
        </Container>
      </section>

      {/* B — Ledger → phone */}
      <div id="how" className="scroll-mt-16">
        <LedgerToPhone counterArt={<CounterArt className="w-full" />} />
      </div>

      {/* C — Sales */}
      <Split eyebrow={g.sales.eyebrow} title={g.sales.title} lead={g.sales.lead} points={g.sales.points} note={g.sales.note}>
        <SalesEntryDemo />
      </Split>

      {/* D — Stock */}
      <section className="paper-cream py-20 sm:py-28" aria-labelledby="g-stock">
        <Container>
          <SectionHeading id="g-stock" eyebrow={g.stock.eyebrow} title={g.stock.title} lead={g.stock.lead} />
          <div className="mt-12">
            <StockShelfDemo shelf={<ProductShelfArt className="w-full" />} />
          </div>
        </Container>
      </section>

      {/* E — Purchases & expenses */}
      <Split eyebrow={g.purchase.eyebrow} title={g.purchase.title} lead={g.purchase.lead} points={g.purchase.points} note={g.purchase.note} reverse extra={<DeliveryArt className="w-full max-w-md" />}>
        <PurchaseDemo />
      </Split>

      {/* F — Customer dues */}
      <Split eyebrow={g.dues.eyebrow} title={g.dues.title} lead={g.dues.lead} note={g.dues.note} tone="cream" extra={<RegularCustomerArt className="w-full max-w-md" />}>
        <DuesDemo />
      </Split>

      {/* G — Voice */}
      <section aria-labelledby="g-voice" className="on-dark grain-dark relative overflow-hidden bg-forest py-24 text-cream sm:py-32">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-paper/10 to-transparent" />
        <div aria-hidden="true" className="absolute top-1/3 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(22_163_74/0.25),transparent)]" />
        <Container className="relative">
          <SectionHeading id="g-voice" tone="light" eyebrow={g.voice.eyebrow} title={g.voice.title} lead={g.voice.lead} align="center" />
          <div className="mt-16">
            <VoiceAssistantDemo />
          </div>
        </Container>
      </section>

      {/* H — Benefits */}
      <section aria-labelledby="g-benefits" className="py-20 sm:py-28">
        <Container>
          <SectionHeading id="g-benefits" eyebrow={g.benefits.eyebrow} title={g.benefits.title} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
            <Reveal as="li" className="rounded-[1.6rem] bg-leaf-deep p-6 text-white lg:col-span-2 lg:row-span-2">
              <p className="text-2xl font-semibold">{b.sales.title}</p>
              <p className="mt-2 text-white/80">{b.sales.body}</p>
              <div className="mt-6 space-y-2 rounded-2xl bg-white/10 p-4 text-sm" aria-hidden="true">
                {(["rice", "oil", "egg"] as const).map((k, i) => (
                  <div key={k} className="flex justify-between">
                    <span>{t.demo.products[k]}</span>
                    <span className="font-latin font-semibold">{fmtTaka([156, 380, 156][i], locale)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-white/20 pt-2 font-bold">
                  <span>{t.grocery.app.total}</span>
                  <span className="font-latin">{fmtTaka(692, locale)}</span>
                </div>
              </div>
            </Reveal>
            <Reveal as="li" delay={0.05} className="rounded-[1.6rem] bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
              <svg viewBox="0 0 120 40" className="h-10" aria-hidden="true">
                {[10, 40, 70, 100].map((x, i) => (
                  <g key={x}>
                    <rect x={x - 9} y={i === 1 ? 22 : 8} width="18" height={i === 1 ? 16 : 30} rx="3" fill={i === 1 ? "#d99a1e" : "#bfe8cc"} />
                  </g>
                ))}
              </svg>
              <p className="mt-3 font-semibold">{b.stock.title}</p>
              <p className="mt-1 text-sm text-muted">{b.stock.body}</p>
            </Reveal>
            <Reveal as="li" delay={0.1} className="paper-cream rounded-[1.6rem] p-5 ring-1 ring-ink/10">
              <svg viewBox="0 0 120 40" className="h-10" aria-hidden="true">
                <rect x="8" y="14" width="64" height="14" rx="2" fill="#c9895a" fillOpacity="0.6" />
                <rect x="14" y="4" width="18" height="11" rx="3" fill="#e7d7b4" />
                <rect x="36" y="4" width="18" height="11" rx="3" fill="#e7d7b4" />
                <circle cx="22" cy="32" r="7" fill="none" stroke="#17221c" strokeWidth="2" />
                <circle cx="62" cy="32" r="7" fill="none" stroke="#17221c" strokeWidth="2" />
                <path d="M72 22 L96 28" stroke="#17221c" strokeWidth="2" />
                <circle cx="100" cy="32" r="5" fill="none" stroke="#17221c" strokeWidth="2" />
              </svg>
              <p className="mt-3 font-semibold">{b.purchases.title}</p>
              <p className="mt-1 text-sm text-muted">{b.purchases.body}</p>
            </Reveal>
            <Reveal as="li" delay={0.05} className="rounded-[1.6rem] bg-marigold-soft/60 p-5">
              <p className="font-semibold">{b.expenses.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{b.expenses.body}</p>
            </Reveal>
            <Reveal as="li" delay={0.1} className="rounded-[1.6rem] bg-vermilion-soft/50 p-5">
              <div className="flex -space-x-2" aria-hidden="true">
                {(["rahim", "salma", "jamal"] as const).map((k) => (
                  <span key={k} className="flex size-8 items-center justify-center rounded-full bg-white text-xs font-bold ring-2 ring-vermilion-soft">
                    {t.demo.customers[k].slice(0, 1)}
                  </span>
                ))}
              </div>
              <p className="mt-3 font-semibold">{b.dues.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{b.dues.body}</p>
            </Reveal>
            <Reveal as="li" className="rounded-[1.6rem] bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-ink/5 lg:col-span-2">
              <div className="flex h-14 items-end gap-1.5" aria-hidden="true">
                {weekSales.map((v, i) => (
                  <span key={i} className={cn("flex-1 rounded-t-md", i === 6 ? "bg-leaf" : "bg-leaf-soft")} style={{ height: `${30 + ((v - 18000) / (max - 18000)) * 70}%` }} />
                ))}
              </div>
              <p className="mt-3 font-semibold">{b.reports.title}</p>
              <p className="mt-1 text-sm text-muted">{b.reports.body}</p>
            </Reveal>
            <Reveal as="li" delay={0.05} className="on-dark rounded-[1.6rem] bg-forest p-5 text-cream lg:col-span-2">
              <div className="flex h-10 items-center gap-[3px]" aria-hidden="true">
                {Array.from({ length: 36 }, (_, i) => (
                  <span key={i} className="w-[3px] flex-1 rounded-full bg-leaf-glow/70" style={{ height: `${20 + Math.round(Math.sin((i / 35) * Math.PI) * 70 * (0.5 + ((i * 7) % 10) / 20))}%` }} />
                ))}
              </div>
              <p className="mt-3 font-semibold">{b.voice.title}</p>
              <p className="mt-1 text-sm text-cream/70">{b.voice.body}</p>
              <p className="mt-2 text-xs text-leaf-glow" lang="bn">
                “{g.voice.questions[2]}”
              </p>
            </Reveal>
          </ul>
        </Container>
      </section>

      {/* I — Mobile tour */}
      <section aria-labelledby="g-tour" className="bg-[#eef4ee] py-20 sm:py-28">
        <Container>
          <SectionHeading id="g-tour" eyebrow={g.tour.eyebrow} title={g.tour.title} lead={g.tour.lead} />
          <div className="mt-12">
            <MobileTour />
          </div>
        </Container>
      </section>

      {/* J — FAQ */}
      <section className="py-20 sm:py-24">
        <Container className="max-w-4xl">
          <Faq title={g.faq.title} items={g.faq.items} />
        </Container>
      </section>

      {/* K — Final */}
      <section aria-labelledby="g-final" className="paper-cream relative overflow-hidden py-20 sm:py-28">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="relative order-2 lg:order-1">
            <CounterArt className="w-full" />
            <div className="absolute top-[6%] right-[4%] w-[30%] rotate-[4deg] rounded-[1.6rem] bg-[#121614] p-1.5 shadow-[var(--shadow-float)]" aria-hidden="true">
              <div className="aspect-[9/16] overflow-hidden rounded-[1.25rem] bg-gradient-to-b from-[#15803d] to-[#0f5f2e] p-3 text-white">
                <p className="font-latin text-[0.6rem] font-extrabold" translate="no">
                  Hello<span className="text-leaf-glow">Khata</span>
                </p>
                <p className="mt-3 text-[0.55rem] text-white/75">{t.grocery.app.todaySales}</p>
                <p className="font-latin text-sm font-extrabold">{fmtTaka(today.sales, locale)}</p>
                <p className="mt-1 text-[0.5rem] text-marigold-soft">{t.grocery.app.sample}</p>
              </div>
            </div>
          </Reveal>
          <div className="order-1 text-center lg:order-2 lg:text-left">
            <h2 id="g-final" className="font-display text-[2.2rem] leading-snug text-balance sm:text-5xl">
              {g.final.title}
            </h2>
            <InkStroke viewBox="0 0 300 20" d="M3 12 C 60 4, 120 18, 180 9 S 260 7, 297 11" className="mx-auto mt-2 h-4 w-48 lg:mx-0" width={4} />
            <p className="mt-5 text-lg text-muted">{g.final.lead}</p>
            <ButtonLink href={start} size="lg" arrow className="mt-8">
              {g.final.cta}
            </ButtonLink>
            <p className="mt-4 text-sm text-muted">
              <Link href={`/${locale}/contact`} className="underline underline-offset-4 hover:text-ink">
                {t.nav.contact}
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
