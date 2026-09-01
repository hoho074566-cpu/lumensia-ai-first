#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assembleAuthoring, AUTHORING_DATA } from '../api/lib/authoring-runtime.js';

const runtime = readFileSync('api/lib/authoring-runtime.js', 'utf8');
const authoringJson = JSON.parse(readFileSync('data/authoring/lumensia-academy.json', 'utf8'));

const input = assembleAuthoring({
  action: '주변을 둘러본다.',
  pc: {
    name: '발렌치나', age: 50, gender: '여성', department: '미정', origin: '이세계', socialStatus: '기타',
    admission: '미정', realm: '소드 마스터', magicCircle: 0,
    background: '다른 세계의 범죄 조직 간부 출신이며 죽은 뒤 루멘시아에서 깨어났다.',
    characterProfile: '거칠지만 현재 아카데미를 공격할 의도는 없다.',
    skills: ['팔레르모 스파다:S'], equipment: ['가속탄 레이피어'], traits: [], authorities: ['예지안'],
    talents: { magic: 1, martial: 10, soul: 8, knowledge: 9 }, stats: { body: 'A+', mana: 'F', intelligence: 'A', holy: 'F' },
    startingGold: 0,
  },
  scene: {
    date: '1285-03-01', time: '09:05', location: '루멘시아 아카데미 본관 앞',
    situation: '최소한의 신원 확인이 끝났고 즉각적인 공격 징후는 없다.', presentCharacterKeys: ['sera'],
  },
  relationships: {}, continuityMemory: {}, history: [], mode: 'action', contextMode: 'compact',
}).input;

assert.match(input, /시작 전제이지, 자동으로 장기 수사·격리·검증 서사의 주제가 아니다/, 'exceptional PC setup must be framed as a playable premise, not an automatic investigation arc');
assert.match(input, /수업·훈련·식사·기숙사·친교·교내 이동/, 'runtime must allow ordinary academy-life access after minimal safety handling');
assert.match(input, /학과나 신분이 미정이라는 이유만으로 생활 진입을 무기한 보류하지 않는다/, 'unknown department/status must not stall play indefinitely');
assert.match(input, /실제 범죄·공격·명백한 위협이 발생했다면 그에 필요한 대응은 유지한다/, 'real current threats must still permit proportionate consequences');
assert.doesNotMatch(runtime, /premiseScore|mysteryScore|investigationStage|intakeStage|admissionStage|threatTier/i, 'premise normalization must not become a deterministic state machine');
assert.equal(AUTHORING_DATA.prompt_template, authoringJson.prompt_template, 'Golden3 Writer prompt source must remain unchanged');

console.log('PASS exceptional PC premise -> ordinary playable-life boundary');
