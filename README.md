# Field 28

A free, in-browser flight trainer. One high-wing, 172-class airplane. One fictional field at Boise's elevation. One flight model that steps both you and the pattern ship.

This is not a Cessna product. That name belongs to Textron. The airplane is a "C172-class trainer" on purpose.

Phase 0 is published and flyable: runway 28, wind 280 at 8, pattern traffic N344TG, chase / tower / wing cameras. The work from here is a book of chapters, not a pile of branches.

## Read this first

The field manual is [docs/README.md](docs/README.md).

- [How the book works](docs/00-rules-of-the-road.md) — spine, side quests, commit points, what "given up" means
- [Where the code actually is](docs/03-where-we-are.md) — Phase 0, file by file
- [The spine](docs/04-spine.md) — required chapters, in order
- [Side quests](docs/05-side-quests.md) — optional, and what each one costs
- [Public World](docs/06-public-world.md) — real airports and weather, still in the browser
- [Trainwrecks](docs/07-trainwrecks.md) — the forks we will not take, and why

If you are an agent (Grok CLI, OpenCode, or a search harness), start at [docs/agents/README.md](docs/agents/README.md). Do one chapter. Stop at its acceptance test.

## Fly it

| Key | What it does |
|---|---|
| W / S | Throttle up / down |
| A / D | Bank left / right |
| Down / Up | Pull / push |
| Q / E | Rudder left / right |
| F / G | Flaps down / up |
| Space | Brake |
| C | Camera |
| R | Reset |

A gamepad stick banks and pitches. Triggers are throttle. On a phone, the yoke is on the left and the throttle is on the right.

## Two tracks, one repo

**Field 28** teaches the loop: inputs in, one pure step, pictures out. No downloads.

**Public World** starts only after the spine opens a weather argument on that same step. Airports, terrain, and METARs are public packs fetched by the page. They do not replace the trainer, and they do not get their own physics.

There is no third track. A room server that owns the airplane, a second flight model beside the first, and a long-lived branch that never merges are the trainwrecks in [docs/07-trainwrecks.md](docs/07-trainwrecks.md).
