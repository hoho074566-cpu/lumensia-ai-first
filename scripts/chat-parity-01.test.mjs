import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assembleAuthoring } from '../api/lib/authoring-runtime.js';
import { buildWriterRequestBody, proseToTurn } from '../api/write.js';

const api = readFileSync('api/write.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');

const pc = {
  name: '테스트PC',
  age: 20,
  gender: '남성',
  department: '기사과',
  origin: '수도 외곽',
  socialStatus: '평민',
  admission: '일반전형',
  appearance: '',
  background: '',
  characterProfile: '',
  realm: '익스퍼트 입문',
  magicCircle: null,
  talents: { martial: 5, knowledge: 3 },
  traits: [],
  authorities: [],
  skills: ['기초 검술'],
  equipment: ['연습용 검'],
  startingGold: 10,
};

const startScene = {
  date: '1285-03-01',
  time: '08:40',
  location: '루멘시아 아카데미 대강당 앞',
  situation: '입학식 시작 전. 신입생·귀족 자제·평민 학생·교수·상급생이 대강당 일대에 모이고 있으며 개막 종은 아직 울리지 않았다.',
  presentCharacterKeys: [],
};

const args = {
  action: '주변을 살펴본다.',
  pc,
  scene: startScene,
  history: [],
  mode: 'action',
};

const full = assembleAuthoring({ ...args, contextMode: 'full' });
const compact = assembleAuthoring({ ...args, contextMode: 'compact' });

assert.equal(full.instructions, compact.instructions, 'context A/B must keep the exact same Writer instructions');
assert.equal(full.diagnostics.development_example_count, 2, 'full mode keeps the same two examples');
assert.equal(compact.diagnostics.development_example_count, 2, 'compact mode keeps the same two examples');
assert.equal(full.diagnostics.context_mode, 'full');
assert.equal(compact.diagnostics.context_mode, 'compact');
assert.equal(full.diagnostics.knowledge_base_character_count, 32, 'full mode keeps the whole durable character sourcebook');
assert.ok(compact.diagnostics.knowledge_base_character_count >= 16 && compact.diagnostics.knowledge_base_character_count < 32, 'compact mode keeps the academy living cast without the whole external sourcebook');
assert.ok(compact.diagnostics.knowledge_base_chars < full.diagnostics.knowledge_base_chars, 'compact mode must actually reduce context volume');
assert.ok(compact.diagnostics.input_chars < full.diagnostics.input_chars, 'compact mode must reduce total Writer input');
assert.match(full.input, /\[WORLD: COSMOLOGY\]/, 'full control includes cosmology');
assert.doesNotMatch(compact.input, /\[WORLD: COSMOLOGY\]/, 'compact mode removes unrelated cosmology from the academy benchmark');
assert.match(compact.input, /\[CHARACTER: lillia\] 릴리아/, 'compact mode still exposes named academy cast');
assert.doesNotMatch(compact.input, /\[CHARACTER: etera\] 에테라/, 'compact academy mode does not include external characters by default');
assert.match(full.input, /\n\nEXACT USER INPUT\n주변을 살펴본다\.$/);
assert.match(compact.input, /\n\nEXACT USER INPUT\n주변을 살펴본다\.$/);

const structured = buildWriterRequestBody({ authoring: full, outputMode: 'structured' });
const raw = buildWriterRequestBody({ authoring: full, outputMode: 'raw' });

assert.equal(structured.input, raw.input, 'output-contract A/B must send identical authoring input');
assert.equal(structured.model, raw.model, 'output-contract A/B must use the same model');
assert.deepEqual(structured.reasoning, raw.reasoning, 'output-contract A/B must use the same reasoning setting');
assert.equal(structured.text?.format?.type, 'json_schema', 'structured control keeps strict JSON schema');
assert.equal(structured.text?.format?.strict, true, 'structured control remains strict');
assert.ok(!Object.hasOwn(raw, 'text'), 'raw parity mode must not send a structured text schema');
assert.doesNotMatch(raw.instructions, /speaker_key|dialogue beat|continuity/, 'raw parity mode removes structured scene bookkeeping from Writer instructions');
assert.match(raw.instructions, /장면 본문만 일반 텍스트/, 'raw parity mode asks only for prose output');

const sampleProse = '문이 열리며 학생들의 웅성거림이 안쪽으로 밀려들었다.\n\n릴리아: “생각보다 크네.”\n\n그녀는 대강당 문 쪽을 다시 올려다봤다.';
const rawTurn = proseToTurn(sampleProse, startScene);
assert.equal(rawTurn.scene.length, 3, 'raw prose is only paragraph-wrapped for the existing UI');
assert.ok(rawTurn.scene.every((beat) => beat.kind === 'narration' && beat.speaker_key === null), 'raw parity mode does not make the model tag speakers or expressions');
assert.equal(rawTurn.scene.map((beat) => beat.text).join('\n\n'), sampleProse, 'raw prose content must survive the wrapper unchanged');
assert.equal(rawTurn.continuity.date, startScene.date, 'raw parity experiment freezes continuity instead of asking Writer to manage state');
assert.equal(rawTurn.continuity.time, startScene.time);
assert.equal(rawTurn.continuity.location, startScene.location);
assert.equal(rawTurn.continuity.situation, startScene.situation);

assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'parity matrix must still use one Writer call site');
assert.match(api, /writerOutputMode === 'raw'/, 'server must expose raw vs structured output A/B');
assert.match(api, /writerContextMode === 'compact'/, 'server must expose full vs compact context A/B');
assert.match(client, /new URLSearchParams\(window\.location\.search\)/, 'preview mode is selected only by URL query');
assert.match(client, /writerOutputMode: WRITER_OUTPUT_MODE/, 'client forwards output mode');
assert.match(client, /writerContextMode: WRITER_CONTEXT_MODE/, 'client forwards context mode');
assert.match(client, /continueButton\.addEventListener\('click', continueScene\)/, 'Continue remains wired');
assert.match(client, /copy-block-button/, 'Copy remains available');

console.log(`PASS CHAT-PARITY-01 matrix: full=${full.diagnostics.input_chars} chars compact=${compact.diagnostics.input_chars} chars`);
