"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtDigits, fmtTaka } from "@/lib/format";
import { Container, Eyebrow } from "@/components/ui/Section";
import { StorePreview, themePresets, type StoreConfig } from "./StorePreview";

/**
 * Signature story: a hand-drawn seller → catalogue → editor → theme → live change →
 * branded domain → customer order → seller's order list. One stage, eight scroll-driven states.
 */
export function StoreStory({ sellerArt }: { sellerArt: React.ReactNode }) {
  const { t, locale } = useI18n();
  const s = t.onlineStore.story;
  const items = t.onlineStore.themes.items;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const pad = (n: number) => fmtDigits(n, locale).padStart(2, locale === "bn" ? "০" : "0");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = Math.min(7, Math.max(0, Math.floor(v * 8.2)));
    setStep((x) => (x === n ? x : n));
  });

  const base = (theme: "fashion" | "grocery", accent?: string): StoreConfig => ({
    theme,
    accent: accent ?? themePresets[theme].accent,
    font: themePresets[theme].font,
    banner: items[theme].banner,
    sections: ["hero", "collection"],
    columns: 3,
  });

  const stage = (i: number) => {
    switch (i) {
      case 0:
        return <div className="paper-cream mx-auto max-w-sm rounded-[1.4rem] p-4 ring-1 ring-ink/10">{sellerArt}</div>;
      case 1:
        return (
          <div className="grid grid-cols-3 gap-3">
            {items.fashion.products.map((n, k) => (
              <motion.div key={n} initial={{ opacity: 0, y: 20, rotate: k % 2 ? 3 : -3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: k * 0.07 }} className="rounded-xl bg-white p-2 shadow-[var(--shadow-card)]">
                <div className="aspect-square rounded-lg" style={{ background: themePresets.fashion.tiles[k] }} />
                <p className="mt-1.5 truncate text-xs font-semibold">{n}</p>
                <p className="font-latin text-xs text-muted">{fmtTaka(items.fashion.prices[k], locale)}</p>
              </motion.div>
            ))}
          </div>
        );
      case 2:
      case 3:
      case 4: {
        const accent = i === 4 ? "#0e7c86" : undefined;
        const theme = i >= 3 ? "fashion" : "grocery";
        return (
          <div className="grid grid-cols-[96px_1fr] gap-3 rounded-[1.2rem] bg-white p-3 shadow-[var(--shadow-float)] ring-1 ring-ink/10">
            <div className="space-y-2 rounded-lg bg-ink/[0.04] p-2" aria-hidden="true">
              {(["fashion", "electronics", "grocery"] as const).map((k) => (
                <div key={k} className={cn("rounded-md p-1.5 text-[0.6rem] font-semibold", i >= 3 && k === "fashion" ? "bg-[#dbe6fe] ring-1 ring-[#2563eb]" : "bg-white")}>
                  {items[k].name}
                </div>
              ))}
              {i === 4 && (
                <div className="flex gap-1 pt-1">
                  {["#9f1239", "#0e7c86", "#d97706"].map((c) => (
                    <span key={c} className={cn("size-4 rounded-full", c === "#0e7c86" && "ring-2 ring-ink ring-offset-1")} style={{ background: c }} />
                  ))}
                </div>
              )}
            </div>
            <motion.div layout className="overflow-hidden rounded-lg ring-1 ring-ink/10">
              <StorePreview config={base(theme, accent)} mini />
            </motion.div>
          </div>
        );
      }
      case 5:
        return (
          <div className="overflow-hidden rounded-[1.2rem] bg-white shadow-[var(--shadow-float)] ring-1 ring-ink/10">
            <div className="flex items-center gap-2 border-b border-ink/10 bg-[#f3f4f6] px-3 py-2">
              <span className="size-2 rounded-full bg-ink/20" />
              <span className="font-latin ml-1 rounded-md bg-white px-3 py-1 text-sm font-semibold text-[#1d4ed8]">
                <span className="text-muted">https://</span>
                {s.domain}
              </span>
              <svg viewBox="0 0 20 20" className="size-4 text-leaf" aria-hidden="true">
                <path d="M6 9V7a4 4 0 1 1 8 0v2M5 9h10v8H5z" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
            <StorePreview config={base("fashion", "#0e7c86")} mini />
          </div>
        );
      case 6:
        return (
          <div className="relative">
            <div className="overflow-hidden rounded-[1.2rem] shadow-[var(--shadow-float)] ring-1 ring-ink/10">
              <StorePreview config={base("fashion", "#0e7c86")} mini />
            </div>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }} className="absolute right-4 -bottom-5 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-cream shadow-[var(--shadow-float)]">
              🛍 {s.orderToast}
            </motion.div>
          </div>
        );
      default:
        return (
          <div className="rounded-[1.2rem] bg-forest p-4 text-cream shadow-[var(--shadow-float)]">
            <p className="text-sm font-semibold text-leaf-glow">{s.manage}</p>
            <ul className="mt-3 space-y-2">
              {[1026, 1025, 1024].map((id, k) => (
                <motion.li key={id} initial={k === 0 ? { opacity: 0, x: -20, backgroundColor: "rgba(74,222,128,0.35)" } : false} animate={{ opacity: 1, x: 0, backgroundColor: "rgba(255,255,255,0.06)" }} transition={{ duration: 0.8 }} className="flex justify-between rounded-xl px-3 py-2 text-sm">
                  <span className="font-latin">#NG-{id}</span>
                  <span className="font-latin font-semibold">{fmtTaka([2780, 1490, 6800][k], locale)}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        );
    }
  };

  const captions = (
    <ol className="mt-8 space-y-3">
      {s.steps.map((st, i) => (
        <li key={i} className={cn("rounded-xl px-4 py-3 transition-all duration-500", reduce || step === i ? "bg-white shadow-[var(--shadow-card)]" : "opacity-50")}>
          <p className="text-sm font-semibold">
            <span className="font-latin mr-2 text-[#1d4ed8]">{pad(i + 1)}</span>
            {st.title}
          </p>
          {(reduce || step === i) && <p className="mt-1 text-sm text-muted">{st.body}</p>}
        </li>
      ))}
    </ol>
  );

  const heading = (
    <div>
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <h2 className="font-display mt-4 text-[2rem] leading-snug text-balance sm:text-5xl">{s.title}</h2>
    </div>
  );

  if (reduce) {
    return (
      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            {heading}
            {captions}
          </div>
          <div className="space-y-6">{[0, 4, 7].map((i) => <div key={i}>{stage(i)}</div>)}</div>
        </Container>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[460vh] bg-[#f4f7fd]" aria-label={s.title}>
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <Container className="grid items-center gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="hidden lg:block">
            {heading}
            {captions}
          </div>
          <div className="lg:hidden">
            {heading}
            <p className="mt-4 text-sm font-semibold">
              <span className="font-latin mr-2 text-[#1d4ed8]">{pad(step + 1)}</span>
              {s.steps[step].title}
            </p>
            <p className="mt-1 text-sm text-muted">{s.steps[step].body}</p>
          </div>
          <div className="relative min-h-[300px] sm:min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.99, transition: { duration: 0.18 } }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                {stage(step)}
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex justify-center gap-1.5" aria-hidden="true">
              {s.steps.map((_, i) => (
                <span key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i === step ? "w-6 bg-[#1d4ed8]" : "w-1.5 bg-ink/20")} />
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
