/**
 * Rhyme scoring for Battle Rap: does the player's last word rhyme with the enemy's?
 * Runs on the server (the CMU dictionary is 4.7 MB) and is deterministic, so a judge
 * model can't be talked into hearing a rhyme that isn't there.
 *
 * Words are compared by their rhyme tail: the phonemes from the last stressed vowel
 * to the end ("street" → IY T). Slang and made-up words fall back to a slang lexicon,
 * then to a dictionary word with the same spelling ending, then to a spelling guess.
 */

import { dictionary } from 'cmu-pronouncing-dictionary'
import { SLANG } from './slang.js'

export type RhymeType = 'perfect' | 'slant' | 'consonance' | 'repeat' | 'none'

export interface RhymeResult {
  /** 0 (no rhyme) to 1 (perfect), up to 1.4 with a multi-syllable rhyme. */
  score: number
  type: RhymeType
  /** 'low' when either word's pronunciation was guessed rather than looked up. */
  confidence: 'high' | 'low'
  enemyWord: string
  playerWord: string
}

type Source = 'dict' | 'slang' | 'suffix' | 'guess'

interface Pronunciation {
  phones: string[]
  source: Source
}

const VOWELS = new Set([
  'AA',
  'AE',
  'AH',
  'AO',
  'AW',
  'AY',
  'EH',
  'ER',
  'EY',
  'IH',
  'IY',
  'OW',
  'OY',
  'UH',
  'UW',
])

const base = (phone: string) => phone.replace(/\d$/, '')
const isVowel = (phone: string) => VOWELS.has(base(phone))
const stressed = (phone: string) => /[12]$/.test(phone)

/**
 * Vowels compared loosely, the way rap rhymes them: the cot/caught merger, and every
 * unstressed vowel (unstressed "-er" included) as a schwa, so "finna" rhymes with
 * "dinner" and "gangsta" with "pasta".
 */
function vowelKey(phone: string): string {
  if (phone.endsWith('0')) return 'AX'
  const v = base(phone)
  return v === 'AO' ? 'AA' : v
}

// ── Word lookup ──────────────────────────────────────────────────────────────

const dict = dictionary as Readonly<Record<string, string>>

/** Lowercase letters and apostrophes, stretched letters collapsed: "Thruuuu!" → "thru". */
export function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z']/g, '')
    .replace(/(.)\1{2,}/g, '$1')
    .replace(/^'+|(?<!in)'+$/g, '')
}

/** The last word of the last non-empty line. */
export function lastWord(bar: string): string {
  const lines = bar
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const words = (lines.at(-1) ?? '').split(/\s+/).map(normalizeWord).filter(Boolean)
  return words.at(-1) ?? ''
}

/** The last `count` words of the bar's last line, for multi-syllable rhymes. */
function lastWords(bar: string, count: number): string[] {
  const lines = bar
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  return (lines.at(-1) ?? '').split(/\s+/).map(normalizeWord).filter(Boolean).slice(-count)
}

const split = (arpabet: string) => arpabet.split(' ')

