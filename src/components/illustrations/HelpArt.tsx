import { Sketch } from "@/lib/sketch";
import { P, Wash, Occlude, box, quad, palette as c } from "./ink";

const white = "#fbfcfa";

/**
 * Help Center hero — a shopkeeper at the counter asks a question on the phone,
 * and an answer comes back in a green bubble. Tea steams beside an open guide.
 */
export function HelpDeskArt({ className, alt }: { className?: string; alt: string }) {
  const s = new Sketch(3301);
  return (
    <svg viewBox="0 0 640 462" className={className} role="img" aria-label={alt}>
      {/* Back wall */}
      <g filter="url(#hk-wobble)" className="text-ink">
        <Wash d="M48 70 C120 34 520 30 596 66 L604 340 L40 344 Z" fill="#e8f2ea" o={0.85} />
        {/* Shelf with a few jars and boxes */}
        <P d={s.line(64, 172, 230, 170, 0.5)} w={1.4} />
        {[
          [72, 22, 30, c.rice],
          [100, 26, 22, c.marigold],
          [132, 20, 34, "#d9eef0"],
          [158, 30, 18, c.vermilion],
          [194, 24, 26, c.leafWash],
        ].map(([x, w, h, fill], i) => (
          <g key={i}>
            <Wash d={box(x as number, 170 - (h as number), w as number, h as number)} fill={fill as string} o={0.8} />
            <P d={s.rect(x as number, 170 - (h as number), w as number, h as number, 0.3, 1)} w={1} />
          </g>
        ))}
        {/* Hanging bulb */}
        <P d={s.line(296, 30, 296, 70, 0.2, 1)} w={1} />
        <Wash d={s.ellipse(296, 84, 11, 13, 0.2)} fill={c.marigold} o={0.6} />
        <P d={s.ellipse(296, 84, 11, 13, 0.3)} w={1.2} />
        <P d={s.rect(290, 66, 12, 8, 0.2, 1)} w={1} />
      </g>

      {/* Question bubble (bobs gently) */}
      <g className="hk-bob">
        <g filter="url(#hk-wobble)" className="text-ink">
          <Occlude d="M70 214 C64 150 86 120 150 118 C214 116 236 146 232 196 C230 236 204 250 166 252 L148 286 L140 252 C96 252 74 244 70 214 Z" />
          <Wash d="M70 214 C64 150 86 120 150 118 C214 116 236 146 232 196 C230 236 204 250 166 252 L148 286 L140 252 C96 252 74 244 70 214 Z" fill={c.marigold} o={0.35} />
          <P d={s.curve([[140, 252], [96, 252], [74, 244], [70, 214], [64, 150], [86, 120], [150, 118], [214, 116], [236, 146], [232, 196], [230, 236], [204, 250], [166, 252]], 0.5)} w={1.6} />
          <P d={s.poly([[140, 252], [148, 286], [166, 252]], false, 0.4, 1)} w={1.6} />
          {/* Big question mark */}
          <path d="M128 168 C128 140 176 138 176 164 C176 184 152 184 152 206" fill="none" stroke={c.ink} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="152" cy="226" r="5" fill={c.ink} />
        </g>
      </g>

      {/* Answer bubble (rises in) */}
      <g className="hk-rise" style={{ animationDelay: "0.6s" }}>
        <g filter="url(#hk-wobble)" className="text-ink">
          <Occlude d="M384 118 C384 92 400 80 428 80 L566 80 C592 80 604 94 604 120 L604 190 C604 214 590 226 564 226 L452 226 L412 258 L420 226 C398 226 384 214 384 192 Z" />
          <Wash d="M384 118 C384 92 400 80 428 80 L566 80 C592 80 604 94 604 120 L604 190 C604 214 590 226 564 226 L452 226 L412 258 L420 226 C398 226 384 214 384 192 Z" fill={c.leaf} o={0.85} />
          <P d={s.curve([[420, 226], [398, 226], [384, 214], [384, 192], [384, 118], [384, 92], [400, 80], [428, 80], [566, 80], [592, 80], [604, 94], [604, 120], [604, 190], [604, 214], [590, 226], [564, 226], [452, 226]], 0.5)} w={1.6} c={c.leafDeep} />
          <P d={s.poly([[420, 226], [412, 258], [452, 226]], false, 0.4, 1)} w={1.6} c={c.leafDeep} />
          {/* Tick + answer lines */}
          <circle cx="424" cy="122" r="17" fill={white} />
          <path d="M415 122 l6 7 l12 -14" fill="none" stroke={c.leafDeep} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          {[
            [452, 114, 128],
            [452, 132, 96],
            [408, 166, 168],
            [408, 186, 120],
            [408, 206, 146],
          ].map(([x, y, w], i) => (
            <P key={i} d={s.line(x, y, x + w, y + (i % 2 ? 1 : -1), 0.4, 1)} w={i < 2 ? 4 : 3} c={white} o={i < 2 ? 1 : 0.85} />
          ))}
        </g>
      </g>

      {/* Lightbulb idea doodle */}
      <g filter="url(#hk-wobble)" className="text-ink">
        <P d={s.ellipse(340, 160, 14, 16, 0.3)} w={1.3} />
        <P d={s.line(334, 178, 346, 178, 0.2, 1)} w={1.2} />
        <P d={s.line(335, 184, 345, 184, 0.2, 1)} w={1.2} />
        {[
          [340, 132, 340, 122],
          [318, 142, 310, 135],
          [362, 142, 370, 135],
          [314, 162, 304, 162],
          [366, 162, 376, 162],
        ].map(([x1, y1, x2, y2], i) => (
          <P key={i} d={s.line(x1, y1, x2, y2, 0.2, 1)} w={1.4} c={c.marigold} />
        ))}
      </g>

      {/* Phone → answer: dashed ink path */}
      <path d="M386 272 C400 262 404 250 410 240" fill="none" stroke={c.leafDeep} strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" className="hk-flow" />

      {/* Shopkeeper */}
      <g filter="url(#hk-wobble)" className="text-ink">
        <Occlude d="M226 344 C228 300 248 276 280 270 L320 270 C352 276 372 300 374 344 Z" />
        <Wash d="M226 344 C228 300 248 276 280 270 L320 270 C352 276 372 300 374 344 Z" fill={c.teal} o={0.55} />
        <P d={s.curve([[226, 344], [228, 300], [248, 276], [280, 270], [320, 270], [352, 276], [372, 300], [374, 344]], 0.4)} w={1.5} />
        <P d={s.poly([[284, 271], [300, 296], [316, 271]], false, 0.3, 1)} w={1.2} />
        {[302, 316, 330].map((y) => (
          <circle key={y} cx="300" cy={y} r="1.8" fill={c.ink} />
        ))}
        {/* Head */}
        <Occlude d={s.ellipse(300, 234, 30, 32, 0)} />
        <Wash d={s.ellipse(300, 236, 27, 29, 0.2)} fill={c.clay} o={0.5} />
        <P d={s.curve([[273, 222], [272, 246], [283, 262], [300, 267], [317, 262], [328, 246], [327, 222]], 0.4)} w={1.4} />
        <Wash d="M271 228 C266 192 334 190 329 228 C322 210 280 210 271 228 Z" fill={c.ink} o={0.85} />
        <P d={s.curve([[288, 234], [291, 231], [294, 234]], 0.1)} w={1.3} />
        <P d={s.curve([[306, 234], [309, 231], [312, 234]], 0.1)} w={1.3} />
        <P d={s.curve([[290, 250], [300, 256], [310, 250]], 0.2)} w={1.3} />
        <P d={s.curve([[284, 244], [282, 246]], 0.1)} w={1} c={c.vermilion} o={0.6} />
        {/* Arm up to the phone */}
        <Occlude d="M340 300 C352 296 364 300 370 312 L360 322 C354 314 346 312 338 314 Z" />
        <P d={s.curve([[336, 292], [352, 300], [364, 312]], 0.3)} w={1.5} />
        <P d={s.curve([[340, 312], [352, 314], [360, 322]], 0.3)} w={1.5} />
      </g>

      {/* Phone */}
      <g transform="rotate(-14 376 292)">
        <rect x="360" y="258" width="34" height="62" rx="7" fill={c.ink} />
        <rect x="363.5" y="264" width="27" height="48" rx="3" fill={c.leafWash} />
        <rect x="367" y="270" width="16" height="5" rx="2" fill={white} opacity="0.9" />
        <rect x="370" y="280" width="17" height="5" rx="2" fill={white} opacity="0.7" />
        <rect x="367" y="290" width="12" height="5" rx="2" fill={white} opacity="0.9" />
        <circle cx="377" cy="316" r="1.6" fill={white} opacity="0.6" />
      </g>
      <g filter="url(#hk-wobble)" className="text-ink">
        <Wash d={s.ellipse(366, 318, 10, 8, 0.2)} fill={c.clay} o={0.6} />
        <P d={s.ellipse(366, 318, 10, 8, 0.3)} w={1.3} />
      </g>

      {/* Counter */}
      <g filter="url(#hk-wobble)" className="text-ink">
        <Occlude d={box(30, 344, 580, 106)} />
        <Wash d={box(34, 360, 572, 88)} fill={c.clay} o={0.35} />
        <Wash d={quad([[38, 344], [602, 344], [610, 360], [30, 360]])} fill={c.clay} o={0.6} />
        <P d={s.poly([[38, 344], [602, 344], [610, 360], [30, 360]], true, 0.5)} w={1.6} />
        <P d={s.rect(30, 360, 580, 90, 0.5)} w={1.6} />
        {/* Drawers */}
        {[48, 232, 416].map((x) => (
          <g key={x}>
            <Wash d={box(x, 374, 176, 62)} fill={c.clay} o={0.3} />
            <P d={s.rect(x, 374, 176, 62, 0.4, 1)} w={1.1} />
            <P d={s.line(x + 72, 392, x + 104, 392, 0.2, 1)} w={2.2} />
          </g>
        ))}

        {/* Open guide book */}
        <Wash d={quad([[96, 342], [170, 334], [172, 300], [100, 306]])} fill={white} o={1} />
        <Wash d={quad([[170, 334], [244, 342], [240, 306], [172, 300]])} fill={white} o={1} />
        <P d={s.poly([[96, 342], [170, 334], [244, 342], [240, 306], [172, 300], [100, 306]], true, 0.4)} w={1.4} />
        <P d={s.line(171, 300, 170, 334, 0.2, 1)} w={1.2} />
        {[312, 320, 328].map((y, i) => (
          <g key={y}>
            <P d={s.line(108, y + 1, 160, y - 3, 0.3, 1)} w={0.9} c={c.leafDeep} o={0.7} />
            {i < 2 && <P d={s.line(182, y - 3, 232, y + 1, 0.3, 1)} w={0.9} c={c.leafDeep} o={0.7} />}
          </g>
        ))}
        <Wash d={quad([[214, 298], [222, 298], [222, 318], [218, 314], [214, 318]])} fill={c.vermilion} o={0.9} />

        {/* Tea on a saucer */}
        <Wash d={s.ellipse(486, 342, 34, 7, 0.2)} fill={white} o={1} />
        <P d={s.ellipse(486, 342, 34, 7, 0.4)} w={1.3} />
        <Occlude d="M464 306 L508 306 L502 338 C496 343 476 343 470 338 Z" />
        <Wash d="M464 306 L508 306 L502 338 C496 343 476 343 470 338 Z" fill={white} o={1} />
        <P d={s.poly([[464, 306], [470, 338], [502, 338], [508, 306]], false, 0.4)} w={1.4} />
        <Wash d={s.ellipse(486, 307, 22, 4, 0.1)} fill={c.clay} o={0.9} />
        <P d={s.ellipse(486, 306, 22, 4, 0.3)} w={1.2} />
        <P d={s.curve([[506, 314], [520, 314], [518, 328], [503, 328]], 0.3)} w={1.4} />
        <Wash d={box(474, 318, 24, 6)} fill={c.leaf} o={0.5} />

        {/* Small potted plant */}
        <Wash d={quad([[548, 344], [584, 344], [580, 316], [552, 316]])} fill={c.vermilion} o={0.6} />
        <P d={s.poly([[548, 344], [584, 344], [580, 316], [552, 316]], true, 0.4)} w={1.4} />
        {[
          [[566, 316], [556, 290], [544, 280]],
          [[566, 316], [568, 286], [574, 270]],
          [[566, 316], [578, 296], [592, 290]],
        ].map((pts, i) => (
          <g key={i}>
            <Wash d={`M${pts[0].join(" ")} Q${pts[1].join(" ")} ${pts[2].join(" ")} Q${pts[1][0] + 8} ${pts[1][1] + 8} ${pts[0].join(" ")}Z`} fill={c.leafWash} o={0.9} />
            <P d={s.curve(pts as [number, number][], 0.3)} w={1.2} c={c.leafDeep} />
          </g>
        ))}
      </g>

      {/* Tea steam */}
      {[476, 488, 500].map((x, i) => (
        <path key={x} d={`M${x} 298 c-6 -8 6 -12 0 -20 s6 -12 0 -20`} fill="none" stroke={c.ink} strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" className="hk-steam" style={{ animationDelay: `${i * 0.9}s` }} />
      ))}
    </svg>
  );
}
