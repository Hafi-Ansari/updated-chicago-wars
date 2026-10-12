/**
 * The Gen-3 style message box: types the current line out, shows a blinking ▼
 * when done, and advances on click / Space / Enter (or automatically).
 */

import { useCallback, useEffect, useState } from 'react'
import { sfx, type Voice } from '../audio/sfx'
import type { Line } from '../narration'
import type { TextSpeed } from '../storage'

const MS_PER_CHAR: Record<TextSpeed, number> = { slow: 38, normal: 20, fast: 9, instant: 0 }

interface TextBoxProps {
  /** The line being played (null when waiting for player input). */
  line: Line | null
  lineId: number | null
  history: Line[]
  prompt: string
  speed: TextSpeed
  autoAdvance: boolean
  onAdvance: () => void
}

export function TextBox({
  line,
  lineId,
  history,
  prompt,
  speed,
  autoAdvance,
  onAdvance,
}: TextBoxProps) {
  const text = line?.text ?? ''
  const [typed, setTyped] = useState(0)
  const done = typed >= text.length

  // Restart typing for each new line.
  // biome-ignore lint/correctness/useExhaustiveDependencies: lineId identifies a new line
  useEffect(() => setTyped(MS_PER_CHAR[speed] === 0 ? text.length : 0), [lineId])

  useEffect(() => {
    if (done || !line) return
    const ms = MS_PER_CHAR[speed]
    if (ms === 0) {
      setTyped(text.length)
      return
    }
    const timer = setInterval(() => setTyped((n) => Math.min(text.length, n + 1)), ms)
    return () => clearInterval(timer)
  }, [done, line, speed, text.length])

  useEffect(() => {
    if (!line || !done || !autoAdvance) return
    const timer = setTimeout(onAdvance, Math.min(2400, 700 + text.length * 14))
    return () => clearTimeout(timer)
  }, [line, done, autoAdvance, onAdvance, text.length])

  // Typewriter blips: every other letter, pitched by who is talking.
  const voice: Voice = line?.speaker?.side ?? 'narrator'
  // biome-ignore lint/correctness/useExhaustiveDependencies: one blip per typed character
  useEffect(() => {
    if (!line || MS_PER_CHAR[speed] === 0 || typed % 2 !== 0) return
    if (text[typed - 1]?.trim()) sfx.blip(voice)
  }, [typed])

  const handle = useCallback(() => {
    if (!line) return
    if (done) {
      sfx.advance()
      onAdvance()
    } else setTyped(text.length)
  }, [line, done, onAdvance, text.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (!line) return
        e.preventDefault()
        handle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handle, line])

  return (
    <button
      type="button"
      className={`textbox panel ${line ? 'textbox--playing' : ''}`}
      onClick={handle}
      aria-live="polite"
      tabIndex={line ? 0 : -1}
    >
      <div className="textbox__history" aria-hidden="true">
        {history.map((h, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: history is append-only display
          <p key={i} className={`line line--${h.tone}`}>
            {h.speaker && (
              <span className={`speaker speaker--${h.speaker.side}`}>{h.speaker.name}: </span>
            )}
            {h.text}
          </p>
        ))}
      </div>
      {line ? (
        <p className={`line line--current line--${line.tone}`}>
          {line.speaker && (
            <span className={`speaker speaker--${line.speaker.side}`}>{line.speaker.name}: </span>
          )}
          {line.speaker ? `"${text.slice(0, typed)}${done ? '"' : ''}` : text.slice(0, typed)}
          {done && <span className="advance">▼</span>}
        </p>
      ) : (
        <p className="line line--current line--prompt">{prompt}</p>
      )}
    </button>
  )
}
