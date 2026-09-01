#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyRelationshipDecision, buildStateKeeperInput, normalizeRelationships } from '../api/state-keeper.js';
import { assembleAuthoring, AUTHORING_DATA } from '../api/lib/authoring-runtime.js';

const stateKeeper = readFileSync('api/state-keeper.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const statusUi = readFileSync('src/pc-status-ui.js', 'utf8');
const statusCss = readFileSync('src/pc-status-ui.css', 'utf8');
const writer = readFileSync('api/write.js', 'utf8');
const authoringRuntime = readFileSync('api/lib/authoring-runtime.js', 'utf8');
const authoringJson = JSON.parse(readFileSync('data/authoring/lumensia-academy.json', 'utf8'));

const firstMeaningful = applyRelationshipDecision({
  relationships: {},
  decision: {
    relationship_observations: [{ npc_key: 'sera', evidence: '세라가 훈련 중 도움을 받고 짧게 감사를 표했다.', significance: 'meaningful' }],
    relationship_changes: [{
      npc_key: 'sera', before_main: '아는 사이', after_main: '호감', before_aux: [], after_aux: [],
      reason: '도움을 받고 좋은 인상을 받았다.', notice: '세라가 당신에게 호감을 느끼기 시작합니다.',
    }],
  },
  date: '1285-03-02', time: '15:00',
});
assert.equal(firstMeaningful.relationships.sera.main, '아는 사이', 'one ordinary meaningful interaction without prior evidence must not jump to a new main relationship');
assert.equal(firstMeaningful.relationship_changes.length, 0);
assert.equal(firstMeaningful.relationships.sera.evidence.length, 1, 'the interaction should still remain as quiet relationship evidence');

const auxiliarySignal = applyRelationshipDecision({
  relationships: {},
  decision: {
    relationship_observations: [{ npc_key: 'isabel', evidence: '이사벨이 대련 뒤 PC의 반응을 더 알고 싶어 하며 관심을 보였다.', significance: 'meaningful' }],
    relationship_changes: [{
      npc_key: 'isabel', before_main: '아는 사이', after_main: '아는 사이', before_aux: [], after_aux: ['흥미'],
      reason: '대련을 계기로 개인적인 관심이 생겼다.', notice: '이사벨이 당신에게 흥미를 보이기 시작합니다.',
    }],
  },
  date: '1285-03-02', time: '16:00',
});
assert.deepEqual(auxiliarySignal.relationships.isabel.aux, ['흥미'], 'a meaningful scene may change an auxiliary relationship signal without fabricating a larger main relationship');
assert.equal(auxiliarySignal.relationship_changes.length, 1);

const accumulated = applyRelationshipDecision({
  relationships: {
    sera: {
      main: '아는 사이', aux: ['경계'],
      evidence: [{ id: 'old-rel', note: '여러 차례 훈련을 함께하며 약속을 지키는 모습을 봤다.', significance: 'meaningful', date: '1285-03-02', time: '15:00' }],
      changes: [], updatedAt: '1285-03-02 15:00',
    },
  },
  decision: {
    relationship_observations: [{ npc_key: 'sera', evidence: '위험한 순간 PC를 먼저 믿고 등을 맡겼으며 이후 먼저 말을 걸었다.', significance: 'meaningful' }],
    relationship_changes: [{
      npc_key: 'sera', before_main: '아는 사이', after_main: '호감', before_aux: ['경계'], after_aux: ['신뢰'],
      reason: '누적된 신뢰와 이번 행동으로 감정의 의미가 달라졌다.', notice: '세라가 당신에게 호감을 느끼기 시작합니다.',
    }],
  },
  date: '1285-03-05', time: '17:20',
});
assert.equal(accumulated.relationships.sera.main, '호감');
assert.deepEqual(accumulated.relationships.sera.aux, ['신뢰']);
assert.equal(accumulated.relationship_changes.length, 1);
assert.equal(accumulated.relationship_changes[0].notice, '세라가 당신에게 호감을 느끼기 시작합니다.');

const confessionOnly = applyRelationshipDecision({
  relationships: {
    sera: {
      main: '호감', aux: ['신뢰'], evidence: [{ id: 'old', note: '서로 호감을 확인해 가는 중이다.', significance: 'meaningful' }], changes: [],
    },
  },
  decision: {
    relationship_observations: [{ npc_key: 'sera', evidence: 'PC가 고백했지만 세라는 즉답하지 않고 생각할 시간을 달라고 했다.', significance: 'meaningful' }],
    relationship_changes: [{
      npc_key: 'sera', before_main: '호감', after_main: '연인', before_aux: ['신뢰'], after_aux: ['신뢰'],
      reason: '고백이 있었다.', notice: '세라가 당신의 고백을 받아들였습니다.',
    }],
  },
});
assert.equal(confessionOnly.relationships.sera.main, '호감', 'a confession without an explicit relationship milestone must never auto-create lovers');
assert.equal(confessionOnly.relationship_changes.length, 0);

const acceptedConfession = applyRelationshipDecision({
  relationships: {
    sera: {
      main: '호감', aux: ['신뢰'], evidence: [{ id: 'old', note: '서로 호감을 확인해 가는 중이다.', significance: 'meaningful' }], changes: [],
    },
  },
  decision: {
    relationship_observations: [{ npc_key: 'sera', evidence: '세라가 고백을 명확히 받아들이고 서로 연인으로 지내기로 합의했다.', significance: 'milestone' }],
    relationship_changes: [{
      npc_key: 'sera', before_main: '호감', after_main: '연인', before_aux: ['신뢰'], after_aux: ['신뢰'],
      reason: '상호 고백 수락과 연애 관계 성립이 장면에서 명확히 확정됐다.', notice: '세라가 당신의 고백을 받아들였습니다.',
    }],
  },
});
assert.equal(acceptedConfession.relationships.sera.main, '연인', 'explicit mutual acceptance may establish lovers');
assert.equal(acceptedConfession.relationship_changes.length, 1);

const unknownNpc = applyRelationshipDecision({
  relationships: {},
  decision: {
    relationship_observations: [{ npc_key: 'made_up_npc', evidence: '임의 인물', significance: 'milestone' }],
    relationship_changes: [],
  },
});
assert.deepEqual(unknownNpc.relationships, {}, 'unregistered NPC keys must not enter durable relationships');
assert.equal(unknownNpc.relationship_observations.length, 0);

const normalized = normalizeRelationships({
  sera: { main: '호감', aux: ['경계', '경계', '호감'], evidence: [], changes: [] },
  made_up_npc: { main: '연인' },
});
assert.deepEqual(normalized.sera.aux, ['경계']);
assert.equal('made_up_npc' in normalized, false);

const keeperInput = buildStateKeeperInput({
  pc: { name: 'RelationTest', stats: {}, skills: [], talents: {} },
  growth: {},
  relationships: accumulated.relationships,
  action: '세라와 함께 훈련장으로 걷는다.',
  turn: { scene: [{ text: '세라는 평소보다 자연스럽게 보폭을 맞추며 먼저 말을 걸었다.' }] },
  scene: { date: '1285-03-05', time: '18:00' },
});
assert.match(keeperInput, /CURRENT PC RELATIONSHIPS[\s\S]*sera \(세라\): 호감 · 신뢰/, 'State Keeper must see the durable main + auxiliary relation');
assert.match(keeperInput, /REGISTERED NPC KEYS[\s\S]*sera: 세라/, 'State Keeper must map only registered Canon NPC keys');
assert.match(keeperInput, /WRITER-CONFIRMED RESULT[\s\S]*보폭을 맞추며 먼저 말을 걸었다/, 'relationship judgment must be grounded in the Writer-confirmed scene');

const authoring = assembleAuthoring({
  action: '세라에게 인사한다.',
  pc: { name: 'RelationTest', age: 20, gender: '남성', department: '기사과 1학년' },
  scene: { date: '1285-03-05', time: '18:10', location: '기사과 회랑', situation: '수업 후.', presentCharacterKeys: ['sera'] },
  relationships: accumulated.relationships,
  history: [],
  mode: 'action',
  contextMode: 'compact',
});
assert.match(authoring.input, /sera \/ 세라: 호감 · 신뢰/, 'Writer runtime must receive the latest relationship state');
assert.match(authoring.input, /작가용 현재 사실/, 'relationship tags must be framed as Writer-side facts');
assert.match(authoring.input, /시스템 용어를 자동으로 알고 그대로 발화하는 정보가 아니며/, 'NPCs must not magically speak internal relationship tags');
assert.equal(AUTHORING_DATA.prompt_template, authoringJson.prompt_template, 'RELATIONSHIP-01 must not fork or rewrite the Golden3 Writer prompt');

assert.match(client, /relationships:\s*\{\}/, 'new runs must start with a durable relationship store');
assert.match(client, /relationshipChanges:\s*\[\]/, 'turns must track only accepted relationship milestones for UI feedback');
assert.match(client, /relationshipNoticeHtml\(turn\)/, 'accepted relationship milestones must have a dedicated UI surface');
assert.match(client, /runState\.relationships\s*=\s*statePayload\.relationships/, 'State Keeper relationship state must persist into the save');
assert.match(statusUi, /RELATIONSHIP/, 'INFO must expose current relationships');
assert.match(statusUi, /CHARACTER_NAMES/, 'INFO must resolve canonical character names');
assert.match(statusCss, /\.status-relationship-row/, 'INFO must style main + auxiliary relations');
assert.match(statusCss, /\.relationship-notice/, 'relationship milestones must have a visible turn notice');
assert.doesNotMatch(statusUi, /affinity|호감도|trust\s*[:=]/i, 'player-facing INFO must not expose numeric affinity/trust machinery');

assert.match(stateKeeper, /관계는 선형 사다리가 아니다/, 'State Keeper must treat relationships semantically rather than as a linear affection ladder');
assert.match(stateKeeper, /'연인'은 고백을 했다는 사실/, 'lover status must require an explicit relationship milestone');
assert.doesNotMatch(stateKeeper, /relationship_xp|affinity_delta|trust_delta/, 'deterministic relationship XP/delta machinery must not be introduced');
assert.equal((writer.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'Writer remains one narrative model call');
assert.equal((stateKeeper.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'growth and relationships must share one bookkeeping State Keeper call');
assert.equal((client.match(/fetch\('\/api\/state-keeper'/g) || []).length, 1, 'client must not add a third relationship model call');
assert.match(authoringRuntime, /currentRuntimeState\(pc, scene, relationships\)/, 'Writer relationship knowledge must enter through runtime facts');

console.log('PASS RELATIONSHIP-01 semantic main + auxiliary relationship contract');
