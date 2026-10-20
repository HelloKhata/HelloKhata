import { Sketch } from "@/lib/sketch";
import { P, Wash, Occlude, box, quad, palette as c } from "./ink";

/**
 * Hand-drawn scenes for the three growth solutions. Same 240×220 frame as the storefronts,
 * but each with its own composition: a two-storey super shop, a seller's packing desk with a
 * laptop storefront, and a social seller answering chats beside a clothes rail.
 */

const amber = "#D08A2E";

export function SuperShopFront({ className }: { className?: string }) {
  const s = new Sketch(611);
  return (
    <svg viewBox="0 0 240 220" className={className} aria-hidden="true">
      <g filter="url(#hk-wobble)" className="text-ink">
        <Occlude d={box(6, 10, 228, 196)} />
        {/* Two-storey building */}
        <P d={s.rect(6, 10, 228, 196, 0.6)} w={1.5} />
        <P d={s.line(6, 74, 234, 74, 0.4)} w={1.2} />
        {[22, 76, 130, 184].map((x) => (
          <g key={x}>
            <Wash d={box(x + 2, 46, 32, 20)} fill={c.sky} o={0.3} />
            <P d={s.rect(x, 44, 36, 24, 0.3)} w={1} />
            <P d={s.line(x + 18, 45, x + 18, 67, 0.2, 1)} w={0.7} />
          </g>
        ))}
        {/* Wide signboard */}
        <Wash d={box(14, 16, 212, 24)} fill={amber} o={0.85} />
        <P d={s.rect(12, 14, 216, 28, 0.5)} w={1.4} />
        <text x="120" y="34" textAnchor="middle" fontSize="14" fill={c.cream} style={{ fontFamily: "var(--font-tiro)" }}>
          নতুন বাজার সুপারশপ
        </text>
        {/* Glass frontage with aisles visible */}
        <Wash d={box(14, 82, 212, 92)} fill="#DCEBEC" o={0.45} />
        <P d={s.rect(14, 80, 212, 96, 0.5)} w={1.3} />
        {[60, 106, 152].map((x) => (
          <P key={x} d={s.line(x, 80, x, 176, 0.3, 1)} w={0.8} />
        ))}
        {/* Aisle shelving in perspective */}
        {[0, 1, 2, 3].map((i) => {
          const x = 22 + i * 52;
          return (
            <g key={i}>
              {[94, 110, 126].map((y, k) => (
                <g key={y}>
                  <P d={s.line(x, y, x + 32, y, 0.2, 1)} w={0.8} />
                  {Array.from({ length: 4 }, (_, j) => (
                    <Wash key={j} d={box(x + 2 + j * 8, y - 8, 6, 7)} fill={[c.marigold, c.leafWash, c.vermilion, c.sky][(i + j + k) % 4]} o={0.7} />
                  ))}
                </g>
              ))}
            </g>
          );
        })}
        {/* Two checkout counters with staff */}
        {[34, 140].map((x, i) => (
          <g key={x}>
            <Occlude d={box(x, 142, 64, 30)} />
            <Wash d={box(x + 2, 144, 60, 26)} fill={c.clay} o={0.4} />
            <P d={s.rect(x, 142, 64, 30, 0.4)} w={1.2} />
            <P d={s.rect(x + 40, 132, 16, 10, 0.2)} w={1} />
            <P d={s.ellipse(x + 20, 128, 6, 6, 0.2)} w={1.1} />
            <Wash d={quad([[x + 12, 142], [x + 28, 142], [x + 26, 134], [x + 14, 134]])} fill={i ? c.leafWash : c.sky} o={0.8} />
          </g>
        ))}
        {/* Trolleys outside */}
        {[0, 1].map((i) => {
          const x = 104 + i * 14;
          return (
            <g key={i}>
              <P d={s.poly([[x, 184], [x + 12, 184], [x + 10, 194], [x + 2, 194]], true, 0.2)} w={1} />
              <P d={s.ellipse(x + 3, 198, 1.8, 1.8, 0.1)} w={0.9} />
              <P d={s.ellipse(x + 9, 198, 1.8, 1.8, 0.1)} w={0.9} />
            </g>
          );
        })}
        <P d={s.line(0, 206, 240, 206, 0.6)} w={1.4} />
      </g>
    </svg>
  );
}

