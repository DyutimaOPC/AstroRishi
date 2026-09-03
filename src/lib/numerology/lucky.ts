import { affinity } from './affinity';

export const RULER: Readonly<Record<number, string>> = {
  1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury',
  6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars',
};

const COLOURS: Readonly<Record<number, string[]>> = {
  1: ['Gold', 'Orange', 'Deep yellow'], 2: ['White', 'Cream', 'Pale silver'],
  3: ['Yellow', 'Saffron', 'Cream'],    4: ['Grey', 'Khaki', 'Steel blue'],
  5: ['Green', 'Pale green', 'Turquoise'], 6: ['White', 'Pastel pink', 'Pale blue'],
  7: ['White', 'Pale grey', 'Smoke'],   8: ['Deep blue', 'Black', 'Dark brown'],
  9: ['Red', 'Coral', 'Maroon'],
};

const DAYS: Readonly<Record<number, string[]>> = {
  1: ['Sunday'], 2: ['Monday'], 3: ['Thursday'], 4: ['Saturday'], 5: ['Wednesday'],
  6: ['Friday'], 7: ['Monday', 'Tuesday'], 8: ['Saturday'], 9: ['Tuesday'],
};

const DIRECTIONS: Readonly<Record<number, string>> = {
  1: 'East', 2: 'North-west', 3: 'North-east', 4: 'South-west', 5: 'North',
  6: 'South-east', 7: 'North-east', 8: 'West', 9: 'South',
};

export interface Lucky {
  numbers: number[];
  colours: string[];
  days: string[];
  direction: string;
  ruler: string;
}

/** Lucky elements follow the birth number, with the life path as the second voice. */
export function luckyElements(birthNum: number, lifePathDigit: number): Lucky {
  const friends = Array.from({ length: 9 }, (_, i) => i + 1)
    .filter((n) => n !== birthNum && affinity(birthNum, n) >= 80);
  const numbers = [...new Set([birthNum, lifePathDigit, ...friends])].slice(0, 4).sort((a, b) => a - b);
  const colours = [...new Set([...COLOURS[birthNum], ...COLOURS[lifePathDigit]])].slice(0, 3);
  const days = [...new Set([...DAYS[birthNum], ...DAYS[lifePathDigit]])].slice(0, 2);
  return { numbers, colours, days, direction: DIRECTIONS[birthNum], ruler: RULER[birthNum] };
}
