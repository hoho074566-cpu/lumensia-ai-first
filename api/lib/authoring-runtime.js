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

function cleanText(value, max = 4000) {
  const text = String(value ?? '').trim();
  return text.length > max ? text.slice(0, max) : text;
}

function plainValue(value, depth = 0) {
  if (value == null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map((item) => plainValue(item, depth + 1)).filter(Boolean).join(' / ');
  if (typeof value === 'object' && depth < 5) {
    return Object.entries(value)
      .map(([key, item]) => {
        const text = plainValue(item, depth + 1);
        return text ? `${key}: ${text}` : '';
      })
      .filter(Boolean)
      .join('; ');
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
    ['정체성', core.identity],
    ['배경', core.background],
    ['성격', core.personality],
    ['가치', core.values],
    ['관심', core.interests],
    ['평소 활동', core.activities],
    ['능력', core.capabilities],
    ['강점', core.strengths],
    ['한계', core.limitations],
    ['대표 장비', core.signature_equipment],
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

function worldSourcebook() {
  const sections = [
    ['ACADEMY', academyData],
    ['ACADEMIC CALENDAR', academicCalendarData],
    ['COSMOLOGY', cosmologyData],
    ['GEOGRAPHY', geographyData],
    ['POWER SYSTEM', powerSystemData],
    ['SOCIETY', societyData],
  ];

  return sections.map(([label, value]) => (
    `[WORLD: ${label}]\n${cleanText(plainValue(value), 14000)}`
  )).join('\n\n');
}

function scenarioSourcebook() {
  return `[DATED SCENARIO: academy-1285-03-01]\n${cleanText(plainValue(scenarioData), 16000)}`;
}

function knowledgeBase() {
  const characterEntries = Object.keys(CHARACTERS)
    .map((key) => characterSourcebookEntry(key))
    .filter(Boolean)
    .join('\n\n');

  return [
    worldSourcebook(),
    scenarioSourcebook(),
    characterEntries,
  ].filter(Boolean).join('\n\n');
}

function currentRuntimeState(pc = {}, scene = {}) {
  const lines = [
    `현재 날짜와 시각: ${cleanText(scene.date, 10)} ${cleanText(scene.time, 5)}.`,
    `현재 장소: ${cleanText(scene.location, 220)}.`,
    scene.situation ? `현재 상황: ${cleanText(scene.situation, 700)}.` : '',
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
    pc.traits?.length ? `Trait: ${pc.traits.map((item) => cleanText(item, 240)).join(' / ')}.` : '',
    pc.authorities?.length ? `Authority: ${pc.authorities.map((item) => cleanText(item, 240)).join(' / ')}.` : '',
    pc.skills?.length ? `현재 스킬: ${pc.skills.map((item) => cleanText(item, 160)).join(' / ')}.` : '',
    pc.equipment?.length ? `현재 장비: ${pc.equipment.map((item) => cleanText(item, 180)).join(' / ')}.` : '',
    Number.isFinite(Number(pc.startingGold)) ? `현재 기준 금화: ${Math.max(0, Number(pc.startingGold))}.` : '',
    scene.presentCharacterKeys?.length ? `현재 장면에 이어져 있는 등록 인물 key: ${scene.presentCharacterKeys.join(', ')}.` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

function startSettings(scene = {}, history = [], mode = 'action') {
  if (mode !== 'action' || history.length) return '';
  const start = scenarioData.start || {};
  const exactStart = scene.date === start.date && scene.time === start.time && scene.location === start.location;
  if (!exactStart) return '';
  return [
    `PROLOGUE: ${cleanText(authoringData?.start_settings?.prologue, 1200)}`,
    `START SITUATION: ${plainValue(start)}`,
  ].filter(Boolean).join('\n');
}

function developmentExamples() {
  return (authoringData.development_examples || []).slice(0, 2).map((example, index) => (
    `EXAMPLE ${index + 1}\nUSER:\n${cleanText(example.user, 1200)}\n\nWRITER:\n${cleanText(example.writer, 3600)}`
  )).join('\n\n');
}

function recentChat(history = []) {
  const turns = history.slice(-MAX_HISTORY_TURNS);
  if (!turns.length) return '(아직 이전 대화 없음)';
  return turns.map((turn, index) => {
    const sceneText = Array.isArray(turn?.scene)
      ? turn.scene.slice(-20).map((beat) => {
          const text = cleanText(beat?.text, 1400);
          if (!text) return '';
          if (beat?.kind === 'dialogue') return `${cleanText(beat?.speaker_name || beat?.speaker_key || '인물', 80)}: ${text}`;
          return text;
        }).filter(Boolean).join('\n')
      : '';
    return `TURN ${index + 1}\nUSER: ${cleanText(turn?.action || '(이어하기)', 1800)}\nWRITER:\n${sceneText}`;
  }).join('\n\n');
}

function exactUserEnvelope(mode, action) {
  if (mode === 'continue') {
    return 'MODE: CONTINUE\n새로운 사용자 행동은 없다. 현재 장면을 이어 쓰되 사용자의 새 행동·대사·감정·중요한 선택을 대신 정하지 않는다.';
  }
  if (mode === 'admin') {
    return `MODE: ADMIN PREVIEW\n저장 상태를 바꾸지 않는 진단용 요청이다.\nADMIN REQUEST:\n${action}`;
  }
  return `EXACT USER INPUT\n${action}`;
}

export function assembleAuthoring({ action = '', pc = {}, scene = {}, history = [], mode = 'action' } = {}) {
  const start = startSettings(scene, history, mode);
  const sections = [
    `STORY SETTINGS\n${authoringData.story_settings}`,
    `KNOWLEDGE BASE\n${knowledgeBase()}`,
    start ? `START SETTINGS\n${start}` : '',
    `DEVELOPMENT EXAMPLES\n${developmentExamples()}`,
    `RUNTIME STATE\n${currentRuntimeState(pc, scene)}`,
    `RECENT CHAT\n${recentChat(history)}`,
    exactUserEnvelope(mode, action),
  ].filter(Boolean);

  const sourcebookCharacters = Object.keys(CHARACTERS);
  return {
    instructions: authoringData.prompt_template,
    input: sections.join('\n\n'),
    diagnostics: {
      story_id: authoringData.story_id,
      writer_runtime: 'crack-runtime-02-simple',
      start_settings_active: Boolean(start),
      knowledge_base_character_count: sourcebookCharacters.length,
      knowledge_base_sections: ['academy', 'academic-calendar', 'cosmology', 'geography', 'power-system', 'society', 'dated-scenario', 'characters'],
      active_addons: sourcebookCharacters.map((id) => ({ id, kind: 'character', activation: 'always-sourcebook' })),
      active_keyword_books: [],
      development_example_count: Math.min(2, (authoringData.development_examples || []).length),
      mode,
    },
  };
}

export const AUTHORING_DATA = authoringData;
