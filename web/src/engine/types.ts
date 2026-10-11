/**
 * Core data model. Everything in GameState is plain, JSON-serializable data:
 * no classes, no functions. Behavior lives in the engine's functions; flavor
 * (names, lines, prices) lives in `content/`.
 */

import type { RngState } from './rng'

// ── Identifiers ──────────────────────────────────────────────────────────────

export type Side = 'hero' | 'enemy'

export type EnemyKind = 'goon' | 'thug' | 'biker' | 'gangLeader' | 'gangRapper' | 'boss'

/** Hidden gear sold by the Plug (the original game's "hidden skills"). */
export type SkillId = 'airpods' | 'aviators' | 'durag' | 'taser' | 'glock'

/** Fighting moves the hero learns by leveling up or training with the Gangsta. */
export type MoveId =
  | 'jab'
  | 'talkTrash'
  | 'twoPiece'
  | 'haymaker'
  | 'bobAndWeave'
  | 'hypeUp'
  | 'keychainSlash'
  | 'freestyle'
  | 'theHawk'
  | 'crowdWork'
  | 'beefBreak'
  | 'chainSwing'
  | 'deepDishSlam'
  | 'micDrop'

export type StatusKind =
  | 'stunned'
  | 'bleeding'
  | 'pumped'
  | 'shook'
  | 'hyped'
  | 'guarded'
  | 'dazed'
  | 'frostbit'
  | 'vibing'

export type OpeningTarget = 'crotch' | 'legs' | 'torso' | 'neck' | 'head'

export type NpcId = 'gangsta' | 'plug' | 'hotDogVendor'

export type BoostableStat = 'maxHp' | 'atk' | 'def' | 'spd'

// ── Combatants ───────────────────────────────────────────────────────────────

export interface Stats {
  maxHp: number
  atk: number
  def: number
  spd: number
  /** Critical-hit chance, 0..1. */
  crit: number
}

export interface StatusEffect {
  kind: StatusKind
  /** Number of the owner's upcoming turns this effect still applies to. */
  turns: number
}

export interface Combatant {
  name: string
  stats: Stats
  hp: number
  statuses: StatusEffect[]
}

export interface MoveSlot {
  id: MoveId
  /** Uses left this fight; null = unlimited. Refilled after every fight. */
  pp: number | null
}

export interface Hero extends Combatant {
  level: number
  clout: number
  /** Up to MAX_MOVES moves, in menu order. */
  moves: MoveSlot[]
  skills: SkillId[]
  /** Rounds remaining until each gear skill can be used again. Missing or 0 = ready. */
  cooldowns: Partial<Record<SkillId, number>>
}

export interface Enemy extends Combatant {
  kind: EnemyKind
  cloutReward: number
}

// ── Effects (shared by moves, gear, enemy moves, openings) ───────────────────

export type Effect =
  /**
   * Normal attack(s) against the foe; each hit can dodge and crit.
   * `pierce` ignores defense. `finisher` multiplies power when the foe is below a share of max HP.
   */
  | {
      type: 'damage'
      power: number
      hits?: number
      pierce?: boolean
      finisher?: { below: number; mult: number }
    }
  /** Unavoidable damage equal to a share of the foe's max HP, capped. */
  | { type: 'percentDamage'; pct: number; cap: number }
  /** Finishes the foe if at or below `threshold` of max HP, else hits for `fallbackPower`. */
  | { type: 'execute'; threshold: number; fallbackPower: number }
  | { type: 'heal'; min: number; max: number }
  | { type: 'healPct'; pct: number }
  /** The user takes this share of the damage it dealt earlier in the same action. */
  | { type: 'recoil'; pct: number }
  | { type: 'status'; target: 'self' | 'foe'; status: StatusKind; turns: number; chance?: number }
  | { type: 'reveal' }

// ── Battle ───────────────────────────────────────────────────────────────────

export interface BattleState {
  enemy: Enemy
  round: number
  /** True once the hero has seen the enemy's stats (Aviator Glasses). */
  revealed: boolean
  /** When set, the enemy left itself open and the hero must pick where to strike. */
  opening: OpeningTarget[] | null
  canFlee: boolean
}

// ── NPCs ─────────────────────────────────────────────────────────────────────

