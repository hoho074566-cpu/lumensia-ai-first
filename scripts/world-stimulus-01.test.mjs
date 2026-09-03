#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assembleAuthoring, AUTHORING_DATA } from '../api/lib/authoring-runtime.js';

const academy = JSON.parse(readFileSync('data/canon/world/academy.json', 'utf8'));
const stimuli = JSON.parse(readFileSync('data/scenarios/academy-1285-03-01/open-situations.json', 'utf8'));
const authoringJson = JSON.parse(readFileSync('data/authoring/lumensia-academy.json', 'utf8'));
const runtimeSource = readFileSync('api/lib/authoring-runtime.js', 'utf8');
const writerSource = readFileSync('api/write.js', 'utf8');

assert.equal(academy.version, 4);
assert.match(academy.living_culture?.pressure_balance || '', /평온한 일상은 세계의 최대 강도가 아니라 대비다/);
assert.match(academy.living_culture?.pressure_balance || '', /무관한 습격·음모·사고를 임의로 투하하지 않는다/);
assert.match(academy.living_culture?.opportunity_culture || '', /PC 전용 퀘스트가 아니다/);
assert.match(academy.living_culture?.opportunity_culture || '', /다른 사람이 잡을 수 있다/);
assert.match(academy.living_culture?.social_heat || '', /전투가 없어도 장면의 긴장을 높일 수 있다/);
assert.match(academy.living_culture?.knowledge_boundary || '', /개별 NPC가 그것을 자동으로 아는 것은 아니다/);
assert.match(academy.living_culture?.knowledge_boundary || '', /아직 보지 못한 PC의 기술·전투 습관·과거 행동/);
assert.match(academy.living_culture?.knowledge_boundary || '', /기억이나 확정 사실처럼 말하지 않는다/);

assert.equal(stimuli.version, 3);
const kinds = new Set(stimuli.situations.map((row) => row.kind));
for (const kind of ['danger', 'mystery', 'opportunity', 'social_heat']) assert.ok(kinds.has(kind), `missing stimulus kind: ${kind}`);
assert.ok(stimuli.situations.filter((row) => row.kind === 'danger').length >= 3, 'need multiple danger pressures without making danger the only stimulus');
assert.ok(stimuli.situations.filter((row) => row.kind === 'mystery').length >= 2, 'need multiple mystery pressures');
assert.ok(stimuli.situations.filter((row) => row.kind === 'opportunity').length >= 2, 'need multiple scarce opportunities');
assert.ok(stimuli.situations.filter((row) => row.kind === 'social_heat').length >= 2, 'need multiple social-heat situations');
assert.ok(stimuli.situations.some((row) => row.id === 'wisdom_forest_spirit_avoidance'));
assert.ok(stimuli.situations.some((row) => row.id === 'magic_lab_ward_instability'));
assert.ok(stimuli.situations.some((row) => row.id === 'cross_year_sparring_open_slot'));
assert.ok(stimuli.situations.some((row) => row.id === 'magic_research_assistant_opening'));
assert.ok(stimuli.situations.some((row) => row.id === 'student_honor_duel_tension'));
assert.ok(stimuli.situations.some((row) => row.id === 'caldwyn_academic_delegation'));
assert.match(stimuli.runtime_rule || '', /이벤트 큐·발생 순서·랜덤 테이블이 아니며/);
assert.match(stimuli.runtime_rule || '', /PC와 NPC가 그 정보를 자동으로 아는 것은 아니며/);
assert.match(stimuli.runtime_rule || '', /PC가 개입하지 않아도 다른 사람의 선택과 기존 조직의 역할로 진행/);

const packet = assembleAuthoring({
  action: '학생회관 게시판 근처를 지나간다.',
  pc: {
    name: 'StimulusTest', age: 20, gender: '남성', department: '기사과', origin: '이세계', socialStatus: '기타', admission: '미정',
    realm: '소드 마스터', magicCircle: 0, talents: { magic: 1, martial: 10, soul: 8, knowledge: 9 },
    stats: { body: 'A+', mana: 'F', intelligence: 'A', holy: 'F' },
    appearance: '키가 크고 탁한 금발의 남성.',
    background: '이세계 출신이며 전투 경험이 많다.',
    characterProfile: '거칠고 자존심이 강하다.',
    traits: ['팔레르모 검술 — 단일 표적 사냥형 검술'],
    authorities: ['예지안 — 오딘의 눈'],
    skills: ['팔레르모 스파다:S'],
    equipment: ['낡은 대검'], conditions: [], startingGold: 0,
  },
  scene: { date: '1285-03-03', time: '12:20', location: '학생회관 앞 상점가', situation: '점심시간. 학생들이 게시판과 상점을 오간다.', presentCharacterKeys: [] },
  relationships: {}, continuityMemory: {}, history: [], mode: 'action', contextMode: 'compact',
});

assert.match(packet.input, /OPEN WORLD STIMULI — AUTHORIAL FACTS, NOT EVENT QUEUE/, 'Writer must actually receive unresolved world stimuli');
assert.match(packet.input, /gray_wolf_forest/, 'existing danger pressure must reach Writer');
assert.match(packet.input, /cross_year_sparring_open_slot/, 'competitive opportunity must reach Writer');
assert.match(packet.input, /magic_research_assistant_opening/, 'research opportunity must reach Writer');
assert.match(packet.input, /student_honor_duel_tension/, 'social heat must reach Writer');
assert.match(packet.input, /wisdom_forest_spirit_avoidance/, 'noncombat mystery must reach Writer');
assert.match(packet.input, /개별 NPC가 그것을 자동으로 아는 것은 아니다/, 'Writer must receive authorial-truth vs NPC-knowledge boundary');
assert.match(packet.input, /보지 못한 PC의 기술·전투 습관·과거 행동/, 'unobserved PC technique knowledge must remain uncertain for NPCs');
assert.match(packet.input, /평온한 일상은 세계의 최대 강도가 아니라 대비다/, 'anti-stall pressure balance must reach Writer');
assert.ok(packet.diagnostics.knowledge_base_sections.includes('open-world-situations'), 'diagnostics must expose the new sourcebook section');
assert.equal(packet.diagnostics.knowledge_base_character_count, 16, 'broad academy cast must remain intact');
assert.ok(packet.diagnostics.input_chars < 50000, `COMPACT context grew too large: ${packet.diagnostics.input_chars}`);

assert.equal(AUTHORING_DATA.prompt_template, authoringJson.prompt_template, 'WORLD-STIMULUS must not edit accepted Golden3 Writer prompt');
assert.equal((writerSource.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'Writer must remain one narrative call');
assert.doesNotMatch(runtimeSource, /stimulusScheduler|eventScheduler|pressureCounter|stimulusCounter|castRotation|Math\.random\(/i, 'no deterministic stimulus scheduler/counter/randomizer may be added');

console.log(`PASS WORLD-STIMULUS-01 pressure/opportunity/social heat + NPC knowledge boundary; compact input=${packet.diagnostics.input_chars}`);
