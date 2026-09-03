import { parseDob, lifePath, birthNumber, type BirthDate } from '@/lib/numerology/core';
import { reduceToDigit } from '@/lib/numerology/reduce';
import { nameNumber } from '@/lib/numerology/letters';
import { loShu, type LoShu, type Plane } from '@/lib/numerology/loshu';
import { RULER } from '@/lib/numerology/lucky';
import { affinity, verdict as affinityVerdict, type Verdict } from '@/lib/numerology/affinity';
import { personalYears, type PersonalYear } from '@/lib/numerology/years';
import { safetyScan, type SafetyFlag } from './safety';

export const RELATIONSHIP_ENGINE_VERSION = '2.0.0';

/* ── what each number contributes to a partnership ──────────────────────── */

export interface RelMeaning { number: number; label: string; brings: string; absent: string }

export const REL_MEANING: Readonly<Record<number, RelMeaning>> = {
  1: { number: 1, label: 'Decisiveness', brings: 'someone willing to choose and carry the choice', absent: 'decisions get deferred until circumstances make them for you both' },
  2: { number: 2, label: 'Attunement', brings: 'the ability to read the other person before they have said anything', absent: 'neither of you notices the temperature dropping until the room is already cold' },
  3: { number: 3, label: 'Expression', brings: 'things get said out loud, and lightly enough to survive being said', absent: 'a great deal gets thought and very little of it gets spoken' },
  4: { number: 4, label: 'Reliability', brings: 'the ordinary structure — who does what, and when, without renegotiation', absent: 'the same logistics get argued about forever because nothing was ever settled' },
  5: { number: 5, label: 'Movement', brings: 'novelty, air, and the willingness to change the shape of things', absent: 'the relationship narrows to routine and the routine gets mistaken for the relationship' },
  6: { number: 6, label: 'Tending', brings: 'someone actively caring for the relationship itself, not only the people in it', absent: 'you both look after each other and neither of you looks after the thing between you' },
  7: { number: 7, label: 'Reflection', brings: 'the patience to sit with a difficulty long enough to understand it', absent: 'everything gets acted on before it has been understood, usually at volume' },
  8: { number: 8, label: 'Fairness', brings: 'a clear sense of what is owed and by whom — money, effort, obligation', absent: 'imbalance accumulates quietly because nobody is counting until somebody explodes' },
  9: { number: 9, label: 'Release', brings: 'the capacity to close a subject and genuinely let it go', absent: 'nothing is ever finished, and old grievances stay available for reuse' },
};

/* ── one person, read ───────────────────────────────────────────────────── */

export interface Chart {
  name: string;
  moolank: number;
  bhagyank: number;
  naamank: number;
  rulers: { moolank: string; bhagyank: string; naamank: string };
  grid: LoShu;
  year: PersonalYear;
}

function chartOf(name: string, dob: string, now: Date): Chart {
  const birth: BirthDate = parseDob(dob);
  const moolank = birthNumber(birth);
  const bhagyank = reduceToDigit(lifePath(birth));
  const naamank = nameNumber(name).digit;
  return {
    name: name.trim(),
    moolank, bhagyank, naamank,
    rulers: { moolank: RULER[moolank], bhagyank: RULER[bhagyank], naamank: RULER[naamank] },
    grid: loShu(birth),
    year: personalYears(birth, now.getFullYear(), 1)[0],
  };
}

/* ── the pair ───────────────────────────────────────────────────────────── */

export interface AffinityLine { key: string; label: string; you: number; them: number; score: number; verdict: Verdict; note: string }

const AFFINITY_NOTE: Readonly<Record<Verdict, (label: string) => string>> = {
  strong: (l) => `Your ${l} agree. This is the part of the relationship that has never needed work, and it is probably why you are still here.`,
  workable: (l) => `Your ${l} neither clash nor click. Effort put in here returns roughly what you put in — which sounds unremarkable, and is actually the most improvable part of the pairing.`,
  strained: (l) => `Your ${l} pull against each other. This does not doom anything; it means the friction here is structural rather than personal, and treating it as a character flaw in either of you is a mistake.`,
};

function affinityLines(you: Chart, them: Chart): AffinityLine[] {
  const defs: [string, string, number, number][] = [
    ['moolank', 'birth numbers', you.moolank, them.moolank],
    ['bhagyank', 'life-path numbers', you.bhagyank, them.bhagyank],
    ['naamank', 'name numbers', you.naamank, them.naamank],
  ];
  return defs.map(([key, label, a, b]) => {
    const score = affinity(a, b);
    const v = affinityVerdict(score);
    return { key, label, you: a, them: b, score, verdict: v, note: AFFINITY_NOTE[v](label) };
  });
}

