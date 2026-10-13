/**
 * localStorage helpers. Storage can be missing or throw (private mode, blocked
 * site data), so every access is wrapped and the game works without it.
 */

import { type GameState, migrateSave } from '../engine'

const SAVE_KEY = 'chicago-wars/save'
/** Where saves lived when the version was part of the key; read once, then cleared. */
const OLD_SAVE_KEY = 'chicago-wars/save/v2'
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

export const loadSave = (): GameState | null =>
  migrateSave(read<unknown>(SAVE_KEY) ?? read<unknown>(OLD_SAVE_KEY))

export const writeSave = (state: GameState | null) => {
  write(SAVE_KEY, state)
  write(OLD_SAVE_KEY, null)
}

export const loadBest = (): number => read<number>(BEST_KEY) ?? 0
export const writeBest = (score: number) => write(BEST_KEY, score)

export type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant'

/** How Battle Rap comebacks are entered; `auto` picks on touch screens and types elsewhere. */
export type RapInput = 'auto' | 'type' | 'pick'

export interface Settings {
  textSpeed: TextSpeed
  autoAdvance: boolean
  scanlines: boolean
  music: boolean
  sfx: boolean
  rapInput: RapInput
}

export const DEFAULT_SETTINGS: Settings = {
  textSpeed: 'normal',
  autoAdvance: false,
  scanlines: false,
  music: true,
  sfx: true,
  rapInput: 'auto',
}

export const loadSettings = (): Settings => ({
  ...DEFAULT_SETTINGS,
  ...read<Partial<Settings>>(SETTINGS_KEY),
})
export const writeSettings = (settings: Settings) => write(SETTINGS_KEY, settings)
