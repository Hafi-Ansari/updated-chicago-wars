/**
 * The engine's public entry point: `newGame` and `step`.
 *
 *   step(state, action) → { state, events }
 *
 * Pure and deterministic: the RNG state lives inside GameState, so the same
 * state + action always yields the same result. Actions that aren't valid in
 * the current phase are ignored and return the original state object.
 */

import { produce } from 'immer'
import { ENEMIES } from '../content/enemies'
import { STREET_EVENTS } from '../content/events'
import { HERO_LINES } from '../content/hero'
import { MOVES, STARTING_MOVES } from '../content/moves'
import { NEIGHBORHOODS } from '../content/names'
import { NPCS, PLUG_SALE_LINES } from '../content/npcs'
import { SKILLS } from '../content/skills'
import { assertNever } from './assert'
import {
  BLOCKS_PER_RUN,
  GAUNTLET,
  HERO_START,
  HERO_START_CLOUT,
  LEVEL_UP,
  MAX_MOVES,
  MOVES_OFFERED,
  maxMoveTier,
  POST_FIGHT_HEAL,
  RALLY,
  SAY_CHANCE,
  UNFORGETTABLE_MOVE,
} from './balance'
import type { CombatContext } from './combat/context'
import { canBattleRap, startCypher } from './combat/cypher'
import { applyHeal } from './combat/damage'
import {
  type BattleOutcome,
  canUseMove,
  canUseSkill,
  cypherRound,
  fightRound,
  fleeRound,
  strikeOpening,
} from './combat/turn'
import {
  applyNpcEffect,
  choose,
  endLesson,
  enterNode,
  farewell,
  type StepContext,
} from './dialogue'
import {
  createEnemy,
  createNamed,
  createNpc,
  learnableMoves,
  rollEncounter,
  rollEnemyKind,
  takeName,
} from './encounters'
import { pickFresh } from './lines'
import { createRng } from './rng'
import { SAVE_VERSION } from './save'
import { fill } from './text'
import type {
  Action,
  BattleState,
  BoostableStat,
  Enemy,
  GameEvent,
  GameState,
  Hero,
  MoveId,
  MoveSlot,
  NpcId,
  SkillId,
} from './types'

export interface StepResult {
  state: GameState
  events: GameEvent[]
}

const slotFor = (id: MoveId): MoveSlot => ({ id, pp: MOVES[id].pp })

export function newGame(heroName: string, seed: number): StepResult {
  const name = heroName.trim() || 'Lil Debug'
  const state: GameState = {
    version: SAVE_VERSION,
    rng: seed >>> 0,
    hero: {
      name,
      level: 1,
      stats: { ...HERO_START },
      hp: HERO_START.maxHp,
      statuses: [],
      clout: HERO_START_CLOUT,
      moves: STARTING_MOVES.map(slotFor),
      skills: [],
      cooldowns: {},
    },
    block: 0,
    phase: { kind: 'explore' },
    npcNames: { gangsta: '', plug: '', hotDogVendor: '' },
    visited: [],
    usedNames: [],
    tradesMade: 0,
    seenMoves: [...STARTING_MOVES],
    recent: {},
    stats: {
      enemiesDefeated: 0,
      enemiesFled: 0,
      damageDealt: 0,
      damageTaken: 0,
      crits: 0,
      timesFled: 0,
      cloutEarned: 0,
      cloutSpent: 0,
      hotDogsEaten: 0,
      ketchupIncidents: 0,
    },
  }

  // Name the run's recurring vendors.
  const rng = createRng(state.rng)
  for (const id of Object.keys(state.npcNames) as NpcId[]) {
    state.npcNames[id] = takeName(state, rng)
  }
  state.rng = rng.state

  const events: GameEvent[] = [
    { type: 'narrate', text: 'Location: Chicago, Illinois', tone: 'info' },
    { type: 'narrate', text: 'Date: September 2019 · Time: 12:00 AM', tone: 'info' },
    {
      type: 'narrate',
      text: `${name}! You are about to embark on a journey across the entire city. Word is, ${BLOCKS_PER_RUN} blocks from here, somebody calls themselves the King of Chicago.`,
    },
    {
      type: 'narrate',
      text: `Between fights you can visit ${state.npcNames.plug} the Plug, ${state.npcNames.gangsta} the Gangsta, and ${state.npcNames.hotDogVendor}'s hot dog cart, once per block each.`,
      tone: 'info',
    },
  ]
  return { state, events }
}

