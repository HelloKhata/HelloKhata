import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { categoryModules } from "@/content/site";
import { moduleStatus } from "@/content/capabilities";
import { Container, Eyebrow, SectionHeading, StatusBadge } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand, PageHero } from "@/components/pages/PageParts";
import { SuperShopFront, SupershopNetwork } from "@/components/illustrations/CommerceScenes";
import { NetworkStory } from "@/components/supershop/NetworkStory";
import { BranchDashboard } from "@/components/supershop/BranchDashboard";
import { BulkSmsComposer, HrmTable, RoleMatrix } from "@/components/supershop/SupershopTools";
import { SalesBillDemo } from "@/components/home/FeatureDemos";
import { CapabilityGrid } from "./Capabilities";

export function SupershopPage({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const ss = t.supershop;
  const item = t.solutions.items.supershop;
  const loc = ss.dashboard.locations;
  const network = <SupershopNetwork className="w-full" alt={ss.networkAlt} labels={{ dhanmondi: loc.dhanmondi, mirpur: loc.mirpur, uttara: loc.uttara, warehouse: loc.warehouse }} />;

  const Block = ({ module, title, body, children, reverse }: { module: keyof typeof moduleStatus; title: string; body: string; children: React.ReactNode; reverse?: boolean }) => (
    <Reveal className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className={reverse ? "lg:order-2" : ""}>
        <StatusBadge status={moduleStatus[module]} label={t.status[moduleStatus[module]]} />
        <h3 className="font-display mt-3 text-3xl">{title}</h3>
        <p className="mt-2 text-lg text-muted">{body}</p>
      </div>
      <div>{children}</div>
    </Reveal>
  );

  return (
    <>
      <PageHero
        eyebrow={ss.eyebrow}
        title={item.title}
        lead={item.lead}
        crumbLabel={t.common.breadcrumb}
        crumbs={[
          { href: `/${locale}`, label: "HelloKhata" },
          { href: `/${locale}/solutions`, label: t.nav.solutions },
        ]}
        aside={
          <Reveal className="mx-auto w-full max-w-md rounded-[2rem] bg-[#f8e7bf] p-6">
            <SuperShopFront className="w-full" />
          </Reveal>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/${locale}/contact`} size="lg" arrow>
            {t.nav.contact}
          </ButtonLink>
          <ButtonLink href="#dashboard" variant="secondary" size="lg">
            {t.solutions.detail.demoTitle}
          </ButtonLink>
        </div>
      </PageHero>

      <NetworkStory network={network} />

      <section id="dashboard" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="dash-title">
        <Container>
          <SectionHeading id="dash-title" eyebrow={t.modules.multiBranch.name} title={ss.dashboard.title} lead={t.modules.centralInventory.desc} />
          <div className="mt-10">
            <BranchDashboard />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24" aria-labelledby="ss-caps">
        <Container>
          <SectionHeading id="ss-caps" title={ss.capabilitiesTitle} lead={ss.capabilitiesLead} />
          <CapabilityGrid locale={locale} modules={categoryModules.supershop} className="mt-10" />
        </Container>
      </section>

      <section className="paper-cream py-16 sm:py-24">
        <Container className="space-y-20">
          <Block module="integratedPos" title={ss.pos.title} body={ss.pos.body}>
            <div className="rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
              <SalesBillDemo />
            </div>
          </Block>
          <Block module="hrm" title={ss.hrm.title} body={ss.hrm.body} reverse>
            <HrmTable />
          </Block>
          <Block module="bulkSms" title={ss.sms.title} body={ss.sms.body}>
            <BulkSmsComposer />
          </Block>
          <Block module="roleAccess" title={ss.roles.title} body={ss.roles.body} reverse>
            <RoleMatrix />
          </Block>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Eyebrow>{t.solutions.detail.needsTitle}</Eyebrow>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {item.needs.map((n, i) => (
              <li key={n} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
                <span className="font-display flex size-9 shrink-0 items-center justify-center rounded-full bg-[#b45309] text-white">{locale === "bn" ? "১২৩"[i] : i + 1}</span>
                <span className="pt-1">{n}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand locale={locale} title={ss.ctaTitle} body={ss.ctaBody} />
    </>
  );
}
