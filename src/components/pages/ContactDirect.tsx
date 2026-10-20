import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { contactInfo, localDigits } from "@/lib/site";

const icons = {
  address: "M10 18s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10zM10 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  phone: "M5 3h3l1.5 4-2 1.2a10 10 0 0 0 4.3 4.3L13 10.5l4 1.5v3a2 2 0 0 1-2 2A13 13 0 0 1 3 5a2 2 0 0 1 2-2z",
  whatsapp: "M10 2.5a7.5 7.5 0 0 0-6.4 11.4L2.5 17.5l3.7-1A7.5 7.5 0 1 0 10 2.5zM7.3 6.6c.3-.2.7-.2.9.2l.7 1.5c.1.3 0 .6-.2.8l-.4.4c.5 1 1.3 1.8 2.3 2.3l.4-.4c.2-.2.5-.3.8-.2l1.5.7c.4.2.4.6.2.9-.5.8-1.4 1.2-2.3.9A7 7 0 0 1 6.5 8.9c-.3-.9.1-1.8.8-2.3z",
  email: "M3 5h14v10H3zM3 5l7 6 7-6",
} as const;

/** The official address, phone, WhatsApp and email, as tappable links. */
export function ContactDirect({ locale }: { locale: Locale }) {
  const d = getDict(locale).contact.direct;
  const rows = [
    { key: "phone", label: d.phone, value: localDigits(contactInfo.phone.display, locale), href: contactInfo.phone.href },
    { key: "whatsapp", label: d.whatsapp, value: localDigits(contactInfo.whatsapp.display, locale), href: contactInfo.whatsapp.href, external: true },
    { key: "email", label: d.email, value: contactInfo.email.display, href: contactInfo.email.href, latin: true },
  ] as const;
  return (
    <div className="rounded-[1.6rem] bg-forest p-7 text-cream shadow-[var(--shadow-card)] sm:p-8">
      <h2 className="font-display text-2xl">{d.title}</h2>
      <p className="mt-2 text-sm text-cream/70">{d.lead}</p>
      <ul className="mt-6 space-y-3">
        {rows.map((r) => (
          <li key={r.key}>
            <a
              href={r.href}
              {...("external" in r ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-4 rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-white/10 transition-colors hover:bg-white/[0.11] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-glow"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-leaf-glow/15 text-leaf-glow">
                <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
                  <path d={icons[r.key]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-cream/60">{r.label}</span>
                <span className={`block truncate font-semibold ${"latin" in r ? "font-latin" : ""}`} dir="ltr">
                  {r.value}
                </span>
              </span>
              <span className="ml-auto text-cream/40 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex gap-4 rounded-2xl border border-white/10 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-leaf-glow/15 text-leaf-glow">
          <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
            <path d={icons.address} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-xs text-cream/60">{d.address}</p>
          <address className="mt-0.5 leading-relaxed font-semibold not-italic">{contactInfo.address[locale]}</address>
          <a href={contactInfo.address.mapHref} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-leaf-glow underline-offset-4 hover:underline">
            {d.map} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
