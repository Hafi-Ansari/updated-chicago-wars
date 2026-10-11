import type { Picker } from '../lines'
import type { Rng } from '../rng'
import type { BattleState, Combatant, Enemy, GameEvent, Hero, RunStats, Side } from '../types'

/**
 * Everything a combat function needs. Combat functions mutate the (Immer draft)
 * combatants they're given and report what happened through `emit`.
 */
export interface CombatContext {
  rng: Rng
  emit: (event: GameEvent) => void
  /** Picks a dialogue line from a pool, avoiding recent repeats. */
  pick: Picker
  run: RunStats
  hero: Hero
  enemy: Enemy
  battle: BattleState
}

export const other = (side: Side): Side => (side === 'hero' ? 'enemy' : 'hero')

export const fighter = (ctx: CombatContext, side: Side): Combatant =>
  side === 'hero' ? ctx.hero : ctx.enemy
