/** Builds the things the hero runs into: enemies, NPCs, and which one comes next. */

import { BOSS_NAME } from '../content/enemies'
import { MOVES } from '../content/moves'
import { NAMES } from '../content/names'
import {
  BLOCKS_PER_RUN,
  ENEMY_SCALING_PER_BLOCK,
  ENEMY_STATS,
  type EncounterKind,
  encounterWeights,
  enemyWeights,
  LESSON,
  maxMoveTier,
  type Range,
  TRADE,
} from './balance'
import type { Rng } from './rng'
import type {
  BoostableStat,
  Enemy,
  EnemyKind,
  GameState,
  Hero,
  MoveId,
  NpcId,
  NpcInstance,
} from './types'

export type Encounter = EncounterKind | 'boss'

export function rollEncounter(rng: Rng, block: number): Encounter {
  if (block >= BLOCKS_PER_RUN) return 'boss'
  const weights = encounterWeights(block)
  return rng.weighted(
    (Object.keys(weights) as EncounterKind[]).map((kind) => ({
      value: kind,
      weight: weights[kind],
    })),
  )
}

export function rollEnemyKind(rng: Rng, block: number): EnemyKind {
  const weights = enemyWeights(block)
  return rng.weighted(
    (Object.keys(weights) as (keyof typeof weights)[]).map((kind) => ({
      value: kind,
      weight: weights[kind],
    })),
  )
}

export function createEnemy(rng: Rng, kind: EnemyKind, block: number, name: string): Enemy {
  const ranges = ENEMY_STATS[kind]
  // The boss has fixed stats tuned for the end of a run, so it doesn't scale.
  const scale = kind === 'boss' ? 1 : 1 + ENEMY_SCALING_PER_BLOCK * block
  const roll = (range: Range) => Math.round(rng.int(range[0], range[1]) * scale)

  const maxHp = roll(ranges.maxHp)
  return {
    kind,
    name,
    stats: {
      maxHp,
      atk: roll(ranges.atk),
      def: roll(ranges.def),
      spd: roll(ranges.spd),
      crit: ranges.crit,
    },
    hp: maxHp,
    statuses: [],
    cloutReward: roll(ranges.clout),
  }
}

export function createBoss(rng: Rng): Enemy {
  return createEnemy(rng, 'boss', BLOCKS_PER_RUN, BOSS_NAME)
}

/** Picks a name nobody has used yet this run (recycling once the pool runs dry). */
export function takeName(state: GameState, rng: Rng): string {
  const fresh = NAMES.filter((n) => !state.usedNames.includes(n))
  if (fresh.length === 0) state.usedNames = []
  const name = rng.pick(fresh.length > 0 ? fresh : NAMES)
  state.usedNames.push(name)
  return name
}

/** Moves the hero doesn't know yet, up to the given tier. */
export function learnableMoves(hero: Hero, maxTier: number): MoveId[] {
  return (Object.keys(MOVES) as MoveId[]).filter(
    (id) => MOVES[id].tier > 0 && MOVES[id].tier <= maxTier && !hero.moves.some((m) => m.id === id),
  )
}

/** A fresh visit to one of the run's recurring vendors. */
export function createNpc(state: GameState, rng: Rng, id: NpcId): NpcInstance {
  const npc: NpcInstance = { id, name: state.npcNames[id], spent: [] }
  if (id === 'gangsta') {
    // The Gangsta can teach a little ahead of your level.
    const lessons = learnableMoves(state.hero, maxMoveTier(state.hero.level + 2))
    if (lessons.length > 0) {
      npc.lesson = {
        move: rng.pick(lessons),
        price: LESSON.basePrice + state.movesTaught * LESSON.priceStep,
      }
    }
    const stat = rng.pick<BoostableStat>(['maxHp', 'atk', 'def', 'spd'])
    const [min, max] = TRADE.gains[stat]
    npc.offer = {
      stat,
      amount: rng.int(min, max),
      price: TRADE.basePrice + state.tradesMade * TRADE.priceStep,
    }
  }
  return npc
}
