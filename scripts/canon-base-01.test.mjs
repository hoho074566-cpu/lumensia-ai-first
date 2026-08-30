import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CHARACTER_KEYS } from '../assets/manifest.js';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const asText = (value) => JSON.stringify(value);

const characters = readJson('data/canon/characters/characters.json');
const presentation = readJson('data/canon/characters/presentation.json');
const academy = readJson('data/canon/world/academy.json');
const calendar = readJson('data/canon/world/academic-calendar.json');
const geography = readJson('data/canon/world/geography.json');
const society = readJson('data/canon/world/society.json');
const power = readJson('data/canon/world/power-system.json');
const pcRules = readJson('data/canon/rules/pc.json');
const knowledge = readJson('data/canon/knowledge/knowledge.json');
const baseline = readJson('data/scenarios/academy-1285-03-01/baseline.json');
const characterState = readJson('data/scenarios/academy-1285-03-01/character-state.json');
const openSituations = readJson('data/scenarios/academy-1285-03-01/open-situations.json');
const relationships = readJson('data/scenarios/academy-1285-03-01/relationships.json');
const groupAttitudes = readJson('data/scenarios/academy-1285-03-01/group-attitudes.json');
const api = readFileSync('api/write.js', 'utf8');
const canonContext = readFileSync('api/lib/canon-context.js', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const html = readFileSync('index.html', 'utf8');

const characterKeys = Object.keys(characters.characters || {}).sort();
assert.deepEqual(characterKeys, [...CHARACTER_KEYS].sort(), 'durable character core must preserve all 32 canonical keys');
assert.ok(characterKeys.every((key) => characters.characters[key]?.core && characters.characters[key]?.voice), 'every canonical character needs durable core + voice');
assert.doesNotMatch(asText(characters), /baseline_1285_03_01|source_detail/, 'dated state and migration metadata must not live in durable character core');
assert.doesNotMatch(asText(characters.characters?.lena || {}), /실제 기원에는 별도 극비/, 'ordinary Lena core must not advertise the existence of a hidden origin');

const sourceFidelity = {
  elena: ['자유분방', '장난기', '호기심', '마법의 진리'],
  artemis: ['낡은 대검', '진짜 기사를 양성'],
  sera: ['냉소적', '생존', '안정되고 부유한 삶'],
  sia: ['정령친화', '실피드', '노움', '운디네'],
  lillia: ['정정당당', '실전경험', '속임수', '오러 제어'],
  lena: ['마나의 총아', '귀찮', '호기심'],
  emily: ['천진난만', '장난기', '날카로운 통찰'],
  laris: ['정확성', '분석력', '장기전', '변칙대응'],
  mirabelle: ['기사과 수업 청강', '대련', '자기 방식'],
  serena: ['디스펠', '마법구조'],
  chloe: ['연금술', '상업', '자유'],
};
for (const [key, tokens] of Object.entries(sourceFidelity)) {
  const text = asText(characters.characters?.[key] || {});
  for (const token of tokens) assert.match(text, new RegExp(token), `${key} durable core lost source-backed characterization: ${token}`);
}
assert.match(asText(characters.characters?.emily?.voice || {}), /설교/, 'Emily voice guard must explicitly resist turning values into recurring thematic speeches');

for (const key of Object.keys(presentation.characters || {})) {
  assert.ok(CHARACTER_KEYS.includes(key), `presentation contains unknown character key: ${key}`);
}
for (const key of presentation.unverified_presentation_keys || []) {
  assert.ok(CHARACTER_KEYS.includes(key), `unverified presentation list contains unknown key: ${key}`);
  assert.ok(!Object.hasOwn(presentation.characters || {}, key), `unverified character must not simultaneously receive asserted presentation: ${key}`);
}
const presentationOpening = {
  emily: ['여성', '은발', '청안', '작은 체구'],
  lena: ['여성', '은발', '자색 눈', '작은 체구'],
  artemis: ['여성', '백발', '적안', '교수복', '실검'],
  sera: ['여성', '갈색 머리', '청안'],
  lillia: ['여성', '붉은 머리', '금안', '장검', '발렌하르트'],
};
for (const [key, required] of Object.entries(presentationOpening)) {
  const text = asText(presentation.characters?.[key] || {});
  for (const token of required) assert.match(text, new RegExp(token), `${key} presentation must preserve source-audited fact: ${token}`);
}

assert.ok(!Object.hasOwn(academy, 'baseline_1285_03_01'), 'immutable academy Canon must not contain dated office state');
assert.doesNotMatch(String(academy.academic_structure?.dormitories || ''), /학년별|A\s*=\s*1학년|B\s*=\s*2학년|C\s*=\s*3학년/, 'academy dorm Canon must not hard-map halls to years');
assert.doesNotMatch(String(geography.academy_layout?.facilities?.dorms || ''), /A\s*=\s*1학년|B\s*=\s*2학년|C\s*=\s*3학년/, 'geography must not contradict dorm assignment Canon');
assert.deepEqual(baseline.housing?.halls, ['A동', 'B동', 'C동'], 'dated scenario must expose A/B/C housing halls');
assert.match(String(baseline.housing?.assignment_rule || ''), /고정하지 않/, 'scenario housing must reject year/department-exclusive hall assignment');

assert.ok(!Object.hasOwn(society.empire?.succession || {}, 'baseline_1285_03_01'), 'current succession snapshot belongs in dated scenario, not immutable society Canon');
assert.match(String(baseline.political_state?.imperial_succession || ''), /후계자를 지명하지 않았/, 'dated scenario must carry the current succession snapshot');
assert.match(asText(society.status_and_law?.special_crimes || {}), /제국보안국/, 'special-crime jurisdiction must include the Imperial Security Bureau');
assert.match(asText(society.status_and_law?.special_crimes || {}), /황실/, 'special-crime jurisdiction must include imperial direct-response authority');

assert.ok(!Object.hasOwn(power, 'source_classification'), 'runtime power Canon must not contain migration classification metadata');
assert.ok(!Object.hasOwn(power, 'magic_record_note'), 'runtime power Canon must not contain migration reconciliation notes');
const realmById = new Map((power.martial_realms || []).map((row) => [row.id, row]));
assert.match(String(realmById.get('expert_high')?.meaning || ''), /외부화|검기/, 'Expert High must preserve later clarified externalized-aura meaning');
assert.match(String(realmById.get('expert_peak')?.meaning || ''), /형태|밀도|방향/, 'Expert Peak must preserve aura-shaping precision');
assert.match(String(realmById.get('expert_peak')?.meaning || ''), /내부.*외부|외부.*내부/, 'Expert Peak must preserve simultaneous internal/external aura control');
assert.match(String(realmById.get('master')?.meaning || ''), /의지|개념/, 'Master must preserve will/concept carried through aura');
assert.match(String(realmById.get('master')?.meaning || ''), /Authority/, 'Master definition must explicitly avoid equating realm with Authority');
assert.ok(!Object.hasOwn(calendar, 'runtime_boundary'), 'calendar data must contain facts, not Writer/runtime instruction text');
assert.ok(!Object.hasOwn(pcRules, 'migration_note'), 'PC Canon must not contain migration notes');

assert.ok(!Object.hasOwn(baseline, 'character_baseline_notes'), 'dated character state must have one structured source, not duplicated free-text notes');
assert.equal(baseline.character_state_source, 'character-state.json');
for (const key of Object.keys(characterState.characters || {})) {
  assert.ok(CHARACTER_KEYS.includes(key), `character-state contains unknown key: ${key}`);
}
assert.equal(characterState.characters?.etera?.restricted_power_ref, 'etera_nine_circle', 'Etera restricted power must point to Knowledge Canon');
assert.ok(!Object.hasOwn(characterState.characters?.etera || {}, 'circle'), 'Etera exact circle must not leak through ordinary dated state');
const eteraNine = (knowledge.facts || []).find((row) => row.id === 'etera_nine_circle');
assert.ok(eteraNine, 'restricted Etera power fact must exist in Knowledge Canon');
assert.ok(Number(eteraNine.visibility) >= 4 && eteraNine.public === false, 'Etera nine-circle fact must remain restricted');

const forbiddenOpenIds = new Set(['entrance_and_orientation', 'freshman_evaluation', 'imperial_succession', 'student_recruitment', 'aria_stay']);
for (const row of openSituations.situations || []) {
  assert.ok(!forbiddenOpenIds.has(row.id), `schedule/baseline fact leaked into open-situations: ${row.id}`);
}

for (const row of relationships.relationships || []) {
  assert.ok(CHARACTER_KEYS.includes(row.from), `relationship from must be a canonical person: ${row.from}`);
  assert.ok(CHARACTER_KEYS.includes(row.to), `relationship to must be a canonical person: ${row.to}`);
}
for (const [from, to] of [['isabel','sera'], ['sera','isabel'], ['isabel','anastasia'], ['elena','lucia'], ['elena','serena']]) {
  assert.ok((relationships.relationships || []).some((row) => row.from === from && row.to === to), `source-backed dated relationship missing: ${from}->${to}`);
}
for (const row of groupAttitudes.attitudes || []) {
  assert.ok(CHARACTER_KEYS.includes(row.from), `group attitude from must be a canonical person: ${row.from}`);
  assert.ok(row.toward_group && !CHARACTER_KEYS.includes(row.toward_group), `group attitude target must be an explicit group id: ${row.toward_group}`);
}

assert.match(api, /buildCanonContext/, 'Writer must delegate factual retrieval through the Canon context boundary');
assert.match(canonContext, /character-state\.json/, 'Canon retrieval boundary must read structured dated character state');
assert.doesNotMatch(`${api}\n${canonContext}`, /row\.baseline_1285_03_01/, 'base retrieval must not depend on dated state embedded in character core');
for (const field of ['traits', 'authorities', 'startingGold', 'characterProfile']) {
  assert.match(api, new RegExp(field), `server PC sanitizer must preserve ${field}`);
  assert.match(client, new RegExp(field), `client save state must preserve ${field}`);
}
assert.match(html, /name="traits"/, 'PC form must expose Traits');
assert.match(html, /name="authorities"/, 'PC form must expose Authorities');
assert.match(html, /name="startingGold"/, 'PC form must expose starting gold');
assert.match(html, /name="characterProfile"/, 'PC form must expose free character profile');

console.log('PASS CANON-BASE-01 cross-file reconciliation invariants');
