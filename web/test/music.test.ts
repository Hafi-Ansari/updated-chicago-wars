import { describe, expect, it } from 'vitest'
import { SONGS } from '../src/ui/audio/music'
import { noteFreq } from '../src/ui/audio/synth'

const tokens = (bar: string) => bar.trim().split(/\s+/)

describe('songs', () => {
  for (const [id, song] of Object.entries(SONGS)) {
    it(`${id}: every bar is 16 steps and every note is valid`, () => {
      const bars = song.lead.line.length
      expect(song.bass).toHaveLength(bars)
      expect(song.chords).toHaveLength(bars)
      for (const layer of song.layers) expect(layer.line).toHaveLength(bars)
      const melodic = [song.lead, ...song.layers].flatMap((layer) => layer.line)
      const lines = [...melodic, ...song.bass, ...song.drums]
      if (song.keys.style === 'stabs') lines.push(...song.keys.rhythm)
      for (const bar of lines) expect(tokens(bar), bar).toHaveLength(16)

      for (const bar of [...melodic, ...song.bass]) {
        for (const t of tokens(bar))
          if (t !== '-' && t !== '.') expect(noteFreq(t)).toBeGreaterThan(20)
      }
      for (const chord of song.chords)
        for (const note of chord) expect(noteFreq(note)).toBeGreaterThan(20)
    })
  }
})
