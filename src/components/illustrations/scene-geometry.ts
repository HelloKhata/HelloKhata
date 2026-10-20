/** Shared geometry for the hero street (viewBox 0 0 1440 600, ground at y = 560). */
export const SCENE_W = 1440;
export const SCENE_H = 600;

/** Ink route from the sales card down through the shop to the shopkeeper's pen on the ledger (matches image 2) */
export const inkRoute = {
  a1: "M858 428 C810 422 755 395 740 365 C732 335 730 295 730 290",
  a2: "M730 290 C730 275 725 258 722 245",
  b: "M722 245 C780 180 920 120 1060 90",
  nodes: [
    [722, 245],
    [730, 295],
    [740, 365],
    [810, 415],
  ] as [number, number][],
};
