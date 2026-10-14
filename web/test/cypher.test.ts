import { describe, expect, it } from 'vitest'
import { CYPHERS } from '../src/content/cyphers'
import { CYPHER } from '../src/engine/balance'
import { cleanBar, MAX_BAR_LINE_LENGTH } from '../src/engine/bars'
import { barScore, calloutsFor, canBattleRap, isProfane, tierOf } from '../src/engine/combat/cypher'
import { migrateSave } from '../src/engine/save'
import { newGame, step } from '../src/engine/step'
import type { BarResult, BattleState, GameEvent, GameState } from '../src/engine/types'

/** A fresh fight against a tough thug, with Battle Rap unlocked or not. */
function fight(seed = 1, unlocked = true): GameState {
  for (let s = seed; s < seed + 200; s++) {
    let state = newGame('Tester', s).state
    for (let i = 0; i < 4 && state.phase.kind === 'explore'; i++) {
      state = step(state, { type: 'walk' }).state
    }
    if (state.phase.kind !== 'battle') continue
    const enemy = {
      ...state.phase.battle.enemy,
      kind: 'thug' as const,
      stats: { ...state.phase.battle.enemy.stats, maxHp: 400 },
      hp: 400,
    }
    return {
      ...state,
      phase: {
        kind: 'battle',
        battle: { ...state.phase.battle, enemy, rapUnlocked: unlocked, opening: null },
      },
    }
  }
  throw new Error('never reached a battle')
}

const battleOf = (state: GameState): BattleState => {
  if (state.phase.kind !== 'battle') throw new Error(`expected battle, got ${state.phase.kind}`)
  return state.phase.battle
}

const typed = (quality: number, rhyme: number, rejected = false): BarResult => ({
  kind: 'typed',
  text: 'some bar\nthat I typed',
  quality,
  rhyme,
  rejected,
})

describe('Battle Rap unlock', () => {
  it('unlocks the first time the enemy drops below half, and stays unlocked after a heal', () => {
    let state = fight(1, false)
    const battle = battleOf(state)
    state = {
      ...state,
      hero: { ...state.hero, stats: { ...state.hero.stats, atk: 60, spd: 999 } },
      phase: { kind: 'battle', battle: { ...battle, enemy: { ...battle.enemy, hp: 210 } } },
    }
    expect(canBattleRap(battleOf(state))).toBe(false)
    expect(step(state, { type: 'battleRap' }).state).toBe(state)

    const { state: after, events } = step(state, { type: 'useMove', move: 'jab' })
    const b = battleOf(after)
    if (b.enemy.hp >= 200) throw new Error('jab should have dropped the enemy below half')
    expect(b.rapUnlocked).toBe(true)
    expect(events).toContainEqual({ type: 'rapUnlocked' })

    const healed: GameState = {
      ...after,
      phase: { kind: 'battle', battle: { ...b, enemy: { ...b.enemy, hp: 400 } } },
    }
    expect(canBattleRap(battleOf(healed))).toBe(true)
  })
})

