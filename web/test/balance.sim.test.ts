import { describe, expect, it } from 'vitest'
import { simulate } from './sim'

/**
 * Balance guardrails. A bot plays 2,000 seeded runs; if a tuning change in
 * balance.ts or content pushes the game outside these bands, this fails.
 * Run `npm run sim` to see the report.
 */
describe('balance', () => {
  const report = simulate(2000)
  console.table({
    'win rate': `${(report.winRate * 100).toFixed(1)}%`,
    'avg actions / run': report.avgActions.toFixed(1),
    'avg rounds / fight': report.avgRoundsPerFight.toFixed(2),
    'avg final level': report.avgLevel.toFixed(1),
  })
  console.log('deaths by block:', report.deathsByBlock.join(' '))
  console.log('battle rap tiers (picking):', report.cyphers)

  it('a sensible player wins sometimes, but not always', () => {
    expect(report.winRate).toBeGreaterThan(0.3)
    expect(report.winRate).toBeLessThan(0.7)
  })

  it('fights are quick: a few rounds, not a slog', () => {
    expect(report.avgRoundsPerFight).toBeGreaterThan(2)
    expect(report.avgRoundsPerFight).toBeLessThan(6)
  })

  it('a run is roughly a 10-minute session', () => {
    // ~4–6 seconds per action with text and animation → 60–150 actions.
    expect(report.avgActions).toBeGreaterThan(40)
    expect(report.avgActions).toBeLessThan(150)
  })
})

/** Typing instead of picking: the same bands must hold for players who type their bars. */
describe('balance when typing Battle Rap bars', () => {
  const report = simulate(1000, 1, { typed: true })
  console.log(
    `typed: win rate ${(report.winRate * 100).toFixed(1)}%, rounds/fight ${report.avgRoundsPerFight.toFixed(2)}, actions ${report.avgActions.toFixed(1)}`,
    report.cyphers,
  )

  it('stays in the same bands', () => {
    expect(report.winRate).toBeGreaterThan(0.3)
    expect(report.winRate).toBeLessThan(0.7)
    expect(report.avgRoundsPerFight).toBeLessThan(6)
    expect(report.avgActions).toBeLessThan(150)
  })
})
