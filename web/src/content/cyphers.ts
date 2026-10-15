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
    {
      bar: "Mustard on the beat! ...I don't have a beat. I got a hot dog,\nand I put ketchup on it. Is that a diss? I learned it from a blog.",
      answers: [
        {
          tier: 'fire',
          text: "Ketchup on a Chicago dog? That's a hate crime, not a blog,\neven Drake never sank that low, and he's Canadian, dog.",
        },
        {
          tier: 'decent',
          text: "You can keep your hot dog and your little blog,\nI'll beat you so bad you'll be lost in the fog.",
        },
        { tier: 'flop', text: 'Ketchup on a hot dog is actually illegal here, I think.' },
      ],
    },
    {
      bar: "I wrote a diss track about you. It's called 'Hit 'Em Up.'\nIt's mostly about my sister. She took the last juice cup.",
      answers: [
        {
          tier: 'fire',
          text: "'Hit 'Em Up' about juice? That ain't a diss, that's a hiccup,\nyour sister's dropping the response, and it's called 'Grow Up.'",
        },
        {
          tier: 'decent',
          text: "Your diss about juice is a weak little setup,\nI'll beat you so fast you'll be begging me to let up.",
        },
        { tier: 'flop', text: 'Your sister should share the juice.' },
      ],
    },
    {
      bar: "Will the real Slim Shady please stand up?\n...Nobody stood up. Okay. I'll sit back down. Sorry, everybody.",
      answers: [
        {
          tier: 'fire',
          text: "The real Slim Shady stood up and left, 'cause your act is shoddy,\nyou're not Eminem, you're an M&M somebody stepped on in the lobby.",
        },
        {
          tier: 'decent',
          text: "Nobody stood up, 'cause you're not anybody,\nso sit back down, your rap game is shoddy.",
        },
        { tier: 'flop', text: 'I would have stood up, but my legs are tired.' },
      ],
    },
    {
      bar: "My rap name's Lil Goon. Like Lil Wayne, but even more lil,\nmy mixtape's called 'Tha Carter.' It's about my mom's Honda. Chill.",
      answers: [
        {
          tier: 'fire',
          text: "Weezy dropped Tha Carter, you dropped your mom's keys down a hill,\nyou ain't Lil Wayne, you're Lil Wait, still waiting on some skill.",
        },
        {
          tier: 'decent',
          text: "You can call yourself Lil and keep it real chill,\nbut I'm taking your clout, and I'm in for the kill.",
        },
        { tier: 'flop', text: 'Lil Wayne has a lot of albums. You should listen to them.' },
      ],
    },
    {
      bar: "I'm gonna Ether you, like Nas did! I googled what Ether means,\nit's a gas that puts you to sleep. So... nap time. Sweet dreams.",
      answers: [
        {
          tier: 'fire',
          text: "Nas needed one song to put Hov to sleep, you need Google, it seems,\nyour rap career's the only nap here, and it's ending in screams.",
        },
        {
          tier: 'decent',
          text: "You can google Ether and dream all your dreams,\nI'm still gonna beat you and bust all your seams.",
        },
        { tier: 'flop', text: 'Ether is actually a medical anesthetic, I think.' },
      ],
    },
    {
      bar: "I'm the Drake of Naperville! I started from the bottom!\nWell, the bottom bunk. My brother's on top. I don't like him.",
      answers: [
        {
          tier: 'fire',
          text: "You started from the bottom, and you stayed there. Your odds are slim,\nyou ain't the Drake of Naperville, you're a drake at the pond. Go swim.",
        },
        {
          tier: 'decent',
          text: "Started from the bottom, and your future is dim,\nI'll beat you so bad you'll be quitting the gym.",
        },
        { tier: 'flop', text: 'Bunk beds are fun. I always wanted one.' },
      ],
    },
    {
      bar: "I'm gonna put your house on my cover, like Kendrick did!\nI drew a map of your house. Wait, that's my house. I'm just a kid.",
      answers: [
        {
          tier: 'fire',
          text: "You put your own house on the cover? That's the best you ever did,\nKendrick mapped a mansion, you mapped your mom's closet where you hid.",
        },
        {
          tier: 'decent',
          text: "You drew your own house, so I guess that's your bid,\nI'll knock you right out like a pot with no lid.",
        },
        { tier: 'flop', text: 'Drawing maps is a good skill to have.' },
      ],
    },
    {
      bar: "Palms are sweaty, knees weak, arms are... uh... spaghetti?\nMom's spaghetti! That's the whole song, right? Okay. I'm ready.",
      answers: [
        {
          tier: 'fire',
          text: "You only memorized the spaghetti, so you'll never be ready,\nyou're the noodle Eminem dropped on his sweater, and it's still sweaty.",
        },
        {
          tier: 'decent',
          text: "You can talk about spaghetti, but you'll never be steady,\nI'm already winning, so pick up your confetti.",
        },
        { tier: 'flop', text: 'I could go for some spaghetti right now.' },
      ],
    },
    {
      bar: "You're just like Drake! You're... Canadian? Are you Canadian?\nI don't know why that's a diss. My cousin said it was. Oh, man. Again.",
      answers: [
        {
          tier: 'fire',
          text: "Calling me Canadian is the worst diss you've got? Try again,\nyou diss like your cousin wrote it with a crayon and a broken pen.",
        },
        {
          tier: 'decent',
          text: "You called me Canadian? Okay, call me again,\nI'll beat you so fast you won't make it to ten.",
        },
        { tier: 'flop', text: "I'm not Canadian, but I've been to Canada once." },
      ],
    },
    {
      bar: "I got beef with Kendrick Lamar! He doesn't know yet.\nI sent him a letter. It came back. Return to sender. I'm upset.",
      answers: [
        {
          tier: 'fire',
          text: "Kendrick's got a Pulitzer, and you got a stamp and some regret,\nthe mailman read your diss and sent it back. It wasn't even a threat.",
        },
        {
          tier: 'decent',
          text: "You can write him a letter and send it with sweat,\nbut I'm the one you're facing, so pay me your debt.",
        },
        { tier: 'flop', text: 'Maybe you should try sending him an email.' },
      ],
    },
    {
      bar: "They say I'm the Ja Rule of this alley. I think that's good?\nHe threw a festival on an island. I'd go. If my mom said I could.",
      answers: [
        {
          tier: 'fire',
          text: "You're the Ja Rule of the alley? So you're all hype and no food,\nyour festival's a cheese sandwich in a tent. Your mom said no, and she should.",
        },
        {
          tier: 'decent',
          text: "You can be Ja Rule, I'll be 50 in the hood,\nI'll beat you so bad that you'll knock on wood.",
        },
        { tier: 'flop', text: 'Island festivals sound really fun.' },
      ],
    },
    {
      bar: "Okay, Kanye mode: 'Yo, I'mma let you finish, but...'\n...I forgot the rest. Can you just finish? I'm in a rut.",
      answers: [
        {
          tier: 'fire',
          text: "You did Kanye but forgot the punchline? Bro, that's a paper cut,\nYe stole Taylor's mic, you can't even steal a thought. Keep your mouth shut.",
        },
        {
          tier: 'decent',
          text: "You're stuck in a rut, so let me make the cut,\nI'll finish this fight while you sit on your butt.",
        },
        { tier: 'flop', text: 'Taylor Swift seems really nice, honestly.' },
      ],
    },
    {
      bar: "They call me 50 Cent! 'Cause I got fifty cents! It's right here!\nI'm gonna buy a gumball. Then I'm 25 Cent. Still scary, I swear.",
      answers: [
        {
          tier: 'fire',
          text: "50 got rich or died trying, and you got a gumball and a stare,\nyou're not 50 Cent, you're a penny stuck under a booth chair.",
        },
        {
          tier: 'decent',
          text: "You can spend your fifty cents on a gumball there,\nI'll beat you so bad you'll be pulling out your hair.",
        },
        { tier: 'flop', text: "Gumballs are only a quarter now? That's cheap." },
      ],
    },
    {
      bar: "I wrote my bars down in a notebook, like Canibus, yo,\nhold on, that's my grocery list. Milk, eggs... uh... here we go.",
      answers: [
        {
          tier: 'fire',
          text: "A notebook at a battle? Canibus took that L years ago,\nyour bars are milk and eggs, so I'll scramble you and give the crowd a show.",
        },
        {
          tier: 'decent',
          text: "You can read me your list of the things that you owe,\nI'm still gonna beat you and steal the whole show.",
        },
        { tier: 'flop', text: 'Writing things down is a good way to remember them.' },
      ],
    },
    {
      bar: "My mom is my hype man. She drives me to battles in the van,\nshe holds a sign that says 'Good job, sweetie!' Everybody's a fan.",
      answers: [
        {
          tier: 'fire',
          text: "Your mom's the hype man, and that sign's the only time you had a fan,\neven Flavor Flav would turn his clock back to before your career began.",
        },
        {
          tier: 'decent',
          text: "Your mom drives the van and she's holding the plan,\nbut I'm taking this fight, so go home while you can.",
        },
        { tier: 'flop', text: "That's really sweet of your mom. Tell her hi." },
      ],
    },
    {
      bar: "I'm gonna crank that Soulja Boy! Watch me! Crank that! Uh...\nI pulled something in my back. Superman that? I need an ice pack.",
      answers: [
        {
          tier: 'fire',
          text: "You tried to Superman that and threw out your back? That's whack,\nSoulja Boy said he was the first, and you're the first to crack.",
        },
        {
          tier: 'decent',
          text: "You can crank all you want, but you're losing the track,\nI'll beat you so bad you'll be flat on your back.",
        },
        { tier: 'flop', text: 'You should stretch before you dance.' },
      ],
    },
    {
      bar: "Yo, I'm the Kendrick of the cul-de-sac! Sit down! Be humble!\nWait, I'm supposed to sit down. Hold on. I tripped. Oops. Stumble.",
      answers: [
        {
          tier: 'fire',
          text: "The Kendrick of the cul-de-sac? Your crown's a cookie crumble,\nhe said 'be humble,' and you heard it as a dare to fall down and mumble.",
        },
        {
          tier: 'decent',
          text: "You told me be humble, but you're taking the tumble,\nso sit down, little goon, and get ready to rumble.",
        },
        { tier: 'flop', text: "You should tie your shoes, that's probably why you tripped." },
      ],
    },
    {
      bar: "I made a diss track on GarageBand. It's forty-seven minutes long,\nit's mostly me breathing. And a dog. My mom says it's really strong.",
      answers: [
        {
          tier: 'fire',
          text: "Forty-seven minutes of breathing? Even Drake's albums aren't that long,\nand the dog had the best verse. Give him the deal, you're the bonus song.",
        },
        {
          tier: 'decent',
          text: "You can breathe on a beat and you can sing along,\nbut I'm taking this fight, so go bang on a gong.",
        },
        { tier: 'flop', text: 'GarageBand is free on most Macs, I think.' },
      ],
    },
    {
      bar: "Everybody's got a beef! I want a beef! Can I have yours?\nI'll trade you a Pokémon card. It's a Charizard. Holo. Of course.",
      answers: [
        {
          tier: 'fire',
          text: "Trading Pokémon for beef? Drake and Kendrick are crying in remorse,\nyou don't want beef, you want a Happy Meal and a pony. Go ride a horse.",
        },
        {
          tier: 'decent',
          text: "You can trade for a beef, but you'll lose it by force,\nI'll beat you so bad that you'll go home hoarse.",
        },
        { tier: 'flop', text: 'I collect Pokémon cards too! Do you have any Pikachus?' },
      ],
    },
    {
      bar: "My uncle knows Chief Keef. Well, he saw him at a gas station.\nOkay, it was a guy who looked like him. Still. That's a relation.",
      answers: [
        {
          tier: 'fire',
          text: "Your uncle saw a Chief Keef lookalike pumping gas? Big sensation,\nyou're not connected to Sosa, you're connected to your imagination.",
        },
        {
          tier: 'decent',
          text: "You can brag about your uncle and his gas station,\nI'll beat you so bad you'll need a long vacation.",
        },
        { tier: 'flop', text: 'A lot of people look like Chief Keef.' },
      ],
    },
    {
      bar: "I make drill music! Chicago drill! I really got a drill,\nit's my dad's DeWalt. I drilled the wall. Now he's mad. That's the skill.",
      answers: [
        {
          tier: 'fire',
          text: "Chicago drill? You put a hole in the drywall. That's the thrill?\nChief Keef made history, you made your dad a Home Depot bill.",
        },
        {
          tier: 'decent',
          text: "You can play with your drill, but you're over the hill,\nI'm taking this fight, so go home and chill.",
        },
        { tier: 'flop', text: 'Power tools are dangerous. Please wear safety goggles.' },
      ],
    },
    {
      bar: "My dream's to get a feature on a Drake song. Just one word.\nLike, the guy who goes 'yeah' in the back. I'd be so heard.",
      answers: [
        {
          tier: 'fire',
          text: "Your dream is one 'yeah' on a Drake song? Bro, that's absurd,\neven the owl on his chain gets more lines, and that's a bird.",
        },
        {
          tier: 'decent',
          text: "You want a Drake feature and you can't find a word,\nso I'll speak for the both of us: you're a nerd.",
        },
        { tier: 'flop', text: 'Drake has a lot of features on his songs, actually.' },
      ],
    },
    {
      bar: "I'm the GOAT! The Greatest Of All Time! That's what it stands for, right?\nOr is it a goat? Like, baa? I'm the baa. I'm ready to fight.",
      answers: [
        {
          tier: 'fire',
          text: "You're a goat, all right: you smell, you bleat, and you're not too bright,\nthe only throne you'll sit on is a hay bale at the county fair tonight.",
        },
        {
          tier: 'decent',
          text: "You can baa all you want, you're still losing tonight,\nI'll beat you so fast you'll be out of my sight.",
        },
        { tier: 'flop', text: 'Goats are actually really smart animals.' },
      ],
    },
    {
      bar: "I'm gonna sing the hook, like King Durkio! I got the Voice!\nMeeee... ooow... my voice cracked. Puberty. It wasn't my choice.",
      answers: [
        {
          tier: 'fire',
          text: "Durkio's got the Voice, and you've got a squeaky noise,\nyou sound like a smoke alarm going through puberty with the boys.",
        },
        {
          tier: 'decent',
          text: "You can sing like the King, but you don't have a voice,\nso step to the side, and the crowd will rejoice.",
        },
        { tier: 'flop', text: 'Puberty is a normal part of growing up.' },
      ],
    },
    {
      bar: "I'm gonna 'Back to Back' you! Like Drake did to Meek!\nThat means I hit you twice. Or once, then again next week.",
      answers: [
        {
          tier: 'fire',
          text: "Back to Back? Drake did it in four days, and you need a whole week?\nThat ain't a diss, that's a dentist appointment. Open wide, little geek.",
        },
        {
          tier: 'decent',
          text: "You can hit me twice, but your punches are weak,\nI'll beat you so fast you won't even get to speak.",
        },
        { tier: 'flop', text: 'Meek Mill seems like a nice guy.' },
      ],
    },
    {
      bar: 'I can rap fast like Twista! Watch me go! Uhhhhh... okay,\nI can rap really slow. Like a sloth. Like a sloth on a Sunday.',
      answers: [
        {
          tier: 'fire',
          text: "Twista's in the record books for speed, you're in the slow lane all day,\nyou rap like a dial-up modem buffering 'Slow Jamz' on replay.",
        },
        {
          tier: 'decent',
          text: "You can rap like a sloth or a snail any day,\nI'll be done with this fight and long gone on my way.",
        },
        { tier: 'flop', text: 'Sloths are cute. They sleep for like twenty hours.' },
      ],
    },
    {
      bar: "I wrote a diss about your mom! It goes: 'Your mom is... nice.'\nShe gave me a juice box once. I can't diss her. That's my vice.",
      answers: [
        {
          tier: 'fire',
          text: "Your yo mama joke is a compliment? Bro, your beef's on ice,\nmy mom heard your diss and sent you a thank-you card. Twice.",
        },
        {
          tier: 'decent',
          text: "You can say that she's nice, and I'll take the advice,\nbut I'm still gonna beat you, and I'll do it twice.",
        },
        { tier: 'flop', text: "My mom is really nice, I'll tell her you said so." },
      ],
    },
    {
      bar: "Hold up, my bars are on my phone, I wrote 'em in my Notes app,\n...my phone's dead. Can I borrow yours? It's just for one rap.",
      answers: [
        {
          tier: 'fire',
          text: "Your bars are on a dead phone? Then your career needs a nap,\neven Drake's ghostwriter would read that and say, 'I can't fix this crap.'",
        },
        {
          tier: 'decent',
          text: "Your phone's dead and your bars are too, so here's a recap,\nI'm taking this fight while you look for a map.",
        },
        { tier: 'flop', text: 'You should get a portable charger, they are pretty cheap.' },
      ],
    },
    {
      bar: "My new diss track is called 'Not Like Us.' I wrote it today,\nwhat do you mean Kendrick wrote it first? ...I'm gonna say it anyway.",
      answers: [
        {
          tier: 'fire',
          text: "You stole 'Not Like Us' and you still can't make it play,\nKendrick won five Grammys with it, you'll win a timeout. Hooray.",
        },
        {
          tier: 'decent',
          text: "You can steal Kendrick's song and say it today,\nbut I'm still gonna beat you and take your clout away.",
        },
        { tier: 'flop', text: "I think that's called plagiarism, you can't do that." },
      ],
    },
    {
      bar: "Gucci Gang, Gucci Gang! That's all the words I know, man,\nthe whole song is just those two words. Lil Pump had a real plan.",
      answers: [
        {
          tier: 'fire',
          text: "Two words and you still mess it up? A frying pan's got more range than you, man,\nyou're not Gucci Gang, you're Dollar Tree Gang, and the Sharpie's your only fan.",
        },
        {
          tier: 'decent',
          text: 'You know two words and I know the whole song, man,\nso step to the side while I finish this fight like I can.',
        },
        { tier: 'flop', text: 'Gucci is really expensive, I can never afford it either.' },
      ],
    },
    {
      bar: "I'm just like Biggie! I'm big! Well, I'm big-boned. Mom said.\nIt was all a dream! I dreamed I could rap. Then I woke up in bed.",
      answers: [
        {
          tier: 'fire',
          text: "You're like Biggie? He was 'Juicy,' you're a juice box instead,\nit was all a dream, and you're the nightmare. Pull the covers over your head.",
        },
        {
          tier: 'decent',
          text: 'You dreamed you could rap, but you woke up instead,\nso go back to sleep and lay down your head.',
        },
        { tier: 'flop', text: 'Dreams are really interesting, scientifically.' },
      ],
    },
    {
      bar: "I'm gonna diss you on Instagram, like real rappers do,\nas soon as my mom says I can have Instagram. She says no. Boo.",
      answers: [
        {
          tier: 'fire',
          text: "You need your mom's permission to beef? That's the softest thing I ever knew,\nreal rappers start beef on Instagram, you get yours at your mom's barbecue.",
        },
        {
          tier: 'decent',
          text: "You can post on Instagram whenever you're through,\nbut I'm winning this fight, and that's nothing new.",
        },
        { tier: 'flop', text: "Social media isn't good for kids anyway." },
      ],
    },
    {
      bar: "I'm Naperville's hottest rapper! There's only two of us. Me and Kyle.\nKyle's better. But Kyle's in Cancún. So it's me. For a while.",
      answers: [
        {
          tier: 'fire',
          text: "You're second best in Naperville, behind a kid named Kyle,\nhe's on a beach in Cancún, and he's still beating you by a mile.",
        },
        {
          tier: 'decent',
          text: "You can be the hottest for a little while,\nbut I'm taking that crown, and I'm doing it with style.",
        },
        { tier: 'flop', text: 'Cancún is a really nice vacation spot.' },
      ],
    },
    {
      bar: "I'm throwing up the Roc sign, like Jay-Z! Look, a diamond! Wait...\nthat's a heart. No, a triangle. I'm really bad with shapes.",
      answers: [
        {
          tier: 'fire',
          text: "You can't throw the Roc sign? Jay sold millions, you can't sell your mixtapes,\nyour hands look like a toddler fighting a bag of grapes.",
        },
        {
          tier: 'decent',
          text: "You can throw up the Roc sign or draw all your shapes,\nbut I'm taking this fight, and I'm taking your tapes.",
        },
        { tier: 'flop', text: 'Geometry was my worst subject in school too.' },
      ],
    },
    {
      bar: 'I challenge you to a rap battle! Best of seven! Or eleven!\nWait, I already lost one. Okay, best of... uh... a hundred and seven.',
      answers: [
        {
          tier: 'fire',
          text: "Best of a hundred and seven? You lost the last one at 7-Eleven,\nyou couldn't beat the cashier in a rap battle, and his name is Kevin.",
        },
        {
          tier: 'decent',
          text: "Best of a hundred or best of eleven,\nI'll win every round, and I'll feel like I'm in heaven.",
        },
        { tier: 'flop', text: 'That is a lot of rap battles. I have to be home by nine.' },
      ],
    },
    {
      bar: "I got a ghostwriter, like Drake! His name is Tyler. He's eight.\nHe wrote this bar: 'You smell.' It's good, right? He's great.",
      answers: [
        {
          tier: 'fire',
          text: "Your ghostwriter's in second grade, and he still outwrites you, mate,\neven Tyler's embarrassed. He asked to take his name off it. Too late.",
        },
        {
          tier: 'decent',
          text: "Your ghostwriter's eight and your bars came in late,\nso sit back and watch while I take your whole plate.",
        },
        { tier: 'flop', text: 'Eight is pretty young to have a job, honestly.' },
      ],
    },
    {
      bar: "My favorite rapper is Pitbull. Mr. Worldwide! Dale!\nI've been to... Wisconsin. Once. On a field trip. Is that a fail?",
      answers: [
        {
          tier: 'fire',
          text: "Pitbull's Mr. Worldwide, and you're Mr. Wisconsin, on a smaller scale,\nyou came back from one field trip with a cheese hat. That's your whole travel tale.",
        },
        {
          tier: 'decent',
          text: "You can shout out Pitbull and you can yell 'Dale,'\nbut I'm faster than you, and you're slow as a snail.",
        },
        { tier: 'flop', text: 'Wisconsin has great cheese, to be fair.' },
      ],
    },
    {
      bar: "I'm gonna diss you with an AI Tupac voice, like Drake did!\nThe app only has Mickey Mouse. So Mickey's dissing you. Hide, kid!",
      answers: [
        {
          tier: 'fire',
          text: "Drake's AI Tupac got a cease and desist, and Mickey's the best you did?\nMickey Mouse is the only rapper softer than you, and even he flipped his lid.",
        },
        {
          tier: 'decent',
          text: "You can use any voice, it don't matter what you did,\nI'll still beat you down and slam on the lid.",
        },
        { tier: 'flop', text: 'I love Mickey Mouse. I went to Disney World once.' },
      ],
    },
    {
      bar: "I'm gonna get the Barbz on you! Nicki's fans! They're scary!\n...I'm not in the Barbz. They wouldn't let me in. I'm at the library.",
      answers: [
        {
          tier: 'fire',
          text: "The Barbz take anybody with Wi-Fi, and they still wouldn't take you? Gee,\nyou're not a Barb, you're a Ken doll the dog buried under a tree.",
        },
        {
          tier: 'decent',
          text: "The Barbz wouldn't take you, so you're reading for free,\nbut the only book you need is 'How Not to Lose to Me.'",
        },
        { tier: 'flop', text: 'Libraries are great. I go there on weekends.' },
      ],
    },
    {
      bar: "I'm gonna Ether you, Takeover you, and Killshot you! All three!\nThose are diss tracks. I never heard them. But they sound mean to me.",
      answers: [
        {
          tier: 'fire',
          text: "You named three classic disses and you never heard a single one? Gee,\nthat's like quoting the Bible off a fortune cookie with a side of sweet tea.",
        },
        {
          tier: 'decent',
          text: "You named three disses, but you never heard them, see?\nSo let me show you a real one, and I'll do it for free.",
        },
        { tier: 'flop', text: 'Those all sound like video games.' },
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
    {
      bar: "I'm the 50 of this corner, and you the Ja Rule of the block,\nI'll have you singing hooks for mercy 'round the clock.",
      answers: [
        {
          tier: 'fire',
          text: "You're 50 Cent? Nah, you're the change in the couch, stuck in a sock,\nJa threw a whole festival, you can't throw a party on your own block.",
        },
        {
          tier: 'decent',
          text: "You can be 50 Cent and stand guard on the block,\nbut I'm taking your corner and changing the lock.",
        },
        { tier: 'flop', text: 'I think Ja Rule and 50 Cent are both fine.' },
      ],
    },
    {
      bar: "This ain't a battle, this a Takeover, homie, ask Hov,\nI'll pull your card so quick you'll be checking for your glove.",
      answers: [
        {
          tier: 'fire',
          text: "You quote the Takeover? You couldn't take over a bathroom stall with a shove,\nHov wrote the Blueprint, you wrote your name in your shoe. That's what you're made of.",
        },
        {
          tier: 'decent',
          text: "You can quote Hov and talk about love,\nbut I'm the one standing, and I'm rising above.",
        },
        { tier: 'flop', text: 'I prefer Nas, personally.' },
      ],
    },
    {
      bar: "I'm on some Hit 'Em Up type stuff, I'm coming for your crew,\nand your mama, and your cousin, and your cousin's cousin too.",
      answers: [
        {
          tier: 'fire',
          text: "Hit 'Em Up? You can't hit nothing but snooze, homie, your threats are overdue,\nyou coming for my cousin's cousin? He's eight, and he'd still beat you.",
        },
        {
          tier: 'decent',
          text: "You can come for my family, but I'm coming for you,\nand I'll beat you so bad you'll be stuck like glue.",
        },
        { tier: 'flop', text: 'Please leave my cousin out of this, he has a recital.' },
      ],
    },
    {
      bar: "You softer than a Drake verse with the strings and the piano,\nI'll rob you in the rain, then I'll sell your shoes in Indiana.",
      answers: [
        {
          tier: 'fire',
          text: "Calling me Drake soft? You're the one in your mama's old bandana,\nyou'd lose a street fight to a monkey, and he'd still keep his banana.",
        },
        {
          tier: 'decent',
          text: "You can call me Drake and pull up your bandana,\nbut I'll beat you so bad you'll be slipping on a banana.",
        },
        { tier: 'flop', text: "I actually like the piano parts in Drake's songs." },
      ],
    },
    {
      bar: "Got a band-aid on my cheek like Nelly in '02,\nbut the cut ain't mine, homie, I'm saving it for you.",
      answers: [
        {
          tier: 'fire',
          text: "A Nelly band-aid? That look's been dead since the flip phone was new,\nthe only thing you're cutting is coupons, and they're expired too.",
        },
        {
          tier: 'decent',
          text: "You can rock that band-aid like it's still '02,\nbut I'm about to slap you right out of your shoe.",
        },
        { tier: 'flop', text: 'Band-aids are good for scrapes, you know.' },
      ],
    },
    {
      bar: "Mama said knock you out, and Mama don't lie,\nso hold still, homie, let these hands say hi.",
      answers: [
        {
          tier: 'fire',
          text: "LL's mama said knock 'em out, your mama said, 'Baby, don't cry,'\nshe packed you a lunch for this fight. It's PB&J and a juice box. Bye.",
        },
        {
          tier: 'decent',
          text: 'Your mama can say it, but your hands are shy,\nso let me do the knocking, and you can say bye.',
        },
        { tier: 'flop', text: 'My mom says violence never solves anything.' },
      ],
    },
    {
      bar: "You a snitch like 6ix9ine, homie, I can tell by your face,\nyou'd tell on your own shadow for a lighter sentence and some space.",
      answers: [
        {
          tier: 'fire',
          text: "Calling me 6ix9ine? Your rainbow hair's from the dollar store, it's a disgrace,\nand you're a snitch too. I heard you told your mama who broke her vase.",
        },
        {
          tier: 'decent',
          text: "Calling me a snitch won't win you this case,\nso step to the side, I'm taking your place.",
        },
        { tier: 'flop', text: 'Snitching is actually called being a witness, legally.' },
      ],
    },
    {
      bar: "I'm from the block where Keef shot his first video, for real,\nI was the kid in the back who stole the camera guy's meal.",
      answers: [
        {
          tier: 'fire',
          text: "You were in the back of a Chief Keef video stealing lunch? What a big deal,\nyou ain't a feature, homie, you're a blooper on a reel.",
        },
        {
          tier: 'decent',
          text: "You stole a guy's lunch, so you know how to steal,\nbut I'm taking your corner, and that's the real deal.",
        },
        { tier: 'flop', text: "Stealing someone's lunch is just mean." },
      ],
    },
    {
      bar: "My beef ain't on wax, homie, my beef is on sight,\nKendrick and Drake took a whole summer, I'll take you tonight.",
      answers: [
        {
          tier: 'fire',
          text: "Your beef's on sight? Then get some glasses, 'cause your aim ain't right,\nKendrick turned his beef into a Super Bowl, you'll turn yours into a cry at midnight.",
        },
        {
          tier: 'decent',
          text: "You can bring your beef, I'll bring the light,\nand I'll be the one standing when the crowd says goodnight.",
        },
        { tier: 'flop', text: 'Summer is my favorite season, though.' },
      ],
    },
    {
      bar: "I'll do you like Ice Cube did N.W.A, no Vaseline,\nI'm the rawest thing on this corner, and you're soft-serve from Dairy Queen.",
      answers: [
        {
          tier: 'fire',
          text: "No Vaseline? Cube made a classic, and you just made a scene,\nyou're not Ice Cube, homie, you're an ice cube melting in a canteen.",
        },
        {
          tier: 'decent',
          text: "You can talk about Cube, but your rhymes ain't clean,\nI'll beat you so bad you'll be stuck on the screen.",
        },
        { tier: 'flop', text: 'Vaseline is great for dry lips in the winter.' },
      ],
    },
    {
      bar: "Kanye left the Chi for Calabasas, but I stayed right here,\nI'm the only thing on this corner that ain't moved in twenty years.",
      answers: [
        {
          tier: 'fire',
          text: "Twenty years on one corner? That ain't loyalty, that's mold behind your ears,\nKanye built a whole empire, you built a dent in a lawn chair. Cheers.",
        },
        {
          tier: 'decent',
          text: "You can stand on that corner for another twenty years,\nI'll still beat you down and box both of your ears.",
        },
        { tier: 'flop', text: 'Calabasas is pretty far from here, I think.' },
      ],
    },
    {
      bar: "Diss me and I'll Pusha T you, I'll reveal your secret kid,\nwait, you got no kids. Okay, I'll reveal the dumb stuff that you did.",
      answers: [
        {
          tier: 'fire',
          text: "You wanna Pusha T me, but you can't find my secrets? You flipped your lid,\nPusha came with receipts, and you came with a Groupon. Pathetic, kid.",
        },
        {
          tier: 'decent',
          text: "You can dig up my past, but there ain't nothing hid,\nso step to the side, I'm taking your bid.",
        },
        { tier: 'flop', text: "I don't have any secrets, I'm an open book." },
      ],
    },
    {
      bar: "I talk fast like Twista, you'll be lost by the second line,\nby the time you figure out what I said, I already took what's mine.",
      answers: [
        {
          tier: 'fire',
          text: "Talking fast like Twista? Your mouth is fast, but your brain's on decline,\nTwista broke a world record, you broke the Ventra machine on the Blue Line.",
        },
        {
          tier: 'decent',
          text: "You can talk real fast, homie, I'll take my time,\nand I'll be done with you before you can draw the next line.",
        },
        { tier: 'flop', text: "Can you slow down a little? I didn't catch that." },
      ],
    },
    {
      bar: "I got Ether in my left and the Takeover in my right,\nNas and Hov in one body, and both of 'em want to fight.",
      answers: [
        {
          tier: 'fire',
          text: "Nas and Hov in one body? Those two made peace and made millions, all right,\nyou can't make peace with your own landlord, and you're getting evicted tonight.",
        },
        {
          tier: 'decent',
          text: "You can bring your left and you can bring your right,\nbut I'm the one standing when they turn off the light.",
        },
        { tier: 'flop', text: "Nas and Jay-Z made up. They're friends now." },
      ],
    },
    {
      bar: "I'm about to Killshot you like Em did to MGK,\nyou'll be doing pop-punk by the end of today.",
      answers: [
        {
          tier: 'fire',
          text: "Killshot me? Em did that once, and you've been rehearsing it all day,\nyou ain't Eminem, you're the pink hair dye MGK washed away.",
        },
        {
          tier: 'decent',
          text: "You can Killshot all you want, I'm still here to stay,\nand I'm taking your corner, so get out of my way.",
        },
        { tier: 'flop', text: "I actually like MGK's pop-punk stuff." },
      ],
    },
    {
      bar: "Got a sock knife in my left sock and a mixtape in my right,\nI'm handing both of 'em out on the Red Line tonight.",
      answers: [
        {
          tier: 'fire',
          text: "A sock knife and a mixtape? Both dull, homie, and neither one's tight,\nyou ain't passing out heat, you're passing out foot fungus. The whole car's uptight.",
        },
        {
          tier: 'decent',
          text: "You can keep your sock knife and your mixtape out of sight,\nI'm taking this corner, and I'm doing it right.",
        },
        { tier: 'flop', text: "You should keep knives in a proper holder, it's safer." },
      ],
    },
    {
      bar: "I'm like 50 Cent, I'll troll you on the 'Gram 'til you quit,\nI'll make a meme of your face and post it every day. That's it.",
      answers: [
        {
          tier: 'fire',
          text: "You'll troll me like 50? He's got millions of followers, you got six and a zit,\nand five of 'em are bots, and the sixth is your mama. She unfollowed. She quit.",
        },
        {
          tier: 'decent',
          text: "You can post all the memes that you want, I don't care a bit,\nwhen I'm done with you, homie, you'll be the meme, and you'll submit.",
        },
        { tier: 'flop', text: "Please don't post my picture, I didn't consent to that." },
      ],
    },
    {
      bar: "You got the Drake starter pack: sad songs and a fake accent,\nI'll put you on a plane back to Toronto, homie, that's my intent.",
      answers: [
        {
          tier: 'fire',
          text: "Fly me back to Toronto? Homie, you can't even make rent,\nyou'd fly me Spirit Airlines, middle seat, and still ask for ten percent.",
        },
        {
          tier: 'decent',
          text: "You can call me Drake, but this fight's my event,\nI'm taking your corner, and you're paying my rent.",
        },
        { tier: 'flop', text: "I've always wanted to visit Toronto, it seems clean." },
      ],
    },
    {
      bar: "I wrote my own 'How to Rob' like 50, and you're on page one,\nright under 'take his sneakers' and above 'take his phone and run.'",
      answers: [
        {
          tier: 'fire',
          text: "You wrote 'How to Rob' and put me on page one? 50 wrote his for fun,\nyours is a coloring book, and you colored outside the lines. You're done.",
        },
        {
          tier: 'decent',
          text: "You wrote a whole list, but I'm not gonna run,\nI'm standing right here till this fight is won.",
        },
        { tier: 'flop', text: 'Writing lists is a great way to stay organized.' },
      ],
    },
    {
      bar: "They not like us! Homie, you ain't from around here,\nyou say 'soda' instead of 'pop.' Get outta my atmosphere.",
      answers: [
        {
          tier: 'fire',
          text: "I say 'pop,' homie, and you quote Kendrick like he wrote it for your career,\nhe don't know you exist, you're the guy selling fake Beats down by Navy Pier.",
        },
        {
          tier: 'decent',
          text: "I say 'pop,' homie, so let me make it clear,\nI'm from this city, and you're done for the year.",
        },
        { tier: 'flop', text: 'Soda and pop are the same thing, though.' },
      ],
    },
    {
      bar: "I'mma 'Push Ups' you like Drake, homie, I'll call you short,\nsize seven men's, you couldn't dunk on a Nerf hoop court.",
      answers: [
        {
          tier: 'fire',
          text: "Drake called Kendrick short, and Kendrick took the Super Bowl and the court,\nyou're tall as a streetlight, and just as bright. That's my whole report.",
        },
        {
          tier: 'decent',
          text: "You can call me short, but I'm taller in sport,\nI'll beat you so bad you'll be filing a report.",
        },
        { tier: 'flop', text: "I'm actually average height for my age." },
      ],
    },
    {
      bar: "I don't write my raps down, homie, like Jay, I keep it in my head,\nthat's why I forgot the second verse. I'll just hit you instead.",
      answers: [
        {
          tier: 'fire',
          text: "You don't write it down like Hov? He's got a vault up in his head,\nyours is a junk drawer full of rubber bands and a moldy piece of bread.",
        },
        {
          tier: 'decent',
          text: "You forgot your verse, so I'll finish what you said,\nand I'll beat you so bad you'll be going to bed.",
        },
        { tier: 'flop', text: 'Writing things down helps with memory, actually.' },
      ],
    },
    {
      bar: "You used to call me on my cell phone? Homie, I changed the lock,\nnow you're dancing in a turtleneck like Drake, and the whole block's in shock.",
      answers: [
        {
          tier: 'fire',
          text: "Hotline Bling? You're on your mama's phone plan, and she's got you on lock,\nthe only one calling you late at night is a debt collector. Knock, knock.",
        },
        {
          tier: 'decent',
          text: "You can change all the locks, I'll still walk the block,\nand I'll beat you so bad that you won't even talk.",
        },
        { tier: 'flop', text: 'I like turtlenecks, they keep my neck warm.' },
      ],
    },
    {
      bar: 'Wu-Tang taught me cash rules everything around me,\nso run your cash, homie, and your phone, and your house key.',
      answers: [
        {
          tier: 'fire',
          text: "Wu-Tang said cash rules everything, and you're broke as a leaf off a dead tree,\nyou can't rob me, homie, you still owe your grandma a dollar and a cup of tea.",
        },
        {
          tier: 'decent',
          text: "You can quote Wu-Tang all you want, but it don't scare me,\nI'm keeping my cash, and I'm walking out free.",
        },
        { tier: 'flop', text: "I don't carry cash, I use my phone for everything." },
      ],
    },
    {
      bar: "I'm the hardest on the block, homie, harder than the 'Lean Back' beat,\nI'll make you lean back so far you'll be lying in the street.",
      answers: [
        {
          tier: 'fire',
          text: "Lean Back? Fat Joe made a classic, you made a chiropractor's receipt,\nyou lean back in a lawn chair and need three guys to help you off the seat.",
        },
        {
          tier: 'decent',
          text: "You can talk about Fat Joe and the 'Lean Back' beat,\nbut I'll make you lean back, and I'll knock off your feet.",
        },
        { tier: 'flop', text: 'Leaning back too far is bad for your posture.' },
      ],
    },
    {
      bar: "Remember when 50 said Ja Rule sings like a cat?\nWell, I'll make you sing too, homie, high-pitched, just like that.",
      answers: [
        {
          tier: 'fire',
          text: "Make me sing like Ja? Nah, homie, you're the one meowing like a cat,\nyou're Ja Rule at Fyre Fest: all hype, one cheese sandwich, and flat.",
        },
        {
          tier: 'decent',
          text: "You can quote 50 and talk about Ja and all that,\nbut I'll beat you so bad you'll be flat on your mat.",
        },
        { tier: 'flop', text: 'Ja Rule actually had a lot of hit songs.' },
      ],
    },
    {
      bar: "This corner's a battlefield, homie, I got bars like a jail cell,\nand you got bars like granola, soft and crumbly. Oh well.",
      answers: [
        {
          tier: 'fire',
          text: "Bars like a jail cell? You've never seen a cell, you've seen detention, I can tell,\nthe only time you got locked up was in a Chuck E. Cheese ball pit. The smell.",
        },
        {
          tier: 'decent',
          text: "You can talk about bars and your jail cell as well,\nbut I'm taking this fight, and I'm ringing the bell.",
        },
        { tier: 'flop', text: 'Granola bars are a pretty healthy snack.' },
      ],
    },
    {
      bar: "When I hit the corner, they play the Dreams and Nightmares intro,\nby the time the beat drops, homie, you'll be gone, and I'll be in control.",
      answers: [
        {
          tier: 'fire',
          text: "Meek's intro hypes a stadium, yours gets you a warning from patrol,\nyou walk out to Dreams and Nightmares, and you're the nightmare. That's your role.",
        },
        {
          tier: 'decent',
          text: "You can play Meek's intro and walk out on a roll,\nbut I'll beat you so bad you'll be stuck in a hole.",
        },
        { tier: 'flop', text: "Meek Mill's intros are always really hype, I agree." },
      ],
    },
    {
      bar: "I'll put your name in a chant like Kendrick, and the whole block gon' sing,\nyou'll hear it in your sleep, homie, every time your phone rings.",
      answers: [
        {
          tier: 'fire',
          text: "A chant like Kendrick? He packed the Super Bowl, you can't fill a bowl of onion rings,\nthe only chant you'll get is 'get off the stage,' and some other things.",
        },
        {
          tier: 'decent',
          text: "You can start up a chant and do all of your things,\nbut I'm taking this corner, and I'm clipping your wings.",
        },
        { tier: 'flop', text: "I don't really like it when my phone rings, honestly." },
      ],
    },
    {
      bar: "I'm Pac on the West Side, homie, All Eyez on Me,\nand all eyes on you too, 'cause you're dressed like a Christmas tree.",
      answers: [
        {
          tier: 'fire',
          text: 'All eyes on you? The only eyes on you are Walgreens cameras, see,\nyou got followed through the snack aisle for pocketing a Snickers for free.',
        },
        {
          tier: 'decent',
          text: "You can quote Pac all you want, homie, I'm not the one who'll flee,\nI'll beat you down so hard you'll be stung like a bee.",
        },
        { tier: 'flop', text: 'Christmas trees are actually really nice.' },
      ],
    },
    {
      bar: "Let's do a Verzuz, homie, your hits against mine,\nmy hits land on your chin, and yours land on the Blue Line.",
      answers: [
        {
          tier: 'fire',
          text: 'A Verzuz with you? Your biggest hit is your forehead on a stop sign,\nTimbaland and Swizz had catalogs, and you got a ringtone and a fine.',
        },
        {
          tier: 'decent',
          text: "You can bring all your hits, and I'll bring mine,\nbut mine land harder, and you'll see the stars shine.",
        },
        { tier: 'flop', text: 'Verzuz is so fun to watch. I like the R&B ones.' },
      ],
    },
    {
      bar: "I'm like Master P, homie, there's no limit to my game,\nI'll make you say 'ugh' when I put these hands on your frame.",
      answers: [
        {
          tier: 'fire',
          text: "No Limit? Master P had a gold tank, and you got a Big Wheel with no aim,\nyou'll make me say 'ugh,' sure, 'cause you rap like a Nokia ringtone. Shame.",
        },
        {
          tier: 'decent',
          text: "You can talk about No Limit and put up your claim,\nbut I'll make you say 'ugh,' and you'll never be the same.",
        },
        { tier: 'flop', text: 'Master P also had a cereal brand, I think.' },
      ],
    },
    {
      bar: "Ice Cube said 'Check yo self before you wreck yo self,'\nso check yo pockets, homie, I'm taking everything off your shelf.",
      answers: [
        {
          tier: 'fire',
          text: "Check yo self? Cube made that a classic, you make a mess of yourself,\nyou couldn't wreck a Lego set, homie, you're Santa's least favorite elf.",
        },
        {
          tier: 'decent',
          text: "You can quote Ice Cube and check your own self,\nbut I'll beat you so bad you'll be checking your health.",
        },
        { tier: 'flop', text: 'I organize my shelves by color.' },
      ],
    },
    {
      bar: "I drop it like it's hot, homie, and I drop you like it's cold,\nI'm the Snoop of the West Side, minus Martha Stewart, I'm told.",
      answers: [
        {
          tier: 'fire',
          text: "You're the Snoop of the West Side? Snoop's cooking with Martha, you're cooking mold,\nthe last thing you dropped like it's hot was a Hot Pocket, and it's still cold.",
        },
        {
          tier: 'decent',
          text: "You can drop it like it's hot, but your bars are old,\nI'm taking this corner, and I'm taking your gold.",
        },
        { tier: 'flop', text: 'Martha Stewart is a really good cook.' },
      ],
    },
    {
      bar: 'The Bridge is over, homie, and so is your time on my block,\nKRS-One said it best, so pack your bags and your one clean sock.',
      answers: [
        {
          tier: 'fire',
          text: "You're quoting KRS-One? You're KRS-None, slow as a broken clock,\nthe only bridge you ever ran was the Lake Street L, and you tripped on a rock.",
        },
        {
          tier: 'decent',
          text: "You can quote KRS-One and pack my one sock,\nbut I'm staying right here, homie, and this is my block.",
        },
        { tier: 'flop', text: 'I have plenty of socks, thanks for asking.' },
      ],
    },
    {
      bar: "Lil Uzi put a diamond in his forehead, then a fan ripped it out,\nI'll do the same to your chain, homie, while you scream and pout.",
      answers: [
        {
          tier: 'fire',
          text: "You'll rip off my chain like Uzi's fan? Homie, you'd lose that fight to a trout,\nyou're the only thug who gets robbed by the people he's robbing. Lights out.",
        },
        {
          tier: 'decent',
          text: "You can talk about Uzi and his diamond fallout,\nbut I'm keeping my chain, and you're losing your clout.",
        },
        { tier: 'flop', text: 'Putting a diamond in your forehead sounds painful.' },
      ],
    },
    {
      bar: "Drake got the owl, Kendrick got the Pulitzer, I got the stoop,\nand you got nothing, homie, but a bowl of your mama's soup.",
      answers: [
        {
          tier: 'fire',
          text: 'You got a stoop? Homie, that stoop is covered in pigeon poop,\nKendrick won a Pulitzer, you won a free refill and got kicked out of the group.',
        },
        {
          tier: 'decent',
          text: "You can sit on your stoop and run around in a loop,\nbut I'm taking this corner and running your whole group.",
        },
        { tier: 'flop', text: 'My mom makes a really good chicken noodle soup.' },
      ],
    },
    {
      bar: "I'm the DMX of this alley, homie, all I do is bark,\nX gon' give it to ya, right here in Garfield Park.",
      answers: [
        {
          tier: 'fire',
          text: "You bark like DMX? Homie, you yip like a Chihuahua scared of the dark,\nthe only thing you'll give me is fleas. Now sit. Stay. Don't bark.",
        },
        {
          tier: 'decent',
          text: "You can bark all you want, but you'll miss the mark,\nI'll beat you so bad that you'll sleep in the dark.",
        },
        { tier: 'flop', text: 'Garfield Park has a really nice conservatory.' },
      ],
    },
    {
      bar: "I'm an overnight celebrity on this block, Twista-style,\nI went viral for robbing a pizza guy. I been famous for a while.",
      answers: [
        {
          tier: 'fire',
          text: "You went viral robbing a pizza guy? The video's you getting chased half a mile,\nhe beat you with the pizza, and he still delivered on time with a smile.",
        },
        {
          tier: 'decent',
          text: "You can be a celebrity for a little while,\nbut I'll beat you so bad you'll get lost in the aisle.",
        },
        { tier: 'flop', text: 'Robbing a pizza guy is really mean, they work so hard.' },
      ],
    },
    {
      bar: "Like Ludacris said: move, get out the way, get out the way,\nthis is my corner, homie, and you're blocking my sun all day.",
      answers: [
        {
          tier: 'fire',
          text: "Ludacris moved out to Hollywood, and you can't move off this curb all day,\nthe only thing blocking your sun is your forehead, homie. It's in the way.",
        },
        {
          tier: 'decent',
          text: "You can quote Ludacris and tell me to move all day,\nbut I'm standing right here, and I'm not going away.",
        },
        { tier: 'flop', text: 'Ludacris was really good in the Fast and Furious movies.' },
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
    {
      bar: "Ruff Ryders anthem playing when I pull up to the light,\nstop, drop, shut 'em down, and you're the shop I'm closing tonight.",
      answers: [
        {
          tier: 'fire',
          text: "DMX had a whole army of bikes, you got Delilah, and she ain't right,\nshe leaks oil on every corner, homie, marking her turf in the moonlight.",
        },
        {
          tier: 'decent',
          text: "You can play your anthem and pull up to the light,\nbut I'm shutting you down, and I'm doing it right.",
        },
        { tier: 'flop', text: 'DMX had a lot of dogs, I think.' },
      ],
    },
    {
      bar: "My bike's team Meek, homie, she was raised on dirt bike wheelies,\nshe heard 'Back to Back' one time and threw a rod. She's got feelings.",
      answers: [
        {
          tier: 'fire',
          text: "Your bike threw a rod over a Drake song? Even Delilah's in her feelings,\nMeek and Drake made peace years ago, and she's still punching holes in the ceilings.",
        },
        {
          tier: 'decent',
          text: "Your bike's got feelings, and I've got no ceilings,\nI'll beat you so fast you'll forget all your dealings.",
        },
        { tier: 'flop', text: "Bikes can't really have emotions, can they?" },
      ],
    },
    {
      bar: "They see me rollin', they hatin', but Delilah don't stop,\nI'm riding dirty down Lake Shore, and I'm laughing at the cop.",
      answers: [
        {
          tier: 'fire',
          text: "They see you rolling, all right: ten miles an hour while minivans honk nonstop,\nyou ain't riding dirty, homie, you're just dirty. Those leathers need a mop.",
        },
        {
          tier: 'decent',
          text: "You can ride all you want, but this is where you stop,\nI'll beat you so bad you'll fall off at the top.",
        },
        { tier: 'flop', text: 'I think the speed limit on Lake Shore is forty-five.' },
      ],
    },
    {
      bar: "Xzibit couldn't Pimp Your Ride, homie, your ride's a joke,\nI'm on Delilah, and you're on a scooter that runs on Diet Coke.",
      answers: [
        {
          tier: 'fire',
          text: "Xzibit saw Delilah and said, 'Yo dawg, I can't pimp this, she's broke,'\nshe's got more rust than a Gary steel mill, held together with a prayer and smoke.",
        },
        {
          tier: 'decent',
          text: "You can talk about rides, but your bike is a joke,\nI'll beat you so fast you'll be choking on smoke.",
        },
        { tier: 'flop', text: 'Scooters are actually great for the environment.' },
      ],
    },
    {
      bar: "I ride harder than Meek Mill on a wheelie down Broad Street,\nand I'll leave you on the ground with tire marks across your feet.",
      answers: [
        {
          tier: 'fire',
          text: "Ride like Meek? Meek pops wheelies, you pop your back getting off the seat,\nyour training wheels are showing, homie, and Delilah's asking for a retreat.",
        },
        {
          tier: 'decent',
          text: "You can ride like Meek down any old street,\nbut I'm faster than you, and you're facing defeat.",
        },
        { tier: 'flop', text: 'Wheelies look cool, but they seem dangerous.' },
      ],
    },
    {
      bar: "Kanye said drive slow, homie, but Delilah don't do slow,\nI'll take Lake Shore at a hundred and leave you in the snow.",
      answers: [
        {
          tier: 'fire',
          text: "A hundred on Lake Shore? That's not your speed, that's your age, I know,\nKanye said drive slow, and Delilah heard it on a nursing home radio.",
        },
        {
          tier: 'decent',
          text: "You can ride at a hundred, I'll take it real slow,\nand I'll still beat you down and put on a show.",
        },
        { tier: 'flop', text: "You should really drive carefully when it's slippery." },
      ],
    },
    {
      bar: "My road name's Machine Gun Kelly, I'm loud, I'm wild, I'm a star,\nI went pop-punk last summer, homie, and I play it on guitar.",
      answers: [
        {
          tier: 'fire',
          text: "You named yourself after MGK? That's the worst choice by far,\nEm ended that man's rap career in one song, and you're the cover band at the bar.",
        },
        {
          tier: 'decent',
          text: "You can be MGK and play your guitar,\nbut I'm beating you down, and I'm going far.",
        },
        { tier: 'flop', text: "I've always wanted to learn an instrument." },
      ],
    },
    {
      bar: "Delilah's like Kendrick, she don't do features, she don't do friends,\nshe dropped one diss on a Prius, and that's where the Prius ends.",
      answers: [
        {
          tier: 'fire',
          text: "Delilah's like Kendrick? Kendrick's got Pulitzers, and Delilah's got split ends,\nshe lost a drag race to a Prius, and the Prius was texting its friends.",
        },
        {
          tier: 'decent',
          text: "You and Delilah can keep your beef with your friends,\nbut I'm beating you down, and it's one of my trends.",
        },
        { tier: 'flop', text: 'A Prius gets really good gas mileage, actually.' },
      ],
    },
    {
      bar: "E-40 told me ghost ride the whip, so I did it on my bike,\nI jumped off Delilah at sixty, and she's still out there. Yikes.",
      answers: [
        {
          tier: 'fire',
          text: "You ghost-rode a motorcycle at sixty? Homie, that ain't hyphy, that's a dumb strike,\nE-40 meant a car, and now you're in a neck brace, and Delilah's swimming with the pikes.",
        },
        {
          tier: 'decent',
          text: "You can ghost ride Delilah and go on all your hikes,\nbut I'm faster than you and all of your bikes.",
        },
        { tier: 'flop', text: 'Ghost riding seems really dangerous.' },
      ],
    },
    {
      bar: 'Snoop rolled down the street sipping on gin and juice,\nI roll down Lake Shore sipping motor oil, and my teeth are loose.',
      answers: [
        {
          tier: 'fire',
          text: "Sipping motor oil? No wonder your teeth fell out and your brain's a caboose,\nSnoop's got Martha Stewart cooking, you got Delilah's oil change. What's your excuse?",
        },
        {
          tier: 'decent',
          text: "You can sip your motor oil and let your teeth get loose,\nI'll beat you so bad you'll be calling a truce.",
        },
        { tier: 'flop', text: 'Motor oil is poisonous, please do not drink it.' },
      ],
    },
    {
      bar: "I ride slow like Mike Jones in Houston, still tippin' on four wheels,\nwait, I got two. Still tippin'. Over. That's how a biker feels.",
      answers: [
        {
          tier: 'fire',
          text: "Still tippin'? You tip over at every red light, homie, Delilah squeals,\nMike Jones had a slab on swangas, you got a Harley with training wheels.",
        },
        {
          tier: 'decent',
          text: "You can tip all you want, I'm still spinning my wheels,\nI'll beat you so fast you'll be flat on your heels.",
        },
        { tier: 'flop', text: 'Motorcycles do tip over a lot, I have heard.' },
      ],
    },
    {
      bar: "Delilah's got more horsepower than Kanye's got ego,\nshe'll ride straight through you, homie, then hit the casino.",
      answers: [
        {
          tier: 'fire',
          text: "More horsepower than Ye's ego? Delilah couldn't pull a sled to Reno,\nshe's got the engine of a leaf blower and the top speed of a cappuccino.",
        },
        {
          tier: 'decent',
          text: "You can take Delilah and ride out to Reno,\nbut I'm taking this fight, so go home, bambino.",
        },
        { tier: 'flop', text: 'Kanye does have a lot of confidence, to be fair.' },
      ],
    },
    {
      bar: "My biker crew's like the Ruff Ryders, homie, we're a hundred deep,\nwell, it's me, Delilah, and a raccoon. He's in the sidecar. Asleep.",
      answers: [
        {
          tier: 'fire',
          text: "Your crew's a bike and a raccoon? That ain't the Ruff Ryders, homie, that's cheap,\neven the raccoon's got a solo deal lined up. He's leaving you while you sleep.",
        },
        {
          tier: 'decent',
          text: "You can ride with a raccoon and a hundred sheep,\nbut I'll beat you so fast you'll be rocked right to sleep.",
        },
        { tier: 'flop', text: 'Raccoons can carry diseases, you should be careful.' },
      ],
    },
    {
      bar: "I'm Lupe Fiasco on a Harley: kick, push, kick, push, coast,\nexcept I ain't on a skateboard, homie, and you're about to be toast.",
      answers: [
        {
          tier: 'fire',
          text: "Kick, push? Your Harley's dead, so you push it down Lake Shore like a ghost,\nLupe made skating cool, and you made a Harley a shopping cart. That's the roast.",
        },
        {
          tier: 'decent',
          text: "You can kick, push, and coast all along the coast,\nbut I'll beat you so bad you'll be seeing a ghost.",
        },
        { tier: 'flop', text: 'Lupe Fiasco is from Chicago, you know.' },
      ],
    },
    {
      bar: "Delilah's from Detroit, she's straight 8 Mile, born and raised,\nshe'd beat you like B-Rabbit beat Papa Doc, and you'd be amazed.",
      answers: [
        {
          tier: 'fire',
          text: "Delilah's 8 Mile? Homie, she broke down at mile three and got hazed,\nyou ain't B-Rabbit, you're Papa Doc: private school, and now you're dazed.",
        },
        {
          tier: 'decent',
          text: "You can talk about Detroit and how you were raised,\nbut I'll beat you so bad you'll be stumbling and dazed.",
        },
        { tier: 'flop', text: 'Detroit has a really interesting music history.' },
      ],
    },
    {
      bar: "I ride like Nelly, homie, 'Ride Wit Me,' I got a sidecar for two,\nhop in, it must be the money, 'cause it sure ain't you.",
      answers: [
        {
          tier: 'fire',
          text: "'It must be the money'? You're broke, homie, and Delilah's broke too,\nyour sidecar's a shopping cart bungee-corded on with a shoe.",
        },
        {
          tier: 'decent',
          text: "I ain't riding with you, homie, I don't need the view,\nI'll walk right past you and beat you down too.",
        },
        { tier: 'flop', text: "I'd rather take the bus, if that's okay." },
      ],
    },
    {
      bar: "Delilah's got a gold grill like Paul Wall in Houston,\nshe smiles at the cops and blinds 'em, homie. That's my solution.",
      answers: [
        {
          tier: 'fire',
          text: "Delilah's got a grill? That's not drip, homie, that's a rusty evolution,\nPaul Wall sold diamonds, she got a grill from a Gary scrap yard. That's pollution.",
        },
        {
          tier: 'decent',
          text: "You can grill up Delilah, it's a shiny revolution,\nbut I'm still gonna beat you, and that's the conclusion.",
        },
        { tier: 'flop', text: 'Grills can be bad for your teeth, I heard.' },
      ],
    },
    {
      bar: "Delilah's got the Tokyo Drift kit, homie, she slides sideways,\nshe drifted through a Taco Bell once. Now we're banned. Them's the breaks.",
      answers: [
        {
          tier: 'fire',
          text: "You didn't drift into Taco Bell, homie, Delilah just don't have brakes,\nand the Teriyaki Boyz want royalties for all your mistakes.",
        },
        {
          tier: 'decent',
          text: "You can drift through the Taco Bell and the lakes,\nbut I'll beat you so bad you'll be pumping your brakes.",
        },
        { tier: 'flop', text: 'Taco Bell is open pretty late.' },
      ],
    },
    {
      bar: "I made a diss track with Delilah, it's four minutes of engine noise,\nit's got more bass than anything you got, and it scares all the boys.",
      answers: [
        {
          tier: 'fire',
          text: "Four minutes of engine noise? That ain't a diss track, that's a muffler that annoys,\nthe only thing it ever scared was a flock of geese and some kids with their toys.",
        },
        {
          tier: 'decent',
          text: "You can rev all you want, it's just a bunch of noise,\nI'll beat you so bad you'll lose all your poise.",
        },
        { tier: 'flop', text: 'Loud engines are bad for your hearing, you know.' },
      ],
    },
    {
      bar: "Delilah's horn don't beep, homie, she yells like Lil Jon,\nYEAH! OKAY! WHAT! And you're gone before the dawn.",
      answers: [
        {
          tier: 'fire',
          text: "Your horn yells like Lil Jon 'cause it's shorting out, homie, it's always on,\nthe only 'YEAH!' you'll get is from the tow truck guy hauling Delilah off the lawn.",
        },
        {
          tier: 'decent',
          text: "Your horn yells YEAH, but your speed is a yawn,\nI'll beat you so fast you'll be flat on the lawn.",
        },
        { tier: 'flop', text: 'Lil Jon is really loud. I like his energy, though.' },
      ],
    },
    {
      bar: "I'm 2 Chainz on a Harley, homie, two chains and a lock,\none's for Delilah, and the other one's for you. Tick-tock.",
      answers: [
        {
          tier: 'fire',
          text: "You're 2 Chainz? One chain holds Delilah's muffler on, the other's a bike lock,\n2 Chainz said TRU, and the truth is you're rusty as a hinge on a Gary dock.",
        },
        {
          tier: 'decent',
          text: "You can rock two chains and spin 'em like a clock,\nbut I'll beat you so bad you'll be stuck on the block.",
        },
        { tier: 'flop', text: 'Two chains seems like a lot of weight on your neck.' },
      ],
    },
    {
      bar: "I'll slap you like Will Smith slapped Chris Rock at the show,\nand then I'll ride off on Delilah while the cameras still roll.",
      answers: [
        {
          tier: 'fire',
          text: "You'll slap me like Will? Then you're banned from every show, that's the toll,\nand the only one who'll still ride with you is Delilah, and she's on parole.",
        },
        {
          tier: 'decent',
          text: "You can slap me like Will, but the cameras still roll,\nI'll beat you so bad you'll be stuck in a hole.",
        },
        { tier: 'flop', text: 'Slapping people at award shows is never okay.' },
      ],
    },
    {
      bar: "I'm the Pusha T of the highway, homie, I got receipts on you,\nyou ride a pink Vespa to brunch, and you wear a helmet too.",
      answers: [
        {
          tier: 'fire',
          text: "Pusha's receipts ended careers, and yours are a rumor from a guy named Lou,\nI wear a helmet 'cause I got a brain. That's a thing you never knew.",
        },
        {
          tier: 'decent',
          text: "You can talk about receipts, but they're nothing new,\nI'll beat you so bad you'll be black and blue.",
        },
        { tier: 'flop', text: 'Helmets are important. Safety first.' },
      ],
    },
    {
      bar: 'I ride with my chest out like Rick Ross, homie, the biggest boss,\nI got a lion on my leather and a Harley full of sauce.',
      answers: [
        {
          tier: 'fire',
          text: "You're Rick Ross on a Harley? Then you're a CO in a costume, homie, a loss,\nyour Harley's got no sauce, it's got rust, three dents, and a carpet of moss.",
        },
        {
          tier: 'decent',
          text: "You can ride with your chest out and call yourself boss,\nbut I'm taking this fight, and you're taking the loss.",
        },
        { tier: 'flop', text: 'Rick Ross has a lot of nice cars, I have heard.' },
      ],
    },
    {
      bar: "Delilah's iced out like Gucci Mane, she's colder than January,\nshe's got diamonds on her rims, homie, and she's legendary.",
      answers: [
        {
          tier: 'fire',
          text: "Iced out like Gucci Mane? That's road salt on your rims, it's ordinary,\nGucci's got an ice cream cone on his face, and you've got a face that's scary.",
        },
        {
          tier: 'decent',
          text: "You can ice out your bike, but it's still ordinary,\nI'll beat you so bad you'll be lost in the prairie.",
        },
        { tier: 'flop', text: 'Road salt is really bad for cars and bikes.' },
      ],
    },
    {
      bar: "I beat a rapper every day, and Delilah honks, 'Another one!'\nDJ Khaled taught her that, homie, and today you're the one.",
      answers: [
        {
          tier: 'fire',
          text: "'Another one'? Khaled just yells on other people's songs, and you just yell at the sun,\nDelilah does the work, homie, you're the hype man for a Harley. You're done.",
        },
        {
          tier: 'decent',
          text: "You can honk 'another one,' but your rapping's no fun,\nI'll beat you so fast you'll be begging to run.",
        },
        { tier: 'flop', text: 'DJ Khaled seems like a really positive guy.' },
      ],
    },
    {
      bar: "Shake it like a Polaroid picture, Outkast had it right,\nthat's how Delilah shakes, homie, at every single red light.",
      answers: [
        {
          tier: 'fire',
          text: "Delilah shakes like a Polaroid 'cause her bolts are loose and her engine's a fright,\nOutkast said 'Hey Ya,' and your mechanic said 'Hey, no.' Goodnight.",
        },
        {
          tier: 'decent',
          text: "You can shake like a Polaroid all through the night,\nbut I'll beat you so bad that you'll fade from my sight.",
        },
        { tier: 'flop', text: "I haven't seen a Polaroid camera in years." },
      ],
    },
    {
      bar: "It's getting hot in herre, so take off all your clothes,\nnah, I'm a biker, homie, the leather stays on, and it shows.",
      answers: [
        {
          tier: 'fire',
          text: "Leather in July? It's hot in herre, all right, and the whole block holds its nose,\nyou smell like a Weber grill full of old sweat socks. Even Delilah froze.",
        },
        {
          tier: 'decent',
          text: "You can keep on your leather, I'll keep on my clothes,\nbut I'm winning this fight, and that's how it goes.",
        },
        { tier: 'flop', text: "You should wear something lighter when it's hot." },
      ],
    },
    {
      bar: "I crashed Delilah last year and rapped through the wire like Ye,\nmy jaw's still clicking, homie, but I'll still beat you today.",
      answers: [
        {
          tier: 'fire',
          text: "You rapped through the wire like Ye? He made a classic, you made a hospital stay,\nyour jaw's still clicking, homie, and your bars still click the wrong way.",
        },
        {
          tier: 'decent',
          text: "You can rap through the wire and the pain all day,\nbut I'm still gonna beat you and send you away.",
        },
        { tier: 'flop', text: 'Crashes are really serious. Are you feeling better?' },
      ],
    },
    {
      bar: "Juvenile said back that thing up, but Delilah don't reverse,\nso I'm going straight through you, homie, while I spit this verse.",
      answers: [
        {
          tier: 'fire',
          text: "Delilah can't back it up? Then she's a bike with no reverse and a curse,\nJuvenile was talking to dancers, and the only thing backing you up is your nurse.",
        },
        {
          tier: 'decent',
          text: "You can't back it up, so I'll make it worse,\nI'll beat you so bad you'll be reaching for your purse.",
        },
        { tier: 'flop', text: "Most motorcycles don't go backwards, that's true." },
      ],
    },
    {
      bar: "I like big bikes and I cannot lie, and Sir Mix-a-Lot knows,\nDelilah's got the back of a Cadillac, homie, and the front of a rose.",
      answers: [
        {
          tier: 'fire',
          text: "You like big bikes and you cannot lie? You just did, homie, everybody knows,\nDelilah's a moped with a Harley sticker and a muffler tied on with a hose.",
        },
        {
          tier: 'decent',
          text: "You can love your big bike and stop and smell the rose,\nbut I'll beat you so bad you'll be stubbing your toes.",
        },
        { tier: 'flop', text: 'Cadillacs are really comfortable cars.' },
      ],
    },
    {
      bar: "Started from the bottom, now we're here: Delilah came up from the scrapyard,\nwe both climbed up out of the rust, homie, and now we hit you hard.",
      answers: [
        {
          tier: 'fire',
          text: "Started from the scrapyard? Delilah's going back there, homie, I'll sign the card,\nyou two ain't climbing, you're rusting, and the junkman's already in your yard.",
        },
        {
          tier: 'decent',
          text: "You started in a scrapyard and you're still pretty scarred,\nI'll beat you so bad you'll be flat in the yard.",
        },
        { tier: 'flop', text: 'Scrapyards are actually great places to find car parts.' },
      ],
    },
    {
      bar: "Delilah ain't no gold digger, homie, she runs on gas and grease,\nshe never asked me for nothing but a full tank and some peace.",
      answers: [
        {
          tier: 'fire',
          text: "She ain't a gold digger? Homie, you bought her on a ninety-month lease,\nthe bank owns her front wheel, her back wheel, and your leather fleece.",
        },
        {
          tier: 'decent',
          text: "You can ride off with Delilah and her gas and her grease,\nbut I'm taking this fight, and you're losing your lease.",
        },
        { tier: 'flop', text: 'Gas is so expensive right now, it is crazy.' },
      ],
    },
    {
      bar: "Route 66 starts in Chicago, and I ride it like Dre to Cali,\nby the time I hit Missouri, homie, you're still stuck in the alley.",
      answers: [
        {
          tier: 'fire',
          text: "Ride to Cali like Dre? Delilah broke down in Joliet, homie, you lost the rally,\nDre's got a billion-dollar headphone deal, and you got a tow-truck tally.",
        },
        {
          tier: 'decent',
          text: "You can ride Route 66 all the way out to Cali,\nbut I'll beat you so bad you'll be stuck in the valley.",
        },
        { tier: 'flop', text: 'Route 66 does start in Chicago, that is a fun fact.' },
      ],
    },
    {
      bar: "Woo-hah! Got you all in check, like Busta in his prime,\nDelilah's checking your engine, homie, and you're running out of time.",
      answers: [
        {
          tier: 'fire',
          text: "Got me in check? Busta's flow is a rocket, homie, yours is an uphill climb,\nDelilah's been running out of gas for years, and you've been running out of rhyme.",
        },
        {
          tier: 'decent',
          text: "You can check all you want, I'll take you every time,\nand I'll beat you so fast you'll be out of rhyme.",
        },
        { tier: 'flop', text: 'Busta Rhymes raps really fast, it is impressive.' },
      ],
    },
    {
      bar: "Kris Kross will make you jump, jump, and Delilah will too,\nshe jumped a Prius on Ashland, homie, and she'll jump right over you.",
      answers: [
        {
          tier: 'fire',
          text: 'Delilah jumped a Prius? Homie, she jumped a curb and broke in two,\nKris Kross wore their pants backwards, and you wear your helmet backwards too.',
        },
        {
          tier: 'decent',
          text: "You and Delilah can jump all you want, it's true,\nbut I'm jumping higher, and I'm coming through.",
        },
        { tier: 'flop', text: 'Kris Kross was before my time, honestly.' },
      ],
    },
    {
      bar: "Flavor Flav wore a clock, homie, I wear Delilah's speedometer,\nand it reads a hundred and ten, pointing at you like a thermometer.",
      answers: [
        {
          tier: 'fire',
          text: "A hundred and ten? That's your fever, not your speed. Check your odometer,\nDelilah's done a million miles, all of 'em in the shop. Here's a barometer.",
        },
        {
          tier: 'decent',
          text: "You can brag all you want about your speedometer,\nbut I'm faster than you, homie, just check the odometer.",
        },
        { tier: 'flop', text: "Flavor Flav's clock is pretty iconic, I'll admit." },
      ],
    },
    {
      bar: "I'm taking my hog to the Old Town Road, homie, I'm gonna ride,\nLil Nas X had a horse, I got Delilah, and she's got the bigger stride.",
      answers: [
        {
          tier: 'fire',
          text: "Old Town Road? That's in Chicago, homie, it's a street with a Starbucks on the side,\nLil Nas X rode to the top of the charts, and you rode to a Jiffy Lube and cried.",
        },
        {
          tier: 'decent',
          text: "You can take the Old Town Road and ride with pride,\nbut I'll beat you so bad you'll be looking for a place to hide.",
        },
        { tier: 'flop', text: 'Old Town has some really good comedy clubs.' },
      ],
    },
    {
      bar: "Stop, collaborate, and listen, Delilah's back with a brand new pipe,\nshe's louder than Vanilla Ice, homie, and she's more than just hype.",
      answers: [
        {
          tier: 'fire',
          text: "Vanilla Ice stole his bass line, and you stole your whole biker type,\nfrom a Halloween costume aisle, homie. The leather's still got the price stripe.",
        },
        {
          tier: 'decent',
          text: "You can show off your pipe, but you're just not my type,\nI'll beat you so fast you'll be cleaning up with a wipe.",
        },
        { tier: 'flop', text: 'Vanilla Ice had a home renovation show, I think.' },
      ],
    },
    {
      bar: 'I fight the power, homie, like Public Enemy taught,\nI fight the cops, the toll booths, and every pothole I caught.',
      answers: [
        {
          tier: 'fire',
          text: "You fight the power? Delilah's battery dies if you idle in a parking spot,\nPublic Enemy fought the system, homie, you fight potholes, and you lose. A lot.",
        },
        {
          tier: 'decent',
          text: "You can fight all the potholes and the power you've got,\nbut I'll beat you so bad you'll be tied in a knot.",
        },
        { tier: 'flop', text: 'Potholes in Chicago really are terrible.' },
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
    {
      bar: "I'm not a businessman, I'm a business, man. Hov said it first,\nand my business is you, homie, and business is about to get worse.",
      answers: [
        {
          tier: 'fire',
          text: "You're a business, man? Your business filed for bankruptcy, it's in reverse,\nHov built Roc Nation, you built a lemonade stand, and the lemonade's a curse.",
        },
        {
          tier: 'decent',
          text: "You can be a business, but this is your worst verse,\nI'm buying out your corner and putting you in reverse.",
        },
        { tier: 'flop', text: 'Small businesses are the backbone of the economy.' },
      ],
    },
    {
      bar: "Put some respect on my name, like Birdman told the radio,\nwhen I rub my hands together, homie, the whole West Side says 'whoa.'",
      answers: [
        {
          tier: 'fire',
          text: "Respect on your name? Birdman stormed off that show in four minutes, you know,\nand your soldiers quit 'cause you pay 'em like Birdman paid Wayne: real slow.",
        },
        {
          tier: 'decent',
          text: "You can rub your hands together and put on a show,\nbut I'm taking your corner, and your name's gotta go.",
        },
        { tier: 'flop', text: "Birdman's interview was pretty short, I remember that." },
      ],
    },
    {
      bar: "I got ninety-nine problems, homie, and you ain't one,\nyou're a typo in my ledger, and I'm crossing you out. Done.",
      answers: [
        {
          tier: 'fire',
          text: "Ninety-nine problems? Your soldiers on lunch break are problems one through ninety-one,\nyour ledger's a Lisa Frank notebook, and your empire's on the run.",
        },
        {
          tier: 'decent',
          text: "You got ninety-nine problems, and I'm number one,\nI'll beat you so bad you'll be hiding from the sun.",
        },
        { tier: 'flop', text: 'Ninety-nine is a lot of problems, are you okay?' },
      ],
    },
    {
      bar: "I own a piece of every block like Jay had a piece of the Nets,\nand I'm calling in your loan, homie, so pay me your debts.",
      answers: [
        {
          tier: 'fire',
          text: "Jay had a slice of the Nets, and you got a slice of a Dunkin' and some sweats,\nyour empire's three corners and a bus bench, and your soldiers are all regrets.",
        },
        {
          tier: 'decent',
          text: "You can call in your loans and talk about debts,\nbut I'm taking your block, and I'm calling your bets.",
        },
        { tier: 'flop', text: "The Nets haven't been very good lately." },
      ],
    },
    {
      bar: "Watch the Throne, homie, Kanye and Hov made it for me,\nI sit on it every morning, and it's as royal as can be.",
      answers: [
        {
          tier: 'fire',
          text: "You sit on your throne every morning? Homie, that's a toilet, I see,\nKanye and Hov watched the throne, and you're on it with a crossword and some tea.",
        },
        {
          tier: 'decent',
          text: "You can sit on your throne, but it ain't meant to be,\nI'm taking your crown, and I'm doing it for free.",
        },
        { tier: 'flop', text: 'Watch the Throne is a really good album.' },
      ],
    },
    {
      bar: "I'm like Dr. Dre, homie, I been working on my empire for years,\nit's coming out soon, like Detox. Any day now. Cheers.",
      answers: [
        {
          tier: 'fire',
          text: "Your empire's coming out like Detox? Then it's never coming, it's been fifteen years,\nDre sold Beats for billions, and you sold your soldiers' lunch money for beers.",
        },
        {
          tier: 'decent',
          text: "You've been working on your empire for years,\nbut I'll beat you so bad you'll be crying to your peers.",
        },
        { tier: 'flop', text: "Dr. Dre's headphones are really expensive, though." },
      ],
    },
    {
      bar: "J. Prince taught me, homie, I got receipts on everybody in this town,\nso don't make me open the folder, 'cause the folder takes you down.",
      answers: [
        {
          tier: 'fire',
          text: "Receipts on everybody? Your folder's full of coupons and a Jewel receipt, clown,\nJ. Prince is a legend, and you're a filing cabinet in a Burger King crown.",
        },
        {
          tier: 'decent',
          text: "You can open your folder and pass it around,\nbut I'm taking your corner and your paper crown.",
        },
        { tier: 'flop', text: 'I always keep my receipts too, for returns.' },
      ],
    },
    {
      bar: "I built my crew like 50 built G-Unit, loyal to the end,\nthen half of 'em went solo, and the other half's my friend.",
      answers: [
        {
          tier: 'fire',
          text: "Like G-Unit? Your Game left, your Banks are empty, and your fans just pretend,\nthe only loyal one left is the guy who holds your hat, and he's quitting this weekend.",
        },
        {
          tier: 'decent',
          text: "You can build up your crew and say they're loyal to the end,\nbut I'm taking your corner, and I've got a message to send.",
        },
        { tier: 'flop', text: "It's nice to have at least one good friend." },
      ],
    },
    {
      bar: "The world is mine like Scarface, homie, I got it painted on the blimp,\nand you're down here on the sidewalk with a hall pass and a limp.",
      answers: [
        {
          tier: 'fire',
          text: "The world is yours? Your blimp's a Party City balloon, and you're a wimp,\nScarface ran Miami, and you run a Dunkin' drive-thru with a chimp.",
        },
        {
          tier: 'decent',
          text: "You can paint up your blimp, but I'm not gonna skimp,\nI'll take your whole world and leave you a wimp.",
        },
        { tier: 'flop', text: 'Blimps are actually really slow, you know.' },
      ],
    },
    {
      bar: "I run a Tidal empire, homie, I got waves, I got a stream,\nwell, it's me and my cousin listening. But it's a team.",
      answers: [
        {
          tier: 'fire',
          text: "Your empire's like Tidal? Then it's two subscribers and a broken dream,\neven your cousin switched to Spotify, homie. There goes your regime.",
        },
        {
          tier: 'decent',
          text: "You can run your Tidal and swim in your stream,\nbut I'm taking your corner and crushing your dream.",
        },
        { tier: 'flop', text: 'I use Spotify, personally.' },
      ],
    },
    {
      bar: "I came up like Jay, homie, from the projects to the penthouse suite,\nand you came up from the basement, and you're still on the same street.",
      answers: [
        {
          tier: 'fire',
          text: "From the projects to the penthouse? You moved from your mama's couch to her other seat,\nJay married Beyoncé, and you got stood up at Portillo's and ate both fries in defeat.",
        },
        {
          tier: 'decent',
          text: "You came up like Jay, but I'm taking your seat,\nI'm taking your corner, and that's a done deal, complete.",
        },
        { tier: 'flop', text: 'Penthouses are really expensive in Chicago.' },
      ],
    },
    {
      bar: 'Mo money, mo problems, homie, Biggie told the truth,\nI got so much money that my problems got their own booth.',
      answers: [
        {
          tier: 'fire',
          text: "Mo money? Your money's Monopoly cash, and your biggest problem's a missing tooth,\nBiggie told the truth, homie, and you've been lying about that empire since your youth.",
        },
        {
          tier: 'decent',
          text: "You can talk about money and all of the truth,\nbut I'll beat you so bad you'll be losing a tooth.",
        },
        { tier: 'flop', text: "Money can't buy happiness, they say." },
      ],
    },
    {
      bar: "I'm the Jay-Z of the West Side, homie, I'll leave you like he left Dame,\nyou'll be on the sidelines selling bootlegs with my picture in a frame.",
      answers: [
        {
          tier: 'fire',
          text: "You're Jay? Homie, you're Dame, the one who got left out of the game,\nyour soldiers took the Roc chain and left you a Ring Pop. That's a shame.",
        },
        {
          tier: 'decent',
          text: "You can be Jay-Z, and I'll take all the fame,\nI'm taking your corner, and I'm taking your name.",
        },
        { tier: 'flop', text: 'I think Jay-Z and Dame Dash should just make up.' },
      ],
    },
    {
      bar: "I don't do diss tracks, homie, I got lawyers on my team,\nI'll sue you like Drake sued his label 'cause a song was too mean.",
      answers: [
        {
          tier: 'fire',
          text: "You'd sue me like Drake sued his label? The judge threw that out clean,\nthe only thing you ever won in court was a coffee from the vending machine.",
        },
        {
          tier: 'decent',
          text: "You can call all your lawyers and sue me, I mean,\nI'm still beating you down, and I'm wiping you clean.",
        },
        { tier: 'flop', text: 'Lawsuits are so expensive and take forever.' },
      ],
    },
    {
      bar: "My crew's the Cash Money of the West Side, homie, we make it rain,\nwell, we make it drizzle. We're on a budget. But we're still in the game.",
      answers: [
        {
          tier: 'fire',
          text: "You make it drizzle? Then you're Drizzy, and we all saw how he lost the game,\nKendrick made it pour at the Super Bowl, and you're still holding the umbrella. Lame.",
        },
        {
          tier: 'decent',
          text: "You can make it drizzle, I'll make it rain all the same,\nI'm taking your money and putting you to shame.",
        },
        { tier: 'flop', text: 'It does drizzle a lot in Chicago in the spring.' },
      ],
    },
    {
      bar: "Like Nas said, the world is yours, but this block is mine,\nand I'll Ether anybody who steps over the line.",
      answers: [
        {
          tier: 'fire',
          text: "Nas Ethered Hov, and you can't even Ether a Lunchable at lunchtime,\nthe world is yours? Homie, your Ventra card's got a balance of one dime.",
        },
        {
          tier: 'decent',
          text: "The world might be yours, but this fight is mine,\nand I'll beat you so bad you'll be drinking cheap wine.",
        },
        { tier: 'flop', text: 'I think the world belongs to all of us.' },
      ],
    },
    {
      bar: "I sent my soldiers to handle you, homie, like a boss should,\nbut they stopped at Harold's Chicken, and the chicken was too good.",
      answers: [
        {
          tier: 'fire',
          text: "Your soldiers picked chicken over you? Then they're smarter than I thought they could,\neven your hit squad knows Harold's is more loyal than you. Understood.",
        },
        {
          tier: 'decent',
          text: "Your soldiers stopped for chicken, and I knew that they would,\nso I'm handling you myself, like a real leader should.",
        },
        { tier: 'flop', text: "Harold's Chicken really is great, I agree." },
      ],
    },
    {
      bar: "They call me the Godfather of the West Side, homie, I'm the Don,\nlike Don Toliver, but I don't sing. I just take your corner. Gone.",
      answers: [
        {
          tier: 'fire',
          text: "You're the Don? Homie, you're a pawn with a sweater vest and a fake Rolex on,\nthe only thing you've ever taken over is your grandma's front lawn.",
        },
        {
          tier: 'decent',
          text: "You can call yourself the Don, but you're really just a pawn,\nI'll take over your corner, and I'll do it before dawn.",
        },
        { tier: 'flop', text: "The Godfather is a really long movie, isn't it?" },
      ],
    },
    {
      bar: "Today was a good day, like Ice Cube, I didn't have to use my crew,\nbut that's about to change, homie, 'cause today I met you.",
      answers: [
        {
          tier: 'fire',
          text: "Today was a good day? Not for you, homie, your crew's on lunch, it's true,\nIce Cube made Friday, and I'm about to say 'Bye, Felicia' to you and your crew.",
        },
        {
          tier: 'decent',
          text: "It was a good day for you, but now it's through,\nI'm taking your corner, and I'm taking your crew.",
        },
        { tier: 'flop', text: 'I hope you have a good day as well, honestly.' },
      ],
    },
    {
      bar: 'I run my crew like Kanye ran GOOD Music, homie, a genius in a suit,\nI sign the talent, take the credit, and I keep all the loot.',
      answers: [
        {
          tier: 'fire',
          text: 'You run it like Ye? Then run for president and get sixty thousand votes. Cute,\nyour GOOD Music is three guys, a kazoo, and a recorder. Toot toot.',
        },
        {
          tier: 'decent',
          text: "You can sign all your talent and wear your best suit,\nbut I'm taking your corner, and I'm giving you the boot.",
        },
        { tier: 'flop', text: 'Kanye did make some really good albums, though.' },
      ],
    },
    {
      bar: 'My wife is like Beyoncé, homie, she runs the world, not me,\nshe told me to handle you. And to pick up milk. And some tea.',
      answers: [
        {
          tier: 'fire',
          text: "Your wife runs the world, and you run for her milk? So the real boss is she,\nBeyoncé made Lemonade, and you can't make it home with the right kind of brie.",
        },
        {
          tier: 'decent',
          text: "Your wife runs the world, but she ain't running me,\nI'm taking your corner, and I'm doing it with glee.",
        },
        { tier: 'flop', text: 'Your wife sounds really organized.' },
      ],
    },
    {
      bar: "My crew's deeper than the Wu-Tang Clan, homie, I got thirty men,\nwell, I got three, and two are named Ghostface. Don't ask me again.",
      answers: [
        {
          tier: 'fire',
          text: "Deeper than the Wu? Your crew is three guys and your nephew, and he's ten,\nWu-Tang ain't nothing to mess with, but you get bullied by a crossing guard named Gwen.",
        },
        {
          tier: 'decent',
          text: "You can count up your crew and say you've got men,\nbut I'll beat you so bad you'll be counting to ten.",
        },
        { tier: 'flop', text: 'Wu-Tang has a lot of members, I can never remember them all.' },
      ],
    },
    {
      bar: "Can't knock the hustle, Hov said it, and he said it plain,\nI hustle on every corner, homie, in the snow and the rain.",
      answers: [
        {
          tier: 'fire',
          text: "Can't knock your hustle? Your hustle is essential oils and a pyramid scheme, it's plain,\nHov built an empire, you built a downline of your cousins and a guy named Wayne.",
        },
        {
          tier: 'decent',
          text: "You can hustle all day in the snow and the rain,\nbut I'm taking your corner, and I'm causing you pain.",
        },
        { tier: 'flop', text: 'Working in bad weather must be really hard.' },
      ],
    },
    {
      bar: "Jay and Nas made peace, homie, and they made a song together,\nso when I'm done beating you, you can be on my B-side forever.",
      answers: [
        {
          tier: 'fire',
          text: "Jay and Nas made peace 'cause they're both legends, and you're not, so whatever,\nyou ain't got a B-side, homie, you got a voicemail from your mama about the weather.",
        },
        {
          tier: 'decent',
          text: "You can make peace with Nas or whoever,\nbut I'm taking this fight, 'cause I'm way more clever.",
        },
        { tier: 'flop', text: "It's nice when people make up after a fight." },
      ],
    },
    {
      bar: "Started from the bottom, now I'm here, the top floor of the Sears,\nI look down on you, homie, like a pigeon looks down on the piers.",
      answers: [
        {
          tier: 'fire',
          text: "Top of the Sears? You bought a Skydeck ticket and froze in the glass box for years,\nyou didn't start from the bottom, homie, you started from the gift shop. Cheers.",
        },
        {
          tier: 'decent',
          text: "You can look down from the Sears with all of your peers,\nbut I'll beat you so bad you'll be out for years.",
        },
        { tier: 'flop', text: "The Skydeck is really scary, I won't stand on the glass." },
      ],
    },
    {
      bar: "I got more chains than Jacob the Jeweler's got in his whole store,\nand when I swing 'em, homie, you'll be dancing on the floor.",
      answers: [
        {
          tier: 'fire',
          text: "More chains than Jacob? Yours are from Claire's, and your neck's turning green, for sure,\nyou swing 'em, the clasp breaks, and you're on your knees picking beads up by the door.",
        },
        {
          tier: 'decent',
          text: "You can rock all your chains from the jewelry store,\nbut I'll beat you so bad you'll be begging for more.",
        },
        { tier: 'flop', text: "Jewelry can get really expensive, I've heard." },
      ],
    },
    {
      bar: "I got the city on lock like Kendrick at the Super Bowl, homie, game over,\nI'm the halftime show, and you're the commercial for a Range Rover.",
      answers: [
        {
          tier: 'fire',
          text: "You're the halftime show? You're the guy with a broom sweeping up when it's over,\nKendrick had the Super Bowl, and you've got a Super 8 motel and a hangover.",
        },
        {
          tier: 'decent',
          text: "You can talk about the Super Bowl and say it's game over,\nbut I'll beat you so bad you'll be lost in the clover.",
        },
        { tier: 'flop', text: 'Range Rovers are really nice cars, though.' },
      ],
    },
    {
      bar: "No one man should have all that power, Ye said, but I got it anyway,\nthe clock's ticking, homie, and I'm about to make you pay.",
      answers: [
        {
          tier: 'fire',
          text: "All that power? Your power got shut off, homie, ComEd took it away,\nKanye's got power, and you've got a candle and an unpaid bill from May.",
        },
        {
          tier: 'decent',
          text: "You can have all the power, I'll take it away,\nI'm taking your corner, and I'm taking it today.",
        },
        { tier: 'flop', text: 'Power bills are really expensive in the summer.' },
      ],
    },
    {
      bar: "I hate the way that you walk, the way that you talk, the way that you dress,\nKendrick said it first, homie, and I'm about to clean up your mess.",
      answers: [
        {
          tier: 'fire',
          text: "You hate the way I dress? Your suit's a rental, homie, and it's due back at six, no less,\nKendrick wrote Euphoria, and you're a gang leader whose own gang can't find your address.",
        },
        {
          tier: 'decent',
          text: "You can hate how I walk and the way that I dress,\nbut I'm taking your corner, and I'm making you confess.",
        },
        { tier: 'flop', text: 'I got this shirt on sale, actually.' },
      ],
    },
    {
      bar: "Biggie said birthdays was the worst days, now I sip champagne at the top,\nand you're down there sipping a Kool-Aid Jammer from the corner shop.",
      answers: [
        {
          tier: 'fire',
          text: "Champagne at the top? Homie, that's Andre from Walgreens, and it's warm slop,\nBiggie went from ashy to classy, and you went from ashy to ashier. Stop.",
        },
        {
          tier: 'decent',
          text: "You can sip your champagne up there at the top,\nbut I'm climbing up there, and I'm making you drop.",
        },
        { tier: 'flop', text: 'Kool-Aid Jammers are actually pretty good.' },
      ],
    },
    {
      bar: "I've been the boss since Kanye wore a pink polo and a backpack,\nand I'll be the boss when you're gone, homie, and you won't be back, Jack.",
      answers: [
        {
          tier: 'fire',
          text: "Since Ye wore pink polos? So you're old, homie, and your knees go crack,\nyou ain't an OG, you're a grandpa with a pager and a fanny pack.",
        },
        {
          tier: 'decent',
          text: "You can talk about the past and the pink and the backpack,\nbut I'm taking your corner, and I'm not giving it back.",
        },
        { tier: 'flop', text: 'Pink polos are actually coming back in style.' },
      ],
    },
    {
      bar: "I'm Big Pimpin' on a yacht, homie, like Hov and UGK,\nwell, it's a pedal boat in Lincoln Park, but I paid for the whole day.",
      answers: [
        {
          tier: 'fire',
          text: "Big Pimpin'? You're pedaling a swan boat in circles, and the swan leads the way,\nHov had a yacht in Trinidad, you got a sunburn and a five-dollar refund. Okay.",
        },
        {
          tier: 'decent',
          text: "You can pedal your boat in the park all day,\nbut I'm taking your corner, so sail away.",
        },
        { tier: 'flop', text: 'Swan boats in Lincoln Park are really fun.' },
      ],
    },
    {
      bar: "My crew's like the Migos, homie, three of us, and we all dab,\nwe dab on our enemies, and then we split the cab.",
      answers: [
        {
          tier: 'fire',
          text: "Like the Migos? Migos had 'Bad and Boujee,' and you had a bad kebab,\nyou dab on your enemies, then split an Uber Pool and argue over the tab.",
        },
        {
          tier: 'decent',
          text: "You can dab with your crew and split up the cab,\nbut I'm taking your corner with one single jab.",
        },
        { tier: 'flop', text: 'Dabbing is kind of an old dance move now.' },
      ],
    },
    {
      bar: 'A milli, a milli, I made a milli, homie, Weezy-style,\nwell, a milli in Chuck E. Cheese tickets. I been saving for a while.',
      answers: [
        {
          tier: 'fire',
          text: "A milli in Chuck E. Cheese tickets? That's a whoopee cushion and a sticker pile,\nWeezy made a milli, and you made a kid cry at the prize counter. Smile.",
        },
        {
          tier: 'decent',
          text: "You can save up your tickets and count 'em for a while,\nbut I'm taking your tickets, and I'm leaving you a pile.",
        },
        { tier: 'flop', text: 'Chuck E. Cheese tickets are hard to save up.' },
      ],
    },
    {
      bar: "You can't tell me nothing, homie, like Ye said in his prime,\nexcept my wife. She tells me stuff. Like 'take out the trash this time.'",
      answers: [
        {
          tier: 'fire',
          text: "Can't tell you nothing? Your wife tells you everything, and you listen every time,\nKanye had stadiums chanting, and you got a chore list on the fridge and a curfew at nine.",
        },
        {
          tier: 'decent',
          text: "You can't be told nothing, but I'll tell you this time,\nI'm taking your corner, and you're paying the fine.",
        },
        { tier: 'flop', text: 'Taking out the trash is important, to be fair.' },
      ],
    },
    {
      bar: "Jumpman, Jumpman, I'm the Jordan of these streets, homie, six rings deep,\nand you're Bryon Russell, so go home and get some sleep.",
      answers: [
        {
          tier: 'fire',
          text: "The Jordan of the streets? You're the Jordan who played baseball, and it's cheap,\nDrake made 'Jumpman,' and you can't jump a puddle in your Jordans. Weep.",
        },
        {
          tier: 'decent',
          text: "You can talk about rings and your six rings deep,\nbut I'll beat you so bad you'll be counting sheep.",
        },
        { tier: 'flop', text: 'Michael Jordan is the greatest of all time.' },
      ],
    },
    {
      bar: "I'm an original gangster, homie, like Ice-T, the first of the breed,\nI built this block from nothing, and I'm everything you'll ever need.",
      answers: [
        {
          tier: 'fire',
          text: "Original gangster like Ice-T? Ice-T plays a cop on TV now, homie, so take heed,\nyou're one Law & Order episode away from reading people their rights. Proceed.",
        },
        {
          tier: 'decent',
          text: "You can be an original, but I'm faster in speed,\nI'll take over your block, and I'm taking the deed.",
        },
        { tier: 'flop', text: 'Ice-T is really good on Law and Order.' },
      ],
    },
    {
      bar: "My soldiers learned from Wu-Tang, homie, they'll protect my neck,\nwell, on weekdays. Weekends, they're at the Jewel cashing a check.",
      answers: [
        {
          tier: 'fire',
          text: "Your soldiers protect your neck part-time? Then your empire's a W-2 wreck,\nWu-Tang had a whole Clan, and you got two part-timers and a coupon book on deck.",
        },
        {
          tier: 'decent',
          text: "Your soldiers can protect you, but I'm coming for your neck,\nI'll beat you so bad you'll be lying on the deck.",
        },
        { tier: 'flop', text: 'Part-time work is great for flexibility.' },
      ],
    },
    {
      bar: "Kendrick said they not like us, and my soldiers ain't like you,\nthey're loyal, they're tough, and they're on lunch until two.",
      answers: [
        {
          tier: 'fire',
          text: "Your soldiers are on lunch till two? That ain't a crew, homie, that's a DMV queue,\nKendrick had the West Coast behind him, you got a number and a 'please wait.' Boo.",
        },
        {
          tier: 'decent',
          text: "Your soldiers can eat lunch, homie, I'll eat them too,\nand then I'm coming for you, and I'm coming right through.",
        },
        { tier: 'flop', text: 'Lunch breaks are important for productivity.' },
      ],
    },
    {
      bar: "I'm like Pharrell, homie, I don't age, I've been running this since '01,\nand I'll be running it when you're old and gray and done.",
      answers: [
        {
          tier: 'fire',
          text: "You don't age like Pharrell? Homie, you've been forty since you were twenty-one,\nPharrell's got a Neptunes glow, and you've got a hairline on the run.",
        },
        {
          tier: 'decent',
          text: "You can stay young forever and run with the sun,\nbut I'm taking this fight, and you'll see that I've won.",
        },
        { tier: 'flop', text: 'Pharrell does look really young, it is amazing.' },
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
    {
      bar: "I'm the Drake of this city, homie, I got hits in every season,\nI make the girls cry and the haters cry, and I don't need a reason.",
      answers: [
        {
          tier: 'fire',
          text: "The Drake of this city? Then you're one Kendrick song from the end of your season,\nyour hits are ghostwritten, your accent's borrowed, your hairline's committing treason.",
        },
        {
          tier: 'decent',
          text: "You can drop hits in the summer, but now it's winter season,\nand I'm about to leave you out in the cold and freezin'.",
        },
        { tier: 'flop', text: 'Drake does have a lot of songs, that is true.' },
      ],
    },
    {
      bar: "I'm Kendrick in this cypher, homie, I'm the best one in the class,\nI got five Grammys for one diss, and you're about to get a pass.",
      answers: [
        {
          tier: 'fire',
          text: "You're Kendrick? Kendrick got a Pulitzer, and you got a hall pass and some gas,\nhe made the Super Bowl sing 'they not like us,' you made your hype man nap in the grass.",
        },
        {
          tier: 'decent',
          text: "You can be Kendrick and call yourself first class,\nbut I'll beat you so bad you'll be eating the grass.",
        },
        { tier: 'flop', text: "Kendrick's albums are really good, I agree." },
      ],
    },
    {
      bar: "BBL Drizzy, homie, that's what I'll call you when this is through,\nMetro made the beat, and I'm about to make one about you.",
      answers: [
        {
          tier: 'fire',
          text: "Metro gave the world a beat, and you rapped on it like a kazoo,\nyou couldn't diss a parking meter with that beat if Metro sang it too.",
        },
        {
          tier: 'decent',
          text: "You can make me a beat and a whole diss too,\nbut I'm still gonna win, and I'm still coming through.",
        },
        { tier: 'flop', text: 'BBL Drizzy was really catchy, though.' },
      ],
    },
    {
      bar: "My diss track's so cold it's got a Pusha T cover,\nI'll expose every secret, homie, your mama, your brother.",
      answers: [
        {
          tier: 'fire',
          text: 'Pusha came with receipts, and you came with a Post-it from your mother,\nthe only secret you exposed is you still sleep with a nightlight under the cover.',
        },
        {
          tier: 'decent',
          text: "You can expose all my secrets, one after another,\nbut I'm still gonna beat you and send you home to your mother.",
        },
        { tier: 'flop', text: "My family doesn't really have any secrets, though." },
      ],
    },
    {
      bar: "I'm Meek on the Back to Back side, but I learned from my loss,\nnow I go back to back on everybody, homie, I'm the boss.",
      answers: [
        {
          tier: 'fire',
          text: "Drake asked Meek, 'Is that a world tour or your girl's tour?' and it was a loss,\nyour tour's three open mics and a Chili's, homie. You ain't the boss, you're the sauce.",
        },
        {
          tier: 'decent',
          text: "You can go back to back, but you're still taking a loss,\nI'm taking this crown, and I'm giving it a toss.",
        },
        { tier: 'flop', text: 'Meek Mill and Drake are friends now.' },
      ],
    },
    {
      bar: "I'm a Rap God like Eminem, homie, I spit so fast,\nyou'll still be on my first bar when the whole verse has passed.",
      answers: [
        {
          tier: 'fire',
          text: "You rap fast so nobody can hear how bad you are. That's your whole forecast,\nEm's a Rap God, and you're an auctioneer at a yard sale. Nobody bid. You're last.",
        },
        {
          tier: 'decent',
          text: "You can rap like a Rap God and spit real fast,\nbut I'll beat you so bad you'll be stuck in the past.",
        },
        { tier: 'flop', text: "Eminem's 'Rap God' is really hard to rap along to." },
      ],
    },
    {
      bar: 'My label just gave me a 360 deal, homie, they own all of me,\nthey own my songs, my shoes, my shows, and even my family tree.',
      answers: [
        {
          tier: 'fire',
          text: "A 360 deal? You don't own your masters, you're a lease-to-own TV,\nTaylor rerecorded six albums, and you can't rerecord your voicemail for free.",
        },
        {
          tier: 'decent',
          text: "Your label can own you, but they can't own me,\nI'm about to beat you down, and I'm walking out free.",
        },
        { tier: 'flop', text: 'You should probably get a lawyer to read your contract.' },
      ],
    },
    {
      bar: "My streams are so high, homie, I'm the number one on the chart,\nI got a billion plays on Spotify. Okay, it's my mama's account. It's a start.",
      answers: [
        {
          tier: 'fire',
          text: "Your mama's got forty phones playing your song on a loop? That's a bot farm, not art,\nthe only chart you top is the chore chart on the fridge, and you're failing that part.",
        },
        {
          tier: 'decent',
          text: "You can top all the charts, but you're still not smart,\nI'll beat you so bad that you'll fall apart.",
        },
        { tier: 'flop', text: 'Your mom must really believe in you, that is sweet.' },
      ],
    },
    {
      bar: "Charlamagne gave me Donkey of the Day, and I wore it like a crown,\nI'm the biggest donkey on the radio, homie, and the realest in town.",
      answers: [
        {
          tier: 'fire',
          text: "You took Donkey of the Day as a crown? Homie, that's a donkey in a gown,\nCharlamagne didn't call you a donkey, he was being nice. You're the clown.",
        },
        {
          tier: 'decent',
          text: "You can take every award and wear it like a crown,\nbut I'm about to beat you and knock your ratings down.",
        },
        { tier: 'flop', text: 'The Breakfast Club is a pretty funny show, honestly.' },
      ],
    },
    {
      bar: "I'm a SoundCloud rapper, homie, I came up on the internet,\nI got face tattoos and a purple Lambo. Okay, it's a sticker on a Corvette.",
      answers: [
        {
          tier: 'fire',
          text: "Your face tattoo's misspelled, homie, it says 'No Regerts,' and that's a bad bet,\nand that Corvette is your mama's. She's calling. You're grounded, and you're in debt.",
        },
        {
          tier: 'decent',
          text: "You can rap on SoundCloud, but you're not famous yet,\nI'll beat you so bad you'll be dripping in sweat.",
        },
        { tier: 'flop', text: 'Face tattoos seem like a big commitment.' },
      ],
    },
    {
      bar: "I'm Future on the beat with Metro, homie, it's just big me,\nevery other rapper in the game is little, and that includes thee.",
      answers: [
        {
          tier: 'fire',
          text: "That was Kendrick's verse on 'Like That,' homie, not Future's, but okay, I see,\nyou can't even get your beef right. It's just little you, and it's just big me.",
        },
        {
          tier: 'decent',
          text: "You can say it's just big you, but it's actually me,\nI'm the biggest in this cypher, as big as can be.",
        },
        { tier: 'flop', text: "I think everyone's the same size." },
      ],
    },
    {
      bar: "J. Cole said there's a big three, and I'm the fourth, homie, I'm the sleeper,\nI went platinum with no features. And no streams. But I'm a keeper.",
      answers: [
        {
          tier: 'fire',
          text: "No features and no streams? That ain't platinum, homie, that's a beeper,\nJ. Cole apologized for one song, you should apologize for your career. It's cheaper.",
        },
        {
          tier: 'decent',
          text: "You can call yourself the fourth, but I'm digging deeper,\nI'll beat you so bad you'll be calling the street sweeper.",
        },
        { tier: 'flop', text: 'J. Cole seems like a really humble guy.' },
      ],
    },
    {
      bar: 'Funk Flex dropped a bomb when he played my song, BOOM,\nthe whole Hot 97 went crazy, homie, I blew up the room.',
      answers: [
        {
          tier: 'fire',
          text: "Funk Flex drops bombs on everything, homie, he'd drop one on a mushroom,\nthat bomb wasn't hype, it was a warning to evacuate. Your song's the doom.",
        },
        {
          tier: 'decent',
          text: "You can talk about bombs and the boom and the zoom,\nbut I'm about to sweep you out like a broom.",
        },
        { tier: 'flop', text: 'Hot 97 is a radio station in New York, right?' },
      ],
    },
    {
      bar: "I'm the Lil Wayne of this cypher, the best rapper alive,\nI'm a Martian with a lollipop, homie, and I'm built to survive.",
      answers: [
        {
          tier: 'fire',
          text: "Best rapper alive? Weezy can say it, but you're the worst one who's still alive,\nyou're no Martian, homie, you're a Dum Dum melting on a dashboard on a long drive.",
        },
        {
          tier: 'decent',
          text: "You can call yourself the best, but you're barely alive,\nI'll beat you so bad you'll be taking a dive.",
        },
        { tier: 'flop', text: 'Lollipops are bad for your teeth, you know.' },
      ],
    },
    {
      bar: "I got more plaques than Drake, homie, my walls are covered in gold,\nwell, they're Dollar Tree plaques, but my fans don't need to be told.",
      answers: [
        {
          tier: 'fire',
          text: "Dollar Tree plaques? Your platinum's plastic, homie, and your gold's growing mold,\nDrake's got plaques for his hits, and you got one for 'Most Improved,' eight years old.",
        },
        {
          tier: 'decent',
          text: "You can hang up your plaques and call 'em all gold,\nbut I'll beat you so bad you'll be out in the cold.",
        },
        { tier: 'flop', text: 'The Dollar Tree has a lot of good deals, actually.' },
      ],
    },
    {
      bar: "I'm Soulja Boy, homie, I was the first to do everything,\nthe first on YouTube, the first on the moon, the first to be a king.",
      answers: [
        {
          tier: 'fire',
          text: "First to everything? Then you're the first to get Supermanned out of the ring,\nSoulja cranked that, and you cranked your mama's car into a sprinkler in the spring.",
        },
        {
          tier: 'decent',
          text: "You can say you were first, but you're not the king,\nI'll beat you so bad that you'll fall out the ring.",
        },
        { tier: 'flop', text: 'YouTube has been around for a long time, though.' },
      ],
    },
    {
      bar: "They play me on Hot 97, homie, they play me on Power 92,\nwell, they played me once by accident, but I still got the clip. It's true.",
      answers: [
        {
          tier: 'fire',
          text: "They played you once by accident? Then the DJ got fired, and the station's through,\nPower 92 sent an apology to the whole city. I got the letter too.",
        },
        {
          tier: 'decent',
          text: "They played you by accident, and that's nothing new,\nbut I'm on every station when I'm done with you.",
        },
        { tier: 'flop', text: 'Power 92 plays a lot of good music.' },
      ],
    },
    {
      bar: "I dropped a diss on everybody, like Kendrick on 'Control,'\nI said every name in the game, homie, and I'm still on a roll.",
      answers: [
        {
          tier: 'fire',
          text: "Kendrick named legends on 'Control,' and you named the guys in your bowling league, Joel,\nnobody wrote back 'cause nobody heard it. Your diss track fell in a hole.",
        },
        {
          tier: 'decent',
          text: "You can name every rapper and try to take control,\nbut I'm about to beat you and swallow you whole.",
        },
        { tier: 'flop', text: "I don't think I've heard that song." },
      ],
    },
    {
      bar: "I'm the Ja Rule of this cypher, homie, I sing every hook with a growl,\nand the ladies love it, homie, and the haters? They just howl.",
      answers: [
        {
          tier: 'fire',
          text: "You growl like Ja? Homie, that ain't a growl, that's a sick owl,\nyou sound like a garbage disposal that's choking on a fowl.",
        },
        {
          tier: 'decent',
          text: "You can sing every hook with a growl and a scowl,\nbut I'll beat you so bad you'll be crying like an owl.",
        },
        { tier: 'flop', text: "Ja Rule's voice is really unique, I'll give him that." },
      ],
    },
    {
      bar: "I'll snatch the mic out your hand like Ye did Taylor, homie, I'll interrupt,\nI'mma let you finish, but the cypher's mine, and your verse just got cut.",
      answers: [
        {
          tier: 'fire',
          text: 'Snatch the mic like Ye? Taylor turned that into a billion-dollar tour, homie, so what?\nYou snatch a mic, and the bouncer snatches you, and you land on your butt.',
        },
        {
          tier: 'decent',
          text: "You can snatch the mic, but I'm still making the cut,\nI'll beat you so bad you'll be stuck in a rut.",
        },
        { tier: 'flop', text: "Taylor Swift's Eras Tour made so much money." },
      ],
    },
    {
      bar: "Drake fed Kendrick fake info, homie, and I'm a mastermind too,\nI fed you this whole cypher. It was a trap. I planned it. Woo.",
      answers: [
        {
          tier: 'fire',
          text: "You fed me a trap like Drake? Homie, that's what he said after he lost, too,\nthe only thing you ever planned was a nap, and you overslept. Boo.",
        },
        {
          tier: 'decent',
          text: "You can say it's a trap and you planned it all through,\nbut I'm still gonna beat you, and I'm still coming through.",
        },
        { tier: 'flop', text: "I don't really follow all the drama, honestly." },
      ],
    },
    {
      bar: "I'm Tyler, the Creator, homie, the Creator of your demise,\nI got a pink golf cart and flower shoes, and I'll cut you down to size.",
      answers: [
        {
          tier: 'fire',
          text: "You're Tyler? He built a fashion empire, and you built a golf cart out of fries,\nyou ain't the Creator, homie, you're the guy he blocked for asking for a feature twice.",
        },
        {
          tier: 'decent',
          text: "You can call yourself Tyler and put on a disguise,\nbut I'll beat you so fast you won't believe your own eyes.",
        },
        { tier: 'flop', text: 'Golf carts are actually pretty fun.' },
      ],
    },
    {
      bar: "I'm on the XXL Freshman cover, homie, I'm the next big thing,\nwell, I'm in the back, behind a plant, but you can see my ring.",
      answers: [
        {
          tier: 'fire',
          text: 'Behind a plant on the XXL cover? Homie, even the plant had more bling,\nhalf the Freshman class went platinum, and you went to work at Burger King.',
        },
        {
          tier: 'decent',
          text: "You can be on the cover and talk about your ring,\nbut I'll beat you so bad that you'll forget how to sing.",
        },
        { tier: 'flop', text: 'Plants make any photo look better.' },
      ],
    },
    {
      bar: "I'll write you a diss like Pusha, 'The Story of You,' a long one,\nthe whole thing's one page that says 'loser,' and then I'm done.",
      answers: [
        {
          tier: 'fire',
          text: 'The Story of Adidon had receipts, homie, and yours is a page with a pun,\nthe story of me is a bestseller, and the story of you is a pop-up book. No fun.',
        },
        {
          tier: 'decent',
          text: "You can write me a story and call it a long one,\nbut I'll beat you so bad you'll be begging to run.",
        },
        { tier: 'flop', text: 'Writing a whole book about someone is a lot of work.' },
      ],
    },
    {
      bar: "I'm Lil Yachty on the boat, homie, I'm sailing on the sea,\nI got red braids and a captain's hat, and the whole crew works for me.",
      answers: [
        {
          tier: 'fire',
          text: "Lil Boat? Yachty couldn't name five Biggie songs, and you can't name three of yours. See?\nYour boat's a pool float, homie, and your crew's a rubber ducky and a flea.",
        },
        {
          tier: 'decent',
          text: "You can sail on your boat, and your braids can be free,\nbut I'm sinking your ship, and that's the decree.",
        },
        { tier: 'flop', text: "I get seasick on boats, so I'll stay on land." },
      ],
    },
    {
      bar: "They call me the Mumble King, homie, I don't need to say the words,\nmmm, brrr, skrrt, yeah, and the crowd flies around like birds.",
      answers: [
        {
          tier: 'fire',
          text: "Your verse is 'skrrt' and 'brrr' 'cause you can't afford any words,\nyou ain't the Mumble King, you're a car alarm in a parking lot full of nerds.",
        },
        {
          tier: 'decent',
          text: "You can mumble all day and skip all the words,\nbut I'm saying it clear: you're the king of the nerds.",
        },
        { tier: 'flop', text: "Could you speak up a little? I couldn't understand you." },
      ],
    },
    {
      bar: "I'm the T-Pain of the West Side, homie, auto-tune on every line,\nJay-Z tried to kill it, but I'm keeping it alive. It's mine.",
      answers: [
        {
          tier: 'fire',
          text: 'T-Pain can sing without it, homie, he proved it on Tiny Desk just fine,\nturn your auto-tune off, and the whole block calls the animal control line.',
        },
        {
          tier: 'decent',
          text: "You can auto-tune every single line,\nbut I'm about to beat you, and you'll fall in line.",
        },
        { tier: 'flop', text: 'Auto-tune is a really interesting technology.' },
      ],
    },
    {
      bar: "I dissed Drake, Cole, and Kendrick, homie, I volleyed it like tennis,\nnone of 'em answered back 'cause they're scared. I'm a menace.",
      answers: [
        {
          tier: 'fire',
          text: "Nobody answered 'cause nobody knows you, homie, you ain't a menace, you're Dennis,\nyou served and they let it bounce. That ain't beef, that's you playing solo tennis.",
        },
        {
          tier: 'decent',
          text: "You can call yourself a menace and serve it like tennis,\nbut I'll beat you so bad you'll be sent off to Venice.",
        },
        { tier: 'flop', text: 'I play a lot of sports on the weekends.' },
      ],
    },
    {
      bar: "I'm from the Chi like Common, homie, I'm conscious and I'm smooth,\nI got a poem for every occasion and a hook that'll make you move.",
      answers: [
        {
          tier: 'fire',
          text: "Conscious like Common? You fell asleep during your own verse, so what's there to prove?\nCommon's got an Oscar and a Grammy, and you got a poem about soup. Improve.",
        },
        {
          tier: 'decent',
          text: "You can be smooth like Common and get in the groove,\nbut I'm about to beat you with nothing to prove.",
        },
        { tier: 'flop', text: 'Common is a really good actor too, actually.' },
      ],
    },
    {
      bar: "My music video's got a Lambo, a mansion, and a yacht,\nI rented 'em for an hour, homie, and they towed the Lambo off the lot.",
      answers: [
        {
          tier: 'fire',
          text: "Rented the Lambo for an hour? Homie, that video's the most money you ever got,\nthe mansion's an Airbnb, the yacht's a pontoon, and the chain's a teapot.",
        },
        {
          tier: 'decent',
          text: "You can rent all the cars and the mansion and the yacht,\nbut I'm taking this cypher and everything you've got.",
        },
        { tier: 'flop', text: 'Renting a yacht must be really expensive.' },
      ],
    },
    {
      bar: "My music electrifies 'em, homie, and yours just puts 'em to sleep,\nI'm in the club, and you're in the lullaby section next to Bo Peep.",
      answers: [
        {
          tier: 'fire',
          text: "You quoted Kendrick's 'Euphoria' 'cause you can't write your own. That's cheap,\nthe only thing you electrify is a microwave with a fork in it. Beep beep.",
        },
        {
          tier: 'decent',
          text: "You can talk about electric, but your bars are cheap,\nI'm about to put you in a very deep sleep.",
        },
        { tier: 'flop', text: 'Lullabies are actually really nice music.' },
      ],
    },
    {
      bar: "I'm the Sosa of this cypher, homie, I'm the king of the drill,\nI made Chicago famous, and I'm doing it still.",
      answers: [
        {
          tier: 'fire',
          text: "You're Sosa? Keef went viral at sixteen, homie, and you're forty and over the hill,\nthe only drill you ever ran was a fire drill at the Jewel, and you failed that skill.",
        },
        {
          tier: 'decent',
          text: "You can call yourself Sosa and the king of the drill,\nbut I'll beat you so bad you'll be paying my bill.",
        },
        { tier: 'flop', text: 'Chief Keef is from Chicago, that is true.' },
      ],
    },
    {
      bar: "I'm a Grammy-nominated rapper, homie, I got the nomination letter,\nwell, I nominated myself, but it still counts. I wrote it on a sweater.",
      answers: [
        {
          tier: 'fire',
          text: "You nominated yourself? Kendrick won five for one song, and you got a sweater,\nthe Recording Academy sent a response, homie. It's a cease-and-desist letter.",
        },
        {
          tier: 'decent',
          text: "You can nominate yourself, but I'm still better,\nI'll beat you so bad you'll be writing me a letter.",
        },
        { tier: 'flop', text: 'The Grammys are in February, I think.' },
      ],
    },
    {
      bar: "California love, homie, I'm West Coast in my soul,\nI've never been to California. I've been to Joliet. That's the goal.",
      answers: [
        {
          tier: 'fire',
          text: "West Coast in your soul? You've never left Illinois, homie, you're Midwest on parole,\nthe closest you got to California is a California roll.",
        },
        {
          tier: 'decent',
          text: "You can talk West Coast and say it's in your soul,\nbut I'm about to beat you, and I'm taking control.",
        },
        { tier: 'flop', text: 'California has really nice weather all year.' },
      ],
    },
    {
      bar: "I'm Snoop Dogg smooth, homie, laid back with my mind on my money,\nand my money on my mind, and my mind says you're funny.",
      answers: [
        {
          tier: 'fire',
          text: "Mind on your money? Your money's a gift card with three bucks on it, honey,\nSnoop's laid back 'cause he's rich, you're laid back in a beanbag shaped like a bunny.",
        },
        {
          tier: 'decent',
          text: "You can keep your mind on money, but your bars ain't sunny,\nI'll beat you so bad you'll be stuck like honey.",
        },
        { tier: 'flop', text: 'Snoop Dogg seems like a really chill guy.' },
      ],
    },
    {
      bar: "I dropped a diss track so hot the label had to put it on ice,\nit's twelve minutes long, homie, and I said your name twice.",
      answers: [
        {
          tier: 'fire',
          text: "Twelve minutes, and my name came up twice? That's a podcast, not a diss. Nice,\nthe label put it on ice 'cause it's frozen garbage. Even the freezer paid a price.",
        },
        {
          tier: 'decent',
          text: "You can drop your long diss and give all your advice,\nbut I'll beat you so bad you'll be stuck in the ice.",
        },
        { tier: 'flop', text: 'Twelve minutes is pretty long for a song.' },
      ],
    },
    {
      bar: "I'm on the Rolling Loud lineup, homie, I'm in the biggest font,\nwell, size four, at the bottom, but I'm there. That's what I want.",
      answers: [
        {
          tier: 'fire',
          text: "Font size four at Rolling Loud? The porta-potty sponsor's got a bigger font,\nyou're not on the lineup, you're in the fine print. That's nothing to flaunt.",
        },
        {
          tier: 'decent',
          text: "You can be on the lineup in whatever font,\nbut I'll beat you so bad you'll be hiding in Vermont.",
        },
        { tier: 'flop', text: "Music festivals are really fun, but they're expensive." },
      ],
    },
    {
      bar: "I'm a Certified Lover Boy, homie, I'm Drake with the hearts and the pain,\nI write a song about every ex, and I sing it in the rain.",
      answers: [
        {
          tier: 'fire',
          text: "Certified Lover Boy? Your album cover's a bunch of emojis, homie, and it's lame,\nyou write songs about your exes 'cause your exes are the only fans who came.",
        },
        {
          tier: 'decent',
          text: "You can sing about your ex and sing it in the rain,\nbut I'm about to beat you and leave you in pain.",
        },
        { tier: 'flop', text: 'Writing songs about your feelings is really healthy.' },
      ],
    },
    {
      bar: "I'm Big Boi and André in one, homie, I'm Outkast in the flesh,\nI'm 'Hey Ya' and 'Ms. Jackson,' homie, and I'm always fresh.",
      answers: [
        {
          tier: 'fire',
          text: "You're Outkast? André plays the flute now, homie, and he's still more fresh,\nyou're 'Ms. Jackson': I'm sorry, but your verse is a screen door made of mesh.",
        },
        {
          tier: 'decent',
          text: "You can be Outkast, but I'm Outkast in the flesh,\nand I'll beat you so bad you'll be tangled in mesh.",
        },
        { tier: 'flop', text: "Outkast's 'Hey Ya' is a great wedding song." },
      ],
    },
    {
      bar: "I'm the Joe Budden of this cypher, homie, I'll quit my job on the air,\nthen I'll start a podcast about you, and you'll be famous, I swear.",
      answers: [
        {
          tier: 'fire',
          text: "Then you'll talk about me for three hours a week, and nobody will care,\nJoe Budden had a career before the podcast, homie. You've got a mic and a chair.",
        },
        {
          tier: 'decent',
          text: "You can start your podcast and talk on the air,\nbut I'm about to beat you, so get out of my chair.",
        },
        { tier: 'flop', text: 'Podcasts are really popular now, I listen to a few.' },
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
    {
      bar: "I put my thing down, flip it, and reverse it, Missy taught me true,\nthat's how my master does paradise and fire, and he'll flip it on you.",
      answers: [
        {
          tier: 'fire',
          text: "Flip it and reverse it? Your master flipped your brain too,\nyou read your own jokes backwards: 'Ha ha' comes out 'Ah ah.' Boo.",
        },
        {
          tier: 'decent',
          text: "You can flip it and reverse it, but I'll see right through,\nI'm not falling for your tricks, so the show is through.",
        },
        { tier: 'flop', text: 'Missy Elliott is a really talented producer.' },
      ],
    },
    {
      bar: 'Every beef in rap was me: Drake and Kendrick, Jay and Nas, Em and Kelly,\nI whispered in their ears at night, then sat back with popcorn and jelly.',
      answers: [
        {
          tier: 'fire',
          text: "You started every beef? Then they got the Grammys, and you got a stomach full of jelly,\nyou ain't a mastermind, homie, you're the guy who refills the ketchup at the deli.",
        },
        {
          tier: 'decent',
          text: "You can whisper in ears and eat all your jelly,\nbut I'll beat you so bad you'll be holding your belly.",
        },
        { tier: 'flop', text: 'Popcorn and jelly sounds like a weird snack.' },
      ],
    },
    {
      bar: "I'm a Juggalo, homie, the Insane Clown Posse is my church,\nI got a Faygo in each hand, and I'm here to end your search.",
      answers: [
        {
          tier: 'fire',
          text: "You're a Juggalo? ICP couldn't figure out magnets, and you can't spell 'search,'\nyour Faygo's flat, your face paint's running, and your master left you in the lurch.",
        },
        {
          tier: 'decent',
          text: "You can sip your Faygo up high on your perch,\nbut I'll knock you so hard you'll fly into a birch.",
        },
        { tier: 'flop', text: 'Faygo is a soda from Detroit, I think.' },
      ],
    },
    {
      bar: "Fyre Festival promised paradise, and they gave 'em a tent,\nthat's my master's whole business plan, homie, and you paid the rent.",
      answers: [
        {
          tier: 'fire',
          text: "Your master's paradise is Fyre Fest? A soggy cheese sandwich in a wet tent?\nEven Ja Rule wants a refund, and he's the one who planned the event.",
        },
        {
          tier: 'decent',
          text: "You can sell me your paradise and sell me your tent,\nbut I'm not buying nothing, so that's money unspent.",
        },
        { tier: 'flop', text: "I've heard Fyre Festival was a disaster, honestly." },
      ],
    },
    {
      bar: "They say Jay-Z's in the Illuminati, homie, but my master's the CEO,\nhe's got one eye on the pyramid, and the other one... well, no.",
      answers: [
        {
          tier: 'fire',
          text: "Your master runs the Illuminati? Then it's a pyramid scheme, and you're the bottom row,\nyou're not in the secret society, homie, you sell their T-shirts after the show.",
        },
        {
          tier: 'decent',
          text: "Your master can run any secret show,\nbut I'm about to beat you, and you'll be the first to go.",
        },
        { tier: 'flop', text: 'The pyramid on the dollar bill is actually pretty interesting.' },
      ],
    },
    {
      bar: "Ha! Hee! Hoo! Guess who's back, back again,\nthe end of the world is back, homie, so go and tell a friend.",
      answers: [
        {
          tier: 'fire',
          text: "Guess who's back? You, again, like a rash that'll never end,\nEm came back with a classic, and you came back with a balloon dog that won't bend.",
        },
        {
          tier: 'decent',
          text: "You can come back again with the world at its end,\nbut I'll beat you so bad that your hat bells will bend.",
        },
        { tier: 'flop', text: "I don't really have a lot of people to tell." },
      ],
    },
    {
      bar: "This is the apocalypse, homie, don't catch you slippin' now,\nChildish Gambino danced right through it, and I'll show you how.",
      answers: [
        {
          tier: 'fire',
          text: "Gambino danced through 'This Is America,' and you trip on your own shoes somehow,\nyour master's only got one eye, and he still saw you fall. Wow.",
        },
        {
          tier: 'decent',
          text: "You can dance through the end of the world right now,\nbut I'm about to beat you, and that's my vow.",
        },
        { tier: 'flop', text: 'I think that music video was about something else.' },
      ],
    },
    {
      bar: "I play the flute like Future on 'Mask Off,' and the world starts to end,\nI play a little tune, and the sky turns red, and the trees all bend.",
      answers: [
        {
          tier: 'fire',
          text: "'Mask Off' on the flute? You play it like a third-grade recorder, my friend,\nAndré dropped a whole flute album, and you dropped a kazoo in the trash. The end.",
        },
        {
          tier: 'decent',
          text: "You can play on your flute till the world's at an end,\nbut I'll beat you so bad that you'll need a new friend.",
        },
        { tier: 'flop', text: 'Flutes are really hard to learn, you need good breath control.' },
      ],
    },
    {
      bar: "Milli Vanilli taught me to lie, homie, I lip-sync every word,\nthat's not even my voice right now. It's my master's. He's a bird.",
      answers: [
        {
          tier: 'fire',
          text: "You lip-sync like Milli Vanilli? Then give the crowd their money back. That's absurd,\nthey returned a Grammy, so return those hat bells. Loudest thing I've ever heard.",
        },
        {
          tier: 'decent',
          text: "You can lip-sync your verse and fake every word,\nbut I'll beat you so bad that it's gonna be absurd.",
        },
        { tier: 'flop', text: 'Lip-syncing is really common at concerts, honestly.' },
      ],
    },
    {
      bar: "Don't believe the hype, Public Enemy said, so don't believe my master,\nhe says it's paradise, homie, but it's fire, and it's a disaster.",
      answers: [
        {
          tier: 'fire',
          text: "Don't believe the hype? Homie, nobody believes you or your one-eyed master,\nyou're the hype man for the apocalypse, and even Flavor Flav would run off faster.",
        },
        {
          tier: 'decent',
          text: "You can tell me your lies and your fire and your master,\nbut I'm about to beat you, and I'll do it faster.",
        },
        { tier: 'flop', text: 'Public Enemy was a really important group.' },
      ],
    },
    {
      bar: "I'm a hologram, homie, like the one of Pac at Coachella,\nyou can't hit me 'cause I'm not even here. I'm a light-up umbrella.",
      answers: [
        {
          tier: 'fire',
          text: "A hologram? Then you're light with no substance, like your jokes, fella,\nthe Pac hologram had more bars than you, and it ran on a laptop and Nutella.",
        },
        {
          tier: 'decent',
          text: "You can be a hologram or a light-up umbrella,\nbut I'm about to unplug you, so goodnight, fella.",
        },
        { tier: 'flop', text: 'Holograms are really cool technology.' },
      ],
    },
    {
      bar: "My life got flipped, turned upside down, like the Fresh Prince said,\nnow paradise is fire and fire is paradise, and I'm standing on my head.",
      answers: [
        {
          tier: 'fire',
          text: "Your life got flipped? Will Smith moved to Bel-Air, and you moved to a pit full of lead,\nyou're standing on your head 'cause your feet ran away from you. Even your shoes fled.",
        },
        {
          tier: 'decent',
          text: "You can flip upside down and stand on your head,\nbut I'm about to knock you right over instead.",
        },
        { tier: 'flop', text: 'Standing upside down makes all the blood rush up, you know.' },
      ],
    },
    {
      bar: "Busta Rhymes made an album called Extinction Level Event,\nand I'm the opening act, homie, so you know where your money went.",
      answers: [
        {
          tier: 'fire',
          text: "Busta made an album about the end, and you're the guy at the merch tent,\nselling T-shirts for an apocalypse nobody asked for. Not a single cent.",
        },
        {
          tier: 'decent',
          text: "You can open the show, but I'm the main event,\nand I'll beat you so bad you'll be packing your tent.",
        },
        { tier: 'flop', text: "I don't think I've heard that album, sorry." },
      ],
    },
    {
      bar: "Kanye said he's a god, and my master says it too,\nbut my master's only got one eye, so he's half a god. It's true.",
      answers: [
        {
          tier: 'fire',
          text: "Half a god? Then he's a god on clearance, homie, fifty percent off and overdue,\nyou're the jester of a discount bin, and even Ye won't sell him a shoe.",
        },
        {
          tier: 'decent',
          text: "Your master can claim he's a god, it's nothing new,\nbut I'm still gonna beat you and break you in two.",
        },
        { tier: 'flop', text: "I don't think anyone should call themselves a god, honestly." },
      ],
    },
    {
      bar: '6ix9ine stole my look, homie, the rainbow hair, the teeth, the grin,\nand then he snitched on everybody. Ha! I taught him that, my twin.',
      answers: [
        {
          tier: 'fire',
          text: '6ix9ine stole your look? Then he stole a clown with a cardboard grin,\nhe snitched on his whole crew, and your hat bells snitch on you every time you spin.',
        },
        {
          tier: 'decent',
          text: "You can talk about your rainbow hair and your grin,\nbut I'm about to beat you, and I'm going to win.",
        },
        { tier: 'flop', text: 'Rainbow hair is actually really hard to maintain.' },
      ],
    },
    {
      bar: "Coolio said we're living in a gangsta's paradise, and he was right,\nexcept the paradise is fire, homie, and the fire's coming tonight.",
      answers: [
        {
          tier: 'fire',
          text: "Gangsta's Paradise? You're a jester's paradise: a balloon, a horn, and a kite,\nCoolio walked through the valley, and you got lost in a bounce house overnight.",
        },
        {
          tier: 'decent',
          text: "You can call it a paradise, I'll call it a fight,\nand I'll beat you so bad that you'll fade out of sight.",
        },
        { tier: 'flop', text: 'That song was in a movie with Michelle Pfeiffer, I think.' },
      ],
    },
    {
      bar: "I'm the opening act at the end of the world, like Lupe said: the show goes on,\nthe world ends tomorrow, homie, so you'd better be gone by dawn.",
      answers: [
        {
          tier: 'fire',
          text: "The show goes on? Lupe made an anthem, and you made a crowd fall asleep on the lawn,\nyou're the opening act that makes people hope the world ends early. Yawn.",
        },
        {
          tier: 'decent',
          text: "You can say the show goes on, but your show is gone,\nI'm closing your show, and I'm turning the lights on.",
        },
        { tier: 'flop', text: 'I hope the world does not end tomorrow, I have plans.' },
      ],
    },
    {
      bar: "Can't touch this, homie, I wear Hammer pants for the end of days,\nthey're so baggy that the apocalypse fits in 'em, and it stays.",
      answers: [
        {
          tier: 'fire',
          text: "Hammer pants at the apocalypse? Hammer went broke in those, homie, it was a phase,\nyou can't touch this 'cause nobody wants to. You smell like old mayonnaise.",
        },
        {
          tier: 'decent',
          text: "You can wear your Hammer pants for the end of days,\nbut I'll beat you so bad that you'll fall in a daze.",
        },
        { tier: 'flop', text: "Hammer pants are actually really comfortable, I've heard." },
      ],
    },
    {
      bar: 'I wear my clothes backwards like Kris Kross, homie, I do it all reversed,\nI say goodbye when I mean hello, and the best when I mean the worst.',
      answers: [
        {
          tier: 'fire',
          text: "Kris Kross wore it backwards at twelve, homie, and they were well-rehearsed,\nyou're forty with your pants on backwards, and your jokes jump off a cliff headfirst.",
        },
        {
          tier: 'decent',
          text: "You can wear it all backwards, but I'm still the first,\nI'll beat you so bad that your balloons are gonna burst.",
        },
        { tier: 'flop', text: 'Wearing clothes backwards seems really uncomfortable.' },
      ],
    },
    {
      bar: "ODB took a limo to pick up food stamps, homie, now that's style,\nmy master's coming in a limo too, to pick up your soul. Smile!",
      answers: [
        {
          tier: 'fire',
          text: "ODB had style, and your master's limo is a golf cart doing a mile,\nhe's coming for my soul? Then he'd better take a number. The line's a while.",
        },
        {
          tier: 'decent',
          text: "Your master can come in his limo and his style,\nbut I'll knock you so far you'll be floating down the Nile.",
        },
        { tier: 'flop', text: 'Food stamps help a lot of people.' },
      ],
    },
    {
      bar: "I'm the Kid Cudi of the end of days, homie, I'm the man on the moon,\nand when the world ends, I'll be humming. Mmm-hmm. A little tune.",
      answers: [
        {
          tier: 'fire',
          text: "The man on the moon? You're a buffoon with a balloon, and the moon's a cartoon,\nCudi hums and the crowd sings, you hum and the crowd leaves. They'll be back in June.",
        },
        {
          tier: 'decent',
          text: "You can hum all you want with your little balloon,\nbut I'm about to pop you, and I'll do it real soon.",
        },
        { tier: 'flop', text: "Kid Cudi's humming is really calming, actually." },
      ],
    },
    {
      bar: "Chance the Rapper had a Big Day, and my master's got one too,\nthe end of the world's on a Tuesday, homie, and the guest list is you.",
      answers: [
        {
          tier: 'fire',
          text: "Your master's Big Day is like Chance's? Then the fans are gonna skip it too,\nChance had Coloring Book first, and your master's got a crayon and a one-eyed view.",
        },
        {
          tier: 'decent',
          text: "Your master can plan a Big Day, but this fight is through,\nI'm about to beat you, and I'm coming for your crew.",
        },
        { tier: 'flop', text: 'Tuesday is a weird day for the end of the world.' },
      ],
    },
    {
      bar: "Drake gave away money in 'God's Plan,' and my master gives it away too,\nbut it's Monopoly money, homie, and it melts when it touches you.",
      answers: [
        {
          tier: 'fire',
          text: "Monopoly money? Drake gave away a million, and your master gave away a shoe,\nhis only card is 'Go to Jail,' and he's been stuck since Free Parking was new.",
        },
        {
          tier: 'decent',
          text: "You can give me your money, I know that it's not true,\nso I'm keeping my clout, and I'm beating you black and blue.",
        },
        { tier: 'flop', text: 'Monopoly takes way too long to play.' },
      ],
    },
    {
      bar: "The end is near, homie, it's a Kendrick surprise drop,\nno warning, no promo, a midnight release, and then the world stops.",
      answers: [
        {
          tier: 'fire',
          text: "A surprise drop like Kendrick? Kendrick drops classics, homie, and you drop your props,\nyour master's apocalypse leaked a thousand years early, and it still flops.",
        },
        {
          tier: 'decent',
          text: "You can drop your surprise and give it all the props,\nbut I'll beat you so bad that your whole show flops.",
        },
        { tier: 'flop', text: 'I love when artists drop albums at midnight.' },
      ],
    },
    {
      bar: "Every rapper's album gets delayed 'cause of me, homie, I'm the delay,\nPlayboi Carti's still waiting, and so is Detox. Ha! Maybe someday.",
      answers: [
        {
          tier: 'fire',
          text: "You're the reason albums get delayed? Your punchline's delayed too, okay,\nthe crowd's been waiting since your intro. Carti's album dropped before your joke. Hooray.",
        },
        {
          tier: 'decent',
          text: "You can push back the albums, but you can't push back today,\nI'm about to beat you, and you can't get away.",
        },
        { tier: 'flop', text: 'Waiting for albums is really frustrating, I agree.' },
      ],
    },
    {
      bar: "I juggle accents like Drake, homie, Jamaican, British, Texan, and French,\none minute I'm from Toronto, the next I'm on a Paris park bench.",
      answers: [
        {
          tier: 'fire',
          text: "You juggle accents like Drake? Then you're fake in every language, with a stench,\nDrake said 'ting' in Toronto, and you said 'cheerio' to a pigeon. It wasn't even French.",
        },
        {
          tier: 'decent',
          text: "You can switch to Jamaican or British or French,\nbut I'll beat you so bad you'll be stuck in a trench.",
        },
        { tier: 'flop', text: 'Learning other languages is really good for your brain.' },
      ],
    },
    {
      bar: "My master's got one eye, so he only sees one side of the beef,\nhe saw Drake win and Kendrick lose, homie, and he's in disbelief.",
      answers: [
        {
          tier: 'fire',
          text: "Your master saw Drake win? Then his one eye is broken. Good grief,\neven Drake knows who won, homie. He's the one who sued for relief.",
        },
        {
          tier: 'decent',
          text: "Your master sees one side, and that's his whole belief,\nbut I'm about to beat you and bring him some grief.",
        },
        { tier: 'flop', text: 'Seeing with one eye must make depth perception hard.' },
      ],
    },
    {
      bar: "Mumble rap was my invention, homie, I made it to end the world slow,\nnobody can understand the prophecy if it's all 'skrrt' and 'yo.'",
      answers: [
        {
          tier: 'fire',
          text: "You invented mumble rap? Then the apocalypse already came, and it was slow,\nyour master's prophecy is just 'skrrt, brrr, yeah,' 'cause he can't spell. Bro.",
        },
        {
          tier: 'decent',
          text: "You can mumble your prophecy and end the world slow,\nbut I'll speak loud and clear when I tell you to go.",
        },
        { tier: 'flop', text: 'I can usually understand mumble rap if I read the lyrics.' },
      ],
    },
    {
      bar: "My hat's bigger than Pharrell's at the Grammys, homie, and it jingles too,\nArby's asked for it back, and I said no, and then I threw it at you.",
      answers: [
        {
          tier: 'fire',
          text: "Bigger than Pharrell's? Then give it back to Arby's, they need it for the queue,\nPharrell's hat sold for forty grand, and yours wouldn't sell at a yard sale for two.",
        },
        {
          tier: 'decent',
          text: "You can throw your big hat, but it won't make it through,\nI'm about to knock off your bells and your hat, too.",
        },
        { tier: 'flop', text: "Arby's has pretty good curly fries." },
      ],
    },
    {
      bar: "Ha! Hee! Hoo! I'm the reason Drake lost, homie, I gave him the advice,\nI told him, 'Diss Kendrick, he won't respond.' Ha! Then I said it twice.",
      answers: [
        {
          tier: 'fire',
          text: "You told Drake to diss Kendrick? That's the worst advice since 'just roll the dice,'\nyour master's got one eye, and he still saw that coming. You paid the price.",
        },
        {
          tier: 'decent',
          text: "You can give out bad advice, and you can roll the dice,\nbut I'll beat you so bad that you'll pay the price.",
        },
        { tier: 'flop', text: 'Giving people advice is hard sometimes, honestly.' },
      ],
    },
    {
      bar: "My master's coming to the Super Bowl, homie, he's the halftime show,\nhe'll do it with one eye, one mic, and one... nope, that's it. Let's go.",
      answers: [
        {
          tier: 'fire',
          text: 'Your master at the halftime show? Kendrick brought SZA and Serena, and he stole the show,\nyour master brings one eye and you, and the whole crowd goes to the bathroom. Whoa.',
        },
        {
          tier: 'decent',
          text: "Your master can take the halftime and put on a show,\nbut I'll beat you so bad you'll be stuck in the snow.",
        },
        { tier: 'flop', text: 'The Super Bowl halftime show is my favorite part.' },
      ],
    },
    {
      bar: "My master's got the world in his hand, like Nas said: if I ruled the world,\nhe'd make it all fire and call it paradise, with his flags unfurled.",
      answers: [
        {
          tier: 'fire',
          text: "Nas said it with love, and your master says it with a lip that's curled,\nhe'd rule with one eye and a fool, and the fool's the first thing that got hurled.",
        },
        {
          tier: 'decent',
          text: "Your master can rule and can flip the whole world,\nbut I'll beat you so bad that your hat will get swirled.",
        },
        { tier: 'flop', text: "If I ruled the world, I'd make every day a Saturday." },
      ],
    },
    {
      bar: "My master's ghostwriting for every rapper, homie, his pen is on fire,\nhe wrote every hit you know, and every one of 'em's a liar.",
      answers: [
        {
          tier: 'fire',
          text: "Your master's a ghostwriter? Then he's why every song's got a lie in the choir,\nhe wrote every hit but yours, 'cause even he won't sign his name to a tire fire.",
        },
        {
          tier: 'decent',
          text: "Your master can write with a pen made of fire,\nbut I'll beat you so bad you'll be flat as a tire.",
        },
        { tier: 'flop', text: 'Writing songs for other people is a real job.' },
      ],
    },
    {
      bar: "Ha! Hee! I lie like a Drake fan saying that he won,\nthe Super Bowl was fake, the Grammys were fake, and the moon's the sun.",
      answers: [
        {
          tier: 'fire',
          text: "You lie like a Drake fan? Even Drake stopped lying once the summer was done,\nthe Super Bowl was real, and so is this: you're a jester, and you already lost. Run.",
        },
        {
          tier: 'decent',
          text: "You can lie all you want, but it won't change who won,\nI'm about to beat you, and the fight's barely begun.",
        },
        { tier: 'flop', text: "The moon reflects light, it doesn't make its own." },
      ],
    },
    {
      bar: "I scream like Kendrick on 'TV Off,' homie, MUSTAAAARD!\nexcept I'm screaming 'FIIIIRE!' 'cause the world is getting charred.",
      answers: [
        {
          tier: 'fire',
          text: "Kendrick yelled 'Mustard,' and the whole beat went hard,\nyou yell 'Fire,' and the alarm goes off, and they kick you out of the yard.",
        },
        {
          tier: 'decent',
          text: "You can scream about fire, but I'm still on guard,\nand I'm about to beat you and hit you real hard.",
        },
        { tier: 'flop', text: 'Screaming like that is really bad for your voice.' },
      ],
    },
    {
      bar: "My master gave Drake his owl, homie, the OVO bird is ours,\nit's got two eyes, so he's jealous. He stares at it for hours.",
      answers: [
        {
          tier: 'fire',
          text: "The owl's got two eyes, so your master's jealous? Homie, that's some sad powers,\nhe's a one-eyed villain who loses staring contests to birds and flowers.",
        },
        {
          tier: 'decent',
          text: "Your master can stare at that owl for hours,\nbut I'm about to beat you and take all his powers.",
        },
        { tier: 'flop', text: 'Owls can turn their heads almost all the way around.' },
      ],
    },
    {
      bar: "I tell the future, homie, like Future, but my future's always bleak,\nI see you losing this cypher, and I see it happening this week.",
      answers: [
        {
          tier: 'fire',
          text: "You tell the future like Future? Then you saw your own act's a freak,\nFuture's got hits, and your future's a balloon animal with a leak.",
        },
        {
          tier: 'decent',
          text: "You can tell me the future, but your future is weak,\nI'll beat you so bad you won't even speak.",
        },
        { tier: 'flop', text: 'Nobody can really tell the future, can they?' },
      ],
    },
    {
      bar: "My master's got a crown like the King of Chicago, but his is on fire,\nand when Durkio sees it, homie, he'll wanna be a jester for hire.",
      answers: [
        {
          tier: 'fire',
          text: "Your master's crown is on fire? That's not a crown, homie, that's a burning tire,\nDurkio's waiting at the end of the block, and he won't even let you sing in his choir.",
        },
        {
          tier: 'decent',
          text: "Your master can wear any crown that's on fire,\nbut I'll beat you so bad you'll be stuck on a wire.",
        },
        { tier: 'flop', text: 'Crowns on fire sound like a safety hazard.' },
      ],
    },
    {
      bar: "I'm a magician like Wiz Khalifa, homie: black and yellow, red and gold,\nI pull a rabbit out of my hat, and the rabbit's on fire. Behold!",
      answers: [
        {
          tier: 'fire',
          text: "A flaming rabbit out of your hat? That ain't magic, homie, that's a crime, I'm told,\nWiz made 'Black and Yellow,' and I'm about to make you black and blue. Fold.",
        },
        {
          tier: 'decent',
          text: "You can pull out a rabbit that's on fire and bold,\nbut I'll beat you so bad that you'll be out in the cold.",
        },
        { tier: 'flop', text: "Please don't set rabbits on fire, they're living things." },
      ],
    },
    {
      bar: "Every rapper's got a hype man, homie, and my master's got me,\nI yell 'Ha!' and 'Hee!' and 'Hoo!' and that's my whole degree.",
      answers: [
        {
          tier: 'fire',
          text: "You're the hype man? Flav had a clock, homie, and you've got a bell and a flea,\nyou yell 'Ha,' 'Hee,' and 'Hoo' 'cause you can only count to three.",
        },
        {
          tier: 'decent',
          text: "You can hype up your master and yell out with glee,\nbut I'll beat you so bad you'll be stung by a bee.",
        },
        { tier: 'flop', text: 'Being a hype man is actually a real job.' },
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
    {
      bar: 'Cardi threw a shoe at Nicki at Fashion Week, darling, and she missed,\n(hmmmm) I never miss, sweetie, and my heels are on the list.',
      answers: [
        {
          tier: 'fire',
          text: "You'd throw a heel like Cardi? She missed Nicki, and you'd miss too, with that wrist,\nyou'd throw a Louboutin, and it'd come back to you, 'cause even your shoes resist.",
        },
        {
          tier: 'decent',
          text: "You can throw all your heels, but I'm still on the list,\nI'll beat you so bad you'll be shaking your fist.",
        },
        { tier: 'flop', text: 'Throwing shoes at people is really not okay.' },
      ],
    },
    {
      bar: "Cam'ron wore a pink mink to Fashion Week, honey, and I wear it better,\n(hmmmm) I'm pink from my boots to my hat to my sweater.",
      answers: [
        {
          tier: 'fire',
          text: "Cam'ron wore a pink mink in '02, and you're still copying the trendsetter,\nyou're not pink, Rodney, you're Pepto-Bismol with a vendetta.",
        },
        {
          tier: 'decent',
          text: "You can dress head to toe in pink, but I'm still doing better,\nI'll beat you so bad you'll be lost like an Irish setter.",
        },
        { tier: 'flop', text: 'Pink is a really nice color.' },
      ],
    },
    {
      bar: "Lil Kim's the Queen Bee, darling, but this Queen's got a sting,\n(hmmmm) I float like a butterfly, and I slay like a king.",
      answers: [
        {
          tier: 'fire',
          text: "Lil Kim's the Queen Bee, and you're a pink fly in a mimosa with a broken wing,\nyou don't sting, Rodney, you buzz around brunch, and nobody tips you a thing.",
        },
        {
          tier: 'decent',
          text: "You can float like a butterfly and say you've got a sting,\nbut I'll knock off your crown, and you'll lose that ring.",
        },
        { tier: 'flop', text: 'Bees are really important for the environment.' },
      ],
    },
    {
      bar: "Ice Spice said you a munch, darling, and honey, she was right,\n(hmmmm) you're a munch, a crunch, a little brunch bite.",
      answers: [
        {
          tier: 'fire',
          text: "Calling me a munch? Rodney, you're the one who munched the whole buffet last night,\nIce Spice is a princess, and you're a pink Peep left in the sun. Not a pretty sight.",
        },
        {
          tier: 'decent',
          text: "You can call me a munch, but I'm still gonna fight,\nand I'll take you down, Rodney, and I'll do it tonight.",
        },
        { tier: 'flop', text: 'Ice Spice has really pretty hair, I agree.' },
      ],
    },
    {
      bar: "Lil Nas X rode a horse to the top, and I'm riding to the top in heels,\n(hmmmm) he's my best friend, darling, so you know how that feels.",
      answers: [
        {
          tier: 'fire',
          text: "Lil Nas X is your best friend? He blocked you, Rodney, he's got better deals,\nhe rode a horse to number one, you rode a scooter in stilettos and lost both heels.",
        },
        {
          tier: 'decent',
          text: "You can ride to the top in your pink high heels,\nbut I'm about to knock you right off of your wheels.",
        },
        { tier: 'flop', text: "'Old Town Road' was on the radio for so long." },
      ],
    },
    {
      bar: "Tyler wore a blonde wig on IGOR, sweetie, and I wear one every day,\n(hmmmm) his was a bob, and mine's a bob, darling, but mine slays.",
      answers: [
        {
          tier: 'fire',
          text: "Tyler wore a wig for IGOR, honey, and won a Grammy for the craze,\nyou wear a wig 'cause your hairline left you. It's been gone for days.",
        },
        {
          tier: 'decent',
          text: "You can wear your blonde wig and strut through the haze,\nbut I'll beat you so bad you'll be stuck in a daze.",
        },
        { tier: 'flop', text: 'Blonde wigs are really popular right now.' },
      ],
    },
    {
      bar: "Drake paints his nails now, darling, and I'm the one who taught him how,\n(hmmmm) he came to my salon, and I said, 'Sit. Stay. Now.'",
      answers: [
        {
          tier: 'fire',
          text: "You taught Drake nails? Then you're the reason he lost, Rodney, and here's how:\nhe was too busy drying his polish to write back to Kendrick. Wow.",
        },
        {
          tier: 'decent',
          text: "You can paint all the nails on the planet somehow,\nbut I'm about to beat you, and that's a vow.",
        },
        { tier: 'flop', text: 'Painting your nails is very relaxing.' },
      ],
    },
    {
      bar: "Big Freedia said release your wiggle, darling, and I released mine on a man,\n(hmmmm) he's still shaking, sweetie. Bounce music. That's the plan.",
      answers: [
        {
          tier: 'fire',
          text: "Big Freedia's the Queen of Bounce, honey, and you're the queen of the frying pan,\nyou released your wiggle, and the man left town in a minivan.",
        },
        {
          tier: 'decent',
          text: "You can release all your wiggle on any old man,\nbut I'm about to beat you as fast as I can.",
        },
        { tier: 'flop', text: 'Bounce music is from New Orleans, I believe.' },
      ],
    },
    {
      bar: 'A$AP Rocky said Fashion Killa, honey, and he was talking about me,\n(hmmmm) I killed a whole runway in Milan, darling, and I did it for free.',
      answers: [
        {
          tier: 'fire',
          text: 'Fashion Killa? Rocky was talking about Rihanna, Rodney, not a pink Christmas tree,\nyou killed a runway in Milan? You tripped on it, and they charged you a fee.',
        },
        {
          tier: 'decent',
          text: "You can kill on the runway, but you can't kill me,\nI'm about to beat you, and the crowd will agree.",
        },
        { tier: 'flop', text: 'Milan is a really beautiful city, I hear.' },
      ],
    },
    {
      bar: "Cardi said these is red bottoms, these is bloody shoes,\n(hmmmm) mine are pink bottoms, darling, and I don't lose.",
      answers: [
        {
          tier: 'fire',
          text: "Pink bottoms? Rodney, Cardi's shoes cost three grand, and yours are Payless with a bruise,\nyou painted the soles with nail polish, and it's peeling. That's the news.",
        },
        {
          tier: 'decent',
          text: "You can wear any bottoms and any old shoes,\nbut I'm about to beat you and give you the blues.",
        },
        { tier: 'flop', text: "Red bottom heels are really expensive, I've heard." },
      ],
    },
    {
      bar: "Nicki's got the Barbz, honey, and I've got the Rodz,\n(hmmmm) and they'll come for you, darling, they're the meanest of the squads.",
      answers: [
        {
          tier: 'fire',
          text: "The Rodz? Your fanbase is your mama, your cousin, and two frauds,\nthe Barbz can shut down the internet, and your fans shut down a Denny's. Good odds.",
        },
        {
          tier: 'decent',
          text: "You can call up your Rodz and send all of your squads,\nbut I'm about to beat you, and I'm beating the odds.",
        },
        { tier: 'flop', text: 'Fan names are a really fun thing, honestly.' },
      ],
    },
    {
      bar: "Go shorty, it's your birthday, like 50 said in the club,\n(hmmmm) but I'm the one getting gifts, darling, and you're getting a snub.",
      answers: [
        {
          tier: 'fire',
          text: "It's your birthday? Honey, you've been thirty-nine for twelve years in that club,\nand your gifts are a coupon for Botox and a pink loofah and a scrub.",
        },
        {
          tier: 'decent',
          text: "You can party all night in the birthday club,\nbut I'll beat you so bad you'll be stuck in the tub.",
        },
        { tier: 'flop', text: "Happy birthday, if it's actually your birthday." },
      ],
    },
    {
      bar: "Kiki, do you love me? Drake asked, and the answer's a no,\n(hmmmm) I'm in my feelings, darling, but you're not in my show.",
      answers: [
        {
          tier: 'fire',
          text: "Kiki don't love you, honey, and your mirror said the same, so,\nyou're in your feelings 'cause nobody else wants in. Even your shadow said no.",
        },
        {
          tier: 'decent',
          text: "You can sing like Drake and be in your feelings, I know,\nbut I'm about to beat you, so it's time to go.",
        },
        { tier: 'flop', text: 'That dance challenge was really fun.' },
      ],
    },
    {
      bar: "Young Thug wore a dress on a cover, darling, but I wore it first,\n(hmmmm) I wore a gown to the Jewel, honey, and I've been quenching the thirst.",
      answers: [
        {
          tier: 'fire',
          text: "You wore a gown to the Jewel? That's the bravest thing you've done, and also the worst,\nThugger rocked a dress on Jeffery, and you rocked an Olive Garden tablecloth. Cursed.",
        },
        {
          tier: 'decent',
          text: "You can wear any gown and say you wore it first,\nbut I'm about to beat you, and you're gonna get the worst.",
        },
        { tier: 'flop', text: 'Dresses can be really comfortable, actually.' },
      ],
    },
    {
      bar: "Kanye's the Louis Vuitton Don, darling, and I'm the Louis Vuitton Queen,\n(hmmmm) I got Louis on my luggage, on my lashes, and my spleen.",
      answers: [
        {
          tier: 'fire',
          text: "The Louis Vuitton Queen? Rodney, your Louis is from a Canal Street machine,\nthe monogram says 'Louie V. Tonn,' and the zipper's turning green.",
        },
        {
          tier: 'decent',
          text: "You can rock Louis on your lashes and spleen,\nbut I'm about to beat you and wipe you clean.",
        },
        { tier: 'flop', text: 'Louis Vuitton bags are really expensive, though.' },
      ],
    },
    {
      bar: "Saucy Santana walks like it's Fashion Week, darling, and so do I,\n(hmmmm) I walk to the mailbox like it's a runway. Bye.",
      answers: [
        {
          tier: 'fire',
          text: 'You walk to the mailbox like a runway? Rodney, the mailman runs, and I see why,\nSaucy Santana serves looks, and you serve a pink robe and a Cheeto-dusted thigh.',
        },
        {
          tier: 'decent',
          text: "You can walk like a runway, but you can't make me cry,\nI'm about to beat you, and you won't even try.",
        },
        { tier: 'flop', text: 'Walking is really good exercise.' },
      ],
    },
    {
      bar: "Queen Latifah said ladies first, darling, so this Queen goes before you,\n(hmmmm) and then I go again, and again, honey, and then I'm through.",
      answers: [
        {
          tier: 'fire',
          text: "Queen Latifah's the original Queen, honey, and you're a remix that's overdue,\nshe got a Grammy and a sitcom, and you got a brunch tab and a pink shoe.",
        },
        {
          tier: 'decent',
          text: "You can go first or second, but I'm still coming through,\nI'm about to beat you and leave you a bruise or two.",
        },
        { tier: 'flop', text: 'Queen Latifah is great in movies, honestly.' },
      ],
    },
    {
      bar: "Remy Ma dropped ShETHER on Nicki, honey, and I'll drop one on you,\n(hmmmm) it's called HEther, darling, and it's pink, and it's true.",
      answers: [
        {
          tier: 'fire',
          text: "Remy dropped seven minutes of heat, and you'd drop seven seconds of 'ew,'\nyour HEther's a pink Post-it that says 'you're ugly,' and it's spelled wrong too.",
        },
        {
          tier: 'decent',
          text: "You can drop all your disses, and you can name 'em too,\nbut I'm about to beat you and leave you black and blue.",
        },
        { tier: 'flop', text: 'Seven minutes is a really long diss track.' },
      ],
    },
    {
      bar: "Megan said Hot Girl Summer, darling, and I said Hot Queen July,\n(hmmmm) I'm so hot I melt the mimosas, and you're a cold winter sky.",
      answers: [
        {
          tier: 'fire',
          text: "Hot Queen July? In July you're a sunburned flamingo, and I'll tell you why:\nyou wore glitter instead of sunscreen, and now you're peeling like an onion. We all cry.",
        },
        {
          tier: 'decent',
          text: "You can call it Hot Queen July and melt in the sky,\nbut I'm about to beat you, so don't even try.",
        },
        { tier: 'flop', text: 'Summer in Chicago gets really humid.' },
      ],
    },
    {
      bar: "I'm the Pharrell of the Gold Coast, honey, Louis Vuitton called me too,\n(hmmmm) they said, 'Rodney, design us a line,' and I said, 'Pink. Shoo.'",
      answers: [
        {
          tier: 'fire',
          text: "Louis called you? Honey, that was a bill collector, and your bill's overdue,\nPharrell runs Louis, and you run up a tab at Walgreens for lip gloss and glue.",
        },
        {
          tier: 'decent',
          text: "You can design a pink line and tell me to shoo,\nbut I'm about to beat you, and the line is through.",
        },
        { tier: 'flop', text: 'Designing clothes must be really hard work.' },
      ],
    },
    {
      bar: 'Missy wore a trash bag in a video, darling, and she made it look divine,\n(hmmmm) I wore a trash bag to brunch, honey, and they gave me free wine.',
      answers: [
        {
          tier: 'fire',
          text: "You wore a trash bag to brunch? They gave you wine so you'd leave the line,\nMissy made a trash bag iconic, and you made a Hefty look like a crime.",
        },
        {
          tier: 'decent',
          text: "You can wear a trash bag and drink all the wine,\nbut I'll beat you so bad you'll be crossing the line.",
        },
        { tier: 'flop', text: 'Brunch places should really give free mimosas, I agree.' },
      ],
    },
    {
      bar: "I'm the Kendrick of the Gold Coast, honey, five Grammys and a crown,\n(hmmmm) and I'll do my halftime show, darling, in a sequin gown.",
      answers: [
        {
          tier: 'fire',
          text: "Five Grammys and a crown? That's five Grammy-shaped candles and a hand-me-down,\nKendrick had SZA, and you had your cousin on a kazoo in a Party City crown.",
        },
        {
          tier: 'decent',
          text: "You can do your halftime show in a sequin gown,\nbut I'm about to beat you and knock off your crown.",
        },
        { tier: 'flop', text: 'Sequins are really hard to sew.' },
      ],
    },
    {
      bar: "Doja wore thirty thousand crystals on her face, darling, and I'm wearing more,\n(hmmmm) I'm wearing forty thousand, honey, and I glued 'em on in the store.",
      answers: [
        {
          tier: 'fire',
          text: "Forty thousand crystals? Honey, that's rhinestone glue and a craft store floor,\nDoja was a work of art, and you look like a disco ball that fell out the door.",
        },
        {
          tier: 'decent',
          text: "You can wear all the crystals and glue on some more,\nbut I'm about to beat you and knock you to the floor.",
        },
        { tier: 'flop', text: 'Crystals on your face sounds really itchy.' },
      ],
    },
    {
      bar: "Nicki said 'Super Bass,' darling, boom, badoom, boom,\n(hmmmm) and that's the sound of my heels when I walk into the room.",
      answers: [
        {
          tier: 'fire',
          text: "Boom, badoom, boom? Rodney, that ain't your heels, that's the floor and its doom,\nNicki made 'Super Bass,' and you made your downstairs neighbor sink into gloom.",
        },
        {
          tier: 'decent',
          text: "You can stomp in your heels and go boom, badoom, boom,\nbut I'm about to beat you and send you to your doom.",
        },
        { tier: 'flop', text: "'Super Bass' is such a catchy song." },
      ],
    },
    {
      bar: 'Jaden wore a skirt for Louis Vuitton, darling, and I wore mine on the L,\n(hmmmm) the whole Red Line stood up and clapped, honey, and they could tell.',
      answers: [
        {
          tier: 'fire',
          text: "The whole Red Line clapped? Rodney, that was the doors closing and the chime of the bell,\nJaden was a Louis model, and you're a pink skirt stuck in the door. Oh, well.",
        },
        {
          tier: 'decent',
          text: "You can wear any skirt and ride on the L,\nbut I'm about to beat you and ring the bell.",
        },
        { tier: 'flop', text: 'The Red Line is usually pretty crowded.' },
      ],
    },
    {
      bar: "Drake shaved a heart into his hair, honey, and he stole that look from me,\n(hmmmm) I've had a pink heart on my head since I was three.",
      answers: [
        {
          tier: 'fire',
          text: "Drake's heart haircut was a mistake, honey, and even Drake would agree,\nyours ain't a heart, Rodney, it's a bald spot shaped like the state of Tennessee.",
        },
        {
          tier: 'decent',
          text: "You can shave in a heart and call it your decree,\nbut I'm about to beat you, and you'll bend the knee.",
        },
        { tier: 'flop', text: 'Heart-shaped haircuts are kind of cute.' },
      ],
    },
    {
      bar: "Classy, bougie, ratchet, darling, Megan said it, and it's me in a nutshell,\n(hmmmm) I'm classy at brunch, bougie at the bar, and ratchet at the hotel.",
      answers: [
        {
          tier: 'fire',
          text: "Classy, bougie, ratchet? You're tacky, cheesy, and you smell like a wishing well,\nMegan's a Savage, and you're the pink soap they leave in the room at a motel.",
        },
        {
          tier: 'decent',
          text: "You can be classy and bougie and ratchet as well,\nbut I'm about to beat you, and I'll do it real well.",
        },
        { tier: 'flop', text: 'Megan Thee Stallion is really funny in interviews.' },
      ],
    },
    {
      bar: "I'm the Pusha T of fashion, darling, I got receipts on your fit,\n(hmmmm) you bought it at Kohl's, returned it, then bought it back. Admit it.",
      answers: [
        {
          tier: 'fire',
          text: "Receipts on my fit? Your receipts say 'Spirit Halloween,' and you couldn't commit,\nyour boa's molting, honey, and there's a feather in your mimosa. You're a pink misfit.",
        },
        {
          tier: 'decent',
          text: "You can bring me your receipts and read every bit,\nbut I'm about to beat you, so get ready to quit.",
        },
        { tier: 'flop', text: "Kohl's has really good sales, honestly." },
      ],
    },
    {
      bar: "Kendrick said sit down, be humble, and darling, I've never sat,\n(hmmmm) I stand on the table at brunch, honey, and I'm wearing a hat.",
      answers: [
        {
          tier: 'fire',
          text: "You never sit? Honey, your pants are so tight you can't, and that's that,\nKendrick said be humble, and you stood on a table at brunch and fell flat.",
        },
        {
          tier: 'decent',
          text: "You can stand on the table and wear a big hat,\nbut I'm about to beat you and knock you down flat.",
        },
        { tier: 'flop', text: 'Standing on tables is a little dangerous.' },
      ],
    },
    {
      bar: "Nicki and Megan had beef, darling, and I've got beef with your hair,\n(hmmmm) it's giving bird's nest, honey, and the bird isn't there.",
      answers: [
        {
          tier: 'fire',
          text: "Beef with my hair? Rodney, your lace front is lifting, and it's floating in the air,\nyou've got beef with gravity, honey, and gravity's winning. Unfair.",
        },
        {
          tier: 'decent',
          text: "You can have beef with my hair, but I really don't care,\nI'm about to beat you, so you'd better beware.",
        },
        { tier: 'flop', text: 'I just washed my hair this morning, actually.' },
      ],
    },
    {
      bar: "I'm the Queen of the Gold Coast, honey, and Nicki's the Queen of Rap,\n(hmmmm) we're both royalty, darling, and you're a nap.",
      answers: [
        {
          tier: 'fire',
          text: "Nicki's the Queen of Rap, Rodney, and you're the queen of the mimosa tap,\nyour throne is a pink folding chair, and your crown is a Burger King cap. Snap.",
        },
        {
          tier: 'decent',
          text: "You can call yourself royal, but I'm closing the gap,\nI'm about to beat you and give you a slap.",
        },
        { tier: 'flop', text: 'Nicki Minaj has a lot of fans.' },
      ],
    },
    {
      bar: 'Lil Nas X kissed his dancer at the BET Awards, honey, and the room went wild,\n(hmmmm) I kissed my reflection at brunch, and the waiter just smiled.',
      answers: [
        {
          tier: 'fire',
          text: "You kissed your reflection? Rodney, the mirror cracked, and it's suing. It filed,\nLil Nas X made history, and you made the busboy cry like a child.",
        },
        {
          tier: 'decent',
          text: "You can kiss your reflection and get all beguiled,\nbut I'm about to beat you, and it won't be mild.",
        },
        { tier: 'flop', text: 'Lil Nas X seems like a really fun person, honestly.' },
      ],
    },
    {
      bar: "I'm the Drake of drama, darling, I got more beef than a Portillo's line,\n(hmmmm) I got beef with my stylist, my barber, my ex, and that's fine.",
      answers: [
        {
          tier: 'fire',
          text: "More beef than Portillo's? Portillo's beef is juicy, and yours is dry, and it's swine,\nyour stylist quit, your barber moved, and your ex left the country. That's a sign.",
        },
        {
          tier: 'decent',
          text: "You can have all your beef, honey, I'll keep mine,\nbut I'm about to beat you, so get back in line.",
        },
        { tier: 'flop', text: "Portillo's has really good chocolate cake." },
      ],
    },
    {
      bar: "Yeezy slides are ugly, darling, and I said it to Ye's face,\n(hmmmm) he said, 'Rodney, you're right,' and he gave me a pink suitcase.",
      answers: [
        {
          tier: 'fire',
          text: "You told Ye his slides are ugly? Rodney, you're wearing Crocs with a pink lace,\nthe only thing Ye ever gave you was a restraining order and some space.",
        },
        {
          tier: 'decent',
          text: "You can talk to Ye and get a pink suitcase,\nbut I'm about to beat you and put you in your place.",
        },
        { tier: 'flop', text: 'Yeezy slides are actually really comfortable.' },
      ],
    },
    {
      bar: "Biggie was Big Poppa, honey, and I'm the Big Queen of the scene,\n(hmmmm) I throw my hands in the air, darling, like a dancing machine.",
      answers: [
        {
          tier: 'fire',
          text: "Big Queen of the scene? Your scene's a pink Denny's booth and a slot machine,\nBiggie was Big Poppa, and you're Big Problem, with a bar tab older than a teen.",
        },
        {
          tier: 'decent',
          text: "You can call yourself the Big Queen of the scene,\nbut I'm about to beat you and wipe you clean.",
        },
        { tier: 'flop', text: 'Biggie was from Brooklyn, I think.' },
      ],
    },
    {
      bar: "I'm Remy Ma, honey, I'm Nicki, I'm Kim, and I'm Cardi in one,\n(hmmmm) I've got every queen's crown, darling, and I've only just begun.",
      answers: [
        {
          tier: 'fire',
          text: "Every queen in one? Honey, you're a knockoff of all of 'em, and you're on the run,\nNicki wants her wig back, Cardi wants her shoe, and Kim wants a word with everyone.",
        },
        {
          tier: 'decent',
          text: "You can be every queen, but you're still only one,\nand I'm about to beat you, and then we'll be done.",
        },
        { tier: 'flop', text: "That's a lot of different rappers to be at once." },
      ],
    },
    {
      bar: "Drake said 'Nice for What,' honey, and I'm nice for brunch and nice for lunch,\n(hmmmm) and nice for dinner, darling, and you're the fruit punch.",
      answers: [
        {
          tier: 'fire',
          text: "Nice for what? Honey, you're nice for nothing, and you never pay for brunch,\nthe waiter's been chasing your tab for six years, and he's still got a hunch.",
        },
        {
          tier: 'decent',
          text: "You can be nice at dinner and nice at brunch,\nbut I'm about to beat you, and it's gonna crunch.",
        },
        { tier: 'flop', text: 'Fruit punch is really sugary.' },
      ],
    },
    {
      bar: "Megan and Cardi did 'WAP,' darling, and the whole world got upset,\n(hmmmm) I did a remix with my rules, honey, and it's not out yet.",
      answers: [
        {
          tier: 'fire',
          text: "Your remix isn't out yet? Rodney, it's been blocked by every lawyer you've met,\nCardi and Megan broke the internet, and you broke a karaoke machine. Regret?",
        },
        {
          tier: 'decent',
          text: "You can make your remix, but it won't come out yet,\nI'm about to beat you, so get ready to sweat.",
        },
        { tier: 'flop', text: 'That song was really popular for a whole summer.' },
      ],
    },
    {
      bar: "Every rapper wants a feature from me, darling, I'm the hook on every song,\n(hmmmm) I sing 'mmm' on the chorus, honey, and it lasts all day long.",
      answers: [
        {
          tier: 'fire',
          text: "You're the 'mmm' on every hook? Honey, that's a microwave, and it beeps wrong,\nthe only feature you got was humming at a Cubs game till they rang the gong.",
        },
        {
          tier: 'decent',
          text: "You can hum on the hook and go 'mmm' all along,\nbut I'm about to beat you, and you'll sing a sad song.",
        },
        { tier: 'flop', text: 'Humming is actually a good way to warm up your voice.' },
      ],
    },
    {
      bar: "Nicki's got a Pink Friday, honey, and every day is pink for me,\n(hmmmm) Pink Monday, Pink Tuesday, darling, Pink Week, and Pink Tea.",
      answers: [
        {
          tier: 'fire',
          text: "Nicki made Pink Friday, and you made Pink Every Day? Honey, that's not a decree,\nyou're not a brand, Rodney, you're a Pepto-Bismol bottle on a shopping spree.",
        },
        {
          tier: 'decent',
          text: "You can have Pink Friday and pink everything free,\nbut I'm about to beat you, and you'll answer to me.",
        },
        { tier: 'flop', text: "'Pink Friday' is a really good album, honestly." },
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
    {
      bar: "Ye wrote 'Homecoming' for Chicago, but the King never left the land,\nhe moved out to Calabasas, and I'm still here with the city in my hand.",
      answers: [
        {
          tier: 'fire',
          text: "You never left 'cause no other city would take you, King. Understand?\nYe built an empire out West, and you built a throne out of a Portillo's stand.",
        },
        {
          tier: 'decent',
          text: "You can stay in Chicago with the city in your hand,\nbut I'm taking your crown, and I'm taking command.",
        },
        { tier: 'flop', text: 'Calabasas is really far away.' },
      ],
    },
    {
      bar: "I made a song with Drake, 'Laugh Now Cry Later,' and that's your fate,\nyou'll laugh at my crown now, rookie, and cry when it's too late.",
      answers: [
        {
          tier: 'fire',
          text: "Laugh now, cry later? Drake did both, King: he laughed, then Kendrick sealed his fate,\nand you're the feature on the losing team. That's a crown on a paper plate.",
        },
        {
          tier: 'decent',
          text: "You can laugh now and cry later, but I won't wait,\nI'm taking your crown, and I'm taking it straight.",
        },
        { tier: 'flop', text: 'That song had a really fun music video, I remember.' },
      ],
    },
    {
      bar: "T.I.'s the King of the South, and I'm the King of the Midwest,\nI got a crown on my dreads, rookie, and the city on my chest.",
      answers: [
        {
          tier: 'fire',
          text: "King of the Midwest? T.I. got the South, and you got a Culver's at best,\nyour crown's from Medieval Times, and that city on your chest is a sticker you pressed.",
        },
        {
          tier: 'decent',
          text: "You can be King of the Midwest with the city on your chest,\nbut I'm taking your crown, so go lie down and rest.",
        },
        { tier: 'flop', text: 'The Midwest has really nice people.' },
      ],
    },
    {
      bar: "Ye did 808s and Heartbreak, and the King does it every night,\nauto-tune on my heart, rookie, and I'm crying in the light.",
      answers: [
        {
          tier: 'fire',
          text: "808s and Heartbreak? Ye made a classic, and you made a ringtone with no bite,\nyour heart's auto-tuned 'cause your real voice sounds like a goose in a fistfight.",
        },
        {
          tier: 'decent',
          text: "You can cry with your auto-tune all through the night,\nbut I'm about to beat you and win this fight.",
        },
        { tier: 'flop', text: "Heartbreak is really hard, I'm sorry." },
      ],
    },
    {
      bar: "Ye and Hov said Watch the Throne, but the King don't watch, he sits,\nI got the throne right next to the Bean, rookie, and you don't get a bit.",
      answers: [
        {
          tier: 'fire',
          text: "You sit on the throne? You sit on a bench by the Bean, and the pigeons won't quit,\nWatch the Throne went platinum, and you watch your throne get pooped on. You should quit.",
        },
        {
          tier: 'decent',
          text: "You can sit on your throne and not move a bit,\nbut I'm taking your crown, and you'll have to submit.",
        },
        { tier: 'flop', text: 'The Bean is a really popular spot for photos.' },
      ],
    },
    {
      bar: "I went country with Morgan Wallen on 'Broadway Girls,' and it went gold,\nthe King conquers every genre, rookie, and the King never gets old.",
      answers: [
        {
          tier: 'fire',
          text: "You went country? Then trade that crown for a cowboy hat and do what you're told,\nyou rode a mechanical bull at a bar in Schaumburg, and you fell off. That's cold.",
        },
        {
          tier: 'decent',
          text: "You can go country and go platinum and gold,\nbut I'm taking your crown, and I'm breaking the mold.",
        },
        { tier: 'flop', text: 'Country music has some really good storytelling, honestly.' },
      ],
    },
    {
      bar: "Kendrick got LA singing 'they not like us,' but the King's got the Chi,\nthe whole city sings my hooks, rookie, from the lake to the sky.",
      answers: [
        {
          tier: 'fire',
          text: "The city sings your hooks 'cause they're stuck in their heads like gum. That's why,\nKendrick got the Super Bowl, and you got a jingle for a mattress store. Bye.",
        },
        {
          tier: 'decent',
          text: "You can sing to the city from the lake to the sky,\nbut I'm taking your crown, and I'm telling you bye.",
        },
        { tier: 'flop', text: 'Lake Michigan is really pretty at sunset.' },
      ],
    },
    {
      bar: "Jay had an Empire State of Mind, and I got a Windy City state of mind,\nconcrete jungle with the wind in your face, and the King's one of a kind.",
      answers: [
        {
          tier: 'fire',
          text: "A Windy City state of mind? The wind blew your crown off, and it's still hard to find,\nAlicia Keys sang the hook for Jay, and you sang your own, 'cause nobody else signed.",
        },
        {
          tier: 'decent',
          text: "You can have your state of mind, but you're falling behind,\nI'm taking your crown, so go home and unwind.",
        },
        { tier: 'flop', text: "Chicago isn't actually the windiest city, I read that." },
      ],
    },
    {
      bar: "Nate Dogg sang the hooks for everybody, and now the King's the one,\nI sing the hook, the verse, and the bridge, rookie, and then I'm done.",
      answers: [
        {
          tier: 'fire',
          text: "You sing the hook, the verse, and the bridge? That's why your songs are no fun,\nNate Dogg could regulate a hook, and you can't regulate a hot dog bun.",
        },
        {
          tier: 'decent',
          text: "You can sing every part, but I'm not gonna run,\nI'm taking your crown, and this battle's been won.",
        },
        { tier: 'flop', text: 'Nate Dogg had a really smooth voice.' },
      ],
    },
    {
      bar: "Ye said what don't kill me makes me stronger, and the King's been strong so long,\nI survived the polar vortex, rookie, the Bears, and the Cubs. I belong.",
      answers: [
        {
          tier: 'fire',
          text: "You survived the polar vortex? Then you're a frozen Popsicle singing a sad song,\nYe got stronger, and you got frostbite on your crown. You've been wrong all along.",
        },
        {
          tier: 'decent',
          text: "You can survive the vortex and the Bears all along,\nbut I'm about to beat you and sing you a song.",
        },
        { tier: 'flop', text: 'The polar vortex was so cold, I remember that.' },
      ],
    },
    {
      bar: "They call me the Voice 'cause when I sing, the Hawk stops blowing,\nthe whole lake freezes over, rookie, and it starts snowing.",
      answers: [
        {
          tier: 'fire',
          text: "The Hawk stopped blowing to cover its ears, and the lake froze to stop you from going,\nyour auto-tune's the only thing keeping you warm, and even that's slowing.",
        },
        {
          tier: 'decent',
          text: "You can sing till it's freezing and the Hawk stops blowing,\nbut I'm taking your crown, and I'm already going.",
        },
        { tier: 'flop', text: 'Chicago winters are really cold, I agree.' },
      ],
    },
    {
      bar: "I got more chains than Mr. T, rookie, and more rings than Jordan's hands,\nI'm the King of the Chi, and the whole city understands.",
      answers: [
        {
          tier: 'fire',
          text: 'More chains than Mr. T? Mr. T pities the fool, and the fool is in your stands,\nJordan won six rings, King, and you got yours in a Cracker Jack box with the rubber bands.',
        },
        {
          tier: 'decent',
          text: "You can rock all your chains and the rings on your hands,\nbut I'm taking your crown with my own two hands.",
        },
        { tier: 'flop', text: "Mr. T is from Chicago, I didn't know that." },
      ],
    },
    {
      bar: 'Chief Keef put Chicago on the map, and the King put the map on his chain,\nI got the whole Chi in diamonds, rookie, from the Skyway to the Blue Line train.',
      answers: [
        {
          tier: 'fire',
          text: "The whole Chi on your chain? That map's missing the South Side, and it's got a stain,\nKeef put Chicago on the map, and you put it on a Rand McNally keychain.",
        },
        {
          tier: 'decent',
          text: "You can wear the whole city on a big diamond chain,\nbut I'm taking your crown, and I'm taking your reign.",
        },
        { tier: 'flop', text: "The Blue Line goes all the way to O'Hare, I think." },
      ],
    },
    {
      bar: "Kendrick wore a crown of thorns, rookie, but my crown is made of ice,\nit's colder than the lake in January, and it cost twice the price.",
      answers: [
        {
          tier: 'fire',
          text: "Your crown is made of ice? Then it's melting by May, King, and that's the price,\nKendrick's crown was a statement, and yours is a puddle with a dread in it. Nice.",
        },
        {
          tier: 'decent',
          text: "You can wear a crown of ice and pay twice the price,\nbut I'm taking it off you, and I won't ask twice.",
        },
        { tier: 'flop', text: 'Ice crowns sound really cold to wear, honestly.' },
      ],
    },
    {
      bar: "I sing the hook so sweet, rookie, I make the Bulls win again,\nwell, I made 'em win one game. Back in 2010. But still. Amen.",
      answers: [
        {
          tier: 'fire',
          text: "You made the Bulls win one game? Then the Bulls should send you back to the den,\nthey haven't had a parade since Jordan, and you haven't had a hit since... when?",
        },
        {
          tier: 'decent',
          text: "You can sing for the Bulls and sing for 'em again,\nbut I'm taking your crown, and I'm counting to ten.",
        },
        { tier: 'flop', text: 'The Bulls were really good in the nineties, I heard.' },
      ],
    },
    {
      bar: "My blonde dreads are so famous they got their own Instagram,\nthey got more followers than you, rookie, and they're more of a man.",
      answers: [
        {
          tier: 'fire',
          text: "Your dreads have an Instagram? Then they're the brains of the plan, my man,\nthey're begging to be cut loose, King, they've been DMing a barber in Japan.",
        },
        {
          tier: 'decent',
          text: "Your dreads can be famous, but I'm still the man,\nI'm taking your crown as fast as I can.",
        },
        { tier: 'flop', text: 'Taking care of dreads is a lot of work.' },
      ],
    },
    {
      bar: 'Twista raps fast, rookie, and the King sings slow,\nI take my time with the crown, and the whole city knows.',
      answers: [
        {
          tier: 'fire',
          text: "You sing slow 'cause the lyrics are written on your hand, King, and it shows,\nTwista's in the record books, and you're in the books for the longest note that froze.",
        },
        {
          tier: 'decent',
          text: "You can sing nice and slow while the whole city goes,\nbut I'm taking your crown and stepping on your toes.",
        },
        { tier: 'flop', text: 'Twista really is one of the fastest rappers ever.' },
      ],
    },
    {
      bar: "I'm the King of the Magnificent Mile, rookie, every store knows my face,\nthey close the doors when I walk in so nobody else can take my place.",
      answers: [
        {
          tier: 'fire',
          text: "They close the doors when you walk in? That's 'cause you never pay, King. That's the case,\nyou've been banned from Nordstrom, Gucci, and the Cheesecake Factory. Disgrace.",
        },
        {
          tier: 'decent',
          text: "You can shop the whole Mile and show off your face,\nbut I'm taking your crown, and I'm winning this race.",
        },
        { tier: 'flop', text: 'The Magnificent Mile has a lot of nice stores.' },
      ],
    },
    {
      bar: "Common used to love H.E.R., but the King married the whole city,\nI put a ring on the Chi, rookie, and she said yes. Ain't it pretty?",
      answers: [
        {
          tier: 'fire',
          text: "You married the city? Then the city's filing for divorce, and it's not being witty,\nit's keeping the Bean, the lake, and the pizza, and you get a pass to the Skyway. Pity.",
        },
        {
          tier: 'decent',
          text: "You can marry the city and say that it's pretty,\nbut I'm taking your crown, and I'm showing no pity.",
        },
        { tier: 'flop', text: 'Chicago is a really beautiful place, I agree.' },
      ],
    },
    {
      bar: "Drake's got the owl, Ye's got the bear, and the King's got the Bulls,\nI got the whole team on my chain, rookie, and my chain's got pull.",
      answers: [
        {
          tier: 'fire',
          text: "The Bulls on your chain? They haven't won in years, King, and your chain is full\nof cubic zirconia and a Benny the Bull keychain. That's a lot of bull.",
        },
        {
          tier: 'decent',
          text: "You can wear the whole team, but your chain's not full,\nI'm taking your crown, and I'm grabbing it like a bull.",
        },
        { tier: 'flop', text: 'Benny the Bull is a really fun mascot.' },
      ],
    },
    {
      bar: 'The King turns on the auto-tune, and the whole Bean starts to glow,\nthe tourists start to cry, rookie, and the river starts to flow.',
      answers: [
        {
          tier: 'fire',
          text: "The Bean glows from your chains, King, and the tourists cry 'cause you're slow,\nthe river flows backwards 'cause it's running from your voice. Even the water said no.",
        },
        {
          tier: 'decent',
          text: "You can turn on your auto-tune and give it a glow,\nbut I'm taking your crown, and I'm stealing the show.",
        },
        { tier: 'flop', text: 'The Bean is actually called Cloud Gate, officially.' },
      ],
    },
    {
      bar: "Chance said 'No Problem,' but the King's got a problem, and it's you,\nso I'll sing you a lullaby, rookie, and that's all I'll do.",
      answers: [
        {
          tier: 'fire',
          text: "I'm your problem? Then you've got a big one, King, 'cause I'm about to break through,\nChance made 'No Problem' with no label, and you got a label and nothing new.",
        },
        {
          tier: 'decent',
          text: "You can sing me a lullaby, but I'm not sleeping through,\nI'm taking your crown and breaking it in two.",
        },
        { tier: 'flop', text: "Chance the Rapper's mixtapes were really good." },
      ],
    },
    {
      bar: "My crown's so heavy, rookie, I need a neck brace and a nap,\nbut the King still sings, and the King still raps.",
      answers: [
        {
          tier: 'fire',
          text: "Your crown's so heavy you need a nap? It's from a Happy Meal, and it's got straps,\nthe King still sings? The King sings to his pillow, and his pillow claps.",
        },
        {
          tier: 'decent',
          text: "Your crown might be heavy, so go take your naps,\nbut I'm taking it from you while you're stuck in your traps.",
        },
        { tier: 'flop', text: "Neck braces are really uncomfortable, I've heard." },
      ],
    },
    {
      bar: "Every rapper in the Chi wants a feature from the King, they line up at my door,\nI charge 'em by the minute, rookie, and I charge 'em a little more.",
      answers: [
        {
          tier: 'fire',
          text: "Rappers line up at your door? King, that's the line at Lou Malnati's next door,\nthey ain't there for a feature, they're there for deep dish, and you mop the floor.",
        },
        {
          tier: 'decent',
          text: "You can charge by the minute and charge a little more,\nbut I'm taking your crown, and I'm settling the score.",
        },
        { tier: 'flop', text: "Lou Malnati's has really good pizza, honestly." },
      ],
    },
    {
      bar: "The King don't do diss tracks, rookie, the King does lullabies,\nI'll sing you to sleep so sweet you'll be dreaming till July.",
      answers: [
        {
          tier: 'fire',
          text: 'Lullabies? King, your voice keeps the whole block up, and the babies all cry,\nyou sing one note, and the car alarms go off from here to Gary. Lullaby? Bye.',
        },
        {
          tier: 'decent',
          text: "You can sing me a lullaby, but I won't close an eye,\nI'm taking your crown, and you're saying goodbye.",
        },
        { tier: 'flop', text: 'Lullabies are really soothing.' },
      ],
    },
    {
      bar: "I'm King Kunta, rookie, everybody wanna cut the legs off the King,\nbut they can't, 'cause I'm sitting, and the throne's got a cushion and a spring.",
      answers: [
        {
          tier: 'fire',
          text: "King Kunta? Kendrick made a classic, and you made a recliner a royal thing,\nyou're not on a throne, Durkio, you're on a La-Z-Boy with a cup holder and a ring.",
        },
        {
          tier: 'decent',
          text: "You can sit on your cushion and your throne and your spring,\nbut I'm taking your crown, so get up, King.",
        },
        { tier: 'flop', text: 'Cushions make any chair more comfortable.' },
      ],
    },
    {
      bar: "My blonde dreads swing like the Ferris wheel at Navy Pier,\nround and round, rookie, and they're the best ride this year.",
      answers: [
        {
          tier: 'fire',
          text: "Your dreads swing like the Ferris wheel? King, they make the tourists disappear,\nthat Ferris wheel's got a line, and your dreads got a pigeon nesting in the rear.",
        },
        {
          tier: 'decent',
          text: "You can swing your blonde dreads like a ride at the Pier,\nbut I'm taking your crown, and I'm making it clear.",
        },
        { tier: 'flop', text: 'The Navy Pier Ferris wheel is really tall, honestly.' },
      ],
    },
    {
      bar: "Jay's got Ace of Spades, Drake's got his whiskey, and the King drinks Malört,\nit tastes like a burnt rubber band, rookie, and the King don't even snort.",
      answers: [
        {
          tier: 'fire',
          text: "You drink Malört? That's not royalty, King, that's a dare and a last resort,\nJay's got champagne, and you've got a drink that tastes like a Blue Line seat. Good sport.",
        },
        {
          tier: 'decent',
          text: "You can drink your Malört, but your reign is short,\nI'm taking your crown, and I'm taking your court.",
        },
        { tier: 'flop', text: 'Malört is really an acquired taste.' },
      ],
    },
    {
      bar: "I'm the Kanye of the South Side, rookie, the College Dropout King,\nI dropped out of three colleges, and I still make the city sing.",
      answers: [
        {
          tier: 'fire',
          text: "Three colleges? Ye dropped out of one and made a classic, King,\nyou got kicked out for auto-tuning the lectures. That's a whole different thing.",
        },
        {
          tier: 'decent',
          text: "You can drop out of college and make the city sing,\nbut I'm taking your crown, and I'm taking your ring.",
        },
        { tier: 'flop', text: 'College can be really expensive, so I get it.' },
      ],
    },
    {
      bar: "Jordan had the Bulls, Oprah had the show, and the King's got the Chi,\nthree legends from Chicago, rookie, and the greatest one is I.",
      answers: [
        {
          tier: 'fire',
          text: 'Jordan won six rings, and Oprah gave the whole audience a car, and you? Why,\nyou gave the crowd a ringtone and a coupon for an Italian beef. Bye.',
        },
        {
          tier: 'decent',
          text: "You can name all the legends and call 'em your guy,\nbut I'm taking your crown, so wave it goodbye.",
        },
        { tier: 'flop', text: 'Oprah is from Chicago? I thought she was from somewhere else.' },
      ],
    },
    {
      bar: "I got Twista on my left, Common on my right, and Chief Keef on the drums,\nthe whole Chi is my band, rookie, and you're the crumbs.",
      answers: [
        {
          tier: 'fire',
          text: "Twista, Common, and Keef? King, they don't know you, they've never heard your hums,\nyour band is a kazoo, a cowbell, and your cousin on the bucket drums.",
        },
        {
          tier: 'decent',
          text: "You can have all the legends and all of the drums,\nbut I'm taking your crown, and you're under my thumbs.",
        },
        { tier: 'flop', text: 'Twista and Common are both from Chicago, I agree.' },
      ],
    },
    {
      bar: "The King auto-tunes his doorbell, rookie, it sings when you ring,\nit sings 'Welcome to the palace,' and it sounds like a king.",
      answers: [
        {
          tier: 'fire',
          text: "Your doorbell's auto-tuned? Even your doorbell outsings you, King, and that's a sad thing,\nthe mailman leaves your packages next door 'cause he can't stand to hear it ring.",
        },
        {
          tier: 'decent',
          text: "You can auto-tune your doorbell and make it sing,\nbut I'm knocking on your door, and I'm taking your bling.",
        },
        { tier: 'flop', text: 'Smart doorbells are really useful.' },
      ],
    },
    {
      bar: "I sang the anthem at Soldier Field, rookie, and the whole crowd cried,\nthe Bears lost by forty, but the King's anthem was the highlight. Pride.",
      answers: [
        {
          tier: 'fire',
          text: "The crowd cried 'cause you held the note so long the Bears forgot which side,\nthe Bears lost by forty, King, and the coaches blamed the anthem. They tried.",
        },
        {
          tier: 'decent',
          text: "You can sing at Soldier Field and fill the crowd with pride,\nbut I'm taking your crown, and I'm taking it in stride.",
        },
        { tier: 'flop', text: 'The Bears have had some rough seasons, honestly.' },
      ],
    },
    {
      bar: "I'm the King of drill and the King of R&B, rookie, I wear two crowns,\none's for the streets, and one's for the ladies, and I never let 'em down.",
      answers: [
        {
          tier: 'fire',
          text: "Two crowns? One's from Burger King and one's from Dairy Queen, and they're upside down,\nthe streets don't know you, and the ladies won't text back. You're a two-crown clown.",
        },
        {
          tier: 'decent',
          text: "You can wear two crowns, but I'm taking 'em down,\nI'm the new King, and I'm running this town.",
        },
        { tier: 'flop', text: 'Wearing two crowns sounds really heavy.' },
      ],
    },
    {
      bar: "Kanye built a stage that floated, and the King's stage floats on the lake,\nit's a pontoon with a crown on it, rookie, and it's all for my sake.",
      answers: [
        {
          tier: 'fire',
          text: "Your stage is a pontoon? King, that's a fishing boat with a crown and a rake,\nYe's stage floated over a stadium, and yours sank off Montrose Beach. Big mistake.",
        },
        {
          tier: 'decent',
          text: "You can float on the lake for your own royal sake,\nbut I'm taking your crown, and I'm giving it a shake.",
        },
        { tier: 'flop', text: 'Montrose Beach is really nice in the summer.' },
      ],
    },
    {
      bar: "The King's dreads are blonde 'cause the sun kisses 'em every day,\nwell, it's bleach, rookie, but the sun would do it anyway.",
      answers: [
        {
          tier: 'fire',
          text: "The sun kisses your dreads? The sun took one look at that bleach and ran away,\nthat ain't blonde, it's Kraft Mac & Cheese, and it's been in the microwave since May.",
        },
        {
          tier: 'decent',
          text: "You can bleach your dreads blonde every single day,\nbut I'm taking your crown, and I'm taking it today.",
        },
        { tier: 'flop', text: 'Bleach can really damage your hair.' },
      ],
    },
    {
      bar: "I got a mansion on the Gold Coast, rookie, with a moat and a drawbridge,\nand a pet alligator named Kanye, and a Malnati's in the fridge.",
      answers: [
        {
          tier: 'fire',
          text: "A moat and an alligator? That's a kiddie pool and a Beanie Baby on a ridge,\nyour mansion's a condo in Schaumburg, and your moat leaks under the bridge.",
        },
        {
          tier: 'decent',
          text: "You can sit in your mansion and your moat and your bridge,\nbut I'm taking your crown, and I won't give a smidge.",
        },
        { tier: 'flop', text: "Alligators can't really survive Chicago winters." },
      ],
    },
    {
      bar: "The King's chain is so heavy it pulled me down to the floor,\nI was stuck there for three days, rookie, and I loved it, and I want more.",
      answers: [
        {
          tier: 'fire',
          text: "Your chain pinned you to the floor for three days? That's not drip, King, that's a chore,\nthe paramedics used bolt cutters and a crane, and they billed you for the door.",
        },
        {
          tier: 'decent',
          text: "You can wear a heavy chain and fall down on the floor,\nbut I'm taking your crown, and I'm showing you the door.",
        },
        { tier: 'flop', text: 'Heavy chains are actually bad for your posture.' },
      ],
    },
    {
      bar: "I don't need a hype man, rookie, the King hypes himself,\nI say 'The King is here!' and then I clap for myself.",
      answers: [
        {
          tier: 'fire',
          text: "You hype yourself and clap for yourself? That's not a King, that's a lonely elf,\nyou're your only fan, King, and even you left early to put your crown on the shelf.",
        },
        {
          tier: 'decent',
          text: "You can hype yourself up and clap for yourself,\nbut I'm taking your crown and putting it on my shelf.",
        },
        { tier: 'flop', text: 'Self-confidence is important, honestly.' },
      ],
    },
    {
      bar: 'Every rapper bows to the King, rookie, from Kanye down to Keef,\nwhen I walk into the room, the whole industry turns over a new leaf.',
      answers: [
        {
          tier: 'fire',
          text: "Everybody bows? King, they're bending to pick up their jaws in disbelief,\nyour crown is cardboard, and your throne's a bus bench. Good grief.",
        },
        {
          tier: 'decent',
          text: "Everybody can bow to the King and the chief,\nbut I'm taking your crown, and I'm bringing you grief.",
        },
        { tier: 'flop', text: 'Everyone should treat each other with respect.' },
      ],
    },
  ],
}
