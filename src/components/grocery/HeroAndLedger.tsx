"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, fmtTaka } from "@/lib/format";
import { recentSales, today } from "@/content/demo-data";
import { Container, Eyebrow } from "@/components/ui/Section";
import { HERO_H, HERO_W, heroPhoneSpot } from "@/components/illustrations/GroceryArt";
import { Phone } from "./Phone";
import { HomeScreen } from "./Screens";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------------- Section A: hero stage ---------------- */
/**
 * The phone stands on the drawn counter. While the hero is on screen, a new sample sale
 * lands every few seconds — the shop is "open". Reduced motion: a single static state.
 */
export function HeroStage({ art }: { art: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [sales, setSales] = useState(today.sales);
  const [count, setCount] = useState(today.salesCount);
  const [toast, setToast] = useState(false);
  const adds = [390, 190, 145, 280, 64];

  useEffect(() => {
    if (!inView || reduce) return;
    let i = 0;
    const id = setInterval(() => {
      const add = adds[i % adds.length];
      i++;
      setSales((v) => v + add);
      setCount((v) => v + 1);
      setToast(true);
      setTimeout(() => setToast(false), 1600);
      if (i >= 6) {
        setSales(today.sales);
        setCount(today.salesCount);
        i = 0;
      }
    }, 3800);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  const left = (heroPhoneSpot.x / HERO_W) * 100;
  const bottom = ((HERO_H - heroPhoneSpot.y) / HERO_H) * 100;
  const width = (heroPhoneSpot.w / HERO_W) * 100;

  return (
    <div ref={ref} className="relative mx-auto mb-[370px] aspect-[680/560] w-full max-w-[720px] sm:mb-0">
      <motion.div className="absolute inset-0" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
        {art}
      </motion.div>
      {/* Ink thread from the paper ledger to the phone */}
      <svg viewBox={`0 0 ${HERO_W} ${HERO_H}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <motion.path
          d="M330 392 C 360 320, 410 300, 452 260"
          fill="none"
          stroke="var(--color-leaf)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1 0"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.1, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
      <motion.div
        className="absolute hidden origin-bottom sm:block"
        style={{ left: `${left}%`, bottom: `${bottom}%`, width: `${width}%` }}
        initial={reduce ? false : { opacity: 0, y: 40, rotate: 4 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 120, damping: 16 }}
      >
        <Phone width="100%" nav="home">
          <HomeScreen sales={sales} count={count} toast={toast} />
        </Phone>
      </motion.div>
      {/* Phones: a full-size phone overlapping the bottom of the drawing */}
      <motion.div className="absolute top-[58%] left-1/2 w-[230px] -translate-x-1/2 sm:hidden" initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4, ease }}>
        <Phone width="100%" nav="home">
          <HomeScreen sales={sales} count={count} toast={toast} />
        </Phone>
      </motion.div>
    </div>
  );
}

/* ---------------- Section B: paper ledger → phone ---------------- */
export function LedgerToPhone({ counterArt }: { counterArt: React.ReactNode }) {
  const { t, locale } = useI18n();
  const L = t.grocery.ledger;
  const a = t.grocery.app;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(raw, { stiffness: 150, damping: 30, mass: 0.4, restDelta: 0.0005 });
  const [step, setStep] = useState(0);
  const [landed, setLanded] = useState(false);
  useMotionValueEvent(p, "change", (v) => {
    const s = v < 0.2 ? 0 : v < 0.38 ? 1 : v < 0.55 ? 2 : v < 0.75 ? 3 : 4;
    setStep((x) => (x === s ? x : s));
    const l = v > 0.66;
    setLanded((x) => (x === l ? x : l));
  });

  const write = useTransform(p, [0.04, 0.2], [100, 0]);
  const clip = useTransform(write, (v) => `inset(-30% ${v}% -30% 0)`);
  const handOpacity = useTransform(p, [0.24, 0.34], [1, 0]);
  const chipOpacity = useTransform(p, [0.24, 0.32, 0.62, 0.68], [0, 1, 1, 0]);
  const chipLeft = useTransform(p, [0.32, 0.64], ["36%", "70%"]);
  const chipTop = useTransform(p, [0.32, 0.46, 0.64], ["38%", "24%", "46%"]);
  const chipScale = useTransform(p, [0.32, 0.46, 0.64], [1, 1.08, 0.86]);
  const phoneX = useTransform(p, [0.36, 0.56, 0.78, 0.94], ["70%", "0%", "0%", "-108%"]);
  const phoneOpacity = useTransform(p, [0.36, 0.5], [0, 1]);
  const counterOpacity = useTransform(p, [0.74, 0.9], [1, 0.12]);
  const counterScale = useTransform(p, [0.74, 0.92], [1, 0.94]);

  const recent = (
    <div className="h-full space-y-2 p-3">
      <p className="px-1 text-[0.72rem] font-bold">{a.recent}</p>
      <AnimatePresence initial={false}>
        {landed && (
          <motion.div key="new" initial={{ opacity: 0, height: 0, backgroundColor: "rgba(74,222,128,0.4)" }} animate={{ opacity: 1, height: "auto", backgroundColor: "rgba(255,255,255,1)" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.6 }} className="overflow-hidden rounded-xl ring-1 ring-leaf/40">
            <div className="flex items-center justify-between px-3 py-2 text-[0.66rem]">
              <span>
                <span className="block font-semibold">{t.demo.products.rice} × {fmtNumber(5, locale)}</span>
                <span className="text-[0.58rem] text-muted">
                  {a.cash} · {a.justNow}
                </span>
              </span>
              <span className="font-latin font-bold text-leaf-deep">{fmtTaka(390, locale)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {recentSales.map((r) => (
        <div key={r.inv} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[0.66rem] ring-1 ring-ink/5">
          <span className="truncate">{r.customer ? t.demo.customers[r.customer] : a.walkIn}</span>
          <span className={cn("font-latin font-semibold", r.method === "due" && "text-vermilion")}>{fmtTaka(r.amount, locale)}</span>
        </div>
      ))}
    </div>
  );

  const heading = (
    <div>
      <Eyebrow>{L.eyebrow}</Eyebrow>
      <h2 className="font-display mt-4 text-[2rem] leading-snug text-balance sm:text-5xl">{L.title}</h2>
      <p className="mt-4 text-lg text-muted">{L.lead}</p>
    </div>
  );

  const steps = (
    <ol className="mt-8 space-y-3">
      {L.steps.map((s, i) => (
        <li key={s} className={cn("flex items-center gap-3 transition-opacity duration-500", reduce || step === i ? "opacity-100" : "opacity-40")}>
          <span className={cn("font-latin flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500", reduce || step >= i ? "bg-leaf-deep text-white" : "bg-ink/10 text-muted")}>
            {fmtNumber(i + 1, locale)}
          </span>
          <span className="font-semibold">{s}</span>
        </li>
      ))}
    </ol>
  );

  const stacked = (
    <Container className="py-20">
      {heading}
      {steps}
      <div className="relative mt-10">
        <CounterArt>{counterArt}</CounterArt>
        <motion.div className="relative z-10 mx-auto -mt-16 w-[230px]" initial={reduce ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -15% 0px" }} transition={{ duration: 0.8, ease }} onAnimationComplete={() => setLanded(true)}>
          <Phone width="100%" nav="sales">
            {recent}
          </Phone>
        </motion.div>
      </div>
    </Container>
  );

  if (reduce) {
    return (
      <section className="paper-cream py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            {heading}
            {steps}
          </div>
          <div className="mx-auto w-[260px]">
            <Phone width="100%" nav="sales">
              {recent}
            </Phone>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section ref={ref} className="paper-cream relative lg:h-[230vh]" aria-label={L.title}>
      <div className="lg:hidden">{stacked}</div>
      <div className="sticky top-0 hidden h-svh items-center overflow-hidden lg:flex">
        <Container className="grid items-center gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            {heading}
            <div className="hidden lg:block">{steps}</div>
            <p className="mt-3 text-sm font-semibold text-leaf-ink lg:hidden" aria-live="polite">
              {fmtNumber(step + 1, locale)}. {L.steps[step]}
            </p>
          </div>
          <div className="relative mx-auto aspect-[16/12] w-full max-w-[640px]">
            <motion.div className="absolute top-[8%] left-0 w-[74%] will-change-transform" style={{ opacity: counterOpacity, scale: counterScale }}>
              {counterArt}
              {/* Handwritten entry on the right-hand page */}
              <motion.p className="font-hand absolute top-[29%] left-[39%] flex w-[24%] justify-between gap-2 whitespace-nowrap text-[clamp(0.55rem,1.25vw,0.95rem)] text-[#24346b]" style={{ clipPath: clip, opacity: handOpacity, rotate: -1.5 }} lang="bn">
                <span>{L.handItem}</span>
                <span>{L.handAmount}</span>
              </motion.p>
            </motion.div>
            {/* Digital entry chip travelling from the ledger to the phone */}
            <motion.div className="absolute z-20 rounded-xl bg-white px-3 py-2 text-[clamp(0.6rem,1.3vw,0.8rem)] shadow-[var(--shadow-float)] ring-1 ring-leaf/40" style={{ left: chipLeft, top: chipTop, scale: chipScale, opacity: chipOpacity }} aria-hidden="true">
              <span className="block font-semibold">{t.demo.products.rice} × {fmtNumber(5, locale)}</span>
              <span className="font-latin font-bold text-leaf-deep">{fmtTaka(390, locale)}</span>
            </motion.div>
            <motion.div className="absolute top-[2%] right-[4%] w-[29%] will-change-transform" style={{ x: phoneX, opacity: phoneOpacity }}>
              <Phone width="100%" nav="sales">
                {recent}
              </Phone>
            </motion.div>
          </div>
        </Container>
      </div>
    </section>
  );
}

function CounterArt({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[520px]">{children}</div>;
}
