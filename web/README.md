# Chicago Wars (web)

A turn-based street RPG in the browser: twelve blocks of Chicago, a King at The Bean, and a
pigeon that steals your fries. It's a from-scratch rebuild of the 2020 Java console game in the
repo root.

Vite + React 19 + TypeScript (strict). A static single-page app with no backend; saves live in
`localStorage`.

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
  Goons, Thugs and Bikers may run off below 20% HP with a parting line (`flee` on their
  definition), which counts as a win: same clout, heal, level progress and move offers.
- **Vendors** (Plug, Gangsta, hot dog cart) aren't random encounters. They're recurring
  characters you can visit once per block from the explore menu. Walking only leads to fights
  and street events.
- **The Gangsta** keeps a free playbook: any move the hero passed on after a win or forgot to
  make room (`GameState.seenMoves` minus what they know) can be learned again at no cost, within
  the 6-move limit. He also runs one training session per visit: a fixed boost to any stat for
  clout, with every session making the next one pricier (`TRAINING` in `balance.ts`).
- **Dialogue**: everyone raps except Goons. Lines are pools in `src/content/`, and
  `pickFresh` (`src/engine/lines.ts`) avoids repeating recent picks.
  `test/content.test.ts` checks that every rapper's spoken lines are two-line bars.
- **Tuning** lives in `src/engine/balance.ts`. Per-item numbers (skill cooldowns, enemy moves,
  opening odds) sit next to their content. After changing either, run `npm run sim`.
  `test/balance.sim.test.ts` fails if the win rate, fight length or run length drift out of range.
- **Playback**: `src/ui/useGame.ts` runs `step` right away but plays the resulting events one at
  a time. HP bars and clout count up event by event, and the battle stays on screen until its
  final blows have played.

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

The output is plain static files, so any static host works.

- **Vercel**: import the repo, set **Root Directory** to `web`. The Vite preset is detected
  automatically (build `npm run build`, output `dist`).
- **Render**: create a Static Site with root directory `web`, build command
  `npm install && npm run build`, and publish directory `dist`.
