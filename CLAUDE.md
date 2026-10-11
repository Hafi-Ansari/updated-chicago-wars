# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Chicago Wars": two versions of the same game live here.

- **`web/`**: the current version, a browser RPG rebuilt from scratch in Vite + React + TypeScript. **This is where active work happens.** See `web/README.md` for commands and architecture. Key points: `src/engine/` is a pure, deterministic engine (`step(state, action) → { state, events }`, seeded RNG stored in `GameState`) that must not import React, `Math.random` or `Date`; tuning numbers live in `src/engine/balance.ts`; run `npm test` (includes a balance simulation that fails if the win rate or run length drifts) and `npm run lint` after changes.
- **Repo root `*.java`**: the original 2020 text-based console RPG (AP CS project built to practice OOP, inheritance and polymorphism), kept for reference. Originally developed in BlueJ; BlueJ metadata and `.class` files are gitignored. The rest of this file describes the Java version.

## Build & run (Java)

No build tool, dependencies or tests. All sources are in the default package at the repo root.

```sh
javac -d out *.java
java -cp out RPGRunner
```

The game is interactive (reads `System.in` with `Scanner`), so it can't be run unattended; to exercise it non-interactively, pipe input, e.g. `printf 'Name\n\n1\n...' | java -cp out RPGRunner`. Note `ScrollText` sleeps per character, so output is slow.

## Architecture

- **Class hierarchy**: `Character` (name, health) → `BattleCharacter` (attack, defense) → `Hero` (adds clout) / `Enemy`; `Character` → `NPC` → `Gangsta`, `Plug`. `Character` shadows `java.lang.Character` within this package.
- **Game loop**: `RPGRunner.main` creates the `Hero` and the `HiddenSkill[5]` array, then calls `RandomEncounter.e(hero, skillArray)` until hero health ≤ 0.
- **Encounters** (`RandomEncounter.e`, roll 1–10): 1–4 fight a random `Enemy` (name/type from `EnemyCreation`, stats set by type, then `Battling.fight`); 5–6 meet a `Gangsta` (talk for +10 clout, trade clout for attack/defense); 7–10 meet a `Plug` (buy hidden skills with clout).
- **Combat** lives in static methods on `Battling`. Menu choices 1–3 are Fight/Run/Stats; choices 4–8 map to `skillArray[0..4]`. Defeating an enemy awards clout equal to its attack.
- **Static utility classes**: `RNDM.i(low, high)` (inclusive random int, used everywhere for randomness), `EnemyCreation`, `RandomEncounter`.

## Gotchas

- `HiddenSkill.getState()` returns `locked` — `true` means **locked/unavailable**. Code checks `getState() == false` to allow use.
- Skill menu labels (`HiddenSkill.name`) are rewritten at the start of every encounter in `RandomEncounter.e`, including embedded `\t` padding to align the combat menu; the labels set in `RPGRunner` are overwritten. Plug prices and purchase messages are hardcoded per index in `Plug.trade`.
- Enemy types are compared with `==` on string literals (works only because they're interned constants from `EnemyCreation.enemyType`); keep type strings in sync across `EnemyCreation`, `Enemy.introWords` and `RandomEncounter`.
- `System.out.print('\u000C')` is a form feed that clears the BlueJ terminal; it's a no-op/garbage in other consoles.
- Each method creates its own `Scanner(System.in)`; mixing `nextInt()` and `nextLine()` is handled with trailing `nextLine()` calls — preserve these when editing input handling.
