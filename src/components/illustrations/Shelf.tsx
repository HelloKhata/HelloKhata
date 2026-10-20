import { Sketch } from "@/lib/sketch";
import { P, Wash, box, palette as c } from "./ink";

/** A wooden shelf with five glass jars — rice, lentils, sugar, tea, salt. */
export function ShelfArt({ className }: { className?: string }) {
  const s = new Sketch(211);
  const jars = [
    { x: 30, fill: c.rice, level: 0.7 },
    { x: 102, fill: c.vermilion, level: 0.2 },
    { x: 174, fill: "#F4EEE2", level: 0.35 },
    { x: 246, fill: "#7A4A2A", level: 0.6 },
    { x: 318, fill: "#E9E7E2", level: 0.15 },
  ];
  return (
    <svg viewBox="0 0 400 200" className={className} aria-hidden="true">
      <g filter="url(#hk-wobble)" className="text-ink">
        {jars.map((j, i) => {
          const top = 30;
          const h = 110;
          const fillTop = top + 18 + (h - 22) * (1 - j.level);
          return (
            <g key={i}>
              <Wash d={box(j.x + 4, fillTop, 44, top + h - fillTop - 2)} fill={j.fill} o={0.75} />
              <P d={s.curve([[j.x, top + 14], [j.x - 2, top + 60], [j.x, top + h], [j.x + 26, top + h + 3], [j.x + 52, top + h], [j.x + 54, top + 60], [j.x + 52, top + 14]], 0.5)} w={1.5} />
              <P d={s.rect(j.x + 2, top, 48, 14, 0.5)} w={1.5} />
              <Wash d={box(j.x + 3, top + 1, 46, 12)} fill={c.leafDeep} o={0.55} />
              <P d={s.line(j.x + 10, top + 30, j.x + 10, top + 80, 0.6, 1)} w={1.2} c={c.cream} o={0.8} />
              <P d={s.line(j.x + 4, fillTop, j.x + 50, fillTop, 0.6, 1)} w={0.8} o={0.5} />
            </g>
          );
        })}
        <Wash d={box(8, 146, 384, 18)} fill={c.clay} o={0.55} />
        <P d={s.rect(8, 144, 384, 18, 0.8)} w={1.8} />
        <P d={s.hatch(10, 164, 380, 14, 6, 0.4)} w={0.6} o={0.4} />
        <P d={s.line(30, 162, 26, 196, 0.5)} w={1.6} />
        <P d={s.line(370, 162, 374, 196, 0.5)} w={1.6} />
      </g>
    </svg>
  );
}
