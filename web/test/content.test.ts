import { describe, expect, it } from 'vitest'
import { ENEMIES } from '../src/content/enemies'
import { HERO_LINES } from '../src/content/hero'
import { MOVES, STARTING_MOVES } from '../src/content/moves'
import { NEIGHBORHOODS } from '../src/content/names'
import { NPCS, PLUG_SALE_LINES } from '../src/content/npcs'
import { SHOP_CATEGORIES, SKILL_ORDER, SKILLS } from '../src/content/skills'
import { BLOCKS_PER_RUN, GAUNTLET, isGauntlet } from '../src/engine/balance'
import type { Effect } from '../src/engine/types'

/**
 * Everyone in Chicago raps (except Goons). A spoken line counts as a bar when
 * it has two lines; this catches a prose line slipping into a rapper's pool.
 */
const isBar = (line: string) => line.split('\n').length >= 2

describe('rhyming content', () => {
  for (const def of Object.values(ENEMIES)) {
    it(`${def.title} ${def.rhymes ? 'raps' : 'does not rap'} in every spoken pool`, () => {
      const pools = [def.intro, def.taunt, def.blockFlee, def.defeat]
      if (def.flee) pools.push(def.flee.lines)
      for (const pool of pools) {
        expect(pool.length).toBeGreaterThan(0)
        for (const line of pool) {
          if (def.rhymes) expect(isBar(line), line).toBe(true)
        }
      }
    })
  }

  it('the hero raps', () => {
    for (const pool of Object.values(HERO_LINES)) {
      for (const line of pool) expect(isBar(line), line).toBe(true)
    }
    for (const move of Object.values(MOVES)) {
      for (const line of move.lines) expect(isBar(line), line).toBe(true)
    }
  })

  it('vendors rap whenever they speak', () => {
    for (const npc of Object.values(NPCS)) {
      for (const line of npc.farewell) expect(isBar(line), line).toBe(true)
      for (const node of Object.values(npc.nodes)) {
        for (const set of node.lines) {
          for (const line of set) {
            if (typeof line === 'string' && line !== '...') expect(isBar(line), line).toBe(true)
          }
        }
      }
    }
    for (const line of PLUG_SALE_LINES) expect(isBar(line)).toBe(true)
  })

  it('big pools keep encounters fresh', () => {
    const regular = Object.values(ENEMIES).filter((d) => !isGauntlet(d.kind))
    for (const def of regular) expect(def.intro.length).toBeGreaterThanOrEqual(8)
    expect(HERO_LINES.battleStart.length).toBeGreaterThanOrEqual(10)
    expect(HERO_LINES.victory.length).toBeGreaterThanOrEqual(10)
  })
})

describe('moves', () => {
  it('starting moves are tier 0 and every other move is learnable', () => {
    for (const id of STARTING_MOVES) expect(MOVES[id].tier).toBe(0)
    const learnable = Object.values(MOVES).filter((m) => m.tier > 0)
    expect(learnable.length).toBeGreaterThanOrEqual(10)
  })

  it('accuracy and PP are sane', () => {
    for (const move of Object.values(MOVES)) {
      expect(move.accuracy).toBeGreaterThan(0.5)
      expect(move.accuracy).toBeLessThanOrEqual(1)
      if (move.pp !== null) expect(move.pp).toBeGreaterThan(0)
    }
  })
})

describe('the gauntlet', () => {
  it('fills the last blocks with named enemies, ending with the King', () => {
    const blocks = Object.keys(GAUNTLET).map(Number)
    expect(Math.max(...blocks)).toBe(BLOCKS_PER_RUN)
    expect(GAUNTLET[BLOCKS_PER_RUN]).toBe('boss')
    expect(NEIGHBORHOODS).toHaveLength(BLOCKS_PER_RUN)
    for (const kind of Object.values(GAUNTLET)) {
      const def = ENEMIES[kind]
      expect(def.name, kind).toBeTruthy()
      expect(def.entrance, kind).toBeTruthy()
      expect(def.intro.length).toBeGreaterThanOrEqual(4)
    }
    expect(ENEMIES.boss.name).toBe('King Durkio')
  })

  it('Rodney hums through his bars', () => {
    const lines = [...ENEMIES.queen.intro, ...ENEMIES.queen.taunt, ...ENEMIES.queen.defeat]
    for (const line of lines) expect(line.toLowerCase(), line).toMatch(/hmmm/)
  })
})

describe('disrupt moves', () => {
  const disrupts = (e: Effect) =>
    (e.type === 'status' && e.target === 'foe' && e.status === 'blinded') ||
    e.type === 'lockMove' ||
    e.type === 'lockGear' ||
    e.type === 'stealClout' ||
    e.type === 'drain'

  it('every enemy move that disrupts the hero also hits them', () => {
    let count = 0
    for (const def of Object.values(ENEMIES)) {
      for (const move of def.moves) {
        if (!move.effects.some(disrupts)) continue
        count++
        expect(
          move.effects.some((e) => e.type === 'damage'),
          move.text,
        ).toBe(true)
      }
    }
    expect(count).toBeGreaterThanOrEqual(8)
  })
})

describe('fleeing', () => {
  it('only early-to-mid enemies run, and the ones that do have plenty to say', () => {
    const runners = Object.values(ENEMIES).filter((d) => d.flee)
    expect(runners.map((d) => d.kind)).toEqual(['goon', 'thug', 'biker'])
    for (const def of runners) expect(def.flee?.lines.length).toBeGreaterThanOrEqual(5)
  })
})

describe("the Plug's shop", () => {
  it('lists every item exactly once, in a category that exists', () => {
    expect([...SKILL_ORDER].sort()).toEqual(Object.keys(SKILLS).sort())
    const categories = SHOP_CATEGORIES.map((c) => c.id)
    for (const id of SKILL_ORDER) expect(categories).toContain(SKILLS[id].category)
    for (const c of categories) {
      expect(SKILL_ORDER.some((id) => SKILLS[id].category === c)).toBe(true)
    }
  })

  it('has three elite pieces at 100-150 clout, all usable in a fight', () => {
    const elite = SKILL_ORDER.filter((id) => SKILLS[id].category === 'elite')
    expect(elite).toHaveLength(3)
    for (const id of elite) {
      expect(SKILLS[id].price).toBeGreaterThanOrEqual(100)
      expect(SKILLS[id].price).toBeLessThanOrEqual(150)
      expect(SKILLS[id].passive).toBe(false)
    }
  })
})
