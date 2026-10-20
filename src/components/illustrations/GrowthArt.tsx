import { Sketch } from "@/lib/sketch";
import { P, Wash, box, quad, palette as c } from "./ink";

/** Five small drawings that grow from loose ink into crisp, organised forms. ViewBox 0 0 240 180. */
export function GrowthArt({ stage, className }: { stage: number; className?: string }) {
  const s = new Sketch(500 + stage * 31);
  const scribble = (x: number, y: number, w: number) => s.curve([[x, y], [x + w * 0.25, y - 2], [x + w * 0.5, y + 1], [x + w * 0.75, y - 1.5], [x + w, y]], 0.4);
  let body: React.ReactNode;

  switch (stage) {
    case 0: // paper ledger
      body = (
        <g>
          <Wash d={quad([[38, 52], [120, 44], [120, 150], [38, 156]])} fill={c.cream} o={1} />
          <Wash d={quad([[120, 44], [202, 52], [202, 156], [120, 150]])} fill={c.cream} o={1} />
          <Wash d={quad([[32, 156], [120, 150], [208, 156], [208, 162], [120, 158], [32, 162]])} fill={c.vermilion} o={0.8} />
          <P d={s.poly([[38, 52], [120, 44], [202, 52], [202, 156], [120, 150], [38, 156]], true, 0.6)} w={1.5} />
          <P d={s.line(120, 44, 120, 150, 0.4)} w={1.2} />
          {[70, 86, 102, 118, 134].map((y, i) => (
            <g key={y}>
              <P d={scribble(48, y, 56 - (i % 2) * 14)} w={1} c="#24346b" />
              <P d={scribble(132, y, 48 - (i % 3) * 8)} w={1} c="#24346b" />
            </g>
          ))}
        </g>
      );
      break;
    case 1: // scattered notes
      body = (
        <g>
          {[
            [40, 40, -12, c.cream],
            [110, 30, 8, c.marigold],
            [70, 92, 6, "#f3d6cc"],
            [140, 86, -9, c.cream],
          ].map(([x, y, r, fill], i) => (
            <g key={i} transform={`rotate(${r} ${Number(x) + 34} ${Number(y) + 26})`}>
              <Wash d={box(Number(x), Number(y), 68, 52)} fill={String(fill)} o={0.85} />
              <P d={s.rect(Number(x), Number(y), 68, 52, 0.6)} w={1.3} />
              <P d={scribble(Number(x) + 8, Number(y) + 16, 44)} w={0.9} c="#24346b" />
              <P d={scribble(Number(x) + 8, Number(y) + 28, 34)} w={0.9} c="#24346b" />
              <P d={scribble(Number(x) + 8, Number(y) + 40, 40)} w={0.9} c="#24346b" />
            </g>
          ))}
          <P d={s.ellipse(146, 34, 4, 4, 0.2)} w={1.2} c={c.vermilion} />
          <P d={s.curve([[30, 150], [60, 140], [90, 158], [120, 146]], 0.6)} w={0.9} o={0.5} />
        </g>
      );
      break;
    case 2: // organised records
      body = (
        <g>
          <path d={box(44, 30, 152, 124)} fill="#fff" />
          <P d={s.rect(44, 30, 152, 124, 0.3)} w={1.3} />
          <Wash d={box(46, 32, 148, 18)} fill={c.leaf} o={0.35} />
          {[64, 84, 104, 124].map((y, i) => (
            <g key={y}>
              <P d={s.line(56, y, 56 + 50 + (i % 2) * 14, y, 0.2, 1)} w={2.4} c={c.ink} o={0.5} />
              <P d={s.line(160, y, 184, y, 0.2, 1)} w={2.4} c={c.leafDeep} />
              <P d={s.line(48, y + 10, 192, y + 10, 0.2, 1)} w={0.6} o={0.4} />
            </g>
          ))}
        </g>
      );
      break;
    case 3: // clear reports
      body = (
        <g>
          <path d={box(36, 26, 168, 130)} fill="#fff" />
          <P d={s.rect(36, 26, 168, 130, 0.2)} w={1.2} />
          {[42, 64, 52, 80, 70, 96].map((h, i) => (
            <g key={i}>
              <path d={box(56 + i * 23, 140 - h, 14, h)} fill={i === 5 ? c.leaf : "#bfe8cc"} rx="2" />
            </g>
          ))}
          <P d={s.curve([[60, 104], [84, 86], [108, 94], [132, 68], [156, 74], [184, 46]], 0.2)} w={1.8} c={c.leafDeep} />
          <P d={s.line(48, 140, 192, 140, 0.2)} w={1} />
        </g>
      );
      break;
    default: // informed decisions
      body = (
        <g>
          <path d={box(54, 22, 120, 140)} fill="#fff" />
          <P d={s.rect(54, 22, 120, 140, 0.2)} w={1.3} />
          <path d={box(92, 16, 44, 12)} fill={c.leafDeep} rx="3" />
          {[52, 80, 108, 136].map((y, i) => (
            <g key={y}>
              <path d={box(68, y - 8, 14, 14)} fill={i < 3 ? c.leaf : "#fff"} stroke={c.leafDeep} strokeWidth="1.2" rx="3" />
              {i < 3 && <path d={`M71 ${y - 1} l3 3 l6 -7`} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
              <P d={s.line(92, y, 92 + 56 - (i % 2) * 16, y, 0.1, 1)} w={2.4} c={c.ink} o={0.45} />
            </g>
          ))}
          <Wash d="M170 150 C168 132 172 124 180 120 L206 120 C212 124 214 132 212 150 Z" fill={c.rice} o={0.9} />
          <P d={s.curve([[170, 150], [168, 132], [172, 124], [180, 120], [206, 120], [212, 124], [214, 132], [212, 150]], 0.3)} w={1.2} />
        </g>
      );
  }

  return (
    <svg viewBox="0 0 240 180" className={className} aria-hidden="true">
      <g filter={stage < 2 ? "url(#hk-wobble)" : undefined} className="text-ink">
        {body}
      </g>
    </svg>
  );
}
