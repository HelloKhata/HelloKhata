"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { Container, Eyebrow } from "@/components/ui/Section";
import { BranchDashboard } from "./BranchDashboard";

/**
 * The physical retail network (illustration) recedes while the multi-branch dashboard rises
 * into its place — same locations, now as live controls. Static stack on small screens / reduced motion.
 */
export function NetworkStory({ network }: { network: React.ReactNode }) {
  const { t, locale } = useI18n();
  const st = t.supershop.story;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 150, damping: 30, mass: 0.4, restDelta: 0.0005 });
  const [step, setStep] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const s = v < 0.3 ? 0 : v < 0.6 ? 1 : 2;
    setStep((x) => (x === s ? x : s));
  });

  const netScale = useTransform(p, [0.2, 0.62], [1, 0.62]);
  const netY = useTransform(p, [0.2, 0.62], ["0%", "-34%"]);
  const netOpacity = useTransform(p, [0.42, 0.66], [1, 0.12]);
  const dashY = useTransform(p, [0.36, 0.7], ["70%", "0%"]);
  const dashOpacity = useTransform(p, [0.36, 0.56], [0, 1]);

  const steps = (
    <ol className="mt-8 space-y-6">
      {st.steps.map((s, i) => (
        <li key={i} className={cn("relative pl-12 transition-opacity duration-500", reduce || step === i ? "opacity-100" : "opacity-45")}>
          <span className={cn("font-latin absolute top-0 left-0 flex size-8 items-center justify-center rounded-full text-sm font-bold", reduce || step >= i ? "bg-[#7c3a06] text-white" : "bg-ink/10 text-muted")}>
            {locale === "bn" ? "১২৩"[i] : i + 1}
          </span>
          <h3 className="text-lg font-semibold">{s.title}</h3>
          <p className="mt-1 text-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  );

  const intro = (
    <div>
      <Eyebrow>{st.eyebrow}</Eyebrow>
      <h2 className="font-display mt-4 text-[2rem] leading-snug text-balance sm:text-5xl">{st.title}</h2>
    </div>
  );

  // Mobile / reduced motion: illustration, then dashboard
  const stacked = (
    <Container className="py-20">
      {intro}
      {steps}
      <div className="paper-cream mt-10 rounded-[1.6rem] p-3 ring-1 ring-ink/10">{network}</div>
      <div className="mt-6">
        <BranchDashboard />
      </div>
    </Container>
  );

  if (reduce) return <section className="bg-[#f6f1e6]">{stacked}</section>;

  return (
    <section ref={ref} className="relative bg-[#f6f1e6] lg:h-[300vh]">
      <div className="lg:hidden">{stacked}</div>
      <div className="sticky top-0 hidden h-svh items-center overflow-hidden lg:flex">
        <Container className="grid items-center gap-12 lg:grid-cols-[0.75fr_1.5fr]">
          <div>
            {intro}
            {steps}
          </div>
          <div className="relative h-[78svh]">
            <motion.div className="absolute inset-x-0 top-[6%] origin-top will-change-transform" style={{ scale: netScale, y: netY, opacity: netOpacity }}>
              {network}
            </motion.div>
            <motion.div className="absolute inset-x-0 bottom-0 will-change-transform" style={{ y: dashY, opacity: dashOpacity }}>
              <BranchDashboard compact />
            </motion.div>
          </div>
        </Container>
      </div>
    </section>
  );
}
