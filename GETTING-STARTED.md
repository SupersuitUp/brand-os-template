# Getting started

The fork → fill workflow for turning this template into your brand's OS.

## 0. Prereqs

- Node ≥ 20, `pnpm`. An image model for the logo + Golden Atomic Brand References.
- `pnpm install`, then `pnpm start` to confirm the placeholder portal runs.

## 1. Run the recipe

This template is the *vessel*; the **`generate-a-brand-os`** recipe is the *process*. Run it — it interviews you to lock the brand's soul, then guides generating each component. (`appliedai.wiki/playbooks/generate-a-brand-os`.)

## 2. Fill the manifest

Replace every `{{PLACEHOLDER}}` in:
- **`BRAND.md`** — the read-first manifest (what the brand is, the components, paths).
- **`brand.json`** — its structured twin (tokens, voice, asset index).

## 3. Set tokens

- **`tokens.css`** — replace the placeholder palette + fonts. This is the single source both the portal and any generated site/deck pull from.
- **`src/css/custom.css`** — mirror the same brand colors into the Docusaurus `@theme` block + Infima vars, and point `@font-face` at your fonts in `static/brand/fonts/`.
- Drop your font files into `static/brand/fonts/`.

## 4. Generate the assets

Into `static/brand/`:
- **`logos/`** — the full matrix (mark, wordmark, lockups; color/mono/knockout; crops). The `generation-layer/scripts/` helpers build mono/knockout/crops and compose wordmark lockups from your masters.
- **`generation-layer/golden-atomic-brand-references/`** — the pillar. Generate your exemplar renders one at a time, validate each, and store each next to its prompt (`gabr-NN-*.prompt.md`).

## 5. Write the generation layer

In `static/brand/generation-layer/`: fill `master-prompt.md`, `example-prompts.md`, `banned-terms.md`, `illustrations/SPEC.md`.

## 6. Fill the portal pages

Edit `docs/*.mdx` (logos, color, type, voice, golden-atomic-brand-references, generation-layer) and `docs/index.mdx`. Update `docusaurus.config.ts` (title, tagline, url, footer) and `sidebars.ts`.

## 7. Ship

`pnpm build`, then deploy (Vercel auto-detects Docusaurus). Commit each generation prompt next to its output.

**The brand.txt file (`/brand.txt`)** is auto-generated at build time (`prebuild` → `scripts/build-brand-txt.mjs`) from `brand.json` + your assets. Set `brand.json#site_url` (or the `BRAND_BASE_URL` env) so its absolute URLs are correct. This one statically-served file primes any agent harness — paste its URL and an agent can generate on-brand assets without repo access.

## Principles to keep

- **Golden Atomic Brand References are the pillar** — validate each with a human; that's what makes them golden.
- **Pass golden references back in** when an asset reuses a brand element, so style never drifts.
- **Always-on lockup:** stamp your real wordmark onto finished assets programmatically; don't let an image model draw the text.
- **The repo + manifest are canonical**; the portal is the view over them.
