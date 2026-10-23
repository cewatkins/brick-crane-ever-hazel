# Field 28 — project instructions

This file is for any coding agent that opens the repo. The human-readable book is `docs/`. If this file and a chapter disagree, the chapter you were assigned wins, and only that chapter.

## What this is

A browser flight trainer. Product name: Field 28. Airplane: a 172-class trainer, callsign N172FD. Traffic: N344TG. Field elevation is Boise's, on purpose, so density altitude matters.

Not a Cessna product. Do not add the Cessna name, logo, or Textron marks to UI, copy, or commits.

## Before you write code

1. Read `docs/agents/README.md` and the role file for your harness.
2. Read `docs/03-where-we-are.md` so you do not "rebuild" Phase 0.
3. Read the one chapter you were assigned. Do not start the next one.
4. If the chapter has a "given up" section, do not quietly undo that choice.

## Laws of the airplane

- `src/sim/fdm.ts` is the only place that integrates forces. `step(ship, input, dt)` is the contract. The renderer reads state and draws. It does not invent lift.
- Axes: yaw 0 faces −Z. Positive yaw is a left turn. Positive roll is left wing down. Aileron +1 rolls left. Elevator +1 is pull. Rudder +1 yaws left. A control change that breaks this is a bug, not a taste.
- Fixed step is 1/60 s. Do not tie physics to frame time.
- One airplane definition in the air. A second airframe is a data table fed to the same `step`, never a copy of `step`.
- Client-side only. No authoritative physics server. A signaling mailbox or a weather proxy is allowed only when a chapter names it, and the page must still fly if that service is down.
- Auth and accounts stay off unless a chapter explicitly turns them on. A local flight log is `localStorage`.
- Public packs (airports, terrain, METAR, a JSBSim build) stay in the browser. Record the license in `docs/packs/` before the code fetches anything. Do not vendor FlightGear aircraft. Do not scrape charts.

## Commits

Commit when the chapter's acceptance test passes, not at the end of a long session. Message shape is in `docs/templates/commit.md`. Do not push unless the lead pilot asked in this conversation.

## Do not

- Open a second flight model "for later" in the same chapter that is supposed to keep the reduced model honest.
- Start Public World before spine chapter S6 has landed.
- Mix two side quests that both edit `fdm.ts`.
- Delete or rewrite the platform shell (`src/router.tsx`, `src/routes/__root.tsx`, `public/__grok/`) to "clean up".
