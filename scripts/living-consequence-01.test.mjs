#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyContinuityDecision, buildStateKeeperInput, normalizeContinuityMemory } from '../api/state-keeper.js';
import { assembleAuthoring, AUTHORING_DATA } from '../api/lib/authoring-runtime.js';

const keeperSource = readFileSync('api/state-keeper.js', 'utf8');
const writerSource = readFileSync('api/write.js', 'utf8');
const authoringJson = JSON.parse(readFileSync('data/authoring/lumensia-academy.json', 'utf8'));

for (const marker of ['[약속]', '[빚·호의]', '[소문]', '[평판]', '[의무]', '[후속]', '[NPC 진행]']) {
  assert.match(keeperSource, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `State Keeper must know living-consequence marker ${marker}`);
}
assert.match(keeperSource, /인상적인 일이 일어났다는 이유만으로 소문이나 평판이 자동 발생했다고 만들지 않는다/, 'rumor/reputation must require Writer-confirmed spread or perception');
assert.match(keeperSource, /미래에 무언가 할 것 같다는 추측을 \[NPC 진행\]으로 만들지 않는다/, 'NPC progress must not become offscreen simulation by guess');
assert.match(keeperSource, /다음 Writer가 반드시 회수해야 하는 장면 지시가 아니다/, 'living consequence must not be a forced callback');
assert.match(keeperSource, /자동 실행 예약이나 카운트다운으로 바꾸지 않는다/, 'living consequence must not become a timer/scheduler');

const prior = normalizeContinuityMemory({
  facts: ['입학식은 이미 끝났다.'],
  exchanges: ['릴리아와 PC는 서로 다음에 다시 검을 맞대 보자고 말했다.'],
  openThreads: [
    '[약속] 릴리아와 다음 자유훈련 때 다시 대련하기로 서로 합의했다.',
    '[빚·호의] 클로에는 PC에게 받은 도움을 나중에 갚겠다고 명확히 말했다.',
    '[소문] 기사과 학생들 사이에 PC의 공개 대련 이야기가 실제로 퍼지기 시작했다.',
  ],
});
assert.equal(prior.openThreads.length, 3, 'living consequences remain bounded semantic continuity strings');

const keeperInput = buildStateKeeperInput({
  pc: { name: 'ConsequenceTest', stats: {}, skills: [], equipment: [], conditions: [], startingGold: 0 },
  growth: {}, relationships: {}, continuityMemory: prior,
  action: '도서관으로 간다.',
  turn: { scene: [{ text: '도서관은 조용했다. 릴리아는 이 장면에 등장하지 않았다.' }] },
  scene: { date: '1285-03-02', time: '14:10', location: '중앙 회랑', situation: '자유 시간.', presentCharacterKeys: [] },
});
assert.match(keeperInput, /DURABLE CONTINUITY MEMORY[\s\S]*\[약속\].*릴리아/, 'State Keeper must receive prior active consequence facts');
assert.match(keeperInput, /\[소문\].*기사과 학생들/, 'State Keeper must receive social spread that was already established');

const applied = applyContinuityDecision({
  scene: { date: '1285-03-02', time: '14:10', location: '중앙 회랑', situation: '자유 시간.', presentCharacterKeys: [] },
  continuityMemory: prior,
  decision: {
    scene_state: { date: '1285-03-02', time: '14:20', location: '도서관', situation: '도서관에서 자료를 찾는 중.', present_character_keys: [] },
    continuity_memory: {
      facts: ['입학식은 이미 끝났다.'],
      exchanges: ['릴리아와 PC는 서로 다음에 다시 검을 맞대 보자고 말했다.'],
      open_threads: [
        '[약속] 릴리아와 다음 자유훈련 때 다시 대련하기로 서로 합의했다.',
        '[소문] 기사과 학생들 사이에 PC의 공개 대련 이야기가 실제로 퍼지기 시작했다.',
      ],
    },
  },
});
assert.equal(applied.scene_state.location, '도서관');
assert.equal(applied.continuity_memory.openThreads.length, 2, 'fulfilled/superseded consequences can disappear from the current snapshot instead of accumulating forever');
assert.ok(!applied.continuity_memory.openThreads.some((row) => row.includes('클로에')), 'resolved consequence omission must actually remove it');

const authoring = assembleAuthoring({
  action: '자료를 찾아본다.',
  pc: { name: 'ConsequenceTest', age: 20, gender: '남성', department: '기사과', talents: {}, stats: {}, skills: [], traits: [], authorities: [], equipment: [], conditions: [], startingGold: 0 },
  scene: { date: '1285-03-02', time: '14:20', location: '도서관', situation: '도서관에서 자료를 찾는 중.', presentCharacterKeys: [] },
  relationships: {}, continuityMemory: applied.continuity_memory, history: [], mode: 'action', contextMode: 'compact',
});
assert.match(authoring.input, /지속 연속성 메모[\s\S]*아직 미해결인 현재 흐름[\s\S]*\[약속\].*릴리아/, 'next Writer must receive active promises as current facts');
assert.match(authoring.input, /미래를 계획하는 지시가 아니라 과거\/현재 사실 기록이다/, 'Writer must already receive the non-directive continuity boundary');
assert.equal(AUTHORING_DATA.prompt_template, authoringJson.prompt_template, 'Living Consequence must not edit the accepted Golden3 Writer prompt');

assert.equal((writerSource.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'Living Consequence must preserve one Writer narrative call');
assert.equal((keeperSource.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'Living Consequence must stay inside the existing unified State Keeper call');
assert.doesNotMatch(keeperSource, /const\s+(?:consequenceScheduler|callbackScheduler|eventScheduler)|dueAt\s*:|callbackAt\s*:|countdown\s*:/i, 'no consequence scheduler/timer state may be introduced');

console.log('PASS LIVING-CONSEQUENCE-01 semantic promises/debts/rumors/aftermath without scheduler or forced callback');
