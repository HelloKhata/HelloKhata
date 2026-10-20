"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useI18n } from "@/i18n/client";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Better records → better decisions, told as a pinned horizontal journey on large screens.
 * Small screens and reduced-motion users get a vertical sequence instead.
 */
export function GrowthStory({ arts }: { arts: React.ReactNode[] }) {
  const { t, locale } = useI18n();
  const g = t.home.growth;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scrollYProgress = useSpring(raw, { stiffness: 150, damping: 30, mass: 0.4, restDelta: 0.0005 });
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["0vw", "-92vw"]);
  const line = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);
  const num = (i: number) => (locale === "bn" ? "০১২৩৪৫"[i + 1] : String(i + 1));

  const intro = (withId: boolean) => (
    <div>
      <Eyebrow>{g.eyebrow}</Eyebrow>
      <h2 id={withId ? "growth-title" : undefined} className="font-display mt-4 text-[2rem] leading-snug text-balance sm:text-5xl">
        {g.title}
      </h2>
      <p className="mt-5 text-lg text-muted">{g.lead}</p>
    </div>
  );

  const Stage = ({ i }: { i: number }) => (
    <div className="flex h-full flex-col">
      <div className="paper-cream relative rounded-[1.4rem] p-4 ring-1 ring-ink/10">
        {arts[i]}
        <span className="font-display absolute top-3 left-4 text-2xl text-leaf-deep/70">{num(i)}</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-ink">{g.stages[i].title}</h3>
      <p className="mt-1.5 text-muted">{g.stages[i].body}</p>
    </div>
  );

  // Vertical layout (mobile, tablet, reduced motion)
  const vertical = (withId: boolean) => (
    <Container className="py-24 sm:py-32">
      {intro(withId)}
      <ol className="relative mt-14 grid gap-12 border-l-2 border-dashed border-leaf/30 pl-6 sm:grid-cols-2 sm:border-0 sm:pl-0">
        {g.stages.map((_, i) => (
          <Reveal as="li" key={i} delay={(i % 2) * 0.1}>
            <Stage i={i} />
          </Reveal>
        ))}
      </ol>
    </Container>
  );

  if (reduce) {
    return (
      <section aria-labelledby="growth-title" className="paper">
        {vertical(true)}
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="growth-title" className="paper relative lg:h-[400vh]">
      <div className="lg:hidden">{vertical(false)}</div>
      <div className="sticky top-0 hidden h-svh items-center overflow-hidden lg:flex">
        <motion.div className="relative flex items-center gap-[4vw] pr-[8vw] will-change-transform pl-[max(2rem,calc((100vw-1320px)/2+2rem))]" style={{ x }}>
          <div className="w-[34vw] max-w-[520px] shrink-0">
            {intro(true)}
            <p className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-leaf-ink">
              {g.scrollHint}
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                <path d="M5 12h13m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
          </div>
          <svg className="pointer-events-none absolute top-[38%] left-[34vw] h-24 w-[150vw]" viewBox="0 0 1500 100" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
              d="M0 60 C 120 10, 220 90, 340 50 S 560 20, 680 60 S 900 90, 1020 40 S 1260 30, 1500 50"
              fill="none"
              stroke="var(--color-leaf)"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: line }}
            />
          </svg>
          {g.stages.map((_, i) => (
            <div key={i} className="relative w-[24vw] max-w-[360px] shrink-0" style={{ marginTop: i % 2 ? "10vh" : "-6vh" }}>
              <Stage i={i} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
