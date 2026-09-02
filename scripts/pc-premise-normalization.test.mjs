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

assert.match(input, /PC의 설정·능력·출신·현재까지 실제로 드러난 행동은 세계가 존중해야 할 사실/, 'exceptional PC setup must remain a respected world fact');
assert.match(input, /서사를 자동으로 특정 방향으로 끌고 가라는 명령이 아니다/, 'exceptional premise must not become an automatic mystery/investigation route');
assert.match(input, /NPC와 세계는 관찰 가능한 사실과 자신의 지식·경험·성격에 맞게 자연스럽게 반응/, 'NPC reaction must depend on observable facts and their own competence/personality');
assert.match(input, /새로운 증거가 생기면 기존 판단·거리감·역할 관계를 실제로 갱신한다/, 'demonstrated competence must be allowed to change stale role assumptions');
assert.doesNotMatch(runtime, /premiseScore|mysteryScore|investigationStage|intakeStage|admissionStage|threatTier/i, 'premise normalization must not become a deterministic state machine');
assert.equal(AUTHORING_DATA.prompt_template, authoringJson.prompt_template, 'Golden3 Writer prompt source must remain unchanged');

console.log('PASS consolidated exceptional-PC premise / perception boundary');
