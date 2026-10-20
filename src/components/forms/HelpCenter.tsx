"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, interpolate } from "@/lib/format";

type Cat = "all" | "start" | "sales" | "stock" | "ai" | "account";

/** Searchable, filterable help articles. Everything is client-side over the translated content. */
export function HelpCenter() {
  const { t, locale } = useI18n();
  const r = t.resources;
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("all");
  const searchId = useId();

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return r.articles.filter((a) => (cat === "all" || a.cat === cat) && (!needle || `${a.q} ${a.a}`.toLowerCase().includes(needle)));
  }, [q, cat, r.articles]);

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <label htmlFor={searchId} className="text-sm font-semibold">
          {r.searchLabel}
        </label>
        <div className="relative mt-2">
          <svg viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" aria-hidden="true">
            <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M13.2 13.2 17 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            id={searchId}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={r.searchPlaceholder}
            className="h-12 w-full rounded-full border border-ink/15 bg-white pr-4 pl-11 focus:border-leaf-deep focus:ring-4 focus:ring-leaf/15 focus:outline-none"
          />
        </div>
        <p className="mt-6 text-sm font-semibold">{r.categoriesLabel}</p>
        <div role="radiogroup" aria-label={r.categoriesLabel} className="mt-2 flex flex-wrap gap-2 lg:flex-col">
          {(Object.keys(r.categories) as Cat[]).map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={cat === c}
              onClick={() => setCat(c)}
              className={cn("rounded-full px-4 py-2 text-left text-sm font-semibold transition-colors lg:rounded-xl", cat === c ? "bg-ink text-cream" : "bg-white text-ink-soft ring-1 ring-ink/10 hover:ring-ink/30")}
            >
              {r.categories[c]}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-muted" aria-live="polite">
          {interpolate(r.results, { count: fmtNumber(list.length, locale) })}
        </p>
        <ul className="mt-4 space-y-3">
          <AnimatePresence initial={false}>
            {list.map((a) => (
              <motion.li key={a.q} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <details className="group rounded-2xl bg-white px-5 shadow-[var(--shadow-card)] ring-1 ring-ink/5 open:ring-leaf/30">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    <span>
                      <span className="mb-1 block text-xs font-semibold text-leaf-ink">{r.categories[a.cat as Cat]}</span>
                      {a.q}
                    </span>
                    <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-ink/5 text-leaf-deep transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="pb-5 text-muted">{a.a}</p>
                </details>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {list.length === 0 && <p className="paper-cream mt-4 rounded-2xl p-6 text-muted ring-1 ring-ink/10">{r.noResults}</p>}
      </div>
    </div>
  );
}
