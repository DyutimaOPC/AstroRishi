import { parseDob, lifePath, birthNumber, type BirthDate } from '@/lib/numerology/core';
import { reduceToDigit } from '@/lib/numerology/reduce';
import { nameNumber } from '@/lib/numerology/letters';
import { loShu, type LoShu, type Plane } from '@/lib/numerology/loshu';
import { RULER } from '@/lib/numerology/lucky';
import { personalYears, type PersonalYear } from '@/lib/numerology/years';
import { namedNumbers, allowedNumbers, numberGuidance, harmony, type NamedNumber, type AllowedNumbers, type NumberGuidance } from '@/lib/numerology/profile';
import { VOCATION, occupationNumber, EMPLOYMENT_VENTURE, type Vocation } from './vocation';

export const CAREER_ENGINE_VERSION = '2.0.0';

/* ── the questionnaire's closed answers, scored ─────────────────────────── */

type Table = Record<string, number>;
const score1 = (t: Table, v: string | undefined, fallback = 0.5) => (v && v in t ? t[v] : fallback);

const SATISFACTION: Table = { 'Not at all': 0, 'A little': 0.25, Somewhat: 0.5, Mostly: 0.8, Very: 1 };
const EXPERIENCE: Table = { 'Under 2': 0.3, '2 to 5': 0.55, '5 to 10': 0.8, '10 to 20': 0.95, 'Over 20': 1 };
const RISK: Table = { 'Very low': 0, Low: 0.25, Moderate: 0.5, High: 0.75, 'Very high': 1 };
const PREFERENCE: Table = { 'Definitely a job': 0, 'Leaning job': 0.25, Undecided: 0.5, 'Leaning business': 0.75, 'Definitely business': 1 };
const CONCERN_DRAG: Table = {
  'Growth has stalled': 0.5, 'Money is not enough': 0.45, 'No stability': 0.35,
  Burnout: 0.25, 'Starting a business': 0.7, 'Finding a new direction': 0.5, 'Something else': 0.5,
};
const INCOME_RUNWAY: Table = {
  'Under ₹25,000': 0.2, '₹25,000 to ₹75,000': 0.45, '₹75,000 to ₹2 lakh': 0.75, 'Over ₹2 lakh': 1, 'Prefer not to say': 0.5,
};

/* ── the vocational signature ───────────────────────────────────────────── */

export interface VocationScore { number: number; points: number; why: string[] }

/**
 * Which numbers actually run this person's working life.
 *
 * The three named numbers carry most of the weight — life path first, because
 * that is the direction the life pushes in — and the grid adds the standing
 * emphasis a date of birth repeats. Showing the working is the point: the
 * reader can see why we say what we say.
 */
export function vocationScores(n: { moolank: number; bhagyank: number; naamank: number }, grid: LoShu): VocationScore[] {
  const rows: VocationScore[] = Array.from({ length: 9 }, (_, i) => ({ number: i + 1, points: 0, why: [] }));
  const add = (digit: number, points: number, why: string) => {
    const r = rows[digit - 1];
    if (!r) return;
    r.points += points;
    r.why.push(why);
  };
  add(n.bhagyank, 3, 'your life path number');
  add(n.moolank, 2, 'your birth number');
  add(n.naamank, 1.5, 'your name number');
  for (let d = 1; d <= 9; d += 1) {
    const c = grid.counts[d] ?? 0;
    if (c > 0) add(d, Math.min(c, 3) * 0.6, c > 1 ? `appears ${c} times in your grid` : 'present in your grid');
  }
  return rows.sort((a, b) => b.points - a.points || a.number - b.number);
}

/* ── fit: what you do against what you are built for ────────────────────── */

export type FitVerdict = 'aligned' | 'adjacent' | 'stretched' | 'unknown';

export interface Fit {
  verdict: FitVerdict;
  /** What they typed. */
  stated: string;
  /** The number that occupation belongs to, when we could tell. */
  statedNumber: number | null;
  statedVocation: Vocation | null;
  /** The number their chart works by. */
  naturalNumber: number;
  naturalVocation: Vocation;
  /** How well the two agree, 0-100, from the affinity rubric. */
  agreement: number;
  /** Plain sentence naming the gap. Never flattering, never alarming. */
  note: string;
}

