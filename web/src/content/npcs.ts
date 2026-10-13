/**
 * The run's three recurring vendors. Everyone raps. Each node's `lines` is a
 * pool of line sets; one set is picked per visit, avoiding recent repeats.
 */

import {
  GANGSTA_STORY_CLOUT,
  HOT_DOG,
  ITALIAN_BEEF,
  TRAINING,
  TRAINING_ORDER,
} from '../engine/balance'
import { STAT_LABELS } from '../engine/text'
import type { BoostableStat, NpcId } from '../engine/types'
import type { DialogueChoice, NpcDef } from './types'

const gangstaMenu: DialogueChoice[] = [
  {
    key: 'story',
    label: 'Ask about their life',
    once: true,
    effects: [{ type: 'clout', amount: GANGSTA_STORY_CLOUT }],
    next: 'story',
  },
  {
    key: 'train',
    label: 'Teach me a move',
    note: 'free · {lessons} in the playbook',
    require: { type: 'hasLessons' },
    lockedHint: 'pass on or forget a move first',
    effects: [{ type: 'startLesson' }],
    next: 'lesson',
  },
  {
    key: 'trade',
    label: 'Work on my stats',
    note: 'costs clout',
    require: { type: 'notTrainedYet' },
    lockedHint: 'one session per visit',
    next: 'training',
  },
  { key: 'leave', label: 'Bounce', next: 'end' },
]

const gain = (stat: BoostableStat) =>
  stat === 'crit' ? `+${Math.round(TRAINING.gains.crit * 100)}%` : `+${TRAINING.gains[stat]}`

/** One session per visit; every session bought this run raises all prices. */
const trainingChoices: DialogueChoice[] = [
  ...TRAINING_ORDER.map(
    (stat): DialogueChoice => ({
      key: `stat-${stat}`,
      label: `${gain(stat)} ${STAT_LABELS[stat]}`,
      note: `{${stat}Price} clout`,
      require: { type: 'canAffordTraining', stat },
      lockedHint: `{${stat}Price} clout`,
      effects: [{ type: 'train', stat }],
      next: 'trained',
    }),
  ),
  { key: 'back', label: "That's enough for now", next: 'menu' },
]