export function OnlineSellerScene({ className }: { className?: string }) {
  const s = new Sketch(733);
  return (
    <svg viewBox="0 0 240 220" className={className} aria-hidden="true">
      <g filter="url(#hk-wobble)" className="text-ink">
        {/* Pegboard with handmade bags */}
        <Wash d={box(18, 14, 110, 70)} fill={c.rice} o={0.5} />
        <P d={s.rect(18, 14, 110, 70, 0.5)} w={1.2} />
        {[34, 66, 98].map((x, i) => (
          <g key={x}>
            <P d={s.curve([[x - 6, 36], [x, 24], [x + 6, 36]], 0.2)} w={1} />
            <Wash d={quad([[x - 12, 36], [x + 12, 36], [x + 14, 64], [x - 14, 64]])} fill={[c.vermilion, c.marigold, c.leafWash][i]} o={0.7} />
            <P d={s.poly([[x - 12, 36], [x + 12, 36], [x + 14, 64], [x - 14, 64]], true, 0.3)} w={1.1} />
          </g>
        ))}
        {/* Desk */}
        <Wash d={box(10, 150, 220, 10)} fill={c.clay} o={0.6} />
        <P d={s.rect(10, 148, 220, 12, 0.5)} w={1.4} />
        <P d={s.line(22, 160, 20, 206, 0.4)} w={1.3} />
        <P d={s.line(218, 160, 220, 206, 0.4)} w={1.3} />
        {/* Laptop showing a storefront */}
        <path d={box(116, 72, 102, 66)} fill="#fff" />
        <P d={s.rect(116, 72, 102, 66, 0.3)} w={1.4} />
        <Wash d={box(120, 76, 94, 14)} fill="#2563EB" o={0.75} />
        <P d={s.line(124, 83, 150, 83, 0.1, 1)} w={2} c={c.cream} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={box(122 + i * 31, 96, 26, 22)} fill={[c.vermilion, c.marigold, c.leafWash][i]} opacity="0.55" />
            <P d={s.line(122 + i * 31, 124, 140 + i * 31, 124, 0.1, 1)} w={1.4} o={0.6} />
            <P d={s.line(122 + i * 31, 129, 134 + i * 31, 129, 0.1, 1)} w={1.4} c="#2563EB" />
          </g>
        ))}
        <P d={s.poly([[108, 138], [226, 138], [232, 148], [102, 148]], true, 0.3)} w={1.4} />
        {/* Seller */}
        <Occlude d="M44 148 C46 118 58 106 72 104 C86 106 98 118 100 148 Z" />
        <Wash d="M44 148 C46 118 58 106 72 104 C86 106 98 118 100 148 Z" fill={c.plum} o={0.45} />
        <P d={s.curve([[44, 148], [46, 118], [58, 106], [72, 104], [86, 106], [98, 118], [100, 148]], 0.4)} w={1.4} />
        <Wash d={s.ellipse(72, 88, 14, 15, 0.2)} fill={c.clay} o={0.5} />
        <P d={s.ellipse(72, 88, 14, 15, 0.4)} w={1.3} />
        <Wash d="M56 86 C56 66 88 66 88 86 C84 76 62 76 56 86 Z" fill={c.ink} o={0.75} />
        <P d={s.curve([[66, 92], [72, 95], [78, 92]], 0.2)} w={1} />
        <P d={s.curve([[96, 126], [106, 134], [112, 140]], 0.3)} w={1.3} />
        {/* Parcels */}
        {[[22, 120, 26, 28], [50, 128, 22, 20]].map(([x, y, w, h], i) => (
          <g key={i}>
            <Wash d={box(x, y, w, h)} fill={c.rice} o={0.9} />
            <P d={s.rect(x, y, w, h, 0.3)} w={1.1} />
            <P d={s.line(x + w / 2, y, x + w / 2, y + h, 0.1, 1)} w={1.6} c={amber} />
          </g>
        ))}
        <P d={s.line(0, 206, 240, 206, 0.6)} w={1.4} />
      </g>
    </svg>
  );
}

