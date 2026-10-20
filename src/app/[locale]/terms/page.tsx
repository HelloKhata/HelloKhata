import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/pages/LegalPage";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).meta.pages.terms;
  // Draft legal text must not be indexed until it has been reviewed.
  return { ...pageMetadata(locale, "/terms", m.title, m.description), robots: { index: false, follow: true } };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  return <LegalPage locale={locale} kind="terms" />;
}
