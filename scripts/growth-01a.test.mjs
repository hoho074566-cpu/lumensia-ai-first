#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GRADE_LADDER, applyGrowthDecision, buildStateKeeperInput } from '../api/state-keeper.js';

const writer = readFileSync('api/write.js', 'utf8');
const stateKeeper = readFileSync('api/state-keeper.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const authoringJson = readFileSync('data/authoring/lumensia-academy.json', 'utf8');

assert.deepEqual(GRADE_LADDER, [
  'F','F+','E-','E','E+','D-','D','D+','C-','C','C+','B-','B','B+','A-','A','A+','A++',
  'S-','S','S+','S++','SS-','SS','SS+','SSS-','SSS','SSS+',
]);

const basePc = {
  name: 'GrowthTest',
  realm: '익스퍼트 입문',
  magicCircle: null,
  talents: { magic: 2, martial: 9, soul: 6, knowledge: 5 },
  stats: { body: 'C', mana: 'D', intelligence: 'C', holy: 'F' },
  skills: ['대검술:B', '오러 운용:C+'],
  traits: ['전투 감각'],
  authorities: [],
};

const input = buildStateKeeperInput({
  pc: basePc,
  growth: {
    version: 1,
    evidence: [{ id: 'old-1', domain: 'skill', target: '대검술', note: '자세 교정을 이해했다.', significance: 'meaningful', consumed: false }],
    changes: [],
  },
  relationships: {},
  action: '교정받은 자세로 다시 벤다.',
  turn: { scene: [{ text: '발 위치를 고친 뒤 같은 궤적을 흔들림 없이 재현했다.' }] },
  scene: { date: '1285-03-04', time: '14:10' },
});
assert.match(input, /USER DECLARATION[\s\S]*교정받은 자세로 다시 벤다/, 'State Keeper must see the actual user declaration');
assert.match(input, /WRITER-CONFIRMED RESULT[\s\S]*흔들림 없이 재현했다/, 'State Keeper must ground growth in the Writer-confirmed result');
assert.match(input, /UNCONSUMED GROWTH EVIDENCE[\s\S]*자세 교정을 이해했다/, 'State Keeper must see accumulated unconsumed evidence');

const oneRoutine = applyGrowthDecision({
  pc: basePc,
  growth: { version: 1, evidence: [], changes: [] },
  decision: {
    observations: [{ domain: 'skill', target: '대검술', evidence: '기본 베기를 한 번 성공했다.', significance: 'meaningful' }],
    promotions: [{ domain: 'skill', target: '대검술', from_grade: 'B', to_grade: 'B+', reason: '한 번 성공했다.' }],
  },
  date: '1285-03-04', time: '14:10',
});
assert.deepEqual(oneRoutine.pc_patch.skills, ['대검술:B', '오러 운용:C+'], 'one ordinary turn without prior evidence must not auto-rank a skill');
assert.equal(oneRoutine.changes.length, 0);

const accumulated = applyGrowthDecision({
  pc: basePc,
  growth: {
    version: 1,
    evidence: [{ id: 'ev-old', domain: 'skill', target: '대검술', note: '아르테미스에게 발 위치를 교정받았다.', significance: 'meaningful', date: '1285-03-03', time: '15:00', consumed: false, consumedBy: '' }],
    changes: [],
  },
  decision: {
    observations: [{ domain: 'skill', target: '대검술', evidence: '실전 대련에서 교정된 발 위치와 궤적을 안정적으로 재현했다.', significance: 'meaningful' }],
    promotions: [{ domain: 'skill', target: '대검술', from_grade: 'B', to_grade: 'B+', reason: '교정 내용을 실제 대련에서 안정적으로 재현했다.' }],
  },
  date: '1285-03-04', time: '14:10',
});
assert.deepEqual(accumulated.pc_patch.skills, ['대검술:B+', '오러 운용:C+']);
assert.equal(accumulated.changes.length, 1);
assert.equal(accumulated.growth.evidence.every((row) => row.target !== '대검술' || row.consumed), true, 'evidence used for a promotion must be consumed');

const illegalJump = applyGrowthDecision({
  pc: basePc,
  growth: { version: 1, evidence: [{ id: 'old', domain: 'skill', target: '대검술', note: '충분한 훈련', significance: 'meaningful', consumed: false }], changes: [] },
  decision: {
    observations: [{ domain: 'skill', target: '대검술', evidence: '좋은 성과', significance: 'breakthrough' }],
    promotions: [{ domain: 'skill', target: '대검술', from_grade: 'B', to_grade: 'A-', reason: '두 단계 점프 시도' }],
  },
});
assert.deepEqual(illegalJump.pc_patch.skills, basePc.skills, 'promotion must be exactly one grade step');

const inventedSkill = applyGrowthDecision({
  pc: basePc,
  growth: { version: 1, evidence: [], changes: [] },
  decision: {
    observations: [{ domain: 'skill', target: '공간절단', evidence: '갑자기 이해했다.', significance: 'breakthrough' }],
    promotions: [{ domain: 'skill', target: '공간절단', from_grade: 'F', to_grade: 'F+', reason: '없는 스킬 생성 시도' }],
  },
});
assert.deepEqual(inventedSkill.pc_patch.skills, basePc.skills, 'GROWTH-01A must never create a new skill');
assert.equal(inventedSkill.observations.length, 0, 'invalid targets must not enter the evidence ledger');

const breakthroughStat = applyGrowthDecision({
  pc: basePc,
  growth: { version: 1, evidence: [], changes: [] },
  decision: {
    observations: [{ domain: 'stat', target: 'body', evidence: '한계 상황에서 새로운 신체 운용을 완전히 체득하고 이후에도 유지했다.', significance: 'breakthrough' }],
    promotions: [{ domain: 'stat', target: 'body', from_grade: 'C', to_grade: 'C+', reason: '명백한 질적 돌파가 장면에서 확정됐다.' }],
  },
});
assert.equal(breakthroughStat.pc_patch.stats.body, 'C+', 'a genuine breakthrough may allow one immediate stat step');
assert.equal(breakthroughStat.changes.length, 1);

const consumedCannotChain = applyGrowthDecision({
  pc: { ...basePc, skills: ['대검술:B+', '오러 운용:C+'] },
  growth: accumulated.growth,
  decision: {
    observations: [{ domain: 'skill', target: '대검술', evidence: '다시 한 번 안정적으로 베었다.', significance: 'meaningful' }],
    promotions: [{ domain: 'skill', target: '대검술', from_grade: 'B+', to_grade: 'A-', reason: '직전 승급의 근거를 다시 사용하려 한다.' }],
  },
});
assert.deepEqual(consumedCannotChain.pc_patch.skills, ['대검술:B+', '오러 운용:C+'], 'consumed evidence must not immediately justify another promotion');

assert.match(stateKeeper, /GROWTH-01A 범위는 기존 스킬 숙련 등급과 신체\/마나\/지능\/신성/, 'State Keeper scope must remain narrow');
assert.match(stateKeeper, /사용자 입력은 시도\/선언일 뿐/, 'user claims must not become growth facts');
assert.doesNotMatch(stateKeeper, /hiddenXp|stat_progress|skill_experience/, 'old deterministic XP/progress engine must not return');
assert.match(client, /fetch\('\/api\/state-keeper'/, 'normal turns must call the unified State Keeper');
assert.match(client, /saveJson\(SAVE_KEY, runState\);[\s\S]*render\(\);[\s\S]*await requestStateRecord/, 'Writer scene must be saved/rendered before State Keeper bookkeeping finishes');
assert.match(client, /statePayload\.pc_patch\.stats/, 'client may apply the State Keeper stat patch');
assert.match(client, /statePayload\.pc_patch\.skills/, 'client may apply the State Keeper skill patch');
assert.equal((writer.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'Golden3 Writer endpoint must remain one narrative model call');
assert.match(stateKeeper, /https:\/\/api\.openai\.com\/v1\/responses/, 'State Keeper is a separate non-narrative model call');
assert.equal(readFileSync('data/authoring/lumensia-academy.json', 'utf8'), authoringJson, 'relationship work must not rewrite the Writer authoring file');

console.log('PASS GROWTH-01A AI-first evidence -> one-step durable growth contract');
