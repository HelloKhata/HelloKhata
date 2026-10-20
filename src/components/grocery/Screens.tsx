"use client";

import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, fmtTaka, interpolate } from "@/lib/format";
import { buyingPrice, customerDues, products, purchaseExample, recentSales, today, type CustomerKey, type ProductKey } from "@/content/demo-data";
import { AnimatedTaka } from "@/components/product/AppPreview";
import { MicGlyph } from "./Phone";

const priceOf = (k: ProductKey) => products.find((p) => p.key === k)!.price;
const unitOf = (k: ProductKey) => products.find((p) => p.key === k)!.unit;

/* ---------------- Home ---------------- */
export function HomeScreen({ sales = today.sales, count = today.salesCount, toast = false, highlight }: { sales?: number; count?: number; toast?: boolean; highlight?: "sales" | null }) {
  const { t, locale } = useI18n();
  const a = t.grocery.app;
  const lowCount = products.filter((p) => p.stock < p.min).length;
  return (
    <div className="h-full space-y-2.5 overflow-hidden p-3">
      <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#15803d] to-[#0f5f2e] p-3.5 text-white transition-shadow duration-500", highlight === "sales" && "shadow-[0_0_0_4px_rgb(74_222_128/0.45)]")}>
        <span aria-hidden="true" className="absolute -top-6 -right-6 size-20 rounded-full bg-white/10" />
        <p className="text-[0.66rem] text-white/75">{a.todaySales}</p>
        <AnimatedTaka value={sales} locale={locale} className="font-latin block text-[1.45rem] leading-tight font-extrabold tracking-tight" />
        <p className="text-[0.62rem] text-white/75">{interpolate(a.salesCount, { n: fmtNumber(count, locale) })}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { l: a.stock, v: `${fmtNumber(lowCount, locale)} ${a.low}`, c: "text-[#b45309]" },
          { l: a.dues, v: fmtTaka(today.dues, locale), c: "text-vermilion" },
          { l: a.purchases, v: fmtTaka(18200, locale), c: "text-ink" },
        ].map((x) => (
          <div key={x.l} className="rounded-xl bg-white px-1.5 py-2 shadow-sm ring-1 ring-ink/5">
            <p className="text-[0.58rem] text-muted">{x.l}</p>
            <p className={cn("font-latin mt-0.5 truncate text-[0.66rem] font-bold", x.c)}>{x.v}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl bg-leaf-soft px-3 py-2.5 text-leaf-ink">
        <span className="text-[0.72rem] font-bold">+ {a.newSale}</span>
        <span className="flex items-center gap-1 text-[0.6rem] font-semibold">
          <MicGlyph className="size-3.5" />
          {a.ask}
        </span>
      </div>
      <div className="rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-ink/5">
        <p className="text-[0.62rem] font-semibold text-muted">{a.recent}</p>
        <ul className="mt-1.5 space-y-1.5">
          {recentSales.slice(0, 3).map((r) => (
            <li key={r.inv} className="flex justify-between text-[0.66rem]">
              <span className="truncate">{r.customer ? t.demo.customers[r.customer] : a.walkIn}</span>
              <span className={cn("font-latin font-semibold", r.method === "due" ? "text-vermilion" : "text-ink")}>{fmtTaka(r.amount, locale)}</span>
            </li>
          ))}
        </ul>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-[0.66rem] font-semibold text-cream shadow-lg">
            <span className="size-1.5 rounded-full bg-leaf-glow" />
            {a.toastSale}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Sales entry ---------------- */
export function SalesScreen({ selected, qty, method, items, onPick, onQty, onMethod, onSave, saved, choices }: {
  selected: ProductKey;
  qty: number;
  method: "cash" | "due";
  items?: ProductKey[];
  choices: ProductKey[];
  onPick?: (k: ProductKey) => void;
  onQty?: (delta: number) => void;
  onMethod?: (m: "cash" | "due") => void;
  onSave?: () => void;
  saved?: boolean;
}) {
  const { t, locale } = useI18n();
  const a = t.grocery.app;
  const s = t.grocery.sales;
  const total = priceOf(selected) * qty;
  const interactive = !!onPick;
  return (
    <div className="flex h-full flex-col gap-2.5 p-3">
      <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[0.66rem] text-muted ring-1 ring-ink/10">
        <svg viewBox="0 0 20 20" className="size-3.5" aria-hidden="true">
          <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M13.2 13.2 17 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        {a.search}
      </div>
      <div role={interactive ? "radiogroup" : undefined} aria-label={interactive ? s.pick : undefined} className="grid grid-cols-3 gap-1.5">
        {(items ?? choices).map((k) => {
          const on = k === selected;
          const El = interactive ? "button" : "span";
          return (
            <El
              key={k}
              {...(interactive ? { type: "button" as const, role: "radio", "aria-checked": on, onClick: () => onPick?.(k) } : {})}
              className={cn("rounded-xl px-1.5 py-2 text-center transition-all", on ? "bg-leaf-deep text-white shadow-md" : "bg-white text-ink ring-1 ring-ink/10", interactive && !on && "hover:ring-leaf/50")}
            >
              <span className="block truncate text-[0.62rem] leading-tight font-semibold">{t.demo.products[k].split(" (")[0]}</span>
              <span className={cn("font-latin block text-[0.58rem]", on ? "text-white/80" : "text-muted")}>
                {fmtTaka(priceOf(k), locale)}/{t.demo.units[unitOf(k)]}
              </span>
            </El>
          );
        })}
      </div>
      <div className="rounded-xl bg-white p-3 ring-1 ring-ink/10">
        <p className="text-[0.72rem] font-semibold">{t.demo.products[selected]}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[0.62rem] text-muted">{a.qty}</span>
          <div className="flex items-center gap-2">
            {interactive ? (
              <button type="button" aria-label={s.decrease} disabled={qty <= 1} onClick={() => onQty?.(-1)} className="flex size-7 items-center justify-center rounded-full bg-ink/5 text-sm font-bold disabled:opacity-30">
                −
              </button>
            ) : (
              <span className="flex size-7 items-center justify-center rounded-full bg-ink/5 text-sm font-bold" aria-hidden="true">
                −
              </span>
            )}
            <motion.span key={qty} initial={{ scale: 1.25, color: "#15803d" }} animate={{ scale: 1, color: "#17221c" }} className="font-latin w-12 text-center text-sm font-bold" aria-live="polite">
              {fmtNumber(qty, locale)} {t.demo.units[unitOf(selected)]}
            </motion.span>
            {interactive ? (
              <button type="button" aria-label={s.increase} disabled={qty >= 25} onClick={() => onQty?.(1)} className="flex size-7 items-center justify-center rounded-full bg-leaf-deep text-sm font-bold text-white disabled:opacity-30">
                +
              </button>
            ) : (
              <span className="flex size-7 items-center justify-center rounded-full bg-leaf-deep text-sm font-bold text-white" aria-hidden="true">
                +
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5" role={interactive ? "radiogroup" : undefined}>
          {(["cash", "due"] as const).map((m) => {
            const El = interactive ? "button" : "span";
            return (
              <El key={m} {...(interactive ? { type: "button" as const, role: "radio", "aria-checked": method === m, onClick: () => onMethod?.(m) } : {})} className={cn("rounded-lg py-1.5 text-center text-[0.62rem] font-semibold", method === m ? (m === "due" ? "bg-vermilion-soft text-vermilion" : "bg-leaf-soft text-leaf-ink") : "bg-ink/5 text-muted")}>
                {a[m]}
              </El>
            );
          })}
        </div>
      </div>
      <div className="mt-auto rounded-xl bg-[#0f5f2e] p-3 text-white">
        <div className="flex items-center justify-between">
          <span className="text-[0.66rem] text-white/75">{a.total}</span>
          <AnimatedTaka value={total} locale={locale} className="font-latin text-lg font-extrabold" />
        </div>
        {interactive ? (
          <button type="button" onClick={onSave} className="mt-2 w-full rounded-lg bg-white py-2 text-[0.7rem] font-bold text-leaf-ink transition-transform active:scale-[0.98]">
            {a.saveSale}
          </button>
        ) : (
          <span className="mt-2 block w-full rounded-lg bg-white py-2 text-center text-[0.7rem] font-bold text-leaf-ink">{a.saveSale}</span>
        )}
      </div>
      <AnimatePresence>
        {saved && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-3 top-3 rounded-xl bg-ink px-3 py-2 text-center text-[0.66rem] font-semibold text-cream shadow-lg" role="status">
            {s.saved}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Stock ---------------- */
export function StockScreen({ stock, highlight, keys }: { stock: Partial<Record<ProductKey, number>>; highlight?: ProductKey | null; keys: ProductKey[] }) {
  const { t, locale } = useI18n();
  const a = t.grocery.app;
  return (
    <div className="h-full space-y-2 overflow-hidden p-3">
      <p className="px-1 text-[0.72rem] font-bold">{a.stockTitle}</p>
      {keys.map((k) => {
        const p = products.find((x) => x.key === k)!;
        const v = stock[k] ?? p.stock;
        const st = v <= 0 ? "out" : v < p.min ? "low" : "ok";
        return (
          <motion.div
            key={k}
            data-stock={k}
            layout
            animate={highlight === k ? { scale: [1, 1.04, 1], boxShadow: ["0 0 0 0 rgba(74,222,128,0)", "0 0 0 4px rgba(74,222,128,0.45)", "0 0 0 0 rgba(74,222,128,0)"] } : {}}
            transition={{ duration: 0.9 }}
            className="rounded-xl bg-white p-2.5 ring-1 ring-ink/5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[0.68rem] font-semibold">{t.demo.products[k]}</span>
              <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[0.55rem] font-bold", st === "ok" ? "bg-leaf-soft text-leaf-ink" : st === "low" ? "bg-marigold-soft text-[#6b4a07]" : "bg-vermilion-soft text-vermilion")}>{a[st]}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[0.6rem] text-muted">
              <span className="font-latin">
                <motion.strong key={v} initial={{ color: "#15803d" }} animate={{ color: "#17221c" }} transition={{ duration: 1 }} className="text-[0.72rem]">
                  {fmtNumber(v, locale)}
                </motion.strong>{" "}
                {t.demo.units[p.unit]}
              </span>
              <span className="font-latin">
                {a.sellingPrice} {fmtTaka(p.price, locale)}
              </span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-ink/5">
              <motion.div className={cn("h-full rounded-full", st === "ok" ? "bg-leaf" : st === "low" ? "bg-marigold" : "bg-vermilion")} animate={{ width: `${Math.min(100, Math.max(3, (v / (p.min * 2.5)) * 100))}%` }} transition={{ duration: 0.6 }} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------------- Purchase ---------------- */
export function PurchaseScreen({ includeExtra }: { includeExtra: boolean }) {
  const { t, locale } = useI18n();
  const a = t.grocery.app;
  const e = purchaseExample;
  const kg = e.sacks * e.kgPerSack;
  const goods = e.sacks * e.pricePerSack;
  const perKg = (goods + (includeExtra ? e.transport + e.labour : 0)) / kg;
  const paid = 10000;
  const rows = [
    { l: a.goods, v: goods, on: true },
    { l: a.transport, v: e.transport, on: includeExtra },
    { l: a.labour, v: e.labour, on: includeExtra },
  ];
  return (
    <div className="h-full space-y-2.5 overflow-hidden p-3">
      <p className="px-1 text-[0.72rem] font-bold">{a.purchaseTitle}</p>
      <div className="rounded-xl bg-white p-2.5 ring-1 ring-ink/5">
        <p className="text-[0.58rem] text-muted">{a.supplier}</p>
        <p className="text-[0.72rem] font-semibold">{a.supplierName}</p>
        <p className="mt-1 text-[0.62rem] text-muted">{t.grocery.purchase.goodsLine}</p>
      </div>
      <div className="space-y-1.5 rounded-xl bg-white p-2.5 ring-1 ring-ink/5">
        {rows.map((r) => (
          <motion.div key={r.l} animate={{ opacity: r.on ? 1 : 0.35 }} className="flex justify-between text-[0.66rem]">
            <span className={r.on ? "" : "line-through"}>{r.l}</span>
            <span className="font-latin font-semibold">{fmtTaka(r.v, locale)}</span>
          </motion.div>
        ))}
      </div>
      <div className="rounded-xl bg-[#0f5f2e] p-3 text-white">
        <p className="text-[0.62rem] text-white/75">{a.perKg}</p>
        <motion.p key={perKg} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="font-latin origin-left text-xl font-extrabold">
          ৳{fmtNumber(perKg, locale, 2)}
        </motion.p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[0.62rem]">
        <div className="rounded-xl bg-white p-2 ring-1 ring-ink/5">
          <p className="text-muted">{a.paid}</p>
          <p className="font-latin font-bold">{fmtTaka(paid, locale)}</p>
        </div>
        <div className="rounded-xl bg-white p-2 ring-1 ring-ink/5">
          <p className="text-muted">{a.supplierDue}</p>
          <p className="font-latin font-bold text-vermilion">{fmtTaka(goods - paid, locale)}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Dues ---------------- */
export function DuesScreen({ dues, selected, onSelect }: { dues: Record<CustomerKey, number>; selected: CustomerKey; onSelect?: (k: CustomerKey) => void }) {
  const { t, locale } = useI18n();
  const a = t.grocery.app;
  const total = Object.values(dues).reduce((x, y) => x + y, 0);
  return (
    <div className="h-full space-y-2 overflow-hidden p-3">
      <div className="flex items-end justify-between rounded-xl bg-vermilion-soft/70 px-3 py-2.5">
        <span className="text-[0.66rem] font-semibold text-vermilion">{a.totalDue}</span>
        <AnimatedTaka value={total} locale={locale} className="font-latin text-lg font-extrabold text-vermilion" />
      </div>
      <p className="px-1 text-[0.66rem] font-bold">{a.duesTitle}</p>
      {customerDues.map((c) => {
        const on = c.key === selected;
        const El = onSelect ? "button" : "div";
        return (
          <El
            key={c.key}
            {...(onSelect ? { type: "button" as const, "aria-pressed": on, onClick: () => onSelect(c.key) } : {})}
            className={cn("flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition-all", on ? "bg-white shadow-md ring-2 ring-vermilion/40" : "bg-white ring-1 ring-ink/5")}
          >
            <span className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-ink/5 text-[0.6rem] font-bold">{t.demo.customers[c.key].slice(0, 1)}</span>
              <span className="text-[0.68rem] font-semibold">{t.demo.customers[c.key]}</span>
            </span>
            <motion.span key={dues[c.key]} initial={{ color: "#15803d" }} animate={{ color: "#b9442e" }} transition={{ duration: 1 }} className="font-latin text-[0.68rem] font-bold">
              {fmtTaka(dues[c.key], locale)}
            </motion.span>
          </El>
        );
      })}
    </div>
  );
}

/* ---------------- Voice ---------------- */
export type VoiceMsg = { from: "me" | "app"; text: string; kind?: "verified" | "check" };
export function VoiceScreen({ msgs, phase, result }: { msgs: VoiceMsg[]; phase: "idle" | "listening" | "thinking" | "done"; result?: React.ReactNode }) {
  const { t } = useI18n();
  const v = t.grocery.voice;
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#f6f7f5] to-[#e9f5ec] p-3">
      <div className="flex-1 space-y-2 overflow-hidden" lang="bn">
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div key={i + m.text} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("max-w-[88%] rounded-2xl px-3 py-2 text-[0.68rem] leading-snug", m.from === "me" ? "ml-auto rounded-br-md bg-leaf-deep text-white" : "rounded-bl-md bg-white shadow-sm ring-1 ring-ink/5")}>
              {m.text}
              {m.kind && (
                <span lang={undefined} className={cn("mt-1 block text-[0.56rem] font-bold", m.kind === "verified" ? "text-leaf-ink" : "text-[#b45309]")}>
                  {m.kind === "verified" ? `✓ ${v.verified}` : `! ${v.needsCheck}`}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>{phase === "done" && result && <motion.div initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.15 }}>{result}</motion.div>}</AnimatePresence>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-sm ring-1 ring-ink/10" aria-hidden="true">
        <span className={cn("flex size-8 items-center justify-center rounded-full text-white transition-colors", phase === "listening" ? "bg-vermilion" : "bg-leaf-deep")}>
          <MicGlyph className="size-4" />
        </span>
        <span className="flex flex-1 items-center gap-[2px]">
          {Array.from({ length: 22 }, (_, i) => (
            <span
              key={i}
              className={cn("w-[2px] flex-1 rounded-full", phase === "listening" ? "bg-leaf" : "bg-ink/15")}
              style={{ height: `${phase === "listening" ? 6 + ((i * 7) % 13) : 4}px`, animation: phase === "listening" ? `wave ${0.6 + ((i * 3) % 5) / 10}s ease-in-out ${(i % 6) * 0.07}s infinite` : undefined }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

export { priceOf, unitOf, buyingPrice };
