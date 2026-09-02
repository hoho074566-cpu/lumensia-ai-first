#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assembleAuthoring } from '../api/lib/authoring-runtime.js';

const runtime = readFileSync('api/lib/authoring-runtime.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const keeper = readFileSync('api/state-keeper.js', 'utf8');
const authoring = JSON.parse(readFileSync('data/authoring/lumensia-academy.json', 'utf8'));

assert.match(runtime, /const MAX_HISTORY_TURNS = 5;/, 'Writer raw recent context should be dieted from eight to five turns');
assert.match(runtime, /PC 핵심 현재 사실:/, 'realm/talent/stat facts should receive a compact high-salience block');
assert.match(runtime, /감정 반응까지 약하게 만들라는 뜻이 아니다/, 'anti-escalation must not flatten character emotion');
assert.match(runtime, /고정 캐스트가 아니다/, 'present-character continuity must not become a fixed cast recommendation');
assert.match(client, /conditions:\s*splitList\(data\.get\('conditions'\)\)/, 'PC creator must persist conditions into the run state');
assert.match(keeper, /이전 장면에 있었다는 이유만으로 유지하지 않는다/, 'State Keeper must not preserve stale present cast merely because they appeared before');
assert.match(keeper, /끝난 절차·평가·보고를 open_threads에 남겨/, 'completed procedures must not remain as narrative pressure');

assert.equal(authoring.development_examples?.length, 2, 'keep the compact two-example Golden3 few-shot budget');
assert.ok(authoring.development_examples.some((row) => String(row.writer || '').includes('레나')), 'retain a quiet low-energy example');
assert.ok(authoring.development_examples.some((row) => String(row.writer || '').includes('에밀리')), 'balance few-shot temperature with a character who visibly changes emotional mode');
assert.ok(!authoring.development_examples.some((row) => String(row.writer || '').includes('손목 힘 빼고 다시')), 'remove the novice Artemis drill example that can over-generalize teacher/student framing');
assert.doesNotMatch(authoring.prompt_template, /감정 반응까지 약하게|고정 캐스트|latest 5 turns/, 'accepted Golden3 prompt template stays untouched by context-balance corrections');

const history = Array.from({ length: 7 }, (_, index) => ({
  action: `history-action-${index + 1}`,
  inputKind: 'intent',
  mode: 'action',
  scene: [{ kind: 'narration', text: `history-scene-${index + 1}` }],
}));
const assembled = assembleAuthoring({
  action: '현재 장면을 본다.',
  pc: {
    name: '발렌치나', age: 50, gender: '여성', department: '미정', origin: '이세계', socialStatus: '기타',
    realm: '소드 마스터', magicCircle: 0,
    background: '아주 긴 과거 설정이 뒤에 이어진다.', characterProfile: '거칠지만 냉정한 베테랑.',
    talents: { magic: 1, martial: 10, soul: 8, knowledge: 9 },
    stats: { body: 'A+', mana: 'F', intelligence: 'A', holy: 'F' },
    traits: [], authorities: [], skills: ['팔레르모 스파다:S'], equipment: ['가속탄 레이피어'],
    conditions: ['오딘의 눈 손상'], startingGold: 0,
  },
  scene: {
    date: '1285-03-01', time: '10:00', location: '제2훈련장', situation: '평가가 끝난 직후.',
    presentCharacterKeys: ['artemis', 'sera', 'lillia'],
  },
  relationships: {}, continuityMemory: {}, history, mode: 'action', contextMode: 'compact',
});

assert.doesNotMatch(assembled.input, /history-action-1|history-action-2|history-scene-1|history-scene-2/, 'old raw turns outside the latest five must not keep reinforcing stale cast/tone');
for (const marker of ['history-action-3', 'history-action-4', 'history-action-5', 'history-action-6', 'history-action-7']) {
  assert.match(assembled.input, new RegExp(marker), `latest-five recent context must retain ${marker}`);
}
assert.ok(assembled.input.indexOf('무의 경지: 소드 마스터') < assembled.input.indexOf('배경: 아주 긴 과거 설정'), 'core realm fact should appear before long PC prose fields');
assert.match(assembled.input, /현재 상태: 오딘의 눈 손상/, 'persisted PC conditions must reach Writer runtime input');

for (const forbidden of [/castRotation/i, /recentCastPenalty/i, /characterCooldown/i, /npcQuota/i, /emotionScore/i]) {
  assert.doesNotMatch(`${runtime}\n${keeper}`, forbidden, `context cleanup must not become deterministic narrative machinery: ${forbidden}`);
}

console.log('PASS Writer context balance — PC salience, recent-context diet, cast release, emotional range');
