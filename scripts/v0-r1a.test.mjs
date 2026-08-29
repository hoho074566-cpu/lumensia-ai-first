import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const living = JSON.parse(readFileSync('data/scenarios/academy-1285-03-01/living-world.json', 'utf8'));
const characters = JSON.parse(readFileSync('data/canon/characters/characters.json', 'utf8')).characters || {};
const api = readFileSync('api/write.js', 'utf8');

assert.equal(living.mode, 'non_binding_story_affordances');
assert.ok(Array.isArray(living.policy) && living.policy.length >= 4, 'living-world policy must stay explicit');
assert.ok(living.policy.some((line) => line.includes('사용하지 않아도 된다')), 'none must remain a valid choice');
assert.ok(living.policy.some((line) => line.includes('Event Queue')), 'data must explicitly reject event-queue semantics');
assert.ok(Array.isArray(living.period_pressures) && living.period_pressures.length <= 6, 'period pressure packet must stay small');

const crossingKeys = Object.keys(living.character_crossing_affordances || {});
assert.ok(crossingKeys.length > 0 && crossingKeys.length <= 10, 'crossing affordances should be a small supporting cast, not a rotation roster');
for (const key of crossingKeys) assert.ok(characters[key], `unknown crossing character: ${key}`);

assert.match(api, /living-world\.json/, 'Writer must receive living-world affordance data');
assert.match(api, /story_affordances:\s*livingWorldPacket\(\)/, 'affordances must remain a distinct packet, not hard world facts');
assert.match(api, /crossing_affordance/, 'ambient cast entries should expose causal crossing hints');
assert.doesNotMatch(api, /Math\.random\s*\(|eventQueue|nextEvent|npcScheduler|rotationIndex|cooldownTurns/i, 'R1A must not grow into an event/NPC rotation engine');

console.log('PASS V0-R1A living-world affordance invariants');
