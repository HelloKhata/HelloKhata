import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Section";
import { PageHero } from "./PageParts";

export function LegalPage({ locale, kind }: { locale: Locale; kind: "privacy" | "terms" }) {
  const t = getDict(locale);
  const doc = t.legal[kind];
  return (
    <>
      <PageHero eyebrow={t.footer.help} title={doc.title} lead={t.legal.updated} />
      <Container className="max-w-3xl pb-24">
        <p role="note" className="rounded-2xl bg-marigold-soft px-5 py-4 text-sm font-semibold text-[#5c3f05]">
          {t.legal.draft}
        </p>
        <div className="mt-10 space-y-10">
          {doc.sections.map((s, i) => (
            <section key={s.h} aria-labelledby={`legal-${i}`}>
              <h2 id={`legal-${i}`} className="font-display text-2xl">
                {s.h}
              </h2>
              <p className="mt-3 text-lg text-ink-soft">{s.p}</p>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
