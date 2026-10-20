import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { categorySlugs, type CategorySlug } from "@/content/site";
import { AuthShell } from "@/components/pages/AuthShell";
import { SignUpWizard } from "@/components/forms/AuthForms";
import { Storefront } from "@/components/illustrations/Storefront";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).meta.pages.getStarted;
  return pageMetadata(locale, "/get-started", m.title, m.description);
}

export default async function GetStartedPage({ params }: Props) {
  const { locale } = await params;
  const t = getDict(locale);
  const arts = Object.fromEntries(categorySlugs.map((s) => [s, <Storefront key={s} slug={s} className="w-full" />])) as Record<CategorySlug, React.ReactNode>;
  return (
    <AuthShell locale={locale} title={t.auth.signUp.title} lead={t.auth.signUp.lead}>
      <Suspense>
        <SignUpWizard arts={arts} />
      </Suspense>
    </AuthShell>
  );
}
