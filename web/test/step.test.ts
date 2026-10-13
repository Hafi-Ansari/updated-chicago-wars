import { describe, expect, it } from 'vitest'
import { ENEMIES } from '../src/content/enemies'
import { SKILLS } from '../src/content/skills'
import { MAX_MOVES, RALLY, TRAINING, trainingPrice } from '../src/engine/balance'
import { choicesFor } from '../src/engine/dialogue'
import { teachableMoves } from '../src/engine/encounters'
import { pickFresh } from '../src/engine/lines'
import { createRng } from '../src/engine/rng'
import { migrateSave, SAVE_VERSION } from '../src/engine/save'
import { newGame, step } from '../src/engine/step'
import type { GameState } from '../src/engine/types'
import { withMoves } from './helpers'

const jab = { type: 'useMove', move: 'jab' } as const

/** Walks from a fresh game until a fight starts (seeded, so deterministic). */
function firstBattle(seed = 1): GameState {
  for (let s = seed; s < seed + 200; s++) {
    let state = newGame('Tester', s).state
    for (let i = 0; i < 4 && state.phase.kind === 'explore'; i++) {
      state = step(state, { type: 'walk' }).state
    }
    if (state.phase.kind === 'battle') return state
  }
  throw new Error('never reached a battle')
}

/** Fights with overwhelming stats until the battle ends. */
function winBattle(state: GameState): GameState {
  let s: GameState = {
    ...state,
    hero: { ...state.hero, stats: { ...state.hero.stats, atk: 999, spd: 999 } },
  }
  for (let i = 0; i < 30 && s.phase.kind === 'battle'; i++) {
    const action =
      s.phase.battle.opening !== null ? ({ type: 'strike', target: 'brace' } as const) : jab
    s = step(s, action).state
  }
  return s
}

describe('newGame', () => {
  it('starts exploring with starting moves, named vendors and a default name', () => {
    const { state, events } = newGame('   ', 1)
    expect(state.phase.kind).toBe('explore')
    expect(state.hero.name).toBe('Lil Debug')
    expect(state.hero.moves.map((m) => m.id)).toEqual(['jab', 'talkTrash'])
    expect(state.npcNames.plug).not.toBe('')
    expect(new Set(Object.values(state.npcNames)).size).toBe(3)
    expect(events.length).toBeGreaterThan(0)
  })
})

