import { useEffect, useMemo, useRef, useState } from 'react'
import { NEIGHBORHOODS } from '../../content/names'
import { BLOCKS_PER_RUN, type GameEvent, type GameState } from '../../engine'
import { useGameAudio } from '../audio/useGameAudio'
import { ActionPanel } from '../components/ActionPanel'
import { SettingsMenu } from '../components/SettingsMenu'
import { StatsCard } from '../components/StatsCard'
import { TextBox } from '../components/TextBox'
import { describe, type Line } from '../narration'
import { Stage } from '../stage/Stage'
import type { Settings } from '../storage'
import type { GameController } from '../useGame'
import { EndScreen } from './EndScreen'

interface GameScreenProps {
  controller: GameController
  settings: Settings
  onSettings: (settings: Settings) => void
}

/** How long purely visual events hold the screen before moving on. */
const VISUAL_EVENT_MS: Partial<Record<GameEvent['type'], number>> = {
  appear: 650,
  faint: 1100,
  fled: 600,
}

const HISTORY_LINES = 2

function promptFor(state: GameState): string {
  switch (state.phase.kind) {
    case 'explore':
      return state.block === 0
        ? 'The night is young. Hit the streets?'
        : 'The block is quiet... for now.'
    case 'battle':
      return state.phase.battle.opening
        ? 'Where do you strike?'
        : `What will ${state.hero.name} do?`
    case 'dialogue':
      return 'What do you say?'
    case 'shop':
      return 'What are you copping?'
    case 'learnMove':
      return state.phase.price > 0 ? 'Ready to train?' : 'Learn a new move?'
    case 'gameOver':
    case 'victory':
      return ''
  }
}

export function GameScreen({ controller, settings, onSettings }: GameScreenProps) {
  const { shown, game, current, display, busy, foeHidden, act, advance, quit } = controller
  useGameAudio(shown, current, busy)
  const [history, setHistory] = useState<Line[]>([])
  const [panel, setPanel] = useState<'stats' | 'settings' | null>(null)

  const names = useMemo(
    () => ({
      hero: shown?.hero.name ?? '',
      enemy: shown?.phase.kind === 'battle' ? shown.phase.battle.enemy.name : '',
    }),
    [shown],
  )
  const line = current ? describe(current.event, names) : null

  // When an event finishes, its line moves up into the history above the box.
  const previous = useRef<Line | null>(null)
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once per event
  useEffect(() => {
    const finished = previous.current
    if (finished) setHistory((h) => [...h, finished].slice(-HISTORY_LINES))
    previous.current = line
  }, [current?.id])

  // Visual-only events (sprite slide-ins, faints) advance on their own.
  useEffect(() => {
    if (!current || line) return
    const timer = setTimeout(advance, VISUAL_EVENT_MS[current.event.type] ?? 300)
    return () => clearTimeout(timer)
  }, [current, line, advance])

  if (!shown || !game) return null

  const over = !busy && (shown.phase.kind === 'gameOver' || shown.phase.kind === 'victory')
  const neighborhood =
    shown.block > 0 ? NEIGHBORHOODS[(shown.block - 1) % NEIGHBORHOODS.length] : 'Downtown'

  return (
    <div
      className={`game ${settings.scanlines ? 'game--scanlines' : ''}`}
      data-event={current?.event.type ?? 'idle'}
    >
      <header className="hud">
        <span className="hud__logo pixel">Chicago Wars</span>
        <span className="hud__where">
          <span className="pixel">
            Block {shown.block}/{BLOCKS_PER_RUN}
          </span>{' '}
          · {neighborhood}
        </span>
        <span className="hud__clout pixel" title="Clout">
          ★ {display.clout}
        </span>
        <button
          type="button"
          className="btn hud__icon"
          onClick={() => {
            const on = !(settings.music || settings.sfx)
            onSettings({ ...settings, music: on, sfx: on })
          }}
          aria-label={settings.music || settings.sfx ? 'Mute sound' : 'Unmute sound'}
          aria-pressed={!(settings.music || settings.sfx)}
        >
          {settings.music || settings.sfx ? '🔊' : '🔇'}
        </button>
        <button
          type="button"
          className="btn hud__icon"
          onClick={() => setPanel('settings')}
          aria-label="Settings"
        >
          ⚙
        </button>
      </header>

      <Stage state={shown} current={current} display={display} foeHidden={foeHidden} />

      <section className="console">
        <TextBox
          line={line}
          lineId={current?.id ?? null}
          history={history}
          prompt={promptFor(shown)}
          speed={settings.textSpeed}
          autoAdvance={settings.autoAdvance}
          onAdvance={advance}
        />
        <div className={`actions panel ${busy ? 'actions--busy' : ''}`}>
          {busy ? (
            <p className="actions__wait pixel">
              {settings.autoAdvance ? '...' : 'Space / click ▼'}
            </p>
          ) : (
            <ActionPanel
              key={shown.phase.kind}
              state={shown}
              act={act}
              onShowStats={() => setPanel('stats')}
            />
          )}
        </div>
      </section>

      {over && <EndScreen state={shown} onDone={quit} />}
      {panel === 'stats' && <StatsCard hero={shown.hero} onClose={() => setPanel(null)} />}
      {panel === 'settings' && (
        <SettingsMenu
          settings={settings}
          onChange={onSettings}
          onClose={() => setPanel(null)}
          onQuit={quit}
        />
      )}
    </div>
  )
}
