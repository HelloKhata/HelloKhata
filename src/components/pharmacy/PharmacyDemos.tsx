"use client";

import { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, fmtTaka, interpolate } from "@/lib/format";
import { daysUntilDemo, demoToday, pharmaItems, pharmaPeriods, pharmaToday, purchaseOrder, sampleRx, type PharmaId } from "@/content/demo-data";
import { rxRegions } from "@/components/illustrations/PharmacyArt";
import { InventoryTable, MedName, StockMeter, inInvFilter, type InvFilter, OverviewScreen, PharmaWindow, PosScreen, ReportsScreen, StateBadge, stockState } from "./PharmaUI";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------------- Shared: reviewed prescription items ---------------- */
const RxContext = createContext<{ confirmed: PharmaId[]; setConfirmed: (ids: PharmaId[]) => void }>({ confirmed: [], setConfirmed: () => {} });
export function RxProvider({ children }: { children: React.ReactNode }) {
  const [confirmed, setConfirmed] = useState<PharmaId[]>([]);
  return <RxContext.Provider value={{ confirmed, setConfirmed }}>{children}</RxContext.Provider>;
}

/* ---------------- A: hero composite ---------------- */
export function HeroComposite({ art, slip }: { art: React.ReactNode; slip: React.ReactNode }) {
  const reduce = useReducedMotion();
  const init = reduce ? false : undefined;
  return (
    <div className="relative mx-auto w-full max-w-[760px]">
      <motion.div initial={init ?? { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
        {art}
      </motion.div>
      {/* Ink threads: prescription slip + stock ledger → the interface */}
      <svg viewBox="0 0 760 560" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" aria-hidden="true">
        {["M100 380 C 140 300, 260 230, 380 200", "M340 392 C 360 340, 380 300, 400 280"].map((d, i) => (
          <motion.path key={d} d={d} fill="none" stroke="var(--color-leaf)" strokeWidth="2.6" strokeLinecap="round" initial={init ?? { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.1, delay: 0.9 + i * 0.25, ease: [0.65, 0, 0.35, 1] }} />
        ))}
      </svg>
      <motion.div className="relative z-10 -mt-16 md:absolute md:top-[6%] md:right-[-4%] md:mt-0 md:w-[60%]" initial={init ?? { opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.5, ease }}>
        <PharmaWindow active="overview">
          <OverviewScreen />
        </PharmaWindow>
      </motion.div>
      <motion.div className="absolute top-[52%] left-[2%] hidden w-[22%] -rotate-6 rounded-md shadow-[var(--shadow-float)] md:block" initial={init ?? { opacity: 0, y: 20, rotate: -14 }} animate={{ opacity: 1, y: 0, rotate: -6 }} transition={{ duration: 0.8, delay: 0.7, ease }} aria-hidden="true">
        {slip}
      </motion.div>
    </div>
  );
}

/* ---------------- B: connected workflow ---------------- */
const stages = ["purchase", "stock", "lookup", "sales", "records", "reports"] as const;
type Stage = (typeof stages)[number];

export function WorkflowStepper() {
  const { t, locale } = useI18n();
  const w = t.pharmacy.workflow;
  const u = t.pharmacy.ui;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-25% 0px" });
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!inView || paused || reduce) return;
    const id = setInterval(() => setI((x) => (x + 1) % stages.length), 3400);
    return () => clearInterval(id);
  }, [inView, paused, reduce]);
  const st: Stage = stages[i];
  const p = pharmaPeriods.today;

  const panel: Record<Stage, React.ReactNode> = {
    purchase: (
      <ul className="space-y-2 text-sm">
        {purchaseOrder.items.map((x) => (
          <li key={x.id} className="flex justify-between gap-3 rounded-xl bg-[#f7faf8] px-3 py-2">
            <MedName id={x.id} className="truncate font-semibold" />
            <span className="font-latin shrink-0 text-muted">+{fmtNumber(x.qty, locale)}</span>
          </li>
        ))}
      </ul>
    ),
    stock: (
      <ul className="space-y-2 text-sm">
        {pharmaItems.slice(0, 4).map((x) => (
          <li key={x.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#f7faf8] px-3 py-2">
            <MedName id={x.id} className="truncate font-semibold" />
            <span className="flex items-center gap-2">
              <span className="font-latin text-muted">{fmtNumber(x.stock, locale)}</span>
              <StateBadge state={stockState(x.id)} />
            </span>
          </li>
        ))}
      </ul>
    ),
    lookup: (
      <div className="space-y-2 text-sm">
        <div className="rounded-xl border border-ink/10 bg-[#f7faf8] px-3 py-2 text-muted" lang="en" translate="no">
          omepra|
        </div>
        <div className="flex items-center justify-between rounded-xl bg-leaf-soft/60 px-3 py-2">
          <MedName id="omeprazole" className="font-semibold" />
          <StateBadge state={stockState("omeprazole")} />
        </div>
        <p className="text-xs text-muted">{t.pharmacy.pos.rxNote}</p>
      </div>
    ),
    sales: (
      <div className="space-y-2 text-sm">
        {(["omeprazole", "paracetamol"] as PharmaId[]).map((id, k) => (
          <div key={id} className="flex justify-between rounded-xl bg-[#f7faf8] px-3 py-2">
            <MedName id={id} className="truncate font-semibold" />
            <span className="font-latin">{fmtTaka(pharmaItems.find((x) => x.id === id)!.price * (k + 1), locale)}</span>
          </div>
        ))}
        <div className="flex justify-between rounded-xl bg-leaf-deep px-3 py-2 font-bold text-white">
          <span>
            {u.total} · {u.cash}
          </span>
          <span className="font-latin">{fmtTaka(84, locale)}</span>
        </div>
      </div>
    ),
    records: (
      <ul className="space-y-2 text-sm">
        {[
          [u.nav.sales, `+${fmtTaka(84, locale)}`, "text-leaf-deep"],
          [u.nav.purchases, `−${fmtTaka(4990, locale)}`, "text-ink"],
          [t.pharmacy.reports.expenses, `−${fmtTaka(1200, locale)}`, "text-ink"],
        ].map(([l, v, c]) => (
          <li key={l} className="flex justify-between rounded-xl bg-[#f7faf8] px-3 py-2">
            <span>{l}</span>
            <span className={cn("font-latin font-semibold", c)}>{v}</span>
          </li>
        ))}
      </ul>
    ),
    reports: (
      <ul className="space-y-1.5 text-sm">
        {[
          [t.pharmacy.reports.revenue, p.revenue],
          [t.pharmacy.reports.cogs, -p.cogs],
          [t.pharmacy.reports.expenses, -p.expenses],
          [t.pharmacy.reports.net, p.revenue - p.cogs - p.expenses],
        ].map(([l, v], k) => (
          <li key={String(l)} className={cn("flex justify-between rounded-xl px-3 py-2", k === 3 ? "bg-leaf-soft font-bold text-leaf-ink" : "bg-[#f7faf8]")}>
            <span>{String(l)}</span>
            <span className="font-latin">
              {Number(v) < 0 ? "− " : ""}
              {fmtTaka(Math.abs(Number(v)), locale)}
            </span>
          </li>
        ))}
      </ul>
    ),
  };

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-[1fr_1fr]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <ol role="tablist" aria-label={w.stagesLabel} className="relative space-y-2">
        <span aria-hidden="true" className="absolute top-6 bottom-6 left-[1.35rem] w-0.5 bg-ink/10" />
        <motion.span aria-hidden="true" className="absolute top-6 left-[1.35rem] w-0.5 origin-top bg-leaf" animate={{ height: `calc(${(i / (stages.length - 1)) * 100}% - ${i === stages.length - 1 ? 48 : 0}px)` }} transition={{ duration: 0.5, ease }} />
        {stages.map((k, idx) => (
          <li key={k}>
            <button
              type="button"
              role="tab"
              aria-selected={idx === i}
              onClick={() => setI(idx)}
              className={cn("relative flex w-full items-start gap-4 rounded-2xl p-3 text-left transition-colors", idx === i ? "bg-white shadow-[var(--shadow-card)] ring-1 ring-leaf/25" : "hover:bg-white/60")}
            >
              <span className={cn("font-latin relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-4 ring-[#f3f8f4] transition-colors", idx <= i ? "bg-leaf-deep text-white" : "bg-white text-muted ring-1")}>{fmtNumber(idx + 1, locale)}</span>
              <span>
                <span className="block font-semibold">{w.stages[k].name}</span>
                <span className="mt-0.5 block text-sm text-muted">{w.stages[k].benefit}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div role="tabpanel" className="lg:sticky lg:top-28 lg:self-start">
        <PharmaWindow active={st === "purchase" ? "purchases" : st === "stock" || st === "lookup" ? "stock" : st === "sales" ? "sales" : st === "records" ? "overview" : "reports"}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={st} className="p-4" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.3 }}>
              <p className="mb-3 text-sm font-bold">{w.stages[st].name}</p>
              {panel[st]}
            </motion.div>
          </AnimatePresence>
        </PharmaWindow>
      </div>
    </div>
  );
}

