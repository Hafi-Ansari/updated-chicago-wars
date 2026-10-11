/**
 * A simple bot that plays full runs through the public engine API.
 * Used by the balance test; it plays sensibly, not optimally, like a first-time player.
 */

import { MOVES } from '../src/content/moves'
import { SKILLS } from '../src/content/skills'
import { BLOCKS_PER_RUN, HOT_DOG, MAX_MOVES } from '../src/engine/balance'
import { canUseMove, canUseSkill } from '../src/engine/combat/turn'
import { choicesFor } from '../src/engine/dialogue'
import { newGame, step } from '../src/engine/step'
import type {
  Action,
  BattleState,
  GameState,
  Hero,
  MoveId,
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
}

const GEAR_PRIORITY: SkillId[] = ['glock', 'durag', 'taser', 'aviators']
const SHOP_PRIORITY: SkillId[] = ['taser', 'durag', 'glock', 'aviators', 'airpods']

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
  const usable = hero.moves.map((m) => m.id).filter((id) => canUseMove(hero, id))
  const hasStatus = (kind: string) => hero.statuses.some((s) => s.kind === kind)
  const enemyHas = (kind: string) => battle.enemy.statuses.some((s) => s.kind === kind)

  // Set-up moves early in a fight.
  if (battle.round === 0 && usable.includes('hypeUp') && !hasStatus('pumped')) {
    return { type: 'useMove', move: 'hypeUp' }
  }
  if (battle.round <= 1 && usable.includes('talkTrash') && !enemyHas('shook')) {
    return { type: 'useMove', move: 'talkTrash' }
  }
  const gear = GEAR_PRIORITY.find((s) => canUseSkill(hero, s))
  if (gear) return { type: 'useSkill', skill: gear }

  const best = usable.reduce((a, b) =>
    moveValue(b, battle, hero) > moveValue(a, battle, hero) ? b : a,
  )
  return { type: 'useMove', move: best }
}

function chooseAction(state: GameState): Action {
  const { phase, hero } = state
  switch (phase.kind) {
    case 'explore': {
      const visited = (id: 'plug' | 'gangsta' | 'hotDogVendor') => state.visited.includes(id)
      const wantsGear = SHOP_PRIORITY.some(
        (s) => !hero.skills.includes(s) && hero.clout >= SKILLS[s].price,
      )
      if (!visited('plug') && wantsGear) return { type: 'visit', npc: 'plug' }
      if (!visited('gangsta') && hero.clout >= 25) return { type: 'visit', npc: 'gangsta' }
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

    case 'learnMove': {
      const best = phase.offered.reduce((a, b) => (moveValue(b) > moveValue(a) ? b : a))
      if (hero.clout < phase.price) return { type: 'skipLearn' }
      if (hero.moves.length < MAX_MOVES) return { type: 'learnMove', move: best }
      const worst = hero.moves
        .map((m) => m.id)
        .filter((id) => id !== 'jab')
        .reduce((a, b) => (moveValue(b) < moveValue(a) ? b : a))
      return moveValue(best) > moveValue(worst)
        ? { type: 'learnMove', move: best, replace: worst }
        : { type: 'skipLearn' }
    }

    case 'dialogue': {
      const choices = choicesFor(state, phase.npc, phase.node).filter(
        (c) => c.availability === 'available',
      )
      const hurt = hero.hp / hero.stats.maxHp < 0.6
      const lesson = phase.npc.lesson
      const wantsLesson = lesson !== undefined && moveValue(lesson.move) > 0.9
      const order = [
        'story',
        ...(wantsLesson ? ['train', 'learn'] : []),
        'trade',
        'accept',
        'browse',
        ...(hurt ? ['beef', 'dog'] : []),
        'back',
        'decline',
        'leave',
      ]
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

export function simulateRun(seed: number): RunResult {
  let state = newGame('Bot', seed).state
  let actions = 0
  let fights = 0
  let battleRounds = 0
  const seenNodes = new Map<string, number>()

  while (state.phase.kind !== 'gameOver' && state.phase.kind !== 'victory') {
    if (actions > 3000) throw new Error(`Run ${seed} never ended`)
    let action = chooseAction(state)

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

    const next = step(state, action).state
    if (next === state) {
      throw new Error(
        `Bot picked an invalid action ${JSON.stringify(action)} in ${state.phase.kind}`,
      )
    }
    if (state.phase.kind !== 'battle' && next.phase.kind === 'battle') fights += 1
    if (state.phase.kind === 'battle') battleRounds += 1
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
  }
}

export interface BalanceReport {
  runs: number
  winRate: number
  avgActions: number
  avgRoundsPerFight: number
  avgLevel: number
  deathsByBlock: number[]
}

export function simulate(runs: number, firstSeed = 1): BalanceReport {
  const results = Array.from({ length: runs }, (_, i) => simulateRun(firstSeed + i))
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
  }
}
