import type { Locale } from "@/i18n/config";

const numberLocale: Record<Locale, string> = { bn: "bn-BD", en: "en-IN" };

/** Numbers use Bengali digits in Bangla and lakh-style grouping in both languages. */
export function fmtNumber(value: number, locale: Locale, fractionDigits = 0): string {
  return new Intl.NumberFormat(numberLocale[locale], {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Digits only, no grouping — for years and reference numbers. */
export function fmtDigits(value: number, locale: Locale): string {
  return new Intl.NumberFormat(numberLocale[locale], { useGrouping: false }).format(value);
}

export function fmtTaka(value: number, locale: Locale): string {
  return `৳${fmtNumber(value, locale)}`;
}

export function fmtPercent(value: number, locale: Locale): string {
  return `${fmtNumber(value, locale, Number.isInteger(value) ? 0 : 1)}%`;
}

/** Replace {name} placeholders in a translated string. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

/** Keep an em dash attached to the word before it, so a line never starts with "—". */
export function noOrphanDash(text: string): string {
  return text.replace(/s?—/g, "⁠—");
}
