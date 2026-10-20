"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useI18n } from "@/i18n/client";
import { fmtNumber, fmtTaka } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Container, Eyebrow, SampleBadge } from "@/components/ui/Section";

const amounts = [390, 280, 190, 550];
const total = amounts.reduce((a, b) => a + b, 0);

/**
 * Signature transition #2: a red hal-khata ledger opens, entries are written in by hand,
 * each one turns into an organised transaction row, and the page becomes the HelloKhata app.
 *
 * Choreography (pinned progress 0 → 1, spring-smoothed):
 *   arrive  (before pin) book rises and untilts as the section scrolls in
 *   0.00–0.18  cover swings open, spread recentres
 *   0.14–0.40  four entries are written in, one after another
 *   0.40–0.62  each entry becomes a typed row; green ink links them
 *   0.60–0.78  the page lifts into the app card
 *   0.76–0.90  due tag, total and inventory update land
 * Reduced-motion users get the finished state with all steps listed.
 */
export function LedgerTransform({ titleAs = "h2", title }: { titleAs?: "h2" | "h3"; title?: string }) {
  const { t, locale } = useI18n();
  const L = t.home.ledger;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { scrollYProgress: rawArrive } = useScroll({ target: ref, offset: ["start end", "start start"] });
  // Springs smooth out wheel/trackpad steps so the sequence glides instead of stuttering.
  const p = useSpring(raw, { stiffness: 160, damping: 32, mass: 0.35, restDelta: 0.0005 });
  const arrive = useSpring(rawArrive, { stiffness: 140, damping: 30, mass: 0.4, restDelta: 0.0005 });

  const [step, setStep] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const s = v < 0.38 ? 0 : v < 0.62 ? 1 : 2;
    setStep((prev) => (prev === s ? prev : s));
  });
  const Title = titleAs;

  if (reduce) {
    return (
      <section ref={ref} className="paper-cream py-24 sm:py-32" aria-labelledby="ledger-title">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>{L.eyebrow}</Eyebrow>
            <Title id="ledger-title" className="font-display mt-4 text-[2rem] text-balance sm:text-5xl">
              {title ?? L.title}
            </Title>
            <Steps active={-1} />
          </div>
          <StaticApp />
        </Container>
      </section>
    );
  }

  return (
    <section ref={ref} className="paper-cream relative h-[210vh] lg:h-[240vh]" aria-labelledby="ledger-title">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <Container className="grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Eyebrow>{L.eyebrow}</Eyebrow>
            <Title id="ledger-title" className="font-display mt-4 text-[1.85rem] leading-snug text-balance sm:text-5xl">
              {title ?? L.title}
            </Title>
            <div className="hidden lg:block">
              <Steps active={step} progress={p} />
            </div>
          </div>
          <div>
            <Stage p={p} arrive={arrive} />
            <div className="mt-5 min-h-[5.5rem] lg:hidden" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  <p className="font-semibold text-ink">
                    <span className="mr-2 text-leaf-deep">{locale === "bn" ? "১২৩"[step] : step + 1}.</span>
                    {L.steps[step].title}
                  </p>
                  <p className="mt-1 text-muted">{L.steps[step].body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

function Steps({ active, progress }: { active: number; progress?: MotionValue<number> }) {
  const { t, locale } = useI18n();
  const fallback = useSpring(1);
  const fill = useTransform(progress ?? fallback, [0, 0.9], [0, 1]);
  return (
    <ol className="relative mt-10 space-y-7">
      {/* Progress rail that fills as the sequence plays */}
      <span aria-hidden="true" className="absolute top-5 bottom-5 left-[1.1rem] w-0.5 rounded-full bg-ink/10" />
      <motion.span aria-hidden="true" className="absolute top-5 bottom-5 left-[1.1rem] w-0.5 origin-top rounded-full bg-leaf" style={{ scaleY: progress ? fill : 1 }} />
      {t.home.ledger.steps.map((s, i) => {
        const on = active === -1 || active >= i;
        const current = active === -1 || active === i;
        return (
          <li key={i} className={cn("relative pl-14 transition-opacity duration-500", current ? "opacity-100" : "opacity-45")}>
            <span
              className={cn(
                "font-latin absolute top-0.5 left-0 flex size-9 items-center justify-center rounded-full text-sm font-bold ring-4 ring-cream transition-[background-color,color,transform] duration-500",
                on ? "bg-leaf-deep text-white" : "bg-[#ece6d8] text-muted",
                current && active !== -1 && "scale-110",
              )}
            >
              {locale === "bn" ? "১২৩"[i] : i + 1}
            </span>
            <h3 className="text-xl font-semibold text-ink">{s.title}</h3>
            <p className="mt-1.5 max-w-md text-muted">{s.body}</p>
          </li>
        );
      })}
    </ol>
  );
}

function Stage({ p, arrive }: { p: MotionValue<number>; arrive: MotionValue<number> }) {
  const { t, locale } = useI18n();
  const L = t.home.ledger;

  // Arrival (before the pin): rise, untilt, settle
  const arriveY = useTransform(arrive, [0, 1], [90, 0]);
  const arriveTilt = useTransform(arrive, [0, 1], [22, 0]);
  const arriveScale = useTransform(arrive, [0, 1], [0.9, 1]);
  const arriveOpacity = useTransform(arrive, [0, 0.45], [0, 1]);

  // Book opening
  const coverRotate = useTransform(p, [0, 0.18], [0, -180]);
  const frontOpacity = useTransform(coverRotate, (r) => (r > -90 ? 1 : 0));
  const backOpacity = useTransform(coverRotate, (r) => (r > -90 ? 0 : 1));
  const sweep = useTransform(coverRotate, [0, -90, -180], [0, 0.35, 0]); // shadow passing over the page
  const coverOpacity = useTransform(p, [0.58, 0.66], [1, 0]);
  const coverX = useTransform(p, [0.58, 0.66], ["0%", "-12%"]);

  // Page position: centred closed → right of spine while open → centred again as the app
  const pageX = useTransform(p, [0, 0.18, 0.6, 0.76], ["-50%", "0%", "0%", "-50%"]);
  const pageScale = useTransform(p, [0.6, 0.76], [1, 1.2]);
  const pageLift = useTransform(p, [0.6, 0.76], [0, -10]);

  const handHeaderOpacity = useTransform(p, [0.12, 0.16, 0.42, 0.5], [0, 1, 1, 0]);
  const lineLen = useTransform(p, [0.44, 0.62], [0, 1]);
  const paperOpacity = useTransform(p, [0.62, 0.74], [1, 0]);
  const skinOpacity = useTransform(p, [0.6, 0.72], [0, 1]);
  const headerOpacity = useTransform(p, [0.7, 0.78], [0, 1]);
  const headerY = useTransform(p, [0.7, 0.78], [-6, 0]);

  const handTotalOpacity = useTransform(p, [0.36, 0.4, 0.5, 0.56], [0, 1, 1, 0]);
  const typedTotalOpacity = useTransform(p, [0.56, 0.64], [0, 1]);
  const totalCount = useTransform(p, [0.56, 0.86], [0, total]);
  const totalText = useTransform(totalCount, (v) => fmtTaka(Math.round(v / 10) * 10, locale));
  const totalScale = useTransform(p, [0.84, 0.87, 0.9], [1, 1.12, 1]);

  const toastOpacity = useTransform(p, [0.82, 0.88], [0, 1]);
  const toastY = useTransform(p, [0.82, 0.9], [28, 0]);
  const toastScale = useTransform(p, [0.82, 0.9], [0.92, 1]);

  return (
    <motion.div
      className="relative mx-auto aspect-[5/4] w-full max-w-[600px]"
      style={{ perspective: 2200, y: arriveY, scale: arriveScale, opacity: arriveOpacity }}
      aria-hidden="true"
    >
      <motion.div className="absolute inset-0" style={{ rotateX: arriveTilt, transformStyle: "preserve-3d" }}>
        {/* Soft floor shadow that grows as the book settles */}
        <motion.div className="absolute inset-x-[18%] bottom-[2%] h-[6%] rounded-[50%] bg-ink/15 blur-xl" style={{ opacity: arriveOpacity }} />

        <motion.div
          className="absolute top-[6%] left-1/2 h-[86%] w-[46%] will-change-transform"
          style={{ x: pageX, y: pageLift, scale: pageScale, transformStyle: "preserve-3d" }}
        >
          {/* Right page / app surface */}
          <div className="absolute inset-0 rounded-r-md bg-[#fbf6ea] shadow-[0_24px_48px_-24px_rgb(23_34_28/0.5)]">
            <motion.div className="absolute inset-0 rounded-r-md" style={{ opacity: paperOpacity }}>
              <div className="absolute inset-0 rounded-r-md bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(10%-1px),rgb(37_99_235/0.16)_calc(10%-1px),rgb(37_99_235/0.16)_10%)]" />
              <div className="absolute inset-y-0 left-[12%] w-px bg-vermilion/50" />
              <div className="absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-ink/10 to-transparent" />
            </motion.div>
            <motion.div className="absolute inset-0 rounded-r-md bg-gradient-to-l from-ink/40 to-transparent" style={{ opacity: sweep }} />
            <motion.div className="absolute -inset-[3%] rounded-2xl bg-white shadow-[var(--shadow-float)] ring-1 ring-ink/10" style={{ opacity: skinOpacity }} />

            {/* App header */}
            <motion.div className="absolute inset-x-[6%] top-[4%] flex items-center justify-between" style={{ opacity: headerOpacity, y: headerY }}>
              <span className="text-[clamp(0.6rem,1.6vw,0.85rem)] font-bold text-ink">{L.appTitle}</span>
              <span className="origin-right scale-75">
                <SampleBadge>{t.common.sampleData}</SampleBadge>
              </span>
            </motion.div>

            {/* Handwritten header */}
            <motion.p className="font-hand absolute top-[4%] left-[16%] text-[clamp(0.75rem,2vw,1.1rem)] text-[#24346b]" style={{ opacity: handHeaderOpacity }}>
              {L.handHeader}
            </motion.p>

            {/* Rows */}
            <div className="absolute inset-x-0 top-[17%] bottom-[18%]">
              {L.handRows.map((row, i) => (
                <LedgerRow key={i} i={i} p={p} hand={row} typed={L.appRows[i]} amount={amounts[i]} dueTag={i === 3 ? L.dueTag : undefined} locale={locale} />
              ))}
              {/* Green ink linking the rows */}
              <svg viewBox="0 0 10 100" preserveAspectRatio="none" className="absolute top-[8%] left-[7%] h-[76%] w-[4%] overflow-visible">
                <motion.path d="M5 0 C2 20 8 30 5 50 S 3 80 5 100" fill="none" stroke="var(--color-leaf)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinecap="round" style={{ pathLength: lineLen }} />
              </svg>
            </div>

            {/* Total */}
            <div className="absolute inset-x-[6%] bottom-[5%] h-[9%] border-t border-ink/15">
              <motion.span className="font-hand absolute inset-0 flex items-center text-[clamp(0.75rem,2vw,1.1rem)] text-[#24346b]" style={{ opacity: handTotalOpacity }}>
                {L.totalLabel} = {fmtNumber(total, locale)}/-
              </motion.span>
              <motion.span className="absolute inset-0 flex items-center justify-between" style={{ opacity: typedTotalOpacity }}>
                <span className="text-[clamp(0.62rem,1.6vw,0.88rem)] font-semibold text-muted">{L.totalLabel}</span>
                <motion.span className="font-latin origin-right text-[clamp(0.8rem,2.2vw,1.15rem)] font-extrabold text-leaf-deep tabular-nums" style={{ scale: totalScale }}>
                  {totalText}
                </motion.span>
              </motion.span>
            </div>
          </div>

          {/* Cover: red cloth outside, inside page on the back */}
          <motion.div className="absolute inset-0 origin-left will-change-transform" style={{ rotateY: coverRotate, x: coverX, opacity: coverOpacity, transformStyle: "preserve-3d" }}>
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-r-md bg-vermilion shadow-[inset_0_0_0_6px_rgb(0_0_0/0.08),0_24px_48px_-24px_rgb(23_34_28/0.55)]"
              style={{ opacity: frontOpacity }}
            >
              <div className="absolute inset-[7%] rounded-sm border-2 border-marigold/80" />
              <div className="absolute inset-[9%] rounded-sm border border-marigold/50" />
              <div className="absolute inset-0 rounded-r-md opacity-30 mix-blend-multiply [background-image:var(--grain)]" />
              <div className="absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/25 to-transparent" />
              <p className="font-display relative text-[clamp(1.6rem,5vw,3rem)] text-marigold-soft">{L.coverTitle}</p>
              <p className="font-display relative mt-1 text-[clamp(0.9rem,2.4vw,1.4rem)] text-marigold-soft/80">{L.coverYear}</p>
            </motion.div>
            <motion.div className="absolute inset-0 rounded-l-md bg-[#f6efdf] [transform:rotateY(180deg)]" style={{ opacity: backOpacity }}>
              <div className="absolute inset-y-0 right-0 w-[8%] bg-gradient-to-l from-ink/10 to-transparent" />
              <div className="absolute inset-[8%] flex flex-col items-center justify-center rounded border border-dashed border-ink/20 text-center">
                <p lang="bn" className="font-hand text-[clamp(1rem,2.6vw,1.6rem)] text-vermilion">
                  শুভ হালখাতা
                </p>
                <p className="font-display mt-2 text-[clamp(0.8rem,2vw,1.1rem)] text-ink/60">{L.coverYear}</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Inventory toast */}
      <motion.div
        className="absolute right-0 bottom-0 flex max-w-[80%] origin-bottom-right items-center gap-3 rounded-2xl bg-forest px-4 py-3 text-cream shadow-[var(--shadow-float)] sm:right-[2%]"
        style={{ opacity: toastOpacity, y: toastY, scale: toastScale }}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-leaf-deep text-white">
          <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
            <path d="M4 10.5l3.6 3.4L16 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>
          <span className="block text-sm font-semibold">{L.stockLabel}</span>
          <span className="block text-xs text-cream/70">{L.stockItem}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

/** One ledger line: written in by hand, then replaced by its organised row. */
function LedgerRow({
  i,
  p,
  hand,
  typed,
  amount,
  dueTag,
  locale,
}: {
  i: number;
  p: MotionValue<number>;
  hand: { item: string; amount: string };
  typed: string;
  amount: number;
  dueTag?: string;
  locale: "bn" | "en";
}) {
  // Writing: each line reveals left→right like a pen stroke, staggered
  const w0 = 0.15 + i * 0.055;
  const write = useTransform(p, [w0, w0 + 0.07], [100, 0]);
  const clip = useTransform(write, (v) => `inset(-20% ${v}% -20% 0)`);
  // Conversion: staggered hand-off from handwriting to typed row
  const c0 = 0.42 + i * 0.035;
  const handOpacity = useTransform(p, [c0, c0 + 0.05], [1, 0]);
  const handY = useTransform(p, [c0, c0 + 0.05], [0, -8]);
  const typedOpacity = useTransform(p, [c0 + 0.02, c0 + 0.07], [0, 1]);
  const typedX = useTransform(p, [c0 + 0.02, c0 + 0.08], [-14, 0]);
  const nodeScale = useTransform(p, [c0 + 0.04, c0 + 0.07, c0 + 0.09], [0, 1.4, 1]);
  const chipScale = useTransform(p, [0.78, 0.82, 0.85], [0, 1.15, 1]);

  return (
    <div className="absolute inset-x-0" style={{ top: `${i * 22}%`, height: "20%" }}>
      <motion.div
        className="font-hand absolute inset-y-0 right-[8%] left-[16%] flex items-center justify-between text-[clamp(0.72rem,1.9vw,1.05rem)] text-[#24346b]"
        style={{ clipPath: clip, opacity: handOpacity, y: handY, rotate: i % 2 ? 0.6 : -0.8 }}
      >
        <span>{hand.item}</span>
        <span>{hand.amount}/-</span>
      </motion.div>
      <motion.div className="absolute inset-y-[8%] right-[6%] left-[14%] flex items-center justify-between gap-2 rounded-lg px-[4%]" style={{ opacity: typedOpacity, x: typedX }}>
        <span className="truncate text-[clamp(0.62rem,1.6vw,0.88rem)] font-semibold text-ink">{typed}</span>
        <span className="flex items-center gap-1.5">
          {dueTag && (
            <motion.span className="rounded-full bg-vermilion-soft px-1.5 py-0.5 text-[clamp(0.5rem,1.2vw,0.68rem)] font-semibold text-vermilion" style={{ scale: chipScale }}>
              {dueTag}
            </motion.span>
          )}
          <span className="font-latin text-[clamp(0.62rem,1.6vw,0.88rem)] font-bold text-ink tabular-nums">{fmtTaka(amount, locale)}</span>
        </span>
      </motion.div>
      <motion.span className="absolute top-1/2 left-[7%] -mt-[3px] -ml-[1px] size-[7px] rounded-full bg-leaf" style={{ scale: nodeScale }} />
    </div>
  );
}

/** Finished state for reduced motion. */
function StaticApp() {
  const { t, locale } = useI18n();
  const L = t.home.ledger;
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-float)] ring-1 ring-ink/10">
      <div className="flex items-center justify-between">
        <p className="font-bold">{L.appTitle}</p>
        <SampleBadge>{t.common.sampleData}</SampleBadge>
      </div>
      <ul className="mt-4 divide-y divide-ink/10">
        {L.appRows.map((r, i) => (
          <li key={i} className="flex items-center justify-between py-3">
            <span className="font-semibold">{r}</span>
            <span className="font-latin font-bold tabular-nums">{fmtTaka(amounts[i], locale)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-between border-t border-ink/15 pt-3">
        <span className="text-muted">{L.totalLabel}</span>
        <span className="font-latin text-lg font-extrabold text-leaf-deep">{fmtTaka(total, locale)}</span>
      </div>
      <p className="mt-4 rounded-xl bg-leaf-soft px-4 py-3 text-sm text-leaf-ink">
        <strong>{L.stockLabel}:</strong> {L.stockItem}
      </p>
    </div>
  );
}
