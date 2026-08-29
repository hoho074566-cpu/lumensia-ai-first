import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const api = readFileSync('api/write.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const html = readFileSync('index.html', 'utf8');
const baseline = JSON.parse(readFileSync('data/scenarios/academy-1285-03-01/baseline.json', 'utf8'));

execFileSync(process.execPath, ['--check', 'api/write.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'src/client.js'], { stdio: 'pipe' });

assert.match(api, /Resolve the exact user action first/, 'current PC action must be resolved before independent background simulation');
assert.match(api, /If nothing naturally changes, be brief; do not manufacture a side incident/, 'quiet action must not force random incidents');
assert.match(api, /Move quickly through anything that does not change the PC's immediate situation/, 'connective time must stay fast');
assert.match(api, /let the NPC do something concrete/, 'character reason must become concrete NPC action');
assert.match(api, /do not let it become the main scene while the PC is merely a camera/, 'NPC-to-NPC activity must not make the PC permanent CCTV');
assert.match(api, /Do not chain unrelated accidents/, 'world activity must not become incident spam');
assert.match(api, /Keep connective prose lean/, 'prose must not use uniform descriptive density');
assert.match(api, /STYLE_RHYTHM_SAMPLE/, 'one non-canon rhythm sample must be supplied');
assert.match(api, /RHYTHM SAMPLE — non-canon/, 'style specimen must be explicitly non-canon');
assert.match(api, /Do not print bare clock-state sentences/, 'bare timestamp prose must be rejected');
assert.match(api, /preserve it exactly instead of stretching or shrinking it/, 'explicit elapsed time must remain exact');
assert.match(api, /System PC facts are not automatically NPC knowledge/, 'NPC knowledge boundary must survive');
assert.match(api, /Familiarity is contact history, not automatic friendship or companionship/, 'minimal relationship state must not script affiliation');
assert.match(api, /Combat is physical and adaptive/, 'combat must remain adaptive and concrete');
assert.match(api, /Failure changes the next story state/, 'failure must persist');
assert.match(api, /CONTINUATION MODE/, 'continue mode must exist');
assert.match(api, /ADMIN SCENE PREVIEW MODE/, 'admin preview must exist');

assert.doesNotMatch(api, /The world lives without waiting for the PC|Quiet is useful contrast|event density|reaction field|focal causality/i, 'failed abstract R3/R16 narrative slogans must not return');
assert.doesNotMatch(api, /visible_open_situations:/, 'open-situation plot seeds must stay out of the minimal scene packet for this experiment');
assert.doesNotMatch(api, /values:\s*Array\.isArray\(core\.values\)|aspiration:/, 'ambient cast must stay compact rather than exposing full motivation dossiers for everyone');
assert.doesNotMatch(api, /eventQueue|npcScheduler|eventDensityScore|attentionMeter|protagonistMagnet|pcHookScore|sceneStateMachine|storyCurrent|sceneDirector|timeEngine|calendarEngine/i, 'no deterministic narrative engine');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'one Writer call only');

assert.deepEqual(baseline.housing?.first_year_halls, ['A동', 'B동', 'C동'], 'A/B/C first-year halls must survive');
assert.ok((baseline.dated_world_facts || []).some((row) => row.time === '09:10' && String(row.fact).includes('레나')), 'opening Canon must retain Lena sequence');
assert.ok(Array.isArray(baseline.character_immutable_facts?.artemis), 'Artemis immutable facts required');

assert.match(client, /residence: assignResidence\(pc\)/, 'PC residence must persist per save');
assert.match(client, /relationships: \{\}/, 'minimal relationship state must start empty');
assert.match(client, /mode: 'continue'/, 'continue must be a dedicated mode');
assert.match(client, /adminPreviews/, 'admin preview must be session-only');
assert.match(client, /data-admin-close/, 'admin preview must have direct close control');
assert.match(client, /copy-block-button/, 'scene blocks must keep copy control');
assert.match(html, /id="advanceButton"/, 'UI must keep 이어 진행 button');

console.log('PASS V0 Pure Minimal Original Scene Core V2 invariants');
