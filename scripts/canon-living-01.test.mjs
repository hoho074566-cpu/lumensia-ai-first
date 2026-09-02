#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assembleAuthoring, AUTHORING_DATA } from '../api/lib/authoring-runtime.js';

const academy = JSON.parse(readFileSync('data/canon/world/academy.json', 'utf8'));
const characterState = JSON.parse(readFileSync('data/scenarios/academy-1285-03-01/character-state.json', 'utf8'));
const relationships = JSON.parse(readFileSync('data/scenarios/academy-1285-03-01/relationships.json', 'utf8'));
const authoring = JSON.parse(readFileSync('data/authoring/lumensia-academy.json', 'utf8'));

assert.equal(academy.version, 3);
assert.match(academy.living_culture?.baseline || '', /큰 사건이 없어도.*각자의 목적 때문에 움직인다/);
assert.match(academy.living_culture?.training_spaces || '', /모든 만남이 공식 평가로 이어지지는 않는다/);
assert.match(academy.living_culture?.friction || '', /자동으로 범죄·음모·대형사건으로 확대되지 않는다/);
assert.match(academy.living_culture?.living_rule || '', /사건표나 강제 조우 목록이 아니다/);

const artemis = characterState.characters?.artemis?.current_living_notes || [];
assert.ok(artemis.some((row) => /짧은 명령문만 반복하는 사람은 아니다/.test(row)), 'Artemis must not collapse into terse tutorial-bot speech');
assert.ok(artemis.some((row) => /검사로서 대화/.test(row)), 'Artemis must be able to reframe proven experts as fellow swordspeople');
assert.ok(artemis.some((row) => /자기 판단이 틀렸/.test(row)), 'Artemis must be able to revise her own judgment');

const lillia = characterState.characters?.lillia?.current_living_notes || [];
assert.ok(lillia.some((row) => /눈에 띄게 들뜨고/.test(row)), 'Lillia needs visible enthusiasm around strong or unusual swordplay');
assert.ok(lillia.some((row) => /진지한 기사 지망생/.test(row)), 'Lillia must retain emotional contrast when danger becomes real');

const sera = characterState.characters?.sera?.current_living_notes || [];
assert.ok(sera.some((row) => /건조한 말투와 감정 없음은 다르다/.test(row)), 'Sera dryness must not mean emotional flatness');
assert.ok(sera.some((row) => /시선, 거리, 손이 먼저 움직이는/.test(row)), 'Sera emotion should have behavioral expression');

const emily = characterState.characters?.emily?.current_living_notes || [];
assert.ok(emily.some((row) => /웃음기가 바로 사라지고/.test(row)), 'Emily must retain the light-to-serious emotional drop');

const elena = characterState.characters?.elena?.current_living_notes || [];
assert.ok(elena.some((row) => /교수다운 체면보다 호기심이 먼저/.test(row)), 'Elena curiosity must feel embodied rather than purely analytical');
assert.ok(elena.some((row) => /실제 부상이나 위험/.test(row)), 'Elena curiosity must not override safety without reason');

function relation(from, to) {
  return relationships.relationships.find((row) => row.from === from && row.to === to);
}

assert.ok(relation('lillia', 'sera'), 'Lillia -> Sera everyday relationship must exist');
assert.ok(relation('sera', 'lillia'), 'Sera -> Lillia everyday relationship must exist');
assert.ok(relation('artemis', 'sera'), 'Artemis -> Sera instructor relationship must exist');
assert.ok(relation('sera', 'artemis'), 'Sera -> Artemis perception must exist');
assert.ok(relation('artemis', 'emily'), 'Artemis -> Emily faculty relationship must exist');
assert.ok(relation('emily', 'artemis'), 'Emily -> Artemis faculty relationship must exist');

const packet = assembleAuthoring({
  action: '훈련장 가장자리에서 주변을 본다.',
  pc: {
    name: 'LivingCanonTest', age: 20, gender: '여성', department: '기사과', origin: '제국', socialStatus: '평민', admission: '일반전형',
    realm: '익스퍼트 중급', magicCircle: null, talents: { martial: 7 }, stats: { body: 'B' }, traits: [], authorities: [], skills: [], equipment: [], conditions: [], startingGold: 0,
  },
  scene: { date: '1285-03-01', time: '15:20', location: '기사과 훈련장', situation: '정규 일정 사이의 자유 훈련 시간.', presentCharacterKeys: [] },
  relationships: {}, continuityMemory: {}, history: [], mode: 'action', contextMode: 'compact',
});

assert.match(packet.input, /큰 사건이 없어도 학생과 교수는 각자의 목적 때문에 움직인다/, 'compact Writer packet must receive living academy Canon');
assert.match(packet.input, /짧은 명령문만 반복하는 사람은 아니다/, 'compact Writer packet must receive Artemis living portrayal note');
assert.match(packet.input, /건조한 말투와 감정 없음은 다르다/, 'compact Writer packet must receive Sera emotional-expression note');
assert.match(packet.input, /같이 훈련하고 싶은 마음/, 'compact Writer packet must receive NPC-to-NPC living relationship facts');
assert.equal(AUTHORING_DATA.prompt_template, authoring.prompt_template, 'CANON-LIVING must not fork the accepted Writer prompt template');

console.log('PASS CANON-LIVING-01 living world + character + NPC relationship Canon');
