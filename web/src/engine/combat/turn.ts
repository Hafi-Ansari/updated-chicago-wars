/**
 * Battle round resolution. A round is: both sides pick an action, the higher
 * priority (then initiative) goes first, each takes a turn unless knocked out,
 * then the enemy may leave an opening.
 */

import { ENEMIES } from '../../content/enemies'
import { HERO_LINES } from '../../content/hero'
import { MOVES } from '../../content/moves'
import { OPENING_ORDER, OPENING_SCENARIOS, OPENINGS } from '../../content/openings'
import { SKILLS } from '../../content/skills'
import type { EnemyMove } from '../../content/types'
import {
  BLINDED_ACCURACY_MULT,
  DAZED,
  FLEE,
  MIN_DAMAGE,
  OPENING_CHANCE,
  OPENING_TARGETS_OFFERED,
  SAY_CHANCE,
} from '../balance'
import { fill } from '../text'
import type { BattleState, Hero, MoveId, OpeningTarget, Side, SkillId, Tone } from '../types'
import { type CombatContext, fighter, other } from './context'
import { applyDamage, initiative, mitigation } from './damage'
import { aimsAtFoe, applyEffects, attack } from './effects'
import { lockableGear, lockableMoves } from './locks'
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

/** Whether the hero can use a move right now: known, PP left, and not locked this fight. */
export function canUseMove(hero: Hero, move: MoveId, battle?: BattleState): boolean {
  const slot = hero.moves.find((m) => m.id === move)
  if (!slot || battle?.lockedMoves.includes(move)) return false
  return slot.pp === null || slot.pp > 0
}

/** Whether the hero can use gear right now: owned, active, off cooldown, and not taken this fight. */
export function canUseSkill(hero: Hero, skill: SkillId, battle?: BattleState): boolean {
  const def = SKILLS[skill]
  if (def.passive || !hero.skills.includes(skill) || battle?.lockedGear.includes(skill)) {
    return false
  }
  return (hero.cooldowns[skill] ?? 0) <= 0
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
  ctx.battle.lastMove = action.move

  ctx.emit({ type: 'move', user: 'hero', name: move.name })
  if (move.lines.length > 0 && ctx.rng.chance(move.sayChance ?? SAY_CHANCE.heroMove)) {
    say(ctx, 'hero', ctx.pick(`move.${move.id}`, move.lines))
  }
  const aimed = aimsAtFoe(move.effects)
  const accuracy = move.accuracy * (aimed ? blindness(ctx, 'hero') : 1)
  if (accuracy < 1 && !ctx.rng.chance(accuracy)) {
    ctx.emit({ type: 'miss', attacker: 'hero', target: 'enemy', reason: 'miss' })
    return
  }
  applyEffects(ctx, 'hero', move.effects)
}

/** Accuracy multiplier for a side's attacks (lower while blinded). */
function blindness(ctx: CombatContext, side: Side): number {
  return hasStatus(fighter(ctx, side), 'blinded') ? BLINDED_ACCURACY_MULT : 1
}

function chooseEnemyAction(ctx: CombatContext): EnemyAction {
  const def = ENEMIES[ctx.enemy.kind]
  const moves = def.moves.filter((m, i) => available(ctx, m, i))
  return ctx.rng.weighted<EnemyAction>([
    { value: null, weight: def.basicAttackWeight },
    ...moves.map((m) => ({ value: m, weight: m.weight })),
  ])
}

/** Whether a special move is on the table: HP gate, uses left this fight, and something to lock. */
function available(ctx: CombatContext, move: EnemyMove, index: number): boolean {
  const { battle, hero } = ctx
  if (move.whenBelow !== undefined && hpRatio(ctx.enemy) >= move.whenBelow) return false
  const uses = battle.enemyMoveUses.filter((i) => i === index).length
  if (move.maxUses !== undefined && uses >= move.maxUses) return false
  return move.effects.every(
    (e) =>
      (e.type !== 'lockMove' || lockableMoves(hero, battle).length > 0) &&
      (e.type !== 'lockGear' || lockableGear(hero, battle).length > 0),
  )
}

function enemyAct(ctx: CombatContext, action: EnemyAction): void {
  const def = ENEMIES[ctx.enemy.kind]
  if (action !== null) {
    ctx.battle.enemyMoveUses.push(def.moves.indexOf(action))
    if (ctx.rng.chance(SAY_CHANCE.enemyTaunt)) {
      say(ctx, 'enemy', ctx.pick(`${def.kind}.taunt`, def.taunt))
    }
    narrate(ctx, action.text)
  }
  // A blinded enemy can whiff anything aimed at the hero, basic attacks included.
  const aimed = action === null || aimsAtFoe(action.effects)
  const accuracy = aimed ? blindness(ctx, 'enemy') : 1
  if (accuracy < 1 && !ctx.rng.chance(accuracy)) {
    ctx.emit({ type: 'miss', attacker: 'enemy', target: other('enemy'), reason: 'miss' })
    return
  }
  if (action === null) attack(ctx, 'enemy')
  else applyEffects(ctx, 'enemy', action.effects)
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

  const scenario = ctx.pick('openings', OPENING_SCENARIOS)
  const offered = ctx.rng.sample(scenario.targets, OPENING_TARGETS_OFFERED)
  ctx.battle.opening = OPENING_ORDER.filter((t) => offered.includes(t))
  for (const line of scenario.intro) narrate(ctx, line, 'info')
}

function tickCooldowns(ctx: CombatContext): void {
  for (const id of Object.keys(ctx.hero.cooldowns) as SkillId[]) {
    const left = (ctx.hero.cooldowns[id] ?? 0) - 1
    if (left > 0) ctx.hero.cooldowns[id] = left
    else delete ctx.hero.cooldowns[id]
  }
}
