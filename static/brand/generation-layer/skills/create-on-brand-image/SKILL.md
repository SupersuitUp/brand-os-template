---
name: create-on-brand-image
description: Generate an on-brand image/asset for THIS brand. Reads the brand's brand.txt, uses the best available image model, passes the Golden Atomic Brand References, honors the banned terms, and stamps the real wordmark. Hosted by the brand OS as the canonical generation procedure — always current. (Template stub — every fork inherits and customizes it.)
---

# Create an On-Brand Image

The canonical, **hosted** procedure for producing an on-brand image for this brand. It is served by the brand OS and linked from `brand.txt`, so it never drifts. Any local skill that makes this brand's assets should point here instead of re-stating the canon. **On any conflict, `brand.txt` wins.**

## 0. Load the brand

Fetch this brand's prime and follow it — the served root is `brand.json` → `site_url`, then `/brand.txt`:

> **`<your-domain>/brand.txt`**

It carries the master prompt, color + type tokens, voice, banned terms, the non-negotiables, and absolute URLs to every Golden Atomic Brand Reference (GABR). (Replace `<your-domain>` with this brand's `site_url`.)

## 1. Pick an image model (sensible defaults)

Use the best image-generation skill registered in your harness. **Search your registered skills for an image-creation tool** and prefer, in order:

1. `chatgpt-images` — OpenAI gpt-image-2 (quality high); supports multiple `--input-image` references
2. `nano-banana-pro` — Google Gemini image; supports `--input-image`
3. any other registered top-tier image-model skill

If none is registered, call an image API directly. Whatever you pick **must accept reference images** — the GABRs are passed as references.

## 2. Assemble the request

1. **Prepend the MASTER PROMPT** verbatim from brand.txt.
2. **Pass the relevant GABR image URL(s)** as input/reference images. Always pass the matching reference for any reused element (the mark, a character, a mascot, a recurring sticker).
3. **Describe the new asset.** Honor the BANNED TERMS (visual + words) and the non-negotiables listed in brand.txt.

## 3. Finish

- For finished/distributable assets, **stamp the real wordmark/lockup PNG** (linked in brand.txt) into a reserved band — do not let the model draw the wordmark text.
- Use the **color + type tokens** for any code/site/deck.
- Validate against the non-negotiables before shipping; re-run on a moderation block with plainer language.

## Output

An on-brand image. *Where* it is filed and *how* it is published is the consuming skill's job, not this one's. A brand whose assets are a specific genre (comics, cards, pixel art) MAY host a genre skill (e.g. `create-on-brand-comic`) that builds on this one.
