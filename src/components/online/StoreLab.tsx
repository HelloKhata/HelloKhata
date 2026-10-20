"use client";

import { useId, useState } from "react";
import { AnimatePresence, Reorder, motion, useDragControls } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtDigits, fmtNumber, fmtTaka, interpolate } from "@/lib/format";
import { demoStoreStock } from "@/content/demo-data";
import { Container, SampleBadge, SectionHeading } from "@/components/ui/Section";
import { StorePreview, themeKeys, themePresets, type FontKey, type SectionId, type StoreConfig, type ThemeKey } from "./StorePreview";

const allSections: SectionId[] = ["hero", "categories", "collection", "story", "features", "footer"];
const accents = ["#9f1239", "#16a34a", "#2563eb", "#0e7c86", "#d97706", "#6d28d9", "#38bdf8"];

/**
 * Working storefront editor prototype + theme gallery sharing one state.
 * Demo orders placed in the preview appear in the seller panel and reduce the sample stock.
 */
export function StoreLab() {
  const { t, locale } = useI18n();
  const b = t.onlineStore.builder;
  const th = t.onlineStore.themes;
  const make = (theme: ThemeKey): StoreConfig => ({
    theme,
    accent: themePresets[theme].accent,
    font: themePresets[theme].font,
    banner: th.items[theme].banner,
    sections: ["hero", "collection", "features", "footer"],
    columns: 3,
  });
  const [config, setConfig] = useState<StoreConfig>(() => make("fashion"));
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [panel, setPanel] = useState<"theme" | "sections" | "style">("theme");
  const [stock, setStock] = useState<Record<ThemeKey, number[]>>(() => Object.fromEntries(themeKeys.map((k) => [k, [...demoStoreStock]])) as Record<ThemeKey, number[]>);
  const [cart, setCart] = useState<number[]>([]);
  const [orders, setOrders] = useState<{ id: number; theme: ThemeKey; items: number[] }[]>([]);
  const [published, setPublished] = useState(false);
  const bannerId = useId();

  const set = (patch: Partial<StoreConfig>) => setConfig((c) => ({ ...c, ...patch }));
  const chooseTheme = (theme: ThemeKey) => {
    setConfig((c) => ({ ...make(theme), sections: c.sections, columns: c.columns }));
    setCart([]);
  };
  const move = (id: SectionId, dir: -1 | 1) =>
    setConfig((c) => {
      const s = [...c.sections];
      const i = s.indexOf(id);
      const j = i + dir;
      if (j < 0 || j >= s.length) return c;
      [s[i], s[j]] = [s[j], s[i]];
      return { ...c, sections: s };
    });

  const remaining = stock[config.theme].map((v, i) => v - cart.filter((x) => x === i).length);
  const placeOrder = () => {
    if (!cart.length) return;
    setStock((s) => ({ ...s, [config.theme]: remaining }));
    setOrders((o) => [{ id: 1025 + o.length, theme: config.theme, items: cart }, ...o].slice(0, 5));
    setCart([]);
  };
  const cartTotal = cart.reduce((a, i) => a + th.items[config.theme].prices[i], 0);

  return (
    <>
      <section id="builder" className="scroll-mt-24 bg-[#eef3fd] py-20 sm:py-28" aria-labelledby="builder-title">
        <Container>
          <SectionHeading id="builder-title" eyebrow={b.eyebrow} title={b.title} lead={b.lead} />
          <div className="mt-10 grid gap-5 lg:grid-cols-[320px_1fr]">
            {/* Editor panel */}
            <div className="rounded-[1.4rem] bg-white p-4 shadow-[var(--shadow-card)] ring-1 ring-ink/5 lg:self-start">
              <div role="tablist" aria-label={b.eyebrow} className="grid grid-cols-3 gap-1 rounded-full bg-ink/5 p-1">
                {(["theme", "sections", "style"] as const).map((k) => (
                  <button key={k} type="button" role="tab" aria-selected={panel === k} onClick={() => setPanel(k)} className={cn("rounded-full py-1.5 text-sm font-semibold transition-colors", panel === k ? "bg-white text-ink shadow-sm" : "text-muted")}>
                    {b.panels[k]}
                  </button>
                ))}
              </div>
              <div role="tabpanel" className="mt-4">
                {panel === "theme" && (
                  <ul className="space-y-2">
                    {themeKeys.map((k) => (
                      <li key={k}>
                        <button
                          type="button"
                          aria-pressed={config.theme === k}
                          onClick={() => chooseTheme(k)}
                          className={cn("flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors", config.theme === k ? "bg-[#dbe6fe] ring-2 ring-[#2563eb]" : "hover:bg-ink/5")}
                        >
                          <span className="flex size-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-ink/10" aria-hidden="true">
                            <span className="w-1/2" style={{ background: themePresets[k].bg }} />
                            <span className="w-1/2" style={{ background: themePresets[k].accent }} />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold">{th.items[k].name}</span>
                            <span className="block text-xs text-muted">{th.items[k].desc}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {panel === "sections" && (
                  <div>
                    <p className="text-xs text-muted">{b.dragHint}</p>
                    <Reorder.Group axis="y" values={config.sections} onReorder={(s) => set({ sections: s })} className="mt-2 space-y-1.5">
                      {config.sections.map((id, i) => (
                        <SectionRow key={id} id={id} first={i === 0} last={i === config.sections.length - 1} onMove={move} onRemove={() => set({ sections: config.sections.filter((x) => x !== id) })} canRemove={config.sections.length > 1} />
                      ))}
                    </Reorder.Group>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {allSections
                        .filter((s) => !config.sections.includes(s))
                        .map((s) => (
                          <button key={s} type="button" onClick={() => set({ sections: [...config.sections.filter((x) => x !== "footer"), s, ...(config.sections.includes("footer") ? (["footer"] as SectionId[]) : [])] })} className="rounded-full border border-dashed border-ink/25 px-3 py-1 text-xs font-semibold text-ink-soft hover:border-[#2563eb] hover:text-[#1d4ed8]">
                            + {b.add}: {b.sectionNames[s]}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
                {panel === "style" && (
                  <div className="space-y-4">
                    <fieldset>
                      <legend className="text-sm font-semibold">{b.accent}</legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {accents.map((a, i) => (
                          <button key={a} type="button" aria-label={`${b.accent} ${fmtNumber(i + 1, locale)}`} aria-pressed={config.accent === a} onClick={() => set({ accent: a })} className={cn("size-8 rounded-full ring-offset-2 transition-transform hover:scale-110", config.accent === a && "ring-2 ring-ink")} style={{ background: a }} />
                        ))}
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend className="text-sm font-semibold">{b.font}</legend>
                      <div className="mt-2 grid grid-cols-3 gap-1.5">
                        {(["modern", "classic", "friendly"] as FontKey[]).map((f) => (
                          <button key={f} type="button" aria-pressed={config.font === f} onClick={() => set({ font: f })} className={cn("rounded-lg py-2 text-sm", config.font === f ? "bg-ink text-cream" : "bg-ink/5")}>
                            {b.fonts[f]}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <div>
                      <label htmlFor={bannerId} className="text-sm font-semibold">
                        {b.banner}
                      </label>
                      <input id={bannerId} value={config.banner} maxLength={60} onChange={(e) => set({ banner: e.target.value })} className="mt-1.5 h-11 w-full rounded-xl border border-ink/15 px-3 text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15 focus:outline-none" />
                    </div>
                    <fieldset>
                      <legend className="text-sm font-semibold">{b.columns}</legend>
                      <div className="mt-2 grid grid-cols-3 gap-1.5">
                        {([2, 3, 4] as const).map((n) => (
                          <button key={n} type="button" aria-pressed={config.columns === n} onClick={() => set({ columns: n })} className={cn("font-latin rounded-lg py-2 text-sm", config.columns === n ? "bg-ink text-cream" : "bg-ink/5")}>
                            {fmtNumber(n, locale)}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}
              </div>
              <div className="mt-5 border-t border-ink/10 pt-4">
                <button type="button" onClick={() => setPublished(true)} className="h-11 w-full rounded-full bg-[#1d4ed8] text-sm font-semibold text-white hover:bg-[#1e40af]">
                  {b.publish}
                </button>
                {published && (
                  <p role="status" className="mt-2 rounded-xl bg-marigold-soft px-3 py-2 text-xs text-[#5c3f05]">
                    {b.publishNote}
                  </p>
                )}
              </div>
            </div>

            {/* Preview + seller panel */}
            <div className="min-w-0 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div role="radiogroup" aria-label={b.device.label} className="inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-ink/10">
                  {(["desktop", "mobile"] as const).map((d) => (
                    <button key={d} type="button" role="radio" aria-checked={device === d} onClick={() => setDevice(d)} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold", device === d ? "bg-ink text-cream" : "text-muted")}>
                      {b.device[d]}
                    </button>
                  ))}
                </div>
                <SampleBadge>{t.common.demo}</SampleBadge>
              </div>
              <motion.div layout className={cn("mx-auto overflow-hidden rounded-[1.2rem] bg-white shadow-[var(--shadow-float)] ring-1 ring-ink/10", device === "mobile" ? "max-w-[360px]" : "w-full")}>
                <div className="flex items-center gap-2 border-b border-ink/10 bg-[#f3f4f6] px-3 py-2">
                  <span className="size-2 rounded-full bg-ink/20" />
                  <span className="size-2 rounded-full bg-ink/20" />
                  <span className="font-latin ml-2 truncate rounded-md bg-white px-3 py-0.5 text-xs text-muted">{t.onlineStore.story.domain}</span>
                  <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-ink">
                    {b.cart}
                    <span className="font-latin rounded-full bg-ink px-1.5 text-cream">{fmtNumber(cart.length, locale)}</span>
                  </span>
                </div>
                <div className="max-h-[560px] overflow-y-auto">
                  <StorePreview config={config} device={device} stock={remaining} onAdd={(i) => setCart((c) => [...c, i])} />
                </div>
              </motion.div>
              <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
                <div className="rounded-2xl bg-white p-4 ring-1 ring-ink/10">
                  <p className="text-sm font-semibold">{b.cart}</p>
                  <p className="font-latin mt-1 text-xl font-bold">{fmtTaka(cartTotal, locale)}</p>
                  <button type="button" disabled={!cart.length} onClick={placeOrder} className="mt-3 h-10 w-full rounded-full bg-ink text-sm font-semibold text-cream disabled:opacity-40">
                    {b.placeOrder}
                  </button>
                </div>
                <div className="rounded-2xl bg-forest p-4 text-cream">
                  <p className="text-sm font-semibold text-leaf-glow">{b.ordersTitle}</p>
                  <ul className="mt-2 space-y-2" aria-live="polite">
                    {orders.length === 0 && <li className="text-sm text-cream/60">{b.ordersEmpty}</li>}
                    <AnimatePresence initial={false}>
                      {orders.map((o) => (
                        <motion.li key={o.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-white/[0.06] px-3 py-2 text-sm">
                          <p className="font-semibold">{interpolate(b.orderPlaced, { id: fmtDigits(o.id, locale), items: fmtNumber(o.items.length, locale) })}</p>
                          <p className="text-xs text-cream/60">
                            {th.items[o.theme].store} · {fmtTaka(o.items.reduce((a, i) => a + th.items[o.theme].prices[i], 0), locale)} · {b.stockUpdated}
                          </p>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <p className="mt-3 text-xs text-cream/50">{b.sampleNote}</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Theme gallery */}
      <section className="py-20 sm:py-28" aria-labelledby="themes-title">
        <Container>
          <SectionHeading id="themes-title" eyebrow={th.eyebrow} title={th.title} lead={th.lead} />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {themeKeys.map((k) => (
              <li key={k} className="group flex flex-col overflow-hidden rounded-[1.2rem] bg-white shadow-[var(--shadow-card)] ring-1 ring-ink/5 transition-transform hover:-translate-y-1">
                <div className="pointer-events-none h-56 overflow-hidden border-b border-ink/5" aria-hidden="true">
                  <div className="origin-top transition-transform duration-700 group-hover:-translate-y-6">
                    <StorePreview config={make(k)} mini />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="font-semibold">{th.items[k].name}</p>
                  <p className="text-sm text-muted">{th.items[k].desc}</p>
                  <a
                    href="#builder"
                    onClick={() => {
                      chooseTheme(k);
                      setPanel("style");
                    }}
                    className="mt-3 inline-flex text-sm font-semibold text-[#1d4ed8] underline-offset-4 hover:underline"
                  >
                    {th.tryInEditor}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}

function SectionRow({ id, first, last, onMove, onRemove, canRemove }: { id: SectionId; first: boolean; last: boolean; onMove: (id: SectionId, d: -1 | 1) => void; onRemove: () => void; canRemove: boolean }) {
  const { t } = useI18n();
  const b = t.onlineStore.builder;
  const controls = useDragControls();
  return (
    <Reorder.Item value={id} dragListener={false} dragControls={controls} className="flex items-center gap-2 rounded-xl bg-ink/[0.04] px-2 py-1.5 text-sm">
      <span onPointerDown={(e) => controls.start(e)} className="cursor-grab touch-none px-1 text-muted active:cursor-grabbing" aria-hidden="true">
        ⋮⋮
      </span>
      <span className="flex-1 font-semibold">{b.sectionNames[id]}</span>
      <button type="button" disabled={first} onClick={() => onMove(id, -1)} aria-label={`${b.moveUp}: ${b.sectionNames[id]}`} className="rounded p-1 text-muted hover:bg-white disabled:opacity-30">
        ↑
      </button>
      <button type="button" disabled={last} onClick={() => onMove(id, 1)} aria-label={`${b.moveDown}: ${b.sectionNames[id]}`} className="rounded p-1 text-muted hover:bg-white disabled:opacity-30">
        ↓
      </button>
      <button type="button" disabled={!canRemove} onClick={onRemove} aria-label={`${b.remove}: ${b.sectionNames[id]}`} className="rounded p-1 text-muted hover:bg-white hover:text-vermilion disabled:opacity-30">
        ✕
      </button>
    </Reorder.Item>
  );
}
