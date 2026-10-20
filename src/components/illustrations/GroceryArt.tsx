import { Sketch } from "@/lib/sketch";
import { P, Wash, Occlude, box, quad, palette as c } from "./ink";

/**
 * Hand-drawn scenes for the Grocery & Retail page — a contemporary Bangladeshi মুদি দোকান.
 * Products are drawn without brand names or fake packaging text.
 */

const blue = "#24346b";

/* Shared shelf contents */
function ShelfRow({ s, x, y, w, seed }: { s: Sketch; x: number; y: number; w: number; seed: number }) {
  const items: React.ReactNode[] = [];
  let cx = x + 6;
  let i = seed;
  while (cx < x + w - 24) {
    const kind = i % 4;
    const tint = [c.rice, c.marigold, c.leafWash, c.vermilion, c.sky][i % 5];
    if (kind === 0) {
      // jar
      items.push(
        <g key={cx}>
          <Wash d={box(cx + 1, y - 26, 18, 24)} fill={tint} o={0.55} />
          <P d={s.rect(cx, y - 28, 20, 28, 0.4)} w={1} />
          <P d={s.rect(cx - 1, y - 32, 22, 4, 0.3, 1)} w={0.9} />
        </g>,
      );
      cx += 26;
    } else if (kind === 1) {
      // bottle
      items.push(
        <g key={cx}>
          <Wash d={box(cx + 1, y - 24, 12, 22)} fill={c.marigold} o={0.6} />
          <P d={s.rect(cx, y - 26, 14, 26, 0.3)} w={1} />
          <P d={s.rect(cx + 4, y - 34, 6, 8, 0.2, 1)} w={0.9} />
        </g>,
      );
      cx += 19;
    } else if (kind === 2) {
      // box
      const h = 20 + (i % 3) * 5;
      items.push(
        <g key={cx}>
          <Wash d={box(cx + 1, y - h + 1, 24, h - 2)} fill={tint} o={0.5} />
          <P d={s.rect(cx, y - h, 26, h, 0.4)} w={1} />
          <P d={s.line(cx + 4, y - h / 2, cx + 22, y - h / 2, 0.2, 1)} w={0.6} />
        </g>,
      );
      cx += 31;
    } else {
      // packet
      items.push(
        <g key={cx}>
          <Wash d={quad([[cx, y], [cx + 18, y], [cx + 16, y - 24], [cx + 2, y - 24]])} fill={tint} o={0.6} />
          <P d={s.poly([[cx, y], [cx + 18, y], [cx + 16, y - 24], [cx + 2, y - 24]], true, 0.3)} w={1} />
        </g>,
      );
      cx += 23;
    }
    i++;
  }
  return (
    <g>
      {items}
      <P d={s.line(x, y, x + w, y, 0.5)} w={1.4} />
      <P d={s.line(x + 2, y + 5, x + w - 2, y + 5, 0.3, 1)} w={0.7} />
    </g>
  );
}

function SnackStrip({ s, x, y0, n, seed }: { s: Sketch; x: number; y0: number; n: number; seed: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const y = y0 + i * 17;
        const tint = [c.vermilion, c.marigold, c.leafWash][(i + seed) % 3];
        return (
          <g key={i}>
            <Wash d={box(x + 1, y + 1, 16, 13)} fill={tint} o={0.7} />
            <P d={s.rect(x, y, 18, 15, 0.4)} w={0.9} />
          </g>
        );
      })}
    </g>
  );
}

/* ---------------- Hero: shop interior ---------------- */
export const HERO_W = 680;
export const HERO_H = 560;
/** Where the phone stands on the counter (viewBox units) — the page positions the HTML phone here. */
export const heroPhoneSpot = { x: 452, y: 548, w: 214 };