describe('step', () => {
  it('is deterministic', () => {
    const run = () => {
      let state = newGame('Tester', 77).state
      const all = []
      for (let i = 0; i < 8; i++) {
        const action = state.phase.kind === 'battle' ? jab : ({ type: 'walk' } as const)
        const r = step(state, action)
        state = r.state
        all.push(...r.events)
      }
      return all
    }
    expect(run()).toEqual(run())
  })

  it('ignores invalid actions and returns the same object', () => {
    const { state } = newGame('Tester', 1)
    const result = step(state, jab)
    expect(result.state).toBe(state)
    expect(result.events).toEqual([])
  })

  it('walking never lands on a vendor: only fights and street events', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const after = step(newGame('Tester', seed).state, { type: 'walk' }).state
      expect(['battle', 'explore']).toContain(after.phase.kind)
    }
  })

  it('does not mutate the previous state', () => {
    const battle = firstBattle()
    const snapshot = JSON.stringify(battle)
    step(battle, jab)
    expect(JSON.stringify(battle)).toBe(snapshot)
  })

  it('winning awards clout, refills PP and offers new moves', () => {
    const before = firstBattle()
    const after = winBattle(before)
    expect(after.phase.kind).toBe('learnMove')
    expect(after.hero.clout).toBeGreaterThan(before.hero.clout)
    expect(after.hero.moves.every((m) => m.pp === null || m.pp > 0)).toBe(true)
  })

  it('the last three blocks are always the Jester, Rodney, then King Durkio, no running', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const start = newGame('Tester', seed).state
      const expected = { 11: 'jester', 12: 'queen', 13: 'boss' } as const
      for (const [block, kind] of Object.entries(expected)) {
        const { state, events } = step({ ...start, block: Number(block) - 1 }, { type: 'walk' })
        if (state.phase.kind !== 'battle') throw new Error(`no fight at block ${block}`)
        const { enemy, canFlee } = state.phase.battle
        expect(enemy.kind).toBe(kind)
        expect(enemy.name).toBe(ENEMIES[kind].name)
        expect(canFlee).toBe(false)
        // The entrance plays before they show up.
        const entrance = events.findIndex((e) => e.type === 'narrate' && e.tone === 'danger')
        expect(entrance).toBeLessThan(events.findIndex((e) => e.type === 'appear'))
        expect(step(state, { type: 'flee' }).state).toBe(state)
      }
    }
  })

  it('beating the Jester or Rodney keeps the run going; beating the King wins it', () => {
    const fightAt = (block: number) => {
      const start = newGame('Tester', 4).state
      const walked = step({ ...start, block: block - 1 }, { type: 'walk' }).state
      return winBattle(walked)
    }
    expect(fightAt(11).phase.kind).not.toBe('victory')
    expect(fightAt(11).block).toBe(11)
    expect(fightAt(12).phase.kind).not.toBe('victory')
    expect(fightAt(13).phase.kind).toBe('victory')
  })

  it('only late-game battles come with an enemy rally', () => {
    const battleAt = (block: number) => {
      for (let seed = 1; seed < 200; seed++) {
        const start = newGame('Tester', seed).state
        const next = step({ ...start, block }, { type: 'walk' }).state
        if (next.phase.kind === 'battle') return next.phase.battle
      }
      throw new Error('never reached a battle')
    }
    expect(battleAt(RALLY.fromBlock - 2).enemyRally).toBe(false)
    expect(battleAt(RALLY.fromBlock - 1).enemyRally).toBe(true)
  })

  it('an enemy running off pays out exactly like a win', () => {
    const start = firstBattle()
    if (start.phase.kind !== 'battle') throw new Error('expected battle')
    const enemy = {
      ...start.phase.battle.enemy,
      kind: 'goon' as const,
      stats: { ...start.phase.battle.enemy.stats, maxHp: 100, atk: 1 },
      hp: 15,
    }
    let state: GameState = {
      ...start,
      hero: { ...start.hero, stats: { ...start.hero.stats, atk: 1, def: 999 } },
      phase: { kind: 'battle', battle: { ...start.phase.battle, enemy } },
    }
    const events = []
    for (let i = 0; i < 20 && state.phase.kind === 'battle'; i++) {
      const action =
        state.phase.battle.opening !== null ? ({ type: 'strike', target: 'brace' } as const) : jab
      const result = step(state, action)
      events.push(...result.events)
      state = result.state
    }
    expect(state.phase.kind).not.toBe('battle')
    expect(events).toContainEqual({ type: 'fled', target: 'enemy' })
    expect(events.some((e) => e.type === 'faint')).toBe(false)
    expect(state.stats).toMatchObject({ enemiesDefeated: 1, enemiesFled: 1 })
    expect(state.hero.clout).toBe(start.hero.clout + enemy.cloutReward)
  })

  it('win offers show moves the hero has never seen first, and remember them', () => {
    const before = firstBattle()
    const seen = ['jab', 'talkTrash', 'twoPiece', 'haymaker', 'bobAndWeave'] as const
    const after = winBattle({ ...before, seenMoves: [...seen] })
    if (after.phase.kind !== 'learnMove') throw new Error('expected learnMove')
    for (const id of after.phase.offered) expect(seen).not.toContain(id)
    for (const id of after.phase.offered) expect(after.seenMoves).toContain(id)
  })
})

