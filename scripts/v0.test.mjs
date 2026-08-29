import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const api = readFileSync('api/write.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const html = readFileSync('index.html', 'utf8');

execFileSync(process.execPath, ['--check', 'api/write.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'src/client.js'], { stdio: 'pipe' });

assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'V0 must have one Writer endpoint call site');
assert.match(api, /store:\s*false/, 'Writer call must use store:false');
assert.match(api, /gpt-5\.6-terra/, 'V0 baseline model should default to Terra');
assert.match(api, /EXACT USER ACTION\\n\$\{action\}/, 'exact user action must be appended without rewrite');
assert.match(api, /maxItems:\s*28/, 'scene schema should remain a free ordered beat stream with ample room');
assert.doesNotMatch(api, /suggested[_ -]?actions|turn-hook|scene-momentum|context-router|time-plan|event_progress|director_plan/i, 'legacy narrative-control markers must not enter V0 API');
assert.doesNotMatch(client, /\.focus\s*\(/, 'mobile client must not steal keyboard focus automatically');
assert.doesNotMatch(html, /Suggested Actions|AUTO FLOW|CONTINUE|Event Director/i, 'legacy turn controls must not appear in V0 UI');
assert.match(html, /name="background"/, 'free PC background field required');
assert.match(html, /name="skills"/, 'free PC skills field required');
assert.match(html, /name="equipment"/, 'free PC equipment field required');
assert.match(client, /JSON\.stringify\(\{ action, runState \}\)/, 'client must send current action and run state directly');

console.log('PASS V0 pure narrative runtime invariants');
