"use client";

import { useI18n } from "@/i18n/client";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  const { t, locale } = useI18n();
  return (
    <Container className="flex min-h-[80svh] flex-col items-center justify-center pt-28 pb-20 text-center">
      <svg viewBox="0 0 200 120" className="w-56 text-ink" aria-hidden="true">
        <g filter="url(#hk-wobble)" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 30 L100 22 L180 30 L180 104 L100 96 L20 104 Z" fill="var(--color-cream)" />
          <path d="M100 22 V96" />
          <path d="M34 48 c10-2 20 1 30-1 M34 62 c8-1 16 1 24 0 M116 48 c10-2 20 1 30-1" stroke="#24346b" strokeWidth="1.4" />
          <path d="M120 66 q14 -14 28 0 M128 60 v-1 M140 60 v-1" stroke="var(--color-leaf-deep)" />
        </g>
      </svg>
      <h1 className="font-display mt-8 text-4xl text-balance sm:text-5xl">{t.notFound.title}</h1>
      <p className="mt-3 max-w-md text-lg text-muted">{t.notFound.body}</p>
      <ButtonLink href={`/${locale}`} className="mt-8" arrow>
        {t.common.backToHome}
      </ButtonLink>
    </Container>
  );
}
