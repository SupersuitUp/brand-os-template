# {{BRAND NAME}} — Brand OS

> {{LOCKUP}} · **{{TAGLINE}}**

This file is the human front door. Read it first. It names the brand, the aesthetic posture, the components, and the path to every usable artifact. This repo is a Docusaurus portal (`pnpm install && pnpm start`); the brand asset package lives under [`static/brand/`](./static/brand/) and is served at `/brand/...`.

**Three surfaces, one brand** (different contexts, not redundant):

- **[`brand.json`](./brand.json)** — the structured **data** (source of truth for facts).
- **`BRAND.md`** (this file) — the human **front door**: prose + how to consume.
- **`/brand.txt`** — the generated, served **prime**: essentials inlined + absolute asset URLs; the one link to paste into any agent harness ([what is brand.txt](https://www.appliedai.wiki/reference/standards/brand-txt)).

Plus [`tokens.css`](./tokens.css) for color + type.

## What {{BRAND NAME}} is

{{One paragraph: what the brand is, who it serves, the simple version.}}

- **Audience:** {{who it's for}}
- **Archetype:** {{the character / personality}}
- **Non-negotiables:** {{the lines it will never cross}}

## Aesthetic posture

{{One paragraph an image model can render from: register, lighting, texture, background, feeling — and the sibling brands it should and should NOT resemble.}} Full render brief: [`static/brand/generation-layer/master-prompt.md`](./static/brand/generation-layer/master-prompt.md).

## The components

| # | Component | Path |
|---|-----------|------|
| 1 | **Logo matrix** | [`static/brand/logos/`](./static/brand/logos/) — `svg/`, `raster/`, `crops/` |
| 2 | **Color** | [`tokens.css`](./tokens.css) · `brand.json#tokens.color` |
| 3 | **Type** | [`tokens.css`](./tokens.css) · fonts in [`static/brand/fonts/`](./static/brand/fonts/) |
| 4 | **Golden Atomic Brand References** | [`static/brand/generation-layer/golden-atomic-brand-references/`](./static/brand/generation-layer/golden-atomic-brand-references/) |
| 5 | **Generation layer** | [`static/brand/generation-layer/`](./static/brand/generation-layer/) |

Plus the **voice** slice: [portal `/voice`](./docs/voice.mdx) · `brand.json#voice`.

## Identity essentials

- **Logo:** {{the mark + wordmark + lockup rules}}
- **Palette:** {{semantic roles + hex}}
- **Type:** {{display · accent · body}}
- **Motto:** {{the line under the logo}}
- **Always-on lockup:** every finished asset carries {{LOCKUP}} — stamp the real wordmark; don't let an image model draw it.

## How to consume this (for an agent)

1. Read this file + [`brand.json`](./brand.json).
2. Pull color/type from [`tokens.css`](./tokens.css).
3. For new visuals: prepend [`master-prompt.md`](./static/brand/generation-layer/master-prompt.md), pass the relevant [Golden Atomic Brand References](./static/brand/generation-layer/golden-atomic-brand-references/) as image references, follow [`illustrations/SPEC.md`](./static/brand/generation-layer/illustrations/SPEC.md), honor [`banned-terms.md`](./static/brand/generation-layer/banned-terms.md), then stamp the lockup.
4. Store every new prompt next to its output.

## Success test

Hand only this repo to an agent with no designer and ask for a landing page, a deck, and a social set. If the three come back unmistakably one brand, the OS is real.

---

*Generated via the `generate-a-brand-os` recipe. Replace every `{{PLACEHOLDER}}`.*
