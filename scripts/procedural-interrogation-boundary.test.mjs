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

assert.match(authoring.input, /신원 확인·등록·보고·취조처럼 사실을 확인하기 위한 절차성 대화/, 'runtime must recognize procedural interrogation as compressible procedure');
assert.match(authoring.input, /세부 질문을 한 턴씩 연쇄하지 않는다/, 'runtime must not encourage one-question-per-turn interrogation loops');
assert.match(authoring.input, /실제 갈등·관계 변화·중대한 선택을 만드는 핵심 질문이면 그 장면의 깊이는 유지/, 'important consequential dialogue must still retain scene depth');
assert.doesNotMatch(runtime, /interrogationCount|questionCount|maxQuestions|questionQuota|interrogationStage/i, 'no deterministic interrogation counter/stage may be introduced');
assert.equal(AUTHORING_DATA.prompt_template, authoringJson.prompt_template, 'procedural compression boundary must not fork the accepted Golden3 prompt');

console.log('PASS procedural interrogation compression boundary');
