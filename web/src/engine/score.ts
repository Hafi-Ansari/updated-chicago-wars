import type { GameState } from './types'

/** End-of-run score: distance, fights won, clout earned, and a big bonus for taking the crown. */
export function scoreRun(state: GameState): number {
  const { stats, block, phase } = state
  return (
    block * 100 +
    stats.enemiesDefeated * 50 +
    stats.cloutEarned +
    (phase.kind === 'victory' ? 1000 : 0)
  )
}
