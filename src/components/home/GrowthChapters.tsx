import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { groupStatus, type ProductGroup } from "@/content/capabilities";
import { cn } from "@/lib/cn";
import { noOrphanDash } from "@/lib/format";
import { Container, Eyebrow, SectionHeading, StatusBadge } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { InkStroke, Reveal } from "@/components/ui/Reveal";
import { SupershopNetwork } from "@/components/illustrations/CommerceScenes";
import { InboxTeaser, ThemeSwitcherMini } from "./ChapterWidgets";

/**
 * The homepage's growth arc: enterprise (super shops) → digital (online store) → social selling.
 * Each chapter is short and links to its dedicated page; a green ink line threads them together.
 */
export function GrowthChapters({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const c = t.home.chapters;
  const loc = t.supershop.dashboard.locations;
  const chapters: { key: "enterprise" | "digital" | "social"; group: ProductGroup; href: string; color: string; bg: string; visual: React.ReactNode }[] = [
    {
      key: "enterprise",
      group: "supershop",
      href: "/solutions/supershop",
      color: "#7c3a06",
      bg: "bg-[#f8e7bf]/50",
      visual: <SupershopNetwork className="w-full" alt={t.supershop.networkAlt} labels={{ dhanmondi: loc.dhanmondi, mirpur: loc.mirpur, uttara: loc.uttara, warehouse: loc.warehouse }} />,
    },
    { key: "digital", group: "online", href: "/solutions/online-store", color: "#1d4ed8", bg: "bg-[#dbe6fe]/50", visual: <ThemeSwitcherMini /> },
    { key: "social", group: "social", href: "/solutions/f-commerce", color: "#5b21b6", bg: "bg-[#ede4fd]/60", visual: <InboxTeaser /> },
  ];

  return (
    <section aria-labelledby="chapters-title" className="paper relative overflow-hidden py-24 sm:py-32">
      <Container>
        <SectionHeading id="chapters-title" eyebrow={c.eyebrow} title={c.title} align="center" />
        <div className="relative mt-16 space-y-16 sm:space-y-20">
          <InkStroke viewBox="0 0 20 1000" d="M10 0 C 2 160, 18 300, 10 500 S 4 820, 10 1000" className="pointer-events-none absolute top-0 left-1/2 hidden h-full w-6 -translate-x-1/2 lg:block" width={2.5} duration={2.4} />
          {chapters.map((ch, i) => {
            const copy = c[ch.key];
            const st = groupStatus(ch.group);
            return (
              <Reveal key={ch.key} className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-24">
                <div className={cn(i % 2 === 1 && "lg:order-2")}>
                  <div className="flex flex-wrap items-center gap-3">
                    <Eyebrow>{copy.eyebrow}</Eyebrow>
                    <StatusBadge status={st} label={t.status[st]} />
                  </div>
                  <h3 className="font-display mt-4 text-3xl text-balance sm:text-5xl" style={{ color: ch.color }}>
                    {noOrphanDash(copy.title)}
                  </h3>
                  <p className="mt-4 max-w-lg text-lg text-muted">{copy.body}</p>
                  <ButtonLink href={`/${locale}${ch.href}`} variant="secondary" className="mt-6" arrow>
                    {copy.cta}
                  </ButtonLink>
                </div>
                <div className={cn("rounded-[1.8rem] p-4 sm:p-6", ch.bg)}>{ch.visual}</div>
                <span aria-hidden="true" className="absolute top-1/2 left-1/2 hidden size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-paper lg:block" style={{ background: ch.color }} />
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
