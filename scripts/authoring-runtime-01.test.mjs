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
assert.match(api, /assembleAuthoring/, 'api/write must delegate Writer material assembly');
assert.doesNotMatch(api, /canon-context/, 'critical Writer path must not depend on turn-level Canon relevance routing');
assert.doesNotMatch(runtime, /buildCanonContext|relevantCharacterKeys|relevantScheduleFacts|activeKeywordBooks|literalMention|signalText/, 'simple runtime must not route narrative material by relevance/keyword logic');
assert.doesNotMatch(runtime, /Event Director|Event Engine|Scene Planner|Scene Selector|NPC selector score|hook score|attention meter/i, 'no narrative control engine may return');

assert.equal(AUTHORING_DATA.version, 5, 'simple Creator Pack must be version 5');
assert.ok(AUTHORING_DATA.prompt_template);
assert.ok(AUTHORING_DATA.story_settings);
assert.ok(AUTHORING_DATA.start_settings);
assert.equal(AUTHORING_DATA.development_examples.length, 2, 'source-backed experiment uses two Development Examples');
assert.ok(!Object.hasOwn(AUTHORING_DATA, 'keyword_books'), 'CRACK-RUNTIME-02 removes conditional keyword routing from Writer materials');
assert.doesNotMatch(AUTHORING_DATA.story_settings, /에밀리|아르테미스|세라|릴리아|라리스|이사벨|레나|세레나|클로에|미라벨/, 'individual cast facts belong in the sourcebook, not Story Settings');
assert.doesNotMatch(`${AUTHORING_DATA.prompt_template}\n${AUTHORING_DATA.story_settings}`, /자동 코스|열쇠 배부|이의 신청|가장 살아 있는|메인 캐스트 우선|broad intent/i, 'previous correction-policy language must not survive the simplified prompt');

const pc = {
  name: '테스트PC', age: 20, gender: '남성', department: '기사과', origin: '수도 외곽', socialStatus: '평민',
  admission: '일반전형', appearance: '', background: '', characterProfile: '', realm: '익스퍼트 입문', magicCircle: null,
  talents: { martial: 5, knowledge: 3 }, traits: [], authorities: [], skills: ['기초 검술'], equipment: ['연습용 검'], startingGold: 10,
};
const startScene = {
  date: '1285-03-01', time: '08:40', location: '루멘시아 아카데미 대강당 앞',
  situation: '입학식 시작 전. 신입생·귀족 자제·평민 학생·교수·상급생이 대강당 일대에 모이고 있으며 개막 종은 아직 울리지 않았다.',
  presentCharacterKeys: [],
};

const opening = assembleAuthoring({ action: '주변을 살펴본다.', pc, scene: startScene, history: [], mode: 'action' });
const requiredOrder = [
  'STORY SETTINGS',
  'KNOWLEDGE BASE',
  'START SETTINGS',
  'DEVELOPMENT EXAMPLES',
  'RUNTIME STATE',
  'RECENT CHAT',
  'EXACT USER INPUT',
];
let cursor = -1;
for (const [index, label] of requiredOrder.entries()) {
  const heading = index === 0 ? `${label}\n` : `\n\n${label}\n`;
  const next = opening.input.indexOf(heading);
  assert.ok(next > cursor, `simple Creator Pack assembly order broken at ${label}`);
  cursor = next;
}
for (const removedHeading of ['ADD-ONS', 'KEYWORD BOOKS', 'RELEVANT LORE MODULES', 'CURRENT / PRESENT CHARACTER DETAIL', 'RELEVANT WORLD FACTS', 'ACTIVE KEYWORD BOOKS']) {
  assert.doesNotMatch(opening.input, new RegExp(`(?:^|\\n\\n)${removedHeading}\\n`), `routed/mixed Writer layer must be absent: ${removedHeading}`);
}

