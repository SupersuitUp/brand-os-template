# Templates — Golden Atomic Brand Templates (GABTs)

The coded twin of the GABR. A **GABT** is coded HTML/CSS rendered to exact pixels
through a headless browser, with no image model in the loop.

**The rule:** any asset whose numbers or copy must be exact (a data slide / stat
card, a scorecard, a before/after table, an open-graph card) is a GABT, never a
generated GABR. Image models garble text and digits; coded templates do not.

## Anatomy of a GABT

One folder per template:

```
templates/<slug>/
  <slug>.css        # shared styles, pulls the real brand tokens
  <instance>.html   # one or more example instances
  render.sh         # headless Chrome at 2x, downscaled to the target size
  out/              # rendered PNGs (gitignored or committed as examples)
```

## Registration (required)

Register every GABT in `brand.json` under `golden_atomic_brand_templates.templates`,
one object per template: `slug`, `kind`, `description`, `when`, `render`, `size`,
`path`. The build script projects these into a `## Golden Atomic Brand Templates`
section of `brand.txt`, so an agent discovers the template the same way it
discovers a GABR. An unregistered template is invisible to any agent reading
`brand.txt`.

See the [Agentic Brand OS standard](https://www.appliedai.wiki/concepts/agentic-brand-os)
and the [generator playbook](https://www.appliedai.wiki/playbooks/generate-agentic-brand-os).
