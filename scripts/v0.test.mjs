import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const api = readFileSync('api/write.js', 'utf8');
const canonContext = readFileSync('api/lib/canon-context.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const html = readFileSync('index.html', 'utf8');

execFileSync(process.execPath, ['--check', 'api/write.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'api/lib/canon-context.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'src/client.js'], { stdio: 'pipe' });

assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'V0 must have one Writer endpoint call site');
assert.match(api, /store:\s*false/, 'Writer call must use store:false');
assert.match(api, /gpt-5\.6-terra/, 'V0 baseline model should default to Terra');
assert.match(api, /EXACT USER ACTION\\n\$\{action\}/, 'exact user action must be appended without rewrite');
assert.match(api, /maxItems:\s*28/, 'scene schema should remain a free ordered beat stream with ample room');
assert.match(api, /buildCanonContext/, 'V0 must use the factual Canon retrieval boundary');
assert.match(canonContext, /ACADEMY_PRESENCE/, 'academy cast discovery must come from dated academy presence rather than a hand-picked name list');
assert.doesNotMatch(canonContext, /EVERYDAY_ACADEMY_CAST/, 'factual retrieval must not maintain a separate hand-picked everyday cast');
assert.match(api, /speaker_name/, 'V0 must support anonymous one-scene dialogue without inventing canonical character keys');
assert.doesNotMatch(api, /suggested[_ -]?actions|turn-hook|scene-momentum|context-router|time-plan|event_progress|director_plan/i, 'legacy narrative-control markers must not enter V0 API');
assert.doesNotMatch(canonContext, /eventDensity|attentionMeter|pcHookScore|sceneDirector|npcScheduler|storyCurrent/i, 'Canon retrieval must remain factual, not become a narrative selector engine');
assert.doesNotMatch(client, /\.focus\s*\(/, 'mobile client must not steal keyboard focus automatically');
assert.doesNotMatch(client, /scrollTo\s*\(|scrollIntoView\s*\(/, 'mobile client must not steal scroll position after a response');
assert.doesNotMatch(html, /Suggested Actions|AUTO FLOW|Event Director/i, 'legacy narrative turn controls must not appear in V0 UI');
assert.match(html, /id="continueButton"/, 'Continue is allowed only as a dedicated non-player-action mode');
assert.match(html, /name="background"/, 'free PC background field required');
assert.match(html, /name="skills"/, 'free PC skills field required');
assert.match(html, /name="equipment"/, 'free PC equipment field required');
assert.match(client, /action:\s*submittedAction/, 'normal client requests must preserve the exact submitted action');
assert.match(client, /runState,/, 'client must send current run state directly');

console.log('PASS V0 pure narrative runtime invariants');
