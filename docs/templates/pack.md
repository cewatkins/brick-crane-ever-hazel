# Pack manifest

One file per pack: `docs/packs/<name>.md`. Commit it before any code fetches the URL. A search harness fills this in. A coding harness only reads it.

```
# Pack — <name>

Chapter: P<n>
Filled by: openclaw | human browser
Date checked:

## What it is

One paragraph. What a pilot would notice if it vanished.

## Upstream

- URL:
- Retrieved on:
- Pin (commit, date, or file hash of the fixture):

## License

- Name:
- URL of the terms, as of the date above:
- What we are required to keep in the repo (notice, attribution, share-alike):
- Compatible with this repo's LICENSE: yes | no | LICENSE not chosen yet

If compatible is anything but yes, stop. Do not download "just to look".

## Fixture

- Path in repo:
- How small it is:
- What it is a slice of:

## Runtime fetch

- Allowed: yes | no
- If the fetch fails, we use the fixture. (This sentence stays.)

## Not included

The things a reasonable person would assume are in this pack, which are not.
```

See `docs/packs/README.md`.