function fitOf(occupation: string | undefined, natural: number): Fit {
  const nat = VOCATION[natural];
  const m = occupationNumber(occupation);
  const stated = (occupation ?? '').trim();

  if (!m) {
    return {
      verdict: 'unknown', stated, statedNumber: null, statedVocation: null,
      naturalNumber: natural, naturalVocation: nat, agreement: 0,
      note: stated
        ? `We could not place "${stated}" against a single number with confidence, so this section reads your chart on its own rather than guessing at your trade.`
        : 'No occupation was given, so this section reads your chart on its own.',
    };
  }

  const agreement = harmony(m.number, natural, natural);
  const verdict: FitVerdict = m.number === natural ? 'aligned' : agreement >= 65 ? 'adjacent' : 'stretched';
  const sv = VOCATION[m.number];
  const note =
    verdict === 'aligned'
      ? `What you do and what you are built for are the same number. That is rarer than it sounds, and it means the work itself is not your problem.`
      : verdict === 'adjacent'
        ? `A ${m.number} occupation run by a ${natural} chart. These two get along — you are not in the wrong trade, but you are probably doing it in a way your workplace does not have a name for.`
        : `A ${m.number} occupation run by a ${natural} chart. This is the gap: ${sv.mode} is the daily demand, ${nat.mode} is what you are actually built to do. Most of the tiredness people describe as burnout is this, and no amount of effort closes it.`;

  return { verdict, stated, statedNumber: m.number, statedVocation: sv, naturalNumber: natural, naturalVocation: nat, agreement, note };
}

/* ── earning capacity ───────────────────────────────────────────────────── */

export interface Earning {
  capacity: number;
  planes: Plane[];
  /** Numbers present that carry money weight. */
  drivers: { number: number; label: string; note: string }[];
  /** Money-bearing numbers missing from the grid. */
  leaks: { number: number; label: string; note: string }[];
  note: string;
}

const MONEY_ROLE: Readonly<Record<number, { label: string; has: string; lacks: string }>> = {
  1: { label: 'Authority', has: 'you can ask for what you are worth without rehearsing it', lacks: 'asking for more is the hardest part of the job, so you tend to wait to be offered' },
  3: { label: 'Visibility', has: 'people know what you do, which is half of being paid for it', lacks: 'your work is often better than your reputation for it, and that gap costs money' },
  4: { label: 'Method', has: 'you keep the records, and money you can see is money you keep', lacks: 'the earning is not the weak link — the tracking is' },
  5: { label: 'Opportunity', has: 'you find the openings other people wait for', lacks: 'chances tend to be noticed late, when someone else has already moved' },
  6: { label: 'Comfort', has: 'you are willing to spend on quality, which keeps standards high', lacks: 'money is easily spent on other people before it is spent on your own base' },
  8: { label: 'Scale', has: 'the capacity for real money is in the chart — this is the money number itself', lacks: 'the money number is absent, which does not cap what you earn but does mean structure has to be built deliberately rather than come naturally' },
};

function earningOf(grid: LoShu): Earning {
  const planes = grid.planes.filter((p) => ['practical', 'thought', 'golden'].includes(p.key));
  const drivers: Earning['drivers'] = [];
  const leaks: Earning['leaks'] = [];
  for (const [k, role] of Object.entries(MONEY_ROLE)) {
    const d = Number(k);
    if ((grid.counts[d] ?? 0) > 0) drivers.push({ number: d, label: role.label, note: role.has });
    else leaks.push({ number: d, label: role.label, note: role.lacks });
  }
  const planeShare = planes.reduce((t, p) => t + p.present, 0) / (planes.length * 3);
  const capacity = Math.round(planeShare * 60 + (drivers.length / 6) * 30 + (grid.balance / 100) * 10);
  const note =
    capacity >= 70 ? 'The structural side of money is strong in your chart. Where earning falls short, the cause is usually a decision rather than a capacity.'
    : capacity >= 45 ? 'Money in your chart is workable but not automatic. It responds well to structure and badly to being left to sort itself out.'
    : 'The money-bearing parts of your grid are thin. That is not a ceiling on what you can earn, but it does mean the habits have to do the work the chart does not.';
  return { capacity, planes, drivers, leaks, note };
}

