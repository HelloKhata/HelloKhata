# HelloKhata — marketing website

Bilingual (বাংলা / English) marketing site for HelloKhata, built with Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS 4 and Motion (Framer Motion).

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /bn
npm run lint
npm run typecheck
npm run build && npm start
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` before deploying (used for canonical URLs, hreflang, sitemap and Open Graph).

## Structure

| Path | What lives there |
|---|---|
| `messages/bn.json`, `messages/en.json` | **All** user-facing copy. `src/i18n/dictionaries.ts` type-checks that both files have the same keys. |
| `src/app/[locale]/…` | Pages: home, features (+7), solutions (+6: grocery & retail, pharmacy, super shop, online seller, F-commerce seller, other), pricing, how-it-works, about, resources, contact, sign-in, get-started, privacy, terms. |
| `src/components/{supershop,online,social}` | Flagship demos: multi-branch dashboard with stock transfers, HRM, bulk SMS (real Unicode/GSM segment maths), role matrix; storefront builder with drag-reorder, themes, domain/checkout/courier demos; shared inbox driven by sample stock, content studio, calendar, ads, CRM, orders. |
| `src/middleware.ts` | Redirects locale-less URLs to `/bn` (or the visitor's saved choice). |
| `src/components/illustrations/` | Hand-drawn SVG artwork. `src/lib/sketch.ts` is a seeded "ink" generator — every line is drawn as a wobbling double pen stroke, deterministic across server/client. Signboard lettering is real Bengali text. |
| `src/components/home/` | Homepage sections, incl. the scroll-driven ledger transformation and the voice demo. |
| `src/components/product/AppPreview.tsx` | Interactive app mock (Dashboard / Sales / Inventory / Reports). |
| `src/content/` | Config and data: sample demo data, pricing config, per-category capability status, voice-demo intents. |
| `src/lib/api.ts` | Backend integration points (see below). |

## Honest by default — things to confirm before launch

These are deliberately conservative placeholders. Nothing on the site fabricates customers, results, prices or success states.

1. **Logo & favicon** — `src/components/ui/Wordmark.tsx` sets "HelloKhata" in type, and `src/app/icon.svg` is a neutral placeholder (green ink stroke). Replace both with the official brand assets.
2. **Pricing** — `src/content/pricing.ts` has `isPlaceholder: true` and `price: null` (renders "price to be announced" plus a notice). Plan names, entitlements and AI allowances in `messages/*.json → pricing` are placeholders.
3. **Capability status (most important)** — `src/content/capabilities.ts` is the single source of truth for every module and channel (available / beta / planned). Core features default to *available*; every Super Shop, Online Store and Social Commerce module and every channel (Messenger, Instagram, WhatsApp, Meta Ads, payment gateways, couriers) defaults to *planned*, except Integrated POS. Flip values there and every badge, page, map and pricing row updates. No third-party logos are used.
3b. **Plan entitlements** — `src/content/pricing.ts → moduleEntitlements` (null renders “to be confirmed”).
4. **Trust copy** — `messages/*.json → home.trust.principles` describes intended principles (answers from your records, authorised access, Bangla support). Confirm with the product/legal team.
5. **Testimonials** — `src/components/home/TrustSection.tsx → testimonials` is empty, so a designed placeholder shows. Add only approved stories.
6. **Legal pages** — privacy/terms are clearly marked drafts and are `noindex`. They need legal review.
7. **Social links** — `src/lib/site.ts → socialLinks` is empty; add only official accounts.
8. **Bangla copy** — written as natural Bangla, but should still get a final review by a Bangla editor.

## Backend integration

`src/lib/api.ts` exposes `submitContact`, `signIn` and `signUp`. When `NEXT_PUBLIC_HELLOKHATA_API_URL` is empty (the default), they return `{ status: "not-connected" }` and the forms say clearly that **nothing was sent or saved**. The endpoint paths are placeholders — align them with the real API contract. After a successful `signIn`, redirect to the app (see the comment in `AuthForms.tsx`).

The voice section is a **scripted demo**: it never touches the microphone, never plays sound, and answers only from `src/content/demo-data.ts`. A real integration would replace `runQuestion` in `VoiceDemo.tsx` with speech-to-text + the assistant API.

## Motion & accessibility

- `MotionConfig reducedMotion="user"` plus a CSS `prefers-reduced-motion` rule; the pinned ledger and growth sequences fall back to static layouts.
- The hero headline animates with CSS so it paints before hydration.
- Keyboard: skip link, focus-visible rings, arrow-key tabs in the app preview, Esc closes menus, focus-trapped mobile menu.
- One animation library (Motion); GSAP was not needed.