/* ── the composite grid: the centrepiece ────────────────────────────────── */

export interface Composite {
  /** Present in theirs, absent in yours — what they supply you. */
  theyBring: RelMeaning[];
  /** Present in yours, absent in theirs — what you supply them. */
  youBring: RelMeaning[];
  /** Both carry it. The shared ground. */
  shared: RelMeaning[];
  /** Neither carries it. The couple's blind spot — nobody in the room supplies this. */
  blindSpot: RelMeaning[];
  /** Planes read across the pair together. */
  planes: { key: string; label: string; numbers: number[]; presentTogether: number; onlyYou: number[]; onlyThem: number[]; neither: number[] }[];
  /** Weakest plane across the pair. */
  friction: { label: string; missing: RelMeaning[] } | null;
  coverage: number;
}

function compositeOf(you: LoShu, them: LoShu): Composite {
  const has = (g: LoShu, n: number) => (g.counts[n] ?? 0) > 0;
  const digits = Array.from({ length: 9 }, (_, i) => i + 1);
  const pick = (f: (n: number) => boolean) => digits.filter(f).map((n) => REL_MEANING[n]);

  const theyBring = pick((n) => has(them, n) && !has(you, n));
  const youBring = pick((n) => has(you, n) && !has(them, n));
  const shared = pick((n) => has(you, n) && has(them, n));
  const blindSpot = pick((n) => !has(you, n) && !has(them, n));

  const planes = you.planes.map((p: Plane) => {
    const nums = [...p.numbers];
    return {
      key: p.key, label: p.label, numbers: nums,
      presentTogether: nums.filter((n) => has(you, n) || has(them, n)).length,
      onlyYou: nums.filter((n) => has(you, n) && !has(them, n)),
      onlyThem: nums.filter((n) => has(them, n) && !has(you, n)),
      neither: nums.filter((n) => !has(you, n) && !has(them, n)),
    };
  });

  const weakest = [...planes].sort((a, b) => a.presentTogether - b.presentTogether || a.key.localeCompare(b.key))[0];
  const friction = weakest && weakest.neither.length
    ? { label: weakest.label, missing: weakest.neither.map((n) => REL_MEANING[n]) }
    : null;

  return {
    theyBring, youBring, shared, blindSpot, planes, friction,
    coverage: Math.round(((9 - blindSpot.length) / 9) * 100),
  };
}

/* ── the pattern, which replaces a score ────────────────────────────────── */

export interface Pattern {
  key: string;
  name: string;
  body: string;
  /** How it shows up week to week. */
  shows: string[];
  /** What it costs if it is left alone. Never a prediction about a person. */
  costs: string;
}

