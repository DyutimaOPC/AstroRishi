import type { SectionKey } from '@/lib/config/products';
import type { Computed } from '@/lib/numerology';
import type { CareerResult } from '@/lib/career';
import type { RelationshipResult } from '@/lib/relationship';

/**
 * Deterministic section generators — template prose built entirely from
 * computed data, no LLM involved. Each function returns the same shape
 * the renderers expect via proseOf().
 */

/* ── helpers ──────────────────────────────────────────────────────── */

const TONE: Record<number, string> = {
  1: 'independent and self-starting', 2: 'attuned to people and slow to force things',
  3: 'expressive and quick to connect', 4: 'methodical and happier with a system',
  5: 'restless, sociable and quick to start', 6: 'responsible, and pulled towards home',
  7: 'reflective, private and needing depth', 8: 'structural, patient and built for the long haul',
  9: 'driven, direct and impatient with delay',
};

type Insight = { title: string; body: string };
type Step = { title: string; detail: string; when?: string };

/* ── name-correction ─────────────────────────────────────────────── */

function nameCorrection(c: Computed): Record<string, unknown> {
  const best = c.nameAnalysis.best;
  const nameVerdict = c.nameAnalysis.current.verdict;

  return {
    headline: `Your name reads as a ${c.core.name.digit}`,
    verdict: `Your name carries a ${c.core.name.digit} vibration and your birth date a ${c.core.lifePathDigit}. A ${c.core.name.digit} is ${TONE[c.core.name.digit]}; a ${c.core.lifePathDigit} is ${TONE[c.core.lifePathDigit]}. ${nameVerdict === 'strained' ? 'The two pull in different directions, which is usually felt as effort that does not convert.' : nameVerdict === 'workable' ? 'They can work together, but they ask different things of you, and that costs energy.' : 'They reinforce each other, which tends to show up as effort that lands.'}`,
    currentNameReading: `Your full name "${c.input.fullName}" adds up to ${c.core.name.total} and reduces to ${c.core.name.digit}. Each letter carries a Chaldean value — ${c.words.length > 1 ? `the ${c.words.length} parts of your name (${c.words.map((w) => `${w.word}: ${w.total}`).join(', ')}) combine to give the total` : 'the letters add up to give that total'}. This is the number your name broadcasts every time someone writes it, says it, or thinks of you by it.`,
    alignment: `Your name number (${c.core.name.digit}) sits at ${c.nameAnalysis.current.score} out of 100 against your core pair — birth number ${c.core.birthNumber} and life path ${c.core.lifePathDigit}. ${c.nameAnalysis.current.score >= 70 ? 'That is a strong alignment. The name is working with your date of birth rather than against it.' : c.nameAnalysis.current.score >= 45 ? 'That is workable but not ideal. The name and the date of birth are not fighting each other, but they are not reinforcing each other either.' : 'That is a gap worth closing. A name this far from the birth numbers costs energy on things that should be free.'}`,
    gridReading: `${c.grid.completePlanes.length} complete ${c.grid.completePlanes.length === 1 ? 'plane' : 'planes'}. ${c.grid.missing.length ? `The gaps are at ${c.grid.missing.join(' and ')} — the numbers the remedies below are aimed at.` : 'Every cell in your grid is filled, which is uncommon.'} ${c.grid.repeated.length ? `${c.grid.repeated.join(' and ')} appear more than once, doubling their effect.` : ''}`,
    gridGaps: gridGaps(c),
    recommendation: best
      ? `${best.change}. It moves your total from ${c.core.name.total} to ${best.total} and your name number from ${c.core.name.digit} to ${best.digit} — ${best.digit} sits more comfortably with a ${c.core.lifePathDigit} life path than ${c.core.name.digit} does.`
      : `Your current spelling already scores well against your core numbers. No change is recommended at this time — the name and the date of birth are working together.`,
    whatChanges: whatChanges(c),
    remedies: nameRemedies(c),
    closing: `Every number in this section was worked from the name and date of birth you gave us, using Chaldean letter values. The same inputs always produce the same output. Use the corrected spelling consistently for ninety days before judging it — a name change is a habit first, and habits need repetition to take hold.`,
  };
}

