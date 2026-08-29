import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const api = readFileSync('api/write.js', 'utf8');
const baseline = JSON.parse(readFileSync('data/scenarios/academy-1285-03-01/baseline.json', 'utf8'));

execFileSync(process.execPath, ['--check', 'api/write.js'], { stdio: 'pipe' });

assert.match(api, /The world is already in motion before the PC acts/, 'R3A must make world motion the default premise');
assert.match(api, /PLAYER AUTONOMY is not WORLD INACTIVITY/, 'NPC/world initiative must coexist with PC authority');
assert.match(api, /Quiet is a mode, not the default state/, 'quiet play must not freeze the world');
assert.match(api, /Scene Completion > Turn Completion/, 'R3A must prefer developed scenes over action ticks');
assert.match(api, /A populated place should feel populated/, 'populated locations must carry visible human activity');
assert.match(api, /NPCs may talk to each other without routing every exchange through the PC/, 'NPC-to-NPC interaction must be writer-authorized');
assert.match(api, /Do not wait for the player to type an event request/, 'writer must be allowed to originate plausible local developments');
assert.match(api, /Failure is a new story state, not an automatic retry or invisible reset/, 'failure must persist as story state');
assert.match(api, /Combat is an evolving exchange, not a verdict paragraph/, 'combat must evolve through tactical beats');
assert.match(api, /World state is not automatically a Story Beat/, 'clock/runtime facts must not leak literally into prose');
assert.match(api, /ORIGINAL_SCENE_GRAMMAR/, 'R3A must use abstract original-scene grammar');
assert.match(api, /const SYNTHETIC_RHYTHM_ANCHORS = ORIGINAL_SCENE_GRAMMAR/, 'legacy anchor slot must now point to abstract grammar rather than example choreography');
assert.match(api, /immutableCharacterFacts/, 'immutable presentation facts must reach relevant character packets');
assert.match(api, /character_immutable_facts/, 'immutable presentation facts must also be authoritative hard facts');

const opening = baseline.dated_world_facts || [];
assert.ok(opening.some((row) => row.time === '09:10' && String(row.fact).includes('레나')), 'opening canon must include Lena freshman-representative beat after Emily');
assert.ok(opening.some((row) => row.time === '09:15' && String(row.fact).includes('기숙사')), 'opening canon must include dorm/free-time guidance before noon orientation');
assert.ok(Array.isArray(baseline.character_immutable_facts?.artemis), 'Artemis immutable facts must exist');
assert.ok(baseline.character_immutable_facts.artemis.some((fact) => String(fact).includes('성인 여성')), 'Artemis must not be freely gender-swapped');
assert.ok(baseline.character_immutable_facts.artemis.some((fact) => String(fact).includes('백발')), 'Artemis visual identity must include white hair');
assert.ok(String(baseline.runtime_rule || '').includes('시간값은 세계 상태'), 'scenario must distinguish time state from story beats');

assert.doesNotMatch(api, /eventQueue|nextEvent|npcScheduler|sceneDirector|storyCurrent|sceneGoal|sceneExitCondition|turnHook|eventDensityScore|incidentRoll/i, 'R3A must not replace writer freedom with a deterministic narrative engine');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'R3A remains one Writer call');

console.log('PASS V0-R3A original scene grammar invariants');
