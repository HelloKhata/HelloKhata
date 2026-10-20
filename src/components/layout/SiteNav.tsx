"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { categorySlugs, featureSlugs } from "@/content/site";
import { cn } from "@/lib/cn";
import { Wordmark } from "@/components/ui/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";

type MenuItem = { href: string; label: string; desc?: string };
type MenuGroup = { key: string; label: string; items: MenuItem[]; footer?: MenuItem; wide?: boolean };

function useNavModel() {
  const { locale, t } = useI18n();
  const p = (path: string) => `/${locale}${path}`;
  const groups: MenuGroup[] = [
    {
      key: "features",
      label: t.nav.features,
      wide: true,
      items: featureSlugs.map((s) => ({ href: p(`/features/${s}`), label: t.features.items[s].name, desc: t.features.items[s].short })),
      footer: { href: p("/features"), label: t.nav.allFeatures },
    },
    {
      key: "solutions",
      label: t.nav.solutions,
      wide: true,
      items: categorySlugs.map((s) => ({ href: p(`/solutions/${s}`), label: t.solutions.items[s].name, desc: t.solutions.items[s].short })),
      footer: { href: p("/solutions"), label: t.nav.allSolutions },
    },
    {
      key: "resources",
      label: t.nav.resources,
      items: [
        { href: p("/resources"), label: t.nav.help, desc: t.nav.helpDesc },
        { href: p("/how-it-works"), label: t.nav.howItWorks, desc: t.nav.howItWorksDesc },
      ],
    },
    {
      key: "company",
      label: t.nav.company,
      items: [
        { href: p("/about"), label: t.nav.about, desc: t.nav.aboutDesc },
        { href: p("/contact"), label: t.nav.contact, desc: t.nav.contactDesc },
      ],
    },
  ];
  return { groups, pricing: { href: p("/pricing"), label: t.nav.pricing }, p, t, locale };
}

export function SiteNav() {
  const { groups, pricing, p, t } = useNavModel();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus whenever the route changes.
  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const trigger = navRef.current?.querySelector<HTMLButtonElement>(`[data-menu-trigger="${open}"]`);
        setOpen(null);
        trigger?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const hoverOpen = useCallback((key: string | null) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (key) setOpen(key);
    else closeTimer.current = setTimeout(() => setOpen(null), 140);
  }, []);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled || open ? "bg-paper/85 shadow-[0_1px_0_rgb(23_34_28/0.08)] backdrop-blur-md" : "bg-transparent",
        )}
      >
        <nav aria-label={t.nav.label} className={cn("mx-auto flex max-w-[1320px] items-center gap-6 px-5 transition-[height] duration-500 sm:px-8", scrolled ? "h-16" : "h-20")}>
          <Link href={p("")} className="shrink-0 rounded-md" aria-label="HelloKhata">
            <Wordmark />
          </Link>

          <ul className="ml-4 hidden items-center gap-1 lg:flex">
            {groups.map((g) => (
              <li key={g.key} className="relative" onPointerEnter={(e) => e.pointerType === "mouse" && hoverOpen(g.key)} onPointerLeave={(e) => e.pointerType === "mouse" && hoverOpen(null)}>
                <DropdownTrigger group={g} open={open === g.key} onToggle={() => setOpen((o) => (o === g.key ? null : g.key))} active={g.items.some((i) => isActive(i.href)) || (!!g.footer && isActive(g.footer.href))} />
                <AnimatePresence>{open === g.key && <DropdownPanel group={g} />}</AnimatePresence>
              </li>
            ))}
            <li>
              <NavLink href={pricing.href} active={isActive(pricing.href)}>
                {pricing.label}
              </NavLink> 
            </li>
          </ul>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <Link href={p("/sign-in")} className="rounded-full px-3 py-2 text-[0.95rem] font-semibold text-ink-soft transition-colors hover:text-ink">
              {t.common.signIn}
            </Link>
            <ButtonLink href={p("/get-started")} arrow>
              {t.common.getStarted}
            </ButtonLink>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <ButtonLink href={p("/get-started")} className="hidden h-10 px-4 text-sm sm:inline-flex">
              {t.common.getStarted}
            </ButtonLink>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex size-11 items-center justify-center rounded-full bg-ink/[0.06] text-ink ring-1 ring-ink/10"
              aria-label={t.common.openMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path d="M4 7.5c5.5-.6 10.6-.4 16 0M4 12.2c4.2-.3 8.1-.2 12 .1M4 16.8c5.4-.5 10.8-.4 16 0" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>
      </header>
      <AnimatePresence>{mobileOpen && <MobileMenu groups={groups} pricing={pricing} onClose={() => setMobileOpen(false)} />}</AnimatePresence>
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className="relative block rounded-full px-3.5 py-2 text-[0.95rem] font-semibold text-ink-soft transition-colors hover:text-ink">
      {children}
      {active && <NavUnderline />}
    </Link>
  );
}