function gridGaps(c: Computed): Insight[] {
  const items: Insight[] = [];
  for (const m of c.grid.missing.slice(0, 4)) {
    const meaning = c.grid.cells.find((x) => x.number === m)?.meaning.toLowerCase() ?? '';
    items.push({
      title: `Missing ${m}`,
      body: `Your grid has no ${m}, which governs ${meaning}. This does not mean you lack it — it means it takes conscious effort rather than coming naturally.`,
    });
  }
  if (!items.length) {
    for (const r of c.grid.repeated.slice(0, 2)) {
      items.push({
        title: `Repeated ${r}`,
        body: `${r} appears more than once in your grid, which amplifies its effect. The quality it governs comes easily to you but can dominate when left unchecked.`,
      });
    }
  }
  if (!items.length) {
    items.push({
      title: 'Balanced grid',
      body: 'Your grid has no missing numbers — every cell is filled. This is uncommon and gives you access to every quality without a structural gap.',
    });
  }
  return items;
}

function whatChanges(c: Computed): Insight[] {
  const items: Insight[] = [];
  const best = c.nameAnalysis.best;
  if (best) {
    items.push({
      title: 'Your name vibration shifts',
      body: `Moving from a ${c.core.name.digit} to a ${best.digit} aligns your name with your birth numbers. The practical effect is that effort converts more easily — the same work, recognised more readily.`,
    });
    items.push({
      title: 'Your overall harmony rises',
      body: `Your score moves from ${c.nameAnalysis.current.score} to ${best.score} out of 100. The gap between the two is the drag the current spelling imposes on you daily.`,
    });
  } else {
    items.push({
      title: 'No spelling change needed',
      body: 'Your name already aligns well with your birth numbers. The remedies below focus on strengthening the grid rather than changing the name.',
    });
    items.push({
      title: 'Focus on the grid gaps',
      body: c.grid.missing.length
        ? `The absent numbers (${c.grid.missing.join(', ')}) are the areas where deliberate effort pays off most.`
        : 'With a complete grid, your focus is best placed on using your strong numbers deliberately rather than correcting gaps.',
    });
  }
  return items;
}

function nameRemedies(c: Computed): Step[] {
  const out: Step[] = [];
  if (c.nameAnalysis.best)
    out.push({
      title: 'Adopt the corrected spelling in writing first',
      detail: 'Signature, email display name, WhatsApp, social handles. The daily use carries the change.',
    });
  out.push({
    title: 'Give any change ninety days',
    detail: 'A spelling change is a habit before it is anything else. Use it consistently for three months before judging it.',
  });
  for (const m of c.grid.missing.slice(0, 2)) {
    const meaning = c.grid.cells.find((x) => x.number === m)?.meaning.toLowerCase() ?? '';
    out.push({
      title: `Strengthen the absent ${m}`,
      detail: `Your grid has no ${m}, which points at ${meaning}. Build one small fixed habit around it.`,
    });
  }
  out.push({
    title: `Use your ${c.lucky.days[0] ?? 'best'} for anything that matters`,
    detail: `Start new work, send the difficult message, or sign on ${c.lucky.days.join(' or ')} where the choice is yours.`,
  });
  return out.slice(0, 5);
}

/* ── numerology ──────────────────────────────────────────────────── */

