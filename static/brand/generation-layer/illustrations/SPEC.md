# Illustration SPEC (TEMPLATE)

Per-asset rules for your visuals. Pairs with [`../master-prompt.md`](../master-prompt.md), [`../banned-terms.md`](../banned-terms.md), and the [Golden Atomic Brand References](../golden-atomic-brand-references/).

## Universal rules

- **Ground:** {{your background treatment — rarely pure white}}.
- **Line / style:** {{outline weight, fill style}}.
- **Color:** {{your palette, which leads, which highlights}}.
- **Margins:** compose with comfortable margins (not full-bleed) unless intentional.
- **Mascots/motifs:** {{recurring elements; pass their golden references in to stay on-model}}.
- **Always-on lockup:** finished assets carry {{LOCKUP}} — stamp the real wordmark; don't let the model draw it.
- **Text:** image models garble long text. Keep generated text short; stamp the wordmark programmatically; build text-critical templates in code.

## Canvas sizes

| Asset | Size | Notes |
|-------|------|-------|
| Mark / sticker | 1024×1024 | die-cut on flat white for easy knockout |
| Social cover | 1024×1536 (9:16) | reserve a band for the lockup |
| {{your core atom}} | {{size}} | {{notes}} |
| OG / social | 1200×630 · 1080×1080 | composed from logo + lockup |

## Tooling

- Image model: {{your model}}; pass references via input images.
- Programmatic composition (lockup stamping, crops, mono/knockout): PIL + `rsvg-convert`; helpers in [`../scripts/`](../scripts/).
- Store every prompt next to its output (`*.prompt.md`).
