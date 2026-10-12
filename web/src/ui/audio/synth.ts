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
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) void this.ctx?.suspend()
        else void this.ctx?.resume()
      })
      for (const fn of this.readyListeners.splice(0)) fn()
    }
    if (this.ctx.state === 'suspended' && !document.hidden) void this.ctx.resume()
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
    dest,
  }: ToneOptions): void {
    const { ctx } = this
    if (!ctx) return
    const start = at ?? ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    this.setWave(osc, wave)
    osc.frequency.setValueAtTime(freq, start)
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), start + duration)

    // Short attack and release so notes don't click.
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(volume, start + 0.005)
    gain.gain.setValueAtTime(volume, start + Math.max(0.006, duration - 0.03))
    gain.gain.linearRampToValueAtTime(0, start + duration)

    osc.connect(gain).connect(dest ?? this.sfx ?? ctx.destination)
    osc.start(start)
    osc.stop(start + duration + 0.02)
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
