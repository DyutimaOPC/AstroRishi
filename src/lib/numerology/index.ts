import { parseDob, lifePath, birthNumber, destinyNumber, BirthDate } from './core';
import { nameNumber, soulUrge, personality, destiny, breakdown, NameNumber } from './letters';
import { loShu, LoShu, CELL_MEANING, GRID_ORDER } from './loshu';
import { affinity, verdict, Verdict } from './affinity';
import { luckyElements, Lucky } from './lucky';
import { analyseName, NameAnalysis, ScoreContext } from './nameOptions';
import { personalYears, type PersonalYear } from './years';
import {
  namedNumbers, lifePathWorking, wordBreakdown, allowedNumbers, numberGuidance,
  energyProfile, numeroscope, harmony,
  type NamedNumber, type WordValue, type AllowedNumbers, type NumberGuidance,
  type EnergyBar, type Numeroscope,
} from './profile';
import { reduceToDigit } from './reduce';

export * from './reduce';
export * from './letters';
export * from './core';
export * from './loshu';
export * from './affinity';
export * from './lucky';
export * from './nameOptions';
export * from './profile';
export * from './years';

export interface NumerologyInput {
  fullName: string;
  /** YYYY-MM-DD */
  dob: string;
}

export interface CoreNumbers {
  lifePath: number;
  lifePathDigit: number;
  birthNumber: number;
  destinyNumber: number;
  name: NameNumber;
  destiny: NameNumber;
  soulUrge: NameNumber;
  personality: NameNumber;
}

export interface Computed {
  input: { fullName: string; dob: string };
  birth: BirthDate;
  core: CoreNumbers;
  grid: LoShu & { cells: { number: number; count: number; meaning: string }[] };
  alignment: { score: number; verdict: Verdict; nameDigit: number; lifePathDigit: number };
  nameAnalysis: NameAnalysis;
  lucky: Lucky;
  /** Moolank, bhagyank and naamank, each with its ruling planet. */
  named: NamedNumber[];
  /** The arithmetic behind the destiny number, step by step. */
  working: string[];
  /** Each part of the name valued on its own. */
  words: WordValue[];
  /** All nine numbers ranked against this person's core pair. */
  numbers: AllowedNumbers;
  /** Mobile, vehicle and PIN suggestions derived from that ranking. */
  guidance: NumberGuidance;
  energy: EnergyBar[];
  scope: Numeroscope;
  /** This year and the four that follow, on the nine-year cycle. */
  years: PersonalYear[];
  /** Headline 0-100 used on the cover and in the product copy. */
  score: number;
  engineVersion: string;
}

export const ENGINE_VERSION = '1.0.0';

/**
 * The whole deterministic layer. Every number a report displays comes from
 * here; the language model is only ever asked to interpret this object.
 */
export function compute({ fullName, dob }: NumerologyInput): Computed {
  const name = fullName.trim();
  if (!name) throw new Error('A full name is required');
  const birth = parseDob(dob);

  const lp = lifePath(birth);
  const lpDigit = reduceToDigit(lp);
  const bn = birthNumber(birth);
  const grid = loShu(birth);

  const ctx: ScoreContext = { lifePathDigit: lpDigit, birthNum: bn, grid, original: name };
  const nameAnalysis = analyseName(name, ctx);

  const nameNum = nameNumber(name);
  const alignScore = affinity(nameNum.digit, lpDigit);
  const numbers = allowedNumbers(bn, lpDigit);

  return {
    input: { fullName: name, dob },
    birth,
    core: {
      lifePath: lp,
      lifePathDigit: lpDigit,
      birthNumber: bn,
      destinyNumber: destinyNumber(birth),
      name: nameNum,
      destiny: destiny(name),
      soulUrge: soulUrge(name),
      personality: personality(name),
    },
    grid: {
      ...grid,
      cells: GRID_ORDER.map((n) => ({
        number: n,
        count: grid.counts[n],
        meaning: CELL_MEANING[n],
      })),
    },
    alignment: {
      score: alignScore,
      verdict: verdict(alignScore),
      nameDigit: nameNum.digit,
      lifePathDigit: lpDigit,
    },
    nameAnalysis,
    lucky: luckyElements(bn, lpDigit),
    named: namedNumbers(birth, lp, nameNum.digit),
    working: lifePathWorking(birth),
    words: wordBreakdown(name),
    numbers,
    guidance: numberGuidance(numbers.suits),
    energy: energyProfile(grid),
    scope: numeroscope(grid),
    years: personalYears(birth, new Date().getUTCFullYear()),
    score: nameAnalysis.current.score,
    engineVersion: ENGINE_VERSION,
  };
}

export { breakdown, harmony };
