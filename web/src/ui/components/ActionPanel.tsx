/** The player's choices for the current phase, as numbered menus. */

import { useState } from 'react'
import { MOVES } from '../../content/moves'
import { NEIGHBORHOODS } from '../../content/names'
import { NPC_ORDER } from '../../content/npcs'
import { OPENINGS } from '../../content/openings'
import { SKILL_ORDER, SKILLS } from '../../content/skills'
import {
  type Action,
  BLOCKS_PER_RUN,
  canUseMove,
  canUseSkill,
  choicesFor,
  type GameState,
  MAX_MOVES,
  type MoveId,
  type MoveSlot,
  type NpcId,
  UNFORGETTABLE_MOVE,
} from '../../engine'
import { Menu, type MenuOption } from './Menu'

interface ActionPanelProps {
  state: GameState
  act: (action: Action) => void
  onShowStats: () => void
}

const RISK_LABEL = { safe: 'safe', risky: 'risky', reckless: 'reckless!' } as const

const NPC_LABEL: Record<NpcId, string> = {
  plug: 'Hit up the Plug',
  gangsta: 'See the Gangsta',
  hotDogVendor: 'Hot dog cart',
}

const NPC_HINT: Record<NpcId, string> = {
  plug: 'Buy hidden gear: passive and active skills for battle.',
  gangsta: 'Relearn moves you passed on or forgot (free), train stats for clout, or hear a story.',
  hotDogVendor: 'Spend clout to heal up between fights.',
}

function ppLabel(slot: MoveSlot): string {
  const max = MOVES[slot.id].pp
  return slot.pp === null || max === null ? 'PP ∞' : `PP ${slot.pp}/${max}`
}

