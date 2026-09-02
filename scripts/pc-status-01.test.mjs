#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { safePc } from '../api/write.js';
import { assembleAuthoring, AUTHORING_DATA } from '../api/lib/authoring-runtime.js';

const index = readFileSync('index.html', 'utf8');
const statusUi = readFileSync('src/pc-status-ui.js', 'utf8');
const statusCss = readFileSync('src/pc-status-ui.css', 'utf8');
const writer = readFileSync('api/write.js', 'utf8');
const authoringRuntime = readFileSync('api/lib/authoring-runtime.js', 'utf8');
const authoringJson = JSON.parse(readFileSync('data/authoring/lumensia-academy.json', 'utf8'));

assert.match(index, /id="statusButton"[^>]*>INFO</, 'top bar must expose the original-style INFO status entry');
assert.match(index, /id="statusDialog"/, 'PC status dialog must exist');
assert.match(index, /name="statBody"/, 'PC creation must accept an initial body grade');
assert.match(index, /name="statMana"/, 'PC creation must accept an initial mana grade');
assert.match(index, /name="statIntelligence"/, 'PC creation must accept an initial intelligence grade');
assert.match(index, /name="statHoly"/, 'PC creation must accept an initial holy grade');
assert.match(index, /src="\/src\/pc-status-ui\.js"/, 'status companion must be loaded');
assert.match(index, /href="\/src\/pc-status-ui\.css"/, 'status styles must be loaded');

assert.match(statusUi, /pc\.stats\s*=\s*\{/, 'status UI must persist the four durable PC stats');
assert.match(statusUi, /pc\.conditions\s*=/, 'status UI must persist current conditions');
assert.match(statusUi, /pc\.skills\s*=/, 'status editor must persist graded skill strings');
assert.match(statusUi, /pc\.traits\s*=/, 'status editor must persist traits');
assert.match(statusUi, /pc\.authorities\s*=/, 'status editor must persist authorities');
assert.match(statusUi, /pc\.equipment\s*=/, 'status editor must persist equipment');
assert.match(statusUi, /window\.location\.reload\(\)/, 'explicit Admin mutation must resync the private in-memory runtime');
assert.doesNotMatch(statusUi, /fetch\(['"]\/api\/write/, 'status UI must not create a Writer call');
assert.doesNotMatch(statusUi, /api\.openai\.com/, 'status UI must not call a model');
assert.match(statusCss, /\.status-stat-grid/, 'status UI must visibly present core stats');
assert.match(statusCss, /\.status-condition-section/, 'current conditions must have a dedicated status presentation');

const pc = safePc({
  name: 'StatusTest',
  age: 20,
  gender: '남성',
  department: '기사과 1학년',
  realm: '소드 마스터',
  magicCircle: 3,
  startingGold: 27,
  talents: { magic: 2, martial: 10, soul: 7, knowledge: 5 },
  stats: { body: 'A+', mana: 'B', intelligence: 'C', holy: 'F' },
  skills: ['대검술:S', '오러 운용:A+'],
  traits: ['전투 감각: 높은 적응력'],
  authorities: ['시간 정지: 하루 1회'],
  equipment: ['훈련용 장검'],
  conditions: ['오른쪽 손목 경미한 타박'],
});

assert.deepEqual(pc.stats, { body: 'A+', mana: 'B', intelligence: 'C', holy: 'F' });
assert.deepEqual(pc.conditions, ['오른쪽 손목 경미한 타박']);
assert.deepEqual(pc.skills, ['대검술:S', '오러 운용:A+']);

const authoring = assembleAuthoring({
  action: '정면의 훈련용 표적을 벤다.',
  pc,
  scene: {
    date: '1285-03-04',
    time: '14:10',
    location: '기사과 제1훈련장',
    situation: '정규 훈련 시간.',
    presentCharacterKeys: [],
  },
  relationships: {},
  continuityMemory: {},
  history: [],
  mode: 'action',
  contextMode: 'compact',
});

assert.match(authoring.input, /무의 경지: 소드 마스터\./, 'latest realm must reach Writer runtime input');
assert.match(authoring.input, /마법 써클: 3\./, 'latest circle must reach Writer runtime input');
assert.match(authoring.input, /스탯: 신체 A\+ \/ 마나 B \/ 지능 C \/ 신성 F\./, 'latest core stats must reach Writer runtime input');
assert.match(authoring.input, /현재 스킬: 대검술:S \/ 오러 운용:A\+\./, 'latest skills must reach Writer runtime input');
assert.match(authoring.input, /현재 장비: 훈련용 장검\./, 'latest equipment must reach Writer runtime input');
assert.match(authoring.input, /현재 상태: 오른쪽 손목 경미한 타박\./, 'latest injury/condition must reach Writer runtime input');
assert.match(authoring.input, /현재 기준 금화: 27\./, 'latest gold must reach Writer runtime input');

assert.equal(AUTHORING_DATA.prompt_template, authoringJson.prompt_template, 'PC-STATUS-01 must not replace or fork the Golden3 Writer prompt');
assert.match(authoringRuntime, /RUNTIME STATE\\n\$\{currentRuntimeState\(pc, scene, relationships, continuityMemory\)\}/, 'status, relationships and continuity must enter through runtime facts, not prompt rules');
assert.equal((writer.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'PC status work must preserve the one Writer call architecture');

console.log('PASS PC-STATUS-01 durable status -> Writer runtime contract');
