import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { assembleAuthoring, AUTHORING_DATA } from '../api/lib/authoring-runtime.js';
import { validateTurn } from '../api/write.js';

const spec = readFileSync('docs/AUTHORING_RUNTIME_SPEC.md', 'utf8');
const api = readFileSync('api/write.js', 'utf8');
const runtime = readFileSync('api/lib/authoring-runtime.js', 'utf8');

execFileSync(process.execPath, ['--check', 'api/write.js'], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', 'api/lib/authoring-runtime.js'], { stdio: 'pipe' });

assert.match(spec, /AI의 서사 판단을 코드로 대신하지 않는다/, 'frozen spec must state the prime directive');
assert.match(spec, /프롬프트 템플릿 \| Base RP Template/, 'spec must preserve creator-surface mapping');
assert.match(spec, /스토리 설정 \| Main Author Prompt/, 'spec must map Story Settings');
assert.match(spec, /애드온 \| Lore Modules/, 'spec must map Add-ons');
assert.match(spec, /시작 설정 \| Start Setting/, 'spec must map Start Setting');
assert.match(spec, /스탯 설정 \| Runtime State Prompt/, 'spec must map Stats');
assert.match(spec, /키워드북 \| Conditional Lore Books/, 'spec must map Keyword Books');

assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'critical write path must contain exactly one Writer call');
assert.match(api, /assembleAuthoring/, 'api/write must delegate prompt construction to the Authoring Runtime');
assert.match(runtime, /buildCanonContext/, 'Authoring Runtime must use factual Canon retrieval');
assert.match(runtime, /academyCastPalette/, 'existing factual academy cast index must be exposed as material');
assert.match(runtime, /CAST PALETTE/, 'Writer packet must label the factual cast palette');
assert.match(runtime, /외형·가시 정보/, 'selected character Lore must forward verified presentation facts');
assert.doesNotMatch(runtime, /Event Director|Event Engine|Scene Planner|Scene Selector|NPC selector score|hook score|attention meter/i, 'no narrative control engine may be introduced');

assert.equal(AUTHORING_DATA.development_examples.length, 3, 'creator-style development examples remain capped at three');
assert.doesNotMatch(AUTHORING_DATA.base_rp_template, /루멘시아|세라|릴리아|에밀리|아르테미스/, 'Base RP Template must remain story-agnostic');
assert.match(AUTHORING_DATA.main_author_prompt, /루멘시아 아카데미/, 'Main Author Prompt carries story identity');
assert.match(AUTHORING_DATA.main_author_prompt, /ROUTINE COMPRESSES\. IMPORTANT MOMENTS EXPAND\./, 'unequal narrative density must remain explicit');
assert.match(AUTHORING_DATA.main_author_prompt, /멋있는 격언처럼 대신 말하지 않게 한다/, 'NPC dialogue must not become authorial thesis delivery');
assert.match(AUTHORING_DATA.main_author_prompt, /출석부가 아니라 생활 공간이다/, 'crowded scenes must be treated as lived spaces rather than cast roll calls');
assert.match(AUTHORING_DATA.main_author_prompt, /모두가 사용자를 평가하게 만들지 않는다/, 'important PC actions must not create commentator-circle scenes');
assert.match(AUTHORING_DATA.main_author_prompt, /일부러 안전한 잡담으로 눌러 버리지 않는다/, 'natural scene-turning events must not be flattened');
assert.match(AUTHORING_DATA.base_rp_template, /메타 호칭을 쓰지 말고/, 'user-facing prose must use the actual player character name rather than PC/Aaa labels');
assert.match(AUTHORING_DATA.base_rp_template, /별도의 dialogue beat/, 'spoken dialogue must remain a separate structured beat');
assert.match(AUTHORING_DATA.base_rp_template, /narration 안에 따옴표로 실제 NPC 대사를 숨겨 넣지 않는다/, 'dialogue must not be hidden in narration');
assert.match(AUTHORING_DATA.start_setting.situation_note, /특정 시비, 특정 NPC 조우, 특정 좌석 배치나 특정 사건은 예약되어 있지 않다/, 'opening must not reserve a fixed incident or character');
assert.ok(!AUTHORING_DATA.development_examples.some((example) => example.user.trim() === '주변을 천천히 살펴본다.'), 'exact benchmark opening must not be used as a development-example template');
assert.ok(AUTHORING_DATA.development_examples.some((example) => /오리엔테이션과 기본 훈련/.test(example.user) && /반복 훈련 전체보다/.test(example.writer)), 'routine training example must compress to the meaningful change');
assert.ok(AUTHORING_DATA.development_examples.some((example) => /학생회관과 주변/.test(example.user) && /서로 다른 이유/.test(example.writer)), 'social-area example must allow competing causal opportunities');

