"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, interpolate } from "@/lib/format";
import { smsSegments, staff } from "@/content/demo-data";
import { SampleBadge } from "@/components/ui/Section";

/* ---------------- HRM ---------------- */
export function HrmTable() {
  const { t, locale } = useI18n();
  const h = t.supershop.hrm;
  const [onlyOn, setOnlyOn] = useState(false);
  const list = onlyOn ? staff.filter((s) => s.onShift) : staff;
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] ring-1 ring-ink/5 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label={h.filterLabel} className="inline-flex rounded-full bg-ink/5 p-1">
          {[false, true].map((v) => (
            <button
              key={String(v)}
              type="button"
              role="radio"
              aria-checked={onlyOn === v}
              onClick={() => setOnlyOn(v)}
              className={cn("rounded-full px-3 py-1.5 text-sm font-semibold transition-colors", onlyOn === v ? "bg-white text-ink shadow-sm" : "text-muted")}
            >
              {v ? h.onlyOn : h.allStaff}
            </button>
          ))}
        </div>
        <SampleBadge>{t.common.sampleData}</SampleBadge>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              {(["name", "role", "location", "shift", "status"] as const).map((c) => (
                <th key={c} className="px-2 py-2 font-semibold">
                  {h.columns[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {list.map((s) => (
                <motion.tr key={s.name.en} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-t border-ink/5">
                  <td className="px-2 py-2.5 font-semibold">{s.name[locale]}</td>
                  <td className="px-2 py-2.5">{h.roles[s.role]}</td>
                  <td className="px-2 py-2.5">{t.supershop.dashboard.locations[s.branch]}</td>
                  <td className="px-2 py-2.5">{h.shifts[s.shift]}</td>
                  <td className="px-2 py-2.5">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", s.onShift ? "bg-leaf-soft text-leaf-ink" : "bg-ink/5 text-muted")}>{s.onShift ? h.on : h.off}</span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Bulk SMS ---------------- */
/** Real SMS segmentation maths: Unicode (Bangla) 70/67, GSM-7 160/153. */
function smsParts(text: string) {
  const unicode = /[^\u0000-\u007F]/.test(text);
  const len = text.length;
  const parts = len === 0 ? 0 : unicode ? (len <= 70 ? 1 : Math.ceil(len / 67)) : len <= 160 ? 1 : Math.ceil(len / 153);
  return { unicode, len, parts };
}

export function BulkSmsComposer() {
  const { t, locale } = useI18n();
  const m = t.supershop.sms;
  const id = useId();
  const [segment, setSegment] = useState<(typeof smsSegments)[number]["key"]>("repeat");
  const [text, setText] = useState(m.defaultMessage);
  const [tried, setTried] = useState(false);
  const { unicode, len, parts } = smsParts(text);
  const recipients = smsSegments.find((s) => s.key === segment)!.count;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] ring-1 ring-ink/5 sm:p-5">
      <p className="text-sm font-semibold">{m.segmentLabel}</p>
      <div role="radiogroup" aria-label={m.segmentLabel} className="mt-2 flex flex-wrap gap-2">
        {smsSegments.map((s) => (
          <button
            key={s.key}
            type="button"
            role="radio"
            aria-checked={segment === s.key}
            onClick={() => setSegment(s.key)}
            className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors", segment === s.key ? "bg-ink text-cream" : "bg-ink/5 text-ink-soft hover:bg-ink/10")}
          >
            {m.segments[s.key]} · {fmtNumber(s.count, locale)}
          </button>
        ))}
      </div>
      <label htmlFor={id} className="mt-4 block text-sm font-semibold">
        {m.messageLabel}
      </label>
      <textarea
        id={id}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={480}
        className="mt-1.5 w-full rounded-xl border border-ink/15 p-3 focus:border-leaf-deep focus:ring-4 focus:ring-leaf/15 focus:outline-none"
      />
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4" aria-live="polite">
        {[
          interpolate(m.chars, { n: fmtNumber(len, locale) }),
          interpolate(m.parts, { n: fmtNumber(parts, locale) }),
          interpolate(m.recipients, { n: fmtNumber(recipients, locale) }),
          interpolate(m.total, { n: fmtNumber(parts * recipients, locale) }),
        ].map((v, i) => (
          <div key={i} className={cn("rounded-xl px-3 py-2", i === 3 ? "bg-[#f8e7bf] font-semibold text-[#7c3a06]" : "bg-ink/[0.04]")}>
            {v}
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs text-muted">{unicode ? m.unicodeNote : m.gsmNote}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setTried(true)} className="h-11 rounded-full bg-[#7c3a06] px-5 text-sm font-semibold text-white hover:bg-[#5e2c04]">
          {m.send}
        </button>
        {tried && (
          <p role="status" className="text-sm font-semibold text-[#7c3a06]">
            {m.demoNote}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- Role-based access ---------------- */
const perms = ["viewAll", "reports", "stock", "transfer", "pos", "staff", "sms", "settings"] as const;
const matrix: Record<"owner" | "manager" | "cashier", Record<(typeof perms)[number], boolean>> = {
  owner: { viewAll: true, reports: true, stock: true, transfer: true, pos: true, staff: true, sms: true, settings: true },
  manager: { viewAll: false, reports: true, stock: true, transfer: true, pos: true, staff: true, sms: false, settings: false },
  cashier: { viewAll: false, reports: false, stock: false, transfer: false, pos: true, staff: false, sms: false, settings: false },
};

export function RoleMatrix() {
  const { t } = useI18n();
  const r = t.supershop.roles;
  const [role, setRole] = useState<keyof typeof matrix>("manager");
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] ring-1 ring-ink/5 sm:p-5">
      <div role="tablist" aria-label={r.title} className="flex flex-wrap gap-2">
        {(Object.keys(matrix) as (keyof typeof matrix)[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={role === k}
            onClick={() => setRole(k)}
            className={cn("rounded-full px-4 py-2 text-sm font-semibold transition-colors", role === k ? "bg-ink text-cream" : "bg-ink/5 text-ink-soft hover:bg-ink/10")}
          >
            {r.list[k]}
          </button>
        ))}
      </div>
      <ul role="tabpanel" className="mt-4 grid gap-2 sm:grid-cols-2">
        {perms.map((p, i) => {
          const ok = matrix[role][p];
          return (
            <motion.li
              key={`${role}-${p}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn("flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm", ok ? "bg-leaf-soft/70" : "bg-ink/[0.04] text-muted")}
            >
              {r.permissions[p]}
              <span className={cn("flex items-center gap-1.5 text-xs font-semibold", ok ? "text-leaf-ink" : "text-muted")}>
                <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
                  {ok ? <path d="M4 10.5l3.6 3.4L16 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
                </svg>
                {ok ? r.allowed : r.denied}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
