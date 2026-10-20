"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, interpolate } from "@/lib/format";
import { detectIntent, intentFigures, type Intent } from "@/content/voice";
import { lowStock, today } from "@/content/demo-data";
import { Container, Eyebrow, SampleBadge } from "@/components/ui/Section";
import { MicIcon } from "./HeroStage";

type Phase = "idle" | "asking" | "thinking" | "answered";
type Turn = { question: string; answer: string; intent: Intent | null };

/**
 * Signature moment #3: a spoken question travels along a waveform and lands on the figure it answers.
 *
 * This is a scripted demonstration. It never accesses the microphone and never plays sound.
 * A production voice integration would replace `runQuestion` with the real speech + assistant API.
 */
export function VoiceDemo() {
  const { t, locale } = useI18n();
  const v = t.home.voice;
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [turn, setTurn] = useState<Turn | null>(null);
  const [input, setInput] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const inputId = useId();

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const answerFor = useCallback(
    (intent: Intent | null) => {
      if (!intent) return v.answers.unknown;
      const f = intentFigures;
      const values: Record<Intent, Record<string, string>> = {
        sales: { amount: fmtNumber(f.sales.amount, locale) },
        dues: { amount: fmtNumber(f.dues.amount, locale) },
        stock: { count: fmtNumber(f.stock.count, locale), qty: fmtNumber(f.stock.qty, locale) },
        expenses: { amount: fmtNumber(f.expenses.amount, locale) },
      };
      return interpolate(v.answers[intent], values[intent]);
    },
    [locale, v.answers],
  );

  const runQuestion = useCallback(
    (question: string) => {
      clear();
      const intent = detectIntent(question);
      const answer = answerFor(intent);
      setTurn(null);
      if (reduce) {
        setTyped(question);
        setTurn({ question, answer, intent });
        setPhase("answered");
        return;
      }
      setPhase("asking");
      setTyped("");
      const chars = Array.from(question);
      const step = Math.min(55, 1300 / chars.length);
      chars.forEach((_, i) => timers.current.push(setTimeout(() => setTyped(chars.slice(0, i + 1).join("")), step * (i + 1))));
      const askDone = step * chars.length + 350;
      timers.current.push(setTimeout(() => setPhase("thinking"), askDone));
      timers.current.push(
        setTimeout(() => {
          setTurn({ question, answer, intent });
          setPhase("answered");
        }, askDone + 900),
      );
    },
    [answerFor, reduce],
  );

  const reset = () => {
    clear();
    setPhase("idle");
    setTyped("");
    setTurn(null);
  };

  const busy = phase === "asking" || phase === "thinking";

  return (
    <section id="voice" aria-labelledby="voice-title" className="on-dark grain-dark relative overflow-hidden bg-forest py-24 text-cream sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(22_163_74/0.22),transparent)]" />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow tone="light">{v.eyebrow}</Eyebrow>
            <h2 id="voice-title" className="font-display mt-4 text-[2.1rem] leading-snug text-balance text-cream sm:text-5xl">
              {v.title}
            </h2>
            <p className="mt-5 text-lg text-cream/75">{v.lead}</p>
            <div className="mt-8 rounded-2xl border border-marigold/30 bg-marigold/10 p-4">
              <p className="flex items-start gap-3 text-sm text-marigold-soft">
                <span className="mt-0.5 rounded-full bg-marigold/25 px-2 py-0.5 text-xs font-bold tracking-wide">{t.common.demo}</span>
                <span>{v.notice}</span>
              </p>
            </div>
            <p className="mt-4 text-sm text-cream/60">{v.dataNote}</p>
          </div>

          <Console
            phase={phase}
            typed={typed}
            turn={turn}
            busy={busy}
            onMic={() => runQuestion(v.suggestions[0])}
            onReset={reset}
            reduce={!!reduce}
          >
            <div className="mt-6">
              <p className="text-sm text-cream/60">{v.suggestionsLabel}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {v.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={busy}
                    onClick={() => runQuestion(s)}
                    className="rounded-full border border-cream/15 bg-white/5 px-3.5 py-2 text-left text-sm text-cream/85 transition-colors hover:border-leaf-glow/60 hover:bg-white/10 disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form
                className="mt-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!input.trim() || busy) return;
                  runQuestion(input.trim());
                  setInput("");
                }}
              >
                <label htmlFor={inputId} className="text-sm text-cream/60">
                  {v.textLabel}
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id={inputId}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={v.textPlaceholder}
                    maxLength={140}
                    autoComplete="off"
                    className="h-12 min-w-0 flex-1 rounded-full border border-cream/15 bg-white/5 px-5 text-cream placeholder:text-cream/40 focus:border-leaf-glow focus:outline-none"
                  />
                  <button type="submit" disabled={busy || !input.trim()} className="h-12 shrink-0 rounded-full bg-leaf-deep px-5 font-semibold text-white transition-colors hover:bg-leaf-ink disabled:opacity-50">
                    {v.send}
                  </button>
                </div>
              </form>
            </div>
          </Console>
        </div>
      </Container>
    </section>
  );
}

