import { describe, expect, it } from 'vitest'
import { SKILLS } from '../src/content/skills'
import { MAX_MOVES } from '../src/engine/balance'
import { choicesFor } from '../src/engine/dialogue'
import { pickFresh } from '../src/engine/lines'
import { createRng } from '../src/engine/rng'
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

  it('the gangsta teaches a move for clout', () => {
    let state = newGame('Tester', 5).state
    state = { ...state, hero: { ...state.hero, clout: 500 } }
    state = step(state, { type: 'visit', npc: 'gangsta' }).state
    if (state.phase.kind !== 'dialogue') throw new Error('expected dialogue')
    const lesson = state.phase.npc.lesson
    expect(lesson).toBeDefined()
    if (!lesson) return

    state = step(state, { type: 'choose', choice: 'train' }).state
    state = step(state, { type: 'choose', choice: 'learn' }).state
    expect(state.phase).toMatchObject({ kind: 'learnMove', offered: [lesson.move] })

    state = step(state, { type: 'learnMove', move: lesson.move }).state
    expect(state.hero.moves.map((m) => m.id)).toContain(lesson.move)
    expect(state.hero.clout).toBe(500 - lesson.price)
  })

  it('learning a seventh move requires forgetting one, and never Jab', () => {
    let state = newGame('Tester', 5).state
    state = {
      ...state,
      hero: {
        ...state.hero,
        moves: withMoves('jab', 'talkTrash', 'haymaker', 'twoPiece', 'uppercut', 'bodegaCat'),
      },
      phase: { kind: 'learnMove', offered: ['hypeUp'], price: 0 },
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