const PATTERNS: Readonly<Record<string, Pattern>> = {
  avoided: {
    key: 'avoided', name: 'The avoided conversation',
    body: 'There is one subject underneath most of the arguments, and it is not the subject you are arguing about. Both of you know roughly where it is. Neither of you opens it, because the last few attempts went badly enough to teach you not to.',
    shows: ['Small disagreements escalate faster than their size warrants', 'Long stretches of ordinary peace that neither of you fully trusts', 'A sense of walking around something rather than through it'],
    costs: 'Avoidance is not neutral. The subject does not sit still while it is being avoided — it collects everything else that goes unsaid, until eventually it is too large to open at all.',
  },
  drift: {
    key: 'drift', name: 'The slow drift',
    body: 'Nothing broke. That is what makes this one difficult to talk about — there is no incident to point at, no villain, and no obvious moment where it changed. Two people simply kept living and stopped doing it in the same direction.',
    shows: ['Logistics have replaced conversation', 'You are polite with each other in a way you never used to be', 'Time together happens by schedule rather than by wanting it'],
    costs: 'A drift left alone does not reverse on its own, because nothing is actively pushing it. It ends by attrition rather than by decision, which is the version people most regret.',
  },
  tired: {
    key: 'tired', name: 'The tired argument',
    body: 'You are having one argument on a loop, wearing different clothes each time. The trigger changes; the shape never does. Both of you can predict the other\'s lines, which is exactly why neither of you is listening to them any more.',
    shows: ['You know how the fight ends before it starts', 'The topic is never the same and the feeling always is', 'Resolution feels like exhaustion rather than agreement'],
    costs: 'A repeating argument is a sign that the real disagreement has never been stated plainly. Until it is, every round costs goodwill and settles nothing.',
  },
  trust: {
    key: 'trust', name: 'After the breach',
    body: 'Something happened that changed the terms. Whatever has been said since, the relationship is now being run on a different set of rules — one person checking, one person being checked — and that arrangement takes energy from both of you continuously.',
    shows: ['Ordinary questions land as accusations', 'Reassurance works briefly and then needs repeating', 'One of you is managing the other\'s comfort as a daily task'],
    costs: 'Repair after a breach is real and it is possible, but it does not happen through time passing. It happens through the person who broke it doing the visible work, for longer than feels fair.',
  },
  third: {
    key: 'third', name: 'The third chair',
    body: 'There are more than two people in this relationship. Family opposition puts the two of you in a position where every private disagreement also becomes evidence in a larger argument, and that is an unfair amount of weight for ordinary friction to carry.',
    shows: ['Disagreements between you get reported outward, or feel like they might be', 'One of you is defending the relationship and the other is defending their family', 'Decisions that should take a week take a year'],
    costs: 'When a couple never gets to be alone with its own problems, it cannot tell which of them are actually theirs. The first task is a boundary, not a resolution.',
  },
  open: {
    key: 'open', name: 'The open question',
    body: 'One of you is waiting for a decision the other has not made. Whether that is commitment, a timeline, or simply a straight answer, the waiting itself has become the relationship — and waiting is a position that costs the person doing it far more than the person being waited for.',
    shows: ['The same question, asked in increasingly indirect ways', 'Plans that stop at a certain distance into the future', 'A sense of auditioning rather than being chosen'],
    costs: 'An unanswered question does not stay neutral. It slowly converts into an answer, and the answer it converts into is rarely the one anybody wanted.',
  },
  self: {
    key: 'self', name: 'The question underneath is yours',
    body: 'You came here asking about a relationship, and a good deal of what you have described is actually about what you want and whether you are allowed to want it. That is not a lesser question. It is the one that has to be answered first, because the other one cannot be answered without it.',
    shows: ['Difficulty saying plainly what you want, even privately', 'Clarity that arrives when you are alone and evaporates in the room', 'Judging your own needs by whether they are reasonable'],
    costs: 'A decision made without knowing your own position is not a decision. It is a reaction, and it tends to need making again.',
  },
};

function patternOf(a: Record<string, string>): Pattern {
  const concern = a.concern ?? '';
  const comm = a.communication ?? '';
  if (concern === 'Trust has been broken') return PATTERNS.trust;
  if (concern === 'Family is against it') return PATTERNS.third;
  if (concern === 'They will not commit') return PATTERNS.open;
  if (concern === 'I am not sure I want this') return PATTERNS.self;
  if (concern === 'We have grown apart') return PATTERNS.drift;
  if (concern === 'We keep having the same fight')
    return comm === 'It turns into an argument' ? PATTERNS.tired : PATTERNS.avoided;
  if (comm === 'We avoid the hard things' || comm === 'We barely talk now') return PATTERNS.avoided;
  if (comm === 'It turns into an argument') return PATTERNS.tired;
  return PATTERNS.drift;
}

/* ── timing ─────────────────────────────────────────────────────────────── */

export interface Timing {
  you: PersonalYear;
  them: PersonalYear | null;
  /** Set only when the two are in different years and it explains something. */
  mismatch: string | null;
}

const YEAR_WANT: Readonly<Record<number, string>> = {
  1: 'to start something and be backed in it', 2: 'to be met halfway rather than pushed',
  3: 'to be seen and heard', 4: 'to settle things and have them stay settled',
  5: 'room, movement and change', 6: 'to be looked after, and to look after',
  7: 'quiet, and to be left to think', 8: 'to be taken seriously and to get on with building',
  9: 'to finish things and put some of them down',
};

function timingOf(you: Chart, them: Chart | null): Timing {
  if (!them) return { you: you.year, them: null, mismatch: null };
  if (you.year.number === them.year.number)
    return {
      you: you.year, them: them.year,
      mismatch: `You are both in a personal ${you.year.number} year. Wanting the same thing at the same time is an advantage — use it, because the cycle moves you apart again soon enough.`,
    };
  return {
    you: you.year, them: them.year,
    mismatch: `You are in a personal ${you.year.number} year and ${them.name || 'they'} in a ${them.year.number}. A ${you.year.number} year tends to pull towards ${YEAR_WANT[you.year.number]}; a ${them.year.number} year tends to pull towards ${YEAR_WANT[them.year.number]}. Neither of those is unreasonable and the two are hard to hold at once. A good deal of what currently reads as indifference is more likely to be two people on different clocks.`,
  };
}

/* ── the branch: four genuinely different reports ───────────────────────── */

