import type { Range } from '../engine/balance'
import type {
  BoostableStat,
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
 * {hero} {enemy} {npc} {item} {lessons} (moves in the Gangsta's playbook)
 * {maxHpPrice} {atkPrice} {defPrice} {spdPrice} {critPrice} (Gangsta training prices)
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
  /** Permanent stat bonus applied when bought (passive gear). */
  bonus?: Partial<Record<BoostableStat, number>>
  cooldown: number
  /** Narration when used. */
  useText: Text[]
  effects: Effect[]
}

export interface EnemyMove {
  weight: number
  text: Text
  effects: Effect[]
  /** Only used while the enemy's HP is below this share of max (e.g. 0.35 for a heal). */
  whenBelow?: number
  /** Most times it can be used in one fight. */
  maxUses?: number
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
  /**
   * Chance per turn to run off once below ENEMY_FLEE_BELOW health, and what they
   * yell on the way out. Running counts as a win for the hero.
   */
  flee?: { chance: number; lines: Pool }
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
  /** The Gangsta's playbook has something to teach. */
  | { type: 'hasLessons' }
  | { type: 'canAffordTraining'; stat: BoostableStat }
  /** The Gangsta hasn't run a training session yet this visit. */
  | { type: 'notTrainedYet' }

export type NpcEffect =
  | { type: 'clout'; amount: number }
  | { type: 'heal'; pct: number }
  /** Buy a Gangsta training session for this stat at the current price (one per visit). */
  | { type: 'train'; stat: BoostableStat }
  /** Open the Gangsta's free playbook (the conversation resumes afterwards). */
  | { type: 'startLesson' }
  | { type: 'ateHotDog' }
  | { type: 'ketchup' }
  | { type: 'openShop' }

export interface DialogueChoice {
  /** Stable key; used to mark one-time choices as spent. */
  key: string
  label: Text
  /** Short note shown beside the label, e.g. a price. */
  note?: Text
  require?: Condition
  /** Shown instead of the choice being clickable when `require` fails. */
  lockedHint?: Text
  once?: boolean
  effects?: NpcEffect[]
  /**
   * Next node, or 'end' to walk away (the NPC says a farewell line). With a handoff
   * effect (openShop, startLesson), the node's lines are spoken before the handoff.
   */
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
