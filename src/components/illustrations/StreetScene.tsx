import { Sketch } from "@/lib/sketch";
import { P, Wash, Occlude, box, quad, palette as c } from "./ink";

/**
 * The hero street — an old-Dhaka corner drawn in ink on paper.
 * ViewBox 0 0 1440 600, ground line at y = 560.
 *
 * Layers are exported separately so the client stage can parallax and reveal them.
 * Signboard lettering is real Bengali text (not traced glyphs), so it is always correct.
 */

/* ------------------------------------------------------------------ */
/* Background: distant rooftops, a mosque, water tanks                 */
/* ------------------------------------------------------------------ */
export function StreetBack() {
  const s = new Sketch(11);
  const els: React.ReactNode[] = [];
  const add = (d: string, w = 1.1) => els.push(<P key={els.length} d={d} w={w} />);

  // Mosque with dome and minaret
  add(s.rect(20, 190, 110, 370, 0.8));
  add(s.curve([[20, 191], [28, 156], [52, 134], [75, 128], [98, 134], [122, 156], [130, 191]], 0.6));
  add(s.line(75, 128, 75, 104, 0.5));
  add(s.ellipse(75, 101, 3.5, 3.5, 0.3));
  for (let i = 0; i < 3; i++) {
    const x = 36 + i * 30;
    add(s.curve([[x, 300], [x, 262], [x + 9, 250], [x + 18, 262], [x + 18, 300]], 0.4));
  }
  add(s.rect(138, 110, 14, 450, 0.6));
  add(s.curve([[134, 111], [140, 96], [145, 86], [150, 96], [156, 111]], 0.4));
  add(s.line(130, 182, 160, 182, 0.4));
  add(s.line(130, 188, 160, 188, 0.4));

  // Tall block with balcony and water tank
  add(s.rect(162, 118, 168, 442, 0.9));
  for (let r = 0; r < 4; r++)
    for (let col = 0; col < 3; col++) {
      const x = 180 + col * 50;
      const y = 140 + r * 60;
      add(s.rect(x, y, 30, 36, 0.5));
      add(s.line(x + 15, y + 2, x + 15, y + 34, 0.3, 1));
    }
  add(s.line(166, 252, 326, 252, 0.6));
  for (let x = 170; x < 326; x += 9) add(s.line(x, 252, x, 274, 0.3, 1));
  add(s.line(166, 274, 326, 274, 0.6));
  add(s.ellipse(290, 98, 22, 5, 0.3));
  add(s.line(268, 98, 268, 116, 0.3));
  add(s.line(312, 98, 312, 116, 0.3));
  add(s.curve([[268, 116], [290, 121], [312, 116]], 0.3));
  add(s.line(200, 118, 200, 96, 0.3, 1));
  add(s.line(200, 96, 214, 104, 0.3, 1));

  // Narrow block with an AC unit
  add(s.rect(338, 168, 100, 392, 0.8));
  for (let r = 0; r < 3; r++) {
    add(s.rect(354, 190 + r * 58, 28, 34, 0.5));
    add(s.rect(398, 190 + r * 58, 28, 34, 0.5));
  }
  add(s.rect(396, 300, 34, 20, 0.4));
  add(s.hatch(398, 302, 30, 16, 4, 0.3));

  // Block with grilled windows
  add(s.rect(446, 136, 150, 424, 0.8));
  for (let r = 0; r < 4; r++)
    for (let col = 0; col < 2; col++) {
      const x = 466 + col * 64;
      const y = 160 + r * 56;
      add(s.rect(x, y, 44, 34, 0.5));
      for (let k = 1; k < 4; k++) add(s.line(x + k * 11, y + 1, x + k * 11, y + 33, 0.25, 1));
    }

  // Far right block behind the rickshaw
  add(s.rect(1312, 100, 128, 460, 0.8));
  for (let r = 0; r < 3; r++) {
    add(s.rect(1330, 124 + r * 64, 34, 40, 0.5));
    add(s.rect(1384, 124 + r * 64, 34, 40, 0.5));
  }

  return <g>{els}</g>;
}

