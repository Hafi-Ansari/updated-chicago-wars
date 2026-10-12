/**
 * Tiny Web Audio synth: everything you hear is generated in code (no audio
 * files), using the oscillator types old consoles had: pulse/square, triangle,
 * and noise. Browsers only allow audio after a user gesture, so the context is
 * created lazily by `unlock()` on the first click or key press.
 */

export type Wave = 'pulse25' | 'pulse12' | 'square' | 'triangle' | 'sine' | 'sawtooth'

export interface ToneOptions {
  freq: number
  /** Seconds from now (or an absolute time with `at`). */
  delay?: number
  at?: number
  duration: number
  wave?: Wave
  volume?: number
  /** Pitch slide target in Hz over the note's duration. */
  slideTo?: number
  /** Fade-in time in seconds (default 5ms; longer for soft pads). */
  attack?: number
  /** Pitch wobble: `rate` in Hz, `depth` in cents. Slow + shallow = worn tape. */
  vibrato?: { rate: number; depth: number }
  /** Plucked-string envelope: the note dies away over this many seconds (koto, guitar). */
  pluck?: number
  /** Scoop up into the note from this many semitones below (flute and vocal-style bends). */
  bendIn?: number
  dest?: AudioNode
}

export interface NoiseOptions {
  delay?: number
  at?: number
  duration: number
  volume?: number
  /** Band/low/high-pass filter frequency in Hz. */
  filter?: number
  filterType?: BiquadFilterType
  dest?: AudioNode
}

const MUSIC_VOLUME = 0.16
const SFX_VOLUME = 0.32

class Synth {
  ctx: AudioContext | null = null
  music: GainNode | null = null
  sfx: GainNode | null = null
  private waves = new Map<Wave, PeriodicWave>()
  private noiseBuffer: AudioBuffer | null = null
  musicOn = true
  sfxOn = true
  private readyListeners: (() => void)[] = []

  /** Runs `fn` once audio is unlocked (immediately if it already is). */
  onReady(fn: () => void): void {
    if (this.ctx) fn()
    else this.readyListeners.push(fn)
  }