export interface TradeOffer {
  stat: BoostableStat
  amount: number
  price: number
}

export interface Lesson {
  move: MoveId
  price: number
}

export interface NpcInstance {
  id: NpcId
  name: string
  /** Gangsta stat trade, rolled per visit. */
  offer?: TradeOffer
  /** Gangsta move lesson, rolled per visit. */
  lesson?: Lesson
  /** One-time dialogue choices already used this visit (by choice key). */
  spent: string[]
}

// ── Game ─────────────────────────────────────────────────────────────────────

export interface RunStats {
  enemiesDefeated: number
  damageDealt: number
  damageTaken: number
  crits: number
  timesFled: number
  cloutEarned: number
  cloutSpent: number
  hotDogsEaten: number
  ketchupIncidents: number
}

export type Phase =
  | { kind: 'explore' }
  | { kind: 'battle'; battle: BattleState }
  | { kind: 'dialogue'; npc: NpcInstance; node: string }
  | { kind: 'shop'; npc: NpcInstance }
  /** Choosing whether to learn one of `offered`; `price` is 0 for level-ups. */
  | { kind: 'learnMove'; offered: MoveId[]; price: number }
  | { kind: 'gameOver' }
  | { kind: 'victory' }

export interface GameState {
  version: 2
  rng: RngState
  hero: Hero
  /** Current block of the run; 0 before the first step onto the streets. */
  block: number
  phase: Phase
  /** The run's recurring vendors, named once at the start. */
  npcNames: Record<NpcId, string>
  /** Vendors already visited on this block (each can be visited once per block). */
  visited: NpcId[]
  /** Names already used this run, so nobody shows up twice. */
  usedNames: string[]
  /** Stat trades and lessons bought this run; each makes the next one pricier. */
  tradesMade: number
  movesTaught: number
  /** Recently used line indices per dialogue pool, so lines don't repeat back to back. */
  recent: Record<string, number[]>
  stats: RunStats
}

// ── Actions (player input) ───────────────────────────────────────────────────

export type Action =
  | { type: 'walk' }
  | { type: 'visit'; npc: NpcId }
  | { type: 'useMove'; move: MoveId }
  | { type: 'useSkill'; skill: SkillId }
  | { type: 'flee' }
  | { type: 'strike'; target: OpeningTarget | 'brace' }
  | { type: 'choose'; choice: string }
  | { type: 'buy'; skill: SkillId }
  | { type: 'leave' }
  /** Learn an offered move; `replace` is required when the hero already knows MAX_MOVES moves. */
  | { type: 'learnMove'; move: MoveId; replace?: MoveId }
  | { type: 'skipLearn' }

// ── Events (what happened, for the UI to narrate and animate) ────────────────

export type Tone = 'normal' | 'info' | 'danger' | 'reward'

export type GameEvent =
  | { type: 'narrate'; text: string; tone?: Tone }
  | { type: 'say'; speaker: string; side: Side | 'npc'; text: string }
  | { type: 'location'; block: number; neighborhood: string }
  /** A foe (enemy or NPC) steps into view. */
  | { type: 'appear'; name: string; who: EnemyKind | NpcId }
  | { type: 'move'; user: Side; name: string }
  | {
      type: 'hit'
      attacker: Side
      target: Side
      damage: number
      crit: boolean
      guarded: boolean
      hpAfter: number
    }
  | { type: 'miss'; attacker: Side; target: Side; reason: 'dodge' | 'miss' }
  | { type: 'tick'; target: Side; status: StatusKind; damage: number; hpAfter: number }
  | { type: 'selfHit'; target: Side; damage: number; hpAfter: number }
  | { type: 'recoil'; target: Side; damage: number; hpAfter: number }
  | { type: 'heal'; target: Side; amount: number; hpAfter: number }
  | { type: 'status'; target: Side; status: StatusKind; change: 'applied' | 'expired' }
  | { type: 'faint'; target: Side }
  | { type: 'clout'; amount: number; total: number }
  | { type: 'statUp'; stat: BoostableStat; amount: number }
  | { type: 'levelUp'; level: number }
  | { type: 'moveLearned'; move: MoveId; replaced?: MoveId }
  | { type: 'skillLearned'; skill: SkillId }
  | { type: 'fled' }
