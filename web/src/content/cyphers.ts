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
    {
      bar: "Roses are red, my diaper was too...\nWait, don't put that in the rap. Forget it. Boo!",
      answers: [
        {
          tier: 'fire',
          text: "Your diaper was red? Bro, that's a medical clue,\nyou need a pediatrician, not a rap battle crew.",
        },
        {
          tier: 'decent',
          text: "You lost your train of thought and your rhyme scheme too,\nso sit back down, this stage ain't for you.",
        },
        { tier: 'flop', text: 'Do you need me to call your mom?' },
      ],
    },
    {
      bar: "I'm so tough I farted in church and didn't say sorry,\nmy mom grounded me for a week. Worth it. I'm the man.",
      answers: [
        {
          tier: 'fire',
          text: "You farted in church and you're proud? What a plan,\nthe only thing that'll ever hype you up is a ceiling fan.",
        },
        {
          tier: 'decent',
          text: "You're bragging about farts, so I'll stick to my plan,\nI'll beat you so fast you'll go home in a van.",
        },
        { tier: 'flop', text: 'Farting in church is honestly pretty rude.' },
      ],
    },
    {
      bar: "Yo yo yo, it's me, the goon with the shoes,\nmy shoes light up when I stomp. Okay, that's my news.",
      answers: [
        {
          tier: 'fire',
          text: "Light-up shoes? That's the only bright thing you use,\nyour brain's on airplane mode, it's been stuck on snooze.",
        },
        {
          tier: 'decent',
          text: "Your shoes might light up, but you're still gonna lose,\nI'll knock you so hard you'll come out of those shoes.",
        },
        { tier: 'flop', text: 'Where did you get those? I want some.' },
      ],
    },
    {
      bar: "I ate eleven hot dogs at a Cubs game, no lie,\nthen I threw up on the mascot. That's how I fly.",
      answers: [
        {
          tier: 'fire',
          text: "You threw up on Clark the Cub and you think that's fly?\nEven the mascot spits better bars, and he don't even try.",
        },
        {
          tier: 'decent',
          text: "Eleven hot dogs and you still can't get by,\nI'll beat you so quick you won't even know why.",
        },
        { tier: 'flop', text: 'Clark the Cub did not deserve that.' },
      ],
    },
    {
      bar: "I'm like a dictionary, I got all the words,\nI just don't know what order they go in. Birds? Birds.",
      answers: [
        {
          tier: 'fire',
          text: "A dictionary with no order? That's a dumpster full of words,\neven a spelling bee would boo you, and that's a room full of nerds.",
        },
        {
          tier: 'decent',
          text: "You can keep your dictionary, I'll keep it absurd,\nI'll beat you so bad you'll be lost for words.",
        },
        { tier: 'flop', text: 'Birds are cool, I guess.' },
      ],
    },
    {
      bar: "My dad's a cop. Well, a mall cop. Well, he used to be.\nSo you better watch out, or he'll... call somebody. Me.",
      answers: [
        {
          tier: 'fire',
          text: "Your dad's a retired mall cop? That's your big threat? Gee,\nhe got outrun by a Segway in the food court at three.",
        },
        {
          tier: 'decent',
          text: "Your dad can come too, it's all the same to me,\nI'll beat you both down and then I'll walk free.",
        },
        { tier: 'flop', text: 'Mall cops work really hard, actually.' },
      ],
    },
    {
      bar: "I haven't showered since Tuesday, I'm a weapon, okay?\nOne whiff of these pits and you'll be gone. Like, away.",
      answers: [
        {
          tier: 'fire',
          text: "No shower since Tuesday? So that's why the flies wanna stay,\nyou don't need a fight, you need a hose and a can of Lysol spray.",
        },
        {
          tier: 'decent',
          text: "You can stink all you want, I'm still winning today,\nso hold your breath, goon, and get out of my way.",
        },
        { tier: 'flop', text: "Please take a shower, it's for your health." },
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
    {
      bar: "I been on this corner since the Bulls had Mike,\nI'm the reason the streetlights flicker every night.",
      answers: [
        {
          tier: 'fire',
          text: "Since Jordan? Then you're not a legend, you're a sad sight,\nyou're a fire hydrant that learned how to talk and pick a fight.",
        },
        {
          tier: 'decent',
          text: "You can stand on that corner and post there all night,\nbut I'm taking this block, and I'm doing it right.",
        },
        { tier: 'flop', text: "That's a long time to stand in one place." },
      ],
    },
    {
      bar: "Yo mama so slow she got lapped by the bus,\nand she was the one driving it. Don't make a fuss.",
      answers: [
        {
          tier: 'fire',
          text: "Yo mama jokes from a dude who sleeps on the bus?\nYour mama left you at the Jewel and said you're not one of us.",
        },
        {
          tier: 'decent',
          text: "You talk about my mama 'cause you can't handle us,\nI'll beat you so bad you'll be riding the bus.",
        },
        { tier: 'flop', text: 'My mom is actually a very good driver.' },
      ],
    },
    {
      bar: "Got a blade in my sock and a brick in my bag,\nI'll fold you up neat like a pocket-sized flag.",
      answers: [
        {
          tier: 'fire',
          text: "A brick in a bag? So you're a thug with a purse and a brag,\nand your blade's from the dollar store, it still has the tag.",
        },
        {
          tier: 'decent',
          text: "You can keep your brick and that blade in your bag,\nI'll beat you so quick you won't have time to brag.",
        },
        { tier: 'flop', text: 'Is that a reusable bag? Good for the environment.' },
      ],
    },
    {
      bar: "I eat Flamin' Hots for breakfast and I don't drink water,\nthen I go fight in the alley, and it only gets hotter.",
      answers: [
        {
          tier: 'fire',
          text: "Flamin' Hots with no water? Tough guy, I know what comes later,\nyou'll be crying on the toilet like a newborn otter.",
        },
        {
          tier: 'decent',
          text: "You can eat all the chips and skip all the water,\nI'm still beating you down like a lamb to the slaughter.",
        },
        { tier: 'flop', text: 'Those chips are really bad for your stomach.' },
      ],
    },
    {
      bar: "Every block from here to Western knows my name,\nI'm the reason the corner store put bars on its frame.",
      answers: [
        {
          tier: 'fire',
          text: "The whole block knows your name? It's on the store's wall of shame,\nright under 'don't let him use the bathroom.' That's your claim to fame.",
        },
        {
          tier: 'decent',
          text: "Everybody knows your name, but it's still a shame,\nI'm about to take over and run this whole game.",
        },
        { tier: 'flop', text: "I've never been to Western Avenue, is it nice?" },
      ],
    },
    {
      bar: "I'm the king of the corner, the duke of the curb,\nmy fists are the verbs and your face is the noun they disturb.",
      answers: [
        {
          tier: 'fire',
          text: "Your fists are the verbs? Then your grammar's not superb,\nyou never finished school, so your whole sentence ends at the curb.",
        },
        {
          tier: 'decent',
          text: 'You can rule the whole corner and sit on the curb,\nbut my bars are the sharpest, and my fists are superb.',
        },
        { tier: 'flop', text: "I don't think that's how grammar works." },
      ],
    },
    {
      bar: "I ain't scared of nothing, not a cop, not a rat,\nexcept my grandma's chancla. That thing hits like a bat.",
      answers: [
        {
          tier: 'fire',
          text: "Scared of your grandma's chancla? Bro, that's where you're at,\nyou're a thug who still gets whooped with a flip-flop, you brat.",
        },
        {
          tier: 'decent',
          text: "You ain't scared of a cop, but you're scared of all that,\nso come and get beat like a dusty old mat.",
        },
        { tier: 'flop', text: "Chanclas are just sandals, they can't hurt you." },
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
    {
      bar: "My leather pants been on since two thousand three,\nthey ain't been washed, they're as crusty as can be.",
      answers: [
        {
          tier: 'fire',
          text: "Twenty years in those leathers? Bro, that's why you can't pee,\nthose pants are fused to your legs, they're a branch on your family tree.",
        },
        {
          tier: 'decent',
          text: "Your leathers are crusty, as crusty can be,\nI'll beat you so fast that you'll want to flee.",
        },
        { tier: 'flop', text: "You should try a laundromat, there's one on Halsted." },
      ],
    },
    {
      bar: "I don't need a GPS, I navigate by smell,\nfrom every gas station in Gary straight to hell.",
      answers: [
        {
          tier: 'fire',
          text: "You navigate by smell? Then it's Gary every time, I can tell,\n'cause you smell just like Gary, and Gary don't smell well.",
        },
        {
          tier: 'decent',
          text: "You can ride out to Gary and stop at every motel,\nI'm still gonna beat you before the next bell.",
        },
        { tier: 'flop', text: 'GPS is really convenient, though.' },
      ],
    },
    {
      bar: "Delilah's got a sidecar, she saved it just for you,\nwe'll ride you to the lake and drop you in the blue.",
      answers: [
        {
          tier: 'fire',
          text: "A sidecar for me? Delilah's been cheating, it's true,\nshe told me that sidecar's where you sit when she rides with her crew.",
        },
        {
          tier: 'decent',
          text: "You and Delilah can ride all you want, it's true,\nbut I'm not getting in, so this ride is through.",
        },
        { tier: 'flop', text: 'I get motion sick in sidecars.' },
      ],
    },
    {
      bar: "I got road rash on my ass and a tattoo of my ex,\nI ain't scared of no pain, I'm a walking wreck.",
      answers: [
        {
          tier: 'fire',
          text: "Road rash on your ass and your ex on your neck,\nyou're not a biker, you're an insurance claim and a bounced check.",
        },
        {
          tier: 'decent',
          text: "You can show me your scars and the ink on your neck,\nI'll still knock you down and leave you on the deck.",
        },
        { tier: 'flop', text: 'Road rash sounds really painful, you should see a doctor.' },
      ],
    },
    {
      bar: "I'm a two-wheel prophet, I preach on the interstate,\nmy sermon's a burnout, my altar's a license plate.",
      answers: [
        {
          tier: 'fire',
          text: "A prophet on the interstate? Your bike broke down and you're late,\nthe only thing you ever converted was premium gas into dead weight.",
        },
        {
          tier: 'decent',
          text: "You can preach all you want on the interstate,\nbut I'm faster than you, and you're running late.",
        },
        { tier: 'flop', text: "I don't think that's how church works." },
      ],
    },
    {
      bar: "I outran the cops in three states without looking back,\nI'm a Harley-riding legend with a rap sheet, Jack.",
      answers: [
        {
          tier: 'fire',
          text: "You outran the cops? They were eating donuts in the back,\nand your rap sheet's just parking tickets stuffed in a sack.",
        },
        {
          tier: 'decent',
          text: "You can brag about your rap sheet and your Harley's old track,\nI'm still gonna beat you and send you right back.",
        },
        { tier: 'flop', text: "You really shouldn't run from the police." },
      ],
    },
    {
      bar: "I ride so long my butt's got its own zip code,\nI'm a Harley-built legend, the king of the road.",
      answers: [
        {
          tier: 'fire',
          text: "Your butt's got a zip code? That's the one place the mail never showed,\nyou ain't king of the road, you're a pothole the city just towed.",
        },
        {
          tier: 'decent',
          text: "You can talk about your butt and the miles that you rode,\nbut I'm taking that crown, so go carry your load.",
        },
        { tier: 'flop', text: 'Zip codes are for mail, not for butts.' },
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
    {
      bar: "I got soldiers on every corner from Cicero to the lake,\nwhen I sneeze, the whole West Side says 'bless you' for my sake.",
      answers: [
        {
          tier: 'fire',
          text: "Soldiers on every corner? Bro, half of 'em are on lunch break,\nthe other half are your cousins, and your empire's a sheet cake.",
        },
        {
          tier: 'decent',
          text: "You got soldiers on corners, but your crown is fake,\nI'm taking your throne, and that's no mistake.",
        },
        { tier: 'flop', text: 'Bless you. Do you need a tissue?' },
      ],
    },
    {
      bar: "I'll have my boys stuff you in a trunk with a skunk,\nand you'll ride out to Joliet smelling like my uncle's funk.",
      answers: [
        {
          tier: 'fire',
          text: "Your boys, a trunk, and a skunk? That's the plan? That's junk,\nthe skunk took one look at your crew and quit 'cause they stunk.",
        },
        {
          tier: 'decent',
          text: "You can talk about your trunk and your skunk and your junk,\nbut I'm still gonna beat you and call you a punk.",
        },
        { tier: 'flop', text: 'Skunks are actually pretty cute animals.' },
      ],
    },
    {
      bar: "I run this city like a chessboard, every move is mine,\nyou're a pawn on the edge, and you just crossed the line.",
      answers: [
        {
          tier: 'fire',
          text: "You play chess? I saw you lose to a pigeon in Grant Park, and that's fine,\nit pooped on your king, flipped the board, and walked off with your wine.",
        },
        {
          tier: 'decent',
          text: "You can call me a pawn, but I'm crossing your line,\nI'll take your whole board, and the crown will be mine.",
        },
        { tier: 'flop', text: 'I only know how to play checkers.' },
      ],
    },
    {
      bar: 'My suit cost more than your whole family tree,\nI wipe my ass with hundreds. Ask my accountant, Lee.',
      answers: [
        {
          tier: 'fire',
          text: "You wipe with hundreds? That's why your bank account's empty, see,\nyour accountant Lee already called the feds, and he's walking free.",
        },
        {
          tier: 'decent',
          text: "Your suit might be pricey, but it don't scare me,\nI'll beat you so bad that you'll be paying my fee.",
        },
        { tier: 'flop', text: "Please don't do that, it's bad for the plumbing." },
      ],
    },
    {
      bar: "I don't do my own dirty work, I got people for that,\nI got a guy who hits people, and a guy who holds my hat.",
      answers: [
        {
          tier: 'fire',
          text: "A guy to hold your hat? That ain't a boss, that's a coat rack and a brat,\nand when your hitter's on break, who swings for you? Your mama with a bat.",
        },
        {
          tier: 'decent',
          text: "You got people for this and people for that,\nbut when they're not around, you'll go down flat.",
        },
        { tier: 'flop', text: 'That sounds like a good business model.' },
      ],
    },
    {
      bar: "Kiss my ring, kiss my feet, kiss whatever I say,\nmy last rival's still kissing the bottom of the bay.",
      answers: [
        {
          tier: 'fire',
          text: "Kiss your feet? They smell like the last day of a buffet,\nand your ring's from a gumball machine, it turned your finger gray.",
        },
        {
          tier: 'decent',
          text: "I ain't kissing nothing, so get out of my way,\nI'm taking your crown, and I'm doing it today.",
        },
        { tier: 'flop', text: "I'd rather not kiss anything, thank you." },
      ],
    },
    {
      bar: "I built this empire brick by brick and deal by deal,\nyou're just a small fry, homie, and I'm the whole Happy Meal.",
      answers: [
        {
          tier: 'fire',
          text: "You're the whole Happy Meal? Then I'm taking the toy, that's the deal,\nyour empire comes with a paper crown, and neither one of them is real.",
        },
        {
          tier: 'decent',
          text: "You built it brick by brick, but now it's time to kneel,\nyour empire's made of cardboard and my fists are made of steel.",
        },
        { tier: 'flop', text: "I'm actually pretty hungry now." },
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
    {
      bar: "I got a Grammy at home. Well, it's a spray-painted spoon,\nbut my fans don't know that, they think I'm the man on the moon.",
      answers: [
        {
          tier: 'fire',
          text: "A spray-painted spoon? That's a Grammy for a buffoon,\nyou're not the man on the moon, you're a raccoon with a tune.",
        },
        {
          tier: 'decent',
          text: "You can brag about your spoon, but you're a cartoon,\nI'm taking your spotlight, and I'm taking it soon.",
        },
        { tier: 'flop', text: 'Spray-painted spoons are a cool craft idea.' },
      ],
    },
    {
      bar: "My verses so hot that the mic needs a fan,\nI'm the hottest rapper from here to Japan.",
      answers: [
        {
          tier: 'fire',
          text: "The hottest from here to Japan? Bro, you're big in a minivan,\nyour only fans are your aunties, and your mic's a Pringles can.",
        },
        {
          tier: 'decent',
          text: "You might be the hottest from here to Japan,\nbut I'm about to cook you, and that is the plan.",
        },
        { tier: 'flop', text: "I've always wanted to visit Tokyo." },
      ],
    },
    {
      bar: "I'm so rich I got a gold toilet with my face on the lid,\nevery time I take a dump, I remember all the hits that I did.",
      answers: [
        {
          tier: 'fire',
          text: "Your face on a toilet lid is the most plays you ever got, kid,\neven your gold toilet's embarrassed. It flushed your album and hid.",
        },
        {
          tier: 'decent',
          text: "You can sit on your toilet with your face on the lid,\nI'll still beat you down like you're just a kid.",
        },
        { tier: 'flop', text: 'Gold toilets sound really uncomfortable.' },
      ],
    },
    {
      bar: "My label just signed me to a seven-figure deal,\nand my next single's called Your Face When You Kneel.",
      answers: [
        {
          tier: 'fire',
          text: "Seven figures? Your label paid you in exposure and a Happy Meal,\nand your next single's called I Got Dropped. It's out Friday, for real.",
        },
        {
          tier: 'decent',
          text: 'You can brag about your label and your big record deal,\nbut your bars are made of plastic, and my fists are made of steel.',
        },
        { tier: 'flop', text: "Congratulations, that's really exciting news." },
      ],
    },
    {
      bar: 'Every track I drop is a certified smash,\nand every track you drop goes straight in the trash.',
      answers: [
        {
          tier: 'fire',
          text: 'Certified smash? The only thing certified is your rash,\nyour streams are your mama on seven phones she bought with your cash.',
        },
        {
          tier: 'decent',
          text: "You can talk about smashes and all of your cash,\nbut I'm about to win this fight in a flash.",
        },
        { tier: 'flop', text: 'I recycle, personally.' },
      ],
    },
    {
      bar: "My hype man's so loud he farts in Dolby surround,\nwhen we hit the stage, the whole crowd hits the ground.",
      answers: [
        {
          tier: 'fire',
          text: "Your hype man's farts in Dolby are the best beat you've ever found,\nthe crowd ain't ducking for you, they're scared he'll go another round.",
        },
        {
          tier: 'decent',
          text: "Your hype man can fart, but it's still a weak sound,\nI'll beat you so bad they'll send you to the pound.",
        },
        { tier: 'flop', text: 'Farting on stage seems unprofessional.' },
      ],
    },
    {
      bar: "I don't need auto-tune, my voice is a gift,\nI hit notes so high that the Sears Tower needs a lift.",
      answers: [
        {
          tier: 'fire',
          text: "Your voice is a gift? Then it's a gift card from a thrift,\nyou hit notes so high only dogs and your mama noticed the shift.",
        },
        {
          tier: 'decent',
          text: "Your voice might be a gift, but your rhymes are adrift,\nI'll beat you so fast you'll think time's moving swift.",
        },
        { tier: 'flop', text: 'You should try out for a choir.' },
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
    {
      bar: 'My master rides a donkey the size of a city block,\nI ride a unicycle, and my hat bells keep time like a clock.',
      answers: [
        {
          tier: 'fire',
          text: "Your master's donkey is huge, but you're the jackass on the block,\nyour bells keep time? Then I'm the alarm, and you're in for a shock.",
        },
        {
          tier: 'decent',
          text: "You can ride your unicycle all around the block,\nbut I'll knock you right off it, and you'll drop like a rock.",
        },
        { tier: 'flop', text: 'Unicycles are really hard to ride.' },
      ],
    },
    {
      bar: "The world's about to end, so I'm wearing no pants,\nthe apocalypse is breezy! Come on, join my dance!",
      answers: [
        {
          tier: 'fire',
          text: "No pants at the apocalypse? That's your big romance?\nEven the end of the world looked at you and took a second glance.",
        },
        {
          tier: 'decent',
          text: "You can dance all you want, but you don't stand a chance,\nI'm taking you out before you can prance.",
        },
        { tier: 'flop', text: 'Please put some pants on.' },
      ],
    },
    {
      bar: 'My master sees everything with his one good eye,\nhe saw you coming, and he laughed until he cried.',
      answers: [
        {
          tier: 'fire',
          text: "He laughed till he cried? That's 'cause he only sees one side,\nthe other side's me knocking out his jester, and he's missing the whole ride.",
        },
        {
          tier: 'decent',
          text: "Your master can watch with his one eye open wide,\nI'm still gonna beat you and wipe off your pride.",
        },
        { tier: 'flop', text: 'Is your master okay? That sounds serious.' },
      ],
    },
    {
      bar: 'I told the truth once, and it went terribly wrong,\nso now I only lie, like every word in this song.',
      answers: [
        {
          tier: 'fire',
          text: "You only lie in this song? Then your rapping is strong,\nwhich is a lie, so it's weak, and I've been right all along.",
        },
        {
          tier: 'decent',
          text: "You can lie all you want, it won't last very long,\nI'll beat you so fast that you'll hear the gong.",
        },
        { tier: 'flop', text: 'So was any of that true?' },
      ],
    },
    {
      bar: "I juggle three things: knives, fire, and my own poo,\nnow guess which one I'm about to throw at you.",
      answers: [
        {
          tier: 'fire',
          text: "You juggle your own poo? Then the end of the world is overdue,\nit took one sniff of your act and said it'll come back when you're through.",
        },
        {
          tier: 'decent',
          text: "Juggle whatever you want, I'll dodge all of it too,\nthen I'll take you down like a clown at the zoo.",
        },
        { tier: 'flop', text: 'Please wash your hands after that.' },
      ],
    },
    {
      bar: "I'm the opening act at the end of the world,\nI made a balloon animal of your soul, and it's curled.",
      answers: [
        {
          tier: 'fire',
          text: "My soul in a balloon? Nah, that's your career, all twisted and twirled,\nyou opened the show at the end of the world, and the world took one look and hurled.",
        },
        {
          tier: 'decent',
          text: "You can open the show at the end of the world,\nbut I'll be the closer, and you'll be the one getting twirled.",
        },
        { tier: 'flop', text: 'Balloon animals are fun at birthday parties.' },
      ],
    },
    {
      bar: 'My master offers water, but it burns like a stove,\nand his fire tastes sweet, like a cinnamon clove.',
      answers: [
        {
          tier: 'fire',
          text: "Water that burns and fire that's sweet? That's the oldest trick in the grove,\nyour master's a liar with one eye and a menu, and I ain't eating off his stove.",
        },
        {
          tier: 'decent',
          text: "You can keep all your water, your fire, and your stove,\nI'm sticking to the fight, and I'm not leaving this grove.",
        },
        { tier: 'flop', text: "I'm actually not thirsty, thanks." },
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
    {
      bar: "I'll read you to filth, (hmmmm) I'll read you like a book,\nand honey, that outfit? It's giving shook.",
      answers: [
        {
          tier: 'fire',
          text: "Read me like a book? The only one you've read is a coloring book,\nand you still colored outside the lines, Rodney, so who's the crook?",
        },
        {
          tier: 'decent',
          text: "You can read me all night, but I'm not off the hook,\nI'll beat you so bad you'll forget how to look.",
        },
        { tier: 'flop', text: "I haven't read a book in a while, honestly." },
      ],
    },
    {
      bar: "I've got more junk in my trunk than a Lincoln Park yard sale,\n(hmmmm) and baby, the Queen is never for sale.",
      answers: [
        {
          tier: 'fire',
          text: "More junk in your trunk than a yard sale? Rodney, that's a fail,\nthe only thing for sale here is your bars, and they're marked down and stale.",
        },
        {
          tier: 'decent',
          text: "You can sell me your junk, but I'm not on your trail,\nI'm here for the crown, so get ready to fail.",
        },
        { tier: 'flop', text: 'I love a good yard sale, personally.' },
      ],
    },
    {
      bar: "I was gonna let you live, (hmmmm) but you wore that to my fight,\nsocks with sandals, darling? That's a fashion crime tonight.",
      answers: [
        {
          tier: 'fire',
          text: "Socks with sandals? At least my feet are warm and my outfit's polite,\nyou're dressed like a flamingo that lost a bet to a highlighter, and the highlighter was right.",
        },
        {
          tier: 'decent',
          text: 'My socks and my sandals are staying in sight,\nso deal with it, Rodney, and get ready to fight.',
        },
        { tier: 'flop', text: 'These are very comfortable, though.' },
      ],
    },
    {
      bar: "(hmmmm) You're cute when you're scared, I could eat you for brunch,\nwith a mimosa on the side and a little bit of crunch.",
      answers: [
        {
          tier: 'fire',
          text: "Eat me for brunch? Babe, I'm the bill you can't afford, here's a hunch,\nyou'll be splitting the check with your ego, and I'll be gone before lunch.",
        },
        {
          tier: 'decent',
          text: "You can eat me for brunch or invite me to lunch,\nbut I'm still gonna win with one single punch.",
        },
        { tier: 'flop', text: "I'm a vegetarian, actually." },
      ],
    },
    {
      bar: "My heels are so high that I'm closer to God,\n(hmmmm) and He told me your outfit's a fraud.",
      answers: [
        {
          tier: 'fire',
          text: "Closer to God? Then He told you to come down, 'cause your heels are too odd,\nHe looked at your outfit, said He didn't make that, and gave Satan a nod.",
        },
        {
          tier: 'decent',
          text: "You can strut in your heels and get close to God,\nbut I'm still gonna win, and the crowd will applaud.",
        },
        { tier: 'flop', text: 'Those heels look painful to walk in.' },
      ],
    },
    {
      bar: "I've been around the block, (hmmmm) and around it again,\nI know every bouncer, every doorman, and all of their friends.",
      answers: [
        {
          tier: 'fire',
          text: "You've been around the block so much that the block wants amends,\nthe doormen don't love you, Rodney, you're just one of their trends.",
        },
        {
          tier: 'decent',
          text: "You've been around the block, but this is where it ends,\nI'm taking your crown, and that's how this ends.",
        },
        { tier: 'flop', text: 'Networking is very important.' },
      ],
    },
    {
      bar: "My penthouse on the Gold Coast has a pink hot tub,\n(hmmmm) and you're not invited, darling, you're not in the club.",
      answers: [
        {
          tier: 'fire',
          text: "Your Gold Coast penthouse is a studio above a Subway, with a sink for a tub,\nand the only club you're in is the one that comes on a six-inch sub.",
        },
        {
          tier: 'decent',
          text: "You can keep your hot tub and your fancy club,\nI'll beat you so bad you'll be needing a rub.",
        },
        { tier: 'flop', text: "Hot tubs aren't really my thing." },
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
    {
      bar: "I got so many chains I set off the metal detector at O'Hare,\nthey shut down three terminals, and I just stood there.",
      answers: [
        {
          tier: 'fire',
          text: "So many chains you shut down O'Hare? That's not ice, that's a scare,\nthe TSA confiscated your talent, and it's still circling in the air.",
        },
        {
          tier: 'decent',
          text: "You can wear all your chains and your blonde dreaded hair,\nbut I'm taking your crown, and I'm taking your chair.",
        },
        { tier: 'flop', text: "O'Hare is always so crowded anyway." },
      ],
    },
    {
      bar: "The King don't sweat, and the King don't stink,\nthe King's farts smell like a Gold Coast drink.",
      answers: [
        {
          tier: 'fire',
          text: "Your farts smell like a drink? Then that drink is Malört, I think,\nthe Bean's been foggy since you landed, and it ain't the mist, it's your stink.",
        },
        {
          tier: 'decent',
          text: "You can say what you want, but you still kinda stink,\nI'll knock off your crown before you can blink.",
        },
        { tier: 'flop', text: "I don't really drink, sorry." },
      ],
    },
    {
      bar: 'Without auto-tune I still sound like an angel,\nwell, an angel gargling gravel from a strange angle.',
      answers: [
        {
          tier: 'fire',
          text: "An angel gargling gravel? That's a car crash from every angle,\nturn the auto-tune off, you're a goat in a blender with its legs in a tangle.",
        },
        {
          tier: 'decent',
          text: "You can sing like an angel or work any angle,\nI'll knock off your crown and I'll leave your chains to dangle.",
        },
        { tier: 'flop', text: 'I think you have a lovely voice.' },
      ],
    },
    {
      bar: "I'm the wind in the Windy City, I'm the deep in the dish,\nI'm the reason the river turns green. I'm the King. I'm the wish.",
      answers: [
        {
          tier: 'fire',
          text: "You're the deep in the dish? Then you're soggy and cold, and nobody's ordering that dish,\nthe river turns green 'cause it saw your face and got sick. Ask any fish.",
        },
        {
          tier: 'decent',
          text: "You can be the wind and the river and the dish,\nbut I'm taking your crown with one clean swish.",
        },
        { tier: 'flop', text: 'The river is green because of dye, actually.' },
      ],
    },
    {
      bar: "I take a dump in a golden toilet shaped like The Bean,\nit reflects my royal behind. Prettiest thing you've ever seen.",
      answers: [
        {
          tier: 'fire',
          text: "You poop in a Bean? So that's why the tourists all leave looking green,\nthey been taking selfies in your toilet, and that Bean ain't never been clean.",
        },
        {
          tier: 'decent',
          text: "You can sit on your throne and keep everything clean,\nbut I'm knocking the crown off the King, and I'm mean.",
        },
        { tier: 'flop', text: "That's a public art installation, sir." },
      ],
    },
    {
      bar: "They built The Bean to reflect my face, it's a mirror for the King,\nand tourists from Ohio come to watch my blonde dreads swing.",
      answers: [
        {
          tier: 'fire',
          text: "The Bean reflects your face? That's why it's bent and it's warped, that's the thing,\nthe tourists from Ohio see you and ask for directions to the actual King.",
        },
        {
          tier: 'decent',
          text: "Your dreads can swing and your chains can bling,\nbut I'm here for the crown, and I'm taking that ring.",
        },
        { tier: 'flop', text: "I've never been to Ohio." },
      ],
    },
    {
      bar: "I'm a legend in the making, I'm a song on repeat,\nwhen I hum, the L stops, and the whole city taps its feet.",
      answers: [
        {
          tier: 'fire',
          text: "You're a song on repeat? That's why the whole city keeps hitting delete,\nand the L don't stop 'cause you hum, that's just the CTA being late on your street.",
        },
        {
          tier: 'decent',
          text: "You can hum all you want, but you're about to get beat,\nI'm taking your crown, and I'm taking your seat.",
        },
        { tier: 'flop', text: 'The CTA is actually pretty reliable.' },
      ],
    },
  ],
}
