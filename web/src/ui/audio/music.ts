/**
 * A small chiptune step sequencer and the game's original songs.
 *
 * Songs are written as 16-step bars (one step = a 16th note):
 *   "A4" starts a note, "-" holds the previous note, "." is silence.
 * Keys rhythms use "x" (strike the bar's chord), "-" (hold), "." (rest).
 * Drums: "k" kick, "s" snare, "g" ghost snare, "h" hi-hat, "r" rimshot,
 * "t" taiko, "." rest.
 * Scheduling uses the standard Web Audio look-ahead pattern so timing stays
 * tight even when the main thread is busy.
 */

import { noteFreq, synth, type Wave } from './synth'

export type SongId = 'street' | 'battle' | 'boss'

interface Voice {
  wave: Wave
  volume: number
  attack?: number
  vibrato?: { rate: number; depth: number }
  /** Plucked decay in seconds (koto). */
  pluck?: number
  /** Scoop up into each note by this many semitones (shakuhachi). */
  bendIn?: number
  /** Breath noise at the start of each note (flutes). */
  breath?: number
}

interface Layer {
  line: string[]
  voice: Voice
}

interface Song {
  bpm: number
  /** Semitones to shift every pitched note. */
  transpose: number
  /** 0 = straight 16ths; ~0.3 pushes every off-beat 16th late for a lazy hip-hop swing. */
  swing: number
  lead: Layer
  /** Extra melodic parts (e.g. a koto riff under the lead). */
  layers: Layer[]
  bass: string[]
  /** One chord per bar. */
  chords: string[][]
  /** 'arp': fast 16th arpeggio (classic chiptune). 'stabs': held chords on a rhythm (lo-fi keys). */
  keys: { style: 'arp' } | { style: 'stabs'; rhythm: string[]; voice: Voice }
  /** Drum bars; cycles if shorter than the song. */
  drums: string[]
  kit: 'chip' | 'dusty'
  /** Low-pass over the melodic parts, in Hz, for warmth. Drums skip it so the beat stays crisp. */
  lowpass?: number
  /** Vinyl hiss and crackle. */
  vinyl?: boolean
  /** Overall song volume (default 1), to balance songs against each other. */
  gain?: number
  /** Furin wind chimes: one at the top of every 8-bar phrase, plus the odd random ping. */
  chimes?: boolean
}

// ── Songs (original compositions) ────────────────────────────────────────────

const FMAJ7 = ['F3', 'A3', 'C4', 'E4']
const EM7 = ['E3', 'G3', 'B3', 'D4']
const DM9 = ['D3', 'F3', 'A3', 'C4', 'E4']
const BBMAJ7S11 = ['Bb2', 'F3', 'A3', 'D4', 'E4']
const AM9 = ['A2', 'C3', 'E3', 'G3', 'B3']
const E7SUS = ['E3', 'A3', 'B3', 'D4']

/** Koto riffs, one per chord: plucked arpeggios that answer the flute. */
const KOTO = {
  F: 'F3 . C4 . A4 . . C5 . . A4 . E4 . . .',
  Em: 'E3 . B3 . G4 . . B4 . . G4 . D4 . . .',
  Dm: 'D3 . A3 . E4 . . F4 . . E4 . A3 . . .',
  Bb: 'Bb2 . F3 . A3 . . D4 . . E4 . A3 . Bb3 .',
  Am: 'A2 . E3 . B3 . . C4 . . E4 . B3 . . .',
  E: 'E3 . B3 . D4 . . E4 . A4 . B4 . E5 . .',
}

/**
 * "Blue Line Zen": lo-fi hip-hop meets Japanese folk, played on chip voices.
 * A shakuhachi-style lead and koto plucks in the Japanese "in" scale
 * (A Bb D E F) over jazzy chords: the Bbmaj7#11 gives the haunting flat-second
 * color. Boom-bap drums with taiko fills, wind chimes, swing, and vinyl crackle.
 */
