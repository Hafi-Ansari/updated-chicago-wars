/**
 * Loading saves from older versions of the game. Runs in progress on the live
 * site shouldn't vanish when the state shape changes, so each version bump adds
 * a step here that fills in what's new.
 */

import { NPCS } from '../content/npcs'
import type { GameState, MoveId } from './types'

export const SAVE_VERSION: GameState['version'] = 4

/** Brings a save up to the current GameState shape, or returns null if it can't. */
export function migrateSave(save: unknown): GameState | null {
  if (!isRecord(save) || typeof save.version !== 'number') return null
  // structuredClone keeps the caller's object untouched; saves are plain JSON.
  const state = structuredClone(save) as Record<string, unknown>
  if (state.version === 2) fromV2(state)
  if (state.version === 3) fromV3(state)
  return state.version === SAVE_VERSION ? (state as unknown as GameState) : null
}

/**
 * v2 → v3: the Gangsta's random lesson and stat offer became a free playbook and fixed
 * training, battles track enemy locks and per-fight move limits, and enemies can run.
 */
function fromV2(state: Record<string, unknown>): void {
  const hero = state.hero as { moves: { id: MoveId }[] }
  state.seenMoves = hero.moves.map((m) => m.id)
  delete state.movesTaught
  ;(state.stats as Record<string, unknown>).enemiesFled = 0

  const phase = state.phase as Record<string, unknown>
  const npc = phase.npc as Record<string, unknown> | undefined
  if (npc) {
    delete npc.offer
    delete npc.lesson
  }
  if (phase.kind === 'battle') {
    const battle = phase.battle as Record<string, unknown>
    battle.lastMove = null
    battle.lockedMoves = []
    battle.lockedGear = []
    battle.enemyMoveUses = []
    battle.enemyLastMove = null
    battle.enemyFled = false
    battle.enemyRally = false
  }
  if (phase.kind === 'learnMove') {
    // A paid lesson in progress: the move is free now.
    delete phase.price
  }
  if (phase.kind === 'dialogue' && npc) {
    // Mid-conversation at a node that no longer exists: pick it back up at the menu.
    const nodes = NPCS[npc.id as keyof typeof NPCS].nodes
    if (!(String(phase.node) in nodes)) phase.node = 'menu' in nodes ? 'menu' : 'intro'
  }
  state.version = 3
}

/** v3 → v4: Battle Rap. A battle saved mid-fight starts with it locked and unspent. */
function fromV3(state: Record<string, unknown>): void {
  const phase = state.phase as Record<string, unknown>
  if (phase.kind === 'battle') {
    const battle = phase.battle as Record<string, unknown>
    battle.rapUnlocked = false
    battle.rapUsed = false
    battle.cypher = null
  }
  state.version = 4
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
