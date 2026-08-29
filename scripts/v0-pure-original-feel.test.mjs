import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const api = readFileSync('api/write.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const html = readFileSync('index.html', 'utf8');
const baseline = JSON.parse(readFileSync('data/scenarios/academy-1285-03-01/baseline.json', 'utf8'));

execFileSync(process.execPath, ['--check', 'api/write.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'src/client.js'], { stdio: 'pipe' });

assert.match(api, /Fast between scenes, deep inside scenes/, 'Writer must carry the original-like speed/depth rule');
assert.match(api, /NPCs have their own desires and may start conversations, challenges, invitations, arguments, warnings, requests, departures, investigations, training, or local problems/, 'NPC desire must be allowed to originate scenes');
assert.match(api, /let the NPC act on it instead of merely appearing and observing/, 'NPC initiative must become action rather than decorative presence');
assert.match(api, /camera follows the strongest current collision involving the PC/, 'PC/world collision must guide the camera without a hook engine');
assert.match(api, /Use unequal prose density/, 'Writer must use uneven prose density instead of uniform AI narration');
assert.match(api, /Do not print bare clock-state sentences/, 'clock state must not leak as bare timestamp prose');
assert.match(api, /preserve that duration exactly instead of stretching or shrinking time/, 'explicit elapsed duration must not be distorted to hit schedule milestones');
assert.match(api, /Characters reveal themselves through action, interruption, refusal, practical detail, subtext, choices, and contrast/, 'characterization must prefer behavior over thematic speeches');
assert.match(api, /Combat is an evolving exchange/, 'combat must remain adaptive and physical');
assert.match(api, /Failure creates a new story state/, 'failure aftermath must persist');
assert.match(api, /npc_knows_about_pc/, 'minimal NPC knowledge boundary must reach the Writer');
assert.match(api, /Familiarity records contact history, not automatic friendship or companionship/, 'familiarity must not imply affiliation');
assert.match(api, /CONTINUATION MODE/, 'server must support continue mode without a new PC action');
assert.match(api, /ADMIN SCENE PREVIEW MODE/, 'server must support non-canonical admin scene previews');
assert.match(api, /speakerName === pc\.name/, 'PC dialogue hard guard must remain');
assert.doesNotMatch(api, /function recentSpeakerKeys\(/, 'Pure rebuild must not reintroduce recency-only character promotion');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'Pure rebuild remains one Writer call');
assert.doesNotMatch(api, /eventQueue|npcScheduler|eventDensityScore|attentionMeter|protagonistMagnet|pcHookScore|sceneStateMachine|storyCurrent|sceneDirector|timeEngine|calendarEngine/i, 'Pure rebuild must not grow a deterministic narrative engine');

assert.deepEqual(baseline.housing?.first_year_halls, ['A동', 'B동', 'C동'], 'A/B/C first-year residence halls must exist');
assert.match(String(baseline.housing?.assignment_rule || ''), /전체를 한 생활동에 몰아넣지 않/, 'all departments must not be silently collapsed into A hall');
assert.ok((baseline.dated_world_facts || []).some((row) => row.time === '09:10' && String(row.fact).includes('레나')), 'opening Canon must include Lena after Emily');
assert.ok((baseline.dated_world_facts || []).some((row) => row.time === '09:15' && String(row.fact).includes('생활동')), 'opening Canon must include residence guidance before noon orientation');
assert.ok(Array.isArray(baseline.character_immutable_facts?.artemis), 'Artemis immutable facts required');
assert.ok(baseline.character_immutable_facts.artemis.some((fact) => String(fact).includes('성인 여성')), 'Artemis gender must not drift');

assert.match(client, /residence: assignResidence\(pc\)/, 'new runs must get one persistent PC residence fact');
assert.match(client, /relationships: \{\}/, 'new runs must start with no invented PC↔NPC relationship');
assert.match(client, /function applyRelationshipUpdates/, 'minimal relationship facts must persist');
assert.match(client, /mode: 'continue'/, 'continue requests must be explicit mode rather than fake PC action');
assert.match(client, /adminPreviews/, 'admin previews must remain session-only client state');
assert.match(client, /data-admin-close/, 'admin preview must have a direct close control');
assert.match(client, /data-admin-clear/, 'admin previews must have a direct clear-all control');
assert.match(client, /copy-block-button/, 'generated scene blocks must expose copy control');
assert.match(html, /id="advanceButton"[^>]*>이어 진행</, 'UI must expose dedicated 이어 진행 button');

console.log('PASS V0 Pure Original Feel Core invariants');
