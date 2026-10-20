"use client";

import { createContext, useContext, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtDigits, fmtNumber, fmtTaka, interpolate } from "@/lib/format";
import { demoToday, expenseEntries, products, type CustomerKey, type ProductKey, type UnitKey } from "@/content/demo-data";
import {
  accounts,
  batches,
  cashMoves,
  expenseMeta,
  otherIncome,
  parties,
  paymentsIn,
  paymentsOut,
  purchaseDraft,
  purchaseReturns,
  purchases,
  quotations,
  salesReturns,
  stockAdjustments,
  stockTransfers,
  warehouseSplit,
  type PartyKey,
  type PayMethod,
} from "@/content/app-screens-data";

/** Screens reachable from the preview menu besides the four original views. */
export const screenKeys = [
  "pos",
  "quotations",
  "salesReturn",
  "newPurchase",
  "purchaseList",
  "purchaseReturn",
  "newParty",
  "partiesList",
  "paymentIn",
  "paymentOut",
  "addItem",
  "batches",
  "warehouse",
  "stockAdjustment",
  "stockTransfer",
  "income",
  "expenses",
  "depositWithdrawal",
] as const;
export type ScreenKey = (typeof screenKeys)[number];

/** Lets a screen's button open another screen (e.g. "New purchase" from the purchase list). */
export const PreviewNav = createContext<(v: ScreenKey) => void>(() => {});

/* ---------------- Shared pieces ---------------- */

function useFmt() {
  const { t, locale } = useI18n();
  const dateFmt = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  const s = t.demo.screens;
  return {
    t,
    s,
    locale,
    tk: (n: number) => fmtTaka(n, locale),
    num: (n: number) => fmtNumber(n, locale),
    no: (n: number) => `#${fmtDigits(n, locale)}`,
    date: (iso: string) => dateFmt.format(new Date(iso)),
    qty: (n: number, u: UnitKey) => `${fmtNumber(n, locale)} ${t.demo.units[u]}`,
    product: (k: ProductKey) => t.demo.products[k],
    party: (k: PartyKey) => (k in t.demo.customers ? t.demo.customers[k as CustomerKey] : s.names[k as keyof typeof s.names]),
    method: (m: PayMethod) => s.methods[m],
  };
}

const toneCls = {
  leaf: "bg-leaf-soft text-leaf-ink",
  marigold: "bg-marigold-soft text-[#6b4a07]",
  vermilion: "bg-vermilion-soft text-vermilion",
  blue: "bg-[#dbe6fe] text-[#1d4ed8]",
  muted: "bg-ink/5 text-muted",
} as const;
type Tone = keyof typeof toneCls;

function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap", toneCls[tone])}>{children}</span>;
}

const methodTone: Record<PayMethod, Tone> = { cash: "leaf", mobile: "blue", bank: "muted" };

function Stat({ label, value, tone = "ink" }: { label: string; value: string; tone?: "ink" | "leaf" | "vermilion" | "marigold" }) {
  return (
    <div className="rounded-2xl border border-ink/10 p-3.5 sm:p-4">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className={cn("font-latin mt-1 text-base font-bold tracking-tight tabular-nums sm:text-xl", { ink: "text-ink", leaf: "text-leaf-deep", vermilion: "text-vermilion", marigold: "text-[#a16207]" }[tone])}>{value}</p>
    </div>
  );
}

