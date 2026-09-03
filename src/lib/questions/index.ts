import type { ProductSlug } from '@/lib/config/products';
import { together, type Questionnaire } from './types';

const contact = {
  id: 'contact',
  title: 'Where should we send it?',
  intro: 'Your report goes to both, so it does not get lost.',
  fields: [
    { key: 'phone', kind: 'tel' as const, label: 'WhatsApp number', required: true, placeholder: '98XXX XXXXX' },
    { key: 'email', kind: 'email' as const, label: 'Email', required: true, placeholder: 'you@example.com' },
  ],
};

const identity = {
  id: 'identity',
  title: 'What is your name, exactly as you write it?',
  intro: 'Spelling matters here — use the form you actually sign and introduce yourself with.',
  fields: [
    { key: 'fullName', kind: 'text' as const, label: 'Full name', required: true, maxLength: 80 },
    { key: 'dob', kind: 'date' as const, label: 'Date of birth', required: true },
  ],
};

const FOCUS = ['Career and growth', 'Money and stability', 'Marriage or relationship', 'Health and energy', 'Peace of mind', 'Something else'];

export const QUESTIONNAIRES: Readonly<Record<ProductSlug, Questionnaire>> = {
  'name-numerology': {
    steps: [
      identity,
      { id: 'gender', title: 'How do you identify?', fields: [
        { key: 'gender', kind: 'radio', label: 'Gender', required: true, options: ['Woman', 'Man', 'Another term', 'Prefer not to say'] }] },
      { id: 'preferred', title: 'What do people actually call you?', fields: [
        { key: 'preferredName', kind: 'text', label: 'Preferred or calling name', maxLength: 60 }] },
      { id: 'focus', title: 'What matters most to you right now?',
        intro: 'This shapes which parts of your report go deepest. Pick one.',
        fields: [{ key: 'focus', kind: 'radio', label: 'Main focus', required: true, options: FOCUS }] },
      { id: 'changed', title: 'Have you changed the spelling before?', fields: [
        { key: 'changedBefore', kind: 'radio', label: 'Changed before', required: true, options: ['No, never', 'Yes, once', 'Yes, more than once'] }] },
      { id: 'context', title: 'Anything you want the report to address?',
        intro: 'Optional. A sentence or two is plenty.',
        fields: [{ key: 'context', kind: 'textarea', label: 'Your question', maxLength: 500 }] },
      contact,
    ],
  },
  'career-relationship': {
    steps: [
      identity,
      { id: 'work', title: 'Where are you working right now?', fields: [
        { key: 'occupation', kind: 'text', label: 'Current occupation', required: true, maxLength: 80 },
        { key: 'experience', kind: 'radio', label: 'Years of experience', required: true, options: ['Under 2', '2 to 5', '5 to 10', '10 to 20', 'Over 20'] }] },
      { id: 'employment', title: 'How are you employed?', fields: [
        { key: 'employment', kind: 'radio', label: 'Employment', required: true, options: ['Salaried', 'Self-employed', 'Business owner', 'Between roles', 'Studying'] },
        { key: 'income', kind: 'radio', label: 'Monthly income range', required: true, options: ['Under ₹25,000', '₹25,000 to ₹75,000', '₹75,000 to ₹2 lakh', 'Over ₹2 lakh', 'Prefer not to say'] }] },
      { id: 'concern', title: 'What is your biggest career concern?', fields: [
        { key: 'concern', kind: 'radio', label: 'Main concern', required: true, options: ['Growth has stalled', 'Money is not enough', 'No stability', 'Burnout', 'Starting a business', 'Finding a new direction', 'Something else'] },
        { key: 'satisfaction', kind: 'radio', label: 'How satisfied are you today?', required: true, options: ['Not at all', 'A little', 'Somewhat', 'Mostly', 'Very'] }] },
      { id: 'appetite', title: 'How much risk can you take?', fields: [
        { key: 'preference', kind: 'radio', label: 'Job or business', required: true, options: ['Definitely a job', 'Leaning job', 'Undecided', 'Leaning business', 'Definitely business'] },
        { key: 'risk', kind: 'radio', label: 'Risk tolerance', required: true, options: ['Very low', 'Low', 'Moderate', 'High', 'Very high'] }] },
      { id: 'goal', title: 'What would a good year look like?', fields: [
        { key: 'goal', kind: 'textarea', label: 'Your goal', required: true, maxLength: 500 }] },
      { id: 'relStatus', title: 'Where do things stand in your relationship?', fields: [
        { key: 'relStatus', kind: 'radio', label: 'Relationship status', required: true, options: ['Dating', 'Engaged', 'Married', 'Separated', 'It is complicated', 'Single'] },
        { key: 'duration', kind: 'radio', label: 'How long', required: true, options: ['Not applicable', 'Under a year', '1 to 3 years', '3 to 7 years', '7 to 15 years', 'Over 15 years'] }] },
      { id: 'partner', title: 'Tell us about them',
        intro: 'Optional — but this is what turns the report from a reading of you into a reading of the two of you.',
        fields: [
          { key: 'partnerName', kind: 'text', label: 'Their full name', maxLength: 80 },
          { key: 'partnerDob', kind: 'date', label: 'Their date of birth' }] },
      { id: 'relConcern', title: 'What brought you here for relationship guidance?', fields: [
        { key: 'relConcern', kind: 'radio', label: 'Main concern', required: true, options: ['We keep having the same fight', 'We have grown apart', 'Trust has been broken', 'Family is against it', 'They will not commit', 'I am not sure I want this', 'Just want a reading', 'Something else'] },
        { key: 'communication', kind: 'radio', label: 'Communication', required: true, options: ['Openly, most of the time', 'Only when things are calm', 'We avoid the hard things', 'It turns into an argument', 'We barely talk now', 'Not applicable'] },
        { key: 'changed', kind: 'radio', label: 'What changed recently', required: true, options: ['Nothing specific', 'A move or a job change', 'Money pressure', 'Family involvement', 'A breach of trust', 'Illness or loss'] }] },
      { id: 'outcome', title: 'What do you want to happen?', fields: [
        { key: 'outcome', kind: 'radio', label: 'Desired outcome', required: true, options: ['Repair and stay together', 'Decide whether to stay', 'Leave well', 'Understand myself better'] },
        { key: 'relContext', kind: 'textarea', label: 'Anything else we should know', maxLength: 600 }] },
      contact,
    ],
    refinements: [
      together('partnerName', 'partnerDob', 'partnerDob',
        'We need their date of birth as well as their name — without it we cannot read the two charts together. Leave both blank to skip this.'),
    ],
  },
  kundli: {
    steps: [
      identity,
      { id: 'birth', title: 'When and where were you born?',
        intro: 'A birth chart needs all three. If you are unsure of the time, give your closest estimate.',
        fields: [
          { key: 'birthTime', kind: 'text', label: 'Time of birth (HH:MM)', required: true, placeholder: '14:35' },
          { key: 'birthPlace', kind: 'text', label: 'Place of birth', required: true, maxLength: 90 }] },
      { id: 'focus', title: 'What matters most to you right now?',
        fields: [{ key: 'focus', kind: 'radio', label: 'Main focus', required: true, options: FOCUS }] },
      contact,
    ],
  },
};
