/**
 * A simple bot that plays full runs through the public engine API.
 * Used by the balance test; it plays sensibly, not optimally, like a first-time player.
 */

import { MOVES } from '../src/content/moves'
import { SKILLS } from '../src/content/skills'
import { BLOCKS_PER_RUN, HOT_DOG, MAX_MOVES, trainingPrice } from '../src/engine/balance'
import { canBattleRap, cypherPrompt } from '../src/engine/combat/cypher'
import { canUseMove, canUseSkill } from '../src/engine/combat/turn'
import { type ChoiceView, choicesFor } from '../src/engine/dialogue'
import { teachableMoves } from '../src/engine/encounters'
import { createRng, type Rng } from '../src/engine/rng'
import { newGame, step } from '../src/engine/step'
import type {
  Action,
  BarResult,
  BattleState,
  BoostableStat,
  CypherTier,
  GameEvent,
  GameState,
  Hero,
  MoveId,
  NpcInstance,
  OpeningTarget,
  SkillId,
} from '../src/engine/types'

export interface RunResult {
  won: boolean
  blockReached: number
  actions: number
  fights: number
  battleRounds: number
  level: number
  cyphers: Record<CypherTier, number>
}

export interface SimOptions {
  /** Answer Battle Rap by typing (sampled quality and rhyme) instead of picking. */
  typed?: boolean
  /** Sees every step the bot takes (for tests that check invariants over whole runs). */
  onStep?: (before: GameState, after: GameState, events: GameEvent[]) => void
}

/**
 * How the bot does at Battle Rap. Picking: a first-time player reading three options.
 * Typing: quality ~ N(5.5, 2) and a rhyme half the time, a slant a quarter of the time.
 * Recalibrate both from logged bars once real players have rapped.
 */
function botBar(battle: BattleState, rng: Rng, options: SimOptions): BarResult {
  if (options.typed) {
    const normal = Math.sqrt(-2 * Math.log(1 - rng.float())) * Math.cos(2 * Math.PI * rng.float())
    const quality = Math.min(10, Math.max(0, 5.5 + 2 * normal))
    const rhyme = rng.weighted([
      { value: 1, weight: 50 },
      { value: 0.7, weight: 25 },
      { value: 0, weight: 25 },
    ])
    return { kind: 'typed', text: 'bot bar\nbot bar', quality, rhyme, rejected: false }
  }
  if (!battle.cypher) return { kind: 'timeout' }
  const tier = rng.weighted<CypherTier>([
    { value: 'fire', weight: 55 },
    { value: 'decent', weight: 35 },
    { value: 'flop', weight: 10 },
  ])
  const prompt = cypherPrompt(battle.enemy.kind, battle.cypher)
  const answer = prompt.answers.findIndex((a) => a.tier === tier)
  return { kind: 'picked', answer }
}

const GEAR_PRIORITY: SkillId[] = [
  'ventraCard',
  'cloudGate',
  'glock',
  'durag',
  'mixtape',
  'taser',
  'aviators',
]
/** Core gear first; elite pieces once the bot is rich enough. */
const SHOP_PRIORITY: SkillId[] = [
  'taser',
  'durag',
  'glock',
  'aviators',
  'airpods',
  'ventraCard',
  'cloudGate',
  'mixtape',
]
const TRAINING_PRIORITY: BoostableStat[] = ['atk', 'maxHp', 'def', 'spd']
/** Clout the bot keeps back after training, for hot dogs and gear. */
const TRAINING_RESERVE = 15

/** Rough value of a move for this bot: expected damage, with bonuses for utility. */
function moveValue(id: MoveId, battle?: BattleState, hero?: Hero): number {
  const move = MOVES[id]
  let value = 0
  for (const e of move.effects) {
    if (e.type === 'damage') {
      const low =
        battle && e.finisher && battle.enemy.hp / battle.enemy.stats.maxHp < e.finisher.below
      value += e.power * (e.hits ?? 1) * (low ? (e.finisher?.mult ?? 1) : 1) * (e.pierce ? 1.3 : 1)
    }
    if (e.type === 'recoil') value -= 0.2
    if (e.type === 'status') value += 0.4
    if (e.type === 'healPct') value += hero && hero.hp / hero.stats.maxHp < 0.4 ? 2.5 : -1
  }
  return value * move.accuracy
}