/* ── job or business ────────────────────────────────────────────────────── */

export interface Path {
  /** 0-100 toward running your own thing. */
  score: number;
  /** What they said they want, on the same scale. */
  stated: number;
  /** What the chart leans to, on the same scale. */
  chart: number;
  verdict: string;
  /** Set when stated preference and chart disagree meaningfully. */
  tension: string | null;
  runway: string;
}

function pathOf(a: Record<string, string>, top: VocationScore[]): Path {
  // What they say they want, what they will risk, what they have behind them, and
  // where they already sit — someone who already owns a business has answered
  // part of this question by living it.
  const stated =
    score1(PREFERENCE, a.preference) * 0.4 +
    score1(RISK, a.risk) * 0.25 +
    score1(EXPERIENCE, a.experience) * 0.15 +
    score1(EMPLOYMENT_VENTURE, a.employment) * 0.2;
  // The chart's lean is the venture weight of its three loudest numbers.
  const lead = top.slice(0, 3);
  const chart = lead.reduce((t, r) => t + VOCATION[r.number].venture * r.points, 0) / lead.reduce((t, r) => t + r.points, 0);
  const blend = stated * 0.6 + chart * 0.4;

  const verdict =
    blend >= 0.66 ? 'Building something of your own is the better fit — both what you have told us and what your numbers lean towards point the same way.'
    : blend <= 0.38 ? 'A role inside an organisation is the better fit. That is a structural read, not a lack of ambition: your numbers earn more inside a frame than outside one.'
    : 'This is genuinely balanced. The deciding factor is runway, not temperament — which is a question about your savings, not your chart.';

  const gap = stated - chart;
  const tension =
    Math.abs(gap) < 0.25 ? null
    : gap > 0
      ? 'You want to run your own thing more than your chart naturally leans that way. That is workable, but it means the structure a business needs will have to be imported deliberately — a partner, a system, an accountant — rather than assumed.'
      : 'Your chart leans towards running your own thing more than you say you want to. That gap usually shows up as restlessness inside a good job, and it is worth naming before it gets blamed on the employer.';

  const runwayScore = score1(INCOME_RUNWAY, a.income) * 0.6 + score1(EXPERIENCE, a.experience) * 0.4;
  const runway =
    runwayScore >= 0.7 ? 'On what you have told us about income and experience, you have the runway to take a considered risk without betting the house.'
    : runwayScore >= 0.4 ? 'Your runway is real but not deep. Any move is better made with the next step already lined up than from a standing start.'
    : 'Runway is the binding constraint right now. Build the base before the leap — this is a sequencing point, not a verdict on the ambition.';

  return { score: Math.round(blend * 100), stated: Math.round(stated * 100), chart: Math.round(chart * 100), verdict, tension, runway };
}

/* ── the working years ──────────────────────────────────────────────────── */

const CAREER_YEAR: Readonly<Record<number, string>> = {
  1: 'The year to start the thing, take the title, or put your own name on it. Moves made now set the tone of the next eight, so drifting is the expensive option.',
  2: 'A year that pays through other people. Push alone and it costs more than it returns; spend it on alliances, agreements and the relationships that carry the next few years.',
  3: 'Visibility year. Being known for what you do carries you further than working harder at it. The trap is starting four things and finishing none.',
  4: 'The unglamorous one. Systems, records, savings, qualifications, paperwork. Nothing here feels like progress and most of it is — later years live off this one.',
  5: 'Movement. Switches, travel, new territory and new people. Good for changing direction, poor for signing anything that needs you to sit still for a decade.',
  6: 'Responsibility comes to you, invited or not — family, property, obligations, people who report to you. Duties taken on willingly this year tend to settle rather than repeat.',
  7: 'An inward year. Study, specialise, reassess. Slower on the outside and busier on the inside; forcing recognition now generally backfires.',
  8: 'The harvest. Earlier groundwork tends to show up as money and authority. It asks for the discipline to hold what arrives rather than immediately spend it.',
  9: 'Clearing out. Roles, clients and habits that have run their course end here. Starting something major now usually means carrying it half-formed into the next cycle.',
};