export function GroceryHeroArt({ className, alt }: { className?: string; alt: string }) {
  const s = new Sketch(1201);
  return (
    <svg viewBox={`0 0 ${HERO_W} ${HERO_H}`} className={className} role="img" aria-label={alt}>
      <g filter="url(#hk-wobble)" className="text-ink">
        {/* Back wall + sign */}
        <Wash d={box(30, 20, 620, 360)} fill="#efe4cf" o={0.55} />
        <Wash d={box(150, 28, 380, 40)} fill={c.leaf} o={0.85} />
        <P d={s.rect(148, 26, 384, 44, 0.6)} w={1.6} />
        <text x="340" y="56" textAnchor="middle" fontSize="24" fill={c.cream} style={{ fontFamily: "var(--font-tiro)" }}>
          মা জেনারেল স্টোর
        </text>
        {/* Shelves */}
        <ShelfRow s={s} x={40} y={130} w={600} seed={1} />
        <ShelfRow s={s} x={40} y={190} w={600} seed={3} />
        <ShelfRow s={s} x={40} y={250} w={600} seed={6} />
        <ShelfRow s={s} x={40} y={310} w={600} seed={2} />
        <SnackStrip s={s} x={44} y0={76} n={4} seed={0} />
        <SnackStrip s={s} x={618} y0={76} n={4} seed={1} />
        {/* Shopkeeper (behind counter) */}
        <Occlude d="M300 404 C302 366 318 346 344 340 L372 340 C398 346 414 366 416 404 Z" />
        <Wash d="M300 404 C302 366 318 346 344 340 L372 340 C398 346 414 366 416 404 Z" fill={c.sky} o={0.55} />
        <P d={s.curve([[300, 404], [302, 366], [318, 346], [344, 340]], 0.4)} w={1.5} />
        <P d={s.curve([[372, 340], [398, 346], [414, 366], [416, 404]], 0.4)} w={1.5} />
        <P d={s.poly([[345, 341], [358, 360], [371, 341]], false, 0.3, 1)} w={1.1} />
        <Occlude d={s.ellipse(358, 306, 28, 30, 0)} />
        <Wash d={s.ellipse(358, 308, 25, 27, 0.2)} fill={c.clay} o={0.45} />
        <P d={s.curve([[333, 296], [332, 318], [342, 334], [358, 338], [374, 334], [384, 318], [383, 296]], 0.4)} w={1.4} />
        <Wash d="M331 300 C330 274 386 272 385 300 C378 288 340 288 331 300 Z" fill={c.ink} o={0.8} />
        <P d={s.line(346, 308, 352, 308, 0.2, 1)} w={1.4} />
        <P d={s.line(365, 308, 371, 308, 0.2, 1)} w={1.4} />
        <P d={s.curve([[350, 322], [358, 326], [366, 322]], 0.2)} w={1.2} />
        {/* Arm reaching out with a bag */}
        <P d={s.curve([[304, 370], [282, 382], [256, 386]], 0.4)} w={1.4} />
        <Wash d="M222 372 L258 372 L262 410 L218 410 Z" fill={c.rice} o={0.9} />
        <P d={s.poly([[222, 372], [258, 372], [262, 410], [218, 410]], true, 0.4)} w={1.3} />
        <P d={s.curve([[230, 372], [240, 360], [250, 372]], 0.2)} w={1.1} />
        {/* Customer (foreground left, from behind) */}
        <Occlude d="M70 560 C70 470 96 430 136 420 L176 420 C214 432 236 472 236 560 Z" />
        <Wash d="M70 560 C70 470 96 430 136 420 L176 420 C214 432 236 472 236 560 Z" fill={c.leafWash} o={0.55} />
        <P d={s.curve([[70, 560], [70, 470], [96, 430], [136, 420]], 0.5)} w={1.6} />
        <P d={s.curve([[176, 420], [214, 432], [236, 472], [236, 560]], 0.5)} w={1.6} />
        <Occlude d={s.ellipse(156, 386, 30, 34, 0)} />
        <Wash d="M126 378 C126 340 186 340 186 380 C186 404 172 418 156 418 C140 418 126 404 126 378 Z" fill={c.ink} o={0.8} />
        <P d={s.curve([[126, 380], [126, 344], [156, 340], [186, 344], [186, 382], [172, 418], [140, 418], [126, 380]], 0.4)} w={1.4} />
        <P d={s.curve([[214, 450], [232, 420], [226, 400]], 0.4)} w={1.4} />
        {/* Counter */}
        <Occlude d={box(240, 404, 440, 156)} />
        <Wash d={box(242, 418, 436, 140)} fill={c.clay} o={0.35} />
        <P d={s.poly([[250, 404], [672, 404], [680, 418], [240, 418]], true, 0.6)} w={1.6} />
        <P d={s.rect(240, 418, 440, 142, 0.6)} w={1.6} />
        {[300, 360, 420, 480, 540, 600].map((x) => (
          <P key={x} d={s.line(x, 420, x, 558, 0.3, 1)} w={0.6} />
        ))}
        {/* Ledger, calculator, scale on the counter */}
        <Wash d={quad([[270, 404], [356, 404], [352, 392], [276, 391]])} fill={c.vermilion} o={0.85} />
        <path d={quad([[278, 402], [312, 402], [312, 393], [282, 393]])} fill={c.cream} />
        <path d={quad([[316, 402], [350, 402], [346, 393], [316, 393]])} fill={c.cream} />
        <P d={s.line(270, 404, 356, 404, 0.2)} w={1} />
        <path d={box(372, 388, 30, 16)} fill="#f3f1ea" />
        <P d={s.rect(372, 388, 30, 16, 0.2)} w={1} />
        <path d={box(376, 391, 22, 4)} fill="#bcd0c2" />
        <P d={s.line(436, 404, 436, 352, 0.3)} w={1.4} />
        <P d={s.line(404, 354, 468, 354, 0.3)} w={1.4} />
        {[408, 464].map((x) => (
          <g key={x}>
            <P d={s.line(x, 355, x - 9, 382, 0.2, 1)} w={0.7} />
            <P d={s.line(x, 355, x + 9, 382, 0.2, 1)} w={0.7} />
            <Wash d={s.ellipse(x, 384, 12, 3, 0.1)} fill={c.marigold} o={0.6} />
            <P d={s.ellipse(x, 384, 12, 3, 0.2)} w={1} />
          </g>
        ))}
        {/* Phone stand where the HTML phone sits */}
        <Wash d={quad([[486, 404], [624, 404], [612, 396], [498, 396]])} fill="#b9b3a6" o={0.7} />
        {/* Rice sack in front */}
        <Occlude d="M560 560 C556 520 558 500 566 492 L640 492 C648 500 650 520 646 560 Z" />
        <Wash d="M560 560 C556 520 558 500 566 492 L640 492 C648 500 650 520 646 560 Z" fill={c.rice} o={0.7} />
        <P d={s.curve([[560, 560], [556, 520], [558, 500], [566, 492]], 0.3)} w={1.3} />
        <P d={s.curve([[640, 492], [648, 500], [650, 520], [646, 560]], 0.3)} w={1.3} />
        <path d="M566 494 C578 480 590 486 600 478 C612 484 620 482 640 494 Z" fill="#F3E9D2" />
        <P d={s.curve([[566, 494], [578, 480], [590, 486], [600, 478], [612, 484], [620, 482], [640, 494]], 0.3)} w={1.1} />
      </g>
    </svg>
  );
}

