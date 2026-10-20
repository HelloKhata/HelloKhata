"use client";

import { motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, fmtTaka, interpolate } from "@/lib/format";

export const themeKeys = ["fashion", "electronics", "grocery", "pharmacy", "general"] as const;
export type ThemeKey = (typeof themeKeys)[number];
export type SectionId = "hero" | "categories" | "collection" | "story" | "features" | "footer";
export type FontKey = "modern" | "classic" | "friendly";

/** Visual presets — each theme has its own personality, not just a colour swap. */
export const themePresets: Record<ThemeKey, { accent: string; bg: string; surface: string; text: string; muted: string; font: FontKey; radius: string; tiles: string[]; dark?: boolean; heroStyle: "split" | "center" | "band" }> = {
  fashion: { accent: "#9f1239", bg: "#fbf6ef", surface: "#ffffff", text: "#2a1a14", muted: "#7a6458", font: "classic", radius: "2px", tiles: ["#e9d5c3", "#c9a27e", "#f1c6c6", "#d8c4a5", "#e6b8a2", "#c7b299"], heroStyle: "split" },
  electronics: { accent: "#38bdf8", bg: "#0b1220", surface: "#131c2e", text: "#e6edf7", muted: "#8ea0b8", font: "modern", radius: "14px", tiles: ["#1e2a40", "#22324d", "#1b2a44", "#253656", "#1d2b45", "#20304b"], dark: true, heroStyle: "center" },
  grocery: { accent: "#16a34a", bg: "#f6fbf3", surface: "#ffffff", text: "#14261a", muted: "#5d6e62", font: "friendly", radius: "18px", tiles: ["#e7f5dc", "#fbe7b5", "#fde0cf", "#fff3c4", "#f3ead9", "#e3efd2"], heroStyle: "band" },
  pharmacy: { accent: "#0e7c86", bg: "#f5fbfb", surface: "#ffffff", text: "#0f2a2c", muted: "#5b7476", font: "modern", radius: "10px", tiles: ["#d9f0f1", "#e6f1fb", "#eef6e8", "#fdeee6", "#e9eefb", "#dff3ef"], heroStyle: "center" },
  general: { accent: "#6d28d9", bg: "#fafaf9", surface: "#ffffff", text: "#1c1917", muted: "#6b6560", font: "modern", radius: "12px", tiles: ["#ede9fe", "#fef3c7", "#e0f2fe", "#fce7f3", "#dcfce7", "#f5f5f4"], heroStyle: "band" },
};

export const fontFamilies: Record<FontKey, string> = {
  modern: "var(--font-manrope), var(--font-hind), sans-serif",
  classic: "var(--font-tiro), Georgia, serif",
  friendly: "var(--font-hind), var(--font-manrope), sans-serif",
};

const glyph: Record<ThemeKey, string> = {
  fashion: "M10.5 6.5A1.5 1.5 0 1 1 12 8v1.6M12 9.6 3.5 15.4c-.7.5-.4 1.6.5 1.6h16c.9 0 1.2-1.1.5-1.6L12 9.6Z",
  electronics: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2",
  grocery: "M5 9h14l-1.5 10h-11L5 9Zm3 0 2-5m6 5-2-5",
  pharmacy: "M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6V4Z",
  general: "M4 8l8-4 8 4v8l-8 4-8-4V8Zm0 0 8 4 8-4M12 12v8",
};

export type StoreConfig = { theme: ThemeKey; accent: string; font: FontKey; banner: string; sections: SectionId[]; columns: 2 | 3 | 4 };

