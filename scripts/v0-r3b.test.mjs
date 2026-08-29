import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api = readFileSync('api/write.js', 'utf8');
const baseline = JSON.parse(readFileSync('data/scenarios/academy-1285-03-01/baseline.json', 'utf8'));
const situations = JSON.parse(readFileSync('data/scenarios/academy-1285-03-01/open-situations.json', 'utf8'));

const openingFacts = baseline.dated_world_facts || [];
const dormFact = openingFacts.find((row) => row.time === '09:15')?.fact || '';
assert.match(dormFact, /A동/, 'R3B must preserve first-year A-dorm placement');
assert.match(dormFact, /1인실/, 'R3B must not silently invent a shared roommate room when the opening dorm fact is single occupancy');

const castBoundary = (situations.situations || []).find((row) => row.id === 'canon_academy_population');
assert.ok(castBoundary, 'R3B must expose the Canon-cast population boundary');
assert.match(castBoundary.fact, /기존 Canon Named NPC를 우선 사용/, 'persistent personal scene roles should prefer plausible Canon Named NPCs');
assert.match(castBoundary.fact, /새 이름을 붙여 지속적 개인 캐릭터로 승격시키지 않는다/, 'generic background actors must not silently become new recurring named characters');
assert.match(castBoundary.fact, /군중, 짧은 기능적 발화, 일회성 배경 행동/, 'generic people must remain available for ordinary background life');

assert.doesNotMatch(api, /namedNpcQueue|castScheduler|sceneAnchorScore|npcSpawnTable|roommateSelector|characterRotation/i, 'R3B must not introduce a deterministic cast-placement engine');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'R3B remains one Writer call');

console.log('PASS V0-R3B Canon named-cast priority invariants');
