/**
 * Illustrative sample data for the public marketing demo.
 * It is NOT connected to any real business or to the HelloKhata API,
 * and every place it appears is labelled as sample data.
 */

export type ProductKey = "rice" | "lentil" | "oil" | "sugar" | "flour" | "tea" | "soap" | "biscuit" | "egg" | "salt" | "onion" | "milk";
export type UnitKey = "kg" | "pcs" | "litre" | "packet" | "box" | "strip";
export type CustomerKey = "rahim" | "salma" | "jamal" | "nasrin";

export const today = {
  sales: 24530,
  salesCount: 86,
  deltaPct: 12,
  purchasesMonth: 182400,
  expensesMonth: 38650,
  dues: 12840,
};

export const weekSales = [18240, 21070, 19480, 22950, 20310, 21900, 24530];

export const products: { key: ProductKey; unit: UnitKey; stock: number; min: number; price: number }[] = [
  { key: "rice", unit: "kg", stock: 42, min: 25, price: 78 },
  { key: "lentil", unit: "kg", stock: 6, min: 15, price: 140 },
  { key: "oil", unit: "litre", stock: 18, min: 12, price: 190 },
  { key: "sugar", unit: "kg", stock: 9, min: 10, price: 135 },
  { key: "flour", unit: "kg", stock: 34, min: 15, price: 65 },
  { key: "tea", unit: "packet", stock: 22, min: 10, price: 120 },
  { key: "soap", unit: "pcs", stock: 0, min: 12, price: 55 },
  { key: "biscuit", unit: "packet", stock: 48, min: 20, price: 30 },
  { key: "egg", unit: "pcs", stock: 120, min: 60, price: 13 },
  { key: "salt", unit: "packet", stock: 4, min: 10, price: 42 },
  { key: "onion", unit: "kg", stock: 27, min: 20, price: 95 },
  { key: "milk", unit: "packet", stock: 15, min: 8, price: 420 },
];

export const topToday: { key: ProductKey; qty: number; unit: UnitKey; amount: number }[] = [
  { key: "rice", qty: 58, unit: "kg", amount: 4524 },
  { key: "oil", qty: 19, unit: "litre", amount: 3610 },
  { key: "egg", qty: 210, unit: "pcs", amount: 2730 },
  { key: "lentil", qty: 16, unit: "kg", amount: 2240 },
];

export type SaleMethod = "cash" | "mobile" | "due";
export const recentSales: { inv: string; customer: CustomerKey | null; amount: number; method: SaleMethod }[] = [
  { inv: "1086", customer: null, amount: 640, method: "cash" },
  { inv: "1085", customer: "rahim", amount: 550, method: "due" },
  { inv: "1084", customer: null, amount: 1280, method: "mobile" },
  { inv: "1083", customer: "salma", amount: 2310, method: "cash" },
  { inv: "1082", customer: null, amount: 385, method: "cash" },
];

export const salesByRange = {
  today: { total: 24530, count: 86 },
  week: { total: 148480, count: 571 },
  month: { total: 648920, count: 2394 },
};

export const monthlyOverview = [
  { sales: 152300, expenses: 9420 },
  { sales: 161880, expenses: 8760 },
  { sales: 148940, expenses: 11250 },
  { sales: 185800, expenses: 9220 },
];

export const customerDues: { key: CustomerKey; due: number; since: string; history: { type: "bought" | "paid"; amount: number }[] }[] = [
  { key: "rahim", due: 5450, since: "2026-09-02", history: [{ type: "bought", amount: 3200 }, { type: "paid", amount: 1000 }, { type: "bought", amount: 2700 }, { type: "bought", amount: 550 }] },
  { key: "salma", due: 3120, since: "2026-09-21", history: [{ type: "bought", amount: 2120 }, { type: "bought", amount: 1000 }] },
  { key: "jamal", due: 2870, since: "2026-10-04", history: [{ type: "bought", amount: 4870 }, { type: "paid", amount: 2000 }] },
  { key: "nasrin", due: 1400, since: "2026-10-12", history: [{ type: "bought", amount: 1400 }] },
];

export type ExpenseCat = "rent" | "utilities" | "salary" | "other";
export const expenseEntries: { key: "rent" | "electricity" | "salary" | "van" | "water"; cat: ExpenseCat; amount: number }[] = [
  { key: "rent", cat: "rent", amount: 18000 },
  { key: "electricity", cat: "utilities", amount: 4350 },
  { key: "salary", cat: "salary", amount: 12000 },
  { key: "van", cat: "other", amount: 2900 },
  { key: "water", cat: "utilities", amount: 1400 },
];