export type BranchKey = 'repair' | 'decide' | 'leave' | 'understand';

export interface Branch {
  key: BranchKey;
  title: string;
  body: string;
  steps: { title: string; detail: string }[];
}

const BRANCHES: Readonly<Record<BranchKey, Branch>> = {
  repair: {
    key: 'repair', title: 'What repair would actually require',
    body: 'You have told us you want to stay and make it work. That is a real position and this section takes it seriously, which means being straight about the cost rather than encouraging. Repair is not patience. Patience is what people do instead of repair.',
    steps: [
      { title: 'Name the actual subject', detail: 'One sentence, said out loud, about what the argument is really about. Not an accusation — a statement of what you need that you are not getting. Most couples never get this far, which is why they repeat the surrounding argument for years.' },
      { title: 'Agree how disagreement will run', detail: 'Not what you will agree about — how you will disagree. When it stops, who calls it, and what is out of bounds. A rule made calmly holds far better than a resolution made at the end of a fight.' },
      { title: 'Change one structural thing', detail: 'Something visible and ordinary — a standing evening, a division of a task, one habit stopped. Repair that stays at the level of feeling does not survive contact with a normal week.' },
      { title: 'Give it a horizon', detail: 'Decide together roughly how long you are giving this before you look at it honestly again. Open-ended effort is how drift gets rebranded as trying.' },
    ],
  },
  decide: {
    key: 'decide', title: 'How to make this decision',
    body: 'You have told us you are deciding. This section will not decide for you, and any report that offers to is selling you something. What it can do is take the decision out of the argument, because a decision made during a bad week is a decision about the week.',
    steps: [
      { title: 'Separate the two questions', detail: 'Whether this can work, and whether you want it to. They feel like one question and they are not. People stay for years in relationships that could work because they have never been asked the second one.' },
      { title: 'Set the terms in advance', detail: 'Write down now — privately — what would have to be true in six months for you to stay. Deciding the standard before you are inside the next fight is the only way it stays yours.' },
      { title: 'Test it against an ordinary week', detail: 'Not the best week and not the worst. Whether a relationship works is settled on the average Tuesday, and both extremes lie about it.' },
      { title: 'Notice who you are when you are in it', detail: 'The most reliable signal is not how you feel about them. It is who you become around them, and whether you recognise that person.' },
    ],
  },
  leave: {
    key: 'leave', title: 'How to leave well',
    body: 'You have told us you want to end it well. That is a harder and more decent aim than ending it quickly, and nothing in this report will argue you out of the decision. What follows is about doing it cleanly — for you, and for the person on the other side of it.',
    steps: [
      { title: 'Decide before you discuss', detail: 'A conversation opened while you are still deciding turns into a negotiation, and negotiations restart relationships that were already over. Be clear with yourself first.' },
      { title: 'Say it once, plainly, in person', detail: 'Without a list of grievances. A long justification is for your comfort, not theirs, and it invites a rebuttal of every item instead of an ending.' },
      { title: 'Settle the practical things early', detail: 'Money, housing, belongings, and who tells whom. Practicalities left vague become the reason to keep contacting each other, and that is how endings stretch for a year.' },
      { title: 'Expect to grieve a decision you chose', detail: 'Choosing an ending does not exempt you from mourning it. People take the grief as evidence they were wrong. Usually it is only evidence that it mattered.' },
    ],
  },
  understand: {
    key: 'understand', title: 'Understanding your own position',
    body: 'You have told us the thing you want most is to understand yourself in this. That is the most useful answer you could have given, and it is the one this report is best equipped for — because you are the only person here who has actually told us anything.',
    steps: [
      { title: 'Write what you want without editing it', detail: 'Not what is reasonable, not what is available. The unedited version, privately. Most people discover they have been negotiating on behalf of a position they never checked.' },
      { title: 'Find where you go quiet', detail: 'There is usually one category of need you do not raise. Locating it matters more than resolving it, because it is where the same difficulty keeps coming back in.' },
      { title: 'Separate their behaviour from your interpretation', detail: 'Write the thing they did in one column and what you concluded from it in another. The gap between the columns is where most private suffering lives.' },
      { title: 'Give yourself a position, not a verdict', detail: 'You do not have to decide about the relationship to decide what you will and will not accept in it. That is available today and it is yours alone.' },
    ],
  },
};

const BRANCH_FOR: Readonly<Record<string, BranchKey>> = {
  'Repair and stay together': 'repair', 'Decide whether to stay': 'decide',
  'Leave well': 'leave', 'Understand myself better': 'understand',
};

/* ── the conversation ───────────────────────────────────────────────────── */

