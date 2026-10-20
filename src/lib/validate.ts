const bnDigits = "০১২৩৪৫৬৭৮৯";

/** Accept Bengali digits as input and normalise them to ASCII. */
export function normaliseDigits(value: string): string {
  return value.replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d)));
}

export function isBdPhone(value: string): boolean {
  const v = normaliseDigits(value).replace(/[\s-]/g, "").replace(/^\+?88/, "");
  return /^01[3-9]\d{8}$/.test(v);
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
