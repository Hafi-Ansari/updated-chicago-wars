/**
 * Battle Rap: the bars enemies spit for the hero to answer, and the three comebacks
 * offered in pick mode (phones). Typed comebacks are judged on the server; picked ones
 * are scored by their tier. Fire and decent answers rhyme with the prompt's last word
 * (test/content.test.ts checks this with the server's rhyme scorer); flops don't.
 */

import type { EnemyKind } from '../engine/types'
import type { CypherPrompt } from './types'

export const CYPHERS: Record<EnemyKind, readonly CypherPrompt[]> = {
  goon: [
    {
      bar: "Okay, I'm gonna rap. Here goes. Ahem.\nYou're a... uh... loser! And I'm not! The end.",
      answers: [
        {
          tier: 'fire',
          text: "That's not a verse, that's a cry for a friend,\nyour rhymes are so broke they need a loan to mend.",
        },
        {
          tier: 'decent',
          text: "You tried to rap, but you couldn't defend,\nso sit back down and watch me ascend.",
        },
        { tier: 'flop', text: 'Uh... yeah? Well, you smell like an old bus seat.' },
      ],
    },
    {
      bar: "My mom says I'm the toughest kid in Naperville,\nI bench-pressed a beanbag. That's a real skill.",
      answers: [
        {
          tier: 'fire',
          text: "Bench-pressed a beanbag? That ain't a skill,\nthat's a nap with extra steps. Go home and chill.",
        },
        {
          tier: 'decent',
          text: "You're from the suburbs and you're over the hill,\nI'm from the city, and I'm here for the thrill.",
        },
        { tier: 'flop', text: 'Naperville is a nice place to raise a family.' },
      ],
    },
    {
      bar: "Everybody raps here except me. It's not fair!\nSo I'm gonna punch you instead. Prepare... the air!",
      answers: [
        {
          tier: 'fire',
          text: "You can't rap, can't fight, and you're losing your hair,\nyou rhyme like a toddler stuck in a high chair.",
        },
        {
          tier: 'decent',
          text: "You wanna throw hands? Go ahead, I don't care,\nI'll be done with you before you can blink and stare.",
        },
        { tier: 'flop', text: "Punching is against the rules, I'm pretty sure." },
      ],
    },
  ],

  thug: [
    {
      bar: "Stick and move, poke and slide,\nain't no place on this block you can hide.",
      answers: [
        {
          tier: 'fire',
          text: "I ain't hiding, I'm stretching. I take it in stride,\nyou're a Divvy bike thug: I just rent you for a ride.",
        },
        {
          tier: 'decent',
          text: "I don't need to hide, I'm standing with pride,\nso bring all your friends, I'll take 'em in stride.",
        },
        { tier: 'flop', text: "I'm not hiding, I'm just looking for my keys." },
      ],
    },
    {
      bar: "Run yo' pockets, run 'em quick,\nor catch these hands and a cheap shot kick.",
      answers: [
        {
          tier: 'fire',
          text: "My pockets are empty, but my bars are thick,\nyou couldn't rob a lemonade stand with a stick.",
        },
        {
          tier: 'decent',
          text: "You talk a big game, but your moves are slow,\nI'll dodge every punch and every trick.",
        },
        { tier: 'flop', text: "Please don't take my wallet, my bus pass is in there." },
      ],
    },
    {
      bar: "Saw you flexing on the Blue Line, thought you was cute,\nnow I'm about to take your clout and your boots.",
      answers: [
        {
          tier: 'fire',
          text: "You want my boots? Your whole crew's a bunch of recruits,\nso soft they wear Crocs with their Sunday suits.",
        },
        {
          tier: 'decent',
          text: "You can try for the clout, but you'll lose all your loot,\nI'm too quick for a thug, so go find some new routes.",
        },
        { tier: 'flop', text: "These boots are from a thrift store, they're not even worth it." },
      ],
    },
  ],

  biker: [
    {
      bar: "Two wheels, one rule: never back down,\nI'm the loudest thing rolling through this town.",
      answers: [
        {
          tier: 'fire',
          text: "Loudest thing in town? That's your muffler, not your sound,\nyou're a midlife crisis in a helmet, you clown.",
        },
        {
          tier: 'decent',
          text: "You're loud on the road, but you're quiet when I'm around,\nso park that bike and sit your leather down.",
        },
        { tier: 'flop', text: 'Motorcycles are actually really dangerous, you know.' },
      ],
    },
    {
      bar: "My bike's named Delilah and she don't like you,\nshe told me to handle it, so that's what I'ma do.",
      answers: [
        {
          tier: 'fire',
          text: "You named your bike Delilah, and she's leaving you too,\nshe's been texting me pics of her new exhaust. It's true.",
        },
        {
          tier: 'decent',
          text: "You and Delilah can both get through,\nI'm faster on foot than your rust-bucket crew.",
        },
        { tier: 'flop', text: "I don't think bikes can talk, sir." },
      ],
    },
    {
      bar: "Sixty miles an hour down Lake Shore Drive,\nyou're lucky I stopped, you're lucky you're alive.",
      answers: [
        {
          tier: 'fire',
          text: 'Sixty on Lake Shore? My grandma does sixty-five,\nyou ride like a minivan on a Sunday drive.',
        },
        {
          tier: 'decent',
          text: "You talk about speed, but you're slow to arrive,\nI'll be done with this fight before you hit five.",
        },
        { tier: 'flop', text: 'Please obey the speed limit, it is there for a reason.' },
      ],
    },
  ],

  gangLeader: [
    {
      bar: "Fifteen years running this territory,\nyou're just a footnote in my life story.",
      answers: [
        {
          tier: 'fire',
          text: "Fifteen years in charge and your crew's on lunch? Sorry,\nthat ain't an empire, that's a group chat with no glory.",
        },
        {
          tier: 'decent',
          text: "You've run it for years, but it's time to retire, sorry,\nthe next chapter is mine, and it's gonna be gory.",
        },
        { tier: 'flop', text: 'Wow, fifteen years is a long time to do anything.' },
      ],
    },
    {
      bar: 'You been knocking out my soldiers, causing a scene,\nnow you face the boss, the head of the machine.',
      answers: [
        {
          tier: 'fire',
          text: "Your soldiers folded faster than laundry, squeaky clean,\nyou ain't the head of a machine, you're a Roomba acting mean.",
        },
        {
          tier: 'decent',
          text: "I took out your soldiers, and I kept it clean,\nnow I'm coming for the boss, the top of the routine.",
        },
        { tier: 'flop', text: "I'm sorry about your soldiers, I hope they're okay." },
      ],
    },
    {
      bar: "Respect is earned, and you ain't paid,\nso let me show you how a leader's made.",
      answers: [
        {
          tier: 'fire',
          text: "A leader's made? You got your crown in a garage-sale trade,\nit's from a Burger King, and it's starting to fade.",
        },
        {
          tier: 'decent',
          text: "You want respect? Then get out of my shade,\nI'm the one on this block that's making the grade.",
        },
        { tier: 'flop', text: 'Respect is important at any job.' },
      ],
    },
  ],

  gangRapper: [
    {
      bar: "Mic check, one two, can you hear me now?\nI'm about to show you how the pros do it. Wow.",
      answers: [
        {
          tier: 'fire',
          text: "Your mic's been off since your last album somehow,\nthe only thing platinum is your hairline, and it's leaving now.",
        },
        {
          tier: 'decent',
          text: "You talk about the pros, but you're not one now,\nI'm taking your spotlight, and that's a vow.",
        },
        { tier: 'flop', text: 'Your microphone does sound very clear, good job.' },
      ],
    },
    {
      bar: "My flow's colder than a January night,\nmy hook's so catchy you'll be humming through the fight.",
      answers: [
        {
          tier: 'fire',
          text: "Your flow's so cold your label cut off the light,\nyour hook's so catchy your fans caught it and took flight.",
        },
        {
          tier: 'decent',
          text: "You might have a hook, but I've got the bite,\nand I'll be the one still standing tonight.",
        },
        { tier: 'flop', text: "I don't really listen to music, honestly." },
      ],
    },
    {
      bar: "Bars on bars on bars on bars,\nI'm about to send you up to see the stars.",
      answers: [
        {
          tier: 'fire',
          text: "Four 'bars' in a row? That's a parking lot, not bars,\nyou ain't sending me to the stars, you're the one stuck on Mars.",
        },
        {
          tier: 'decent',
          text: "You can talk about bars and point at the stars,\nbut I'm leaving this fight without any scars.",
        },
        { tier: 'flop', text: 'Did you know stars are just big balls of gas?' },
      ],
    },
  ],

  jester: [
    {
      bar: "Jingle, jingle, here comes the fool,\nmy master's only got one eye, and it's on you.",
      answers: [
        {
          tier: 'fire',
          text: "One eye on me? Then he's only getting half the view,\nand the half he can't see is me breaking through.",
        },
        {
          tier: 'decent',
          text: "Your master can watch, I'll give him a show too,\nthe fool's going down, and that's nothing new.",
        },
        { tier: 'flop', text: 'One eye? That sounds like a medical condition.' },
      ],
    },
    {
      bar: "Paradise or fire? Ooh, tough call, I know,\nspoiler: it's fire. It's always fire, though.",
      answers: [
        {
          tier: 'fire',
          text: "Your paradise is burning, and your jokes hit low,\nyou ain't the opening act, you're the fire drill before the show.",
        },
        {
          tier: 'decent',
          text: "I'll skip your paradise and your fire show,\nI'm here for the fight, so come on, let's go.",
        },
        { tier: 'flop', text: "I'd like the paradise option, please." },
      ],
    },
    {
      bar: "Everything I say is a lie, it's true!\n...Wait. Then that's a lie too. What do I do?",
      answers: [
        {
          tier: 'fire',
          text: "You lie so much your hat bells ring when you're through,\nthe only true thing you've said is 'I don't have a clue.'",
        },
        {
          tier: 'decent',
          text: "You can lie all you want, it don't matter to you,\nI'm still gonna beat you, through and through.",
        },
        { tier: 'flop', text: "So is it a lie or not? I'm confused." },
      ],
    },
  ],

  queen: [
    {
      bar: 'I MUST get to (hmmmm) know you,\nmysterious stranger, come thruuuu!',
      answers: [
        {
          tier: 'fire',
          text: "Get to know me? Babe, my bio's short but true:\nI came, I saw, and I out-dressed your whole crew.",
        },
        {
          tier: 'decent',
          text: "You can hmmm all day, I'm still coming through,\nso let's skip the small talk, I've got work to do.",
        },
        { tier: 'flop', text: 'Hi, nice to meet you. I like your outfit.' },
      ],
    },
    {
      bar: 'Pink from my boots to the tips of my nails,\n(hmmmm) honey, the Queen never fails.',
      answers: [
        {
          tier: 'fire',
          text: "Pink boots, pink nails, and a pink fan with scales,\nbut your bars come in beige, and your crown's from the sales.",
        },
        {
          tier: 'decent',
          text: "Your nails might be fresh, but I've got the details,\nI'm about to knock this Queen right off the rails.",
        },
        { tier: 'flop', text: 'I also like getting my nails done sometimes.' },
      ],
    },
    {
      bar: 'We were going to be such GOOD friends,\n(hmmmmm) I like to throw it back on men.',
      answers: [
        {
          tier: 'fire',
          text: "Good friends? Sorry, Rodney, I'm booked until ten,\nmy calendar just says 'beat Rodney.' Amen.",
        },
        {
          tier: 'decent',
          text: 'Friendship is a maybe, so ask me again,\nafter I win and the crowd counts to ten.',
        },
        { tier: 'flop', text: 'Um. Okay. Cool. Anyway.' },
      ],
    },
  ],

  boss: [
    {
      bar: "Blonde dreads swinging and the crown on tight,\nthey call me the Voice, and I'm singing you goodnight.",
      answers: [
        {
          tier: 'fire',
          text: "They call you the Voice 'cause the auto-tune does the fight,\nturn the pedal off and you give the whole crowd a fright.",
        },
        {
          tier: 'decent',
          text: "Your dreads may be blonde and your crown may be tight,\nbut I'm taking that throne, and I'm doing it right.",
        },
        { tier: 'flop', text: 'Goodnight to you too. Sleep well.' },
      ],
    },
    {
      bar: "Thirteen blocks you walked just to meet the King?\nShould've stayed home, 'cause you won't feel a thing.",
      answers: [
        {
          tier: 'fire',
          text: "Thirteen blocks and I'm still fresh enough to sing,\nyou had one job, Durkio, and you auto-tuned the King.",
        },
        {
          tier: 'decent',
          text: "I walked thirteen blocks and I'm still ready to swing,\nso hand me that crown and that big shiny ring.",
        },
        { tier: 'flop', text: 'My feet do hurt a lot, honestly.' },
      ],
    },
    {
      bar: "Ice on the wrist and blonde on the dreads,\nthe whole city's singing whatever I said.",
      answers: [
        {
          tier: 'fire',
          text: "The whole city's singing? They're begging you to go to bed,\nyour hooks are so long the Bulls finished a season instead.",
        },
        {
          tier: 'decent',
          text: "You can sing all you want, but the crown's on my head,\nI'm painting this city in purple and red.",
        },
        { tier: 'flop', text: "I like your chains, where'd you get them?" },
      ],
    },
  ],
}
