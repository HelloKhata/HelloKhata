/** Small primitives shared by every hand-drawn illustration. */

export function P({ d, w = 1.4, o, c, className }: { d: string; w?: number; o?: number; c?: string; className?: string }) {
  return (
    <path d={d} fill="none" stroke={c ?? "currentColor"} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={o} className={className} />
  );
}

/** Watercolour wash: a soft, bleeding colour fill that sits under the ink. */
export function Wash({ d, fill, o = 0.55 }: { d: string; fill: string; o?: number }) {
  return <path d={d} fill={fill} opacity={o} filter="url(#hk-wash)" />;
}

/** Paper-coloured shape that hides background lines behind a foreground object. */
export function Occlude({ d }: { d: string }) {
  return <path d={d} fill="var(--color-paper)" />;
}

export const box = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
export const quad = (pts: [number, number][]) => `M${pts.map((p) => p.join(" ")).join("L")}Z`;

export const palette = {
  ink: "#17221C",
  leaf: "#16A34A",
  leafDeep: "#0F5F2E",
  leafWash: "#5DBB7E",
  marigold: "#E2A93B",
  vermilion: "#C9553B",
  sky: "#7FA7D9",
  rice: "#E7D7B4",
  clay: "#C9895A",
  teal: "#3E9C9F",
  plum: "#8E5A7A",
  cream: "#FFFCF5",
};
