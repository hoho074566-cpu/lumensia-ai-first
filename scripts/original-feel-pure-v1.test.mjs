import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api = readFileSync('api/write.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const html = readFileSync('index.html', 'utf8');
const styles = readFileSync('src/styles.css', 'utf8');

assert.match(api, /not an RPG turn report or an academy-administration simulator/i, 'Writer must reject academy-simulator framing');
assert.match(api, /Routine is connective tissue, not the scene/i, 'routine process must be compressed instead of dramatized');
assert.match(api, /Never chain clerk -> guide -> supervisor -> timetable -> room tour/i, 'administrative NPC chains must not dominate scenes');
assert.match(api, /not permission to inventory the campus/i, 'broad exploration must not become an exhaustive campus tour');
assert.match(api, /Prefer one strong live thread/i, 'Writer should deepen one live thread instead of covering every nearby location');
assert.match(api, /Generic staff may perform a necessary transaction briefly, then recede/i, 'generic staff must stay transactional rather than become scene anchors');
assert.match(api, /exact durable logistical fact is absent from the packet/i, 'unsupplied dorm or timetable specifics must fail closed');
assert.match(api, /Named Canon characters may be present/i, 'Writer must allow plausible Canon Named NPC presence');
assert.match(api, /State is not a story beat/i, 'schedule/clock state must not become automatic fiction');
assert.match(api, /Failure creates a new state/i, 'failure aftermath must remain part of the Writer contract');
assert.match(api, /Show before interpret/i, 'Writer must prefer shown characterization over explanatory prose');

const writerCalls = api.match(/fetch\('https:\/\/api\.openai\.com\/v1\/responses'/g) || [];
assert.equal(writerCalls.length, 1, 'Original-Feel V1 must keep exactly one Writer model call');
assert.doesNotMatch(api, /Event Director|Event Engine|NPC selector score|hook score|attention meter|cast rotation/i, 'deterministic narrative machinery must not return');

assert.match(html, /id="continueButton"[^>]*>이어하기</, 'dedicated Continue button must exist');
assert.match(client, /continueScene:\s*isContinue/, 'Continue must use a dedicated request mode');
assert.match(api, /CONTINUE CURRENT SCENE/, 'server must distinguish Continue from a player action');
assert.match(client, /action:\s*isContinue \? '' : submittedAction/, 'Continue must not be stored as fake player action text');

assert.match(html, /id="adminDialog"/, 'Admin Scene Preview dialog must exist');
assert.match(html, /id="adminCloseButton"/, 'Admin Preview must have an explicit close control');
assert.match(html, /id="adminClearButton"/, 'Admin Preview must have an explicit clear control');
assert.match(client, /adminScenePreview:\s*isAdmin/, 'Admin Preview must use a dedicated request flag');
assert.match(api, /ADMIN SCENE PREVIEW MODE/, 'server must have a non-canonical Admin Preview contract');
assert.match(client, /if \(isAdmin \|\| payload\.admin_preview === true\)[\s\S]*?renderAdminPreview\(\);[\s\S]*?return;/, 'Admin Preview must return before run-state mutation');

assert.match(client, /scenePlainText/, 'scene copy serialization must exist');
assert.match(client, /copy-block-button/, 'scene blocks must expose copy controls');
assert.match(styles, /\.copy-block-button/, 'copy controls must be styled');
assert.match(styles, /\.admin-preview-body/, 'Admin Preview must be visibly separated from canonical story output');

console.log('PASS Original-Feel Pure V1 runtime/UX invariants');
