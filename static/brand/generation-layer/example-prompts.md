# Example prompts (TEMPLATE)

Each starts by prepending the [master prompt](./master-prompt.md) and passing the relevant [Golden Atomic Brand References](./golden-atomic-brand-references/) as input images. `[BRACKETS]` are placeholders.

## {{Core content atom}}

> `[master prompt]` + "{{instruction describing your core content unit, with [PLACEHOLDERS] for the variable parts}}"
>
> Reference: `golden-atomic-brand-references/{{gabr-file}}.png`

## {{Social/cover asset}}

> `[master prompt]` + "{{instruction}} … leave a band for the lockup; then stamp the real wordmark."
>
> Reference: `golden-atomic-brand-references/{{gabr-file}}.png`

## A new sticker / element

> `[master prompt]` + "A single die-cut sticker of {{SUBJECT}} … pass the mark/mascot reference so reused elements stay on-model."

## Rules every prompt inherits

- **Always-on lockup** on finished assets (stamp the real wordmark; don't let the model draw it).
- **Pass golden references** for reused elements.
- **No banned terms** (see [`banned-terms.md`](./banned-terms.md)).
