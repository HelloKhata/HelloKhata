import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Section";
import {
  StreetBack,
  StreetMid,
  StreetWires,
} from "@/components/illustrations/StreetScene";
import { HeroStage } from "./HeroStage";
import { HeroHeadline } from "./HeroHeadline";

export function Hero({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const h = t.home.hero;
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-x-clip lg:min-h-[max(100svh,56rem)]"
    >
      <Container className="relative z-10 pt-28 sm:pt-32 lg:pt-32">
        <div className="hero-halo relative max-w-[36rem]">
          <Eyebrow>{h.eyebrow}</Eyebrow>
          <HeroHeadline line1={h.title1} line2={h.title2} />
          <p className="mt-6 max-w-[30rem] text-lg text-pretty text-ink-soft sm:text-xl">
            {h.lead}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={`/${locale}/get-started`}
              size="lg"
              arrow
              className="w-full sm:w-auto"
            >
              {t.common.getStarted}
            </ButtonLink>
            <ButtonLink
              href={`/${locale}/how-it-works`}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {t.common.seeHowItWorks}
            </ButtonLink>
          </div>
        </div>
      </Container>
      <div className="relative mt-10 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0">
        <HeroStage
          back={<StreetBack />}
          wires={<StreetWires />}
          mid={<StreetMid />}
        />
      </div>
    </section>
  );
}
