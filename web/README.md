# Chicago Wars (web)

A turn-based street RPG in the browser: thirteen blocks of Chicago, a King at The Bean, and a
pigeon that steals your fries. It's a from-scratch rebuild of the 2020 Java console game in the
repo root.

Vite + React 19 + TypeScript (strict). A static single-page app plus one serverless function
(the Battle Rap judge); saves live in `localStorage`.

## Commands

```sh
npm install
npm run dev        # dev server with HMR
npm test           # engine unit tests + balance simulation
npm run sim        # balance report (win rate, run length, where players die)
npm run lint       # Biome lint + format check  (npm run format to fix)
npm run typecheck
npm run build      # type-check + production build into dist/
npm run sprites    # rebuild character sprites from the LPC generator (needs network)
npm run eval:judge # live Battle Rap judge evaluation (needs TYPESAFE_API_KEY)
npm run export:bars # pull logged Battle Rap bars from Upstash into eval/candidates/
```

## How it fits together

```
src/content/   data: enemies, skills, openings, NPC dialogue, names, sprite manifest
     ↓ read by
src/engine/    pure TS rules: seeded RNG, damage, turns, encounters, dialogue, step()
     ↓ GameState + GameEvent[]
src/ui/        React: plays events back (typewriter, animations), dispatches actions
```

- **`step(state, action) → { state, events }`** (`src/engine/step.ts`) is the whole engine API.
  It's pure and deterministic: the RNG state lives in `GameState`, so the same state and action
  always produce the same result. Actions that are invalid for the current phase return the
  original state object.
- The engine and content layers never touch React, `Math.random` or `Date`. A Biome rule and
  `test/purity.test.ts` enforce this.
- **Combat math** goes through one function, `rollAttack` (`src/engine/combat/damage.ts`):
  ATK × power ± 15%, mitigated by `K / (K + DEF)`, crits ×1.5, minimum 1 damage. HP only changes
  through `applyDamage` and `applyHeal`, which clamp it.
- **Moves**: the hero carries up to 6 moves with PP (`src/content/moves.ts`). After every win
  they're offered new ones, unseen moves first (higher tiers unlock as they level up, every 2
  wins), and the hero forgets one when full.
  Moves can have accuracy, priority, recoil, armor-piercing and finisher bonuses, and they
  apply statuses (stunned, bleeding, pumped, shook, hyped, guarded, dazed, frostbit, vibing,
  weakened, hobbled, blinded). A status riding on an attack only lands if the attack does.
- **Enemies** pick weighted moves from `src/content/enemies.ts`. Mid-to-late enemies fight
  dirty: they blind you (accuracy down), lock your last-used move or take a piece of gear for
  the rest of the fight (`battle.lockedMoves` / `lockedGear`; Jab can never be locked), pick
  your pocket (the clout rides on their reward, so winning gets it back), drain HP, and heal
  when low. Moves can be gated by HP (`whenBelow`) and capped per fight (`maxUses`).
  Every disrupt move also lands a hit, and like other riders the disruption only sticks if
  the hit does. Goons, Thugs and Bikers may run off below 20% HP with a parting line (`flee` on
  their definition), which counts as a win: same clout, heal, level progress and move offers.
- **The gauntlet**: the last three blocks are always the same fights (`GAUNTLET` in
  `balance.ts`): the Dajjal's Jester at block 11, the Gay Queen Rodney at 12, and King Durkio,
  the King of Chicago, at The Bean on 13. They have fixed names, entrances, stats and sprites,
  boss music, and no running away.
- **Late-game rally**: from block 8, the first time an enemy drops below 30% HP it heals 25%
  for free, on top of its turn: cough syrup, shea butter, or remembering the Bulls' '90s run
  (`RALLY` in `balance.ts`, lines in `src/content/enemies.ts`).