assert.equal(opening.diagnostics.writer_runtime, 'crack-runtime-02-simple');
assert.equal(opening.diagnostics.start_settings_active, true, 'Start Settings activate only at untouched opening');
assert.equal(opening.diagnostics.development_example_count, 2);
assert.equal(opening.diagnostics.knowledge_base_character_count, 32, 'full durable character sourcebook must be available every turn');
assert.equal(opening.diagnostics.active_keyword_books.length, 0, 'no conditional keyword material should enter this experiment');
assert.ok(opening.diagnostics.active_addons.every((row) => row.activation === 'always-sourcebook'), 'character sourcebook must not use activation selection');

assert.match(opening.input, /\[CHARACTER: artemis\] 아르테미스/, 'Artemis must exist in the always-on sourcebook');
assert.match(opening.input, /백발을 뒤로 단단히 묶는 모습이 확인됨/, 'Artemis verified hair must reach Writer');
assert.match(opening.input, /적안/, 'Artemis verified eyes must reach Writer');
assert.match(opening.input, /\[CHARACTER: emily\] 에밀리/, 'Emily must exist in the always-on sourcebook');
assert.match(opening.input, /아카데미 교장/, 'Emily current office must reach Writer');
assert.match(opening.input, /\[CHARACTER: etera\] 에테라/, 'external durable characters must also exist in the full sourcebook without name activation');
const eteraStart = opening.input.indexOf('[CHARACTER: etera]');
const eteraNext = opening.input.indexOf('\n\n[CHARACTER:', eteraStart + 1);
const eteraEntry = opening.input.slice(eteraStart, eteraNext === -1 ? opening.input.length : eteraNext);
assert.doesNotMatch(eteraEntry, /9서클/, 'restricted Etera exact power must not leak through the ordinary Etera sourcebook entry');
assert.match(opening.input, /09:00.*입학식이 시작될 예정/s, 'dated scenario schedule remains a factual sourcebook item');
assert.match(opening.input, /재능:.*martial: 5.*knowledge: 3/, 'PC talents must reach Runtime State as factual player material');
assert.doesNotMatch(opening.input, /PLAY GUIDE:/, 'play guide is user-facing and must not be injected into Writer input');
assert.match(opening.input, /\n\nEXACT USER INPUT\n주변을 살펴본다\.$/, 'exact user text must remain final');

const history = [{
  action: '대강당 안을 본다.',
  scene: [{ kind: 'narration', text: '신입생들이 자리를 찾고 있다.', speaker_key: null, speaker_name: null }],
  continuity: { date: '1285-03-01', time: '08:45', location: '루멘시아 아카데미 대강당', situation: '입학식 전', present_character_keys: [] },
}];
const followup = assembleAuthoring({
  action: '잠시 주변을 지켜본다.',
  pc,
  scene: { ...startScene, time: '08:45', location: '루멘시아 아카데미 대강당' },
  history,
  mode: 'action',
});
assert.equal(followup.diagnostics.start_settings_active, false, 'Start Settings must disappear after play begins');
assert.doesNotMatch(followup.input, /\n\nSTART SETTINGS\n/);
assert.equal(followup.diagnostics.knowledge_base_character_count, 32, 'full sourcebook remains available after opening');

const continued = assembleAuthoring({
  action: '',
  pc,
  scene: { ...startScene, time: '08:45', location: '루멘시아 아카데미 대강당' },
  history,
  mode: 'continue',
});
assert.match(continued.input, /\n\nMODE: CONTINUE\n/, 'dedicated continue mode must remain');
assert.doesNotMatch(continued.input, /\n\nEXACT USER INPUT\n/, 'continue mode must not fake a user action');
assert.match(continued.input, /사용자의 새 행동·대사·감정·중요한 선택을 대신 정하지 않는다/, 'Continue must preserve player authorship without a scene-control engine');

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

console.log('PASS CRACK-RUNTIME-02 simple full-sourcebook + two-example + Copy/Continue preservation');
