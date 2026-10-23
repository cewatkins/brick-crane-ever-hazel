# Side-quest template

Create `docs/quests/<id>.md` in the same commit that starts the quest, before the clever code. Merge the quest before another chapter edits the same files.

```
# <id> — <one line>

Status: open | done | skipped
Hangs from: <spine chapter that must already be on main>
Harness: grok-cli | opencode
Touches:
- path

## Why this, and not the next spine chapter

One paragraph. If the answer is "it seemed fun", that is allowed. Say it.

## Given up

What you will not have when this merges.
What you must not break to get it (name the spine tests).

## The other option

The approach you are not taking, in two or three sentences.
Why it does not merge cleanly, or why it can wait.

## Acceptance

- [ ] The quest's own check
- [ ] Named spine tests still pass
- [ ] No new network call, unless Given up says there is one

## Commit

<id>: <imperative>

## Merge note

Date merged, and any number that was tuned. Future-you will think the tune was always there.
```
