import { compute } from '../src/lib/numerology';
import { careerReport } from '../src/lib/career';
import { relationshipReport } from '../src/lib/relationship';
import { generateSections } from '../src/lib/report/generate';
import type { SectionKey } from '../src/lib/config/products';

interface Sample {
  label: string;
  key: SectionKey;
  answers: Record<string, string>;
}

const SAMPLES: Sample[] = [
  {
    label: 'Priya Sharma — name-correction',
    key: 'name-correction',
    answers: {
      fullName: 'Priya Sharma', dob: '1992-03-14', gender: 'Woman',
      preferredName: 'Priya', focus: 'Career and growth',
      changedBefore: 'No, never', context: 'I feel stuck at work and wonder if my name plays a role.',
      phone: '9876543210', email: 'priya@example.com',
    },
  },
  {
    label: 'Rahul Verma — career-money',
    key: 'career-money',
    answers: {
      fullName: 'Rahul Verma', dob: '1988-07-22', gender: 'Man',
      occupation: 'Software engineer', experience: '5 to 10',
      employment: 'Salaried', income: '₹75,000 to ₹2 lakh',
      concern: 'Growth has stalled', satisfaction: 'A little',
      preference: 'Leaning business', risk: 'Moderate',
      goal: 'I want to start my own consulting business this year.',
      phone: '9876543210', email: 'rahul@example.com',
    },
  },
  {
    label: 'Meera Patel — relationship',
    key: 'relationship',
    answers: {
      fullName: 'Meera Patel', dob: '1995-11-05', gender: 'Woman',
      status: 'Married', duration: '3 to 7 years',
      partnerName: 'Arjun Patel', partnerDob: '1993-02-18',
      concern: 'We keep having the same fight',
      communication: 'It turns into an argument',
      changed: 'Money pressure', outcome: 'Repair and stay together',
      context: 'We argue about finances constantly.',
      phone: '9876543210', email: 'meera@example.com',
    },
  },
];

async function run() {
  for (const sample of SAMPLES) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`  ${sample.label}`);
    console.log(`${'='.repeat(70)}\n`);

    let computed: unknown;
    if (sample.key === 'name-correction' || sample.key === 'numerology') {
      computed = compute({ fullName: sample.answers.fullName, dob: sample.answers.dob });
    } else if (sample.key === 'career-money') {
      computed = careerReport(sample.answers);
    } else if (sample.key === 'relationship') {
      computed = relationshipReport(sample.answers);
    }

    try {
      const result = await generateSections(sample.key, computed, sample.answers);
      console.log(`Model: ${result.model} | Attempts: ${result.attempts} | Findings: ${result.findings.length}`);
      if (result.findings.length > 0) {
        console.log('Findings:', result.findings.map(f => `${f.severity}: ${f.category} at ${f.path}`).join(', '));
      }
      console.log('\n--- GENERATED PROSE ---\n');
      printSections(result.sections);
    } catch (e) {
      console.error(`FAILED:`, e);
    }
  }
}

function printSections(sections: unknown) {
  if (!sections || typeof sections !== 'object') return;
  for (const [key, value] of Object.entries(sections as Record<string, unknown>)) {
    if (typeof value === 'string') {
      console.log(`\n[${key}]`);
      console.log(value);
    } else if (Array.isArray(value)) {
      console.log(`\n[${key}] (${value.length} items)`);
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          const obj = item as Record<string, string>;
          if (obj.title && obj.body) console.log(`  • ${obj.title}: ${obj.body}`);
          else if (obj.title && obj.detail) console.log(`  • ${obj.title}: ${obj.detail}${obj.when ? ` (${obj.when})` : ''}`);
          else console.log(`  •`, JSON.stringify(obj));
        }
      }
    }
  }
}

run().catch(console.error);
