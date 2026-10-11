import type { Range } from '../engine/balance'
import type {
  Effect,
  EnemyKind,
  MoveId,
  NpcId,
  OpeningTarget,
  Side,
  SkillId,
} from '../engine/types'

/**
 * Text may contain placeholders filled at runtime:
 * {hero} {enemy} {npc} {price} {amount} {stat} {move} {movePrice} {item}
 * Spoken bars use "\n" between lines.
 */
export type Text = string

/** A pool of interchangeable lines; one is picked (avoiding recent repeats). */
export type Pool = readonly Text[]

export interface MoveDef {
  id: MoveId
  name: string
  description: string
  /** Uses per fight; null = unlimited. */
  pp: number | null
  /** Chance the move connects at all (dodging is rolled separately). */
  accuracy: number
  /** Higher priority acts first regardless of speed. */
  priority: number
  /** 0 = starting move; 1–3 unlock with level (see maxMoveTier). */
  tier: 0 | 1 | 2 | 3
  effects: Effect[]
  /** Bars the hero may spit when using it. */
  lines: Pool
  /** Chance to spit a bar; defaults to SAY_CHANCE.heroMove. */
  sayChance?: number
}

export interface SkillDef {
  id: SkillId
  /** Battle-menu label. */
  name: string
  /** What the Plug sells. */
  item: string
  price: number
  description: string
  /** Passive skills work automatically and never appear in the battle menu. */
  passive: boolean
  cooldown: number
  /** Narration when used. */
  useText: Text[]
  effects: Effect[]
}

export interface EnemyMove {
  weight: number
  text: Text
  effects: Effect[]
  /** Only used when the enemy is below half health (e.g. healing). */
  whenHurt?: boolean
}

export interface EnemyDef {
  kind: EnemyKind
  title: string
  /** Whether this enemy raps. Goons try. Goons fail. */
  rhymes: boolean
  intro: Pool
  /** Said sometimes when using a special move. */
  taunt: Pool
  /** When the hero tries to run and fails. */
  blockFlee: Pool
  defeat: Pool
  /** Special moves; whatever weight is left over is a basic attack. */
  moves: EnemyMove[]
  basicAttackWeight: number
}

export interface HeroLines {
  battleStart: Pool
  bossStart: Pool
  victory: Pool
  flee: Pool
  crit: Pool
  levelUp: Pool
}

export interface OpeningOutcome {
  weight: number
  /** Who comes out on top: their effects are applied against the other side. */
  winner: Side
  text: Text[]
  effects: Effect[]
}

export interface OpeningDef {
  target: OpeningTarget
  label: string
  /** Hint shown in the menu so players can judge the risk. */
  risk: 'safe' | 'risky' | 'reckless'
  outcomes: OpeningOutcome[]
}

// ── Dialogue ─────────────────────────────────────────────────────────────────

export type Line = Text | { speaker: 'hero' | 'narrator'; text: Text }

export type Condition =
  | { type: 'clout'; min: number }
  | { type: 'hasOffer' }
  | { type: 'canAffordOffer' }
  | { type: 'hasLesson' }
  | { type: 'canAffordLesson' }

export type NpcEffect =
  | { type: 'clout'; amount: number }
  | { type: 'heal'; pct: number }
  | { type: 'acceptOffer' }
  | { type: 'startLesson' }
  | { type: 'ateHotDog' }
  | { type: 'ketchup' }
  | { type: 'openShop' }

export interface DialogueChoice {
  /** Stable key; used to mark one-time choices as spent. */
  key: string
  label: Text
  require?: Condition
  /** Shown instead of the choice being clickable when `require` fails. */
  lockedHint?: Text
  once?: boolean
  effects?: NpcEffect[]
  /** Next node, or 'end' to walk away (the NPC says a farewell line). */
  next: string | 'end'
}

export interface DialogueNode {
  /** One of these line sets is picked when the node is entered. */
  lines: Line[][]
  choices: DialogueChoice[]
}

export interface NpcDef {
  id: NpcId
  title: string
  start: string
  nodes: Record<string, DialogueNode>
  farewell: Pool
}

export type { Range }
