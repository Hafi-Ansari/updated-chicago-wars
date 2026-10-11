/**
 * Battle round resolution. A round is: both sides pick an action, the higher
 * priority (then initiative) goes first, each takes a turn unless knocked out,
 * then the enemy may leave an opening.
 */

import { ENEMIES } from '../../content/enemies'
import { HERO_LINES } from '../../content/hero'
import { MOVES } from '../../content/moves'
import { OPENING_INTRO, OPENING_ORDER, OPENINGS } from '../../content/openings'
import { SKILLS } from '../../content/skills'
import type { EnemyMove } from '../../content/types'
import {
  DAZED,
  FLEE,
  MIN_DAMAGE,
  OPENING_CHANCE,
  OPENING_TARGETS_OFFERED,
  SAY_CHANCE,
} from '../balance'
import { fill } from '../text'
import type { Hero, MoveId, OpeningTarget, Side, SkillId, Tone } from '../types'
import { type CombatContext, fighter } from './context'
import { applyDamage, initiative, mitigation } from './damage'
import { applyEffects, attack } from './effects'
import { clamp, effectiveStats, hasStatus, hpRatio, isDown } from './stats'
import { beginTurn, endTurn } from './status'

export type BattleOutcome = 'ongoing' | 'won' | 'lost' | 'fled'

export type HeroAction = { type: 'move'; move: MoveId } | { type: 'skill'; skill: SkillId }

/** null = the enemy's basic attack. */
type EnemyAction = EnemyMove | null

const vars = (ctx: CombatContext) => ({ hero: ctx.hero.name, enemy: ctx.enemy.name })

function narrate(ctx: CombatContext, text: string, tone?: Tone): void {
  const filled = fill(text, vars(ctx))
  ctx.emit(tone ? { type: 'narrate', text: filled, tone } : { type: 'narrate', text: filled })
}

function say(ctx: CombatContext, side: Side, text: string): void {
  ctx.emit({ type: 'say', speaker: fighter(ctx, side).name, side, text: fill(text, vars(ctx)) })
}

export function outcome(ctx: CombatContext): BattleOutcome {
  if (isDown(ctx.hero)) return 'lost'
  if (isDown(ctx.enemy)) return 'won'
  return 'ongoing'
}

export function canUseMove(hero: Hero, move: MoveId): boolean {
  const slot = hero.moves.find((m) => m.id === move)
  return slot !== undefined && (slot.pp === null || slot.pp > 0)
}

export function canUseSkill(hero: Hero, skill: SkillId): boolean {
  const def = SKILLS[skill]
  return !def.passive && hero.skills.includes(skill) && (hero.cooldowns[skill] ?? 0) <= 0
}

/** A full round: the hero uses a move or gear, the enemy answers. */
export function fightRound(ctx: CombatContext, action: HeroAction): BattleOutcome {
  tickCooldowns(ctx)
  ctx.battle.round += 1

  const enemyAction = chooseEnemyAction(ctx)
  const heroPriority = action.type === 'move' ? MOVES[action.move].priority : 0
  const heroFirst =
    heroPriority !== 0
      ? heroPriority > 0
      : initiative(ctx.rng, ctx.hero) >= initiative(ctx.rng, ctx.enemy)
  if (!heroFirst) narrate(ctx, '[{enemy} takes the initiative!]', 'info')

  const order: Side[] = heroFirst ? ['hero', 'enemy'] : ['enemy', 'hero']
  for (const side of order) {
    if (outcome(ctx) !== 'ongoing') break
    takeTurn(ctx, side, () => (side === 'hero' ? heroAct(ctx, action) : enemyAct(ctx, enemyAction)))
  }

  maybeOpening(ctx)
  return outcome(ctx)
}

/** Hero tries to run. On failure the enemy gets a free turn. */
export function fleeRound(ctx: CombatContext): BattleOutcome {
  tickCooldowns(ctx)
  const hero = effectiveStats(ctx.hero)
  const enemy = effectiveStats(ctx.enemy)
  const chance = clamp(FLEE.base + (hero.spd - enemy.spd) * FLEE.perSpeedDiff, FLEE.min, FLEE.max)

  if (ctx.rng.chance(chance)) {
    say(ctx, 'hero', ctx.pick('hero.flee', HERO_LINES.flee))
    ctx.emit({ type: 'fled' })
    return 'fled'
  }

  const def = ENEMIES[ctx.enemy.kind]
  say(ctx, 'enemy', ctx.pick(`${def.kind}.blockFlee`, def.blockFlee))
  narrate(ctx, '[You failed to run from the fight!]', 'danger')
  const enemyAction = chooseEnemyAction(ctx)
  takeTurn(ctx, 'enemy', () => enemyAct(ctx, enemyAction))
  return outcome(ctx)
}

