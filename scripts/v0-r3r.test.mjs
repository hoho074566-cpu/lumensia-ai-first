import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const api = readFileSync('api/write.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');

execFileSync(process.execPath, ['--check', 'api/write.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'src/client.js'], { stdio: 'pipe' });

assert.match(api, /acceptance target is not "similar" or "improved"/, 'R3R acceptance target must be original-feel, not incremental similarity');
assert.match(api, /FOCAL CAUSALITY: the exact current PC action is the camera pivot/, 'current PC action must be the focal causal pivot');
assert.match(api, /Background action gets a few sharp details, then yields/, 'background life must not hijack a stronger PC-caused scene');
assert.match(api, /FAST BETWEEN SCENES, DEEP INSIDE SCENES/, 'R3R must combine speedy progression with deep live scenes');
assert.match(api, /A scheduled phase boundary is still real/, 'scene depth must not fuse distinct Canon phases');
assert.match(api, /which present character has the strongest in-character reason to react/, 'PC/world collision must come from character reason rather than protagonist magnetism');
assert.match(api, /BACKGROUND WORLD → COLLISION → DEVELOPED PC SCENE → REACTION FIELD/, 'original-feel camera order must keep living world and focal PC scene together');
assert.match(api, /ORIGINAL_SCENE_GRAMMAR/, 'R3R must retain abstract craft grammar rather than source copying');

assert.match(api, /ADMIN_PREVIEW_CONTRACT/, 'server must support admin scene preview instructions');
assert.match(api, /adminScenePreview/, 'admin scene preview request must be explicit');
assert.match(api, /return relationship_updates as an empty array/, 'admin preview must not mutate relationship rewards');
assert.match(client, /function parseAdminRequest/, 'client must recognize admin-prefixed scene requests');
assert.match(client, /adminScenePreview:\s*true/, 'client must mark admin preview requests');
assert.match(client, /adminPreviews\.push/, 'admin previews must render separately from canonical history');
assert.match(client, /const normalRequestBody = JSON\.stringify\(\{ action, runState \}\)/, 'normal play request shape must remain unchanged');

assert.match(client, /function scenePlainText/, 'client must build a copyable text representation per scene block');
assert.match(client, /copy-block-button/, 'each generated scene block must expose a copy button');
assert.match(client, /navigator\.clipboard\?\.writeText/, 'copy button should use the Clipboard API when available');
assert.match(css, /\.copy-icon::before, \.copy-icon::after/, 'copy control should use the overlapping-squares visual');

assert.doesNotMatch(api, /pcHookScore|attentionMeter|protagonistMagnet|contactScheduler|focalScore|eventDensityController|eventQueue|npcScheduler/i, 'R3R must not replace focal judgment with deterministic protagonist/event machinery');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'R3R remains one Writer call');

console.log('PASS V0-R3R original-feel focal rebalance invariants');
