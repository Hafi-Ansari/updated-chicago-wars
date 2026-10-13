/** NPC conversations: walking the dialogue tree and applying its effects. */

import { NPCS } from '../content/npcs'
import type { Condition, DialogueChoice, Line, NpcEffect } from '../content/types'
import { assertNever } from './assert'
import { TRAINING, TRAINING_ORDER, trainingPrice } from './balance'
import { applyHeal } from './combat/damage'
import { teachableMoves } from './encounters'
import type { Picker } from './lines'
import type { Rng } from './rng'
import { fill, type TextVars } from './text'
import type { GameEvent, GameState, NpcInstance } from './types'

export interface StepContext {
  rng: Rng
  emit: (event: GameEvent) => void
  /** Picks a line from a pool, avoiding recent repeats. */
  pick: Picker
}

export type ChoiceAvailability = 'available' | 'locked' | 'hidden'

/** Marks a visit's training session as used, in NpcInstance.spent. */
const TRAINED = 'trained'

export interface ChoiceView {
  key: string
  label: string
  availability: ChoiceAvailability
  /** Why a locked choice is locked. */
  hint?: string
  note?: string
}

export function npcVars(state: GameState, npc: NpcInstance): TextVars {
  const vars: Record<string, string | number> = {
    hero: state.hero.name,
    npc: npc.name,
    lessons: teachableMoves(state).length,
  }
  for (const stat of TRAINING_ORDER) vars[`${stat}Price`] = trainingPrice(stat, state.tradesMade)
  return vars
}

/** Enters a node: picks one of its line sets and speaks it. */
export function enterNode(
  state: GameState,
  npc: NpcInstance,
  node: string,
  ctx: StepContext,
): void {
  const def = NPCS[npc.id].nodes[node]
  if (!def) throw new Error(`Unknown dialogue node "${node}" for ${npc.id}`)

  state.phase = { kind: 'dialogue', npc, node }
  speakNode(state, npc, node, ctx)
}

/** Speaks one of a node's line sets without entering it. */
function speakNode(state: GameState, npc: NpcInstance, node: string, ctx: StepContext): void {
  const def = NPCS[npc.id].nodes[node]
  if (!def) throw new Error(`Unknown dialogue node "${node}" for ${npc.id}`)
  const vars = npcVars(state, npc)
  for (const line of ctx.pick(`${npc.id}.${node}`, def.lines)) speak(state, npc, line, vars, ctx)
}

/** After the Gangsta's playbook: back to the conversation, reacting to whether they learned. */
export function endLesson(
  state: GameState,
  npc: NpcInstance,
  learned: boolean,
  ctx: StepContext,
): void {
  enterNode(state, npc, learned ? 'taught' : 'menu', ctx)
}

/** The choices for the current node, as the UI should show them. */
export function choicesFor(state: GameState, npc: NpcInstance, node: string): ChoiceView[] {
  const def = NPCS[npc.id].nodes[node]
  if (!def) return []
  const vars = npcVars(state, npc)

  return def.choices
    .map((choice): ChoiceView => {
      const availability = availabilityOf(state, npc, choice)
      const view: ChoiceView = { key: choice.key, label: fill(choice.label, vars), availability }
      if (availability === 'locked' && choice.lockedHint) view.hint = fill(choice.lockedHint, vars)
      if (choice.note) view.note = fill(choice.note, vars)
      return view
    })
    .filter((view) => view.availability !== 'hidden')
}

/** Applies a dialogue choice. Returns false if it isn't currently allowed. */
export function choose(
  state: GameState,
  npc: NpcInstance,
  node: string,
  key: string,
  ctx: StepContext,
): boolean {
  const choice = NPCS[npc.id].nodes[node]?.choices.find((c) => c.key === key)
  if (!choice || availabilityOf(state, npc, choice) !== 'available') return false

  if (choice.once) npc.spent.push(choice.key)
  let handoff: 'shop' | 'lesson' | null = null
  for (const effect of choice.effects ?? []) {
    if (effect.type === 'openShop') handoff = 'shop'
    else if (effect.type === 'startLesson') handoff = 'lesson'
    else applyNpcEffect(state, npc, effect, ctx)
  }

  if (handoff !== null && choice.next !== 'end') speakNode(state, npc, choice.next, ctx)
  if (handoff === 'shop') {
    state.phase = { kind: 'shop', npc }
  } else if (handoff === 'lesson') {
    state.phase = { kind: 'learnMove', offered: teachableMoves(state), npc }
  } else if (choice.next === 'end') {
    farewell(state, npc, ctx)
  } else {
    enterNode(state, npc, choice.next, ctx)
  }
  return true
}

