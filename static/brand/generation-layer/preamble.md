# Preamble

The always-on prompt prefix sent to the image model on every generation request for this brand. Prepend this text block verbatim, then append the REFERENCE IMAGES block (see Agent instructions below), then append the per-asset description.

Replace every `{{placeholder}}` before deploying.

```text
{{Your render brief. Cover: the visual register (illustration style, color treatment,
lighting, texture, ground/background per format, overall energy). Describe the primary
recurring figure — their appearance, their defining visual details, what the model must
always reproduce exactly. Describe any secondary characters. State all hard rules inline
(what must NEVER appear, what must always be present, which rules override everything).
State comic format conventions if applicable. End with a moderation note for any
IP-safety concerns. Be comprehensive — this entire block goes to the image model on
every request.}}
```

## Agent instructions

Not part of the text block above. Read this before assembling the prompt.

### How to assemble the full prompt string

Send the `--prompt` argument to the image model in this order:

1. **The full text block above** — copy verbatim, every word.
2. **A REFERENCE IMAGES block** — list each image you are passing so the model knows what it depicts. Use this format, one line per image:

```
REFERENCE IMAGES PASSED — match each exactly:
- Image 1: {{gabr-filename.png}} — {{what this reference shows and what to match}}.
- Image 2: {{gabr-filename.png}} — {{what this reference shows and what to match}}.
```

3. **The per-asset description** — the specific asset to generate (panels, scenes, copy).

### Which GABRs to pass

Always pass all that apply as `--input-image` flags. Populate this table as GABRs are added to the brand:

| GABR | When to pass |
|---|---|
| `{{gabr-style-reference.png}}` | Always — every generation |
| `{{gabr-character.png}}` | Whenever {{Character Name}} appears |

All GABR files: `static/brand/generation-layer/golden-atomic-brand-references/`.
The `chatgpt-images` skill requires local file paths — download GABRs to `/tmp/` before passing.
