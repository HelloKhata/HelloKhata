export const locales = ["bn", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bn";
export const localeCookie = "HK_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export const localeMeta: Record<Locale, { htmlLang: string; ogLocale: string; label: string; short: string }> = {
  bn: { htmlLang: "bn-BD", ogLocale: "bn_BD", label: "বাংলা", short: "বাং" },
  en: { htmlLang: "en", ogLocale: "en_US", label: "English", short: "EN" },
};

/** Swap the locale segment of a pathname, preserving the rest of the path. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const parts = pathname.split("/");
  if (isLocale(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
}
