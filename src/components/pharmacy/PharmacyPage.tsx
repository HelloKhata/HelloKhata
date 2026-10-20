import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { moduleStatus } from "@/content/capabilities";
import { categoryModules } from "@/content/site";
import { Container, Eyebrow, SectionHeading, StatusBadge } from "@/components/ui/Section";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { InkStroke, Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/pages/PageParts";
import { fmtNumber } from "@/lib/format";
import { MedicineShelfArt, PharmacyCounterArt, PrescriptionSlip } from "@/components/illustrations/PharmacyArt";
import { AssistantDemo, HeroComposite, InventoryDemo, OcrDemo, PosDemo, ReportsDemo, RxProvider, WorkflowStepper } from "./PharmacyDemos";

/**
 * Pharmacy solution page — pharmacy business management first, prescription OCR as one
 * signature capability. All figures are sample data; OCR and the assistant are demonstrations.
 */
export function PharmacyPage({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const ph = t.pharmacy;
  const start = `/${locale}/get-started`;

  const Heading = ({ id, eyebrow, title, lead, status, tone = "dark", center }: { id: string; eyebrow: string; title: string; lead: string; status?: keyof typeof moduleStatus; tone?: "dark" | "light"; center?: boolean }) => (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <div className={center ? "flex flex-wrap items-center justify-center gap-3" : "flex flex-wrap items-center gap-3"}>
        <Eyebrow tone={tone === "dark" ? "leaf" : "light"}>{eyebrow}</Eyebrow>
        {status && <StatusBadge status={moduleStatus[status]} label={t.status[moduleStatus[status]]} tone={tone === "dark" ? "light" : "dark"} />}
      </div>
      <h2 id={id} className={`font-display mt-4 text-[2rem] leading-snug text-balance sm:text-5xl ${tone === "dark" ? "text-ink" : "text-cream"}`}>
        {title}
      </h2>
      <p className={`mt-4 text-lg ${tone === "dark" ? "text-muted" : "text-cream/75"}`}>{lead}</p>
    </div>
  );

  const slip = <PrescriptionSlip className="block w-full" alt={ph.ocr.slipAlt} />;

  return (
    <RxProvider>
      {/* A — Hero */}
      <section aria-labelledby="ph-hero" className="relative overflow-hidden bg-gradient-to-b from-[#f3f8f4] to-paper pt-28 pb-16 sm:pt-32 lg:pb-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Eyebrow>{ph.hero.eyebrow}</Eyebrow>
            <h1 id="ph-hero" className="font-display mt-5 text-[2.4rem] leading-[1.15] text-ink sm:text-[3.4rem] lg:text-[3.2rem] xl:text-[3.6rem]">
              <span className="hk-rise block">{ph.hero.title1}</span>
              <span className="hk-rise relative inline-block text-leaf-deep [animation-delay:120ms]">
                {ph.hero.title2}
                <svg viewBox="0 0 300 22" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-4 w-full" aria-hidden="true">
                  <path d="M4 15 C 60 6, 120 18, 180 9 S 270 7, 296 12" pathLength={1} fill="none" stroke="var(--color-leaf)" strokeWidth="5" strokeLinecap="round" className="hk-draw [animation-delay:700ms]" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg text-pretty text-ink-soft">{ph.hero.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={start} size="lg" arrow className="w-full sm:w-auto">
                {ph.hero.primary}
              </ButtonLink>
              <ButtonLink href="#workflow" variant="secondary" size="lg" className="w-full sm:w-auto">
                {ph.hero.secondary}
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-muted">{ph.hero.note}</p>
          </div>
          <HeroComposite art={<PharmacyCounterArt className="w-full" alt={ph.hero.sceneAlt} />} slip={slip} />
        </Container>
      </section>

      {/* B — Workflow */}
      <section id="workflow" aria-labelledby="ph-flow" className="scroll-mt-20 bg-[#f3f8f4] py-20 sm:py-28">
        <Container>
          <Heading id="ph-flow" eyebrow={ph.workflow.eyebrow} title={ph.workflow.title} lead={ph.workflow.lead} />
          <div className="mt-12">
            <WorkflowStepper />
          </div>
        </Container>
      </section>

      {/* C — OCR */}
      <section id="ocr" aria-labelledby="ph-ocr" className="on-dark grain-dark relative scroll-mt-16 overflow-hidden bg-forest py-24 text-cream sm:py-32">
        <div aria-hidden="true" className="absolute top-0 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(22_163_74/0.2),transparent)]" />
        <Container className="relative">
          <Heading id="ph-ocr" eyebrow={ph.ocr.eyebrow} title={ph.ocr.title} lead={ph.ocr.lead} status="prescriptionOcr" tone="light" />
          <p className="mt-6 max-w-3xl rounded-2xl border border-marigold/30 bg-marigold/10 p-4 text-sm text-marigold-soft">{ph.ocr.demoNote}</p>
          <div className="mt-12">
            <OcrDemo slip={slip} />
          </div>
          <div className="mt-14 rounded-[1.6rem] bg-white/[0.04] p-6 ring-1 ring-white/10 sm:p-8">
            <p className="font-semibold text-leaf-glow">{ph.ocr.principlesTitle}</p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ph.ocr.principles.map((p, i) => (
                <Reveal as="li" key={p} delay={i * 0.06} className="flex gap-3 text-sm text-cream/85">
                  <span className="font-latin flex size-7 shrink-0 items-center justify-center rounded-full bg-leaf/25 text-xs font-bold text-leaf-glow">{fmtNumber(i + 1, locale)}</span>
                  {p}
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* D — Inventory & expiry */}
      <section aria-labelledby="ph-inv" className="relative overflow-hidden bg-gradient-to-b from-paper via-[#eef6f5] to-paper py-20 sm:py-28">
        <div className="pointer-events-none absolute top-1/3 -left-40 size-[34rem] rounded-full bg-[#fb923c]/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-40 bottom-0 size-[30rem] rounded-full bg-[#0e7c86]/10 blur-3xl" aria-hidden="true" />
        <Container className="relative">
          <Heading id="ph-inv" eyebrow={ph.inventory.eyebrow} title={ph.inventory.title} lead={ph.inventory.lead} status="batchExpiry" />
          <div className="mt-12">
            <InventoryDemo />
          </div>
        </Container>
      </section>

      {/* E — POS */}
      <section id="pos" aria-labelledby="ph-pos" className="scroll-mt-20 bg-[#f3f8f4] py-20 sm:py-28">
        <Container>
          <Heading id="ph-pos" eyebrow={ph.pos.eyebrow} title={ph.pos.title} lead={ph.pos.lead} status="pos" />
          <Reveal className="mt-12">
            <PosDemo />
          </Reveal>
          <p className="mt-3 text-xs text-muted">{ph.pos.note}</p>
        </Container>
      </section>

      {/* G — Reports */}
      <section aria-labelledby="ph-rep" className="paper-cream py-20 sm:py-28">
        <Container>
          <Heading id="ph-rep" eyebrow={ph.reports.eyebrow} title={ph.reports.title} lead={ph.reports.lead} status="reports" />
          <Reveal className="mt-12">
            <ReportsDemo />
          </Reveal>
        </Container>
      </section>

      {/* H — Assistant */}
      <section aria-labelledby="ph-ai" className="on-dark grain-dark bg-forest-2 py-20 text-cream sm:py-28">
        <Container>
          <Heading id="ph-ai" eyebrow={ph.assistant.eyebrow} title={ph.assistant.title} lead={ph.assistant.lead} status="assistant" tone="light" />
          <div className="mt-12">
            <AssistantDemo />
          </div>
        </Container>
      </section>

      {/* I — Scale */}
      <section aria-labelledby="ph-scale" className="py-20 sm:py-24">
        <Container>
          <SectionHeading id="ph-scale" eyebrow={ph.scale.eyebrow} title={ph.scale.title} />
          <div className="mt-10 grid gap-5 md:grid-cols-[1.4fr_1fr]">
            <Reveal className="rounded-[1.6rem] bg-white p-7 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
              <p className="font-display text-2xl">{ph.scale.single.title}</p>
              <p className="mt-2 text-muted">{ph.scale.single.body}</p>
              <ul className="mt-5 space-y-2">
                {ph.scale.single.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <svg viewBox="0 0 20 20" className="mt-1 size-4 shrink-0 text-leaf" aria-hidden="true">
                      <path d="M4 10.5l3.6 3.4L16 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col rounded-[1.6rem] border-2 border-dashed border-ink/15 p-7">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-2xl">{ph.scale.multi.title}</p>
                <StatusBadge status={moduleStatus.multiBranch} label={t.status[moduleStatus.multiBranch]} />
              </div>
              <p className="mt-2 text-muted">{ph.scale.multi.body}</p>
              <Link href={`/${locale}/solutions/supershop`} className="group mt-auto inline-flex items-center gap-2 pt-5 font-semibold text-leaf-ink underline-offset-4 hover:underline">
                {ph.scale.multi.link}
                <Arrow />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* J — Trust & clarity */}
      <section aria-labelledby="ph-trust" className="bg-[#f3f8f4] py-20 sm:py-24">
        <Container>
          <SectionHeading id="ph-trust" eyebrow={ph.trust.eyebrow} title={ph.trust.title} lead={ph.trust.lead} />
          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <ul className="grid gap-4 sm:grid-cols-2">
              {ph.trust.items.map((it, i) => (
                <Reveal as="li" key={it.title} delay={i * 0.05} className="rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
                  <p className="font-semibold">{it.title}</p>
                  <p className="mt-1.5 text-sm text-muted">{it.body}</p>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.1} className="rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
              <p className="font-semibold">{ph.trust.capabilitiesTitle}</p>
              <ul className="mt-3 divide-y divide-ink/5">
                {categoryModules.pharmacy.map((m) => (
                  <li key={m} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span>
                      <span className="block font-semibold">{t.modules[m].name}</span>
                      <span className="block text-xs text-muted">{t.modules[m].desc}</span>
                    </span>
                    <StatusBadge status={moduleStatus[m]} label={t.status[moduleStatus[m]]} />
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">{t.status.legend}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* K — FAQ */}
      <section className="py-20 sm:py-24">
        <Container className="max-w-4xl">
          <Faq title={ph.faq.title} items={ph.faq.items} />
        </Container>
      </section>

      {/* L — Final */}
      <section aria-labelledby="ph-final" className="relative overflow-hidden bg-gradient-to-b from-paper to-[#eaf3ec] py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <Reveal className="relative order-2 lg:order-1">
            <MedicineShelfArt className="w-full opacity-90" />
            <div className="absolute -top-6 left-[4%] w-[30%] -rotate-6 rounded shadow-[var(--shadow-float)]" aria-hidden="true">
              {slip}
            </div>
            <div className="absolute right-0 -bottom-6 w-[46%] rotate-2 rounded-xl bg-white p-3 shadow-[var(--shadow-float)] ring-1 ring-ink/10" aria-hidden="true">
              <p className="font-latin text-[0.65rem] font-extrabold" translate="no">
                Hello<span className="text-leaf-deep">Khata</span>
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1.5 text-[0.6rem]">
                <span className="rounded bg-leaf-soft px-1.5 py-1 text-leaf-ink">{ph.ui.todaySales}</span>
                <span className="rounded bg-[#fde8d8] px-1.5 py-1 text-[#9a3412]">{ph.ui.expiringSoon}</span>
                <span className="rounded bg-marigold-soft px-1.5 py-1 text-[#6b4a07]">{ph.ui.stockStatus}</span>
                <span className="rounded bg-[#eef6f1] px-1.5 py-1 text-leaf-ink">{ph.ui.rxQueue}</span>
              </div>
            </div>
            <InkStroke viewBox="0 0 300 120" d="M20 20 C 90 100, 200 10, 280 90" className="pointer-events-none absolute inset-x-[10%] top-[10%] hidden h-[60%] w-[80%] md:block" width={2.5} duration={1.6} />
          </Reveal>
          <div className="order-1 text-center lg:order-2 lg:text-left">
            <h2 id="ph-final" className="font-display text-[2.2rem] leading-snug text-balance sm:text-5xl">
              {ph.final.title}
            </h2>
            <p className="mt-5 text-lg text-muted">{ph.final.lead}</p>
            <ButtonLink href={start} size="lg" arrow className="mt-8">
              {ph.final.cta}
            </ButtonLink>
            <p className="mt-4 text-sm text-muted">
              <Link href={`/${locale}/contact`} className="underline underline-offset-4 hover:text-ink">
                {t.nav.contact}
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </RxProvider>
  );
}