/* ---------------- C: prescription OCR ---------------- */
type OcrStage = "capture" | "read" | "review" | "done";
type Field = "medicine" | "strength" | "instructions" | "frequency" | "duration";
const fields: Field[] = ["medicine", "strength", "instructions", "frequency", "duration"];

export function OcrDemo({ slip }: { slip: React.ReactNode }) {
  const { t, locale } = useI18n();
  const o = t.pharmacy.ocr;
  const reduce = useReducedMotion();
  const { setConfirmed } = useContext(RxContext);
  const [stage, setStage] = useState<OcrStage>("capture");
  const [shown, setShown] = useState(0); // number of highlighted lines during reading
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [removed, setRemoved] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [tried, setTried] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const editId = useId();
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const capture = () => {
    timers.current.forEach(clearTimeout);
    setStage("read");
    setShown(0);
    if (reduce) {
      setShown(3);
      return;
    }
    [1, 2, 3].forEach((n) => timers.current.push(setTimeout(() => setShown(n), 700 + n * 650)));
  };
  const reset = () => {
    timers.current.forEach(clearTimeout);
    setStage("capture");
    setShown(0);
    setEdits({});
    setRemoved([]);
    setChecked(false);
    setTried(false);
    setConfirmed([]);
  };
  const active = sampleRx.filter((r) => !removed.includes(r.id));
  const unresolved = active.filter((r) => r.confidence === "unreadable" && !(edits[r.id] ?? "").trim());
  const confirm = () => {
    setTried(true);
    if (!checked || unresolved.length) return;
    // Typed corrections are matched against stock by name — only after a person has entered them.
    const typed = (id: number) => pharmaItems.find((p) => p.name.toLowerCase() === (edits[id] ?? "").trim().toLowerCase())?.id;
    setConfirmed(active.flatMap((r) => { const m = r.match ?? typed(r.id); return m ? [m] : []; }));
    setStage("done");
  };

  const stageIdx = { capture: 0, read: 1, review: 2, done: 2 }[stage];
  const conf = (c: "high" | "check" | "unreadable") => ({ high: "bg-leaf-soft text-leaf-ink", check: "bg-marigold-soft text-[#6b4a07]", unreadable: "bg-vermilion-soft text-vermilion" })[c];

  return (
    <div>
      {/* Stage indicator */}
      <ol aria-label={o.stagesLabel} className="mb-8 grid grid-cols-3 gap-2">
        {(["capture", "read", "review"] as const).map((k, idx) => (
          <li key={k} aria-current={idx === stageIdx ? "step" : undefined} className="text-sm">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
              <motion.div className="h-full bg-leaf-glow" initial={false} animate={{ width: idx <= stageIdx ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
            </div>
            <p className={cn("mt-2 font-semibold", idx === stageIdx ? "text-cream" : "text-cream/50")}>
              {fmtNumber(idx + 1, locale)}. {o.stages[k]}
            </p>
            <p className="hidden text-xs text-cream/50 sm:block">{o.stageHints[k]}</p>
          </li>
        ))}
      </ol>

      <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Prescription with scan line + highlights */}
        <div className="relative mx-auto w-full max-w-[400px]">
          <motion.div className="relative overflow-hidden rounded-lg shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)]" animate={stage === "capture" ? { rotate: -2.5, scale: 0.98 } : { rotate: 0, scale: 1 }} transition={{ duration: 0.6, ease }}>
            {slip}
            <svg viewBox="0 0 400 520" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
              {sampleRx.map((r) =>
                shown >= r.id && stage !== "capture"
                  ? fields.map((f, k) => {
                      const [x, y, w, h] = rxRegions[r.id][f];
                      const color = r.confidence === "unreadable" && f === "medicine" ? "#b9442e" : r.confidence === "check" && f === "strength" ? "#d99a1e" : "#16a34a";
                      return (
                        <motion.rect key={`${r.id}-${f}`} x={x} y={y} width={w} height={h} rx="5" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: k * 0.06 }} style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }} />
                      );
                    })
                  : null,
              )}
            </svg>
            {stage === "read" && shown < 3 && !reduce && (
              <motion.div className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-leaf-glow/35 to-transparent" initial={{ top: "18%" }} animate={{ top: ["18%", "78%", "18%"] }} transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }} aria-hidden="true">
                <span className="absolute inset-x-0 top-1/2 h-0.5 bg-leaf-glow shadow-[0_0_12px_#4ade80]" />
              </motion.div>
            )}
            {stage === "capture" && (
              <div className="absolute inset-0 flex items-center justify-center bg-forest/30 backdrop-blur-[1px]">
                <div className="absolute inset-6 rounded-xl border-2 border-dashed border-white/70" aria-hidden="true" />
              </div>
            )}
          </motion.div>
          <p className="mt-3 text-center text-xs text-cream/55">{o.slipAlt}</p>
        </div>

        {/* Extraction + review */}
        <div className="rounded-[1.4rem] bg-white p-4 text-ink shadow-[var(--shadow-float)] sm:p-5" aria-live="polite">
          {stage === "capture" && (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
              <svg viewBox="0 0 48 48" className="size-14 text-leaf-deep" aria-hidden="true">
                <rect x="6" y="12" width="36" height="26" rx="5" fill="none" stroke="currentColor" strokeWidth="2.4" />
                <circle cx="24" cy="25" r="7" fill="none" stroke="currentColor" strokeWidth="2.4" />
                <path d="M17 12l3-5h8l3 5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
              </svg>
              <p className="max-w-xs text-muted">{o.stageHints.capture}</p>
              <button type="button" onClick={capture} className="h-11 rounded-full bg-leaf-deep px-6 font-semibold text-white hover:bg-leaf-ink">
                {o.capture}
              </button>
            </div>
          )}

          {stage === "read" && (
            <div className="min-h-[320px]">
              <p className="flex items-center gap-2 text-sm font-semibold">
                {shown < 3 && <span className="size-2 animate-pulse rounded-full bg-leaf" />}
                {shown < 3 ? o.reading : o.stages.read}
              </p>
              <ul className="mt-3 space-y-2">
                {sampleRx.map((r) =>
                  shown >= r.id ? (
                    <motion.li key={r.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border border-ink/10 p-3 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold" lang="en" translate="no">
                          {r.medicine ?? "— ? —"} <span className="font-normal text-muted">{r.strength}</span>
                        </span>
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", conf(r.confidence))}>{o.confidence[r.confidence]}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted" lang="en" translate="no">
                        {r.frequency} · {r.instructions} · {r.duration}
                      </p>
                    </motion.li>
                  ) : null,
                )}
              </ul>
              {shown >= 3 && (
                <button type="button" onClick={() => setStage("review")} className="mt-4 h-11 w-full rounded-full bg-leaf-deep font-semibold text-white hover:bg-leaf-ink">
                  {o.next}
                </button>
              )}
            </div>
          )}

          {(stage === "review" || stage === "done") && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted">
                      <th className="py-2 pr-2 font-semibold">#</th>
                      {fields.map((f) => (
                        <th key={f} className="px-2 py-2 font-semibold">
                          {o.fields[f]}
                        </th>
                      ))}
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {active.map((r) => (
                      <tr key={r.id} className="border-t border-ink/5 align-top">
                        <td className="font-latin py-2.5 pr-2 text-muted">{fmtNumber(r.id, locale)}</td>
                        <td className="px-2 py-2.5">
                          {r.confidence === "unreadable" ? (
                            <div>
                              <label htmlFor={`${editId}-${r.id}`} className="sr-only">
                                {o.correctLabel}
                              </label>
                              <input
                                id={`${editId}-${r.id}`}
                                value={edits[r.id] ?? ""}
                                onChange={(e) => setEdits((x) => ({ ...x, [r.id]: e.target.value }))}
                                disabled={stage === "done"}
                                placeholder={o.correctLabel}
                                aria-invalid={tried && !(edits[r.id] ?? "").trim()}
                                className="h-9 w-40 rounded-lg border border-vermilion/50 bg-vermilion-soft/30 px-2 text-sm focus:border-vermilion focus:outline-none"
                              />
                              <p className="mt-1 max-w-[12rem] text-[0.7rem] leading-snug text-vermilion">{o.unreadableNote}</p>
                            </div>
                          ) : (
                            <span className="font-semibold" lang="en" translate="no">
                              {r.medicine}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2.5" lang="en" translate="no">
                          <span className={cn(r.confidence === "check" && "rounded bg-marigold-soft px-1")}>{r.strength}</span>
                          {r.confidence === "check" && <p className="mt-1 max-w-[9rem] text-[0.7rem] leading-snug text-[#6b4a07]">{o.checkNote}</p>}
                        </td>
                        <td className="px-2 py-2.5" lang="en" translate="no">
                          {r.instructions}
                        </td>
                        <td className="font-latin px-2 py-2.5" translate="no">
                          {r.frequency}
                        </td>
                        <td className="px-2 py-2.5" lang="en" translate="no">
                          {r.duration}
                        </td>
                        <td className="py-2.5 pl-2">
                          {stage === "review" && (
                            <button type="button" onClick={() => setRemoved((x) => [...x, r.id])} aria-label={`${o.removeItem} (${fmtNumber(r.id, locale)})`} className="rounded p-1 text-muted hover:bg-ink/5 hover:text-vermilion">
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {stage === "review" ? (
                <div className="mt-4 space-y-3 border-t border-ink/10 pt-4">
                  <label className={cn("flex items-start gap-3 rounded-xl p-2 text-sm transition-colors", tried && !checked && "bg-vermilion-soft/50 ring-1 ring-vermilion/40")}>
                    <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[var(--color-leaf-deep)]" aria-invalid={tried && !checked} />
                    <span>{o.confirmLabel}</span>
                  </label>
                  {tried && unresolved.length > 0 && (
                    <p role="alert" className="text-sm text-vermilion">
                      {o.needsEntry}
                    </p>
                  )}
                  <button type="button" onClick={confirm} className="h-11 w-full rounded-full bg-leaf-deep font-semibold text-white hover:bg-leaf-ink">
                    {o.confirmBtn}
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl bg-leaf-soft/70 p-4 text-sm">
                  <p className="font-bold text-leaf-ink">✓ {o.confirmedTitle}</p>
                  <p className="mt-1 text-ink-soft">{o.confirmedNote}</p>
                  <a href="#pos" className="mt-3 inline-flex font-semibold text-leaf-ink underline underline-offset-4">
                    {o.findInStock} →
                  </a>
                </motion.div>
              )}
            </div>
          )}

          {stage !== "capture" && (
            <button type="button" onClick={reset} className="mt-4 text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline">
              {o.reset}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- D: inventory & expiry ---------------- */
/** Piecewise scale: the next 90 days take 55% of the axis so close expiries stay readable. */
const expiryPos = (d: number) => (d <= 90 ? (Math.max(d, 0) / 90) * 55 : 55 + ((Math.min(d, 365) - 90) / 275) * 45);
const expiryTicks = [30, 60, 90, 182, 365] as const;
const invTone = {
  all: { c: "#0b5960", soft: "#e3f4f4" },
  expiring: { c: "#c2410c", soft: "#fff1e6" },
  low: { c: "#a16207", soft: "#fdf3d7" },
} as const;
const stateColor = { expiring: "#ea580c", low: "#d99a1e", out: "#b9442e", inStock: "#0e7c86" } as const;
const laneH = [46, 86, 126];
/**
 * Medicines in expiry order. Each label gets the lowest lane where it fits beside the previous label,
 * using an estimate of its width at the timeline's measured width; labels near the end open leftwards.
 */
function layoutMarks(widthPx: number) {
  const ends = laneH.map(() => -Infinity);
  return [...pharmaItems]
    .map((p) => ({ id: p.id, name: p.name, days: daysUntilDemo(p.expiry) }))
    .sort((a, b) => a.days - b.days)
    .map((m) => {
      const pos = expiryPos(m.days);
      const w = ((m.name.length * 6.6 + 52) / widthPx) * 100;
      const pad = (14 / widthPx) * 100;
      const right = pos + w - pad > 100;
      const [start, end] = right ? [pos - w + pad, pos + pad] : [pos - pad, pos + w - pad];
      let lane = ends.findIndex((e) => e + 0.8 < start);
      if (lane < 0) lane = ends.indexOf(Math.min(...ends));
      ends[lane] = end;
      return { ...m, pos, lane, right };
    });
}

function CountUp({ value, start }: { value: number; start: boolean }) {
  const { locale } = useI18n();
  const reduce = useReducedMotion();
  const spring = useSpring(0, { stiffness: 60, damping: 16 });
  const text = useTransform(spring, (v) => fmtNumber(Math.round(v), locale));
  useEffect(() => {
    if (!start) return;
    if (reduce) spring.jump(value);
    else spring.set(value);
  }, [start, value, reduce, spring]);
  return <motion.span>{text}</motion.span>;
}

export function InventoryDemo() {
  const { t, locale } = useI18n();
  const inv = t.pharmacy.inventory;
  const tl = inv.timeline;
  const u = t.pharmacy.ui;
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<InvFilter>("all");
  const [sel, setSel] = useState<PharmaId>("paracetamol");
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "-25% 0px" });
  const track = useRef<HTMLDivElement>(null);
  const [trackW, setTrackW] = useState(860);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setTrackW(Math.round(e.contentRect.width) || 860));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const marks = useMemo(() => layoutMarks(trackW), [trackW]);
  const dateFmt = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const counts = { all: pharmaItems.length, expiring: pharmaItems.filter((p) => inInvFilter(p.id, "expiring")).length, low: pharmaItems.filter((p) => inInvFilter(p.id, "low")).length };
  const pick = (id: PharmaId) => {
    setSel(id);
    if (!inInvFilter(id, filter)) setFilter("all");
  };
  const p = pharmaItems.find((x) => x.id === sel)!;
  const days = daysUntilDemo(p.expiry);
  const state = stockState(p.id);
  const ring = 2 * Math.PI * 34;

  return (
    <div ref={root} className="relative">
      {/* Floating alert, like the app's own notification */}
      <motion.div
        className="relative z-20 mb-4 flex w-fit items-center gap-2.5 rounded-2xl bg-[#c2410c] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_-14px_rgb(194_65_12/0.7)] lg:absolute lg:-top-6 lg:right-36 lg:mb-0"
        initial={reduce ? false : { opacity: 0, y: -14, scale: 0.94 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        <span className="relative flex size-6 items-center justify-center rounded-full bg-white/20" aria-hidden="true">
          <svg viewBox="0 0 20 20" className="size-3.5">
            <path d="M10 3a5 5 0 0 0-5 5v3l-1.5 2.5h13L15 11V8a5 5 0 0 0-5-5zM8 16a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {!reduce && <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />}
        </span>
        {interpolate(inv.alert, { n: fmtNumber(counts.expiring, locale) })}
      </motion.div>

      <PharmaWindow active="stock">
        <div className="space-y-4 p-3 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-base font-bold">{inv.eyebrow}</p>
            <p className="text-xs text-muted">
              {tl.today} · {dateFmt.format(new Date(demoToday))}
            </p>
          </div>

          {/* Stat cards double as filters */}
          <div role="radiogroup" aria-label={inv.filterLabel} className="grid gap-2.5 sm:grid-cols-3 sm:gap-3">
            {(["all", "expiring", "low"] as const).map((f, i) => {
              const on = filter === f;
              const tone = invTone[f];
              return (
                <motion.button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setFilter(f)}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease }}
                  className={cn("relative flex items-center gap-3 overflow-hidden rounded-2xl p-3.5 text-left transition-[box-shadow,background-color] duration-300 sm:block sm:p-4", !on && "bg-white ring-1 ring-ink/10 hover:ring-ink/25")}
                  style={on ? { backgroundColor: tone.soft, boxShadow: `inset 0 0 0 2px ${tone.c}` } : undefined}
                >
                  <span className="font-latin block text-3xl leading-none font-extrabold tabular-nums sm:text-4xl" style={{ color: tone.c }}>
                    <CountUp value={counts[f]} start={inView} />
                  </span>
                  <span className="block min-w-0">
                    <span className="block text-sm font-bold text-ink sm:mt-2">{inv.filters[f]}</span>
                    <span className="block text-xs text-muted">{inv.statHints[f]}</span>
                  </span>
                  {on && <motion.span layoutId="inv-stat" className="absolute top-3 right-3 size-2 rounded-full" style={{ backgroundColor: tone.c }} transition={{ type: "spring", stiffness: 400, damping: 30 }} aria-hidden="true" />}
                </motion.button>
              );
            })}
          </div>

          {/* Expiry timeline */}
          <div className="rounded-2xl bg-gradient-to-b from-[#f7faf8] to-white p-4 ring-1 ring-ink/5 sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm font-bold">{tl.title}</p>
              <p className="text-xs text-muted">{tl.hint}</p>
            </div>
            <div ref={track} className="relative mx-1 mt-4 h-[104px] sm:mx-3 lg:h-[216px]">
              {/* Next 60 days */}
              <motion.div
                className="absolute top-0 bottom-[30px] left-0 origin-left overflow-hidden rounded-xl bg-gradient-to-r from-[#fb923c]/30 via-[#fb923c]/14 to-[#fb923c]/4 ring-1 ring-[#fb923c]/35"
                style={{ width: `${expiryPos(60)}%` }}
                initial={reduce ? false : { scaleX: 0, opacity: 0 }}
                animate={inView ? { scaleX: 1, opacity: 1 } : undefined}
                transition={{ duration: 0.9, delay: 0.3, ease }}
              >
                <span className="absolute top-2 left-2.5 flex items-center gap-1.5 text-[0.68rem] font-bold text-[#c2410c]">
                  <span className="relative size-1.5 rounded-full bg-[#ea580c]">{!reduce && <span className="absolute inset-0 animate-ping rounded-full bg-[#ea580c]" />}</span>
                  {tl.zone}
                </span>
              </motion.div>

              {/* Axis */}
              <div className="absolute inset-x-0 bottom-[28px] h-1 rounded-full bg-ink/8">
                <motion.div className="h-full origin-left rounded-full bg-gradient-to-r from-[#ea580c] via-[#d99a1e] via-40% to-[#0e7c86]" initial={reduce ? false : { scaleX: 0 }} animate={inView ? { scaleX: 1 } : undefined} transition={{ duration: 1.2, delay: 0.2, ease }} />
              </div>
              <span className="absolute bottom-0 left-0 text-[0.68rem] font-bold text-ink">{tl.today}</span>
              <span className="absolute bottom-[23px] left-0 size-3.5 -translate-x-1/2 rounded-full border-[3px] border-white bg-ink shadow" aria-hidden="true" />
              {expiryTicks.map((d, i) => (
                <span key={d} className={cn("absolute bottom-0 text-[0.65rem] whitespace-nowrap text-muted", d === 365 ? "-translate-x-full" : "-translate-x-1/2")} style={{ left: `${expiryPos(d)}%` }}>
                  <span className={cn("absolute bottom-[19px] h-2 w-px bg-ink/20", d === 365 ? "right-0" : "left-1/2")} />
                  {tl.ticks[i]}
                </span>
              ))}

              {/* Medicines */}
              {marks.map((m, i) => {
                const st = stockState(m.id);
                const color = stateColor[st];
                const on = sel === m.id;
                const dim = !inInvFilter(m.id, filter);
                const { right } = m;
                const med = m;
                return (
                  <motion.button
                    key={m.id}
                    type="button"
                    aria-pressed={on}
                    aria-label={`${med.name} — ${interpolate(u.daysLeft, { n: fmtNumber(m.days, locale) })}`}
                    onClick={() => pick(m.id)}
                    className="group absolute bottom-[30px] z-10 h-0 w-0 outline-none"
                    style={{ left: `${m.pos}%`, zIndex: on ? 30 : 10 }}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : undefined}
                    transition={{ delay: 0.7 + i * 0.09, type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <span className={cn("transition-opacity duration-300", dim && "opacity-25")}>
                    {/* leader + label (desktop) */}
                    <span className="absolute bottom-0 left-0 hidden w-px origin-bottom lg:block" style={{ height: laneH[m.lane], backgroundColor: color, opacity: on ? 0.9 : 0.35 }} aria-hidden="true" />
                    <span
                      className={cn(
                        "absolute hidden items-center gap-1.5 rounded-full py-1 pr-1 pl-2.5 text-[0.7rem] font-bold whitespace-nowrap shadow-[0_6px_16px_-8px_rgb(12_35_24/0.4)] ring-1 transition-[background-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-focus-visible:ring-2 lg:flex",
                        right ? "right-0 translate-x-3" : "left-0 -translate-x-3",
                        on ? "text-white" : "bg-white text-ink ring-ink/10",
                      )}
                      style={{ bottom: laneH[m.lane], ...(on ? { backgroundColor: color, ["--tw-ring-color" as string]: color } : null) }}
                      aria-hidden="true"
                    >
                      <span lang="en" translate="no">
                        {med.name}
                      </span>
                      <span className={cn("rounded-full px-1.5 py-0.5 text-[0.62rem]", on ? "bg-white/25" : "")} style={on ? undefined : { backgroundColor: `${color}1f`, color }}>
                        {interpolate(tl.daysShort, { n: fmtNumber(m.days, locale) })}
                      </span>
                    </span>
                    {/* dot */}
                    <span className={cn("absolute bottom-0 left-0 block size-3.5 -translate-x-1/2 translate-y-1/2 rounded-full border-[2.5px] border-white shadow transition-transform duration-300 group-focus-visible:ring-2 group-focus-visible:ring-ink sm:size-4", on ? "scale-150" : "group-hover:scale-125")} style={{ backgroundColor: color }} aria-hidden="true">
                      {on && !reduce && <span className="absolute -inset-1 animate-ping rounded-full opacity-50" style={{ backgroundColor: color }} />}
                    </span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <p className="mt-3 text-[0.68rem] text-muted">{tl.scale}</p>
          </div>

          {/* Records + selected medicine */}
          <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
            <div className="overflow-hidden rounded-2xl ring-1 ring-ink/5">
              <InventoryTable filter={filter} selected={sel} onSelect={pick} />
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-forest p-5 text-cream" aria-live="polite">
              <div className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: stateColor[state] }} aria-hidden="true" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={sel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease }} className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-cream/60">{inv.columns.medicine}</p>
                      <p className="mt-1 text-lg leading-snug font-bold [&_.text-muted]:text-cream/55">
                        <MedName id={sel} />
                      </p>
                      <div className="mt-2">
                        <StateBadge state={state} />
                      </div>
                    </div>
                    {/* Expiry countdown ring: share of a year left */}
                    <div className="relative size-[84px] shrink-0">
                      <svg viewBox="0 0 84 84" className="size-full -rotate-90" aria-hidden="true">
                        <circle cx="42" cy="42" r="34" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="7" />
                        <motion.circle cx="42" cy="42" r="34" fill="none" stroke={days <= 60 ? "#fb923c" : "#4ade80"} strokeWidth="7" strokeLinecap="round" strokeDasharray={ring} initial={{ strokeDashoffset: ring }} animate={{ strokeDashoffset: ring * (1 - Math.min(days, 365) / 365) }} transition={{ duration: reduce ? 0 : 0.9, ease }} />
                      </svg>
                      <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                        <span className="font-latin text-xl font-extrabold tabular-nums">{fmtNumber(days, locale)}</span>
                        <span className="mt-0.5 text-[0.6rem] text-cream/60">{tl.daysWord}</span>
                      </span>
                    </div>
                  </div>
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-white/6 p-3">
                      <dt className="text-xs text-cream/55">{tl.detail.batch}</dt>
                      <dd className="font-latin mt-0.5 font-bold" translate="no">
                        {p.batch}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-white/6 p-3">
                      <dt className="text-xs text-cream/55">{tl.detail.expiry}</dt>
                      <dd className="mt-0.5 font-bold">{dateFmt.format(new Date(p.expiry))}</dd>
                    </div>
                    <div className="col-span-2 rounded-xl bg-white/6 p-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className="text-xs text-cream/55">{tl.detail.stock}</dt>
                        <dd className="font-latin font-bold tabular-nums">
                          {fmtNumber(p.stock, locale)} <span className="text-xs font-semibold text-cream/60">{u.units[p.unit]}</span>
                        </dd>
                      </div>
                      <StockMeter id={sel} dark className="mt-2.5 h-2" />
                      <p className="mt-1.5 text-[0.7rem] text-cream/55">{interpolate(tl.detail.min, { n: fmtNumber(p.min, locale) })}</p>
                    </div>
                  </dl>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </PharmaWindow>
      <p className="mt-3 text-xs text-muted">{inv.note}</p>
    </div>
  );
}

/* ---------------- E: POS ---------------- */
export function PosDemo() {
  const { confirmed } = useContext(RxContext);
  return (
    <PharmaWindow active="sales">
      <PosScreen rxItems={confirmed} />
    </PharmaWindow>
  );
}

/* ---------------- G: reports ---------------- */
export function ReportsDemo() {
  return (
    <PharmaWindow active="reports">
      <ReportsScreen />
    </PharmaWindow>
  );
}

/* ---------------- H: assistant ---------------- */
type Intent = "low" | "sales" | "expiry" | "clinical" | "unknown";
const intentOf = (q: string): Intent => {
  if (/fever|জ্বর|give a patient|কী ওষুধ দেব|prescribe|dose|ডোজ|treatment|চিকিৎসা/i.test(q)) return "clinical";
  if (/expir|মেয়াদ/i.test(q)) return "expiry";
  if (/low|running|কমে|শেষ হয়ে/i.test(q)) return "low";
  if (/sale|বিক্রি/i.test(q)) return "sales";
  return "unknown";
};

export function AssistantDemo() {
  const { t, locale } = useI18n();
  const a = t.pharmacy.assistant;
  const u = t.pharmacy.ui;
  const reduce = useReducedMotion();
  const [msgs, setMsgs] = useState<{ from: "me" | "ai"; text: string; intent?: Intent }[]>([]);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const inputId = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "-30% 0px" });
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const ask = (q: string) => {
    const it = intentOf(q);
    setMsgs([{ from: "me", text: q }]);
    setThinking(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => {
        setThinking(false);
        setMsgs([{ from: "me", text: q }, { from: "ai", text: a.answers[it], intent: it }]);
      },
      reduce ? 0 : 900,
    );
  };
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => ask(a.questions[2]), 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  const last = msgs.find((m) => m.from === "ai")?.intent;
  const list = last === "low" ? pharmaItems.filter((p) => p.stock < p.min) : last === "expiry" ? pharmaItems.filter((p) => daysUntilDemo(p.expiry) <= 60) : [];

  return (
    <div ref={root} className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-[1.4rem] bg-white/[0.04] p-5 ring-1 ring-white/10">
        <p className="text-sm font-semibold text-leaf-glow">{a.tryLabel}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {a.questions.map((q) => (
            <button key={q} type="button" disabled={thinking} onClick={() => ask(q)} className="rounded-full border border-cream/15 bg-white/5 px-3.5 py-2 text-left text-sm text-cream/90 transition-colors hover:border-leaf-glow/60 hover:bg-white/10 disabled:opacity-50">
              {q}
            </button>
          ))}
        </div>
        <div className="mt-5 min-h-[180px] space-y-3" aria-live="polite">
          <AnimatePresence initial={false}>
            {msgs.map((m, i) => (
              <motion.div key={i + m.text} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("max-w-[90%]", m.from === "me" && "ml-auto")}>
                <p className="mb-1 text-xs text-cream/50">{m.from === "me" ? a.you : a.assistantName}</p>
                <p className={cn("rounded-2xl px-4 py-2.5 text-sm", m.from === "me" ? "rounded-br-md bg-cream text-ink" : m.intent === "clinical" || m.intent === "unknown" ? "rounded-bl-md bg-marigold/20 text-marigold-soft" : "rounded-bl-md bg-leaf-deep text-cream")}>{m.text}</p>
                {m.intent && m.intent !== "clinical" && m.intent !== "unknown" && <p className="mt-1 text-xs text-leaf-glow">{interpolate(a.source, { source: a.sources[m.intent] })}</p>}
                {m.intent === "clinical" && <p className="mt-1 text-xs text-marigold-soft">{a.outOfScope}</p>}
              </motion.div>
            ))}
          </AnimatePresence>
          {thinking && (
            <div className="flex gap-1.5" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="size-2 rounded-full bg-leaf-glow" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }} />
              ))}
            </div>
          )}
        </div>
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && !thinking) ask(input.trim());
            setInput("");
          }}
        >
          <label htmlFor={inputId} className="text-sm text-cream/60">
            {a.textLabel}
          </label>
          <div className="mt-2 flex gap-2">
            <input id={inputId} value={input} onChange={(e) => setInput(e.target.value)} placeholder={a.placeholder} maxLength={140} className="h-11 min-w-0 flex-1 rounded-full border border-cream/15 bg-white/5 px-4 text-cream placeholder:text-cream/40 focus:border-leaf-glow focus:outline-none" />
            <button type="submit" disabled={!input.trim() || thinking} className="h-11 shrink-0 rounded-full bg-leaf-deep px-5 font-semibold text-white disabled:opacity-50">
              {a.send}
            </button>
          </div>
        </form>
      </div>
      {/* Connected record view */}
      <div>
        <PharmaWindow active={last === "sales" ? "reports" : "stock"}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={last ?? "none"} className="p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {last === "sales" ? (
                <div className="rounded-xl bg-gradient-to-br from-[#15803d] to-[#0f5f2e] p-4 text-white">
                  <p className="text-xs text-white/75">{u.todaySales}</p>
                  <p className="font-latin text-2xl font-extrabold">{fmtTaka(pharmaToday.sales, locale)}</p>
                  <p className="text-xs text-white/75">{interpolate(u.bills, { n: fmtNumber(pharmaToday.bills, locale) })}</p>
                </div>
              ) : list.length ? (
                <ul className="space-y-2 text-sm">
                  {list.map((p) => (
                    <motion.li key={p.id} initial={{ backgroundColor: "rgba(74,222,128,0.3)" }} animate={{ backgroundColor: "rgba(247,250,248,1)" }} transition={{ duration: 1.2 }} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2">
                      <MedName id={p.id} className="truncate font-semibold" />
                      <span className="flex items-center gap-2 text-xs">
                        {last === "expiry" ? <span className="text-[#9a3412]">{interpolate(u.daysLeft, { n: fmtNumber(daysUntilDemo(p.expiry), locale) })}</span> : <span className="font-latin">{fmtNumber(p.stock, locale)}</span>}
                        <StateBadge state={stockState(p.id)} />
                      </span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="py-10 text-center text-sm text-ink-soft">{a.tryLabel} →</p>
              )}
            </motion.div>
          </AnimatePresence>
        </PharmaWindow>
        <p className="mt-3 rounded-2xl border border-marigold/30 bg-marigold/10 p-4 text-sm text-marigold-soft">{a.notice}</p>
      </div>
    </div>
  );
}
