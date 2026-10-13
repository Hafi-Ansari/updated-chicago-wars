/**
 * Every enemy raps (except Goons, who try their best and fail). Move texts are
 * narration; intro/taunt/blockFlee/defeat are spoken bars.
 */

import type { EnemyKind } from '../engine/types'
import type { EnemyDef } from './types'

const goon: EnemyDef = {
  kind: 'goon',
  title: 'Goon',
  rhymes: false,
  intro: [
    'Maybe if I beat you, I can learn how to rap like everyone else in this city!',
    "I been doing pushups for like... three days. You're done!",
    "Roses are red, violets are... purple? You're dead. Wait. Hold on. That kinda worked?",
    "I'm gonna spit some bars! ...Okay, I don't know any bars. I'm gonna spit, though.",
    "My mom says I'm the toughest guy on our block. Our block is a cul-de-sac in Naperville.",
    'Gimme your clout! Or... some of it. Like half. Can we negotiate?',
    "I watched a whole YouTube video about fighting. At 2x speed. I'm basically a black belt.",
    'Everybody in this city raps but me. Do you know how lonely that is?! FIGHT ME!',
    "Okay, okay. Rhyme time. Uhh... cat. Hat. FIGHT! ...That's not a rhyme. Whatever!",
    "I'm the scariest guy in this alley. Please don't check if there's anyone else in this alley.",
    'I have a rap name. It\'s "Lil Goon." I came up with it myself. It took a week.',
    "You look like you've got clout. I've got zero clout. Let's fix that imbalance!",
  ],
  taunt: [
    'Ha! I meant to do that!',
    'Did that hurt? It hurt me a little.',
    "I'm basically a ninja. A loud ninja.",
    'Wait, which hand do I punch with again?',
    "Orange... door hinge... porridge... I'll find one eventually!",
    'This is going GREAT for me. Probably.',
    "Mom, if you're watching, I'm doing a fight!",
  ],
  blockFlee: [
    "I see you tryna run run, haha no I ain't had my fun fun! ...Wait, did I just rhyme?!",
    "Nuh-uh! You can't leave! I just got here! ...I mean, I've been here. You know what I mean!",
    "Hey! Get back here! I haven't even done my cool line yet!",
    "Where are you going?! This is the most attention anyone's given me all week!",
  ],
  defeat: [
    "Fo' sure, fo' sure, I'm done, yo...",
    "I'm telling my mom.",
    "Okay, new plan: I'm gonna become a poet first, then come back.",
    "That's fair. That's... honestly really fair.",
    'I think I saw my whole life flash by. It was mostly YouTube.',
    'Can you at least tell people I almost had you?',
    'I should have stayed in Naperville.',
  ],
  basicAttackWeight: 3,
  flee: {
    chance: 0.5,
    lines: [
      'Okay, I just remembered I left the stove on. In Naperville. BYE!',
      "This isn't running away! It's a tactical jog! Totally different!",
      "My mom's calling! ...She's not calling. But I'm leaving like she is!",
      "Tell everybody I won! I'm going home! Only one of those is true!",
      "I'm gonna go learn some bars and come back scarier. Don't wait up!",
      "I'm not crying, the Hawk is just really windy today! Bye forever!",
      "You'll never catch me! ...Please don't try to catch me.",
      'Is that a cop? No? Well, I respect the law enough to leave anyway!',
    ],
  },
  moves: [
    {
      weight: 1,
      text: '{enemy} flails both arms wildly!',
      effects: [{ type: 'damage', power: 0.6, hits: 2 }],
    },
    {
      weight: 0.5,
      text: '{enemy} tries a spinning kick and falls right over.',
      effects: [{ type: 'status', target: 'self', status: 'dazed', turns: 1 }],
    },
  ],
}

