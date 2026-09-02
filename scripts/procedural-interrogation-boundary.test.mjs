#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assembleAuthoring, AUTHORING_DATA } from '../api/lib/authoring-runtime.js';

const runtime = readFileSync('api/lib/authoring-runtime.js', 'utf8');
const authoringJson = JSON.parse(readFileSync('data/authoring/lumensia-academy.json', 'utf8'));

const authoring = assembleAuthoring({
  action: '마지막 기억은 다른 세계의 전장에서 적과 싸우다 심장을 관통당한 것이다.',
  pc: {
    name: '아사', age: 24, gender: '여성', department: '미정', origin: '이세계', socialStatus: '기타',
    background: '다른 세계의 전장에서 죽었다고 판단한 뒤 루멘시아에서 눈을 떴다.',
    equipment: ['탄약 추진식 사복검'],
  },
  scene: {
    date: '1285-03-01', time: '08:50', location: '루멘시아 아카데미 정문 광장',
    situation: '신원 미상의 무장자가 나타나 아르테미스가 핵심 신원을 확인 중이다.',
    presentCharacterKeys: ['artemis', 'sera'],
  },
  relationships: {}, continuityMemory: {}, history: [], mode: 'action', contextMode: 'compact',
});

assert.match(authoring.input, /조사, 격리, 취조, 연구 같은 흐름을 자동 확대하지 않는다/, 'procedural interrogation must not auto-expand into a self-sustaining arc');
assert.match(authoring.input, /답이 이미 제공된 PC 설정·문서·현재 사실에 있으면 같은 내용을 플레이어에게 다시 문답식으로 진술시키지 말고 필요한 결과까지 압축한다/, 'supplied PC facts must not become repeated player interrogation');
assert.match(authoring.input, /실제 위험·갈등·허용 여부·중요한 결과를 바꾸는 핵심 불확실성만 장면에 남긴다/, 'only result-changing procedural uncertainty should stay live');
assert.match(authoring.input, /새로운 증거가 생기면 기존 판단·거리감·역할 관계를 실제로 갱신한다/, 'new evidence must update the scene rather than preserve a stale intake frame');
assert.doesNotMatch(runtime, /interrogationCount|questionCount|maxQuestions|questionQuota|interrogationStage/i, 'no deterministic interrogation counter/stage may be introduced');
assert.equal(AUTHORING_DATA.prompt_template, authoringJson.prompt_template, 'procedural consolidation must not fork the accepted Golden3 prompt');

console.log('PASS consolidated procedural interrogation / restatement-compression boundary');