const pc = {
  name: '테스트PC', age: 20, gender: '남성', department: '기사과', origin: '수도 외곽', socialStatus: '평민',
  admission: '일반전형', appearance: '', background: '', characterProfile: '', realm: '비기너', magicCircle: null,
  talents: { martial: 5 }, traits: [], authorities: [], skills: ['기초 검술'], equipment: ['연습용 검'], startingGold: 10,
};
const startScene = {
  date: '1285-03-01', time: '08:40', location: '루멘시아 아카데미 대강당 앞',
  situation: '입학식 시작 전. 신입생·귀족 자제·평민 학생·교수·상급생이 대강당 일대에 모이고 있으며 개막 종은 아직 울리지 않았다.',
  presentCharacterKeys: [],
};

const opening = assembleAuthoring({ action: '주변을 살펴본다.', pc, scene: startScene, history: [], knowledgeLevel: 1, mode: 'action' });
const requiredOrder = [
  'STORY INFORMATION',
  'RELEVANT LORE MODULES',
  'START SETTING',
  'DEVELOPMENT EXAMPLES',
  'CURRENT RUNTIME STATE',
  'ACTIVE KEYWORD BOOKS',
  'RECENT CHAT',
  'EXACT USER INPUT',
];
let cursor = -1;
for (const [index, label] of requiredOrder.entries()) {
  const heading = index === 0 ? `${label}\n` : `\n\n${label}\n`;
  const next = opening.input.indexOf(heading);
  assert.ok(next > cursor, `prompt assembly order broken at ${label}`);
  cursor = next;
}
assert.equal(opening.diagnostics.start_setting_active, true);
assert.equal(opening.diagnostics.development_example_count, 3);
assert.ok(opening.diagnostics.academy_cast_palette_count >= 10, 'broad academy-life cast palette must be available without deterministic selection');
assert.match(opening.input, /CAST PALETTE/, 'opening packet must contain factual academy cast material');
assert.match(opening.input, /이사벨/, 'knight cast beyond Sera\/Lillia must be available');
assert.match(opening.input, /레나/, 'magic cast must be available in the same academy-life palette');
assert.match(opening.input, /아나스타샤/, 'student-council cast must be available in the same academy-life palette');
assert.match(opening.input, /플레이어 캐릭터 이름: 테스트PC/, 'actual player-character name must be explicit in runtime state');
assert.match(opening.input, /\n\nEXACT USER INPUT\n주변을 살펴본다\.$/, 'exact user input must remain final and unrewritten');

const lilliaPacket = assembleAuthoring({ action: '릴리아와 검에 대해 이야기한다.', pc, scene: startScene, history: [], knowledgeLevel: 1, mode: 'action' });
assert.match(lilliaPacket.input, /외형·가시 정보는[^\n]*붉은 머리/, 'selected Lillia Lore must carry verified red hair');
assert.match(lilliaPacket.input, /금안/, 'selected Lillia Lore must carry verified golden eyes');

const history = [{
  action: '대강당 안을 본다.',
  scene: [{ kind: 'narration', text: '신입생들이 자리를 찾고 있다.', speaker_key: null, speaker_name: null }],
  continuity: { date: '1285-03-01', time: '08:45', location: '루멘시아 아카데미 대강당', situation: '입학식 전', present_character_keys: [] },
}];
const followup = assembleAuthoring({ action: '잠시 기다린다.', pc, scene: { ...startScene, time: '08:45', location: '루멘시아 아카데미 대강당' }, history, knowledgeLevel: 1, mode: 'action' });
assert.equal(followup.diagnostics.start_setting_active, false, 'Start Setting disappears after play begins');
assert.doesNotMatch(followup.input, /\n\nSTART SETTING\n/);

const housing = assembleAuthoring({ action: '생활동으로 가서 방 배정을 확인한다.', pc, scene: startScene, history, knowledgeLevel: 1, mode: 'action' });
assert.ok(housing.diagnostics.active_keyword_books.length <= 3);
assert.ok(housing.diagnostics.active_keyword_books.some((row) => row.name.includes('생활동')));

const magic = assembleAuthoring({ action: '마법의 마나 흐름을 관찰한다.', pc, scene: startScene, history, knowledgeLevel: 1, mode: 'action' });
assert.ok(magic.diagnostics.active_keyword_books.some((row) => row.name.includes('마나')));
assert.ok(!magic.diagnostics.active_keyword_books.some((row) => row.name.includes('사회 / 법')));

const failSoft = validateTurn({
  scene: [{ kind: 'dialogue', text: '화자 메타데이터가 빠진 한 줄', speaker_key: null, speaker_name: null, expression: null }],
  continuity: { date: '1285-03-01', time: '08:40', location: '대강당 앞', situation: '테스트', present_character_keys: [] },
}, pc, startScene);
assert.equal(failSoft.scene[0].kind, 'narration');

console.log('PASS AUTHORING-RUNTIME-01 frozen architecture + clean original-feel authoring guards');
