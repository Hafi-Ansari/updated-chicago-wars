/** What an enemy can still lock: moves (never Jab, so the hero can always act) and active gear. */

import { SKILLS } from '../../content/skills'
import { UNFORGETTABLE_MOVE } from '../balance'
import type { BattleState, Hero, MoveId, SkillId } from '../types'

export function lockableMoves(hero: Hero, battle: BattleState): MoveId[] {
  return hero.moves
    .map((m) => m.id)
    .filter((id) => id !== UNFORGETTABLE_MOVE && !battle.lockedMoves.includes(id))
}

export function lockableGear(hero: Hero, battle: BattleState): SkillId[] {
  return hero.skills.filter((s) => !SKILLS[s].passive && !battle.lockedGear.includes(s))
}
