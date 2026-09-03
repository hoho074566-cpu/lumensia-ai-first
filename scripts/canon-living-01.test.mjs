#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assembleAuthoring, AUTHORING_DATA } from '../api/lib/authoring-runtime.js';

const academy = JSON.parse(readFileSync('data/canon/world/academy.json', 'utf8'));
const characterState = JSON.parse(readFileSync('data/scenarios/academy-1285-03-01/character-state.json', 'utf8'));
const relationships = JSON.parse(readFileSync('data/scenarios/academy-1285-03-01/relationships.json', 'utf8'));
const authoring = JSON.parse(readFileSync('data/authoring/lumensia-academy.json', 'utf8'));

assert.equal(academy.version, 4);
assert.equal(characterState.version, 3);
assert.match(academy.living_culture?.baseline || '', /큰 사건이 없어도.*각자의 목적 때문에 움직인다/);
assert.match(academy.living_culture?.training_spaces || '', /모든 만남이 공식 평가로 이어지지는 않는다/);
assert.match(academy.living_culture?.friction || '', /자동으로 범죄·음모·대형사건으로 확대되지 않는다/);
assert.match(academy.living_culture?.social_presence || '', /모든 인물이 모든 대화에 끼어들지는 않는다/);
assert.match(academy.living_culture?.social_presence || '', /자기 일정으로 자연스럽게 떠날 수 있다/);
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

const academyDepthKeys = ['anastasia', 'isabel', 'lucia', 'elena', 'artemis', 'sera', 'sia', 'lillia', 'lena', 'emily', 'laris', 'mirabelle', 'serena', 'chloe', 'aria', 'elise'];
for (const key of academyDepthKeys) {
  const depth = characterState.characters?.[key]?.depth_notes || [];
  assert.equal(depth.length, 2, `${key} must use exactly two compact depth axes rather than a large personality rule stack`);
}
assert.ok(characterState.characters.artemis.depth_notes.some((row) => /규칙이 사람을 살리기 위한 수단/.test(row)), 'Artemis depth should preserve rule/pragmatism tension');
assert.ok(characterState.characters.sera.depth_notes.some((row) => /계산상 손해인 선택/.test(row)), 'Sera depth should allow self-interest versus attachment tension');
assert.ok(characterState.characters.lillia.depth_notes.some((row) => /질투나 초조함/.test(row)), 'Lillia depth should allow believable negative emotion without flattening her enthusiasm');
assert.ok(characterState.characters.serena.depth_notes.some((row) => /오히려 문장이 또렷하고 완고/.test(row)), 'Serena depth should include a firm face around her own magic judgment');
assert.ok(characterState.characters.laris.depth_notes.some((row) => /망가지거나 사라지는 것은 바라지 않는다/.test(row)), 'Laris rivalry must include attachment tension');
assert.ok(characterState.characters.emily.depth_notes.some((row) => /자유를 지켜 주는 것과 위험에서 강제로 멈춰 세우는 것/.test(row)), 'Emily must carry freedom/protection tension');

for (const key of ['lucia', 'sia', 'lena', 'laris', 'mirabelle', 'serena', 'chloe', 'aria', 'elise']) {
  const notes = characterState.characters?.[key]?.current_living_notes || [];
  assert.ok(notes.length >= 3, `${key} must have enough independent daily-life signals to compete for ordinary scene relevance`);
}
assert.ok(characterState.characters.sia.current_living_notes.some((row) => /정원, 온실, 호숫가/.test(row)));
assert.ok(characterState.characters.lena.current_living_notes.some((row) => /조용한 벤치, 도서관 구석/.test(row)));
assert.ok(characterState.characters.serena.current_living_notes.some((row) => /도서관과 조용한 실습실/.test(row)));
assert.ok(characterState.characters.chloe.current_living_notes.some((row) => /여러 학과의 소문/.test(row)));
assert.ok(characterState.characters.mirabelle.current_living_notes.some((row) => /기사과 훈련/.test(row)));

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
assert.match(packet.input, /모든 인물이 모든 대화에 끼어들지는 않는다/, 'compact Writer packet must allow nearby NPCs to stay silent or leave');
assert.match(packet.input, /짧은 명령문만 반복하는 사람은 아니다/, 'compact Writer packet must receive Artemis living portrayal note');
assert.match(packet.input, /depth_notes: 원칙과 기본기를 가르치지만/, 'compact Writer packet must actually receive character depth axes');
assert.match(packet.input, /건조한 말투와 감정 없음은 다르다/, 'compact Writer packet must receive Sera emotional-expression note');
assert.match(packet.input, /같이 훈련하고 싶은 마음/, 'compact Writer packet must receive NPC-to-NPC living relationship facts');
assert.match(packet.input, /답이 이미 제공된 PC 설정·문서·현재 사실에 있으면 같은 내용을 플레이어에게 다시 문답식으로 진술시키지 말고 필요한 결과까지 압축한다/, 'routine procedure must not make the player restate supplied character facts');
assert.match(packet.input, /실제 위험·갈등·허용 여부·중요한 결과를 바꾸는 핵심 불확실성만 장면에 남긴다/, 'only result-changing procedural uncertainty should remain a scene focus');
assert.equal(AUTHORING_DATA.prompt_template, authoring.prompt_template, 'CANON-LIVING must not fork the accepted Writer prompt template');

console.log('PASS CANON-LIVING-01 living world + broad cast + compact character depth + procedural compression boundaries');