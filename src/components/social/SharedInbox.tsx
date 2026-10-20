"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, fmtTaka, interpolate } from "@/lib/format";
import { panjabi, type Size } from "@/content/demo-data";
import { SampleBadge } from "@/components/ui/Section";

type Msg = { id: number; from: "customer" | "ai" | "staff" | "system"; text: string; source?: "price" | "stock" };
type Stage = "start" | "priced" | "checked" | "ordered" | "human";
type Option = { label: string; run: () => void };

const sizes: Size[] = ["M", "L", "XL"];

/**
 * Signature F-commerce demo. The assistant's answers are computed from `panjabi` in demo-data —
 * price and per-size stock — never invented. Uncertain questions go to a human.
 */
export function SharedInbox() {
  const { t, locale } = useI18n();
  const ib = t.fcommerce.inbox;
  const sc = ib.script;
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [stage, setStage] = useState<Stage>("start");
  const [typing, setTyping] = useState<"ai" | "staff" | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [highlight, setHighlight] = useState<"price" | Size | null>(null);
  const [order, setOrder] = useState<{ size: Size } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "0px 0px -25% 0px" });
  const autoStarted = useRef(false);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const push = (m: Omit<Msg, "id">) => setMsgs((x) => [...x, { ...m, id: nextId.current++ }]);
  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
  const price = fmtNumber(panjabi.price, locale);

  const askPrice = () => {
    push({ from: "customer", text: sc.q1 });
    setTyping("ai");
    later(900, () => {
      setTyping(null);
      setHighlight("price");
      push({ from: "ai", text: interpolate(sc.a1, { price }), source: "price" });
      setStage("priced");
    });
  };

  // Play the opening exchange once when the inbox first scrolls into view, so it never sits empty.
  useEffect(() => {
    if (!inView || autoStarted.current) return;
    autoStarted.current = true;
    const id = setTimeout(() => {
      if (nextId.current === 1) askPrice();
    }, 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const askSize = (s: Size) => {
    setSize(s);
    push({ from: "customer", text: interpolate(sc.q2, { size: s }) });
    setTyping("ai");
    later(700, () => {
      setTyping(null);
      push({ from: "ai", text: sc.checking });
      setHighlight(s);
      setTyping("ai");
      later(1100, () => {
        setTyping(null);
        const qty = panjabi.stock[s];
        if (qty > 0) {
          push({ from: "ai", text: interpolate(sc.inStock, { size: s, qty: fmtNumber(qty, locale) }), source: "stock" });
          setStage("checked");
        } else {
          const avail = sizes.filter((z) => panjabi.stock[z] > 0).join(", ");
          push({ from: "ai", text: interpolate(sc.outStock, { size: s, sizes: avail }), source: "stock" });
          setSize(null);
          setStage("priced");
        }
      });
    });
  };

  const confirmOrder = () => {
    if (!size) return;
    push({ from: "customer", text: sc.q3 });
    setTyping("ai");
    later(1000, () => {
      setTyping(null);
      push({ from: "ai", text: interpolate(sc.a3, { size, price }) });
      setOrder({ size });
      setStage("ordered");
    });
  };

  const askHard = () => {
    push({ from: "customer", text: sc.qHard });
    setTyping("ai");
    later(900, () => {
      setTyping(null);
      push({ from: "ai", text: sc.handover });
      push({ from: "system", text: ib.handedOver });
      setStage("human");
      setTyping("staff");
      later(1500, () => {
        setTyping(null);
        push({ from: "staff", text: sc.staffReply });
      });
    });
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setMsgs([]);
    setStage("start");
    setTyping(null);
    setSize(null);
    setHighlight(null);
    setOrder(null);
  };

  const busy = typing !== null;
  const options: Option[] =
    stage === "start"
      ? [{ label: sc.q1, run: askPrice }]
      : stage === "priced"
        ? [...sizes.map((s) => ({ label: interpolate(sc.q2, { size: s }), run: () => askSize(s) })), { label: sc.qHard, run: askHard }]
        : stage === "checked"
          ? [{ label: sc.q3, run: confirmOrder }, { label: sc.qHard, run: askHard }]
          : [];

  const status = stage === "human" ? "human" : stage === "ordered" ? "ordered" : msgs.length ? "ai" : "idle";
  const statusTone = { ai: "bg-[#ede4fd] text-[#5b21b6]", human: "bg-marigold-soft text-[#6b4a07]", ordered: "bg-leaf-soft text-leaf-ink", idle: "bg-ink/5 text-muted" }[status];

  return (
    <div ref={root} className="overflow-hidden rounded-[1.6rem] bg-white shadow-[var(--shadow-float)] ring-1 ring-ink/10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-[#f5f2fb] px-5 py-3">
        <p className="font-bold">{ib.eyebrow}</p>
        <SampleBadge>{t.common.sampleDataLong}</SampleBadge>
      </div>
      <div className="grid lg:grid-cols-[230px_1fr_280px]">
        {/* Conversation list */}
        <div className="hidden border-r border-ink/10 lg:block">
          <p className="px-4 pt-4 text-xs font-semibold text-muted">{ib.listTitle}</p>
          <ul className="mt-2">
            {ib.conversations.map((c, i) => (
              <li key={c.name} className={cn("border-l-4 px-4 py-3", i === 0 ? "border-[#7c3aed] bg-[#f5f2fb]" : "border-transparent opacity-70")}>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{c.name}</span>
                  <span className="shrink-0 rounded px-1.5 py-0.5 text-[0.6rem] font-semibold text-muted ring-1 ring-ink/10">{t.fcommerce.crm.sources[c.channel as "messenger" | "instagram"]}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">{c.preview}</p>
                {i === 0 && <span className={cn("mt-1.5 inline-block rounded-full px-2 py-0.5 text-[0.65rem] font-semibold", statusTone)}>{ib.statuses[status]}</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Thread */}
        <div className="flex min-h-[520px] flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-ink/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">{ib.conversations[0].name}</p>
              <p className="text-xs text-muted">{t.channels.messenger.name}</p>
            </div>
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold lg:hidden", statusTone)}>{ib.statuses[status]}</span>
            <span className="hidden text-xs text-muted lg:inline">
              {ib.assigned}: <strong className="text-ink">{stage === "human" ? ib.staffName : ib.aiLabel}</strong>
            </span>
          </div>
          <div ref={scroller} className="flex-1 space-y-2.5 overflow-y-auto bg-[#faf9fc] p-4" aria-live="polite" lang="bn">
            {msgs.length === 0 && <p className="py-10 text-center text-sm text-muted" lang={locale === "bn" ? "bn" : "en"}>{t.home.voice.empty}</p>}
            <AnimatePresence initial={false}>
              {msgs.map((m) =>
                m.from === "system" ? (
                  <motion.p key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-1 text-center text-xs font-semibold text-[#6b4a07]" lang={locale === "bn" ? "bn" : "en"}>
                    — {m.text} —
                  </motion.p>
                ) : (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn("max-w-[85%]", m.from === "customer" ? "ml-auto" : "")}>
                    {m.from !== "customer" && <p className="mb-0.5 text-[0.65rem] font-semibold text-muted">{m.from === "ai" ? ib.aiLabel : ib.staffName}</p>}
                    <p className={cn("rounded-2xl px-3.5 py-2 text-sm", m.from === "customer" ? "rounded-br-md bg-[#7c3aed] text-white" : m.from === "ai" ? "rounded-bl-md bg-white ring-1 ring-ink/10" : "rounded-bl-md bg-marigold-soft")}>{m.text}</p>
                    {m.source && (
                      <p className="mt-0.5 flex items-center gap-1 text-[0.65rem] font-semibold text-[#5b21b6]">
                        <span aria-hidden="true">↳</span> {ib.productTitle}
                      </p>
                    )}
                  </motion.div>
                ),
              )}
            </AnimatePresence>
            {typing && (
              <div className="flex gap-1 px-1" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className={cn("size-2 rounded-full", typing === "ai" ? "bg-[#7c3aed]" : "bg-marigold")} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }} />
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-ink/10 p-3">
            <p className="text-xs font-semibold text-muted">{ib.customerSays}</p>
            <div className="mt-2 flex flex-wrap gap-2" lang="bn">
              {options.map((o) => (
                <button key={o.label} type="button" disabled={busy} onClick={o.run} className="rounded-full border border-[#7c3aed]/30 bg-[#f5f2fb] px-3 py-1.5 text-sm text-[#4c1d95] transition-colors hover:bg-[#ede4fd] disabled:opacity-50">
                  {o.label}
                </button>
              ))}
              {(stage === "ordered" || stage === "human") && !busy && (
                <button type="button" onClick={reset} className="rounded-full bg-ink px-3.5 py-1.5 text-sm font-semibold text-cream" lang={locale === "bn" ? "bn" : "en"}>
                  {ib.reset}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Context panel */}
        <div className="space-y-3 border-t border-ink/10 bg-[#fcfbfe] p-4 lg:border-t-0 lg:border-l">
          <div className="rounded-xl bg-white p-3 ring-1 ring-ink/10">
            <p className="text-xs font-semibold text-muted">{ib.profileTitle}</p>
            <p className="mt-1 font-semibold">{ib.conversations[0].name}</p>
            <p className="text-xs text-muted">
              {ib.profileSince} · {ib.previousOrders}
            </p>
          </div>
          <div className={cn("rounded-xl bg-white p-3 ring-1 transition-shadow duration-500", highlight ? "shadow-[0_0_0_4px_rgb(124_58_237/0.15)] ring-[#7c3aed]" : "ring-ink/10")}>
            <p className="text-xs font-semibold text-muted">{ib.productTitle}</p>
            <div className="mt-2 flex gap-3">
              <div className="size-14 shrink-0 rounded-lg bg-[#7A8B4A]/40" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{ib.productName}</p>
                <p className={cn("font-latin mt-0.5 inline-block rounded px-1 text-sm font-bold transition-colors", highlight === "price" ? "bg-[#ede4fd] text-[#5b21b6]" : "")}>{fmtTaka(panjabi.price, locale)}</p>
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold text-muted">{ib.stockTitle}</p>
            <ul className="mt-1 grid grid-cols-3 gap-1.5">
              {sizes.map((s) => (
                <li key={s} className={cn("rounded-lg px-2 py-1.5 text-center text-xs transition-all duration-500", highlight === s ? "bg-[#7c3aed] text-white" : panjabi.stock[s] ? "bg-ink/[0.04]" : "bg-ink/[0.04] text-muted line-through")}>
                  <span className="font-latin block font-bold">{s}</span>
                  {fmtNumber(panjabi.stock[s], locale)}
                </li>
              ))}
            </ul>
          </div>
          <div className={cn("rounded-xl p-3 ring-1 transition-colors", order ? "bg-leaf-soft/60 ring-leaf/30" : "bg-white ring-ink/10")}>
            <p className="text-xs font-semibold text-muted">{ib.orderTitle}</p>
            <AnimatePresence mode="wait">
              {order ? (
                <motion.div key="o" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="mt-1 text-sm font-semibold">
                    {ib.productName} · <span className="font-latin">{order.size}</span> × {fmtNumber(1, locale)}
                  </p>
                  <p className="font-latin text-sm font-bold">{fmtTaka(panjabi.price, locale)}</p>
                  <p className="mt-1 text-xs font-semibold text-leaf-ink">{ib.orderDraft}</p>
                </motion.div>
              ) : (
                <motion.p key="e" className="mt-1 text-xs text-muted">
                  {ib.orderEmpty}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <p className="text-[0.7rem] text-muted">{ib.scriptNote}</p>
        </div>
      </div>
    </div>
  );
}