export function SocialSellerScene({ className }: { className?: string }) {
  const s = new Sketch(857);
  const purple = "#7C3AED";
  return (
    <svg viewBox="0 0 240 220" className={className} aria-hidden="true">
      <g filter="url(#hk-wobble)" className="text-ink">
        {/* Clothes rail with panjabis */}
        <P d={s.line(14, 30, 120, 30, 0.3)} w={1.6} />
        <P d={s.line(18, 30, 16, 206, 0.4)} w={1.3} />
        <P d={s.line(116, 30, 118, 206, 0.4)} w={1.3} />
        {[26, 56, 86].map((x, i) => {
          const d = `M${x} 38 l8 -3 l8 3 l10 5 l-3 9 l-5 -2 l0 52 l-20 0 l0 -52 l-5 2 l-3 -9 z`;
          return (
            <g key={x}>
              <P d={s.line(x + 8, 30, x + 8, 36, 0.1, 1)} w={0.8} />
              <Wash d={d} fill={["#7A8B4A", c.sky, c.cream][i]} o={0.75} />
              <path d={d} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
              <P d={s.line(x + 8, 38, x + 8, 62, 0.1, 1)} w={0.7} />
            </g>
          );
        })}
        {/* Seller on a stool with a phone */}
        <Occlude d="M120 170 C122 136 134 122 150 120 C166 122 178 136 180 170 Z" />
        <Wash d="M120 170 C122 136 134 122 150 120 C166 122 178 136 180 170 Z" fill={c.vermilion} o={0.45} />
        <P d={s.curve([[120, 170], [122, 136], [134, 122], [150, 120], [166, 122], [178, 136], [180, 170]], 0.4)} w={1.4} />
        <Wash d={s.ellipse(150, 104, 14, 15, 0.2)} fill={c.clay} o={0.5} />
        <P d={s.ellipse(150, 104, 14, 15, 0.4)} w={1.3} />
        <Wash d="M134 102 C132 80 168 80 166 102 C162 92 140 92 134 102 Z" fill={c.ink} o={0.75} />
        <P d={s.curve([[144, 108], [150, 111], [156, 108]], 0.2)} w={1} />
        <path d={box(160, 128, 14, 22)} fill={c.ink} rx="2" />
        <path d={box(162, 131, 10, 15)} fill={purple} opacity="0.6" />
        <P d={s.curve([[136, 140], [150, 146], [162, 140]], 0.3)} w={1.3} />
        <P d={s.line(132, 170, 128, 206, 0.3)} w={1.3} />
        <P d={s.line(168, 170, 172, 206, 0.3)} w={1.3} />
        {/* Chat bubbles rising from the phone */}
        {[
          [176, 54, 52, 22, "অর্ডার দেব"],
          [158, 20, 62, 22, "দাম কত?"],
        ].map(([x, y, w, h, label], i) => (
          <g key={i}>
            <path d={`M${x} ${y} h${w} a6 6 0 0 1 6 6 v${Number(h) - 12} a6 6 0 0 1 -6 6 h-${Number(w) - 14} l-8 7 l1 -7 h-7 a6 6 0 0 1 -6 -6 v-${Number(h) - 12} a6 6 0 0 1 6 -6 z`} fill={i ? "#fff" : purple} opacity={i ? 1 : 0.85} />
            <P d={s.rect(Number(x) - 6, Number(y), Number(w) + 12, Number(h), 0.3)} w={1} o={0.5} />
            <text x={Number(x) + Number(w) / 2} y={Number(y) + 15} textAnchor="middle" fontSize="10" fill={i ? c.ink : c.cream} style={{ fontFamily: "var(--font-hind)" }}>
              {label}
            </text>
          </g>
        ))}
        <P d={s.curve([[176, 128], [196, 108], [200, 82]], 0.6)} w={1} c={purple} o={0.6} />
        {/* Parcels ready to ship */}
        {[[188, 172, 30, 26], [198, 150, 22, 22]].map(([x, y, w, h], i) => (
          <g key={i}>
            <Wash d={box(x, y, w, h)} fill={c.rice} o={0.9} />
            <P d={s.rect(x, y, w, h, 0.3)} w={1.1} />
            <P d={s.line(x, y + h / 2, x + w, y + h / 2, 0.1, 1)} w={1.6} c={purple} o={0.7} />
          </g>
        ))}
        <P d={s.line(0, 206, 240, 206, 0.6)} w={1.4} />
      </g>
    </svg>
  );
}