export const purchaseExample = { sacks: 10, kgPerSack: 25, pricePerSack: 1650, transport: 1200, labour: 500 };

export const lowStock = products.filter((p) => p.stock < p.min);

/* ------------------------------------------------------------------ */
/* Pharmacy                                                            */
/* ------------------------------------------------------------------ */
export type MedicineKey = "paracetamol" | "omeprazole" | "metformin" | "cetirizine" | "orsaline" | "amlodipine";
export const medicines: { key: MedicineKey; batch: string; expiry: string; stock: number; unit: UnitKey }[] = [
  { key: "paracetamol", batch: "PC-2408", expiry: "2026-12-05", stock: 14, unit: "strip" },
  { key: "omeprazole", batch: "OM-2411", expiry: "2027-08-20", stock: 62, unit: "strip" },
  { key: "metformin", batch: "MF-2403", expiry: "2026-11-28", stock: 40, unit: "strip" },
  { key: "cetirizine", batch: "CZ-2501", expiry: "2027-03-14", stock: 9, unit: "strip" },
  { key: "orsaline", batch: "OR-2409", expiry: "2026-12-18", stock: 120, unit: "packet" },
  { key: "amlodipine", batch: "AM-2412", expiry: "2027-10-02", stock: 55, unit: "strip" },
];
/** Fixed "today" for the demo so expiry maths is stable between builds. */
export const demoToday = "2026-10-20";

/* ------------------------------------------------------------------ */
/* Super Shop                                                          */
/* ------------------------------------------------------------------ */
export type BranchKey = "dhanmondi" | "mirpur" | "uttara" | "ctg";
export type LocationKey = BranchKey | "warehouse";
export const branches: { key: BranchKey; sales: number; orders: number; staff: number; onShift: number; target: number }[] = [
  { key: "dhanmondi", sales: 186400, orders: 642, staff: 18, onShift: 12, target: 200000 },
  { key: "mirpur", sales: 142900, orders: 511, staff: 14, onShift: 9, target: 160000 },
  { key: "uttara", sales: 168300, orders: 580, staff: 16, onShift: 11, target: 170000 },
  { key: "ctg", sales: 121750, orders: 436, staff: 12, onShift: 8, target: 150000 },
];
export const branchWeek: Record<BranchKey, number[]> = {
  dhanmondi: [162, 171, 158, 180, 175, 190, 186],
  mirpur: [128, 131, 125, 140, 137, 146, 143],
  uttara: [150, 155, 149, 162, 160, 171, 168],
  ctg: [110, 114, 108, 119, 117, 124, 122],
};
export type ShopItem = "rice" | "oil" | "milk" | "soap" | "sugar";
export const shopItems: ShopItem[] = ["rice", "oil", "milk", "soap", "sugar"];
export const shopUnits: Record<ShopItem, UnitKey> = { rice: "kg", oil: "litre", milk: "packet", soap: "pcs", sugar: "kg" };
/** Minimum stock per branch before an item is flagged (warehouse uses 5×). */
export const shopMin: Record<ShopItem, number> = { rice: 150, oil: 60, milk: 40, soap: 80, sugar: 70 };
export const locationStock: Record<LocationKey, Record<ShopItem, number>> = {
  dhanmondi: { rice: 420, oil: 140, milk: 36, soap: 210, sugar: 160 },
  mirpur: { rice: 180, oil: 48, milk: 70, soap: 95, sugar: 52 },
  uttara: { rice: 310, oil: 96, milk: 58, soap: 160, sugar: 120 },
  ctg: { rice: 95, oil: 72, milk: 22, soap: 64, sugar: 88 },
  warehouse: { rice: 2400, oil: 820, milk: 460, soap: 1300, sugar: 900 },
};
export type StaffRole = "manager" | "cashier" | "storekeeper" | "sales";
export const staff: { name: { bn: string; en: string }; role: StaffRole; branch: LocationKey; shift: "morning" | "evening"; onShift: boolean }[] = [
  { name: { bn: "মাহমুদুল হাসান", en: "Mahmudul Hasan" }, role: "manager", branch: "dhanmondi", shift: "morning", onShift: true },
  { name: { bn: "রিনা পারভীন", en: "Rina Parvin" }, role: "cashier", branch: "dhanmondi", shift: "morning", onShift: true },
  { name: { bn: "সাকিব আলম", en: "Sakib Alam" }, role: "storekeeper", branch: "warehouse", shift: "morning", onShift: true },
  { name: { bn: "ফারহানা ইসলাম", en: "Farhana Islam" }, role: "cashier", branch: "mirpur", shift: "evening", onShift: false },
  { name: { bn: "তানভীর আহমেদ", en: "Tanvir Ahmed" }, role: "sales", branch: "uttara", shift: "evening", onShift: false },
];
export const smsSegments: { key: "all" | "repeat" | "dues"; count: number }[] = [
  { key: "all", count: 4820 },
  { key: "repeat", count: 1260 },
  { key: "dues", count: 312 },
];