const gangsta: NpcDef = {
  id: 'gangsta',
  title: 'Gangsta',
  start: 'intro',
  nodes: {
    intro: {
      lines: [
        [
          'Your boi got the goods, dropping straight fire in da hood,\nbut you gonna need the clout, rook, like I knew you would.',
        ],
        [
          "Ayo, it's my favorite rookie, back on the block,\npull up a crate, let's talk and take stock.",
        ],
        ['Look who it is, the talk of the street,\nyou need some training? Grab a seat.'],
        ["I seen you fighting, I seen your form,\nit's sloppy, but I can teach you to perform."],
        ["Pull up, pull up, don't be shy,\nI got wisdom and gains, you just gotta buy."],
        ["Back again? I knew you'd be back,\nyou need a lesson or a stat attack?"],
        [
          "The streets been talking, they're saying your name,\ncome holler at me if you wanna stay in the game.",
        ],
        [
          "Every champ needs a coach, every coach needs a check,\nso what are we working on, rook? Let's flex.",
        ],
      ],
      choices: gangstaMenu,
    },
    menu: {
      lines: [
        ["Anything else, or you heading out?\nTime is clout, that's what it's about."],
        ["What else you need? Speak up, rook,\nI ain't got all day, I'm writing a book."],
        ["Something else on your mind? Let's hear it,\nyou got questions? I got the spirit."],
      ],
      choices: gangstaMenu,
    },
    story: {
      lines: [
        [
          'You wanna know my story? Sit back and listen,\nI used to coach ball, had a whole different mission.',
          'Then I owed some sharks a little more than a little,\nso I ran from the opps and got stuck in the middle.',
          "Now I'm out here teaching rookies like you,\nsame whistle, same playbook, brand new crew.",
        ],
        [
          'As a boy, nobody listened to a word I said,\nso I found God at church, but it went to my head.',
          "Devoted I became, but the hypocrisy grew,\nall that judging and preaching, I knew it wasn't true.",
          'So I left it behind for the hood and the street,\nand finally found peace in this concrete beat.',
        ],
        [
          'I spent my life in the projects, mama said I was next,\nalways tryna get by, always stressed.',
          "Most the folks I grew up with are gone or grown,\nso I'm passing it on 'fore I'm out on my own.",
        ],
        [
          "My life? I was a Cubs fan, then I switched to the Sox,\nthen I went back to the Cubs. Now I'm stuck in a box.",
          "Nobody on the North or the South Side trusts me,\nmy own family says I'm too disgusting to see.",
        ],
        [
          "I took one shot of Malört back in '09,\nand I ain't been the same, man, not one time.",
          'It tasted like a gym sock soaked in regret,\nbut it made me who I am, so I owe it a debt.',
        ],
        [
          'I was a deep dish guy, thick crust and proud,\ntill a tavern-style thin crust pulled me from the crowd.',
          "Now I'm cut in squares, I'm changed for real,\nthat's growth, little homie, that's how you heal.",
        ],
        [
          'Drove the Red Line train for twenty long years,\nseen more chaos than a Bears game, and twice the tears.',
          'One night a dude brought a live goat on the train,\nI quit the next morning, never been the same.',
        ],
        [
          "Blizzard of '67, my granddad survived,\ndug out his whole block with a shovel and his pride.",
          "He taught me the Hawk don't care who you are,\nso I fight like the wind, and I go just as far.",
        ],
      ],
      choices: [{ key: 'back', label: 'Respect.', next: 'menu' }],
    },
    lesson: {
      lines: [
        [
          'Every move you passed on, every move you dropped,\nI wrote it in my playbook, and the lessons never stopped.',
        ],
        [
          "This one's on the house, I don't charge my own,\npick a page, rook, and make that move your own.",
        ],
        ['Run it back? Say less, I keep receipts,\nevery move you ever saw out on these streets.'],
      ],
      choices: gangstaMenu,
    },
    taught: {
      lines: [
        ["There it is, you got it down cold,\nthat move's yours again, it never gets old."],
        ['Muscle memory, rook, it comes right back,\nlike riding a bike down the Lakefront track.'],
        ['See? Told you it was all in your hands,\nnow go show the block you understand.'],
      ],
      choices: gangstaMenu,
    },
    training: {
      lines: [
        ["Pick your poison, what you tryna build?\nHeart, hands, or feet, I'll get you skilled."],
        ["Gym's open, rook, this corner's my weights,\npick a stat and I'll set you straight."],
        [
          "Every session costs, that's just how it goes,\nthe more that you train, the higher it grows.",
        ],
      ],
      choices: trainingChoices,
    },
    trained: {
      lines: [
        [
          "Pleasure doing business, now go get it done,\nand tell 'em who trained you when you're number one.",
        ],
        ["That's what I like, a student who invests,\nnow go out there and put it to the test."],
        ["Bet. You're stronger now, I can tell,\nnow go ring some heads like a church bell."],
      ],
      choices: gangstaMenu,
    },
  },
  farewell: [
    'Stay up, stay sharp, stay out the way,\ncome see me again another day.',
    "Go handle your business, rook, I'll be here,\nposted on this corner all year.",
    "Peace, little homie, keep your guard high,\nand don't let them Goons catch you slipping. Bye.",
    'Remember what I taught you, remember the plan,\nand if anybody asks, you never met this man.',
  ],
}

const plug: NpcDef = {
  id: 'plug',
  title: 'Plug',
  start: 'intro',
  nodes: {
    intro: {
      lines: [
        ["Peep the goods I got, fresh off the lot,\nmaybe you'll like what you see and cop."],
        ["Psst. Hey. Yeah, you, come here quick,\nI got hidden skills that'll make you slick."],
        ["Step into my office: it's the back of a van,\nI got gear for days, I'm the gear man."],
        ["Don't ask where I got it, don't ask how,\njust know it's quality, and it's on sale now."],
        ['My prices are fair and my products are hot,\nlike, legally hot? Eh. Maybe not.'],
        [
          "Welcome back to the finest trunk in the Chi,\neverything you need, and it's all on the fly.",
        ],
        ['Shh, keep it down, the block got ears,\nI been plugging heroes for years and years.'],
      ],
      choices: [
        {
          key: 'browse',
          label: 'Show me what you got',
          effects: [{ type: 'openShop' }],
          next: 'end',
        },
        { key: 'leave', label: "Nah, I'm good", next: 'end' },
      ],
    },
  },
  farewell: [
    'Thank you, goodbye, and keep it on the low,\nthe less people know, the better, yo.',
    "Come back soon when your pockets are full,\nwindow shopping's free, but it's kinda dull.",
    "Catch you later, I'll be parked around,\njust follow the bass when you hear the sound.",
    "This conversation never happened, feel me?\nI was never here. I'm a ghost. You can't see.",
  ],
}

