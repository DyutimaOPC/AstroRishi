import Link from 'next/link';
import { Cover } from './Cover';
import { Ph } from './Placeholder';
import { ArrowRight, Check, Star } from './icons';
import { PRODUCTS, rupees, type Product, type ProductSlug } from '@/lib/config/products';
import { SITE, PANDIT } from '@/lib/config/site';

export function ProductCard({ p, featured = false }: { p: Product; featured?: boolean }) {
  if (!p.live) return <SoonCard p={p} />;
  const dark = featured;
  return (
    <div className={`flex flex-col gap-4 p-6 sm:p-7 ${dark ? 'bg-ink text-paper' : 'bg-paper'} ${featured ? 'lg:col-span-2 lg:grid lg:grid-cols-[200px_1fr] lg:items-center lg:gap-10' : ''}`}>
      <div className={featured ? '' : 'flex items-start gap-4 sm:gap-5'}>
        <Cover slug={p.slug} width={featured ? 200 : 104} />
        {!featured && <CardHead p={p} dark={dark} />}
      </div>
      <div className="flex flex-col gap-3.5">
        {featured && <CardHead p={p} dark={dark} />}
        <div className={`h-px ${dark ? 'bg-rule-dark' : 'bg-rule'}`} />
        <ul className={`grid gap-2 ${featured ? 'sm:grid-cols-2 sm:gap-x-7' : ''}`}>
          {p.inclusions.map((i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-snug">
              <Check size={14} className={dark ? 'text-haldi' : 'text-leaf'} />{i}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm text-ink-3 line-through">{rupees(p.comparePaise)}</span>
            <span className="disp text-[34px] leading-none">{rupees(p.pricePaise)}</span>
          </div>
          <Link href={`/reports/${p.slug}`} className={`${dark ? 'btn-gold' : 'btn'} min-h-[48px] px-5 text-sm`}>
            {p.live ? 'Get report' : 'Coming soon'} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * A report that is not on sale yet. It keeps its place on the shelf — the
 * catalogue promises five — but a card nobody can buy must not out-shout the
 * four that are ready, so it is muted and its call to action only reads.
 */
function SoonCard({ p }: { p: Product }) {
  return (
    <div className="flex flex-col gap-5 bg-paper-2 p-6 sm:p-7 lg:col-span-2 lg:flex-row lg:items-center lg:gap-9">
      <div className="flex flex-1 items-start gap-4 sm:gap-5">
        <div className="shrink-0 opacity-50 grayscale"><Cover slug={p.slug} width={104} /></div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="border border-ink-3 px-2 py-1 font-mono text-[9px] uppercase tracking-[.13em] text-ink-3">
              Coming soon
            </span>
          </div>
          <h3 className="disp text-2xl leading-tight text-ink-2 sm:text-[27px]">{p.name}</h3>
          <p className="text-sm leading-snug text-ink-3">{p.promise}</p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-2.5 lg:items-end">
        <p className="max-w-[32ch] text-[13px] leading-snug text-ink-3 lg:text-right">
          In preparation — expected <Ph value={SITE.kundliEta} />. The four reports above are ready today.
        </p>
        <Link
          href={`/reports/${p.slug}`}
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-ink-2 underline decoration-rule underline-offset-4 transition-colors hover:text-ink"
        >
          See what it will include <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function CardHead({ p, dark }: { p: Product; dark: boolean }) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {p.badge && (
          <span className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[.13em] ${dark ? 'border-haldi text-haldi' : 'border-sindoor text-sindoor'}`}>{p.badge}</span>
        )}
        <span className={`px-2 py-1 font-mono text-[9px] uppercase tracking-[.13em] ${dark ? 'bg-[#2E2822] text-[#B8B0A6]' : 'bg-paper-2 text-ink-2'}`}>
          {p.pages ? `${p.pages}+ pages` : <><Ph value={SITE.pagesUnknown} />+ pages</>}
        </span>
      </div>
      <h3 className="disp text-2xl leading-tight sm:text-[27px]">{p.name}</h3>
      <p className={`text-sm leading-snug ${dark ? 'text-[#B8B0A6]' : 'text-ink-2'}`}>{p.promise}</p>
    </div>
  );
}

const NAME_CHANGES = [
  { lang: 'Hindi cinema', before: 'Ajay Devgan', after: 'Ajay Devgn', note: 'Dropped the “a”. Ten letters became nine.' },
  { lang: 'Hindi cinema', before: 'Tushar Kapoor', after: 'Tusshar Kapoor', note: 'A doubled consonant — the commonest correction of all.' },
  { lang: 'Bengali cinema', before: 'Rani Mukherjee', after: 'Rani Mukerji', note: 'Lost an “h”, and the double “e” became a single “i”.' },
  { lang: 'Marathi cinema', before: 'Swapnil Joshi', after: 'Swwapnil Joshi', note: 'A doubled “w” — the spelling he brands himself with.' },
  { lang: 'Hindi cinema', before: 'Rajkumar Yadav', after: 'Rajkummar Rao', note: 'A doubled “m”, and a new surname to go with it.' },
];

/** Staggers the row so the five cards ripple instead of flipping together. */
const delay = (i: number) => ({ animationDelay: `${(i * 0.85).toFixed(2)}s` });

export function NameChanges() {
  return (
    <section className="bg-ink text-paper">
      <div className="wrap flex flex-col gap-8 py-16 lg:py-20">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-11">
          <div className="flex flex-col gap-3">
            <span className="lbl text-haldi">A matter of public record</span>
            <h2 className="disp max-w-[22ch] text-[32px] leading-tight lg:text-[44px]">
              You would not be the first to change a letter.
            </h2>
          </div>
          <p className="max-w-[42ch] text-[15.5px] leading-relaxed text-[#B8B0A6]">
            Across Hindi, Bengali and Marathi cinema, adjusting a spelling on a numerologist&rsquo;s advice is common
            enough to be unremarkable. Every change below has been widely reported.
          </p>
        </div>

        <div className="grid gap-px border border-rule-dark bg-rule-dark sm:grid-cols-2 lg:grid-cols-6">
          {NAME_CHANGES.map((n, i) => (
            <div key={n.after} className={`flex flex-col gap-3.5 bg-[#221D19] p-6 ${i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <span className="font-mono text-[9px] uppercase tracking-[.16em] text-ink-3">{n.lang}</span>
              <div className="flex flex-col gap-2.5">
                <span className="relative self-start">
                  <span className="disp nc-before text-xl leading-tight text-[#7E766D]" style={delay(i)}>{n.before}</span>
                  <span className="nc-strike absolute inset-x-0 top-1/2 h-[1.5px] bg-haldi" style={delay(i)} aria-hidden />
                </span>
                <span className="flex items-center gap-2.5">
                  <ArrowRight size={15} className="nc-arrow rotate-90 text-haldi" style={delay(i)} />
                  <span className="flex flex-col items-start gap-1">
                    <span className="disp nc-after text-[26px] leading-tight text-paper" style={delay(i)}>{n.after}</span>
                    <span className="nc-rule h-0.5 w-full bg-haldi" style={delay(i)} aria-hidden />
                  </span>
                </span>
              </div>
              <span className="mt-auto text-[13px] leading-relaxed text-[#B8B0A6]">{n.note}</span>
            </div>
          ))}
        </div>

        <div className="border-l-2 border-haldi pl-5">
          <p className="max-w-[76ch] text-base leading-relaxed text-[#E4DED5]">
            Did the change make the difference? Nobody can prove that, and we are not going to claim it. What it does
            show is that the question gets taken seriously by people with a great deal to lose — and that it costs you
            nothing to ask it about your own name.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/check" className="btn-gold">Check my name free <ArrowRight size={17} /></Link>
          <span className="font-mono text-[10.5px] uppercase tracking-[.13em] text-ink-3">Thirty seconds · no payment</span>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  ['Tell us about yourself', 'Your name, birth details and how to reach you. Nothing more than the report needs.'],
  ['Answer a few questions', 'A short fixed set, one screen at a time, so the report speaks to your situation.'],
  ['Complete your payment', 'UPI, card or net banking, secured by Razorpay.'],
  ['Receive your report', 'Read it on your phone straight away, save it as a PDF, come back to it any time.'],
] as const;

export function HowItWorks() {
  return (
    <section className="border-y border-rule bg-paper-2">
      <div className="wrap flex flex-col gap-9 py-16 lg:py-[72px]">
        <div className="flex flex-col gap-2.5">
          <span className="lbl text-sindoor">How it works</span>
          <h2 className="disp max-w-[20ch] text-[32px] leading-tight lg:text-[44px]">Four steps, about ten minutes.</h2>
        </div>
        <div className="grid gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, d], i) => (
            <div key={t} className="flex flex-col gap-2.5 bg-paper-2 p-6">
              <span className="disp text-[38px] leading-none text-sindoor">{i + 1}</span>
              <div className="text-lg font-semibold">{t}</div>
              <div className="text-sm leading-relaxed text-ink-2">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  ['A', 'Ananya R.', 'Pune', 'I had spelled my name the same way for 34 years. The report gave me two options and explained exactly what changed with each. Went with the second.'],
  ['K', 'Karthik S.', 'Chennai', 'Bought it for the career section. The job-versus-business verdict was blunter than I expected, which is what I needed.'],
  ['M', 'Meera J.', 'Jaipur', 'Detailed and clearly written. My mother read the whole thing too and understood every part of it.'],
  ['R', 'Rohit B.', 'Indore', 'Was expecting two vague paragraphs. Got a proper report with my own numbers actually worked out and explained.'],
  ['S', 'Sneha K.', 'Hyderabad', 'The 30-day plan at the end is the part I keep going back to.'],
  ['P', 'Priya N.', 'Kochi', 'The Lo Shu grid section explained a pattern I had wondered about for years.'],
] as const;

/** SAMPLE COPY — replace with real reviews before launch. See README. */
export function Reviews() {
  return (
    <section className="overflow-hidden py-16 lg:py-[72px]">
      <div className="wrap flex flex-wrap items-end justify-between gap-6 pb-7">
        <div className="flex flex-col gap-2.5">
          <span className="lbl text-sindoor">In their words</span>
          <h2 className="disp text-[32px] leading-tight lg:text-[44px]">What people say afterwards.</h2>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="disp text-3xl leading-none"><Ph value={SITE.rating} /></span>
          <div className="flex gap-0.5 text-haldi">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} />)}</div>
        </div>
      </div>
      <div className="marquee flex w-max gap-4.5" style={{ gap: 18 }}>
        {[...REVIEWS, ...REVIEWS].map(([ini, name, city, text], i) => (
          <figure key={i} className="flex w-[300px] shrink-0 flex-col gap-3 border border-rule bg-paper-card p-5 sm:w-[318px]">
            <div className="flex gap-0.5 text-haldi">{Array.from({ length: 5 }, (_, k) => <Star key={k} />)}</div>
            <blockquote className="text-sm leading-relaxed">{text}</blockquote>
            <figcaption className="mt-auto flex items-center gap-2.5 pt-1">
              <span className="flex h-[30px] w-[30px] items-center justify-center border border-[#E3CBC6] bg-sindoor-wash">
                <span className="disp text-sm text-sindoor">{ini}</span>
              </span>
              <span className="flex flex-col">
                <span className="text-[13.5px] font-semibold">{name}</span>
                <span className="font-mono text-[9.5px] uppercase tracking-[.12em] text-ink-3">{city} · verified purchase</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function ConsultUpsell() {
  const VALUE = [
    ['Fifteen minutes, one to one', 'On the phone, at a time you pick.'],
    [`${PANDIT.name} reads your report first`, 'You start at your situation, not at the beginning.'],
    ['A written summary afterwards', 'What you decided, sent to you on WhatsApp.'],
  ] as const;
  return (
    <section className="border-t border-rule-dark bg-ink-dark text-paper">
      <div className="wrap grid gap-10 py-16 lg:grid-cols-[1fr_356px] lg:gap-16 lg:py-[72px]">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-8 bg-haldi" />
            <span className="lbl text-haldi">The next step · after your report</span>
          </div>
          <h2 className="disp max-w-[20ch] text-[32px] leading-tight lg:text-[44px]">Ask {PANDIT.name}.</h2>
          <p className="max-w-[52ch] text-[17px] leading-relaxed text-[#C6BEB4]">
            Your report tells you where things stand. A call is for the part a report cannot do — your follow-up
            questions, the details you did not put in a form, and a straight answer on what to do next.
          </p>
          <div className="mt-1 grid gap-px border border-rule-dark bg-rule-dark">
            {VALUE.map(([t, s]) => (
              <div key={t} className="flex items-start gap-3 bg-[#1F1A16] p-4 sm:px-5">
                <Check className="mt-0.5 text-haldi" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15.5px] font-semibold">{t}</span>
                  <span className="text-[13.5px] leading-snug text-[#A79E93]">{s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5 border border-haldi bg-ink p-6 sm:p-7">
          <div className="flex items-center gap-4">
            <span className="flex h-[74px] w-[74px] shrink-0 items-center justify-center border border-[#4A4038] bg-[#2E2822] text-center">
              <span className="font-mono text-[8.5px] uppercase leading-relaxed tracking-[.12em] text-ink-3">[[ PHOTO ]]</span>
            </span>
            <div className="flex flex-col gap-1">
              <span className="disp text-[26px] leading-tight">{PANDIT.name}</span>
              <span className="font-mono text-[9.5px] uppercase tracking-[.14em] text-haldi">{PANDIT.role}</span>
              <span className="text-[12.5px] leading-snug text-[#A79E93]"><Ph value={SITE.panditBio} /></span>
            </div>
          </div>
          <div className="h-px bg-rule-dark" />
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ink-3">15-minute personal consultation</span>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[17px] text-ink-3 line-through">₹1,499</span>
              <span className="disp text-[52px] leading-none">₹999</span>
            </div>
            <span className="text-[13px] text-[#A79E93]">Report buyers only. Applied at checkout.</span>
          </div>
          <button type="button" className="btn-gold w-full">Book my call <ArrowRight size={17} /></button>
          <span className="text-center font-mono text-[9.5px] uppercase tracking-[.12em] text-ink-3">
            {PANDIT.name} takes <Ph value={SITE.callsPerWeek} /> calls a week
          </span>
        </div>
      </div>
    </section>
  );
}

export const FAQS: readonly (readonly [string, string])[] = [
  ['What information do you need from me?', 'Your full name as you write it today, your date of birth, and how to reach you. The Premium Kundli also needs your time and place of birth. Nothing else.'],
  ['How long does the report take?', `Most reports reach you within ${SITE.turnaround} of payment, on WhatsApp and email. If a report needs longer we tell you rather than leaving you waiting.`],
  ['Is the report really written for me?', 'Yes. Every number, grid and recommendation is worked out from the details you gave us — two people with different names or birth dates never receive the same report.'],
  ['How will I receive it?', 'As a private web link you can open on any device, plus a PDF you can save. The link stays valid, so you can come back to it whenever you like.'],
  ['Who can see my information?', 'Only the people preparing your report. We do not sell, share or publish your details, and we do not use your name in marketing.'],
  ['Can I request changes?', 'If something in your report looks wrong — a misspelling, the wrong birth date — tell us and we will correct and reissue it.'],
  ['What is your refund policy?', 'See our Refund & Cancellation Policy for the full terms, including the window in which a refund can be requested.'],
  ['What does a report represent — and what does it not?', 'It is interpretive guidance meant to help you think about your own situation. It is not a prediction, and it is not medical, psychological, legal or financial advice. No outcome is guaranteed.'],
];

export function Faq({ items = FAQS }: { items?: readonly (readonly [string, string])[] }) {
  return (
    <section className="wrap grid gap-10 py-16 lg:grid-cols-[.62fr_1fr] lg:gap-[70px] lg:py-[72px]">
      <div className="flex flex-col gap-3">
        <span className="lbl text-sindoor">Questions</span>
        <h2 className="disp text-[32px] leading-tight lg:text-[44px]">Before you buy.</h2>
        <p className="max-w-[32ch] text-[15px] leading-relaxed text-ink-2">
          Anything else, message us on WhatsApp at <Ph value={SITE.whatsapp} /> — a person replies.
        </p>
      </div>
      <div className="flex flex-col border-t border-rule">
        {items.map(([q, a]) => (
          <details key={q} className="group border-b border-rule py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
              {q}
              <span className="relative h-4 w-4 shrink-0">
                <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-sindoor" />
                <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-sindoor transition-transform group-open:scale-y-0" />
              </span>
            </summary>
            <p className="max-w-[62ch] pt-2 text-[15px] leading-relaxed text-ink-2">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FinalCta({ product }: { product?: ProductSlug }) {
  const p = product ? PRODUCTS[product] : null;
  return (
    <section className="bg-sindoor text-[#F9F1EF]">
      <div className="wrap flex flex-col items-start justify-between gap-8 py-14 lg:flex-row lg:items-center lg:py-[60px]">
        <div className="flex flex-col gap-3">
          <h2 className="disp max-w-[19ch] text-[34px] leading-tight lg:text-[46px]">
            {p ? `${p.name} Report` : 'Find out where your name stands.'}
          </h2>
          <p className="max-w-[44ch] text-[16.5px] leading-relaxed text-[#F3D9D4]">
            {p ? p.promise : 'Thirty seconds, no payment, and you will know straight away whether a report is worth your money.'}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 lg:items-end">
          {p && (
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[17px] text-[#EFC7C0] line-through">{rupees(p.comparePaise)}</span>
              <span className="disp text-[52px] leading-none">{rupees(p.pricePaise)}</span>
            </div>
          )}
          <Link href={p ? `/start/${p.slug}` : '/check'}
            className="inline-flex min-h-[56px] items-center gap-3 bg-ink px-8 text-[16.5px] font-semibold text-paper hover:bg-ink-dark hover:text-paper">
            {p ? 'Get my personalised report' : 'Check my name free'} <ArrowRight size={18} />
          </Link>
          <span className="font-mono text-[10.5px] uppercase tracking-[.13em] text-[#EFC7C0]">
            {p ? 'Secure payment · instant start' : 'No signup · No payment'}
          </span>
        </div>
      </div>
    </section>
  );
}
