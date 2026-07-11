// Canon OS — discovery, validation, and compilation of entity dossiers.
// Stdlib only: this runs wherever build-brand-txt.mjs runs.
// Schema doc: scripts/canon-manifest.schema.json (Task 2 sibling doc).
import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {join} from 'node:path';

const TYPES = ['person', 'place', 'prop'];

export function discoverEntities(canonRootAbs) {
  if (!existsSync(canonRootAbs)) return [];
  const out = [];
  for (const name of readdirSync(canonRootAbs).sort()) {
    const dir = join(canonRootAbs, name);
    if (!statSync(dir).isDirectory()) continue;
    const mf = join(dir, 'manifest.json');
    if (!existsSync(mf)) continue;
    try {
      out.push({dir, slug: name, manifest: JSON.parse(readFileSync(mf, 'utf8')), parseError: null});
    } catch (e) {
      out.push({dir, slug: name, manifest: null, parseError: e.message});
    }
  }
  return out;
}

export function validateManifest(entity) {
  const {manifest: m, dir, slug, parseError} = entity;
  if (parseError) return [`${slug}: manifest.json is not valid JSON (${parseError})`];
  const errors = [];
  const need = (cond, msg) => { if (!cond) errors.push(`${slug}: ${msg}`); };
  need(m.slug === slug, `manifest slug "${m.slug}" must match folder name "${slug}"`);
  need(TYPES.includes(m.type), `type must be one of ${TYPES.join('|')} (got "${m.type}")`);
  need(typeof m.name === 'string' && m.name.length > 0, 'name is required');
  need(!!(m.authority && m.authority.locked_by && m.authority.locked_on),
    'authority.locked_by and authority.locked_on are required');
  need(!!(m.identity && typeof m.identity.form === 'string' && m.identity.form.length > 0),
    'identity.form is required');
  const refs = m.references || {};
  need(Object.keys(refs).length > 0, 'at least one entry in references is required');
  for (const [role, file] of Object.entries(refs)) {
    if (!existsSync(join(dir, file))) errors.push(`${slug}: references.${role} names missing file "${file}"`);
  }
  for (const [angle, roles] of Object.entries(m.angles || {})) {
    for (const role of roles || []) {
      if (!(role in refs)) errors.push(`${slug}: angles.${angle} names undeclared reference role "${role}"`);
    }
  }
  if (m.type === 'person' && m.wardrobe) {
    need(!!(m.wardrobe.default && m.wardrobe.eras && m.wardrobe.eras[m.wardrobe.default]),
      'wardrobe.default must name a key in wardrobe.eras');
  }
  return errors;
}