const hotDogVendor: NpcDef = {
  id: 'hotDogVendor',
  title: 'Hot Dog Vendor',
  start: 'intro',
  nodes: {
    intro: {
      lines: [
        [
          'AY! Fresh Chicago dogs, dragged through the garden,\nmustard, relish, onion, and a pickle. Beg your pardon!',
        ],
        [
          'You look like you been punched a whole bunch,\nsit down, champ, let me fix you some lunch.',
        ],
        ['All-beef dog on a poppy seed bun,\nthe best thing in this city, second to none!'],
        [
          "Step right up, it's the finest cart in town,\none bite of my dog and you'll never back down.",
        ],
        [
          "Sport peppers, tomato, a dash of celery salt,\nif you don't like it, that's your own fault.",
        ],
        ["Hungry? Hurting? Both? Say no more,\nI got the cure for what you're fighting for."],
      ],
      choices: [
        {
          key: 'dog',
          label: `Chicago dog (${HOT_DOG.price} clout, heal ${HOT_DOG.healPct * 100}%)`,
          require: { type: 'clout', min: HOT_DOG.price },
          lockedHint: 'Not enough clout',
          effects: [
            { type: 'clout', amount: -HOT_DOG.price },
            { type: 'heal', pct: HOT_DOG.healPct },
            { type: 'ateHotDog' },
          ],
          next: 'ate',
        },
        {
          key: 'beef',
          label: `Italian beef, dipped (${ITALIAN_BEEF.price} clout, full heal)`,
          require: { type: 'clout', min: ITALIAN_BEEF.price },
          lockedHint: 'Not enough clout',
          effects: [
            { type: 'clout', amount: -ITALIAN_BEEF.price },
            { type: 'heal', pct: ITALIAN_BEEF.healPct },
          ],
          next: 'ate',
        },
        {
          key: 'ketchup',
          label: 'Can I get ketchup on that?',
          effects: [{ type: 'ketchup' }],
          next: 'ketchup',
        },
        { key: 'leave', label: 'Keep walking', next: 'end' },
      ],
    },
    ate: {
      lines: [
        [
          { speaker: 'narrator', text: 'You devour it in four bites. {npc} nods approvingly.' },
          "That's how you eat it, that's the Chicago way,\ncome back tomorrow, I'm here every day.",
        ],
        [
          {
            speaker: 'narrator',
            text: 'Juice runs down your arm. You have never felt more alive.',
          },
          'Look at that color coming back to your face,\nmy food could heal the whole human race.',
        ],
        [
          {
            speaker: 'narrator',
            text: 'A sport pepper squirts you directly in the eye. Worth it.',
          },
          "Napkin? Nah, wear it with pride,\nthat relish stain's a badge on your side.",
        ],
      ],
      choices: [{ key: 'leave', label: 'Thanks, chief', next: 'end' }],
    },
    ketchup: {
      lines: [
        [
          '...',
          "KETCHUP?! On a HOT DOG?! In MY city?!\nGet out of my line, I don't do pity!",
          { speaker: 'narrator', text: '{npc} refuses to serve you. The whole line is staring.' },
        ],
        [
          "Ketchup? KETCHUP?! Did I hear that right?\nYou're banned from this cart, get out of my sight!",
          { speaker: 'narrator', text: 'Somebody in line gasps. A child starts crying.' },
        ],
        [
          'My grandpa just rolled over in his grave,\nketchup on a dog? Boy, you need to behave!',
          { speaker: 'narrator', text: '{npc} slams the cart lid shut. Message received.' },
        ],
      ],
      choices: [{ key: 'leave', label: 'Walk away in shame', next: 'end' }],
    },
  },
  farewell: [
    'Stay hungry, stay fed, stay out the rain,\nand never put ketchup on a dog again.',
    'Go on, get out of here, go win your fight,\nthe cart stays open all day and all night.',
    "Come back when you're hurting, come back when you're broke...\nwell, not broke. I don't do credit. That's no joke.",
  ],
}

export const NPCS: Record<NpcId, NpcDef> = { gangsta, plug, hotDogVendor }

/** Shown in the explore menu. */
export const NPC_ORDER: readonly NpcId[] = ['plug', 'gangsta', 'hotDogVendor']

/** What the Plug says after a sale. */
export const PLUG_SALE_LINES = [
  "The {item}? Good choice, a classic, a gem,\nyou'll be fighting like the pros, you'll be one of them.",
  'Pleasure doing business, no refunds, though,\nif it breaks, it was broken before. You know.',
  "That {item}'s been blessed by a guy I know.\nWell, he's a guy. Did he bless it? Who knows. Go!",
  'Ka-ching! Another satisfied fan,\ntell your friends about the gear-van man.',
  "Use it wisely, use it well,\nand if anybody asks, I don't know you. Farewell.",
] as const