export function pronounce(word: string): Pronunciation | null {
  if (!word) return null
  const slang = SLANG[word] ?? SLANG[word.replace(/'$/, '')]
  if (slang) return { phones: split(slang), source: 'slang' }
  const known = dict[word]
  if (known) return { phones: split(known), source: 'dict' }

  // Dropped g: "runnin'" / "runnin" sound like "running" ending in N.
  const ing = word.replace(/in'?$/, 'ing')
  if (ing !== word && dict[ing]) {
    const phones = split(dict[ing] as string)
    if (phones.at(-1) === 'NG') phones[phones.length - 1] = 'N'
    return { phones, source: 'dict' }
  }

  // Plurals and possessives of known words.
  const stem = word.replace(/'?s$/, '')
  if (stem !== word && dict[stem]) {
    const phones = split(dict[stem] as string)
    const last = phones.at(-1) ?? ''
    phones.push(['P', 'T', 'K', 'F', 'TH'].includes(last) ? 'S' : 'Z')
    return { phones, source: 'dict' }
  }

  const borrowed = suffixMatch(word)
  if (borrowed) return { phones: borrowed, source: 'suffix' }
  return { phones: guess(word), source: 'guess' }
}

/** Borrows the rhyme of the dictionary word sharing the longest spelling ending (3+ letters). */
function suffixMatch(word: string): string[] | null {
  for (let len = Math.min(6, word.length - 1); len >= 3; len--) {
    const ending = word.slice(-len)
    for (const key in dict) {
      if (key.endsWith(ending) && !key.includes('(')) return split(dict[key] as string)
    }
  }
  return null
}

const VOWEL_GROUPS: [RegExp, string][] = [
  [/(ee|ea|ie|ey)$/, 'IY1'],
  [/(oo|ew|ue)$/, 'UW1'],
  [/(ow|ou)$/, 'AW1'],
  [/(oy|oi)$/, 'OY1'],
  [/(ay|ai|ei)$/, 'EY1'],
  [/(oa|oe)$/, 'OW1'],
  [/(au|aw)$/, 'AO1'],
]

const CONSONANTS: [string, string[]][] = [
  ['tch', ['CH']],
  ['ck', ['K']],
  ['ng', ['NG']],
  ['sh', ['SH']],
  ['ch', ['CH']],
  ['th', ['TH']],
  ['ph', ['F']],
  ['x', ['K', 'S']],
  ['q', ['K']],
  ['c', ['K']],
  ['j', ['JH']],
  ['y', ['Y']],
]

/** A rough guess at a made-up word's final syllable from its spelling. */
function guess(word: string): string[] {
  const letters = word.replace(/'/g, '')
  const m = /([aeiouy]+)([^aeiouy]*)(e?)$/.exec(letters)
  if (!m) return ['AH1', ...consonantsOf(letters)]
  const [, vowels = '', coda = '', silentE = ''] = m
  let vowel = 'AH1'
  const group = VOWEL_GROUPS.find(([re]) => re.test(vowels))
  if (group) vowel = group[1]
  else if (vowels.endsWith('y') && coda === '') vowel = 'IY1'
  else {
    const v = vowels.at(-1)
    // Magic e: "rake", "bite", "dote", "cute".
    const long = silentE !== '' && coda.length === 1
    vowel =
      v === 'a'
        ? long
          ? 'EY1'
          : 'AE1'
        : v === 'e'
          ? 'EH1'
          : v === 'i'
            ? long
              ? 'AY1'
              : 'IH1'
            : v === 'o'
              ? long
                ? 'OW1'
                : 'AA1'
              : v === 'u'
                ? long
                  ? 'UW1'
                  : 'AH1'
                : 'IH1'
  }
  if (coda.startsWith('r')) {
    // R-coloured vowels: "-ar" / "-or" keep their vowel, the rest become ER ("skurt").
    const rest = consonantsOf(coda.slice(1))
    const v = vowels.at(-1)
    if (v === 'a') return ['AA1', 'R', ...rest]
    if (v === 'o') return ['AO1', 'R', ...rest]
    return ['ER1', ...rest]
  }
  return [vowel, ...consonantsOf(coda)]
}

function consonantsOf(letters: string): string[] {
  const out: string[] = []
  let rest = letters.replace(/(.)\1+/g, '$1')
  while (rest) {
    const digraph = CONSONANTS.find(([spelling]) => rest.startsWith(spelling))
    if (digraph) {
      out.push(...digraph[1])
      rest = rest.slice(digraph[0].length)
    } else {
      out.push(rest[0]?.toUpperCase() ?? '')
      rest = rest.slice(1)
    }
  }
  return out.filter(Boolean)
}

// ── Comparing ────────────────────────────────────────────────────────────────

/** From the last stressed vowel (or the last vowel, if none is stressed) to the end. */
function rhymeTail(phones: string[]): string[] {
  let start = -1
  for (let i = phones.length - 1; i >= 0; i--) {
    const p = phones[i] as string
    if (isVowel(p) && stressed(p)) {
      start = i
      break
    }
    if (start < 0 && isVowel(p)) start = i
  }
  return start < 0 ? phones : phones.slice(start)
}

const CLASSES: string[][] = [
  ['P', 'B', 'T', 'D', 'K', 'G'],
  ['F', 'V', 'TH', 'DH', 'S', 'Z', 'SH', 'ZH', 'HH'],
  ['M', 'N', 'NG'],
  ['L', 'R'],
  ['W', 'Y'],
  ['CH', 'JH'],
]
const VOICING = new Set(['P|B', 'T|D', 'K|G', 'F|V', 'S|Z', 'SH|ZH', 'TH|DH', 'CH|JH'])

function consonantSimilarity(a: string | undefined, b: string | undefined): number {
  if (a === b) return 1
  // One word has a consonant the other doesn't ("do" / "confused").
  if (!a || !b) return 0.2
  if (VOICING.has(`${a}|${b}`) || VOICING.has(`${b}|${a}`)) return 0.85
  return CLASSES.some((c) => c.includes(a) && c.includes(b)) ? 0.7 : 0.3
}

function vowelsOf(phones: string[]): string[] {
  return phones.filter(isVowel).map(vowelKey)
}

/** How alike two rhyme tails are: 1 identical, 0.5–0.8 same vowels, 0.3 same ending consonants. */
function compareTails(a: string[], b: string[]): { score: number; type: RhymeType } {
  const key = (phones: string[]) => phones.map((p) => (isVowel(p) ? vowelKey(p) : p)).join(' ')
  if (key(a) === key(b)) return { score: 1, type: 'perfect' }

  const va = vowelsOf(a)
  const vb = vowelsOf(b)
  if (va.join() === vb.join()) {
    // Same vowels: score the consonants after the vowel, aligned from the end.
    const ca = a.filter((p) => !isVowel(p))
    const cb = b.filter((p) => !isVowel(p))
    const n = Math.max(ca.length, cb.length, 1)
    let total = 0
    for (let i = 1; i <= n; i++) total += consonantSimilarity(ca.at(-i), cb.at(-i))
    return { score: Math.round((0.5 + 0.3 * (total / n)) * 100) / 100, type: 'slant' }
  }

  const lastA = a.at(-1)
  if (lastA && !isVowel(lastA) && lastA === b.at(-1)) return { score: 0.3, type: 'consonance' }
  return { score: 0, type: 'none' }
}

/**
 * Multi-syllable bonus: stressed vowels that keep matching, walking back from the end of
 * both phrases, beyond the rhyme tail itself ("my MO-ney TALKS" / "your HO-ney WALKS").
 * Unstressed vowels can carry the match but don't earn it, or every "the"/"a" would count.
 */
function multiBonus(enemyBar: string, playerBar: string, tailVowels: number): number {
  const phrase = (bar: string) =>
    lastWords(bar, 3)
      .flatMap((w) => pronounce(w)?.phones ?? [])
      .filter(isVowel)
  const va = phrase(enemyBar)
  const vb = phrase(playerBar)
  let stressedExtra = 0
  for (let i = 1; i <= Math.min(va.length, vb.length); i++) {
    const a = va.at(-i) as string
    const b = vb.at(-i) as string
    if (vowelKey(a) !== vowelKey(b)) break
    if (i > tailVowels && stressed(a) && stressed(b)) stressedExtra++
  }
  return stressedExtra >= 2 ? 0.4 : stressedExtra === 1 ? 0.2 : 0
}

/** Does the player's bar rhyme with the enemy's? */
export function rhymeScore(enemyBar: string, playerBar: string): RhymeResult {
  const enemyWord = lastWord(enemyBar)
  const playerWord = lastWord(playerBar)
  const result = (score: number, type: RhymeType, confidence: 'high' | 'low' = 'high') => ({
    score,
    type,
    confidence,
    enemyWord,
    playerWord,
  })
  if (!enemyWord || !playerWord) return result(0, 'none')
  if (enemyWord === playerWord) return result(0.2, 'repeat')

  const a = pronounce(enemyWord)
  const b = pronounce(playerWord)
  if (!a || !b) return result(0, 'none', 'low')
  const confidence =
    a.source === 'guess' || a.source === 'suffix' || b.source === 'guess' || b.source === 'suffix'
      ? 'low'
      : 'high'

  // "beat" / "upbeat": a compound of the same word is a weak rhyme at best. Only when the
  // leftover prefix is a word itself, so "end" / "mend" and "ring" / "string" still rhyme.
  const [shorter, longer] =
    enemyWord.length <= playerWord.length ? [enemyWord, playerWord] : [playerWord, enemyWord]
  const prefix = longer.slice(0, longer.length - shorter.length)
  const prefixIsWord = prefix.length >= 2 && /[aeiouy]/.test(prefix) && prefix in dict
  if (shorter.length >= 3 && longer.endsWith(shorter) && prefixIsWord) {
    return result(0.5, 'repeat', confidence)
  }

  const tailA = rhymeTail(a.phones)
  const tailB = rhymeTail(b.phones)
  const { score, type } = compareTails(tailA, tailB)
  if (type === 'none' || type === 'consonance') return result(score, type, confidence)

  const bonus = multiBonus(enemyBar, playerBar, vowelsOf(tailA).length)
  return result(Math.min(1.4, score + bonus), type, confidence)
}
