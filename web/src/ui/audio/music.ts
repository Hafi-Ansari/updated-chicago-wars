/**
 * A small chiptune step sequencer and the game's original songs.
 *
 * Songs are written as 16-step bars (one step = a 16th note):
 *   "A4" starts a note, "-" holds the previous note, "." is silence.
 * Drums use "k" (kick), "s" (snare), "h" (hi-hat), "." (rest).
 * Scheduling uses the standard Web Audio look-ahead pattern so timing stays
 * tight even when the main thread is busy.
 */

import { noteFreq, synth } from './synth'

export type SongId = 'street' | 'battle' | 'boss'

interface Song {
  bpm: number
  /** Semitones to shift every pitched note. */
  transpose: number
  lead: string[]
  bass: string[]
  /** Chord tones per bar, arpeggiated softly underneath. */
  chords: string[][]
  drums: string[]
}

// ── Songs (original compositions) ────────────────────────────────────────────

/** "Night on the Block": a laid-back minor loop for walking the city. */
const street: Song = {
  bpm: 92,
  transpose: 0,
  lead: [
    'A4 - - - C5 - E5 - D5 - C5 - A4 - - -',
    'F4 - A4 - C5 - - - A4 - G4 - F4 - - -',
    'E4 - G4 - C5 - - - D5 - E5 - G5 - - -',
    'F5 - E5 - D5 - - - B4 - - - G4 - - -',
    'A4 - - - C5 - E5 - A5 - G5 - E5 - - -',
    'F5 - E5 - C5 - - - A4 - C5 - F5 - - -',
    'E5 - D5 - C5 - - - G4 - C5 - E5 - D5 -',
    'D5 - - - B4 - - - G#4 - - - . . . .',
  ],
  bass: [
    'A2 - . . A3 . A2 - . . A2 . A3 - . .',
    'F2 - . . F3 . F2 - . . F2 . F3 - . .',
    'C3 - . . C4 . C3 - . . C3 . C4 - . .',
    'G2 - . . G3 . G2 - . . G2 . G3 - . .',
    'A2 - . . A3 . A2 - . . A2 . A3 - . .',
    'F2 - . . F3 . F2 - . . F2 . F3 - . .',
    'C3 - . . C4 . C3 - . . C3 . C4 - . .',
    'G2 - . . G3 . G2 - E2 - . . E3 - . .',
  ],
  chords: [
    ['A3', 'C4', 'E4'],
    ['F3', 'A3', 'C4'],
    ['C4', 'E4', 'G4'],
    ['G3', 'B3', 'D4'],
    ['A3', 'C4', 'E4'],
    ['F3', 'A3', 'C4'],
    ['C4', 'E4', 'G4'],
    ['E3', 'G#3', 'B3'],
  ],
  drums: ['k . h . s . h . k . k h s . h .', 'k . h . s . h . k . k h s . h h'],
}

/** "Corner Clash": driving and urgent, for fights. */
const battle: Song = {
  bpm: 148,
  transpose: 0,
  lead: [
    'E5 - E5 - G5 - E5 - B5 - A5 - G5 - F#5 -',
    'E5 - - - C5 - E5 - G5 - - - E5 - - -',
    'F#5 - F#5 - A5 - F#5 - D6 - C6 - B5 - A5 -',
    'B5 - - - A5 - G5 - F#5 - - - D#5 - - -',
    'E5 - E5 - G5 - E5 - B5 - A5 - G5 - F#5 -',
    'G5 - A5 - B5 - C6 - B5 - A5 - G5 - E5 -',
    'F#5 - G5 - A5 - D6 - C6 - B5 - A5 - F#5 -',
    'B5 - - - - - - - D#5 - F#5 - B5 - - -',
  ],
  bass: [
    'E2 . E2 . E3 . E2 . E2 . E2 . E3 . E2 .',
    'C2 . C2 . C3 . C2 . C2 . C2 . C3 . C2 .',
    'D2 . D2 . D3 . D2 . D2 . D2 . D3 . D2 .',
    'B1 . B1 . B2 . B1 . B1 . B1 . B2 . B1 .',
    'E2 . E2 . E3 . E2 . E2 . E2 . E3 . E2 .',
    'C2 . C2 . C3 . C2 . C2 . C2 . C3 . C2 .',
    'D2 . D2 . D3 . D2 . D2 . D2 . D3 . D2 .',
    'B1 . B1 . B2 . B1 . B1 . B1 . B2 . B1 .',
  ],
  chords: [
    ['E4', 'G4', 'B4'],
    ['C4', 'E4', 'G4'],
    ['D4', 'F#4', 'A4'],
    ['B3', 'D#4', 'F#4'],
    ['E4', 'G4', 'B4'],
    ['C4', 'E4', 'G4'],
    ['D4', 'F#4', 'A4'],
    ['B3', 'D#4', 'F#4'],
  ],
  drums: ['k h h h s h k h k h k h s h h h', 'k h h h s h k h k h k h s h s s'],
}

/** The King's theme: the battle song, faster and a step higher. */
const boss: Song = { ...battle, bpm: 166, transpose: 2 }

const SONGS: Record<SongId, Song> = { street, battle, boss }

// ── Sequencer ────────────────────────────────────────────────────────────────