/** Hero answers an opening: a free strike with no enemy turn afterwards. */
export function strikeOpening(ctx: CombatContext, target: OpeningTarget | 'brace'): BattleOutcome {
  ctx.battle.opening = null
  tickCooldowns(ctx)

  if (target === 'brace') {
    narrate(ctx, 'You sidestep and let {enemy} stumble past. Nobody gets hurt. Boring, but safe.')
    return outcome(ctx)
  }

  const result = ctx.rng.weighted(
    OPENINGS[target].outcomes.map((o) => ({ value: o, weight: o.weight })),
  )
  for (const line of result.text) narrate(ctx, line)
  applyEffects(ctx, result.winner, result.effects)
  return outcome(ctx)
}

// ── Internals ────────────────────────────────────────────────────────────────

function takeTurn(ctx: CombatContext, side: Side, act: () => void): void {
  const { skip } = beginTurn(ctx, side)
  if (outcome(ctx) === 'ongoing') {
    const c = fighter(ctx, side)
    if (skip) narrate(ctx, `${c.name} is stunned and can't move!`, 'info')
    else if (hasStatus(c, 'dazed') && ctx.rng.chance(DAZED.selfHitChance)) hitSelf(ctx, side)
    else act()
  }
  endTurn(ctx, side)
}

function heroAct(ctx: CombatContext, action: HeroAction): void {
  if (action.type === 'skill') {
    const skill = SKILLS[action.skill]
    ctx.hero.cooldowns[action.skill] = skill.cooldown
    for (const line of skill.useText) narrate(ctx, line, 'info')
    applyEffects(ctx, 'hero', skill.effects)
    return
  }

  const move = MOVES[action.move]
  const slot = ctx.hero.moves.find((m) => m.id === action.move)
  if (slot && slot.pp !== null) slot.pp -= 1

  ctx.emit({ type: 'move', user: 'hero', name: move.name })
  if (move.lines.length > 0 && ctx.rng.chance(move.sayChance ?? SAY_CHANCE.heroMove)) {
    say(ctx, 'hero', ctx.pick(`move.${move.id}`, move.lines))
  }
  if (move.accuracy < 1 && !ctx.rng.chance(move.accuracy)) {
    ctx.emit({ type: 'miss', attacker: 'hero', target: 'enemy', reason: 'miss' })
    return
  }
  applyEffects(ctx, 'hero', move.effects)
}

function chooseEnemyAction(ctx: CombatContext): EnemyAction {
  const def = ENEMIES[ctx.enemy.kind]
  const hurt = hpRatio(ctx.enemy) < 0.5
  const moves = def.moves.filter((m) => !m.whenHurt || hurt)
  return ctx.rng.weighted<EnemyAction>([
    { value: null, weight: def.basicAttackWeight },
    ...moves.map((m) => ({ value: m, weight: m.weight })),
  ])
}

function enemyAct(ctx: CombatContext, action: EnemyAction): void {
  if (action === null) {
    attack(ctx, 'enemy')
    return
  }
  const def = ENEMIES[ctx.enemy.kind]
  if (ctx.rng.chance(SAY_CHANCE.enemyTaunt))
    say(ctx, 'enemy', ctx.pick(`${def.kind}.taunt`, def.taunt))
  narrate(ctx, action.text)
  applyEffects(ctx, 'enemy', action.effects)
}

/** Dazed fighters sometimes stumble into their own swing. */
function hitSelf(ctx: CombatContext, side: Side): void {
  const c = fighter(ctx, side)
  const stats = effectiveStats(c)
  const damage = Math.max(MIN_DAMAGE, Math.round(stats.atk * DAZED.power * mitigation(stats.def)))
  const hpAfter = applyDamage(c, damage)
  if (side === 'hero') ctx.run.damageTaken += damage
  ctx.emit({ type: 'selfHit', target: side, damage, hpAfter })
}

function maybeOpening(ctx: CombatContext): void {
  if (outcome(ctx) !== 'ongoing' || hasStatus(ctx.enemy, 'stunned')) return
  if (!ctx.rng.chance(OPENING_CHANCE)) return

  const offered = ctx.rng.sample(OPENING_ORDER, OPENING_TARGETS_OFFERED)
  ctx.battle.opening = OPENING_ORDER.filter((t) => offered.includes(t))
  for (const line of OPENING_INTRO) narrate(ctx, line, 'info')
}

function tickCooldowns(ctx: CombatContext): void {
  for (const id of Object.keys(ctx.hero.cooldowns) as SkillId[]) {
    const left = (ctx.hero.cooldowns[id] ?? 0) - 1
    if (left > 0) ctx.hero.cooldowns[id] = left
    else delete ctx.hero.cooldowns[id]
  }
}
