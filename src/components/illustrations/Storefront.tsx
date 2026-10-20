import { Sketch } from "@/lib/sketch";
import type { CategorySlug } from "@/content/site";
import { categoryAccent } from "@/content/site";
import { P, Wash, Occlude, box, quad, palette as c } from "./ink";
import { OnlineSellerScene, SocialSellerScene, SuperShopFront } from "./CommerceScenes";

/**
 * One storefront per business type, sharing a structure (sign, awning, opening, counter)
 * but each with its own interior and accent colour. ViewBox 0 0 240 220.
 * Sign names are fictional shops drawn as part of the artwork.
 */
const signs: Record<"grocery" | "pharmacy" | "other", string> = {
  grocery: "মুদি বিতান",
  pharmacy: "সেবা ফার্মেসি",
  other: "নিত্য স্টোর",
};

export function Storefront({ slug, className }: { slug: CategorySlug; className?: string }) {
  if (slug === "supershop") return <SuperShopFront className={className} />;
  if (slug === "online-store") return <OnlineSellerScene className={className} />;
  if (slug === "f-commerce") return <SocialSellerScene className={className} />;
  const s = new Sketch(300 + slug.length * 17);
  const accent = categoryAccent[slug];
  const scallops = Array.from({ length: 8 }, (_, i) => `M${20 + i * 25} 74 q12.5 14 25 0`).join(" ");
  return (
    <svg viewBox="0 0 240 220" className={className} aria-hidden="true">
      <g filter="url(#hk-wobble)" className="text-ink">
        <Occlude d={box(14, 14, 212, 192)} />
        {/* Building and sign */}
        <P d={s.rect(14, 14, 212, 192, 0.6)} w={1.4} />
        <Wash d={box(22, 22, 196, 34)} fill={accent.tint} o={0.8} />
        <P d={s.rect(20, 20, 200, 38, 0.6)} w={1.4} />
        <text x="120" y="45" textAnchor="middle" fontSize="17" fill={c.cream} style={{ fontFamily: "var(--font-tiro)" }}>
          {signs[slug]}
        </text>
        {/* Striped awning */}
        <Wash d={quad([[16, 60], [224, 60], [224, 76], [16, 76]])} fill={accent.soft} o={0.9} />
        {Array.from({ length: 8 }, (_, i) => (
          <Wash key={i} d={box(20 + i * 25, 60, 12, 15)} fill={accent.tint} o={0.55} />
        ))}
        <P d={s.line(16, 60, 224, 60, 0.4)} w={1.3} />
        <path d={scallops} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        {/* Opening */}
        <P d={s.line(28, 88, 28, 206, 0.4)} w={1.3} />
        <P d={s.line(212, 88, 212, 206, 0.4)} w={1.3} />
        <Interior slug={slug} s={s} />
        {/* Counter */}
        <Occlude d={box(40, 160, 160, 46)} />
        <Wash d={box(42, 162, 156, 42)} fill={c.clay} o={0.35} />
        <P d={s.rect(40, 160, 160, 46, 0.5)} w={1.4} />
        <P d={s.hatch(150, 164, 46, 40, 6, 0.3)} w={0.6} o={0.5} />
        <P d={s.line(0, 206, 240, 206, 0.6)} w={1.4} />
      </g>
    </svg>
  );
}

function Interior({ slug, s }: { slug: CategorySlug; s: Sketch }) {
  switch (slug) {
    case "grocery":
      return (
        <g>
          {[110, 140].map((y) => (
            <P key={y} d={s.line(32, y, 208, y, 0.4)} w={1.1} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i}>
              <Wash d={box(40 + i * 24, 92, 14, 17)} fill={[c.rice, c.marigold, c.leafWash, c.vermilion][i % 4]} o={0.6} />
              <P d={s.rect(38 + i * 24, 90, 18, 20, 0.3)} w={0.9} />
            </g>
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <P key={i} d={s.rect(38 + i * 19, 124, 12, 16, 0.3)} w={0.8} />
          ))}
          <Wash d="M44 160 C42 148 46 142 52 140 L80 140 C86 142 88 148 86 160 Z" fill={c.rice} o={0.8} />
          <P d={s.curve([[44, 160], [42, 148], [46, 142], [52, 140], [80, 140], [86, 142], [88, 148], [86, 160]], 0.3)} w={1.1} />
          <P d={s.line(170, 160, 170, 132, 0.2)} w={1.2} />
          <P d={s.line(154, 134, 186, 134, 0.2)} w={1.2} />
          <P d={s.ellipse(156, 150, 8, 2.5, 0.2)} w={1} />
          <P d={s.ellipse(184, 150, 8, 2.5, 0.2)} w={1} />
        </g>
      );
    case "pharmacy":
      return (
        <g>
          <P d={s.rect(36, 88, 168, 70, 0.4)} w={1.2} />
          {[111, 134].map((y) => (
            <P key={y} d={s.line(36, y, 204, y, 0.3)} w={0.9} />
          ))}
          {Array.from({ length: 3 }, (_, r) =>
            Array.from({ length: 10 }, (_, i) => (
              <g key={`${r}-${i}`}>
                <Wash d={box(40 + i * 16, 93 + r * 23, 11, 15)} fill={[c.teal, c.cream, c.sky, c.marigold][(i + r) % 4]} o={0.6} />
                <P d={s.rect(40 + i * 16, 93 + r * 23, 11, 15, 0.2, 1)} w={0.7} />
              </g>
            )),
          )}
          <Wash d="M112 168h16v-10h10v-16h-10v-10h-16v10h-10v16h10z" fill={c.leaf} o={0.9} />
          <P d="M112 168h16v-10h10v-16h-10v-10h-16v10h-10v16h10z" w={1.1} />
        </g>
      );
    default:
      return (
        <g>
          {[112, 140].map((y) => (
            <P key={y} d={s.line(32, y, 208, y, 0.4)} w={1.1} />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <g key={i}>
              <Wash d={box(42 + i * 32, 92, 20, 19)} fill={[c.sky, c.vermilion, c.marigold, c.leafWash, c.plum][i]} o={0.6} />
              <P d={s.rect(40 + i * 32, 90, 24, 22, 0.3)} w={1} />
              <P d={s.ellipse(52 + i * 32, 90, 12, 2.5, 0.2)} w={0.8} />
            </g>
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              <Wash d={box(40 + i * 21, 120, 4, 19)} fill={[c.vermilion, c.sky, c.marigold][i % 3]} o={0.8} />
              <P d={s.rect(40 + i * 21, 120, 4, 19, 0.2, 1)} w={0.7} />
              <P d={s.rect(48 + i * 21, 126, 9, 13, 0.2, 1)} w={0.7} />
            </g>
          ))}
        </g>
      );
  }
}
