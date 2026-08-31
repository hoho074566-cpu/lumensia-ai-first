import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { assembleAuthoring, AUTHORING_DATA } from '../api/lib/authoring-runtime.js';
import { validateTurn } from '../api/write.js';

const spec = readFileSync('docs/AUTHORING_RUNTIME_SPEC.md', 'utf8');
const api = readFileSync('api/write.js', 'utf8');
const runtime = readFileSync('api/lib/authoring-runtime.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const index = readFileSync('index.html', 'utf8');

execFileSync(process.execPath, ['--check', 'api/write.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'api/lib/authoring-runtime.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'src/client.js'], { stdio: 'pipe' });

assert.match(spec, /AI의 서사 판단을 코드로 대신하지 않는다/, 'prime directive must remain');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'critical write path must contain exactly one Writer call');
assert.match(api, /assembleAuthoring/, 'api/write must delegate prompt construction to Authoring Runtime');
assert.match(runtime, /buildCanonContext/, 'clean Writer runtime must consume factual Canon context');
assert.doesNotMatch(runtime, /Event Director|Event Engine|Scene Planner|Scene Selector|NPC selector score|hook score|attention meter/i, 'no narrative control engine may return');

assert.equal(AUTHORING_DATA.version, 3, 'clean Writer authoring data must be version 3');
assert.equal(AUTHORING_DATA.development_examples.length, 3, 'development examples remain capped at three');
assert.doesNotMatch(AUTHORING_DATA.base_rp_template, /루멘시아|세라|릴리아|에밀리|아르테미스|시아|미라벨/, 'Base RP Template must remain story-agnostic');
assert.match(AUTHORING_DATA.main_author_prompt, /루멘시아 아카데미/, 'story identity belongs in Main Author Prompt');
assert.doesNotMatch(AUTHORING_DATA.main_author_prompt, /에밀리|아르테미스|세라|릴리아|라리스|이사벨|레나|세레나|클로에|미라벨/, 'individual cast facts must come from Canon cast material, not hardcoded Story Prompt');
assert.ok(!Object.hasOwn(AUTHORING_DATA, 'start_setting'), 'clean Writer runtime must not carry a second narrative Start Setting layer');

const pc = {
  name: '테스트PC', age: 20, gender: '남성', department: '기사과', origin: '수도 외곽', socialStatus: '평민',
  admission: '일반전형', appearance: '', background: '', characterProfile: '', realm: '익스퍼트 입문', magicCircle: null,
  talents: { martial: 5 }, traits: [], authorities: [], skills: ['기초 검술'], equipment: ['연습용 검'], startingGold: 10,
};
const startScene = {
  date: '1285-03-01', time: '08:40', location: '루멘시아 아카데미 대강당 앞',
  situation: '입학식 시작 전. 신입생·귀족 자제·평민 학생·교수·상급생이 대강당 일대에 모이고 있으며 개막 종은 아직 울리지 않았다.',
  presentCharacterKeys: [],
};

const opening = assembleAuthoring({ action: '주변을 살펴본다.', pc, scene: startScene, history: [], knowledgeLevel: 1, mode: 'action' });
const requiredOrder = [
  'CURRENT RUNTIME STATE',
  'ACADEMY CAST MATERIAL',
  'CURRENT / PRESENT CHARACTER DETAIL',
  'RELEVANT WORLD FACTS',
  'DEVELOPMENT EXAMPLES',
  'RECENT CHAT',
  'EXACT USER INPUT',
];
let cursor = -1;
for (const [index, label] of requiredOrder.entries()) {
  const heading = index === 0 ? `${label}\n` : `\n\n${label}\n`;
  const next = opening.input.indexOf(heading);
  assert.ok(next > cursor, `clean prompt assembly order broken at ${label}`);
  cursor = next;
}
for (const legacyHeading of ['STORY INFORMATION', 'RELEVANT LORE MODULES', 'START SETTING', 'ACTIVE KEYWORD BOOKS']) {
  assert.doesNotMatch(opening.input, new RegExp(`(?:^|\\n\\n)${legacyHeading}\\n`), `legacy Writer-facing layer must be absent: ${legacyHeading}`);
}
assert.equal(opening.diagnostics.writer_runtime, 'cleanroom-01');
assert.ok(opening.diagnostics.academy_cast_count >= 16, 'Writer must receive the broad current academy living cast');
assert.equal(opening.diagnostics.development_example_count, 3);
assert.match(opening.input, /\[artemis\] 아르테미스/, 'broad cast material must include Artemis');
assert.match(opening.input, /백발을 뒤로 단단히 묶는 모습이 확인됨/, 'Artemis verified hair presentation must reach Writer');
assert.match(opening.input, /적안/, 'Artemis verified eye presentation must reach Writer');
assert.match(opening.input, /\[emily\] 에밀리/, 'broad cast material must include Emily');
assert.match(opening.input, /아카데미 교장/, 'Emily current office must reach Writer');
assert.doesNotMatch(opening.input, /기초 적성 측정/, 'Writer must not receive invented same-day aptitude procedure');
assert.match(opening.input, /\n\nEXACT USER INPUT\n주변을 살펴본다\.$/, 'exact user text must remain the final layer');

