import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { categoryModules } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand, PageHero } from "@/components/pages/PageParts";
import { OnlineSellerScene } from "@/components/illustrations/CommerceScenes";
import { StoreStory } from "@/components/online/StoreStory";
import { StoreLab } from "@/components/online/StoreLab";
import { CheckoutDemo, CourierDemo, DomainDemo } from "@/components/online/OnlineCommerce";
import { CapabilityGrid } from "./Capabilities";

export function OnlineStorePage({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const o = t.onlineStore;
  const item = t.solutions.items["online-store"];
  return (
    <>
      <PageHero
        eyebrow={o.eyebrow}
        title={item.title}
        lead={item.lead}
        crumbLabel={t.common.breadcrumb}
        crumbs={[
          { href: `/${locale}`, label: "HelloKhata" },
          { href: `/${locale}/solutions`, label: t.nav.solutions },
        ]}
        aside={
          <Reveal className="mx-auto w-full max-w-md rounded-[2rem] bg-[#dbe6fe] p-6">
            <OnlineSellerScene className="w-full" />
          </Reveal>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="#builder" size="lg" arrow>
            {o.builder.title.split("—")[0].trim()}
          </ButtonLink>
          <ButtonLink href={`/${locale}/contact`} variant="secondary" size="lg">
            {t.nav.contact}
          </ButtonLink>
        </div>
      </PageHero>

      <StoreStory sellerArt={<OnlineSellerScene className="w-full" />} />
      <StoreLab />

      <section className="paper-cream py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-3">
          {(
            [
              ["domain", <DomainDemo key="d" />],
              ["payments", <CheckoutDemo key="p" />],
              ["courier", <CourierDemo key="c" />],
            ] as const
          ).map(([k, demo]) => (
            <Reveal key={k}>
              <p className="text-sm font-semibold text-[#1d4ed8]">{o[k].eyebrow}</p>
              <h2 className="font-display mt-2 text-2xl text-balance sm:text-3xl">{o[k].title}</h2>
              <p className="mt-2 text-muted">{o[k].lead}</p>
              <div className="mt-6">{demo}</div>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="py-20" aria-labelledby="os-caps">
        <Container>
          <SectionHeading id="os-caps" title={t.solutions.detail.capabilitiesTitle} lead={o.disclaimer} />
          <CapabilityGrid locale={locale} modules={categoryModules["online-store"]} className="mt-10" />
        </Container>
      </section>
      <CtaBand locale={locale} title={o.ctaTitle} body={o.ctaBody} />
    </>
  );
}
