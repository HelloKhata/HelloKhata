import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { categoryModules } from "@/content/site";
import { channelStatus, moduleStatus, type ChannelId, type ModuleId } from "@/content/capabilities";
import { Container, SectionHeading, StatusBadge } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand, PageHero } from "@/components/pages/PageParts";
import { SocialSellerScene } from "@/components/illustrations/CommerceScenes";
import { SharedInbox } from "@/components/social/SharedInbox";
import { AdsManager, CommerceFlow, ContentStudio, LeadBoard, OrdersRetention, SocialCalendar } from "@/components/social/SocialModules";
import { CapabilityGrid, ChannelStatusList } from "./Capabilities";

const channels: ChannelId[] = ["messenger", "instagram", "whatsapp", "metaAds", "paymentGateway", "courierPartner"];

export function FcommercePage({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const f = t.fcommerce;
  const item = t.solutions.items["f-commerce"];

  const Module = ({ id, letter, eyebrow, title, lead, children }: { id: ModuleId; letter: string; eyebrow: string; title: string; lead: string; children: React.ReactNode }) => (
    <Reveal as="article" className="scroll-mt-24">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-latin flex size-8 items-center justify-center rounded-full bg-[#5b21b6] text-sm font-bold text-white">{letter}</span>
        <p className="text-sm font-semibold text-[#5b21b6]">{eyebrow}</p>
        <StatusBadge status={moduleStatus[id]} label={t.status[moduleStatus[id]]} />
      </div>
      <h3 className="font-display mt-3 text-3xl text-balance">{title}</h3>
      <p className="mt-2 max-w-2xl text-lg text-muted">{lead}</p>
      <div className="mt-6">{children}</div>
    </Reveal>
  );

  return (
    <>
      <PageHero
        eyebrow={f.eyebrow}
        title={item.title}
        lead={item.lead}
        crumbLabel={t.common.breadcrumb}
        crumbs={[
          { href: `/${locale}`, label: "HelloKhata" },
          { href: `/${locale}/solutions`, label: t.nav.solutions },
        ]}
        aside={
          <Reveal className="mx-auto w-full max-w-md rounded-[2rem] bg-[#ede4fd] p-6">
            <SocialSellerScene className="w-full" />
          </Reveal>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="#inbox" size="lg" arrow>
            {f.inbox.eyebrow}
          </ButtonLink>
          <ButtonLink href={`/${locale}/contact`} variant="secondary" size="lg">
            {t.nav.contact}
          </ButtonLink>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20" aria-labelledby="flow-title">
        <Container>
          <SectionHeading id="flow-title" eyebrow={f.flow.eyebrow} title={f.flow.title} lead={f.flow.lead} />
          <div className="mt-10">
            <CommerceFlow />
          </div>
        </Container>
      </section>

      <section id="inbox" className="scroll-mt-20 bg-[#f5f2fb] py-20 sm:py-28" aria-labelledby="inbox-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="inbox-title" eyebrow={f.inbox.eyebrow} title={f.inbox.title} lead={f.inbox.lead} />
            <div className="flex gap-2">
              <StatusBadge status={moduleStatus.inbox} label={`${t.modules.inbox.name}: ${t.status[moduleStatus.inbox]}`} />
              <StatusBadge status={moduleStatus.aiAgent} label={`${t.modules.aiAgent.name}: ${t.status[moduleStatus.aiAgent]}`} />
            </div>
          </div>
          <div className="mt-10">
            <SharedInbox />
          </div>
          <p className="mt-4 text-sm text-muted">{f.inbox.channelNote}</p>
        </Container>
      </section>

      <section className="py-20 sm:py-28" aria-labelledby="modules-title">
        <Container>
          <h2 id="modules-title" className="font-display text-[2rem] text-balance sm:text-5xl">
            {f.modulesTitle}
          </h2>
          <div className="mt-14 space-y-24">
            <Module id="contentStudio" letter="A" eyebrow={f.content.eyebrow} title={f.content.title} lead={f.content.lead}>
              <ContentStudio />
            </Module>
            <Module id="socialManager" letter="B" eyebrow={f.social.eyebrow} title={f.social.title} lead={f.social.lead}>
              <SocialCalendar />
            </Module>
            <Module id="adsManager" letter="C" eyebrow={f.ads.eyebrow} title={f.ads.title} lead={f.ads.lead}>
              <AdsManager />
            </Module>
            <Module id="crm" letter="D" eyebrow={f.crm.eyebrow} title={f.crm.title} lead={f.crm.lead}>
              <LeadBoard />
            </Module>
            <Module id="ordersRetention" letter="F" eyebrow={f.orders.eyebrow} title={f.orders.title} lead={f.orders.lead}>
              <OrdersRetention />
            </Module>
          </div>
        </Container>
      </section>

      <section className="on-dark grain-dark bg-forest py-20 text-cream sm:py-28" aria-labelledby="int-title">
        <Container>
          <SectionHeading id="int-title" tone="light" eyebrow={f.integrations.eyebrow} title={f.integrations.title} lead={f.integrations.lead} />
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {channels.map((c) => {
              const it = f.integrations.items[c];
              return (
                <li key={c} className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{t.channels[c].name}</p>
                      <p className="text-sm text-cream/60">{t.channels[c].desc}</p>
                    </div>
                    <StatusBadge status={channelStatus[c]} label={t.status[channelStatus[c]]} tone="dark" />
                  </div>
                  <p className="mt-4 text-xs font-semibold text-leaf-glow">{f.integrations.permissions}</p>
                  <ul className="mt-1 space-y-1 text-sm text-cream/80">
                    {it.permissions.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs font-semibold text-leaf-glow">{f.integrations.steps}</p>
                  <ol className="mt-1 space-y-1 text-sm text-cream/80">
                    {it.steps.map((s, i) => (
                      <li key={s}>
                        {locale === "bn" ? "১২৩"[i] : i + 1}. {s}
                      </li>
                    ))}
                  </ol>
                </li>
              );
            })}
          </ul>
          <p className="mt-8 max-w-3xl rounded-2xl bg-white/[0.06] p-4 text-sm text-cream/85">{f.integrations.groupsNote}</p>
          <p className="mt-2 text-xs text-cream/50">{f.integrations.logosNote}</p>
        </Container>
      </section>

      <section className="py-20" aria-labelledby="fc-caps">
        <Container>
          <SectionHeading id="fc-caps" title={t.solutions.detail.capabilitiesTitle} />
          <CapabilityGrid locale={locale} modules={categoryModules["f-commerce"]} className="mt-10" />
          <div className="mt-6">
            <ChannelStatusList locale={locale} channels={["messenger", "instagram", "whatsapp"]} />
          </div>
        </Container>
      </section>
      <CtaBand locale={locale} title={f.ctaTitle} body={f.ctaBody} />
    </>
  );
}
