#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  compactKeeperRunState,
  keeperSkillShadow,
  prepareKeeperBody,
  prepareWriterBody,
  restoreExistingEquipmentDescriptions,
  restoreRichSkillDescriptions,
  splitSceneForKeeper,
} from '../src/runtime-integrity-core.js';
import { npcAppearanceStatsAccurate } from '../src/npc-diagnostic-core.js';

const index = readFileSync('index.html', 'utf8');
const guard = readFileSync('src/runtime-integrity-guard.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const writer = readFileSync('api/write.js', 'utf8');
const keeper = readFileSync('api/state-keeper.js', 'utf8');
const authoring = readFileSync('data/authoring/lumensia-academy.json', 'utf8');

const history = Array.from({ length: 120 }, (_, index) => ({ action: `turn-${index}`, scene: [{ text: `scene-${index}` }] }));
const runState = {
  version: 1,
  id: 'run-audit',
  scenarioId: 'academy-1285-03-01',
  pc: {
    name: 'AuditPC',
    skills: ['팔레르모 스파다:S — 기존 설명을 그대로 보존해야 한다.', '단순기술:A+'],
    equipment: [`장비-${'E'.repeat(175)}`],
  },
  growth: { version: 1, evidence: [], changes: [] },
  relationships: {},
  continuityMemory: { version: 1, facts: [], exchanges: [], openThreads: [] },
  scene: { date: '1285-03-03', time: '12:00', location: '훈련장', situation: '테스트', presentCharacterKeys: [] },
  history,
};

const writerBody = prepareWriterBody({ action: '본다.', runState });
assert.equal(writerBody.runState.history.length, 8, 'Writer network payload must carry only the recent transport window');
assert.equal(writerBody.runState.history[0].action, 'turn-112');
assert.equal(runState.history.length, 120, 'transport compaction must never mutate/delete durable local history');

const keeperState = compactKeeperRunState(runState);
assert.equal(Object.hasOwn(keeperState, 'history'), false, 'State Keeper network payload must not upload story history it never reads');
assert.deepEqual(keeperState.pc.skills, ['팔레르모 스파다:S', '단순기술:A+'], 'rich graded skills must be exposed to Keeper as parseable shadow grades');

assert.deepEqual(keeperSkillShadow(['팔레르모 스파다:S — 설명']), ['팔레르모 스파다:S']);
assert.deepEqual(
  restoreRichSkillDescriptions(['팔레르모 스파다:S — 설명'], ['팔레르모 스파다:S+']),
  ['팔레르모 스파다:S+ — 설명'],
  'promotion must preserve the user-visible skill description',
);

const longEquipment = `오딘의 눈 — ${'가'.repeat(170)}`;
const truncatedEquipment = longEquipment.slice(0, 160);
assert.deepEqual(
  restoreExistingEquipmentDescriptions([longEquipment], [truncatedEquipment]),
  [longEquipment],
  'Keeper normalization must not permanently shorten an unchanged existing equipment description',
);

const longBeat = `BEGIN-${'M'.repeat(2470)}-END_MARKER`;
const split = splitSceneForKeeper([{ kind: 'narration', text: longBeat }], 2300);
assert.ok(split.length >= 2, 'legal 2600-char Writer beats must be split before the Keeper 2400-char per-beat sanitizer');
assert.ok(split.every((beat) => beat.text.length <= 2300));
assert.equal(split.map((beat) => beat.text).join(''), longBeat, 'Keeper transport splitting must preserve every character including the ending');
assert.match(split.map((beat) => beat.text).join(''), /END_MARKER$/);

const preparedKeeper = prepareKeeperBody({ action: '테스트', turn: { scene: [{ text: longBeat }] }, runState });
assert.equal(Object.hasOwn(preparedKeeper.runState, 'history'), false);
assert.match(preparedKeeper.turn.scene.map((beat) => beat.text).join(''), /END_MARKER$/);

const names = { lena: '레나', serena: '세레나', sera: '세라' };
const npcStats = npcAppearanceStatsAccurate({ history: [{
  scene: [{ text: '세레나가 조용히 책을 덮었다.' }],
  continuity: { present_character_keys: ['sera'] },
  persistedSceneState: { present_character_keys: [] },
}] }, names);
assert.deepEqual(npcStats.rows.map((row) => [row.key, row.count]), [['serena', 1]], '세레나 mention must not false-count 레나 and persisted cast must override stale RAW fallback cast');

const guardIndex = index.indexOf('/src/runtime-integrity-guard.js');
const clientIndex = index.indexOf('/src/client.js');
assert.ok(guardIndex >= 0 && clientIndex >= 0 && guardIndex < clientIndex, 'integrity guard must load before the gameplay client');
assert.match(guard, /status === 'pending' \|\| status === 'failed'/, 'pending/failed bookkeeping must block another Writer turn');
assert.match(guard, /turn\.stateKeeper = \{ status: 'pending'/, 'Keeper call must durably mark the turn pending before network completion');
assert.match(guard, /recoverInterruptedBookkeeping\(\)/, 'boot must convert interrupted pending bookkeeping into a retryable failure');
assert.match(guard, /prepareWriterBody/, 'Writer request transport must be compacted below the Writer');
assert.match(guard, /prepareKeeperBody/, 'Keeper request transport must be compacted below the Keeper');
assert.doesNotMatch(guard, /prompt_template|authoring-runtime|OPENAI|eventStage|scheduler|cast rotation/i, 'integrity transport guard must not become narrative machinery');

assert.match(client, /runState\.history\.push\(turnRecord\)/, 'full durable history must still remain in the save');
assert.equal((writer.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'audit fixes must preserve one Writer call');
assert.equal((keeper.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'audit fixes must preserve one State Keeper call');
assert.match(authoring, /세계는 player의 다음 입력을 기다리며 정지하지 않는다/, 'Golden3 prompt source must remain intact');

console.log('PASS FULL-HEALTH-AUDIT-01 transaction safety + payload diet + rich skill preservation + diagnostic accuracy');
