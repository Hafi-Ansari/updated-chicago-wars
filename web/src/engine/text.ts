export type TextVars = Readonly<Record<string, string | number>>

/** Replaces {placeholders} with values; unknown placeholders are left as-is. */
export function fill(text: string, vars: TextVars): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  )
}

export const STAT_LABELS = {
  maxHp: 'Max HP',
  atk: 'Attack',
  def: 'Defense',
  spd: 'Speed',
  crit: 'Crit chance',
} as const
