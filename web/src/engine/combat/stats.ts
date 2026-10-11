import { FROSTBIT_SPD_MULT, HYPED_CRIT_BONUS, PUMPED_ATK_MULT, SHOOK_DEF_MULT } from '../balance'
import type { Combatant, Stats, StatusKind } from '../types'

export function hasStatus(c: Combatant, kind: StatusKind): boolean {
  return c.statuses.some((s) => s.kind === kind)
}

/** Stats after status modifiers. Use this for every combat calculation. */
export function effectiveStats(c: Combatant): Stats {
  const { stats } = c
  return {
    ...stats,
    atk: hasStatus(c, 'pumped') ? Math.round(stats.atk * PUMPED_ATK_MULT) : stats.atk,
    def: hasStatus(c, 'shook') ? Math.round(stats.def * SHOOK_DEF_MULT) : stats.def,
    spd: hasStatus(c, 'frostbit') ? Math.round(stats.spd * FROSTBIT_SPD_MULT) : stats.spd,
    crit: hasStatus(c, 'hyped') ? Math.min(1, stats.crit + HYPED_CRIT_BONUS) : stats.crit,
  }
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export const hpRatio = (c: Combatant): number => c.hp / c.stats.maxHp

export const isDown = (c: Combatant): boolean => c.hp <= 0