function Console({
  phase,
  typed,
  turn,
  busy,
  onMic,
  onReset,
  reduce,
  children,
}: {
  phase: Phase;
  typed: string;
  turn: Turn | null;
  busy: boolean;
  onMic: () => void;
  onReset: () => void;
  reduce: boolean;
  children: React.ReactNode;
}) {
  const { t, locale } = useI18n();
  const v = t.home.voice;
  const wrapRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<Partial<Record<Intent, HTMLDivElement | null>>>({});
  const [link, setLink] = useState<string | null>(null);
  const target = phase === "answered" ? turn?.intent ?? null : null;

  // Draw a connector from the answer bubble to the figure it came from.
  useLayoutEffect(() => {
    if (!target) {
      setLink(null);
      return;
    }
    const measure = () => {
      const wrap = wrapRef.current?.getBoundingClientRect();
      const a = answerRef.current?.getBoundingClientRect();
      const b = tileRefs.current[target]?.getBoundingClientRect();
      if (!wrap || !a || !b) return;
      const sideBySide = b.left >= a.right - 4;
      const x1 = (sideBySide ? a.right : a.left + a.width * 0.5) - wrap.left;
      const y1 = (sideBySide ? a.top + a.height / 2 : a.bottom) - wrap.top;
      const x2 = (sideBySide ? b.left : b.left + b.width / 2) - wrap.left;
      const y2 = (sideBySide ? b.top + b.height / 2 : b.top) - wrap.top;
      setLink(
        sideBySide
          ? `M${x1} ${y1} C${x1 + 40} ${y1} ${x2 - 40} ${y2} ${x2} ${y2}`
          : `M${x1} ${y1} C${x1} ${y1 + 40} ${x2} ${y2 - 40} ${x2} ${y2}`,
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [target, turn]);

  const tiles: { intent: Intent; label: string; value: string }[] = [
    { intent: "sales", label: v.sources.sales, value: `৳${fmtNumber(today.sales, locale)}` },
    { intent: "dues", label: v.sources.dues, value: `৳${fmtNumber(today.dues, locale)}` },
    { intent: "stock", label: v.sources.stock, value: fmtNumber(lowStock.length, locale) },
    { intent: "expenses", label: v.sources.expenses, value: `৳${fmtNumber(today.expensesMonth, locale)}` },
  ];

  return (
    <div ref={wrapRef} className="relative">
      <div className="rounded-[1.8rem] border border-cream/10 bg-forest-2/80 p-5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] backdrop-blur sm:p-7">
        {/* Mic + waveform */}
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
          <div className="relative">
            <span aria-hidden="true" className={cn("absolute -inset-5 rounded-full bg-leaf/30 blur-xl", busy ? "animate-breathe" : "opacity-40")} />
            <button
              type="button"
              onClick={onMic}
              disabled={busy}
              aria-label={busy ? v.micBusy : v.micIdle}
              className="relative flex size-20 items-center justify-center rounded-full bg-leaf text-white shadow-[0_0_0_8px_rgb(22_163_74/0.18)] transition-transform hover:scale-105 active:scale-95 disabled:cursor-wait"
            >
              <MicIcon className="size-8" />
            </button>
          </div>
          <div className="flex w-full flex-1 flex-col gap-2">
            <Waveform active={phase === "asking"} thinking={phase === "thinking"} reduce={reduce} />
            <p className="text-center text-sm text-cream/60 sm:text-left" aria-live="polite">
              {phase === "asking" ? v.listening : phase === "thinking" ? v.thinking : busy ? v.micBusy : v.micIdle}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_190px]">
          {/* Conversation */}
          <div className="flex min-h-[176px] flex-col justify-end gap-3 rounded-2xl bg-black/15 p-4" aria-live="polite">
            <AnimatePresence>
              {typed && (
                <motion.div key="q" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="ml-auto max-w-[90%]">
                  <p className="mb-1 text-right text-xs text-cream/50">{v.you}</p>
                  <p className={cn("rounded-2xl rounded-br-md bg-cream px-4 py-2.5 text-ink", phase === "asking" && "caret")}>{typed}</p>
                </motion.div>
              )}
              {phase === "thinking" && (
                <motion.div key="dots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1.5 px-2" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="size-2 rounded-full bg-leaf-glow" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.18 }} />
                  ))}
                </motion.div>
              )}
              {phase === "answered" && turn && (
                <motion.div key="a" ref={answerRef} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[92%]">
                  <p className="mb-1 text-xs text-cream/50">{v.assistant}</p>
                  <p className="rounded-2xl rounded-bl-md bg-leaf-deep px-4 py-2.5 text-cream">{turn.answer}</p>
                  {turn.intent && (
                    <p className="mt-1.5 text-xs text-leaf-glow">
                      {v.sourceLabel}: {v.sources[turn.intent]}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {!typed && <p className="text-center text-sm text-cream/40">{v.empty}</p>}
          </div>

          {/* Source figures */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {tiles.map((tile) => (
              <div
                key={tile.intent}
                ref={(el) => {
                  tileRefs.current[tile.intent] = el;
                }}
                className={cn(
                  "rounded-xl border px-3 py-2.5 transition-all duration-500",
                  target === tile.intent ? "border-leaf-glow bg-leaf/20 shadow-[0_0_24px_rgb(74_222_128/0.35)]" : "border-cream/10 bg-white/[0.03]",
                )}
              >
                <p className="text-[0.7rem] text-cream/60">{tile.label}</p>
                <p className="font-latin text-lg font-bold text-cream tabular-nums">{tile.value}</p>
              </div>
            ))}
            <div className="col-span-2 md:col-span-1">
              <SampleBadge tone="dark">{t.common.sampleData}</SampleBadge>
            </div>
          </div>
        </div>

        {children}

        {(turn || typed) && !busy && (
          <button type="button" onClick={onReset} className="mt-4 text-sm font-semibold text-leaf-glow underline-offset-4 hover:underline">
            {v.reset}
          </button>
        )}
      </div>

      {link && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <motion.path
            key={link}
            d={link}
            fill="none"
            stroke="var(--color-leaf-glow)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="1 0"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          />
        </svg>
      )}
    </div>
  );
}

function Waveform({ active, thinking, reduce }: { active: boolean; thinking: boolean; reduce: boolean }) {
  const bars = 42;
  return (
    <div className="flex h-16 items-center justify-between gap-[3px]" aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => {
        const env = Math.sin((i / (bars - 1)) * Math.PI);
        const h = Math.round(10 + env * 46 * (0.55 + ((i * 37) % 10) / 22));
        const rest = Math.round(6 + env * 8);
        const think = Math.round(8 + env * 10);
        return (
          <span
            key={i}
            className={cn("w-[3px] flex-1 rounded-full transition-colors duration-500", active ? "bg-leaf-glow" : thinking ? "bg-leaf/70" : "bg-cream/25")}
            style={{
              height: active ? `${h}px` : thinking ? `${think}px` : `${rest}px`,
              transition: "height 400ms cubic-bezier(.22,1,.36,1), background-color 500ms",
              animation: active && !reduce ? `wave ${0.7 + ((i * 13) % 7) / 10}s ease-in-out ${((i * 7) % 10) / 20}s infinite` : undefined,
              transformOrigin: "center",
            }}
          />
        );
      })}
    </div>
  );
}
