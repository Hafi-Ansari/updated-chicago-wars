# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Chicago Wars": two versions of the same game live here.

- **`web/`**: the current version, a browser RPG rebuilt from scratch in Vite + React 19 + TypeScript (strict). A static SPA plus one Vercel function (`api/judge-bar.ts`, the Battle Rap judge); saves live in `localStorage`. **This is where active work happens.** `web/README.md` covers gameplay systems, sprites (LPC generator), synthesized audio and deploying.
- **Repo root `*.java`**: the original 2020 text-based console RPG (AP CS project), kept for reference. See [Java version](#java-version-reference) at the end.

## Web: commands

Run from `web/` (run `npm install` first if `node_modules` is missing):

```sh
npm run dev          # Vite dev server
npm test             # all tests, including the 2,000-run balance simulation
npm run sim          # balance report: win rate, run length, deaths by block
npm run lint         # Biome lint + format check; `npm run format` auto-fixes
npm run typecheck    # tsc -b (app, node and test projects)
npm run build        # typecheck + production build into dist/
npm run sprites      # rebuild public/sprites/*.png from the LPC generator (needs network)
npm run eval:judge   # live Battle Rap judge evaluation (calls Jev; TYPESAFE_API_KEY from env or .env.local)
npm run export:bars  # pull logged Battle Rap bars from Upstash into eval/candidates/
```

Single test file or test name: `npx vitest run test/step.test.ts`, `npx vitest run -t "is deterministic"`. After changes, run `npm test` and `npm run lint`.

Style is enforced by Biome: single quotes, no semicolons, trailing commas, 2-space indent, 100-column lines.

## Web: architecture

Three layers, one direction: `src/content/` (data) → `src/engine/` (rules) → `src/ui/` (React). The UI also reads content directly, e.g. move and skill names.

- **Engine API**: `newGame(name, seed)` and `step(state, action) → { state, events }` in `src/engine/step.ts`; the UI imports through the `src/engine/index.ts` barrel. `step` runs an immer `produce` over `GameState` and dispatches on `state.phase.kind` (`explore | battle | dialogue | shop | learnMove | gameOver | victory`) in `handle()`. An invalid action returns **the same state object**, and `useGame` relies on that reference check to ignore it. The RNG state is written back only when the action was valid.
- **Purity**: `src/engine/` and `src/content/` must not use `Math.random`, `Date` or React. A Biome `noRestrictedImports` override and `test/purity.test.ts` enforce this. All randomness goes through the seeded `Rng` (`src/engine/rng.ts`, mulberry32, state is a single uint32 stored in `GameState.rng`). `GameState` must stay plain JSON (no classes or functions) because it is saved as-is.
- **Contexts**: engine helpers receive a `StepContext` (`rng`, `emit(event)`, `pick(key, pool)`). `pick` uses `pickFresh` to avoid recently used lines and records them in `state.recent`. Combat code gets a `CombatContext` that adds `hero`, `enemy`, `battle` and run stats (`src/engine/combat/context.ts`).
- **Effects are data**: one `Effect` union (`src/engine/types.ts`) describes what hero moves, Plug gear (`SKILLS`), enemy moves and openings do. `applyEffects` in `src/engine/combat/effects.ts` resolves them. All damage goes through `rollAttack` / `applyDamage` / `applyHeal` in `combat/damage.ts`. A battle round's order and the "opening" mini-choice live in `combat/turn.ts`.
- **Events, not text**: the engine emits structured `GameEvent`s. The UI consumes them in several places: `src/ui/narration.ts` turns them into text-box lines (the engine never formats combat text itself), `src/ui/useGame.ts` queues and plays them one at a time while updating displayed HP and clout, `src/ui/stage/Stage.tsx` animates them and `src/ui/audio/useGameAudio.ts` plays sound effects. `useGame` keeps the finished battle on screen (`shown` lags `game`) until its last events have played.
- **Dialogue**: NPCs (`gangsta`, `plug`, `hotDogVendor`) are node graphs in `src/content/npcs.ts` (`DialogueNode` with `lines`, `choices`, `require` conditions, `NpcEffect`s, `next`), walked by `src/engine/dialogue.ts`. Text placeholders such as `{hero}` and `{enemy}` are filled by `fill()` (`src/engine/text.ts`); the full list is in `src/content/types.ts`.
- **Tuning**: global numbers are in `src/engine/balance.ts`. Per-item numbers sit with their content: move power and PP in `moves.ts`, gear price and cooldown in `skills.ts`, enemy move weights in `enemies.ts`, opening odds in `openings.ts`. `test/balance.sim.test.ts` runs a bot (`test/sim.ts`) through 2,000 seeded runs. It fails if the win rate leaves 30–70%, if fights average outside 2–6 rounds, or if a run averages outside 40–150 actions. Check `npm run sim` after any tuning or content change.
- **Battle Rap**: in the engine, a `battleRap` action runs `startCypher` (`src/engine/combat/cypher.ts`, prompts in `src/content/cyphers.ts`), which leaves `battle.cypher` pending, like `battle.opening`. Only a `spit` action carrying a `BarResult` (`typed` / `picked` / `timeout`) is accepted until it resolves through `barScore` → `tierOf` → `CYPHER_EFFECTS`. Typed bars are judged by the only Vercel function, `api/judge-bar.ts`, whose code lives in `server/`: `rhyme.ts` scores rhymes on the CMU dictionary, `jev.ts` asks Jev via `@typesafe-ai/sdk`, `judgeBar.ts` is the pipeline and `barLog.ts` logs to Upstash. The UI (`RapBattle.tsx`, `src/ui/judge.ts`) calls the function and puts the verdict in the `spit` action, so the engine stays pure. Jev judges only taste: funny (crude jokes count if they land), clever, relevance and flow as 0–10 "marks", plus flags for injection and gibberish; `verdictFrom` turns them into quality (`JEV_QUALITY`: punch carries the score, flow and relevance only nudge it). Game rules are enforced in code: the rhyme, and the two-line bar (`isHalfBar` in `src/engine/bars.ts`, where one line scores half). The marks also reach the engine, where `calloutsFor` turns them into `callout` events (thresholds in `CYPHER.callouts`). Those events play between the hero's bar and the crowd's reaction, and the stage flashes them (`CALLOUTS` in `src/ui/narration.ts`). `npm run dev` serves `api/` through the `localApi` plugin in `vite.config.ts` (keys from `.env.local`). The design, Vercel setup and eval results are in `web/README.md` → Battle Rap judging.

### Adding things

Ids are string unions in `src/engine/types.ts`, and content is typed `Record<Id, Def>`, so `npm run typecheck` lists every place a new id must be defined. Beyond that:

- **New `StatusKind`**: add wording to `STATUS_TEXT` in `src/ui/narration.ts`, add a tag to `STATUS_TAGS` in `src/ui/stage/HpBox.tsx` and implement its behavior in `src/engine/combat/status.ts` / `stats.ts`.
- **New `EnemyKind`**: add stats to `ENEMY_STATS` in `balance.ts`, a def to `ENEMIES` and a sprite. Regular enemies also need a weight in `enemyWeights`; named end-of-run enemies go in `GAUNTLET` instead and need a `name` and `entrance` on their def (they don't scale with the block and can't be fled). Sprites load by id from `public/sprites/<id>.png`; add a recipe to `CAST` in `scripts/build-sprites.mjs`, then run `npm run sprites`.
- **New phase or action**: handle it in `handle()` (`step.ts`), in `src/ui/components/ActionPanel.tsx` and in the bot's `chooseAction` in `test/sim.ts`. The bot is what keeps the balance test passing.
- **New `GameEvent`**: handle it in `narration.ts`, plus `useGame.ts`, `Stage.tsx` and `useGameAudio.ts` if it changes HP or clout or needs animation or sound.
- **New gear**: give it a `category` and a place in `SKILL_ORDER` (`src/content/skills.ts`); `test/content.test.ts` checks both. Add it to the bot's `SHOP_PRIORITY`/`GEAR_PRIORITY` in `test/sim.ts` if a sensible player would buy it, or the balance test won't see it.

## Web: gotchas

- **Server imports**: Vercel runs `api/` as plain Node ESM, so every relative import reachable from `api/judge-bar.ts` needs a `.js` extension (`'./rhyme.js'`), and the game modules it shares (`src/content/cyphers.ts`, `src/engine/balance.ts`, `src/engine/bars.ts`) must have no runtime imports of their own (type-only imports are fine). Vite and the tests don't care, so a mistake would only break in production; `test/server-imports.test.ts` walks the import graph to catch it.
- **Keys stay out of tests**: the `localApi` plugin copies `TYPESAFE_*` / `UPSTASH_*` / `KV_*` from `.env.local` into `process.env` for `npm run dev`, and skips itself under Vitest (`process.env.VITEST`). Without that guard, `npm test` calls Jev live, and the endpoint tests could write to the real bar log. Those tests (`test/judge.test.ts`) also clear the variables themselves.
- **Changing the judge**: before changing Jev's questions or level wording, `JEV_THRESHOLDS`, `JEV_QUALITY` (`server/jev.ts`), the `CYPHER` tiers or `CYPHER.callouts`, run `npm run eval:judge` (live; needs the key; costs a fraction of a cent). It fails below the bar to ship and writes the summary and every verdict to `eval/results/` (gitignored); when Vitest doesn't print the summary table for a passing run, read it there. `test/judge.test.ts` covers the same code offline with fake Jev responses. Tier or `CYPHER_EFFECTS` changes also move the balance numbers, so check `npm run sim` too.
- **Rap input on phones**: phone keyboards have no Shift+Enter, so in `RapBattle.tsx` Enter on line one inserts the line break and Enter on line two spits; "Spit it" stays disabled until there are two lines. Don't bring back Enter-to-submit. The input setting is `type` | `pick`, default `type` on every device; an older saved `auto` loads as `type`.
- **Player-facing text stays in-world**: guidance is written in the game's voice, not as form instructions. For example, the rap box explains the two lines as "the setup" and "the punchline".
- **Save format**: the game autosaves `GameState` to `localStorage`, and runs in progress on the deployed site should survive updates. When `GameState` changes shape, bump `GameState.version` (`types.ts`) and `SAVE_VERSION`, and add a migration step to `migrateSave` in `src/engine/save.ts` that fills in the new fields (including inside a saved `battle` or `npc`). `loadSave` in `src/ui/storage.ts` runs every save through it; `test/step.test.ts` has migration tests.
- **Content tests** (`test/content.test.ts`): every spoken line of a character who raps (everyone except Goons, i.e. `rhymes: true`) must be a two-line bar with `\n` between the lines. The hero's battle lines and every move's `lines` must be bars too. Pools have minimum sizes.
- **Music** is written as text in `src/ui/audio/music.ts`, one 16th note per token. `test/music.test.ts` requires every bar to have exactly 16 tokens, every layer to have the same bar count, and every note to be valid.
- **Seeded tests**: tests seed the RNG and often loop over seed ranges. Adding, removing or reordering RNG calls (including adding lines to a pool that is `pick`ed) shifts every later roll. That can change seeded outcomes and the balance numbers.

## Java version (reference)

No build tool, dependencies or tests. All sources are in the default package at the repo root. Originally developed in BlueJ; BlueJ metadata and `.class` files are gitignored.

```sh
javac -d out *.java
java -cp out RPGRunner
```

The game is interactive (reads `System.in` with `Scanner`), so it can't be run unattended; to exercise it non-interactively, pipe input, e.g. `printf 'Name\n\n1\n...' | java -cp out RPGRunner`. Note `ScrollText` sleeps per character, so output is slow.

- **Class hierarchy**: `Character` (name, health) → `BattleCharacter` (attack, defense) → `Hero` (adds clout) / `Enemy`; `Character` → `NPC` → `Gangsta`, `Plug`. `Character` shadows `java.lang.Character` within this package.
- **Game loop**: `RPGRunner.main` creates the `Hero` and the `HiddenSkill[5]` array, then calls `RandomEncounter.e(hero, skillArray)` until hero health ≤ 0.
- **Encounters** (`RandomEncounter.e`, roll 1–10): 1–4 fight a random `Enemy` (name/type from `EnemyCreation`, stats set by type, then `Battling.fight`); 5–6 meet a `Gangsta` (talk for +10 clout, trade clout for attack/defense); 7–10 meet a `Plug` (buy hidden skills with clout).
- **Combat** lives in static methods on `Battling`. Menu choices 1–3 are Fight/Run/Stats; choices 4–8 map to `skillArray[0..4]`. Defeating an enemy awards clout equal to its attack.
- **Static utility classes**: `RNDM.i(low, high)` (inclusive random int, used everywhere for randomness), `EnemyCreation`, `RandomEncounter`.

Gotchas:

- `HiddenSkill.getState()` returns `locked`: `true` means **locked/unavailable**. Code checks `getState() == false` to allow use.
- Skill menu labels (`HiddenSkill.name`) are rewritten at the start of every encounter in `RandomEncounter.e`, including embedded `\t` padding to align the combat menu; the labels set in `RPGRunner` are overwritten. Plug prices and purchase messages are hardcoded per index in `Plug.trade`.
- Enemy types are compared with `==` on string literals (works only because they're interned constants from `EnemyCreation.enemyType`); keep type strings in sync across `EnemyCreation`, `Enemy.introWords` and `RandomEncounter`.
- `System.out.print('\u000C')` is a form feed that clears the BlueJ terminal; it's a no-op/garbage in other consoles.
- Each method creates its own `Scanner(System.in)`; mixing `nextInt()` and `nextLine()` is handled with trailing `nextLine()` calls. Preserve these when editing input handling.