function numerology(c: Computed): Record<string, unknown> {
  const y = c.years[0];
  return {
    headline: `A ${c.core.lifePathDigit} life path, ruled by ${c.lucky.ruler}`,
    verdict: `Your grid has ${c.grid.completePlanes.length} complete ${c.grid.completePlanes.length === 1 ? 'plane' : 'planes'} and ${c.grid.missing.length} missing ${c.grid.missing.length === 1 ? 'number' : 'numbers'}. The strongest voice is ${c.scope.dominant ? `${c.scope.dominant.number} (${c.scope.dominant.ruler}), appearing ${c.scope.dominant.count} times` : 'spread evenly across the grid'}. What follows is built from that shape.`,
    lifePathReading: `Your life path number is ${c.core.lifePathDigit}, worked from your full date of birth (${c.input.dob}). A ${c.core.lifePathDigit} is ${TONE[c.core.lifePathDigit]}. This is the direction your life pushes in — it does not change, and it runs underneath everything else. Your ruling planet is ${c.lucky.ruler}, your best days are ${c.lucky.days.join(' and ')}, and the colours that sit well with you are ${c.lucky.colours.join(' and ')}.`,
    destinyReading: `Your destiny number is ${c.core.destinyNumber}, worked from the full birth date reduced differently from the life path. A ${c.core.destinyNumber} destiny is ${TONE[c.core.destinyNumber]}. The destiny is what you are built to grow into — not what you already are. It describes the direction of the growth, not the speed of it.`,
    soulUrgeReading: `Your soul urge is ${c.core.soulUrge.digit}, worked from the vowels in your name. A ${c.core.soulUrge.digit} soul urge is ${TONE[c.core.soulUrge.digit]}. This is what you privately want, underneath whatever you tell people. When you feel restless and cannot explain why, this number is usually why.`,
    personalityReading: `Your personality number is ${c.core.personality.digit}, worked from the consonants. A ${c.core.personality.digit} personality is ${TONE[c.core.personality.digit]}. This is how other people read you before you have said anything. It is not who you are — it is who you appear to be, and the gap between the two is where most misunderstandings start.`,
    gridReading: `${c.grid.completePlanes.length} complete ${c.grid.completePlanes.length === 1 ? 'plane' : 'planes'}. ${c.grid.missing.length ? `The gaps are at ${c.grid.missing.join(' and ')} — the numbers the remedies below are aimed at.` : 'Every cell in your grid is filled, which is uncommon.'} ${c.grid.repeated.length ? `${c.grid.repeated.join(' and ')} appear more than once, doubling their effect.` : ''}`,
    strengths: buildStrengths(c),
    challenges: buildChallenges(c),
    yearAhead: `You are currently in a personal ${y.number} year — "${y.title}". ${y.body} Your ruling planet for this year is ${y.ruler}. ${c.years[1] ? `Next year moves to a ${c.years[1].number} ("${c.years[1].title}"), which has a different character entirely, so what works now may not work then.` : ''}`,
    remedies: numerologyRemedies(c),
    closing: `Everything above was worked from your name and date of birth using Chaldean letter values. The same inputs always produce the same output. These are tendencies, not predictions — what you do with them is yours to decide.`,
  };
}

function buildStrengths(c: Computed): Insight[] {
  const items: Insight[] = [];
  for (const p of c.grid.completePlanes.slice(0, 2)) {
    items.push({
      title: `Complete ${p.label} plane`,
      body: `All three numbers (${p.numbers.join(', ')}) are present in your grid. This gives you natural access to this quality without having to work for it.`,
    });
  }
  if (c.scope.dominant) {
    items.push({
      title: `Strong ${c.scope.dominant.number} (${c.scope.dominant.ruler})`,
      body: `This number appears ${c.scope.dominant.count} times in your grid, making it the loudest voice. The quality it governs — ${TONE[c.scope.dominant.number]} — comes to you easily and defines much of how you operate.`,
    });
  }
  if (items.length < 2) {
    items.push({
      title: `${TONE[c.core.lifePathDigit]} by nature`,
      body: `Your life path ${c.core.lifePathDigit} gives you a natural orientation that carries you through situations where others have to think their way through.`,
    });
  }
  return items.slice(0, 5);
}

function buildChallenges(c: Computed): Insight[] {
  const items: Insight[] = [];
  for (const m of c.grid.missing.slice(0, 3)) {
    const meaning = c.grid.cells.find((x) => x.number === m)?.meaning.toLowerCase() ?? '';
    items.push({
      title: `Absent ${m} — ${meaning}`,
      body: `This number does not appear in your grid. The quality it governs takes deliberate effort rather than arriving naturally. It is a gap to work around, not a flaw.`,
    });
  }
  if (!items.length) {
    items.push({
      title: 'No structural gaps',
      body: 'Your grid has every number present. The challenge is not absence but emphasis — the repeated numbers can dominate at the expense of the quieter ones.',
    });
    if (c.scope.dominant && c.scope.dominant.count >= 3) {
      items.push({
        title: `Over-emphasis on ${c.scope.dominant.number}`,
        body: `Appearing ${c.scope.dominant.count} times, this number can overshadow the rest of the grid. Its qualities are a strength in moderation and a liability when they run unchecked.`,
      });
    }
  }
  return items.slice(0, 5);
}

