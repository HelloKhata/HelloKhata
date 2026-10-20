import en from "@messages/en.json";
import bnJson from "@messages/bn.json";
import type { Locale } from "./config";

export type Dict = typeof en;

// Assigning through the Dict type makes TypeScript enforce key parity between the two files.
const bn: Dict = bnJson;

const dictionaries: Record<Locale, Dict> = { bn, en };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}
