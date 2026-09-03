import { BirthDate, dobDigits, birthNumber, destinyNumber } from './core';

/** The Lo Shu square, read left-to-right, top-to-bottom. */
export const GRID_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6] as const;

export const CELL_MEANING: Readonly<Record<number, string>> = {
  1: 'Expression', 2: 'Intuition', 3: 'Patience', 4: 'Practicality', 5: 'Emotion',
  6: 'Domestic life', 7: 'Sacrifice', 8: 'Method', 9: 'Mental drive',
};

export interface Plane {
  key: string;
  label: string;
  numbers: [number, number, number];
  complete: boolean;
  present: number;
}

const PLANE_DEFS: ReadonlyArray<{ key: string; label: string; nums: [number, number, number] }> = [
  { key: 'mental',    label: 'Mental plane',    nums: [4, 9, 2] },
  { key: 'emotional', label: 'Emotional plane', nums: [3, 5, 7] },
  { key: 'practical', label: 'Practical plane', nums: [8, 1, 6] },
  { key: 'thought',   label: 'Thought plane',   nums: [4, 3, 8] },
  { key: 'will',      label: 'Will plane',      nums: [9, 5, 1] },
  { key: 'action',    label: 'Action plane',    nums: [2, 7, 6] },
  { key: 'golden',    label: 'Golden line',     nums: [4, 5, 6] },
  { key: 'silver',    label: 'Silver line',     nums: [2, 5, 8] },
];

export interface LoShu {
  counts: Record<number, number>;
  missing: number[];
  repeated: number[];
  planes: Plane[];
  completePlanes: Plane[];
  /** 0-100: how evenly the nine cells are filled. */
  balance: number;
}

/**
 * Grid is built from every digit of the date of birth (zeros are not placed,
 * since the square has no zero cell) plus the driver and conductor numbers,
 * which is the common Indian practice.
 */
export function loShu(b: BirthDate): LoShu {
  const counts: Record<number, number> = Object.fromEntries(
    Array.from({ length: 9 }, (_, i) => [i + 1, 0]),
  );
  for (const d of dobDigits(b)) if (d >= 1 && d <= 9) counts[d] += 1;
  for (const extra of [birthNumber(b), destinyNumber(b)])
    if (extra >= 1 && extra <= 9) counts[extra] += 1;

  const planes: Plane[] = PLANE_DEFS.map(({ key, label, nums }) => {
    const present = nums.filter((n) => counts[n] > 0).length;
    return { key, label, numbers: nums, present, complete: present === 3 };
  });

  const filled = Object.values(counts).filter((c) => c > 0).length;
  const completePlanes = planes.filter((p) => p.complete);
  const balance = Math.round((filled / 9) * 70 + (completePlanes.length / planes.length) * 30);

  return {
    counts,
    missing: Object.keys(counts).map(Number).filter((n) => counts[n] === 0),
    repeated: Object.keys(counts).map(Number).filter((n) => counts[n] > 1),
    planes,
    completePlanes,
    balance,
  };
}