describe('a cypher', () => {
  it('starts with the enemy spitting a bar, and is once per fight', () => {
    const state = fight()
    const { state: started, events } = step(state, { type: 'battleRap' })
    const battle = battleOf(started)
    expect(battle.rapUsed).toBe(true)
    expect(battle.cypher).not.toBeNull()
    expect([...(battle.cypher?.answers ?? [])].sort()).toEqual([0, 1, 2])
    const prompt = CYPHERS.thug[battle.cypher?.prompt ?? -1]
    expect(events).toContainEqual(
      expect.objectContaining({ type: 'say', side: 'enemy', text: prompt?.bar }),
    )
    // No round passes until the hero answers.
    expect(battle.round).toBe(battleOf(state).round)

    const answered = step(started, { type: 'spit', bar: { kind: 'picked', answer: 0 } }).state
    expect(step(answered, { type: 'battleRap' }).state).toBe(answered)
  })

  it('blocks every other action until the hero answers', () => {
    const started = step(fight(), { type: 'battleRap' }).state
    expect(step(started, { type: 'useMove', move: 'jab' }).state).toBe(started)
    expect(step(started, { type: 'flee' }).state).toBe(started)
    expect(step(started, { type: 'battleRap' }).state).toBe(started)
  })

  it('a fire comeback always lands, rattles the enemy, and the enemy still gets its turn', () => {
    for (let seed = 1; seed <= 15; seed++) {
      const started = step(fight(seed), { type: 'battleRap' }).state
      const cypher = battleOf(started).cypher
      const prompt = CYPHERS.thug[cypher?.prompt ?? 0]
      const fire = prompt?.answers.findIndex((a) => a.tier === 'fire') ?? -1
      const { state, events } = step(started, {
        type: 'spit',
        bar: { kind: 'picked', answer: fire },
      })

      expect(events).toContainEqual({ type: 'cypher', tier: 'fire' })
      expect(events).toContainEqual(
        expect.objectContaining({ type: 'say', side: 'hero', text: prompt?.answers[fire]?.text }),
      )
      const heroHit = events.find((e) => e.type === 'hit' && e.attacker === 'hero')
      expect(heroHit).toBeDefined()
      expect(events.some((e) => e.type === 'miss' && e.attacker === 'hero')).toBe(false)
      const enemyActed = events.some(
        (e: GameEvent) => (e.type === 'hit' || e.type === 'miss') && e.attacker === 'enemy',
      )
      const enemyNarrated = events.some(
        (e) => e.type === 'narrate' && CYPHERS.thug.every((p) => p.bar !== e.text),
      )
      expect(enemyActed || enemyNarrated).toBe(true)
      expect(battleOf(state).cypher).toBeNull()
    }
  })

  it('freezing up is a flop: no damage, the hero is shook, and the turn is gone', () => {
    const started = step(fight(), { type: 'battleRap' }).state
    const before = battleOf(started).enemy.hp
    const { state, events } = step(started, { type: 'spit', bar: { kind: 'timeout' } })
    expect(events).toContainEqual({ type: 'cypher', tier: 'flop' })
    expect(events.some((e) => e.type === 'hit' && e.attacker === 'hero')).toBe(false)
    expect(state.hero.statuses.map((s) => s.kind)).toContain('shook')
    const enemy = battleOf(state).enemy
    expect(enemy.hp).toBeLessThanOrEqual(before)
  })

  it("a typed bar shows up as the hero's line, cleaned up", () => {
    const started = step(fight(), { type: 'battleRap' }).state
    const long = `${'x'.repeat(200)}\nsecond line\nthird line gets cut`
    const { events } = step(started, {
      type: 'spit',
      bar: { kind: 'typed', text: long, quality: 6, rhyme: 1, rejected: false },
    })
    const said = events.find((e) => e.type === 'say' && e.side === 'hero')
    expect(said?.type === 'say' && said.text).toBe(
      `${'x'.repeat(MAX_BAR_LINE_LENGTH)}\nsecond line`,
    )
  })

  it('calls out a one-line bar as half a bar', () => {
    const started = step(fight(), { type: 'battleRap' }).state
    const spit = (text: string) =>
      step(started, {
        type: 'spit',
        bar: { kind: 'typed', text, quality: 6.4, rhyme: 1, rejected: false },
      }).events
    const half = (text: string) =>
      spit(text).some((e) => e.type === 'callout' && e.callout === 'halfBar')
    expect(half("Bro don't trip I don't even drive")).toBe(true)
    expect(half("Bro don't trip I don't even drive\nI take the bus")).toBe(false)
    expect(spit('just one line')).toContainEqual({ type: 'cypher', tier: 'decent' })
  })
})

