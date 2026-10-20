import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[transform,background-color,box-shadow,color] duration-300 ease-[var(--ease-ink)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-leaf-deep text-white shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_10px_24px_-10px_rgb(21_128_61/0.7)] hover:bg-leaf-ink hover:shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_16px_30px_-12px_rgb(21_128_61/0.8)]",
  secondary: "bg-cream text-ink ring-1 ring-ink/15 hover:ring-ink/40 hover:bg-white",
  ghost: "text-ink hover:bg-ink/5",
  light: "bg-cream text-forest hover:bg-white",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base sm:text-[1.05rem]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string) {
  return cn(base, variants[variant], sizes[size], extra);
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  arrow,
  ...rest
}: { href: string; variant?: Variant; size?: Size; className?: string; children: React.ReactNode; arrow?: boolean } & Omit<
  React.ComponentProps<typeof Link>,
  "href" | "className"
>) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={cn("size-4 shrink-0 transition-transform duration-300 ease-[var(--ease-ink)] group-hover:translate-x-1 rtl:rotate-180", className)}
    >
      <path d="M3.5 10.2c3.9-.3 8.2-.1 12.4.1M11.6 5.4c1.6 1.7 3.1 3.2 4.6 4.8-1.6 1.5-3.1 3-4.7 4.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
