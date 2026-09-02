import authoringData from '../../data/authoring/lumensia-academy.json' with { type: 'json' };
import charactersData from '../../data/canon/characters/characters.json' with { type: 'json' };
import presentationData from '../../data/canon/characters/presentation.json' with { type: 'json' };
import academyData from '../../data/canon/world/academy.json' with { type: 'json' };
import academicCalendarData from '../../data/canon/world/academic-calendar.json' with { type: 'json' };
import cosmologyData from '../../data/canon/world/cosmology.json' with { type: 'json' };
import geographyData from '../../data/canon/world/geography.json' with { type: 'json' };
import societyData from '../../data/canon/world/society.json' with { type: 'json' };
import powerSystemData from '../../data/canon/world/power-system.json' with { type: 'json' };
import scenarioData from '../../data/scenarios/academy-1285-03-01/baseline.json' with { type: 'json' };
import characterStateData from '../../data/scenarios/academy-1285-03-01/character-state.json' with { type: 'json' };
import relationshipsData from '../../data/scenarios/academy-1285-03-01/relationships.json' with { type: 'json' };
import groupAttitudesData from '../../data/scenarios/academy-1285-03-01/group-attitudes.json' with { type: 'json' };

const MAX_HISTORY_TURNS = 8;
const CHARACTERS = charactersData.characters || {};
const PRESENTATION = presentationData.characters || {};
const CHARACTER_STATE = characterStateData.characters || {};
const RELATIONSHIPS = relationshipsData.relationships || [];
const GROUP_ATTITUDES = groupAttitudesData.attitudes || [];
const ACADEMY_PRESENCE = new Set(['academy_student', 'academy_faculty', 'academy_guest']);
const PC_STAT_LABELS = Object.freeze({ body: '신체', mana: '마나', intelligence: '지능', holy: '신성' });

function cleanText(value, max = 4000) {
  const text = String(value ?? '').trim();
  return text.length > max ? text.slice(0, max) : text;
}

