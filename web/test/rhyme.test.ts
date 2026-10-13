import { describe, expect, it } from 'vitest'
import { lastWord, pronounce, rhymeScore } from '../server/rhyme'

const rhyme = (enemyEnd: string, playerEnd: string) =>
  rhymeScore(
    `whatever comes first,\nall the way to ${enemyEnd}`,
    `I come right back\nand I end on ${playerEnd}`,
  )

describe('lastWord', () => {
  it('takes the last word of the last line, without punctuation', () => {
    expect(lastWord("Stick and move,\nyou ain't got the STREETS!")).toBe('streets')
    expect(lastWord("one line only, runnin'")).toBe("runnin'")
    expect(lastWord('trailing blank line\n\n')).toBe('line')
    expect(lastWord('')).toBe('')
  })
})

describe('rhymeScore', () => {
  it('scores perfect rhymes 1', () => {
    expect(rhyme('street', 'heat')).toMatchObject({ score: 1, type: 'perfect', confidence: 'high' })
    expect(rhyme('money', 'honey')).toMatchObject({ score: 1, type: 'perfect' })
    expect(rhyme('king', 'ring')).toMatchObject({ type: 'perfect' })
  })

  it('scores slant rhymes by how close the consonants are', () => {
    const voicing = rhyme('beat', 'bead')
    const nasal = rhyme('time', 'mine')
    const far = rhyme('cape', 'fame')
    for (const r of [voicing, nasal, far]) expect(r.type).toBe('slant')
    expect(voicing.score).toBeGreaterThan(nasal.score)
    expect(nasal.score).toBeGreaterThan(far.score)
    // Close slants count as rhymes (0.6+); loose assonance falls just short.
    expect(nasal.score).toBeGreaterThanOrEqual(0.7)
    expect(far.score).toBeGreaterThanOrEqual(0.5)
    expect(far.score).toBeLessThan(0.6)
    expect(voicing.score).toBeLessThanOrEqual(0.8)
    expect(rhyme('do', 'confused').score).toBeLessThan(0.6)
  })

  it('gives a little for matching end consonants, and nothing otherwise', () => {
    expect(rhyme('beat', 'bit')).toMatchObject({ score: 0.3, type: 'consonance' })
    expect(rhyme('street', 'pizza')).toMatchObject({ score: 0, type: 'none' })
  })

  it("doesn't let you rhyme a word with itself", () => {
    expect(rhyme('street', 'street')).toMatchObject({ score: 0.2, type: 'repeat' })
    expect(rhyme('beat', 'upbeat')).toMatchObject({ score: 0.5, type: 'repeat' })
    expect(rhyme('side', 'outside')).toMatchObject({ type: 'repeat' })
    // Containing the word isn't the same as repeating it.
    expect(rhyme('end', 'mend')).toMatchObject({ score: 1, type: 'perfect' })
    expect(rhyme('ring', 'string')).toMatchObject({ score: 1, type: 'perfect' })
  })

  it('rewards multi-syllable rhymes', () => {
    const multi = rhymeScore('My money talks', 'your honey walks')
    expect(multi.type).toBe('perfect')
    expect(multi.score).toBeCloseTo(1.2)
    const triple = rhymeScore('all that thick money talks', 'watch the quick honey walks')
    expect(triple.score).toBeCloseTo(1.4)
    // "the" and "a" match as schwas, but articles don't make a multi.
    expect(rhymeScore('it all comes down to the mic', 'I rode up on a bike').score).toBe(1)
  })

  it('rhymes the way rappers do: unstressed endings and dropped g', () => {
    expect(rhyme('dinner', 'finna')).toMatchObject({ type: 'perfect' })
    expect(rhyme("runnin'", 'gunnin')).toMatchObject({ type: 'perfect', confidence: 'high' })
    expect(rhyme('mic', 'bike')).toMatchObject({ type: 'perfect' })
    expect(rhyme('drops', 'opps')).toMatchObject({ type: 'perfect', confidence: 'high' })
  })

  it('guesses made-up words, and says so', () => {
    const made = rhyme('street', 'skreet')
    expect(made.confidence).toBe('low')
    expect(made.type).toBe('perfect')
    expect(rhyme('glorp', 'street').confidence).toBe('low')
  })

  it('handles empty bars', () => {
    expect(rhymeScore('', 'anything').type).toBe('none')
    expect(rhymeScore('anything', '   ').type).toBe('none')
  })
})

describe('pronounce', () => {
  it('prefers the slang lexicon, then the dictionary, then guesses', () => {
    expect(pronounce('mic')).toMatchObject({ source: 'slang', phones: ['M', 'AY1', 'K'] })
    expect(pronounce('street')?.source).toBe('dict')
    expect(pronounce('blorpshire')?.source).toMatch(/suffix|guess/)
  })
})
