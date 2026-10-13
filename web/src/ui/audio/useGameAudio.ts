import { useEffect } from 'react'
import { type GameEvent, type GameState, isGauntlet, type StatusKind } from '../../engine'
import type { PlayingEvent } from '../useGame'
import { music, type SongId } from './music'
import { sfx } from './sfx'

const GOOD_STATUSES: ReadonlySet<StatusKind> = new Set([
  'pumped',
  'hyped',
  'guarded',
  'vibing',
  'mirrored',
])

/** The sound cue for an engine event, if it has one. Text events get typewriter blips instead. */
function cueFor(event: GameEvent): (() => void) | null {
  switch (event.type) {
    case 'hit':
      if (event.crit) return sfx.crit
      return event.attacker === 'hero' ? sfx.hit : sfx.hurt
    case 'miss':
      return sfx.miss
    case 'tick':
    case 'selfHit':
    case 'recoil':
      return sfx.hurt
    case 'reflect':
      return event.target === 'hero' ? sfx.hurt : sfx.hit
    case 'heal':
      return event.amount > 0 ? sfx.heal : null
    case 'status': {
      if (event.change === 'expired') return null
      const good = GOOD_STATUSES.has(event.status)
      // Good for the hero = a buff on you, or a debuff on them.
      return good === (event.target === 'hero') ? sfx.buff : sfx.debuff
    }
    case 'clout':
      return event.amount >= 0 ? sfx.coin : sfx.spend
    case 'levelUp':
      return sfx.levelUp
    case 'moveLearned':
    case 'skillLearned':
      return sfx.learn
    case 'appear':
      return sfx.appear
    case 'location':
      return sfx.location
    case 'faint':
      return sfx.faint
    case 'fled':
      return sfx.flee
    case 'locked':
      return sfx.debuff
    case 'rapUnlocked':
      return sfx.learn
    case 'cypher':
      return { flop: sfx.deny, decent: sfx.coin, fire: sfx.buff, legendary: sfx.levelUp }[
        event.tier
      ]
    default:
      return null
  }
}

function songFor(state: GameState): SongId | null {
  switch (state.phase.kind) {
    case 'battle':
      return isGauntlet(state.phase.battle.enemy.kind) ? 'boss' : 'battle'
    case 'gameOver':
    case 'victory':
      return null
    default:
      return 'street'
  }
}

/** Plays the right song for the screen and a cue for each event as it plays. */
export function useGameAudio(
  shown: GameState | null,
  current: PlayingEvent | null,
  busy: boolean,
): void {
  const song = shown ? songFor(shown) : null
  useEffect(() => {
    music.play(song)
  }, [song])
  useEffect(() => () => music.play(null), [])

  useEffect(() => {
    if (current) cueFor(current.event)?.()
  }, [current])

  const ending = !busy && shown ? shown.phase.kind : null
  useEffect(() => {
    if (ending === 'victory') sfx.victory()
    if (ending === 'gameOver') sfx.gameOver()
  }, [ending])
}
