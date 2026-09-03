import { SITE } from '@/lib/config/site';

export interface PolicyDoc {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}

const EMAIL = SITE.supportEmail;
const WA = SITE.whatsapp;
const UPDATED = 'September 2026';

export const POLICIES: PolicyDoc[] = [
  {
    slug: 'privacy-policy', title: 'Privacy Policy', updated: UPDATED,
    summary: 'What we collect, why we collect it, and what we never do with it.',
    sections: [
      { heading: 'Who we are', body: [`This site is operated by AstroRishi. You can reach us at ${EMAIL} or on WhatsApp at ${WA}.`] },
      { heading: 'What we collect', body: [
        'To prepare a report we collect your name, date of birth, and the answers you give in the questionnaire. For the Premium Kundli we also collect your time and place of birth.',
        'To deliver it we collect your mobile number and email address.',
        'To take payment we pass the amount and your contact details to Razorpay. Card and bank details are handled entirely by Razorpay and never reach our servers.',
        'We also record basic analytics about how people move through the site, including the advertisement or link that brought you here.',
      ]},
      { heading: 'Why we collect it', body: [
        'Your name and birth details are the raw material of your report — without them there is nothing to calculate. Your contact details exist so we can send you what you paid for and answer you if you write to us.',
        'We do not sell your data. We do not share it with advertisers. We do not use your name, your details or your report in marketing.',
      ]},
      { heading: 'Who can see it', body: [
        'Only the people preparing and checking your report. Reports are reachable at a private link containing a long random token; they are not listed, indexed or searchable.',
      ]},
      { heading: 'How long we keep it', body: [
        `We keep your order and report so you can return to it later. If you would like your data deleted, write to ${EMAIL} and we will remove it, subject to any records we are legally required to retain for tax and accounting purposes.`,
      ]},
      { heading: 'Cookies', body: ['See our Cookie Policy for what is set and why.'] },
      { heading: 'Your rights', body: [
        `You can ask us what we hold about you, ask for it to be corrected, or ask for it to be deleted. Write to ${EMAIL} and we will respond.`,
      ]},
    ],
  },
  {
    slug: 'terms', title: 'Terms & Conditions', updated: UPDATED,
    summary: 'The agreement between you and us when you buy a report.',
    sections: [
      { heading: 'What you are buying', body: [
        'A personalised written report, prepared from the details you provide, delivered as a private web page and a downloadable PDF.',
        'Reports are prepared individually. The content depends entirely on the information you give us, so please give it accurately.',
      ]},
      { heading: 'What a report is not', body: [
        'AstroRishi reports are interpretive guidance intended for personal reflection. They are not predictions of future events.',
        'They are not medical, psychological, legal, financial or investment advice, and must not be relied on as a substitute for a qualified professional.',
        'No outcome is guaranteed. Anyone who tells you otherwise about this kind of work is not being straight with you.',
      ]},
      { heading: 'Your responsibilities', body: [
        'You confirm you are at least 18 years old and that the details you give us are your own or that you have permission to share them.',
        'Reports are for your personal use. Please do not resell or republish them.',
      ]},
      { heading: 'Payment', body: [
        'Prices are shown in Indian Rupees and are inclusive of applicable taxes. Payment is collected by Razorpay.',
      ]},
      { heading: 'Liability', body: [
        'To the extent permitted by law, AstroRishi\'s liability in connection with a report is limited to the amount you paid for it.',
      ]},
      { heading: 'Governing law', body: ['These terms are governed by the laws of India, and the courts at Jaipur have exclusive jurisdiction.'] },
    ],
  },
  {
    slug: 'refund-policy', title: 'Refund & Cancellation Policy', updated: UPDATED,
    summary: 'Each report is personalised and generated instantly, so refunds are not available once delivered.',
    sections: [
      { heading: 'No refunds on delivered reports', body: [
        'Each AstroRishi report is a customised digital product, generated the moment you pay and personalised to the name, date of birth and answers you provide. Because of this, delivered reports cannot be returned or refunded.',
        'This is consistent with consumer protection provisions for personalised and instantly-delivered digital goods.',
      ]},
      { heading: 'Corrections at no charge', body: [
        'If something is wrong with your report — a misspelled name, the wrong birth date, a section missing — tell us and we will correct and reissue it at no charge.',
      ]},
      { heading: 'Payment not received', body: [
        'If your payment was debited but you did not receive your report, write to us and we will either deliver the report or reverse the charge.',
      ]},
      { heading: 'How to reach us', body: [
        `Write to ${EMAIL} or message us on WhatsApp at ${WA} with your order number.`,
      ]},
    ],
  },
  {
    slug: 'shipping-policy', title: 'Shipping & Delivery Policy', updated: UPDATED,
    summary: 'Everything is digital. Here is how and when it reaches you.',
    sections: [
      { heading: 'Digital delivery only', body: [
        'AstroRishi sells digital reports. Nothing is physically shipped, and there are no delivery charges.',
      ]},
      { heading: 'How your report reaches you', body: [
        'Your report is generated instantly after payment and delivered as a private link on WhatsApp and by email to the number and address you gave at checkout.',
        'You can read it on any device and save it as a PDF. The link stays valid, so you can return to it whenever you like.',
      ]},
      { heading: 'If it does not arrive', body: [
        `Check your spam folder first, and make sure the number and address you entered were right. If it still has not arrived, write to ${EMAIL} or message ${WA} with your order number and we will resend it.`,
      ]},
    ],
  },
  {
    slug: 'cookie-policy', title: 'Cookie Policy', updated: UPDATED,
    summary: 'What is stored in your browser and why.',
    sections: [
      { heading: 'What we set', body: [
        'Essential cookies keep your session and your place in the questionnaire so your answers are not lost if you refresh.',
        'Analytics cookies help us understand which pages people find useful and where they leave, so we can improve them.',
        'Advertising cookies, where enabled, let us measure whether an advertisement led to a purchase.',
      ]},
      { heading: 'Your choices', body: [
        'You can block or delete cookies in your browser settings. Essential cookies are needed for checkout to work; blocking them will prevent you from completing a purchase.',
      ]},
    ],
  },
  {
    slug: 'pricing-policy', title: 'Pricing & Payments', updated: UPDATED,
    summary: 'What things cost and how payment is handled.',
    sections: [
      { heading: 'Prices', body: [
        'All prices are in Indian Rupees and inclusive of applicable taxes. The price you see on the product page is the price you pay; there are no delivery or handling charges.',
        'Where a promotional price is shown alongside a struck-through price, the struck-through figure is our standard list price for that report.',
      ]},
      { heading: 'How payment is taken', body: [
        'Payments are processed by Razorpay, which supports UPI, debit and credit cards, net banking and wallets. We never see or store your card details.',
      ]},
      { heading: 'Invoices', body: [`If you need a GST invoice, write to ${EMAIL} with your order number and GSTIN.`] },
    ],
  },
  {
    slug: 'disclaimer', title: 'Disclaimer', updated: UPDATED,
    summary: 'What these reports represent, stated plainly.',
    sections: [
      { heading: 'Interpretive guidance', body: [
        'Numerology and Vedic astrology are traditions of interpretation. AstroRishi reports apply those traditions to the details you give us and set out what they suggest.',
        'They are offered to help you think about your own situation. They are not statements of fact about the future.',
      ]},
      { heading: 'No guarantees', body: [
        'We do not guarantee any outcome — not wealth, not marriage, not promotion, not health, and not the accuracy of any interpretation.',
      ]},
      { heading: 'Not professional advice', body: [
        'Nothing in an AstroRishi report is medical, psychological, legal, financial or investment advice. If you are facing a decision in any of those areas, please speak to someone qualified to advise on it.',
        'If you are struggling with your mental health, please contact a doctor or a helpline. A report is not a substitute for care.',
      ]},
      { heading: 'About other people', body: [
        'Where a report touches on a relationship, it works only from what you have told us. It cannot and does not claim to know what anyone else privately thinks, feels or intends.',
      ]},
    ],
  },
];

export const policyBySlug = (slug: string): PolicyDoc | undefined =>
  POLICIES.find((p) => p.slug === slug);
