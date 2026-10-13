/**
 * Battle Rap judging endpoint (a Vercel Node function).
 *
 *   POST /api/judge-bar  { enemyKind, promptId, playerBar, playerId? }
 *     → { rhyme, rhymeType, quality, rejected, judged }
 *   GET  /api/judge-bar  → { ok: true }   (the game checks this before offering typing)
 *
 * Needs TYPESAFE_API_KEY. Without it every bar is scored on its rhyme alone. Shared code
 * lives in ../server/ so this is the only function Vercel builds.
 */

import { waitUntil } from '@vercel/functions'
import { logBar } from '../server/barLog.js'
import { judgeBar, parseJudgeRequest } from '../server/judgeBar.js'

const noStore = { 'Cache-Control': 'no-store' }

export async function POST(request: Request): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: noStore })
  }
  const parsed = parseJudgeRequest(body)
  if (typeof parsed === 'string') {
    return Response.json({ error: parsed }, { status: 400, headers: noStore })
  }

  const { response, log } = await judgeBar(parsed)
  // Logging finishes after the response is sent, so it never slows the verdict down.
  waitUntil(logBar(log))
  return Response.json(response, { headers: noStore })
}

export function GET(): Response {
  return Response.json({ ok: true }, { headers: noStore })
}
