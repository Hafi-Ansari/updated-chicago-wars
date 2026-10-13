/**
 * Talking to the Battle Rap judge (/api/judge-bar). The game never waits on it for long:
 * if the judge can't be reached, typing gives way to picking a line.
 */

import type { EnemyKind } from '../engine'

export interface Verdict {
  rhyme: number
  quality: number
  rejected: boolean
  /** False when the judge model couldn't answer and only the rhyme was scored. */
  judged: boolean
}

const ENDPOINT = '/api/judge-bar'
const PLAYER_ID_KEY = 'chicago-wars/player-id'
/** The client's patience for a verdict; the server gives Jev 5 s of it. */
export const JUDGE_TIMEOUT_MS = 8000

/** A random id kept in this browser, so logged bars can be grouped without identifying anyone. */
export function playerId(): string | null {
  try {
    let id = localStorage.getItem(PLAYER_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(PLAYER_ID_KEY, id)
    }
    return id
  } catch {
    return null
  }
}

let reachable: Promise<boolean> | null = null

/** Whether the judge answers at all (checked once per session, quickly). */
export function judgeReachable(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return Promise.resolve(false)
  reachable ??= fetch(ENDPOINT, { signal: AbortSignal.timeout(2500) })
    .then((res) => res.ok)
    .catch(() => false)
  return reachable
}

/** Sends a typed bar to be judged. Throws if the judge can't be reached in time. */
export async function judgeBar(
  bar: { enemyKind: EnemyKind; promptId: number; playerBar: string },
  timeoutMs = JUDGE_TIMEOUT_MS,
): Promise<Verdict> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...bar, playerId: playerId() }),
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!res.ok) throw new Error(`Judge answered ${res.status}`)
  const data = (await res.json()) as Partial<Verdict>
  return {
    rhyme: Number(data.rhyme) || 0,
    quality: Number(data.quality) || 0,
    rejected: data.rejected === true,
    judged: data.judged === true,
  }
}
