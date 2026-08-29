import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api = readFileSync('api/write.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');

assert.match(api, /Social position and relationship state are facts about social distance, not dialogue scripts/, 'social and relationship facts must guide rather than script dialogue');
assert.match(api, /default_for_unlisted_character/, 'unlisted PC↔NPC relationships must have an explicit stranger default');
assert.match(api, /pc_social_status/, 'PC social status must reach Writer hard facts');
assert.match(api, /npc_social_identity/, 'NPC Canon social identity must reach relationship context');
assert.match(api, /Mere co-presence or observation is not a relationship change/, 'co-presence must not auto-grow relationships');
assert.match(api, /relationship_updates/, 'Writer must be able to persist evidence-based relationship changes in the same call');
assert.match(client, /relationships: \{\}/, 'new runs must start with no invented established relationships');
assert.match(client, /function applyRelationshipUpdates/, 'client must persist Writer relationship updates');
assert.match(client, /relationshipUpdates/, 'relationship updates must be retained in turn history for auditability');

assert.doesNotMatch(api, /affinityThreshold|relationshipThreshold|relationshipTier|unlock.*affinity/i, 'R2D must not introduce relationship threshold scripting');
assert.doesNotMatch(client, /affinityThreshold|relationshipThreshold|relationshipTier|unlock.*affinity/i, 'client must not implement affinity behavior gates');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'R2D remains one Writer call');

console.log('PASS V0-R2D minimal social / relationship context invariants');
