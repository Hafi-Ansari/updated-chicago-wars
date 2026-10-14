/**
 * Turns engine events into the lines the text box shows. Keeping this in the UI
 * means the engine never formats player-facing combat text itself.
 */

import { MOVES } from '../content/moves'
import { SKILLS } from '../content/skills'
import { type GameEvent, type Side, STAT_LABELS, type StatusKind, type Tone } from '../engine'

export interface Line {
  text: string
  speaker?: { name: string; side: Side | 'npc' }
  tone: Tone
}

export interface Names {
  hero: string
  enemy: string
}

/** [you, they] wordings: "You are stunned!" / "Jamal is stunned!". `X` is the name. */
const STATUS_TEXT: Record<StatusKind, Record<'applied' | 'expired', [string, string]>> = {
  stunned: {
    applied: ['You are stunned!', 'X is stunned!'],
    expired: ['You shake off the stun.', 'X shakes off the stun.'],
  },
  bleeding: {
    applied: ['You are bleeding!', 'X is bleeding!'],
    expired: ['You stopped bleeding.', 'X stopped bleeding.'],
  },
  pumped: {
    applied: ['You are PUMPED! (Attack up)', 'X is PUMPED! (Attack up)'],
    expired: ['You calmed down.', 'X calmed down.'],
  },
  shook: {
    applied: ['You are shook! (Defense down)', 'X is shook! (Defense down)'],
    expired: ['You got your nerve back.', 'X got their nerve back.'],
  },
  hyped: {
    applied: ['You are HYPED! (Crit chance up)', 'X is HYPED! (Crit chance up)'],
    expired: ['Your hype wore off.', "X's hype wore off."],
  },
  guarded: {
    applied: ['You put your guard up!', 'X is guarded!'],
    expired: ['You dropped your guard.', 'X dropped their guard.'],
  },
  dazed: {
    applied: ['You are dazed!', 'X is dazed!'],
    expired: ['Your head cleared.', "X's head cleared."],
  },
  frostbit: {
    applied: ['The Hawk bites you! (Speed down)', 'The Hawk bites X! (Speed down)'],
    expired: ['You thawed out.', 'X thawed out.'],
  },
  vibing: {
    applied: ['You are vibing! (Regenerating)', 'X is vibing! (Regenerating)'],
    expired: ['You stopped vibing.', 'X stopped vibing.'],
  },
  weakened: {
    applied: ['You are weakened! (Attack down)', 'X is weakened! (Attack down)'],
    expired: ['Your strength came back.', "X's strength came back."],
  },
  hobbled: {
    applied: ['You are hobbled! (Speed down)', 'X is hobbled! (Speed down)'],
    expired: ['You walked it off.', 'X walked it off.'],
  },
  blinded: {
    applied: ["You can't see! (Accuracy down)", "X can't see! (Accuracy down)"],
    expired: ['Your eyes adjust.', "X's eyes adjust."],
  },
  mirrored: {
    applied: ['You go full chrome! (Mirrored)', 'X goes full chrome! (Mirrored)'],
    expired: ['The chrome dulls back to normal.', "X's chrome dulls back to normal."],
  },
  incoming: {
    applied: ['A train is coming for you...', 'The L is on its way for X... (2 turns)'],
    expired: ['The tracks go quiet.', 'The L rolls on down the line.'],
  },
}

const who = (side: Side, names: Names, capital = true) =>
  side === 'hero' ? (capital ? 'You' : 'you') : names.enemy