function plainValue(value, depth = 0) {
  if (value == null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map((item) => plainValue(item, depth + 1)).filter(Boolean).join(' / ');
  if (typeof value === 'object' && depth < 5) {
    return Object.entries(value).map(([key, item]) => {
      const text = plainValue(item, depth + 1);
      return text ? `${key}: ${text}` : '';
    }).filter(Boolean).join('; ');
  }
  return '';
}

function relationshipFactsFor(key) {
  return RELATIONSHIPS.filter((row) => row.from === key || row.to === key);
}

function groupAttitudesFor(key) {
  return GROUP_ATTITUDES.filter((row) => row.from === key);
}

function characterSourcebookEntry(key) {
  const row = CHARACTERS[key];
  if (!row) return '';
  const core = row.core || {};
  const voice = row.voice || {};
  const state = CHARACTER_STATE[key] || {};
  const presentation = PRESENTATION[key] || {};
  const parts = [`[CHARACTER: ${key}] ${row.name}`];
  const fields = [
    ['정체성', core.identity], ['배경', core.background], ['성격', core.personality], ['가치', core.values],
    ['관심', core.interests], ['평소 활동', core.activities], ['능력', core.capabilities], ['강점', core.strengths],
    ['한계', core.limitations], ['대표 장비', core.signature_equipment],
  ];
  for (const [label, value] of fields) {
    const text = plainValue(value || []);
    if (text) parts.push(`${label}: ${text}`);
  }
  if (core.aspiration) parts.push(`지향점: ${cleanText(core.aspiration, 600)}`);
  if (core.combat_identity) parts.push(`전투 성향: ${cleanText(core.combat_identity, 600)}`);
  if (core.specialty) parts.push(`특기: ${cleanText(core.specialty, 600)}`);
  if (voice.register) parts.push(`말투: ${cleanText(voice.register, 500)}`);
  if (voice.tendencies?.length) parts.push(`말/반응 경향: ${plainValue(voice.tendencies)}`);
  if (voice.avoid?.length) parts.push(`피해야 할 붕괴: ${plainValue(voice.avoid)}`);
  if (row.refined_characterization?.length) parts.push(`세부 묘사: ${plainValue(row.refined_characterization)}`);
  if (Object.keys(presentation).length) parts.push(`외형/표현: ${plainValue(presentation)}`);
  if (Object.keys(state).length) parts.push(`1285-03-01 현재 상태: ${plainValue(state)}`);
  const relationships = relationshipFactsFor(key);
  if (relationships.length) parts.push(`현재 관계: ${plainValue(relationships)}`);
  const attitudes = groupAttitudesFor(key);
  if (attitudes.length) parts.push(`집단 태도: ${plainValue(attitudes)}`);
  return parts.join('\n');
}

function fullWorldSourcebook() {
  const sections = [['ACADEMY', academyData], ['ACADEMIC CALENDAR', academicCalendarData], ['COSMOLOGY', cosmologyData], ['GEOGRAPHY', geographyData], ['POWER SYSTEM', powerSystemData], ['SOCIETY', societyData]];
  return sections.map(([label, value]) => `[WORLD: ${label}]\n${cleanText(plainValue(value), 14000)}`).join('\n\n');
}

function compactWorldSourcebook() {
  const sections = [['ACADEMY', academyData], ['ACADEMY LAYOUT', geographyData?.academy_layout || {}], ['POWER SYSTEM', powerSystemData], ['EMPIRE', societyData?.empire || {}]];
  return sections.map(([label, value]) => `[WORLD: ${label}]\n${cleanText(plainValue(value), 10000)}`).join('\n\n');
}

function scenarioSourcebook() {
  return `[DATED SCENARIO: academy-1285-03-01]\n${cleanText(plainValue(scenarioData), 16000)}`;
}

function academyCharacterKeys() {
  return Object.entries(CHARACTER_STATE).filter(([key, state]) => CHARACTERS[key] && ACADEMY_PRESENCE.has(state?.presence)).map(([key]) => key);
}

function knowledgeBase(contextMode = 'full') {
  const compact = contextMode === 'compact';
  const characterKeys = compact ? academyCharacterKeys() : Object.keys(CHARACTERS);
  const characterEntries = characterKeys.map((key) => characterSourcebookEntry(key)).filter(Boolean).join('\n\n');
  const text = [compact ? compactWorldSourcebook() : fullWorldSourcebook(), scenarioSourcebook(), characterEntries].filter(Boolean).join('\n\n');
  return { text, characterKeys };
}

function pcStatsLine(stats = {}) {
  if (!stats || typeof stats !== 'object' || Array.isArray(stats)) return '';
  return Object.entries(PC_STAT_LABELS).map(([key, label]) => {
    const value = cleanText(stats[key], 16);
    return value ? `${label} ${value}` : '';
  }).filter(Boolean).join(' / ');
}

function relationAux(value = [], main = '') {
  const out = [];
  for (const item of Array.isArray(value) ? value : []) {
    const tag = cleanText(item, 20);
    if (!tag || tag === main || out.includes(tag)) continue;
    out.push(tag);
    if (out.length >= 3) break;
  }
  return out;
}

function playerRelationshipState(relationships = {}) {
  if (!relationships || typeof relationships !== 'object' || Array.isArray(relationships)) return '';
  const rows = Object.entries(relationships).map(([key, raw]) => {
    if (!CHARACTERS[key] || !raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const main = cleanText(raw.main, 24) || '아는 사이';
    const aux = relationAux(raw.aux, main);
    const evidence = (Array.isArray(raw.evidence) ? raw.evidence : []).slice(-2).map((row) => cleanText(row?.note, 260)).filter(Boolean);
    const meaningful = main !== '아는 사이' || aux.length > 0 || (Array.isArray(raw.evidence) && raw.evidence.some((row) => row?.significance === 'meaningful' || row?.significance === 'milestone'));
    return { key, name: CHARACTERS[key].name || key, main, aux, evidence, meaningful, updatedAt: cleanText(raw.updatedAt, 32) };
  }).filter(Boolean);
  if (!rows.length) return '';
  rows.sort((a, b) => a.meaningful !== b.meaningful ? (a.meaningful ? -1 : 1) : b.updatedAt.localeCompare(a.updatedAt));
  return [
    'PC와 등록 인물의 현재 관계 — 작가용 현재 사실이다. 등장인물이 main/aux 태그나 시스템 용어를 자동으로 알고 그대로 발화하는 정보가 아니며, 각 인물의 성격과 실제 경험에 맞춰 말투·거리감·행동에 자연스럽게 반영한다.',
    ...rows.slice(0, 20).map((row) => {
      const label = [row.main, ...row.aux].join(' · ');
      const reason = row.evidence.length ? ` 최근 근거: ${row.evidence.join(' / ')}.` : '';
      return `- ${row.key} / ${row.name}: ${label}.${reason}`;
    }),
  ].join('\n');
}

function continuityWriterState(memory = {}) {
  if (!memory || typeof memory !== 'object' || Array.isArray(memory)) return '';
  const facts = (Array.isArray(memory.facts) ? memory.facts : []).slice(-14).map((row) => cleanText(row, 240)).filter(Boolean);
  const exchanges = (Array.isArray(memory.exchanges) ? memory.exchanges : []).slice(-10).map((row) => cleanText(row, 240)).filter(Boolean);
  const openThreads = (Array.isArray(memory.openThreads) ? memory.openThreads : []).slice(-10).map((row) => cleanText(row, 240)).filter(Boolean);
  if (!facts.length && !exchanges.length && !openThreads.length) return '';
  return [
    '지속 연속성 메모 — 아래는 이미 확정된 작가용 사실이다. 완료된 사건을 다시 처음처럼 발생시키거나, 이미 공유된 설명·질문·답변을 새 정보처럼 반복하지 않는다. 미래를 계획하는 지시가 아니라 과거/현재 사실 기록이다.',
    facts.length ? `이미 확정된 주요 사실:\n${facts.map((row) => `- ${row}`).join('\n')}` : '',
    exchanges.length ? `이미 서로 공유된 핵심 정보/대화:\n${exchanges.map((row) => `- ${row}`).join('\n')}` : '',
    openThreads.length ? `아직 미해결인 현재 흐름:\n${openThreads.map((row) => `- ${row}`).join('\n')}` : '',
  ].filter(Boolean).join('\n');
}

function currentRuntimeState(pc = {}, scene = {}, relationships = {}, continuityMemory = {}) {
  const stats = pcStatsLine(pc.stats);
  const relationState = playerRelationshipState(relationships);
  const continuityState = continuityWriterState(continuityMemory);
  const lines = [
    `현재 날짜와 시각: ${cleanText(scene.date, 10)} ${cleanText(scene.time, 5)}.`,
    `현재 장소: ${cleanText(scene.location, 220)}.`,
    scene.situation ? `현재 상황: ${cleanText(scene.situation, 700)}.` : '',
    'PC의 설정·능력·출신·현재까지 실제로 드러난 행동은 세계가 존중해야 할 사실이지, 서사를 자동으로 특정 방향으로 끌고 가라는 명령이 아니다. NPC와 세계는 관찰 가능한 사실과 자신의 지식·경험·성격에 맞게 자연스럽게 반응하고, 새로운 증거가 생기면 기존 판단·거리감·역할 관계를 실제로 갱신한다. 그러나 PC가 강하거나 이질적이라는 이유만으로 사건의 강도, 조사, 격리, 취조, 연구 같은 흐름을 자동 확대하지 않는다. 필요한 절차가 충분히 목적을 달성했다면 압축하고 현재 생활과 이야기 흐름으로 돌아간다.',
    `player: ${cleanText(pc.name, 80)}, ${Number.isFinite(Number(pc.age)) ? `${Number(pc.age)}세` : '나이 미상'}${pc.gender ? `, ${cleanText(pc.gender, 40)}` : ''}${pc.department ? `, ${cleanText(pc.department, 80)}` : ''}.`,
    pc.origin ? `출신: ${cleanText(pc.origin, 220)}.` : '',
    pc.socialStatus ? `신분: ${cleanText(pc.socialStatus, 140)}.` : '',
    pc.admission ? `입학 방식: ${cleanText(pc.admission, 180)}.` : '',
    pc.realm ? `무의 경지: ${cleanText(pc.realm, 140)}.` : '',
    pc.magicCircle != null && pc.magicCircle !== '' ? `마법 써클: ${pc.magicCircle}.` : '',
    pc.appearance ? `외형: ${cleanText(pc.appearance, 700)}.` : '',
    pc.background ? `배경: ${cleanText(pc.background, 1000)}.` : '',
    pc.characterProfile ? `성격/행동 프로필: ${cleanText(pc.characterProfile, 1000)}.` : '',
    pc.talents && Object.keys(pc.talents).length ? `재능: ${plainValue(pc.talents)}.` : '',
    stats ? `스탯: ${stats}.` : '',
    pc.traits?.length ? `Trait: ${pc.traits.map((item) => cleanText(item, 240)).join(' / ')}.` : '',
    pc.authorities?.length ? `Authority: ${pc.authorities.map((item) => cleanText(item, 240)).join(' / ')}.` : '',
    pc.skills?.length ? `현재 스킬: ${pc.skills.map((item) => cleanText(item, 160)).join(' / ')}.` : '',
    pc.equipment?.length ? `현재 장비: ${pc.equipment.map((item) => cleanText(item, 180)).join(' / ')}.` : '',
    pc.conditions?.length ? `현재 상태: ${pc.conditions.map((item) => cleanText(item, 180)).join(' / ')}.` : '',
    Number.isFinite(Number(pc.startingGold)) ? `현재 기준 금화: ${Math.max(0, Number(pc.startingGold))}.` : '',
    relationState,
    continuityState,
    scene.presentCharacterKeys?.length ? `현재 장면에 이어져 있는 등록 인물 key: ${scene.presentCharacterKeys.join(', ')}.` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

function startSettings(scene = {}, history = [], mode = 'action') {
  if (mode !== 'action' || history.length) return '';
  const start = scenarioData.start || {};
  const exactStart = scene.date === start.date && scene.time === start.time && scene.location === start.location;
  if (!exactStart) return '';
  return [`PROLOGUE: ${cleanText(authoringData?.start_settings?.prologue, 1200)}`, `START SITUATION: ${plainValue(start)}`].filter(Boolean).join('\n');
}

function developmentExamples() {
  return (authoringData.development_examples || []).slice(0, 2).map((example, index) => `EXAMPLE ${index + 1}\nUSER:\n${cleanText(example.user, 1200)}\n\nWRITER:\n${cleanText(example.writer, 3600)}`).join('\n\n');
}

function recentChat(history = []) {
  const turns = history.slice(-MAX_HISTORY_TURNS);
  if (!turns.length) return '(아직 이전 대화 없음)';
  return turns.map((turn, index) => {
    const sceneText = Array.isArray(turn?.scene) ? turn.scene.slice(-24).map((beat) => {
      const text = cleanText(beat?.text, 1800);
      if (!text) return '';
      if (beat?.kind === 'dialogue') return `${cleanText(beat?.speaker_name || beat?.speaker_key || '인물', 80)}: ${text}`;
      return text;
    }).filter(Boolean).join('\n') : '';
    const inputLabel = turn?.inputKind === 'situation' ? 'SITUATION CONTEXT' : 'USER';
    return `TURN ${index + 1}\n${inputLabel}: ${cleanText(turn?.action || '(이어하기)', 1800)}\nWRITER:\n${sceneText}`;
  }).join('\n\n');
}

function exactUserEnvelope(mode, action, inputKind = 'intent') {
  if (mode === 'continue') return 'MODE: CONTINUE\n새로운 사용자 행동은 없다. 현재 장면을 이어 쓰되 사용자의 새 행동·대사·감정·중요한 선택을 대신 정하지 않는다.';
  if (mode === 'admin') return `MODE: ADMIN PREVIEW\n저장 상태를 바꾸지 않는 진단용 요청이다.\nADMIN REQUEST:\n${action}`;
  if (inputKind === 'situation') {
    return `MODE: SITUATION/NARRATION CONTEXT\n아래 입력은 PC가 말했거나 행동했다는 뜻이 아니다. 사용자가 제공한 장면/상황 전제로 받아들이고, PC의 새 대사·행동·감정·중요한 선택을 임의로 확정하지 않는다.\nSITUATION CONTEXT:\n${action}`;
  }
  return `EXACT USER INPUT\n${action}`;
}

export function assembleAuthoring({ action = '', pc = {}, scene = {}, relationships = {}, continuityMemory = {}, history = [], mode = 'action', inputKind = 'intent', contextMode = 'full' } = {}) {
  const normalizedContextMode = contextMode === 'compact' ? 'compact' : 'full';
  const start = startSettings(scene, history, mode);
  const sourcebook = knowledgeBase(normalizedContextMode);
  const sections = [
    `STORY SETTINGS\n${authoringData.story_settings}`,
    `KNOWLEDGE BASE\n${sourcebook.text}`,
    start ? `START SETTINGS\n${start}` : '',
    `DEVELOPMENT EXAMPLES\n${developmentExamples()}`,
    `RUNTIME STATE\n${currentRuntimeState(pc, scene, relationships, continuityMemory)}`,
    `RECENT CHAT\n${recentChat(history)}`,
    exactUserEnvelope(mode, action, inputKind),
  ].filter(Boolean);
  const input = sections.join('\n\n');
  const knowledgeSections = normalizedContextMode === 'compact'
    ? ['academy', 'academy-layout', 'power-system', 'empire', 'dated-scenario', 'academy-characters']
    : ['academy', 'academic-calendar', 'cosmology', 'geography', 'power-system', 'society', 'dated-scenario', 'characters'];
  return {
    instructions: authoringData.prompt_template,
    input,
    diagnostics: {
      story_id: authoringData.story_id,
      writer_runtime: 'chat-parity-01',
      context_mode: normalizedContextMode,
      start_settings_active: Boolean(start),
      knowledge_base_character_count: sourcebook.characterKeys.length,
      knowledge_base_sections: knowledgeSections,
      knowledge_base_chars: sourcebook.text.length,
      instructions_chars: authoringData.prompt_template.length,
      input_chars: input.length,
      active_addons: sourcebook.characterKeys.map((id) => ({ id, kind: 'character', activation: 'sourcebook' })),
      active_keyword_books: [],
      development_example_count: Math.min(2, (authoringData.development_examples || []).length),
      mode,
      input_kind: inputKind === 'situation' ? 'situation' : 'intent',
    },
  };
}

export const AUTHORING_DATA = authoringData;