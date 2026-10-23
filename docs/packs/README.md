# Packs

Empty on purpose until P0 and P1.

A pack is public data the page can fetch: airports, a METAR, a patch of elevation, someday a WASM build. The flight model is not a pack. The school field is not a pack.

Rules:

- One manifest per pack, from [the template](../templates/pack.md).
- A small fixture lives in the repo. The world does not.
- If the manifest's license line is not a clear yes against `LICENSE`, the pack does not land.
- Field 28 must still fly if every pack is missing.

No manifests exist yet. That is correct. S6 has not opened the socket.