function numerologyRemedies(c: Computed): Step[] {
  const out: Step[] = [];
  if (c.nameAnalysis.best)
    out.push({
      title: 'Adopt the corrected spelling',
      detail: `The corrected name "${c.nameAnalysis.best.name}" scores ${c.nameAnalysis.best.score} against your core pair, up from ${c.nameAnalysis.current.score}. Start with your WhatsApp name and email signature.`,
    });
  for (const m of c.grid.missing.slice(0, 2)) {
    const meaning = c.grid.cells.find((x) => x.number === m)?.meaning.toLowerCase() ?? '';
    out.push({
      title: `Strengthen the absent ${m}`,
      detail: `Your grid has no ${m}, which governs ${meaning}. A small daily habit aimed at this quality does more than occasional effort.`,
    });
  }
  out.push({
    title: `Favour ${c.lucky.days.join(' and ')} for new starts`,
    detail: `These are your best days by ruling planet (${c.lucky.ruler}). Begin important work, send difficult messages, or make commitments on these days where the choice is yours.`,
  });
  out.push({
    title: `Wear ${c.lucky.colours[0] ?? 'your lucky colour'} on important days`,
    detail: `${c.lucky.colours.join(' and ')} sit well with your core numbers. Use them for interviews, first meetings, and presentations.`,
  });
  return out.slice(0, 5);
}

/* ── career-money ────────────────────────────────────────────────── */

function careerMoney(r: CareerResult): Record<string, unknown> {
  const y = r.years[0];
  const favourable = r.windows.filter((w) => w.favourable);
  return {
    headline: `Career strength ${r.score}/100 — ${r.band}`,
    verdict: r.verdict,
    workNatureReading: `Your working number is ${r.workNature.number}, which operates by ${r.workNature.mode}. It thrives in ${r.workNature.thrivesIn} and is drained by ${r.workNature.drainedBy}. The fields that tend to suit this number are ${r.workNature.fields.slice(0, 3).join(', ')}. ${r.secondNature ? `Your second current — ${r.secondNature.number}, ${r.secondNature.title.toLowerCase()} — works by ${r.secondNature.mode}. Careers that use both tend to feel right in a way neither alone does.` : ''}`,
    fitReading: r.fit.verdict === 'unknown'
      ? 'Without a stated occupation to compare against, this section reads your chart on its own. The work nature and earning capacity sections above tell you what your numbers are built for.'
      : `Your stated occupation sits at ${r.fit.agreement} out of 100 against your chart's natural number. ${r.fit.verdict === 'aligned' ? 'That is a match — the work itself is not the problem.' : r.fit.verdict === 'adjacent' ? 'That is close enough to work well, though you may be doing it in a way your workplace does not have a name for.' : 'That is a real gap, and most of the tiredness you feel is this mismatch rather than overwork.'}`,
    earningReading: `Your money structure scores ${r.earning.capacity} out of 100. ${r.earning.drivers.length} of the 6 money-bearing numbers are present in your grid (${r.earning.drivers.map((d) => d.number).join(', ')}). ${r.earning.leaks.length ? `The absent ones — ${r.earning.leaks.map((l) => `${l.number} (${l.label.toLowerCase()})`).join(', ')} — are where the structure needs deliberate building.` : 'Every money-bearing number is present, which is uncommon.'}`,
    jobVsBusiness: `Your stated preference scores ${r.path.stated} toward venture; your chart leans ${r.path.chart}. Together that gives ${r.path.score} out of 100. ${r.path.score >= 55 ? 'Both point toward running your own thing.' : r.path.score <= 38 ? 'Both point toward working inside a structure.' : 'This is genuinely balanced — the deciding factor is runway, not temperament.'}`,
    blockerReading: `${r.blocker.title} — ${r.blocker.body} ${r.blocker.aggravated ? `Your grid makes this harder: ${r.blocker.missing.join(' and ')} ${r.blocker.missing.length > 1 ? 'are' : 'is'} missing, and ${r.blocker.missing.length > 1 ? 'those are' : 'that is'} exactly what this concern runs on.` : 'Your grid does not make this worse than it needs to be, which means the fix is about decisions rather than structure.'}`,
    strengths: careerStrengths(r),
    risks: careerRisks(r),
    openings: careerOpenings(r),
    yearsReading: `You are in a personal ${y.number} year ("${y.title}"). ${y.career} ${r.years[1] ? `Next year is a ${r.years[1].number} ("${r.years[1].title}"), which has a different character — plan accordingly.` : ''}`,
    timingReading: `${favourable.length} of the 12 months this year carry numbers that suit you: ${favourable.map((w) => w.month).join(', ')}. These are the windows to start things, ask for things, and make moves. The others are not bad months — they are simply months that reward patience over action.`,
    decisionFramework: `The single most useful thing this report can give you is the distinction between your working number (${r.workNature.number}) and your current occupation${r.fit.statedNumber ? ` (${r.fit.statedNumber})` : ''}. When these match, effort converts. When they do not, the same effort costs double and returns half. Every decision below follows from that one fact.`,
    ninetyDayPlan: r.plan.map((p) => ({ title: p.title, detail: p.purpose, when: p.window })),
    nameNote: r.nameFriction
      ? `Your name number sits at ${r.nameFriction.harmony} against your working numbers. That gap shows up as effort that does not convert — the work is done, the recognition lands elsewhere. A name correction report works out which spellings close this gap and by how much.`
      : undefined,
    closing: `Everything above was built from your name, date of birth and the answers you gave us. The same inputs always produce the same output. Use it as a framework for decisions you were going to make anyway — it is a reading, not a prescription.`,
  };
}

