import { MOVES } from '../src/content/moves'
import type { CombatContext } from '../src/engine/combat/context'
import { createRng } from '../src/engine/rng'
import type { Enemy, GameEvent, Hero, MoveId, RunStats, Stats } from '../src/engine/types'

export function makeHero(stats: Partial<Stats> = {}, extra: Partial<Hero> = {}): Hero {
  const full: Stats = { maxHp: 70, atk: 12, def: 8, spd: 10, crit: 0, ...stats }
  return {
    name: 'Tester',
    level: 1,
    stats: full,
    hp: full.maxHp,
    statuses: [],
    clout: 0,
    moves: withMoves('jab', 'talkTrash'),
    skills: [],
    cooldowns: {},
    ...extra,
  }
}

export const withMoves = (...ids: MoveId[]) => ids.map((id) => ({ id, pp: MOVES[id].pp }))

export function makeEnemy(stats: Partial<Stats> = {}, extra: Partial<Enemy> = {}): Enemy {
  const full: Stats = { maxHp: 30, atk: 8, def: 4, spd: 8, crit: 0, ...stats }
  return {
    name: 'Dummy',
    kind: 'goon',
    stats: full,
    hp: full.maxHp,
    statuses: [],
    cloutReward: 10,
    ...extra,
  }
}

export function emptyRunStats(): RunStats {
  return {
    enemiesDefeated: 0,
    enemiesFled: 0,
    damageDealt: 0,
    damageTaken: 0,
    crits: 0,
    timesFled: 0,
    cloutEarned: 0,
    cloutSpent: 0,
    hotDogsEaten: 0,
    ketchupIncidents: 0,
  }
}

export function makeCombat(
  hero = makeHero(),
  enemy = makeEnemy(),
  seed = 1,
): CombatContext & { events: GameEvent[] } {
  const events: GameEvent[] = []
  const rng = createRng(seed)
  return {
    rng,
    emit: (e) => events.push(e),
    pick: (_key, pool) => rng.pick(pool),
    events,
    run: emptyRunStats(),
    hero,
    enemy,
    battle: {
      enemy,
      round: 0,
      revealed: false,
      opening: null,
      canFlee: true,
      lastMove: null,
      lockedMoves: [],
      lockedGear: [],
      enemyMoveUses: [],
      enemyLastMove: null,
      enemyFled: false,
    },
  }
}
