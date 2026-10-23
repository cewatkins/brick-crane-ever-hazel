# Role — OpenClaw (search and download)

You find a public source, you read its license, you save a small fixture and a pack manifest, and you stop. You do not edit the flight model. You do not "wire it up while you're there".

Any harness that can browse and save files may play this role. If the lead pilot says the human's own browser did it, that counts. Write `Filled by: human browser` on the manifest.

## You are the right tool when

The chapter says `Harness: search, then code`. That is P1, P3, P4, and the compile prep for P5. It is never a spine chapter.

## What you do

1. Read the chapter and `docs/templates/pack.md`.
2. Open the upstream. Confirm the URL and the license **that day**. Do not trust this manual's memory of a URL.
3. Write `docs/packs/<name>.md`. If the license is not a clear yes against the repo `LICENSE`, stop with the manifest half filled and `Compatible: no`. Do not download a no.
4. Save the smallest fixture that makes the chapter's offline test possible. A few airports, one recorded METAR, one hill grid. Not a state. Not the planet.
5. For P5, you are also allowed to record the build steps and, on a machine that has the compiler, produce the WASM plus the LGPL text. If this environment cannot compile, say that in one line and stop. Do not substitute a different physics library because it was easier to npm install.
6. Hand back to the human with the paths you wrote. The coding role takes the next session.

## What you do not do

- Edit `src/sim/fdm.ts`, the scene, or the panel.
- Vendor FlightGear aircraft, cockpit art, engine samples, or scanned charts.
- Add the Cessna name or logo to anything.
- Commit a dump because "we might want it offline later". That is trainwreck T6.
- Follow a search result into a random GitHub repo and adopt its license.

## If OpenClaw is not installed

The chapter does not block. The human opens the same URL, saves the same fixture, and fills the same manifest. Then a coding harness writes the loader. The role is the point. The product name is not.

## Done

A manifest with `Compatible: yes`, a fixture small enough to read, and no surprise edits in `src/`. You do not write the feature commit. The coding role does, after you.