/** Returns the line for an event, or null for purely visual events. */
export function describe(event: GameEvent, names: Names): Line | null {
  switch (event.type) {
    case 'narrate':
      return { text: event.text, tone: event.tone ?? 'normal' }
    case 'say':
      return {
        text: event.text,
        speaker: { name: event.speaker, side: event.side },
        tone: 'normal',
      }
    case 'location':
      return { text: `Block ${event.block}: ${event.neighborhood}`, tone: 'info' }
    case 'hit': {
      const crit = (event.crit ? 'A critical hit! ' : '') + (event.guarded ? '(Guarded) ' : '')
      const text =
        event.attacker === 'hero'
          ? `${crit}You hit ${names.enemy} for ${event.damage}!`
          : `${crit}${names.enemy} hits you for ${event.damage}!`
      return { text, tone: event.attacker === 'enemy' ? 'danger' : 'normal' }
    }
    case 'miss':
      if (event.reason === 'miss') {
        return {
          text: event.attacker === 'hero' ? 'Your attack missed!' : `${names.enemy} missed!`,
          tone: 'normal',
        }
      }
      return {
        text:
          event.attacker === 'hero'
            ? `${names.enemy} dodged your attack!`
            : `You dodged ${names.enemy}'s attack!`,
        tone: 'normal',
      }
    case 'move':
      return {
        text: `${event.user === 'hero' ? names.hero : names.enemy} used ${event.name}!`,
        tone: 'info',
      }
    case 'selfHit':
      return {
        text:
          event.target === 'hero'
            ? `You're dazed and hit yourself for ${event.damage}!`
            : `${names.enemy} is dazed and hits themselves for ${event.damage}!`,
        tone: event.target === 'hero' ? 'danger' : 'normal',
      }
    case 'reflect':
      return {
        text:
          event.target === 'hero'
            ? `The chrome throws ${event.damage} damage back at you!`
            : `The chrome throws ${event.damage} damage back at ${names.enemy}!`,
        tone: event.target === 'hero' ? 'danger' : 'reward',
      }
    case 'recoil':
      return {
        text:
          event.target === 'hero'
            ? `You took ${event.damage} recoil damage!`
            : `${names.enemy} took ${event.damage} recoil damage!`,
        tone: 'danger',
      }
    case 'levelUp':
      return { text: `${names.hero} reached Lv ${event.level}!`, tone: 'reward' }
    case 'moveLearned':
      return {
        text: event.replaced
          ? `${names.hero} forgot ${MOVES[event.replaced].name} and learned ${MOVES[event.move].name}!`
          : `${names.hero} learned ${MOVES[event.move].name}!`,
        tone: 'reward',
      }
    case 'tick':
      return {
        text: `${who(event.target, names)} ${event.target === 'hero' ? 'bleed' : 'bleeds'} for ${event.damage}!`,
        tone: event.target === 'hero' ? 'danger' : 'normal',
      }
    case 'heal':
      return event.amount > 0
        ? {
            text:
              event.target === 'hero'
                ? `You recovered ${event.amount} HP.`
                : `${names.enemy} recovered ${event.amount} HP.`,
            tone: 'reward',
          }
        : null
    case 'status': {
      const [you, they] = STATUS_TEXT[event.status][event.change]
      return { text: event.target === 'hero' ? you : they.replace('X', names.enemy), tone: 'info' }
    }
    case 'clout':
      return {
        text: event.amount >= 0 ? `+${event.amount} clout` : `${event.amount} clout`,
        tone: event.amount >= 0 ? 'reward' : 'normal',
      }
    case 'statUp':
      return {
        text: `${STAT_LABELS[event.stat]} +${event.stat === 'crit' ? `${Math.round(event.amount * 100)}%` : event.amount}!`,
        tone: 'reward',
      }
    case 'skillLearned': {
      const skill = SKILLS[event.skill]
      return { text: `You got the ${skill.item}! (${skill.name})`, tone: 'reward' }
    }
    case 'rapUnlocked':
      return {
        text: 'The crowd starts chanting. Battle Rap is unlocked!',
        tone: 'reward',
      }
    case 'cypher':
      // The engine narrates the crowd's reaction; this event drives the stage and sound.
      return null
    case 'callout':
      // Flashed on the stage (CALLOUT_TEXT), not written in the text box.
      return null
    case 'locked':
      return {
        text:
          event.what === 'move'
            ? `${MOVES[event.move].name} is locked for the rest of the fight!`
            : `${names.enemy} took your ${SKILLS[event.skill].name}! It's gone for the rest of the fight.`,
        tone: 'danger',
      }
    case 'appear':
    case 'faint':
    case 'fled':
      return null
  }
}
