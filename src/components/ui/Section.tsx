import { cn } from "@/lib/cn";
import { noOrphanDash } from "@/lib/format";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-5 sm:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children, tone = "leaf", className }: { children: React.ReactNode; tone?: "leaf" | "light"; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-sm font-semibold tracking-wide",
        tone === "leaf" ? "text-leaf-ink" : "text-leaf-glow",
        className,
      )}
    >
      <svg viewBox="0 0 28 8" className="h-2 w-7" aria-hidden="true">
        <path d="M1 5.2C6 2.6 10 6.6 15 4.1S23 2.2 27 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "dark",
  className,
  as: Tag = "h2",
  id,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  as?: "h1" | "h2";
  id?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow tone={tone === "dark" ? "leaf" : "light"}>{eyebrow}</Eyebrow>}
      <Tag
        id={id}
        className={cn(
          "font-display mt-4 text-balance",
          Tag === "h1" ? "text-[2.4rem] sm:text-6xl" : "text-[2rem] sm:text-5xl",
          tone === "dark" ? "text-ink" : "text-cream",
        )}
      >
        {noOrphanDash(title)}
      </Tag>
      {lead && <p className={cn("mt-5 text-lg text-pretty sm:text-xl", tone === "dark" ? "text-muted" : "text-cream/75")}>{lead}</p>}
    </div>
  );
}

export function SampleBadge({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "light" ? "bg-marigold-soft text-[#6b4a07]" : "bg-white/10 text-marigold-soft",
      )}
    >
      <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
        <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 3.6v3M6 8.2v.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {children}
    </span>
  );
}

export function StatusBadge({ status, label, tone = "light" }: { status: "available" | "beta" | "planned"; label: string; tone?: "light" | "dark" }) {
  const styles = {
    light: { available: "bg-leaf-soft text-leaf-ink", beta: "bg-[#dbe6fe] text-[#1d4ed8]", planned: "bg-ink/5 text-muted ring-1 ring-ink/10" },
    dark: { available: "bg-leaf/25 text-leaf-glow", beta: "bg-sky/25 text-[#bcd2fb]", planned: "bg-white/5 text-cream/70 ring-1 ring-white/15" },
  }[tone];
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", styles[status])}>
      <span className={cn("size-1.5 rounded-full", status === "available" ? "bg-leaf" : status === "beta" ? "bg-sky" : "border border-current")} />
      {label}
    </span>
  );
}
