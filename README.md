# Brand OS Template

A forkable starter for building a **Brand OS** — the brand as a *system* an agent can read and generate from, not a static PDF. Fork it, run the `generate-a-brand-os` recipe, and fill in your brand.

> Worked example: **POV DTX** (`PoV 🤠 DTX`) was built with this exact structure — use it as the shape to aim for.

## What you get

A Docusaurus portal whose canonical asset package lives under [`static/brand/`](./static/brand/) (served at `/brand/...`):

| Component | Path |
|---|---|
| Manifest (read first) | `BRAND.md` + `brand.json` |
| Color + type tokens | `tokens.css` |
| Logo matrix | `static/brand/logos/` |
| Fonts | `static/brand/fonts/` |
| Generation layer | `static/brand/generation-layer/` (master prompt, example prompts, banned terms, `illustrations/SPEC.md`, scripts) |
| **Golden Atomic Brand References** (the pillar) | `static/brand/generation-layer/golden-atomic-brand-references/` |

## Quick start

1. **Fork / clone**, then `pnpm install`.
2. Read [`GETTING-STARTED.md`](./GETTING-STARTED.md) — the fork → fill workflow.
3. Run the **`generate-a-brand-os`** recipe (interview → lock identity → generate). See `appliedai.wiki/playbooks/generate-a-brand-os`.
4. Replace every `{{PLACEHOLDER}}` and the placeholder tokens; drop your assets into `static/brand/`.
5. `pnpm start` to preview, `pnpm build` to ship.

## The success test

Hand only your filled-in repo to an agent with no designer and ask for a landing page, a deck, and a social set. If the three come back unmistakably one brand, the OS is real.

---

*Public template maintained under SupersuitUp. Built from the `generate-a-brand-os` recipe.*
