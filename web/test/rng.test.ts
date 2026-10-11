import { describe, expect, it } from 'vitest'
import { createRng } from '../src/engine/rng'

describe('createRng', () => {
  it('is deterministic for a given seed', () => {
    const a = createRng(1234)
    const b = createRng(1234)
    const rollsA = Array.from({ length: 20 }, () => a.float())
    const rollsB = Array.from({ length: 20 }, () => b.float())
    expect(rollsA).toEqual(rollsB)
  })

  it('resumes exactly from a saved state', () => {
    const original = createRng(99)
    original.float()
    original.float()
    const resumed = createRng(original.state)
    expect(resumed.float()).toBe(original.float())
  })

  it('int() stays within inclusive bounds and hits both ends', () => {
    const rng = createRng(7)
    const seen = new Set<number>()
    for (let i = 0; i < 2000; i++) {
      const n = rng.int(3, 6)
      expect(n).toBeGreaterThanOrEqual(3)
      expect(n).toBeLessThanOrEqual(6)
      seen.add(n)
    }
    expect([...seen].sort()).toEqual([3, 4, 5, 6])
  })

  it('weighted() respects weights and never picks zero-weight entries', () => {
    const rng = createRng(42)
    const counts = { common: 0, rare: 0, never: 0 }
    const table = [
      { value: 'common', weight: 9 },
      { value: 'rare', weight: 1 },
      { value: 'never', weight: 0 },
    ] as const
    for (let i = 0; i < 10_000; i++) counts[rng.weighted(table)] += 1
    expect(counts.never).toBe(0)
    expect(counts.common / 10_000).toBeCloseTo(0.9, 1)
  })

  it('vary() stays within the spread', () => {
    const rng = createRng(5)
    for (let i = 0; i < 1000; i++) {
      const v = rng.vary(100, 0.15)
      expect(v).toBeGreaterThanOrEqual(85)
      expect(v).toBeLessThanOrEqual(115)
    }
  })

  it('sample() returns distinct items', () => {
    const rng = createRng(3)
    const picked = rng.sample(['a', 'b', 'c', 'd', 'e'], 3)
    expect(picked).toHaveLength(3)
    expect(new Set(picked).size).toBe(3)
  })
})
