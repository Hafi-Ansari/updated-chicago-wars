/** NPC conversations: walking the dialogue tree and applying its effects. */

import { MOVES } from '../content/moves'
import { NPCS } from '../content/npcs'
import type { Condition, DialogueChoice, Line, NpcEffect } from '../content/types'
import { assertNever } from './assert'
import { applyHeal } from './combat/damage'
import type { Picker } from './lines'
import type { Rng } from './rng'
import { fill, STAT_LABELS, type TextVars } from './text'
import type { GameEvent, GameState, NpcInstance } from './types'

export interface StepContext {
  rng: Rng
  emit: (event: GameEvent) => void
  /** Picks a line from a pool, avoiding recent repeats. */
  pick: Picker
}

export type ChoiceAvailability = 'available' | 'locked' | 'hidden'

export interface ChoiceView {
  key: string
  label: string
  availability: ChoiceAvailability
  hint?: string
}

export function npcVars(state: GameState, npc: NpcInstance): TextVars {
  return {
    hero: state.hero.name,
    npc: npc.name,
    price: npc.offer?.price ?? '',
    amount: npc.offer?.amount ?? '',
    stat: npc.offer ? STAT_LABELS[npc.offer.stat] : '',
    move: npc.lesson ? MOVES[npc.lesson.move].name : '',
    movePrice: npc.lesson?.price ?? '',
  }
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
  const vars = npcVars(state, npc)
  for (const line of ctx.pick(`${npc.id}.${node}`, def.lines)) speak(state, npc, line, vars, ctx)
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

  if (handoff === 'shop') {
    state.phase = { kind: 'shop', npc }
  } else if (handoff === 'lesson' && npc.lesson) {
    state.phase = { kind: 'learnMove', offered: [npc.lesson.move], price: npc.lesson.price }
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
    case 'acceptOffer': {
      const offer = npc?.offer
      if (!offer || hero.clout < offer.price) return
      hero.clout -= offer.price
      stats.cloutSpent += offer.price
      hero.stats[offer.stat] += offer.amount
      if (offer.stat === 'maxHp') hero.hp += offer.amount
      state.tradesMade += 1
      delete npc.offer
      ctx.emit({ type: 'clout', amount: -offer.price, total: hero.clout })
      ctx.emit({ type: 'statUp', stat: offer.stat, amount: offer.amount })
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
    case 'hasOffer':
      return npc.offer ? 'available' : 'hidden'
    case 'canAffordOffer':
      return npc.offer && state.hero.clout >= npc.offer.price ? 'available' : 'locked'
    case 'hasLesson':
      return npc.lesson ? 'available' : 'hidden'
    case 'canAffordLesson':
      return npc.lesson && state.hero.clout >= npc.lesson.price ? 'available' : 'locked'
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