export function ActionPanel({ state, act, onShowStats }: ActionPanelProps) {
  // Which submenu is open; the panel is re-keyed per phase, so this resets between phases.
  const [submenu, setSubmenu] = useState<'moves' | 'gear' | { forgetFor: MoveId } | null>(null)
  const { phase, hero } = state

  switch (phase.kind) {
    case 'explore': {
      const next = state.block + 1
      const boss = next >= BLOCKS_PER_RUN
      return (
        <Menu
          label="Explore"
          options={[
            {
              key: 'walk',
              label: boss ? 'Face the King' : 'Walk on',
              sub: `Block ${next}: ${NEIGHBORHOODS[(next - 1) % NEIGHBORHOODS.length]}`,
              primary: true,
              onSelect: () => act({ type: 'walk' }),
            },
            ...NPC_ORDER.map(
              (id): MenuOption => ({
                key: id,
                label: NPC_LABEL[id],
                sub: state.visited.includes(id) ? 'seen this block' : state.npcNames[id],
                disabled: state.visited.includes(id),
                hint: NPC_HINT[id],
                onSelect: () => act({ type: 'visit', npc: id }),
              }),
            ),
            { key: 'stats', label: 'Your stats', onSelect: onShowStats },
          ]}
        />
      )
    }

    case 'battle': {
      const { battle } = phase
      if (battle.opening) {
        return (
          <Menu
            label="Strike the opening"
            options={[
              ...battle.opening.map(
                (t): MenuOption => ({
                  key: t,
                  label: OPENINGS[t].label,
                  sub: RISK_LABEL[OPENINGS[t].risk],
                  onSelect: () => act({ type: 'strike', target: t }),
                }),
              ),
              {
                key: 'brace',
                label: 'Let them pass',
                sub: 'no risk',
                onSelect: () => act({ type: 'strike', target: 'brace' }),
              },
            ]}
          />
        )
      }

      if (submenu === 'moves') {
        return (
          <Menu
            label="Moves"
            columns={2}
            onBack={() => setSubmenu(null)}
            options={[
              ...hero.moves.map(
                (slot): MenuOption => ({
                  key: slot.id,
                  label: MOVES[slot.id].name,
                  sub: ppLabel(slot),
                  hint: MOVES[slot.id].description,
                  disabled: !canUseMove(hero, slot.id),
                  onSelect: () => act({ type: 'useMove', move: slot.id }),
                }),
              ),
              { key: 'back', label: 'Back', sub: 'Esc', onSelect: () => setSubmenu(null) },
            ]}
          />
        )
      }

      if (submenu === 'gear') {
        const owned = SKILL_ORDER.filter((s) => hero.skills.includes(s) && !SKILLS[s].passive)
        return (
          <Menu
            label="Gear"
            onBack={() => setSubmenu(null)}
            options={[
              ...owned.map((s): MenuOption => {
                const cooldown = hero.cooldowns[s] ?? 0
                return {
                  key: s,
                  label: SKILLS[s].name,
                  sub: cooldown > 0 ? `ready in ${cooldown}` : 'ready',
                  hint: SKILLS[s].description,
                  disabled: !canUseSkill(hero, s),
                  onSelect: () => act({ type: 'useSkill', skill: s }),
                }
              }),
              { key: 'back', label: 'Back', sub: 'Esc', onSelect: () => setSubmenu(null) },
            ]}
          />
        )
      }

      const hasGear = hero.skills.some((s) => !SKILLS[s].passive)
      return (
        <Menu
          label="Battle"
          columns={2}
          options={[
            {
              key: 'fight',
              label: 'Fight',
              primary: true,
              onSelect: () => setSubmenu('moves'),
            },
            {
              key: 'gear',
              label: 'Gear',
              disabled: !hasGear,
              sub: hasGear ? undefined : 'none yet',
              hint: 'Hidden skills bought from the Plug.',
              onSelect: () => setSubmenu('gear'),
            },
            { key: 'stats', label: 'Stats', onSelect: onShowStats },
            {
              key: 'run',
              label: 'Run',
              disabled: !battle.canFlee,
              sub: battle.canFlee ? undefined : 'no escape',
              onSelect: () => act({ type: 'flee' }),
            },
          ]}
        />
      )
    }

    case 'learnMove': {
      const { offered, npc } = phase
      const full = hero.moves.length >= MAX_MOVES

      if (submenu !== null && typeof submenu === 'object') {
        const learning = submenu.forgetFor
        return (
          <Menu
            label="Forget a move"
            columns={2}
            onBack={() => setSubmenu(null)}
            options={[
              ...hero.moves
                .filter((slot) => slot.id !== UNFORGETTABLE_MOVE)
                .map(
                  (slot): MenuOption => ({
                    key: slot.id,
                    label: `Forget ${MOVES[slot.id].name}`,
                    hint: MOVES[slot.id].description,
                    onSelect: () => act({ type: 'learnMove', move: learning, replace: slot.id }),
                  }),
                ),
              { key: 'back', label: 'Back', sub: 'Esc', onSelect: () => setSubmenu(null) },
            ]}
          />
        )
      }

      return (
        <Menu
          label={npc ? 'The playbook' : 'Learn a move'}
          columns={npc && offered.length > 4 ? 2 : 1}
          options={[
            ...offered.map(
              (id): MenuOption => ({
                key: id,
                label: MOVES[id].name,
                sub: moveSummary(id),
                hint: MOVES[id].description,
                onSelect: () =>
                  full ? setSubmenu({ forgetFor: id }) : act({ type: 'learnMove', move: id }),
              }),
            ),
            {
              key: 'skip',
              label: npc ? 'Never mind' : "Don't learn",
              onSelect: () => act({ type: 'skipLearn' }),
            },
          ]}
        />
      )
    }

    case 'dialogue':
      return (
        <Menu
          label="Talk"
          options={choicesFor(state, phase.npc, phase.node).map((c) => ({
            key: c.key,
            label: c.label,
            sub: c.hint ?? c.note,
            disabled: c.availability !== 'available',
            onSelect: () => act({ type: 'choose', choice: c.key }),
          }))}
        />
      )

    case 'shop':
      return (
        <Menu
          label="Shop"
          options={[
            ...SKILL_ORDER.map((s): MenuOption => {
              const def = SKILLS[s]
              const owned = hero.skills.includes(s)
              return {
                key: s,
                label: def.item,
                sub: owned ? 'owned' : `${def.price} clout`,
                hint: def.description,
                disabled: owned || hero.clout < def.price,
                onSelect: () => act({ type: 'buy', skill: s }),
              }
            }),
            { key: 'leave', label: "I'm good", onSelect: () => act({ type: 'leave' }) },
          ]}
        />
      )

    case 'gameOver':
    case 'victory':
      return null
  }
}

function moveSummary(id: MoveId): string {
  const { pp } = MOVES[id]
  return pp === null ? 'PP ∞' : `PP ${pp}`
}
