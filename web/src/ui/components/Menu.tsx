import { useEffect, useState } from 'react'
import { sfx } from '../audio/sfx'

export interface MenuOption {
  key: string
  label: string
  /** Short right-aligned note, e.g. "PP 5/6" or "12 clout". */
  sub?: string | undefined
  /** Longer description, shown in the detail line while the option is hovered or focused. */
  hint?: string | undefined
  disabled?: boolean
  primary?: boolean
  /** Spans every column (Battle Rap under the 2×2 battle grid). */
  wide?: boolean
  /** A glowing gold button for something special that just became available. */
  variant?: 'gold' | undefined
  onSelect: () => void
}

interface MenuProps {
  options: MenuOption[]
  columns?: 1 | 2
  /** Escape / Backspace handler for submenus. */
  onBack?: (() => void) | undefined
  label: string
  /**
   * Show every option's description inside its button on all screens, not just touch.
   * For menus whose descriptions matter for the choice (the shop), where a detail line
   * under a long list ends up out of sight.
   */
  inlineHints?: boolean
}

function select(option: MenuOption): void {
  if (option.key === 'back') sfx.back()
  else sfx.select()
  option.onSelect()
}

/**
 * A list of actions; number keys 1–9 pick them, Esc goes back. Like the Gen-3
 * move menu, buttons stay compact and the active option's description shows
 * underneath (or inline on touch screens).
 */
export function Menu({ options, columns = 1, onBack, label, inlineHints = false }: MenuProps) {
  const [active, setActive] = useState<string | null>(null)
  const detail = inlineHints
    ? undefined
    : (options.find((o) => o.key === active)?.hint ?? options.find((o) => o.hint)?.hint)
  const hasHints = options.some((o) => o.hint)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if ((e.key === 'Escape' || e.key === 'Backspace') && onBack) {
        e.preventDefault()
        sfx.back()
        onBack()
        return
      }
      const index = Number.parseInt(e.key, 10) - 1
      const option = options[index]
      if (option && !option.disabled) {
        e.preventDefault()
        select(option)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [options, onBack])

  return (
    <div className="menu-wrap">
      <nav
        className={`menu menu--cols-${columns} ${hasHints ? 'menu--has-hints' : ''} ${inlineHints ? 'menu--inline-hints' : ''}`}
        aria-label={label}
      >
        {options.map((option, i) => (
          <button
            key={option.key}
            type="button"
            className={[
              'btn',
              option.primary ? 'btn--primary' : '',
              option.wide ? 'btn--wide' : '',
              option.variant === 'gold' ? 'btn--gold' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={option.disabled}
            onClick={() => select(option)}
            onMouseEnter={() => setActive(option.key)}
            onFocus={() => setActive(option.key)}
            title={inlineHints ? undefined : option.hint}
          >
            <span className="key">{i + 1}</span>
            <span className="btn__label">
              {option.label}
              {/* Touch screens have no hover, so they show descriptions inline instead. */}
              {option.hint && <span className="btn__hint">{option.hint}</span>}
            </span>
            {option.sub && <span className="sub">{option.sub}</span>}
          </button>
        ))}
      </nav>
      {detail && <p className="menu__detail">{detail}</p>}
    </div>
  )
}