const artemis = assembleAuthoring({ action: '아르테미스에게 질문한다.', pc, scene: startScene, history: [], knowledgeLevel: 1, mode: 'action' });
assert.ok(artemis.diagnostics.detailed_character_count >= 1, 'explicitly referenced character must receive detailed packet');
assert.match(artemis.input, /교관식 반말\/하대/, 'detailed Artemis voice must reach Writer when directly relevant');
assert.match(artemis.input, /보이는 외형\/표현 사실/, 'detailed character material must carry presentation facts');

const history = [{
  action: '대강당 안을 본다.',
  scene: [{ kind: 'narration', text: '신입생들이 자리를 찾고 있다.', speaker_key: null, speaker_name: null }],
  continuity: { date: '1285-03-01', time: '08:45', location: '루멘시아 아카데미 대강당', situation: '입학식 전', present_character_keys: [] },
}];
const continued = assembleAuthoring({ action: '', pc, scene: { ...startScene, time: '08:45', location: '루멘시아 아카데미 대강당' }, history, knowledgeLevel: 1, mode: 'continue' });
assert.match(continued.input, /\n\nMODE: CONTINUE\n/, 'dedicated continue mode must remain explicit');
assert.doesNotMatch(continued.input, /\n\nEXACT USER INPUT\n/, 'continue mode must not fake a user action');

const housing = assembleAuthoring({ action: '생활동으로 가서 방 배정을 확인한다.', pc, scene: startScene, history, knowledgeLevel: 1, mode: 'action' });
assert.ok(housing.diagnostics.active_keyword_books.some((row) => row.name.includes('생활동')), 'housing facts must still be available on demand');

const magic = assembleAuthoring({ action: '마법의 마나 흐름을 관찰한다.', pc, scene: startScene, history, knowledgeLevel: 1, mode: 'action' });
assert.ok(magic.diagnostics.active_keyword_books.some((row) => row.name.includes('마나')), 'power facts must still be available on demand');
assert.ok(!magic.diagnostics.active_keyword_books.some((row) => row.name.includes('사회/법')), 'magic wording must not activate social/law facts by collision');

assert.match(index, /id="continueButton"[^>]*>이어하기</, '이어하기 button must remain in UI');
assert.match(client, /continueButton\.addEventListener\('click', continueScene\)/, '이어하기 click handler must remain wired');
assert.match(client, /function continueScene\(\)/, 'dedicated continue request function must remain');
assert.match(client, /copy-block-button/, 'per-scene copy button must remain');
assert.match(client, /async function writeClipboard\(/, 'copy clipboard implementation must remain');
assert.match(client, /async function handleCopyClick\(/, 'copy click handler must remain');

const failSoft = validateTurn({
  scene: [{ kind: 'dialogue', text: '화자 메타데이터가 빠진 한 줄', speaker_key: null, speaker_name: null, expression: null }],
  continuity: { date: '1285-03-01', time: '08:40', location: '대강당 앞', situation: '테스트', present_character_keys: [] },
}, pc, startScene);
assert.equal(failSoft.scene[0].kind, 'narration', 'missing dialogue speaker metadata must fail-soft to narration');

console.log('PASS WRITER-CLEANROOM-01 factual cast assembly + Copy/Continue preservation');