/* ------------------------------------------------------------------ */
/* Online Store                                                        */
/* ------------------------------------------------------------------ */
export const demoStoreStock = [12, 8, 5, 20, 3, 15];

/* ------------------------------------------------------------------ */
/* Social Commerce                                                     */
/* ------------------------------------------------------------------ */
export type Size = "M" | "L" | "XL";
/** Sample inventory the inbox demo reads from — answers are computed from this, never invented. */
export const panjabi = { price: 1490, stock: { M: 5, L: 3, XL: 0 } as Record<Size, number> };
export type LeadStage = "new" | "interested" | "followUp" | "won";
export const leads: { id: number; name: { bn: string; en: string }; source: "messenger" | "instagram" | "ad"; stage: LeadStage; value: number }[] = [
  { id: 1, name: { bn: "রফিক আহমেদ", en: "Rafiq Ahmed" }, source: "messenger", stage: "new", value: 1490 },
  { id: 2, name: { bn: "তানিয়া সুলতানা", en: "Tania Sultana" }, source: "instagram", stage: "interested", value: 2980 },
  { id: 3, name: { bn: "শুভ দাস", en: "Shuvo Das" }, source: "ad", stage: "followUp", value: 1890 },
  { id: 4, name: { bn: "মিতু রহমান", en: "Mitu Rahman" }, source: "messenger", stage: "won", value: 3270 },
  { id: 5, name: { bn: "আরিফ হোসেন", en: "Arif Hossain" }, source: "ad", stage: "new", value: 1490 },
];
export const campaigns: { key: "eid" | "winter" | "repeat"; spend: number; reach: number; messages: number; orders: number; revenue: number }[] = [
  { key: "eid", spend: 8000, reach: 64200, messages: 412, orders: 58, revenue: 91420 },
  { key: "winter", spend: 5000, reach: 38900, messages: 236, orders: 31, revenue: 47360 },
  { key: "repeat", spend: 1500, reach: 9100, messages: 118, orders: 27, revenue: 39830 },
];
export type PostStatus = "draft" | "scheduled" | "published";
export const posts: { day: number; key: "newArrival" | "offer" | "behind" | "review" | "restock" | "live"; status: PostStatus; channel: "facebook" | "instagram" }[] = [
  { day: 0, key: "newArrival", status: "published", channel: "facebook" },
  { day: 1, key: "behind", status: "published", channel: "instagram" },
  { day: 2, key: "offer", status: "scheduled", channel: "facebook" },
  { day: 3, key: "restock", status: "scheduled", channel: "instagram" },
  { day: 4, key: "live", status: "draft", channel: "facebook" },
  { day: 6, key: "review", status: "draft", channel: "instagram" },
];
export type OrderStage = "confirmed" | "packed" | "shipped" | "delivered";
export const socialOrders: { id: string; customer: { bn: string; en: string }; amount: number; stage: OrderStage; paid: boolean }[] = [
  { id: "SC-2041", customer: { bn: "মিতু রহমান", en: "Mitu Rahman" }, amount: 3270, stage: "delivered", paid: true },
  { id: "SC-2042", customer: { bn: "নাফিস ইকবাল", en: "Nafis Iqbal" }, amount: 1490, stage: "shipped", paid: false },
  { id: "SC-2043", customer: { bn: "সাদিয়া আফরিন", en: "Sadia Afrin" }, amount: 2380, stage: "packed", paid: true },
  { id: "SC-2044", customer: { bn: "রফিক আহমেদ", en: "Rafiq Ahmed" }, amount: 1490, stage: "confirmed", paid: false },
];

/* ------------------------------------------------------------------ */
/* Grocery page                                                        */
/* ------------------------------------------------------------------ */
/** Sample buying prices (per unit) used by the grocery page's stock and voice demos. */
export const buyingPrice: Partial<Record<ProductKey, number>> = { rice: 66, oil: 172, lentil: 124, sugar: 120, egg: 11, salt: 35, flour: 54, tea: 98 };
export const groceryProducts: ProductKey[] = ["rice", "oil", "lentil", "sugar", "egg", "salt"];