describe('callouts', () => {
  const bar = (over: Partial<Extract<BarResult, { kind: 'typed' }>> = {}): BarResult => ({
    kind: 'typed',
    text: 'line one\nline two',
    quality: 7,
    rhyme: 1,
    rejected: false,
    marks: { funny: 0, clever: 0, flow: 0, relevance: 0 },
    ...over,
  })
  const marks = (funny: number, clever: number, flow: number, relevance: number) => ({
    marks: { funny, clever, flow, relevance },
  })

  it('names the rhyme', () => {
    const rhyme = (value: number) => calloutsFor(bar({ rhyme: value, ...marks(7, 0, 0, 0) }))[0]
    expect(rhyme(1.2)).toBe('multiRhyme')
    expect(rhyme(1)).toBe('perfectRhyme')
    expect(rhyme(0.76)).toBe('slantRhyme')
    expect(calloutsFor(bar({ rhyme: 0.3, ...marks(7, 0, 0, 0) }))).toEqual(['funny', 'noRhyme'])
  })

  it('calls out what landed, hits before misses', () => {
    expect(calloutsFor(bar(marks(8, 3, 8, 9)))).toEqual([
      'perfectRhyme',
      'funny',
      'flipped',
      'flow',
    ])
    expect(calloutsFor(bar({ rhyme: 0, ...marks(2, 3, 8, 5) }))).toEqual([
      'flow',
      'noRhyme',
      'noPunchline',
    ])
  })

  it("doesn't call a plain direct answer a flip, or ordinary flow smooth", () => {
    expect(calloutsFor(bar(marks(2, 3, 7, 10)))).toEqual(['perfectRhyme', 'noPunchline'])
  })

  it('cussing earns PARENTAL ADVISORY and a modest bonus', () => {
    const prompt = CYPHERS.thug[0]
    if (!prompt) throw new Error('missing prompt')
    const cuss = bar({
      text: "You ain't shit, you're a f*cking clown\nso sit your ass down",
      quality: 5,
      ...marks(5, 3, 6, 5),
    })
    expect(calloutsFor(cuss)).toContain('explicit')
    expect(barScore(cuss, prompt)).toBeCloseTo(5 + CYPHER.profanityBonus)
    for (const clean of ['Your class is a mess', 'shift your hello at the grass', 'Dickens']) {
      expect(isProfane(clean), clean).toBe(false)
    }
  })

  it('calls a bar with nothing in it dookie, even if the judge let it through', () => {
    expect(calloutsFor(bar(marks(0, 0.4, 1, 1)))).toEqual(['dookie'])
  })

  it('shows at most four, dropping the last hits (flow first) so misses stay', () => {
    expect(calloutsFor(bar(marks(10, 10, 10, 10)))).toEqual([
      'perfectRhyme',
      'funny',
      'clever',
      'flipped',
    ])
    expect(calloutsFor(bar({ text: 'one line', ...marks(10, 10, 10, 10) }))).toEqual([
      'perfectRhyme',
      'funny',
      'clever',
      'halfBar',
    ])
  })

  it('gives a thrown-out bar only the reason', () => {
    const out = (rejectedFor: 'gibberish' | 'injection' | null) =>
      calloutsFor(bar({ rejected: true, rejectedFor, ...marks(10, 10, 10, 10) }))
    expect(out('gibberish')).toEqual(['dookie'])
    expect(out('injection')).toEqual(['forSale'])
    expect(out(null)).toEqual(['dookie'])
  })

  it('without marks (judge unreachable) only the rhyme is called', () => {
    expect(calloutsFor(bar({ marks: null }))).toEqual(['perfectRhyme'])
    const older = {
      kind: 'typed',
      text: 'one line',
      quality: 7,
      rhyme: 1,
      rejected: false,
    } as const
    expect(calloutsFor(older)).toEqual(['perfectRhyme', 'halfBar'])
  })

  it('picked answers, timeouts and empty bars get none', () => {
    expect(calloutsFor({ kind: 'picked', answer: 0 })).toEqual([])
    expect(calloutsFor({ kind: 'timeout' })).toEqual([])
    expect(calloutsFor(bar({ text: '  ' }))).toEqual([])
  })

  it("flash between the hero's bar and the crowd's reaction", () => {
    const started = step(fight(), { type: 'battleRap' }).state
    const { events } = step(started, { type: 'spit', bar: bar(marks(8, 3, 8, 9)) })
    const said = events.findIndex((e) => e.type === 'say' && e.side === 'hero')
    const callouts = events.flatMap((e, i) => (e.type === 'callout' ? [i] : []))
    const tier = events.findIndex((e) => e.type === 'cypher')
    expect(callouts).toHaveLength(4)
    expect(Math.min(...callouts)).toBe(said + 1)
    expect(Math.max(...callouts)).toBe(tier - 1)
  })
})

