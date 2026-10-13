/**
 * Battle Rap. Once the enemy has dropped below half HP the hero can start a cypher (once
 * per fight): the enemy spits a bar, and the hero answers by typing (judged on the server,
 * so the result arrives in the action) or by picking one of three authored comebacks.
 * The bar's score becomes a tier, and the tier's effects land like any other move.
 */

import { CYPHERS } from '../../content/cyphers'
import type { CypherPrompt } from '../../content/types'
import { CYPHER, CYPHER_EFFECTS } from '../balance'
import { fill } from '../text'
import type { BarResult, BattleState, CypherState, CypherTier } from '../types'
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

/** At most two lines of maxLineLength characters, trimmed. */
export function cleanBar(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trim().slice(0, CYPHER.maxLineLength))
    .filter(Boolean)
    .slice(0, 2)
    .join('\n')
}

/**
 * A bar's score: quality scaled by how well it rhymes (no rhyme keeps 60%), plus up to +1
 * for a multi-syllable rhyme. Picked answers score by their authored tier.
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
      if (bar.rejected || !cleanBar(bar.text)) return 0
      const quality = clamp(bar.quality, 0, 10)
      const rhyme = clamp(bar.rhyme, 0, 1.4)
      return quality * (0.6 + 0.4 * Math.min(rhyme, 1)) + Math.max(0, rhyme - 1) * 2.5
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

const CROWD: Record<CypherTier, string> = {
  flop: 'The crowd boos {hero} off the mic!',
  decent: 'The crowd nods along. Solid.',
  fire: 'BARS! The crowd goes wild!',
  legendary: 'LEGENDARY! The whole block loses its mind!',
}

/** The hero's half of the cypher: say the bar, hear the crowd, land the tier's effects. */
export function spitBar(ctx: CombatContext, cypher: CypherState, bar: BarResult): CypherTier {
  const prompt = cypherPrompt(ctx.enemy.kind, cypher)
  const say = (text: string) =>
    ctx.emit({ type: 'say', speaker: ctx.hero.name, side: 'hero', text })

  if (bar.kind === 'typed' && cleanBar(bar.text)) say(cleanBar(bar.text))
  else if (bar.kind === 'picked' && prompt.answers[bar.answer]) {
    say(fill(prompt.answers[bar.answer]?.text ?? '', { enemy: ctx.enemy.name }))
  } else {
    ctx.emit({ type: 'narrate', text: `${ctx.hero.name} freezes up. Not a single word comes out.` })
  }

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
