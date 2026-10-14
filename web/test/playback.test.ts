import { describe, expect, it } from 'vitest'
import type { GameEvent, Side, StatusKind } from '../src/engine/types'
import { type Display, displayAfter, displayOf } from '../src/ui/useGame'
import { simulateRun } from './sim'

const status = (target: Side, kind: StatusKind, change: 'applied' | 'expired'): GameEvent => ({
  type: 'status',
  target,
  status: kind,
  change,
})

const blank: Display = { heroHp: 50, enemyHp: 50, clout: 0, heroStatuses: [], enemyStatuses: [] }
const play = (display: Display, events: GameEvent[]) =>
  events.reduce((d, e) => displayAfter(d, e, null), display)

describe('playback display', () => {
  it('shows a status tag when its event plays, and drops it when it expires', () => {
    const applied = play(blank, [status('hero', 'shook', 'applied')])
    expect(applied.heroStatuses).toEqual(['shook'])
    expect(applied.enemyStatuses).toEqual([])
    expect(play(applied, [status('hero', 'shook', 'expired')]).heroStatuses).toEqual([])
  })

  it('keeps a refreshed status where it was, so the tags do not shuffle', () => {
    const two = play(blank, [
      status('enemy', 'shook', 'applied'),
      status('enemy', 'dazed', 'applied'),
    ])
    expect(play(two, [status('enemy', 'shook', 'applied')]).enemyStatuses).toEqual([
      'shook',
      'dazed',
    ])
  })

  it('a new foe slides in with a clean slate', () => {
    const tagged = play(blank, [status('enemy', 'bleeding', 'applied')])
    const next = displayAfter(tagged, { type: 'appear', name: 'Lil Wrigley', who: 'thug' }, null)
    expect(next.enemyStatuses).toEqual([])
  })

  it("over whole runs, a turn's events land exactly on the engine's statuses", () => {
    let turns = 0
    let changed = 0
    for (let seed = 1; seed <= 40; seed++) {
      simulateRun(seed, {
        onStep: (before, after, events) => {
          // When a fight ends the screen catches up with the engine anyway.
          if (after.phase.kind !== 'battle') return
          const played = play(displayOf(before), events)
          const engine = displayOf(after)
          expect(played.heroStatuses).toEqual(engine.heroStatuses)
          expect(played.enemyStatuses).toEqual(engine.enemyStatuses)
          turns += 1
          if (events.some((e) => e.type === 'status')) changed += 1
        },
      })
    }
    expect(turns).toBeGreaterThan(1000)
    expect(changed).toBeGreaterThan(200)
  })
})
