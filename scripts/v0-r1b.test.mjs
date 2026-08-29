import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api = readFileSync('api/write.js', 'utf8');

assert.match(api, /Dramatize moments worth experiencing; compress routine transit, waiting, administration, and uneventful time aggressively\./,
  'R1B must preserve adaptive camera compression');
assert.match(api, /Do not tour a setting: let it appear through action, interaction, or a few sharp relevant details\./,
  'R1B must keep environment inside the scene instead of tourism prose');
assert.match(api, /Prefer concrete action, physical detail, dialogue, and subtext over summary or interpretation\./,
  'R1B must prefer experienced scene detail over abstract recap');
assert.match(api, /Once the reader can infer the meaning, do not explain it again\./,
  'R1B must trust the reader after the scene has shown the meaning');

assert.match(api, /story_affordances:\s*livingWorldPacket\(\)/,
  'R1A living-world affordances must remain intact');
assert.match(api, /EXACT USER ACTION\\n\$\{action\}/,
  'exact user action must remain the final input section');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1,
  'R1B must remain a single Writer call');
assert.doesNotMatch(api, /sceneGoal|sceneProgress|sceneExitCondition|nextSceneCandidates|turnHook|narrativeScore|rewriteScene|styleScore/i,
  'R1B must not become a deterministic narrative director');
assert.doesNotMatch(api, /minimum paragraphs|maximum paragraphs|sentence quota|dialogue ratio|sensory detail count/i,
  'R1B must not introduce prose quotas');

console.log('PASS V0-R1B original-camera invariants');
