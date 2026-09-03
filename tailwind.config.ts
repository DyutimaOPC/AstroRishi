import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#F2F1EC', 2: '#E9E7DF', card: '#FFFDF8' },
        ink: { DEFAULT: '#1A1714', 2: '#57514A', 3: '#8A8279', dark: '#241F1A' },
        rule: { DEFAULT: '#D5D1C6', dark: '#3A332C' },
        sindoor: { DEFAULT: '#BE3A2B', deep: '#8F2B20', wash: '#F7EDEB' },
        haldi: { DEFAULT: '#D99A2B', deep: '#8A5608' },
        leaf: '#2F6B4F',
        // sampled from the logo artwork, so the mark never sits slightly off
        brand: { maroon: '#6B1F1B', gold: '#DBA048', cream: '#FDF8ED' },
        // report cover hues, one per product
        cover: {
          name: '#A11C1C', numerology: '#C25A0A', career: '#1F5D3A',
          relationship: '#96143F', kundli: '#6B1010', gold: '#D9AE55', gold2: '#F0D492',
        },
      },
      fontFamily: {
        disp: ['var(--font-disp)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Helvetica Neue', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: { wrap: '1200px' },
    },
  },
  plugins: [],
} satisfies Config;
