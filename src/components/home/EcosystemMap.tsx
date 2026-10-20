"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { groupStatus, moduleStatus, modulesByGroup, type ModuleId, type ProductGroup } from "@/content/capabilities";
import { Container, SectionHeading, StatusBadge } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/Button";

const nodes: Record<ProductGroup, { x: number; y: number; color: string; soft: string; href: string }> = {
  core: { x: 300, y: 250, color: "#15803d", soft: "#dcfce7", href: "/features" },
  supershop: { x: 120, y: 92, color: "#b45309", soft: "#f8e7bf", href: "/solutions/supershop" },
  online: { x: 480, y: 92, color: "#2563eb", soft: "#dbe6fe", href: "/solutions/online-store" },
  social: { x: 300, y: 450, color: "#7c3aed", soft: "#ede4fd", href: "/solutions/f-commerce" },
};
const order: ProductGroup[] = ["core", "supershop", "online", "social"];

/** Interactive map: one core, three solution modules. Statuses come from the capability registry. */
export function EcosystemMap() {
  const { t, locale } = useI18n();
  const e = t.ecosystem;
  const [sel, setSel] = useState<ProductGroup>("supershop");
  const n = nodes[sel];

  return (
    <section aria-labelledby="eco-title" className="relative overflow-hidden bg-[#f3eee3] py-24 sm:py-32">
      <Container>
        <SectionHeading id="eco-title" eyebrow={e.eyebrow} title={e.title} lead={e.lead} />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          {/* Map */}
          {/* Phones: a simple 2×2 chooser; the orbit diagram needs more room for its labels */}
          <div role="group" aria-label={e.hint} className="grid grid-cols-2 gap-3 sm:hidden">
            {order.map((g) => {
              const node = nodes[g];
              const on = sel === g;
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSel(g)}
                  className="rounded-2xl p-4 text-left transition-[transform,box-shadow] duration-300 active:scale-[0.98]"
                  style={{ background: on ? node.color : node.soft, color: on ? "#fff" : node.color, boxShadow: on ? `0 0 0 4px ${node.soft}` : undefined }}
                >
                  <span className="block text-sm leading-snug font-bold">{e.groups[g].name}</span>
                  <span className={cn("mt-1 block text-xs leading-snug", on ? "text-white/80" : "opacity-80")}>{e.groups[g].tagline}</span>
                </button>
              );
            })}
          </div>
          <div className="relative mx-auto hidden aspect-[600/540] w-full max-w-[600px] sm:block">
            <svg viewBox="0 0 600 540" className="absolute inset-0 h-full w-full" aria-hidden="true">
              {order.slice(1).map((g) => {
                const a = nodes.core;
                const b = nodes[g];
                const d = `M${a.x} ${a.y} Q${(a.x + b.x) / 2 + (g === "social" ? 60 : 0)} ${(a.y + b.y) / 2 - (g === "social" ? 0 : 30)} ${b.x} ${b.y}`;
                const on = sel === g;
                return (
                  <g key={g}>
                    <motion.path d={d} fill="none" stroke={on ? b.color : "#cfc6b4"} strokeWidth={on ? 4 : 2.5} strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.1 }} />
                    {on && <path d={d} fill="none" stroke="#fffcf5" strokeWidth="2" strokeDasharray="2 14" className="hk-flow" />}
                  </g>
                );
              })}
              <circle cx={nodes.core.x} cy={nodes.core.y} r="118" fill="none" stroke="#15803d" strokeOpacity="0.15" strokeDasharray="3 8" />
            </svg>
            {order.map((g) => {
              const node = nodes[g];
              const core = g === "core";
              const on = sel === g;
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSel(g)}
                  className={cn(
                    "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full p-3 text-center shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:scale-105",
                    core ? "size-[34%]" : "size-[25%]",
                    on && "scale-105 shadow-[var(--shadow-float)]",
                  )}
                  style={{ left: `${(node.x / 600) * 100}%`, top: `${(node.y / 540) * 100}%`, background: on ? node.color : node.soft, color: on ? "#fff" : node.color, boxShadow: on ? `0 0 0 6px ${node.soft}` : undefined }}
                >
                  <span className={cn("leading-tight font-bold", core ? "text-sm sm:text-lg" : "text-[0.7rem] sm:text-sm")}>{e.groups[g].name}</span>
                  <span className={cn("mt-1 hidden leading-tight sm:block", core ? "text-xs" : "text-[0.65rem]", on ? "text-white/80" : "opacity-80")}>{e.groups[g].tagline}</span>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div>
            <p className="text-sm text-muted">{e.hint}</p>
            <AnimatePresence mode="wait">
              <motion.div key={sel} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3 }} className="mt-3 rounded-[1.6rem] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/5 sm:p-8" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-2xl" style={{ color: n.color }}>
                    {e.groups[sel].name}
                  </h3>
                  <StatusBadge status={groupStatus(sel)} label={t.status[groupStatus(sel)]} />
                </div>
                <p className="mt-1 text-muted">{e.groups[sel].tagline}</p>
                <ul className="mt-5 divide-y divide-ink/5">
                  {modulesByGroup[sel].map((m) => {
                    const st = moduleStatus[m as ModuleId];
                    return (
                      <li key={m} className="flex items-center justify-between gap-3 py-2.5">
                        <span>
                          <span className={cn("block font-semibold", st === "planned" ? "text-ink-soft" : "text-ink")}>{t.modules[m as ModuleId].name}</span>
                          <span className="block text-sm text-muted">{t.modules[m as ModuleId].desc}</span>
                        </span>
                        <StatusBadge status={st} label={t.status[st]} />
                      </li>
                    );
                  })}
                </ul>
                <Link href={`/${locale}${n.href}`} className="group mt-5 inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline" style={{ color: n.color }}>
                  {e.explore}: {e.groups[sel].name}
                  <Arrow />
                </Link>
              </motion.div>
            </AnimatePresence>
            <p className="mt-4 text-sm text-muted">{e.note}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