export function step(state: GameState, action: Action): StepResult {
  const events: GameEvent[] = []
  const next = produce(state, (draft) => {
    const rng = createRng(draft.rng)
    const ctx: StepContext = {
      rng,
      emit: (event) => events.push(event),
      pick: (key, pool) => pickFresh(draft, rng, key, pool),
    }
    if (handle(draft, action, ctx)) draft.rng = rng.state
  })
  return { state: next, events }
}

/** Returns true if the action was valid and applied. */
function handle(state: GameState, action: Action, ctx: StepContext): boolean {
  const { phase } = state
  switch (phase.kind) {
    case 'explore':
      if (state.block >= BLOCKS_PER_RUN) return false
      if (action.type === 'walk') {
        walk(state, ctx)
        return true
      }
      if (action.type === 'visit') return visit(state, action.npc, ctx)
      return false

    case 'battle':
      return battleAction(state, phase.battle, action, ctx)

    case 'dialogue':
      return action.type === 'choose' && choose(state, phase.npc, phase.node, action.choice, ctx)

    case 'shop':
      if (action.type === 'buy') return buy(state, action.skill, phase.npc.name, ctx)
      if (action.type === 'leave') {
        farewell(state, phase.npc, ctx)
        return true
      }
      return false

    case 'learnMove':
      if (action.type === 'learnMove') {
        if (!learnMove(state, phase.offered, action.move, action.replace, ctx)) return false
        if (phase.npc) endLesson(state, phase.npc, true, ctx)
        else state.phase = { kind: 'explore' }
        return true
      }
      if (action.type === 'skipLearn') {
        if (phase.npc) {
          endLesson(state, phase.npc, false, ctx)
        } else {
          ctx.emit({ type: 'narrate', text: `${state.hero.name} decided not to learn a new move.` })
          state.phase = { kind: 'explore' }
        }
        return true
      }
      return false

    case 'gameOver':
    case 'victory':
      return false

    default:
      return assertNever(phase)
  }
}

// ── Exploring ────────────────────────────────────────────────────────────────

function walk(state: GameState, ctx: StepContext): void {
  state.block += 1
  state.visited = []
  const neighborhood = NEIGHBORHOODS[(state.block - 1) % NEIGHBORHOODS.length] ?? 'Chicago'
  ctx.emit({ type: 'location', block: state.block, neighborhood })

  // The last blocks are always the same three fights, and there's no running from them.
  const named = GAUNTLET[state.block]
  if (named) {
    startBattle(state, createNamed(ctx.rng, named, state.block), false, ctx)
    return
  }

  const encounter = rollEncounter(ctx.rng, state.block)
  switch (encounter) {
    case 'fight': {
      const kind = rollEnemyKind(ctx.rng, state.block)
      const enemy = createEnemy(ctx.rng, kind, state.block, takeName(state, ctx.rng))
      startBattle(state, enemy, true, ctx)
      return
    }
    case 'streetEvent': {
      const event = ctx.pick('streetEvents', STREET_EVENTS)
      for (const text of event.text) ctx.emit({ type: 'narrate', text })
      for (const effect of event.effects) {
        if (effect.type !== 'openShop' && effect.type !== 'startLesson') {
          applyNpcEffect(state, null, effect, ctx)
        }
      }
      return
    }
    default:
      assertNever(encounter)
  }
}

function visit(state: GameState, id: NpcId, ctx: StepContext): boolean {
  if (state.visited.includes(id)) return false
  state.visited.push(id)
  const npc = createNpc(state, id)
  ctx.emit({ type: 'appear', name: npc.name, who: id })
  ctx.emit({ type: 'narrate', text: `You pull up to ${npc.name} the ${NPCS[id].title}.` })
  enterNode(state, npc, NPCS[id].start, ctx)
  return true
}

function buy(state: GameState, skill: SkillId, plugName: string, ctx: StepContext): boolean {
  const def = SKILLS[skill]
  const { hero } = state
  if (hero.skills.includes(skill) || hero.clout < def.price) return false

  hero.clout -= def.price
  hero.skills.push(skill)
  state.stats.cloutSpent += def.price
  ctx.emit({ type: 'clout', amount: -def.price, total: hero.clout })
  ctx.emit({ type: 'skillLearned', skill })
  for (const [stat, amount] of Object.entries(def.bonus ?? {}) as [BoostableStat, number][]) {
    hero.stats[stat] += amount
    if (stat === 'maxHp') hero.hp += amount
    ctx.emit({ type: 'statUp', stat, amount })
  }
  ctx.emit({
    type: 'say',
    speaker: plugName,
    side: 'npc',
    text: fill(ctx.pick('plug.sale', PLUG_SALE_LINES), { item: def.item }),
  })
  return true
}

// ── Learning moves ───────────────────────────────────────────────────────────