  /** Creates/resumes the audio context. Call from a user gesture. */
  unlock(): void {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!Ctx) return
      this.ctx = new Ctx()
      this.music = this.ctx.createGain()
      this.sfx = this.ctx.createGain()
      this.music.connect(this.ctx.destination)
      this.sfx.connect(this.ctx.destination)
      this.applyVolumes()
      // Pause everything while the tab is hidden.
      // Pause while the page is hidden (other tab, other app, screen locked) and
      // pick back up on return. If the browser refuses to resume without a tap
      // (common on mobile), the next tap resumes it via unlock().
      const sync = () => {
        if (document.hidden) void this.ctx?.suspend()
        else this.resume()
      }
      document.addEventListener('visibilitychange', sync)
      window.addEventListener('pageshow', sync)
      for (const fn of this.readyListeners.splice(0)) fn()
    }
    this.resume()
  }

  /**
   * Resumes playback unless the page is hidden. Checks for anything but
   * "running": iOS parks contexts in a non-standard "interrupted" state after
   * app switches or calls, not just "suspended".
   */
  private resume(): void {
    if (!this.ctx || document.hidden || this.ctx.state === 'running') return
    this.ctx.resume().catch(() => {
      // Needs a user gesture; the next tap calls unlock() and retries.
    })
  }

  configure(musicOn: boolean, sfxOn: boolean): void {
    this.musicOn = musicOn
    this.sfxOn = sfxOn
    this.applyVolumes()
  }

  private applyVolumes(): void {
    if (!this.ctx || !this.music || !this.sfx) return
    const t = this.ctx.currentTime
    this.music.gain.setTargetAtTime(this.musicOn ? MUSIC_VOLUME : 0, t, 0.05)
    this.sfx.gain.setTargetAtTime(this.sfxOn ? SFX_VOLUME : 0, t, 0.02)
  }

  get ready(): boolean {
    return this.ctx !== null && this.ctx.state === 'running'
  }

  tone({
    freq,
    delay = 0,
    at,
    duration,
    wave = 'square',
    volume = 1,
    slideTo,
    attack = 0.005,
    vibrato,
    pluck,
    bendIn,
    dest,
  }: ToneOptions): void {
    const { ctx } = this
    if (!ctx) return
    const start = at ?? ctx.currentTime + delay
    // Plucked notes ring for at most `pluck` seconds.
    const length = pluck ? Math.min(duration, pluck) : duration
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    this.setWave(osc, wave)
    if (bendIn) {
      osc.frequency.setValueAtTime(freq * 2 ** (-bendIn / 12), start)
      osc.frequency.exponentialRampToValueAtTime(freq, start + 0.09)
    } else {
      osc.frequency.setValueAtTime(freq, start)
    }
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), start + length)

    if (vibrato) {
      const lfo = ctx.createOscillator()
      const depth = ctx.createGain()
      lfo.frequency.value = vibrato.rate
      depth.gain.value = vibrato.depth
      lfo.connect(depth).connect(osc.detune)
      lfo.start(start)
      lfo.stop(start + length + 0.02)
    }

    // Attack and release ramps so notes don't click.
    const fadeIn = Math.min(attack, length / 2)
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(volume, start + fadeIn)
    if (pluck) {
      // Strings ring out and fade rather than holding steady.
      gain.gain.exponentialRampToValueAtTime(0.001, start + length)
    } else {
      gain.gain.setValueAtTime(volume, start + Math.max(fadeIn + 0.001, length - 0.03))
      gain.gain.linearRampToValueAtTime(0, start + length)
    }

    osc.connect(gain).connect(dest ?? this.sfx ?? ctx.destination)
    osc.start(start)
    osc.stop(start + length + 0.02)
  }

  noise({
    delay = 0,
    at,
    duration,
    volume = 1,
    filter = 4000,
    filterType = 'highpass',
    dest,
  }: NoiseOptions): void {
    const { ctx } = this
    if (!ctx) return
    const start = at ?? ctx.currentTime + delay
    const src = ctx.createBufferSource()
    src.buffer = this.getNoise(ctx)
    const biquad = ctx.createBiquadFilter()
    biquad.type = filterType
    biquad.frequency.value = filter
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(volume, start)
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
    src
      .connect(biquad)
      .connect(gain)
      .connect(dest ?? this.sfx ?? ctx.destination)
    src.start(start)
    src.stop(start + duration + 0.02)
  }

  /** A continuous, quiet noise bed (vinyl hiss). Returns a function that stops it. */
  hiss(dest: AudioNode, volume: number): () => void {
    const { ctx } = this
    if (!ctx) return () => {}
    const src = ctx.createBufferSource()
    src.buffer = this.getNoise(ctx)
    src.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 3000
    filter.Q.value = 0.5
    const gain = ctx.createGain()
    gain.gain.value = volume
    src.connect(filter).connect(gain).connect(dest)
    src.start()
    return () => {
      try {
        src.stop()
      } catch {
        // Already stopped.
      }
    }
  }

  private setWave(osc: OscillatorNode, wave: Wave): void {
    if (wave === 'pulse25' || wave === 'pulse12') {
      osc.setPeriodicWave(this.pulse(wave === 'pulse25' ? 0.25 : 0.125, wave))
    } else {
      osc.type = wave
    }
  }

  /** Narrow pulse waves: the signature NES/Game Boy lead sound. */
  private pulse(duty: number, key: Wave): PeriodicWave {
    const cached = this.waves.get(key)
    if (cached || !this.ctx) return cached as PeriodicWave
    const harmonics = 64
    const real = new Float32Array(harmonics)
    const imag = new Float32Array(harmonics)
    for (let n = 1; n < harmonics; n++) imag[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty)
    const wave = this.ctx.createPeriodicWave(real, imag)
    this.waves.set(key, wave)
    return wave
  }

  private getNoise(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer
    const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    this.noiseBuffer = buffer
    return buffer
  }
}

export const synth = new Synth()

/** "A4", "C#5", "Bb3" → Hz. */
export function noteFreq(note: string): number {
  const match = /^([A-G])([#b]?)(-?\d)$/.exec(note)
  if (!match) throw new Error(`Bad note "${note}"`)
  const [, letter = 'A', accidental, octave = '4'] = match
  const semis: Record<string, number> = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }
  const offset = (semis[letter] ?? 0) + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0)
  return 440 * 2 ** (Number(octave) - 4 + offset / 12)
}
