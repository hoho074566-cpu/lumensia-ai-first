import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const api = readFileSync('api/write.js', 'utf8');
const authoringRuntime = readFileSync('api/lib/authoring-runtime.js', 'utf8');
const canonContext = readFileSync('api/lib/canon-context.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const html = readFileSync('index.html', 'utf8');

execFileSync(process.execPath, ['--check', 'api/write.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'api/lib/authoring-runtime.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'api/lib/canon-context.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'src/client.js'], { stdio: 'pipe' });

assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'runtime must have one Writer endpoint call site');
assert.match(api, /store:\s*false/, 'Writer call must use store:false');
assert.match(api, /gpt-5\.6-terra/, 'baseline model should default to Terra');
assert.match(api, /assembleAuthoring/, 'Writer endpoint must use the frozen Authoring Runtime assembly boundary');
assert.match(authoringRuntime, /EXACT USER INPUT\\n\$\{action\}/, 'exact user action must be appended without rewrite by the Authoring Runtime');
assert.match(authoringRuntime, /buildCanonContext/, 'Authoring Runtime must use the factual Canon retrieval boundary');
assert.match(api, /maxItems:\s*28/, 'scene schema should remain a free ordered beat stream with ample room');
assert.match(canonContext, /ACADEMY_PRESENCE/, 'academy cast discovery must come from dated academy presence rather than a hand-picked name list');
assert.doesNotMatch(canonContext, /EVERYDAY_ACADEMY_CAST/, 'factual retrieval must not maintain a separate hand-picked everyday cast');
assert.match(api, /speaker_name/, 'runtime must support anonymous one-scene dialogue without inventing canonical character keys');
assert.doesNotMatch(`${api}\n${authoringRuntime}`, /suggested[_ -]?actions|turn-hook|scene-momentum|context-router|time-plan|event_progress|director_plan/i, 'legacy narrative-control markers must not enter the write path');
assert.doesNotMatch(canonContext, /eventDensity|attentionMeter|pcHookScore|sceneDirector|npcScheduler|storyCurrent/i, 'Canon retrieval must remain factual, not become a narrative selector engine');
assert.doesNotMatch(client, /\.focus\s*\(/, 'mobile client must not steal keyboard focus automatically');
assert.doesNotMatch(client, /scrollTo\s*\(|scrollIntoView\s*\(/, 'mobile client must not steal scroll position after a response');
assert.doesNotMatch(html, /Suggested Actions|AUTO FLOW|Event Director/i, 'legacy narrative turn controls must not appear in UI');
assert.match(html, /id="continueButton"/, 'Continue may exist only as a dedicated non-player-action mode');
assert.match(html, /id="adminDialog"/, 'Admin Preview may exist as an isolated diagnostic surface');
assert.match(html, /name="background"/, 'free PC background field required');
assert.match(html, /name="skills"/, 'free PC skills field required');
assert.match(html, /name="equipment"/, 'free PC equipment field required');
assert.match(client, /action:\s*submittedAction/, 'normal client requests must preserve the exact submitted action');
assert.match(client, /runState,/, 'client must send current run state directly');
assert.match(client, /continueScene:\s*isContinue/, 'Continue must use a dedicated request flag');
assert.match(client, /adminScenePreview:\s*isAdmin/, 'Admin Preview must use a dedicated request flag');

console.log('PASS V0 AI-first runtime invariants under Authoring Runtime assembly');
