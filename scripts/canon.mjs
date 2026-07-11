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
  if (typeof m !== 'object' || m === null || Array.isArray(m)) {
    return [`${slug}: manifest must be a JSON object`];
  }
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
    for (const [name, era] of Object.entries(m.wardrobe.eras || {})) {
      need(!!(era && typeof era.desc === 'string' && era.desc.length > 0),
        `wardrobe.eras.${name}.desc must be a non-empty string`);
    }
  }
  return errors;
}

export function compileEntity(entity, urlFn, relDirFromRepo) {
  const m = entity.manifest;
  const L = [];
  const auth = m.authority;
  L.push(`### ${m.name} (${m.type}) — locked by ${auth.locked_by} ${auth.locked_on}${auth.origin ? `, origin: ${auth.origin}` : ''}`);
  if (m.role) L.push(`Role: ${m.role}`);
  const base = [m.identity.form, ...(m.identity.hard_rules || [])];
  const never = (m.never || []).length ? ` NEVER: ${m.never.join('; ')}.` : '';
  const eras = m.type === 'person' && m.wardrobe && m.wardrobe.eras ? Object.entries(m.wardrobe.eras) : null;
  if (eras && eras.length) {
    for (const [era, e] of eras) {
      const scope = e.spreads ? `, spreads ${e.spreads}` : '';
      L.push(`DESCRIPTOR (${era}${scope}): ${base.join('. ')}. ${e.desc}.${never}`);
    }
  } else {
    const extra = [m.geometry, m.lighting, m.population, m.construction, m.scale].filter(Boolean);
    L.push(`DESCRIPTOR: ${[...base, ...extra].join('. ')}.${never}`);
  }
  const angleEntries = Object.entries(m.angles || {}).filter(([, roles]) => (roles || []).length);
  if (angleEntries.length) {
    const parts = angleEntries.map(([angle, roles]) =>
      `${angle}: ${roles.map((r) => urlFn(`${relDirFromRepo}/${m.references[r]}`)).join(', ')}`);
    L.push(`PASS ${parts.join(' · ')}`);
  }
  if ((m.verification || []).length) L.push(`VERIFY ON READ-BACK: ${m.verification.join(' · ')}`);
  if (m.voice && m.voice.narration_voice_id) {
    L.push(`NARRATION VOICE: ${m.voice.narration_voice_id}${m.voice.speech ? ` (${m.voice.speech})` : ''}`);
  }
  L.push('');
  return L;
}
