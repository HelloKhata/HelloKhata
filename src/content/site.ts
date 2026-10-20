import type { ModuleId, ProductGroup } from "./capabilities";

export const featureSlugs = ["sales", "inventory", "purchases", "expenses", "customers", "reports", "assistant"] as const;
export type FeatureSlug = (typeof featureSlugs)[number];

/** Business segments. The first five are flagship solutions with dedicated experiences. */
export const categorySlugs = ["grocery", "pharmacy", "supershop", "online-store", "f-commerce", "other"] as const;
export type CategorySlug = (typeof categorySlugs)[number];
export const flagshipSlugs = ["grocery", "pharmacy", "supershop", "online-store", "f-commerce"] as const satisfies readonly CategorySlug[];

export const relatedFeatures: Record<FeatureSlug, FeatureSlug[]> = {
  sales: ["inventory", "customers", "assistant"],
  inventory: ["purchases", "sales", "reports"],
  purchases: ["inventory", "expenses", "reports"],
  expenses: ["reports", "purchases", "assistant"],
  customers: ["sales", "reports", "assistant"],
  reports: ["sales", "expenses", "assistant"],
  assistant: ["reports", "sales", "inventory"],
};

/** Which product group each segment mainly uses, and the modules shown on its page. */
export const categoryGroup: Record<CategorySlug, ProductGroup> = {
  grocery: "core",
  pharmacy: "core",
  supershop: "supershop",
  "online-store": "online",
  "f-commerce": "social",
  other: "core",
};

export const categoryModules: Record<CategorySlug, ModuleId[]> = {
  grocery: ["pos", "inventory", "purchases", "expenses", "customers", "reports", "assistant"],
  pharmacy: ["pos", "inventory", "batchExpiry", "prescriptionOcr", "purchases", "customers", "reports", "assistant"],
  supershop: ["multiBranch", "warehouse", "integratedPos", "centralInventory", "hrm", "bulkSms", "consolidatedReports", "roleAccess"],
  "online-store": ["builder", "themes", "customDomain", "payments", "courier", "orderSync"],
  "f-commerce": ["inbox", "aiAgent", "contentStudio", "socialManager", "adsManager", "crm", "ordersRetention"],
  other: ["pos", "inventory", "purchases", "expenses", "customers", "reports", "assistant"],
};

/** Each segment gets its own accent within the HelloKhata palette. */
export const categoryAccent: Record<CategorySlug, { tint: string; ink: string; soft: string }> = {
  grocery: { tint: "#16a34a", ink: "#0f5f2e", soft: "#dcfce7" },
  pharmacy: { tint: "#0e7c86", ink: "#0b5960", soft: "#d5f1f2" },
  supershop: { tint: "#b45309", ink: "#7c3a06", soft: "#f8e7bf" },
  "online-store": { tint: "#2563eb", ink: "#1d4ed8", soft: "#dbe6fe" },
  "f-commerce": { tint: "#7c3aed", ink: "#5b21b6", soft: "#ede4fd" },
  other: { tint: "#57534e", ink: "#3a3632", soft: "#ebe7e0" },
};
