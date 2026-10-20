"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, fmtTaka, interpolate } from "@/lib/format";
import { campaigns, leads as seedLeads, posts, socialOrders, type LeadStage, type OrderStage } from "@/content/demo-data";
import { SampleBadge } from "@/components/ui/Section";

const purple = "#7c3aed";
const card = "rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] ring-1 ring-ink/5 sm:p-5";

function Chips<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)} className={cn("rounded-full px-3 py-1.5 text-sm font-semibold transition-colors", value === o.value ? "bg-[#5b21b6] text-white" : "bg-ink/5 text-ink-soft hover:bg-ink/10")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Connected flow ---------------- */
export function CommerceFlow() {
  const { t, locale } = useI18n();
  const steps = t.fcommerce.flow.steps;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(reduce ? steps.length - 1 : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 1300);
    return () => clearInterval(id);
  }, [inView, reduce, steps.length]);
  return (
    <div ref={ref} className="relative">
      <ol className="relative grid gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {steps.map((s, i) => {
          const on = i <= active;
          const human = i === 3;
          return (
            <li key={s} className="relative">
              <motion.div
                animate={{ y: i === active ? -6 : 0 }}
                className={cn("flex h-full flex-col rounded-2xl p-4 ring-1 transition-colors duration-500", on ? (human ? "bg-marigold-soft ring-marigold/40" : "bg-[#ede4fd] ring-[#7c3aed]/30") : "bg-white ring-ink/10")}
              >
                <span className={cn("font-latin flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors", on ? (human ? "bg-marigold text-ink" : "bg-[#5b21b6] text-white") : "bg-ink/5 text-muted")}>{fmtNumber(i + 1, locale)}</span>
                <p className="mt-3 text-sm font-semibold">{s}</p>
              </motion.div>
              {i < steps.length - 1 && (
                <span className="absolute top-1/2 -right-2 z-10 hidden h-0.5 w-4 bg-ink/10 lg:block" aria-hidden="true">
                  <motion.span className="block h-full origin-left" style={{ background: purple }} animate={{ scaleX: i < active ? 1 : 0 }} transition={{ duration: 0.4 }} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------------- A: Content studio ---------------- */
export function ContentStudio() {
  const { t } = useI18n();
  const c = t.fcommerce.content;
  const [lang, setLang] = useState<"bn" | "banglish" | "en">("bn");
  const [tone, setTone] = useState<"friendly" | "offer">("friendly");
  const [shown, setShown] = useState<{ lang: typeof lang; tone: typeof tone }>({ lang: "bn", tone: "friendly" });
  const text = c.outputs[shown.lang][shown.tone];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={card}>
        <p className="text-sm font-semibold">{c.product}</p>
        <p className="mt-1 rounded-xl bg-ink/[0.04] px-3 py-2 text-sm">{t.fcommerce.inbox.productName}</p>
        <p className="mt-4 text-sm font-semibold">{c.language}</p>
        <div className="mt-1.5">
          <Chips label={c.language} value={lang} onChange={setLang} options={(["bn", "banglish", "en"] as const).map((v) => ({ value: v, label: c.languages[v] }))} />
        </div>
        <p className="mt-4 text-sm font-semibold">{c.tone}</p>
        <div className="mt-1.5">
          <Chips label={c.tone} value={tone} onChange={setTone} options={(["friendly", "offer"] as const).map((v) => ({ value: v, label: c.tones[v] }))} />
        </div>
        <button type="button" onClick={() => setShown({ lang, tone })} className="mt-5 h-11 rounded-full bg-[#5b21b6] px-5 text-sm font-semibold text-white hover:bg-[#4c1d95]">
          {c.generate}
        </button>
      </div>
      <div className={card}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-muted">{c.sponsoredless}</p>
          <SampleBadge>{t.common.demo}</SampleBadge>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="size-8 rounded-full bg-[#7A8B4A]/50" aria-hidden="true" />
          <p className="text-sm font-semibold">{c.page}</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={`${shown.lang}-${shown.tone}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-sm leading-relaxed" lang={shown.lang === "bn" ? "bn" : "en"} aria-live="polite">
            {text}
          </motion.p>
        </AnimatePresence>
        <div className="mt-3 flex aspect-[2/1] items-center justify-center rounded-xl bg-gradient-to-br from-[#e7ecd8] to-[#ede4fd]" aria-hidden="true">
          <svg viewBox="0 0 120 90" className="h-4/5">
            <path d="M50 10c4 6 16 6 20 0l18 9-6 16-8-4v48H46V31l-8 4-6-16Z" fill="#7A8B4A" fillOpacity="0.55" stroke="#17221C" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M60 14v34" stroke="#17221C" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="60" cy="24" r="1.4" fill="#17221C" />
            <circle cx="60" cy="32" r="1.4" fill="#17221C" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ---------------- B: Social calendar ---------------- */
export function SocialCalendar() {
  const { t } = useI18n();
  const s = t.fcommerce.social;
  const [filter, setFilter] = useState<"all" | "facebook" | "instagram">("all");
  const [sel, setSel] = useState<number | null>(2);
  const list = posts.filter((p) => filter === "all" || p.channel === filter);
  const chosen = sel !== null ? posts[sel] : null;
  const tone = { draft: "bg-ink/5 text-muted", scheduled: "bg-[#ede4fd] text-[#5b21b6]", published: "bg-leaf-soft text-leaf-ink" };
  return (
    <div className={card}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Chips label={s.filterLabel} value={filter} onChange={setFilter} options={(["all", "facebook", "instagram"] as const).map((v) => ({ value: v, label: s.filters[v] }))} />
        <SampleBadge>{t.common.sampleData}</SampleBadge>
      </div>
      <div className="no-scrollbar mt-4 grid grid-cols-7 gap-1.5 overflow-x-auto">
        {s.days.map((d, day) => (
          <div key={d} className="min-w-[84px] rounded-xl bg-ink/[0.03] p-1.5">
            <p className="px-1 text-center text-xs font-semibold text-muted">{d}</p>
            <div className="mt-1.5 space-y-1.5">
              {list
                .filter((p) => p.day === day)
                .map((p) => {
                  const idx = posts.indexOf(p);
                  return (
                    <button key={idx} type="button" aria-pressed={sel === idx} onClick={() => setSel(idx)} className={cn("w-full rounded-lg p-1.5 text-left text-[0.68rem] leading-snug transition-all", tone[p.status], sel === idx && "ring-2 ring-[#5b21b6]")}>
                      {s.posts[p.key]}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-[#f5f2fb] px-4 py-3 text-sm" aria-live="polite">
        {chosen ? (
          <p>
            <strong>{s.posts[chosen.key]}</strong> · {s.channelLabel}: {s.filters[chosen.channel]} · {s.statusLabel}: {s.statuses[chosen.status]}
          </p>
        ) : (
          <p className="text-muted">{s.selectHint}</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- C: Ads manager ---------------- */
export function AdsManager() {
  const { t, locale } = useI18n();
  const a = t.fcommerce.ads;
  const [sel, setSel] = useState<(typeof campaigns)[number]["key"]>("eid");
  const c = campaigns.find((x) => x.key === sel)!;
  const funnel = [
    { label: a.columns.reach, v: c.reach },
    { label: a.columns.messages, v: c.messages },
    { label: a.columns.orders, v: c.orders },
  ];
  return (
    <div className={card}>
      <div className="flex justify-end">
        <SampleBadge>{t.common.sampleData}</SampleBadge>
      </div>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="px-2 py-2 font-semibold" />
              {(["spend", "reach", "messages", "orders", "revenue"] as const).map((k) => (
                <th key={k} className="px-2 py-2 text-right font-semibold">
                  {a.columns[k]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((x) => (
              <tr key={x.key} className={cn("border-t border-ink/5", sel === x.key && "bg-[#f5f2fb]")}>
                <td className="px-2 py-2.5">
                  <button type="button" aria-pressed={sel === x.key} onClick={() => setSel(x.key)} className="font-semibold text-left underline-offset-4 hover:underline">
                    {a.names[x.key]}
                  </button>
                </td>
                <td className="font-latin px-2 py-2.5 text-right tabular-nums">{fmtTaka(x.spend, locale)}</td>
                <td className="font-latin px-2 py-2.5 text-right tabular-nums">{fmtNumber(x.reach, locale)}</td>
                <td className="font-latin px-2 py-2.5 text-right tabular-nums">{fmtNumber(x.messages, locale)}</td>
                <td className="font-latin px-2 py-2.5 text-right tabular-nums">{fmtNumber(x.orders, locale)}</td>
                <td className="font-latin px-2 py-2.5 text-right tabular-nums">{fmtTaka(x.revenue, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm font-semibold">
        {a.funnel} · {a.names[sel]}
      </p>
      <div className="mt-2 space-y-2">
        {funnel.map((f, i) => (
          <div key={f.label} className="flex items-center gap-3 text-sm">
            <span className="w-24 shrink-0 text-muted">{f.label}</span>
            <div className="h-6 flex-1 rounded-md bg-ink/5">
              <motion.div className="flex h-full items-center rounded-md px-2 text-xs font-semibold text-white" style={{ background: purple, opacity: 1 - i * 0.2 }} initial={false} animate={{ width: `${Math.max(14, Math.log10(f.v) / Math.log10(c.reach) * 100)}%` }} transition={{ duration: 0.5 }}>
                <span className="font-latin">{fmtNumber(f.v, locale)}</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm">
        {a.perTaka}: <strong className="font-latin">{fmtTaka(Math.round(c.revenue / c.spend), locale)}</strong>
      </p>
    </div>
  );
}

/* ---------------- D: Leads & CRM ---------------- */
const stages: LeadStage[] = ["new", "interested", "followUp", "won"];
export function LeadBoard() {
  const { t, locale } = useI18n();
  const c = t.fcommerce.crm;
  const [leads, setLeads] = useState(seedLeads.map((l) => ({ ...l, owner: l.id % 2 ? 0 : 1 })));
  const advance = (id: number) => setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage: stages[Math.min(3, stages.indexOf(l.stage) + 1)] } : l)));
  const assign = (id: number, owner: number) => setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, owner } : l)));
  return (
    <div className="no-scrollbar grid grid-cols-4 gap-3 overflow-x-auto pb-2">
      {stages.map((s) => (
        <div key={s} className="min-w-[200px] rounded-2xl bg-ink/[0.03] p-2.5">
          <p className="flex items-center justify-between px-1 text-sm font-semibold">
            {c.stages[s]}
            <span className="font-latin rounded-full bg-white px-2 text-xs text-muted">{fmtNumber(leads.filter((l) => l.stage === s).length, locale)}</span>
          </p>
          <ul className="mt-2 space-y-2">
            <AnimatePresence initial={false}>
              {leads
                .filter((l) => l.stage === s)
                .map((l) => (
                  <motion.li key={l.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="rounded-xl bg-white p-3 text-sm shadow-sm ring-1 ring-ink/5">
                    <p className="font-semibold">{l.name[locale]}</p>
                    <p className="text-xs text-muted">
                      {c.sources[l.source]} · <span className="font-latin">{fmtTaka(l.value, locale)}</span>
                    </p>
                    <label className="mt-2 block text-xs text-muted">
                      {c.assign}
                      <select value={l.owner} onChange={(e) => assign(l.id, Number(e.target.value))} className="mt-1 h-8 w-full rounded-lg border border-ink/15 bg-white px-2 text-xs">
                        {c.team.map((n, i) => (
                          <option key={n} value={i}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    {s !== "won" && (
                      <button type="button" onClick={() => advance(l.id)} className="mt-2 w-full rounded-lg bg-[#f5f2fb] py-1.5 text-xs font-semibold text-[#5b21b6] hover:bg-[#ede4fd]">
                        {c.move} →
                      </button>
                    )}
                  </motion.li>
                ))}
            </AnimatePresence>
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ---------------- F: Orders, retention, analytics ---------------- */
const orderStages: OrderStage[] = ["confirmed", "packed", "shipped", "delivered"];
export function OrdersRetention() {
  const { t, locale } = useI18n();
  const o = t.fcommerce.orders;
  const [orders, setOrders] = useState(socialOrders);
  const advance = (id: string) => setOrders((os) => os.map((x) => (x.id === id ? { ...x, stage: orderStages[Math.min(3, orderStages.indexOf(x.stage) + 1)] } : x)));
  const conv = campaigns.reduce((a, c) => a + c.orders, 0) / campaigns.reduce((a, c) => a + c.messages, 0);
  return (
    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <div className={cn(card, "overflow-x-auto")}>
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              {(["order", "customer", "amount", "stage", "payment"] as const).map((k) => (
                <th key={k} className="px-2 py-2 font-semibold">
                  {o.columns[k]}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((x) => (
              <tr key={x.id} className="border-t border-ink/5">
                <td className="font-latin px-2 py-2.5 text-muted">{x.id}</td>
                <td className="px-2 py-2.5">{x.customer[locale]}</td>
                <td className="font-latin px-2 py-2.5 tabular-nums">{fmtTaka(x.amount, locale)}</td>
                <td className="px-2 py-2.5">
                  <motion.span key={x.stage} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-semibold", x.stage === "delivered" ? "bg-leaf-soft text-leaf-ink" : "bg-[#ede4fd] text-[#5b21b6]")}>
                    {o.stages[x.stage]}
                  </motion.span>
                </td>
                <td className="px-2 py-2.5 text-xs">{x.paid ? o.paid : o.unpaid}</td>
                <td className="px-2 py-2.5 text-right">
                  {x.stage !== "delivered" && (
                    <button type="button" onClick={() => advance(x.id)} className="rounded-lg bg-ink/5 px-2 py-1 text-xs font-semibold hover:bg-ink/10" aria-label={`${o.advance}: ${x.id}`}>
                      →
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-4">
        <div className={card}>
          <p className="text-sm font-semibold">{o.retentionTitle}</p>
          <p className="font-latin mt-1 text-3xl font-bold text-[#5b21b6]">{fmtNumber(38, locale)}</p>
          <p className="text-sm text-muted">{interpolate(o.retentionBody, { n: fmtNumber(38, locale) })}</p>
        </div>
        <div className={card}>
          <p className="text-sm font-semibold">{o.conversionTitle}</p>
          <p className="font-latin mt-1 text-3xl font-bold text-[#5b21b6]">{fmtNumber(Math.round(conv * 1000) / 10, locale, 1)}%</p>
          <div className="mt-2 h-2 rounded-full bg-ink/5">
            <div className="h-full rounded-full" style={{ width: `${conv * 100}%`, background: purple }} />
          </div>
          <SampleBadge>{t.common.sampleData}</SampleBadge>
        </div>
      </div>
    </div>
  );
}
