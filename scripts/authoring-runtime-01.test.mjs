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
assert.match(spec, /미디어 \| Media Layer/, 'spec must map Media');
assert.match(spec, /단축어 \| Shortcut Layer/, 'spec must map Shortcuts');
assert.match(spec, /엔딩 설정 \| Ending Layer/, 'spec must map Endings');

assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'critical write path must contain exactly one Writer call');
assert.match(api, /assembleAuthoring/, 'api/write must delegate prompt construction to the Authoring Runtime');
assert.match(runtime, /buildCanonContext/, 'Authoring Runtime must use factual Canon retrieval as source material');
assert.match(runtime, /academyCastPalette/, 'existing factual academy cast index must be exposed as compact Writer material');
assert.match(runtime, /외형·가시 정보/, 'verified presentation facts must be passed into selected character lore');
assert.doesNotMatch(runtime, /Event Director|Event Engine|Scene Planner|Scene Selector|NPC selector score|hook score|attention meter/i, 'Authoring Runtime must not implement narrative control engines');

assert.equal(AUTHORING_DATA.development_examples.length, 3, 'creator-style development examples must be capped at three');
assert.doesNotMatch(AUTHORING_DATA.base_rp_template, /루멘시아|세라|릴리아|에밀리|아르테미스/, 'Base RP Template must remain story-agnostic');
assert.match(AUTHORING_DATA.main_author_prompt, /루멘시아 아카데미/, 'Main Author Prompt must carry story identity');
assert.match(AUTHORING_DATA.base_rp_template, /PC는 장면의 기본 카메라 앵커다/, 'PC camera anchor must remain explicit');
assert.match(AUTHORING_DATA.base_rp_template, /작은 일은 작은 일로 끝나도 된다/, 'ordinary scenes must not auto-escalate into random danger');
assert.match(AUTHORING_DATA.main_author_prompt, /ROUTINE COMPRESSES\. IMPORTANT MOMENTS EXPAND\./, 'unequal narrative density must remain explicit');
assert.match(AUTHORING_DATA.main_author_prompt, /몽타주처럼 압축/, 'routine procedure must compress aggressively');
assert.match(AUTHORING_DATA.main_author_prompt, /앙상블 장면/, 'crowded scenes must preserve ensemble presence');
assert.match(AUTHORING_DATA.main_author_prompt, /payoff-bearing 사건/, 'causal event payoff must be allowed to move scenes');
assert.match(AUTHORING_DATA.main_author_prompt, /여러 장면 연속 아무 관계 변화나 갈등·기회 없이/, 'the story must not stay flat for multiple scenes');
assert.match(AUTHORING_DATA.main_author_prompt, /자동 주연/, 'recent-NPC inertia must not determine foreground casting');
assert.match(AUTHORING_DATA.main_author_prompt, /개인 생활동·방번호/, 'unknown durable housing specifics must remain guarded');
assert.match(AUTHORING_DATA.start_setting.situation_note, /특정 시비, 특정 NPC 조우, 특정 자리 배치나 사건을 예약하지 않는다/, 'opening must not encode a fixed Lillia/friction event');
assert.ok(!AUTHORING_DATA.development_examples.some((example) => example.user === '주변을 천천히 살펴본다.'), 'development examples must not hard-bind the opening prompt to one repeated incident');
assert.ok(AUTHORING_DATA.development_examples.some((example) => /기사과 오리엔테이션과 첫 훈련/.test(example.user) && /릴리아/.test(example.writer) && /세라/.test(example.writer) && /라리스/.test(example.writer) && /이사벨/.test(example.writer)), 'knight training example must teach ensemble reaction instead of one companion route');
assert.ok(AUTHORING_DATA.development_examples.some((example) => /학생회관/.test(example.user) && /클로에/.test(example.writer) && /미라벨/.test(example.writer) && /루시아/.test(example.writer)), 'student-area example must teach cross-cast opportunities');
assert.ok(AUTHORING_DATA.development_examples.some((example) => /대련을 계속한다/.test(example.user) && /릴리아/.test(example.writer) && /라리스/.test(example.writer) && /세라/.test(example.writer) && /이사벨/.test(example.writer)), 'combat example must show one result creating multiple distinct reactions');

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
assert.equal(opening.diagnostics.start_setting_active, true, 'Start Setting must activate only at untouched exact start');
assert.equal(opening.diagnostics.development_example_count, 3);
assert.ok(opening.diagnostics.academy_cast_palette_count >= 12, 'opening must receive a broad factual academy cast palette');
assert.match(opening.input, /\[CAST PALETTE\]/, 'Writer packet must expose academy cast palette inside Relevant Lore');
for (const name of ['이사벨', '라리스', '릴리아', '세라', '레나', '시아', '세레나', '클로에', '아나스타샤', '루시아']) {
  assert.match(opening.input, new RegExp(name), `cast palette must include ${name}`);
}
assert.match(opening.input, /\n\nEXACT USER INPUT\n주변을 살펴본다\.$/, 'exact user text must survive assembly without rewrite at the final layer');

