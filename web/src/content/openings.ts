/**
 * The "Opening": the enemy charges blindly and the hero picks where to strike.
 * Remake of the original strategicAttack. Outcomes and flavor text are kept,
 * but there is no instant death any more.
 */

import type { OpeningTarget } from '../engine/types'
import type { OpeningDef } from './types'

export const OPENING_INTRO = [
  '{enemy} rushes at you in a blind rage, trying to knock you flat...',
  '...and is wide open for a split second!',
]

export const OPENINGS: Record<OpeningTarget, OpeningDef> = {
  crotch: {
    target: 'crotch',
    label: 'Crotch',
    risk: 'safe',
    outcomes: [
      {
        weight: 1,
        winner: 'hero',
        text: [
          'You sidestep, yank {enemy} off-balance, and drive your knee up between the legs...',
          'missing the target but cracking the pelvic girdle!',
        ],
        effects: [{ type: 'damage', power: 0.9 }],
      },
      {
        weight: 1,
        winner: 'hero',
        text: [
          'You sidestep, yank {enemy} off-balance, and drive your knee up between the legs...',
          'with a sickening *squelch*. Everyone watching winces.',
        ],
        effects: [
          { type: 'damage', power: 1.5 },
          { type: 'status', target: 'foe', status: 'shook', turns: 2 },
        ],
      },
    ],
  },
  legs: {
    target: 'legs',
    label: 'Legs',
    risk: 'risky',
    outcomes: [
      {
        weight: 3,
        winner: 'hero',
        text: [
          'You slide forward and sweep your leg in a wide arc, sending {enemy} careening to the floor!',
        ],
        effects: [
          { type: 'damage', power: 0.8 },
          { type: 'status', target: 'foe', status: 'stunned', turns: 1 },
        ],
      },
      {
        weight: 2,
        winner: 'enemy',
        text: [
          'You slide in for a leg sweep... {enemy} just stops. Your foot lands laughably short.',
          "{enemy} looks at you like you're stupid and smacks you like your mama would when she BIG mad!",
        ],
        effects: [{ type: 'damage', power: 1 }],
      },
    ],
  },
  torso: {
    target: 'torso',
    label: 'Torso',
    risk: 'safe',
    outcomes: [
      {
        weight: 1,
        winner: 'hero',
        text: [
          'You meet fire with fire, weaving through the punches in a classic boxing stance...',
          'then step inside the guard and rain down jabs, crosses and hooks!',
        ],
        effects: [{ type: 'damage', power: 0.45, hits: 4 }],
      },
    ],
  },
  neck: {
    target: 'neck',
    label: 'Neck',
    risk: 'risky',
    outcomes: [
      {
        weight: 1,
        winner: 'hero',
        text: ["You explode forward and your fist slams into {enemy}'s windpipe!"],
        effects: [{ type: 'percentDamage', pct: 0.35, cap: 35 }],
      },
      {
        weight: 1,
        winner: 'enemy',
        text: ['{enemy} recovers, jukes around you, and jams a switchblade between your ribs!'],
        effects: [
          { type: 'percentDamage', pct: 0.2, cap: 25 },
          { type: 'status', target: 'foe', status: 'bleeding', turns: 3 },
        ],
      },
    ],
  },
  head: {
    target: 'head',
    label: 'Head',
    risk: 'reckless',
    outcomes: [
      {
        weight: 1,
        winner: 'hero',
        text: [
          'You tackle {enemy} full-bodied and pin them down. *Click*: a switchblade comes out...',
          'You wrench it away and end this. (Finishes enemies below 30% HP.)',
        ],
        effects: [{ type: 'execute', threshold: 0.3, fallbackPower: 2.2 }],
      },
      {
        weight: 1,
        winner: 'enemy',
        text: [
          'You go for the tackle, but {enemy} rolls you over. *Click*. The switchblade finds you first!',
        ],
        effects: [
          { type: 'damage', power: 1.8 },
          { type: 'status', target: 'foe', status: 'bleeding', turns: 2 },
        ],
      },
    ],
  },
}

export const OPENING_ORDER: readonly OpeningTarget[] = ['crotch', 'legs', 'torso', 'neck', 'head']
