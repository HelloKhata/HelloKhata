"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, fmtTaka, interpolate } from "@/lib/format";
import { panjabi } from "@/content/demo-data";
import { StorePreview, themePresets, type ThemeKey } from "@/components/online/StorePreview";

/** Tiny live theme switcher for the "digital expansion" chapter. */
export function ThemeSwitcherMini() {
  const { t } = useI18n();
  const items = t.onlineStore.themes.items;
  const [theme, setTheme] = useState<ThemeKey>("fashion");
  const keys: ThemeKey[] = ["fashion", "electronics", "grocery"];
  return (
    <div className="rounded-[1.4rem] bg-white p-3 shadow-[var(--shadow-float)] ring-1 ring-ink/10">
      <div role="radiogroup" aria-label={t.onlineStore.builder.panels.theme} className="mb-3 flex flex-wrap gap-1.5">
        {keys.map((k) => (
          <button key={k} type="button" role="radio" aria-checked={theme === k} onClick={() => setTheme(k)} className={cn("flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors", theme === k ? "bg-ink text-cream" : "bg-ink/5 text-ink-soft hover:bg-ink/10")}>
            <span className="size-3 rounded-full" style={{ background: themePresets[k].accent }} aria-hidden="true" />
            {items[k].name}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl ring-1 ring-ink/10">
        <AnimatePresence mode="wait">
          <motion.div key={theme} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <StorePreview mini config={{ theme, accent: themePresets[theme].accent, font: themePresets[theme].font, banner: items[theme].banner, sections: ["hero", "collection"], columns: 3 }} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Auto-playing chat teaser for the "social selling" chapter (answers computed from sample stock). */
export function InboxTeaser() {
  const { t, locale } = useI18n();
  const sc = t.fcommerce.inbox.script;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const lines = [
    { from: "c", text: sc.q1 },
    { from: "a", text: interpolate(sc.a1, { price: fmtNumber(panjabi.price, "bn") }) },
    { from: "c", text: interpolate(sc.q2, { size: "L" }) },
    { from: "a", text: sc.checking },
    { from: "a", text: interpolate(sc.inStock, { size: "L", qty: fmtNumber(panjabi.stock.L, "bn") }) },
  ];
  const [n, setN] = useState(reduce ? lines.length : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setN((x) => (x >= lines.length + 2 ? 0 : x + 1)), 1200);
    return () => clearInterval(id);
  }, [inView, reduce, lines.length]);
  const shown = Math.min(n, lines.length);
  return (
    <div ref={ref} className="rounded-[1.4rem] bg-white p-4 shadow-[var(--shadow-float)] ring-1 ring-ink/10">
      <div className="flex min-h-[260px] flex-col justify-end gap-2" lang="bn" aria-live="off">
        <AnimatePresence initial={false}>
          {lines.slice(0, shown).map((l, i) => (
            <motion.p key={`${i}-${l.text}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn("max-w-[85%] rounded-2xl px-3.5 py-2 text-sm", l.from === "c" ? "ml-auto rounded-br-md bg-[#7c3aed] text-white" : "rounded-bl-md bg-ink/5")}>
              {l.text}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f5f2fb] px-3 py-2 text-xs">
        <span className="font-semibold text-[#5b21b6]">{t.fcommerce.inbox.productName}</span>
        <span className="font-latin">
          {fmtTaka(panjabi.price, locale)} · L: {fmtNumber(panjabi.stock.L, locale)}
        </span>
      </div>
    </div>
  );
}
