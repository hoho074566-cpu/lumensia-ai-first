import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api = readFileSync('api/write.js', 'utf8');

assert.match(api, /Once there, inhabit that moment instead of consuming the rest of an event or schedule/, 'R2A must prefer scene depth over schedule completion');
assert.match(api, /does not reset the human scene/, 'location or schedule changes must not automatically reset live human interaction');
assert.match(api, /character-specific behavior/, 'Writer must prefer character-specific behavior over generic polished speeches');
assert.match(api, /details that reveal character, relationship, tension, or consequence/, 'details should carry scene meaning instead of decorating prose');

assert.match(api, /values:\s*Array\.isArray\(core\.values\)/, 'ambient cast must expose character values');
assert.match(api, /tendencies:\s*Array\.isArray\(voice\.tendencies\)/, 'ambient cast must expose voice tendencies');
assert.match(api, /avoid:\s*Array\.isArray\(voice\.avoid\)/, 'ambient cast must expose voice anti-patterns');
assert.match(api, /refined_characterization:/, 'ambient cast must expose refined characterization when available');

assert.match(api, /continuity:\s*turn\?\.continuity/, 'recent context must preserve prior continuity evidence');
assert.match(api, /function compactWorldPacket\(pc\)/, 'R2A must use a compact world packet');
assert.match(api, /world:\s*compactWorldPacket\(pc\)/, 'Writer should receive compact world facts rather than the full institution dump');
assert.doesNotMatch(api, /academy:\s*academyData\s*[,}]/, 'full academy canon must not be dumped into story material');
assert.doesNotMatch(api, /power_system:\s*powerSystemData/, 'full power-system canon must not be dumped into story material');

assert.match(api, /모임 전체를 끝내지 않은 채/, 'synthetic anchor must demonstrate depth before event completion');
assert.match(api, /정보 전달 사이에도 사람들의 행동이 계속된다/, 'synthetic anchor must demonstrate people moving through information delivery');

assert.doesNotMatch(api, /eventQueue|npcScheduler|spotlightDebt|rotationIndex|cooldownTurns|sceneGoal|sceneExitCondition|turnHook/i, 'R2A must remain engine-free');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'R2A stays one Writer call');

console.log('PASS V0-R2A scene overlap / signal rebalance invariants');
