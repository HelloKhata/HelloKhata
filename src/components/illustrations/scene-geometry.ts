/** Shared geometry for the hero street (viewBox 0 0 1440 600, ground at y = 560). */
export const SCENE_W = 1440;
export const SCENE_H = 600;

/** Ink route from the shopkeeper's pen to the digital card (a1 → a2) and on to the phone (b). */
export const inkRoute = {
  a1: "M858 428 C840 432 812 430 800 418 C786 404 800 388 790 372 C778 352 742 350 736 326",
  a2: "M736 326 C730 300 768 290 756 262 C746 238 716 236 726 212 C736 188 768 186 770 160 C771 145 770 130 770 112",
  b: "M880 60 C940 30 990 100 1040 72 C1090 44 1110 64 1180 60",
  nodes: [
    [736, 326],
    [756, 262],
    [726, 212],
    [770, 160],
  ] as [number, number][],
};
