#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parsePcSettings } from '../src/pc-paste.js';

const index = readFileSync('index.html', 'utf8');
const ui = readFileSync('src/pc-paste-ui.js', 'utf8');
const parser = readFileSync('src/pc-paste.js', 'utf8');
const writerPrompt = readFileSync('data/authoring/lumensia-academy.json', 'utf8');

const human = parsePcSettings(`
이름: 아사
나이: 24
성별: 여성
학과: 기사과
출신: 이계
신분: 용병
입학 방식: 특례
무의 경지: 익스퍼트 상급
마법 써클: 0
초기 금화: 1250
재능: 마법 2 / 무 10 / 영혼 8 / 지식 6
스탯: 신체 A+ / 마나 B / 지능 C+ / 신성 F
외형: 검붉은 제복과 인공눈.
배경: 다른 세계의 전장에서 싸웠다.
마지막 전투에서 심장을 관통당했다.
캐릭터 프로필: 무뚝뚝하고 전투 경험이 많다.
Trait: 죽음 감지
Authority: 예지안
초기 스킬:
사복검술:A
전장 감각:A+
초기 장비:
탄약 추진식 사복검
검붉은 제복
현재 상태: 특이사항 없음
`);

assert.equal(human.format, 'text');
assert.equal(human.values.name, '아사');
assert.equal(human.values.age, '24');
assert.equal(human.values.realm, '익스퍼트 상급');
assert.equal(human.values.talentMartial, '10');
assert.equal(human.values.talentMagic, '2');
assert.equal(human.values.statBody, 'A+');
assert.equal(human.values.statHoly, 'F');
assert.match(human.values.background, /다른 세계의 전장[\s\S]*심장을 관통/);
assert.match(human.values.skills, /사복검술:A[\s\S]*전장 감각:A\+/);
assert.match(human.values.equipment, /탄약 추진식 사복검[\s\S]*검붉은 제복/);

const exported = parsePcSettings(JSON.stringify({
  version: 1,
  pc: {
    name: 'JsonPC', age: 20, department: '마법과', realm: '비기너', magicCircle: 3, startingGold: 77,
    talents: { magic: 9, martial: 3, soul: 5, knowledge: 8 },
    stats: { body: 'D', mana: 'A-', intelligence: 'B+', holy: 'F' },
    traits: ['마력 감응'], authorities: ['없음'], skills: ['화염술:B'], equipment: ['지팡이'], conditions: ['피로'],
  },
}));
assert.equal(exported.format, 'json');
assert.equal(exported.values.name, 'JsonPC');
assert.equal(exported.values.magicCircle, '3');
assert.equal(exported.values.talentMagic, '9');
assert.equal(exported.values.statMana, 'A-');
assert.equal(exported.values.skills, '화염술:B');
assert.equal(exported.values.conditions, '피로');

assert.match(index, /id="pcPasteToggle"[^>]*>설정 붙여넣기</, 'character creator must expose paste-settings entry');
assert.match(index, /id="pcPasteInput"/, 'paste-settings textarea must exist');
assert.match(index, /src="\/src\/pc-paste-ui\.js"/, 'paste-settings UI module must load');
assert.match(ui, /parsePcSettings/, 'UI must use the local parser');
assert.match(ui, /applyPcSettingsToForm/, 'UI must populate existing character creator fields');
assert.doesNotMatch(`${ui}\n${parser}`, /fetch\(|api\.openai\.com|\/api\/write|\/api\/state-keeper/, 'paste-settings must stay local and add no model/server call');
assert.ok(writerPrompt.includes('prompt_template'), 'Golden3 prompt source remains present and is not part of paste-settings logic');

console.log('PASS PC paste-settings local JSON/text -> creator form contract');
