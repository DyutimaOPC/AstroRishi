/** Digit reduction used throughout. 11, 22 and 33 are treated as master numbers. */
export const MASTERS = [11, 22, 33] as const;
export type Master = (typeof MASTERS)[number];

export function digitSum(n: number): number {
  return String(Math.abs(n))
    .split('')
    .reduce((a, d) => a + Number(d), 0);
}

/** Reduce to a single digit 1-9. Zero stays zero. */
export function reduceToDigit(n: number): number {
  let v = Math.abs(n);
  while (v > 9) v = digitSum(v);
  return v;
}

/** Reduce but stop on a master number (11/22/33). */
export function reduceKeepMaster(n: number): number {
  let v = Math.abs(n);
  while (v > 9 && !(MASTERS as readonly number[]).includes(v)) v = digitSum(v);
  return v;
}

export const isMaster = (n: number): n is Master =>
  (MASTERS as readonly number[]).includes(n);