/**
 * Super shop network: a flagship store linked to three branches and a warehouse by green data lines.
 * ViewBox 0 0 1200 560. Node positions are exported so the page can align UI with them.
 */
export const networkNodes = {
  flagship: [600, 300],
  dhanmondi: [180, 150],
  mirpur: [200, 440],
  uttara: [1010, 140],
  warehouse: [1010, 430],
} as const;

export function SupershopNetwork({ className, labels, alt }: { className?: string; labels: Record<"dhanmondi" | "mirpur" | "uttara" | "warehouse", string>; alt: string }) {
  const s = new Sketch(977);
  const [fx, fy] = networkNodes.flagship;
  const lines = (["dhanmondi", "mirpur", "uttara", "warehouse"] as const).map((k) => {
    const [x, y] = networkNodes[k];
    const mx = (x + fx) / 2;
    return { k, d: `M${fx} ${fy} C${mx} ${fy} ${mx} ${y} ${x} ${y}` };
  });
  const branch = (x: number, y: number, label: string, warehouse = false) => (
    <g>
      <Occlude d={box(x - 70, y - 60, 140, 110)} />
      {warehouse ? (
        <>
          <Wash d={quad([[x - 66, y - 20], [x, y - 58], [x + 66, y - 20], [x + 66, y + 46], [x - 66, y + 46]])} fill="#C9C2B4" o={0.5} />
          <P d={s.poly([[x - 66, y - 20], [x, y - 58], [x + 66, y - 20], [x + 66, y + 46], [x - 66, y + 46]], true, 0.6)} w={1.5} />
          <P d={s.rect(x - 30, y, 60, 46, 0.4)} w={1.2} />
          {[8, 16, 24, 32, 40].map((d) => (
            <P key={d} d={s.line(x - 28, y + d, x + 28, y + d, 0.2, 1)} w={0.6} />
          ))}
          {[-56, -46].map((dx) => (
            <g key={dx}>
              <Wash d={box(x + dx, y + 24, 16, 22)} fill={c.rice} o={0.9} />
              <P d={s.rect(x + dx, y + 24, 16, 22, 0.2)} w={0.9} />
            </g>
          ))}
        </>
      ) : (
        <>
          <P d={s.rect(x - 60, y - 40, 120, 86, 0.6)} w={1.5} />
          <Wash d={box(x - 56, y - 36, 112, 18)} fill={amber} o={0.8} />
          <P d={s.rect(x - 58, y - 38, 116, 22, 0.4)} w={1.2} />
          <Wash d={box(x - 50, y - 8, 100, 46)} fill="#DCEBEC" o={0.5} />
          <P d={s.rect(x - 50, y - 8, 100, 46, 0.4)} w={1.1} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              {Array.from({ length: 5 }, (_, j) => (
                <Wash key={j} d={box(x - 44 + j * 18, y - 2 + i * 13, 12, 9)} fill={[c.marigold, c.leafWash, c.vermilion, c.sky][(i + j) % 4]} o={0.7} />
              ))}
            </g>
          ))}
        </>
      )}
      <text x={x} y={y + 74} textAnchor="middle" fontSize="20" fill={c.ink} style={{ fontFamily: "var(--font-hind)", fontWeight: 600 }}>
        {label}
      </text>
    </g>
  );

  return (
    <div className={`relative ${className ?? ""}`}>
    <svg viewBox="0 0 1200 560" className="relative block w-full [transform:translateZ(0)]" role="img" aria-label={alt}>
      <g filter="url(#hk-wobble)" className="text-ink">
        {branch(networkNodes.dhanmondi[0], networkNodes.dhanmondi[1], labels.dhanmondi)}
        {branch(networkNodes.mirpur[0], networkNodes.mirpur[1], labels.mirpur)}
        {branch(networkNodes.uttara[0], networkNodes.uttara[1], labels.uttara)}
        {branch(networkNodes.warehouse[0], networkNodes.warehouse[1], labels.warehouse, true)}
        {/* Flagship store */}
        <g transform={`translate(${fx - 150} ${fy - 170})`}>
          <SuperShopInline s={s} />
        </g>
      </g>
    </svg>
    <svg viewBox="0 0 1200 560" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      {/* Data lines */}
      {lines.map((l, i) => (
        <g key={l.k}>
          <path d={l.d} pathLength={1} fill="none" stroke="var(--color-leaf-glow)" strokeWidth="11" strokeLinecap="round" opacity="0.22" className="hk-draw" style={{ animationDelay: `${0.3 + i * 0.25}s` }} />
          <path d={l.d} pathLength={1} fill="none" stroke="var(--color-leaf)" strokeWidth="3" strokeLinecap="round" className="hk-draw" style={{ animationDelay: `${0.3 + i * 0.25}s` }} />
          <path d={l.d} fill="none" stroke="var(--color-cream)" strokeWidth="2" strokeDasharray="2 18" className="hk-flow" />
        </g>
      ))}
      {lines.map((l) => {
        const [x, y] = networkNodes[l.k];
        return <circle key={l.k} cx={x} cy={y} r="7" fill="var(--color-cream)" stroke="var(--color-leaf)" strokeWidth="3" />;
      })}
      <circle cx={fx} cy={fy} r="9" fill="var(--color-leaf)" />
    </svg>
    </div>
  );
}