function pickMove(state: GameState, battle: BattleState): Action {
  const { hero } = state
  const usable = hero.moves.map((m) => m.id).filter((id) => canUseMove(hero, id, battle))
  const hasStatus = (kind: string) => hero.statuses.some((s) => s.kind === kind)
  const enemyHas = (kind: string) => battle.enemy.statuses.some((s) => s.kind === kind)

  // Set-up moves early in a fight.
  if (battle.round === 0 && usable.includes('hypeUp') && !hasStatus('pumped')) {
    return { type: 'useMove', move: 'hypeUp' }
  }
  if (battle.round <= 1 && usable.includes('talkTrash') && !enemyHas('shook')) {
    return { type: 'useMove', move: 'talkTrash' }
  }
  const gear = GEAR_PRIORITY.find((s) => canUseSkill(hero, s, battle))
  if (gear) return { type: 'useSkill', skill: gear }

  const best = usable.reduce((a, b) =>
    moveValue(b, battle, hero) > moveValue(a, battle, hero) ? b : a,
  )
  return { type: 'useMove', move: best }
}

/** The learn decision for a list of moves: the best one, and what to forget for it if full. */
function learnChoice(hero: Hero, offered: MoveId[]): Action | null {
  if (offered.length === 0) return null
  const best = offered.reduce((a, b) => (moveValue(b) > moveValue(a) ? b : a))
  if (hero.moves.length < MAX_MOVES) return { type: 'learnMove', move: best }
  const worst = hero.moves
    .map((m) => m.id)
    .filter((id) => id !== 'jab')
    .reduce((a, b) => (moveValue(b) < moveValue(a) ? b : a))
  return moveValue(best) > moveValue(worst)
    ? { type: 'learnMove', move: best, replace: worst }
    : null
}

function affordableTraining(state: GameState, npc: NpcInstance): BoostableStat | undefined {
  if (npc.spent.includes('trained')) return undefined
  return TRAINING_PRIORITY.find(
    (stat) => state.hero.clout - trainingPrice(stat, state.tradesMade) >= TRAINING_RESERVE,
  )
}

function gangstaChoice(state: GameState, npc: NpcInstance, node: string, choices: ChoiceView[]) {
  const has = (key: string) => choices.some((c) => c.key === key)
  if (node === 'story') return 'back'
  if (node === 'training') {
    const stat = affordableTraining(state, npc)
    return stat ? `stat-${stat}` : 'back'
  }
  if (has('story')) return 'story'
  if (has('train') && node !== 'taught' && learnChoice(state.hero, teachableMoves(state))) {
    return 'train'
  }
  if (has('trade') && affordableTraining(state, npc)) return 'trade'
  return 'leave'
}

function chooseAction(state: GameState, rng: Rng, options: SimOptions): Action {
  const { phase, hero } = state
  switch (phase.kind) {
    case 'explore': {
      const visited = (id: 'plug' | 'gangsta' | 'hotDogVendor') => state.visited.includes(id)
      const wantsGear = SHOP_PRIORITY.some(
        (s) => !hero.skills.includes(s) && hero.clout >= SKILLS[s].price,
      )
      if (!visited('plug') && wantsGear) return { type: 'visit', npc: 'plug' }
      const wantsGangsta =
        hero.clout >= trainingPrice('spd', state.tradesMade) + TRAINING_RESERVE ||
        learnChoice(hero, teachableMoves(state)) !== null
      if (!visited('gangsta') && wantsGangsta) return { type: 'visit', npc: 'gangsta' }
      if (
        !visited('hotDogVendor') &&
        hero.hp / hero.stats.maxHp < 0.6 &&
        hero.clout >= HOT_DOG.price
      ) {
        return { type: 'visit', npc: 'hotDogVendor' }
      }
      return { type: 'walk' }
    }

    case 'battle': {
      const { battle } = phase
      const enemyRatio = battle.enemy.hp / battle.enemy.stats.maxHp
      if (battle.cypher) return { type: 'spit', bar: botBar(battle, rng, options) }
      // Battle Rap as soon as it unlocks: a finisher the bot never saves for later.
      if (canBattleRap(battle)) return { type: 'battleRap' }
      if (battle.opening) {
        const prefer: OpeningTarget[] =
          enemyRatio <= 0.3 ? ['head', 'torso', 'crotch'] : ['torso', 'crotch', 'legs']
        const target = prefer.find((t) => battle.opening?.includes(t))
        return { type: 'strike', target: target ?? 'brace' }
      }
      const heroRatio = hero.hp / hero.stats.maxHp
      if (battle.canFlee && heroRatio < 0.15 && enemyRatio > 0.6) return { type: 'flee' }
      return pickMove(state, battle)
    }

    case 'learnMove':
      return learnChoice(hero, phase.offered) ?? { type: 'skipLearn' }

    case 'dialogue': {
      const choices = choicesFor(state, phase.npc, phase.node).filter(
        (c) => c.availability === 'available',
      )
      if (phase.npc.id === 'gangsta') {
        return { type: 'choose', choice: gangstaChoice(state, phase.npc, phase.node, choices) }
      }
      const hurt = hero.hp / hero.stats.maxHp < 0.6
      const order = ['browse', ...(hurt ? ['beef', 'dog'] : []), 'back', 'decline', 'leave']
      const key = order.find((k) => choices.some((c) => c.key === k)) ?? choices[0]?.key
      if (!key) throw new Error(`Dead-end dialogue at ${phase.npc.id}/${phase.node}`)
      return { type: 'choose', choice: key }
    }

    case 'shop': {
      const skill = SHOP_PRIORITY.find(
        (s) => !hero.skills.includes(s) && hero.clout >= SKILLS[s].price,
      )
      return skill ? { type: 'buy', skill } : { type: 'leave' }
    }

    case 'gameOver':
    case 'victory':
      throw new Error('Run is over')
  }
}

