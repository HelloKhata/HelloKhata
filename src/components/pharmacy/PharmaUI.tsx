"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, fmtTaka, interpolate } from "@/lib/format";
import { daysUntilDemo, pharmaBalances, pharmaItems, pharmaPeriods, pharmaToday, pharmaWeek, type PharmaId } from "@/content/demo-data";
import { AnimatedTaka } from "@/components/product/AppPreview";

export type Nav = "overview" | "sales" | "stock" | "purchases" | "reports";
const item = (id: PharmaId) => pharmaItems.find((p) => p.id === id)!;

/** "Tab. Paracetamol 500 mg" — medicine names stay in Latin script, as on Bangladeshi packs and prescriptions. */
export function MedName({ id, className }: { id: PharmaId; className?: string }) {
  const { t } = useI18n();
  const p = item(id);
  return (
    <span className={className}>
      <span className="text-muted">{t.pharmacy.ui.forms[p.form]} </span>
      <span lang="en" translate="no">
        {p.name}
        {p.strength && ` ${p.strength}`}
      </span>
    </span>
  );
}

export function stockState(id: PharmaId, stock?: number) {
  const p = item(id);
  const v = stock ?? p.stock;
  if (v <= 0) return "out" as const;
  if (daysUntilDemo(p.expiry) <= 60) return "expiring" as const;
  if (v < p.min) return "low" as const;
  return "inStock" as const;
}

export function StateBadge({ state }: { state: "inStock" | "low" | "out" | "expiring" }) {
  const { t } = useI18n();
  const cls = { inStock: "bg-leaf-soft text-leaf-ink", low: "bg-marigold-soft text-[#6b4a07]", out: "bg-vermilion-soft text-vermilion", expiring: "bg-[#fde8d8] text-[#9a3412]" }[state];
  return <span className={cn("inline-flex shrink-0 rounded-full px-2 py-0.5 text-[0.68rem] font-semibold", cls)}>{t.pharmacy.ui[state]}</span>;
}

