/**
 * Status effect lifecycle. A status with `turns: N` affects exactly the owner's
 * next N turns:
 *   beginTurn: apply start-of-turn effects (stun skips, bleed hurts, vibing heals), count down
 *   …owner acts (buffs/debuffs still active)…
 *   endTurn:   remove statuses that have run out
 * Statuses applied mid-turn don't count down until the owner's next turn.
 */

import { BLEED_PCT_PER_TURN, VIBING_HEAL_PCT } from '../balance'
import type { Side, StatusKind } from '../types'
import { type CombatContext, fighter } from './context'
import { applyDamage, applyHeal, percentDamage } from './damage'

const BLEED_CAP = 12

export function applyStatus(
  ctx: CombatContext,
  target: Side,
  status: StatusKind,
  turns: number,
): void {
  const c = fighter(ctx, target)
  const existing = c.statuses.find((s) => s.kind === status)
  if (existing) existing.turns = Math.max(existing.turns, turns)
  else c.statuses.push({ kind: status, turns })
  ctx.emit({ type: 'status', target, status, change: 'applied' })
}

/** Returns true if the owner loses this turn. */
export function beginTurn(ctx: CombatContext, side: Side): { skip: boolean } {
  const c = fighter(ctx, side)
  let skip = false

  for (const status of c.statuses) {
    if (status.turns <= 0) continue
    status.turns -= 1

    switch (status.kind) {
      case 'stunned':
        skip = true
        break
      case 'bleeding': {
        const damage = percentDamage(c, BLEED_PCT_PER_TURN, BLEED_CAP)
        const hpAfter = applyDamage(c, damage)
        if (side === 'hero') ctx.run.damageTaken += damage
        else ctx.run.damageDealt += damage
        ctx.emit({ type: 'tick', target: side, status: 'bleeding', damage, hpAfter })
        break
      }
      case 'vibing': {
        const amount = applyHeal(c, c.stats.maxHp * VIBING_HEAL_PCT)
        if (amount > 0) ctx.emit({ type: 'heal', target: side, amount, hpAfter: c.hp })
        break
      }
      default:
        // Passive modifiers (pumped, shook, hyped, guarded, dazed, frostbit) act elsewhere.
        break
    }
  }
  return { skip }
}

export function endTurn(ctx: CombatContext, side: Side): void {
  const c = fighter(ctx, side)
  for (const status of c.statuses.filter((s) => s.turns <= 0)) {
    ctx.emit({ type: 'status', target: side, status: status.kind, change: 'expired' })
  }
  c.statuses = c.statuses.filter((s) => s.turns > 0)
}