export function StorePreview({
  config,
  device = "desktop",
  stock,
  onAdd,
  mini = false,
}: {
  config: StoreConfig;
  device?: "desktop" | "mobile";
  stock?: number[];
  onAdd?: (index: number) => void;
  mini?: boolean;
}) {
  const { t, locale } = useI18n();
  const b = t.onlineStore.builder;
  const th = t.onlineStore.themes.items[config.theme];
  const p = themePresets[config.theme];
  const cols = device === "mobile" ? 2 : config.columns;
  const products = th.products.map((name, i) => ({ name, price: th.prices[i] })).slice(0, mini ? 3 : 6);

  const section = (id: SectionId) => {
    switch (id) {
      case "hero":
        return (
          <div
            className={cn("relative overflow-hidden", mini ? "p-4" : "p-6 sm:p-8", p.heroStyle === "center" && "text-center", p.heroStyle === "band" && "")}
            style={{ background: p.heroStyle === "band" ? `color-mix(in srgb, ${config.accent} 14%, ${p.surface})` : p.surface }}
          >
            <div className={cn("relative", p.heroStyle === "split" && !mini && device === "desktop" && "grid grid-cols-[1.3fr_1fr] items-center gap-6")}>
              <div>
                <p className={cn("leading-tight font-bold", mini ? "text-base" : "text-2xl sm:text-3xl")} style={{ color: p.text }}>
                  {config.banner}
                </p>
                {!mini && (
                  <span className="mt-4 inline-block px-4 py-2 text-sm font-semibold" style={{ background: config.accent, color: p.dark ? "#0b1220" : "#fff", borderRadius: p.radius }}>
                    {b.shopNow}
                  </span>
                )}
              </div>
              {p.heroStyle === "split" && !mini && device === "desktop" && <div className="aspect-[4/3]" style={{ background: `linear-gradient(135deg, ${p.tiles[1]}, ${config.accent}55)`, borderRadius: p.radius }} />}
            </div>
          </div>
        );
      case "categories":
        return (
          <div className="px-5 py-4">
            <p className="text-sm font-semibold" style={{ color: p.text }}>
              {b.categories}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {th.products.slice(0, 4).map((n) => (
                <span key={n} className="px-3 py-1 text-xs" style={{ background: `color-mix(in srgb, ${config.accent} 12%, ${p.surface})`, color: p.text, borderRadius: "999px" }}>
                  {n.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
        );
      case "collection":
        return (
          <div className={mini ? "p-3" : "p-5"}>
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${mini ? 3 : cols}, minmax(0, 1fr))` }}>
              {products.map((pr, i) => {
                const left = stock?.[i];
                const out = left !== undefined && left <= 0;
                return (
                  <div key={pr.name} className="overflow-hidden" style={{ background: p.surface, borderRadius: p.radius, boxShadow: p.dark ? "none" : "0 1px 3px rgb(0 0 0 / 0.08)", border: p.dark ? "1px solid #26324a" : "none" }}>
                    <div className="flex aspect-square items-center justify-center" style={{ background: p.tiles[i % p.tiles.length] }}>
                      <svg viewBox="0 0 24 24" className="size-1/3" aria-hidden="true">
                        <path d={glyph[config.theme]} fill="none" stroke={config.accent} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className={mini ? "p-1.5" : "p-2.5"}>
                      <p className={cn("truncate font-semibold", mini ? "text-[0.6rem]" : "text-xs sm:text-sm")} style={{ color: p.text }}>
                        {pr.name}
                      </p>
                      <p className={cn("font-latin font-bold", mini ? "text-[0.6rem]" : "text-xs sm:text-sm")} style={{ color: config.accent }}>
                        {fmtTaka(pr.price, locale)}
                      </p>
                      {onAdd && !mini && (
                        <>
                          <button
                            type="button"
                            disabled={out}
                            onClick={() => onAdd(i)}
                            className="mt-2 w-full px-2 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                            style={{ background: config.accent, color: p.dark ? "#0b1220" : "#fff", borderRadius: p.radius }}
                          >
                            {out ? b.outOfStock : b.addToCart}
                          </button>
                          {left !== undefined && !out && <p className="mt-1 text-[0.65rem]" style={{ color: p.muted }}>{interpolate(b.left, { n: fmtNumber(left, locale) })}</p>}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "story":
        return (
          <div className="grid gap-3 px-5 py-6" style={{ background: `color-mix(in srgb, ${config.accent} 7%, ${p.bg})` }}>
            <p className="font-bold" style={{ color: p.text }}>
              {b.storyTitle}
            </p>
            <div className="space-y-1.5" aria-hidden="true">
              <div className="h-2 w-11/12 rounded-full" style={{ background: p.muted, opacity: 0.25 }} />
              <div className="h-2 w-4/5 rounded-full" style={{ background: p.muted, opacity: 0.25 }} />
              <div className="h-2 w-2/3 rounded-full" style={{ background: p.muted, opacity: 0.25 }} />
            </div>
          </div>
        );
      case "features":
        return (
          <div className={cn("grid gap-2 px-5 py-4", device === "mobile" ? "grid-cols-1" : "grid-cols-3")}>
            {b.highlights.map((h) => (
              <div key={h} className="flex items-center gap-2 px-3 py-2 text-xs" style={{ background: p.surface, color: p.text, borderRadius: p.radius }}>
                <span className="size-2 rounded-full" style={{ background: config.accent }} />
                {h}
              </div>
            ))}
          </div>
        );
      case "footer":
        return (
          <div className="px-5 py-4 text-xs" style={{ background: p.dark ? "#070c16" : p.text, color: p.dark ? p.muted : p.bg }}>
            © {th.store}
          </div>
        );
    }
  };

  return (
    <div className="overflow-hidden" style={{ background: p.bg, fontFamily: fontFamilies[config.font], color: p.text }}>
      <div className={cn("flex items-center justify-between", mini ? "px-3 py-2" : "px-5 py-3")} style={{ borderBottom: `1px solid ${p.dark ? "#1f2a3f" : "rgb(0 0 0 / 0.07)"}` }}>
        <span className={cn("font-bold", mini ? "text-xs" : "text-base")} style={{ color: config.accent }}>
          {th.store}
        </span>
        {!mini && (
          <span className="flex gap-3 text-xs" style={{ color: p.muted }} aria-hidden="true">
            <span className="h-1.5 w-8 rounded-full" style={{ background: p.muted, opacity: 0.3 }} />
            <span className="h-1.5 w-8 rounded-full" style={{ background: p.muted, opacity: 0.3 }} />
          </span>
        )}
      </div>
      {(mini ? (["hero", "collection"] as SectionId[]) : config.sections).map((id) => (
        <motion.div key={id} layout transition={{ type: "spring", stiffness: 380, damping: 34 }}>
          {section(id)}
        </motion.div>
      ))}
    </div>
  );
}
