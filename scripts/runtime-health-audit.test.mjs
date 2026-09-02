#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assembleAuthoring } from '../api/lib/authoring-runtime.js';
import { applyPcStateDecision, sceneText } from '../api/state-keeper.js';

const client = readFileSync('src/client.js', 'utf8');
const statusUi = readFileSync('src/pc-status-ui.js', 'utf8');
const index = readFileSync('index.html', 'utf8');
const dialogueUi = readFileSync('src/original-dialogue-ui.js', 'utf8');
const writer = readFileSync('api/write.js', 'utf8');
const keeper = readFileSync('api/state-keeper.js', 'utf8');
const authoring = readFileSync('api/lib/authoring-runtime.js', 'utf8');

// Long Writer scenes must preserve the ending because outcomes, injuries, location and cast often resolve there.
const longScene = Array.from({ length: 10 }, (_, index) => ({
  text: index === 0
    ? `BEGIN_MARKER ${'A'.repeat(2350)}`
    : index === 9
      ? `${'Z'.repeat(2350)} END_MARKER`
      : `${index}-${'M'.repeat(2350)}`,
}));
const compactedScene = sceneText(longScene);
assert.ok(compactedScene.length <= 16000, 'State Keeper scene packet must remain bounded');
assert.match(compactedScene, /BEGIN_MARKER/, 'long-scene State Keeper input must retain the scene beginning');
assert.match(compactedScene, /END_MARKER/, 'long-scene State Keeper input must retain the scene ending');
assert.match(compactedScene, /중간 장면 생략/, 'long-scene compaction should explicitly preserve head+tail instead of silently truncating the ending');

// Physical/economic state changes are factual bookkeeping, not narrative/growth invention.
const factualState = applyPcStateDecision({
  pc: {
    equipment: ['팔레르모 레이피어', '붕대'],
    conditions: ['피로'],
    startingGold: 30,
  },
  decision: {
    pc_state_changes: {
      equipment_add: ['회복약'],
      equipment_remove: ['붕대'],
      conditions_add: ['왼팔 골절'],
      conditions_remove: ['피로'],
      gold_delta: -12,
      evidence: ['회복약을 12금화에 구매했고 붕대를 사용했으며 왼팔이 골절됐다.'],
    },
  },
});
assert.deepEqual(factualState.pc_patch.equipment, ['팔레르모 레이피어', '회복약']);
assert.deepEqual(factualState.pc_patch.conditions, ['왼팔 골절']);
assert.equal(factualState.pc_patch.startingGold, 18);
assert.equal(factualState.pc_state_changes.gold_delta, -12);