const street: Song = {
  bpm: 86,
  transpose: 0,
  swing: 0.3,
  lead: {
    line: [
      'E5 - - - - - - - . . F5 - E5 - C5 -',
      'D5 - - - - - - - - - . . B4 - D5 -',
      'E5 - - - - - F5 - A5 - - - - - - -',
      'Bb4 - - - - - A4 - - - - - . . . .',
      '. . . . A5 - - - C6 - - - Bb5 - A5 -',
      'G5 - - - - - E5 - - - D5 - E5 - - -',
      'F5 - - - E5 - D5 - - - A4 - D5 - E5 -',
      'E5 - - - - - - - - - - - . . . .',
      '. . . . . . . . A5 - Bb5 - A5 - E5 -',
      'D5 - - - - - - - E5 - G5 - A5 - - -',
      'F5 - - - E5 - - - D5 - - - A4 - - -',
      '. . . . D5 - Bb4 - A4 - - - - - - -',
      'E5 - - - - - - - . . C5 - D5 - E5 -',
      'F5 - - - A5 - - - G5 - F5 - E5 - - -',
      'D5 - - - - - - - Bb4 - - - A4 - - -',
      'E5 - - - - - - - - - - - . . . .',
    ],
    // Shakuhachi: soft sine, breathy start, scoop into the pitch, slow wide vibrato.
    voice: {
      wave: 'sine',
      volume: 0.42,
      attack: 0.07,
      vibrato: { rate: 4.6, depth: 22 },
      bendIn: 1,
      breath: 0.1,
    },
  },
  layers: [
    {
      line: [
        KOTO.F,
        KOTO.Em,
        KOTO.Dm,
        KOTO.Bb,
        KOTO.F,
        KOTO.Em,
        KOTO.Dm,
        KOTO.E,
        KOTO.F,
        KOTO.Em,
        KOTO.Dm,
        KOTO.Bb,
        KOTO.Am,
        KOTO.Dm,
        KOTO.Bb,
        KOTO.E,
      ],
      // Koto on a chip pulse wave: bright pluck, quick decay.
      voice: { wave: 'pulse25', volume: 0.2, attack: 0.002, pluck: 0.6 },
    },
  ],
  bass: [
    'F2 - - - . . . F2 - - A2 - C3 - . .',
    'E2 - - - . . . E2 - - G2 - B2 - . .',
    'D2 - - - . . . D2 - - F2 - A2 - . .',
    'Bb1 - - - . . . Bb1 - - D2 - F2 - A1 -',
    'F2 - - - . . F2 - A2 - - . C3 - E2 -',
    'E2 - - - . . E2 - G2 - - . B2 - D2 -',
    'D2 - - - . . D2 - F2 - - . A2 - C3 -',
    'E2 - - - . . . E2 - - B1 - D2 - E2 -',
    'F2 - - - . . . F2 - - A2 - C3 - . .',
    'E2 - - - . . . E2 - - G2 - B2 - . .',
    'D2 - - - . . . D2 - - F2 - A2 - . .',
    'Bb1 - - - . . . Bb1 - - D2 - F2 - A1 -',
    'A1 - - - . . . A1 - - C2 - E2 - G2 -',
    'D2 - - - . . D2 - F2 - - . A2 - C3 -',
    'Bb1 - - - . . Bb1 - D2 - - . F2 - A1 -',
    'E2 - - - . . . E2 - - B1 - D2 - E2 -',
  ],
  chords: [
    FMAJ7,
    EM7,
    DM9,
    BBMAJ7S11,
    FMAJ7,
    EM7,
    DM9,
    E7SUS,
    FMAJ7,
    EM7,
    DM9,
    BBMAJ7S11,
    AM9,
    DM9,
    BBMAJ7S11,
    E7SUS,
  ],
  keys: {
    style: 'stabs',
    rhythm: ['x - - - - - - - - - - - - - - .', 'x - - - - - - x - - - - - - - .'],
    voice: { wave: 'triangle', volume: 0.1, attack: 0.05, vibrato: { rate: 0.8, depth: 9 } },
  },
  // Eight-bar drum arrangement: boom-bap variations, then a taiko fill into the next phrase.
  drums: [
    'k . h . s . h . h . k . s . h h',
    'k . h k s . h . h . k . s . h g',
    'k . h . s . h . h k . k s . h .',
    'k . h . s . h r h . k . s . h g',
    'k . h . s . h . h . k . s . h h',
    'k . h k s . h . h . k . s . h g',
    'k . h . s . h . h k . k s . r .',
    't . h . s . h . t . h t s t t t',
  ],
  kit: 'dusty',
  lowpass: 3200,
  vinyl: true,
  chimes: true,
  gain: 0.7,
}

