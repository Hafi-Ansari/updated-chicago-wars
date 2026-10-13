/**
 * Battle Rap: the enemy's bar is on screen and the hero has 30 seconds to answer, by
 * typing (judged on the server) or by picking one of three comebacks. The judge is never
 * allowed to cost the player their turn: if it can't be reached, typing gives way to picking.
 */

import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import {
  type Action,
  type BarResult,
  type BattleState,
  cleanBar,
  cypherPrompt,
  MAX_BAR_LINE_LENGTH,
} from '../../engine'
import { sfx } from '../audio/sfx'
import { judgeBar, judgeReachable } from '../judge'
import type { RapInput } from '../storage'
import { Menu, type MenuOption } from './Menu'

export const RAP_SECONDS = 30
/** If the judge drops out mid-bar, picking still gets at least this long. */
const PICK_SECONDS_AFTER_FAILURE = 10

type Mode = 'checking' | 'type' | 'pick'

interface RapBattleProps {
  battle: BattleState
  act: (action: Action) => void
  input: RapInput
}

/** The word to rhyme with: the last word of the enemy's bar. */
function rhymeTarget(bar: string): string {
  const words = bar.trim().split(/\s+/)
  return (words.at(-1) ?? '').replace(/[^A-Za-z']/g, '').toLowerCase()
}

/** Keeps the draft to two lines of MAX_BAR_LINE_LENGTH characters while typing. */
function limitDraft(text: string): string {
  return text
    .split('\n')
    .slice(0, 2)
    .map((line) => line.slice(0, MAX_BAR_LINE_LENGTH))
    .join('\n')
}

export function RapBattle({ battle, act, input }: RapBattleProps) {
  const cypher = battle.cypher
  const [mode, setMode] = useState<Mode>(input === 'pick' ? 'pick' : 'checking')
  const [notice, setNotice] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [judging, setJudging] = useState(false)
  const [deadline, setDeadline] = useState(() => Date.now() + RAP_SECONDS * 1000)
  const [now, setNow] = useState(() => Date.now())
  const answered = useRef(false)

  const spit = useCallback(
    (bar: BarResult) => {
      if (answered.current) return
      answered.current = true
      act({ type: 'spit', bar })
    },
    [act],
  )

  const fallBackToPicking = useCallback((message: string) => {
    setMode('pick')
    setNotice(message)
    setDeadline((d) => Math.max(d, Date.now() + PICK_SECONDS_AFTER_FAILURE * 1000))
  }, [])

  // Typing needs the judge, so make sure it's there before the player starts writing.
  useEffect(() => {
    if (mode !== 'checking') return
    let live = true
    judgeReachable().then((ok) => {
      if (!live) return
      if (ok) setMode('type')
      else fallBackToPicking('The judges are offline. Pick a line!')
    })
    return () => {
      live = false
    }
  }, [mode, fallBackToPicking])

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(timer)
  }, [])

  const submit = useCallback(
    async (raw: string) => {
      if (!cypher || judging || answered.current) return
      const bar = cleanBar(raw)
      if (!bar) {
        spit({ kind: 'timeout' })
        return
      }
      sfx.select()
      setJudging(true)
      try {
        const verdict = await judgeBar({
          enemyKind: battle.enemy.kind,
          promptId: cypher.prompt,
          playerBar: bar,
        })
        spit({ kind: 'typed', text: bar, ...verdict })
      } catch {
        setJudging(false)
        fallBackToPicking('The judges lost the signal. Pick a line!')
      }
    },
    [battle.enemy.kind, cypher, judging, spit, fallBackToPicking],
  )

  const secondsLeft = Math.max(0, Math.ceil((deadline - now) / 1000))

  // Time's up: send what's written (if anything), otherwise the hero froze.
  useEffect(() => {
    if (secondsLeft > 0 || judging || answered.current) return
    if (mode === 'type' && cleanBar(draft)) void submit(draft)
    else spit({ kind: 'timeout' })
  }, [secondsLeft, judging, mode, draft, submit, spit])

  if (!cypher) return null
  const prompt = cypherPrompt(battle.enemy.kind, cypher)
  const fraction = Math.max(0, Math.min(1, (deadline - now) / (RAP_SECONDS * 1000)))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void submit(draft)
  }

  return (
    <section className="rap" aria-label="Battle Rap">
      <header className="rap__head">
        <span className="pixel rap__title">Battle Rap</span>
        <span
          className={`pixel rap__clock ${secondsLeft <= 5 && !judging ? 'rap__clock--low' : ''}`}
        >
          {judging ? '...' : `${secondsLeft}s`}
        </span>
      </header>
      <div className="rap__timer" aria-hidden="true">
        <div className="rap__timer-fill" style={{ width: `${fraction * 100}%` }} />
      </div>
      <p className="rap__prompt">{prompt.bar}</p>

      {mode === 'type' && (
        <form className="rap__form" onSubmit={onSubmit}>
          <textarea
            className="rap__input"
            rows={2}
            value={draft}
            disabled={judging}
            // biome-ignore lint/a11y/noAutofocus: the clock is running; the input is the only thing to do
            autoFocus
            spellCheck={false}
            aria-label="Your comeback, two lines"
            placeholder={`Two lines. End on a word that rhymes with "${rhymeTarget(prompt.bar)}".`}
            onChange={(e) => setDraft(limitDraft(e.target.value))}
            onFocus={(e) => {
              const field = e.currentTarget
              // Phones: keep the box above the on-screen keyboard.
              setTimeout(() => field.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300)
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || e.nativeEvent.isComposing) return
              // Enter ends line one, then spits: phone keyboards have no Shift+Enter.
              const [first = '', second] = draft.split('\n')
              if (second === undefined && first.trim()) return
              e.preventDefault()
              if (second?.trim()) void submit(draft)
            }}
          />
          <div className="rap__row">
            <span className="rap__hint">Enter for line two · Enter again to spit</span>
            <button type="submit" className="btn btn--gold" disabled={judging || !cleanBar(draft)}>
              Spit it
            </button>
          </div>
        </form>
      )}

      {mode === 'pick' && (
        <Menu
          label="Pick your comeback"
          options={cypher.answers.map(
            (index): MenuOption => ({
              key: String(index),
              label: prompt.answers[index]?.text ?? '',
              wide: true,
              onSelect: () => spit({ kind: 'picked', answer: index }),
            }),
          )}
        />
      )}

      {mode === 'checking' && <p className="rap__note">Checking the judges...</p>}
      {judging && <p className="rap__note pixel">The crowd is deciding...</p>}
      {notice && !judging && <p className="rap__note rap__note--warn">{notice}</p>}
    </section>
  )
}
