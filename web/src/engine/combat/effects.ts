/**
 * Resolves Effect data (from moves, gear, enemy moves, openings) into state
 * changes and events. `user` is the side performing the effect; "foe" is the
 * other side.
 */

import { HERO_LINES } from '../../content/hero'
import { assertNever } from '../assert'
import { GUARDED_DAMAGE_MULT, MIN_DAMAGE, SAY_CHANCE } from '../balance'
import { fill } from '../text'
import type { Effect, Side } from '../types'
import { type CombatContext, fighter, other } from './context'
import { applyDamage, applyHeal, percentDamage, rollAttack } from './damage'
import { lockableGear, lockableMoves } from './locks'
import { hasStatus, hpRatio, isDown } from './stats'
import { applyStatus } from './status'

/** Applies effects in order. Returns the total damage dealt to the foe (for recoil). */
export function applyEffects(ctx: CombatContext, user: Side, effects: readonly Effect[]): number {
  let dealt = 0
  let whiffed = false
  for (const effect of effects) {
    // Self-targeted effects still happen after a knockout (recoil, heals); attacks don't.
    if (isDown(fighter(ctx, other(user))) && targetsFoe(effect)) continue
    if (isDown(fighter(ctx, user))) break
    // A rider (the bleed on a shank, the daze on pocket sand) only sticks if the attack
    // before it connected. Without this, a dodged swing could still leave you bleeding.
    if (whiffed && isRider(effect)) continue
    const before = dealt
    dealt += applyEffect(ctx, user, effect, dealt)
    if (isAttack(effect)) whiffed = dealt === before
  }
  return dealt
}

/** Effects that roll to hit the foe; a full miss or dodge deals 0. */
function isAttack(effect: Effect): boolean {
  return effect.type === 'damage' || effect.type === 'execute'
}

/** Effects on the foe that ride along with an attack rather than hitting on their own. */
function isRider(effect: Effect): boolean {
  return (effect.type === 'status' && effect.target === 'foe') || isSteal(effect)
}

/** Snatching something off the foe: a lock or a pickpocket. */
function isSteal(effect: Effect): boolean {
  return effect.type === 'lockMove' || effect.type === 'lockGear' || effect.type === 'stealClout'
}

/** Whether a set of effects aims at the foe at all (and so can miss when blinded). */
export function aimsAtFoe(effects: readonly Effect[]): boolean {
  return effects.some(targetsFoe)
}

function targetsFoe(effect: Effect): boolean {
  switch (effect.type) {
    case 'heal':
    case 'healPct':
    case 'recoil':
    case 'drain':
    case 'reveal':
      return false
    case 'status':
      return effect.target === 'foe'
    default:
      return true
  }
}

/** Returns damage dealt to the foe by this effect. */
function applyEffect(ctx: CombatContext, user: Side, effect: Effect, dealtSoFar: number): number {
  const target = other(user)
  const self = fighter(ctx, user)
  const foe = fighter(ctx, target)

  switch (effect.type) {
    case 'damage': {
      const hits = effect.hits ?? 1
      const finisher = effect.finisher && hpRatio(foe) < effect.finisher.below
      const power = effect.power * (finisher ? (effect.finisher?.mult ?? 1) : 1)
      let dealt = 0
      for (let i = 0; i < hits && !isDown(foe); i++) {
        dealt += attack(ctx, user, power, effect.pierce ?? false)
      }
      return dealt
    }
    case 'percentDamage':
      return dealDamage(ctx, user, percentDamage(foe, effect.pct, effect.cap), false)
    case 'execute':
      if (hpRatio(foe) <= effect.threshold) return dealDamage(ctx, user, foe.hp, true, true)
      return attack(ctx, user, effect.fallbackPower)
    case 'heal':
      heal(ctx, user, ctx.rng.int(effect.min, effect.max))
      return 0
    case 'healPct':
      heal(ctx, user, self.stats.maxHp * effect.pct)
      return 0
    case 'recoil': {
      if (dealtSoFar <= 0) return 0
      const damage = Math.max(MIN_DAMAGE, Math.round(dealtSoFar * effect.pct))
      const hpAfter = applyDamage(self, damage)
      if (user === 'hero') ctx.run.damageTaken += damage
      ctx.emit({ type: 'recoil', target: user, damage, hpAfter })
      return 0
    }
    case 'drain':
      if (dealtSoFar > 0) heal(ctx, user, Math.max(1, dealtSoFar * effect.pct))
      return 0
    case 'lockMove': {
      if (user !== 'enemy') return 0
      const lockable = lockableMoves(ctx.hero, ctx.battle)
      if (lockable.length === 0) return 0
      const { lastMove } = ctx.battle
      const move = lastMove && lockable.includes(lastMove) ? lastMove : ctx.rng.pick(lockable)
      ctx.battle.lockedMoves.push(move)
      ctx.emit({ type: 'locked', what: 'move', move })
      return 0
    }
    case 'lockGear': {
      if (user !== 'enemy') return 0
      const lockable = lockableGear(ctx.hero, ctx.battle)
      if (lockable.length === 0) return 0
      const skill = ctx.rng.pick(lockable)
      ctx.battle.lockedGear.push(skill)
      ctx.emit({ type: 'locked', what: 'gear', skill })
      return 0
    }
    case 'stealClout':
      stealClout(ctx, user, ctx.rng.int(effect.min, effect.max))
      return 0
    case 'status':
      if (effect.chance === undefined || ctx.rng.chance(effect.chance)) {
        applyStatus(ctx, effect.target === 'self' ? user : target, effect.status, effect.turns)
      }
      return 0
    case 'reveal':
      ctx.battle.revealed = true
      return 0
    default:
      return assertNever(effect)
  }
}