const lilliaPacket = assembleAuthoring({ action: '릴리아와 검에 대해 이야기한다.', pc, scene: startScene, history: [], knowledgeLevel: 1, mode: 'action' });
assert.match(lilliaPacket.input, /외형·가시 정보는[^\n]*붉은 머리/, 'selected Lillia lore must carry verified red-hair presentation fact');
assert.match(lilliaPacket.input, /금안/, 'selected Lillia lore must carry verified golden-eye presentation fact');

const history = [{
  action: '대강당 안을 본다.',
  scene: [{ kind: 'narration', text: '신입생들이 자리를 찾고 있다.', speaker_key: null, speaker_name: null }],
  continuity: { date: '1285-03-01', time: '08:45', location: '루멘시아 아카데미 대강당', situation: '입학식 전', present_character_keys: [] },
}];
const followup = assembleAuthoring({ action: '잠시 기다린다.', pc, scene: { ...startScene, time: '08:45', location: '루멘시아 아카데미 대강당' }, history, knowledgeLevel: 1, mode: 'action' });
assert.equal(followup.diagnostics.start_setting_active, false, 'Start Setting must disappear after play begins');
assert.doesNotMatch(followup.input, /\n\nSTART SETTING\n/, 'follow-up prompt must not retain opening-only layer');
assert.ok(followup.diagnostics.academy_cast_palette_count >= 12, 'cast palette must remain available after opening without becoming a start-only trick');

const housing = assembleAuthoring({ action: '생활동으로 가서 방 배정을 확인한다.', pc, scene: startScene, history, knowledgeLevel: 1, mode: 'action' });
assert.ok(housing.diagnostics.active_keyword_books.length <= 3, 'turn-local keyword books must stay capped at three');
assert.ok(housing.diagnostics.active_keyword_books.some((row) => row.name.includes('생활동')), 'housing input must activate housing factual guard');

const magic = assembleAuthoring({ action: '마법의 마나 흐름을 관찰한다.', pc, scene: startScene, history, knowledgeLevel: 1, mode: 'action' });
assert.ok(magic.diagnostics.active_keyword_books.some((row) => row.name.includes('마나')), 'power-system input must activate power lore');
assert.ok(!magic.diagnostics.active_keyword_books.some((row) => row.name.includes('사회 / 법')), 'magic wording must not activate law/social book by substring collision');

const failSoft = validateTurn({
  scene: [{ kind: 'dialogue', text: '화자 메타데이터가 빠진 한 줄', speaker_key: null, speaker_name: null, expression: null }],
  continuity: { date: '1285-03-01', time: '08:40', location: '대강당 앞', situation: '테스트', present_character_keys: [] },
}, pc, startScene);
assert.equal(failSoft.scene[0].kind, 'narration', 'missing dialogue speaker metadata must fail-soft to narration instead of failing the turn');

console.log('PASS AUTHORING-RUNTIME-01 frozen architecture + V2R2 ensemble/tempo/payoff invariants');
