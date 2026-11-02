import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/pages/PageParts";
import { privacyPolicyData, type PrivacySection } from "@/content/privacy";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).meta.pages.privacy;
  return pageMetadata(locale, "/privacy", m.title, m.description);
}

const sectionIcons: Record<string, React.ReactNode> = {
  user: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  store: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2" />
    </svg>
  ),
  laptop: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
      <line x1="2" x2="22" y1="20" y2="20" />
    </svg>
  ),
  sparkles: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  ),
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const policy = privacyPolicyData[locale] ?? privacyPolicyData.en;

  const crumbs = [
    { href: `/${locale}`, label: locale === "bn" ? "হোম" : "Home" },
    { href: `/${locale}/privacy`, label: policy.title },
  ];

  return (
    <>
      <PageHero
        eyebrow={policy.eyebrow}
        title={policy.title}
        lead={policy.lead}
        crumbs={crumbs}
        crumbLabel={locale === "bn" ? "ন্যাভিগেশন" : "Breadcrumbs"}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-leaf-soft px-3.5 py-1.5 text-xs font-semibold text-leaf-ink ring-1 ring-leaf/20">
            <span className="size-2 rounded-full bg-leaf animate-pulse" />
            {policy.entityBadge}
          </span>
          {/* <span className="inline-flex items-center rounded-full bg-paper-deep px-3.5 py-1.5 text-xs font-medium text-ink-soft ring-1 ring-ink/10">
            {policy.lastUpdated}
          </span> */}
        </div>
      </PageHero>

      <section className="py-12 sm:py-20" aria-label={policy.title}>
        <Container className="grid gap-12 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
          {/* Sticky Quick-Navigation Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <nav
                aria-label={policy.tocTitle}
                className="paper-cream rounded-[1.6rem] p-6 ring-1 ring-ink/10 shadow-[var(--shadow-card)]"
              >
                <p className="font-display text-lg text-ink font-semibold">
                  {policy.tocTitle}
                </p>
                <div className="mt-4 h-px w-full bg-rule/70" />
                <ol className="mt-4 space-y-1.5 text-sm">
                  {policy.sections.map((s: PrivacySection) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="group flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-ink-soft transition-colors hover:bg-leaf-soft/60 hover:text-leaf-ink"
                      >
                        <span className="font-mono text-xs font-semibold text-muted group-hover:text-leaf-deep">
                          {s.num}
                        </span>
                        <span className="truncate">
                          {s.title.replace(/^\d+\.\s*/, "")}
                        </span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={`#${policy.contact.id}`}
                      className="group flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-ink-soft transition-colors hover:bg-leaf-soft/60 hover:text-leaf-ink"
                    >
                      <span className="font-mono text-xs font-semibold text-muted group-hover:text-leaf-deep">
                        {policy.contact.num}
                      </span>
                      <span className="truncate">
                        {policy.contact.title.replace(/^\d+\.\s*/, "")}
                      </span>
                    </a>
                  </li>
                </ol>
              </nav>

              {/* Policy Key Facts Pill Box */}
              <div className="rounded-[1.6rem] bg-forest p-6 text-cream shadow-[var(--shadow-card)]">
                <p className="font-display text-base font-semibold text-leaf-glow">
                  {policy.summaryTitle}
                </p>
                <div className="mt-4 space-y-3">
                  {policy.summaryPills.map((pill, i) => (
                    <div
                      key={i}
                      className="flex flex-col border-b border-white/10 pb-2.5 last:border-0 last:pb-0"
                    >
                      <span className="text-[11px] uppercase tracking-wider text-cream/50">
                        {pill.label}
                      </span>
                      <span className="mt-0.5 text-sm font-semibold text-cream">
                        {pill.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <a
                    href={`#${policy.contact.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-glow/15 px-3.5 py-2.5 text-xs font-semibold text-leaf-glow ring-1 ring-leaf-glow/30 transition-colors hover:bg-leaf-glow/25"
                  >
                    {locale === "bn"
                      ? "যোগাযোগের বিবরণ দেখুন"
                      : "View Contact Details"}
                    <span>↓</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="space-y-12">
            {/* Introductory Callout Card */}
            <div className="rounded-[1.8rem] bg-cream p-7 ring-1 ring-ink/10 shadow-[var(--shadow-card)] sm:p-9">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-leaf-soft text-leaf-ink">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-6"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold sm:text-2xl text-ink">
                    {locale === "bn"
                      ? "অফিসিয়াল গোপনীয়তা নীতি ও অঙ্গীকার"
                      : "Official Privacy Policy & Commitment"}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
                    {policy.lead}
                  </p>
                </div>
              </div>
            </div>

            {/* Render Each Policy Section */}
            {policy.sections.map((section: PrivacySection) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-[1.8rem] bg-white p-7 ring-1 ring-ink/5 shadow-[var(--shadow-card)] sm:p-10"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-leaf-soft font-mono text-xs font-bold text-leaf-deep">
                    {section.num}
                  </span>
                  <h2 className="font-display text-2xl font-bold sm:text-3xl text-ink">
                    {section.title}
                  </h2>
                </div>

                {section.bodyIntro && (
                  <p className="mt-4 text-base font-medium text-ink sm:text-lg">
                    {section.bodyIntro}
                  </p>
                )}

                {/* Sub-items (Grid for Information We Collect) */}
                {section.items && (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {section.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="group flex flex-col rounded-2xl bg-paper/60 p-5 ring-1 ring-ink/10 transition-colors hover:bg-leaf-soft/40 hover:ring-leaf/30"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-leaf-deep ring-1 ring-ink/10 shadow-sm">
                            {sectionIcons[item.icon] ?? sectionIcons.sparkles}
                          </span>
                          <h3 className="font-display text-lg font-bold text-ink">
                            {item.title}
                          </h3>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* List Items (for Section 2 How We Use) */}
                {section.list && (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {section.list.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 rounded-xl bg-paper/50 p-3.5 ring-1 ring-ink/5"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-leaf-soft text-leaf-deep">
                          <svg
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="size-3.5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-ink-soft sm:text-base leading-snug">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Standard Paragraphs */}
                {section.paragraphs && (
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-soft sm:text-lg">
                    {section.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                )}

                {/* Optional Alert Box */}
                {section.alert && (
                  <div
                    role="note"
                    className={`mt-6 rounded-2xl p-5 ring-1 ${
                      section.alert.type === "warning"
                        ? "bg-marigold-soft/70 ring-marigold/30 text-[#5c3f05]"
                        : "bg-leaf-soft/70 ring-leaf/30 text-leaf-ink"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white/80 shadow-xs">
                        {section.alert.type === "warning" ? (
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-4 text-marigold"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-4 text-leaf-deep"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                      <div>
                        {section.alert.title && (
                          <p className="font-semibold text-sm sm:text-base">
                            {section.alert.title}
                          </p>
                        )}
                        <p className="mt-1 text-sm leading-relaxed sm:text-base">
                          {section.alert.text}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))}

            {/* Section 11: Contact Us Highlight Card */}
            <article
              id={policy.contact.id}
              className="scroll-mt-28 rounded-[2rem] bg-forest p-7 text-cream shadow-[var(--shadow-card)] ring-1 ring-white/10 sm:p-10"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-leaf-glow/20 font-mono text-xs font-bold text-leaf-glow">
                  {policy.contact.num}
                </span>
                <h2 className="font-display text-2xl font-bold sm:text-3xl text-cream">
                  {policy.contact.title}
                </h2>
              </div>

              <p className="mt-4 text-base text-cream/80 sm:text-lg">
                {policy.contact.lead}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {/* Operator info */}
                <div className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                  <span className="block text-xs uppercase tracking-wider text-cream/50">
                    {policy.contact.operatorLabel}
                  </span>
                  <span className="mt-1 block text-lg font-bold text-cream">
                    {policy.contact.operatorValue}
                  </span>
                </div>

                {/* Email link */}
                <a
                  href={policy.contact.emailHref}
                  className="group rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10 transition-colors hover:bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-leaf-glow"
                >
                  <span className="flex items-center justify-between text-xs uppercase tracking-wider text-cream/50">
                    {policy.contact.emailLabel}
                    <span className="text-leaf-glow transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </span>
                  <span className="mt-1 block font-mono text-base font-semibold text-leaf-glow">
                    {policy.contact.emailValue}
                  </span>
                </a>

                {/* Phone link */}
                <a
                  href={policy.contact.phoneHref}
                  className="group rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10 transition-colors hover:bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-leaf-glow"
                >
                  <span className="flex items-center justify-between text-xs uppercase tracking-wider text-cream/50">
                    {policy.contact.phoneLabel}
                    <span className="text-leaf-glow transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </span>
                  <span className="mt-1 block font-mono text-base font-semibold text-leaf-glow">
                    {policy.contact.phoneValue}
                  </span>
                </a>

                {/* Website link */}
                <a
                  href={policy.contact.websiteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10 transition-colors hover:bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-leaf-glow"
                >
                  <span className="flex items-center justify-between text-xs uppercase tracking-wider text-cream/50">
                    {policy.contact.websiteLabel}
                    <span className="text-leaf-glow transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </span>
                  <span className="mt-1 block font-mono text-base font-semibold text-leaf-glow">
                    {policy.contact.websiteValue}
                  </span>
                </a>
              </div>

              {/* Address Box */}
              <div className="mt-4 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                <span className="block text-xs uppercase tracking-wider text-cream/50">
                  {policy.contact.addressLabel}
                </span>
                <address className="mt-1 block text-sm leading-relaxed text-cream/90 not-italic sm:text-base">
                  {policy.contact.addressValue}
                </address>
              </div>

              {/* Legal Handling Note */}
              <p className="mt-6 text-sm text-cream/70 italic border-t border-white/10 pt-4">
                {policy.contact.legalHandlingNote}
              </p>
            </article>

            {/* Document Bottom Stamp */}
            {/* <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-rule bg-paper-deep/50 px-6 py-5 text-center sm:flex-row sm:text-left">
              <div>
                <span className="font-mono text-xs font-bold tracking-widest text-ink uppercase">
                  {policy.footerNotice.label}
                </span>
                <p className="text-xs text-muted mt-0.5">
                  {policy.footerNotice.copyright}
                </p>
              </div>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-leaf-deep underline underline-offset-4 hover:text-leaf"
              >
                {locale === "bn" ? "যোগাযোগ পেজে যান" : "Visit Contact Page"} →
              </Link>
            </div> */}
          </div>
        </Container>
      </section>
    </>
  );
}
