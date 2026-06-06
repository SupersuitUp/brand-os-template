---
name: create-gabr
description: Create a NEW Golden Atomic Brand Reference (GABR) for THIS brand — a permanent reference render that joins the canon, not a throwaway asset. Builds on create-on-brand-image, adds the GABR discipline: fit the visual universe, cohere with existing GABRs, validate with a human, store the prompt + reference images + alt text, register it, and regenerate brand.txt. Hosted by the brand OS — always current. (Template stub — every fork inherits and customizes it.)
---

# Create a GABR

A **Golden Atomic Brand Reference** is the pillar of the brand OS: a best-in-class exemplar render that *is* the universe and is fed back into the image model to seed net-new on-brand assets. Creating one is a higher bar than making a one-off asset — it joins the canon, so it must **fit the brand's visual universe and be coherent with the existing GABRs.** If it clashes with the set, it is not golden.

This builds on **`create-on-brand-image`** (load this brand's `brand.txt`, pick an image model, honor banned terms, stamp the wordmark). On any conflict, **brand.txt wins.**

## When to make one

Make a GABR when a **reusable unit** of the universe is missing: a new character or mascot, a recurring scene/locale, a core content atom, a key template, or a sticker/motif set. Not for a one-off deliverable — that's `create-on-brand-image`.

## Steps

1. **Scope it against the existing set.** Read the GABR list in this brand's `brand.txt`. Confirm the new reference is net-new (not a duplicate) and name its role. Pick the next number + a slug: `gabr-NN-<slug>.png`.
2. **Generate for coherence.** Run create-on-brand-image, but **pass the nearest existing GABRs as input references** so the new render inherits the universe (same line weight, palette, world, recurring characters). Coherence with the set is the job, not novelty.
3. **Validate with the human, incrementally.** Show each pass to the operator and iterate until they confirm it fits. **The validation is what makes a reference golden** — never self-approve and move on.
4. **Store it with its provenance.** Save the PNG to `static/brand/generation-layer/golden-atomic-brand-references/gabr-NN-<slug>.png` and write a sidecar `gabr-NN-<slug>.prompt.md` with: status, tool + size, the **exact prompt**, the **reference images passed**, and **alt text**. A reference you cannot reproduce is not a reference.
5. **Register it.** Add the filename to `brand.json` → `golden_atomic_brand_references.references` (and to `characters` if it's a character), and add a card to the gallery page.
6. **Regenerate + ship.** Run the brand.txt build (it rescans the folder and lists the new GABR URL), build the portal, commit (image + sidecar + brand.json + gallery together), push, and deploy.

## The coherence test

Before you register it, put the new render next to the existing GABRs. It passes only if a stranger would say they belong to the same universe — same line weight, palette, lighting, and world rules. If it reads as an outlier, fix it or drop it.

## Output

A new validated GABR (`gabr-NN-<slug>.png`) + its `.prompt.md` sidecar, registered in `brand.json` and the gallery, with `brand.txt` regenerated so the new reference is served and linkable.