describe('vendors', () => {
  it('each vendor can be visited once per block', () => {
    let state = newGame('Tester', 3).state
    state = step(state, { type: 'visit', npc: 'plug' }).state
    expect(state.phase.kind).toBe('dialogue')
    state = step(state, { type: 'choose', choice: 'leave' }).state
    expect(state.phase.kind).toBe('explore')
    // Same block: refused.
    expect(step(state, { type: 'visit', npc: 'plug' }).state).toBe(state)
  })

  it('the plug shop sells gear for clout, once each', () => {
    let state = newGame('Tester', 3).state
    state = step(state, { type: 'visit', npc: 'plug' }).state
    state = step(state, { type: 'choose', choice: 'browse' }).state
    expect(state.phase.kind).toBe('shop')

    state = { ...state, hero: { ...state.hero, clout: 100 } }
    const bought = step(state, { type: 'buy', skill: 'taser' }).state
    expect(bought.hero.skills).toContain('taser')
    expect(bought.hero.clout).toBe(100 - SKILLS.taser.price)
    expect(step(bought, { type: 'buy', skill: 'taser' }).state).toBe(bought)
  })

  it("the gangsta's playbook is locked until a move is passed on or forgotten", () => {
    let state = newGame('Tester', 5).state
    state = step(state, { type: 'visit', npc: 'gangsta' }).state
    if (state.phase.kind !== 'dialogue') throw new Error('expected dialogue')
    const train = choicesFor(state, state.phase.npc, state.phase.node).find(
      (c) => c.key === 'train',
    )
    expect(train?.availability).toBe('locked')
    expect(step(state, { type: 'choose', choice: 'train' }).state).toBe(state)
  })

  it('the gangsta reteaches passed-on and forgotten moves for free, then keeps talking', () => {
    let state = newGame('Tester', 5).state
    state = {
      ...state,
      hero: { ...state.hero, clout: 7, moves: withMoves('jab', 'haymaker') },
      // Offered uppercut after a win and passed; forgot Talk Trash to make room for Haymaker.
      seenMoves: ['jab', 'talkTrash', 'haymaker', 'uppercut'],
    }
    state = step(state, { type: 'visit', npc: 'gangsta' }).state
    state = step(state, { type: 'choose', choice: 'train' }).state
    expect(state.phase).toMatchObject({ kind: 'learnMove', offered: ['talkTrash', 'uppercut'] })

    state = step(state, { type: 'learnMove', move: 'uppercut' }).state
    expect(state.hero.moves.map((m) => m.id)).toEqual(['jab', 'haymaker', 'uppercut'])
    expect(state.hero.clout).toBe(7)
    expect(state.phase).toMatchObject({ kind: 'dialogue', node: 'taught' })

    // Skipping goes back to the menu, not out to the street.
    state = step(state, { type: 'choose', choice: 'train' }).state
    expect(state.phase).toMatchObject({ kind: 'learnMove', offered: ['talkTrash'] })
    state = step(state, { type: 'skipLearn' }).state
    expect(state.phase).toMatchObject({ kind: 'dialogue', node: 'menu' })
  })

  it('a full moveset forgets one to relearn, and the forgotten move goes in the playbook', () => {
    let state = newGame('Tester', 5).state
    const six = withMoves('jab', 'talkTrash', 'haymaker', 'twoPiece', 'uppercut', 'bodegaCat')
    state = {
      ...state,
      hero: { ...state.hero, moves: six },
      seenMoves: [...six.map((m) => m.id), 'hypeUp'],
    }
    state = step(state, { type: 'visit', npc: 'gangsta' }).state
    state = step(state, { type: 'choose', choice: 'train' }).state
    expect(step(state, { type: 'learnMove', move: 'hypeUp' }).state).toBe(state)
    state = step(state, { type: 'learnMove', move: 'hypeUp', replace: 'haymaker' }).state
    expect(state.hero.moves).toHaveLength(MAX_MOVES)
    expect(teachableMoves(state)).toEqual(['haymaker'])
  })

  it('the gangsta runs one training session per visit, and each one raises prices', () => {
    let state = newGame('Tester', 5).state
    state = { ...state, hero: { ...state.hero, clout: 200 } }
    state = step(state, { type: 'visit', npc: 'gangsta' }).state
    state = step(state, { type: 'choose', choice: 'trade' }).state
    expect(state.phase).toMatchObject({ kind: 'dialogue', node: 'training' })
    if (state.phase.kind !== 'dialogue') throw new Error('expected dialogue')
    const stats = choicesFor(state, state.phase.npc, state.phase.node).filter((c) =>
      c.key.startsWith('stat-'),
    )
    expect(stats.map((c) => c.key)).toEqual([
      'stat-maxHp',
      'stat-atk',
      'stat-def',
      'stat-spd',
      'stat-crit',
    ])
    expect(stats.find((c) => c.key === 'stat-crit')?.label).toBe('+5% Crit chance')

    const before = state.hero
    state = step(state, { type: 'choose', choice: 'stat-maxHp' }).state
    expect(state.hero.stats.maxHp).toBe(before.stats.maxHp + TRAINING.gains.maxHp)
    expect(state.hero.hp).toBe(before.hp + TRAINING.gains.maxHp)
    expect(state.hero.clout).toBe(200 - trainingPrice('maxHp', 0))
    expect(state.tradesMade).toBe(1)

    // Back at the menu, training is locked until the next visit.
    if (state.phase.kind !== 'dialogue') throw new Error('expected dialogue')
    const trade = choicesFor(state, state.phase.npc, state.phase.node).find(
      (c) => c.key === 'trade',
    )
    expect(trade).toMatchObject({ availability: 'locked', hint: 'one session per visit' })
    expect(step(state, { type: 'choose', choice: 'trade' }).state).toBe(state)

    // Next block, a new visit, and every price went up.
    state = step(state, { type: 'choose', choice: 'leave' }).state
    state = { ...state, visited: [] }
    state = step(state, { type: 'visit', npc: 'gangsta' }).state
    state = step(state, { type: 'choose', choice: 'trade' }).state
    if (state.phase.kind !== 'dialogue') throw new Error('expected dialogue')
    const atk = choicesFor(state, state.phase.npc, state.phase.node).find(
      (c) => c.key === 'stat-atk',
    )
    expect(atk?.note).toBe(`${trainingPrice('atk', 1)} clout`)
    expect(trainingPrice('atk', 1)).toBeGreaterThan(trainingPrice('atk', 0))
  })

  it("training you can't afford is locked and shows its price", () => {
    let state = newGame('Tester', 5).state
    state = { ...state, hero: { ...state.hero, clout: 0 } }
    state = step(state, { type: 'visit', npc: 'gangsta' }).state
    state = step(state, { type: 'choose', choice: 'trade' }).state
    if (state.phase.kind !== 'dialogue') throw new Error('expected dialogue')
    const crit = choicesFor(state, state.phase.npc, state.phase.node).find(
      (c) => c.key === 'stat-crit',
    )
    expect(crit).toMatchObject({
      availability: 'locked',
      hint: `${trainingPrice('crit', 0)} clout`,
    })
    expect(step(state, { type: 'choose', choice: 'stat-crit' }).state).toBe(state)
  })

  it('learning a seventh move requires forgetting one, and never Jab', () => {
    let state = newGame('Tester', 5).state
    state = {
      ...state,
      hero: {
        ...state.hero,
        moves: withMoves('jab', 'talkTrash', 'haymaker', 'twoPiece', 'uppercut', 'bodegaCat'),
      },
      phase: { kind: 'learnMove', offered: ['hypeUp'] },
    }
    expect(step(state, { type: 'learnMove', move: 'hypeUp' }).state).toBe(state)
    expect(step(state, { type: 'learnMove', move: 'hypeUp', replace: 'jab' }).state).toBe(state)
    const learned = step(state, { type: 'learnMove', move: 'hypeUp', replace: 'haymaker' }).state
    expect(learned.hero.moves.map((m) => m.id)).toEqual([
      'jab',
      'talkTrash',
      'hypeUp',
      'twoPiece',
      'uppercut',
      'bodegaCat',
    ])
    expect(learned.hero.moves).toHaveLength(MAX_MOVES)
  })

  it('passive gear permanently boosts stats', () => {
    let state = newGame('Tester', 3).state
    state = step(state, { type: 'visit', npc: 'plug' }).state
    state = step(state, { type: 'choose', choice: 'browse' }).state
    state = { ...state, hero: { ...state.hero, clout: 100 } }
    const before = state.hero.stats
    const after = step(state, { type: 'buy', skill: 'pufferJacket' }).state.hero.stats
    expect(after.def).toBe(before.def + (SKILLS.pufferJacket.bonus?.def ?? 0))
    expect(after.maxHp).toBe(before.maxHp + (SKILLS.pufferJacket.bonus?.maxHp ?? 0))
  })

  it('dialogue hides one-time choices after use', () => {
    let state = newGame('Tester', 5).state
    state = step(state, { type: 'visit', npc: 'gangsta' }).state
    state = step(state, { type: 'choose', choice: 'story' }).state
    state = step(state, { type: 'choose', choice: 'back' }).state
    if (state.phase.kind !== 'dialogue') throw new Error('expected dialogue')
    const keys = choicesFor(state, state.phase.npc, state.phase.node).map((c) => c.key)
    expect(keys).not.toContain('story')
  })

  it('leaving says a farewell bar', () => {
    let state = newGame('Tester', 3).state
    state = step(state, { type: 'visit', npc: 'hotDogVendor' }).state
    const { events } = step(state, { type: 'choose', choice: 'leave' })
    expect(events.some((e) => e.type === 'say' && e.side === 'npc')).toBe(true)
  })
})

