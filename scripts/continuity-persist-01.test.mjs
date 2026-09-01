#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyContinuityDecision, buildStateKeeperInput, normalizeContinuityMemory } from '../api/state-keeper.js';
import { assembleAuthoring, AUTHORING_DATA } from '../api/lib/authoring-runtime.js';

const stateKeeper = readFileSync('api/state-keeper.js', 'utf8');
const writer = readFileSync('api/write.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const authoringRuntime = readFileSync('api/lib/authoring-runtime.js', 'utf8');
const authoringJson = JSON.parse(readFileSync('data/authoring/lumensia-academy.json', 'utf8'));

const memory = normalizeContinuityMemory({
  facts: ['입학식 개막 종이 이미 울렸다.', '에밀리 교장의 환영사가 이미 끝났다.', '입학식 개막 종이 이미 울렸다.'],
  exchanges: ['이사벨은 Aaa가 용병 출신이라는 설명을 이미 들었다.'],
  openThreads: ['호숫가 습격의 배후 조사가 남아 있다.'],
});
assert.deepEqual(memory.facts, ['입학식 개막 종이 이미 울렸다.', '에밀리 교장의 환영사가 이미 끝났다.'], 'exact duplicate continuity facts must be compacted');
assert.equal(memory.exchanges.length, 1);
assert.equal(memory.openThreads.length, 1);

const keeperInput = buildStateKeeperInput({
  pc: { name: 'Aaa', stats: {}, skills: [] },
  growth: {},
  relationships: {},
  continuityMemory: memory,
  inputKind: 'situation',
  action: '**Aaa는 이미 매복의 구조를 파악한 상태다.**',
  turn: { scene: [{ text: 'Aaa는 매복자의 위치를 피해 곧바로 북쪽 골목으로 움직였다.' }] },
  scene: { date: '1285-03-01', time: '09:20', location: '호숫가', situation: '입학식 도중 호숫가 사건 대응.', presentCharacterKeys: ['isabel'] },
});
assert.match(keeperInput, /DURABLE CONTINUITY MEMORY[\s\S]*입학식 개막 종이 이미 울렸다/, 'State Keeper must see prior durable facts');
assert.match(keeperInput, /이미 공유된 핵심 정보\/대화[\s\S]*용병 출신/, 'State Keeper must see already-shared information');
assert.match(keeperInput, /INPUT KIND: SITUATION\/NARRATION CONTEXT/, 'State Keeper must know situation input authority');

const applied = applyContinuityDecision({
  scene: { date: '1285-03-01', time: '09:20', location: '호숫가', situation: '호숫가 사건 대응.', presentCharacterKeys: ['isabel'] },
  continuityMemory: memory,
  decision: {
    scene_state: {
      date: '1285-03-01',
      time: '09:32',
      location: '루멘시아 아카데미 대강당',
      situation: '호숫가 사건 뒤 입학식 진행 중.',
      present_character_keys: ['lillia', 'sera', 'not_a_real_character'],
    },
    continuity_memory: {
      facts: ['입학식 개막 종이 이미 울렸다.', '에밀리 교장의 환영사가 이미 끝났다.', '호숫가 습격 사건이 발생했고 생포자가 확보됐다.'],
      exchanges: ['이사벨은 Aaa가 용병 출신이라는 설명을 이미 들었다.'],
      open_threads: ['호숫가 습격의 배후 조사가 남아 있다.'],
    },
  },
});
assert.equal(applied.scene_state.time, '09:32');
assert.equal(applied.scene_state.location, '루멘시아 아카데미 대강당');
assert.deepEqual(applied.scene_state.present_character_keys, ['lillia', 'sera'], 'unknown cast keys must not enter durable scene state');
assert.match(applied.continuity_memory.facts.join('\n'), /환영사가 이미 끝났다/, 'completed event facts must remain durable');

const authoring = assembleAuthoring({
  action: '자리에 앉아 단상을 본다.',
  inputKind: 'intent',
  pc: { name: 'Aaa', age: 20, gender: '남성', department: '기사과 1학년', talents: {}, stats: {}, skills: [], traits: [], authorities: [], equipment: [], conditions: [], startingGold: 0 },
  scene: { date: '1285-03-01', time: '09:32', location: '루멘시아 아카데미 대강당', situation: '호숫가 사건 뒤 입학식 진행 중.', presentCharacterKeys: ['lillia', 'sera'] },
  relationships: {},
  continuityMemory: applied.continuity_memory,
  history: [],
  mode: 'action',
  contextMode: 'compact',
});
assert.match(authoring.input, /지속 연속성 메모[\s\S]*에밀리 교장의 환영사가 이미 끝났다/, 'next Writer must receive completed narrative facts');
assert.match(authoring.input, /이미 서로 공유된 핵심 정보\/대화[\s\S]*용병 출신/, 'next Writer must receive already-shared dialogue facts');

const situationAuthoring = assembleAuthoring({
  action: '**Aaa는 이미 매복의 구조를 파악한 상태다.**',
  inputKind: 'situation',
  pc: { name: 'Aaa', age: 20, talents: {}, stats: {}, skills: [], traits: [], authorities: [], equipment: [], conditions: [], startingGold: 0 },
  scene: { date: '1285-03-01', time: '09:20', location: '호숫가', situation: '추격 중.', presentCharacterKeys: [] },
  relationships: {}, continuityMemory: memory, history: [], mode: 'action', contextMode: 'compact',
});
assert.match(situationAuthoring.input, /MODE: SITUATION\/NARRATION CONTEXT[\s\S]*PC가 말했거나 행동했다는 뜻이 아니다/, 'situation mode must not be attributed to PC speech/action');
assert.match(authoringRuntime, /turn\?\.inputKind === 'situation' \? 'SITUATION CONTEXT' : 'USER'/, 'recent chat must preserve situation-vs-PC authority');
assert.match(client, /runState\.continuityMemory = statePayload\.continuity_memory/, 'client must persist State Keeper continuity memory');
assert.match(client, /statePayload\.scene_state/, 'client must persist the semantic post-scene state');
assert.match(client, /saveJson\(SAVE_KEY, runState\);[\s\S]*render\(\);[\s\S]*await requestStateRecord/, 'scene must still render before bookkeeping completes');
assert.equal((writer.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'Writer remains one narrative model call');
assert.equal((stateKeeper.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'growth + relationship + continuity stay in one State Keeper call');
assert.doesNotMatch(stateKeeper, /const\s+eventStage|event_stage\s*:/, 'continuity persistence must not become an event-stage engine');
assert.equal(AUTHORING_DATA.prompt_template, authoringJson.prompt_template, 'CONTINUITY-PERSIST must not rewrite Golden3 Writer prompt');

console.log('PASS CONTINUITY-PERSIST semantic memory -> next Writer runtime contract');