function careerStrengths(r: CareerResult): Insight[] {
  const items: Insight[] = [];
  items.push({
    title: `Natural ${r.workNature.title.toLowerCase()}`,
    body: `Your working number ${r.workNature.number} makes you ${r.workNature.mode}. This is your strongest professional current and the one that earns most efficiently.`,
  });
  if (r.earning.drivers.length >= 2) {
    const top = r.earning.drivers.slice(0, 2);
    items.push({
      title: `${top.map((d) => d.label).join(' and ')} in the chart`,
      body: `${top.map((d) => `${d.number} (${d.label.toLowerCase()}) — ${d.note}`).join('. ')}.`,
    });
  }
  if (r.fit.verdict === 'aligned') {
    items.push({
      title: 'Occupation matches your chart',
      body: 'What you do and what you are built for are the same number. The work itself is not the problem — any difficulty is coming from somewhere else.',
    });
  }
  return items.slice(0, 5);
}

function careerRisks(r: CareerResult): Insight[] {
  const items: Insight[] = [];
  if (r.fit.verdict === 'stretched') {
    items.push({
      title: 'Occupation–chart mismatch',
      body: `Your stated work runs on a different number (${r.fit.statedNumber}) from your natural one (${r.fit.naturalNumber}). This gap is the single biggest drag on how effort converts.`,
    });
  }
  for (const l of r.earning.leaks.slice(0, 2)) {
    items.push({
      title: `Missing ${l.number} — ${l.label.toLowerCase()}`,
      body: l.note,
    });
  }
  if (!items.length) {
    items.push({
      title: 'No structural risks',
      body: 'Your grid covers the money-bearing numbers and your occupation aligns with your chart. The risks in your situation are circumstantial rather than structural.',
    });
    items.push({
      title: 'Watch for complacency',
      body: 'A well-aligned chart can breed inertia. The numbers support you, but they do not push — deliberate action is still required.',
    });
  }
  return items.slice(0, 4);
}

function careerOpenings(r: CareerResult): Insight[] {
  const items: Insight[] = [];
  const y = r.years[0];
  if (y.number === 1 || y.number === 5 || y.number === 8) {
    items.push({
      title: `This is a ${y.number} year — a year for action`,
      body: y.career,
    });
  }
  const favourable = r.windows.filter((w) => w.favourable).slice(0, 2);
  if (favourable.length) {
    items.push({
      title: `${favourable.map((w) => w.month).join(' and ')} favour you`,
      body: `These months carry numbers that suit your chart. Use them for starts, asks, and commitments.`,
    });
  }
  if (r.workNature.fields.length > 2) {
    items.push({
      title: `Fields that suit your ${r.workNature.number}`,
      body: `${r.workNature.fields.slice(0, 4).join(', ')}. These are the areas where your working number operates most naturally.`,
    });
  }
  return items.slice(0, 4);
}

/* ── relationship ────────────────────────────────────────────────── */

