# 00 — Rules of the road

Field 28 is a choose-your-own-adventure with a spine. You may skip a side quest. You may not walk off with a second airplane that never comes home.

## The shape

```
S0  published trainer          (done)
S1  named numbers + tick test
S2  the step() contract, enforced
S3  briefing that tells the truth
S4  a real pattern, not an orbit
S5  you fly that pattern, scored locally
S6  weather becomes an argument     <-- gate to Public World
S7  a log on this machine
S8  another human, without a referee

Side quests branch off the spine and merge back.
Public World starts at S6 and uses the same step().
```

Required work is the **spine**. Do it in order. Each chapter assumes the previous acceptance test is still true.

**Side quests** are optional lessons: the panel, sound, failures, views, a second airframe as data. They merge back into the same files. A quest that cannot merge is not a quest. It is the start of a trainwreck. Read [07 — Trainwrecks](07-trainwrecks.md) before you invent a new quest.

**Public World** is the second track: real airports, a patch of real terrain, a real METAR. It is still this page, still this `step()`. It is not a new repository and not a new physics engine sitting beside the old one "for a while".

## What "given up" means

Every side quest and every Public World chapter has a **Given up** section. It is the point of the book.

A real project does not get every feature. Choosing the panel means you are not, that week, fetching terrain. Choosing a client-side friend means you do not have a referee who can call a crash for both of you. Write that cost in plain language before you write the code. A student who cannot say what they gave up does not understand the chapter.

Skipping is allowed. Starting two quests that edit `src/sim/fdm.ts` at the same time is not. Finish one, commit, then open the next.

## Why this is not a set of real branches

A true fork — physics on one branch, scenery on another, multiplayer on a third, merged "someday" — feels like freedom and costs the airplane:

- Nobody can say which `main` is the one the published site flies.
- `fdm.ts` conflicts are not text conflicts. They are two theories of lift.
- A student clones the repo and cannot tell which README is telling the truth.
- The lead pilot cannot review three theories at once.

So the adventure is a sequence of **choices recorded on main**, not a tree of abandoned mains. The choice is written down. The code that lost stays as a paragraph in the chapter, not as a living branch.

Short-lived branches for one chapter are fine if you merge them the day the acceptance test passes. A branch older than that chapter is a smell.

## Commit points

Commit at the vital point only: the acceptance test passed, the chapter's "given up" text is still true, and a stranger can fly the result.

Do not commit:

- a broken tick test "to save work"
- a half-replaced flight model
- a downloaded pack with no license note
- the next chapter's scaffolding "while we're here"

Message shape: [templates/commit.md](templates/commit.md).

Suggested log, so the history reads like the book:

```
S0: publish the reduced-order trainer
S1: name the aero numbers and lock the tick test
S4: fly a rectangular pattern through the same step()
Q-panel: drive the six-pack from Ship only
P2: add KBOI geometry beside Field 28, school field stays
```

Push only when the lead pilot says so. A local commit is the save point. The published site moves only on purpose.

## What any chapter is allowed to use

| Always | Only when the chapter says so |
|---|---|
| This repo, the existing `step()`, Three.js, the browser | A public pack (airports, DEM, METAR, JSBSim wasm) |
| A headless script that ticks the model | A search harness to find and verify that pack |
| `localStorage` | A tiny proxy if a public URL has no CORS — page must still fly without it |
| The P2P mailbox *after* S8, and only as a mailbox | Accounts, a database, a physics server — almost never |

If a chapter needs a search and a download, it is marked `Harness: search, then code`. The search harness does not edit `fdm.ts`. The coding harness does not browse the web hoping a license appears. That split is the whole of [02 — Harnesses](02-harnesses.md).

## Done, for a student

You can explain, without looking:

1. Where forces are integrated, and where they are not.
2. What this chapter gave up.
3. What the next required chapter is, and why you are not doing it yet.
4. Which harness did the work, and which one was the wrong tool.
