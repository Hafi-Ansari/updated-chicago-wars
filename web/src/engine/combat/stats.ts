import {
  FROSTBIT_SPD_MULT,
  HOBBLED_SPD_MULT,
  HYPED_CRIT_BONUS,
  PUMPED_ATK_MULT,
  SHOOK_DEF_MULT,
  WEAKENED_ATK_MULT,
} from '../balance'
import type { Combatant, Stats, StatusKind } from '../types'

export function hasStatus(c: Combatant, kind: StatusKind): boolean {
  return c.statuses.some((s) => s.kind === kind)
}

/** Stats after status modifiers. Use this for every combat calculation. */
export function effectiveStats(c: Combatant): Stats {
  const { stats } = c
  return {
    ...stats,
    atk: Math.round(
      stats.atk *
        (hasStatus(c, 'pumped') ? PUMPED_ATK_MULT : 1) *
        (hasStatus(c, 'weakened') ? WEAKENED_ATK_MULT : 1),
    ),
    def: hasStatus(c, 'shook') ? Math.round(stats.def * SHOOK_DEF_MULT) : stats.def,
    spd: Math.round(
      stats.spd *
        (hasStatus(c, 'frostbit') ? FROSTBIT_SPD_MULT : 1) *
        (hasStatus(c, 'hobbled') ? HOBBLED_SPD_MULT : 1),
    ),
    crit: hasStatus(c, 'hyped') ? Math.min(1, stats.crit + HYPED_CRIT_BONUS) : stats.crit,
  }
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export const hpRatio = (c: Combatant): number => c.hp / c.stats.maxHp

export const isDown = (c: Combatant): boolean => c.hp <= 0