/* ---------------- Counter with ledger + calculator (top-down-ish) ---------------- */
export function CounterArt({ className }: { className?: string }) {
  const s = new Sketch(1301);
  return (
    <svg viewBox="0 0 520 340" className={className} aria-hidden="true">
      <g filter="url(#hk-wobble)" className="text-ink">
        <Wash d={box(10, 30, 500, 300)} fill={c.clay} o={0.3} />
        <P d={s.rect(10, 30, 500, 300, 0.6)} w={1.4} />
        {[90, 170, 250].map((y) => (
          <P key={y} d={s.line(14, y, 506, y + 2, 0.4, 1)} w={0.5} o={0.5} />
        ))}
        {/* Open ledger */}
        <Wash d={quad([[40, 66], [330, 56], [340, 300], [32, 306]])} fill={c.vermilion} o={0.8} />
        <path d={quad([[48, 72], [182, 66], [184, 294], [42, 298]])} fill="#fbf6ea" />
        <path d={quad([[190, 66], [324, 62], [332, 292], [190, 294]])} fill="#fbf6ea" />
        <P d={s.poly([[48, 72], [182, 66], [184, 294], [42, 298]], true, 0.4)} w={1.2} />
        <P d={s.poly([[190, 66], [324, 62], [332, 292], [190, 294]], true, 0.4)} w={1.2} />
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i}>
            <P d={s.line(50, 96 + i * 22, 182, 94 + i * 22, 0.2, 1)} w={0.6} c={c.sky} o={0.5} />
            <P d={s.line(192, 94 + i * 22, 326, 92 + i * 22, 0.2, 1)} w={0.6} c={c.sky} o={0.5} />
          </g>
        ))}
        <P d={s.line(66, 74, 64, 296, 0.3, 1)} w={0.8} c={c.vermilion} o={0.6} />
        {[0, 1, 2, 3].map((i) => (
          <P key={i} d={s.curve([[74, 110 + i * 22], [100, 108 + i * 22], [130, 111 + i * 22], [168, 108 + i * 22]], 0.4)} w={1.1} c={blue} />
        ))}
        {/* Calculator */}
        <Wash d={box(372, 70, 104, 150)} fill="#e8e6df" o={0.95} />
        <P d={s.rect(370, 68, 108, 154, 0.4)} w={1.5} />
        <path d={box(384, 82, 80, 26)} fill="#c9d8cc" />
        <P d={s.rect(384, 82, 80, 26, 0.2)} w={1} />
        {Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 4 }, (_, k) => <P key={`${r}${k}`} d={s.rect(386 + k * 20, 120 + r * 24, 14, 16, 0.2, 1)} w={0.8} />),
        )}
        {/* Pen */}
        <P d={s.line(352, 250, 420, 300, 0.2)} w={4} c={c.ink} />
        <P d={s.line(352, 250, 344, 244, 0.1, 1)} w={2} c={c.marigold} />
      </g>
    </svg>
  );
}

