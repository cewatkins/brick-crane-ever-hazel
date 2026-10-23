# 01 — Players

Three seats. Two of them are human. The third is a harness aimed by a human. The harness does not get a vote.

## Lead pilot

The person who owns the repo and the published site. Opens a chapter by saying so, in chat or in the status line of [the manual index](README.md). Reviews the acceptance test before a push. Picks the code license before any Public World pack is fetched (see [06](06-public-world.md)). Breaks a tie when a chapter's "given up" list is uncomfortable.

The lead pilot may fly any chapter. They do not skip the acceptance test because they already "know it works".

## Student

Anyone who clones the repo to learn the loop: read a chapter, aim a harness, watch it try, run the test, commit, stop.

A student may:

- Fly the published trainer before reading a line.
- Ask the lead pilot to open a side quest.
- Refuse a chapter that will not say what it gives up.
- Stop in the middle and write down where they stopped. That note goes in the chapter file under `Stopped at`. It is more useful than a silent half-commit.

A student may not:

- Open Public World before S6 is on main.
- Add a second physics implementation "to compare" without the diff harness in P5.
- Turn on accounts because a logbook "should sync".
- Treat an agent's confidence as the acceptance test.

## Reviewer

Can be the other human, or the same human the next morning. The review is short:

1. Does the acceptance test pass?
2. Did any file outside the chapter's `Touches` list change? If yes, why?
3. Is "given up" still true, or did the code quietly take the feature back?
4. Can the page still fly with the network cut off? (Public World fixtures must allow this.)

## What nobody is

- A product manager collecting a wish list. Wishes go in a quest file or they do not exist.
- A pilot examiner. The score in S5 is a teaching score, not a certificate.
- An authority on Textron. We do not speak for the manufacturer, and we do not draw their airplane.

## How a turn starts

The human pastes [templates/agent-brief.md](templates/agent-brief.md), names one chapter, and names one harness. If they name two chapters, the harness does the first and stops.