- **Battle Rap**: once the enemy drops below half HP, a gold option unlocks under the battle
  menu (once per fight; it stays unlocked after a heal). The enemy spits a bar and the hero has
  30 seconds to type a two-line comeback (or pick one of three, in Settings). The rap box frames
  the lines in battle rap's terms, the setup then the punchline, and Enter moves from one to the
  other; one line counts as half a bar and scores half. The bar is scored into a tier (flop,
  decent, fire, legendary) whose effects can't be dodged; a flop gets the hero booed (shook) and
  the enemy still acts. Prompts and pick-mode answers are in `src/content/cyphers.ts`, scoring in
  `src/engine/combat/cypher.ts`, tuning in `CYPHER` and `CYPHER_EFFECTS` (`balance.ts`). See
  [Battle Rap judging](#battle-rap-judging).
- **Vendors** (Plug, Gangsta, hot dog cart) aren't random encounters. They're recurring
  characters you can visit once per block from the explore menu. Walking only leads to fights
  and street events.
- **The Gangsta** keeps a free playbook: any move the hero passed on after a win or forgot to
  make room (`GameState.seenMoves` minus what they know) can be learned again at no cost, within
  the 6-move limit. He also runs one training session per visit: a fixed boost to any stat for
  clout, with every session making the next one pricier (`TRAINING` in `balance.ts`).
- **The Plug** sells gear in sections (`category` on each item in `src/content/skills.ts`):
  Drip (passive), Weapons, Dirty tricks, Boosts & heals, and Elite. The three elite pieces
  (100–150 clout) each add a mechanic of their own: the Bootleg Mixtape replays the enemy's
  last move at them, louder; Cloud Gate Chrome splits every hit, half to you and half back at
  them, and bounces debuffs; the Ventra Card summons the L, which flattens them two turns
  later. Gear cooldowns reset after every fight, so long cooldowns mean once per fight.
- **Dialogue**: everyone raps except Goons. Lines are pools in `src/content/`, and
  `pickFresh` (`src/engine/lines.ts`) avoids repeating recent picks.
  `test/content.test.ts` checks that every rapper's spoken lines are two-line bars.
- **Tuning** lives in `src/engine/balance.ts`. Per-item numbers (skill cooldowns, enemy moves,
  opening odds) sit next to their content. After changing either, run `npm run sim`.
  `test/balance.sim.test.ts` fails if the win rate, fight length or run length drift out of range.
- **Playback**: `src/ui/useGame.ts` runs `step` right away but plays the resulting events one at
  a time. HP bars and clout count up event by event, and the battle stays on screen until its
  final blows have played.

## Battle Rap judging

Typed bars are judged by one Vercel function, `api/judge-bar.ts`, so no API key reaches the
browser. Shared server code lives in `server/`.

1. **Rhyme, in code** (`server/rhyme.ts`): the last word of the player's bar against the enemy's,
   by their pronunciations in the CMU Pronouncing Dictionary. Perfect, slant and multi-syllable
   rhymes score higher; repeating the enemy's word doesn't count. Slang the dictionary doesn't
   know comes from `server/slang.ts`, then from spelling.
2. **Everything else, by [Jev](https://docs.typesafe.ai)** (`server/jev.ts`): one request with
   typed questions for wit, relevance, flow, rhymes-by-ear, injection and gibberish. Jev answers
   with probabilities, not text. Failures get one quick retry (408, 429, 5xx, and 499, which Jev
   returns now and then for a bar it judges fine a moment later). If Jev still fails (no key,
   rate limit, timeout), the bar is scored on its rhyme with a neutral quality, which tops out at
   decent.
3. **Logging** (`server/barLog.ts`): every bar, its rhyme and Jev's answers go to Upstash Redis
   after the response is sent, keeping the latest 100,000. No IP addresses are stored.

Jev only judges taste. The game's rules are enforced in code, where they can't be argued with:
the rhyme check above, and the two-line rule (`isHalfBar` in `src/engine/bars.ts`, applied by
`barScore` in the engine). The enemy's bar is looked up from game content on the server, never
taken from the request. If the judge can't be reached, the game switches to pick mode, so the
network never costs a turn.

**Local dev**: `npm run dev` serves `api/` too (a Vite plugin in `vite.config.ts`). Put
`TYPESAFE_API_KEY=...` in `.env.local` (gitignored) to judge with Jev; without it bars are
scored on rhyme alone. `npm test` never sees these keys: the plugin doesn't run under Vitest.

**Evaluating the judge**: `eval/battle-bars.json` holds 40 labeled bars (great, mediocre,
off-topic, gibberish, injection attempts). `npm run eval:judge` runs them through Jev three times,
measures agreement with the labels, injection and gibberish handling, latency and cost, writes
the summary and every verdict to `eval/results/<time>.json` (gitignored), and fails if Jev misses
the bar to ship. Run it before changing the questions, levels, thresholds or quality weights.
`npm run export:bars` pulls logged bars to label and add.

The first runs (October 2026, `jev-1.13.0`) cleared the bar: 100% of verdicts within one tier of
the label and 88% exact, every gibberish bar flopped, 22–23 of 24 injection attempts rejected and
none above decent, p95 latency about 250 ms, about $0.04 per 1,000 battles. What's left to tune:

- Jev is generous to flat but on-topic rhyming bars. Half the "mediocre" labels land in fire,
  because relevance and flow come out high for any direct answer; wit is the score that tells
  great from mediocre.
- The reject thresholds (`JEV_THRESHOLDS`) have room. Honest bars scored at most 0.09 for
  injection and 0.03 for gibberish, while the weakest true cases scored 0.45 and 0.31 (they still
  flopped on quality). The labeled set has no slang-heavy honest bars, so lower them only once
  logged bars show it's safe.
- The balance sim's typed bars (`botBar` in `test/sim.ts`, quality ~ N(5.5, 2)) run lower than
  real ones: the great and mediocre eval bars scored 5–9 on quality.

**Setting it up on Vercel** (once):

- Project → Settings → Environment Variables: `TYPESAFE_API_KEY` (from
  [console.typesafe.ai](https://console.typesafe.ai/keys)) for Production and Preview. Never
  prefix it with `VITE_`.
- Storage → add **Upstash Redis** from the Marketplace and connect it to the project for the same
  environments. `server/barLog.ts` reads `KV_REST_API_URL` / `KV_REST_API_TOKEN` (what the
  Marketplace sets) or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`; a custom prefix on
  the connection breaks that. Neither problem fails a request: without the store the
  `cypher:bars` list just stays empty, and without the key every logged bar says
  `"judged": false`.
- Firewall → a rate-limit rule for `/api/judge-bar` (e.g. 20 requests per 60 s per IP).
  Hobby allows one. The game also sends one GET there per session to check the judge is up
  before offering typing.

## Art

Character sprites are composited from the
[Universal LPC Spritesheet Character Generator](https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator)
by `scripts/build-sprites.mjs`. Each character is a recipe of layers and colors. The script
pins the generator to a specific commit, caches downloads in `scripts/.lpc-cache/`, and writes:

- `public/sprites/<id>.png`: 8 frames of 64×64 (front, back, faint×6)
- `public/CREDITS.md`: the attribution the layer licenses require (CC-BY-SA 3.0 / GPL 3.0 /
  OGA-BY 3.0). The in-game Credits screen links to it.

To change a character's outfit, edit its recipe in `CAST` and run `npm run sprites`. To replace
the art entirely, drop in PNGs with the same strip layout.

The skyline is hand-placed SVG pixel art (`src/ui/stage/Skyline.tsx`). Fonts are Silkscreen and
Pixelify Sans (OFL), self-hosted through `@fontsource`. The palette is Dracula, defined as tokens
in `src/ui/theme.css`.

## Audio

All music and sound effects are synthesized in the browser with the Web Audio API. There are
no audio files. `src/ui/audio/` has a tiny synth (pulse, triangle and noise channels like old
consoles), a step sequencer, and the songs. "Blue Line Zen" plays while exploring: lo-fi hip-hop
with a shakuhachi-style lead, koto plucks in the Japanese *in* scale, swung boom-bap drums with
taiko fills, wind chimes and vinyl crackle, all on chip voices. "Shamisen Showdown" plays in battles:
mid-tempo and low-pitched, driven by a plucked shamisen riff and taiko, with a slightly higher,
faster version for the boss. Songs are
written as text, one 16th note per token, in `music.ts`. Browsers only allow audio after a tap
or key press, so audio unlocks on the first interaction. Phones can leave audio silent after
an app switch while claiming it's still playing, so a watchdog checks that the audio clock is
really moving. If it isn't, it restarts the output, and failing that the next tap rebuilds
the audio context (`test/audio.test.ts` covers these cases).

## Deploying

The game is static files plus one function (`api/judge-bar.ts`, Battle Rap's judge). On a
static-only host everything works, but Battle Rap falls back to pick mode.

- **Vercel**: import the repo, set **Root Directory** to `web`. The Vite preset is detected
  automatically (build `npm run build`, output `dist`).
- **Render**: create a Static Site with root directory `web`, build command
  `npm install && npm run build`, and publish directory `dist`.
