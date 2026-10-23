# Chapter template

Copy this into the commit message body, or into `docs/chapters/<id>.md` if the chapter grew a journal. Do not invent headings.

```
# <id> — <one line>

Status: open | done
Track: spine | public-world
Hangs from: <previous id>
Harness: grok-cli | opencode | search-then-code
Touches:
- path

## Work

What will be true when this chapter is done, in sentences a pilot could check.
Not a list of tasks for their own sake.

## Given up

What this chapter refuses, in plain language.
What a student will feel the lack of.
Name the trainwreck it stays away from, if any (docs/07-trainwrecks.md).

## Out of bounds

Files and ideas the harness must not touch "while we're here".

## Acceptance

- [ ] The check, written so a stranger can run it
- [ ] The previous spine test still passes
- [ ] The page flies with the network cut (unless this chapter's Given up says otherwise)

## Commit

<id>: <imperative, under 72 chars>

## Stopped at

If you stop early, say what is true and what is not. Leave the tests passing
on main. Put the half-done work in this section, not in a broken commit.
```
