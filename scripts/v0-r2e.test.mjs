import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api = readFileSync('api/write.js', 'utf8');

assert.match(api, /full PC profile in HARD FACTS is system ground truth, not automatically knowledge shared with NPCs/, 'system PC truth must be separated from NPC knowledge');
assert.match(api, /npc_knows_about_pc/, 'Writer must receive an explicit per-NPC knowledge boundary');
assert.match(api, /state\.notable_context/, 'R2E must reuse established relationship context instead of adding a second NPC-knowledge database');
assert.match(api, /Do not smooth a stranger into a familiar peer merely to keep dialogue moving/, 'stranger social distance must remain meaningful without scripting exact dialogue');
assert.match(api, /Use notable_context only for an encounter or fact that this NPC actually experienced or learned/, 'relationship context must not absorb system-only PC facts');

assert.doesNotMatch(api, /knowsDepartment|knowsName|knowsSocialStatus|npcKnowledgeDb|knowledgeTier|strangerDialogue|noble.*=>|commoner.*=>/i, 'R2E must not grow per-field knowledge flags or scripted social behavior');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'R2E remains one Writer call');

console.log('PASS V0-R2E minimal NPC-to-PC knowledge boundary invariants');