const DM = ['D3', 'F3', 'A3']
const EBMAJ7 = ['Eb3', 'G3', 'Bb3', 'D4']
const BB = ['Bb2', 'D3', 'F3']
const C = ['C3', 'E3', 'G3']
const GM = ['G2', 'Bb2', 'D3']
const A7 = ['A2', 'C#3', 'E3', 'G3']

/** Shamisen riffs, one per chord: low, driving plucked 8th notes. */
const SHAMISEN = {
  Dm: 'D3 . D4 . A3 . D4 . D3 . D4 . Eb4 . D4 .',
  Eb: 'Eb3 . Eb4 . Bb3 . Eb4 . Eb3 . G4 . F4 . Eb4 .',
  Bb: 'Bb2 . Bb3 . F3 . Bb3 . Bb2 . D4 . C4 . Bb3 .',
  C: 'C3 . C4 . G3 . C4 . C3 . E4 . D4 . C4 .',
  Gm: 'G2 . G3 . D3 . G3 . G2 . Bb3 . A3 . G3 .',
  A7: 'A2 . A3 . E3 . A3 . C#4 . E4 . G4 . A4 .',
}

/** Quarter-note bass pulse with a pickup into the next bar. */
const PULSE = {
  Dm: 'D2 - - - D2 - - - D2 - - - D2 - A1 -',
  Eb: 'Eb2 - - - Eb2 - - - Eb2 - - - Eb2 - Bb1 -',
  Bb: 'Bb1 - - - Bb1 - - - Bb1 - - - Bb1 - F2 -',
  C: 'C2 - - - C2 - - - C2 - - - C2 - G1 -',
  Gm: 'G1 - - - G1 - - - G1 - - - G1 - D2 -',
  A7: 'A1 - - - A1 - - - A1 - - - E2 - C#2 -',
}

const BATTLE_FORM = ['Dm', 'Eb', 'Dm', 'Eb', 'Bb', 'C', 'Gm', 'A7'] as const

/**
 * "Shamisen Showdown": a samurai-standoff battle theme. Mid tempo, low-to-mid
 * register, driven by a plucked shamisen riff and taiko rather than speed and
 * pitch. A minor-key melody on the Japanese "in" scale over D minor, with the
 * flat-second Eb chord for tension and an A7 that snaps back to the top.
 */
const battle: Song = {
  bpm: 112,
  transpose: 0,
  swing: 0,
  lead: {
    line: [
      'D5 - - - A4 - - - Bb4 - A4 - G4 - A4 -',
      'Eb5 - - - - - D5 - Bb4 - - - G4 - - -',
      'D5 - - - A4 - - - Bb4 - A4 - G4 - F4 -',
      'G4 - - - - - - - Eb4 - - - D4 - - -',
      'F4 - - - Bb4 - - - D5 - - - C5 - Bb4 -',
      'C5 - - - E5 - - - G5 - - - E5 - C5 -',
      'D5 - - - Bb4 - - - G4 - A4 - Bb4 - D5 -',
      'C#5 - - - - - - - E5 - - - A4 - - -',
      'F5 - - - - - E5 - D5 - - - A4 - - -',
      'Bb4 - - - - - G4 - Eb5 - - - D5 - - -',
      'D5 - A4 - D5 - F5 - E5 - D5 - A4 - - -',
      'G5 - - - F5 - - - Eb5 - - - D5 - - -',
      'D5 - - - F5 - - - D5 - C5 - Bb4 - - -',
      'C5 - - - - - G4 - C5 - D5 - E5 - - -',
      'D5 - - - - - Bb4 - A4 - - - G4 - - -',
      'A4 - - - C#5 - - - E5 - - - . . . .',
    ],
    // Soft, flute-like lead: triangle body, a little breath and a scoop into each note.
    voice: {
      wave: 'triangle',
      volume: 0.5,
      attack: 0.03,
      vibrato: { rate: 5, depth: 18 },
      bendIn: 0.7,
      breath: 0.05,
    },
  },
  layers: [
    {
      line: [...BATTLE_FORM, ...BATTLE_FORM].map((chord) => SHAMISEN[chord]),
      // Shamisen on a chip pulse: snappy pluck with a tiny pitch bite.
      voice: { wave: 'pulse25', volume: 0.22, attack: 0.002, pluck: 0.22, bendIn: 0.3 },
    },
  ],
  bass: [...BATTLE_FORM, ...BATTLE_FORM].map((chord) => PULSE[chord]),
  chords: [DM, EBMAJ7, DM, EBMAJ7, BB, C, GM, A7, DM, EBMAJ7, DM, EBMAJ7, BB, C, GM, A7],
  keys: {
    style: 'stabs',
    rhythm: ['x - - - - - - - x - - - - - - .'],
    voice: { wave: 'triangle', volume: 0.08, attack: 0.04 },
  },
  // Taiko-driven boom-bap with a big fill closing every eight bars.
  drums: [
    't . h . s . h . k . k . s . h h',
    'k . h k s . h . k . k . s . h h',
    't . h . s . h . k . k . s . t t',
    'k . h k s . h . k . k . s . h h',
    't . h . s . h . k . k . s . h h',
    'k . h k s . h . k . k . s . h h',
    'k . h k s . h . k k . k s . h .',
    't . t . s . t . t t s . t t t t',
  ],
  kit: 'dusty',
  lowpass: 4500,
  gain: 0.6,
}

