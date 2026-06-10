# Master prompt (TEMPLATE)

The always-on style preamble. Prepend to any image request, then add the per-asset instruction and pass the relevant [Golden Atomic Brand References](./golden-atomic-brand-references/) as input images.

```
{{Your render brief. Cover: the ground/background, the line/illustration style,
the color treatment (reference your tokens), texture, lighting, recurring
mascots/motifs, the overall energy/feeling. State margins. State what it must
NEVER look like (the anti-patterns).}}
```

## Always-on lockup (hard rule)

Every finished, distributable asset carries the **{{LOCKUP}}** lockup. Don't let the model draw the wordmark (it garbles text). Instead:

1. Generate the art layer **clean** with a reserved empty band.
2. **Stamp the real wordmark** (`../logos/raster/{{wordmark}}.png`) into the band programmatically.

## Consistency rule

When an asset reuses a brand element, **pass that element's golden reference in as an input image** and instruct an exact match. This is how style stays locked. The model has no memory of prior generations — without the reference, identity drifts every run.

**Character references are mandatory, not optional.** Whenever a named character (mascot, persona, recurring figure) appears in a generated asset, pass their GABR. Skipping it produces a plausible-looking but inconsistent result. This includes signature visual details (a crown, a specific color scheme, a distinctive silhouette) that only the reference image reliably carries.

## Reference set

Use [`golden-atomic-brand-references/`](./golden-atomic-brand-references/). See [`example-prompts.md`](./example-prompts.md), [`illustrations/SPEC.md`](./illustrations/SPEC.md), and honor [`banned-terms.md`](./banned-terms.md).
