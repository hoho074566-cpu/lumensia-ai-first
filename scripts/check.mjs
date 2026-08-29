#!/usr/bin/env node

import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { CHARACTER_KEYS, CHARACTER_ASSETS, PORTRAIT_EXPRESSIONS } from '../assets/manifest.js';

const ROOT = process.cwd();
const failures = [];
const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => { failures.push(message); console.error(`FAIL ${message}`); };

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function parseJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`${relative(ROOT, path)} JSON: ${error.message}`);
    return null;
  }
}

for (const file of walk(join(ROOT, 'data')).filter((path) => path.endsWith('.json'))) {
  if (parseJson(file)) pass(`${relative(ROOT, file)} parses`);
}

const characterFile = join(ROOT, 'data/canon/characters/characters.json');
const characters = parseJson(characterFile)?.characters || {};
const characterKeys = Object.keys(characters).sort();
const assetKeys = [...CHARACTER_KEYS].sort();

try {
  assert.equal(characterKeys.length, 32);
  assert.deepEqual(characterKeys, assetKeys);
  pass('32 Canon character keys exactly match asset keys');
} catch (error) {
  fail(`character/asset registry mismatch: ${error.message}`);
}

try {
  assert.equal(PORTRAIT_EXPRESSIONS.length, 13);
  assert.equal(new Set(PORTRAIT_EXPRESSIONS).size, 13);
  for (const key of CHARACTER_KEYS) {
    const row = CHARACTER_ASSETS[key];
    assert.ok(row?.fullbody, `${key} missing fullbody`);
    assert.deepEqual(Object.keys(row.portrait), [...PORTRAIT_EXPRESSIONS], `${key} portrait states differ`);
  }
  pass('32 characters expose the 13-expression portrait contract + fullbody');
} catch (error) {
  fail(`asset manifest: ${error.message}`);
}

for (const legacyKey of ['lilia', 'belian', 'karne', 'pria', 'mirabel', 'aaa']) {
  if (CHARACTER_KEYS.includes(legacyKey)) fail(`legacy/non-NPC key present in asset registry: ${legacyKey}`);
}
if (!failures.some((message) => message.includes('legacy/non-NPC key'))) pass('legacy NPC aliases/Aaa absent from canonical asset registry');

const knowledge = parseJson(join(ROOT, 'data/canon/knowledge/knowledge.json'));
if (knowledge) {
  const ids = new Set();
  let bad = false;
  for (const row of knowledge.facts || []) {
    if (!row?.id || ids.has(row.id)) { bad = true; fail(`knowledge duplicate/missing id: ${row?.id || '(missing)'}`); continue; }
    ids.add(row.id);
    if (!Number.isInteger(row.visibility) || row.visibility < 1 || row.visibility > 5) { bad = true; fail(`knowledge visibility invalid: ${row.id}`); }
    if (!row.fact || !row.truth_status) { bad = true; fail(`knowledge fact/status missing: ${row.id}`); }
  }
  if (!bad) pass(`${ids.size} knowledge facts have unique ids and visibility 1..5`);
}

const pcRules = parseJson(join(ROOT, 'data/canon/rules/pc.json'));
if (pcRules) {
  try {
    assert.ok(pcRules.character_creation);
    assert.ok(!Object.hasOwn(pcRules, 'pc'));
    assert.ok(!Object.hasOwn(pcRules, 'default_pc'));
    assert.ok(!Object.hasOwn(pcRules, 'preset_pc'));
    assert.ok(!Object.hasOwn(pcRules, 'test_character'));
    assert.ok(Array.isArray(pcRules.character_creation.player_defined_fields));
    pass('no draft/default/preset PC object exists in Canon');
  } catch (error) {
    fail(`PC Canon contains a preset/test character shape: ${error.message}`);
  }
}

const baseline = parseJson(join(ROOT, 'data/scenarios/academy-1285-03-01/baseline.json'));
if (baseline) {
  try {
    assert.equal(baseline.start.date, '1285-03-01');
    assert.equal(baseline.start.time, '08:40');
    assert.ok(String(baseline.runtime_rule || '').includes('장면 순서표가 아니다'));
    pass('dated opening state is explicitly a scenario baseline, not immutable Canon');
  } catch (error) {
    fail(`scenario baseline: ${error.message}`);
  }
}

const productionRoots = ['src', 'api'].filter((name) => existsSync(join(ROOT, name)));
const forbiddenImport = /(?:from\s*['"][^'"]*reference\/|import\s*\([^)]*reference\/|readFile[^\n]*reference\/)/i;
for (const rootName of productionRoots) {
  for (const file of walk(join(ROOT, rootName)).filter((path) => /\.(?:js|mjs|ts|tsx|jsx)$/.test(path))) {
    const text = readFileSync(file, 'utf8');
    if (forbiddenImport.test(text)) fail(`production code imports/reads reference material: ${relative(ROOT, file)}`);
  }
}
if (!failures.some((message) => message.includes('reference material'))) pass('production code does not import/read reference material');

const narrativeLegacyTerms = [
  'scene-momentum',
  'scene-exit',
  'turn-hook',
  'time-plan-reconciliation',
  'context-router',
];
for (const rootName of productionRoots) {
  for (const file of walk(join(ROOT, rootName)).filter((path) => /\.(?:js|mjs|ts|tsx|jsx)$/.test(path))) {
    const text = readFileSync(file, 'utf8').toLowerCase();
    for (const term of narrativeLegacyTerms) if (text.includes(term)) fail(`legacy narrative runtime marker '${term}' found in ${relative(ROOT, file)}`);
  }
}
if (!failures.some((message) => message.includes('legacy narrative runtime marker'))) pass('no quarantined legacy narrative-runtime markers in production code');

try {
  const packageJson = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  assert.equal(packageJson.engines?.node, '22.x');
  assert.equal(packageJson.scripts?.test, 'node scripts/check.mjs');
  pass('minimal Node/test contract');
} catch (error) {
  fail(`package contract: ${error.message}`);
}

if (failures.length) {
  console.error(`\n${failures.length} blocking clean-room check(s) failed.`);
  process.exit(1);
}

console.log('\nAll Lumensia AI-First clean-room checks passed.');