/** The King's theme: the battle song a half-step higher and a touch faster. */
const boss: Song = { ...battle, bpm: 120, transpose: 1 }

export const SONGS: Record<SongId, Song> = { street, battle, boss }

// ── Compilation ──────────────────────────────────────────────────────────────

interface NoteEvent {
  freq: number
  steps: number
}

interface ChordEvent {
  freqs: number[]
  steps: number
}

interface CompiledLayer {
  notes: NoteEvent[][]
  voice: Voice
}

interface Compiled {
  song: Song
  stepSeconds: number
  totalSteps: number
  melodic: CompiledLayer[]
  bass: NoteEvent[][]
  arp: (number | null)[]
  stabs: (ChordEvent | null)[]
  drums: string[]
}

const tokensOf = (bars: readonly string[]) => bars.flatMap((bar) => bar.trim().split(/\s+/))
const shift = (song: Song, note: string) => noteFreq(note) * 2 ** (song.transpose / 12)

/** Length of a held event starting at `step`: itself plus following "-" tokens. */
function holdLength(tokens: string[], step: number): number {
  let length = 1
  while (tokens[step + length] === '-') length++
  return length
}

function parseLine(song: Song, bars: string[]): NoteEvent[][] {
  const tokens = tokensOf(bars)
  return tokens.map((token, step) =>
    token === '-' || token === '.'
      ? []
      : [{ freq: shift(song, token), steps: holdLength(tokens, step) }],
  )
}

function compile(song: Song): Compiled {
  const bars = song.lead.line.length
  const totalSteps = bars * 16
  const chordAt = (step: number) => song.chords[Math.floor(step / 16) % song.chords.length] ?? []

  // Classic chiptune arpeggio: up-down 1 2 3 2 through the bar's chord.
  const arp = Array.from({ length: totalSteps }, (_, step) => {
    if (song.keys.style !== 'arp') return null
    const note = chordAt(step)[[0, 1, 2, 1][step % 4] ?? 0]
    return note ? shift(song, note) : null
  })

  // Lo-fi keys: strike the bar's chord on the rhythm and let it ring.
  const stabs: (ChordEvent | null)[] = Array.from({ length: totalSteps }, () => null)
  const { keys } = song
  if (keys.style === 'stabs') {
    const tokens = tokensOf(song.lead.line.map((_, i) => keys.rhythm[i % keys.rhythm.length] ?? ''))
    tokens.forEach((token, step) => {
      if (token === 'x') {
        stabs[step] = {
          freqs: chordAt(step).map((n) => shift(song, n)),
          steps: holdLength(tokens, step),
        }
      }
    })
  }

  const drumBars = song.drums.map((bar) => bar.trim().split(/\s+/))
  const drums = Array.from({ length: totalSteps }, (_, i) => {
    const bar = drumBars[Math.floor(i / 16) % drumBars.length] ?? []
    return bar[i % 16] ?? '.'
  })

  return {
    song,
    stepSeconds: 60 / song.bpm / 4,
    totalSteps,
    melodic: [song.lead, ...song.layers].map((layer) => ({
      notes: parseLine(song, layer.line),
      voice: layer.voice,
    })),
    bass: parseLine(song, song.bass),
    arp,
    stabs,
    drums,
  }
}

