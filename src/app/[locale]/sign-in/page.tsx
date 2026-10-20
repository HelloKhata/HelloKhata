import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { AuthShell } from "@/components/pages/AuthShell";
import { SignInForm } from "@/components/forms/AuthForms";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).meta.pages.signIn;
  return { ...pageMetadata(locale, "/sign-in", m.title, m.description), robots: { index: false, follow: true } };
}

export default async function SignInPage({ params }: Props) {
  const { locale } = await params;
  const t = getDict(locale);
  return (
    <AuthShell locale={locale} title={t.auth.signIn.title} lead={t.auth.signIn.lead}>
      <SignInForm />
    </AuthShell>
  );
}
