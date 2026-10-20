import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { channelStatus, moduleStatus, type ChannelId, type ModuleId } from "@/content/capabilities";
import { cn } from "@/lib/cn";
import { StatusBadge } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/** Grid of modules with their live status from /content/capabilities.ts. */
export function CapabilityGrid({ locale, modules, tone = "light", className }: { locale: Locale; modules: ModuleId[]; tone?: "light" | "dark"; className?: string }) {
  const t = getDict(locale);
  return (
    <div className={className}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((m, i) => {
          const st = moduleStatus[m];
          return (
            <Reveal
              as="li"
              key={m}
              delay={(i % 4) * 0.05}
              className={cn(
                "flex flex-col rounded-2xl p-5",
                tone === "light" ? "bg-white shadow-[var(--shadow-card)] ring-1 ring-ink/5" : "bg-white/[0.04] ring-1 ring-white/10",
                st === "planned" && (tone === "light" ? "bg-white/70" : ""),
              )}
            >
              <StatusBadge status={st} label={t.status[st]} tone={tone} />
              <h3 className={cn("mt-3 font-semibold", tone === "light" ? "text-ink" : "text-cream")}>{t.modules[m].name}</h3>
              <p className={cn("mt-1 text-sm", tone === "light" ? "text-muted" : "text-cream/65")}>{t.modules[m].desc}</p>
            </Reveal>
          );
        })}
      </ul>
      <p className={cn("mt-4 text-sm", tone === "light" ? "text-muted" : "text-cream/55")}>{t.status.legend}</p>
    </div>
  );
}

/** Compact inline list of channels with status (used beside demos). */
export function ChannelStatusList({ locale, channels, tone = "light" }: { locale: Locale; channels: ChannelId[]; tone?: "light" | "dark" }) {
  const t = getDict(locale);
  return (
    <ul className="flex flex-wrap gap-2">
      {channels.map((c) => (
        <li key={c} className={cn("inline-flex items-center gap-2 rounded-full py-1 pr-1 pl-3 text-sm", tone === "light" ? "bg-white ring-1 ring-ink/10" : "bg-white/5 ring-1 ring-white/10")}>
          <span className={tone === "light" ? "text-ink" : "text-cream/85"}>{t.channels[c].name}</span>
          <StatusBadge status={channelStatus[c]} label={t.status[channelStatus[c]]} tone={tone} />
        </li>
      ))}
    </ul>
  );
}
