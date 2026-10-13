/**
 * The one place damage numbers come from. Every attack (hero, enemy, skill,
 * opening) goes through `rollAttack`, so balance changes happen here or in
 * balance.ts, never scattered across call sites.
 */

import {
  CRIT_MULTIPLIER,
  DAMAGE_VARIANCE,
  DEFENSE_K,
  DODGE,
  INITIATIVE_JITTER,
  MIN_DAMAGE,
} from '../balance'
import type { Rng } from '../rng'
import type { Combatant, Stats } from '../types'
import { clamp, effectiveStats } from './stats'

export type AttackRoll = { dodged: true } | { dodged: false; damage: number; crit: boolean }

/** Fraction of incoming damage that gets through `def`. */
export function mitigation(def: number): number {
  return DEFENSE_K / (DEFENSE_K + Math.max(0, def))
}

export function dodgeChance(attacker: Stats, defender: Stats): number {
  const speedEdge = defender.spd - attacker.spd
  return clamp(DODGE.base + speedEdge * DODGE.perSpeedDiff, DODGE.min, DODGE.max)
}

/**
 * Rolls one attack. `power` scales the attacker's ATK (1 = a basic hit);
 * `pierce` ignores the defender's Defense; `sure` skips the dodge roll.
 */
export function rollAttack(
  rng: Rng,
  attacker: Combatant,
  defender: Combatant,
  power = 1,
  pierce = false,
  sure = false,
): AttackRoll {
  const atk = effectiveStats(attacker)
  const def = effectiveStats(defender)

  if (!sure && rng.chance(dodgeChance(atk, def))) return { dodged: true }

  const crit = rng.chance(atk.crit)
  const raw = rng.vary(atk.atk * power, DAMAGE_VARIANCE) * (pierce ? 1 : mitigation(def.def))
  const damage = Math.max(MIN_DAMAGE, Math.round(crit ? raw * CRIT_MULTIPLIER : raw))
  return { dodged: false, damage, crit }
}

/** Damage that skips dodge and defense: a share of max HP, capped. */
export function percentDamage(target: Combatant, pct: number, cap: number): number {
  return Math.max(MIN_DAMAGE, Math.min(cap, Math.round(target.stats.maxHp * pct)))
}

export function initiative(rng: Rng, c: Combatant): number {
  return effectiveStats(c).spd + rng.int(0, INITIATIVE_JITTER)
}

/** Lowers HP, never below 0. Returns HP afterwards. */
export function applyDamage(target: Combatant, amount: number): number {
  target.hp = Math.max(0, target.hp - Math.max(0, Math.round(amount)))
  return target.hp
}

/** Raises HP, never above max. Returns the amount actually healed. */
export function applyHeal(target: Combatant, amount: number): number {
  const before = target.hp
  target.hp = Math.min(target.stats.maxHp, target.hp + Math.max(0, Math.round(amount)))
  return target.hp - before
}
