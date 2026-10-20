import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/** Simplicity · Intelligence · Control — set on a ruled ledger strip right below the hero. */
export function Pillars({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <section aria-label={t.home.hero.eyebrow} className="relative border-y border-ink/10 bg-[#fbf7ee]">
      <div aria-hidden="true" className="absolute inset-y-0 left-[max(1.25rem,calc((100vw-1320px)/2))] w-px bg-vermilion/40" />
      <Container>
        <ul className="grid divide-y divide-dashed divide-ink/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {t.home.hero.pillars.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.1} className="py-8 sm:px-8 sm:py-10 sm:first:pl-6">
              <p className="font-display text-3xl text-leaf-deep">{p.title}</p>
              <p className="mt-2 text-ink-soft">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
