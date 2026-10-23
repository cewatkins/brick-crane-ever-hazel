# 07 — Trainwrecks

These are the choices that look like progress in week one and leave the next student with two airplanes, neither of which flies. Each one is a real engineering option. We are not taking it. The **Given up** line is what that refusal costs, so you can reopen the decision later with your eyes open.

A trainwreck is not "a bad idea in the abstract". It is a fork that does not merge.

---

## T1 — Two flight models, and no diff

**What it looks like.** Someone pastes JSBSim, or a "better" integrator, into a new file. The page quietly starts calling it. The reduced model stays in the tree, untested, "for reference".

**Why it wrecks.** From that day, a bug report does not name a function. S1 goes red and nobody knows which model the site is flying. Students learn to fear `fdm.ts` instead of reading it.

**The disciplined version** is P5: same input tape, both models, a written diff, reduced model still the default.

**Given up by refusing T1:** the thrill of a smarter model this week. You wait until the pipe and the test exist.

---

## T2 — Long-lived branches that will merge "when ready"

**What it looks like.** `physics`, `scenery`, and `multiplayer` each live for a month. Main is whatever the published site happened to build.

**Why it wrecks.** `fdm.ts` conflicts are two theories of the airplane. The manuals disagree. A new student clones one branch because the README on it is longer.

**The disciplined version** is this book: choices recorded on main, side quests merged before the next shared edit, branches no older than the chapter.

**Given up by refusing T2:** parallel speed. Two people do not edit the model at once. That is the point.

---

## T3 — An authoritative room server

**What it looks like.** One process owns `step`. Browsers send inputs and receive state. Crash, weather, and score finally agree.

**Why it wrecks this project.** The published page can no longer fly alone. Every student now needs that process, that bill, and that outage. The lesson stops being "I can read the integrator" and becomes "I can keep a service up". It is a fine architecture for a combat sim with cheaters. It is a bad trade for a free trainer whose first virtue is that it opens.

**Also a wreck if done halfway:** the server steps, and each client also steps, and you average them. That is two models plus a smear.

**The disciplined version** is S8. A ghost, or a mailbox of inputs, each client stepping itself. Solo flight works with the network cut.

**Given up by refusing T3:** one shared truth. Two browsers can disagree about a landing. You will feel that loss the first time it happens. It is still the right loss.

A signaling relay or a METAR proxy is not T3, **if** the airplane still flies when they are gone. The moment the page refuses to start without them, you have built T3 by accident.

---

## T4 — Vendoring someone else's airplane

**What it looks like.** Copy FlightGear's C172, a cockpit photo, a Lycoming sample, a scanned chart, the Cessna logo "just on the briefing".

**Why it wrecks.** The repo becomes undistributable, or GPL, or both, and the UI becomes a trademark problem. A student who thought they were learning a harness has published someone else's work.

**The disciplined version:** public numbers in a table you wrote, geometry you drew in code, licenses written down in P0 and in every pack manifest.

**Given up by refusing T4:** how pretty the first screenshot could have been. The published Phase 0 is the evidence that procedural can still be a place.

---

## T5 — Accounts, because a logbook "should sync"

**What it looks like.** S7 grows a user table, a login wall, and a scoreboard.

**Why it wrecks.** Half the chapters become auth chapters. The flight model stops moving. Visitors bounce off a wall on a site that used to fly in one click. Per-user data is a real product. It is not this spine.

**The disciplined version:** `localStorage`, and a sentence in S7 that says the phone and the laptop do not share a log.

**Given up by refusing T5:** continuity across devices. A pilot who flies on two machines keeps two logs. You can reopen this after P7, as its own product decision, not as a surprise inside a flight chapter.

---

## T6 — Fetching the world into git

**What it looks like.** Commit the OurAirports dump, a state of DEMs, every METAR for a year, a WASM build with no notice.

**Why it wrecks.** The repo stops being something a student will clone on a laptop. History becomes a hard drive. Licenses are whatever was true the day someone clicked download.

**The disciplined version:** a small fixture in git, a manifest with the URL and the license, a runtime fetch that may fail closed to the fixture.

**Given up by refusing T6:** offline access to every airport. You get offline access to the ones you bothered to fixture. That is the honest set.

---

## T7 — The panel that is secretly a simulator

**What it looks like.** The attitude indicator integrates gyro error, the altimeter lags with its own weather, the HSI tracks a VOR the flight model has never heard of.

**Why it wrecks.** There are now two states called "pitch". They diverge. Every screenshot is an argument.

**The disciplined version:** Q-panel. Needles read `Ship`. A display filter may be short. It may not have memory of its own energy.

**Given up by refusing T7:** instrument-flight training that includes instrument failure. That can be a later quest whose error is a pure function of `Ship` plus a failure flag from Q-failures. It still does not integrate a private pitch.

---

## How to reopen a trainwreck

Write a decision record from [templates/decision.md](templates/decision.md). Name the trainwreck. Say what changed in the world so the cost is now worth it. Get the lead pilot to commit it **before** the code. A reopened T3, in particular, means this manual's promise ("the page flies with the network cut") is rewritten in the same commit. If you cannot rewrite the promise, you cannot reopen the choice.
