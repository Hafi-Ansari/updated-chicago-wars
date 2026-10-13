import { describe, expect, it } from 'vitest'
import { ENEMIES, RALLY_LINES } from '../src/content/enemies'
import { MOVES } from '../src/content/moves'
import { OPENING_SCENARIOS, OPENINGS } from '../src/content/openings'
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
import { fill } from '../src/engine/text'
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

  it("a dodged attack doesn't land its status rider (a missed shank doesn't bleed)", () => {
    const shank = ENEMIES.thug.moves[0]
    expect(shank?.effects).toContainEqual(expect.objectContaining({ status: 'bleeding' }))
    const effects = [
      { type: 'damage', power: 1 },
      { type: 'status', target: 'foe', status: 'bleeding', turns: 2 },
      { type: 'status', target: 'self', status: 'pumped', turns: 2 },
    ] as const
    let dodges = 0
    for (let seed = 1; seed <= 200; seed++) {
      // A fast hero dodges the enemy's swing as often as the cap allows.
      const ctx = makeCombat(makeHero({ spd: 999 }), makeEnemy({ maxHp: 999 }), seed)
      applyEffects(ctx, 'enemy', effects)
      const dodged = ctx.events.some((e) => e.type === 'miss')
      if (dodged) dodges += 1
      expect(ctx.hero.statuses.some((s) => s.kind === 'bleeding')).toBe(!dodged)
      // Effects on the attacker itself still happen either way.
      expect(ctx.enemy.statuses.some((s) => s.kind === 'pumped')).toBe(true)
    }
    expect(dodges).toBeGreaterThan(10)
  })

  it('status-only moves still apply without an attack roll', () => {
    const ctx = makeCombat()
    applyEffects(ctx, 'hero', MOVES.talkTrash.effects)
    expect(ctx.enemy.statuses.map((s) => s.kind)).toEqual(['shook'])
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

describe('openings', () => {
  it("plays a scenario intro and offers only that scenario's body parts", () => {
    let seen = 0
    for (let seed = 1; seed <= 80; seed++) {
      const ctx = makeCombat(makeHero(), makeEnemy({ maxHp: 9999, atk: 1 }), seed)
      fightRound(ctx, jab)
      const offered = ctx.battle.opening
      if (!offered) continue
      seen++
      const narrated = ctx.events.flatMap((e) => (e.type === 'narrate' ? [e.text] : []))
      const scenario = OPENING_SCENARIOS.find((s) =>
        narrated.includes(fill(s.intro[0] ?? '', { enemy: ctx.enemy.name })),
      )
      expect(scenario).toBeDefined()
      for (const target of offered) expect(scenario?.targets).toContain(target)
    }
    expect(seen).toBeGreaterThan(10)
  })

  it('knees hobble and arms weaken', () => {
    const knees = makeCombat(makeHero({ spd: 999 }), makeEnemy({ maxHp: 9999 }), 2)
    applyEffects(knees, 'hero', OPENINGS.knees.outcomes[0]?.effects ?? [])
    expect(knees.enemy.statuses.map((s) => s.kind)).toContain('hobbled')

    const arms = makeCombat(makeHero({ spd: 999 }), makeEnemy({ maxHp: 9999 }), 2)
    applyEffects(arms, 'hero', OPENINGS.arms.outcomes[0]?.effects ?? [])
    expect(arms.enemy.statuses.map((s) => s.kind)).toContain('weakened')
  })
})

describe('enemy disruption', () => {
  const lockMove = [{ type: 'lockMove' }] as const
  const lockGear = [{ type: 'lockGear' }] as const

  it('locks the move the hero used last (never Jab) for the rest of the fight', () => {
    const hero = makeHero({}, { moves: withMoves('jab', 'haymaker', 'uppercut') })
    const ctx = makeCombat(hero, makeEnemy({ maxHp: 999 }))
    fightRound(ctx, { type: 'move', move: 'uppercut' })
    applyEffects(ctx, 'enemy', lockMove)
    expect(ctx.battle.lockedMoves).toEqual(['uppercut'])
    expect(canUseMove(ctx.hero, 'uppercut', ctx.battle)).toBe(false)
    expect(canUseMove(ctx.hero, 'uppercut')).toBe(true)
    expect(ctx.events).toContainEqual({ type: 'locked', what: 'move', move: 'uppercut' })

    // Jab can't be locked: after Haymaker goes too, nothing is left to take.
    ctx.battle.lastMove = 'jab'
    applyEffects(ctx, 'enemy', lockMove)
    applyEffects(ctx, 'enemy', lockMove)
    expect(ctx.battle.lockedMoves.sort()).toEqual(['haymaker', 'uppercut'])
    expect(canUseMove(ctx.hero, 'jab', ctx.battle)).toBe(true)
  })

  it('takes one active gear item, never passive gear', () => {
    const hero = makeHero({}, { skills: ['airpods', 'taser'] })
    const ctx = makeCombat(hero)
    applyEffects(ctx, 'enemy', lockGear)
    expect(ctx.battle.lockedGear).toEqual(['taser'])
    expect(canUseSkill(ctx.hero, 'taser', ctx.battle)).toBe(false)
    applyEffects(ctx, 'enemy', lockGear)
    expect(ctx.battle.lockedGear).toEqual(['taser'])
  })

  it('a dodged pat-down takes nothing', () => {
    const shakedown = [{ type: 'damage', power: 1 }, { type: 'lockGear' }] as const
    for (let seed = 1; seed <= 100; seed++) {
      const ctx = makeCombat(makeHero({ spd: 999 }, { skills: ['taser'] }), makeEnemy(), seed)
      applyEffects(ctx, 'enemy', shakedown)
      const dodged = ctx.events.some((e) => e.type === 'miss')
      expect(ctx.battle.lockedGear.length).toBe(dodged ? 0 : 1)
    }
  })

  it('stolen clout rides on the enemy and comes back with the win', () => {
    const ctx = makeCombat(makeHero({}, { clout: 20 }), makeEnemy({}, { cloutReward: 10 }))
    applyEffects(ctx, 'enemy', [{ type: 'stealClout', min: 8, max: 8 }])
    expect(ctx.hero.clout).toBe(12)
    expect(ctx.enemy.cloutReward).toBe(18)
    applyEffects(ctx, 'enemy', [{ type: 'stealClout', min: 50, max: 50 }])
    expect(ctx.hero.clout).toBe(0)
  })

  it('drain heals the user by a share of the damage it just dealt, and nothing on a miss', () => {
    let checked = 0
    for (let seed = 1; seed <= 40; seed++) {
      const ctx = makeCombat(makeHero(), makeEnemy({ maxHp: 100, atk: 30 }), seed)
      ctx.enemy.hp = 50
      applyEffects(ctx, 'enemy', [
        { type: 'damage', power: 1 },
        { type: 'drain', pct: 0.5 },
      ])
      const hit = ctx.events.find((e) => e.type === 'hit')
      const heal = ctx.events.find((e) => e.type === 'heal')
      if (hit?.type === 'hit') {
        expect(heal).toMatchObject({ target: 'enemy', amount: Math.round(hit.damage / 2) })
        checked++
      } else {
        expect(heal).toBeUndefined()
      }
    }
    expect(checked).toBeGreaterThan(20)
  })

  it('blinded heroes miss attacks far more often, but self-buffs never miss', () => {
    const misses = (blinded: boolean, move: 'jab' | 'hypeUp') => {
      let count = 0
      for (let seed = 1; seed <= 400; seed++) {
        const hero = makeHero({ spd: 999 }, { moves: withMoves('jab', 'hypeUp') })
        const ctx = makeCombat(hero, makeEnemy({ maxHp: 9999, spd: 0 }), seed)
        if (blinded) ctx.hero.statuses = [{ kind: 'blinded', turns: 3 }]
        fightRound(ctx, { type: 'move', move })
        if (ctx.events.some((e) => e.type === 'miss' && e.attacker === 'hero')) count++
      }
      return count / 400
    }
    expect(misses(false, 'jab')).toBeLessThan(0.15)
    expect(misses(true, 'jab')).toBeGreaterThan(0.3)
    expect(misses(true, 'hypeUp')).toBe(0)
  })

  it('heals only when low, at most twice a fight', () => {
    const tea = ENEMIES.gangRapper.moves.findIndex((m) => m.whenBelow !== undefined)
    expect(ENEMIES.gangRapper.moves[tea]).toMatchObject({ maxUses: 2 })
    const enemy = makeEnemy({ maxHp: 100, atk: 1 }, { kind: 'gangRapper' })
    const ctx = makeCombat(makeHero({ maxHp: 9999, atk: 1, def: 999 }), enemy, 3)

    for (let i = 0; i < 20; i++) fightRound(ctx, jab)
    expect(ctx.battle.enemyMoveUses).not.toContain(tea) // healthy: never heals

    for (let i = 0; i < 60; i++) {
      ctx.enemy.hp = 20
      fightRound(ctx, jab)
    }
    expect(ctx.battle.enemyMoveUses.filter((i) => i === tea)).toHaveLength(2)
  })

  it("never wastes a turn trying to take gear the hero doesn't have", () => {
    const enemy = makeEnemy({ maxHp: 9999, atk: 1 }, { kind: 'gangLeader' })
    const ctx = makeCombat(makeHero({ maxHp: 9999, def: 999 }), enemy, 4)
    for (let i = 0; i < 80; i++) fightRound(ctx, jab)
    expect(ctx.events.some((e) => e.type === 'narrate' && e.text.includes('pats you down'))).toBe(
      false,
    )
  })
})

describe('enemies running', () => {
  const lowGoon = (hp: number, seed: number) => {
    const enemy = makeEnemy({ maxHp: 100, atk: 1 }, { kind: 'goon' })
    enemy.hp = hp
    return makeCombat(makeHero({ atk: 1, def: 999, maxHp: 9999 }), enemy, seed)
  }

  it('early enemies sometimes run once below 20% HP, which ends the fight as a win', () => {
    let ran = 0
    for (let seed = 1; seed <= 60; seed++) {
      const ctx = lowGoon(19, seed)
      const result = fightRound(ctx, jab)
      if (result !== 'enemyFled') continue
      ran++
      expect(ctx.events).toContainEqual({ type: 'fled', target: 'enemy' })
      const line = ctx.events.find((e) => e.type === 'say' && e.side === 'enemy')
      expect(ENEMIES.goon.flee?.lines).toContain(line?.type === 'say' ? line.text : '')
      // Running is their whole turn: no attack follows.
      expect(ctx.events.some((e) => e.type === 'hit' && e.attacker === 'enemy')).toBe(false)
    }
    expect(ran).toBeGreaterThan(15)
    expect(ran).toBeLessThan(50)
  })

  it("never run while healthy, while stunned, or if they aren't the running type", () => {
    for (let seed = 1; seed <= 40; seed++) {
      expect(fightRound(lowGoon(25, seed), jab)).toBe('ongoing')

      const stunned = lowGoon(10, seed)
      stunned.enemy.statuses = [{ kind: 'stunned', turns: 1 }]
      expect(fightRound(stunned, jab)).not.toBe('enemyFled')

      const leader = lowGoon(10, seed)
      leader.enemy.kind = 'gangLeader'
      expect(fightRound(leader, jab)).not.toBe('enemyFled')
    }
  })
})

describe('elite gear', () => {
  const use = (skill: 'mixtape' | 'cloudGate' | 'ventraCard') => ({ type: 'skill', skill }) as const

  it('the Mixtape plays their last move back at them, louder', () => {
    const shank = ENEMIES.thug.moves.findIndex((m) => m.text.includes('shank'))
    let landed = 0
    for (let seed = 1; seed <= 30; seed++) {
      const hero = makeHero({ spd: 999 }, { skills: ['mixtape'] })
      const enemy = makeEnemy({ maxHp: 9999, spd: 0, atk: 1 }, { kind: 'thug' })
      const ctx = makeCombat(hero, enemy, seed)
      ctx.battle.enemyLastMove = shank
      applyEffects(ctx, 'hero', SKILLS.mixtape.effects)
      const hit = ctx.events.find((e) => e.type === 'hit' && e.attacker === 'hero')
      if (!hit) continue
      landed++
      // The shank's bleed lands on the thug this time (when its own 70% roll says so).
      expect(ctx.hero.statuses.some((s) => s.kind === 'bleeding')).toBe(false)
    }
    expect(landed).toBeGreaterThan(20)
  })

  it('sampling a self-buff puts it on the hero, and a basic-only foe gets a big hit', () => {
    const rev = ENEMIES.biker.moves.findIndex((m) => m.text.includes('revs'))
    const ctx = makeCombat(makeHero(), makeEnemy({ maxHp: 9999 }, { kind: 'biker' }))
    ctx.battle.enemyLastMove = rev
    applyEffects(ctx, 'hero', SKILLS.mixtape.effects)
    expect(ctx.hero.statuses.map((s) => s.kind)).toEqual(['pumped'])
    expect(ctx.enemy.statuses).toEqual([])

    const basic = makeCombat(makeHero({ atk: 20 }), makeEnemy({ maxHp: 9999, def: 0, spd: 0 }), 2)
    applyEffects(basic, 'hero', SKILLS.mixtape.effects)
    const hit = basic.events.find((e) => e.type === 'hit')
    expect(hit?.type === 'hit' && hit.damage).toBeGreaterThan(25)
  })

  it('Cloud Gate chrome halves hits, throws the rest back, and bounces debuffs and grabs', () => {
    const hero = makeHero({ maxHp: 200, def: 0 }, { skills: ['taser', 'cloudGate'] })
    const ctx = makeCombat(hero, makeEnemy({ maxHp: 200, atk: 40, spd: 0 }), 1)
    applyEffects(ctx, 'hero', SKILLS.cloudGate.effects)
    expect(ctx.hero.statuses.map((s) => s.kind)).toEqual(['mirrored'])

    applyEffects(ctx, 'enemy', [
      { type: 'damage', power: 1 },
      { type: 'status', target: 'foe', status: 'shook', turns: 2 },
      { type: 'lockGear' },
    ])
    const hit = ctx.events.find((e) => e.type === 'hit' && e.attacker === 'enemy')
    const reflected = ctx.events.find((e) => e.type === 'reflect')
    if (hit?.type !== 'hit' || reflected?.type !== 'reflect') throw new Error('expected a hit')
    expect(hit.guarded).toBe(true)
    expect(reflected).toMatchObject({ target: 'enemy' })
    expect(Math.abs(reflected.damage - hit.damage)).toBeLessThanOrEqual(1)
    expect(ctx.enemy.hp).toBe(200 - reflected.damage)
    expect(ctx.enemy.statuses.map((s) => s.kind)).toEqual(['shook'])
    expect(ctx.hero.statuses.map((s) => s.kind)).toEqual(['mirrored'])
    expect(ctx.battle.lockedGear).toEqual([])
  })

  it('the L arrives two enemy turns later: unblockable, capped, and it costs them the turn', () => {
    const hero = makeHero({ maxHp: 9999, def: 999 }, { skills: ['ventraCard'] })
    const ctx = makeCombat(hero, makeEnemy({ maxHp: 400, spd: 0, def: 999 }), 1)
    fightRound(ctx, use('ventraCard'))
    expect(ctx.enemy.statuses.map((s) => s.kind)).toEqual(['incoming'])
    expect(ctx.events.some((e) => e.type === 'narrate' && e.text.startsWith('DING'))).toBe(false)

    ctx.events.length = 0
    ctx.enemy.statuses.push({ kind: 'guarded', turns: 5 })
    fightRound(ctx, jab)
    const train = ctx.events.findIndex((e) => e.type === 'narrate' && e.text.startsWith('DING'))
    expect(train).toBeGreaterThanOrEqual(0)
    expect(ctx.events[train + 1]).toMatchObject({ type: 'hit', target: 'enemy', damage: 40 })
    expect(ctx.events.some((e) => e.type === 'hit' && e.attacker === 'enemy')).toBe(false)
    expect(ctx.enemy.statuses.map((s) => s.kind)).not.toContain('incoming')
  })
})

describe('late-game rally', () => {
  const setup = (rally: boolean, seed = 1) => {
    const hero = makeHero({ atk: 12, def: 999, maxHp: 9999, spd: 999 })
    const enemy = makeEnemy({ maxHp: 100, def: 0, spd: 0 }, { kind: 'thug' })
    enemy.hp = 34
    const ctx = makeCombat(hero, enemy, seed)
    ctx.battle.enemyRally = rally
    return ctx
  }
  const rallied = (ctx: ReturnType<typeof setup>) => {
    const lines = RALLY_LINES.map((l) => fill(l, { enemy: ctx.enemy.name }))
    return ctx.events.filter((e) => e.type === 'narrate' && lines.includes(e.text))
  }

  it('heals once the first time a late-game enemy drops low, without costing its turn', () => {
    let seen = 0
    for (let seed = 1; seed <= 40; seed++) {
      const ctx = setup(true, seed)
      fightRound(ctx, jab)
      const dropped = ctx.events.some((e) => e.type === 'hit' && e.target === 'enemy')
      if (!dropped || ctx.enemy.hp <= 0) continue
      seen++
      expect(ctx.battle.enemyRally).toBe(false)
      expect(rallied(ctx)).toHaveLength(1)
      const heal = ctx.events.find((e) => e.type === 'heal' && e.target === 'enemy')
      expect(heal).toMatchObject({ amount: 25 })
      // It still got its own turn (an attack, a move, or running off).
      const acted = ctx.events.some(
        (e) =>
          (e.type === 'hit' && e.attacker === 'enemy') ||
          (e.type === 'miss' && e.attacker === 'enemy') ||
          (e.type === 'narrate' && ENEMIES.thug.moves.some((m) => m.text === e.text)) ||
          e.type === 'fled',
      )
      expect(acted).toBe(true)

      // Dropping low again later: no second rally.
      ctx.events.length = 0
      ctx.enemy.hp = 20
      fightRound(ctx, jab)
      expect(rallied(ctx)).toHaveLength(0)
    }
    expect(seen).toBeGreaterThan(25)
  })

  it('never rallies before the late game, or off a knockout', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const early = setup(false, seed)
      fightRound(early, jab)
      expect(rallied(early)).toHaveLength(0)

      const ko = setup(true, seed)
      ko.enemy.hp = 1
      fightRound(ko, jab)
      if (ko.enemy.hp <= 0) expect(rallied(ko)).toHaveLength(0)
    }
  })

  it('uses all three remedies', () => {
    const used = new Set<string>()
    for (let seed = 1; seed <= 60; seed++) {
      const ctx = setup(true, seed)
      fightRound(ctx, jab)
      for (const e of rallied(ctx)) if (e.type === 'narrate') used.add(e.text)
    }
    expect(used.size).toBe(3)
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
