import { describe, expect, it } from 'vitest'
import { MOVES } from '../src/content/moves'
import { SKILLS } from '../src/content/skills'
import { applyEffects } from '../src/engine/combat/effects'
import { applyStatus, beginTurn, endTurn } from '../src/engine/combat/status'
import {
  canUseMove,
  canUseSkill,
  fightRound,
  fleeRound,
  strikeOpening,
} from '../src/engine/combat/turn'
import { makeCombat, makeEnemy, makeHero, withMoves } from './helpers'

const jab = { type: 'move', move: 'jab' } as const

describe('status lifecycle', () => {
  it('a 1-turn stun skips exactly one turn, then expires', () => {
    const ctx = makeCombat()
    applyStatus(ctx, 'enemy', 'stunned', 1)

    expect(beginTurn(ctx, 'enemy').skip).toBe(true)
    endTurn(ctx, 'enemy')
    expect(ctx.enemy.statuses).toHaveLength(0)
    expect(beginTurn(ctx, 'enemy').skip).toBe(false)
  })

  it('a 2-turn buff applied mid-turn affects the next two turns', () => {
    const ctx = makeCombat()
    applyStatus(ctx, 'hero', 'pumped', 2)
    endTurn(ctx, 'hero') // applied during this turn: shouldn't count down yet
    expect(ctx.hero.statuses).toHaveLength(1)

    beginTurn(ctx, 'hero')
    endTurn(ctx, 'hero')
    expect(ctx.hero.statuses).toHaveLength(1)

    beginTurn(ctx, 'hero')
    endTurn(ctx, 'hero')
    expect(ctx.hero.statuses).toHaveLength(0)
  })

  it('bleeding hurts and vibing heals at the start of each owner turn', () => {
    const ctx = makeCombat(makeHero({ maxHp: 100 }))
    applyStatus(ctx, 'hero', 'bleeding', 2)
    beginTurn(ctx, 'hero')
    const afterBleed = ctx.hero.hp
    expect(afterBleed).toBeLessThan(100)

    ctx.hero.statuses = [{ kind: 'vibing', turns: 2 }]
    beginTurn(ctx, 'hero')
    expect(ctx.hero.hp).toBeGreaterThan(afterBleed)
  })
})

describe('effects', () => {
  it('guarded halves incoming damage', () => {
    const plain = makeCombat(makeHero({ atk: 40, spd: 999 }), makeEnemy({ maxHp: 999, spd: 0 }), 5)
    const guarded = makeCombat(
      makeHero({ atk: 40, spd: 999 }),
      makeEnemy({ maxHp: 999, spd: 0 }),
      5,
    )
    guarded.enemy.statuses = [{ kind: 'guarded', turns: 1 }]

    applyEffects(plain, 'hero', [{ type: 'damage', power: 1 }])
    applyEffects(guarded, 'hero', [{ type: 'damage', power: 1 }])
    const lost = (c: typeof plain) => c.enemy.stats.maxHp - c.enemy.hp
    expect(lost(guarded)).toBe(Math.round(lost(plain) * 0.5))
  })

  it('recoil hurts the user in proportion to damage dealt', () => {
    const ctx = makeCombat(makeHero({ atk: 40, spd: 999 }), makeEnemy({ maxHp: 999, spd: 0 }))
    applyEffects(ctx, 'hero', [
      { type: 'damage', power: 1 },
      { type: 'recoil', pct: 0.5 },
    ])
    expect(ctx.hero.hp).toBeLessThan(ctx.hero.stats.maxHp)
    expect(ctx.events.some((e) => e.type === 'recoil')).toBe(true)
  })

  it('pierce ignores defense', () => {
    const normal = makeCombat(
      makeHero({ atk: 30, spd: 999 }),
      makeEnemy({ maxHp: 999, def: 200, spd: 0 }),
      9,
    )
    const pierce = makeCombat(
      makeHero({ atk: 30, spd: 999 }),
      makeEnemy({ maxHp: 999, def: 200, spd: 0 }),
      9,
    )
    applyEffects(normal, 'hero', [{ type: 'damage', power: 1 }])
    applyEffects(pierce, 'hero', [{ type: 'damage', power: 1, pierce: true }])
    expect(pierce.enemy.hp).toBeLessThan(normal.enemy.hp)
  })

  it('finishers hit harder on a weakened foe', () => {
    const fresh = makeCombat(makeHero({ atk: 20, spd: 999 }), makeEnemy({ maxHp: 1000, spd: 0 }), 4)
    const weak = makeCombat(makeHero({ atk: 20, spd: 999 }), makeEnemy({ maxHp: 1000, spd: 0 }), 4)
    weak.enemy.hp = 300
    const finisher = [{ type: 'damage', power: 1, finisher: { below: 0.4, mult: 2 } }] as const
    const freshDealt = applyEffects(fresh, 'hero', finisher)
    const weakDealt = applyEffects(weak, 'hero', finisher)
    expect(weakDealt).toBeGreaterThan(freshDealt * 1.5)
  })
})