/** Learns one of `offered`, forgetting `replace` when the moveset is full. Returns false if invalid. */
function learnMove(
  state: GameState,
  offered: MoveId[],
  move: MoveId,
  replace: MoveId | undefined,
  ctx: StepContext,
): boolean {
  const { hero } = state
  if (!offered.includes(move) || hero.moves.some((m) => m.id === move)) return false

  const full = hero.moves.length >= MAX_MOVES
  if (replace === UNFORGETTABLE_MOVE) return false
  const replaceIndex = replace ? hero.moves.findIndex((m) => m.id === replace) : -1
  if (full && replaceIndex < 0) return false

  if (full) hero.moves[replaceIndex] = slotFor(move)
  else hero.moves.push(slotFor(move))

  ctx.emit(
    full && replace
      ? { type: 'moveLearned', move, replaced: replace }
      : { type: 'moveLearned', move },
  )
  return true
}

/**
 * Offers new moves after every win, if there are any left to learn. Moves the hero
 * hasn't seen come first: passed-on ones wait in the Gangsta's playbook anyway.
 */
function offerMoves(state: GameState, ctx: StepContext): boolean {
  const pool = learnableMoves(state.hero, maxMoveTier(state.hero.level))
  if (pool.length === 0) return false
  const fresh = pool.filter((id) => !state.seenMoves.includes(id))
  const seen = pool.filter((id) => state.seenMoves.includes(id))
  const offered = ctx.rng.sample(fresh, MOVES_OFFERED)
  if (offered.length < MOVES_OFFERED) {
    offered.push(...ctx.rng.sample(seen, MOVES_OFFERED - offered.length))
  }
  for (const id of offered) if (!state.seenMoves.includes(id)) state.seenMoves.push(id)
  state.phase = { kind: 'learnMove', offered }
  ctx.emit({ type: 'narrate', text: `${state.hero.name} can learn a new move!`, tone: 'info' })
  return true
}

// ── Battle ───────────────────────────────────────────────────────────────────

function heroSay(state: GameState, ctx: StepContext, line: string, enemy = ''): void {
  ctx.emit({
    type: 'say',
    speaker: state.hero.name,
    side: 'hero',
    text: fill(line, { hero: state.hero.name, enemy }),
  })
}

function startBattle(state: GameState, enemy: Enemy, canFlee: boolean, ctx: StepContext): void {
  const def = ENEMIES[enemy.kind]
  const vars = { hero: state.hero.name, enemy: enemy.name }
  if (def.entrance) {
    ctx.emit({ type: 'narrate', text: fill(def.entrance, vars), tone: 'danger' })
    ctx.emit({ type: 'appear', name: enemy.name, who: enemy.kind })
  } else {
    ctx.emit({ type: 'appear', name: enemy.name, who: enemy.kind })
    ctx.emit({ type: 'narrate', text: `You encounter ${enemy.name} the ${def.title}!` })
  }
  ctx.emit({
    type: 'say',
    speaker: enemy.name,
    side: 'enemy',
    text: fill(ctx.pick(`${def.kind}.intro`, def.intro), vars),
  })

  if (enemy.kind === 'boss') {
    heroSay(state, ctx, ctx.pick('hero.bossStart', HERO_LINES.bossStart), enemy.name)
  } else if (ctx.rng.chance(SAY_CHANCE.heroBattleStart)) {
    heroSay(state, ctx, ctx.pick('hero.battleStart', HERO_LINES.battleStart), enemy.name)
  }

  ctx.emit({ type: 'narrate', text: '[COMBAT ENTERED]', tone: 'info' })
  state.phase = {
    kind: 'battle',
    battle: {
      enemy,
      round: 0,
      revealed: false,
      opening: null,
      canFlee,
      lastMove: null,
      lockedMoves: [],
      lockedGear: [],
      enemyMoveUses: [],
      enemyLastMove: null,
      enemyFled: false,
      enemyRally: state.block >= RALLY.fromBlock,
      // TEMP(preview): Battle Rap from the first turn. Revert before merging to main (was `false`).
      rapUnlocked: true,
      rapUsed: false,
      cypher: null,
    },
  }
}

