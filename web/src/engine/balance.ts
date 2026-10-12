/**
 * Every global tuning knob in one place. Per-item numbers (skill cooldowns,
 * opening outcomes, enemy moves) sit next to their content definitions.
 * The balance simulation in test/balance.sim.test.ts checks these values.
 */

import type { BoostableStat, EnemyKind, Stats } from './types'

// ── Hero ─────────────────────────────────────────────────────────────────────

export const HERO_START: Stats = { maxHp: 80, atk: 14, def: 9, spd: 10, crit: 0.08 }
export const HERO_START_CLOUT = 25
/** Share of max HP recovered after winning a fight. */
export const POST_FIGHT_HEAL = 0.35

/** "Rep" level-up: every N wins the hero gets a little stronger and can learn a move. */
export const LEVEL_UP = {
  winsPerLevel: 2,
  gains: { maxHp: 8, atk: 2, def: 1, spd: 1 },
} as const satisfies { winsPerLevel: number; gains: Partial<Record<BoostableStat, number>> }

/** Moves the hero can carry at once. */
export const MAX_MOVES = 6
/** The one move that can never be forgotten. */
export const UNFORGETTABLE_MOVE = 'jab'
/** New moves offered after every win. */
export const MOVES_OFFERED = 2
/** Highest move tier offered at a given level. */
export const maxMoveTier = (level: number): number => (level >= 4 ? 3 : level >= 2 ? 2 : 1)

// ── Damage ───────────────────────────────────────────────────────────────────

/**
 * Defense mitigation constant: damage × K / (K + def).
 * At def = K, half the damage is blocked; more defense always helps, never fully.
 */
export const DEFENSE_K = 50
export const DAMAGE_VARIANCE = 0.15
export const CRIT_MULTIPLIER = 1.5
export const MIN_DAMAGE = 1

export const DODGE = { base: 0.06, perSpeedDiff: 0.015, min: 0.03, max: 0.25 }
export const INITIATIVE_JITTER = 6
export const FLEE = { base: 0.5, perSpeedDiff: 0.04, min: 0.2, max: 0.9 }

/** Status modifiers. */
export const PUMPED_ATK_MULT = 1.35
export const SHOOK_DEF_MULT = 0.6
export const BLEED_PCT_PER_TURN = 0.06
export const HYPED_CRIT_BONUS = 0.25
export const GUARDED_DAMAGE_MULT = 0.5
export const FROSTBIT_SPD_MULT = 0.5
export const VIBING_HEAL_PCT = 0.08
export const WEAKENED_ATK_MULT = 0.65
export const HOBBLED_SPD_MULT = 0.5
/** Chance a dazed fighter hurts themselves instead of acting, and how hard. */
export const DAZED = { selfHitChance: 0.35, power: 0.4 }

// ── Openings ─────────────────────────────────────────────────────────────────

/** Chance per round that the enemy charges recklessly and leaves an opening. */
export const OPENING_CHANCE = 0.3
export const OPENING_TARGETS_OFFERED = 3

// ── Run structure ────────────────────────────────────────────────────────────

export const BLOCKS_PER_RUN = 12
/** Enemy stats grow by this fraction per block (block 6 = +30%). */
export const ENEMY_SCALING_PER_BLOCK = 0.05

/** What walking to the next block runs into. Vendors are visited by choice, not at random. */
export type EncounterKind = 'fight' | 'streetEvent'

export function encounterWeights(block: number): Record<EncounterKind, number> {
  return { fight: block <= 1 ? 4 : 6, streetEvent: 1 }
}

// ── Enemies ──────────────────────────────────────────────────────────────────

export type Range = readonly [min: number, max: number]

export interface EnemyStatRanges {
  maxHp: Range
  atk: Range
  def: Range
  spd: Range
  crit: number
  clout: Range
}

/** Base stats at block 0; scaled by ENEMY_SCALING_PER_BLOCK. */
export const ENEMY_STATS: Record<EnemyKind, EnemyStatRanges> = {
  goon: { maxHp: [20, 25], atk: [7, 9], def: [3, 5], spd: [7, 10], crit: 0.05, clout: [10, 14] },
  thug: { maxHp: [27, 34], atk: [9, 11], def: [5, 7], spd: [8, 11], crit: 0.06, clout: [14, 20] },
  biker: {
    maxHp: [36, 44],
    atk: [11, 13],
    def: [7, 10],
    spd: [9, 12],
    crit: 0.07,
    clout: [20, 28],
  },
  gangLeader: {
    maxHp: [46, 54],
    atk: [12, 15],
    def: [9, 12],
    spd: [10, 13],
    crit: 0.08,
    clout: [28, 36],
  },
  gangRapper: {
    maxHp: [52, 60],
    atk: [14, 16],
    def: [10, 13],
    spd: [11, 14],
    crit: 0.1,
    clout: [36, 46],
  },
  boss: {
    maxHp: [140, 140],
    atk: [20, 20],
    def: [16, 16],
    spd: [14, 14],
    crit: 0.12,
    clout: [0, 0],
  },
}

type TierWeights = Record<Exclude<EnemyKind, 'boss'>, number>

/** Which enemies show up, by how deep into the run the hero is. */
export function enemyWeights(block: number): TierWeights {
  if (block <= 3) return { goon: 6, thug: 3, biker: 1, gangLeader: 0, gangRapper: 0 }
  if (block <= 7) return { goon: 2, thug: 4, biker: 3, gangLeader: 1, gangRapper: 0.5 }
  return { goon: 1, thug: 3, biker: 4, gangLeader: 2, gangRapper: 1 }
}

// ── Economy ──────────────────────────────────────────────────────────────────

/** Line pools remember this share of their recent picks to avoid repeats. */
export const LINE_MEMORY = 0.6

/** Chances that characters chime in with a bar (so lines stay a treat, not a wall of text). */
export const SAY_CHANCE = {
  heroBattleStart: 0.6,
  heroVictory: 0.7,
  heroCrit: 0.4,
  heroLevelUp: 0.6,
  heroMove: 0.35,
  enemyTaunt: 0.45,
}

export const GANGSTA_STORY_CLOUT = 8
export const LESSON = { basePrice: 25, priceStep: 10 }
export const TRADE = {
  basePrice: 15,
  /** Each trade made this run adds this much to the next price. */
  priceStep: 8,
  gains: { maxHp: [8, 12], atk: [2, 4], def: [2, 3], spd: [1, 2] } satisfies Record<string, Range>,
} as const

export const HOT_DOG = { price: 12, healPct: 0.4 }
export const ITALIAN_BEEF = { price: 30, healPct: 1 }