/** The NPC says goodbye and the hero is back on the street. */
export function farewell(state: GameState, npc: NpcInstance, ctx: StepContext): void {
  const def = NPCS[npc.id]
  const line = ctx.pick(`${npc.id}.farewell`, def.farewell)
  ctx.emit({ type: 'say', speaker: npc.name, side: 'npc', text: fill(line, npcVars(state, npc)) })
  state.phase = { kind: 'explore' }
}

/** Effects shared by NPC dialogue and street events. */
export function applyNpcEffect(
  state: GameState,
  npc: NpcInstance | null,
  effect: Exclude<NpcEffect, { type: 'openShop' | 'startLesson' }>,
  ctx: StepContext,
): void {
  const { hero, stats } = state
  switch (effect.type) {
    case 'clout': {
      const amount = Math.max(-hero.clout, effect.amount)
      hero.clout += amount
      if (amount > 0) stats.cloutEarned += amount
      else stats.cloutSpent -= amount
      ctx.emit({ type: 'clout', amount, total: hero.clout })
      return
    }
    case 'heal': {
      const amount = applyHeal(hero, hero.stats.maxHp * effect.pct)
      ctx.emit({ type: 'heal', target: 'hero', amount, hpAfter: hero.hp })
      return
    }
    case 'train': {
      const price = trainingPrice(effect.stat, state.tradesMade)
      if (hero.clout < price) return
      const amount = TRAINING.gains[effect.stat]
      hero.clout -= price
      stats.cloutSpent += price
      hero.stats[effect.stat] += amount
      if (effect.stat === 'maxHp') hero.hp += amount
      state.tradesMade += 1
      npc?.spent.push(TRAINED)
      ctx.emit({ type: 'clout', amount: -price, total: hero.clout })
      ctx.emit({ type: 'statUp', stat: effect.stat, amount })
      return
    }
    case 'ateHotDog':
      stats.hotDogsEaten += 1
      return
    case 'ketchup':
      stats.ketchupIncidents += 1
      return
    default:
      assertNever(effect)
  }
}

function availabilityOf(
  state: GameState,
  npc: NpcInstance,
  choice: DialogueChoice,
): ChoiceAvailability {
  if (choice.once && npc.spent.includes(choice.key)) return 'hidden'
  if (!choice.require) return 'available'
  return meets(state, npc, choice.require)
}

function meets(state: GameState, npc: NpcInstance, condition: Condition): ChoiceAvailability {
  switch (condition.type) {
    case 'clout':
      return state.hero.clout >= condition.min ? 'available' : 'locked'
    case 'hasLessons':
      return teachableMoves(state).length > 0 ? 'available' : 'locked'
    case 'canAffordTraining':
      return state.hero.clout >= trainingPrice(condition.stat, state.tradesMade)
        ? 'available'
        : 'locked'
    case 'notTrainedYet':
      return npc.spent.includes(TRAINED) ? 'locked' : 'available'
    default:
      return assertNever(condition)
  }
}

function speak(
  state: GameState,
  npc: NpcInstance,
  line: Line,
  vars: TextVars,
  ctx: StepContext,
): void {
  if (typeof line === 'string') {
    ctx.emit({ type: 'say', speaker: npc.name, side: 'npc', text: fill(line, vars) })
  } else if (line.speaker === 'hero') {
    ctx.emit({ type: 'say', speaker: state.hero.name, side: 'hero', text: fill(line.text, vars) })
  } else {
    ctx.emit({ type: 'narrate', text: fill(line.text, vars) })
  }
}
