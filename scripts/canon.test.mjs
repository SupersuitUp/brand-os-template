import {test} from 'node:test';
import assert from 'node:assert/strict';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {discoverEntities, validateManifest, compileEntity} from './canon.mjs';

const FIX = join(dirname(fileURLToPath(import.meta.url)), 'test-fixtures', 'canon');

test('discoverEntities finds manifest folders, sorted', () => {
  const entities = discoverEntities(FIX);
  assert.deepEqual(entities.map((e) => e.slug), ['broken-entity', 'valid-person']);
  assert.equal(entities[1].manifest.name, 'Testy');
});

test('discoverEntities returns [] for a missing root', () => {
  assert.deepEqual(discoverEntities(join(FIX, 'nope')), []);
});

test('valid manifest produces no errors', () => {
  const e = discoverEntities(FIX).find((x) => x.slug === 'valid-person');
  assert.deepEqual(validateManifest(e), []);
});

test('broken manifest reports each defect with its slug', () => {
  const e = discoverEntities(FIX).find((x) => x.slug === 'broken-entity');
  const errors = validateManifest(e);
  assert.ok(errors.some((m) => m.includes('type must be one of person|place|prop')));
  assert.ok(errors.some((m) => m.includes('identity.form is required')));
  assert.ok(errors.some((m) => m.includes('missing file "missing.png"')));
  assert.ok(errors.some((m) => m.includes('undeclared reference role "ghost-role"')));
  assert.ok(errors.every((m) => m.startsWith('broken-entity:')));
});

test('compileEntity emits header, per-era descriptors, PASS, VERIFY', () => {
  const e = discoverEntities(FIX).find((x) => x.slug === 'valid-person');
  const lines = compileEntity(e, (rel) => `https://x.test/${rel}`, 'static/brand/canon/valid-person');
  const text = lines.join('\n');
  assert.ok(lines[0].startsWith('### Testy (person) — locked by Gary 2026-07-10'));
  assert.ok(text.includes('DESCRIPTOR (everyday): a small orange test mascot with a round face'));
  assert.ok(text.includes('always has exactly three freckles'));
  assert.ok(text.includes('blue overalls with a brass button'));
  assert.ok(text.includes('NEVER: a fourth freckle.'));
  assert.ok(text.includes('PASS front: https://x.test/static/brand/canon/valid-person/front.png'));
  assert.ok(text.includes('back: https://x.test/static/brand/canon/valid-person/turnaround.png'));
  assert.ok(text.includes('VERIFY ON READ-BACK: crop-zoom face: three freckles present'));
  assert.equal(lines[lines.length - 1], '');
});

test('compileEntity for a place folds geometry/population into one descriptor', () => {
  const e = {
    dir: '/tmp/x', slug: 'the-spot', parseError: null,
    manifest: {
      slug: 'the-spot', type: 'place', name: 'The Spot',
      authority: {locked_by: 'Gary', locked_on: '2026-07-10', origin: 'origin-book'},
      identity: {form: 'a porch with plank steps'},
      geometry: 'steps face the river; one hanging lamp',
      population: 'exactly four people unless the spread says otherwise',
      references: {}, angles: {},
    },
  };
  const lines = compileEntity(e, (rel) => rel, 'canon/the-spot');
  const text = lines.join('\n');
  assert.ok(lines[0].includes('origin: origin-book'));
  assert.ok(text.includes('DESCRIPTOR: a porch with plank steps. steps face the river; one hanging lamp. exactly four people unless the spread says otherwise.'));
});
