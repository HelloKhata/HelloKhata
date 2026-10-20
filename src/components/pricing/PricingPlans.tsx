import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { moduleEntitlements, pricingConfig, type Entitlement } from "@/content/pricing";
import { groupStatus } from "@/content/capabilities";
import { StatusBadge } from "@/components/ui/Section";
import { fmtTaka } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/** Configurable pricing cards. Prices and entitlements come from /content/pricing.ts + translations. */
export function PricingPlans({ locale, headingLevel = "h3" }: { locale: Locale; headingLevel?: "h2" | "h3" }) {
  const PlanHeading = headingLevel;
  const t = getDict(locale);
  const pr = t.pricing;
  return (
    <div>
      {pricingConfig.isPlaceholder && (
        <p className="mx-auto mb-10 flex max-w-3xl items-start gap-3 rounded-2xl bg-marigold-soft px-5 py-4 text-sm text-[#5c3f05]">
          <svg viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0" aria-hidden="true">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10 6v5M10 14v.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {pr.notice}
        </p>
      )}
      <ul className="grid gap-5 lg:grid-cols-3">
        {pricingConfig.plans.map((plan, i) => {
          const p = pr.plans[plan.key];
          const dark = plan.highlighted;
          return (
            <Reveal
              as="li"
              key={plan.key}
              delay={i * 0.08}
              className={cn(
                "relative flex flex-col rounded-[1.6rem] p-7 sm:p-8",
                dark ? "on-dark grain-dark bg-forest text-cream shadow-[var(--shadow-float)] lg:-my-4 lg:py-12" : "bg-white shadow-[var(--shadow-card)] ring-1 ring-ink/5",
              )}
            >
              <PlanHeading className="font-display text-3xl">{p.name}</PlanHeading>
              <p className={cn("mt-1", dark ? "text-cream/75" : "text-muted")}>{p.tagline}</p>
              <p className="mt-6">
                {plan.price === null ? (
                  <span className={cn("text-lg font-semibold", dark ? "text-marigold-soft" : "text-ink-soft")}>{pr.priceTbd}</span>
                ) : (
                  <>
                    <span className="font-latin text-4xl font-extrabold tracking-tight">{fmtTaka(plan.price, locale)}</span>
                    <span className={dark ? "text-cream/70" : "text-muted"}>{pr.perMonth}</span>
                  </>
                )}
              </p>
              <dl className={cn("mt-6 space-y-4 border-t pt-6 text-sm", dark ? "border-cream/15" : "border-ink/10")}>
                <div>
                  <dt className={cn("font-semibold", dark ? "text-leaf-glow" : "text-leaf-ink")}>{pr.suits}</dt>
                  <dd className="mt-1">{p.suits}</dd>
                </div>
                <div>
                  <dt className={cn("font-semibold", dark ? "text-leaf-glow" : "text-leaf-ink")}>{pr.includes}</dt>
                  <dd>
                    <ul className="mt-2 space-y-2">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-2.5">
                          <svg viewBox="0 0 20 20" className={cn("mt-0.5 size-4 shrink-0", dark ? "text-leaf-glow" : "text-leaf")} aria-hidden="true">
                            <path d="M4 10.5l3.6 3.4L16 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className={cn("font-semibold", dark ? "text-leaf-glow" : "text-leaf-ink")}>{pr.ai}</dt>
                    <dd className="mt-1">{p.ai}</dd>
                  </div>
                  <div>
                    <dt className={cn("font-semibold", dark ? "text-leaf-glow" : "text-leaf-ink")}>{pr.limits}</dt>
                    <dd className="mt-1">{p.limits}</dd>
                  </div>
                </div>
              </dl>
              <div className="mt-auto pt-8">
                <ButtonLink href={`/${locale}/get-started?plan=${plan.key}`} variant={dark ? "light" : "primary"} className="w-full" arrow>
                  {pr.cta}
                </ButtonLink>
              </div>
            </Reveal>
          );
        })}
      </ul>
      <p className="mt-12 text-center text-muted">
        <span className="font-semibold text-ink">{pr.helpTitle}</span> {pr.helpBody}{" "}
        <Link href={`/${locale}/contact`} className="font-semibold text-leaf-ink underline underline-offset-4">
          {pr.helpCta}
        </Link>
      </p>
    </div>
  );
}

/** Module × plan matrix, driven by moduleEntitlements and the capability registry. */
export function PricingModules({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const pm = t.pricingModules;
  const groups = ["core", "supershop", "online", "social"] as const;
  const label = (e: Entitlement) => (e === null ? pm.entitlement.tbd : pm.entitlement[e]);
  return (
    <div className="mt-16">
      <h3 className="font-display text-2xl sm:text-3xl">{pm.title}</h3>
      <p className="mt-2 max-w-2xl text-muted">{pm.lead}</p>
      <div className="mt-6 overflow-x-auto rounded-[1.4rem] bg-white shadow-[var(--shadow-card)] ring-1 ring-ink/5">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left">
              <th className="px-5 py-3 font-semibold">{pm.module}</th>
              {pricingConfig.plans.map((p) => (
                <th key={p.key} className="px-4 py-3 text-center font-semibold">
                  {t.pricing.plans[p.key].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g} className="border-t border-ink/5">
                <td className="px-5 py-3.5">
                  <span className="block font-semibold">{t.ecosystem.groups[g].name}</span>
                  <span className="mt-1 inline-block">
                    <StatusBadge status={groupStatus(g)} label={t.status[groupStatus(g)]} />
                  </span>
                </td>
                {pricingConfig.plans.map((p) => {
                  const e = moduleEntitlements[g][p.key];
                  return (
                    <td key={p.key} className={cn("px-4 py-3.5 text-center", e === "included" ? "font-semibold text-leaf-ink" : "text-muted")}>
                      {label(e)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
