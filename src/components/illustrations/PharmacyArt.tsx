import { Sketch } from "@/lib/sketch";
import { P, Wash, Occlude, box, quad, palette as c } from "./ink";

/**
 * Pharmacy illustrations — clean whites, sage and HelloKhata green, drawn in ink.
 * Medicine packs carry no brand names or fake label text.
 */

const sage = "#cfe3d6";
const white = "#fbfcfa";
const blue = "#24346b";

function MedRow({ s, x, y, w, seed }: { s: Sketch; x: number; y: number; w: number; seed: number }) {
  const out: React.ReactNode[] = [];
  let cx = x + 4;
  let i = seed;
  while (cx < x + w - 22) {
    const tall = i % 5 === 3;
    const bw = tall ? 14 : 18 + (i % 3) * 4;
    const bh = tall ? 30 : 16 + (i % 4) * 3;
    const tint = [white, sage, "#d9eef0", white, "#e8efe0", "#f6e9e3"][i % 6];
    out.push(
      <g key={cx}>
        <Wash d={box(cx + 1, y - bh + 1, bw - 2, bh - 2)} fill={tint} o={0.95} />
        <P d={s.rect(cx, y - bh, bw, bh, 0.3, 1)} w={0.9} />
        {!tall && <P d={s.line(cx + 2, y - bh + 5, cx + bw - 2, y - bh + 5, 0.1, 1)} w={1.6} c={[c.leaf, c.teal, c.vermilion, c.sky][i % 4]} o={0.7} />}
        {tall && <P d={s.rect(cx + 3, y - bh - 5, bw - 6, 5, 0.1, 1)} w={0.8} />}
      </g>,
    );
    cx += bw + 3;
    i++;
  }
  return (
    <g>
      {out}
      <P d={s.line(x, y, x + w, y, 0.4)} w={1.3} />
      <P d={s.line(x + 2, y + 4, x + w - 2, y + 4, 0.2, 1)} w={0.6} />
    </g>
  );
}