export interface CareerYear extends PersonalYear { career: string }

/* ── favourable periods inside the year ─────────────────────────────────── */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export interface Window { month: string; number: number; ruler: string; favourable: boolean; note: string }

const MONTH_TONE: Readonly<Record<number, string>> = {
  1: 'good for starting and for asking', 2: 'good for talking to people, poor for forcing',
  3: 'good for anything that needs an audience', 4: 'good for paperwork and the groundwork nobody sees',
  5: 'good for movement and negotiation', 6: 'good for anything involving home, family or money already owed',
  7: 'good for study and review, poor for launches', 8: 'good for money conversations and commitments',
  9: 'good for finishing and letting go, poor for starting',
};

function windowsOf(birth: BirthDate, yearNumber: number, suits: number[]): Window[] {
  return MONTHS.map((month, i) => {
    const n = reduceToDigit(yearNumber + (i + 1));
    return { month, number: n, ruler: RULER[n], favourable: suits.includes(n), note: MONTH_TONE[n] };
  });
}

/* ── what is actually in the way ────────────────────────────────────────── */

const BLOCKER: Readonly<Record<string, { title: string; body: string; needs: number[] }>> = {
  'Growth has stalled': { title: 'Growth has stalled', body: 'Stalling is usually a visibility problem before it is an ability problem. The work is being done; the people who allocate the next rung cannot see it.', needs: [1, 3] },
  'Money is not enough': { title: 'The money is not enough', body: 'Almost always two separate problems wearing one coat — what comes in, and what stays. Treating them as one is why the fix never holds.', needs: [4, 8] },
  'No stability': { title: 'Nothing feels stable', body: 'Instability that persists across jobs is structural rather than situational. The pattern follows you because it is built from how decisions get made, not where.', needs: [4, 2] },
  Burnout: { title: 'Burnout', body: 'Burnout is rarely too much work. It is too much of the wrong work — effort spent in a mode your chart does not run on, which costs double and returns less.', needs: [6, 7] },
  'Starting a business': { title: 'Starting something of your own', body: 'The question is almost never whether you can do the work. It is whether the parts of a business that are not the work — collection, structure, saying no — have somewhere to live.', needs: [8, 4] },
  'Finding a new direction': { title: 'Finding a new direction', body: 'Direction is not chosen in the abstract. It gets found by narrowing — deciding what you will stop doing is faster than deciding what you will start.', needs: [1, 5] },
  'Something else': { title: 'What you named', body: 'You told us the concern in your own words, and the reading below works from that rather than a category.', needs: [] },
};

export interface Blocker { title: string; body: string; missing: number[]; aggravated: boolean }

/* ── the plan ───────────────────────────────────────────────────────────── */

export interface Phase { title: string; window: string; purpose: string }

function planOf(concern: string | undefined, path: Path, year: CareerYear): Phase[] {
  const own = path.score >= 55;
  const c = concern ?? '';
  return [
    {
      title: 'First thirty days — establish the base',
      window: 'Days 1 to 30',
      purpose: c === 'Money is not enough'
        ? 'Separate the two money problems. One month of every rupee in and out, written down, before changing anything. Most people discover the leak is not where they assumed.'
        : c === 'Burnout'
          ? 'Find which parts of the week are in your own mode and which are not. Track it plainly for a month; you cannot redesign a job you have not measured.'
          : 'Get the facts on paper — what you actually do, what you are actually paid, and what the market pays for it. Everything after this depends on that being honest.',
    },
    {
      title: 'Days thirty to sixty — make it visible',
      window: 'Days 31 to 60',
      purpose: own
        ? 'Test the venture at small scale without leaving anything. One paying customer settles more arguments than six months of planning.'
        : 'Put the work in front of the people who allocate. Not a request for promotion — a record of what you have delivered, in front of the person who decides.',
    },
    {
      title: 'Days sixty to ninety — commit to one move',
      window: 'Days 61 to 90',
      purpose: `${year.title.toLowerCase()} is the character of your year, and it favours ${year.number === 4 || year.number === 7 ? 'preparation over announcement' : 'a decision rather than more deliberation'}. One move, chosen and made — not three considered.`,
    },
  ];
}

