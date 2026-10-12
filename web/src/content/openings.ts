/**
 * Openings: mid-fight moments where the enemy leaves themselves exposed and the
 * hero picks where to strike. Each scenario sets up which body parts are open;
 * each body part weakens the enemy in its own way. Remake of the original
 * strategicAttack, with no instant deaths.
 */

import type { OpeningTarget } from '../engine/types'
import type { OpeningDef } from './types'

export interface OpeningScenario {
  weight: number
  intro: string[]
  /** Body parts this scenario can expose; a few are offered each time. */
  targets: OpeningTarget[]
}

export const OPENING_SCENARIOS: readonly OpeningScenario[] = [
  {
    weight: 2,
    intro: [
      '{enemy} rushes at you in a blind rage, trying to knock you flat...',
      '...and is wide open for a split second!',
    ],
    targets: ['crotch', 'legs', 'torso', 'neck', 'head', 'ribs'],
  },
  {
    weight: 1,
    intro: ['{enemy} winds up a HUGE haymaker, telegraphing it from a mile away...'],
    targets: ['ribs', 'arms', 'eyes', 'torso', 'head'],
  },
  {
    weight: 1,
    intro: ['{enemy} turns to hype up the crowd, back fully turned to you...'],
    targets: ['back', 'knees', 'neck', 'legs'],
  },
  {
    weight: 1,
    intro: ['{enemy} slips on a patch of black ice and flails for balance...'],
    targets: ['knees', 'legs', 'back', 'head', 'arms'],
  },
  {
    weight: 1,
    intro: ['{enemy} stops mid-fight to fix their chain. Their very expensive chain...'],
    targets: ['eyes', 'neck', 'arms', 'crotch', 'ribs'],
  },
  {
    weight: 1,
    intro: ['A car alarm goes off down the block. {enemy} whips around to look...'],
    targets: ['back', 'ribs', 'knees', 'eyes'],
  },
  {
    weight: 1,
    intro: ['{enemy} lunges in for a bear hug, arms wide open...'],
    targets: ['torso', 'ribs', 'crotch', 'head', 'arms'],
  },
  {
    weight: 1,
    intro: ['{enemy} pauses to check their phone. Somebody liked their post...'],
    targets: ['eyes', 'arms', 'knees', 'neck', 'back'],
  },
]

export const OPENINGS: Record<OpeningTarget, OpeningDef> = {
  eyes: {
    target: 'eyes',
    label: 'Eyes',
    risk: 'risky',
    outcomes: [
      {
        weight: 3,
        winner: 'hero',
        text: ['You go full Three Stooges: two fingers, straight to the eyes. *Nyuk nyuk.*'],
        effects: [
          { type: 'damage', power: 0.4 },
          { type: 'status', target: 'foe', status: 'dazed', turns: 3 },
        ],
      },
      {
        weight: 1,
        winner: 'enemy',
        text: ['{enemy} blinks it off and headbutts you right in the nose!'],
        effects: [{ type: 'damage', power: 0.9 }],
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
  arms: {
    target: 'arms',
    label: 'Arms',
    risk: 'safe',
    outcomes: [
      {
        weight: 3,
        winner: 'hero',
        text: [
          "You catch {enemy}'s wrist and twist it into a joint lock they saw on TV once.",
          'Their swing arm goes noodle-limp. (Attack down)',
        ],
        effects: [
          { type: 'damage', power: 0.5 },
          { type: 'status', target: 'foe', status: 'weakened', turns: 3 },
        ],
      },
      {
        weight: 1,
        winner: 'enemy',
        text: ['You grab an arm. {enemy} grabs your arm back. It becomes a slap fight. You lose.'],
        effects: [{ type: 'damage', power: 0.6 }],
      },
    ],
  },
  ribs: {
    target: 'ribs',
    label: 'Ribs',
    risk: 'risky',
    outcomes: [
      {
        weight: 2,
        winner: 'hero',
        text: [
          'You bury a body shot right under the ribs. All the air leaves {enemy} at once.',
          'They double over, gasping. (Stunned)',
        ],
        effects: [
          { type: 'damage', power: 0.8 },
          { type: 'status', target: 'foe', status: 'stunned', turns: 1 },
        ],
      },
      {
        weight: 1,
        winner: 'enemy',
        text: [
          '{enemy} flexes. Your fist bounces off like a dodgeball. They laugh and swing back.',
        ],
        effects: [{ type: 'damage', power: 0.9 }],
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
  back: {
    target: 'back',
    label: 'Back',
    risk: 'safe',
    outcomes: [
      {
        weight: 3,
        winner: 'hero',
        text: [
          "Cheap shot? Absolutely. Effective? Also absolutely. You drill {enemy}'s lower back.",
          'They spin around rattled and embarrassed. (Defense down)',
        ],
        effects: [
          { type: 'damage', power: 1.3 },
          { type: 'status', target: 'foe', status: 'shook', turns: 3 },
        ],
      },
      {
        weight: 1,
        winner: 'hero',
        text: [
          "You leap onto {enemy}'s back and ride them like a CTA bus at rush hour.",
          'Everybody on the block is filming. (Defense down, Speed down)',
        ],
        effects: [
          { type: 'damage', power: 0.7 },
          { type: 'status', target: 'foe', status: 'shook', turns: 2 },
          { type: 'status', target: 'foe', status: 'hobbled', turns: 2 },
        ],
      },
    ],
  },
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
          'with a sickening *squelch*. Everyone watching winces. (Defense down)',
        ],
        effects: [
          { type: 'damage', power: 1.5 },
          { type: 'status', target: 'foe', status: 'shook', turns: 2 },
        ],
      },
    ],
  },
  knees: {
    target: 'knees',
    label: 'Knees',
    risk: 'safe',
    outcomes: [
      {
        weight: 3,
        winner: 'hero',
        text: [
          "You stomp the side of {enemy}'s knee. It makes a noise knees shouldn't make.",
          'They limp around like they just ran the Chicago Marathon. (Speed down, Attack down)',
        ],
        effects: [
          { type: 'damage', power: 0.6 },
          { type: 'status', target: 'foe', status: 'hobbled', turns: 3 },
          { type: 'status', target: 'foe', status: 'weakened', turns: 2 },
        ],
      },
      {
        weight: 1,
        winner: 'enemy',
        text: ['You aim for the knee, miss, and kick a fire hydrant. Your toe files a complaint.'],
        effects: [{ type: 'damage', power: 0.5 }],
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
}

/** Menu order for offered targets (top of the body to the bottom). */
export const OPENING_ORDER: readonly OpeningTarget[] = [
  'eyes',
  'head',
  'neck',
  'arms',
  'ribs',
  'torso',
  'back',
  'crotch',
  'knees',
  'legs',
]
