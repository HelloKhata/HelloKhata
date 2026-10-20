import { Sketch } from "@/lib/sketch";
import { P } from "./ink";

/** A thin rooftop line — water tanks, a minaret, antennae — used as a quiet texture. */
export function Skyline({ className }: { className?: string }) {
  const s = new Sketch(5);
  const pts: [number, number][] = [];
  let x = 0;
  let i = 0;
  const segs: string[] = [];
  while (x < 1440) {
    const w = 60 + ((i * 37) % 70);
    const h = 40 + ((i * 53) % 90);
    pts.push([x, 160 - h], [x + w, 160 - h]);
    segs.push(s.line(x, 160 - h, x + w, 160 - h, 0.6));
    segs.push(s.line(x + w, 160 - h, x + w, 160, 0.6, 1));
    if (i % 3 === 0) segs.push(s.rect(x + w * 0.3, 160 - h - 14, 20, 14, 0.4));
    if (i % 4 === 1) segs.push(s.line(x + w * 0.7, 160 - h, x + w * 0.7, 160 - h - 26, 0.3));
    if (i === 6) {
      segs.push(s.rect(x + w / 2 - 5, 160 - h - 70, 10, 70, 0.3));
      segs.push(s.curve([[x + w / 2 - 8, 160 - h - 70], [x + w / 2, 160 - h - 86], [x + w / 2 + 8, 160 - h - 70]], 0.3));
    }
    x += w;
    i++;
  }
  return (
    <svg viewBox="0 0 1440 160" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      {segs.map((d, k) => (
        <P key={k} d={d} w={1.2} />
      ))}
    </svg>
  );
}
