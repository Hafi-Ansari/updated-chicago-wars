/**
 * Battle Rap. Once the enemy has dropped below half HP the hero can start a cypher (once
 * per fight): the enemy spits a bar, and the hero answers by typing (judged on the server,
 * so the result arrives in the action) or by picking one of three authored comebacks.
 * The bar's score becomes a tier, and the tier's effects land like any other move.
 */

import { CYPHERS } from '../../content/cyphers'
import type { CypherPrompt } from '../../content/types'
import { CYPHER, CYPHER_EFFECTS } from '../balance'
import { cleanBar, isHalfBar } from '../bars'
import { fill } from '../text'
import type { BarResult, BattleState, Callout, CypherState, CypherTier } from '../types'
import type { CombatContext } from './context'
import { applyEffects } from './effects'
import { hpRatio, isDown } from './stats'

export function canBattleRap(battle: BattleState): boolean {
  return battle.rapUnlocked && !battle.rapUsed && battle.cypher === null && battle.opening === null
}

/** Unlocks Battle Rap the first time the enemy drops below half HP. It never locks again. */
export function unlockRap(ctx: CombatContext): void {
  const { battle, enemy } = ctx
  if (battle.rapUnlocked || isDown(enemy) || hpRatio(enemy) >= CYPHER.unlockBelow) return
  battle.rapUnlocked = true
  ctx.emit({ type: 'rapUnlocked' })
}

/** The prompt a cypher refers to (the first one if content changed under an old save). */
export function cypherPrompt(kind: keyof typeof CYPHERS, cypher: CypherState): CypherPrompt {
  const prompts = CYPHERS[kind]
  return prompts[cypher.prompt] ?? (prompts[0] as CypherPrompt)
}

/** The enemy spits a bar and the hero is on the clock. Spends the fight's Battle Rap. */
export function startCypher(ctx: CombatContext): void {
  const prompts = CYPHERS[ctx.enemy.kind]
  const prompt = ctx.pick(`cypher.${ctx.enemy.kind}`, prompts)
  ctx.battle.rapUsed = true
  ctx.battle.cypher = { prompt: prompts.indexOf(prompt), answers: ctx.rng.sample([0, 1, 2], 3) }
  ctx.emit({ type: 'narrate', text: "The crowd circles up. It's a cypher!", tone: 'info' })
  ctx.emit({
    type: 'say',
    speaker: ctx.enemy.name,
    side: 'enemy',
    text: fill(prompt.bar, { hero: ctx.hero.name, enemy: ctx.enemy.name }),
  })
}

const clamp = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min

/**
 * A bar's score: quality scaled by how well it rhymes (no rhyme keeps 60%), plus up to +1
 * for a multi-syllable rhyme. One line is half a bar and keeps half. Picked answers score by
 * their authored tier.
 */
export function barScore(bar: BarResult, prompt: CypherPrompt): number {
  switch (bar.kind) {
    case 'timeout':
      return 0
    case 'picked': {
      const answer = prompt.answers[bar.answer]
      return answer ? CYPHER.picked[answer.tier] : 0
    }
    case 'typed': {
      const text = cleanBar(bar.text)
      if (bar.rejected || !text) return 0
      const quality = clamp(bar.quality, 0, 10)
      const rhyme = clamp(bar.rhyme, 0, 1.4)
      const score = quality * (0.6 + 0.4 * Math.min(rhyme, 1)) + Math.max(0, rhyme - 1) * 2.5
      return isHalfBar(text) ? score * CYPHER.halfBar : score
    }
  }
}

export function tierOf(score: number): CypherTier {
  const { tiers } = CYPHER
  if (score >= tiers.legendary) return 'legendary'
  if (score >= tiers.fire) return 'fire'
  if (score >= tiers.decent) return 'decent'
  return 'flop'
}

/**
 * The judge's breakdown of a typed bar: hits (the rhyme, then funny, clever, flipped, flow),
 * then misses. Misses always show; over the cap, the last hits drop, flow first. A bar thrown
 * out, or with nothing in it at all, gets only the verdict. Picked answers and timeouts aren't
 * judged, so they get none.
 */
export function calloutsFor(bar: BarResult): Callout[] {
  if (bar.kind !== 'typed') return []
  const text = cleanBar(bar.text)
  if (!text) return []
  if (bar.rejected) return [bar.rejectedFor === 'injection' ? 'forSale' : 'dookie']

  const { hit, flow, flipped, noPunchline, dookie, max } = CYPHER.callouts
  const marks = bar.marks
  if (marks && Math.max(marks.funny, marks.clever, marks.flow) < dookie) return ['dookie']

  const hits: Callout[] = []
  const misses: Callout[] = []
  const rhyme = clamp(bar.rhyme, 0, 1.4)
  if (rhyme > 1) hits.push('multiRhyme')
  else if (rhyme >= 1) hits.push('perfectRhyme')
  else if (rhyme >= 0.5) hits.push('slantRhyme')
  else misses.push('noRhyme')

  // No marks when the judge model didn't answer: only the rhyme is known.
  if (marks) {
    const punch = Math.max(marks.funny, marks.clever)
    if (marks.funny >= hit) hits.push('funny')
    if (marks.clever >= hit) hits.push('clever')
    if (marks.relevance >= flipped && punch >= hit) hits.push('flipped')
    if (marks.flow >= flow) hits.push('flow')
    if (punch < noPunchline) misses.push('noPunchline')
  }
  if (isHalfBar(text)) misses.push('halfBar')
  return [...hits.slice(0, Math.max(0, max - misses.length)), ...misses]
}

const CROWD: Record<CypherTier, string> = {
  flop: 'The crowd boos {hero} off the mic!',
  decent: 'The crowd nods along. Solid.',
  fire: 'BARS! The crowd goes wild!',
  legendary: 'LEGENDARY! The whole block loses its mind!',
}

/** The hero's half of the cypher: say the bar, hear the judge and the crowd, land the effects. */
export function spitBar(ctx: CombatContext, cypher: CypherState, bar: BarResult): CypherTier {
  const prompt = cypherPrompt(ctx.enemy.kind, cypher)
  const say = (text: string) =>
    ctx.emit({ type: 'say', speaker: ctx.hero.name, side: 'hero', text })

  const typed = bar.kind === 'typed' ? cleanBar(bar.text) : ''
  if (typed) say(typed)
  else if (bar.kind === 'picked' && prompt.answers[bar.answer]) {
    say(fill(prompt.answers[bar.answer]?.text ?? '', { enemy: ctx.enemy.name }))
  } else {
    ctx.emit({ type: 'narrate', text: `${ctx.hero.name} freezes up. Not a single word comes out.` })
  }
  for (const callout of calloutsFor(bar)) ctx.emit({ type: 'callout', callout })

  const tier = tierOf(barScore(bar, prompt))
  ctx.emit({ type: 'cypher', tier })
  ctx.emit({
    type: 'narrate',
    text: fill(CROWD[tier], { hero: ctx.hero.name }),
    tone: tier === 'flop' ? 'danger' : 'reward',
  })
  applyEffects(ctx, 'hero', CYPHER_EFFECTS[tier])
  return tier
}
