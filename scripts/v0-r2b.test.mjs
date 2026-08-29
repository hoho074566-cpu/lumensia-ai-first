import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api = readFileSync('api/write.js', 'utf8');

assert.match(api, /do not keep a recent character foregrounded merely because they appeared recently/, 'R2B must loosen recent-character stickiness');
assert.doesNotMatch(api, /function recentSpeakerKeys\(/, 'R2B must not promote recent speakers into full character packets by recency alone');
assert.match(api, /selectRelevantCharacters\(\{ action, scene \}\)/, 'R2B relevant-character selection should use current action/scene, not raw recency');
assert.match(api, /do not finish it with a neat moral or explanation/, 'R2B should avoid neat moral/explanatory tails after behavior already carries meaning');
assert.match(api, /붕대를 한 번 더 보고 실용적인 한마디/, 'synthetic anchor should demonstrate practical subtext instead of explicit emotional explanation');
assert.doesNotMatch(api, /eventQueue|npcScheduler|spotlightDebt|rotationIndex|cooldownTurns|sceneGoal|sceneExitCondition|turnHook/i, 'R2B must remain engine-free');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'R2B stays one Writer call');

console.log('PASS V0-R2B light-polish invariants');
