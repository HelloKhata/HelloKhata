"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useI18n } from "@/i18n/client";
import { fmtNumber, fmtTaka, interpolate } from "@/lib/format";
import { today, weekSales } from "@/content/demo-data";
import {
  SCENE_H,
  SCENE_W,
  inkRoute,
} from "@/components/illustrations/scene-geometry";

const ease = [0.65, 0, 0.35, 1] as const;

/**
 * Client stage for the hero illustration.
 * Choreography: street rises out of the paper → green ink leaves the shopkeeper's pen,
 * turns into a crisp data line → lands in a live "today's sales" card → continues to the phone,
 * where the assistant answers. Text is never blocked; everything is decorative and skippable.
 */
export function HeroStage({
  back,
  wires,
  mid,
}: {
  back: React.ReactNode;
  wires: React.ReactNode;
  mid: React.ReactNode;
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Pointer parallax (fine pointers only)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const backX = useTransform(sx, (v) => v * -10);
  const backY = useTransform(sy, (v) => v * -6);
  const midX = useTransform(sx, (v) => v * -4);
  const phoneX = useTransform(sx, (v) => v * 8);
  const phoneY = useTransform(sy, (v) => v * 6);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  // Scroll parallax as the hero leaves the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backScroll = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const midScroll = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const backYAll = useTransform(() => backY.get() + backScroll.get());

  const show = reduce ? false : undefined; // `initial={false}` renders the final state immediately
  const pct = (x: number, y: number) => ({
    left: `${(x / SCENE_W) * 100}%`,
    top: `${(y / SCENE_H) * 100}%`,
  });

  return (
    <div ref={ref} className="relative pb-28 sm:pb-24 lg:pb-0">
      {/* Scene box. Mobile crops around the shop; desktop shows the whole street. */}
      <div className="relative mx-auto aspect-[4/3.3] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[1440/600] lg:overflow-visible">
        <div className="absolute inset-y-0 left-1/2 aspect-[1440/600] h-full -translate-x-[60%] lg:inset-0 lg:left-0 lg:h-auto lg:w-full lg:translate-x-0">
          {/* Three composited layers: parallax moves pre-rendered layers instead of re-running SVG filters each frame */}
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
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ x: midX, y: midScroll }}
            initial={show ?? { clipPath: "inset(100% 0% 0% 0%)", opacity: 0.4 }}
            animate={{ clipPath: "inset(-20% 0% 0% 0%)", opacity: 1 }}
            transition={{ duration: 1.3, ease, delay: 0.15 }}
          >
            <svg
              viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
              className="absolute inset-0 h-full w-full overflow-visible text-ink"
              aria-hidden="true"
            >
              <g filter="url(#hk-wobble)">
                <g opacity="0.38">{wires}</g>
                {mid}
              </g>
            </svg>
          </motion.div>
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ x: midX, y: midScroll }}
          >
            <svg
              viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
              className="absolute inset-0 h-full w-full overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <filter
                  id="hk-glow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>
              <motion.path
                d={inkRoute.a1}
                fill="none"
                stroke="var(--color-leaf-ink)"
                strokeWidth={3}
                strokeLinecap="round"
                filter="url(#hk-wobble)"
                initial={show ?? { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.2, ease }}
              />
              <motion.path
                d={inkRoute.a2}
                fill="none"
                stroke="var(--color-leaf-glow)"
                strokeWidth={8}
                strokeLinecap="round"
                filter="url(#hk-glow)"
                initial={show ?? { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.55 }}
                transition={{ duration: 0.9, delay: 2.1, ease }}
              />
              <motion.path
                d={inkRoute.a2}
                fill="none"
                stroke="var(--color-leaf)"
                strokeWidth={2.4}
                strokeLinecap="round"
                initial={show ?? { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 2.1, ease }}
              />
              <motion.path
                d={inkRoute.a2}
                fill="none"
                stroke="var(--color-cream)"
                strokeWidth={1.4}
                strokeDasharray="2 14"
                className="hk-flow"
                initial={show ?? { opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 3 }}
              />
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
                  transition={{
                    delay: 2.15 + i * 0.2,
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                />
              ))}
              <g className="hidden lg:block">
                <motion.path
                  d={inkRoute.b}
                  fill="none"
                  stroke="var(--color-leaf)"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  initial={show ?? { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 3.1, ease }}
                />
                <motion.path
                  d={inkRoute.b}
                  fill="none"
                  stroke="var(--color-cream)"
                  strokeWidth={1.4}
                  strokeDasharray="2 14"
                  className="hk-flow"
                  initial={show ?? { opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  transition={{ delay: 3.9 }}
                />
              </g>
            </svg>
          </motion.div>

          {/* Hand-written annotation near the ink line (desktop) */}
          <motion.p
            className="font-hand pointer-events-none absolute hidden rotate-[-4deg] text-[1.3rem] leading-tight text-leaf-ink lg:block"
            style={pct(930, -70)}
            initial={show ?? { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.8 }}
          >
            {t.home.hero.annotation}
            <svg
              viewBox="0 0 120 40"
              className="mt-1 ml-6 h-8 w-24"
              aria-hidden="true"
            >
              <path
                d="M8 4c10 16 30 26 60 30m0 0-11-6m11 6-9 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.p>

          {/* Desktop: the card is mounted on the shop building, where the data line lands */}
          <motion.div
            className="absolute hidden lg:block"
            style={{
              left: `${(640 / SCENE_W) * 100}%`,
              bottom: `${((SCENE_H - 118) / SCENE_H) * 100}%`,
              x: midX,
              y: midScroll,
            }}
            initial={show ?? { opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
            transition={{
              delay: 2.75,
              type: "spring",
              stiffness: 180,
              damping: 16,
            }}
          >
            <SalesCard />
          </motion.div>
        </div>

        {/* Mobile/tablet card */}
        <motion.div
          className="absolute bottom-3 left-3 origin-bottom-left scale-90 sm:bottom-6 sm:left-6 sm:scale-100 lg:hidden"
          initial={show ?? { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 2.4,
            type: "spring",
            stiffness: 180,
            damping: 16,
          }}
        >
          <SalesCard compact />
        </motion.div>
      </div>

      {/* Phone: floats above the rickshaw on desktop, overlaps the scene corner on small screens */}
      <motion.div
        className="absolute right-4 bottom-0 z-10 origin-bottom-right scale-[0.6] sm:right-8 sm:scale-[0.75] lg:right-auto lg:bottom-auto lg:left-[min(81.6%,calc(100%-270px))] lg:top-[10%] lg:-translate-y-1/2 lg:scale-100"
        style={{ x: phoneX, y: phoneY }}
      >
        <motion.div
          initial={show ?? { opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroPhone reduce={!!reduce} />
        </motion.div>
      </motion.div>
    </div>
  );
}

function SalesCard({ compact }: { compact?: boolean }) {
  const { t, locale } = useI18n();
  const max = Math.max(...weekSales);
  const pts = weekSales
    .map(
      (v, i) => `${(i / (weekSales.length - 1)) * 100},${34 - (v / max) * 30}`,
    )
    .join(" ");
  return (
    <div
      className={`rounded-2xl bg-cream/95 shadow-[var(--shadow-float)] ring-1 ring-ink/10 backdrop-blur ${compact ? "w-[178px] p-3" : "w-[268px] p-4"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className={`font-semibold text-muted ${compact ? "text-[0.7rem]" : "text-xs"}`}
        >
          {t.home.hero.cardLabel}
        </p>
        <span className="rounded-full bg-marigold-soft px-1.5 py-0.5 text-[0.6rem] font-semibold text-[#6b4a07]">
          {t.common.sampleData}
        </span>
      </div>
      <p
        className={`font-latin mt-1 font-bold tracking-tight text-ink tabular-nums ${compact ? "text-xl" : "text-[1.75rem]"}`}
      >
        {fmtTaka(today.sales, locale)}
      </p>
      <div className="mt-1 flex items-center gap-2 text-xs">
        <span className="font-semibold text-leaf-deep">
          ▲ {t.home.hero.cardDelta}
        </span>
      </div>
      {!compact && (
        <>
          <svg
            viewBox="0 0 100 36"
            className="mt-3 h-10 w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polyline
              points={`0,36 ${pts} 100,36`}
              fill="var(--color-leaf-soft)"
              stroke="none"
            />
            <polyline
              points={pts}
              fill="none"
              stroke="var(--color-leaf)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-1 text-xs text-muted">
            {interpolate(t.home.hero.cardItems, {
              count: fmtNumber(today.salesCount, locale),
            })}
          </p>
        </>
      )}
    </div>
  );
}

function HeroPhone({ reduce }: { reduce: boolean }) {
  const { t } = useI18n();
  const show = reduce ? false : undefined;
  return (
    <div className="relative w-[236px] rounded-[2.4rem] bg-ink p-2.5 shadow-[var(--shadow-float)]">
      <div className="relative flex h-[460px] flex-col overflow-hidden rounded-[1.9rem] bg-forest text-cream">
        <div
          className="mx-auto mt-2 h-5 w-20 rounded-full bg-ink"
          aria-hidden="true"
        />
        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <span className="relative flex size-7 items-center justify-center rounded-full bg-leaf/20">
            <span className="size-2 rounded-full bg-leaf-glow" />
          </span>
          <div>
            <p className="text-[0.8rem] leading-tight font-semibold">
              {t.home.hero.phoneTitle}
            </p>
            <p className="text-[0.62rem] leading-tight text-marigold-soft/90">
              {t.home.hero.phoneNote}
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-2.5 px-3 pb-3">
          <motion.div
            className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-cream px-3 py-2 text-[0.82rem] leading-snug text-ink"
            initial={show ?? { opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 3.3, duration: 0.5 }}
          >
            {t.home.hero.phoneQuestion}
          </motion.div>
          <motion.div
            className="max-w-[88%] rounded-2xl rounded-bl-md bg-leaf-deep px-3 py-2 text-[0.82rem] leading-snug"
            initial={show ?? { opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 4.1, duration: 0.5 }}
          >
            {t.home.hero.phoneAnswer}
          </motion.div>
        </div>
        <div className="flex items-center gap-2 border-t border-white/10 px-3 py-3">
          <div
            className="flex h-9 flex-1 items-center gap-[3px] rounded-full bg-white/10 px-3"
            aria-hidden="true"
          >
            {Array.from({ length: 18 }, (_, i) => (
              <span
                key={i}
                className="w-[3px] origin-center rounded-full bg-leaf-glow/80 animate-wave"
                style={{
                  height: `${8 + ((i * 7) % 14)}px`,
                  animationDelay: `${(i % 6) * 0.12}s`,
                }}
              />
            ))}
          </div>
          <span
            className="flex size-9 items-center justify-center rounded-full bg-leaf text-white"
            aria-hidden="true"
          >
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
      <rect
        x="8.5"
        y="3"
        width="7"
        height="12"
        rx="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