/* ---------------- Shelf with four everyday products ---------------- */
export const shelfSpots = { rice: 70, oil: 190, lentil: 310, sugar: 430 } as const;
export function ProductShelfArt({ className }: { className?: string }) {
  const s = new Sketch(1401);
  const [rx, ox, lx, sx] = [shelfSpots.rice, shelfSpots.oil, shelfSpots.lentil, shelfSpots.sugar];
  return (
    <svg viewBox="0 76 520 164" className={className} aria-hidden="true">
      <g filter="url(#hk-wobble)" className="text-ink">
        {/* Rice sack */}
        <Wash d={`M${rx - 44} 196 C${rx - 48} 150 ${rx - 46} 120 ${rx - 36} 108 L${rx + 36} 108 C${rx + 46} 120 ${rx + 48} 150 ${rx + 44} 196 Z`} fill={c.rice} o={0.8} />
        <P d={s.curve([[rx - 44, 196], [rx - 48, 150], [rx - 46, 120], [rx - 36, 108]], 0.4)} w={1.4} />
        <P d={s.curve([[rx + 36, 108], [rx + 46, 120], [rx + 48, 150], [rx + 44, 196]], 0.4)} w={1.4} />
        <path d={`M${rx - 36} 110 C${rx - 20} 92 ${rx} 100 ${rx + 8} 90 C${rx + 20} 98 ${rx + 30} 96 ${rx + 36} 110 Z`} fill="#F3E9D2" />
        <P d={s.curve([[rx - 36, 110], [rx - 20, 92], [rx, 100], [rx + 8, 90], [rx + 20, 98], [rx + 36, 110]], 0.3)} w={1.1} />
        <P d={s.curve([[rx - 40, 122], [rx, 128], [rx + 40, 122]], 0.3)} w={1} />
        {/* Oil bottles */}
        {[-22, 2, 26].map((d, i) => (
          <g key={d}>
            <Wash d={box(ox + d - 9, 120 + i * 2, 18, 74 - i * 2)} fill={c.marigold} o={0.7} />
            <P d={s.rect(ox + d - 10, 118 + i * 2, 20, 78 - i * 2, 0.3)} w={1.2} />
            <P d={s.rect(ox + d - 4, 100 + i * 2, 8, 18, 0.2, 1)} w={1} />
            <Wash d={box(ox + d - 5, 94 + i * 2, 10, 7)} fill={c.leafDeep} o={0.8} />
            <P d={s.rect(ox + d - 8, 140, 16, 20, 0.2, 1)} w={0.7} o={0.6} />
          </g>
        ))}
        {/* Lentil jar */}
        <Wash d={box(lx - 34, 120, 68, 74)} fill="#f3d6cc" o={0.5} />
        <Wash d={box(lx - 32, 142, 64, 50)} fill={c.vermilion} o={0.7} />
        <P d={s.curve([[lx - 36, 112], [lx - 38, 150], [lx - 36, 196], [lx, 199], [lx + 36, 196], [lx + 38, 150], [lx + 36, 112]], 0.4)} w={1.4} />
        <P d={s.rect(lx - 32, 98, 64, 14, 0.3)} w={1.3} />
        <Wash d={box(lx - 31, 99, 62, 12)} fill={c.leafDeep} o={0.55} />
        {/* Sugar packets */}
        {[-24, 6].map((d, i) => (
          <g key={d}>
            <Wash d={quad([[sx + d - 18, 196], [sx + d + 18, 196], [sx + d + 15, 128 + i * 10], [sx + d - 15, 128 + i * 10]])} fill="#fbfaf6" o={1} />
            <P d={s.poly([[sx + d - 18, 196], [sx + d + 18, 196], [sx + d + 15, 128 + i * 10], [sx + d - 15, 128 + i * 10]], true, 0.4)} w={1.2} />
            <P d={s.line(sx + d - 15, 140 + i * 10, sx + d + 15, 140 + i * 10, 0.2, 1)} w={0.8} c={c.sky} />
          </g>
        ))}
        {/* Shelf plank */}
        <Wash d={box(8, 198, 504, 16)} fill={c.clay} o={0.55} />
        <P d={s.rect(8, 196, 504, 18, 0.6)} w={1.7} />
        <P d={s.hatch(10, 214, 500, 14, 6, 0.4)} w={0.6} o={0.4} />
      </g>
    </svg>
  );
}

