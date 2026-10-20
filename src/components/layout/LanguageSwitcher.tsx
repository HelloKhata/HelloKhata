"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeCookie, localeMeta, switchLocalePath, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";

function remember(locale: Locale) {
  document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/** Segmented বাংলা / English switch. Keeps the visitor on the same page. */
export function LanguageSwitcher({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() || `/${locale}`;
  const options: Locale[] = ["bn", "en"];

  return (
    <div
      role="group"
      aria-label={t.common.language}
      className={cn(
        "relative inline-flex items-center rounded-full p-1 text-sm font-semibold",
        tone === "dark" ? "bg-ink/[0.06] ring-1 ring-ink/10" : "bg-white/10 ring-1 ring-white/15",
        className,
      )}
    >
      {options.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={switchLocalePath(pathname, l)}
            hrefLang={localeMeta[l].htmlLang}
            lang={localeMeta[l].htmlLang}
            aria-current={active ? "true" : undefined}
            scroll={false}
            onClick={() => remember(l)}
            className={cn(
              "relative rounded-full px-3 py-1.5 leading-none transition-colors duration-300",
              l === "bn" ? "font-sans" : "font-latin",
              active
                ? tone === "dark"
                  ? "bg-cream text-ink shadow-[0_1px_2px_rgb(23_34_28/0.15)]"
                  : "bg-cream text-forest"
                : tone === "dark"
                  ? "text-muted hover:text-ink"
                  : "text-cream/70 hover:text-cream",
            )}
          >
            {localeMeta[l].label}
          </Link>
        );
      })}
    </div>
  );
}
