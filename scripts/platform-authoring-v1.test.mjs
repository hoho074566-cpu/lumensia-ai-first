import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import authoringData from '../data/authoring/lumensia-academy.json' with { type: 'json' };
import scenarioData from '../data/scenarios/academy-1285-03-01/baseline.json' with { type: 'json' };
import {
  AUTHORING_TEMPLATE,
  MAX_ACTIVE_KEYWORD_BOOKS,
  buildAuthoringContext,
  isOpeningState,
  selectKeywordBooks,
} from '../api/lib/platform-authoring.js';

const api = readFileSync('api/write.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const html = readFileSync('index.html', 'utf8');
const styles = readFileSync('src/styles.css', 'utf8');

assert.equal(authoringData.template.id, 'simulation', 'authoring pack must use the simulation template');
assert.ok(authoringData.story_info.length > 1000, 'story info must be a meaningful always-on world/cast layer');
assert.equal(authoringData.development_examples.length, 3, 'platform-style progression examples are capped at three');
assert.ok(authoringData.keyword_books.length >= 12, 'authoring pack must expose modular keyword books');
assert.match(AUTHORING_TEMPLATE, /Never predict or invent the user's unchosen actions/i, 'template must preserve user agency');
assert.match(AUTHORING_TEMPLATE, /world and NPCs continue for their own reasons/i, 'template must keep the world alive without a Director engine');

const openingScene = {
  date: scenarioData.start.date,
  time: scenarioData.start.time,
  location: scenarioData.start.location,
  situation: scenarioData.start.situation,
};
assert.equal(isOpeningState({ scene: openingScene, history: [] }), true, 'start setting must activate only at the untouched opening');
assert.equal(isOpeningState({ scene: openingScene, history: [{ action: 'x', scene: [] }] }), false, 'start setting must disappear after chat begins');
assert.equal(isOpeningState({ scene: openingScene, history: [], adminScenePreview: true }), false, 'Admin Preview must not inherit the canonical opening seed');

const housingBooks = selectKeywordBooks({ action: '생활동 방 배정을 확인한다.', scene: openingScene, history: [] });
assert.ok(housingBooks.some((book) => book.id === 'housing'), 'housing keyword book must activate for residence questions');
assert.match(housingBooks.find((book) => book.id === 'housing').content, /PC의 개인 생활동과 방 번호는 시작 시점에 정해져 있지 않/, 'housing book must fail closed on the PC assignment');

const magicBooks = selectKeywordBooks({ action: '마법 훈련을 구경한다.', scene: openingScene, history: [] });
assert.ok(!magicBooks.some((book) => book.id === 'law_and_security'), 'ordinary magic text must not collide with law/security retrieval');

const crowdedBooks = selectKeywordBooks({ action: '릴리아와 세라가 생활동에서 황위 이야기를 한다.', scene: openingScene, history: [] });
assert.ok(crowdedBooks.length <= MAX_ACTIVE_KEYWORD_BOOKS, 'no turn may inject more than the platform-style book cap');
assert.equal(MAX_ACTIVE_KEYWORD_BOOKS, 3, 'keyword-book activation cap must remain three');

const context = buildAuthoringContext({
  action: '기사과 훈련장에 가본다.',
  pc: { name: '테스트', department: '기사과' },
  scene: openingScene,
  history: [],
  recentChat: [],
});
assert.equal(context.start_setting?.name, '입학 첫날', 'opening context must include the authored start setting');
assert.equal(context.development_examples.length, 3, 'Writer context must receive exactly the three authored progression examples');
assert.ok(Array.isArray(context.activated_keyword_books), 'Writer context must receive turn-local activated keyword books');

assert.match(api, /platform-authoring\.js/, 'Writer must use the platform authoring boundary');
assert.doesNotMatch(api, /buildCanonContext/, 'Writer runtime must no longer compose a Canon-retrieval packet directly');
assert.match(api, /STORY INFORMATION/, 'Writer input must expose the authored story-information layer');
assert.match(api, /START SETTING/, 'Writer input must support the authored start-setting layer');
assert.match(api, /DEVELOPMENT EXAMPLES/, 'Writer input must expose progression examples as a separate layer');
assert.match(api, /ACTIVATED KEYWORD BOOKS/, 'Writer input must expose turn-local keyword books');
assert.match(api, /CURRENT STATUS/, 'Writer input must expose mutable runtime status separately');
assert.match(api, /EXACT USER ACTION\\n\$\{action\}/, 'exact user action must remain verbatim at the end of the input');
assert.doesNotMatch(api, /SCENE_CALIBRATION_EXAMPLES|ambient_cast_index|opening_premise/, 'failed V2 Writer-material architecture must not remain active');

const writerCalls = api.match(/fetch\('https:\/\/api\.openai\.com\/v1\/responses'/g) || [];
assert.equal(writerCalls.length, 1, 'platform runtime must keep exactly one Writer model call');
assert.doesNotMatch(api, /Event Director|Event Engine|NPC selector score|hook score|attention meter|sceneDirector|npcScheduler/i, 'deterministic narrative machinery must not return');

assert.match(html, /id="continueButton"[^>]*>이어하기</, 'dedicated Continue button must remain');
assert.match(client, /continueScene:\s*isContinue/, 'Continue must use a dedicated request mode');
assert.match(api, /CONTINUE CURRENT SCENE/, 'server must distinguish Continue from a player action');
assert.match(client, /action:\s*isContinue \? '' : submittedAction/, 'Continue must not be stored as fake player action text');

assert.match(html, /id="adminDialog"/, 'Admin Scene Preview dialog must remain');
assert.match(client, /adminScenePreview:\s*isAdmin/, 'Admin Preview must use a dedicated request flag');
assert.match(client, /if \(isAdmin \|\| payload\.admin_preview === true\)[\s\S]*?renderAdminPreview\(\);[\s\S]*?return;/, 'Admin Preview must return before run-state mutation');
assert.match(client, /scenePlainText/, 'scene copy serialization must remain');
assert.match(styles, /\.copy-block-button/, 'copy controls must remain styled');

console.log('PASS platform-style authoring runtime invariants');
