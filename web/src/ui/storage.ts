/**
 * localStorage helpers. Storage can be missing or throw (private mode, blocked
 * site data), so every access is wrapped and the game works without it.
 */

import type { GameState } from '../engine'

const SAVE_KEY = 'chicago-wars/save/v2'
const BEST_KEY = 'chicago-wars/best'
const SETTINGS_KEY = 'chicago-wars/settings'

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable: the game still works, it just won't remember.
  }
}

export const loadSave = (): GameState | null => {
  const save = read<GameState>(SAVE_KEY)
  return save?.version === 2 ? save : null
}
export const writeSave = (state: GameState | null) => write(SAVE_KEY, state)

export const loadBest = (): number => read<number>(BEST_KEY) ?? 0
export const writeBest = (score: number) => write(BEST_KEY, score)

export type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant'

export interface Settings {
  textSpeed: TextSpeed
  autoAdvance: boolean
  scanlines: boolean
  music: boolean
  sfx: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  textSpeed: 'normal',
  autoAdvance: false,
  scanlines: false,
  music: true,
  sfx: true,
}

export const loadSettings = (): Settings => ({
  ...DEFAULT_SETTINGS,
  ...read<Partial<Settings>>(SETTINGS_KEY),
})
export const writeSettings = (settings: Settings) => write(SETTINGS_KEY, settings)