function battleAction(
  state: GameState,
  battle: BattleState,
  action: Action,
  ctx: StepContext,
): boolean {
  const combat: CombatContext = {
    ...ctx,
    run: state.stats,
    hero: state.hero,
    enemy: battle.enemy,
    battle,
  }

  let result: BattleOutcome
  if (battle.cypher) {
    // The crowd is waiting: nothing but a comeback will do.
    if (action.type !== 'spit') return false
    result = cypherRound(combat, action.bar)
  } else if (action.type === 'battleRap') {
    if (!canBattleRap(battle)) return false
    startCypher(combat)
    return true
  } else if (battle.opening) {
    if (action.type !== 'strike') return false
    if (action.target !== 'brace' && !battle.opening.includes(action.target)) return false
    result = strikeOpening(combat, action.target)
  } else if (action.type === 'useMove') {
    if (!canUseMove(state.hero, action.move, battle)) return false
    result = fightRound(combat, { type: 'move', move: action.move })
  } else if (action.type === 'useSkill') {
    if (!canUseSkill(state.hero, action.skill, battle)) return false
    result = fightRound(combat, { type: 'skill', skill: action.skill })
  } else if (action.type === 'flee') {
    if (!battle.canFlee) return false
    result = fleeRound(combat)
  } else {
    return false
  }

  if (result !== 'ongoing') endBattle(state, battle.enemy, result, ctx)
  return true
}

/** After every fight: statuses clear, gear cools down, PP refills. */
function recover(hero: Hero): void {
  hero.statuses = []
  hero.cooldowns = {}
  hero.moves = hero.moves.map((m) => slotFor(m.id))
}

function endBattle(
  state: GameState,
  enemy: Enemy,
  result: Exclude<BattleOutcome, 'ongoing'>,
  ctx: StepContext,
): void {
  const { hero, stats } = state
  recover(hero)

  switch (result) {
    case 'lost':
      ctx.emit({ type: 'faint', target: 'hero' })
      ctx.emit({
        type: 'narrate',
        text: `GAME OVER. ${hero.name} got dropped in ${state.block > 0 ? NEIGHBORHOODS[state.block - 1] : 'Chicago'}.`,
        tone: 'danger',
      })
      state.phase = { kind: 'gameOver' }
      return

    case 'fled':
      stats.timesFled += 1
      ctx.emit({ type: 'narrate', text: '[You ran from the fight.]', tone: 'info' })
      state.phase = { kind: 'explore' }
      return

    case 'won':
    case 'enemyFled': {
      if (result === 'won') {
        const def = ENEMIES[enemy.kind]
        ctx.emit({
          type: 'say',
          speaker: enemy.name,
          side: 'enemy',
          text: fill(ctx.pick(`${def.kind}.defeat`, def.defeat), {
            hero: hero.name,
            enemy: enemy.name,
          }),
        })
        ctx.emit({ type: 'faint', target: 'enemy' })
        ctx.emit({ type: 'narrate', text: `You defeated ${enemy.name}!`, tone: 'reward' })
      } else {
        // Running counts as a win: same rewards, just no knockout.
        stats.enemiesFled += 1
        ctx.emit({
          type: 'narrate',
          text: `${enemy.name} ran off! That counts as a win.`,
          tone: 'reward',
        })
      }
      stats.enemiesDefeated += 1

      if (enemy.kind === 'boss') {
        ctx.emit({
          type: 'narrate',
          text: `${hero.name} is the new King of Chicago!`,
          tone: 'reward',
        })
        state.phase = { kind: 'victory' }
        return
      }

      if (ctx.rng.chance(SAY_CHANCE.heroVictory)) {
        heroSay(state, ctx, ctx.pick('hero.victory', HERO_LINES.victory), enemy.name)
      }

      hero.clout += enemy.cloutReward
      stats.cloutEarned += enemy.cloutReward
      ctx.emit({ type: 'clout', amount: enemy.cloutReward, total: hero.clout })

      const healed = applyHeal(hero, hero.stats.maxHp * POST_FIGHT_HEAL)
      if (healed > 0) ctx.emit({ type: 'heal', target: 'hero', amount: healed, hpAfter: hero.hp })

      state.phase = { kind: 'explore' }
      if (stats.enemiesDefeated % LEVEL_UP.winsPerLevel === 0) levelUp(state, ctx)
      offerMoves(state, ctx)
      return
    }
    default:
      assertNever(result)
  }
}

function levelUp(state: GameState, ctx: StepContext): void {
  const { hero } = state
  hero.level += 1
  ctx.emit({ type: 'levelUp', level: hero.level })
  for (const [stat, amount] of Object.entries(LEVEL_UP.gains) as [BoostableStat, number][]) {
    hero.stats[stat] += amount
    if (stat === 'maxHp') hero.hp += amount
    ctx.emit({ type: 'statUp', stat, amount })
  }
  if (ctx.rng.chance(SAY_CHANCE.heroLevelUp)) {
    heroSay(state, ctx, ctx.pick('hero.levelUp', HERO_LINES.levelUp))
  }
}