/* ---------------- Hero: pharmacy counter ---------------- */
export function PharmacyCounterArt({ className, alt }: { className?: string; alt: string }) {
  const s = new Sketch(2101);
  return (
    <svg viewBox="0 0 760 560" className={className} role="img" aria-label={alt}>
      <g filter="url(#hk-wobble)" className="text-ink">
        <Wash d={box(20, 20, 720, 380)} fill="#eef4ef" o={0.7} />
        {/* Green cross sign */}
        <Wash d={box(60, 34, 56, 56)} fill={c.leaf} o={0.9} />
        <P d={s.rect(58, 32, 60, 60, 0.4)} w={1.5} />
        <path d="M80 44h16v14h14v16H96v14H80V74H66V58h14z" fill={white} />
        {/* Medicine shelves */}
        <MedRow s={s} x={140} y={92} w={580} seed={1} />
        <MedRow s={s} x={40} y={150} w={680} seed={4} />
        <MedRow s={s} x={40} y={208} w={680} seed={2} />
        <MedRow s={s} x={40} y={266} w={680} seed={7} />
        <MedRow s={s} x={40} y={324} w={680} seed={3} />
        {/* Pharmacist in a white coat */}
        <Occlude d="M150 404 C152 366 170 344 198 338 L232 338 C260 344 278 366 280 404 Z" />
        <Wash d="M150 404 C152 366 170 344 198 338 L232 338 C260 344 278 366 280 404 Z" fill={white} o={1} />
        <P d={s.curve([[150, 404], [152, 366], [170, 344], [198, 338], [232, 338], [260, 344], [278, 366], [280, 404]], 0.4)} w={1.5} />
        <P d={s.poly([[198, 339], [215, 372], [232, 339]], false, 0.3, 1)} w={1.2} />
        <Wash d="M206 352 L215 372 L224 352 Z" fill={c.leaf} o={0.8} />
        <P d={s.line(215, 372, 215, 404, 0.2, 1)} w={0.9} />
        <P d={s.rect(240, 362, 16, 8, 0.2, 1)} w={0.9} />
        <Occlude d={s.ellipse(215, 304, 28, 30, 0)} />
        <Wash d={s.ellipse(215, 306, 25, 27, 0.2)} fill={c.clay} o={0.45} />
        <P d={s.curve([[190, 294], [189, 316], [199, 332], [215, 336], [231, 332], [241, 316], [240, 294]], 0.4)} w={1.4} />
        <Wash d="M188 300 C186 266 244 266 242 300 C236 284 196 284 188 300 Z" fill={c.ink} o={0.8} />
        <P d={s.ellipse(205, 306, 6, 5, 0.2)} w={1.1} />
        <P d={s.ellipse(225, 306, 6, 5, 0.2)} w={1.1} />
        <P d={s.line(211, 306, 219, 306, 0.1, 1)} w={1} />
        <P d={s.curve([[207, 320], [215, 324], [223, 320]], 0.2)} w={1.2} />
        {/* Glass counter */}
        <Occlude d={box(20, 404, 720, 156)} />
        <Wash d={box(22, 418, 716, 140)} fill="#dcebe3" o={0.55} />
        <P d={s.poly([[30, 404], [732, 404], [740, 418], [20, 418]], true, 0.6)} w={1.6} />
        <P d={s.rect(20, 418, 720, 142, 0.6)} w={1.6} />
        <P d={s.line(20, 488, 740, 488, 0.4)} w={1} />
        {[60, 200, 340, 480, 620].map((x) => (
          <P key={x} d={s.line(x, 426, x + 40, 480, 0.3, 1)} w={0.7} c={white} o={0.9} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i}>
            <Wash d={box(40 + i * 56, 444, 34, 30)} fill={[white, sage, "#d9eef0"][i % 3]} o={0.95} />
            <P d={s.rect(40 + i * 56, 444, 34, 30, 0.2, 1)} w={0.8} />
          </g>
        ))}
        {/* Prescription slip and stock ledger on the counter */}
        <g transform="rotate(-6 92 392)">
          <path d={box(54, 360, 76, 44)} fill={white} />
          <P d={s.rect(54, 360, 76, 44, 0.3)} w={1.2} />
          <text x="60" y="376" fontSize="12" fill={c.leafDeep} style={{ fontFamily: "var(--font-tiro)" }}>
            Rx
          </text>
          {[382, 390, 398].map((y) => (
            <P key={y} d={s.curve([[60, y], [80, y - 1.5], [100, y + 1], [124, y - 1]], 0.3)} w={0.8} c={blue} />
          ))}
        </g>
        <Wash d={quad([[296, 404], [380, 404], [376, 393], [300, 392]])} fill={c.vermilion} o={0.8} />
        <path d={quad([[302, 402], [336, 402], [336, 394], [306, 394]])} fill={white} />
        <path d={quad([[340, 402], [374, 402], [370, 394], [340, 394]])} fill={white} />
      </g>
    </svg>
  );
}