// ── Sequencer ────────────────────────────────────────────────────────────────

/** Bright pentatonic pings for the wind chime. */
const CHIME_NOTES = ['A6', 'D7', 'E7', 'F6', 'A7'].map(noteFreq)

class Sequencer {
  private current: SongId | null = null
  /** The song the game wants; starts as soon as audio is unlocked. */
  private requested: SongId | null = null
  private compiled: Compiled | null = null
  /** Song output (handles fades) and its two inputs: melodic (filtered) and drums (crisp). */
  private out: GainNode | null = null
  private melodic: AudioNode | null = null
  private drumBus: AudioNode | null = null
  private stopHiss: (() => void) | null = null
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
    const { ctx, music } = synth
    const song = SONGS[id]
    this.compiled = compile(song)

    const out = ctx.createGain()
    out.gain.setValueAtTime(0, ctx.currentTime)
    out.gain.linearRampToValueAtTime(song.gain ?? 1, ctx.currentTime + 0.8)
    out.connect(music)
    this.out = out

    if (song.lowpass) {
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = song.lowpass
      filter.connect(out)
      this.melodic = filter
    } else {
      this.melodic = out
    }
    this.drumBus = out
    if (song.vinyl) this.stopHiss = synth.hiss(out, 0.04)

    this.step = 0
    this.nextTime = ctx.currentTime + 0.1
    this.timer = window.setInterval(() => this.schedule(), 25)
  }

  /** Starts the requested song over on a fresh audio context (after iOS recovery). */
  restart(): void {
    if (this.timer !== null) window.clearInterval(this.timer)
    this.timer = null
    // The old nodes belonged to the discarded context; just drop them.
    this.out = null
    this.melodic = null
    this.drumBus = null
    this.stopHiss = null
    this.current = null
    this.play(this.requested)
  }

  stop(): void {
    if (this.timer !== null) window.clearInterval(this.timer)
    this.timer = null
    const out = this.out
    const melodic = this.melodic
    const stopHiss = this.stopHiss
    if (out && synth.ctx) {
      const t = synth.ctx.currentTime
      out.gain.cancelScheduledValues(t)
      out.gain.setValueAtTime(out.gain.value, t)
      out.gain.linearRampToValueAtTime(0, t + 0.4)
      window.setTimeout(() => {
        stopHiss?.()
        melodic?.disconnect()
        out.disconnect()
      }, 600)
    }
    this.out = null
    this.melodic = null
    this.drumBus = null
    this.stopHiss = null
    this.current = null
  }

  private schedule(): void {
    const { ctx } = synth
    const c = this.compiled
    if (!ctx || !c || !this.melodic) return
    // After a pause (backgrounded tab), skip ahead instead of replaying every missed note at once.
    if (this.nextTime < ctx.currentTime - 0.1) this.nextTime = ctx.currentTime + 0.05
    while (this.nextTime < ctx.currentTime + 0.12) {
      // Swing: off-beat 16ths land a little late.
      const swing = this.step % 2 === 1 ? c.song.swing * c.stepSeconds : 0
      this.playStep(c, this.step, this.nextTime + swing)
      this.nextTime += c.stepSeconds
      this.step = (this.step + 1) % c.totalSteps
    }
  }

  private playStep(c: Compiled, step: number, at: number): void {
    const melodic = this.melodic
    const drums = this.drumBus
    if (!melodic || !drums) return
    const len = (steps: number) => steps * c.stepSeconds

    for (const layer of c.melodic) {
      const { breath, ...voice } = layer.voice
      for (const note of layer.notes[step] ?? []) {
        synth.tone({
          freq: note.freq,
          at,
          duration: len(note.steps) * 0.95,
          dest: melodic,
          ...voice,
        })
        if (breath) {
          synth.noise({
            at,
            duration: 0.18,
            volume: breath,
            filter: 1400,
            filterType: 'bandpass',
            dest: melodic,
          })
        }
      }
    }
    for (const note of c.bass[step] ?? []) {
      synth.tone({
        freq: note.freq,
        at,
        duration: len(note.steps) * 0.9,
        wave: 'triangle',
        volume: 0.9,
        dest: melodic,
      })
    }

    const arp = c.arp[step]
    if (arp)
      synth.tone({
        freq: arp,
        at,
        duration: len(1) * 0.8,
        wave: 'pulse12',
        volume: 0.12,
        dest: melodic,
      })

    const stab = c.stabs[step]
    if (stab && c.song.keys.style === 'stabs') {
      const { voice } = c.song.keys
      for (const freq of stab.freqs) {
        synth.tone({ freq, at, duration: len(stab.steps) * 0.95, dest: melodic, ...voice })
      }
    }

    const token = c.drums[step]
    if (c.song.kit === 'dusty') this.dustyDrum(token, step, at, drums)
    else this.chipDrum(token, at, drums)

    if (c.song.chimes && (step % 128 === 0 || (step % 16 === 8 && Math.random() < 0.12))) {
      this.chime(at, drums)
    }

    // Vinyl crackle: the odd random pop.
    if (c.song.vinyl && Math.random() < 0.12) {
      synth.noise({
        at: at + Math.random() * c.stepSeconds,
        duration: 0.006,
        volume: 0.1 + Math.random() * 0.25,
        filter: 2500,
        dest: drums,
      })
    }
  }

  private chipDrum(token: string | undefined, at: number, bus: AudioNode): void {
    switch (token) {
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

  /** Boom-bap kit for the lo-fi song, plus taiko.  */
  private dustyDrum(token: string | undefined, step: number, at: number, bus: AudioNode): void {
    switch (token) {
      case 'k':
        synth.tone({
          freq: 120,
          at,
          duration: 0.26,
          wave: 'sine',
          volume: 1.1,
          slideTo: 42,
          dest: bus,
        })
        synth.noise({
          at,
          duration: 0.02,
          volume: 0.25,
          filter: 3000,
          filterType: 'lowpass',
          dest: bus,
        })
        break
      case 's':
        // Body + crack: a dusty, punchy boom-bap snare.
        synth.noise({
          at,
          duration: 0.18,
          volume: 0.55,
          filter: 1900,
          filterType: 'bandpass',
          dest: bus,
        })
        synth.noise({
          at,
          duration: 0.06,
          volume: 0.3,
          filter: 5000,
          filterType: 'highpass',
          dest: bus,
        })
        synth.tone({
          freq: 200,
          at,
          duration: 0.07,
          wave: 'triangle',
          volume: 0.45,
          slideTo: 150,
          dest: bus,
        })
        break
      case 'g':
        synth.noise({
          at,
          duration: 0.07,
          volume: 0.16,
          filter: 1900,
          filterType: 'bandpass',
          dest: bus,
        })
        break
      case 'h': {
        // Accent hats on the beat, softer in between: it makes the groove breathe.
        const volume = step % 4 === 0 ? 0.16 : step % 2 === 0 ? 0.11 : 0.07
        synth.noise({ at, duration: 0.03, volume, filter: 7500, filterType: 'highpass', dest: bus })
        break
      }
      case 'r':
        synth.tone({ freq: 1700, at, duration: 0.015, wave: 'square', volume: 0.12, dest: bus })
        synth.noise({
          at,
          duration: 0.03,
          volume: 0.2,
          filter: 3500,
          filterType: 'bandpass',
          dest: bus,
        })
        break
      case 't':
        // Taiko: a big, round drum with a skin slap.
        synth.tone({
          freq: 95,
          at,
          duration: 0.45,
          wave: 'sine',
          volume: 1,
          slideTo: 52,
          dest: bus,
        })
        synth.noise({
          at,
          duration: 0.12,
          volume: 0.35,
          filter: 600,
          filterType: 'lowpass',
          dest: bus,
        })
        break
    }
  }

  /** Furin wind chime: a bright ping with a metallic overtone. */
  private chime(at: number, bus: AudioNode): void {
    const freq = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)] ?? 1760
    synth.tone({
      freq,
      at,
      duration: 1.6,
      wave: 'sine',
      volume: 0.12,
      attack: 0.002,
      pluck: 1.6,
      dest: bus,
    })
    synth.tone({
      freq: freq * 2.76,
      at,
      duration: 0.8,
      wave: 'sine',
      volume: 0.04,
      attack: 0.002,
      pluck: 0.8,
      dest: bus,
    })
  }
}

export const music = new Sequencer()
synth.onRebuild(() => music.restart())
