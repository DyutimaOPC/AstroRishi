import { reduceToDigit } from './reduce';
import { RULER } from './lucky';
import type { BirthDate } from './core';

/**
 * The personal year. Birth day + birth month + the calendar year, reduced —
 * so it turns over each birthday and runs on a nine-year cycle.
 *
 * Themes describe the character of a period, never an event. "A year that
 * rewards finishing things" is interpretation; "you will be promoted in March"
 * is a claim we do not make.
 */
const THEME: Readonly<Record<number, { title: string; body: string }>> = {
  1: { title: 'Beginnings', body: 'A year that rewards starting things rather than tidying up old ones. Decisions taken now tend to set the direction for the eight that follow, so it is worth choosing deliberately rather than drifting into whatever arrives.' },
  2: { title: 'Patience and partnership', body: 'Progress comes through other people this year rather than around them. Pushing hard tends to cost more than it gains; the same effort spent on agreements, alliances and waiting well usually lands better.' },
  3: { title: 'Expression', body: 'A visible, sociable year where communication carries you further than grind does. The risk is spreading yourself across too many interests and finishing none of them.' },
  4: { title: 'Foundations', body: 'Unglamorous and productive. This is the year for systems, paperwork, savings and the boring work that later years live off. Shortcuts taken now tend to be paid for twice.' },
  5: { title: 'Change and movement', body: 'Restless, fast, and full of options. Good for travel, a move, a switch of direction — less good for commitments that need you to sit still for a decade.' },
  6: { title: 'Responsibility and home', body: 'Family, property and obligation take the foreground, whether or not you invited them. Duties accepted willingly this year tend to settle; ones resisted tend to repeat.' },
  7: { title: 'Reflection and study', body: 'An inward year. Slower on the outside and busier on the inside — good for study, research and reassessment, poor for forcing outcomes or expecting quick recognition.' },
  8: { title: 'Achievement and money', body: 'The harvest year of the cycle, where earlier groundwork tends to show up as results and authority. It asks for the discipline to hold what arrives rather than spend it.' },
  9: { title: 'Completion', body: 'A year of endings and clearing out — relationships, jobs and habits that have run their course. Starting something major now often means carrying it into the next cycle half-formed.' },
};

export interface PersonalYear {
  year: number;
  number: number;
  ruler: string;
  title: string;
  body: string;
  /** True for the year the reader is in right now. */
  current: boolean;
}

export function personalYears(birth: BirthDate, from: number, count = 5): PersonalYear[] {
  return Array.from({ length: count }, (_, i) => {
    const year = from + i;
    const n = reduceToDigit(reduceToDigit(birth.day) + reduceToDigit(birth.month) + reduceToDigit(year));
    return { year, number: n, ruler: RULER[n], ...THEME[n], current: i === 0 };
  });
}