const thug: EnemyDef = {
  kind: 'thug',
  title: 'Thug',
  rhymes: true,
  intro: [
    "Heheh, I'm getting the hang of this trip,\nI'mma take your clout and then steal yo' whip!",
    "Run yo' pockets, run 'em quick,\nor catch these hands and a cheap shot kick.",
    'I been posted on this corner since half past nine,\nand every block from here to Western is mine.',
    "You walking real loud for somebody so small,\nI'm about to bounce you off this brick like a ball.",
    'New shoes, new chain, new reason to swing,\nyou picked the wrong night to be doing your thing.',
    "They call me a thug 'cause I ain't got manners,\nI'm about to fold you up like one of them banners.",
    'Ayo, look who wandered into my zone,\nleave your wallet, your clout, and your phone.',
    "Hood certified, street verified,\nby the end of this you'll be horrified.",
    "Saw you flexing on the Blue Line, thought you was cute,\nnow I'm about to take your clout and your boots.",
    "This my corner, this my spot,\nand you're standing on it, so you're getting got.",
  ],
  taunt: [
    "Stick and move, poke and slide,\nain't no place on this block you can hide.",
    "That was a tickle, here comes the pain,\nI'm faster than the Brown Line in the rain.",
    "Feel that? That's the street saying hi,\nand we ain't even started, don't ask me why.",
    "Swish, swish, watch the blade go by,\nyou'll be patching that up 'til the Fourth of July.",
    "Keep your guard up... oh wait, you can't,\nyou're shaking more than my grandma's plant.",
    "Pocket sand! Old school, but it works,\nnow you're blind, and I'm going berserk.",
  ],
  blockFlee: [
    "Nah nah nah, sit back down,\nyou ain't leaving 'til I say you're leaving town.",
    "Running? From me? In those shoes?\nYou ain't got the legs and you ain't got the moves.",
    "Block's on lock, every exit's shut,\nturn around, homie, and take one to the gut.",
  ],
  defeat: [
    "Aight, aight... you got that one,\ndon't tell nobody, I'm about to run.",
    "Took my pride and my rep in a minute flat,\nI'm moving to Indiana, and that's that.",
    "I'm down, I'm out, I'm seeing stars,\ntell the block I went out spitting bars.",
    "You won this one, but the war ain't done...\nactually, nah, it's done. You won.",
    "I slipped! It was the ice! It's October, I know!\nBut the Hawk was blowing, so I had to go.",
  ],
  basicAttackWeight: 3,
  flee: {
    chance: 0.35,
    lines: [
      "Hold up, hold up, my phone just rang,\nit's my grandma, she needs me, I gotta hang!",
      "This ain't running, homie, this is cardio day,\nwe'll finish this fight some other way!",
      "Smoke bomb! ...Okay, it's a bag of flour,\nbut I'll be three blocks gone inside the hour!",
      "Nah, I got a dentist appointment at four,\nI'm out the window, I ain't using the door!",
      "Tell the block I was brave, tell 'em I stood tall,\nI'm going home to hide in my mama's hall!",
      "My parking meter's out, I can hear the ticket man sing,\nyou win this one, chief, I'm doing my thing!",
    ],
  },
  moves: [
    {
      weight: 1,
      text: '{enemy} pulls out a shank!',
      effects: [
        { type: 'damage', power: 0.8 },
        { type: 'status', target: 'foe', status: 'bleeding', turns: 2, chance: 0.7 },
      ],
    },
    {
      weight: 0.7,
      text: '{enemy} throws a handful of pocket sand!',
      effects: [
        { type: 'damage', power: 0.3 },
        { type: 'status', target: 'foe', status: 'dazed', turns: 2, chance: 0.6 },
      ],
    },
  ],
}

