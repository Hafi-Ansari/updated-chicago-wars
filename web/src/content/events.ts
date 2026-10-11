import type { NpcEffect, Text } from './types'

export interface StreetEvent {
  weight: number
  text: Text[]
  effects: NpcEffect[]
}

/** Quick no-choice happenings on the walk between blocks. */
export const STREET_EVENTS: readonly StreetEvent[] = [
  {
    weight: 2,
    text: ['You find a crumpled twenty on the Blue Line platform.'],
    effects: [{ type: 'clout', amount: 10 }],
  },
  {
    weight: 2,
    text: ['A pigeon snatches your fries and flies off. Everybody saw. Everybody.'],
    effects: [{ type: 'clout', amount: -5 }],
  },
  {
    weight: 1,
    text: ['A kid on a bucket drum plays so hard your wounds start closing up. Music heals.'],
    effects: [{ type: 'heal', pct: 0.15 }],
  },
  {
    weight: 1,
    text: ['Someone yells "AYO, AIN\'T YOU THAT ONE GUY?" You are, in fact, that one guy.'],
    effects: [{ type: 'clout', amount: 6 }],
  },
  {
    weight: 1,
    text: [
      'A stranger hands you a shot of Malört. You drink it.',
      'You will never be the same. Nothing else happens.',
    ],
    effects: [],
  },
  {
    weight: 1,
    text: ['The L rattles overhead. You yell over it for no reason. It feels good.'],
    effects: [{ type: 'heal', pct: 0.05 }],
  },
  {
    weight: 1,
    text: [
      'A guy in a Bears jersey hugs you and screams "THIS IS OUR YEAR!"',
      'It is not their year. You feel oddly motivated anyway.',
    ],
    effects: [{ type: 'clout', amount: 3 }],
  },
  {
    weight: 1,
    text: ['You get stuck behind a tourist photographing a puddle that reflects The Bean.'],
    effects: [{ type: 'clout', amount: -2 }],
  },
  {
    weight: 1,
    text: ['Your phone dies. You walk the next block in total silence, like a monk. Inner peace.'],
    effects: [{ type: 'heal', pct: 0.1 }],
  },
  {
    weight: 1,
    text: [
      'Someone drops a whole tin of cheese-and-caramel popcorn. You eat it off the sidewalk.',
      'No regrets.',
    ],
    effects: [{ type: 'heal', pct: 0.1 }],
  },
  {
    weight: 1,
    text: ['A guy on a milk crate offers you three-card monte. You win! Wait. No. You lost.'],
    effects: [{ type: 'clout', amount: -8 }],
  },
  {
    weight: 1,
    text: ['A kid asks for your autograph. You sign it "Future King of Chicago."'],
    effects: [{ type: 'clout', amount: 5 }],
  },
  {
    weight: 1,
    text: ['The wind off the lake slaps you so hard you see your ancestors. They say hi.'],
    effects: [],
  },
  {
    weight: 0.6,
    text: ['You find a parking spot downtown. On the first try. Nobody will ever believe you.'],
    effects: [{ type: 'clout', amount: 4 }],
  },
  {
    weight: 1,
    text: [
      'A street preacher yells that the end is near.',
      'You check your HP bar, just to be sure.',
    ],
    effects: [],
  },
]
