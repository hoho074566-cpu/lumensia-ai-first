import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api = readFileSync('api/write.js', 'utf8');

assert.match(api, /Treat NPC motives as independent of the player\./, 'NPC motives must remain independent of the player');
assert.match(api, /take reasonable actions for their own reasons/, 'NPCs should be allowed autonomous action');
assert.match(api, /without routing the scene through the player/, 'NPC-NPC interaction must not require PC mediation');
assert.match(api, /may persist or echo later/, 'meaningful consequences may return later');
assert.match(api, /they may also go quiet/, 'quiet/no-callback remains a valid choice');
assert.match(api, /Do not manufacture a hook/, 'R1C must not require a hook every turn');

assert.match(api, /function characterDrive\(/, 'ambient cast should expose compact Canon-derived drive hints');
assert.match(api, /drive:\s*characterDrive\(row\)/, 'cast index should include Canon-derived drive hints');
assert.match(api, /values:\s*Array\.isArray\(core\.values\)/, 'drive values must come from Canon');
assert.match(api, /aspiration:\s*cleanText\(core\.aspiration/, 'drive aspiration must come from Canon');
assert.doesNotMatch(api, /character-drives\.json|npc-goals\.json/i, 'R1C must not duplicate Canon into a second goal database');

assert.match(api, /continuity:\s*recentContinuity\(turn\?\.continuity\)/, 'recent continuity must remain available for causal callbacks');
assert.doesNotMatch(api, /Math\.random\s*\(|eventQueue|nextEvent|npcScheduler|rotationIndex|cooldownTurns|goalScore|spotlightScore|hookScore/i,
  'R1C must not grow into event selection, scoring, or NPC scheduling machinery');

console.log('PASS V0-R1C story-current / character-drive invariants');
