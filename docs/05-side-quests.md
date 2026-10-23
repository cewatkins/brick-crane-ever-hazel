# 05 — Side quests

A quest is optional. It merges back into main before the next spine chapter edits the same files. It has a **Given up** section that a student can read aloud. If you cannot write that section, do not start the quest.

Open a quest by copying [templates/side-quest.md](templates/side-quest.md) to `docs/quests/<id>.md` and filling it in **in the same commit that starts the work**, so the cost is on record before the code. Close it with the acceptance test.

Do not run two quests that list `src/sim/fdm.ts` in `Touches` at the same time.

The quests below are the ones worth doing. A new idea becomes a file of this shape, or it does not happen. Order among quests is free, except where a quest names a spine chapter it hangs from.

---

## Q-panel — a six-pack that cannot lie

**Hangs from:** S2. The instruments may only read `Ship`.

**Harness:** Grok CLI.

**Touches:** `src/components/flight-sim.tsx`, maybe a `src/components/panel.tsx`. Not `fdm.ts`, unless a needed instrument field is missing. If it is missing, add it in `step` and stop; do not compute it in the widget.

**Work:** attitude, airspeed, altimeter, vertical speed, heading, and a slip/skid ball if you can derive slip from the velocity and the body basis. Needles, not a second simulation. The current text readouts may stay as a backup row.

**Given up:** a photoreal radio stack, a G1000, and any instrument that integrates its own pitch "so it feels smooth". Smoothness is allowed as a display filter with a time constant under a fifth of a second. A filter that invents altitude is a second flight model. Also given up: licensed bezel art. Draw the gauges.

**Acceptance:** the needles match the text readouts within a stated slop at 60 Hz. Kill the network. They still move. Commit `Q-panel: six-pack reads Ship only`.

---

## Q-sound — the engine you already started

**Hangs from:** S0. The noise generator and the stall tone exist.

**Harness:** Grok CLI.

**Touches:** the audio block in `flight-sim.tsx` only.

**Work:** map RPM, not just the throttle lever, to the filter and the gain. A flap click. A stall horn that follows `ship.stalled`. Stay synthesized.

**Given up:** a recorded Lycoming. Those recordings are somebody's, and a sample pack would dominate the download of a trainer that is currently a page. Also given up: sound before the first click. Browsers block that. The briefing button is the click. Do not "fix" autoplay with a hack.

**Acceptance:** throttle changes the note after start, the stall tone matches the stall flag, and silence before start is still silence. Commit `Q-sound: RPM drives a synthesized engine`.

---

## Q-failures — the airplane can be unhealthy

**Hangs from:** S1, so the tick test exists. The tick test runs with failures **off**.

**Harness:** Grok CLI.

**Touches:** `fdm.ts` (a failure flag on the input or the weather object, not a copy of `step`), the briefing toggle.

**Work:** one failure at a time, selectable before start: partial power (thrust cap), or a heavy wing (a small constant roll moment). The flag is data. `step` applies it. There is a "none" setting and it is the default.

**Given up:** the promise that every flight feels like Phase 0. Also given up: a random failure in the middle of S4's pattern test. The pattern test and S1 run with failures off. If you make failure the default, you have broken the spine to make a point.

**Acceptance:** with the failure on, a headless tick shows the named effect. With it off, S1 is byte-for-bit in outcome against the last S1 commit, within float noise. Commit `Q-failures: optional, default off`.

---

## Q-views — where you sit

**Hangs from:** S0. Cockpit view hangs from Q-panel, or you will build a window onto nothing.

**Harness:** Grok CLI.

**Touches:** `scene.ts`, the camera cycle in the component.

**Work:** add a spot camera and, after Q-panel, a cockpit camera that looks at the same panel widgets or a simple draw of them. Chase smoothing may use a display filter. It may not move the ship.

**Given up:** a cabin model with every switch. Also given up: cinematic letterboxing that hides the instruments a student needs.

**Acceptance:** `C` cycles through the new view, A still banks left in chase (the filter did not invert the picture), and the ship's position is unchanged by the camera. Commit `Q-views: cameras are not physics`.

---

## Q-radio — say where you are, in text

**Hangs from:** S4, because the calls name the legs.

**Harness:** Grok CLI.

**Touches:** the component, a pure function that maps pattern position to a call.

**Work:** a one-line CTAF strip. "Field 28 traffic, N172FD, left downwind, runway 28." No microphone. N344TG can say the same from its position, as text, on a slow timer.

**Given up:** voice. Voice needs a speech API, a key, and a harness that is allowed to spend money. That is a different quest, and it is not this one. Also given up: a live frequency. Nobody is listening. The lesson is the phrase, not the radio.

**Acceptance:** the line changes as you change legs, and it does not change when you are sitting still on the ramp. Commit `Q-radio: text calls from position`.

---

## Q-map — the field, from above, still fictional

**Hangs from:** S4.

**Harness:** Grok CLI.

**Touches:** a new `src/components/map.tsx` fed by positions. Not a tile fetch.

**Work:** a top-down of the strip, the pattern box, you, and N344TG. North up. This is the seam Public World will later color with a real airport. Do not draw a real chart in this quest.

**Given up:** a sectional, satellite tiles, and airspace. Those are packs, licenses, and P-chapters. A fictional map that lies about a real airport is worse than a blank one.

**Acceptance:** the dot moves when the ship moves, including in the headless sense that the component is a function of `Ship`. No new network request. Commit `Q-map: a local map of Field 28`.

---

## Q-second-airframe — another airplane, same step

**Hangs from:** S2 and S1. Do not start this until the numbers live in a table.

**Harness:** OpenCode.

**Touches:** `fdm.ts` only to turn the 172-class constants into a record the ship carries. A second record for one other airplane: a lighter taildragger **or** a heavier twin, not both. Pick one and write down the one you did not pick.

**Work:** `step` reads `ship.aero` (name it properly) instead of module-level constants. N172FD keeps today's record, so S1 still passes. The other airplane is selectable on the briefing card. It uses the same forces. It does not get its own integrator, its own crash rule, or its own file of copied math.

**Given up:** the "it feels like the 172" single path. You now own two tunes, and a bug in the shared code hits both. Also given up: a warbird, a jet, and anything whose public numbers you do not have. Invented coefficients must be labeled `tuning choice`, and the briefing must say the airplane is generic.

**Acceptance:** S1 passes unchanged on the 172-class record. A tick of the second record shows a different takeoff roll in the direction the mass and thrust predict. There is still one `function step`. Commit `Q-second-airframe: a second table, the same step()`.

---

## Q-night — the beacon earns its keep

**Hangs from:** S0. The beacon mesh already exists.

**Harness:** Grok CLI.

**Touches:** `scene.ts`, a day/night toggle in the component. Lights may read `weather` after S6; before that, a boolean is enough.

**Work:** a night palette, runway edge lights drawn in code, the beacon flashing, the panel still readable.

**Given up:** the daylight sagebrush look, while night is on. Also given up: a time-of-day simulation tied to the real clock. A toggle teaches more and breaks fewer tests.

**Acceptance:** the toggle does not move the ship. The panel contrast still meets a glance test on a phone-sized viewport. Commit `Q-night: a coat of paint, not a new sky model`.

---

## Quests we are not writing ahead of time

Weight and balance, mixture, carb heat, a moving trim wheel, multi-leg cross-countries on the fictional field. Each is a fine quest **after** the spine, using the same template. They are not a backlog you must burn down. An unwritten quest costs nothing. A half-written one costs the next student a week.