const biker: EnemyDef = {
  kind: 'biker',
  title: 'Biker',
  rhymes: true,
  intro: [
    "Proficient I be in the school of rap,\nI'mma beat you while I play some trap!",
    "Rolled up on a hog with the pipes too loud,\nI'm about to leave you choking in the exhaust cloud.",
    'Leather on my back and grease on my hands,\nI run these roads from here to the Indiana sands.',
    "Two wheels, one rule: never back down,\nI'm the loudest thing rolling through this town.",
    "Sixty miles an hour down Lake Shore Drive,\nyou're lucky I stopped, you're lucky you're alive.",
    "My bike's named Delilah and she don't like you,\nshe told me to handle it, so that's what I'ma do.",
    "Helmet? Nah. Rules? Nah. Fear? Never had none,\nnow line up, it's time for my favorite kind of fun.",
    "I came up rough in the Rust Belt, son,\nyou're about to find out where the thunder comes from.",
  ],
  taunt: [
    "VRRRM VRRRM, hear the engine sing,\nthat's the sound of me about to do my thing.",
    "Smell that? That's gasoline and fear,\nmostly yours, homie, it's thick in here.",
    "I'm a road hog, a freeway king,\nyou're a speed bump, you ain't a thing.",
    "Kickstand down and the gloves come off,\nyou're about to cough like a busted exhaust.",
    "Highway to the danger zone, that's my song,\nand you've been in my lane way too long.",
  ],
  blockFlee: [
    "You can't outrun a Harley, homie, it's science,\nI got horsepower and zero compliance.",
    "Running on foot from a guy with a bike?\nThat's the dumbest plan I've seen, but alright.",
    "I'll chase you down Ashland, I'll chase you down Clark,\nI've got headlights, homie, I can ride in the dark.",
  ],
  defeat: [
    "Tell Delilah I loved her, tell her I tried,\nI'm walking home with nothing but my pride.",
    "Flat tire, busted chain, end of the ride,\nI'mma limp back to the garage and hide.",
    "Two wheels down and my engine's cold,\nyou're the real deal, just like I was told.",
    "I'm hanging up the leather, I'm selling the bike,\nI'm taking up knitting, it's what I really like.",
  ],
  basicAttackWeight: 3,
  flee: {
    chance: 0.25,
    lines: [
      "Delilah's calling, she needs an oil change,\nI'll be back... someday... when it's less strange!",
      "VRRRM VRRRM, that's the sound of retreat,\nI'm out like a Bears fan in November sleet!",
      "I'm not running, I'm riding, there's a difference, see,\nthe difference is the engine. Don't follow me!",
      "Two wheels, one rule: know when to quit,\nand buddy, I'm quitting, I'm done with it!",
      "Kickstand up, I'm gone in a flash,\nkeep the clout, I'm keeping my mustache!",
    ],
  },
  moves: [
    {
      weight: 1,
      text: '{enemy} revs the engine menacingly. VRRRM VRRRM!',
      effects: [{ type: 'status', target: 'self', status: 'pumped', turns: 2 }],
    },
    { weight: 1, text: '{enemy} clotheslines you!', effects: [{ type: 'damage', power: 1.3 }] },
    {
      weight: 0.7,
      text: '{enemy} blasts you with a cloud of exhaust!',
      effects: [{ type: 'status', target: 'foe', status: 'dazed', turns: 2, chance: 0.6 }],
    },
    {
      weight: 1.4,
      text: '{enemy} peels out and sprays a fistful of gravel right in your eyes!',
      effects: [
        { type: 'damage', power: 0.8 },
        { type: 'status', target: 'foe', status: 'blinded', turns: 3 },
      ],
    },
    {
      weight: 3,
      whenBelow: 0.35,
      maxUses: 2,
      text: '{enemy} takes a long pull from a flask that smells like motor oil. Liquid courage.',
      effects: [
        { type: 'healPct', pct: 0.3 },
        { type: 'status', target: 'self', status: 'pumped', turns: 2 },
      ],
    },
  ],
}

