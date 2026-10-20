"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/cn";

const variants: Record<"up" | "ink" | "fade", Variants> = {
  up: { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } },
  ink: { hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" }, show: { opacity: 1, clipPath: "inset(0 0% 0 0)" } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
};

/** Reveal content once as it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  kind = "up",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  kind?: keyof typeof variants;
  as?: "div" | "li" | "section" | "article";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={cn(className)}
      variants={variants[kind]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: kind === "ink" ? 1.1 : 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

/** An ink stroke that draws itself when it scrolls into view. */
export function InkStroke({
  d,
  viewBox,
  className,
  stroke = "var(--color-leaf)",
  width = 3,
  delay = 0,
  duration = 1.6,
}: {
  d: string;
  viewBox: string;
  className?: string;
  stroke?: string;
  width?: number;
  delay?: number;
  duration?: number;
}) {
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true" fill="none" preserveAspectRatio="none">
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ pathLength: { duration, delay, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.2, delay } }}
      />
    </svg>
  );
}
