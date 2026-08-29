import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api = readFileSync('api/write.js', 'utf8');

assert.match(api, /HARD FACTS — authoritative/, 'R2 must separate authoritative facts from story material');
assert.match(api, /STORY MATERIAL — available material, not a checklist/, 'R2 story material must stay non-directive');
assert.match(api, /SYNTHETIC_RHYTHM_ANCHORS/, 'R2 must carry compact synthetic rhythm anchors');
assert.match(api, /Honor the player's already-chosen intent through its ordinary execution/, 'chosen intent must execute through routine connective steps');
assert.match(api, /turning an unspecified ordinary detail into an administrative failure/, 'R2 must reject invented procedural blockers');
assert.match(api, /If nothing worth experiencing happens during routine time, compress it briefly/, 'quiet routine must be compressible without manufacturing events');
assert.match(api, /Let action lead to reaction and then to the next action/, 'R2 must preserve scene motion without a director state machine');
assert.match(api, /EXACT USER ACTION\\n\$\{action\}/, 'exact user action must remain last and unrewritten');

assert.doesNotMatch(api, /living-world\.json|story_affordances|crossing_affordance|character_drive|story_current|callback|collision/i, 'R2 must not inherit R1 affordance/drive/current machinery');
assert.doesNotMatch(api, /eventQueue|nextEvent|npcScheduler|rotationIndex|cooldownTurns|spotlightDebt|sceneGoal|sceneExitCondition|turnHook/i, 'R2 must not regrow a narrative engine');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'R2 stays one Writer call');

console.log('PASS V0-R2 original narrative grammar invariants');
