"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtDigits, fmtNumber, fmtPercent, fmtTaka, interpolate } from "@/lib/format";
import { customerDues, lowStock, monthlyOverview, products, recentSales, salesByRange, today, topToday, weekSales } from "@/content/demo-data";
import { SampleBadge } from "@/components/ui/Section";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { AppScreen, PreviewNav, type ScreenKey } from "./AppScreens";

export type View = "dashboard" | "sales" | "inventory" | "reports" | ScreenKey;

/** The real HelloKhata menu; every item opens a screen in this preview. */
type NavItemKey = keyof Dict["demo"]["appNav"]["items"];
type NavGroupKey = keyof Dict["demo"]["appNav"]["groups"];
type NavGroup = { key: NavGroupKey; view?: View; icon: string; items?: { key: NavItemKey; view: View }[] };
const appNav: NavGroup[] = [
  { key: "dashboard", view: "dashboard", icon: "M3 3h6v8H3zM11 3h6v5h-6zM11 10h6v7h-6zM3 13h6v4H3z" },
  { key: "sales", icon: "M3 15l4-5 3 3 6-7M12 6h4v4", items: [{ key: "pos", view: "pos" }, { key: "salesList", view: "sales" }, { key: "quotations", view: "quotations" }, { key: "salesReturn", view: "salesReturn" }] },
  { key: "purchases", icon: "M3 4h2l2 9h8l2-6H6M8 17a1 1 0 1 0 0-.1M15 17a1 1 0 1 0 0-.1", items: [{ key: "newPurchase", view: "newPurchase" }, { key: "purchaseList", view: "purchaseList" }, { key: "purchaseReturn", view: "purchaseReturn" }] },
  { key: "parties", icon: "M7 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 17c0-3 2.2-5 5-5s5 2 5 5M13 4a3 3 0 0 1 0 5M15 12c1.8.6 3 2.3 3 5", items: [{ key: "newParty", view: "newParty" }, { key: "partiesList", view: "partiesList" }, { key: "paymentIn", view: "paymentIn" }, { key: "paymentOut", view: "paymentOut" }] },
  { key: "inventory", icon: "M3 6l7-3 7 3v8l-7 3-7-3zM3 6l7 3 7-3M10 9v8", items: [{ key: "addItem", view: "addItem" }, { key: "inventoryList", view: "inventory" }, { key: "batches", view: "batches" }, { key: "warehouse", view: "warehouse" }, { key: "stockAdjustment", view: "stockAdjustment" }, { key: "stockTransfer", view: "stockTransfer" }] },
  { key: "finance", icon: "M3 6h14v10H3zM3 9h14M13 13h2", items: [{ key: "income", view: "income" }, { key: "expenses", view: "expenses" }, { key: "depositWithdrawal", view: "depositWithdrawal" }] },
  { key: "reports", view: "reports", icon: "M4 16V9M8 16V5M12 16v-6M16 16V7" },
];
const groupOf = (v: View) => appNav.find((g) => g.view === v || g.items?.some((i) => i.view === v))!;
/** Menu label for a preview screen, plus its section when it sits inside one. */
function useViewLabel() {
  const { t } = useI18n();
  const n = t.demo.appNav;
  return (v: View) => {
    const g = groupOf(v);
    const item = g.items?.find((i) => i.view === v);
    return { title: item ? n.items[item.key] : n.groups[g.key], section: item ? n.groups[g.key] : null };
  };
}