/** The flagship building drawn at 300×300 inside the network scene. */
function SuperShopInline({ s }: { s: Sketch }) {
  return (
    <g>
      <Occlude d={box(10, 20, 280, 270)} />
      <P d={s.rect(10, 20, 280, 270, 0.8)} w={1.8} />
      <P d={s.line(10, 110, 290, 110, 0.5)} w={1.3} />
      {[30, 100, 170, 240].map((x) => (
        <g key={x}>
          <Wash d={box(x + 2, 62, 36, 34)} fill={c.sky} o={0.3} />
          <P d={s.rect(x, 60, 40, 38, 0.3)} w={1.1} />
        </g>
      ))}
      <Wash d={box(20, 28, 260, 26)} fill={amber} o={0.9} />
      <P d={s.rect(18, 26, 264, 30, 0.5)} w={1.5} />
      <text x="150" y="48" textAnchor="middle" fontSize="18" fill={c.cream} style={{ fontFamily: "var(--font-tiro)" }}>
        নতুন বাজার সুপারশপ
      </text>
      <Wash d={box(22, 120, 256, 120)} fill="#DCEBEC" o={0.45} />
      <P d={s.rect(20, 118, 260, 124, 0.5)} w={1.4} />
      {[0, 1, 2, 3].map((i) => {
        const x = 30 + i * 62;
        return (
          <g key={i}>
            {[140, 162, 184].map((y, k) => (
              <g key={y}>
                <P d={s.line(x, y, x + 46, y, 0.2, 1)} w={0.9} />
                {Array.from({ length: 5 }, (_, j) => (
                  <Wash key={j} d={box(x + 2 + j * 9, y - 11, 7, 10)} fill={[c.marigold, c.leafWash, c.vermilion, c.sky][(i + j + k) % 4]} o={0.75} />
                ))}
              </g>
            ))}
          </g>
        );
      })}
      {[46, 176].map((x) => (
        <g key={x}>
          <Occlude d={box(x, 204, 80, 34)} />
          <Wash d={box(x + 2, 206, 76, 30)} fill={c.clay} o={0.45} />
          <P d={s.rect(x, 204, 80, 34, 0.4)} w={1.3} />
          <P d={s.ellipse(x + 26, 192, 8, 8, 0.2)} w={1.2} />
          <P d={s.rect(x + 50, 192, 20, 12, 0.2)} w={1.1} />
        </g>
      ))}
      <P d={s.rect(118, 246, 64, 44, 0.4)} w={1.3} />
      <P d={s.line(150, 246, 150, 290, 0.3)} w={1} />
    </g>
  );
}