function Stats({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>;
}

function AddButton({ to, children }: { to?: ScreenKey; children: React.ReactNode }) {
  const go = useContext(PreviewNav);
  if (!to) return null;
  return (
    <button type="button" onClick={() => go(to)} className="inline-flex items-center gap-1.5 rounded-full bg-leaf-deep px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-leaf-ink sm:text-sm">
      <span aria-hidden="true">+</span>
      {children}
    </button>
  );
}

function Table({ cols, rows, minW = 480, title, action }: { cols: { label: string; right?: boolean }[]; rows: { key: string | number; cells: React.ReactNode[] }[]; minW?: number; title?: string; action?: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10">
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 px-4 pt-3">
          {title && <p className="text-sm font-semibold">{title}</p>}
          {action}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="mt-1 w-full text-sm" style={{ minWidth: minW }}>
          <thead>
            <tr className="text-left text-xs text-muted">
              {cols.map((c, i) => (
                <th key={i} className={cn("px-4 py-2 font-semibold whitespace-nowrap", c.right && "text-right")}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <motion.tr key={r.key} className="border-t border-ink/5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * ri, duration: 0.3 }}>
                {r.cells.map((c, i) => (
                  <td key={i} className={cn("px-4 py-2.5", cols[i]?.right && "font-latin text-right font-semibold tabular-nums")}>
                    {c}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none transition-shadow placeholder:text-muted/70 focus:border-leaf focus:shadow-[0_0_0_3px_rgb(22_163_74/0.15)]";

function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-ink-soft">
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-[0.7rem] text-muted">{hint}</p>}
    </div>
  );
}

/** Save buttons in the preview never pretend to save. */
function PreviewSave({ label }: { label: string }) {
  const { s } = useFmt();
  const [shown, setShown] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => setShown(true)} className="rounded-full bg-leaf-deep px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-leaf-ink">
        {label}
      </button>
      <AnimatePresence>
        {shown && (
          <motion.p role="status" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="rounded-full bg-marigold-soft px-3 py-1.5 text-xs font-semibold text-[#6b4a07]">
            {s.previewOnly}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Seg<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full bg-paper p-1">
      {options.map(([k, l]) => (
        <button key={k} type="button" role="radio" aria-checked={value === k} onClick={() => onChange(k)} className={cn("relative rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm", value === k ? "text-ink" : "text-muted hover:text-ink")}>
          {value === k && <motion.span layoutId={`scr-seg-${label}`} className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
          <span className="relative">{l}</span>
        </button>
      ))}
    </div>
  );
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const daysUntil = (iso: string) => Math.round((Date.parse(iso) - Date.parse(demoToday)) / 86_400_000);

/* ---------------- Sales ---------------- */

function PosScreen() {
  const f = useFmt();
  const p = f.s.pos;
  const [cart, setCart] = useState<Partial<Record<ProductKey, number>>>({ rice: 5, oil: 2, egg: 12 });
  const [pay, setPay] = useState<PayMethod | "due">("cash");
  const [customer, setCustomer] = useState<CustomerKey | "">("");
  const lines = products.filter((x) => cart[x.key]);
  const total = sum(lines.map((x) => x.price * (cart[x.key] ?? 0)));
  const add = (k: ProductKey, d: number) => setCart((c) => ({ ...c, [k]: Math.max(0, (c[k] ?? 0) + d) }));
  return (
    <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      <div className="grid grid-cols-3 gap-2 self-start sm:grid-cols-4">
        {products.map((x, i) => {
          const out = x.stock === 0;
          return (
            <motion.button
              key={x.key}
              type="button"
              disabled={out}
              onClick={() => add(x.key, 1)}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              whileTap={{ scale: 0.95 }}
              className={cn("relative rounded-xl border p-2.5 text-left transition-colors", out ? "cursor-not-allowed border-ink/5 bg-ink/[0.03] opacity-60" : cart[x.key] ? "border-leaf bg-leaf-soft/50" : "border-ink/10 hover:border-leaf/50")}
            >
              <span className="block truncate text-xs font-semibold text-ink">{f.product(x.key)}</span>
              <span className="font-latin mt-1 block text-[0.7rem] text-muted">
                {out ? p.out : `${f.tk(x.price)}/${f.t.demo.units[x.unit]}`}
              </span>
              {!!cart[x.key] && <span className="font-latin absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-leaf-deep text-[0.6rem] font-bold text-white">{f.num(cart[x.key]!)}</span>}
            </motion.button>
          );
        })}
      </div>
      <div className="rounded-2xl border border-ink/10 p-4">
        <p className="flex items-center justify-between text-sm font-semibold">
          {p.cart}
          <span className="text-xs font-normal text-muted">{interpolate(p.items, { n: f.num(lines.length) })}</span>
        </p>
        <ul className="mt-2 min-h-[120px] divide-y divide-ink/5">
          <AnimatePresence initial={false}>
            {lines.length === 0 && <li className="py-6 text-center text-xs text-muted">{p.empty}</li>}
            {lines.map((x) => (
              <motion.li key={x.key} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 py-2 text-sm">
                <span className="min-w-0 flex-1 truncate">{f.product(x.key)}</span>
                <span className="flex items-center gap-1">
                  <button type="button" onClick={() => add(x.key, -1)} aria-label="−" className="size-6 rounded-full bg-ink/5 text-xs font-bold hover:bg-ink/10">
                    −
                  </button>
                  <span className="font-latin w-12 text-center text-xs tabular-nums">{f.qty(cart[x.key]!, x.unit)}</span>
                  <button type="button" onClick={() => add(x.key, 1)} aria-label="+" className="size-6 rounded-full bg-leaf-deep text-xs font-bold text-white">
                    +
                  </button>
                </span>
                <span className="font-latin w-16 text-right font-semibold tabular-nums">{f.tk(x.price * cart[x.key]!)}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <div className="mt-3 space-y-3 border-t border-ink/10 pt-3">
          <Field label={p.customer}>
            {(id) => (
              <select id={id} value={customer} onChange={(e) => setCustomer(e.target.value as CustomerKey | "")} className={inputCls}>
                <option value="">{p.walkIn}</option>
                {(Object.keys(f.t.demo.customers) as CustomerKey[]).map((k) => (
                  <option key={k} value={k}>
                    {f.t.demo.customers[k]}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Seg label={p.pay} value={pay} onChange={setPay} options={[["cash", f.s.methods.cash], ["mobile", f.s.methods.mobile], ["due", p.due]]} />
          {pay === "due" && !customer && <p className="text-xs font-semibold text-vermilion">{p.dueNeedsCustomer}</p>}
          <p className="flex items-baseline justify-between text-sm font-semibold">
            {p.total}
            <span className="font-latin text-2xl font-extrabold text-leaf-deep tabular-nums">{f.tk(total)}</span>
          </p>
          <PreviewSave label={p.complete} />
        </div>
      </div>
    </div>
  );
}

function QuotationsScreen() {
  const f = useFmt();
  const q = f.s.quotations;
  const open = quotations.filter((x) => x.status === "sent" || x.status === "accepted");
  const tone = { sent: "blue", accepted: "leaf", expired: "muted", converted: "marigold" } as const;
  return (
    <div className="space-y-4">
      <Stats>
        <Stat label={q.open} value={f.num(open.length)} />
        <Stat label={q.openValue} value={f.tk(sum(open.map((x) => x.amount)))} tone="leaf" />
        <Stat label={q.converted} value={f.num(quotations.filter((x) => x.status === "converted").length)} />
      </Stats>
      <Table
        cols={[{ label: f.s.cols.no }, { label: f.s.cols.customer }, { label: f.s.cols.date }, { label: f.s.cols.status }, { label: f.s.cols.amount, right: true }]}
        rows={quotations.map((x) => ({ key: x.no, cells: [<span key="n" className="font-latin text-muted">{f.no(x.no)}</span>, f.party(x.party), f.date(x.date), <Pill key="s" tone={tone[x.status]}>{q.status[x.status]}</Pill>, f.tk(x.amount)] }))}
      />
    </div>
  );
}

function SalesReturnScreen() {
  const f = useFmt();
  const r = f.s.salesReturn;
  return (
    <div className="space-y-4">
      <Stats>
        <Stat label={r.count} value={f.num(salesReturns.length)} />
        <Stat label={r.refunded} value={f.tk(sum(salesReturns.map((x) => x.amount)))} tone="vermilion" />
      </Stats>
      <Table
        minW={560}
        cols={[{ label: f.s.cols.no }, { label: f.s.cols.invoice }, { label: f.s.cols.product }, { label: f.s.cols.reason }, { label: f.s.cols.date }, { label: f.s.cols.amount, right: true }]}
        rows={salesReturns.map((x) => ({
          key: x.no,
          cells: [
            <span key="n" className="font-latin text-muted">{f.no(x.no)}</span>,
            <span key="i" className="font-latin text-muted">{f.no(x.inv)}</span>,
            <span key="p">
              {f.product(x.product)} <span className="text-xs text-muted">· {f.qty(x.qty, x.unit)}</span>
            </span>,
            <Pill key="r" tone={x.reason === "expired" ? "vermilion" : "marigold"}>{f.s.reasons[x.reason]}</Pill>,
            f.date(x.date),
            f.tk(x.amount),
          ],
        }))}
      />
    </div>
  );
}

/* ---------------- Purchases ---------------- */

function NewPurchaseScreen() {
  const f = useFmt();
  const n = f.s.newPurchase;
  const [lines, setLines] = useState(purchaseDraft.lines);
  const [paid, setPaid] = useState(purchaseDraft.paid);
  const goods = sum(lines.map((l) => l.qty * l.cost));
  const total = goods + purchaseDraft.transport;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label={n.supplier}>
          {(id) => (
            <select id={id} defaultValue={purchaseDraft.supplier} className={inputCls}>
              {(["shapla", "karim", "sonali"] as const).map((k) => (
                <option key={k} value={k}>
                  {f.party(k)}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label={n.invoice}>{(id) => <input id={id} defaultValue={purchaseDraft.invoice} className={cn(inputCls, "font-latin")} />}</Field>
        <Field label={n.date}>{(id) => <input id={id} readOnly value={f.date(demoToday)} className={inputCls} />}</Field>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-ink/10">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="px-4 py-2 font-semibold">{f.s.cols.product}</th>
              <th className="px-4 py-2 font-semibold">{f.s.cols.qty}</th>
              <th className="px-4 py-2 text-right font-semibold">{n.unitCost}</th>
              <th className="px-4 py-2 text-right font-semibold">{n.lineTotal}</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={l.product} className="border-t border-ink/5">
                <td className="px-4 py-2">{f.product(l.product)}</td>
                <td className="px-4 py-2">
                  <span className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      value={l.qty}
                      aria-label={`${f.product(l.product)} — ${f.s.cols.qty}`}
                      onChange={(e) => setLines((ls) => ls.map((x, j) => (j === i ? { ...x, qty: Math.max(0, Number(e.target.value) || 0) } : x)))}
                      className={cn(inputCls, "font-latin max-w-24 py-1.5 tabular-nums")}
                    />
                    <span className="text-xs text-muted">{f.t.demo.units[l.unit]}</span>
                  </span>
                </td>
                <td className="font-latin px-4 py-2 text-right tabular-nums">{f.tk(l.cost)}</td>
                <td className="font-latin px-4 py-2 text-right font-semibold tabular-nums">{f.tk(l.qty * l.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_1.1fr]">
        <Field label={n.paid}>
          {(id) => <input id={id} type="number" min={0} value={paid} onChange={(e) => setPaid(Math.max(0, Number(e.target.value) || 0))} className={cn(inputCls, "font-latin tabular-nums")} />}
        </Field>
        <dl className="space-y-1.5 rounded-2xl bg-paper p-4 text-sm">
          {(
            [
              [f.s.cols.items, goods],
              [n.transport, purchaseDraft.transport],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-muted">{k}</dt>
              <dd className="font-latin tabular-nums">{f.tk(v)}</dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-ink/10 pt-1.5 font-bold">
            <dt>{n.grandTotal}</dt>
            <dd className="font-latin tabular-nums">{f.tk(total)}</dd>
          </div>
          <div className="flex justify-between font-semibold text-vermilion">
            <dt>{n.due}</dt>
            <dd className="font-latin tabular-nums">{f.tk(Math.max(0, total - paid))}</dd>
          </div>
        </dl>
      </div>
      <PreviewSave label={n.save} />
    </div>
  );
}

function PurchaseListScreen() {
  const f = useFmt();
  const p = f.s.purchaseList;
  const status = (x: (typeof purchases)[number]) => (x.paid >= x.amount ? "paid" : x.paid > 0 ? "partial" : "due");
  return (
    <div className="space-y-4">
      <Stats>
        <Stat label={p.month} value={f.tk(sum(purchases.map((x) => x.amount)))} />
        <Stat label={p.owed} value={f.tk(sum(purchases.map((x) => x.amount - x.paid)))} tone="vermilion" />
        <Stat label={p.count} value={f.num(purchases.length)} />
      </Stats>
      <Table
        action={<AddButton to="newPurchase">{p.add}</AddButton>}
        cols={[{ label: f.s.cols.no }, { label: f.s.cols.supplier }, { label: f.s.cols.date }, { label: f.s.cols.status }, { label: f.s.cols.amount, right: true }]}
        rows={purchases.map((x) => {
          const st = status(x);
          return { key: x.no, cells: [<span key="n" className="font-latin text-muted">{f.no(x.no)}</span>, f.party(x.supplier), f.date(x.date), <Pill key="s" tone={st === "paid" ? "leaf" : st === "partial" ? "marigold" : "vermilion"}>{p.status[st]}</Pill>, f.tk(x.amount)] };
        })}
      />
    </div>
  );
}

function PurchaseReturnScreen() {
  const f = useFmt();
  const r = f.s.purchaseReturn;
  return (
    <div className="space-y-4">
      <Stats>
        <Stat label={r.count} value={f.num(purchaseReturns.length)} />
        <Stat label={r.credit} value={f.tk(sum(purchaseReturns.map((x) => x.amount)))} tone="leaf" />
      </Stats>
      <Table
        minW={580}
        cols={[{ label: f.s.cols.no }, { label: f.s.cols.purchase }, { label: f.s.cols.supplier }, { label: f.s.cols.product }, { label: f.s.cols.reason }, { label: f.s.cols.amount, right: true }]}
        rows={purchaseReturns.map((x) => ({
          key: x.no,
          cells: [
            <span key="n" className="font-latin text-muted">{f.no(x.no)}</span>,
            <span key="p" className="font-latin text-muted">{f.no(x.purchase)}</span>,
            f.party(x.supplier),
            <span key="pr">
              {f.product(x.product)} <span className="text-xs text-muted">· {f.qty(x.qty, x.unit)}</span>
            </span>,
            <Pill key="r" tone={x.reason === "expired" ? "vermilion" : "marigold"}>{f.s.reasons[x.reason]}</Pill>,
            f.tk(x.amount),
          ],
        }))}
      />
    </div>
  );
}

/* ---------------- Parties ---------------- */

function NewPartyScreen() {
  const f = useFmt();
  const n = f.s.newParty;
  const [kind, setKind] = useState<"customer" | "supplier">("customer");
  return (
    <div className="max-w-xl space-y-4">
      <Seg label={n.type} value={kind} onChange={setKind} options={[["customer", n.customer], ["supplier", n.supplier]]} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={n.name}>{(id) => <input id={id} placeholder={kind === "customer" ? n.namePhCustomer : n.namePhSupplier} className={inputCls} />}</Field>
        <Field label={n.phone}>{(id) => <input id={id} inputMode="tel" placeholder="01XXX-XXXXXX" className={cn(inputCls, "font-latin")} />}</Field>
      </div>
      <Field label={n.address}>{(id) => <input id={id} className={inputCls} />}</Field>
      <Field label={n.opening} hint={kind === "customer" ? n.openingHintCustomer : n.openingHintSupplier}>
        {(id) => <input id={id} type="number" min={0} placeholder="0" className={cn(inputCls, "font-latin tabular-nums")} />}
      </Field>
      <PreviewSave label={n.save} />
    </div>
  );
}

function PartiesListScreen() {
  const f = useFmt();
  const p = f.s.parties;
  const [kind, setKind] = useState<"customer" | "supplier">("customer");
  const list = parties.filter((x) => x.kind === kind);
  const phone = (last: string) => `017•• •••${f.locale === "bn" ? last.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]) : last}`;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Seg label={p.kind} value={kind} onChange={setKind} options={[["customer", p.customers], ["supplier", p.suppliers]]} />
        <AddButton to="newParty">{p.add}</AddButton>
      </div>
      <Stats>
        <Stat label={kind === "customer" ? p.totalReceivable : p.totalPayable} value={f.tk(sum(list.map((x) => x.balance)))} tone={kind === "customer" ? "vermilion" : "marigold"} />
        <Stat label={kind === "customer" ? p.customers : p.suppliers} value={f.num(list.length)} />
      </Stats>
      <Table
        key={kind}
        minW={420}
        cols={[{ label: f.s.cols.party }, { label: f.s.cols.phone }, { label: f.s.cols.balance, right: true }]}
        rows={list.map((x) => ({
          key: x.key,
          cells: [
            <span key="n" className="font-semibold">{f.party(x.key)}</span>,
            <span key="p" className="text-muted tabular-nums">{phone(x.phone)}</span>,
            x.balance ? (
              <span key="b" className={kind === "customer" ? "text-vermilion" : "text-[#a16207]"}>
                {f.tk(x.balance)} <span className="text-[0.65rem] font-normal">{kind === "customer" ? p.receivable : p.payable}</span>
              </span>
            ) : (
              <Pill key="b" tone="leaf">{p.settled}</Pill>
            ),
          ],
        }))}
      />
    </div>
  );
}

function PaymentsScreen({ dir }: { dir: "in" | "out" }) {
  const f = useFmt();
  const c = dir === "in" ? f.s.paymentIn : f.s.paymentOut;
  const rows = dir === "in" ? paymentsIn : paymentsOut;
  return (
    <div className="space-y-4">
      <Stats>
        <Stat label={c.month} value={f.tk(sum(rows.map((x) => x.amount)))} tone={dir === "in" ? "leaf" : "ink"} />
        <Stat label={c.count} value={f.num(rows.length)} />
      </Stats>
      <Table
        cols={[{ label: f.s.cols.no }, { label: f.s.cols.party }, { label: f.s.cols.date }, { label: f.s.cols.method }, { label: f.s.cols.amount, right: true }]}
        rows={rows.map((x) => ({ key: x.no, cells: [<span key="n" className="font-latin text-muted">{f.no(x.no)}</span>, f.party(x.party), f.date(x.date), <Pill key="m" tone={methodTone[x.method]}>{f.method(x.method)}</Pill>, f.tk(x.amount)] }))}
      />
    </div>
  );
}

/* ---------------- Inventory ---------------- */

function AddItemScreen() {
  const f = useFmt();
  const a = f.s.addItem;
  const [buy, setBuy] = useState("");
  const [sell, setSell] = useState("");
  const [track, setTrack] = useState(false);
  const margin = Number(sell) - Number(buy);
  const showMargin = buy !== "" && sell !== "";
  return (
    <div className="max-w-2xl space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={a.name}>{(id) => <input id={id} placeholder={a.namePh} className={inputCls} />}</Field>
        <Field label={a.category}>
          {(id) => (
            <select id={id} className={inputCls}>
              {Object.entries(a.categories).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label={a.unit}>
          {(id) => (
            <select id={id} className={inputCls}>
              {(["kg", "pcs", "litre", "packet", "box"] as const).map((u) => (
                <option key={u} value={u}>
                  {f.t.demo.units[u]}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label={a.buy}>{(id) => <input id={id} type="number" min={0} value={buy} onChange={(e) => setBuy(e.target.value)} placeholder="0" className={cn(inputCls, "font-latin tabular-nums")} />}</Field>
        <Field label={a.sell}>{(id) => <input id={id} type="number" min={0} value={sell} onChange={(e) => setSell(e.target.value)} placeholder="0" className={cn(inputCls, "font-latin tabular-nums")} />}</Field>
      </div>
      <AnimatePresence>
        {showMargin && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={cn("rounded-xl px-3 py-2 text-sm font-semibold", margin >= 0 ? "bg-leaf-soft text-leaf-ink" : "bg-vermilion-soft text-vermilion")}>
            {a.margin}: <span className="font-latin tabular-nums">{f.tk(margin)}</span>
          </motion.p>
        )}
      </AnimatePresence>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={a.opening}>{(id) => <input id={id} type="number" min={0} placeholder="0" className={cn(inputCls, "font-latin tabular-nums")} />}</Field>
        <Field label={a.alert}>{(id) => <input id={id} type="number" min={0} placeholder="0" className={cn(inputCls, "font-latin tabular-nums")} />}</Field>
      </div>
      <button type="button" role="switch" aria-checked={track} onClick={() => setTrack((v) => !v)} className="flex items-center gap-3 text-sm font-semibold text-ink">
        <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", track ? "bg-leaf-deep" : "bg-ink/15")}>
          <motion.span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow" animate={{ x: track ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 32 }} />
        </span>
        {a.batches}
      </button>
      <PreviewSave label={a.save} />
    </div>
  );
}

function BatchesScreen() {
  const f = useFmt();
  const b = f.s.batches;
  const soon = batches.filter((x) => daysUntil(x.expiry) <= 60).length;
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{interpolate(b.summary, { n: f.num(batches.length), soon: f.num(soon) })}</p>
      <Table
        minW={600}
        cols={[{ label: f.s.cols.product }, { label: f.s.cols.batch }, { label: f.s.cols.received }, { label: f.s.cols.expiry }, { label: f.s.cols.qty, right: true }]}
        rows={batches.map((x) => {
          const d = daysUntil(x.expiry);
          return {
            key: x.batch,
            cells: [
              <span key="p" className="font-semibold">{f.product(x.product)}</span>,
              <span key="b" className="font-latin text-muted" translate="no">{x.batch}</span>,
              f.date(x.received),
              <span key="e" className="flex flex-wrap items-center gap-1.5">
                {f.date(x.expiry)}
                {d <= 60 ? <Pill tone="vermilion">{interpolate(b.daysLeft, { n: f.num(d) })}</Pill> : <Pill tone="leaf">{b.ok}</Pill>}
              </span>,
              f.qty(x.qty, x.unit),
            ],
          };
        })}
      />
    </div>
  );
}

function WarehouseScreen() {
  const f = useFmt();
  const w = f.s.warehouse;
  const price = (k: ProductKey) => products.find((p) => p.key === k)!.price;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {(["shop", "store"] as const).map((loc, i) => (
          <motion.div key={loc} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={cn("rounded-2xl p-4", loc === "shop" ? "bg-leaf-soft/60" : "bg-paper")}>
            <p className="flex items-center gap-2 text-sm font-bold">
              <svg viewBox="0 0 20 20" className="size-4 text-leaf-deep" aria-hidden="true">
                <path d={loc === "shop" ? "M3 8l1.5-4h11L17 8M3 8h14v9H3zM8 17v-5h4v5" : "M2 8l8-5 8 5v9H2zM6 17v-6h8v6"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              {w.locations[loc]}
            </p>
            <p className="mt-2 text-xs text-muted">{interpolate(w.items, { n: f.num(warehouseSplit.filter((x) => x[loc] > 0).length) })}</p>
            <p className="font-latin mt-0.5 text-xl font-bold tabular-nums">{f.tk(sum(warehouseSplit.map((x) => x[loc] * price(x.product))))}</p>
            <p className="text-[0.7rem] text-muted">{w.value}</p>
          </motion.div>
        ))}
      </div>
      <Table
        minW={440}
        cols={[{ label: f.s.cols.product }, { label: w.locations.shop, right: true }, { label: w.locations.store, right: true }, { label: w.total, right: true }]}
        rows={warehouseSplit.map((x) => ({ key: x.product, cells: [<span key="p" className="font-semibold">{f.product(x.product)}</span>, f.qty(x.shop, x.unit), x.store ? f.qty(x.store, x.unit) : "—", f.qty(x.shop + x.store, x.unit)] }))}
      />
    </div>
  );
}

function StockAdjustmentScreen() {
  const f = useFmt();
  const a = f.s.adjustment;
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{a.lead}</p>
      <Table
        minW={480}
        cols={[{ label: f.s.cols.date }, { label: f.s.cols.product }, { label: f.s.cols.reason }, { label: f.s.cols.change, right: true }]}
        rows={stockAdjustments.map((x, i) => ({
          key: i,
          cells: [
            f.date(x.date),
            <span key="p" className="font-semibold">{f.product(x.product)}</span>,
            <Pill key="r" tone={x.reason === "countCorrection" ? "blue" : "marigold"}>{a.reasons[x.reason]}</Pill>,
            <span key="c" className={x.change < 0 ? "text-vermilion" : "text-leaf-deep"}>
              {x.change > 0 ? "+" : "−"}
              {f.qty(Math.abs(x.change), x.unit)}
            </span>,
          ],
        }))}
      />
    </div>
  );
}

function StockTransferScreen() {
  const f = useFmt();
  const tr = f.s.transfer;
  return (
    <div className="space-y-3">
      {stockTransfers.map((x, i) => (
        <motion.div key={x.no} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-ink/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-bold">
              <span className="font-latin text-muted">{f.no(x.no)}</span>
              {f.s.warehouse.locations[x.from]}
              <svg viewBox="0 0 24 12" className="h-3 w-6 text-leaf-deep" aria-hidden="true">
                <path d="M1 6h20M16 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {f.s.warehouse.locations[x.to]}
            </p>
            <span className="flex items-center gap-2 text-xs text-muted">
              {f.date(x.date)}
              <Pill tone={x.status === "completed" ? "leaf" : "marigold"}>{tr.status[x.status]}</Pill>
            </span>
          </div>
          <ul className="mt-2 flex flex-wrap gap-2">
            {x.items.map((it) => (
              <li key={it.product} className="rounded-full bg-paper px-3 py-1 text-xs">
                {f.product(it.product)} · <span className="font-latin tabular-nums">{f.qty(it.qty, it.unit)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------- Finance ---------------- */

function IncomeScreen() {
  const f = useFmt();
  const n = f.s.income;
  return (
    <div className="space-y-4">
      <Stats>
        <Stat label={n.month} value={f.tk(sum(otherIncome.map((x) => x.amount)))} tone="leaf" />
        <Stat label={f.s.cols.items} value={f.num(otherIncome.length)} />
      </Stats>
      <p className="text-xs text-muted">{n.note}</p>
      <Table
        cols={[{ label: f.s.cols.date }, { label: f.s.cols.category }, { label: f.s.cols.method }, { label: f.s.cols.amount, right: true }]}
        rows={otherIncome.map((x, i) => ({ key: i, cells: [f.date(x.date), n.cats[x.cat], <Pill key="m" tone={methodTone[x.method]}>{f.method(x.method)}</Pill>, f.tk(x.amount)] }))}
      />
    </div>
  );
}

function ExpensesScreen() {
  const f = useFmt();
  const e = f.s.expenses;
  const total = sum(expenseEntries.map((x) => x.amount));
  const cats = (["rent", "salary", "utilities", "other"] as const).map((c) => ({ c, v: sum(expenseEntries.filter((x) => x.cat === c).map((x) => x.amount)) }));
  const colors = { rent: "bg-leaf-deep", salary: "bg-leaf", utilities: "bg-marigold", other: "bg-sky" };
  const rows = [...expenseEntries].sort((a, b) => expenseMeta[b.key].date.localeCompare(expenseMeta[a.key].date));
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-ink/10 p-4">
        <p className="flex items-baseline justify-between text-sm font-semibold">
          {e.month}
          <span className="font-latin text-xl font-bold tabular-nums">{f.tk(total)}</span>
        </p>
        <div className="mt-3 flex h-3 overflow-hidden rounded-full">
          {cats.map((x, i) => (
            <motion.span key={x.c} className={colors[x.c]} initial={{ width: 0 }} animate={{ width: `${(x.v / total) * 100}%` }} transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }} />
          ))}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {cats.map((x) => (
            <li key={x.c} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-sm", colors[x.c])} />
              {e.cats[x.c]} <span className="font-latin text-muted tabular-nums">{f.tk(x.v)}</span>
            </li>
          ))}
        </ul>
      </div>
      <Table
        cols={[{ label: f.s.cols.date }, { label: f.s.cols.category }, { label: f.s.cols.method }, { label: f.s.cols.amount, right: true }]}
        rows={rows.map((x) => ({ key: x.key, cells: [f.date(expenseMeta[x.key].date), e.items[x.key], <Pill key="m" tone={methodTone[expenseMeta[x.key].method]}>{f.method(expenseMeta[x.key].method)}</Pill>, f.tk(x.amount)] }))}
      />
    </div>
  );
}

function DepositScreen() {
  const f = useFmt();
  const d = f.s.deposit;
  const sign = { deposit: "+", withdrawal: "−", owner: "−", capital: "+" } as const;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {accounts.map((a, i) => (
          <motion.div key={a.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={cn("rounded-2xl p-4", i === 0 ? "bg-forest text-cream" : "border border-ink/10")}>
            <p className={cn("text-xs font-semibold", i === 0 ? "text-cream/65" : "text-muted")}>{d.accounts[a.key]}</p>
            <p className="font-latin mt-1 text-xl font-bold tabular-nums">{f.tk(a.balance)}</p>
          </motion.div>
        ))}
      </div>
      <Table
        cols={[{ label: f.s.cols.date }, { label: f.s.cols.type }, { label: f.s.cols.account }, { label: f.s.cols.amount, right: true }]}
        rows={cashMoves.map((x, i) => ({
          key: i,
          cells: [
            f.date(x.date),
            <Pill key="t" tone={sign[x.type] === "+" ? "leaf" : "marigold"}>{d.types[x.type]}</Pill>,
            d.accounts[x.account],
            <span key="a" className={sign[x.type] === "+" ? "text-leaf-deep" : "text-ink"}>
              {sign[x.type]}
              {f.tk(x.amount)}
            </span>,
          ],
        }))}
      />
    </div>
  );
}

export function AppScreen({ screen }: { screen: ScreenKey }) {
  switch (screen) {
    case "pos":
      return <PosScreen />;
    case "quotations":
      return <QuotationsScreen />;
    case "salesReturn":
      return <SalesReturnScreen />;
    case "newPurchase":
      return <NewPurchaseScreen />;
    case "purchaseList":
      return <PurchaseListScreen />;
    case "purchaseReturn":
      return <PurchaseReturnScreen />;
    case "newParty":
      return <NewPartyScreen />;
    case "partiesList":
      return <PartiesListScreen />;
    case "paymentIn":
      return <PaymentsScreen dir="in" />;
    case "paymentOut":
      return <PaymentsScreen dir="out" />;
    case "addItem":
      return <AddItemScreen />;
    case "batches":
      return <BatchesScreen />;
    case "warehouse":
      return <WarehouseScreen />;
    case "stockAdjustment":
      return <StockAdjustmentScreen />;
    case "stockTransfer":
      return <StockTransferScreen />;
    case "income":
      return <IncomeScreen />;
    case "expenses":
      return <ExpensesScreen />;
    case "depositWithdrawal":
      return <DepositScreen />;
  }
}
