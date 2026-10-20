/**
 * A tiny deterministic "hand-drawn ink" generator.
 *
 * Every primitive is drawn as one or two slightly wobbling strokes so shapes read
 * like a pen drawing instead of geometric vectors. Output is seeded, so server and
 * client renders are identical and illustrations never shift between builds.
 */

type Pt = [number, number];

const r1 = (n: number) => Math.round(n * 10) / 10;

export class Sketch {
  private s: number;
  constructor(seed = 1) {
    this.s = seed >>> 0 || 1;
  }

  /** mulberry32 */
  rand(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  j(amount: number): number {
    return (this.rand() * 2 - 1) * amount;
  }

  private stroke(x1: number, y1: number, x2: number, y2: number, wob: number): string {
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const nx = -(y2 - y1) / len;
    const ny = (x2 - x1) / len;
    const bow = this.j(Math.min(wob * 1.6, len * 0.02 + wob * 0.4));
    const t = 0.4 + this.rand() * 0.2;
    const cx = x1 + (x2 - x1) * t + nx * bow;
    const cy = y1 + (y2 - y1) * t + ny * bow;
    return `M${r1(x1 + this.j(wob))} ${r1(y1 + this.j(wob))}Q${r1(cx)} ${r1(cy)} ${r1(x2 + this.j(wob))} ${r1(y2 + this.j(wob))}`;
  }

  /** A pen line, drawn twice by default for the overlapping-stroke look. */
  line(x1: number, y1: number, x2: number, y2: number, wob = 1, passes = 2): string {
    let d = "";
    for (let i = 0; i < passes; i++) d += this.stroke(x1, y1, x2, y2, wob * (i ? 1.3 : 1));
    return d;
  }

  poly(points: Pt[], closed = true, wob = 1, passes = 2): string {
    let d = "";
    const pts = closed ? [...points, points[0]] : points;
    for (let i = 0; i < pts.length - 1; i++) {
      d += this.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], wob, passes);
    }
    return d;
  }

  rect(x: number, y: number, w: number, h: number, wob = 1, passes = 2): string {
    return this.poly(
      [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
      ],
      true,
      wob,
      passes,
    );
  }

  /** A loose freehand ellipse that overshoots its starting point, like a quick pen circle. */
  ellipse(cx: number, cy: number, rx: number, ry: number, wob = 1, passes = 1): string {
    let d = "";
    for (let p = 0; p < passes; p++) {
      const steps = Math.max(10, Math.round((rx + ry) / 4));
      const start = this.rand() * Math.PI * 2;
      const overshoot = 0.15 + this.rand() * 0.25;
      const pts: Pt[] = [];
      for (let i = 0; i <= steps; i++) {
        const a = start + (i / steps) * (Math.PI * 2 + overshoot);
        const k = 1 + this.j(0.025) + this.j(wob / Math.max(rx, 1)) * 0.6;
        pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
      }
      d += smooth(pts);
    }
    return d;
  }

  /** Smooth freehand curve through the given points. */
  curve(points: Pt[], wob = 1): string {
    return smooth(points.map(([x, y]) => [x + this.j(wob), y + this.j(wob)] as Pt));
  }

  /** Diagonal hatching inside a rectangle, used for shadows and texture. */
  hatch(x: number, y: number, w: number, h: number, gap = 6, wob = 0.6, angle: "down" | "up" = "down"): string {
    let d = "";
    for (let o = -h; o < w; o += gap + this.j(gap * 0.25)) {
      let x1 = x + o;
      let y1 = y;
      let x2 = x + o + h;
      let y2 = y + h;
      if (x1 < x) {
        y1 = y + (x - x1);
        x1 = x;
      }
      if (x2 > x + w) {
        y2 = y + h - (x2 - (x + w));
        x2 = x + w;
      }
      if (y2 - y1 < 2) continue;
      if (angle === "up") {
        const fy1 = y + h - (y1 - y);
        const fy2 = y + h - (y2 - y);
        d += this.stroke(x1, fy1, x2, fy2, wob);
      } else d += this.stroke(x1, y1, x2, y2, wob);
    }
    return d;
  }
}

/** Catmull-Rom spline converted to cubic Béziers. */
export function smooth(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${r1(c1x)} ${r1(c1y)} ${r1(c2x)} ${r1(c2y)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}