export interface ConversationStep { title: string; detail: string }

function conversationOf(pattern: Pattern, composite: Composite | null): ConversationStep[] {
  const gap = composite?.blindSpot[0] ?? null;
  return [
    {
      title: 'Choose the time deliberately',
      detail: 'Not at the end of a bad evening and not immediately after a good one. A conversation this size needs a neutral hour that neither of you is already using for something else.',
    },
    {
      title: 'Open with the pattern, not the incident',
      detail: `Start from what keeps happening rather than what happened on Tuesday. "${pattern.name}" is the shape — describe the shape. An incident invites a defence of that incident; a pattern invites a conversation.`,
    },
    {
      title: gap
        ? `Say the thing neither of you supplies — ${gap.label.toLowerCase()}`
        : 'Say the part you usually leave out',
      detail: gap
        ? `Neither of your charts carries ${gap.number}, which means ${gap.absent}. Nobody in the room is going to provide this instinctively, so it has to be done on purpose, out loud, by whichever of you is willing to go first.`
        : 'There is a sentence you have rehearsed and never delivered. Deliver that one. Everything else in the conversation is preparation for it.',
    },
    {
      title: 'Ask one question and then stop talking',
      detail: 'A real question, not a rhetorical one, and then genuine silence. The instinct to fill the pause is what converts most of these conversations back into the argument you were trying to leave.',
    },
    {
      title: 'Agree the next thing, however small',
      detail: 'End with one concrete, ordinary agreement. A conversation that ends in feeling alone is remembered fondly and changes nothing.',
    },
  ];
}

/* ── the whole thing ────────────────────────────────────────────────────── */

export interface RelationshipResult {
  engineVersion: string;
  safety: SafetyFlag;
  you: Chart;
  them: Chart | null;
  /** True when the reader gave us the partner's details. Everything pairwise depends on it. */
  paired: boolean;
  status: string;
  affinity: AffinityLine[] | null;
  /** Overall pair agreement, 0-100. Not a verdict on the relationship — a reading of two charts. */
  agreement: number | null;
  composite: Composite | null;
  /** What you bring, read from your own grid, when there is no partner to compare against. */
  soloBrings: RelMeaning[];
  soloGaps: RelMeaning[];
  pattern: Pattern;
  timing: Timing;
  branch: Branch;
  conversation: ConversationStep[];
  verdict: string;
}

export function relationshipReport(a: Record<string, string>, now = new Date()): RelationshipResult {
  const safety = safetyScan(a);
  const you = chartOf(a.fullName ?? '', a.dob, now);
  const them = a.partnerName && a.partnerDob ? chartOf(a.partnerName, a.partnerDob, now) : null;

  const lines = them ? affinityLines(you, them) : null;
  const agreement = lines ? Math.round(lines.reduce((t, l) => t + l.score, 0) / lines.length) : null;
  const composite = them ? compositeOf(you.grid, them.grid) : null;

  const has = (n: number) => (you.grid.counts[n] ?? 0) > 0;
  const digits = Array.from({ length: 9 }, (_, i) => i + 1);

  const pattern = patternOf(a);
  const branch = BRANCHES[BRANCH_FOR[a.outcome ?? ''] ?? 'understand'];

  // Safety overrides tone everywhere. A report that reads as "be patient" must
  // never be shown to somebody describing harm.
  const verdict = safety.flagged
    ? 'What you have described needs a person, not a report. The numbers are below, and they are not the important part of this page.'
    : composite && composite.blindSpot.length
      ? `The two of you cover ${composite.coverage} of 100 between you. What is missing is the interesting part: ${composite.blindSpot.map((m) => m.label.toLowerCase()).join(', ')} — nobody in this relationship supplies ${composite.blindSpot.length > 1 ? 'these' : 'this'} instinctively, so ${composite.blindSpot.length > 1 ? 'they have' : 'it has'} to be done deliberately or not at all.`
      : `Your situation reads as "${pattern.name.toLowerCase()}". That is a pattern rather than a verdict, and patterns are the kind of thing that can be changed once they have been named.`;

  return {
    engineVersion: RELATIONSHIP_ENGINE_VERSION,
    safety, you, them, paired: Boolean(them),
    status: a.status ?? '—',
    affinity: lines, agreement, composite,
    soloBrings: digits.filter(has).map((n) => REL_MEANING[n]),
    soloGaps: digits.filter((n) => !has(n)).map((n) => REL_MEANING[n]),
    pattern,
    timing: timingOf(you, them),
    branch,
    conversation: conversationOf(pattern, composite),
    verdict,
  };
}
