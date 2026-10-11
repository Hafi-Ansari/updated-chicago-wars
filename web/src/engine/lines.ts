import { LINE_MEMORY } from './balance'
import type { Rng } from './rng'
import type { GameState } from './types'

/**
 * Picks an item from a pool, avoiding the ones picked most recently from the
 * same pool (tracked per `key` in `state.recent`). Keeps big dialogue pools
 * feeling fresh instead of repeating the same bar twice in a row.
 */
export function pickFresh<T>(state: GameState, rng: Rng, key: string, pool: readonly T[]): T {
  if (pool.length === 0) throw new RangeError(`pickFresh(${key}): empty pool`)
  const memory = Math.floor(pool.length * LINE_MEMORY)
  const recent = (state.recent[key] ?? []).slice(-memory)
  const candidates = pool.map((_, i) => i).filter((i) => !recent.includes(i))
  const index = rng.pick(candidates.length > 0 ? candidates : pool.map((_, i) => i))
  state.recent[key] = memory > 0 ? [...recent, index].slice(-memory) : []
  return pool[index] as T
}

export type Picker = <T>(key: string, pool: readonly T[]) => T