function NavUnderline() {
  return (
    <motion.svg layoutId="nav-underline" viewBox="0 0 40 6" className="absolute inset-x-3 -bottom-0.5 h-1.5 w-[calc(100%-1.5rem)]" preserveAspectRatio="none" aria-hidden="true">
      <path d="M1 4C10 1.8 25 5.5 39 2.6" fill="none" stroke="var(--color-leaf)" strokeWidth="2.4" strokeLinecap="round" />
    </motion.svg>
  );
}

function DropdownTrigger({ group, open, onToggle, active }: { group: MenuGroup; open: boolean; onToggle: () => void; active: boolean }) {
  const id = `menu-${group.key}`;
  return (
    <button
      type="button"
      data-menu-trigger={group.key}
      aria-expanded={open}
      aria-controls={id}
      onClick={onToggle}
      className={cn("relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition-colors", open ? "text-ink" : "text-ink-soft hover:text-ink")}
    >
      {group.label}
      <svg viewBox="0 0 12 12" className={cn("size-3 transition-transform duration-300", open && "rotate-180")} aria-hidden="true">
        <path d="M2.5 4.6c1.2 1.1 2.3 2.2 3.5 3.2 1.2-1 2.3-2.1 3.5-3.3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {active && <NavUnderline />}
    </button>
  );
}

function DropdownPanel({ group }: { group: MenuGroup }) {
  return (
    <motion.div
      id={`menu-${group.key}`}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.15 } }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn("absolute left-1/2 top-full z-10 -translate-x-1/2 pt-3", group.wide ? "w-[640px]" : "w-[320px]")}
    >
      <div className="paper-cream overflow-hidden rounded-[1.25rem] p-2 shadow-[var(--shadow-float)] ring-1 ring-ink/10">
        <ul className={cn("grid gap-1", group.wide && "grid-cols-2")}>
          {group.items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group/item block rounded-xl px-4 py-3 transition-colors hover:bg-leaf-soft/60 focus-visible:bg-leaf-soft/60">
                <span className="block font-semibold text-ink">{item.label}</span>
                {item.desc && <span className="mt-0.5 block text-sm leading-snug text-muted">{item.desc}</span>}
              </Link>
            </li>
          ))}
        </ul>
        {group.footer && (
          <Link href={group.footer.href} className="mt-1 flex items-center justify-between rounded-xl bg-ink/[0.04] px-4 py-3 text-sm font-semibold text-leaf-ink transition-colors hover:bg-ink/[0.07]">
            {group.footer.label}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function MobileMenu({ groups, pricing, onClose }: { groups: MenuGroup[]; pricing: MenuItem; onClose: () => void }) {
  const { t, locale } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const titleId = useId();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="paper fixed inset-0 z-[60] flex flex-col overflow-y-auto lg:hidden"
      initial={{ clipPath: "circle(0% at calc(100% - 2.6rem) 2.5rem)" }}
      animate={{ clipPath: "circle(150% at calc(100% - 2.6rem) 2.5rem)" }}
      exit={{ clipPath: "circle(0% at calc(100% - 2.6rem) 2.5rem)", transition: { duration: 0.35 } }}
      transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
    >
      <div className="flex h-20 items-center justify-between px-5 sm:px-8">
        <Link href={`/${locale}`} aria-label="HelloKhata">
          <Wordmark />
        </Link>
        <h2 id={titleId} className="sr-only">
          {t.common.menu}
        </h2>
        <button type="button" onClick={onClose} aria-label={t.common.closeMenu} className="inline-flex size-11 items-center justify-center rounded-full bg-ink/[0.06] ring-1 ring-ink/10">
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
            <path d="M6 6.3c4 3.6 7.9 7.5 11.8 11.4M17.7 6.2c-3.8 4-7.7 7.8-11.6 11.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-5 pb-8 sm:px-8">
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {groups.map((g, i) => (
            <motion.li key={g.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05 }}>
              <button
                type="button"
                onClick={() => setExpanded((e) => (e === g.key ? null : g.key))}
                aria-expanded={expanded === g.key}
                aria-controls={`m-${g.key}`}
                className="font-display flex w-full items-center justify-between py-4 text-left text-2xl"
              >
                {g.label}
                <span className={cn("text-leaf-deep transition-transform duration-300", expanded === g.key && "rotate-45")} aria-hidden="true">
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {expanded === g.key && (
                  <motion.ul id={`m-${g.key}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    {[...g.items, ...(g.footer ? [g.footer] : [])].map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="block rounded-lg py-2.5 pl-1 text-[1.05rem] text-ink-soft">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li className="h-3" aria-hidden="true" />
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
          <motion.li initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
            <Link href={pricing.href} className="font-display block py-4 text-2xl">
              {pricing.label}
            </Link>
          </motion.li>
        </ul>

        <div className="mt-8 flex flex-col gap-3">
          <ButtonLink href={`/${locale}/get-started`} size="lg" arrow>
            {t.common.getStarted}
          </ButtonLink>
          <ButtonLink href={`/${locale}/sign-in`} variant="secondary" size="lg">
            {t.common.signIn}
          </ButtonLink>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <span className="text-sm text-muted">{t.common.language}</span>
          <LanguageSwitcher />
        </div>
      </div>
    </motion.div>
  );
}
