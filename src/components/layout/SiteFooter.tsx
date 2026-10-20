import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { categorySlugs, featureSlugs } from "@/content/site";
import { fmtDigits, interpolate } from "@/lib/format";
import { contactInfo, localDigits, socialLinks } from "@/lib/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { Container } from "@/components/ui/Section";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Skyline } from "@/components/illustrations/Skyline";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const p = (path: string) => `/${locale}${path}`;

  const columns = [
    {
      title: t.footer.product,
      links: [
        ...featureSlugs.map((s) => ({ href: p(`/features/${s}`), label: t.features.items[s].name })),
        { href: p("/pricing"), label: t.nav.pricing },
      ],
    },
    {
      title: t.footer.solutions,
      links: categorySlugs.map((s) => ({ href: p(`/solutions/${s}`), label: t.solutions.items[s].name })),
    },
    {
      title: t.footer.company,
      links: [
        { href: p("/about"), label: t.nav.about },
        { href: p("/how-it-works"), label: t.nav.howItWorks },
        { href: p("/contact"), label: t.nav.contact },
      ],
    },
    {
      title: t.footer.help,
      links: [
        { href: p("/resources"), label: t.nav.help },
        { href: p("/privacy"), label: t.footer.privacy },
        { href: p("/terms"), label: t.footer.terms },
      ],
    },
  ];

  return (
    <footer className="on-dark relative mt-0 bg-forest text-cream">
      {/* Torn paper edge: the page above "tears" into the dark footer */}
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="absolute inset-x-0 -top-px h-6 w-full text-paper sm:h-10" aria-hidden="true">
        <path
          d="M0 0h1440v14c-22 6-40-3-62 4s-36 9-58 2-41 8-64 5-33-10-57-4-44 12-66 6-35-8-60-1-42 10-63 4-37-9-60-3-45 11-67 5-34-7-56 0-43 9-66 3-38-8-61-1-41 10-63 4-36-9-59-2-44 10-66 4-35-8-58 0-42 9-64 3-39-9-61-2-43 11-66 5-36-8-58-1-43 9-65 3-37-8-60 0-41 9-63 3-37-9-59-2-44 10-66 4V0Z"
          fill="currentColor"
        />
      </svg>
      <div className="grain-dark pt-20 pb-10 sm:pt-24">
        <Skyline className="pointer-events-none absolute inset-x-0 top-10 h-28 w-full text-cream/[0.07] sm:h-40" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_2.4fr]">
            <div>
              <Wordmark tone="light" className="text-[1.7rem]" />
              <p className="mt-4 max-w-xs text-cream/70">{t.footer.tagline}</p>
              <address className="mt-6 space-y-2 text-sm text-cream/75 not-italic">
                <p className="font-semibold text-leaf-glow">{t.footer.contact}</p>
                <p className="max-w-xs leading-relaxed">{contactInfo.address[locale]}</p>
                <p>
                  {t.contact.direct.phone}:{" "}
                  <a href={contactInfo.phone.href} className="font-semibold text-cream hover:text-leaf-glow">
                    {localDigits(contactInfo.phone.display, locale)}
                  </a>
                </p>
                <p>
                  {t.contact.direct.whatsapp}:{" "}
                  <a href={contactInfo.whatsapp.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-cream hover:text-leaf-glow">
                    {localDigits(contactInfo.whatsapp.display, locale)}
                  </a>
                </p>
                <p>
                  <a href={contactInfo.email.href} className="font-semibold text-cream hover:text-leaf-glow">
                    {contactInfo.email.display}
                  </a>
                </p>
              </address>
              <div className="mt-8">
                <p className="mb-2 text-sm text-cream/60">{t.footer.languageLabel}</p>
                <LanguageSwitcher tone="light" />
              </div>
              {socialLinks.length > 0 && (
                <ul className="mt-8 flex gap-3">
                  {socialLinks.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} rel="noopener noreferrer" target="_blank" className="text-sm text-cream/70 hover:text-cream">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {columns.map((c) => (
                <nav key={c.title} aria-label={c.title}>
                  <h2 className="text-sm font-semibold text-leaf-glow">{c.title}</h2>
                  <ul className="mt-4 space-y-2.5">
                    {c.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-[0.95rem] text-cream/75 transition-colors hover:text-cream">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>
          <div className="mt-16 flex flex-col gap-4 border-t border-cream/10 pt-6 text-sm text-cream/55 sm:flex-row sm:items-center sm:justify-between">
            <p>{interpolate(t.footer.rights, { year: fmtDigits(new Date().getFullYear(), locale) })}</p>
            <p className="font-hand text-base text-cream/60" lang="bn">
              আপনার ব্যবসা, আপনার ভাষায়।
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
