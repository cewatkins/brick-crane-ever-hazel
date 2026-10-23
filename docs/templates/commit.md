# Commit template

One chapter, one commit, on top of a passing tree.

```
<id>: <imperative summary under 72 characters>

Harness: grok-cli | opencode | human | search:<tool>
Given up: <one sentence, copied from the chapter, not softened>
Tests: <what passed>

<body only if a future student would be lost without it.
Name a tuned number and why.
Do not paste a lab journal.>
```

Examples:

```
S1: name the aero numbers and lock the tick test

Harness: grok-cli
Given up: no new forces, panel left as it was
Tests: tick test (takeoff, left roll, hands-off, crosswind)
```

```
S8: a second human ship without a referee

Harness: opencode
Given up: no shared crash; picked a ghost tape instead of live presence
Tests: S1; solo flight with the network blocked; ghost ship steps from inputs
```

Do not commit a red test. Do not commit the next chapter's files. Do not push unless the lead pilot asked.