/* ---------------- Window frame ---------------- */
export function PharmaWindow({ active, children, className }: { active: Nav; children: React.ReactNode; className?: string }) {
  const { t } = useI18n();
  const u = t.pharmacy.ui;
  const icons: Record<Nav, string> = {
    overview: "M3 3h6v8H3zM11 3h6v5h-6zM11 10h6v7h-6zM3 13h6v4H3z",
    sales: "M4 4h12v12H4zM7 8h6M7 11h4",
    stock: "M3 6l7-3 7 3v8l-7 3-7-3zM3 6l7 3 7-3M10 9v8",
    purchases: "M3 5h2l2 9h8l2-6H6M8 17a1 1 0 1 0 0-.1M15 17a1 1 0 1 0 0-.1",
    reports: "M4 16V9M8 16V5M12 16v-6M16 16V7",
  };
  return (
    <div className={cn("overflow-hidden rounded-[1.4rem] bg-white text-ink shadow-[0_2px_0_rgb(255_255_255/0.6)_inset,0_40px_80px_-32px_rgb(12_35_24/0.45)] ring-1 ring-ink/10", className)}>
      <div className="flex items-center gap-2 border-b border-ink/10 bg-[#f1f5f2] px-4 py-2">
        <span className="size-2.5 rounded-full bg-vermilion/50" />
        <span className="size-2.5 rounded-full bg-marigold/60" />
        <span className="size-2.5 rounded-full bg-leaf/50" />
        <span className="ml-2 truncate text-xs font-semibold text-ink-soft">
          <span className="font-latin font-extrabold" translate="no">
            Hello<span className="text-leaf-deep">Khata</span>
          </span>{" "}
          · {u.shop}
        </span>
        <span className="ml-auto shrink-0 rounded-full bg-marigold-soft px-2 py-0.5 text-[0.65rem] font-semibold text-[#6b4a07]">{u.sample}</span>
      </div>
      <div className="flex">
        <div className="hidden w-[4.25rem] shrink-0 flex-col items-center gap-1 border-r border-ink/5 bg-[#f7faf8] py-3 sm:flex" aria-hidden="true">
          {(Object.keys(icons) as Nav[]).map((k) => (
            <span key={k} className={cn("flex w-14 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[0.55rem] font-semibold", active === k ? "bg-leaf-soft text-leaf-ink" : "text-muted")}>
              <svg viewBox="0 0 20 20" className="size-4">
                <path d={icons[k]} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {u.nav[k]}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Overview (hero) ---------------- */
export function OverviewScreen() {
  const { t, locale } = useI18n();
  const u = t.pharmacy.ui;
  const [q, setQ] = useState("");
  const id = useId();
  const results = q.trim() ? pharmaItems.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 3) : [];
  const expiring = pharmaItems.filter((p) => daysUntilDemo(p.expiry) <= 60);
  const low = pharmaItems.filter((p) => p.stock < p.min).length;
  const max = Math.max(...pharmaWeek);
  return (
    <div className="space-y-3 p-3 sm:p-4">
      <div className="relative">
        <label htmlFor={id} className="sr-only">
          {u.searchLabel}
        </label>
        <input id={id} value={q} onChange={(e) => setQ(e.target.value)} placeholder={u.search} className="h-10 w-full rounded-xl border border-ink/10 bg-[#f7faf8] pr-3 pl-9 text-sm focus:border-leaf-deep focus:ring-4 focus:ring-leaf/15 focus:outline-none" autoComplete="off" />
        <svg viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true">
          <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M13.2 13.2 17 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <AnimatePresence>
          {q.trim() && (
            <motion.ul initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-0 top-11 z-10 rounded-xl bg-white p-1 shadow-lg ring-1 ring-ink/10" aria-live="polite">
              {results.length === 0 && <li className="px-3 py-2 text-xs text-muted">{u.noResults}</li>}
              {results.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs">
                  <MedName id={p.id} className="truncate font-semibold" />
                  <span className="flex items-center gap-2">
                    <span className="font-latin text-muted">{fmtNumber(p.stock, locale)}</span>
                    <StateBadge state={stockState(p.id)} />
                  </span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 rounded-xl bg-gradient-to-br from-[#15803d] to-[#0f5f2e] p-3 text-white">
          <p className="text-[0.68rem] text-white/75">{u.todaySales}</p>
          <p className="font-latin text-xl font-extrabold">{fmtTaka(pharmaToday.sales, locale)}</p>
          <p className="text-[0.65rem] text-white/75">{interpolate(u.bills, { n: fmtNumber(pharmaToday.bills, locale) })}</p>
        </div>
        <a href="#ocr" className="rounded-xl bg-[#eef6f1] p-3 transition-colors hover:bg-leaf-soft">
          <p className="text-[0.62rem] leading-tight text-muted">{u.rxQueue}</p>
          <p className="font-latin mt-1 text-xl font-extrabold text-leaf-ink">{fmtNumber(pharmaToday.rxPending, locale)}</p>
        </a>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-ink/10 p-2.5">
          <p className="flex justify-between text-[0.68rem] font-semibold">
            {u.expiringSoon}
            <span className="font-latin rounded-full bg-[#fde8d8] px-1.5 text-[#9a3412]">{fmtNumber(expiring.length, locale)}</span>
          </p>
          <ul className="mt-1.5 space-y-1">
            {expiring.map((p) => (
              <li key={p.id} className="flex justify-between gap-2 text-[0.66rem]">
                <MedName id={p.id} className="truncate" />
                <span className="shrink-0 text-[#9a3412]">{interpolate(u.daysLeft, { n: fmtNumber(daysUntilDemo(p.expiry), locale) })}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-ink/10 p-2.5">
          <p className="flex justify-between text-[0.68rem] font-semibold">
            {u.stockStatus}
            <span className="font-latin rounded-full bg-marigold-soft px-1.5 text-[#6b4a07]">
              {fmtNumber(low, locale)} {u.low}
            </span>
          </p>
          <p className="mt-2 text-[0.6rem] text-muted">{u.weekSales}</p>
          <div className="mt-1 flex h-10 items-end gap-1">
            {pharmaWeek.map((v, i) => (
              <span key={i} className={cn("flex-1 rounded-t", i === 6 ? "bg-leaf" : "bg-leaf-soft")} style={{ height: `${25 + ((v - 15000) / (max - 15000)) * 75}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Inventory table ---------------- */
export type InvFilter = "all" | "expiring" | "low";
export const inInvFilter = (id: PharmaId, f: InvFilter) => {
  const p = item(id);
  return f === "all" || (f === "expiring" ? daysUntilDemo(p.expiry) <= 60 : p.stock < p.min);
};

/** Quantity against the minimum level: the tick marks the minimum. */
export function StockMeter({ id, dark, className }: { id: PharmaId; dark?: boolean; className?: string }) {
  const p = item(id);
  const max = Math.max(p.stock, p.min * 2);
  const low = p.stock < p.min;
  return (
    <span className={cn("relative block h-1.5 overflow-hidden rounded-full", dark ? "bg-white/12" : "bg-ink/8", className)} aria-hidden="true">
      <motion.span className={cn("absolute inset-y-0 left-0 rounded-full", low ? "bg-[#d99a1e]" : "bg-[#0e7c86]")} initial={{ width: 0 }} whileInView={{ width: `${(p.stock / max) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
      <span className={cn("absolute inset-y-0 w-0.5", dark ? "bg-cream/70" : "bg-ink/40")}style={{ left: `${(p.min / max) * 100}%` }} />
    </span>
  );
}

export function InventoryTable({ filter, selected, onSelect }: { filter: InvFilter; selected?: PharmaId | null; onSelect?: (id: PharmaId) => void }) {
  const { t, locale } = useI18n();
  const inv = t.pharmacy.inventory;
  const u = t.pharmacy.ui;
  const dateFmt = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const list = pharmaItems.filter((p) => inInvFilter(p.id, filter));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="text-left text-xs text-muted">
            {(["medicine", "batch", "expiry", "stock", "status"] as const).map((c) => (
              <th key={c} className={cn("px-3 py-2.5 font-semibold", c === "stock" && "text-right")}>
                {inv.columns[c]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {list.map((p) => {
              const days = daysUntilDemo(p.expiry);
              const on = selected === p.id;
              return (
                <motion.tr
                  key={p.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => onSelect?.(p.id)}
                  className={cn("cursor-pointer border-t border-ink/5 transition-colors", on ? "bg-[#e3f4f4]" : "hover:bg-[#f4f8f6]")}
                >
                  <td className={cn("relative px-3 py-2.5 font-semibold", on && "before:absolute before:inset-y-1.5 before:left-0 before:w-1 before:rounded-full before:bg-[#0e7c86]")}>
                    <button type="button" aria-pressed={on} onClick={(e) => (e.stopPropagation(), onSelect?.(p.id))} className="rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e7c86]">
                      <MedName id={p.id} />
                    </button>
                  </td>
                  <td className="font-latin px-3 py-2.5 whitespace-nowrap text-muted" translate="no">
                    {p.batch}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="block">{dateFmt.format(new Date(p.expiry))}</span>
                    {days <= 60 && <span className="text-xs font-semibold text-[#c2410c]">{interpolate(u.daysLeft, { n: fmtNumber(days, locale) })}</span>}
                  </td>
                  <td className="font-latin px-3 py-2.5 text-right tabular-nums">
                    {fmtNumber(p.stock, locale)} <span className="text-xs text-muted">{u.units[p.unit]}</span>
                    <StockMeter id={p.id} className="mt-1.5 ml-auto w-16" />
                  </td>
                  <td className="px-3 py-2.5">
                    <StateBadge state={stockState(p.id)} />
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- POS ---------------- */
export function PosScreen({ rxItems = [] }: { rxItems?: PharmaId[] }) {
  const { t, locale } = useI18n();
  const u = t.pharmacy.ui;
  const ps = t.pharmacy.pos;
  const id = useId();
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<{ id: PharmaId; qty: number }[]>([{ id: "omeprazole", qty: 1 }]);
  const [pay, setPay] = useState<"cash" | "mobile" | "due">("cash");
  const [history, setHistory] = useState<{ n: number; total: number; pay: "cash" | "mobile" | "due"; items: number }[]>([]);
  const [toast, setToast] = useState(false);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (s ? pharmaItems.filter((p) => p.name.toLowerCase().includes(s)) : pharmaItems).slice(0, 5);
  }, [q]);
  const add = (pid: PharmaId) => setCart((c) => (c.some((x) => x.id === pid) ? c.map((x) => (x.id === pid ? { ...x, qty: x.qty + 1 } : x)) : [...c, { id: pid, qty: 1 }]));
  const step = (pid: PharmaId, d: number) => setCart((c) => c.flatMap((x) => (x.id !== pid ? [x] : x.qty + d <= 0 ? [] : [{ ...x, qty: Math.min(99, x.qty + d) }])));
  const total = cart.reduce((s, x) => s + item(x.id).price * x.qty, 0);
  const record = () => {
    if (!cart.length) return;
    setHistory((h) => [{ n: 1064 + h.length, total, pay, items: cart.reduce((s, x) => s + x.qty, 0) }, ...h].slice(0, 3));
    setCart([]);
    setToast(true);
    setTimeout(() => setToast(false), 1600);
  };

  return (
    <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
      <div className="space-y-3 border-ink/5 p-4 md:border-r">
        <div>
          <label htmlFor={id} className="sr-only">
            {u.searchLabel}
          </label>
          <input id={id} value={q} onChange={(e) => setQ(e.target.value)} placeholder={u.search} autoComplete="off" className="h-10 w-full rounded-xl border border-ink/10 bg-[#f7faf8] px-3 text-sm focus:border-leaf-deep focus:ring-4 focus:ring-leaf/15 focus:outline-none" />
        </div>
        <div>
          <p className="text-xs font-semibold text-leaf-ink">{ps.rxTitle}</p>
          {rxItems.length ? (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {rxItems.map((r) => (
                <button key={r} type="button" onClick={() => setQ(item(r).name)} className="rounded-full bg-leaf-soft px-2.5 py-1 text-xs font-semibold text-leaf-ink hover:bg-leaf/20">
                  <span lang="en" translate="no">
                    {item(r).name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted">{ps.rxEmpty}</p>
          )}
        </div>
        <ul className="divide-y divide-ink/5" aria-live="polite">
          {results.length === 0 && <li className="py-3 text-sm text-muted">{u.noResults}</li>}
          {results.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="min-w-0">
                <MedName id={p.id} className="block truncate font-semibold" />
                <span className="font-latin text-xs text-muted">
                  {fmtTaka(p.price, locale)} {interpolate(u.perUnit, { unit: u.units[p.unit] })} · {fmtNumber(p.stock, locale)}
                </span>
              </span>
              <button type="button" onClick={() => add(p.id)} disabled={p.stock <= 0} className="shrink-0 rounded-full bg-leaf-deep px-3 py-1 text-xs font-semibold text-white hover:bg-leaf-ink disabled:opacity-40">
                + {u.add}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative flex flex-col gap-3 bg-[#f7faf8] p-4">
        <p className="text-sm font-semibold">{u.cart}</p>
        <ul className="min-h-[96px] space-y-2">
          {cart.length === 0 && <li className="text-sm text-muted">{u.emptyCart}</li>}
          <AnimatePresence initial={false}>
            {cart.map((x) => (
              <motion.li key={x.id} layout initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-ink/5">
                <MedName id={x.id} className="min-w-0 truncate text-xs font-semibold" />
                <span className="flex shrink-0 items-center gap-1.5">
                  <button type="button" onClick={() => step(x.id, -1)} aria-label={u.decrease} className="flex size-6 items-center justify-center rounded-full bg-ink/5 font-bold">
                    −
                  </button>
                  <span className="font-latin w-5 text-center text-xs font-bold">{fmtNumber(x.qty, locale)}</span>
                  <button type="button" onClick={() => step(x.id, 1)} aria-label={u.increase} className="flex size-6 items-center justify-center rounded-full bg-leaf-deep font-bold text-white">
                    +
                  </button>
                  <span className="font-latin w-14 text-right text-xs font-semibold">{fmtTaka(item(x.id).price * x.qty, locale)}</span>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <div role="radiogroup" aria-label={u.payment} className="grid grid-cols-3 gap-1.5">
          {(["cash", "mobile", "due"] as const).map((m) => (
            <button key={m} type="button" role="radio" aria-checked={pay === m} onClick={() => setPay(m)} className={cn("rounded-lg py-1.5 text-xs font-semibold", pay === m ? "bg-ink text-cream" : "bg-white text-ink-soft ring-1 ring-ink/10")}>
              {u[m]}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-ink/10 pt-2">
          <span className="text-sm text-muted">{u.total}</span>
          <AnimatedTaka value={total} locale={locale} className="font-latin text-xl font-extrabold text-leaf-deep" />
        </div>
        <button type="button" onClick={record} disabled={!cart.length} className="h-10 rounded-full bg-leaf-deep text-sm font-semibold text-white hover:bg-leaf-ink disabled:opacity-40">
          {u.recordSale}
        </button>
        {history.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted">{u.history}</p>
            <ul className="mt-1 space-y-1">
              {history.map((h) => (
                <motion.li key={h.n} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between text-xs">
                  <span className="font-latin text-muted">#{h.n}</span>
                  <span>{u[h.pay]}</span>
                  <span className="font-latin font-semibold">{fmtTaka(h.total, locale)}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
        <AnimatePresence>
          {toast && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="absolute inset-x-4 top-3 rounded-xl bg-ink px-3 py-2 text-center text-xs font-semibold text-cream">
              {ps.recorded}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- Reports ---------------- */
export function ReportsScreen() {
  const { t, locale } = useI18n();
  const r = t.pharmacy.reports;
  const [period, setPeriod] = useState<keyof typeof pharmaPeriods>("week");
  const [view, setView] = useState<"overview" | "inventory" | "balances">("overview");
  const d = pharmaPeriods[period];
  const gross = d.revenue - d.cogs;
  const net = gross - d.expenses;
  const invCost = pharmaItems.reduce((s, p) => s + p.cost * p.stock, 0);
  const invRetail = pharmaItems.reduce((s, p) => s + p.price * p.stock, 0);
  const max = Math.max(...pharmaWeek);
  const Seg = <T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) => (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap rounded-full bg-ink/5 p-1">
      {options.map(([k, l]) => (
        <button key={k} type="button" role="radio" aria-checked={value === k} onClick={() => onChange(k)} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm", value === k ? "bg-white text-ink shadow-sm" : "text-muted")}>
          {l}
        </button>
      ))}
    </div>
  );
  const rows: [string, number, string][] = [
    [r.revenue, d.revenue, "text-ink"],
    [r.cogs, -d.cogs, "text-muted"],
    [r.gross, gross, "text-ink"],
    [r.expenses, -d.expenses, "text-muted"],
    [r.net, net, "text-leaf-deep"],
  ];
  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap gap-2">
        <Seg label={r.viewLabel} value={view} onChange={setView} options={(["overview", "inventory", "balances"] as const).map((k) => [k, r.views[k]])} />
        {view === "overview" && <Seg label={r.periodLabel} value={period} onChange={setPeriod} options={(["today", "week", "month"] as const).map((k) => [k, r.periods[k]])} />}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={view + period} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {view === "overview" && (
            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <ul className="divide-y divide-ink/5 rounded-xl border border-ink/10 px-3">
                {rows.map(([l, v, c], i) => (
                  <li key={l} className={cn("flex justify-between py-2 text-sm", (i === 2 || i === 4) && "font-bold")}>
                    <span>{l}</span>
                    <span className={cn("font-latin tabular-nums", c)}>
                      {v < 0 && "− "}
                      <AnimatedTaka value={Math.abs(v)} locale={locale} />
                    </span>
                  </li>
                ))}
              </ul>
              <div className="rounded-xl border border-ink/10 p-3">
                <p className="text-xs font-semibold text-muted">{r.trend}</p>
                <div className="mt-3 flex h-28 items-end gap-1.5">
                  {pharmaWeek.map((v, i) => (
                    <motion.span key={i} className={cn("flex-1 rounded-t-md", i === 6 ? "bg-leaf" : "bg-leaf-soft")} initial={{ height: 0 }} animate={{ height: `${25 + ((v - 15000) / (max - 15000)) * 75}%` }} transition={{ delay: i * 0.04 }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {view === "inventory" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-leaf-soft/60 p-4">
                <p className="text-xs text-muted">{r.inventoryValue}</p>
                <p className="font-latin text-2xl font-extrabold text-leaf-ink">{fmtTaka(Math.round(invCost), locale)}</p>
                <p className="text-xs text-muted">{interpolate(r.items, { n: fmtNumber(pharmaItems.length, locale) })}</p>
              </div>
              <div className="rounded-xl border border-ink/10 p-4">
                <p className="text-xs text-muted">{r.inventoryRetail}</p>
                <p className="font-latin text-2xl font-extrabold">{fmtTaka(Math.round(invRetail), locale)}</p>
              </div>
            </div>
          )}
          {view === "balances" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-vermilion-soft/50 p-4">
                <p className="text-xs text-muted">{r.customerDues}</p>
                <p className="font-latin text-2xl font-extrabold text-vermilion">{fmtTaka(pharmaBalances.customerDues, locale)}</p>
              </div>
              <div className="rounded-xl bg-marigold-soft/60 p-4">
                <p className="text-xs text-muted">{r.supplierBalances}</p>
                <p className="font-latin text-2xl font-extrabold text-[#6b4a07]">{fmtTaka(pharmaBalances.supplierOwed, locale)}</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <p className="text-xs text-muted">{r.note}</p>
    </div>
  );
}