/* ---------------- Supplier delivery: rickshaw-van with sacks ---------------- */
export function DeliveryArt({ className }: { className?: string }) {
  const s = new Sketch(1501);
  const wheel = (cx: number, cy: number, r: number) => (
    <g>
      <P d={s.ellipse(cx, cy, r, r, 0.5)} w={1.6} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <P key={i} d={s.line(cx, cy, cx + Math.cos(a) * (r - 4), cy + Math.sin(a) * (r - 4), 0.2, 1)} w={0.5} />;
      })}
    </g>
  );
  return (
    <svg viewBox="0 0 520 320" className={className} aria-hidden="true">
      <g filter="url(#hk-wobble)" className="text-ink">
        {/* Van flatbed with sacks */}
        <Wash d={box(150, 186, 250, 16)} fill={c.clay} o={0.6} />
        <P d={s.rect(150, 184, 250, 18, 0.5)} w={1.5} />
        {[[170, 0], [226, 0], [282, 0], [198, -38], [254, -38]].map(([x, dy], i) => (
          <g key={i}>
            <Wash d={`M${x} ${184 + dy} C${x - 2} ${160 + dy} ${x + 2} ${148 + dy} ${x + 8} ${146 + dy} L${x + 48} ${146 + dy} C${x + 54} ${148 + dy} ${x + 58} ${160 + dy} ${x + 56} ${184 + dy} Z`} fill={c.rice} o={0.85} />
            <P d={s.curve([[x, 184 + dy], [x - 2, 160 + dy], [x + 2, 148 + dy], [x + 8, 146 + dy], [x + 48, 146 + dy], [x + 54, 148 + dy], [x + 58, 160 + dy], [x + 56, 184 + dy]], 0.3)} w={1.2} />
            <P d={s.line(x + 10, 156 + dy, x + 46, 156 + dy, 0.2, 1)} w={0.7} c={c.leafDeep} o={0.6} />
          </g>
        ))}
        {wheel(190, 240, 34)}
        {wheel(370, 240, 34)}
        <P d={s.line(400, 194, 452, 212, 0.4)} w={1.6} />
        {wheel(462, 250, 24)}
        <P d={s.line(452, 212, 460, 168, 0.3)} w={1.5} />
        <P d={s.line(444, 166, 476, 164, 0.3)} w={1.6} />
        {/* Delivery worker carrying a sack on his shoulder */}
        <Occlude d="M70 300 C70 250 80 214 104 206 L128 206 C148 214 156 250 154 300 Z" />
        <Wash d="M70 300 C70 250 80 214 104 206 L128 206 C148 214 156 250 154 300 Z" fill={c.sky} o={0.5} />
        <P d={s.curve([[70, 300], [70, 250], [80, 214], [104, 206]], 0.4)} w={1.4} />
        <P d={s.curve([[128, 206], [148, 214], [156, 250], [154, 300]], 0.4)} w={1.4} />
        <Wash d="M64 206 C60 184 70 170 90 168 L150 172 C164 178 166 196 156 206 Z" fill={c.rice} o={0.9} />
        <P d={s.curve([[64, 206], [60, 184], [70, 170], [90, 168], [150, 172], [164, 178], [166, 196], [156, 206]], 0.4)} w={1.3} />
        <Wash d={s.ellipse(116, 196, 14, 15, 0.2)} fill={c.clay} o={0.6} />
        <P d={s.ellipse(116, 196, 14, 15, 0.3)} w={1.3} />
        <P d={s.curve([[100, 230], [86, 214], [90, 196]], 0.3)} w={1.3} />
        <P d={s.line(0, 280, 520, 280, 0.8)} w={1.4} />
      </g>
    </svg>
  );
}