interface NoteEvent {
  step: number
  freq: number
  steps: number
}

interface Compiled {
  stepSeconds: number
  totalSteps: number
  lead: NoteEvent[][]
  bass: NoteEvent[][]
  arp: (number | null)[]
  drums: string[]
}

function parseLine(bars: string[], transpose: number): NoteEvent[][] {
  const tokens = bars.flatMap((bar) => bar.trim().split(/\s+/))
  const byStep: NoteEvent[][] = tokens.map(() => [])
  tokens.forEach((token, step) => {
    if (token === '-' || token === '.') return
    let length = 1
    while (tokens[step + length] === '-') length++
    byStep[step]?.push({ step, freq: noteFreq(token) * 2 ** (transpose / 12), steps: length })
  })
  return byStep
}

function compile(song: Song): Compiled {
  const totalSteps = song.lead.length * 16
  const arp: (number | null)[] = []
  for (let step = 0; step < totalSteps; step++) {
    const chord = song.chords[Math.floor(step / 16)] ?? []
    // Up-down arpeggio pattern: 1 2 3 2.
    const note = chord[[0, 1, 2, 1][step % 4] ?? 0]
    arp.push(note ? noteFreq(note) * 2 ** (song.transpose / 12) : null)
  }
  const drumBars = song.drums.map((bar) => bar.trim().split(/\s+/))
  const drums = Array.from({ length: totalSteps }, (_, i) => {
    const bar = drumBars[Math.floor(i / 16) % drumBars.length] ?? []
    return bar[i % 16] ?? '.'
  })
  return {
    stepSeconds: 60 / song.bpm / 4,
    totalSteps,
    lead: parseLine(song.lead, song.transpose),
    bass: parseLine(song.bass, song.transpose),
    arp,
    drums,
  }
}

class Sequencer {
  private current: SongId | null = null
  /** The song the game wants; starts as soon as audio is unlocked. */
  private requested: SongId | null = null
  private compiled: Compiled | null = null
  private bus: GainNode | null = null
  private timer: number | null = null
  private step = 0
  private nextTime = 0

  play(id: SongId | null): void {
    this.requested = id
    if (id === this.current) return
    this.stop()
    if (!id) return
    if (!synth.ctx || !synth.music) {
      synth.onReady(() => this.play(this.requested))
      return
    }
    this.current = id

    this.compiled = compile(SONGS[id])
    this.bus = synth.ctx.createGain()
    this.bus.gain.setValueAtTime(0, synth.ctx.currentTime)
    this.bus.gain.linearRampToValueAtTime(1, synth.ctx.currentTime + 0.6)
    this.bus.connect(synth.music)
    this.step = 0
    this.nextTime = synth.ctx.currentTime + 0.1
    this.timer = window.setInterval(() => this.schedule(), 25)
  }

  stop(): void {
    if (this.timer !== null) window.clearInterval(this.timer)
    this.timer = null
    const bus = this.bus
    if (bus && synth.ctx) {
      const t = synth.ctx.currentTime
      bus.gain.cancelScheduledValues(t)
      bus.gain.setValueAtTime(bus.gain.value, t)
      bus.gain.linearRampToValueAtTime(0, t + 0.4)
      window.setTimeout(() => bus.disconnect(), 600)
    }
    this.bus = null
    this.current = null
  }

  private schedule(): void {
    const { ctx } = synth
    const song = this.compiled
    const bus = this.bus
    if (!ctx || !song || !bus) return
    while (this.nextTime < ctx.currentTime + 0.12) {
      this.playStep(song, bus, this.step, this.nextTime)
      this.nextTime += song.stepSeconds
      this.step = (this.step + 1) % song.totalSteps
    }
  }

  private playStep(song: Compiled, bus: GainNode, step: number, at: number): void {
    const len = (steps: number) => steps * song.stepSeconds
    for (const note of song.lead[step] ?? []) {
      synth.tone({
        freq: note.freq,
        at,
        duration: len(note.steps) * 0.95,
        wave: 'pulse25',
        volume: 0.5,
        dest: bus,
      })
    }
    for (const note of song.bass[step] ?? []) {
      synth.tone({
        freq: note.freq,
        at,
        duration: len(note.steps) * 0.9,
        wave: 'triangle',
        volume: 0.9,
        dest: bus,
      })
    }
    const arp = song.arp[step]
    if (arp)
      synth.tone({
        freq: arp,
        at,
        duration: len(1) * 0.8,
        wave: 'pulse12',
        volume: 0.12,
        dest: bus,
      })

    switch (song.drums[step]) {
      case 'k':
        synth.tone({
          freq: 150,
          at,
          duration: 0.12,
          wave: 'sine',
          volume: 0.9,
          slideTo: 45,
          dest: bus,
        })
        break
      case 's':
        synth.noise({
          at,
          duration: 0.12,
          volume: 0.45,
          filter: 1500,
          filterType: 'highpass',
          dest: bus,
        })
        break
      case 'h':
        synth.noise({
          at,
          duration: 0.03,
          volume: 0.15,
          filter: 8000,
          filterType: 'highpass',
          dest: bus,
        })
        break
    }
  }
}

export const music = new Sequencer()