/* ------------------------------------------------------------------ */
/* Pharmacy page                                                       */
/* ------------------------------------------------------------------ */
/** Generic medicine names (no brands). Prices are illustrative, per selling unit. */
export type PharmaForm = "tab" | "cap" | "syr" | "sachet";
export type PharmaUnit = "strip" | "bottle" | "sachet";
export type PharmaId = "paracetamol" | "omeprazole" | "metformin" | "cetirizine" | "amlodipine" | "ors" | "azithromycin" | "montelukast" | "antacid";
export const pharmaItems: { id: PharmaId; name: string; form: PharmaForm; strength: string; unit: PharmaUnit; price: number; cost: number; stock: number; min: number; batch: string; expiry: string }[] = [
  { id: "paracetamol", name: "Paracetamol", form: "tab", strength: "500 mg", unit: "strip", price: 12, cost: 9.6, stock: 14, min: 30, batch: "PC-2408", expiry: "2026-12-05" },
  { id: "omeprazole", name: "Omeprazole", form: "cap", strength: "20 mg", unit: "strip", price: 60, cost: 48, stock: 62, min: 20, batch: "OM-2411", expiry: "2027-08-20" },
  { id: "metformin", name: "Metformin", form: "tab", strength: "500 mg", unit: "strip", price: 45, cost: 36, stock: 40, min: 20, batch: "MF-2403", expiry: "2026-11-28" },
  { id: "cetirizine", name: "Cetirizine", form: "tab", strength: "10 mg", unit: "strip", price: 30, cost: 23, stock: 9, min: 15, batch: "CZ-2501", expiry: "2027-03-14" },
  { id: "amlodipine", name: "Amlodipine", form: "tab", strength: "5 mg", unit: "strip", price: 50, cost: 40, stock: 55, min: 20, batch: "AM-2412", expiry: "2027-10-02" },
  { id: "ors", name: "Oral Saline", form: "sachet", strength: "", unit: "sachet", price: 6, cost: 4.5, stock: 120, min: 50, batch: "OR-2409", expiry: "2026-12-18" },
  { id: "azithromycin", name: "Azithromycin", form: "tab", strength: "500 mg", unit: "strip", price: 105, cost: 84, stock: 18, min: 10, batch: "AZ-2502", expiry: "2027-05-30" },
  { id: "montelukast", name: "Montelukast", form: "tab", strength: "10 mg", unit: "strip", price: 120, cost: 96, stock: 7, min: 10, batch: "MK-2410", expiry: "2026-12-31" },
  { id: "antacid", name: "Antacid Suspension", form: "syr", strength: "200 ml", unit: "bottle", price: 85, cost: 68, stock: 24, min: 10, batch: "AS-2406", expiry: "2027-01-15" },
];
export const daysUntilDemo = (iso: string) => Math.round((Date.parse(iso) - Date.parse(demoToday)) / 86_400_000);
export const pharmaToday = { sales: 18760, bills: 63, rxPending: 2 };
export const pharmaWeek = [15240, 17110, 16380, 19020, 17650, 17240, 18760];
export const pharmaPeriods = {
  today: { revenue: 18760, cogs: 15010, expenses: 1200 },
  week: { revenue: 121400, cogs: 97100, expenses: 8600 },
  month: { revenue: 498300, cogs: 398600, expenses: 38400 },
};
export const pharmaBalances = { customerDues: 6480, supplierOwed: 42500 };
/** Fictional prescription used by the OCR demonstration. `confidence` drives the review UI. */
export const sampleRx: { id: number; medicine: string | null; form: PharmaForm; strength: string; instructions: string; frequency: string; duration: string; confidence: "high" | "check" | "unreadable"; match?: PharmaId }[] = [
  { id: 1, medicine: "Paracetamol", form: "tab", strength: "500 mg", instructions: "After meal", frequency: "1+0+1", duration: "5 days", confidence: "high", match: "paracetamol" },
  { id: 2, medicine: "Omeprazole", form: "cap", strength: "20 mg", instructions: "Before breakfast", frequency: "1+0+0", duration: "14 days", confidence: "check", match: "omeprazole" },
  { id: 3, medicine: null, form: "tab", strength: "10 mg", instructions: "At night", frequency: "0+0+1", duration: "7 days", confidence: "unreadable" },
];
export const purchaseOrder = {
  invoice: "SPD-4471",
  items: [
    { id: "paracetamol" as PharmaId, qty: 100, batch: "PC-2510", expiry: "2027-09-30" },
    { id: "cetirizine" as PharmaId, qty: 50, batch: "CZ-2510", expiry: "2028-01-31" },
    { id: "montelukast" as PharmaId, qty: 30, batch: "MK-2510", expiry: "2027-12-31" },
  ],
  transport: 300,
  labour: 150,
  paid: 3000,
};
