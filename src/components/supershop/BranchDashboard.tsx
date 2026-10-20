"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber } from "@/lib/format";
import { branchWeek, branches, locationStock, shopItems, shopMin, shopUnits, type BranchKey, type LocationKey, type ShopItem } from "@/content/demo-data";
import { SampleBadge } from "@/components/ui/Section";
import { AnimatedTaka } from "@/components/product/AppPreview";

type Selection = "all" | LocationKey;
const locations: LocationKey[] = ["dhanmondi", "mirpur", "uttara", "ctg", "warehouse"];
const minFor = (loc: LocationKey, item: ShopItem) => shopMin[item] * (loc === "warehouse" ? 5 : 1);

/**
 * Interactive multi-branch dashboard (sample data). Transfers really move stock between
 * locations in this demo's local state, so indicators update — nothing leaves the page.
 */
export function BranchDashboard({ compact = false }: { compact?: boolean }) {
  const { t, locale } = useI18n();
  const d = t.supershop.dashboard;
  const [sel, setSel] = useState<Selection>("all");
  const [stock, setStock] = useState(locationStock);
  const [transfers, setTransfers] = useState<{ id: number; from: LocationKey; to: LocationKey; item: ShopItem; qty: number }[]>([]);

  const chosen: BranchKey[] = sel === "all" ? branches.map((b) => b.key) : sel === "warehouse" ? [] : [sel];
  const rows = branches.filter((b) => chosen.includes(b.key));
  const sales = rows.reduce((a, b) => a + b.sales, 0);
  const orders = rows.reduce((a, b) => a + b.orders, 0);
  const onShift = rows.reduce((a, b) => a + b.onShift, 0);
  const staffTotal = rows.reduce((a, b) => a + b.staff, 0);
  const target = rows.reduce((a, b) => a + b.target, 0);
  const week = Array.from({ length: 7 }, (_, i) => chosen.reduce((a, k) => a + branchWeek[k][i], 0));
  const weekMax = Math.max(...week, 1);
  const weekMin = Math.min(...week);
  // Start the scale below the lowest day so real day-to-day differences are visible.
  const floor = weekMin * 0.75;

  return (
    <div className="overflow-hidden rounded-[1.6rem] bg-white shadow-[var(--shadow-float)] ring-1 ring-ink/10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-[#f6f1e6] px-5 py-3">
        <p className="font-bold text-ink">{d.title}</p>
        <SampleBadge>{t.common.sampleDataLong}</SampleBadge>
      </div>
      <div className="p-4 sm:p-6">
        <div role="radiogroup" aria-label={d.locationsLabel} className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {(["all", ...locations] as Selection[]).map((loc) => (
            <button
              key={loc}
              type="button"
              role="radio"
              aria-checked={sel === loc}
              onClick={() => setSel(loc)}
              className={cn(
                "relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                sel === loc ? "text-white" : "bg-ink/5 text-ink-soft hover:bg-ink/10",
              )}
            >
              {sel === loc && <motion.span layoutId={compact ? "br-c" : "br"} className="absolute inset-0 rounded-full bg-[#7c3a06]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative">{loc === "all" ? d.all : d.locations[loc]}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
            {sel === "warehouse" ? (
              <p className="mt-5 rounded-2xl bg-[#f8e7bf]/60 px-4 py-3 text-sm text-[#7c3a06]">{d.warehouseNote}</p>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Kpi label={d.sales}>
                  <AnimatedTaka value={sales} locale={locale} className="font-latin text-xl font-bold text-ink tabular-nums" />
                </Kpi>
                <Kpi label={d.orders}>
                  <span className="font-latin text-xl font-bold tabular-nums">{fmtNumber(orders, locale)}</span>
                </Kpi>
                <Kpi label={d.staffOnShift}>
                  <span className="font-latin text-xl font-bold tabular-nums">
                    {fmtNumber(onShift, locale)}
                    <span className="text-sm font-medium text-muted"> / {fmtNumber(staffTotal, locale)}</span>
                  </span>
                </Kpi>
                <Kpi label={d.target}>
                  <span className="font-latin text-xl font-bold tabular-nums">{fmtNumber(Math.round((sales / target) * 100), locale)}%</span>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-ink/10">
                    <motion.span className="block h-full rounded-full bg-leaf" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (sales / target) * 100)}%` }} transition={{ duration: 0.7 }} />
                  </span>
                </Kpi>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className={cn("mt-4 grid gap-4", !compact && "lg:grid-cols-[1fr_1.3fr]")}>
          {sel !== "warehouse" && (
            <div className="rounded-2xl border border-ink/10 p-4">
              <p className="text-sm font-semibold">{d.weekTitle}</p>
              <div className="mt-4 flex h-28 items-end gap-2">
                {week.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <motion.div
                      className={cn("w-full rounded-t-md", i === 6 ? "bg-[#b45309]" : "bg-[#f8e7bf]")}
                      initial={false}
                      animate={{ height: `${12 + ((v - floor) / (weekMax - floor || 1)) * 84}px` }}
                      transition={{ duration: 0.5, delay: i * 0.03 }}
                    />
                    <span className="text-[0.62rem] text-muted">{t.demo.days[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!compact && <StockTable stock={stock} sel={sel} />}
        </div>

        {!compact && <TransferForm stock={stock} setStock={setStock} transfers={transfers} setTransfers={setTransfers} />}
      </div>
    </div>
  );
}

function Kpi({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink/10 p-3.5">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function StockTable({ stock, sel }: { stock: Record<LocationKey, Record<ShopItem, number>>; sel: Selection }) {
  const { t, locale } = useI18n();
  const d = t.supershop.dashboard;
  const cols: LocationKey[] = sel === "all" ? locations : [sel];
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10">
      <p className="px-4 pt-3 text-sm font-semibold">{d.stockTitle}</p>
      <table className="mt-1 w-full min-w-[420px] text-sm">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th className="px-4 py-2 font-semibold">{t.demo.inventory.columns.product}</th>
            {cols.map((c) => (
              <th key={c} className="px-3 py-2 text-right font-semibold">
                {d.locations[c]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shopItems.map((item) => (
            <tr key={item} className="border-t border-ink/5">
              <td className="px-4 py-2.5">{t.demo.products[item]}</td>
              {cols.map((c) => {
                const v = stock[c][item];
                const low = v < minFor(c, item);
                return (
                  <td key={c} className="px-3 py-2.5 text-right tabular-nums">
                    <motion.span key={v} initial={{ backgroundColor: "rgba(74,222,128,0.35)" }} animate={{ backgroundColor: "rgba(74,222,128,0)" }} transition={{ duration: 1.2 }} className="inline-flex items-center gap-1.5 rounded-md px-1.5">
                      <span className={cn("size-1.5 rounded-full", low ? "bg-vermilion" : "bg-leaf")} aria-hidden="true" />
                      {fmtNumber(v, locale)}
                      {cols.length === 1 && <span className="text-xs text-muted">{t.demo.units[shopUnits[item]]}</span>}
                      <span className="sr-only">{low ? d.low : d.ok}</span>
                    </motion.span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="flex gap-4 px-4 py-2 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-vermilion" /> {d.low}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-leaf" /> {d.ok}
        </span>
      </p>
    </div>
  );
}

function TransferForm({
  stock,
  setStock,
  transfers,
  setTransfers,
}: {
  stock: Record<LocationKey, Record<ShopItem, number>>;
  setStock: React.Dispatch<React.SetStateAction<Record<LocationKey, Record<ShopItem, number>>>>;
  transfers: { id: number; from: LocationKey; to: LocationKey; item: ShopItem; qty: number }[];
  setTransfers: React.Dispatch<React.SetStateAction<{ id: number; from: LocationKey; to: LocationKey; item: ShopItem; qty: number }[]>>;
}) {
  const { t, locale } = useI18n();
  const d = t.supershop.dashboard;
  const tr = d.transfer;
  const id = useId();
  const [from, setFrom] = useState<LocationKey>("warehouse");
  const [to, setTo] = useState<LocationKey>("ctg");
  const [item, setItem] = useState<ShopItem>("milk");
  const [qty, setQty] = useState("40");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(qty);
    if (from === to) return setError(tr.same);
    if (!Number.isFinite(n) || n <= 0) return setError(tr.invalidQty);
    if (stock[from][item] < n) return setError(tr.insufficient);
    setError(null);
    setStock((s) => ({ ...s, [from]: { ...s[from], [item]: s[from][item] - n }, [to]: { ...s[to], [item]: s[to][item] + n } }));
    setTransfers((ts) => [{ id: Date.now(), from, to, item, qty: n }, ...ts].slice(0, 4));
  };

  const select = "h-11 w-full rounded-xl border border-ink/15 bg-white px-3 text-sm focus:border-leaf-deep focus:ring-4 focus:ring-leaf/15 focus:outline-none";
  return (
    <div className="mt-4 grid gap-4 rounded-2xl bg-[#f6f1e6] p-4 lg:grid-cols-[1.3fr_1fr]">
      <form onSubmit={submit} noValidate>
        <p className="text-sm font-semibold">{tr.title}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="text-xs font-semibold text-muted" htmlFor={`${id}-f`}>
            {tr.from}
            <select id={`${id}-f`} className={cn(select, "mt-1")} value={from} onChange={(e) => setFrom(e.target.value as LocationKey)}>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {d.locations[l]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-muted" htmlFor={`${id}-t`}>
            {tr.to}
            <select id={`${id}-t`} className={cn(select, "mt-1")} value={to} onChange={(e) => setTo(e.target.value as LocationKey)}>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {d.locations[l]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-muted" htmlFor={`${id}-i`}>
            {tr.item}
            <select id={`${id}-i`} className={cn(select, "mt-1")} value={item} onChange={(e) => setItem(e.target.value as ShopItem)}>
              {shopItems.map((s) => (
                <option key={s} value={s}>
                  {t.demo.products[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-muted" htmlFor={`${id}-q`}>
            {tr.qty}
            <input id={`${id}-q`} type="number" min={1} inputMode="numeric" className={cn(select, "mt-1")} value={qty} onChange={(e) => setQty(e.target.value)} />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="submit" className="h-11 rounded-full bg-[#7c3a06] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5e2c04]">
            {tr.create}
          </button>
          {error && (
            <p role="alert" className="text-sm text-vermilion">
              {error}
            </p>
          )}
        </div>
      </form>
      <ul className="space-y-2" aria-live="polite">
        {transfers.length === 0 && <li className="text-sm text-muted">{tr.empty}</li>}
        <AnimatePresence initial={false}>
          {transfers.map((x) => (
            <motion.li key={x.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="rounded-xl bg-white px-3.5 py-2.5 text-sm shadow-sm">
              <p className="font-semibold">
                {d.locations[x.from]} → {d.locations[x.to]}
              </p>
              <p className="text-muted">
                {t.demo.products[x.item]} · {fmtNumber(x.qty, locale)} {t.demo.units[shopUnits[x.item]]}
              </p>
              <p className="mt-1 text-xs font-semibold text-[#7c3a06]">{tr.draft}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

