/**
 * Seeded pseudo-random number generator (mulberry32).
 *
 * The entire generator state is one unsigned 32-bit integer, so it can live inside the
 * serializable game state. Same seed + same calls = same results, which makes fights
 * reproducible in tests, replays, and save files.
 */

export type RngState = number

export interface Weighted<T> {
  readonly value: T
  readonly weight: number
}

export interface Rng {
  /** Current internal state; write this back into the game state after rolling. */
  readonly state: RngState
  /** Uniform float in [0, 1). */
  float(): number
  /** Uniform integer in [min, max], both inclusive. */
  int(min: number, max: number): number
  /** True with probability `p` (0..1). */
  chance(p: number): boolean
  pick<T>(items: readonly T[]): T
  weighted<T>(table: readonly Weighted<T>[]): T
  /** `base` randomly scaled by up to ±`spread` (e.g. 0.15 = ±15%). Not rounded. */
  vary(base: number, spread: number): number
  /** `count` distinct items in random order. */
  sample<T>(items: readonly T[], count: number): T[]
}

export function createRng(seed: RngState): Rng {
  let state = seed >>> 0

  const float = (): number => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  const int = (min: number, max: number): number => {
    if (max < min) throw new RangeError(`int(${min}, ${max}): max < min`)
    return min + Math.floor(float() * (max - min + 1))
  }

  const pick = <T>(items: readonly T[]): T => {
    if (items.length === 0) throw new RangeError('pick() from an empty list')
    return items[int(0, items.length - 1)] as T
  }

  const weighted = <T>(table: readonly Weighted<T>[]): T => {
    const total = table.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0)
    if (total <= 0) throw new RangeError('weighted() needs at least one positive weight')
    let roll = float() * total
    for (const entry of table) {
      roll -= Math.max(0, entry.weight)
      if (roll < 0) return entry.value
    }
    // Floating-point safety net: fall back to the last positively weighted entry.
    return table.findLast((entry) => entry.weight > 0)?.value as T
  }

  const sample = <T>(items: readonly T[], count: number): T[] => {
    const pool = [...items]
    for (let i = pool.length - 1; i > 0; i--) {
      const j = int(0, i)
      ;[pool[i], pool[j]] = [pool[j] as T, pool[i] as T]
    }
    return pool.slice(0, Math.min(count, pool.length))
  }

  return {
    get state() {
      return state
    },
    float,
    int,
    chance: (p) => float() < p,
    pick,
    weighted,
    vary: (base, spread) => base * (1 + (float() * 2 - 1) * spread),
    sample,
  }
}
