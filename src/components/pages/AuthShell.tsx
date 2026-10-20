import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Section";
import { Storefront } from "@/components/illustrations/Storefront";
import { InkStroke } from "@/components/ui/Reveal";

/** Split layout for sign-in / sign-up: form on paper, illustrated brand panel on deep green. */
export function AuthShell({ locale, title, lead, children }: { locale: Locale; title: string; lead: string; children: React.ReactNode }) {
  const t = getDict(locale);
  return (
    <Container className="grid gap-10 pt-28 pb-20 sm:pt-32 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-16">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="font-display hk-rise text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-3 text-lg text-muted">{lead}</p>
        <div className="mt-10">{children}</div>
      </div>
      <aside className="on-dark grain-dark relative hidden overflow-hidden rounded-[2rem] bg-forest p-10 text-cream lg:sticky lg:top-28 lg:block" aria-hidden="true">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(74_222_128/0.25),transparent)]" />
        <p className="font-display relative text-4xl leading-snug">{t.auth.asideTitle}</p>
        <InkStroke viewBox="0 0 300 20" d="M3 12 C 60 4, 120 18, 180 9 S 260 7, 297 11" className="relative mt-2 h-4 w-48" stroke="var(--color-leaf-glow)" width={4} />
        <p className="relative mt-4 text-cream/75">{t.auth.asideBody}</p>
        <div className="relative mt-10 rounded-[1.4rem] bg-paper p-4">
          <Storefront slug="grocery" className="w-full" />
        </div>
      </aside>
    </Container>
  );
}
