/**
 * The Battle Rap judging pipeline behind /api/judge-bar: validate the request, look up the
 * enemy's bar (from game content, never from the client), score the rhyme in code, ask
 * Jev for the rest, and build the log entry.
 */

import { CYPHERS } from '../src/content/cyphers.js'
import { cleanBar } from '../src/engine/bars.js'
import type { EnemyKind } from '../src/engine/types.js'
import { type JevInput, type JevResult, judgeWithJev } from './jev.js'
import { type RhymeResult, type RhymeType, rhymeScore } from './rhyme.js'

export interface JudgeRequest {
  enemyKind: EnemyKind
  promptId: number
  playerBar: string
  /** Random id kept in the player's browser, to group their bars without identifying them. */
  playerId: string | null
}

export interface JudgeResponse {
  /** 0-1.4. */
  rhyme: number
  rhymeType: RhymeType
  /** 0-10. */
  quality: number
  rejected: boolean
  /** False when Jev couldn't answer and the quality is a neutral fallback. */
  judged: boolean
}

export interface BarLogEntry {
  ts: string
  playerId: string | null
  enemyKind: EnemyKind
  promptId: number
  enemyBar: string
  playerBar: string
  rhyme: RhymeResult
  jev: JevResult
  response: JudgeResponse
  latencyMs: number
}

/** Raw bars longer than this are refused outright; shorter ones are trimmed to two lines. */
const MAX_RAW_LENGTH = 400

const isKind = (kind: unknown): kind is EnemyKind => typeof kind === 'string' && kind in CYPHERS

/** The request, or an error message for a 400. */
export function parseJudgeRequest(body: unknown): JudgeRequest | string {
  if (typeof body !== 'object' || body === null) return 'Expected a JSON object'
  const { enemyKind, promptId, playerBar, playerId } = body as Record<string, unknown>
  if (!isKind(enemyKind)) return 'Unknown enemyKind'
  if (
    typeof promptId !== 'number' ||
    !Number.isInteger(promptId) ||
    !CYPHERS[enemyKind][promptId]
  ) {
    return 'Unknown promptId'
  }
  if (typeof playerBar !== 'string' || !cleanBar(playerBar)) return 'Empty playerBar'
  if (playerBar.length > MAX_RAW_LENGTH) return 'playerBar too long'
  const id = typeof playerId === 'string' && /^[\w-]{1,64}$/.test(playerId) ? playerId : null
  return { enemyKind, promptId, playerBar: cleanBar(playerBar), playerId: id }
}

const RHYME_CHECK: Record<RhymeType, string> = {
  perfect: 'perfect rhyme',
  slant: 'slant rhyme',
  consonance: 'only the end consonants match',
  repeat: 'repeats the same word',
  none: 'no rhyme',
}

const round = (value: number, places: number) => Math.round(value * 10 ** places) / 10 ** places

export async function judgeBar(
  request: JudgeRequest,
  deps: { jev?: (input: JevInput) => Promise<JevResult>; now?: () => number } = {},
): Promise<{ response: JudgeResponse; log: BarLogEntry }> {
  const now = deps.now ?? Date.now
  const started = now()
  const enemyBar = CYPHERS[request.enemyKind][request.promptId]?.bar ?? ''
  const rhyme = rhymeScore(enemyBar, request.playerBar)

  const jev = await (deps.jev ?? judgeWithJev)({
    enemyBar,
    playerBar: request.playerBar,
    // Guessed pronunciations are left to Jev's ear rather than our guess.
    rhymeCheck: rhyme.confidence === 'low' ? 'unknown' : RHYME_CHECK[rhyme.type],
  })

  // For slang and made-up words, trust Jev's ear (discounted) when it hears more than we did.
  const rhymeUsed =
    rhyme.confidence === 'low' && jev.judged
      ? Math.max(rhyme.score, 0.8 * jev.rhymesByEar)
      : rhyme.score

  const response: JudgeResponse = {
    rhyme: round(rhymeUsed, 2),
    rhymeType: rhyme.type,
    quality: round(jev.quality, 1),
    rejected: jev.rejected,
    judged: jev.judged,
  }
  return {
    response,
    log: {
      ts: new Date(started).toISOString(),
      playerId: request.playerId,
      enemyKind: request.enemyKind,
      promptId: request.promptId,
      enemyBar,
      playerBar: request.playerBar,
      rhyme,
      jev,
      response,
      latencyMs: now() - started,
    },
  }
}