/* ---------------- Medicine shelf (inventory section) ---------------- */
const medShelfSpots = { paracetamol: 66, omeprazole: 166, metformin: 264, cetirizine: 358, ors: 452 } as const;
export function MedicineShelfArt({ className }: { className?: string }) {
  const s = new Sketch(2201);
  const pack = (x: number, w: number, h: number, stripe: string, tint: string, k: string) => (
    <g key={k}>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Wash d={box(x - w / 2 + i * 4, 196 - h - i * 6 + 1, w - 2, h - 2)} fill={tint} o={1} />
          <P d={s.rect(x - w / 2 + i * 4, 196 - h - i * 6, w, h, 0.3)} w={1.1} />
          <P d={s.line(x - w / 2 + i * 4 + 4, 196 - h - i * 6 + 8, x + w / 2 + i * 4 - 4, 196 - h - i * 6 + 8, 0.1, 1)} w={2.4} c={stripe} />
        </g>
      ))}
    </g>
  );
  return (
    <svg viewBox="0 70 520 160" className={className} aria-hidden="true">
      <g filter="url(#hk-wobble)" className="text-ink">
        {pack(medShelfSpots.paracetamol, 64, 46, c.leaf, white, "pc")}
        {pack(medShelfSpots.omeprazole, 60, 52, c.teal, sage, "om")}
        {pack(medShelfSpots.metformin, 62, 42, c.sky, "#d9eef0", "mf")}
        {pack(medShelfSpots.cetirizine, 50, 36, c.vermilion, white, "cz")}
        {/* ORS sachets */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <Wash d={quad([[medShelfSpots.ors - 30 + i * 6, 196 - i * 3], [medShelfSpots.ors + 18 + i * 6, 196 - i * 3], [medShelfSpots.ors + 14 + i * 6, 150 - i * 3], [medShelfSpots.ors - 26 + i * 6, 150 - i * 3]])} fill={["#fbe7c4", "#f8dca6"][i % 2]} o={1} />
            <P d={s.poly([[medShelfSpots.ors - 30 + i * 6, 196 - i * 3], [medShelfSpots.ors + 18 + i * 6, 196 - i * 3], [medShelfSpots.ors + 14 + i * 6, 150 - i * 3], [medShelfSpots.ors - 26 + i * 6, 150 - i * 3]], true, 0.3)} w={1} />
          </g>
        ))}
        <Wash d={box(8, 198, 504, 16)} fill={c.clay} o={0.5} />
        <P d={s.rect(8, 196, 504, 18, 0.6)} w={1.6} />
        <P d={s.hatch(10, 214, 500, 14, 6, 0.4)} w={0.6} o={0.4} />
      </g>
    </svg>
  );
}

/* ---------------- Fictional prescription for the OCR demo ---------------- */
/**
 * Regions (viewBox 400×520) for each extracted field, used to draw highlight boxes.
 * Handwritten text uses fixed `textLength`, so these boxes stay aligned whatever the font metrics.
 */
export const rxRegions: Record<number, Record<"medicine" | "strength" | "instructions" | "frequency" | "duration", [number, number, number, number]>> = {
  1: { medicine: [116, 181, 162, 30], strength: [280, 181, 68, 30], frequency: [130, 213, 64, 28], instructions: [198, 213, 92, 28], duration: [294, 213, 80, 28] },
  2: { medicine: [116, 271, 162, 30], strength: [280, 271, 64, 30], frequency: [130, 303, 64, 28], instructions: [198, 303, 120, 28], duration: [322, 303, 66, 28] },
  3: { medicine: [116, 361, 162, 30], strength: [280, 361, 60, 30], frequency: [130, 393, 64, 28], instructions: [198, 393, 80, 28], duration: [282, 393, 80, 28] },
};

const pen = "#1d3290";
const teal = "#0b5960";

/** One stroke of ballpoint handwriting; `len` fixes the rendered width. */
function Hand({ x, y, len, size = 19, rot = 0, o = 0.92, children }: { x: number; y: number; len?: number; size?: number; rot?: number; o?: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fill={pen}
      fillOpacity={o}
      textLength={len}
      lengthAdjust={len ? "spacingAndGlyphs" : undefined}
      transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}
      style={{ fontFamily: "var(--font-scrawl), var(--font-galada), cursive" }}
    >
      {children}
    </text>
  );
}