/** One normal attack roll: can be dodged, can crit. Returns damage dealt. */
export function attack(ctx: CombatContext, user: Side, power = 1, pierce = false): number {
  const target = other(user)
  const roll = rollAttack(ctx.rng, fighter(ctx, user), fighter(ctx, target), power, pierce)
  if (roll.dodged) {
    ctx.emit({ type: 'miss', attacker: user, target, reason: 'dodge' })
    return 0
  }
  return dealDamage(ctx, user, roll.damage, roll.crit)
}

/** Lands damage on the foe. Guarded foes take half (unless `unblockable`). */
function dealDamage(
  ctx: CombatContext,
  user: Side,
  amount: number,
  crit: boolean,
  unblockable = false,
): number {
  const target = other(user)
  const foe = fighter(ctx, target)
  const guarded = !unblockable && hasStatus(foe, 'guarded')
  const damage = guarded ? Math.max(MIN_DAMAGE, Math.round(amount * GUARDED_DAMAGE_MULT)) : amount
  const hpAfter = applyDamage(foe, damage)

  if (user === 'hero') {
    ctx.run.damageDealt += damage
    if (crit) ctx.run.crits += 1
  } else {
    ctx.run.damageTaken += damage
  }
  ctx.emit({ type: 'hit', attacker: user, target, damage, crit, guarded, hpAfter })

  if (user === 'hero' && crit && hpAfter > 0 && ctx.rng.chance(SAY_CHANCE.heroCrit)) {
    const line = ctx.pick('hero.crit', HERO_LINES.crit)
    ctx.emit({
      type: 'say',
      speaker: ctx.hero.name,
      side: 'hero',
      text: fill(line, { hero: ctx.hero.name, enemy: ctx.enemy.name }),
    })
  }
  return damage
}

/** Moves clout from the foe to the user. An enemy holds it as extra reward until beaten. */
function stealClout(ctx: CombatContext, user: Side, amount: number): void {
  const { hero, enemy } = ctx
  if (user === 'enemy') {
    const taken = Math.min(amount, hero.clout)
    if (taken <= 0) return
    hero.clout -= taken
    enemy.cloutReward += taken
    ctx.emit({ type: 'clout', amount: -taken, total: hero.clout })
  } else {
    const taken = Math.min(amount, enemy.cloutReward)
    if (taken <= 0) return
    enemy.cloutReward -= taken
    hero.clout += taken
    ctx.run.cloutEarned += taken
    ctx.emit({ type: 'clout', amount: taken, total: hero.clout })
  }
}

function heal(ctx: CombatContext, user: Side, amount: number): void {
  const self = fighter(ctx, user)
  const healed = applyHeal(self, amount)
  ctx.emit({ type: 'heal', target: user, amount: healed, hpAfter: self.hp })
}
