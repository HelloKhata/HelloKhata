import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { InkStroke, Reveal } from "@/components/ui/Reveal";
import { Storefront } from "@/components/illustrations/Storefront";
import { fmtTaka } from "@/lib/format";
import { today } from "@/content/demo-data";

/**
 * Signature moment #5: the storefront, the green ink line and the digital interface
 * meet one last time — the line runs from the shop, under the headline, into the app.
 */
export function FinalCta({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const f = t.home.final;
  return (
    <section aria-labelledby="final-title" className="paper relative overflow-hidden pt-24 pb-36 sm:pt-32 sm:pb-44">
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.6fr_0.8fr]">
          <Reveal kind="fade" className="mx-auto w-48 -rotate-3 lg:w-full">
            <Storefront slug="grocery" className="w-full drop-shadow-[0_20px_30px_rgb(23_34_28/0.15)]" />
          </Reveal>
          <div className="relative text-center">
            <h2 id="final-title" className="font-display text-[2.2rem] leading-snug text-balance sm:text-6xl sm:leading-[1.2]">
              {f.title}
            </h2>
            <InkStroke
              viewBox="0 0 600 40"
              d="M-160 30 C 0 0, 120 40, 300 18 S 560 6, 760 26"
              className="mx-auto mt-2 h-8 w-full overflow-visible"
              width={4}
              duration={1.8}
            />
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted sm:text-xl">{f.lead}</p>
            <div className="mt-9">
              <ButtonLink href={`/${locale}/get-started`} size="lg" arrow>
                {f.cta}
              </ButtonLink>
            </div>
          </div>
          <Reveal kind="fade" delay={0.3} className="mx-auto w-52 rotate-3 lg:w-full">
            <div className="rounded-[2rem] bg-ink p-2 shadow-[var(--shadow-float)]">
              <div className="rounded-[1.6rem] bg-forest p-4 text-cream">
                <p className="text-xs text-cream/60">{t.home.hero.cardLabel}</p>
                <p className="font-latin mt-1 text-2xl font-bold">{fmtTaka(today.sales, locale)}</p>
                <div className="mt-4 space-y-2">
                  <p className="ml-auto w-fit max-w-[90%] rounded-xl rounded-br-sm bg-cream px-3 py-1.5 text-xs text-ink">{t.home.hero.phoneQuestion}</p>
                  <p className="w-fit max-w-[90%] rounded-xl rounded-bl-sm bg-leaf-deep px-3 py-1.5 text-xs">{t.home.hero.phoneAnswer}</p>
                </div>
                <p className="mt-3 text-[0.65rem] text-marigold-soft/80">{t.home.hero.phoneNote}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