export function PrescriptionSlip({ className, alt }: { className?: string; alt: string }) {
  const s = new Sketch(2401);
  const print = { fontFamily: "var(--font-manrope)" } as const;
  return (
    <svg viewBox="0 0 400 520" className={className} role="img" aria-label={alt}>
      <defs>
        <linearGradient id="rx-paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf6" />
          <stop offset="1" stopColor="#f6f1e4" />
        </linearGradient>
        <linearGradient id="rx-fold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0.06" />
          <stop offset="0.52" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Paper with a soft fold across the middle */}
      <rect x="0" y="0" width="400" height="520" fill="url(#rx-paper)" />
      <rect x="0" y="246" width="400" height="24" fill="url(#rx-fold)" />

      {/* Printed letterhead (fictional) */}
      <rect x="0" y="0" width="400" height="6" fill={teal} />
      <text x="20" y="34" fontSize="16" fill={teal} style={{ ...print, fontWeight: 800 }}>
        Dr. Sample Physician
      </text>
      <text x="20" y="50" fontSize="9" fill="#44524b" style={print}>
        MBBS (Demo) · Medicine Specialist
      </text>
      <text x="20" y="63" fontSize="9" fill="#44524b" style={print}>
        Reg. No. DEMO-0000
      </text>
      <text x="380" y="34" fontSize="17" fill={teal} textAnchor="end" style={{ fontFamily: "var(--font-tiro)" }}>
        ডা. নমুনা চিকিৎসক
      </text>
      <text x="380" y="50" fontSize="9.5" fill="#44524b" textAnchor="end" style={{ fontFamily: "var(--font-hind)" }}>
        এমবিবিএস (নমুনা) · মেডিসিন
      </text>
      <text x="380" y="63" fontSize="9" fill="#44524b" textAnchor="end" style={print}>
        Chamber: Sample Clinic, Demo Road
      </text>
      <line x1="16" y1="76" x2="384" y2="76" stroke={teal} strokeWidth="1.6" />
      <line x1="16" y1="79.5" x2="384" y2="79.5" stroke={teal} strokeWidth="0.6" />

      {/* Patient row: printed labels, handwritten values */}
      <g fontSize="9.5" fill="#44524b" style={print}>
        <text x="20" y="104">Name:</text>
        <text x="214" y="104">Age:</text>
        <text x="282" y="104">Date:</text>
      </g>
      <g stroke="#9aa39e" strokeWidth="0.7" strokeDasharray="1.5 2.5">
        <line x1="50" y1="107" x2="206" y2="107" />
        <line x1="236" y1="107" x2="274" y2="107" />
        <line x1="308" y1="107" x2="382" y2="107" />
      </g>
      <Hand x={56} y={103} len={104} size={17} rot={-1.5}>
        Sample Patient
      </Hand>
      <Hand x={240} y={103} len={28} size={16}>
        34y
      </Hand>
      <Hand x={312} y={103} len={62} size={16} rot={-2}>
        20/10/26
      </Hand>
      <line x1="16" y1="118" x2="384" y2="118" stroke="#c9d1cc" strokeWidth="0.8" />

      {/* Left notes column */}
      <line x1="104" y1="118" x2="104" y2="470" stroke="#c9d1cc" strokeWidth="0.8" />
      <g fontSize="9.5" fill={teal} style={{ ...print, fontWeight: 700 }}>
        <text x="16" y="142">C/C</text>
        <text x="16" y="232">O/E</text>
        <text x="16" y="326">Adv</text>
      </g>
      <Hand x={20} y={162} len={64} size={15} rot={-3}>
        Fever - 3d
      </Hand>
      <Hand x={22} y={182} len={52} size={15} rot={-2}>
        Acidity
      </Hand>
      <Hand x={20} y={252} len={70} size={14} rot={-2}>
        BP 120/80
      </Hand>
      <Hand x={20} y={272} len={70} size={14} rot={-3}>
        Temp 101°F
      </Hand>
      <Hand x={20} y={346} len={40} size={15} rot={-2}>
        CBC
      </Hand>
      <Hand x={18} y={366} len={78} size={13} rot={-3}>
        plenty of water
      </Hand>

      {/* ℞ */}
      <text x="114" y="160" fontSize="30" fill={teal} style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 700 }}>
        R
      </text>
      <path d="M131 152 l12 14 M140 152 l-8 13" stroke={teal} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Medicines — fast ballpoint, slightly uneven */}
      <g transform="rotate(-0.8 250 300)">
        <Hand x={120} y={204} len={154} size={21}>
          Tab. Paracetamol
        </Hand>
        <Hand x={284} y={204} len={58} size={20} rot={-2}>
          500mg
        </Hand>
        <Hand x={134} y={235} len={54} size={18}>
          1+0+1
        </Hand>
        <Hand x={202} y={235} len={84} size={17} rot={-1}>
          after meal
        </Hand>
        <Hand x={298} y={235} len={70} size={17} rot={-2}>
          x 5 days
        </Hand>

        <Hand x={120} y={294} len={154} size={21} rot={0.6}>
          Cap. Omeprazole
        </Hand>
        <Hand x={284} y={294} len={54} size={19} o={0.62} rot={-3}>
          2o mg
        </Hand>
        <Hand x={134} y={325} len={54} size={18}>
          1+0+0
        </Hand>
        <Hand x={202} y={325} len={112} size={17} rot={-1}>
          before breakfast
        </Hand>
        <Hand x={326} y={325} len={58} size={16} rot={-2}>
          x 14 d
        </Hand>

        <Hand x={120} y={384} len={34} size={21}>
          Tab.
        </Hand>
        {/* An illegible scrawl, deliberately unreadable */}
        <path d="M162 380 c4 -16 9 8 13 -6 c3 -10 6 12 11 -2 c4 -12 7 10 12 -4 c3 -8 6 11 11 0 c4 -9 6 6 10 -2 c3 -6 8 8 14 2 c6 -4 10 -2 16 -6" fill="none" stroke={pen} strokeOpacity="0.9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <Hand x={284} y={384} len={48} size={20} rot={-2}>
          10mg
        </Hand>
        <Hand x={134} y={415} len={54} size={18}>
          0+0+1
        </Hand>
        <Hand x={202} y={415} len={70} size={17} rot={-1}>
          at night
        </Hand>
        <Hand x={286} y={415} len={70} size={17} rot={-2}>
          x 7 days
        </Hand>
      </g>

      {/* Follow-up note, signature and a faded chamber stamp */}
      <Hand x={118} y={452} len={150} size={15} rot={-1.5}>
        Follow up after 7 days
      </Hand>
      <g transform="rotate(-14 330 468)" opacity="0.42">
        <circle cx="330" cy="468" r="30" fill="none" stroke="#6b3fa0" strokeWidth="1.6" />
        <circle cx="330" cy="468" r="24" fill="none" stroke="#6b3fa0" strokeWidth="0.7" />
        <text x="330" y="465" fontSize="8" fill="#6b3fa0" textAnchor="middle" style={{ ...print, fontWeight: 800, letterSpacing: "0.12em" }}>
          SAMPLE
        </text>
        <text x="330" y="476" fontSize="6" fill="#6b3fa0" textAnchor="middle" style={{ ...print, fontWeight: 700 }}>
          NOT FOR USE
        </text>
      </g>
      <path d="M290 470 c6 -22 14 -20 12 -4 c-2 10 -8 12 -2 2 c6 -10 12 -14 16 -6 c3 6 -2 10 2 6 c6 -8 10 -10 14 -4 s6 4 14 -6 c4 -4 8 -2 14 -6" fill="none" stroke={pen} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={s.line(286, 478, 384, 478, 0.4)} fill="none" stroke="#9aa39e" strokeWidth="0.7" />
      <text x="335" y="490" fontSize="8" fill="#44524b" textAnchor="middle" style={print}>
        Signature
      </text>

      {/* Footer */}
      <line x1="0" y1="500" x2="400" y2="500" stroke={teal} strokeWidth="0.8" />
      <text x="200" y="513" fontSize="8" fill="#6a756f" textAnchor="middle" style={print}>
        Demonstration prescription — fictional, not a real doctor or patient
      </text>
    </svg>
  );
}
