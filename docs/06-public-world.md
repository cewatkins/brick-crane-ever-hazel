# 06 — Public World

The second track. A free trainer that can show a real airport, a patch of real ground, and the wind that airport is actually reporting. Still one page. Still `step()`. Still flyable with the network cut, because every pack has a fixture committed beside it.

**Closed until S6 is on main.** The weather argument is the socket these chapters plug into. Without it, a METAR is a decoration.

**Harness pattern for every P-chapter:** search, then code. See [02](02-harnesses.md). OpenClaw or a human browser fills a pack manifest. Grok CLI or OpenCode writes the loader. The search role does not edit the flight model.

## Laws for this track

1. Field 28 remains selectable. The school strip does not get deleted because a real runway is more impressive.
2. Packs are fetched by the browser or baked as a small fixture. No pack is a gigabyte in git.
3. Every pack has a manifest in `docs/packs/` before code references the URL. Template: [templates/pack.md](templates/pack.md).
4. The code license of this repo is an open decision. Pick it (MIT and Apache-2.0 are the usual choices for original code) **before** P1 merges, and write it in `LICENSE`. Pack licenses have to sit next to that choice on purpose. Do not let a pack choose your license by accident.
5. No Cessna, no Textron marks, no scraped approach plates, no FlightGear aircraft files. Facts and numbers from a handbook are usable. Their drawings and prose are not.
6. If a service is down or blocked, the fixture flies. A chapter that only works online has failed.

## What you give up by opening this track at all

The guarantee that a checkout is the whole world. From P1 on, "why does this airport look wrong?" can be an upstream data bug. You also give up the right to improvise geometry. A real runway that is 200 ft off is a bug. On Field 28 it was a design choice.

You do **not** give up the reduced model. JSBSim, if it comes, is a comparison. The page flies the reduced model when WASM is absent.

---

## P0 — Write the license down

**Harness:** the lead pilot, not an agent. An agent may prepare the text. The human commits the choice.

**Work:** add `LICENSE` for original code. Add `docs/packs/README.md` that says how a manifest works. List the refusals: no FlightGear GPL aircraft vendored into a non-GPL tree, no Jeppesen, no "Cessna" in the UI.

**Given up:** ambiguity, which was comfortable. Also given up: GPL-only assets, unless the lead pilot knowingly switches the whole repo to GPL. That switch is a different decision and it is not the default, because it eats every future quest.

**Acceptance:** `LICENSE` exists, and a student can say what they may copy. Commit `P0: license the original code before any pack`.

---

## P1 — Airports as data

**Harness:** search, then Grok CLI.

**Look up:** the OurAirports data dump and the statement that it is public domain. Confirm it the day you do the chapter. URLs move.

**Work:** a loader that reads a fixture CSV (a handful of Idaho fields, including the Boise airport and one quiet strip) checked into `src/sim/packs/fixtures/`. Optional runtime fetch of the full dump is allowed only if the fixture path works offline. Parse runways into the same shape Field 28 already has: threshold, heading, length, width, elevation.

**Given up:** every airport on earth in the binary. Also given up: taxiways, aprons, and lighting databases. Runways first. A dot on a map with no runway is a teaser, not a field you can land on.

**Acceptance:** with the network blocked, the fixture fields list and one of them can be selected. Field 28 is still on the list. Commit `P1: public-domain airports, fixture first`.

---

## P2 — One real strip, same airplane

**Harness:** OpenCode, after P1.

**Work:** selecting the Boise airport (or the quieter strip, if the lead pilot would rather not draw a Class C as a toy) builds the runway from the fixture numbers, sets field elevation from that data, and feeds S6's weather a wind default from the fixture until P3. The school field is one menu entry away. Label the view as geometry from OurAirports, not as an official depiction.

**Given up:** the 2400 m teaching strip's forgiveness, while that real runway is selected. Short fields will punish a late rotate. Keep the school field for S1's test. The tick test does not move to the real runway. Also given up: buildings, the terminal, and a claim of "the" Boise airport. You have a strip and a density altitude.

**Acceptance:** S1 still uses Field 28 and passes. On the real strip, the painted heading matches the data, and elevation matches the fixture. Commit `P2: one real runway beside the school field`.

---

## P3 — A METAR in the weather pipe

**Harness:** search, then Grok CLI.

**Look up:** a METAR source you may use, and whether the browser can call it (CORS). Aviation Weather Center is the usual public source. Confirm the terms that week.

**Work:** parse a METAR into the S6 weather object: wind, and altimeter if you are ready to show it. Commit one recorded METAR as the fixture.

If CORS blocks the browser, you have two honest options. Write down which one you took.

1. Fixture only, refreshed by a human when they care. The page never calls out.
2. One server function that proxies the METAR. It does not step the airplane. If it fails, the fixture loads.

