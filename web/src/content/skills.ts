import type { SkillId } from '../engine/types'
import type { SkillDef } from './types'

export const SKILLS: Record<SkillId, SkillDef> = {
  airpods: {
    id: 'airpods',
    name: 'See Health',
    item: 'AirPods of Introspection',
    price: 20,
    description: "Passive. Hear your enemy's heartbeat: shows their exact HP.",
    passive: true,
    cooldown: 0,
    useText: [],
    effects: [],
  },
  aviators: {
    id: 'aviators',
    name: 'Sense Stats',
    item: 'Aviator Glasses of Peering',
    price: 35,
    description: 'Reveal enemy stats and expose their weak spots (DEF down 2 turns).',
    passive: false,
    cooldown: 3,
    useText: ['[Your gaze sharpens on {enemy} as you analyze them through your aviators.]'],
    effects: [{ type: 'reveal' }, { type: 'status', target: 'foe', status: 'shook', turns: 2 }],
  },
  taser: {
    id: 'taser',
    name: 'Stun Enemy',
    item: 'Taser of Ouch',
    price: 45,
    description: 'A light zap that usually stuns for a turn.',
    passive: false,
    cooldown: 3,
    useText: ['You leap forward and taze {enemy}!'],
    effects: [
      { type: 'damage', power: 0.5 },
      { type: 'status', target: 'foe', status: 'stunned', turns: 1, chance: 0.85 },
    ],
  },
  durag: {
    id: 'durag',
    name: 'Reflex Mode',
    item: 'Durag of Reflex',
    price: 70,
    description: 'Time slows. Three quick strikes.',
    passive: false,
    cooldown: 4,
    useText: [
      '[The world slows down around you as your perception and spatial awareness are increased sixfold.]',
      '{enemy} can only gape as you explode forward in a blur of speed!',
    ],
    effects: [{ type: 'damage', power: 0.6, hits: 3 }],
  },
  glock: {
    id: 'glock',
    name: 'Shoot Enemy',
    item: 'Glock of YWN Melly',
    price: 60,
    description: "Can't be dodged: 20% of their max HP. Then Murder On [Your] Mind heals you.",
    passive: false,
    cooldown: 5,
    useText: ['You whip out your glock and blast {enemy}!'],
    effects: [
      { type: 'percentDamage', pct: 0.2, cap: 30 },
      { type: 'heal', min: 6, max: 14 },
    ],
  },
}

/** Skill order for menus. */
export const SKILL_ORDER: readonly SkillId[] = ['airpods', 'aviators', 'taser', 'durag', 'glock']