const gangLeader: EnemyDef = {
  kind: 'gangLeader',
  title: 'Gang Leader',
  rhymes: true,
  intro: [
    "Ayo yo yo, I'mma pop one in yo' tummy,\ncan't say no, 'cause your fighting is crummy!",
    'I run the whole crew from Cicero to the lake,\nevery corner I own, every dollar I make.',
    'You been knocking out my soldiers, causing a scene,\nnow you face the boss, the head of the machine.',
    "I don't get my hands dirty, I don't need to,\nbut for you I'll make an exception. I'll beat you.",
    'Suit pressed, hat tilted, ring on my hand,\nwhen I snap my fingers, the whole block stands.',
    "My boys say you're tough, my boys say you're slick,\nmy boys say a lot of stuff. Let's see real quick.",
    "Respect is earned, and you ain't paid,\nso let me show you how a leader's made.",
    "Fifteen years running this territory,\nyou're just a footnote in my life story.",
  ],
  taunt: [
    "Fellas! Get 'em! ...What do you mean you're on break?\nFine, I'll do it myself, for goodness' sake.",
    "This is business, nothing personal, kid,\nI'm just cleaning up the mess that you did.",
    "Look in my eyes and tell me you ain't shook,\nI read you easy like a kids' picture book.",
    "I built this empire from the ground floor,\nand you ain't the first to come knocking at my door.",
    "Bodyguard! Step up, take the hit,\nthat's what I pay you for, so don't quit.",
  ],
  blockFlee: [
    "My boys got the block wrapped, front to back,\nsit back down, homie, you ain't leaving, Jack.",
    'Leaving? Now? Before we settle up?\nNah, you finish what you started, so buckle up.',
  ],
  defeat: [
    'You just ended my whole operation,\nI respect it. Consider this my resignation.',
    "Fifteen years, gone in one night,\nI guess I'll retire to the suburbs. Alright.",
    "Tell my boys they're fired, every last one,\nwhere were they? At lunch? While I'm getting done?",
    "The crown's too heavy, the crew's too weak,\nI'm out the game, I need a long week.",
  ],
  basicAttackWeight: 3,
  moves: [
    {
      weight: 1,
      text: '{enemy} whistles. The whole crew jumps out of nowhere and piles on!',
      effects: [{ type: 'damage', power: 0.45, hits: 3 }],
    },
    {
      weight: 1,
      text: '{enemy} gives you a stare so cold your knees start shaking.',
      effects: [{ type: 'status', target: 'foe', status: 'shook', turns: 2 }],
    },
    {
      weight: 0.6,
      text: 'A bodyguard steps in front of {enemy}.',
      effects: [{ type: 'status', target: 'self', status: 'guarded', turns: 1 }],
    },
    {
      weight: 1.4,
      text: '{enemy} snaps twice. Two of the crew pin your arms while {enemy} pats you down.',
      effects: [{ type: 'damage', power: 0.8 }, { type: 'lockGear' }],
    },
    {
      weight: 1.3,
      text: '{enemy} shakes you down for "street tax." Win, and you can take it back.',
      effects: [
        { type: 'damage', power: 0.8 },
        { type: 'stealClout', min: 6, max: 12 },
      ],
    },
    {
      weight: 3,
      whenBelow: 0.35,
      maxUses: 2,
      text: '{enemy} whistles for the corner medic, who slaps on a bandage and runs.',
      effects: [{ type: 'healPct', pct: 0.3 }],
    },
  ],
}

const gangRapper: EnemyDef = {
  kind: 'gangRapper',
  title: 'Gang Rapper',
  rhymes: true,
  intro: [
    "We out here ballin', we don't do much talkin',\nleave you in the street and have your whole crew walkin'.",
    "Platinum plaques on the wall back home,\nI'm about to drop your name in my diss track poem.",
    "Mic check, one two, can you hear me now?\nI'm about to show you how the pros do it. Wow.",
    "My flow's colder than a January night,\nmy hook's so catchy you'll be humming through the fight.",
    "They play me on the radio from here to the Q,\nand my next hit single? It's all about you.",
    "I spit fire, you spit lukewarm water,\nyou're about to get roasted like a deep dish order.",
    "Autotune off, this is all natural,\nI'm about to make your defeat factual.",
    "My streaming numbers say I'm number one,\nand by the end of this, you'll be number none.",
  ],
  taunt: [
    "Here's a verse about your mama: she's lovely, though,\nshe makes good lasagna, I just thought you should know.",
    "Drop the beat! Boom bap, boom bap!\nThat's the sound of your face when I give it a slap.",
    "Bars on bars on bars on bars,\nI'm about to send you up to see the stars.",
    "Hold up, hold up, let me freestyle that,\nyou're soft like a beanie and flat like a mat.",
    "Ad-lib! Skrrt! Yeah! Uh-huh!\nYou can't keep up, so just give it up.",
    "Hype man! Hype man! Where you at?\nGet this crowd going, and that's a fact!",
  ],
  blockFlee: [
    "Where you going? I ain't dropped the hook yet!\nSit down, this is the best verse you'll ever get.",
    "Leaving mid-verse? That's disrespect,\nstay for the bridge, it's got the best effect.",
  ],
  defeat: [
    'This is going on my next album, for real,\na sad little song about how losing feels.',
    "Cancel my tour, refund my fans,\nI just got bodied by an amateur's hands.",
    "The beat just stopped, the crowd went home,\nI'm writing my comeback song alone.",
    "You win this battle, but my label's mad,\nworst review my new single ever had.",
  ],
  basicAttackWeight: 2,
  moves: [
    {
      weight: 1,
      text: '{enemy} drops a diss track about your mama. It goes kinda hard.',
      effects: [
        { type: 'damage', power: 0.6 },
        { type: 'status', target: 'foe', status: 'shook', turns: 2 },
      ],
    },
    {
      weight: 1,
      text: '{enemy} freestyles a flurry of bars AND fists!',
      effects: [{ type: 'damage', power: 0.5, hits: 3 }],
    },
    {
      weight: 0.7,
      text: "{enemy}'s hype man starts screaming ad-libs. The energy is unreal.",
      effects: [{ type: 'status', target: 'self', status: 'hyped', turns: 3 }],
    },
    {
      weight: 1.4,
      text: "{enemy}'s videographer swings a ring light into your face, and {enemy} poses for the shot.",
      effects: [
        { type: 'damage', power: 0.6 },
        { type: 'status', target: 'foe', status: 'blinded', turns: 3 },
        { type: 'status', target: 'self', status: 'hyped', turns: 2 },
      ],
    },
    {
      weight: 1.3,
      text: '{enemy} drops a whole verse clowning your last move. It stings, and it sticks.',
      effects: [{ type: 'damage', power: 0.7 }, { type: 'lockMove' }],
    },
    {
      weight: 1.3,
      text: '{enemy} jacks your flow, spits it back better, and feeds off the crowd.',
      effects: [
        { type: 'damage', power: 1 },
        { type: 'drain', pct: 0.5 },
      ],
    },
    {
      weight: 3,
      whenBelow: 0.35,
      maxUses: 2,
      text: '{enemy} sips honey-lemon tea between verses. Vocal rest is self-care.',
      effects: [{ type: 'healPct', pct: 0.3 }],
    },
  ],
}

