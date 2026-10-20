"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, fmtTaka, interpolate } from "@/lib/format";
import { customerDues, expenseEntries, monthlyOverview, products, purchaseExample, weekSales, type ExpenseCat, type ProductKey } from "@/content/demo-data";
import { AnimatedTaka } from "@/components/product/AppPreview";
import { SampleBadge } from "@/components/ui/Section";

/* ---------------- Sales: a working mini bill ---------------- */
export function SalesBillDemo() {
  const { t, locale } = useI18n();
  const f = t.home.featuresSection.sales;
  const choices: ProductKey[] = ["rice", "oil", "egg"];
  const [lines, setLines] = useState<{ key: ProductKey; qty: number }[]>([{ key: "rice", qty: 2 }]);
  const priceOf = (k: ProductKey) => products.find((p) => p.key === k)!.price;
  const unitOf = (k: ProductKey) => products.find((p) => p.key === k)!.unit;
  const total = lines.reduce((s, l) => s + l.qty * priceOf(l.key), 0);

  const add = (key: ProductKey) =>
    setLines((ls) => {
      const found = ls.find((l) => l.key === key);
      return found ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { key, qty: 1 }];
    });

  return (
    <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
      <div className="flex flex-wrap gap-2 sm:flex-col">
        {choices.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => add(k)}
            className="rounded-full border border-ink/15 bg-white px-4 py-2 text-left text-sm font-semibold text-ink transition-all hover:border-leaf hover:bg-leaf-soft active:scale-95"
          >
            + {interpolate(f.add, { item: t.demo.products[k] })}
          </button>
        ))}
        <button type="button" onClick={() => setLines([])} className="px-4 py-2 text-left text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline">
          {f.clear}
        </button>
      </div>
      <div className="relative rounded-t-lg bg-white px-5 pt-4 pb-7 shadow-[var(--shadow-card)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-10px),95%_100%,90%_calc(100%-10px),85%_100%,80%_calc(100%-10px),75%_100%,70%_calc(100%-10px),65%_100%,60%_calc(100%-10px),55%_100%,50%_calc(100%-10px),45%_100%,40%_calc(100%-10px),35%_100%,30%_calc(100%-10px),25%_100%,20%_calc(100%-10px),15%_100%,10%_calc(100%-10px),5%_100%,0_calc(100%-10px))]">
        <div className="flex items-center justify-between border-b border-dashed border-ink/20 pb-2">
          <span className="font-bold">{f.bill}</span>
          <SampleBadge>{t.common.sampleData}</SampleBadge>
        </div>
        <ul className="min-h-[116px] py-2 text-sm" aria-live="polite">
          <AnimatePresence initial={false}>
            {lines.length === 0 && (
              <motion.li key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6 text-center text-muted">
                {f.empty}
              </motion.li>
            )}
            {lines.map((l) => (
              <motion.li key={l.key} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="flex justify-between py-1.5">
                <span>
                  {t.demo.products[l.key]}{" "}
                  <span className="text-muted">
                    × {fmtNumber(l.qty, locale)} {t.demo.units[unitOf(l.key)]}
                  </span>
                </span>
                <span className="font-latin font-semibold tabular-nums">{fmtTaka(l.qty * priceOf(l.key), locale)}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <div className="flex items-center justify-between border-t border-dashed border-ink/20 pt-2">
          <span className="font-semibold">{f.total}</span>
          <AnimatedTaka value={total} locale={locale} className="font-latin text-xl font-extrabold text-leaf-deep tabular-nums" />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Inventory: tap a jar on the shelf ---------------- */
const shelfJars: { key: ProductKey; x: number }[] = [
  { key: "rice", x: 6.5 },
  { key: "lentil", x: 24.5 },
  { key: "sugar", x: 42.5 },
  { key: "tea", x: 60.5 },
  { key: "salt", x: 78.5 },
];

export function ShelfDemo({ art }: { art: React.ReactNode }) {
  const { t, locale } = useI18n();
  const f = t.home.featuresSection.inventory;
  const [sel, setSel] = useState<ProductKey>("lentil");
  const p = products.find((x) => x.key === sel)!;
  const low = p.stock < p.min;
  return (
    <div>
      <div className="relative">
        {art}
        {shelfJars.map((j) => {
          const prod = products.find((x) => x.key === j.key)!;
          const isLow = prod.stock < prod.min;
          return (
            <button
              key={j.key}
              type="button"
              aria-pressed={sel === j.key}
              aria-label={t.demo.products[j.key]}
              onClick={() => setSel(j.key)}
              className={cn("absolute top-[12%] h-[60%] w-[15%] rounded-xl transition-all", sel === j.key ? "bg-leaf/10 ring-2 ring-leaf" : "hover:bg-ink/5")}
              style={{ left: `${j.x}%` }}
            >
              {isLow && <span className="absolute -top-1.5 -right-1.5 size-3 rounded-full bg-vermilion ring-2 ring-cream" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted">{f.hint}</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={sel}
          initial={{ opacity: 0, y: 6, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          exit={{ opacity: 0, y: -4 }}
          className="mt-3 inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[var(--shadow-card)] ring-1 ring-ink/10"
          aria-live="polite"
        >
          <span className="font-semibold">{t.demo.products[sel]}</span>
          <span className="text-sm text-muted">{interpolate(f.left, { qty: fmtNumber(p.stock, locale), unit: t.demo.units[p.unit] })}</span>
          {low && <span className="rounded-full bg-vermilion-soft px-2 py-0.5 text-xs font-semibold text-vermilion">{f.low}</span>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Purchases: landed cost toggle ---------------- */
export function PurchaseDemo() {
  const { t, locale } = useI18n();
  const f = t.home.featuresSection.purchases;
  const [withExtra, setWithExtra] = useState(true);
  const id = useId();
  const e = purchaseExample;
  const kg = e.sacks * e.kgPerSack;
  const goods = e.sacks * e.pricePerSack;
  const perKg = (goods + (withExtra ? e.transport + e.labour : 0)) / kg;
  return (
    <div className="relative pt-2 pb-6">
      <div className="w-[88%] -rotate-2 rounded-lg bg-[#fbf6ea] p-4 shadow-[var(--shadow-card)] ring-1 ring-ink/10">
        <p className="font-hand text-lg text-[#24346b]">{f.supplier}</p>
        <div className="mt-2 flex justify-between border-b border-dashed border-ink/20 pb-2 text-sm">
          <span>{f.goods}</span>
          <span className="font-latin font-semibold tabular-nums">{fmtTaka(goods, locale)}</span>
        </div>
        <div className={cn("flex justify-between pt-2 text-sm transition-opacity", !withExtra && "opacity-40 line-through")}>
          <span>{f.transport}</span>
          <span className="font-latin tabular-nums">{fmtTaka(e.transport, locale)}</span>
        </div>
        <div className={cn("flex justify-between pt-1 text-sm transition-opacity", !withExtra && "opacity-40 line-through")}>
          <span>{f.labour}</span>
          <span className="font-latin tabular-nums">{fmtTaka(e.labour, locale)}</span>
        </div>
      </div>
      <div className="relative -mt-4 ml-auto w-[72%] rotate-1 rounded-2xl bg-white p-4 shadow-[var(--shadow-float)] ring-1 ring-ink/10">
        <p className="text-xs font-semibold text-muted">{f.perKg}</p>
        <p className="font-latin text-2xl font-extrabold text-leaf-deep tabular-nums" aria-live="polite">
          ৳{fmtNumber(perKg, locale, 2)}
        </p>
        <label htmlFor={id} className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
          <button
            id={id}
            type="button"
            role="switch"
            aria-checked={withExtra}
            aria-label={f.toggle}
            onClick={() => setWithExtra((v) => !v)}
            className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", withExtra ? "bg-leaf-deep" : "bg-ink/15")}
          >
            <motion.span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow" animate={{ x: withExtra ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 32 }} />
          </button>
          {f.toggle}
        </label>
      </div>
    </div>
  );
}

/* ---------------- Expenses: filter by category ---------------- */
export function ExpenseDemo() {
  const { t, locale } = useI18n();
  const f = t.home.featuresSection.expenses;
  const [cat, setCat] = useState<ExpenseCat | "all">("all");
  const list = cat === "all" ? expenseEntries : expenseEntries.filter((e) => e.cat === cat);
  const total = list.reduce((s, e) => s + e.amount, 0);
  const tint: Record<ExpenseCat, string> = { rent: "bg-vermilion", utilities: "bg-sky", salary: "bg-marigold", other: "bg-muted" };
  return (
    <div>
      <div role="radiogroup" aria-label={f.filterLabel} className="flex flex-wrap gap-2">
        {(["all", "rent", "utilities", "salary", "other"] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={cat === c}
            onClick={() => setCat(c)}
            className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors", cat === c ? "bg-ink text-cream" : "bg-ink/5 text-ink-soft hover:bg-ink/10")}
          >
            {c === "all" ? f.all : f.categories[c]}
          </button>
        ))}
      </div>
      <ul className="mt-4 divide-y divide-ink/10 rounded-2xl bg-white px-4 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
        <AnimatePresence initial={false}>
          {list.map((e) => (
            <motion.li key={e.key} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between gap-3 py-3 text-sm">
              <span className="flex items-center gap-2.5">
                <span className={cn("size-2 rounded-full", tint[e.cat])} />
                {f.entries[e.key]}
              </span>
              <span className="font-latin font-semibold tabular-nums">{fmtTaka(e.amount, locale)}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="mt-3 flex justify-between px-1 text-sm">
        <span className="text-muted">{f.totalLabel}</span>
        <AnimatedTaka value={total} locale={locale} className="font-latin font-bold tabular-nums" />
      </p>
    </div>
  );
}

/* ---------------- Customers: dues with history ---------------- */
export function DuesDemo() {
  const { t, locale } = useI18n();
  const f = t.home.featuresSection.customers;
  const [sel, setSel] = useState(customerDues[0].key);
  const c = customerDues.find((x) => x.key === sel)!;
  const dateFmt = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "long", timeZone: "UTC" });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ul className="space-y-2" aria-label={f.hint}>
        {customerDues.map((cd) => (
          <li key={cd.key}>
            <button
              type="button"
              aria-pressed={sel === cd.key}
              onClick={() => setSel(cd.key)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm transition-all",
                sel === cd.key ? "bg-white shadow-[var(--shadow-card)] ring-1 ring-vermilion/40" : "hover:bg-white/60",
              )}
            >
              <span className="font-semibold">{t.demo.customers[cd.key]}</span>
              <span className="font-latin font-semibold text-vermilion tabular-nums">{fmtTaka(cd.due, locale)}</span>
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence mode="wait">
        <motion.div key={sel} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="rounded-2xl bg-[#fbf6ea] p-4 ring-1 ring-ink/10" aria-live="polite">
          <p className="font-semibold">{t.demo.customers[c.key]}</p>
          <p className="text-xs text-muted">{interpolate(f.since, { date: dateFmt.format(new Date(c.since)) })}</p>
          <ol className="relative mt-3 space-y-2 border-l-2 border-dashed border-ink/15 pl-4">
            {c.history.map((h, i) => (
              <li key={i} className="relative flex justify-between text-sm">
                <span className={cn("absolute top-1.5 -left-[1.42rem] size-2.5 rounded-full ring-2 ring-[#fbf6ea]", h.type === "paid" ? "bg-leaf" : "bg-vermilion")} />
                <span className="text-ink-soft">{f.history[h.type]}</span>
                <span className={cn("font-latin font-semibold tabular-nums", h.type === "paid" ? "text-leaf-deep" : "text-ink")}>
                  {h.type === "paid" ? "−" : "+"}
                  {fmtTaka(h.amount, locale)}
                </span>
              </li>
            ))}
          </ol>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Reports: week / month chart ---------------- */
export function ReportsMini() {
  const { t, locale } = useI18n();
  const f = t.home.featuresSection.reports;
  const [period, setPeriod] = useState<"week" | "month">("week");
  const data = period === "week" ? weekSales : monthlyOverview.map((m) => m.sales);
  const labels = period === "week" ? t.demo.days : monthlyOverview.map((_, i) => interpolate(t.demo.reports.week, { n: fmtNumber(i + 1, locale) }));
  const max = Math.max(...data) * 1.1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * 100, 100 - (v / max) * 100] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <div>
      <div role="radiogroup" aria-label={t.demo.reports.typeLabel} className="inline-flex rounded-full bg-ink/5 p-1">
        {(["week", "month"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={period === k}
            onClick={() => setPeriod(k)}
            className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors", period === k ? "bg-white text-ink shadow-sm" : "text-muted")}
          >
            {f[k]}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-36 w-full overflow-visible" aria-hidden="true">
          {[25, 50, 75].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgb(23 34 28 / 0.08)" vectorEffect="non-scaling-stroke" />
          ))}
          <motion.path key={`a${period}`} d={`${line} L100 100 L0 100 Z`} fill="var(--color-leaf-soft)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
          <motion.path
            key={period}
            d={line}
            fill="none"
            stroke="var(--color-leaf)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
          />
        </svg>
        <div className="mt-2 flex justify-between text-[0.68rem] text-muted">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <p className="mt-3 border-t border-ink/10 pt-2 text-sm">
          <span className="text-muted">{t.demo.reports.sales}: </span>
          <span className="font-latin font-bold tabular-nums">{fmtTaka(data.reduce((a, b) => a + b, 0), locale)}</span>
        </p>
      </div>
    </div>
  );
}