export function simulateRun(seed: number, options: SimOptions = {}): RunResult {
  let state = newGame('Bot', seed).state
  // The bot's own dice, separate from the game's, so its choices don't shift game rolls.
  const rng = createRng((seed * 2654435761) >>> 0)
  let actions = 0
  let fights = 0
  let battleRounds = 0
  const cyphers: Record<CypherTier, number> = { flop: 0, decent: 0, fire: 0, legendary: 0 }
  const seenNodes = new Map<string, number>()

  while (state.phase.kind !== 'gameOver' && state.phase.kind !== 'victory') {
    if (actions > 3000) throw new Error(`Run ${seed} never ended`)
    let action = chooseAction(state, rng, options)

    // Bail out of dialogue loops (e.g. a trade the bot can't afford).
    if (state.phase.kind === 'dialogue') {
      const key = `${state.block}:${state.phase.npc.id}:${state.phase.node}`
      const visits = (seenNodes.get(key) ?? 0) + 1
      seenNodes.set(key, visits)
      if (visits > 3) {
        const exit = choicesFor(state, state.phase.npc, state.phase.node).find((c) =>
          ['leave', 'decline', 'back'].includes(c.key),
        )
        if (exit) action = { type: 'choose', choice: exit.key }
      }
    }

    const { state: next, events } = step(state, action)
    options.onStep?.(state, next, events)
    for (const e of events) if (e.type === 'cypher') cyphers[e.tier] += 1
    if (next === state) {
      throw new Error(
        `Bot picked an invalid action ${JSON.stringify(action)} in ${state.phase.kind}`,
      )
    }
    if (state.phase.kind !== 'battle' && next.phase.kind === 'battle') fights += 1
    // Starting a Battle Rap doesn't take a round; answering it does.
    if (state.phase.kind === 'battle' && action.type !== 'battleRap') battleRounds += 1
    state = next
    actions += 1
  }

  return {
    won: state.phase.kind === 'victory',
    blockReached: state.block,
    actions,
    fights,
    battleRounds,
    level: state.hero.level,
    cyphers,
  }
}

export interface BalanceReport {
  runs: number
  winRate: number
  avgActions: number
  avgRoundsPerFight: number
  avgLevel: number
  deathsByBlock: number[]
  /** Battle Rap tiers across all runs. */
  cyphers: Record<CypherTier, number>
}

export function simulate(runs: number, firstSeed = 1, options: SimOptions = {}): BalanceReport {
  const results = Array.from({ length: runs }, (_, i) => simulateRun(firstSeed + i, options))
  const cyphers: Record<CypherTier, number> = { flop: 0, decent: 0, fire: 0, legendary: 0 }
  for (const r of results) {
    for (const tier of Object.keys(cyphers) as CypherTier[]) cyphers[tier] += r.cyphers[tier]
  }
  const deathsByBlock = Array.from({ length: BLOCKS_PER_RUN + 1 }, () => 0)
  for (const r of results) {
    if (!r.won) deathsByBlock[r.blockReached] = (deathsByBlock[r.blockReached] ?? 0) + 1
  }

  const totalFights = results.reduce((s, r) => s + r.fights, 0)
  return {
    runs,
    winRate: results.filter((r) => r.won).length / runs,
    avgActions: results.reduce((s, r) => s + r.actions, 0) / runs,
    avgRoundsPerFight: results.reduce((s, r) => s + r.battleRounds, 0) / Math.max(1, totalFights),
    avgLevel: results.reduce((s, r) => s + r.level, 0) / runs,
    deathsByBlock,
    cyphers,
  }
}
