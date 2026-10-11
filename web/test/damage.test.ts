import { describe, expect, it } from 'vitest'
import { DEFENSE_K, DODGE, MIN_DAMAGE } from '../src/engine/balance'
import {
  applyDamage,
  applyHeal,
  dodgeChance,
  mitigation,
  percentDamage,
  rollAttack,
} from '../src/engine/combat/damage'
import { effectiveStats } from '../src/engine/combat/stats'
import { createRng } from '../src/engine/rng'
import { makeEnemy, makeHero } from './helpers'

describe('mitigation', () => {
  it('has diminishing returns and never blocks everything', () => {
    expect(mitigation(0)).toBe(1)
    expect(mitigation(DEFENSE_K)).toBeCloseTo(0.5)
    expect(mitigation(10_000)).toBeGreaterThan(0)
    expect(mitigation(DEFENSE_K / 2)).toBeGreaterThan(mitigation(DEFENSE_K))
  })
})

describe('rollAttack', () => {
  it('never deals less than the minimum, even into huge defense', () => {
    const rng = createRng(11)
    const weakling = makeHero({ atk: 1 })
    const tank = makeEnemy({ def: 9999 })
    for (let i = 0; i < 500; i++) {
      const roll = rollAttack(rng, weakling, tank)
      if (!roll.dodged) expect(roll.damage).toBeGreaterThanOrEqual(MIN_DAMAGE)
    }
  })

  it('stays within the variance band around the expected value', () => {
    const rng = createRng(12)
    const hero = makeHero({ atk: 20, spd: 100 })
    const enemy = makeEnemy({ def: 0, spd: 0 })
    for (let i = 0; i < 500; i++) {
      const roll = rollAttack(rng, hero, enemy)
      if (!roll.dodged) {
        expect(roll.damage).toBeGreaterThanOrEqual(17)
        expect(roll.damage).toBeLessThanOrEqual(23)
      }
    }
  })

  it('crits multiply damage', () => {
    const rng = createRng(13)
    const critter = makeHero({ atk: 20, crit: 1, spd: 100 })
    const roll = rollAttack(rng, critter, makeEnemy({ def: 0, spd: 0 }))
    expect(roll.dodged).toBe(false)
    if (!roll.dodged) {
      expect(roll.crit).toBe(true)
      expect(roll.damage).toBeGreaterThanOrEqual(26)
    }
  })
})

describe('dodgeChance', () => {
  it('is clamped between min and max', () => {
    const slow = makeHero({ spd: 0 }).stats
    const fast = makeHero({ spd: 1000 }).stats
    expect(dodgeChance(fast, slow)).toBe(DODGE.min)
    expect(dodgeChance(slow, fast)).toBe(DODGE.max)
  })
})

describe('HP changes', () => {
  it('clamps damage at 0 and healing at max HP', () => {
    const hero = makeHero({ maxHp: 50 })
    expect(applyDamage(hero, 80)).toBe(0)
    expect(applyHeal(hero, 20)).toBe(20)
    expect(applyHeal(hero, 1000)).toBe(30)
    expect(hero.hp).toBe(50)
  })

  it('ignores negative amounts (no accidental healing via damage)', () => {
    const hero = makeHero({ maxHp: 50 })
    hero.hp = 25
    applyDamage(hero, -10)
    expect(hero.hp).toBe(25)
  })

  it('percentDamage respects its cap', () => {
    expect(percentDamage(makeEnemy({ maxHp: 1000 }), 0.2, 30)).toBe(30)
    expect(percentDamage(makeEnemy({ maxHp: 50 }), 0.2, 30)).toBe(10)
  })
})

describe('effectiveStats', () => {
  it('applies pumped and shook', () => {
    const c = makeHero({ atk: 20, def: 10 })
    c.statuses = [
      { kind: 'pumped', turns: 1 },
      { kind: 'shook', turns: 1 },
    ]
    const s = effectiveStats(c)
    expect(s.atk).toBeGreaterThan(20)
    expect(s.def).toBeLessThan(10)
  })
})
