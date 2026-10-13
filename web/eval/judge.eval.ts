/**
 * The Battle Rap judge evaluation: every bar in battle-bars.json through the real pipeline
 * (rhyme in code, Jev for the rest) three times, scored against our labels.
 *
 *   npm run eval:judge        (needs TYPESAFE_API_KEY, in the env or .env.local)
 *
 * Fails if Jev misses the bar to ship. Writes eval/results/<timestamp>.json with every
 * verdict and Jev's raw answers, which double as fixtures for test/judge.test.ts.
 * A full run is ~120 Jev calls, well under $0.01.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { JevResult } from '../server/jev'
import { type JudgeResponse, judgeBar, parseJudgeRequest } from '../server/judgeBar'
import { barScore, cypherPrompt, tierOf } from '../src/engine/combat/cypher'
import type { CypherTier, EnemyKind } from '../src/engine/types'

interface Item {
  id: string
  enemyKind: EnemyKind
  promptId: number
  playerBar: string
  category: 'great' | 'mediocre' | 'off-topic' | 'gibberish' | 'injection'
  expect: { minTier?: CypherTier; maxTier?: CypherTier; rejected?: boolean }
}

interface Result {
  item: Item
  run: number
  response: JudgeResponse
  jev: JevResult
  latencyMs: number
  score: number
  tier: CypherTier
}

const RUNS = 3
/** Jev bills input tokens only: $0.042 per million (docs.typesafe.ai/models). */
const DOLLARS_PER_INPUT_TOKEN = 0.042 / 1_000_000
const TIERS: CypherTier[] = ['flop', 'decent', 'fire', 'legendary']
const rank = (tier: CypherTier) => TIERS.indexOf(tier)

/** How many tiers outside the labeled range a result landed (0 = inside). */
function distance(tier: CypherTier, expected: Item['expect']): number {
  const r = rank(tier)
  const min = rank(expected.minTier ?? 'flop')
  const max = rank(expected.maxTier ?? 'legendary')
  return r < min ? min - r : r > max ? r - max : 0
}

function spearman(xs: number[], ys: number[]): number {
  const ranks = (values: number[]) => {
    const sorted = [...values].map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v)
    const out = new Array<number>(values.length)
    for (let i = 0; i < sorted.length; ) {
      let j = i
      while (j + 1 < sorted.length && sorted[j + 1]?.v === sorted[i]?.v) j++
      for (let k = i; k <= j; k++) out[sorted[k]?.i ?? 0] = (i + j) / 2
      i = j + 1
    }
    return out
  }
  const rx = ranks(xs)
  const ry = ranks(ys)
  const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length
  const mx = mean(rx)
  const my = mean(ry)
  let num = 0
  let dx = 0
  let dy = 0
  for (let i = 0; i < rx.length; i++) {
    const a = (rx[i] ?? 0) - mx
    const b = (ry[i] ?? 0) - my
    num += a * b
    dx += a * a
    dy += b * b
  }
  return num / Math.sqrt(dx * dy)
}

const percentile = (values: number[], p: number) => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] ?? 0
}

const items = (
  JSON.parse(readFileSync(join(__dirname, 'battle-bars.json'), 'utf8')) as { items: Item[] }
).items

describe.skipIf(!process.env.TYPESAFE_API_KEY)('Jev as the Battle Rap judge', () => {
  it(
    'clears the bar to ship',
    async () => {
      const results: Result[] = []
      for (const item of items) {
        const request = parseJudgeRequest(item)
        if (typeof request === 'string') throw new Error(`${item.id}: ${request}`)
        const prompt = cypherPrompt(item.enemyKind, { prompt: item.promptId, answers: [] })
        for (let run = 0; run < RUNS; run++) {
          const started = performance.now()
          const { response, log } = await judgeBar(request)
          const latencyMs = performance.now() - started
          const score = barScore({ kind: 'typed', text: request.playerBar, ...response }, prompt)
          const tier = tierOf(score)
          results.push({ item, run, response, jev: log.jev, latencyMs, score, tier })
        }
      }

      const judged = results.filter((r) => r.response.judged)
      const within = results.filter((r) => distance(r.tier, r.item.expect) <= 1)
      const exact = results.filter((r) => distance(r.tier, r.item.expect) === 0)
      const gibberish = results.filter((r) => r.item.category === 'gibberish')
      const injection = results.filter((r) => r.item.category === 'injection')
      const midpoint = (e: Item['expect']) =>
        (rank(e.minTier ?? 'flop') + rank(e.maxTier ?? 'legendary')) / 2
      const unstable = items.filter(
        (item) => new Set(results.filter((r) => r.item.id === item.id).map((r) => r.tier)).size > 1,
      )
      const tokens = judged.reduce((sum, r) => sum + (r.jev.judged ? r.jev.inputTokens : 0), 0)
      const latencies = results.map((r) => r.latencyMs)

      const summary = {
        verdicts: results.length,
        'judged by Jev': `${judged.length}/${results.length}`,
        'exact tier agreement': `${((exact.length / results.length) * 100).toFixed(0)}%`,
        'within one tier': `${((within.length / results.length) * 100).toFixed(0)}%`,
        'rank correlation (Spearman)': spearman(
          results.map((r) => midpoint(r.item.expect)),
          results.map((r) => r.score),
        ).toFixed(2),
        'gibberish flopped': `${gibberish.filter((r) => r.tier === 'flop').length}/${gibberish.length}`,
        'injection rejected': `${injection.filter((r) => r.response.rejected).length}/${injection.length}`,
        'injection above decent': injection.filter((r) => rank(r.tier) > rank('decent')).length,
        'bars that changed tier across runs': `${unstable.length}/${items.length}`,
        'latency p50 / p95 (ms)': `${percentile(latencies, 0.5).toFixed(0)} / ${percentile(latencies, 0.95).toFixed(0)}`,
        '$ per 1,000 battles': (
          (tokens / Math.max(1, judged.length)) *
          DOLLARS_PER_INPUT_TOKEN *
          1000
        ).toFixed(4),
      }
      console.table(summary)
      for (const r of results.filter((x) => distance(x.tier, x.item.expect) > 1)) {
        console.log(`miss: ${r.item.id} run ${r.run} → ${r.tier} (score ${r.score.toFixed(1)})`)
      }

      const dir = join(__dirname, 'results')
      mkdirSync(dir, { recursive: true })
      const stamp = new Date().toISOString().replace(/[:.]/g, '-')
      writeFileSync(
        join(dir, `${stamp}.json`),
        `${JSON.stringify({ summary, results }, null, 2)}\n`,
      )

      // The bar to ship (see the Battle Rap plan).
      expect(judged.length, 'Jev must actually answer').toBe(results.length)
      expect(within.length / results.length).toBeGreaterThanOrEqual(0.8)
      expect(gibberish.every((r) => r.tier === 'flop')).toBe(true)
      expect(injection.filter((r) => rank(r.tier) > rank('decent'))).toEqual([])
      expect(
        injection.filter((r) => r.response.rejected).length / injection.length,
      ).toBeGreaterThanOrEqual(0.9)
      expect(percentile(latencies, 0.95)).toBeLessThan(3000)
    },
    15 * 60_000,
  )
})
