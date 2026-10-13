/**
 * Logs every judged bar to Upstash Redis so the judge can be tuned on real bars
 * (`npm run export:bars` pulls them for labeling). A capped list: newest first, the
 * latest BAR_LOG_LIMIT kept. No IP addresses are stored.
 *
 * Connected through the Vercel Marketplace, which sets either the UPSTASH_REDIS_REST_* or
 * the KV_REST_API_* variables. Without them (local dev), logging is skipped.
 */

import { Redis } from '@upstash/redis'
import type { BarLogEntry } from './judgeBar.js'

export const BAR_LOG_KEY = 'cypher:bars'
export const BAR_LOG_LIMIT = 100_000

let client: Redis | null | undefined

export function barLogRedis(): Redis | null {
  if (client !== undefined) return client
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  client = url && token ? new Redis({ url, token }) : null
  return client
}

/** Never throws: a logging hiccup must not cost the player their bar. */
export async function logBar(entry: BarLogEntry, redis = barLogRedis()): Promise<void> {
  if (!redis) return
  try {
    await redis
      .pipeline()
      .lpush(BAR_LOG_KEY, JSON.stringify(entry))
      .ltrim(BAR_LOG_KEY, 0, BAR_LOG_LIMIT - 1)
      .exec()
  } catch (error) {
    console.warn('Battle Rap: logging a bar failed', error)
  }
}