// ── The gauntlet: blocks 11-13 of every run ─────────────────────────────────

const jester: EnemyDef = {
  kind: 'jester',
  name: "The Dajjal's Jester",
  title: 'Opening Act',
  entrance:
    "Bells jingle somewhere in the dark. The Dajjal's Jester cartwheels out of an alley, grinning way too wide.",
  rhymes: true,
  intro: [
    "Jingle, jingle, here comes the fool,\nmy master's only got one eye, and it's on you.",
    "Welcome, welcome, to the end of days!\nI'm the opening act, and the act never pays.",
    'My master sent me to warm up the crowd,\nso laugh at my jokes, and laugh real loud!',
    "Step right up to the last show in town,\nthe world's about to end, and I'm the clown!",
  ],
  taunt: [
    "Paradise or fire? Ooh, tough call, I know,\nspoiler: it's fire. It's always fire, though.",
    'My master sees with only one eye,\nbut he sees right through you, and so do I.',
    "Everything I say is a lie, it's true!\n...Wait. Then that's a lie too. What do I do?",
    'Ha! Hee! Hoo! You fell for it twice,\nI said it was paradise, I never said nice!',
    'Juggle, juggle, toss and spin,\nthe end is near, so let the show begin!',
  ],
  blockFlee: [
    "Leaving so soon? The show's just begun!\nNobody walks out on the end-of-the-world fun!",
  ],
  defeat: [
    "Oh no, oh woe, the fool takes a fall,\nmy master won't be laughing at all...",
    "Fine, fine, the Jester takes his bow,\nbut the Queen is next, and he's waiting now.",
    "My bells are bent and my hat's all torn,\ntell my master... consider him warned.",
  ],
  basicAttackWeight: 2.5,
  moves: [
    {
      weight: 1,
      text: '{enemy} juggles three flaming bowling pins, then throws all three at you.',
      effects: [{ type: 'damage', power: 0.45, hits: 3 }],
    },
    {
      weight: 1,
      text: '{enemy} offers you paradise. You step in. It is, somehow, on fire.',
      effects: [
        { type: 'damage', power: 1 },
        { type: 'status', target: 'foe', status: 'dazed', turns: 2, chance: 0.6 },
      ],
    },
    {
      weight: 1.3,
      text: '{enemy} covers one eye, whispers "my master sees you," and pokes you in both of yours.',
      effects: [
        { type: 'damage', power: 0.6 },
        { type: 'status', target: 'foe', status: 'blinded', turns: 3 },
      ],
    },
    {
      weight: 1.2,
      text: '{enemy} frisks you mid-cartwheel and leaves a rubber chicken where your gear was.',
      effects: [{ type: 'damage', power: 0.6 }, { type: 'lockGear' }],
    },
    {
      weight: 0.7,
      text: '{enemy} backflips, honks a tiny horn, and takes a bow. Nobody clapped. He feels great anyway.',
      effects: [
        { type: 'status', target: 'self', status: 'hyped', turns: 2 },
        { type: 'status', target: 'self', status: 'guarded', turns: 1 },
      ],
    },
  ],
}

