import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/pages/PageParts";
import { ContactForm } from "@/components/forms/ContactForm";
import { Storefront } from "@/components/illustrations/Storefront";
import { ContactDirect } from "@/components/pages/ContactDirect";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).meta.pages.contact;
  return pageMetadata(locale, "/contact", m.title, m.description);
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = getDict(locale);
  const c = t.contact;
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} />
      <Container className="grid gap-10 pb-24 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[1.8rem] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/5 sm:p-10">
          <ContactForm />
        </div>
        <aside className="space-y-6">
          <ContactDirect locale={locale} />
          <div className="paper-cream rounded-[1.6rem] p-8 ring-1 ring-ink/10">
            <h2 className="font-display text-2xl">{c.sideTitle}</h2>
            <p className="mt-2 text-muted">{c.sideBody}</p>
            <ButtonLink href={`/${locale}/resources`} variant="secondary" className="mt-6" arrow>
              {c.sideCta}
            </ButtonLink>
          </div>
          <div className="rounded-[1.6rem] bg-leaf-soft/60 p-6">
            <Storefront slug="online-store" className="mx-auto w-full max-w-xs" />
          </div>
        </aside>
      </Container>
    </>
  );
}