describe('fightRound', () => {
  it('ends when the enemy drops and reports a win', () => {
    const ctx = makeCombat(makeHero({ atk: 500, spd: 100 }), makeEnemy({ maxHp: 5, spd: 0 }))
    let result = fightRound(ctx, jab)
    // Jab can miss (95% accuracy); keep swinging.
    for (let i = 0; i < 5 && result === 'ongoing'; i++) result = fightRound(ctx, jab)
    expect(result).toBe('won')
  })

  it('reports a loss when the hero drops', () => {
    const ctx = makeCombat(makeHero({ maxHp: 1, spd: 0 }), makeEnemy({ atk: 500, spd: 100 }))
    let result = fightRound(ctx, jab)
    for (let i = 0; i < 10 && result === 'ongoing'; i++) result = fightRound(ctx, jab)
    expect(result).toBe('lost')
  })

  it('spends PP and blocks a move once it runs out', () => {
    const hero = makeHero({}, { moves: withMoves('jab', 'beefBreak') })
    const ctx = makeCombat(hero, makeEnemy({ maxHp: 9999, atk: 1 }))
    const pp = MOVES.beefBreak.pp ?? 0
    for (let i = 0; i < pp; i++) fightRound(ctx, { type: 'move', move: 'beefBreak' })
    expect(canUseMove(ctx.hero, 'beefBreak')).toBe(false)
    expect(canUseMove(ctx.hero, 'jab')).toBe(true) // unlimited
  })

  it('priority moves act before a faster enemy', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const hero = makeHero({ spd: 0 }, { moves: withMoves('bobAndWeave') })
      const ctx = makeCombat(hero, makeEnemy({ spd: 999 }), seed)
      fightRound(ctx, { type: 'move', move: 'bobAndWeave' })
      expect(ctx.events[0]).toMatchObject({ type: 'move', user: 'hero' })
    }
  })

  it('dazed fighters sometimes hit themselves', () => {
    let selfHits = 0
    for (let seed = 1; seed <= 60; seed++) {
      const ctx = makeCombat(makeHero(), makeEnemy({ maxHp: 9999 }), seed)
      ctx.hero.statuses = [{ kind: 'dazed', turns: 5 }]
      fightRound(ctx, jab)
      if (ctx.events.some((e) => e.type === 'selfHit')) selfHits++
    }
    expect(selfHits).toBeGreaterThan(5)
    expect(selfHits).toBeLessThan(45)
  })

  it('puts gear on cooldown for exactly `cooldown` rounds', () => {
    const hero = makeHero({ atk: 1 }, { skills: ['taser'] })
    const ctx = makeCombat(hero, makeEnemy({ maxHp: 9999 }))
    fightRound(ctx, { type: 'skill', skill: 'taser' })
    for (let i = 0; i < SKILLS.taser.cooldown; i++) {
      expect(canUseSkill(ctx.hero, 'taser')).toBe(false)
      fightRound(ctx, jab)
    }
    expect(canUseSkill(ctx.hero, 'taser')).toBe(true)
  })

  it("can't use passive or unowned gear", () => {
    const hero = makeHero({}, { skills: ['airpods'] })
    expect(canUseSkill(hero, 'airpods')).toBe(false)
    expect(canUseSkill(hero, 'glock')).toBe(false)
  })
})

describe('fleeRound', () => {
  it('a much faster hero always gets away', () => {
    const ctx = makeCombat(makeHero({ spd: 100 }), makeEnemy({ spd: 0 }))
    expect(fleeRound(ctx)).toBe('fled')
  })
})

describe('strikeOpening', () => {
  it('clears the opening and never instantly kills the hero', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const ctx = makeCombat(makeHero({ maxHp: 70 }), makeEnemy(), seed)
      ctx.battle.opening = ['head']
      strikeOpening(ctx, 'head')
      expect(ctx.battle.opening).toBeNull()
      expect(ctx.hero.hp).toBeGreaterThan(0)
    }
  })

  it('bracing does nothing to either side', () => {
    const ctx = makeCombat()
    ctx.battle.opening = ['legs']
    strikeOpening(ctx, 'brace')
    expect(ctx.hero.hp).toBe(ctx.hero.stats.maxHp)
    expect(ctx.enemy.hp).toBe(ctx.enemy.stats.maxHp)
  })
})
