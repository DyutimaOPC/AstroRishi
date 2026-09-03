/**
 * A phonetic key for Indian romanisations.
 *
 * Indian names are written in Devanagari, Bengali, Tamil and so on, and
 * *transliterated* into Latin. There is no single correct Latin spelling —
 * Ronak, Raunak, Rounak and Rounaq are all रौनक. This collapses the conventions
 * that vary without changing the sound, so every spelling of one name lands on
 * one key.
 *
 * Soundex and Metaphone are built for English and collapse the wrong things
 * (they would merge Rakesh with Rajesh), which is why this is hand-built.
 */
export function phoneticKey(name: string): string {
  let s = name.toLowerCase().replace(/[^a-z]/g, '');
  if (!s) return '';

  // Aspirates and digraphs, longest first.
  s = s.replace(/ph/g, 'f').replace(/kh/g, 'k').replace(/gh/g, 'g')
       .replace(/th/g, 't').replace(/dh/g, 'd').replace(/bh/g, 'b').replace(/jh/g, 'j')
       .replace(/ck/g, 'k').replace(/sh/g, 's').replace(/ch/g, 'c');

  // Consonant conventions carrying no sound difference.
  s = s.replace(/q/g, 'k').replace(/w/g, 'v').replace(/x/g, 'ks');

  // Vowel length and digraphs — the main axis of variation. Back vowels all
  // collapse together so Vipul and Vipool meet.
  s = s.replace(/(?:aa|ah)/g, 'a')
       .replace(/(?:ee|ea|ie)/g, 'i')
       .replace(/(?:oo|ou|au|aw|oh|u)/g, 'o')
       .replace(/(?:ai|ay|ei)/g, 'e');

  // A doubled letter never changes the sound.
  s = s.replace(/(.)\1+/g, '$1');
  return s;
}

/** Two spellings that a Chaldean reader would call the same name. */
export const sameName = (a: string, b: string): boolean =>
  phoneticKey(a) === phoneticKey(b) && phoneticKey(a) !== '';
