"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, interpolate } from "@/lib/format";
import { demoToday, medicines } from "@/content/demo-data";
import { SampleBadge } from "@/components/ui/Section";

const daysUntil = (iso: string) => Math.round((Date.parse(iso) - Date.parse(demoToday)) / 86_400_000);

/** Batch and expiry view with a working "expiring within 60 days" filter (sample data). */
export function PharmacyDemo({ compact = false }: { compact?: boolean }) {
  const { t, locale } = useI18n();
  const d = t.pharmacyDemo;
  const id = useId();
  const [soonOnly, setSoonOnly] = useState(compact);
  const dateFmt = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const list = medicines.filter((m) => !soonOnly || daysUntil(m.expiry) <= 60);
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] ring-1 ring-ink/5 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold">{d.title}</p>
        {!compact && (
          <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
            <button id={id} type="button" role="switch" aria-checked={soonOnly} aria-label={d.filter} onClick={() => setSoonOnly((v) => !v)} className={cn("relative h-6 w-11 rounded-full transition-colors", soonOnly ? "bg-[#0b5960]" : "bg-ink/15")}>
              <motion.span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow" animate={{ x: soonOnly ? 20 : 0 }} />
            </button>
            {d.filter}
          </label>
        )}
        <SampleBadge>{t.common.sampleData}</SampleBadge>
      </div>
      <ul className="mt-3 divide-y divide-ink/5">
        <AnimatePresence initial={false}>
          {list.map((m) => {
            const days = daysUntil(m.expiry);
            const soon = days <= 60;
            return (
              <motion.li key={m.key} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span>
                  <span className="block font-semibold">{d.names[m.key]}</span>
                  <span className="font-latin text-xs text-muted">
                    {d.columns.batch}: {m.batch} · {fmtNumber(m.stock, locale)} {t.demo.units[m.unit]}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-xs text-muted">{dateFmt.format(new Date(m.expiry))}</span>
                  <span className={cn("mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-semibold", soon ? "bg-vermilion-soft text-vermilion" : "bg-[#d5f1f2] text-[#0b5960]")}>{interpolate(d.daysLeft, { n: fmtNumber(days, locale) })}</span>
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
