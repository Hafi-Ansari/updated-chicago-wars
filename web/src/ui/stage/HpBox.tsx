import type { Stats, StatusEffect, StatusKind } from '../../engine'

const STATUS_TAGS: Record<StatusKind, { label: string; color: string }> = {
  stunned: { label: 'STN', color: 'var(--hp-mid)' },
  bleeding: { label: 'BLD', color: 'var(--danger)' },
  pumped: { label: 'PMP', color: 'var(--clout)' },
  shook: { label: 'SHK', color: 'var(--info)' },
  hyped: { label: 'HYP', color: 'var(--accent-2)' },
  guarded: { label: 'GRD', color: 'var(--accent)' },
  dazed: { label: 'DZD', color: '#c9b2ff' },
  frostbit: { label: 'FRZ', color: '#a4e9ff' },
  vibing: { label: 'VIB', color: 'var(--reward)' },
  weakened: { label: 'WKN', color: '#ffb3b3' },
  hobbled: { label: 'HBL', color: '#e0c27a' },
}

interface HpBoxProps {
  name: string
  subtitle: string
  hp: number
  maxHp: number
  showNumbers: boolean
  statuses: StatusEffect[]
  /** Revealed stats (Aviator Glasses). */
  stats?: Stats | undefined
  side: 'hero' | 'enemy'
}

export function HpBox({
  name,
  subtitle,
  hp,
  maxHp,
  showNumbers,
  statuses,
  stats,
  side,
}: HpBoxProps) {
  const ratio = Math.max(0, Math.min(1, hp / maxHp))
  const level = ratio > 0.5 ? 'high' : ratio > 0.2 ? 'mid' : 'low'

  return (
    <div className={`hpbox hpbox--${side} panel`}>
      <div className="hpbox__head">
        <span className="hpbox__name pixel">{name}</span>
        <span className="hpbox__sub">{subtitle}</span>
      </div>
      <div className="hpbox__row">
        <span className="hpbox__label pixel">HP</span>
        <div className="hpbar" aria-hidden="true">
          <div
            className={`hpbar__fill hpbar__fill--${level}`}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>
      <span className="sr-only">
        {name}: {hp} of {maxHp} HP
      </span>
      {(statuses.length > 0 || showNumbers) && (
        <div className="hpbox__foot">
          <span className="hpbox__tags">
            {statuses.map((s) => (
              <span key={s.kind} className="tag" style={{ background: STATUS_TAGS[s.kind].color }}>
                {STATUS_TAGS[s.kind].label}
              </span>
            ))}
          </span>
          {showNumbers && (
            <span className="hpbox__nums pixel">
              {hp}/{maxHp}
            </span>
          )}
        </div>
      )}
      {stats && (
        <div className="hpbox__stats">
          ATK {stats.atk} · DEF {stats.def} · SPD {stats.spd}
        </div>
      )}
    </div>
  )
}