describe('pickFresh', () => {
  it('never repeats a line until most of the pool has been used', () => {
    const state = newGame('Tester', 1).state
    const rng = createRng(9)
    const pool = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    const picks = Array.from({ length: 60 }, () => pickFresh(state, rng, 'test', pool))
    for (let i = 1; i < picks.length; i++) {
      const window = picks.slice(Math.max(0, i - 6), i)
      expect(window).not.toContain(picks[i])
    }
  })
})

describe('saves', () => {
  it('migrates a v2 save mid-conversation with the old Gangsta', () => {
    const current = newGame('Tester', 5).state
    const { seenMoves: _, ...rest } = current
    const v2 = {
      ...rest,
      version: 2,
      movesTaught: 1,
      phase: {
        kind: 'dialogue',
        node: 'offer',
        npc: {
          id: 'gangsta',
          name: 'Big Mike',
          spent: [],
          offer: { stat: 'atk', amount: 3, price: 15 },
        },
      },
    }
    const migrated = migrateSave(JSON.parse(JSON.stringify(v2)))
    expect(migrated?.version).toBe(SAVE_VERSION)
    expect(migrated?.seenMoves).toEqual(['jab', 'talkTrash'])
    expect(migrated?.phase).toEqual({
      kind: 'dialogue',
      node: 'menu',
      npc: { id: 'gangsta', name: 'Big Mike', spent: [] },
    })
    // And it plays on from there.
    if (!migrated) return
    expect(step(migrated, { type: 'choose', choice: 'leave' }).state.phase.kind).toBe('explore')
  })

  it('migrates a v2 save made mid-battle and plays on', () => {
    const battle = firstBattle()
    if (battle.phase.kind !== 'battle') throw new Error('expected battle')
    const { lastMove, lockedMoves, lockedGear, enemyMoveUses, ...oldBattle } = battle.phase.battle
    const { seenMoves: _, ...rest } = battle
    const v2 = { ...rest, version: 2, movesTaught: 0, phase: { kind: 'battle', battle: oldBattle } }
    const migrated = migrateSave(JSON.parse(JSON.stringify(v2)))
    expect(migrated?.phase).toEqual(battle.phase)
    if (!migrated) return
    expect(step(migrated, jab).state).not.toBe(migrated)
  })

  it('loads current saves as-is and rejects junk', () => {
    const state = newGame('Tester', 5).state
    expect(migrateSave(JSON.parse(JSON.stringify(state)))).toEqual(state)
    expect(migrateSave(null)).toBeNull()
    expect(migrateSave({ version: 1 })).toBeNull()
    expect(migrateSave('nope')).toBeNull()
  })
})
