/**
 * Sample records for the extra screens in the app preview (POS, purchases, parties, stock, finance).
 * Illustrative only — not connected to any real business — and totals agree with demo-data.ts
 * (purchases this month = today.purchasesMonth, expenses = today.expensesMonth, customer dues = today.dues).
 */
import type { CustomerKey, ProductKey, UnitKey } from "./demo-data";

export type SupplierKey = "shapla" | "karim" | "sonali";
export type ExtraPartyKey = "canteen" | "hotel" | SupplierKey;
export type PartyKey = CustomerKey | ExtraPartyKey;
export type PayMethod = "cash" | "mobile" | "bank";
export type Location = "shop" | "store";

export const quotations: { no: number; party: PartyKey; date: string; amount: number; status: "sent" | "accepted" | "expired" | "converted" }[] = [
  { no: 214, party: "canteen", date: "2026-10-19", amount: 12480, status: "sent" },
  { no: 213, party: "hotel", date: "2026-10-17", amount: 8650, status: "accepted" },
  { no: 212, party: "jamal", date: "2026-10-14", amount: 3240, status: "accepted" },
  { no: 211, party: "salma", date: "2026-10-09", amount: 1960, status: "expired" },
  { no: 210, party: "canteen", date: "2026-10-03", amount: 9800, status: "converted" },
];

export type ReturnReason = "damaged" | "wrongItem" | "expired" | "quality";
export const salesReturns: { no: number; inv: number; product: ProductKey; qty: number; unit: UnitKey; amount: number; reason: ReturnReason; date: string }[] = [
  { no: 31, inv: 1079, product: "egg", qty: 6, unit: "pcs", amount: 78, reason: "damaged", date: "2026-10-19" },
  { no: 30, inv: 1064, product: "oil", qty: 1, unit: "litre", amount: 190, reason: "wrongItem", date: "2026-10-16" },
  { no: 29, inv: 1051, product: "biscuit", qty: 4, unit: "packet", amount: 120, reason: "expired", date: "2026-10-12" },
  { no: 28, inv: 1033, product: "rice", qty: 5, unit: "kg", amount: 390, reason: "quality", date: "2026-10-07" },
];

export const purchaseDraft = {
  supplier: "shapla" as SupplierKey,
  invoice: "5521",
  lines: [
    { product: "rice" as ProductKey, qty: 250, unit: "kg" as UnitKey, cost: 66 },
    { product: "lentil" as ProductKey, qty: 50, unit: "kg" as UnitKey, cost: 118 },
    { product: "sugar" as ProductKey, qty: 50, unit: "kg" as UnitKey, cost: 118 },
  ],
  transport: 600,
  paid: 20000,
};

/** Sums to today.purchasesMonth (৳1,82,400). */
export const purchases: { no: number; supplier: SupplierKey; date: string; amount: number; paid: number }[] = [
  { no: 418, supplier: "shapla", date: "2026-10-18", amount: 28900, paid: 20000 },
  { no: 417, supplier: "sonali", date: "2026-10-16", amount: 7800, paid: 7800 },
  { no: 416, supplier: "karim", date: "2026-10-12", amount: 42600, paid: 30000 },
  { no: 415, supplier: "shapla", date: "2026-10-06", amount: 61200, paid: 61200 },
  { no: 414, supplier: "karim", date: "2026-10-02", amount: 41900, paid: 41900 },
];

export const purchaseReturns: { no: number; purchase: number; supplier: SupplierKey; product: ProductKey; qty: number; unit: UnitKey; amount: number; reason: ReturnReason; date: string }[] = [
  { no: 12, purchase: 417, supplier: "sonali", product: "egg", qty: 30, unit: "pcs", amount: 330, reason: "damaged", date: "2026-10-17" },
  { no: 11, purchase: 416, supplier: "karim", product: "flour", qty: 10, unit: "kg", amount: 560, reason: "damaged", date: "2026-10-14" },
  { no: 10, purchase: 415, supplier: "shapla", product: "salt", qty: 12, unit: "packet", amount: 420, reason: "expired", date: "2026-10-08" },
];

/** Customer balances sum to today.dues (৳12,840); supplier balances match unpaid purchases. */
export const parties: { key: PartyKey; kind: "customer" | "supplier"; phone: string; balance: number }[] = [
  { key: "rahim", kind: "customer", phone: "245", balance: 5450 },
  { key: "salma", kind: "customer", phone: "318", balance: 3120 },
  { key: "jamal", kind: "customer", phone: "702", balance: 2870 },
  { key: "nasrin", kind: "customer", phone: "169", balance: 1400 },
  { key: "canteen", kind: "customer", phone: "550", balance: 0 },
  { key: "hotel", kind: "customer", phone: "831", balance: 0 },
  { key: "karim", kind: "supplier", phone: "407", balance: 12600 },
  { key: "shapla", kind: "supplier", phone: "926", balance: 8900 },
  { key: "sonali", kind: "supplier", phone: "614", balance: 0 },
];

export const paymentsIn: { no: number; party: PartyKey; date: string; method: PayMethod; amount: number }[] = [
  { no: 96, party: "rahim", date: "2026-10-19", method: "cash", amount: 1000 },
  { no: 95, party: "jamal", date: "2026-10-15", method: "mobile", amount: 2000 },
  { no: 94, party: "canteen", date: "2026-10-11", method: "bank", amount: 9800 },
  { no: 93, party: "hotel", date: "2026-10-05", method: "mobile", amount: 6400 },
];

