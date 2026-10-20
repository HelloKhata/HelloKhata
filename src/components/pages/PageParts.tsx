import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { noOrphanDash } from "@/lib/format";
import { Container, Eyebrow } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { InkStroke } from "@/components/ui/Reveal";
import { Skyline } from "@/components/illustrations/Skyline";

/** Top-of-page header used by every inner page. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  aside,
  crumbs,
  crumbLabel,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  crumbs?: { href: string; label: string }[];
  crumbLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      <Skyline className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full text-ink/[0.07]" />
      <Container className="relative">
        {crumbs && (
          <nav aria-label={crumbLabel} className="mb-6 text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  <Link href={c.href} className="underline-offset-4 hover:text-ink hover:underline">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className={cn("grid items-center gap-12", !!aside && "lg:grid-cols-[1.15fr_1fr]")}>
          <div className="max-w-3xl">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="font-display hk-rise mt-4 text-[2.4rem] leading-tight text-balance sm:text-6xl sm:leading-[1.15]">{noOrphanDash(title)}</h1>
            <InkStroke viewBox="0 0 300 20" d="M3 12 C 60 4, 120 18, 180 9 S 260 7, 297 11" className="mt-3 h-4 w-40" width={4} delay={0.3} duration={1} />
            {lead && <p className="mt-6 text-lg text-pretty text-muted sm:text-xl">{lead}</p>}
            {children}
          </div>
          {aside}
        </div>
      </Container>
    </section>
  );
}

/** Closing call to action used at the bottom of inner pages. */
export function CtaBand({ locale, title, body }: { locale: Locale; title?: string; body?: string }) {
  const t = getDict(locale);
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="on-dark grain-dark relative overflow-hidden rounded-[2rem] bg-forest px-6 py-14 text-center text-cream sm:px-12 sm:py-20">
          <div aria-hidden="true" className="absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(74_222_128/0.25),transparent)]" />
          <h2 className="font-display relative text-3xl text-balance sm:text-5xl">{title ?? t.home.final.title}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-cream/75">{body ?? t.home.final.lead}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={`/${locale}/get-started`} variant="light" size="lg" arrow>
              {t.common.getStartedToday}
            </ButtonLink>
            <ButtonLink href={`/${locale}/contact`} variant="ghost" size="lg" className="text-cream hover:bg-white/10">
              {t.nav.contact}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Native <details> accordion: accessible, works without JavaScript. */
export function Faq({ items, title }: { items: { q: string; a: string }[]; title?: string }) {
  return (
    <div>
      {title && <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>}
      <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
        {items.map((it) => (
          <details key={it.q} className="group py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {it.q}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink/5 text-leaf-deep transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="pb-5 text-muted">{it.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
