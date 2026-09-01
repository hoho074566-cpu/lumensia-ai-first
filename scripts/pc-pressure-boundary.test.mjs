#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assembleAuthoring, AUTHORING_DATA } from '../api/lib/authoring-runtime.js';

const runtimeSource = readFileSync('api/lib/authoring-runtime.js', 'utf8');
const authoringJson = JSON.parse(readFileSync('data/authoring/lumensia-academy.json', 'utf8'));

const quietScene = {
  date: '1285-03-01',
  time: '08:40',
  location: '루멘시아 아카데미 대강당 앞',
  situation: '입학식 시작 전. 학생들이 평범하게 대강당으로 이동하고 있다.',
  presentCharacterKeys: ['sera'],
};

const strongPc = {
  name: 'AsaTest', age: 20, gender: '여성', department: '기사과 1학년',
  realm: '마스터급',
  background: '다른 세계의 전쟁에서 괴물 군주와 싸우다 심장을 관통당한 뒤 이곳에서 깨어났다.',
  characterProfile: '강한 전투 경험과 냉정한 판단력을 지녔다.',
  traits: ['예지안', '전장 생존자'],
  skills: ['사복검술:S', '전투 감각:S'],
  equipment: ['탄약 추진식 사복검'],
  talents: {}, stats: {}, authorities: [], conditions: [], startingGold: 0,
};

const weakPc = {
  name: 'QuietTest', age: 18, gender: '남성', department: '기사과 1학년',
  realm: '비기너', background: '평범한 지방 출신 신입생.', characterProfile: '조용한 성격.',
  traits: [], skills: ['검술:D'], equipment: ['훈련용 장검'], talents: {}, stats: {}, authorities: [], conditions: [], startingGold: 0,
};

const strong = assembleAuthoring({
  action: '주변을 둘러본다.', pc: strongPc, scene: quietScene, relationships: {}, continuityMemory: {}, history: [], mode: 'action', contextMode: 'compact',
});
const weak = assembleAuthoring({
  action: '주변을 둘러본다.', pc: weakPc, scene: quietScene, relationships: {}, continuityMemory: {}, history: [], mode: 'action', contextMode: 'compact',
});

for (const authoring of [strong, weak]) {
  assert.match(authoring.input, /강한 능력·비범한 과거·희귀 장비는 PC의 현재 가능성과 과거를 판정하기 위한 사실/, 'PC facts must be framed as capability/history facts, not event pressure');
  assert.match(authoring.input, /그에 비례하는 적·추적자·재앙·운명적 사건을 현재 장면에 즉시 생성하라는 지시가 아니다/, 'Writer must not scale scene danger merely to PC strength');
  assert.match(authoring.input, /실제 근거가 없다면 평범한 일상과 기존 흐름을 그대로 존중/, 'quiet scenes must remain allowed for exceptional PCs');
}

assert.match(strong.input, /다른 세계의 전쟁에서 괴물 군주와 싸우다 심장을 관통당한 뒤 이곳에서 깨어났다/, 'strong backstory must still reach the Writer unchanged');
assert.match(strong.input, /탄약 추진식 사복검/, 'unusual equipment must still reach the Writer unchanged');
assert.equal(AUTHORING_DATA.prompt_template, authoringJson.prompt_template, 'PC pressure correction must not rewrite the accepted Golden3 Writer prompt');
assert.doesNotMatch(runtimeSource, /pcPowerScore|threatScale|eventTier|strengthClass|dangerQuota|eventScheduler/i, 'do not replace semantic boundary with deterministic strength-to-event machinery');

console.log('PASS PC pressure boundary — exceptional PC facts do not imply immediate escalated events');
