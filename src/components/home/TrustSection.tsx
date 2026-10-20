import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { Sketch } from "@/lib/sketch";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { P } from "@/components/illustrations/ink";

/**
 * Testimonials: add approved stories here. While the list is empty a designed placeholder
 * is shown instead — we never invent people, quotes, ratings or adoption numbers.
 */
export const testimonials: { quote: { bn: string; en: string }; name: string; business: { bn: string; en: string } }[] = [];

const icons = [
  // records → answer
  (s: Sketch) => [s.rect(6, 8, 22, 28, 0.4), s.line(11, 16, 23, 16, 0.3, 1), s.line(11, 22, 21, 22, 0.3, 1), s.line(11, 28, 19, 28, 0.3, 1), s.curve([[30, 22], [36, 18], [42, 22]], 0.3), s.ellipse(40, 32, 6, 6, 0.3)],
  // key / access
  (s: Sketch) => [s.ellipse(16, 22, 9, 9, 0.4), s.line(25, 22, 42, 22, 0.3), s.line(36, 22, 36, 30, 0.3, 1), s.line(41, 22, 41, 28, 0.3, 1)],
  // speech in bengali
  (s: Sketch) => [s.curve([[6, 10], [40, 8], [42, 28], [24, 30], [14, 38], [16, 30], [6, 28], [6, 10]], 0.4)],
  // seedling
  (s: Sketch) => [s.line(24, 40, 24, 20, 0.3), s.curve([[24, 24], [14, 22], [10, 12], [20, 12], [24, 22]], 0.3), s.curve([[24, 20], [30, 12], [40, 10], [38, 20], [24, 22]], 0.3), s.line(10, 40, 38, 40, 0.3)],
];

export function TrustSection({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const tr = t.home.trust;
  return (
    <section aria-labelledby="trust-title" className="paper-cream py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading id="trust-title" eyebrow={tr.eyebrow} title={tr.title} lead={tr.lead} />
            <Reveal className="mt-10">
              <figure className="relative rounded-[1.6rem] border-2 border-dashed border-ink/15 p-8">
                <svg viewBox="0 0 60 40" className="h-10 w-14 text-leaf/50" aria-hidden="true">
                  <path d="M4 36c0-14 6-24 18-30l3 4c-7 5-10 10-10 16h8v10H4Zm30 0c0-14 6-24 18-30l3 4c-7 5-10 10-10 16h8v10H34Z" fill="currentColor" />
                </svg>
                <figcaption>
                  <p className="font-display mt-4 text-2xl text-ink">{testimonials.length ? tr.storiesTitle : tr.storiesPlaceholderTitle}</p>
                  <p className="mt-2 text-muted">{tr.storiesPlaceholderBody}</p>
                </figcaption>
                <span className="font-hand absolute -top-4 right-6 rotate-3 rounded-md bg-marigold-soft px-3 py-1 text-[#6b4a07]">{tr.storiesTitle}</span>
              </figure>
            </Reveal>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {tr.principles.map((p, i) => {
              const s = new Sketch(900 + i);
              return (
                <Reveal as="li" key={p.title} delay={i * 0.08} className="rounded-[1.4rem] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
                  <svg viewBox="0 0 48 48" className="size-12 text-leaf-deep" aria-hidden="true">
                    <g filter="url(#hk-wobble)">
                      {icons[i](s).map((d, k) => (
                        <P key={k} d={d} w={2} />
                      ))}
                    </g>
                  </svg>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1.5 text-muted">{p.body}</p>
                </Reveal>
              );
            })}
            <li className="sm:col-span-2">
              <Link href={`/${locale}/resources`} className="group inline-flex items-center gap-2 font-semibold text-leaf-ink underline-offset-4 hover:underline">
                {tr.helpLink}
                <Arrow />
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