/** The sidebar menu: sections expand one at a time, like the app. */
function NavTree({ view, open, setOpen, select, controls, layoutKey }: { view: View; open: NavGroupKey | null; setOpen: (g: NavGroupKey | null) => void; select: (v: View) => void; controls: string; layoutKey: string }) {
  const { t } = useI18n();
  const n = t.demo.appNav;
  const row = "relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-[0.45rem] text-left text-[0.84rem] font-semibold transition-colors";
  return (
    <nav aria-label={n.label} className="flex flex-col gap-0.5">
      {appNav.map((g) => {
        const isOpen = open === g.key;
        const holdsActive = g.view === view || g.items?.some((i) => i.view === view);
        return (
          <div key={g.key}>
            {g.view ? (
              <button type="button" aria-current={view === g.view ? "page" : undefined} aria-controls={controls} onClick={() => select(g.view!)} className={cn(row, view === g.view ? "text-white" : "text-cream/75 hover:bg-white/5 hover:text-cream")}>
                {view === g.view && <motion.span layoutId={`${layoutKey}-active`} className="absolute inset-0 rounded-xl bg-white/12" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                <NavIcon d={g.icon} />
                <span className="relative">{n.groups[g.key]}</span>
              </button>
            ) : (
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : g.key)} className={cn(row, holdsActive ? "text-white" : "text-cream/75 hover:bg-white/5 hover:text-cream")}>
                <NavIcon d={g.icon} />
                <span className="relative min-w-0 flex-1 truncate">{n.groups[g.key]}</span>
                {holdsActive && !isOpen && <span className="relative size-1.5 shrink-0 rounded-full bg-leaf-glow" aria-hidden="true" />}
                <svg viewBox="0 0 12 12" className={cn("relative size-3 shrink-0 opacity-60 transition-transform duration-300", isOpen && "rotate-90")} aria-hidden="true">
                  <path d="M4.5 2.5L8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <AnimatePresence initial={false}>
              {g.items && isOpen && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="relative ml-[1.15rem] overflow-hidden border-l border-white/10 pl-2.5">
                  {g.items.map((it) => (
                    <li key={it.key}>
                      <button type="button" aria-current={view === it.view ? "page" : undefined} aria-controls={controls} onClick={() => select(it.view)} className={cn("relative my-0.5 flex w-full items-center rounded-lg px-2.5 py-1.5 text-left text-[0.8rem] font-semibold transition-colors", view === it.view ? "text-white" : "text-cream/70 hover:bg-white/5 hover:text-white")}>
                        {view === it.view && <motion.span layoutId={`${layoutKey}-active`} className="absolute inset-0 rounded-lg bg-white/12" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                        {view === it.view && <span className="absolute top-1/2 -left-[0.7rem] h-4 w-0.5 -translate-y-1/2 rounded-full bg-leaf-glow" aria-hidden="true" />}
                        <span className="relative">{n.items[it.key]}</span>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}

/**
 * A believable, self-contained preview of the HelloKhata app.
 * All figures come from /content/demo-data.ts and /content/app-screens-data.ts and are labelled as sample data.
 */
export function AppPreview({ initial = "dashboard", highlight }: { initial?: View; highlight?: "sales" | "dues" | "stock" | "expenses" | null }) {
  const { t } = useI18n();
  const [view, setView] = useState<View>(initial);
  const [open, setOpen] = useState<NavGroupKey | null>(groupOf(initial).items ? groupOf(initial).key : null);
  const [menu, setMenu] = useState(false);
  const panelId = useId();
  const label = useViewLabel();
  const select = (v: View) => {
    setView(v);
    setMenu(false);
    const g = groupOf(v);
    if (g.items) setOpen(g.key);
  };
  const { title, section } = label(view);

  return (
    <div className="overflow-hidden rounded-[1.6rem] bg-white shadow-[var(--shadow-float)] ring-1 ring-ink/10" role="region" aria-label={t.home.demo.previewLabel}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-ink/10 bg-[#f3efe6] px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-vermilion/60" />
        <span className="size-2.5 rounded-full bg-marigold/70" />
        <span className="size-2.5 rounded-full bg-leaf/60" />
        <span className="ml-3 hidden rounded-md bg-white/70 px-3 py-0.5 text-xs text-muted sm:block" translate="no">
          app.hellokhata
        </span>
        <span className="ml-auto">
          <SampleBadge>{t.common.sampleDataLong}</SampleBadge>
        </span>
      </div>

      <div className="grid md:grid-cols-[228px_1fr]">
        {/* Sidebar (desktop): the real menu */}
        <div className="on-dark hidden flex-col bg-forest p-3 text-cream md:flex">
          <span className="font-latin px-2.5 pt-1 text-lg font-extrabold" translate="no">
            Hello<span className="text-leaf-glow">Khata</span>
          </span>
          <div className="mt-5">
            <NavTree view={view} open={open} setOpen={setOpen} select={select} controls={panelId} layoutKey="nav-d" />
          </div>
          <div className="mt-auto pt-5">
            <div className="rounded-xl bg-white/5 p-3 text-xs text-cream/70">{t.home.demo.shopName}</div>
          </div>
        </div>

        <div className="relative min-w-0">
          {/* Menu (mobile) */}
          <div className="on-dark relative z-20 bg-forest text-cream md:hidden">
            <button type="button" aria-expanded={menu} onClick={() => setMenu((m) => !m)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
              <svg viewBox="0 0 20 20" className="size-5 shrink-0" aria-hidden="true">
                <path d={menu ? "M5 5l10 10M15 5L5 15" : "M3 6h14M3 10h14M3 14h14"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="font-latin text-base font-extrabold" translate="no">
                Hello<span className="text-leaf-glow">Khata</span>
              </span>
              <span className="ml-auto truncate text-xs text-cream/70">{t.demo.appNav.label}</span>
            </button>
            <AnimatePresence initial={false}>
              {menu && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <div className="max-h-[60vh] overflow-y-auto px-2 pb-3">
                    <NavTree view={view} open={open} setOpen={setOpen} select={select} controls={panelId} layoutKey="nav-m" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs text-muted">
                {section ?? t.home.demo.shopName}
                {section && (
                  <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden="true">
                    <path d="M4.5 2.5L8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                )}
              </p>
              <p className="text-lg font-bold text-ink">{title}</p>
            </div>
            <span className="shrink-0 rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink-soft">{t.home.demo.today}</span>
          </div>
          <div id={panelId} role="region" aria-label={title} className="min-h-[430px] p-4 sm:p-6">
            <PreviewNav.Provider value={select}>
              <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                  {view === "dashboard" ? <DashboardView highlight={highlight} /> : view === "sales" ? <SalesView /> : view === "inventory" ? <InventoryView /> : view === "reports" ? <ReportsView /> : <AppScreen screen={view} />}
                </motion.div>
              </AnimatePresence>
            </PreviewNav.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 20 20" className="relative size-4 shrink-0" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Shared pieces ---------------- */

export function AnimatedTaka({ value, locale, className }: { value: number; locale: Locale; className?: string }) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 90, damping: 20 });
  const text = useTransform(spring, (v) => fmtTaka(Math.round(v), locale));
  useEffect(() => {
    if (reduce) spring.jump(value);
    else spring.set(value);
  }, [value, spring, reduce]);
  return <motion.span className={className}>{text}</motion.span>;
}

function Kpi({ label, value, note, tone = "ink", glow }: { label: string; value: string; note?: React.ReactNode; tone?: "ink" | "leaf" | "vermilion"; glow?: boolean }) {
  return (
    <div className={cn("rounded-2xl border p-3.5 transition-shadow duration-500 sm:p-4", glow ? "border-leaf shadow-[0_0_0_4px_rgb(22_163_74/0.18)]" : "border-ink/10")}>
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className={cn("font-latin mt-1 text-lg font-bold tracking-tight tabular-nums sm:text-xl", tone === "leaf" ? "text-leaf-deep" : tone === "vermilion" ? "text-vermilion" : "text-ink")}>{value}</p>
      {note && <div className="mt-1 text-xs">{note}</div>}
    </div>
  );
}

function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full bg-paper p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn("relative rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm", value === o.value ? "text-ink" : "text-muted hover:text-ink")}
        >
          {value === o.value && <motion.span layoutId={`seg-${label}`} className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------------- Views ---------------- */

function DashboardView({ highlight }: { highlight?: string | null }) {
  const { t, locale } = useI18n();
  const d = t.demo.dashboard;
  const max = Math.max(...weekSales);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label={d.todaySales}
          value={fmtTaka(today.sales, locale)}
          tone="leaf"
          glow={highlight === "sales"}
          note={
            <span className="font-semibold text-leaf-deep">
              ▲ {fmtPercent(today.deltaPct, locale)} <span className="font-normal text-muted">{d.vsYesterday}</span>
            </span>
          }
        />
        <Kpi label={d.purchases} value={fmtTaka(today.purchasesMonth, locale)} />
        <Kpi label={d.expenses} value={fmtTaka(today.expensesMonth, locale)} glow={highlight === "expenses"} />
        <Kpi label={d.dues} value={fmtTaka(today.dues, locale)} tone="vermilion" glow={highlight === "dues"} />
      </div>
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-ink/10 p-4">
          <p className="text-sm font-semibold text-ink">{d.trend}</p>
          <div className="mt-4 flex h-36 items-end gap-2 sm:gap-3">
            {weekSales.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <motion.div
                  className={cn("w-full rounded-t-md", i === weekSales.length - 1 ? "bg-leaf" : "bg-leaf-soft")}
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / max) * 112}px` }}
                  transition={{ delay: 0.05 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  title={fmtTaka(v, locale)}
                />
                <span className="text-[0.65rem] text-muted">{t.demo.days[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={cn("rounded-2xl border p-4 transition-shadow duration-500", highlight === "stock" ? "border-leaf shadow-[0_0_0_4px_rgb(22_163_74/0.18)]" : "border-ink/10")}>
          <p className="flex items-center justify-between text-sm font-semibold text-ink">
            {d.lowStock}
            <span className="font-latin rounded-full bg-vermilion-soft px-2 py-0.5 text-xs text-vermilion">{fmtNumber(lowStock.length, locale)}</span>
          </p>
          <ul className="mt-3 space-y-2.5">
            {lowStock.map((p) => (
              <li key={p.key}>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-ink-soft">{t.demo.products[p.key]}</span>
                  <span className="text-muted tabular-nums">
                    {fmtNumber(p.stock, locale)} {t.demo.units[p.unit]}
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-ink/5">
                  <div className={cn("h-full rounded-full", p.stock === 0 ? "bg-vermilion" : "bg-marigold")} style={{ width: `${Math.max(4, (p.stock / p.min) * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-2xl border border-ink/10 p-4">
        <p className="text-sm font-semibold text-ink">{d.topProducts}</p>
        <ul className="mt-2 grid gap-x-6 sm:grid-cols-2">
          {topToday.map((p) => (
            <li key={p.key} className="flex items-center justify-between border-b border-ink/5 py-2 text-sm last:border-0">
              <span className="text-ink-soft">
                {t.demo.products[p.key]} <span className="text-xs text-muted">· {interpolate(d.units, { qty: `${fmtNumber(p.qty, locale)} ${t.demo.units[p.unit]}` })}</span>
              </span>
              <span className="font-latin font-semibold tabular-nums">{fmtTaka(p.amount, locale)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SalesView() {
  const { t, locale } = useI18n();
  const s = t.demo.sales;
  const [range, setRange] = useState<keyof typeof salesByRange>("today");
  const r = salesByRange[range];
  return (
    <div className="space-y-4">
      <Segmented
        label={s.rangeLabel}
        value={range}
        onChange={setRange}
        options={(["today", "week", "month"] as const).map((k) => ({ value: k, label: s.ranges[k] }))}
      />
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-ink/10 p-3.5 sm:p-4">
          <p className="text-xs font-semibold text-muted">{s.total}</p>
          <AnimatedTaka value={r.total} locale={locale} className="font-latin mt-1 block text-base font-bold text-leaf-deep tabular-nums sm:text-xl" />
        </div>
        <div className="rounded-2xl border border-ink/10 p-3.5 sm:p-4">
          <p className="text-xs font-semibold text-muted">{s.count}</p>
          <p className="font-latin mt-1 text-base font-bold tabular-nums sm:text-xl">{fmtNumber(r.count, locale)}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 p-3.5 sm:p-4">
          <p className="text-xs font-semibold text-muted">{s.average}</p>
          <AnimatedTaka value={Math.round(r.total / r.count)} locale={locale} className="font-latin mt-1 block text-base font-bold tabular-nums sm:text-xl" />
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-ink/10">
        <p className="px-4 pt-3 text-sm font-semibold">{s.recent}</p>
        <table className="mt-1 w-full min-w-[420px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="px-4 py-2 font-semibold">{s.columns.invoice}</th>
              <th className="px-4 py-2 font-semibold">{s.columns.customer}</th>
              <th className="px-4 py-2 font-semibold">{s.columns.method}</th>
              <th className="px-4 py-2 text-right font-semibold">{s.columns.amount}</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((row) => (
              <tr key={row.inv} className="border-t border-ink/5">
                <td className="font-latin px-4 py-2.5 text-muted">#{fmtDigits(Number(row.inv), locale)}</td>
                <td className="px-4 py-2.5">{row.customer ? t.demo.customers[row.customer] : s.walkIn}</td>
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      row.method === "due" ? "bg-vermilion-soft text-vermilion" : row.method === "mobile" ? "bg-[#dbe6fe] text-[#1d4ed8]" : "bg-leaf-soft text-leaf-ink",
                    )}
                  >
                    {s.methods[row.method]}
                  </span>
                </td>
                <td className="font-latin px-4 py-2.5 text-right font-semibold tabular-nums">{fmtTaka(row.amount, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryView() {
  const { t, locale } = useI18n();
  const inv = t.demo.inventory;
  const [lowOnly, setLowOnly] = useState(false);
  const list = lowOnly ? products.filter((p) => p.stock < p.min) : products;
  const switchId = useId();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{interpolate(inv.summary, { count: fmtNumber(products.length, locale), low: fmtNumber(lowStock.length, locale) })}</p>
        <label htmlFor={switchId} className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-ink">
          <button
            id={switchId}
            type="button"
            role="switch"
            aria-checked={lowOnly}
            aria-label={inv.lowOnly}
            onClick={() => setLowOnly((v) => !v)}
            className={cn("relative h-6 w-11 rounded-full transition-colors", lowOnly ? "bg-leaf-deep" : "bg-ink/15")}
          >
            <motion.span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow" animate={{ x: lowOnly ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 32 }} />
          </button>
          {inv.lowOnly}
        </label>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-ink/10">
        <table className="w-full min-w-[360px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="px-4 py-2.5 font-semibold">{inv.columns.product}</th>
              <th className="px-4 py-2.5 text-right font-semibold">{inv.columns.stock}</th>
              <th className="px-4 py-2.5 text-right font-semibold">{inv.columns.status}</th>
            </tr>
          </thead>
          <motion.tbody layout>
            <AnimatePresence initial={false}>
              {list.map((p) => {
                const status = p.stock === 0 ? "out" : p.stock < p.min ? "low" : "ok";
                return (
                  <motion.tr key={p.key} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-t border-ink/5">
                    <td className="px-4 py-2.5">{t.demo.products[p.key]}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {fmtNumber(p.stock, locale)} {t.demo.units[p.unit]}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-semibold",
                          status === "ok" ? "bg-leaf-soft text-leaf-ink" : status === "low" ? "bg-marigold-soft text-[#6b4a07]" : "bg-vermilion-soft text-vermilion",
                        )}
                      >
                        {inv.status[status]}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsView() {
  const { t, locale } = useI18n();
  const r = t.demo.reports;
  const [type, setType] = useState<"overview" | "products" | "dues">("overview");
  const maxSales = Math.max(...monthlyOverview.map((m) => m.sales));
  const totalSales = monthlyOverview.reduce((a, m) => a + m.sales, 0);
  const totalExp = monthlyOverview.reduce((a, m) => a + m.expenses, 0);
  const maxTop = Math.max(...topToday.map((p) => p.amount));
  const maxDue = Math.max(...customerDues.map((c) => c.due));

  return (
    <div className="space-y-4">
      <Segmented label={r.typeLabel} value={type} onChange={setType} options={(["overview", "products", "dues"] as const).map((k) => ({ value: k, label: r.types[k] }))} />
      <AnimatePresence mode="wait">
        <motion.div key={type} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="rounded-2xl border border-ink/10 p-4">
          {type === "overview" && (
            <>
              <div className="flex flex-wrap gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-leaf" /> {r.sales}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-marigold" /> {r.expenses}
                </span>
              </div>
              <div className="mt-4 flex h-40 items-end gap-4 sm:gap-8">
                {monthlyOverview.map((m, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-32 w-full items-end justify-center gap-1.5">
                      <motion.div className="w-1/2 max-w-8 rounded-t-md bg-leaf" initial={{ height: 0 }} animate={{ height: `${(m.sales / maxSales) * 100}%` }} transition={{ delay: i * 0.06 }} />
                      <motion.div className="w-1/2 max-w-8 rounded-t-md bg-marigold" initial={{ height: 0 }} animate={{ height: `${(m.expenses / maxSales) * 100}%` }} transition={{ delay: i * 0.06 + 0.05 }} />
                    </div>
                    <span className="text-xs text-muted">{interpolate(r.week, { n: fmtNumber(i + 1, locale) })}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-ink/10 pt-3 text-sm">
                <div>
                  <p className="text-xs text-muted">{r.sales}</p>
                  <p className="font-latin font-bold tabular-nums">{fmtTaka(totalSales, locale)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">{r.expenses}</p>
                  <p className="font-latin font-bold tabular-nums">{fmtTaka(totalExp, locale)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">{r.net}</p>
                  <p className="font-latin font-bold text-leaf-deep tabular-nums">{fmtTaka(totalSales - totalExp, locale)}</p>
                </div>
              </div>
            </>
          )}
          {type === "products" && (
            <ul className="space-y-3">
              {topToday.map((p, i) => (
                <li key={p.key}>
                  <div className="flex justify-between text-sm">
                    <span>{t.demo.products[p.key]}</span>
                    <span className="font-latin font-semibold tabular-nums">{fmtTaka(p.amount, locale)}</span>
                  </div>
                  <div className="mt-1.5 h-2.5 rounded-full bg-ink/5">
                    <motion.div className="h-full rounded-full bg-leaf" initial={{ width: 0 }} animate={{ width: `${(p.amount / maxTop) * 100}%` }} transition={{ delay: i * 0.06 }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {type === "dues" && (
            <>
              <ul className="space-y-3">
                {customerDues.map((c, i) => (
                  <li key={c.key}>
                    <div className="flex justify-between text-sm">
                      <span>{t.demo.customers[c.key]}</span>
                      <span className="font-latin font-semibold text-vermilion tabular-nums">{fmtTaka(c.due, locale)}</span>
                    </div>
                    <div className="mt-1.5 h-2.5 rounded-full bg-ink/5">
                      <motion.div className="h-full rounded-full bg-vermilion/70" initial={{ width: 0 }} animate={{ width: `${(c.due / maxDue) * 100}%` }} transition={{ delay: i * 0.06 }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex justify-between border-t border-ink/10 pt-3 text-sm font-semibold">
                {r.dueTotal}
                <span className="font-latin tabular-nums">{fmtTaka(today.dues, locale)}</span>
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
