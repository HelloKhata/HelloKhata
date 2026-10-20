import { ImageResponse } from "next/og";

export const alt = "HelloKhata — Your business, in your language";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social preview card. Latin text only: the OG renderer has no Bengali font bundled,
 * and we never want to ship broken conjuncts in a share image.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F7F2E7", padding: 80, color: "#17221C" }}>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
          <span>Hello</span>
          <span style={{ color: "#15803D" }}>Khata</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.05, fontWeight: 700, letterSpacing: -2 }}>Your business,</div>
          <div style={{ fontSize: 84, lineHeight: 1.05, fontWeight: 700, letterSpacing: -2, color: "#15803D" }}>in your language.</div>
          <svg width="520" height="28" viewBox="0 0 300 20" style={{ marginTop: 12 }}>
            <path d="M3 12 C 60 4, 120 18, 180 9 S 260 7, 297 11" fill="none" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ fontSize: 30, color: "#5C665F" }}>Voice-first, AI-powered business management · Made in Bangladesh</div>
      </div>
    ),
    size,
  );
}
