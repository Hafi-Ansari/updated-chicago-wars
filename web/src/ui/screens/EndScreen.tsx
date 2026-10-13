import { useEffect, useRef, useState } from 'react'
import { type GameState, scoreRun } from '../../engine'
import { loadBest, writeBest } from '../storage'

interface EndScreenProps {
  state: GameState
  onDone: () => void
}

export function EndScreen({ state, onDone }: EndScreenProps) {
  const won = state.phase.kind === 'victory'
  const score = scoreRun(state)
  const [best] = useState(loadBest)
  const isRecord = score > best
  const again = useRef<HTMLButtonElement>(null)

  useEffect(() => again.current?.focus(), [])

  useEffect(() => {
    if (isRecord) writeBest(score)
  }, [isRecord, score])

  const { stats } = state
  const rows: [string, string | number][] = [
    ['Blocks walked', state.block],
    ['Opps defeated', stats.enemiesDefeated],
    ['Damage dealt', stats.damageDealt],
    ['Damage taken', stats.damageTaken],
    ['Critical hits', stats.crits],
    ['Clout earned', stats.cloutEarned],
    ['Clout blown', stats.cloutSpent],
    ['Times you dipped', stats.timesFled],
    ['Hot dogs demolished', stats.hotDogsEaten],
  ]
  if (stats.enemiesFled > 0) {
    rows.splice(2, 0, ['Opps who ran off', stats.enemiesFled])
  }
  if (stats.ketchupIncidents > 0) {
    rows.push(['Hot dog stands banned from', stats.ketchupIncidents])
  }

  return (
    <div className="end-overlay">
      <section className={`end-card panel ${won ? 'end-card--won' : 'end-card--lost'}`}>
        <h2 className="end-card__title pixel">{won ? 'King of Chicago' : 'Game Over'}</h2>
        <p className="end-card__sub">
          {won
            ? `${state.hero.name} took the crown at The Bean. The city is yours.`
            : `${state.hero.name} got dropped. The streets remember... kinda.`}
        </p>
        <dl className="stats-grid stats-grid--end">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className="pixel">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="end-card__score pixel">
          Score {score}
          {isRecord ? (
            <span className="tag tag--record">New best!</span>
          ) : (
            <span className="muted-text"> · best {best}</span>
          )}
        </p>
        <button type="button" className="btn btn--primary" onClick={onDone} ref={again}>
          Run it back
        </button>
      </section>
    </div>
  )
}
