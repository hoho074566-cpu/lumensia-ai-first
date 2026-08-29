import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const api = readFileSync('api/write.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const html = readFileSync('index.html', 'utf8');
const baseline = JSON.parse(readFileSync('data/scenarios/academy-1285-03-01/baseline.json', 'utf8'));

execFileSync(process.execPath, ['--check', 'api/write.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'src/client.js'], { stdio: 'pipe' });

assert.match(api, /Resolve the player's chosen action first/, 'Writer must resolve the current PC action before background simulation');
assert.match(api, /Pass quickly through movement, routine, waiting, and procedure when the result substantially converges/, 'low-agency connective process must compress');
assert.match(api, /Stop at the first real point where a meaningful PC decision or immediate reaction can change the outcome/, 'Writer must stop on a real branch, not arbitrary turn return');
assert.match(api, /do not turn ordinary movement into a facility tour/, 'ordinary play must not regress into location tourism');
assert.match(api, /Presence alone does not require interaction/, 'plausible Canon presence must remain distinct from interaction');
assert.match(api, /would this person staying passive here be less natural than acting/, 'NPC action must be grounded in character/situation rather than an initiative score');
assert.match(api, /Do not require the player to name a character first/, 'Canon NPCs must be able to enter without explicit player naming');
assert.match(api, /Keep world activity inside what the PC can perceive/, 'world activity must remain player-experienced rather than NPC-only cutaways');
assert.match(api, /player choice → world consequence → player choice/, 'causal progression must be choice-to-consequence centered');
assert.match(api, /Do not manufacture chains of unrelated accidents/, 'fake incident density must be rejected');
assert.match(api, /Show character through verbs/, 'characterization must prefer action/timing/dialogue over labels');
assert.match(api, /Not every opponent adapts/, 'combat adaptation must reflect the actual opponent');
assert.match(api, /A causal rescue may change the danger; it does not erase injury/, 'rescue must not cancel failure residue');
assert.match(api, /System truth about the PC is not automatically NPC knowledge/, 'relationship and NPC knowledge must remain distinct');
assert.match(api, /knowledge_gain/, 'Writer output must be able to persist newly learned NPC knowledge');
assert.match(api, /consequence_updates/, 'Writer output must expose a minimal consequence fact ledger update');
assert.match(api, /persistent_consequences/, 'persistent consequence facts must return to the Writer');
assert.match(api, /function thinCastIndex\(\)[\s\S]*Object\.entries\(CHARACTERS\)\.map/, 'all Canon characters must be visible through the thin cast index');
assert.doesNotMatch(api, /EVERYDAY_ACADEMY_CAST/, 'do not hide most Canon characters behind a hand-picked everyday subset');
assert.doesNotMatch(api, /open-situations|visible_open_situations|eventQueue|npcScheduler|eventDensityScore|attentionMeter|pcHookScore|sceneStateMachine|storyCurrent|sceneDirector|timeEngine/i, 'no event/director/selector engine or open-situation pressure in this experiment');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'still exactly one Writer call');

assert.deepEqual(baseline.housing?.first_year_halls, ['A동', 'B동', 'C동'], 'A/B/C first-year halls must remain available');
assert.match(String(baseline.housing?.assignment_rule || ''), /전체를 한 생활동에 몰아넣지 않/, 'all first years must not collapse into A hall');
assert.ok((baseline.dated_world_facts || []).some((row) => row.time === '09:10' && String(row.fact).includes('레나')), 'opening facts must preserve Lena after Emily');
assert.ok(Array.isArray(baseline.character_immutable_facts?.artemis), 'key immutable presentation facts must remain available');

assert.match(client, /residence: assignResidence\(pc\)/, 'PC residence must be persistent per save');
assert.match(client, /relationships: \{\}/, 'new run must not invent relationships');
assert.match(client, /consequences: \[\]/, 'new run must start with an empty consequence ledger');
assert.match(client, /function applyRelationshipUpdates/, 'minimal relationship facts must persist');
assert.match(client, /knownFacts/, 'NPC knowledge facts must persist separately from relationship context');
assert.match(client, /function applyConsequenceUpdates/, 'condition/equipment/world consequence facts must persist');
assert.match(client, /mode: 'continue'/, 'dedicated continue mode must remain separate from a PC action');
assert.match(client, /adminPreviews/, 'Admin Preview must remain session-only');
assert.match(client, /data-admin-close/, 'Admin Preview needs direct local close');
assert.match(client, /data-admin-clear/, 'Admin Preview needs local clear-all');
assert.match(client, /copy-block-button/, 'generated blocks need copy control');
assert.match(html, /id="advanceButton"/, 'UI must expose the Korean 이어 진행 control without legacy CONTINUE UI');

console.log('PASS V0 Observed Original Behavior Core structural invariants');
