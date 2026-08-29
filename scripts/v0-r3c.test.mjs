import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const api = readFileSync('api/write.js', 'utf8');

execFileSync(process.execPath, ['--check', 'api/write.js'], { stdio: 'pipe' });

assert.match(api, /The PC is physically present in the scene, not a detached camera/, 'R3C must treat the PC as a physical participant rather than a spectator camera');
assert.match(api, /their visible presence naturally intersects something another person currently cares about/, 'R3C should allow character-driven contact with the PC');
assert.match(api, /Being quiet or watching is still visible behavior/, 'quiet observation must remain visible to the living world');
assert.match(api, /A lively scene should sometimes reach the PC rather than performing indefinitely beside them/, 'world motion should sometimes become PC-relevant without a requested event');
assert.match(api, /Carried equipment, visible clothing, current posture or technique, obvious injury, current behavior/, 'R3C must distinguish observable PC surface from hidden profile knowledge');
assert.match(api, /Hidden abilities, name, origin, private history, exact skill ranks, motives/, 'R3C must preserve the NPC knowledge boundary for non-visible PC facts');
assert.match(api, /Do not turn this into mandatory interaction every scene/, 'R3C must not force protagonist hooks every response');
assert.match(api, /PC IN THE WORLD/, 'abstract scene grammar should include PC-world contact without a deterministic engine');

assert.doesNotMatch(api, /pcHookScore|interactionQuota|eventDensity|attentionMeter|protagonistScore|contactScheduler|hookQueue/i, 'R3C must not add a deterministic protagonist-hook engine');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'R3C remains one Writer call');

console.log('PASS V0-R3C PC-in-world contact invariants');