/* ------------------------------------------------------------------ */
/* Wires and crows — drawn above the buildings                          */
/* ------------------------------------------------------------------ */
export function StreetWires() {
  const s = new Sketch(29);
  const crow = (x: number, y: number, flip = 1) => (
    <path
      key={`crow-${x}`}
      transform={`translate(${x} ${y}) scale(${flip} 1)`}
      d="M-9 -4c3-4 9-5 12-2 2-2 5-2 6 0l4 1-4 1c0 4-3 8-8 9l-2 5h-1l1-5c-4 0-7-2-9-5l-6 2c2-2 4-4 7-6Z"
      fill={c.ink}
    />
  );
  return (
    <g>
      {/* Pole */}
      <P d={s.line(575, 0, 575, 560, 0.5)} w={2.4} />
      <P d={s.line(580, 4, 580, 560, 0.5, 1)} w={1} />
      <P d={s.line(552, 40, 602, 38, 0.5)} w={1.6} />
      <P d={s.line(556, 60, 598, 59, 0.5)} w={1.4} />
      <P d={s.rect(562, 98, 30, 40, 0.5)} w={1.2} />
      <P d={s.hatch(564, 100, 26, 36, 5, 0.4)} w={0.6} o={0.6} />
      {/* Wires */}
      <P d={s.curve([[0, 70], [140, 98], [300, 112], [460, 86], [560, 44]], 0.4)} w={0.9} />
      <P d={s.curve([[0, 96], [160, 126], [300, 140], [470, 110], [560, 60]], 0.4)} w={0.9} />
      <P d={s.curve([[0, 42], [180, 70], [340, 80], [480, 60], [560, 40]], 0.4)} w={0.8} />
      <P d={s.curve([[590, 40], [760, 86], [900, 100], [1180, 60], [1440, 26]], 0.4)} w={0.9} />
      <P d={s.curve([[590, 58], [780, 108], [940, 118], [1200, 84], [1440, 52]], 0.4)} w={0.9} />
      {/* The famous Dhaka tangle */}
      <P d={s.ellipse(548, 72, 20, 10, 0.6)} w={0.8} />
      <P d={s.ellipse(556, 80, 14, 8, 0.6)} w={0.8} />
      <P d={s.curve([[530, 66], [520, 92], [540, 120], [566, 112], [574, 90]], 0.5)} w={0.8} />
      <P d={s.curve([[598, 62], [612, 90], [604, 118], [588, 128]], 0.5)} w={0.8} />
      {crow(990, 96)}
      {crow(1024, 90, -1)}
      {crow(1092, 76)}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Midground: pharmacy, general store, apartment, rickshaw             */
/* ------------------------------------------------------------------ */
export function StreetMid() {
  return (
    <g>
      <PharmacyKiosk />
      <GeneralStore />
      <Apartment />
      <Rickshaw />
      <Ground />
    </g>
  );
}

function PharmacyKiosk() {
  const s = new Sketch(41);
  return (
    <g>
      <Occlude d={quad([[25, 392], [375, 378], [375, 560], [25, 560]])} />
      {/* Sign on the roof with a green cross */}
      <Wash d={box(102, 334, 176, 38)} fill={c.teal} o={0.75} />
      <P d={s.rect(100, 332, 180, 42, 0.8)} w={1.5} />
      <path d="M118 346h8v-6h8v6h8v8h-8v6h-8v-6h-8z" fill={c.cream} />
      <text x="208" y="360" textAnchor="middle" fontSize="22" fill={c.cream} style={{ fontFamily: "var(--font-tiro)" }}>
        ফার্মেসি
      </text>
      <P d={s.line(124, 374, 122, 386, 0.4)} />
      <P d={s.line(256, 374, 258, 384, 0.4)} />
      {/* Tin roof */}
      <Wash d={quad([[25, 392], [375, 378], [375, 388], [25, 402]])} fill="#9BA7A0" o={0.5} />
      <P d={s.poly([[22, 392], [378, 377], [378, 388], [22, 403]], true, 0.8)} w={1.6} />
      {Array.from({ length: 22 }, (_, i) => (
        <P key={i} d={s.line(36 + i * 16, 391 - i * 0.62, 36 + i * 16, 401 - i * 0.62, 0.3, 1)} w={0.7} />
      ))}
      {/* Posts and back shelves of medicine boxes */}
      <P d={s.line(52, 402, 52, 560, 0.6)} w={1.6} />
      <P d={s.line(348, 389, 348, 560, 0.6)} w={1.6} />
      {[424, 448].map((y) => (
        <P key={y} d={s.line(60, y, 340, y, 0.4)} w={1} />
      ))}
      {Array.from({ length: 2 }, (_, r) =>
        Array.from({ length: 12 }, (_, i) => {
          const x = 66 + i * 23;
          const y = 405 + r * 24;
          return (
            <g key={`${r}-${i}`}>
              <Wash d={box(x + 1, y + 1, 14, 16)} fill={[c.teal, c.cream, c.sky, c.marigold, c.vermilion][(i + r * 2) % 5]} o={0.6} />
              <P d={s.rect(x, y, 16, 18, 0.3, 1)} w={0.8} />
            </g>
          );
        }),
      )}
      {/* Glass cabinet counter */}
      <Wash d={box(80, 466, 250, 94)} fill="#CFE6E7" o={0.45} />
      <P d={s.rect(80, 464, 250, 96, 0.9)} w={1.6} />
      <P d={s.line(80, 500, 330, 500, 0.5)} w={1} />
      {[100, 150, 210, 270].map((x) => (
        <P key={x} d={s.line(x, 470, x + 22, 494, 0.3, 1)} w={0.7} o={0.6} c={c.cream} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <Wash d={box(92 + i * 29, 478, 20, 14)} fill={[c.marigold, c.teal, c.vermilion, c.sky][i % 4]} o={0.6} />
          <P d={s.rect(92 + i * 29, 478, 20, 14, 0.2, 1)} w={0.8} />
        </g>
      ))}
      <P d={s.hatch(250, 504, 76, 52, 6, 0.4)} w={0.6} o={0.55} />
      {/* Prescription pad and a green-cross lightbox on the counter */}
      <path d={box(118, 452, 30, 12)} fill={c.cream} />
      <P d={s.rect(118, 452, 30, 12, 0.3)} w={1} />
      <P d={s.line(122, 457, 142, 457, 0.2, 1)} w={0.6} c="#24346b" />
      <Wash d={box(286, 438, 26, 26)} fill={c.leaf} o={0.85} />
      <P d={s.rect(286, 438, 26, 26, 0.3)} w={1.2} />
      <path d="M296 443h6v6h6v6h-6v6h-6v-6h-6v-6h6z" fill={c.cream} />
      {/* Bench and sleeping cat */}
      <P d={s.rect(118, 528, 206, 8, 0.6)} w={1.4} />
      <P d={s.line(134, 536, 132, 576, 0.4)} w={1.4} />
      <P d={s.line(308, 536, 310, 576, 0.4)} w={1.4} />
      <P d={s.line(132, 556, 310, 556, 0.4, 1)} w={0.9} />
      <Wash d={s.ellipse(292, 518, 22, 10, 0.2)} fill={c.marigold} o={0.7} />
      <P d={s.curve([[272, 524], [270, 512], [286, 507], [306, 508], [314, 520], [304, 528], [280, 528]], 0.4)} w={1.3} />
      <P d={s.ellipse(272, 516, 8, 7, 0.3)} w={1.2} />
      <P d={s.poly([[266, 511], [267, 503], [271, 509]], false, 0.2, 1)} w={1} />
      <P d={s.poly([[274, 509], [278, 502], [279, 510]], false, 0.2, 1)} w={1} />
      <P d={s.curve([[312, 524], [318, 530], [310, 534], [290, 532]], 0.3)} w={1.1} />
    </g>
  );
}

function GeneralStore() {
  const s = new Sketch(73);
  const jars = [];
  for (let x = 664, i = 0; x < 1070; x += 34, i++) {
    const h = 26 + ((i * 7) % 8);
    const tint = [c.rice, c.marigold, c.leafWash, c.vermilion, c.rice][i % 5];
    jars.push(
      <g key={`j${x}`}>
        <Wash d={box(x + 2, 272 - h + 2, 22, h - 3)} fill={tint} o={0.5} />
        <P d={s.rect(x, 272 - h, 26, h, 0.5)} w={1.1} />
        <P d={s.rect(x - 1, 268 - h, 28, 4, 0.3, 1)} w={1} />
      </g>,
    );
  }
  const bottles = [];
  for (let x = 660, i = 0; x < 1080; x += 24, i++) {
    if (x > 820 && x < 900) continue; // behind the shopkeeper
    const tint = i % 3 === 0 ? c.leafWash : c.marigold;
    bottles.push(
      <g key={`b${x}`}>
        <Wash d={box(x + 1, 302, 14, 24)} fill={tint} o={0.55} />
        <P d={s.rect(x, 300, 16, 27, 0.4)} w={1} />
        <P d={s.rect(x + 5, 290, 6, 10, 0.3, 1)} w={0.9} />
      </g>,
    );
  }
  const boxes = [];
  for (let x = 652, i = 0; x < 1080; i++) {
    const w = 30 + ((i * 13) % 22);
    const h = 28 + ((i * 11) % 18);
    if (!(x > 806 && x < 912)) {
      const tint = [c.vermilion, c.sky, c.marigold, c.leafWash, c.plum][i % 5];
      boxes.push(
        <g key={`x${x}`}>
          <Wash d={box(x + 2, 382 - h + 2, w - 4, h - 4)} fill={tint} o={0.45} />
          <P d={s.rect(x, 382 - h, w, h, 0.5)} w={1.1} />
          <P d={s.line(x + 5, 382 - h / 2, x + w - 5, 382 - h / 2, 0.3, 1)} w={0.7} />
        </g>,
      );
    }
    x += w + 4;
  }
  const strip = (x: number, seedTint: number) =>
    Array.from({ length: 9 }, (_, i) => {
      const y = 222 + i * 19;
      const tint = [c.vermilion, c.marigold, c.leafWash][(i + seedTint) % 3];
      return (
        <g key={`${x}-${i}`}>
          <Wash d={box(x + 1, y + 1, 18, 15)} fill={tint} o={0.7} />
          <P d={s.rect(x, y, 20, 17, 0.5)} w={1} />
        </g>
      );
    });
  const garland = Array.from({ length: 14 }, (_, i) => {
    const t = i / 13;
    const x = 692 + t * 360;
    const y = 220 + Math.sin(t * Math.PI) * 18;
    const tint = [c.sky, c.vermilion, c.marigold][i % 3];
    return (
      <g key={`g${i}`}>
        <Wash d={quad([[x, y], [x + 7, y + 9], [x, y + 18], [x - 7, y + 9]])} fill={tint} o={0.7} />
        <P d={s.poly([[x, y], [x + 7, y + 9], [x, y + 18], [x - 7, y + 9]], true, 0.3, 1)} w={0.9} />
      </g>
    );
  });

  return (
    <g>
      <Occlude d={box(600, 20, 540, 540)} />
      {/* Upper floor */}
      <P d={s.rect(600, 20, 540, 110, 0.8)} w={1.6} />
      {[640, 760, 880, 1000].map((x) => (
        <g key={x}>
          <P d={s.curve([[x, 106], [x, 58], [x + 8, 44], [x + 40, 38], [x + 72, 44], [x + 80, 58], [x + 80, 106]], 0.4)} w={1.2} />
          <P d={s.line(x, 106, x + 80, 106, 0.4)} w={1.2} />
          {[1, 2, 3].map((k) => (
            <P key={k} d={s.line(x + k * 20, 48, x + k * 20, 105, 0.3, 1)} w={0.7} />
          ))}
        </g>
      ))}
      {/* Signboard — real Bengali lettering */}
      <Wash d={box(612, 132, 516, 60)} fill={c.leaf} o={0.82} />
      <P d={s.rect(610, 130, 520, 64, 0.8)} w={1.8} />
      <text x="870" y="174" textAnchor="middle" fontSize="36" fill={c.cream} style={{ fontFamily: "var(--font-tiro)" }}>
        নতুন বাজার জেনারেল স্টোর
      </text>
      <P d={s.ellipse(632, 162, 8, 8, 0.4)} w={1.2} c={c.cream} />
      <P d={s.ellipse(1108, 162, 8, 8, 0.4)} w={1.2} c={c.cream} />
      {/* Rolled shutter */}
      <P d={s.rect(615, 194, 510, 16, 0.5)} w={1.3} />
      {[198, 202, 206].map((y) => (
        <P key={y} d={s.line(618, y, 1122, y, 0.4, 1)} w={0.6} />
      ))}
      {/* Opening, walls and back wall */}
      <P d={s.line(625, 210, 625, 560, 0.6)} w={1.6} />
      <P d={s.line(1115, 210, 1115, 560, 0.6)} w={1.6} />
      <P d={s.line(645, 222, 645, 432, 0.5)} w={0.9} />
      <P d={s.line(1095, 222, 1095, 432, 0.5)} w={0.9} />
      <P d={s.line(645, 222, 1095, 222, 0.5)} w={0.9} />
      {[272, 327, 382].map((y) => (
        <g key={y}>
          <P d={s.line(645, y, 1095, y, 0.5)} w={1.3} />
          <P d={s.line(647, y + 5, 1093, y + 5, 0.4, 1)} w={0.7} />
        </g>
      ))}
      {jars}
      {bottles}
      {boxes}
      {strip(650, 0)}
      {strip(1072, 1)}
      <P d={s.curve([[690, 216], [780, 232], [870, 238], [960, 232], [1052, 216]], 0.4)} w={0.8} />
      {garland}
      <Shopkeeper s={s} />
      {/* Counter */}
      <Occlude d={box(662, 432, 416, 128)} />
      <Wash d={box(664, 446, 412, 112)} fill={c.clay} o={0.36} />
      <P d={s.poly([[672, 432], [1068, 432], [1078, 444], [662, 444]], true, 0.6)} w={1.6} />
      <P d={s.rect(662, 444, 416, 116, 0.7)} w={1.6} />
      {[714, 766, 818, 922, 974, 1026].map((x) => (
        <P key={x} d={s.line(x, 446, x, 558, 0.4, 1)} w={0.7} />
      ))}
      <P d={s.hatch(980, 460, 94, 96, 6, 0.4)} w={0.6} o={0.5} />
      <text x="870" y="512" textAnchor="middle" fontSize="17" fill={c.ink} opacity="0.75" style={{ fontFamily: "var(--font-galada)" }}>
        সততাই উত্তম পন্থা
      </text>
      <Ledger s={s} />
      {/* Candy jar */}
      <Wash d={box(702, 402, 22, 28)} fill={c.vermilion} o={0.35} />
      <P d={s.rect(700, 400, 26, 32, 0.4)} w={1.2} />
      <P d={s.rect(698, 395, 30, 5, 0.3, 1)} w={1.1} />
      {[[707, 412], [717, 418], [709, 424], [719, 408]].map(([x, y]) => (
        <P key={`${x}${y}`} d={s.ellipse(x, y, 3, 3, 0.2)} w={0.8} />
      ))}
      {/* Weighing scale (daripalla) */}
      <P d={s.line(1000, 432, 1000, 368, 0.4)} w={1.6} />
      <P d={s.line(960, 370, 1040, 370, 0.4)} w={1.6} />
      <P d={s.ellipse(1000, 366, 4, 4, 0.2)} w={1.2} />
      {[964, 1036].map((x) => (
        <g key={x}>
          <P d={s.line(x, 371, x - 12, 404, 0.3, 1)} w={0.8} />
          <P d={s.line(x, 371, x + 12, 404, 0.3, 1)} w={0.8} />
          <Wash d={s.ellipse(x, 406, 15, 4, 0.1)} fill={c.marigold} o={0.6} />
          <P d={s.ellipse(x, 406, 15, 4, 0.3)} w={1.2} />
        </g>
      ))}
      {/* Rice and lentil sacks with price tags (sample prices) */}
      <Sack s={s} x={612} tint={c.rice} grain="#F3E9D2" tag="৳৭৮" />
      <Sack s={s} x={1060} tint={c.marigold} grain="#E8B562" tag="৳১৪০" />
    </g>
  );
}

function Shopkeeper({ s }: { s: Sketch }) {
  const body = "M808 432 C810 405 826 388 848 382 L872 382 C896 388 910 405 912 432 Z";
  return (
    <g>
      <Occlude d={body} />
      <Occlude d={s.ellipse(860, 350, 26, 27, 0)} />
      <Wash d={body} fill={c.sky} o={0.5} />
      <P d={s.curve([[808, 432], [810, 405], [826, 388], [848, 382]], 0.4)} w={1.5} />
      <P d={s.curve([[872, 382], [896, 388], [910, 405], [912, 432]], 0.4)} w={1.5} />
      <P d={s.poly([[849, 383], [860, 399], [871, 383]], false, 0.3, 1)} w={1.1} />
      <P d={s.line(860, 399, 860, 430, 0.3, 1)} w={0.8} />
      <P d={s.ellipse(860, 408, 1.3, 1.3, 0.1)} w={1} />
      <P d={s.ellipse(860, 420, 1.3, 1.3, 0.1)} w={1} />
      {/* Head */}
      <Wash d={s.ellipse(860, 352, 23, 25, 0.2)} fill={c.clay} o={0.45} />
      <P d={s.curve([[837, 342], [836, 362], [846, 376], [860, 379], [874, 376], [884, 362], [883, 342]], 0.4)} w={1.4} />
      <P d={s.line(853, 379, 853, 386, 0.2, 1)} w={1.1} />
      <P d={s.line(867, 379, 867, 386, 0.2, 1)} w={1.1} />
      {/* Prayer cap (tupi) */}
      <path d="M835 344 C836 326 847 318 860 318 C873 318 884 326 885 344 Z" fill={c.cream} />
      <P d={s.curve([[835, 344], [836, 326], [847, 318], [860, 318], [873, 318], [884, 326], [885, 344]], 0.3)} w={1.4} />
      <P d={s.line(836, 343, 884, 343, 0.3)} w={1.1} />
      <P d={s.curve([[842, 334], [860, 330], [878, 334]], 0.3)} w={0.6} o={0.6} />
      {/* Face */}
      <P d={s.line(849, 352, 854, 352, 0.2, 1)} w={1.4} />
      <P d={s.line(866, 352, 871, 352, 0.2, 1)} w={1.4} />
      <P d={s.curve([[858, 354], [856, 362], [860, 364]], 0.2)} w={1} />
      <P d={s.curve([[849, 367], [855, 364], [860, 366], [865, 364], [871, 367]], 0.2)} w={1.6} />
      <P d={s.curve([[884, 350], [889, 352], [886, 360], [882, 361]], 0.2)} w={1.1} />
      {/* Arms */}
      <P d={s.curve([[822, 398], [814, 414], [818, 430]], 0.3)} w={1.3} />
      <P d={s.curve([[898, 398], [890, 414], [874, 422], [868, 424]], 0.3)} w={1.3} />
      <P d={s.ellipse(866, 425, 5, 4, 0.2)} w={1.2} />
      <P d={s.line(864, 422, 856, 429, 0.1, 1)} w={1.6} />
    </g>
  );
}

function Ledger({ s }: { s: Sketch }) {
  return (
    <g>
      <Wash d={quad([[784, 435], [898, 435], [892, 418], [792, 416]])} fill={c.vermilion} o={0.85} />
      <path d={quad([[790, 432], [838, 432], [840, 416], [796, 418]])} fill={c.cream} />
      <path d={quad([[842, 432], [892, 432], [884, 418], [842, 416]])} fill={c.cream} />
      <P d={s.poly([[790, 432], [838, 432], [840, 416], [796, 418]], true, 0.3)} w={1.1} />
      <P d={s.poly([[842, 432], [892, 432], [884, 418], [842, 416]], true, 0.3)} w={1.1} />
      <P d={s.line(784, 435, 898, 435, 0.3)} w={1.2} />
      {[421, 425, 429].map((y) => (
        <g key={y}>
          <P d={s.curve([[799, y], [806, y - 1], [812, y + 0.5], [820, y - 1], [832, y]], 0.2)} w={0.6} />
          <P d={s.curve([[846, y], [852, y - 1], [860, y + 0.5], [872, y - 1], [880, y]], 0.2)} w={0.6} />
        </g>
      ))}
    </g>
  );
}

function Sack({ s, x, tint, grain, tag }: { s: Sketch; x: number; tint: string; grain: string; tag: string }) {
  const outline = `M${x} 560 C${x - 4} 520 ${x - 2} 498 ${x + 6} 488 L${x + 66} 488 C${x + 74} 498 ${x + 76} 520 ${x + 72} 560 Z`;
  return (
    <g>
      <Occlude d={outline} />
      <Wash d={outline} fill={tint} o={0.55} />
      <P d={s.curve([[x, 560], [x - 4, 520], [x - 2, 498], [x + 6, 488]], 0.4)} w={1.4} />
      <P d={s.curve([[x + 66, 488], [x + 74, 498], [x + 76, 520], [x + 72, 560]], 0.4)} w={1.4} />
      <P d={s.curve([[x + 4, 497], [x + 36, 501], [x + 70, 497]], 0.3)} w={1.1} />
      <path d={`M${x + 6} 490 C${x + 18} 476 ${x + 30} 482 ${x + 40} 474 C${x + 52} 480 ${x + 60} 478 ${x + 66} 490 Z`} fill={grain} />
      <P d={s.curve([[x + 6, 490], [x + 18, 476], [x + 30, 482], [x + 40, 474], [x + 52, 480], [x + 60, 478], [x + 66, 490]], 0.3)} w={1.1} />
      <path d={box(x + 22, 452, 34, 20)} fill={c.cream} />
      <P d={s.rect(x + 22, 452, 34, 20, 0.3)} w={1} />
      <P d={s.line(x + 39, 472, x + 39, 484, 0.2, 1)} w={1} />
      <text x={x + 39} y={466} textAnchor="middle" fontSize="11" fill={c.ink} style={{ fontFamily: "var(--font-hind)" }}>
        {tag}
      </text>
    </g>
  );
}

function Apartment() {
  const s = new Sketch(97);
  return (
    <g>
      <Occlude d={box(1146, 40, 166, 520)} />
      <P d={s.rect(1146, 40, 166, 520, 0.8)} w={1.5} />
      {[70, 140].map((y) => (
        <g key={y}>
          <P d={s.rect(1168, y, 40, 46, 0.4)} w={1.1} />
          <P d={s.rect(1250, y, 40, 46, 0.4)} w={1.1} />
        </g>
      ))}
      {/* Balcony with plants */}
      <P d={s.line(1150, 232, 1308, 232, 0.5)} w={1.4} />
      {Array.from({ length: 17 }, (_, i) => (
        <P key={i} d={s.line(1154 + i * 9, 232, 1154 + i * 9, 256, 0.3, 1)} w={0.7} />
      ))}
      <P d={s.line(1150, 256, 1308, 256, 0.5)} w={1.4} />
      {[1172, 1228, 1280].map((x, i) => (
        <g key={x}>
          <Wash d={s.ellipse(x, 214, 18, 14, 0.4)} fill={c.leafWash} o={0.7} />
          <P d={s.curve([[x, 230], [x - 10, 214], [x - 16, 200]], 0.4)} w={1.1} />
          <P d={s.curve([[x, 230], [x + 2, 210], [x + 4, 194]], 0.4)} w={1.1} />
          <P d={s.curve([[x, 230], [x + 12, 216], [x + 18, 204]], 0.4)} w={1.1} />
          <Wash d={quad([[x - 9, 222], [x + 9, 222], [x + 7, 232], [x - 7, 232]])} fill={c.clay} o={0.8} />
          <P d={s.poly([[x - 9, 222], [x + 9, 222], [x + 7, 232], [x - 7, 232]], true, 0.2, 1)} w={1} />
          {i === 1 && <P d={s.ellipse(x + 4, 200, 4, 4, 0.2)} w={1} c={c.vermilion} />}
        </g>
      ))}
      {/* Laundry line with a gamchha */}
      <P d={s.curve([[1150, 282], [1228, 292], [1308, 282]], 0.3)} w={0.8} />
      <Wash d={quad([[1196, 288], [1240, 290], [1238, 338], [1198, 336]])} fill={c.vermilion} o={0.65} />
      {[1205, 1214, 1223, 1232].map((x) => (
        <P key={x} d={s.line(x, 290, x, 336, 0.3, 1)} w={0.9} c={c.leafDeep} o={0.7} />
      ))}
      {[300, 312, 324].map((y) => (
        <P key={y} d={s.line(1198, y, 1238, y, 0.3, 1)} w={0.9} c={c.leafDeep} o={0.7} />
      ))}
      <P d={s.poly([[1196, 288], [1240, 290], [1238, 338], [1198, 336]], true, 0.3, 1)} w={1} />
      <Wash d={quad([[1258, 288], [1282, 288], [1284, 326], [1256, 326]])} fill={c.sky} o={0.55} />
      <P d={s.poly([[1258, 288], [1282, 288], [1284, 326], [1256, 326]], true, 0.3, 1)} w={1} />
      {/* Half-open shutter */}
      <P d={s.rect(1166, 380, 128, 180, 0.6)} w={1.3} />
      {Array.from({ length: 11 }, (_, i) => (
        <P key={i} d={s.line(1168, 386 + i * 8, 1292, 386 + i * 8, 0.3, 1)} w={0.6} />
      ))}
      <P d={s.hatch(1168, 480, 124, 78, 5, 0.4)} w={0.6} o={0.7} />
    </g>
  );
}

function Rickshaw() {
  const s = new Sketch(131);
  const wheel = (cx: number, cy: number, r: number, spokes: number) => (
    <g>
      <P d={s.ellipse(cx, cy, r, r, 0.6)} w={1.8} />
      <P d={s.ellipse(cx, cy, r - 6, r - 6, 0.5)} w={0.9} />
      {Array.from({ length: spokes }, (_, i) => {
        const a = (i / spokes) * Math.PI * 2;
        return <P key={i} d={s.line(cx, cy, cx + Math.cos(a) * (r - 6), cy + Math.sin(a) * (r - 6), 0.2, 1)} w={0.6} />;
      })}
      <P d={s.ellipse(cx, cy, 5, 5, 0.2)} w={1.2} />
    </g>
  );
  const hood = "M1318 432 C1318 384 1338 336 1384 324 C1410 318 1424 338 1424 360 L1424 432 Z";
  return (
    <g>
      <Occlude d={hood} />
      <Wash d={hood} fill={c.marigold} o={0.62} />
      <Wash d="M1330 400 C1340 360 1360 340 1390 334 L1396 350 C1370 356 1352 376 1346 404 Z" fill={c.vermilion} o={0.7} />
      <P d={s.curve([[1318, 432], [1318, 384], [1338, 336], [1384, 324], [1410, 318], [1424, 338], [1424, 360]], 0.5)} w={1.7} />
      <P d={s.line(1424, 360, 1424, 432, 0.4)} w={1.5} />
      {[[1332, 430, 1356, 336], [1350, 430, 1380, 330], [1372, 430, 1402, 326]].map(([x1, y1, x2, y2], i) => (
        <P key={i} d={s.line(x1, y1, x2, y2, 0.4, 1)} w={0.8} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <P key={i} d={s.line(1324 + i * 11, 432, 1324 + i * 11, 440, 0.2, 1)} w={0.8} c={c.vermilion} />
      ))}
      {/* Seat and painted back panel */}
      <Occlude d={box(1318, 432, 92, 70)} />
      <Wash d="M1320 432 C1340 424 1390 424 1410 432 L1410 446 L1320 446 Z" fill={c.vermilion} o={0.8} />
      <P d={s.curve([[1320, 434], [1340, 424], [1390, 424], [1410, 434]], 0.3)} w={1.4} />
      <P d={s.rect(1320, 436, 90, 12, 0.4)} w={1.3} />
      <Wash d={box(1332, 470, 76, 30)} fill={c.leafWash} o={0.65} />
      <P d={s.rect(1330, 468, 80, 34, 0.4)} w={1.3} />
      <P d={s.ellipse(1370, 485, 8, 8, 0.3)} w={1} c={c.vermilion} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return <P key={i} d={s.ellipse(1370 + Math.cos(a) * 12, 485 + Math.sin(a) * 9, 4, 3, 0.2)} w={0.8} />;
      })}
      <P d={s.line(1324, 448, 1324, 470, 0.3)} w={1.2} />
      <P d={s.line(1406, 448, 1406, 470, 0.3)} w={1.2} />
      {/* Frame */}
      <P d={s.line(1212, 468, 1292, 498, 0.4)} w={1.8} />
      <P d={s.line(1292, 498, 1365, 508, 0.4)} w={1.8} />
      <P d={s.line(1292, 498, 1330, 470, 0.4)} w={1.4} />
      <P d={s.line(1292, 498, 1290, 460, 0.3)} w={1.4} />
      <P d={s.curve([[1274, 458], [1290, 452], [1306, 458]], 0.2)} w={2.2} />
      <P d={s.ellipse(1292, 500, 10, 10, 0.3)} w={1.1} />
      <P d={s.line(1284, 510, 1300, 490, 0.2, 1)} w={1.2} />
      <P d={s.line(1205, 520, 1214, 438, 0.4)} w={1.6} />
      <P d={s.line(1198, 438, 1232, 434, 0.3)} w={1.6} />
      <P d={s.ellipse(1236, 440, 3.5, 3.5, 0.2)} w={1} />
      {wheel(1365, 508, 50, 14)}
      {wheel(1205, 522, 38, 12)}
    </g>
  );
}

function Ground() {
  const s = new Sketch(151);
  return (
    <g>
      <P d={s.line(0, 560, 1440, 560, 1.2)} w={1.6} />
      {[
        [40, 580, 120],
        [380, 586, 470],
        [560, 576, 610],
        [720, 588, 820],
        [1010, 582, 1090],
        [1220, 590, 1300],
      ].map(([x1, y, x2], i) => (
        <P key={i} d={s.line(x1, y, x2, y + 1, 0.6, 1)} w={0.8} o={0.6} />
      ))}
      <P d={s.curve([[480, 570], [486, 562], [496, 566]], 0.4)} w={0.9} o={0.7} />
      <P d={s.curve([[1130, 574], [1136, 566], [1146, 568]], 0.4)} w={0.9} o={0.7} />
    </g>
  );
}
