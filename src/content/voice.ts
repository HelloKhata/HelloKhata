import { customerDues, expenseEntries, lowStock, today } from "./demo-data";

export type Intent = "sales" | "dues" | "stock" | "expenses";

/** Keywords for the scripted demo — matched in both languages regardless of UI locale. */
const intentKeywords: Record<Intent, string[]> = {
  sales: ["বিক্রি", "বিক্রয়", "বেচা", "sale", "sell", "sold", "revenue"],
  dues: ["বাকি", "বকেয়া", "পাওনা", "due", "owe", "credit"],
  stock: ["স্টক", "মজুত", "শেষ", "ফুরিয়ে", "stock", "inventory", "low", "running out"],
  expenses: ["খরচ", "ব্যয়", "expense", "spend", "spent", "cost"],
};

export function detectIntent(question: string): Intent | null {
  const q = question.toLowerCase();
  // More specific intents first, so "running low" isn't read as a sales question.
  const order: Intent[] = ["dues", "stock", "expenses", "sales"];
  return order.find((intent) => intentKeywords[intent].some((k) => q.includes(k))) ?? null;
}

export const intentFigures = {
  sales: { amount: today.sales },
  dues: { amount: customerDues.reduce((s, c) => s + c.due, 0) },
  stock: { count: lowStock.length, qty: lowStock.find((p) => p.key === "lentil")?.stock ?? 0 },
  expenses: { amount: expenseEntries.reduce((s, e) => s + e.amount, 0) },
};
