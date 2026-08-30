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
assert.match(runtime, /외형·가시 정보/, 'verified presentation facts must be passed into selected character lore');
assert.doesNotMatch(runtime, /Event Director|Event Engine|Scene Planner|Scene Selector|NPC selector score|hook score|attention meter/i, 'Authoring Runtime must not implement narrative control engines');

assert.equal(AUTHORING_DATA.development_examples.length, 3, 'creator-style development examples must be capped at three');
assert.doesNotMatch(AUTHORING_DATA.base_rp_template, /루멘시아|세라|릴리아|에밀리|아르테미스/, 'Base RP Template must remain story-agnostic');
assert.match(AUTHORING_DATA.main_author_prompt, /루멘시아 아카데미/, 'Main Author Prompt must carry story identity');
assert.match(AUTHORING_DATA.base_rp_template, /PC는 장면의 기본 카메라 앵커다/, 'PC camera anchor must remain explicit');
assert.match(AUTHORING_DATA.base_rp_template, /작은 일은 작은 일로 끝나도 된다/, 'ordinary scenes must not auto-escalate into events');
assert.match(AUTHORING_DATA.main_author_prompt, /ROUTINE COMPRESSES\. IMPORTANT MOMENTS EXPAND\./, 'reference-derived unequal scene density must remain explicit');
assert.match(AUTHORING_DATA.main_author_prompt, /장비 점검 하나가 의미 없이 오래 이어지거나/, 'routine inspection must not consume an entire response without meaning');
assert.match(AUTHORING_DATA.main_author_prompt, /개인 생활동·방번호/, 'unknown durable housing specifics must remain guarded');
assert.match(AUTHORING_DATA.main_author_prompt, /이 목록은 등장 순번표가 아니다/, 'named cast breadth must not become forced rotation');
assert.match(AUTHORING_DATA.main_author_prompt, /최근 장면에 나온 사람이라는 이유만으로 같은 NPC를 계속 재사용하지 않는다/, 'recent speaker inertia must not monopolize foreground casting');
assert.match(AUTHORING_DATA.main_author_prompt, /라리스는 발렌하르트 방계/, 'Laris must be part of the available early academy cast signal');
assert.match(AUTHORING_DATA.main_author_prompt, /미라벨은 신학부 교환장학생/, 'Mirabelle must be part of the available early academy cast signal');
assert.match(AUTHORING_DATA.main_author_prompt, /클로에는 마법과 신입생/, 'Chloe must be part of the available early academy cast signal');
assert.match(AUTHORING_DATA.main_author_prompt, /사건감은 대형 사고를 계속 만드는 데서 나오지 않는다/, 'event density must come from causal human change rather than incident spam');
assert.match(AUTHORING_DATA.main_author_prompt, /여러 장면을 계속 안전한 잡담만으로 평평하게 만들지 않는다/, 'natural conflict/opportunity must not be deliberately flattened');
assert.match(AUTHORING_DATA.main_author_prompt, /최근 대화에 많이 등장했다는 사실은 다음 장면의 캐스팅 이유가 아니다/, 'single-NPC route lock must remain explicitly rejected');
assert.match(AUTHORING_DATA.main_author_prompt, /릴리아는 붉은 머리와 금안/, 'verified Lillia presentation must remain explicit');
assert.match(AUTHORING_DATA.main_author_prompt, /장문의 연설로 대신 설명하지 않는다/, 'authority NPCs must not become thematic exposition monologues');
assert.match(AUTHORING_DATA.main_author_prompt, /장면의 기본 카메라 앵커/, 'PC camera anchor must remain in story-specific authoring material');

assert.ok(AUTHORING_DATA.development_examples.some((example) => /주변을 천천히 살펴본다/.test(example.user) && /붉은 머리와 금안의 릴리아/.test(example.writer) && /귀족 신입생/.test(example.writer)), 'opening example must preserve the accepted direct-friction/Lillia intervention pattern');
assert.ok(AUTHORING_DATA.development_examples.some((example) => /기사과 훈련에 참가한다/.test(example.user) && /라리스/.test(example.writer) && /이사벨/.test(example.writer) && /둘이 하면 나도 다음/.test(example.writer)), 'training example must widen foreground cast and turn routine into rivalry');
assert.ok(AUTHORING_DATA.development_examples.some((example) => /학생회관 쪽을 둘러본다/.test(example.user) && /클로에/.test(example.writer) && /미라벨/.test(example.writer) && /이유도 방향도 달랐다/.test(example.writer)), 'student-area example must demonstrate a different named-cast opportunity/conflict mix');

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

console.log('PASS AUTHORING-RUNTIME-01 frozen architecture + V2R2 cast/event-density invariants');