function relationship(r: RelationshipResult): Record<string, unknown> {
  return {
    headline: r.paired ? `${r.you.name} and ${r.them?.name ?? 'partner'}` : `${r.you.name}'s relationship reading`,
    verdict: r.verdict,
    patternReading: `Your situation reads as "${r.pattern.name}". ${r.pattern.body} This is a pattern, not a verdict. Patterns can be changed once they have been named, and naming it is what this section is for.`,
    pairReading: r.paired && r.them
      ? `${r.you.name}'s numbers are ${r.you.moolank}/${r.you.bhagyank}/${r.you.naamank} (birth/life path/name) and ${r.them.name}'s are ${r.them.moolank}/${r.them.bhagyank}/${r.them.naamank}. Where the numbers match, effort is low. Where they differ, the work is real but not impossible — it simply has to be done on purpose rather than assumed.`
      : r.them
        ? undefined
        : `Your numbers are ${r.you.moolank} (birth), ${r.you.bhagyank} (life path) and ${r.you.naamank} (name). Without the second person's chart, this report reads your side — which is a complete reading of you, even if the comparison sections need both.`,
    agreementReading: r.affinity && r.agreement !== null
      ? `Taken together the three comparisons give ${r.agreement} out of 100. ${r.agreement >= 70 ? 'That is strong natural agreement — the friction in this relationship is coming from decisions, not from structure.' : r.agreement >= 45 ? 'That is workable — neither clicking nor clashing. Effort here returns roughly what is put in, which is the most improvable range.' : 'That is strained — the friction is structural rather than personal. Treating it as a character flaw in either of you is a mistake; it is two sets of numbers pulling in different directions.'}`
      : undefined,
    exchangeReading: r.composite
      ? `Between you, ${r.composite.coverage} of 100 is covered. ${r.composite.blindSpot.length ? `The blind spots — ${r.composite.blindSpot.map((m) => `${m.number} (${m.label.toLowerCase()})`).join(', ')} — are absent from both charts. Nobody in this relationship supplies ${r.composite.blindSpot.length > 1 ? 'these' : 'this'} instinctively.` : 'Every number between you is covered, which is unusual. There are no structural blind spots — whatever is difficult here is about what you do with each other, not about something neither of you has.'}`
      : undefined,
    blindSpotReading: r.composite?.blindSpot.length
      ? `The blind spots matter because they describe what neither of you provides naturally. ${r.composite.blindSpot.map((m) => `Without ${m.number} (${m.label.toLowerCase()}), ${m.absent}`).join('. ')}. These have to be built in on purpose — by whichever of you decides to.`
      : r.composite
        ? 'With no blind spots, the challenge is not about what is missing but about how what is present gets used. Strong coverage can breed complacency — the structure is good, but it still needs deliberate attention.'
        : undefined,
    frictionReading: r.composite?.friction
      ? `The thinnest line across the two of you is ${r.composite.friction.label.toLowerCase()}. ${r.composite.friction.missing.map((m) => `${m.number} (${m.label.toLowerCase()}) is absent from both charts`).join(', and ')}. Arguments that feel unreasonably hard tend to be arguments that need this line.`
      : 'No single plane stands out as notably weak between you. The friction in this relationship is distributed rather than concentrated, which means it shows up in many small ways rather than one large one.',
    strengths: relStrengths(r),
    friction: relFriction(r),
    timingReading: r.timing.them
      ? `You are in different personal years, which means you are pulled toward different things at the same time. A good deal of what currently reads as indifference is more likely two people on different clocks. This changes year to year — it is timing, not temperament.`
      : `Your personal year is ${r.timing.you.number} ("${r.timing.you.title}"). ${r.timing.you.body} Without the second person's year, a timing comparison is not possible.`,
    branchReading: `${r.branch.body} The steps below are specific to what you told us you want. They are not advice — they are a framework for a conversation you were going to have anyway.`,
    overlooked: r.composite?.blindSpot[0]
      ? `The thing most likely to be overlooked: ${r.composite.blindSpot[0].label.toLowerCase()}. Because neither of you supplies it naturally, it tends to be the subject that never gets raised — and the one that explains why the raised subjects never fully resolve.`
      : 'The thing most likely to be overlooked is the pattern itself. You are inside it, which makes it invisible — naming it is the first step to changing it.',
    nextStep: `The single most useful thing you can do this week is have one conversation about ${r.pattern.name.toLowerCase()} — using that name, not the incident that last triggered it. A pattern named is a pattern that can be changed. One that stays unnamed keeps repeating.`,
    conversationGuide: r.conversation.map((c) => ({ title: c.title, detail: c.detail })),
    thirtyDayPlan: thirtyDayPlan(r),
    closing: `Everything above was built from the details you gave us${r.paired ? ' and, where you provided them, your partner\'s' : ''}. Only you have told us anything — nothing here claims to know what another person privately thinks. It is interpretive guidance meant to help you think, not a prediction about what will happen.`,
  };
}

