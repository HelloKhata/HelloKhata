/**
 * Pricing configuration.
 * `price: null` renders "price to be announced". Set real numbers (BDT per month)
 * and flip `isPlaceholder` to false once plans are approved for publication.
 */
export type PlanKey = "starter" | "growth" | "business";

export const pricingConfig: {
  isPlaceholder: boolean;
  plans: { key: PlanKey; price: number | null; highlighted: boolean }[];
} = {
  isPlaceholder: true,
  plans: [
    { key: "starter", price: null, highlighted: false },
    { key: "growth", price: null, highlighted: true },
    { key: "business", price: null, highlighted: false },
  ],
};

/**
 * Which plan includes which solution module.
 * null = "to be confirmed" (the honest default until plans are approved).
 */
export type Entitlement = "included" | "addon" | "unavailable" | null;
export const moduleEntitlements: Record<"core" | "supershop" | "online" | "social", Record<PlanKey, Entitlement>> = {
  core: { starter: "included", growth: "included", business: "included" },
  supershop: { starter: null, growth: null, business: null },
  online: { starter: null, growth: null, business: null },
  social: { starter: null, growth: null, business: null },
};