**Given up:** a perfect now. A METAR is already minutes old. Also given up, if you pick the proxy: a purely static publish. Say so in the README. Also given up: gust models fancier than the amplitude S6 already has.

**Acceptance:** fixture METAR changes the windsock and the takeoff track with the network blocked. A live fetch, if you built one, failing on purpose falls back to the fixture. Commit `P3: METAR fills the weather argument`.

---

## P4 — A patch of ground

**Harness:** search, then OpenCode.

**Look up:** USGS 3DEP elevation for the United States. It is public domain. That is the default. OpenStreetMap is the other door, and ODbL share-alike can attach to a database you derive. If you take that door, write the obligation in the manifest before you fetch. Do not discover it after the mesh is pretty.

**Work:** one tile around the selected airport, sampled into a mesh the airplane can hit. `step` already crashes on attitude and sink rate. Add a ground height under the ship, from the mesh, defaulting to the flat field when no mesh is loaded. Field 28 stays flat. Commit a tiny fixture grid so the test does not download the Rockies.

**Given up:** the infinite sagebrush plane, on that airport. Also given up: the whole planet, photogrammetry, and trees that are solid. A hill you can fly into is the lesson. A city is a different product.

**Acceptance:** offline, the fixture hill produces a terrain crash that the flat field does not. S1's flat-field takeoff is unchanged. Commit `P4: a public-domain hill under one airport`.

---

## P5 — JSBSim beside the reduced model, not instead of it

**Harness:** search and compile, then OpenCode. Compiling WASM needs a machine with a real toolchain. This is the chapter most likely to leave the coding sandbox. Say so at the top. OpenClaw or the human prepares the build. The coding agent integrates a built artifact plus the LGPL notice. It does not pretend it compiled what it did not compile.

**Look up:** JSBSim's license (LGPL-2.1 as of this writing — confirm), and an aircraft definition you are allowed to use. FlightGear's `c172p` is GPL. Do not copy it into this repo unless the lead pilot has relicensed the whole project. Prefer a coefficient set you wrote from public numbers, loaded by JSBSim, so the license stays clean.

**Work:** the reduced `step` remains the default. A briefing toggle runs the same input tape through both and plots altitude and airspeed. Differences get a sentence in the chapter, not a silent switch.

**Given up:** the one-file audit. You now have a body of C++ you did not write, a WASM blob, and a duty to ship the license and a way to relink. Also given up: "JSBSim said so" as an excuse to delete the reduced model. The reduced model is the one a student can read in an afternoon. Keep it flying.

**Acceptance:** with the WASM file removed, the page flies the reduced model and S1 passes. With it present, the diff runs and writes a short report. `NOTICE` names LGPL. Commit `P5: compare JSBSim, fly the reduced model by default`.

---

## P6 — Dashboards

**Harness:** Grok CLI, after P1 and S7.

**Work:** one page, still the trainer, with a second surface you can open:

- the airport you selected, its runways, the wind from P3 or the fixture
- your local log from S7
- the pattern score from S5, if it landed
- traffic you can see (N344TG, plus a ghost or a peer from S8)

No new facts. The dashboard is a view on data the sim already stores.

**Given up:** a fleet operations center. Also given up: accounts, shared logs, and charts you do not have a license to redraw. FAA chart tiles have terms. Read them the week you are tempted, and if they do not fit, draw the runway from P1 numbers instead. A drawn runway you understand beats a scanned plate you do not.

**Acceptance:** the dashboard renders from a fixture with the network blocked, and it does not move the airplane. Commit `P6: a dashboard on data we already have`.

---

## P7 — The public release

**Harness:** the lead pilot. Agents may check the list. They do not declare the release.

**Work:** a release commit that a stranger can trust.

- README flies the airplane in one screen.
- `LICENSE` and `NOTICE` match what is actually in the tree.
- Field 28 works offline.
- One real airport works from fixtures offline.
- No Textron marks. No vendored GPL aircraft.
- The spine tests pass.
- The "given up" pages are still true. If a chapter secretly grew a room server, this release does not ship.

**Given up:** calling it done. Public World can always add another airport. The release is a tag, not a promise to stop.

**Acceptance:** a clean machine can open the published site and fly the school field with nothing installed. Commit `P7: public trainer, school field and one real strip`.

---

## Features a stranger will ask for

These are real, and they are not scheduled. Put them in a quest file when someone will actually fly them.

| Ask | Honest home |
|---|---|
| More views (spot, flyby, tower cab) | Q-views |
| A moving map | Q-map, then P1's positions under it |
| Night and runway lights | Q-night |
| Weight and balance | a quest after Q-second-airframe |
| PAPI / VASI | a quest that reads slope from `Ship` and the runway |
| Live other people | S8, with the referee still absent |
| A room server, shared crash, anti-cheat | [Trainwreck T3](07-trainwrecks.md). Do not schedule it |
| The whole western US at scenery-object detail | not this repo |