const queen: EnemyDef = {
  kind: 'queen',
  name: 'Rodney',
  title: 'The Gay Queen',
  entrance:
    'A pink stretch limo pulls up to the curb. The door swings open, and Rodney steps out in head-to-toe pink, lowering his sunglasses.',
  rhymes: true,
  intro: [
    'I MUST get to (hmmmm) know you,\nmysterious stranger, come thruuuu!',
    'We were going to be such GOOD friends,\n(hmmmmm) I like to throw it back on men.',
    "Oh, you're the one who's been causing a scene?\n(hmmmm) baby, you've never fought a Queen.",
    'Pink from my boots to the tips of my nails,\n(hmmmm) honey, the Queen never fails.',
    "The Gold Coast called and it said I'm the best,\n(hmmmmm) now sit down, darling, and give it a rest.",
  ],
  taunt: [
    'Was that a punch? (hmmmm) how adorable,\nyour form is a crime and your fit is deplorable.',
    'Hmmmmm. Hmmmm. Let me think on it, dear...\nnope, still losing. That much is clear.',
    "Careful, sweetie, you'll smudge my gloss,\n(hmmmm) I need you to know who's boss.",
    "I'd call your outfit cute, but I just can't lie,\n(hmmmmm) it's giving clearance rack. Bye.",
    'Twirl, dip, death drop, slay,\n(hmmmm) that is how a Queen does play.',
  ],
  blockFlee: ['Leaving? Already? (hmmmm) the nerve,\nsit DOWN, darling, and get what you deserve.'],
  defeat: [
    "Hmmmm... well. That was rude of you, dear,\nI'll be at brunch if you need me. I'm out of here.",
    "You ruined my boa and you scuffed my shoe,\n(hmmmm) the King's up next. Good luck to you.",
    'Fine, you win, (hmmmm) but I looked better losing,\nand looking good is the part worth choosing.',
  ],
  basicAttackWeight: 2.5,
  moves: [
    {
      weight: 1,
      text: '{enemy} hits a death drop so hard the sidewalk cracks. You were standing on that sidewalk.',
      effects: [{ type: 'damage', power: 1.4 }],
    },
    {
      weight: 1.2,
      text: '{enemy} reads you for filth: your fit, your hairline, your credit score. All of it.',
      effects: [
        { type: 'damage', power: 0.6 },
        { type: 'status', target: 'foe', status: 'shook', turns: 2 },
      ],
    },
    {
      weight: 1,
      text: '{enemy} blows you a kiss. You are, against your will, flustered.',
      effects: [
        { type: 'damage', power: 0.5 },
        { type: 'status', target: 'foe', status: 'dazed', turns: 2, chance: 0.7 },
      ],
    },
    {
      weight: 1.3,
      text: '{enemy} whips a pink feather boa across your face. Feathers. Everywhere. In your eyes.',
      effects: [
        { type: 'damage', power: 0.5, hits: 2 },
        { type: 'status', target: 'foe', status: 'blinded', turns: 2 },
      ],
    },
    {
      weight: 1.1,
      text: '"I\'ll be taking that, darling." {enemy} lifts your wallet mid-twirl. Win, and you can have it back.',
      effects: [
        { type: 'damage', power: 0.7 },
        { type: 'stealClout', min: 8, max: 14 },
      ],
    },
    {
      weight: 0.8,
      text: '{enemy} snaps open a pink fan and fans himself. Unbothered. Moisturized. In his lane.',
      effects: [
        { type: 'status', target: 'self', status: 'vibing', turns: 3 },
        { type: 'status', target: 'self', status: 'guarded', turns: 1 },
      ],
    },
  ],
}

