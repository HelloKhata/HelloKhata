/**
 * Two-line display headline. Animated with CSS (not JS) so it paints immediately,
 * even before hydration; the second line's green underline inks itself in.
 */
export function HeroHeadline({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <h1 id="hero-title" className="font-display mt-5 text-[2.9rem] leading-[1.18] text-ink sm:text-7xl sm:leading-[1.14] lg:text-[4.6rem]">
      <span className="hk-rise block">{line1}</span>
      <span className="hk-rise relative inline-block text-leaf-deep [animation-delay:120ms]">
        {line2}
        <svg viewBox="0 0 300 22" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-4 w-full sm:-bottom-3 sm:h-5" aria-hidden="true">
          <path d="M4 15 C 60 6, 120 18, 180 9 S 270 7, 296 12" pathLength={1} fill="none" stroke="var(--color-leaf)" strokeWidth="5" strokeLinecap="round" className="hk-draw [animation-delay:700ms]" />
        </svg>
      </span>
    </h1>
  );
}