/* ── the whole thing ────────────────────────────────────────────────────── */

export interface CareerSignal { key: string; label: string; value: string; weight: number; points: number }

export interface CareerResult {
  engineVersion: string;
  /** Kept from v1 so the promised "career strength score" still exists. */
  score: number;
  band: 'strong' | 'mixed' | 'strained';
  signals: CareerSignal[];
  verdict: string;

  numbers: NamedNumber[];
  grid: LoShu;
  vocation: VocationScore[];
  workNature: Vocation;
  secondNature: Vocation;
  fit: Fit;
  earning: Earning;
  path: Path;
  blocker: Blocker;
  years: CareerYear[];
  windows: Window[];
  allowed: AllowedNumbers;
  guidance: NumberGuidance;
  /** Set when the name number fights the working numbers — the honest cross-sell. */
  nameFriction: { harmony: number; note: string } | null;
  plan: Phase[];
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const band = (s: number): CareerResult['band'] => (s >= 70 ? 'strong' : s >= 45 ? 'mixed' : 'strained');

export function careerReport(a: Record<string, string>, now = new Date()): CareerResult {
  const birth = parseDob(a.dob);
  const moolank = birthNumber(birth);
  const bhagyank = reduceToDigit(lifePath(birth));
  const naamank = nameNumber(a.fullName ?? '').digit;
  const grid = loShu(birth);

  const raw: CareerSignal[] = [
    { key: 'experience', label: 'Experience behind you', value: a.experience ?? '—', weight: 30, points: score1(EXPERIENCE, a.experience) },
    { key: 'satisfaction', label: 'Satisfaction today', value: a.satisfaction ?? '—', weight: 25, points: score1(SATISFACTION, a.satisfaction) },
    { key: 'concern', label: 'Main concern', value: a.concern ?? '—', weight: 25, points: score1(CONCERN_DRAG, a.concern) },
    { key: 'risk', label: 'Risk tolerance', value: a.risk ?? '—', weight: 20, points: score1(RISK, a.risk) },
  ];
  const signals = raw.map((s) => ({ ...s, points: Math.round(s.points * s.weight) }));
  const score = clamp(signals.reduce((t, s) => t + s.points, 0));

  const vocation = vocationScores({ moolank, bhagyank, naamank }, grid);
  const workNature = VOCATION[vocation[0].number];
  const secondNature = VOCATION[vocation[1].number];
  const fit = fitOf(a.occupation, workNature.number);
  const earning = earningOf(grid);
  const path = pathOf(a, vocation);
  const allowed = allowedNumbers(moolank, bhagyank);

  const b = BLOCKER[a.concern ?? ''] ?? BLOCKER['Something else'];
  const missing = b.needs.filter((n) => (grid.counts[n] ?? 0) === 0);
  const blocker: Blocker = { title: b.title, body: b.body, missing, aggravated: missing.length > 0 };

  const years: CareerYear[] = personalYears(birth, now.getFullYear(), 3).map((y) => ({ ...y, career: CAREER_YEAR[y.number] }));
  const windows = windowsOf(birth, years[0].number, allowed.suits);

  const nameHarmony = harmony(naamank, moolank, bhagyank);
  const nameFriction = nameHarmony < 55
    ? {
        harmony: nameHarmony,
        note: `Your name number (${naamank}) sits at ${nameHarmony} out of 100 against your birth and life-path numbers. Working numbers this far apart tend to show up as effort that does not convert — the work is done, the recognition lands elsewhere.`,
      }
    : null;

  const verdict = fit.verdict === 'stretched'
    ? `${fit.note} Everything else in this report follows from that one gap.`
    : path.verdict;

  return {
    engineVersion: CAREER_ENGINE_VERSION,
    score, band: band(score), signals, verdict,
    numbers: namedNumbers(birth, lifePath(birth), naamank),
    grid, vocation, workNature, secondNature, fit, earning, path, blocker,
    years, windows, allowed,
    guidance: numberGuidance(allowed.suits),
    nameFriction,
    plan: planOf(a.concern, path, years[0]),
  };
}