function relStrengths(r: RelationshipResult): Insight[] {
  const items: Insight[] = [];
  if (r.composite) {
    for (const m of r.composite.shared.slice(0, 2)) {
      items.push({
        title: `Shared ${m.label.toLowerCase()}`,
        body: `Both of you carry ${m.number}. Where it is present, ${m.brings}. This is the part of the relationship that has never needed work.`,
      });
    }
  }
  if (r.affinity) {
    const strong = r.affinity.filter((l) => l.verdict === 'strong');
    for (const l of strong.slice(0, 1)) {
      items.push({
        title: `${l.label} agree`,
        body: `Your ${l.label} (${l.you} and ${l.them}) sit well together. This is structural compatibility — it does not guarantee harmony, but it means the foundation is sound.`,
      });
    }
  }
  if (!items.length) {
    items.push({
      title: 'The pattern is named',
      body: `Knowing that "${r.pattern.name.toLowerCase()}" is the shape of what you are dealing with is itself a strength. A named pattern can be worked with; an unnamed one repeats.`,
    });
    items.push({
      title: 'You are here',
      body: 'Seeking a reading is itself evidence of investment. The question is not whether you care — it is what to do with the caring.',
    });
  }
  return items.slice(0, 4);
}

function relFriction(r: RelationshipResult): Insight[] {
  const items: Insight[] = [];
  if (r.composite?.blindSpot.length) {
    for (const m of r.composite.blindSpot.slice(0, 2)) {
      items.push({
        title: `Neither carries ${m.label.toLowerCase()}`,
        body: `${m.number} is absent from both charts. ${m.absent}. This is structural — treating it as a character flaw in either of you is a mistake.`,
      });
    }
  }
  if (r.affinity) {
    const strained = r.affinity.filter((l) => l.verdict === 'strained');
    for (const l of strained.slice(0, 1)) {
      items.push({
        title: `${l.label} pull apart`,
        body: `Your ${l.label} (${l.you} and ${l.them}) are far enough apart to create friction. This is not personal — it is two sets of numbers wanting different things.`,
      });
    }
  }
  if (!items.length) {
    items.push({
      title: 'Friction is situational, not structural',
      body: 'The charts do not show a significant structural clash. Whatever friction exists is coming from circumstances or habits rather than from the numbers themselves.',
    });
    items.push({
      title: `The pattern: ${r.pattern.name.toLowerCase()}`,
      body: `${r.pattern.costs}`,
    });
  }
  return items.slice(0, 4);
}

function thirtyDayPlan(r: RelationshipResult): Step[] {
  return [
    {
      title: 'Week one — name the pattern',
      detail: `Say "${r.pattern.name.toLowerCase()}" out loud to yourself, and if you are ready, to them. A pattern named is a pattern that can be changed.`,
      when: 'Days 1–7',
    },
    {
      title: 'Week two — have the conversation',
      detail: 'Use the conversation guide above. One sitting, one subject, one question asked and then silence. End with one concrete agreement, however small.',
      when: 'Days 8–14',
    },
    {
      title: 'Week three — change one structural thing',
      detail: 'Something visible and ordinary — a standing time together, a division of a task, one habit stopped. Change that stays at the level of feeling does not survive a normal week.',
      when: 'Days 15–21',
    },
    {
      title: 'Week four — review honestly',
      detail: 'Look at what changed and what did not. If the conversation happened and one structural thing moved, that is real progress regardless of how it feels. If neither happened, the question is whether you are ready to do this, not whether you want to.',
      when: 'Days 22–30',
    },
  ];
}

/* ── dispatcher ──────────────────────────────────────────────────── */

export function deterministicSections(
  key: SectionKey,
  computed: unknown,
): Record<string, unknown> {
  switch (key) {
    case 'name-correction':
      return nameCorrection(computed as Computed);
    case 'numerology':
      return numerology(computed as Computed);
    case 'career-money':
      return careerMoney(computed as CareerResult);
    case 'relationship':
      return relationship(computed as RelationshipResult);
    case 'kundli':
      return {};
    default:
      return {};
  }
}
