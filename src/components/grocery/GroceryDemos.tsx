"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, fmtTaka, interpolate } from "@/lib/format";
import { buyingPrice, customerDues, groceryProducts, lowStock, products, today, type CustomerKey, type ProductKey } from "@/content/demo-data";
import { SampleBadge } from "@/components/ui/Section";
import { shelfSpots } from "@/components/illustrations/GroceryArt";
import { MicGlyph, Phone } from "./Phone";
import { DuesScreen, HomeScreen, PurchaseScreen, SalesScreen, StockScreen, VoiceScreen, priceOf, unitOf, type VoiceMsg } from "./Screens";

/* ---------------- C: sales entry ---------------- */
export function SalesEntryDemo() {
  const { t, locale } = useI18n();
  const s = t.grocery.sales;
  const a = t.grocery.app;
  const [sel, setSel] = useState<ProductKey>("rice");
  const [qty, setQty] = useState(2);
  const [method, setMethod] = useState<"cash" | "due">("cash");
  const [saved, setSaved] = useState(false);
  const [log, setLog] = useState<{ id: number; key: ProductKey; qty: number; method: "cash" | "due" }[]>([]);
  const save = () => {
    setLog((l) => [{ id: Date.now(), key: sel, qty, method }, ...l].slice(0, 4));
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };
  const dayTotal = log.reduce((x, l) => x + priceOf(l.key) * l.qty, 0);
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
      <Phone width={290} nav="sales">
        <SalesScreen
          choices={groceryProducts}
          selected={sel}
          qty={qty}
          method={method}
          onPick={(k) => {
            setSel(k);
            setQty(1);
          }}
          onQty={(d) => setQty((q) => Math.min(25, Math.max(1, q + d)))}
          onMethod={setMethod}
          onSave={save}
          saved={saved}
        />
      </Phone>
      <div className="w-full max-w-[260px] rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] ring-1 ring-ink/5 sm:mt-16">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{a.recent}</p>
          <SampleBadge>{a.sample}</SampleBadge>
        </div>
        <ul className="mt-2 space-y-1.5 text-sm" aria-live="polite">
          {log.length === 0 && <li className="text-muted">{s.pick}</li>}
          <AnimatePresence initial={false}>
            {log.map((l) => (
              <motion.li key={l.id} layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between gap-2">
                <span className="truncate">
                  {t.demo.products[l.key].split(" (")[0]} × {fmtNumber(l.qty, locale)}
                  {l.method === "due" && <span className="ml-1 text-xs text-vermilion">({a.due})</span>}
                </span>
                <span className="font-latin font-semibold">{fmtTaka(priceOf(l.key) * l.qty, locale)}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {log.length > 0 && (
          <p className="mt-3 flex justify-between border-t border-ink/10 pt-2 text-sm font-bold">
            {a.total}
            <span className="font-latin text-leaf-deep">{fmtTaka(dayTotal, locale)}</span>
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- D: shelf → stock list ---------------- */
const shelfKeys = ["rice", "oil", "lentil", "sugar"] as const;
export function StockShelfDemo({ shelf }: { shelf: React.ReactNode }) {
  const { t, locale } = useI18n();
  const st = t.grocery.stock;
  const reduce = useReducedMotion();
  const base = Object.fromEntries(shelfKeys.map((k) => [k, products.find((p) => p.key === k)!.stock])) as Record<(typeof shelfKeys)[number], number>;
  const [stock, setStock] = useState(base);
  const [hl, setHl] = useState<ProductKey | null>(null);
  const [fly, setFly] = useState<{ id: number; key: ProductKey; from: DOMRect; to: DOMRect } | null>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  const sell = (k: (typeof shelfKeys)[number], el: HTMLElement) => {
    if (stock[k] <= 0) return;
    const to = phoneRef.current?.querySelector<HTMLElement>(`[data-stock="${k}"]`)?.getBoundingClientRect() ?? phoneRef.current!.getBoundingClientRect();
    const from = el.getBoundingClientRect();
    if (!reduce) setFly({ id: Date.now(), key: k, from, to });
    const delay = reduce ? 0 : 700;
    setTimeout(() => {
      setStock((s) => ({ ...s, [k]: s[k] - (unitOf(k) === "litre" ? 1 : 2) }));
      setHl(k);
      setTimeout(() => setHl(null), 1000);
    }, delay);
  };

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_auto]">
      <div>
        <div className="relative">
          {shelf}
          {shelfKeys.map((k) => (
            <button
              key={k}
              type="button"
              onClick={(e) => sell(k, e.currentTarget)}
              disabled={stock[k] <= 0}
              aria-label={interpolate(st.sell, { item: t.demo.products[k] })}
              className="group absolute top-[4%] h-[72%] w-[22%] -translate-x-1/2 rounded-2xl transition-colors hover:bg-leaf/10 focus-visible:bg-leaf/10 disabled:cursor-not-allowed"
              style={{ left: `${(shelfSpots[k] / 520) * 100}%` }}
            >
              <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-white px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-leaf-ink shadow-sm ring-1 ring-leaf/30 transition-colors group-hover:bg-leaf-deep group-hover:text-white group-disabled:opacity-40">
                {t.demo.products[k].split(" (")[0]} −
              </span>
            </button>
          ))}
        </div>
        <p className="mt-16 text-sm text-muted">{st.hint}</p>
        <p className="mt-1 text-xs text-muted">{st.lowNote}</p>
        <button type="button" onClick={() => setStock(base)} className="mt-3 text-sm font-semibold text-leaf-ink underline-offset-4 hover:underline">
          {st.reset}
        </button>
      </div>
      <div ref={phoneRef} className="mx-auto">
        <Phone width={270} nav="stock">
          <StockScreen keys={[...shelfKeys]} stock={stock} highlight={hl} />
        </Phone>
      </div>
      <AnimatePresence>
        {fly && (
          <motion.div
            key={fly.id}
            className="pointer-events-none fixed z-[70] rounded-full bg-leaf-deep px-3 py-1.5 text-xs font-bold text-white shadow-lg"
            initial={{ left: fly.from.left + fly.from.width / 2 - 30, top: fly.from.top + fly.from.height / 2, scale: 0.6, opacity: 0 }}
            animate={{ left: [null, fly.from.left + (fly.to.left - fly.from.left) * 0.5, fly.to.left + 10], top: [null, Math.min(fly.from.top, fly.to.top) - 70, fly.to.top + 6], scale: [0.6, 1.1, 0.8], opacity: [0, 1, 0] }}
            transition={{ duration: 0.75, ease: [0.45, 0, 0.2, 1] }}
            onAnimationComplete={() => setFly(null)}
          >
            {t.demo.products[fly.key].split(" (")[0]}
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {shelfKeys.map((k) => `${t.demo.products[k]}: ${fmtNumber(stock[k], locale)}`).join(", ")}
      </span>
    </div>
  );
}

/* ---------------- E: purchase with extra costs ---------------- */
export function PurchaseDemo() {
  const { t } = useI18n();
  const pu = t.grocery.purchase;
  const [extra, setExtra] = useState(true);
  const id = useId();
  return (
    <div className="flex flex-col items-center gap-4">
      <Phone width={270} nav={null}>
        <PurchaseScreen includeExtra={extra} />
      </Phone>
      <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-ink/10">
        <button id={id} type="button" role="switch" aria-checked={extra} aria-label={pu.include} onClick={() => setExtra((v) => !v)} className={cn("relative h-6 w-11 rounded-full transition-colors", extra ? "bg-leaf-deep" : "bg-ink/15")}>
          <motion.span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow" animate={{ x: extra ? 20 : 0 }} />
        </button>
        {pu.include}
      </label>
    </div>
  );
}

/* ---------------- F: customer dues ---------------- */
export function DuesDemo() {
  const { t, locale } = useI18n();
  const d = t.grocery.dues;
  const a = t.grocery.app;
  const start = Object.fromEntries(customerDues.map((c) => [c.key, c.due])) as Record<CustomerKey, number>;
  const [dues, setDues] = useState(start);
  const [sel, setSel] = useState<CustomerKey>("rahim");
  const [paid, setPaid] = useState<Record<CustomerKey, number[]>>({ rahim: [], salma: [], jamal: [], nasrin: [] });
  const [toast, setToast] = useState(false);
  const c = customerDues.find((x) => x.key === sel)!;
  const dateFmt = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "long", timeZone: "UTC" });
  const pay = () => {
    if (dues[sel] <= 0) return;
    const amt = Math.min(500, dues[sel]);
    setDues((x) => ({ ...x, [sel]: x[sel] - amt }));
    setPaid((p) => ({ ...p, [sel]: [amt, ...p[sel]] }));
    setToast(true);
    setTimeout(() => setToast(false), 1500);
  };
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
      <Phone width={270} nav="dues">
        <DuesScreen dues={dues} selected={sel} onSelect={setSel} />
      </Phone>
      <div className="w-full max-w-[260px] rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] ring-1 ring-ink/5 sm:mt-14">
        <p className="font-semibold">{t.demo.customers[sel]}</p>
        <p className="text-xs text-muted">{interpolate(a.since, { date: dateFmt.format(new Date(c.since)) })}</p>
        <ol className="relative mt-3 space-y-2 border-l-2 border-dashed border-ink/15 pl-4 text-sm" aria-live="polite">
          {[...paid[sel].map((amt) => ({ type: "paid" as const, amount: amt, demo: true })), ...c.history.map((h) => ({ ...h, demo: false }))].slice(0, 5).map((h, i) => (
            <motion.li key={`${i}-${h.amount}-${h.demo}`} initial={h.demo ? { opacity: 0, x: -8 } : false} animate={{ opacity: 1, x: 0 }} className="relative flex justify-between">
              <span className={cn("absolute top-1.5 -left-[1.42rem] size-2.5 rounded-full ring-2 ring-white", h.type === "paid" ? "bg-leaf" : "bg-vermilion")} />
              <span>{a.history[h.type]}</span>
              <span className={cn("font-latin font-semibold", h.type === "paid" && "text-leaf-deep")}>
                {h.type === "paid" ? "−" : "+"}
                {fmtTaka(h.amount, locale)}
              </span>
            </motion.li>
          ))}
        </ol>
        <button type="button" onClick={pay} disabled={dues[sel] <= 0} className="mt-4 h-10 w-full rounded-full bg-leaf-deep text-sm font-semibold text-white hover:bg-leaf-ink disabled:opacity-40">
          {d.pay}
        </button>
        <AnimatePresence>
          {toast && (
            <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="mt-2 text-center text-xs font-semibold text-leaf-ink">
              {d.paidToast}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- G: Bangla voice assistant ---------------- */
type Intent = "sales" | "check" | "low" | "rahim" | "unknown";
function intentOf(q: string): Intent {
  if (/রহিম|rahim/i.test(q)) return "rahim";
  if (/কমে|শেষ|low|ফুরি/i.test(q)) return "low";
  if (/কিনেছিলাম|কেনা দাম|buying|bought/i.test(q)) return "check";
  if (/বিক্রি|sale|sold/i.test(q)) return "sales";
  return "unknown";
}

export function VoiceAssistantDemo() {
  const { t, locale } = useI18n();
  const v = t.grocery.voice;
  const a = t.grocery.app;
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "listening" | "thinking" | "done">("idle");
  const [msgs, setMsgs] = useState<VoiceMsg[]>([]);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [input, setInput] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const inputId = useId();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "0px 0px -30% 0px" });
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const ask = (q: string) => {
    timers.current.forEach(clearTimeout);
    const it = intentOf(q);
    const rahimDue = customerDues.find((c) => c.key === "rahim")!.due;
    const answer =
      it === "sales" ? v.answers.sales : it === "low" ? v.answers.low : it === "rahim" ? interpolate(v.answers.rahim, { amount: fmtNumber(rahimDue, "bn") }) : it === "check" ? v.answers.check : v.answers.unknown;
    const kind: VoiceMsg["kind"] = it === "check" || it === "unknown" ? "check" : "verified";
    setIntent(null);
    if (reduce) {
      setMsgs([{ from: "me", text: q }, { from: "app", text: answer, kind }]);
      setIntent(it);
      setPhase("done");
      return;
    }
    setMsgs([]);
    setPhase("listening");
    timers.current.push(setTimeout(() => setMsgs([{ from: "me", text: q }]), 900));
    timers.current.push(setTimeout(() => setPhase("thinking"), 1500));
    timers.current.push(
      setTimeout(() => {
        setMsgs([{ from: "me", text: q }, { from: "app", text: answer, kind }]);
        setIntent(it);
        setPhase("done");
      }, 2400),
    );
  };

  // Play the first question once the section scrolls into view, so the phone never sits empty.
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => ask(v.questions[0]), 600);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const result =
    intent === "sales" ? (
      <div className="rounded-2xl bg-gradient-to-br from-[#15803d] to-[#0f5f2e] p-3 text-white">
        <p className="text-[0.6rem] text-white/75">{a.todaySales}</p>
        <p className="font-latin text-xl font-extrabold">{fmtTaka(today.sales, locale)}</p>
        <p className="text-[0.56rem] text-marigold-soft">{a.sample}</p>
      </div>
    ) : intent === "low" ? (
      <div className="rounded-2xl bg-white p-2.5 ring-1 ring-marigold/40">
        <p className="text-[0.6rem] font-bold text-[#b45309]">{a.lowList}</p>
        <ul className="mt-1 space-y-1">
          {lowStock.map((p) => (
            <li key={p.key} className="flex justify-between text-[0.62rem]">
              <span>{t.demo.products[p.key]}</span>
              <span className="font-latin font-semibold">
                {fmtNumber(p.stock, locale)} {t.demo.units[p.unit]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ) : intent === "rahim" ? (
      <div className="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-vermilion/30">
        <span className="text-[0.66rem] font-semibold">{t.demo.customers.rahim}</span>
        <span className="font-latin text-sm font-extrabold text-vermilion">{fmtTaka(customerDues[0].due, locale)}</span>
      </div>
    ) : intent === "check" ? (
      <div className="rounded-2xl bg-marigold-soft p-2.5 text-[0.6rem] text-[#6b4a07]">
        <p className="font-bold">{v.needsCheck}</p>
        <p className="mt-0.5">
          {t.demo.products.rice}: {a.buyingPrice} {fmtTaka(buyingPrice.rice!, locale)} · {t.demo.products.oil}: {fmtTaka(buyingPrice.oil!, locale)}
        </p>
      </div>
    ) : null;

  return (
    <div ref={root} className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
      <div className="order-2 lg:order-1">
        <p className="text-sm font-semibold text-leaf-glow">{v.tryLabel}</p>
        <div className="mt-3 flex flex-col gap-2" lang="bn">
          {v.questions.map((q) => (
            <button key={q} type="button" disabled={phase === "listening" || phase === "thinking"} onClick={() => ask(q)} className="rounded-2xl border border-cream/15 bg-white/5 px-4 py-3 text-left text-cream/90 transition-colors hover:border-leaf-glow/60 hover:bg-white/10 disabled:opacity-50">
              “{q}”
            </button>
          ))}
        </div>
        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) ask(input.trim());
            setInput("");
          }}
        >
          <label htmlFor={inputId} className="text-sm text-cream/60">
            {v.textLabel}
          </label>
          <div className="mt-2 flex gap-2">
            <input id={inputId} value={input} onChange={(e) => setInput(e.target.value)} placeholder={v.placeholder} maxLength={120} className="h-12 min-w-0 flex-1 rounded-full border border-cream/15 bg-white/5 px-5 text-cream placeholder:text-cream/40 focus:border-leaf-glow focus:outline-none" />
            <button type="submit" disabled={!input.trim() || phase === "listening" || phase === "thinking"} className="h-12 shrink-0 rounded-full bg-leaf-deep px-5 font-semibold text-white disabled:opacity-50">
              {v.send}
            </button>
          </div>
        </form>
      </div>

      <div className="relative order-1 mx-auto lg:order-2">
        {/* Sound waves rising from the phone while "listening" */}
        <svg viewBox="0 0 400 400" className="pointer-events-none absolute top-1/2 left-1/2 h-[140%] w-[200%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <motion.circle
              key={i}
              cx="200"
              cy="200"
              r={90 + i * 30}
              fill="none"
              stroke="var(--color-leaf-glow)"
              strokeWidth="1.5"
              animate={phase === "listening" && !reduce ? { opacity: [0, 0.45, 0], scale: [0.9, 1.08, 1.18] } : { opacity: phase === "thinking" ? 0.12 : 0.05, scale: 1 }}
              transition={phase === "listening" ? { duration: 1.6, repeat: Infinity, delay: i * 0.3 } : { duration: 0.6 }}
              style={{ transformOrigin: "200px 200px" }}
            />
          ))}
        </svg>
        <Phone width={280} nav={null}>
          <VoiceScreen msgs={msgs} phase={phase} result={result} />
        </Phone>
        <button type="button" onClick={() => ask(v.questions[0])} disabled={phase === "listening" || phase === "thinking"} aria-label={v.micLabel} className="absolute -bottom-6 left-1/2 flex size-16 -translate-x-1/2 items-center justify-center rounded-full bg-leaf-deep text-white shadow-[0_0_0_8px_rgb(22_163_74/0.25),0_20px_40px_-10px_rgb(0_0_0/0.5)] transition-transform hover:scale-105 active:scale-95 disabled:cursor-wait">
          <MicGlyph className="size-7" />
        </button>
      </div>

      <div className="order-3 space-y-3 text-sm text-cream/70" aria-live="polite">
        <p className="rounded-2xl border border-marigold/30 bg-marigold/10 p-4 text-marigold-soft">{v.notice}</p>
        <p>{phase === "listening" ? v.listening : phase === "thinking" ? v.thinking : ""}</p>
      </div>
    </div>
  );
}

/* ---------------- I: mobile tour ---------------- */
const tourKeys = ["home", "sales", "stock", "purchase", "dues", "voice"] as const;
export function MobileTour() {
  const { t, locale } = useI18n();
  const tr = t.grocery.tour;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!inView || paused || reduce) return;
    const id = setInterval(() => setI((x) => (x + 1) % tourKeys.length), 3600);
    return () => clearInterval(id);
  }, [inView, paused, reduce]);
  const k = tourKeys[i];
  const nav = k === "home" ? "home" : k === "sales" ? "sales" : k === "stock" ? "stock" : k === "dues" ? "dues" : null;
  const screen = {
    home: <HomeScreen />,
    sales: <SalesScreen choices={groceryProducts} selected="oil" qty={2} method="cash" />,
    stock: <StockScreen keys={["rice", "oil", "lentil", "sugar", "salt"]} stock={{}} />,
    purchase: <PurchaseScreen includeExtra />,
    dues: <DuesScreen dues={Object.fromEntries(customerDues.map((c) => [c.key, c.due])) as Record<CustomerKey, number>} selected="rahim" />,
    voice: <VoiceScreen phase="done" msgs={[{ from: "me", text: t.grocery.voice.questions[2] }, { from: "app", text: t.grocery.voice.answers.low, kind: "verified" }]} />,
  }[k];
  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-[1fr_auto]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div role="tablist" aria-label={tr.title} className="grid gap-2 sm:grid-cols-2">
        {tourKeys.map((key, idx) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={idx === i}
            onClick={() => setI(idx)}
            className={cn("relative overflow-hidden rounded-2xl p-4 text-left transition-colors", idx === i ? "bg-white shadow-[var(--shadow-card)] ring-1 ring-leaf/30" : "bg-white/50 hover:bg-white/80")}
          >
            <span className="font-latin text-xs font-bold text-leaf-deep">{fmtNumber(idx + 1, locale).padStart(2, locale === "bn" ? "০" : "0")}</span>
            <span className="mt-1 block font-semibold">{tr.screens[key].title}</span>
            <span className="mt-0.5 block text-sm text-muted">{tr.screens[key].body}</span>
            {idx === i && !reduce && !paused && <motion.span key={`bar-${i}`} className="absolute bottom-0 left-0 h-0.5 bg-leaf" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3.6, ease: "linear" }} />}
          </button>
        ))}
        <p className="text-xs text-muted sm:col-span-2">{tr.recreated}</p>
      </div>
      <div role="tabpanel" className="mx-auto">
        <Phone width={290} nav={nav}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={k} className="h-full" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              {screen}
            </motion.div>
          </AnimatePresence>
        </Phone>
      </div>
    </div>
  );
}