/** Matches what was paid on this month's purchases. */
export const paymentsOut: { no: number; party: SupplierKey; date: string; method: PayMethod; amount: number }[] = [
  { no: 58, party: "shapla", date: "2026-10-18", method: "bank", amount: 20000 },
  { no: 57, party: "sonali", date: "2026-10-16", method: "cash", amount: 7800 },
  { no: 56, party: "karim", date: "2026-10-12", method: "bank", amount: 30000 },
  { no: 55, party: "shapla", date: "2026-10-06", method: "bank", amount: 61200 },
  { no: 54, party: "karim", date: "2026-10-02", method: "bank", amount: 41900 },
];

export const batches: { product: ProductKey; batch: string; received: string; expiry: string; qty: number; unit: UnitKey }[] = [
  { product: "milk", batch: "MP-2609", received: "2026-09-12", expiry: "2026-11-30", qty: 15, unit: "packet" },
  { product: "biscuit", batch: "BS-2610", received: "2026-10-02", expiry: "2026-12-10", qty: 48, unit: "packet" },
  { product: "flour", batch: "AT-2610", received: "2026-10-06", expiry: "2027-01-05", qty: 34, unit: "kg" },
  { product: "oil", batch: "SO-2608", received: "2026-08-20", expiry: "2027-02-15", qty: 18, unit: "litre" },
  { product: "tea", batch: "TL-2607", received: "2026-07-28", expiry: "2027-07-28", qty: 22, unit: "packet" },
];

/** Shop + store add up to each product's stock in demo-data. */
export const warehouseSplit: { product: ProductKey; unit: UnitKey; shop: number; store: number }[] = [
  { product: "rice", unit: "kg", shop: 12, store: 30 },
  { product: "flour", unit: "kg", shop: 10, store: 24 },
  { product: "oil", unit: "litre", shop: 6, store: 12 },
  { product: "biscuit", unit: "packet", shop: 18, store: 30 },
  { product: "egg", unit: "pcs", shop: 120, store: 0 },
  { product: "sugar", unit: "kg", shop: 9, store: 0 },
];

export const stockAdjustments: { date: string; product: ProductKey; change: number; unit: UnitKey; reason: "damaged" | "countCorrection" | "expired" }[] = [
  { date: "2026-10-19", product: "egg", change: -6, unit: "pcs", reason: "damaged" },
  { date: "2026-10-17", product: "sugar", change: -1, unit: "kg", reason: "countCorrection" },
  { date: "2026-10-15", product: "biscuit", change: -4, unit: "packet", reason: "expired" },
  { date: "2026-10-10", product: "onion", change: 2, unit: "kg", reason: "countCorrection" },
];

export const stockTransfers: { no: number; from: Location; to: Location; items: { product: ProductKey; qty: number; unit: UnitKey }[]; date: string; status: "completed" | "pending" }[] = [
  { no: 22, from: "store", to: "shop", items: [{ product: "rice", qty: 10, unit: "kg" }, { product: "flour", qty: 5, unit: "kg" }], date: "2026-10-20", status: "pending" },
  { no: 21, from: "store", to: "shop", items: [{ product: "oil", qty: 6, unit: "litre" }], date: "2026-10-15", status: "completed" },
  { no: 20, from: "shop", to: "store", items: [{ product: "biscuit", qty: 12, unit: "packet" }], date: "2026-10-09", status: "completed" },
];

export const otherIncome: { date: string; cat: "displayFee" | "scrap" | "commission" | "rent"; method: PayMethod; amount: number }[] = [
  { date: "2026-10-18", cat: "displayFee", method: "bank", amount: 3000 },
  { date: "2026-10-12", cat: "scrap", method: "cash", amount: 850 },
  { date: "2026-10-05", cat: "commission", method: "mobile", amount: 1200 },
  { date: "2026-10-01", cat: "rent", method: "cash", amount: 2500 },
];

/** Dates and payment methods for demo-data's expenseEntries (which sum to today.expensesMonth). */
export const expenseMeta: Record<"rent" | "electricity" | "salary" | "van" | "water", { date: string; method: PayMethod }> = {
  rent: { date: "2026-10-01", method: "bank" },
  salary: { date: "2026-10-05", method: "cash" },
  electricity: { date: "2026-10-08", method: "mobile" },
  water: { date: "2026-10-09", method: "cash" },
  van: { date: "2026-10-14", method: "cash" },
};

export const accounts: { key: PayMethod; balance: number }[] = [
  { key: "cash", balance: 18450 },
  { key: "bank", balance: 126300 },
  { key: "mobile", balance: 24780 },
];

export const cashMoves: { date: string; type: "deposit" | "withdrawal" | "owner" | "capital"; account: PayMethod; amount: number }[] = [
  { date: "2026-10-19", type: "deposit", account: "bank", amount: 25000 },
  { date: "2026-10-16", type: "withdrawal", account: "bank", amount: 10000 },
  { date: "2026-10-10", type: "owner", account: "cash", amount: 8000 },
  { date: "2026-10-03", type: "capital", account: "bank", amount: 50000 },
];
