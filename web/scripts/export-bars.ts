/**
 * Exports logged Battle Rap bars from Upstash Redis to eval/candidates/<date>.jsonl, newest
 * first, to label and add to the judge's test set (eval/battle-bars.json).
 *
 *   npm run export:bars [-- --limit 5000]
 *
 * Reads UPSTASH_REDIS_REST_URL / _TOKEN (or KV_REST_API_URL / _TOKEN) from the environment
 * or .env.local (`vercel env pull .env.local` fetches them).
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Redis } from '@upstash/redis'

const KEY = 'cypher:bars'
const PAGE = 1000

const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
if (!url || !token) {
  console.error('Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_*).')
  process.exit(1)
}

const limitArg = process.argv.indexOf('--limit')
const limit = limitArg > 0 ? Number(process.argv[limitArg + 1]) : Number.POSITIVE_INFINITY

const redis = new Redis({ url, token, automaticDeserialization: false })
const total = await redis.llen(KEY)
const lines: string[] = []
for (let start = 0; start < Math.min(total, limit); start += PAGE) {
  const stop = Math.min(start + PAGE, total, limit) - 1
  lines.push(...(await redis.lrange<string>(KEY, start, stop)))
}

const dir = join(import.meta.dirname, '..', 'eval', 'candidates')
mkdirSync(dir, { recursive: true })
const file = join(dir, `${new Date().toISOString().slice(0, 10)}.jsonl`)
writeFileSync(file, lines.length ? `${lines.join('\n')}\n` : '')
console.log(`Exported ${lines.length} of ${total} bars to ${file}`)