// Player-visible history must never be destroyed just to keep mobile rendering light.
assert.doesNotMatch(client, /runState\.history\s*=\s*runState\.history\.slice\(-40\)/, 'full play history must not be destructively truncated at 40 turns');
assert.match(client, /const HISTORY_RENDER_CHUNK = 40/, 'mobile rendering may page history without deleting it');
assert.match(client, /history-more-button/, 'older preserved turns must be user-accessible');
assert.match(client, /function retryLastStateRecord\(/, 'failed bookkeeping must have a no-Writer retry path');
assert.match(index, /id="retryStateButton"/, 'State Keeper recovery control must be visible when needed');
assert.match(client, /pc_patch\?\.equipment/, 'factual equipment changes must reach durable PC state');
assert.match(client, /pc_patch\?\.conditions/, 'factual condition changes must reach durable PC state');
assert.match(client, /pc_patch\?\.startingGold/, 'factual gold changes must reach durable PC state');

// Commas inside a description are prose, not implicit list separators. One line = one item.
assert.match(client, /function splitList\([\s\S]*?\.split\(\/\\n\+\/\)/, 'creator list fields must be line-based');
assert.doesNotMatch(client, /\.split\(\/\[\\n,\]\//, 'creator must not split descriptive fields on commas');
assert.doesNotMatch(statusUi, /\.split\(\/\[\\n,\]\//, 'status companion must not split conditions on commas');

const basePc = {
  name: 'AuditPC', age: 20, gender: '여성', department: '기사과', origin: '이세계', socialStatus: '기타',
  admission: '미정', realm: '소드 마스터', magicCircle: 0, startingGold: 0,
  appearance: '', background: '', characterProfile: '', talents: { martial: 10 }, stats: { body: 'A+' },
  traits: [], authorities: [], skills: [], equipment: [], conditions: [],
};
const priorTurn = [{ action: '입학식장을 나왔다.', scene: [{ kind: 'narration', text: '시간이 흘렀다.' }] }];

// Start-only scenario facts must stop haunting later turns.
const laterSameDay = assembleAuthoring({
  action: '오후 일정을 확인한다.', pc: basePc,
  scene: { date: '1285-03-01', time: '09:32', location: '중앙 회랑', situation: '입학식이 이미 진행된 뒤.', presentCharacterKeys: [] },
  relationships: {}, continuityMemory: {}, history: priorTurn, mode: 'action', contextMode: 'compact',
});
assert.doesNotMatch(laterSameDay.input, /개막 종은 아직 울리지 않았다/, 'opening situation must not remain in later same-day Writer context');
assert.doesNotMatch(laterSameDay.input, /time: 09:00; fact: 입학식이 시작될 예정/, 'already-past dated facts must leave Writer context');
assert.match(laterSameDay.input, /time: 12:00; fact: 1학년 학과별 오리엔테이션 예정/, 'still-future same-day factual schedule may remain available');

const nextDay = assembleAuthoring({
  action: '아침 식사를 마친다.', pc: basePc,
  scene: { date: '1285-03-02', time: '08:00', location: '학생 식당', situation: '다음 날 아침.', presentCharacterKeys: [] },
  relationships: {}, continuityMemory: {}, history: priorTurn, mode: 'action', contextMode: 'compact',
});
assert.doesNotMatch(nextDay.input, /time: 09:00; fact: 입학식이 시작될 예정/, 'previous-day schedule must not persist into later dates');
assert.doesNotMatch(nextDay.input, /time: 12:00; fact: 1학년 학과별 오리엔테이션 예정/, 'previous-day schedule must not persist into later dates');

// Long creator text within the server-accepted limits must reach the Writer, including its tail.
const longPc = {
  ...basePc,
  background: `${'배'.repeat(1340)}BG_END`,
  characterProfile: `${'성'.repeat(1540)}PROFILE_END`,
};
const longPcInput = assembleAuthoring({
  action: '주변을 본다.', pc: longPc,
  scene: { date: '1285-03-02', time: '08:00', location: '학생 식당', situation: '아침.', presentCharacterKeys: [] },
  relationships: {}, continuityMemory: {}, history: priorTurn, mode: 'action', contextMode: 'compact',
}).input;
assert.match(longPcInput, /BG_END/, 'Writer runtime must receive the tail of accepted PC background text');
assert.match(longPcInput, /PROFILE_END/, 'Writer runtime must receive the tail of accepted PC profile text');

// Presentation can resolve canonical full labels without creating a second narrative system.
assert.match(dialogueUi, /function resolveSpeakerKey\(/, 'dialogue presentation must support canonical full-name resolution');
assert.match(dialogueUi, /value\.startsWith\(`\$\{shortName\} `\)/, 'full canonical names must map back to the registered short-name asset key');

// Architectural call budget remains Writer 1 + State Keeper 1.
assert.equal((writer.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'runtime health fixes must preserve one Writer call site');
assert.equal((keeper.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'runtime health fixes must preserve one unified State Keeper call site');
assert.doesNotMatch(authoring, /cast rotation|NPC selector score|emotionScore|threatTier/i, 'health fixes must not grow into a narrative controller');

console.log('PASS periodic runtime health audit — endings, factual state, history, scenario freshness, PC fidelity, UI recovery');