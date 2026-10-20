/**
 * Single source of truth for what HelloKhata can do today.
 *
 * PRODUCT TEAM: every status below must be verified against the live product before launch.
 * The marketing site reads only from here, so flipping a value updates every badge, page and map.
 *
 *  - "available": shipped and usable by customers
 *  - "beta":      usable by selected customers, may change
 *  - "planned":   on the roadmap, not usable yet
 *
 * Defaults are deliberately conservative: core features that were already on the site are
 * "available"; every new Super Shop, Online Store and Social Commerce module is "planned"
 * until confirmed. Nothing here is a claim about the live product.
 */

export type Status = "available" | "beta" | "planned";

export const productGroups = ["core", "supershop", "online", "social"] as const;
export type ProductGroup = (typeof productGroups)[number];

export const modulesByGroup = {
  core: ["pos", "inventory", "purchases", "expenses", "customers", "reports", "assistant"],
  supershop: ["multiBranch", "warehouse", "integratedPos", "centralInventory", "hrm", "bulkSms", "consolidatedReports", "roleAccess"],
  online: ["builder", "themes", "customDomain", "payments", "courier", "orderSync"],
  social: ["inbox", "aiAgent", "contentStudio", "socialManager", "adsManager", "crm", "ordersRetention"],
} as const;

export type ModuleId = (typeof modulesByGroup)[ProductGroup][number] | "batchExpiry" | "prescriptionOcr";
export type ChannelId = "messenger" | "instagram" | "whatsapp" | "metaAds" | "paymentGateway" | "courierPartner";

export const moduleStatus: Record<ModuleId, Status> = {
  // Core business management (already presented as available on the site)
  pos: "available",
  inventory: "available",
  purchases: "available",
  expenses: "available",
  customers: "available",
  reports: "available",
  assistant: "available",
  batchExpiry: "available",
  // Confirmed live by the product team. The demo shows medicine, strength, instructions, frequency and duration — confirm those fields match the real OCR output.
  prescriptionOcr: "available",
  // Super Shop
  multiBranch: "available",
  warehouse: "available",
  integratedPos: "available",
  centralInventory: "available",
  hrm: "available",
  bulkSms: "available",
  consolidatedReports: "available",
  roleAccess: "available",
  // Online Store
  builder: "planned",
  themes: "planned",
  customDomain: "planned",
  payments: "planned",
  courier: "planned",
  orderSync: "planned",
  // Social Commerce
  inbox: "planned",
  aiAgent: "planned",
  contentStudio: "planned",
  socialManager: "planned",
  adsManager: "planned",
  crm: "planned",
  ordersRetention: "planned",
};

/** Third-party channels and services. No integration is presented as live until verified. */
export const channelStatus: Record<ChannelId, Status> = {
  messenger: "planned",
  instagram: "planned",
  whatsapp: "planned",
  metaAds: "planned",
  paymentGateway: "planned",
  courierPartner: "planned",
};

/** Overall status of a product group = best status among its modules. */
export function groupStatus(group: ProductGroup): Status {
  const s = modulesByGroup[group].map((m) => moduleStatus[m as ModuleId]);
  return s.includes("available") ? "available" : s.includes("beta") ? "beta" : "planned";
}
