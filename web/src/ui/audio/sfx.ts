/** Sound effects: short synthesized cues for menus, text and combat. */

import { noteFreq as n, synth } from './synth'

const play = (fn: () => void) => () => {
  if (synth.ready && synth.sfxOn) fn()
}

export type Voice = 'hero' | 'enemy' | 'npc' | 'narrator'

/** Typewriter blip pitch per speaker, so voices sound different. */
const VOICE_PITCH: Record<Voice, number> = {
  hero: n('A5'),
  enemy: n('D5'),
  npc: n('F5'),
  narrator: n('C6'),
}

export const sfx = {
  select: play(() => {
    synth.tone({ freq: n('E6'), duration: 0.04, wave: 'pulse25', volume: 0.5 })
    synth.tone({ freq: n('B6'), delay: 0.04, duration: 0.05, wave: 'pulse25', volume: 0.45 })
  }),
  back: play(() => {
    synth.tone({ freq: n('B5'), duration: 0.04, wave: 'pulse25', volume: 0.45 })
    synth.tone({ freq: n('E5'), delay: 0.04, duration: 0.05, wave: 'pulse25', volume: 0.4 })
  }),
  deny: play(() => synth.tone({ freq: 140, duration: 0.12, wave: 'square', volume: 0.35 })),
  /** A Battle Rap callout landing: a quick rising pair. */
  hype: play(() => {
    synth.tone({ freq: n('A5'), duration: 0.05, wave: 'pulse25', volume: 0.4 })
    synth.tone({ freq: n('E6'), delay: 0.05, duration: 0.09, wave: 'pulse25', volume: 0.4 })
  }),
  /** That was straight dookie: a low, wet raspberry. */
  dookie: play(() => {
    synth.noise({ duration: 0.5, volume: 0.7, filter: 260, filterType: 'lowpass' })
    synth.tone({ freq: 90, duration: 0.45, wave: 'square', volume: 0.22, slideTo: 55 })
  }),
  advance: play(() => synth.tone({ freq: n('C6'), duration: 0.03, wave: 'pulse12', volume: 0.35 })),

  /** One typewriter character. */
  blip: (voice: Voice) =>
    play(() =>
      synth.tone({
        freq: VOICE_PITCH[voice] * (0.97 + Math.random() * 0.06),
        duration: 0.025,
        wave: voice === 'narrator' ? 'triangle' : 'pulse12',
        volume: voice === 'narrator' ? 0.35 : 0.18,
      }),
    )(),

  hit: play(() => {
    synth.noise({ duration: 0.12, volume: 0.7, filter: 1800, filterType: 'lowpass' })
    synth.tone({ freq: 180, duration: 0.1, wave: 'square', volume: 0.4, slideTo: 60 })
  }),
  crit: play(() => {
    synth.noise({ duration: 0.25, volume: 0.9, filter: 2500, filterType: 'lowpass' })
    synth.tone({ freq: 300, duration: 0.2, wave: 'square', volume: 0.45, slideTo: 50 })
    synth.tone({ freq: n('E6'), delay: 0.05, duration: 0.08, wave: 'pulse25', volume: 0.35 })
  }),
  hurt: play(() => {
    synth.noise({ duration: 0.14, volume: 0.6, filter: 900, filterType: 'lowpass' })
    synth.tone({ freq: 140, duration: 0.14, wave: 'triangle', volume: 0.6, slideTo: 50 })
  }),
  miss: play(() =>
    synth.noise({ duration: 0.18, volume: 0.35, filter: 5000, filterType: 'highpass' }),
  ),
  heal: play(() => {
    for (const [i, note] of ['C5', 'E5', 'G5', 'C6'].entries()) {
      synth.tone({ freq: n(note), delay: i * 0.06, duration: 0.09, wave: 'triangle', volume: 0.5 })
    }
  }),
  buff: play(() =>
    synth.tone({ freq: n('C5'), duration: 0.25, wave: 'pulse25', volume: 0.3, slideTo: n('C6') }),
  ),
  debuff: play(() =>
    synth.tone({ freq: n('C5'), duration: 0.25, wave: 'pulse25', volume: 0.3, slideTo: n('C4') }),
  ),
  coin: play(() => {
    synth.tone({ freq: n('B5'), duration: 0.06, wave: 'pulse25', volume: 0.4 })
    synth.tone({ freq: n('E6'), delay: 0.06, duration: 0.18, wave: 'pulse25', volume: 0.4 })
  }),
  spend: play(() => {
    synth.tone({ freq: n('E6'), duration: 0.05, wave: 'pulse25', volume: 0.35 })
    synth.tone({ freq: n('B5'), delay: 0.05, duration: 0.08, wave: 'pulse25', volume: 0.3 })
  }),
  levelUp: play(() => {
    for (const [i, note] of ['C5', 'E5', 'G5', 'C6', 'G5', 'C6', 'E6'].entries()) {
      synth.tone({ freq: n(note), delay: i * 0.07, duration: 0.1, wave: 'pulse25', volume: 0.4 })
    }
  }),
  learn: play(() => {
    for (const [i, note] of ['G5', 'B5', 'D6', 'G6'].entries()) {
      synth.tone({ freq: n(note), delay: i * 0.08, duration: 0.12, wave: 'pulse25', volume: 0.38 })
    }
  }),
  appear: play(() =>
    synth.noise({ duration: 0.3, volume: 0.25, filter: 1200, filterType: 'bandpass' }),
  ),
  location: play(() => {
    synth.tone({ freq: n('E5'), duration: 0.12, wave: 'triangle', volume: 0.5 })
    synth.tone({ freq: n('A5'), delay: 0.12, duration: 0.2, wave: 'triangle', volume: 0.5 })
  }),
  faint: play(() =>
    synth.tone({ freq: n('A4'), duration: 0.6, wave: 'square', volume: 0.3, slideTo: n('A2') }),
  ),
  flee: play(() => {
    for (let i = 0; i < 4; i++)
      synth.tone({
        freq: 300 + i * 120,
        delay: i * 0.05,
        duration: 0.05,
        wave: 'pulse12',
        volume: 0.3,
      })
  }),
  victory: play(() => {
    // Original fanfare: a rising run that lands on a held high C.
    const notes = ['G4', 'C5', 'E5', 'G5', 'E5', 'G5', 'A5', 'B5', 'C6']
    const lengths = [0.12, 0.12, 0.12, 0.3, 0.12, 0.12, 0.12, 0.12, 0.7]
    let t = 0
    for (const [i, note] of notes.entries()) {
      const length = lengths[i] ?? 0.2
      synth.tone({ freq: n(note), delay: t, duration: length * 0.9, wave: 'pulse25', volume: 0.45 })
      t += length
    }
  }),
  gameOver: play(() => {
    for (const [i, note] of ['E5', 'D#5', 'D5', 'C#5'].entries()) {
      synth.tone({ freq: n(note), delay: i * 0.35, duration: 0.33, wave: 'triangle', volume: 0.6 })
    }
  }),
}
