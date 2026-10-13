/**
 * Bridges the pure engine and React.
 *
 * Every player action runs `step()` immediately, but the resulting events are
 * *played back* one at a time (typewriter text, hit flashes, HP drains) before
 * the player can act again. While events play, the screen shows `display`
 * values (HP, clout) that catch up event by event instead of jumping to the end.
 */

import { useCallback, useEffect, useReducer } from 'react'
import { type Action, type GameEvent, type GameState, newGame, step } from '../engine'
import { loadSave, writeSave } from './storage'

export interface Display {
  heroHp: number
  enemyHp: number
  clout: number
}

export interface PlayingEvent {
  id: number
  event: GameEvent
}

interface ViewState {
  /** The engine's latest state. */
  game: GameState | null
  /** What the screen renders; lags behind `game` while a battle's ending plays out. */
  shown: GameState | null
  queue: GameEvent[]
  current: PlayingEvent | null
  display: Display
  nextId: number
  /** Increments per new or resumed run, so screens can remount fresh. */
  runId: number
}

type ViewAction =
  | { type: 'load'; game: GameState; events: GameEvent[] }
  | { type: 'act'; action: Action }
  | { type: 'advance' }
  | { type: 'quit' }

const displayOf = (state: GameState | null): Display => ({
  heroHp: state?.hero.hp ?? 0,
  enemyHp: state?.phase.kind === 'battle' ? state.phase.battle.enemy.hp : 0,
  clout: state?.hero.clout ?? 0,
})

/** Pops the next event off the queue and applies its effect on displayed numbers. */
function playNext(view: ViewState): ViewState {
  const [event, ...queue] = view.queue
  if (!event) {
    // Playback finished: catch the screen up with the engine.
    return { ...view, current: null, shown: view.game, display: displayOf(view.game) }
  }

  const display = { ...view.display }
  switch (event.type) {
    case 'hit':
    case 'tick':
    case 'heal':
    case 'selfHit':
    case 'recoil':
    case 'reflect':
      if (event.target === 'hero') display.heroHp = event.hpAfter
      else display.enemyHp = event.hpAfter
      break
    case 'clout':
      display.clout = event.total
      break
    case 'appear':
      // A new fight: show the enemy at full health as it slides in.
      if (view.game?.phase.kind === 'battle')
        display.enemyHp = view.game.phase.battle.enemy.stats.maxHp
      break
  }
  return { ...view, queue, display, current: { id: view.nextId, event }, nextId: view.nextId + 1 }
}

function reducer(view: ViewState, action: ViewAction): ViewState {
  switch (action.type) {
    case 'load':
      return playNext({
        ...view,
        game: action.game,
        shown: action.game,
        queue: action.events,
        display: displayOf(action.game),
        runId: view.runId + 1,
      })

    case 'act': {
      const prev = view.game
      if (!prev || view.current) return view
      const result = step(prev, action.action)
      if (result.state === prev) return view

      const next = result.state
      // Keep the battle on screen until its final blows, faint and rewards have played.
      const holdBattle = prev.phase.kind === 'battle' && next.phase.kind !== 'battle'
      return playNext({
        ...view,
        game: next,
        shown: holdBattle ? prev : next,
        queue: result.events,
      })
    }

    case 'advance':
      return view.current ? playNext(view) : view

    case 'quit':
      return { ...initialView(), runId: view.runId }
  }
}

const initialView = (): ViewState => ({
  game: null,
  shown: null,
  queue: [],
  current: null,
  display: displayOf(null),
  nextId: 0,
  runId: 0,
})

export function useGame() {
  const [view, dispatch] = useReducer(reducer, undefined, initialView)

  // Autosave whenever the engine state settles.
  useEffect(() => {
    if (view.game && !view.current) {
      const over = view.game.phase.kind === 'gameOver' || view.game.phase.kind === 'victory'
      writeSave(over ? null : view.game)
    }
  }, [view.game, view.current])

  const start = useCallback((name: string) => {
    const seed = crypto.getRandomValues(new Uint32Array(1))[0] ?? Date.now()
    const { state, events } = newGame(name, seed)
    dispatch({ type: 'load', game: state, events })
  }, [])

  const resume = useCallback(() => {
    const save = loadSave()
    if (save) {
      dispatch({
        type: 'load',
        game: save,
        events: [{ type: 'narrate', text: `Welcome back, ${save.hero.name}.`, tone: 'info' }],
      })
    }
  }, [])

  return {
    game: view.game,
    shown: view.shown,
    current: view.current,
    display: view.display,
    busy: view.current !== null,
    /** True until this step's foe has been introduced, so it doesn't appear early. */
    foeHidden: view.queue.some((e) => e.type === 'appear'),
    runId: view.runId,
    start,
    resume,
    act: useCallback((action: Action) => dispatch({ type: 'act', action }), []),
    advance: useCallback(() => dispatch({ type: 'advance' }), []),
    quit: useCallback(() => {
      dispatch({ type: 'quit' })
    }, []),
  }
}

export type GameController = ReturnType<typeof useGame>