const boss: EnemyDef = {
  kind: 'boss',
  name: 'King Durkio',
  title: 'King of Chicago',
  entrance:
    'The crowd parts. A limo door opens, and out steps a man with blonde dreads, a crown, and a LOT of chains.',
  rhymes: true,
  intro: [
    "Blonde dreads swinging and the crown on tight,\nthey call me the Voice, and I'm singing you goodnight.",
    "Thirteen blocks you walked just to meet the King?\nShould've stayed home, 'cause you won't feel a thing.",
    'You got past the Jester, you got past the Queen,\nbut nobody, NOBODY, gets past the King.',
    'Auto-tune on and the ice on freeze,\nthe whole Chi bows when I hum on the breeze.',
  ],
  taunt: [
    "Kneel down, rookie, show some respect,\nthis crown's been heavy since my very first check.",
    "You hear that crowd? They're chanting my name,\nyou're just a feature on my verse in this game.",
    "Ice on the wrist and blonde on the dreads,\nthe whole city's singing whatever I said.",
    "Hold up, let me sing it, let me put it on wax,\nyour downfall's a ballad, and it's my best track.",
    'Every punch you throw, I already knew,\nI wrote this ending way before you.',
    "I been the King since before you could crawl,\nI'm Chicago itself, I'm the wind and the wall.",
  ],
  blockFlee: [
    "Nobody leaves The Bean 'til the King says so,\nsit down, the show's only halfway through, yo.",
  ],
  defeat: [
    "Nah... NAH! The crown... it's slipping away...\nthe city is yours, {hero}... for today.",
    "Auto-tune's busted and the Voice just cracked...\nyou took the crown, but the King'll be back.",
    'Blonde dreads down and the chain hit the ground,\nall hail {hero}, the new King in town.',
  ],
  basicAttackWeight: 2,
  moves: [
    {
      weight: 1,
      text: '{enemy} sings a hook so cold the whole block goes "OOOOH."',
      effects: [
        { type: 'damage', power: 0.7 },
        { type: 'status', target: 'foe', status: 'shook', turns: 2 },
      ],
    },
    {
      weight: 1,
      text: '{enemy} whips a platinum chain around like a flail!',
      effects: [
        { type: 'damage', power: 1.1 },
        { type: 'status', target: 'foe', status: 'bleeding', turns: 2, chance: 0.6 },
      ],
    },
    {
      weight: 0.7,
      text: "{enemy}'s whole crew starts chanting his name. Now {enemy} is pumped.",
      effects: [{ type: 'status', target: 'self', status: 'pumped', turns: 2 }],
    },
    {
      weight: 0.6,
      text: '{enemy} raises a hand and the wind off the lake answers.',
      effects: [
        { type: 'damage', power: 0.4 },
        { type: 'status', target: 'foe', status: 'frostbit', turns: 3 },
      ],
    },
    {
      weight: 1,
      whenBelow: 0.5,
      text: "{enemy} closes his eyes and croons into the auto-tune. They don't call him the Voice for nothing.",
      effects: [{ type: 'status', target: 'self', status: 'vibing', turns: 3 }],
    },
    {
      weight: 1.1,
      text: '{enemy} flips his blonde dreads into the streetlight, and the glare off his chains blinds you.',
      effects: [
        { type: 'damage', power: 0.7 },
        { type: 'status', target: 'foe', status: 'blinded', turns: 2 },
      ],
    },
    {
      weight: 1.0,
      text: '{enemy} backhands you and issues a royal decree: that move is banned in this city.',
      effects: [{ type: 'damage', power: 0.7 }, { type: 'lockMove' }],
    },
  ],
}

export const ENEMIES: Record<EnemyKind, EnemyDef> = {
  goon,
  thug,
  biker,
  gangLeader,
  gangRapper,
  jester,
  queen,
  boss,
}

/** The late-game rally: one free heal the first time an enemy drops low. Narration. */
export const RALLY_LINES = [
  '{enemy} knocks back a swig of cherry cough syrup straight from the bottle. Medicinal. Allegedly.',
  '{enemy} pulls out a tub of shea butter and works it into every scrape. Ashy is not an option.',
  "{enemy} closes their eyes and remembers the Bulls' '90s run. Six rings. Two three-peats. They feel unstoppable.",
] as const