describe('bar scoring', () => {
  const prompt = CYPHERS.thug[0]
  if (!prompt) throw new Error('missing prompt')

  it('scales quality by rhyme, and rewards multi-syllable rhymes', () => {
    expect(barScore(typed(9, 1), prompt)).toBe(9)
    expect(barScore(typed(9, 0), prompt)).toBeCloseTo(5.4)
    expect(barScore(typed(8, 1.4), prompt)).toBeCloseTo(9)
    expect(barScore(typed(5, 1), prompt)).toBe(5)
  })

  it('scores one line as half a bar', () => {
    const oneLine = (text: string): BarResult => ({
      kind: 'typed',
      text,
      quality: 6.4,
      rhyme: 1,
      rejected: false,
    })
    expect(barScore(oneLine("Bro don't trip I don't even drive"), prompt)).toBeCloseTo(3.2)
    expect(barScore(oneLine('one line\n   \n'), prompt)).toBeCloseTo(3.2)
    expect(barScore(oneLine('line one\nline two'), prompt)).toBeCloseTo(6.4)
  })

  it('treats rejected, empty and malformed bars as flops', () => {
    expect(barScore(typed(10, 1, true), prompt)).toBe(0)
    expect(
      barScore({ kind: 'typed', text: '   ', quality: 10, rhyme: 1, rejected: false }, prompt),
    ).toBe(0)
    expect(barScore(typed(Number.NaN, 1), prompt)).toBe(0)
    expect(barScore(typed(99, 9), prompt)).toBeCloseTo(11)
    expect(barScore({ kind: 'picked', answer: 7 }, prompt)).toBe(0)
  })

  it('maps scores to tiers, with no legendary in pick mode', () => {
    expect(tierOf(0)).toBe('flop')
    expect(tierOf(2.99)).toBe('flop')
    expect(tierOf(3)).toBe('decent')
    expect(tierOf(6)).toBe('fire')
    expect(tierOf(8.5)).toBe('legendary')
    for (const answer of prompt.answers.keys()) {
      expect(tierOf(barScore({ kind: 'picked', answer }, prompt))).toBe(
        prompt.answers[answer]?.tier,
      )
    }
  })

  it('a judge outage caps a typed bar at decent', () => {
    expect(tierOf(barScore(typed(CYPHER.unjudgedQuality, 1), prompt))).toBe('decent')
    expect(tierOf(barScore(typed(CYPHER.unjudgedQuality, 0), prompt))).toBe('decent')
  })

  it('cleanBar keeps two trimmed lines', () => {
    expect(cleanBar('  one  \n\n two \n three')).toBe('one\ntwo')
    expect(cleanBar('\n  \n')).toBe('')
  })
})

describe('saves', () => {
  it('migrates a v3 save made mid-battle to v4 with Battle Rap locked', () => {
    const state = fight(3, false)
    const battle = battleOf(state)
    const { rapUnlocked, rapUsed, cypher, ...v3Battle } = battle
    const v3 = { ...state, version: 3, phase: { kind: 'battle', battle: v3Battle } }
    const migrated = migrateSave(JSON.parse(JSON.stringify(v3)))
    expect(migrated?.version).toBe(4)
    if (migrated?.phase.kind !== 'battle') throw new Error('expected battle')
    expect(migrated.phase.battle).toMatchObject({
      rapUnlocked: false,
      rapUsed: false,
      cypher: null,
    })
  })
})