/* ---------------- Shopkeeper with a regular customer ---------------- */
export function RegularCustomerArt({ className }: { className?: string }) {
  const s = new Sketch(1601);
  return (
    <svg viewBox="0 0 520 340" className={className} aria-hidden="true">
      <g filter="url(#hk-wobble)" className="text-ink">
        <ShelfRow s={s} x={20} y={80} w={480} seed={4} />
        <ShelfRow s={s} x={20} y={140} w={480} seed={7} />
        {/* Shopkeeper behind counter (right) */}
        <Occlude d="M300 240 C302 206 318 188 344 182 L372 182 C398 188 412 206 414 240 Z" />
        <Wash d="M300 240 C302 206 318 188 344 182 L372 182 C398 188 412 206 414 240 Z" fill={c.sky} o={0.55} />
        <P d={s.curve([[300, 240], [302, 206], [318, 188], [344, 182], [372, 182], [398, 188], [412, 206], [414, 240]], 0.4)} w={1.5} />
        <Occlude d={s.ellipse(358, 152, 26, 28, 0)} />
        <Wash d={s.ellipse(358, 154, 23, 25, 0.2)} fill={c.clay} o={0.45} />
        <P d={s.ellipse(358, 154, 24, 26, 0.4)} w={1.4} />
        <Wash d="M334 146 C333 122 383 120 382 146 C376 134 340 134 334 146 Z" fill={c.ink} o={0.8} />
        <P d={s.curve([[348, 166], [358, 171], [368, 166]], 0.2)} w={1.2} />
        <P d={s.line(347, 154, 352, 154, 0.2, 1)} w={1.3} />
        <P d={s.line(364, 154, 369, 154, 0.2, 1)} w={1.3} />
        {/* Elderly customer (left) in a sari with glasses, smiling */}
        <Occlude d="M80 340 C80 270 100 226 140 214 L172 214 C208 226 224 270 224 340 Z" />
        <Wash d="M80 340 C80 270 100 226 140 214 L172 214 C208 226 224 270 224 340 Z" fill={c.marigold} o={0.55} />
        <Wash d="M140 214 C150 250 176 286 214 300 L224 340 L190 340 C168 300 150 260 140 214 Z" fill={c.vermilion} o={0.55} />
        <P d={s.curve([[80, 340], [80, 270], [100, 226], [140, 214], [172, 214], [208, 226], [224, 270], [224, 340]], 0.5)} w={1.5} />
        <Occlude d={s.ellipse(156, 182, 26, 28, 0)} />
        <Wash d={s.ellipse(156, 184, 23, 25, 0.2)} fill={c.clay} o={0.5} />
        <P d={s.ellipse(156, 184, 24, 26, 0.4)} w={1.4} />
        <Wash d="M130 178 C128 150 184 148 182 180 C182 166 170 158 156 158 C142 158 132 166 130 178 Z" fill="#d9d4cb" o={0.9} />
        <P d={s.ellipse(147, 184, 6, 5, 0.2)} w={1.1} />
        <P d={s.ellipse(165, 184, 6, 5, 0.2)} w={1.1} />
        <P d={s.line(153, 184, 159, 184, 0.1, 1)} w={1} />
        <P d={s.curve([[148, 198], [156, 203], [164, 198]], 0.2)} w={1.2} />
        {/* Bag passing over the counter */}
        <P d={s.curve([[304, 210], [282, 218], [262, 222]], 0.3)} w={1.4} />
        <P d={s.curve([[214, 250], [228, 236], [240, 226]], 0.3)} w={1.4} />
        <Wash d="M232 206 L268 206 L272 244 L228 244 Z" fill={c.leafWash} o={0.85} />
        <P d={s.poly([[232, 206], [268, 206], [272, 244], [228, 244]], true, 0.4)} w={1.3} />
        <P d={s.curve([[240, 206], [250, 194], [260, 206]], 0.2)} w={1.1} />
        {/* Counter */}
        <Occlude d={box(260, 240, 260, 100)} />
        <Wash d={box(262, 252, 256, 88)} fill={c.clay} o={0.35} />
        <P d={s.poly([[266, 240], [516, 240], [520, 252], [260, 252]], true, 0.5)} w={1.5} />
        <P d={s.rect(260, 252, 260, 88, 0.5)} w={1.5} />
      </g>
    </svg>
  );
}
