"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber } from "@/lib/format";
import { moduleStatus } from "@/content/capabilities";
import { StatusBadge } from "@/components/ui/Section";

/* ---------------- Custom domain preview ---------------- */
export function DomainDemo() {
  const { t, locale } = useI18n();
  const d = t.onlineStore.domain;
  const id = useId();
  const [value, setValue] = useState("");
  const [shown, setShown] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const ok = /^(?!-)[a-z0-9-]{1,63}(\.[a-z0-9-]{1,63})*\.[a-z]{2,}$/.test(v);
    setError(!ok);
    setShown(ok ? v : null);
  };
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
      <form onSubmit={submit} noValidate className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={id} className="text-sm font-semibold">
            {d.label}
          </label>
          <input id={id} value={value} onChange={(e) => setValue(e.target.value)} placeholder={d.placeholder} aria-invalid={error} aria-describedby={error ? `${id}-e` : undefined} className="font-latin mt-1.5 h-11 w-full rounded-xl border border-ink/15 px-3 focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15 focus:outline-none" />
        </div>
        <button type="submit" className="h-11 rounded-full bg-[#1d4ed8] px-5 text-sm font-semibold text-white hover:bg-[#1e40af]">
          {d.check}
        </button>
      </form>
      {error && (
        <p id={`${id}-e`} className="mt-2 text-sm text-vermilion">
          {d.invalid}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f3f4f6] px-3 py-2">
        <svg viewBox="0 0 20 20" className="size-4 text-muted" aria-hidden="true">
          <path d="M6 9V7a4 4 0 1 1 8 0v2M5 9h10v8H5z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <motion.span key={shown ?? "none"} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="font-latin truncate text-sm font-semibold text-[#1d4ed8]">
          https://{shown ?? t.onlineStore.story.domain}
        </motion.span>
      </div>
      <ol className="mt-4 space-y-2">
        {d.steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-sm">
            <span className="font-latin flex size-6 shrink-0 items-center justify-center rounded-full bg-[#dbe6fe] text-xs font-bold text-[#1d4ed8]">{fmtNumber(i + 1, locale)}</span>
            {s}
          </li>
        ))}
      </ol>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold">{d.status}:</span>
        <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-xs font-semibold text-muted">{d.notConnected}</span>
        <StatusBadge status={moduleStatus.customDomain} label={t.status[moduleStatus.customDomain]} />
      </p>
    </div>
  );
}

/* ---------------- Checkout & payment options ---------------- */
export function CheckoutDemo() {
  const { t } = useI18n();
  const p = t.onlineStore.payments;
  const [method, setMethod] = useState<"cod" | "mfs" | "card">("cod");
  const st = moduleStatus.payments;
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
      <div role="radiogroup" aria-label={p.title} className="space-y-2">
        {(["cod", "mfs", "card"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={method === m}
            onClick={() => setMethod(m)}
            className={cn("flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors", method === m ? "border-[#2563eb] bg-[#eef3fd]" : "border-ink/10 hover:border-ink/25")}
          >
            <span className="flex items-center gap-3">
              <span className={cn("flex size-4 items-center justify-center rounded-full border-2", method === m ? "border-[#2563eb]" : "border-ink/30")}>{method === m && <span className="size-2 rounded-full bg-[#2563eb]" />}</span>
              <span className="font-semibold">{p.methods[m]}</span>
            </span>
            <StatusBadge status={st} label={t.status[st]} />
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">{p.note}</p>
    </div>
  );
}

/* ---------------- Courier journey ---------------- */
const stages = ["placed", "packed", "handedOver", "inTransit", "delivered"] as const;
export function CourierDemo() {
  const { t } = useI18n();
  const c = t.onlineStore.courier;
  const [at, setAt] = useState(1);
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-latin font-semibold">{c.order}</p>
        <StatusBadge status={moduleStatus.courier} label={t.status[moduleStatus.courier]} />
      </div>
      <ol className="relative mt-5 space-y-4 pl-8" aria-live="polite">
        <span className="absolute top-2 bottom-2 left-[0.6rem] w-0.5 bg-ink/10" aria-hidden="true" />
        <motion.span className="absolute top-2 left-[0.6rem] w-0.5 origin-top bg-[#2563eb]" aria-hidden="true" animate={{ height: `${(at / (stages.length - 1)) * 92}%` }} transition={{ duration: 0.5 }} />
        {stages.map((s, i) => (
          <li key={s} className="relative">
            <motion.span
              className={cn("absolute top-1 -left-8 flex size-5 items-center justify-center rounded-full border-2", i <= at ? "border-[#2563eb] bg-[#2563eb]" : "border-ink/20 bg-white")}
              animate={i === at ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {i < at && (
                <svg viewBox="0 0 20 20" className="size-3 text-white" aria-hidden="true">
                  <path d="M4 10.5l3.6 3.4L16 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </motion.span>
            <p className={cn("text-sm", i <= at ? "font-semibold text-ink" : "text-muted")}>{c.stages[s]}</p>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex gap-2">
        <button type="button" disabled={at >= stages.length - 1} onClick={() => setAt((a) => a + 1)} className="h-10 rounded-full bg-[#1d4ed8] px-4 text-sm font-semibold text-white disabled:opacity-40">
          {c.next}
        </button>
        <button type="button" onClick={() => setAt(0)} className="h-10 rounded-full bg-ink/5 px-4 text-sm font-semibold">
          {c.reset}
        </button>
      </div>
      <p className="mt-4 text-sm text-muted">{c.note}</p>
    </div>
  );
}
