import {test} from 'node:test';
import assert from 'node:assert/strict';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {discoverEntities, validateManifest} from './canon.mjs';

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
