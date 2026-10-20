"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useI18n } from "@/i18n/client";
import { fmtNumber, fmtTaka, interpolate } from "@/lib/format";
import { today, weekSales } from "@/content/demo-data";
import { SCENE_H, SCENE_W, inkRoute } from "@/components/illustrations/scene-geometry";

const ease = [0.65, 0, 0.35, 1] as const;

/**
 * HeroStage matching Image 2 exactly:
 * - Full page vertical + horizontal sketch background (no overflow, full view, grounded at bottom)
 * - Sales card centered over the shop roof, tilted -1.5deg
 * - Green route line flowing from the sales card down to the shopkeeper's pen on the ledger
 * - Handwritten note "from the khata… to cloud" / "খাতা থেকে ক্লাউডে" with curved arrow
 * - Dark green smartphone mockup on the right, positioned comfortably below the navbar (top-28),
 *   never overlapping the navbar buttons or overflowing content
 */
export function HeroStage({ back, wires, mid }: { back: React.ReactNode; wires: React.ReactNode; mid: React.ReactNode }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Subtle pointer parallax (fine pointers only)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const backX = useTransform(sx, (v) => v * -8);
  const backY = useTransform(sy, (v) => v * -5);
  const midX = useTransform(sx, (v) => v * -3);
  const phoneX = useTransform(sx, (v) => v * 6);
  const phoneY = useTransform(sy, (v) => v * 4);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  // Scroll parallax as user scrolls past hero
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const backScroll = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const midScroll = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const backYAll = useTransform(() => backY.get() + backScroll.get());

  const show = reduce ? false : undefined;

  return (
    <div ref={ref} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      
      {/* 
        Full-page sketch background container:
        Anchored to bottom-0, spanning 100% width with 1440/600 aspect ratio.
        No horizontal or vertical overflow.
      */}
      <div className="absolute inset-x-0 bottom-0 mx-auto aspect-[1440/600] w-full max-h-[86vh] lg:max-h-[90vh]">
        
        {/* Layer 1: Distant rooftops, mosque, minaret */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ x: backX, y: backYAll }}
          initial={show ?? { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.1 }}
        >
          <svg
            viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
            className="absolute inset-0 h-full w-full overflow-visible text-ink"
            role="img"
            aria-label={t.meta.sceneAlt}
          >
            <g filter="url(#hk-wobble)" opacity="0.2">
              {back}
            </g>
          </svg>
        </motion.div>

        {/* Layer 2: Midground: Pharmacy, General Store, Shopkeeper, Bicycle, Rickshaw */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ x: midX, y: midScroll }}
          initial={show ?? { clipPath: "inset(100% 0% 0% 0%)", opacity: 0.4 }}
          animate={{ clipPath: "inset(-20% 0% 0% 0%)", opacity: 1 }}
          transition={{ duration: 1.3, ease, delay: 0.15 }}
        >
          <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} className="absolute inset-0 h-full w-full overflow-visible text-ink" aria-hidden="true">
            <g filter="url(#hk-wobble)">
              <g opacity="0.38">{wires}</g>
              {mid}
            </g>
          </svg>
        </motion.div>

        {/* Layer 3: Animated Route Line from Sales Card to Shopkeeper */}
        <motion.div className="absolute inset-0 will-change-transform" style={{ x: midX, y: midScroll }}>
          <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <filter id="hk-hero-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.8" />
              </filter>
            </defs>
            {/* Soft glowing line */}
            <motion.path
              d={inkRoute.a1}
              fill="none"
              stroke="var(--color-leaf-glow)"
              strokeWidth={8}
              strokeLinecap="round"
              filter="url(#hk-hero-glow)"
              initial={show ?? { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 0.9, delay: 1.6, ease }}
            />
            <motion.path
              d={inkRoute.a2}
              fill="none"
              stroke="var(--color-leaf-glow)"
              strokeWidth={8}
              strokeLinecap="round"
              filter="url(#hk-hero-glow)"
              initial={show ?? { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 0.6, delay: 2.4, ease }}
            />
            {/* Crisp dark green ink stroke */}
            <motion.path
              d={inkRoute.a1}
              fill="none"
              stroke="var(--color-leaf)"
              strokeWidth={2.6}
              strokeLinecap="round"
              filter="url(#hk-wobble)"
              initial={show ?? { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 1.6, ease }}
            />
            <motion.path
              d={inkRoute.a2}
              fill="none"
              stroke="var(--color-leaf)"
              strokeWidth={2.6}
              strokeLinecap="round"
              filter="url(#hk-wobble)"
              initial={show ?? { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 2.4, ease }}
            />
            {/* White animated ink flow dots */}
            <motion.path
              d={`${inkRoute.a1} ${inkRoute.a2}`}
              fill="none"
              stroke="var(--color-cream)"
              strokeWidth={1.4}
              strokeDasharray="2 14"
              className="hk-flow"
              initial={show ?? { opacity: 0 }}
              animate={{ opacity: 0.95 }}
              transition={{ delay: 3.1 }}
            />
            {/* Circular nodes along path */}
            {inkRoute.nodes.map(([x, y], i) => (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={4.5}
                fill="var(--color-cream)"
                stroke="var(--color-leaf)"
                strokeWidth={2}
                initial={show ?? { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2.1 + i * 0.25, type: "spring", stiffness: 300, damping: 15 }}
                style={{ transformOrigin: `${x}px ${y}px` }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Floating White Rounded Sales Card: centered over shop roof matching Image 2 */}
        <motion.div
          className="pointer-events-auto absolute z-20 origin-center hidden sm:block"
          style={{
            left: `${(720 / SCENE_W) * 100}%`,
            top: `${(140 / SCENE_H) * 100}%`,
            x: midX,
            y: midScroll,
          }}
          initial={show ?? { opacity: 0, scale: 0.85, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
          transition={{ delay: 2.0, type: "spring", stiffness: 180, damping: 16 }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <SalesCard />
          </div>
        </motion.div>

        {/* Handwritten script note with curved arrow: right of sales card matching Image 2 */}
        <motion.div
          className="font-hand pointer-events-none absolute z-20 hidden lg:block rotate-[-4deg] text-[1.3rem] leading-tight text-leaf-ink"
          style={{
            left: `${(920 / SCENE_W) * 100}%`,
            top: `${(100 / SCENE_H) * 100}%`,
          }}
          initial={show ?? { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <span>{t.home.hero.annotation}</span>
          <svg viewBox="0 0 120 40" className="mt-0.5 ml-4 h-7 w-20" aria-hidden="true">
            <path
              d="M8 4c10 16 30 26 60 30m0 0-11-6m11 6-9 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

      </div>

      {/* 
        Smartphone Mockup:
        Positioned below the navbar (top-24 sm:top-28 lg:top-28), on the right side.
        NEVER overlaps navbar buttons ("সাইন ইন", "শুরু করুন ->") or overflows viewport.
        Matches Image 2 exactly.
      */}
      <motion.div
        className="pointer-events-auto absolute top-24 sm:top-28 lg:top-28 right-4 sm:right-8 lg:right-12 xl:right-16 z-30 hidden sm:block"
        style={{ x: phoneX, y: phoneY }}
        initial={show ?? { opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <HeroPhone reduce={!!reduce} />
      </motion.div>

      {/* Mobile view fallback for small screens (below 640px) */}
      <div className="sm:hidden pointer-events-auto absolute bottom-4 inset-x-4 z-20 flex items-end justify-between gap-3">
        <SalesCard compact />
        <div className="scale-75 origin-bottom-right">
          <HeroPhone reduce={!!reduce} />
        </div>
      </div>

    </div>
  );
}

/**
 * Floating white rounded card matching Image 2
 */
function SalesCard({ compact }: { compact?: boolean }) {
  const { t, locale } = useI18n();
  const max = Math.max(...weekSales);
  const pts = weekSales.map((v, i) => `${(i / (weekSales.length - 1)) * 100},${32 - (v / max) * 28}`).join(" ");

  return (
    <div className={`rounded-2xl bg-white shadow-[0_16px_36px_-10px_rgba(23,34,28,0.18)] ring-1 ring-ink/10 ${compact ? "w-[175px] p-3" : "w-[245px] p-4"}`}>
      <div className="flex items-center justify-between gap-1.5">
        <p className="text-xs font-semibold text-ink-soft">{t.home.hero.cardLabel}</p>
        <span className="rounded-full bg-[#f8e7bf] px-2 py-0.5 text-xs font-semibold text-[#5c3e07]">
          {t.common.sampleData}
        </span>
      </div>
      <p className={`mt-1 font-bold tracking-tight text-ink tabular-nums ${compact ? "text-xl" : "text-[1.75rem]"}`}>
        {fmtTaka(today.sales, locale)}
      </p>
      <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-leaf-deep">
        <span>▲</span>
        <span>{t.home.hero.cardDelta}</span>
      </div>
      <svg viewBox="0 0 100 36" className="mt-2.5 h-8 sm:h-9 w-full" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={`0,36 ${pts} 100,36`} fill="var(--color-leaf-soft)" stroke="none" />
        <polyline points={pts} fill="none" stroke="var(--color-leaf)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <p className="mt-1 text-xs font-medium text-ink-soft">
        {interpolate(t.home.hero.cardItems, { count: fmtNumber(today.salesCount, locale) })}
      </p>
    </div>
  );
}

/**
 * Dark Green Smartphone Mockup matching Image 2
 */
function HeroPhone({ reduce }: { reduce: boolean }) {
  const { t } = useI18n();
  const show = reduce ? false : undefined;

  return (
    <div className="relative w-[220px] sm:w-[235px] lg:w-[245px] rounded-[2.4rem] bg-[#071910] p-2.5 ring-1 ring-white/10 shadow-[0_24px_50px_-15px_rgba(7,25,16,0.5)]">
      <div className="relative flex h-[410px] sm:h-[435px] lg:h-[455px] flex-col justify-between overflow-hidden rounded-[1.9rem] bg-forest p-3.5 text-cream">
        
        {/* Notch */}
        <div className="mx-auto h-4 w-18 rounded-full bg-[#071910]" aria-hidden="true" />

        {/* Top Header */}
        <div className="flex items-center gap-2.5 px-1 pt-1">
          <span className="relative flex size-6 shrink-0 items-center justify-center rounded-full bg-leaf/25">
            <span className="size-2 rounded-full bg-leaf-glow" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs sm:text-[0.82rem] font-semibold text-cream leading-tight">
              {t.home.hero.phoneTitle}
            </p>
            <p className="text-xs font-medium text-marigold-soft leading-tight">
              {t.home.hero.phoneNote}
            </p>
          </div>
        </div>

        {/* Chat in Middle */}
        <div className="flex flex-col gap-2.5 px-0.5 my-auto">
          {/* User Bubble */}
          <motion.div
            className="ml-auto max-w-[86%] rounded-2xl rounded-br-sm bg-cream px-3.5 py-2.5 text-xs sm:text-[0.82rem] font-medium leading-snug text-ink shadow-sm"
            initial={show ?? { opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2.2, duration: 0.45 }}
          >
            {t.home.hero.phoneQuestion}
          </motion.div>
          {/* Assistant Reply Bubble */}
          <motion.div
            className="mr-auto max-w-[88%] rounded-2xl rounded-bl-sm bg-leaf-deep px-3.5 py-2.5 text-xs sm:text-[0.82rem] font-medium leading-snug text-white shadow-sm"
            initial={show ?? { opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2.8, duration: 0.45 }}
          >
            {t.home.hero.phoneAnswer}
          </motion.div>
        </div>

        {/* Bottom Mic Bar with Waveform & Round Mic Button */}
        <div className="flex items-center gap-2 border-t border-white/10 pt-2.5">
          <div className="flex h-9 flex-1 items-center justify-between rounded-full bg-white/10 px-2.5" aria-hidden="true">
            {Array.from({ length: 16 }, (_, i) => (
              <span
                key={i}
                className={`w-[2.5px] origin-center rounded-full bg-leaf-glow/90 ${reduce ? "" : "animate-wave"}`}
                style={{
                  height: `${7 + ((i * 5) % 13)}px`,
                  animationDelay: `${(i % 5) * 0.12}s`,
                }}
              />
            ))}
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-leaf text-white shadow-sm" aria-hidden="true">
            <MicIcon className="size-4" />
          </span>
        </div>

      </div>
    </div>
  );
}

export function MicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="8.5" y="3" width="7" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
