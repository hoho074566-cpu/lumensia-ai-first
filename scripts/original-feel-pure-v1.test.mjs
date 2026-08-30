import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api = readFileSync('api/write.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const html = readFileSync('index.html', 'utf8');
const styles = readFileSync('src/styles.css', 'utf8');

assert.match(api, /Write the next living scene of serialized fantasy fiction/i, 'Writer must frame output as a living fiction scene');
assert.match(api, /Treat Canon as facts and constraints, not a prose agenda/i, 'Canon must constrain rather than prescribe prose');
assert.match(api, /Choose scene scale like fiction/i, 'scene scale must remain a Writer judgment');
assert.match(api, /world and NPCs keep acting for their own reasons/i, 'world activity must not wait for the PC');
assert.match(api, /Show character through behavior/i, 'characterization must be behavior-first');
assert.match(api, /Named Canon characters are possibilities, not scheduled encounters/i, 'Named NPCs must remain plausible possibilities instead of scheduled beats');
assert.match(api, /Schedules and state constrain continuity; they are not automatic scene beats/i, 'state must not become narrative procedure');
assert.match(api, /Unknown remains unknown/i, 'unsupplied durable facts must fail closed');
assert.match(api, /Failure changes what comes next/i, 'failure aftermath must remain consequential');

assert.match(api, /SCENE CALIBRATION EXAMPLES/, 'Writer must receive a small calibration set');
assert.match(api, /these demonstrate scene judgment only\. They are not Canon/i, 'calibration examples must be explicitly non-Canon');
assert.match(api, /connective routine -> human-scale moment/i, 'calibration must demonstrate routine-to-live-scene camera judgment');
assert.match(api, /broad exploration -> first worthwhile live thread/i, 'calibration must demonstrate broad-action camera judgment');
assert.match(api, /action -> reaction -> changed next beat/i, 'calibration must demonstrate evolving combat/consequence judgment');

assert.match(api, /ambient_cast_index/, 'Writer packet must expose a thin ambient cast index');
assert.match(api, /thin possibility index for people in academy life/i, 'ambient cast must not be interpreted as exact location or forced presence');
assert.match(api, /opening_premise/, 'opening-only scene premise must be supported');
assert.match(api, /scope: 'opening_only'/, 'opening premise must be explicitly scoped to the opening');
assert.doesNotMatch(api, /Never chain clerk -> guide -> supervisor -> timetable -> room tour/i, 'failed negative-rule patch stack must not remain in the active Writer contract');

const writerCalls = api.match(/fetch\('https:\/\/api\.openai\.com\/v1\/responses'/g) || [];
assert.equal(writerCalls.length, 1, 'Original-Feel V2 must keep exactly one Writer model call');
assert.doesNotMatch(api, /Event Director|Event Engine|NPC selector score|hook score|attention meter/i, 'deterministic narrative machinery must not return');

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

console.log('PASS Original-Feel Pure V2 writer-material/runtime invariants');
