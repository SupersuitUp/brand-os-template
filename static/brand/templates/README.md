# Templates

Reusable composition blocks. Each "template" is realized as its validated [Golden Atomic Brand Reference](../generation-layer/golden-atomic-brand-references/) (the canonical example to reproduce from) plus the always-on-lockup workflow. This folder holds the index pointing to those exemplars.

Define the set your brand actually ships (lead with your primary surface):

- {{e.g. social cover}}
- {{e.g. core content card}}
- {{e.g. story stickers}}
- logo lockups (`../logos/svg/`)

## Always-on lockup workflow

1. Generate the art layer clean (reserve a band; no logo drawn).
2. Stamp `../logos/raster/{{wordmark}}.png` into the band (PIL). See `../generation-layer/scripts/`.
