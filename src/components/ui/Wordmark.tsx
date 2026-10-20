import { cn } from "@/lib/cn";

/**
 * HelloKhata wordmark, set in type.
 * BRAND: replace with the official logo SVG (e.g. /public/brand/hellokhata-wordmark.svg)
 * once it is supplied — keep the same component API so every usage updates at once.
 */
export function Wordmark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("font-latin inline-flex items-baseline text-[1.35rem] font-extrabold tracking-[-0.02em]", className)} translate="no">
      <span className={tone === "dark" ? "text-ink" : "text-cream"}>Hello</span>
      <span className={tone === "dark" ? "text-leaf-deep" : "text-leaf-glow"}>Khata</span>
    </span>
  );
}
