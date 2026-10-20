"use client";

import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtDigits } from "@/lib/format";

/**
 * An Android-style phone with the HelloKhata app chrome.
 * The app UI here is a faithful-in-spirit recreation filled with sample data — not a screenshot.
 */
export function Phone({ children, className, nav, width = 300, onMic }: { children: React.ReactNode; className?: string; nav?: "home" | "sales" | "stock" | "dues" | null; width?: number | string; onMic?: () => void }) {
  const { t, locale } = useI18n();
  const a = t.grocery.app;
  return (
    <div className={cn("relative shrink-0 rounded-[2.6rem] bg-[#121614] p-[9px] shadow-[0_2px_0_rgb(255_255_255/0.06)_inset,0_40px_80px_-30px_rgb(12_35_24/0.55)]", className)} style={{ width }}>
      <span aria-hidden="true" className="absolute top-[22%] -right-[3px] h-14 w-[3px] rounded-r bg-[#121614]" />
      <span aria-hidden="true" className="absolute top-[14%] -right-[3px] h-8 w-[3px] rounded-r bg-[#121614]" />
      <div className="relative flex aspect-[9/19] flex-col overflow-hidden rounded-[2.05rem] bg-[#f6f7f5]">
        {/* Status bar */}
        <div className="relative flex h-7 shrink-0 items-center justify-between bg-[#0f5f2e] px-5 text-[0.62rem] font-semibold text-white/90" aria-hidden="true">
          <span className="font-latin">{fmtDigits(9, locale)}:{fmtDigits(41, locale)}</span>
          <span className="absolute top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-black/80" />
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 16 12" className="h-2.5 w-3">
              <path d="M1 11h2V8H1zm4 0h2V6H5zm4 0h2V3H9zm4 0h2V1h-2z" fill="currentColor" />
            </svg>
            <span className="h-2 w-4 rounded-[2px] border border-white/80 p-[1px]">
              <span className="block h-full w-3/4 rounded-[1px] bg-white/90" />
            </span>
          </span>
        </div>
        {/* App bar */}
        <div className="flex shrink-0 items-center justify-between gap-2 bg-[#0f5f2e] px-4 pt-1 pb-3 text-white">
          <div className="min-w-0">
            <p className="font-latin text-[0.72rem] font-extrabold tracking-tight" translate="no">
              Hello<span className="text-leaf-glow">Khata</span>
            </p>
            <p className="truncate text-[0.78rem] leading-tight font-semibold">{a.shop}</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[0.55rem] font-semibold whitespace-nowrap text-marigold-soft">{a.sample}</span>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
        {nav !== null && nav !== undefined && <BottomNav active={nav} onMic={onMic} />}
        <div className="flex h-4 shrink-0 items-center justify-center bg-white" aria-hidden="true">
          <span className="h-1 w-16 rounded-full bg-ink/25" />
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, onMic }: { active: "home" | "sales" | "stock" | "dues"; onMic?: () => void }) {
  const { t } = useI18n();
  const n = t.grocery.app.nav;
  const icons = {
    home: "M3 9.5 10 4l7 5.5V16a1 1 0 0 1-1 1h-3.5v-4.5h-5V17H4a1 1 0 0 1-1-1z",
    sales: "M4 4h12v12H4zM7 8h6M7 11h4",
    stock: "M3 6l7-3 7 3v8l-7 3-7-3zM3 6l7 3 7-3M10 9v8",
    dues: "M10 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM4 17c0-3.3 2.7-6 6-6s6 2.7 6 6",
  };
  const items = ["home", "sales", "stock", "dues"] as const;
  return (
    <div className="relative grid shrink-0 grid-cols-5 items-end border-t border-ink/10 bg-white px-1 pt-1.5 pb-1">
      {items.slice(0, 2).map((k) => (
        <NavItem key={k} label={n[k]} d={icons[k]} on={active === k} />
      ))}
      <div className="flex justify-center">
        {onMic ? (
          <button type="button" onClick={onMic} aria-label={t.grocery.app.ask} className="-mt-6 flex size-11 items-center justify-center rounded-full bg-leaf-deep text-white shadow-[0_6px_16px_-4px_rgb(21_128_61/0.7)] ring-4 ring-white transition-transform active:scale-95">
            <MicGlyph />
          </button>
        ) : (
          <span className="-mt-6 flex size-11 items-center justify-center rounded-full bg-leaf-deep text-white shadow-[0_6px_16px_-4px_rgb(21_128_61/0.7)] ring-4 ring-white" aria-hidden="true">
            <MicGlyph />
          </span>
        )}
      </div>
      {items.slice(2).map((k) => (
        <NavItem key={k} label={n[k]} d={icons[k]} on={active === k} />
      ))}
    </div>
  );
}

function NavItem({ label, d, on }: { label: string; d: string; on: boolean }) {
  return (
    <span className={cn("relative flex flex-col items-center gap-0.5 py-1 text-[0.58rem] font-semibold", on ? "text-leaf-deep" : "text-muted")} aria-hidden="true">
      {on && <span className="absolute -top-1.5 h-0.5 w-6 rounded-full bg-leaf-deep" />}
      <svg viewBox="0 0 20 20" className="size-4">
        <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </span>
  );
}

export function MicGlyph({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="8.5" y="3" width="7" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
