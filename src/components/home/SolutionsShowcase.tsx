"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, fmtTaka } from "@/lib/format";
import { branches, demoToday, lowStock, medicines, panjabi, today } from "@/content/demo-data";
import { categoryAccent, flagshipSlugs, type CategorySlug } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { StorePreview, themePresets } from "@/components/online/StorePreview";

type Flagship = (typeof flagshipSlugs)[number];
const layout: Record<Flagship, string> = {
  grocery: "lg:col-span-2",
  pharmacy: "lg:col-span-2",
  supershop: "lg:col-span-2 lg:row-span-2",
  "online-store": "lg:col-span-2",
  "f-commerce": "lg:col-span-2",
};

/**
 * Five flagship solutions. Each card shows its hand-drawn scene; hover, keyboard focus or a tap
 * on the toggle reveals the matching product view. "Other businesses" sits below as a secondary row.
 */
export function SolutionsShowcase({ arts }: { arts: Record<CategorySlug, React.ReactNode> }) {
  const { t, locale } = useI18n();
  const s = t.home.showcase;
  const [open, setOpen] = useState<Flagship | null>(null);

  return (
    <section aria-labelledby="showcase-title" className="paper-cream py-24 sm:py-32">
      <Container>
        <SectionHeading id="showcase-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
        <p className="mt-4 text-sm text-muted">{s.hint}</p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-[auto_auto]">
          {flagshipSlugs.map((slug, i) => {
            const item = t.solutions.items[slug];
            const accent = categoryAccent[slug];
            const isOpen = open === slug;
            const big = slug === "supershop";
            return (
              <Reveal as="li" key={slug} delay={i * 0.06} className={cn("group relative flex flex-col overflow-hidden rounded-[1.6rem] bg-white shadow-[var(--shadow-card)] ring-1 ring-ink/5", layout[slug], big && "sm:col-span-2 lg:col-span-2")}>
                <div className={cn("relative overflow-hidden", big ? "aspect-[4/3] lg:aspect-auto lg:min-h-[420px] lg:flex-1" : "aspect-[4/3]")} style={{ backgroundColor: accent.soft }}>
                  {/* Illustration layer */}
                  <div className={cn("absolute inset-0 flex items-center justify-center p-5 will-change-transform transition-all duration-500 ease-[var(--ease-ink)] group-focus-within:scale-90 group-focus-within:opacity-0 group-hover:scale-90 group-hover:opacity-0", isOpen && "scale-90 opacity-0")}>
                    <div className={cn("h-full w-full", big ? "max-w-[520px]" : "max-w-[280px]")}>{arts[slug]}</div>
                  </div>
                  {/* Product layer */}
                  <div
                    className={cn(
                      "absolute inset-0 flex translate-y-6 items-center justify-center p-4 opacity-0 transition-all duration-500 ease-[var(--ease-ink)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100",
                      isOpen && "translate-y-0 opacity-100",
                    )}
                    aria-hidden={!isOpen}
                  >
                    <Mini slug={slug} />
                  </div>
                  <button
                    type="button"
                    aria-pressed={isOpen}
                    onClick={() => setOpen(isOpen ? null : slug)}
                    className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur lg:hidden"
                  >
                    {s.flip}
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted">{item.short}</p>
                  <Link href={`/${locale}/solutions/${slug}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline" style={{ color: accent.ink }}>
                    {s.open}
                    <span className="sr-only">: {item.name}</span>
                    <Arrow />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-col items-start gap-4 rounded-[1.6rem] border-2 border-dashed border-ink/15 p-6 sm:flex-row sm:items-center">
          <div className="h-20 w-24 shrink-0">{arts.other}</div>
          <div className="flex-1">
            <p className="font-semibold">{s.otherTitle}</p>
            <p className="mt-1 text-sm text-muted">{s.otherBody}</p>
          </div>
          <Link href={`/${locale}/solutions/other`} className="group inline-flex items-center gap-2 text-sm font-semibold text-leaf-ink underline-offset-4 hover:underline">
            {s.otherLink}
            <Arrow />
          </Link>
        </div>
      </Container>
    </section>
  );

  function Mini({ slug }: { slug: Flagship }) {
    const m = s.mini;
    const box = "w-full max-w-[300px] rounded-2xl bg-white p-4 shadow-[var(--shadow-float)] ring-1 ring-ink/10 text-sm";
    switch (slug) {
      case "grocery":
        return (
          <div className={box}>
            <p className="text-xs text-muted">{m.todaySales}</p>
            <p className="font-latin text-2xl font-bold text-leaf-deep">{fmtTaka(today.sales, locale)}</p>
            <p className="mt-3 text-xs font-semibold text-muted">{m.lowStock}</p>
            <ul className="mt-1 space-y-1">
              {lowStock.slice(0, 3).map((p) => (
                <li key={p.key} className="flex justify-between">
                  <span>{t.demo.products[p.key]}</span>
                  <span className="font-latin text-vermilion">
                    {fmtNumber(p.stock, locale)} {t.demo.units[p.unit]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "pharmacy": {
        const soon = medicines.filter((x) => (Date.parse(x.expiry) - Date.parse(demoToday)) / 86_400_000 <= 60);
        return (
          <div className={box}>
            <p className="text-xs font-semibold text-muted">{m.expiring}</p>
            <ul className="mt-2 space-y-1.5">
              {soon.map((x) => (
                <li key={x.key} className="flex justify-between gap-2">
                  <span className="truncate">{t.pharmacyDemo.names[x.key]}</span>
                  <span className="font-latin shrink-0 text-xs text-muted">{x.batch}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }
      case "supershop": {
        const max = Math.max(...branches.map((b) => b.sales));
        return (
          <div className={box}>
            <p className="text-xs font-semibold text-muted">{m.byBranch}</p>
            <ul className="mt-3 space-y-2.5">
              {branches.map((b) => (
                <li key={b.key}>
                  <div className="flex justify-between text-xs">
                    <span>{t.supershop.dashboard.locations[b.key]}</span>
                    <span className="font-latin font-semibold">{fmtTaka(b.sales, locale)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-ink/5">
                    <div className="h-full rounded-full bg-[#b45309]" style={{ width: `${(b.sales / max) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      }
      case "online-store":
        return (
          <div className="w-full max-w-[300px] overflow-hidden rounded-2xl shadow-[var(--shadow-float)] ring-1 ring-ink/10">
            <p className="bg-[#f3f4f6] px-3 py-1.5 text-[0.65rem] text-muted">{m.storePreview}</p>
            <StorePreview mini config={{ theme: "fashion", accent: themePresets.fashion.accent, font: "classic", banner: t.onlineStore.themes.items.fashion.banner, sections: ["hero", "collection"], columns: 3 }} />
          </div>
        );
      case "f-commerce":
        return (
          <div className={cn(box, "space-y-2")} lang="bn">
            <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-[#7c3aed] px-3 py-1.5 text-white">{t.fcommerce.inbox.script.q1}</p>
            <p className="w-fit max-w-[90%] rounded-2xl rounded-bl-md bg-ink/5 px-3 py-1.5">{t.fcommerce.inbox.script.a1.replace("{price}", fmtNumber(panjabi.price, "bn"))}</p>
            <p className="mt-2 flex items-center justify-between rounded-xl bg-leaf-soft px-3 py-2 text-xs font-semibold text-leaf-ink" lang={locale === "bn" ? "bn" : "en"}>
              {m.chatOrder}
              <span className="font-latin">{fmtTaka(panjabi.price, locale)}</span>
            </p>
          </div>
        );
    }
  }
}
