#!/usr/bin/env node
/**
 * Build /brand.txt — the all-in-one brand.txt file (llms.txt for a brand).
 * Runs at build time (prebuild/prestart) so it always reflects current assets.
 *
 * One statically-served page that primes any agent harness to generate on-brand
 * assets: identity + master prompt + tokens + voice + banned terms INLINE, plus
 * HARD ABSOLUTE URLs to every brand asset (logos, GABRs, fonts, tokens).
 *
 * Base URL resolution: BRAND_BASE_URL env > brand.json.site_url > portal.url_planned.
 * No dependencies (Node stdlib only) so it runs in any build environment.
 */
import {readFileSync, writeFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {join, relative, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND = join(REPO, 'static', 'brand');
const bj = JSON.parse(readFileSync(join(REPO, 'brand.json'), 'utf8'));
const BASE = (process.env.BRAND_BASE_URL || bj.site_url || bj.portal?.url_planned || 'https://example.com').replace(/\/+$/, '');

const url = (relFromRepo) => {
  const served = relFromRepo.includes('static/') ? relFromRepo.split('static/').pop() : relFromRepo;
  return `${BASE}/${served.replace(/^\/+/, '')}`;
};

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
const listAssets = (subdir, exts) =>
  walk(join(BRAND, subdir))
    .filter((p) => !p.endsWith('.gitkeep') && exts.some((e) => p.toLowerCase().endsWith(e)))
    .map((p) => url(relative(REPO, p)));

const read = (...parts) => {
  const p = join(BRAND, ...parts);
  return existsSync(p) ? readFileSync(p, 'utf8').trim() : '';
};

// Inline the preamble (prefer the fenced code-block body)
let mp = read('generation-layer', 'preamble.md');
if (mp.includes('```')) {
  const body = mp.split('```')[1] || '';
  mp = body.replace(/^[^\n]*\n/, '').trim(); // drop the ```text info line
}

const color = bj.tokens?.color || {};
const voice = bj.voice || {};
const type = bj.tokens?.type || {};
const L = [];
const A = (s = '') => L.push(s);

A(`# ${bj.brand} — brand.txt`);
A('');
A(`> ${bj.lockup || ''} · ${bj.tagline || ''}`);
A('');
A('This is the all-in-one brand file. One URL primes any agent to generate on-brand assets:');
A('everything is inline below, and every brand asset is linked as an absolute URL.');
A('Canonical repo manifest: BRAND.md + brand.json. This file is generated at build time from them.');
A('Format: the brand.txt standard — https://www.appliedai.wiki/reference/standards/brand-txt');
A('');
A('## Identity');
A(`- Brand: ${bj.brand}  |  Lockup: ${bj.lockup || ''}  |  Handle: ${bj.handle || ''}`);
A(`- Tagline: ${bj.tagline || ''}`);
A(`- One-liner: ${bj.one_liner || ''}`);
A(`- Audience: ${bj.audience || ''}`);
A(`- Archetype: ${bj.archetype || ''}`);
for (const nn of bj.non_negotiables || []) A(`- Non-negotiable: ${nn}`);
A('');
A('## How to generate an on-brand asset');
A('Fastest path: follow a HOSTED SKILL below (it automates these steps). Otherwise, by hand:');
A('1. Prepend the MASTER PROMPT below.');
A('2. Pass the relevant GOLDEN ATOMIC BRAND REFERENCE image URL(s) to your image model as input/reference images (especially for reused elements like the mark or a mascot).');
A('3. Describe the new asset. Honor the BANNED TERMS.');
A('4. For finished/distributable assets, STAMP the real wordmark PNG (linked below) into a reserved band — do not let the model draw the wordmark text.');
A('5. Use the COLOR + TYPE tokens for any code/site/deck.');
A('');
A('## Preamble (copy verbatim, prepend to every image generation request — then append the REFERENCE IMAGES block naming each GABR you pass, then the per-asset description)');
A('```text');
A(mp);
A('```');
A('');
A('## Color tokens');
for (const [k, v] of Object.entries(color)) if (typeof v === 'string') A(`- ${k}: ${v}`);
A('');
A('## Type');
for (const role of ['display', 'hand', 'body']) {
  if (type[role]) {
    const f = type[role].file ? url('static/' + type[role].file.split('static/').pop()) : '';
    A(`- ${role}: ${type[role].family || ''}${f ? ' — ' + f : ''}`);
  }
}
A('');
A('## Voice');
A(`- Motto: ${voice.motto || ''}`);
if (voice.tone) A(`- Tone: ${voice.tone.join(', ')}`);
if (voice.positive_move) A(`- Positive move: ${voice.positive_move}`);
A('');
A('## Banned terms');
if (voice.banned_words) A(`- Words: ${voice.banned_words.join(', ')}`);
if (voice.banned_visual) A(`- Visual: ${voice.banned_visual.join(', ')}`);
A('');
A('## Logo matrix (absolute URLs)');
for (const u of listAssets('logos', ['.svg', '.png', '.ico'])) A(`- ${u}`);
A('');
A('## On-brand asset skills (hosted procedures — follow these to generate)');
const skillUrls = listAssets('generation-layer/skills', ['.md']);
if (skillUrls.length) { for (const u of skillUrls) A(`- ${u}`); }
else A('- (none yet — a brand OS should host a create-on-brand-image skill)');
A('');
// Characters section — recurring cast from brand.json
const chars = bj.characters || {};
if (Object.keys(chars).length) {
  A('## Characters (recurring cast — always pass the matching GABR as an input image)');
  for (const [key, c] of Object.entries(chars)) {
    const name = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const gabr = c.ref ? url(c.ref) : '';
    const parts = [];
    if (c.default_protagonist) parts.push('**default protagonist**');
    if (c.lean) parts.push(c.lean);
    if (c.suit) parts.push(c.suit);
    if (c.form) parts.push(c.form);
    if (c.signature) parts.push(`signature: ${c.signature}`);
    if (c.note) parts.push(c.note);
    A(`- **${name}**${parts.length ? ' — ' + parts.join('; ') : ''}${gabr ? ' → ' + gabr : ''}`);
  }
  A('');
}

A('## Golden Atomic Brand References (reference images — pass these to the image model)');
for (const u of listAssets('generation-layer/golden-atomic-brand-references', ['.png'])) A(`- ${u}`);
A('');
A('## Fonts');
for (const u of listAssets('fonts', ['.ttf', '.woff', '.woff2', '.otf'])) A(`- ${u}`);
A('');
A('## Tokens + manifest');
A(`- tokens.css: ${BASE}/brand/tokens.css`);
A(`- generation layer: ${BASE}/brand/generation-layer/`);
A('');
A('---');
A(`Generated at build time by scripts/build-brand-txt.mjs. BASE_URL=${BASE}`);

const out = join(REPO, 'static', 'brand.txt');
writeFileSync(out, L.join('\n') + '\n');
console.log(`[brand.txt] wrote ${out} (${L.length} lines) served at ${BASE}/brand.txt`);
