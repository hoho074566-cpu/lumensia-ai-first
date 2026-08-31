import authoringData from '../../data/authoring/lumensia-academy.json' with { type: 'json' };
import charactersData from '../../data/canon/characters/characters.json' with { type: 'json' };
import presentationData from '../../data/canon/characters/presentation.json' with { type: 'json' };
import academyData from '../../data/canon/world/academy.json' with { type: 'json' };
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

function cleanText(value, max = 3000) {
  const text = String(value ?? '').trim();
  return text.length > max ? text.slice(0, max) : text;
}

function plainValue(value, depth = 0) {
  if (value == null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map((item) => plainValue(item, depth + 1)).filter(Boolean).join(' / ');
  if (typeof value === 'object' && depth < 4) {
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

function characterAliases(key, row = {}) {
  const fullName = String(row.name || '').trim();
  const shortName = fullName.split(/\s+/)[0] || '';
  return [...new Set([key, fullName, shortName].filter(Boolean))];
}

function literalMention(text, token) {
  if (!token) return false;
  if (/^[a-z0-9_-]+$/i.test(token)) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^\\p{L}\\p{N}_])${escaped}(?=$|[^\\p{L}\\p{N}_])`, 'iu').test(text);
  }
  return text.includes(token);
}

function relationshipFactsFor(key) {
  return RELATIONSHIPS.filter((row) => row.from === key || row.to === key);
}

function groupAttitudesFor(key) {
  return GROUP_ATTITUDES.filter((row) => row.from === key);
}

function characterAddon(key) {
  const row = CHARACTERS[key];
  if (!row) return '';
  const core = row.core || {};
  const voice = row.voice || {};
  const state = CHARACTER_STATE[key] || {};
  const presentation = PRESENTATION[key] || {};
  const parts = [`[CHARACTER ADD-ON: ${key}] ${row.name}`];

  const identity = plainValue(core.identity || []);
  const background = plainValue(core.background || []);
  const personality = plainValue(core.personality || []);
  const values = plainValue(core.values || []);
  const capabilities = plainValue(core.capabilities || []);
  const strengths = plainValue(core.strengths || []);
  const limitations = plainValue(core.limitations || []);
  const interests = plainValue(core.interests || []);
  const activities = plainValue(core.activities || []);
  const equipment = plainValue(core.signature_equipment || []);

  if (identity) parts.push(`정체성: ${identity}`);
  if (background) parts.push(`배경: ${background}`);
  if (personality) parts.push(`성격: ${personality}`);
  if (values) parts.push(`가치: ${values}`);
  if (core.aspiration) parts.push(`지향점: ${cleanText(core.aspiration, 500)}`);
  if (interests) parts.push(`관심: ${interests}`);
  if (activities) parts.push(`평소 활동: ${activities}`);
  if (core.combat_identity) parts.push(`전투 성향: ${cleanText(core.combat_identity, 500)}`);
  if (core.specialty) parts.push(`특기: ${cleanText(core.specialty, 500)}`);
  if (capabilities) parts.push(`능력: ${capabilities}`);
  if (strengths) parts.push(`강점: ${strengths}`);
  if (limitations) parts.push(`한계: ${limitations}`);
  if (equipment) parts.push(`대표 장비: ${equipment}`);

  if (voice.register) parts.push(`말투: ${cleanText(voice.register, 400)}`);
  if (voice.tendencies?.length) parts.push(`말/반응 경향: ${plainValue(voice.tendencies)}`);
  if (voice.avoid?.length) parts.push(`피해야 할 붕괴: ${plainValue(voice.avoid)}`);
  if (row.refined_characterization?.length) parts.push(`세부 묘사 원칙: ${plainValue(row.refined_characterization)}`);

  if (Object.keys(presentation).length) parts.push(`보이는 외형/표현 사실: ${plainValue(presentation)}`);
  if (Object.keys(state).length) parts.push(`현재 시점 상태: ${plainValue(state)}`);

  const relationships = relationshipFactsFor(key);
  if (relationships.length) parts.push(`현재 관계 사실: ${plainValue(relationships)}`);
  const attitudes = groupAttitudesFor(key);
  if (attitudes.length) parts.push(`집단 태도: ${plainValue(attitudes)}`);

  parts.push('이 Add-on의 author-facing 사실은 해당 인물 묘사를 위한 재료이며, 다른 인물이나 player가 자동으로 아는 정보가 아니다.');
  return parts.join('\n');
}

function academyWorldAddon() {
  const institution = plainValue(academyData.institution || {});
  const academic = plainValue(academyData.academic_structure || {});
  const layout = plainValue({
    scale: geographyData?.academy_layout?.scale || null,
    axis: geographyData?.academy_layout?.axis || null,
    zones: geographyData?.academy_layout?.zones || {},
    facilities: geographyData?.academy_layout?.facilities || {},
  });
  return [
    '[WORLD ADD-ON: academy]',
    institution ? `기관: ${institution}` : '',
    academic ? `학사 구조: ${academic}` : '',
    layout ? `아카데미 공간: ${layout}` : '',
    '공간 정보는 배경 사실이다. 현재 장면에 필요하지 않은 시설을 순회하거나 나열할 필요가 없다.',
  ].filter(Boolean).join('\n');
}

function scenarioAddon() {
  return [
    '[SCENARIO ADD-ON: academy-1285-03-01]',
    `시작 기준: ${plainValue(scenarioData.start || {})}`,
    `현재 학사 기간 기준: ${plainValue(scenarioData.academic_period || {})}`,
    `확정된 예정 사실: ${plainValue(scenarioData.dated_world_facts || [])}`,
    `생활동 사실: ${plainValue(scenarioData.housing || {})}`,
    `현재 기관 담당자: ${plainValue(scenarioData.institution_state || {})}`,
    `현재 정치 상태: ${plainValue(scenarioData.political_state || {})}`,
    '이 Add-on은 날짜가 있는 세계 상태다. 예정 사실은 절차표가 아니며, user가 그 시간 구간을 지나가도록 선택하지 않았는데 자동으로 완료하거나 다음 단계로 이동하지 않는다.',
    '여기에 없는 접수 방식·열쇠 배부·이의 신청·통금·호실 번호·행정 순서는 미정이다.',
  ].join('\n');
}

function signalText(action = '', scene = {}, history = []) {
  const recent = history.slice(-MAX_HISTORY_TURNS).map((turn) => {
    const dialogueKeys = Array.isArray(turn?.scene)
      ? turn.scene.filter((beat) => beat?.kind === 'dialogue' && beat?.speaker_key).map((beat) => beat.speaker_key).join(' ')
      : '';
    return `${turn?.action || ''} ${dialogueKeys}`;
  }).join('\n');
  return `${scene.location || ''}\n${scene.situation || ''}\n${action || ''}\n${recent}`;
}

function activeAddons(action = '', scene = {}, history = []) {
  const text = signalText(action, scene, history);
  const modules = [
    { id: 'academy', kind: 'world', content: academyWorldAddon(), activation: 'scenario' },
    { id: 'academy-1285-03-01', kind: 'scenario', content: scenarioAddon(), activation: 'scenario' },
  ];

  for (const [key, state] of Object.entries(CHARACTER_STATE)) {
    if (!CHARACTERS[key]) continue;
    if (ACADEMY_PRESENCE.has(state?.presence)) {
      modules.push({ id: key, kind: 'character', content: characterAddon(key), activation: 'academy-presence' });
    }
  }

  for (const [key, row] of Object.entries(CHARACTERS)) {
    if (modules.some((module) => module.id === key)) continue;
    if (characterAliases(key, row).some((alias) => literalMention(text, alias))) {
      modules.push({ id: key, kind: 'character', content: characterAddon(key), activation: 'literal-keyword' });
    }
  }

  return modules;
}

function sourceForKeywordBook(source) {
  switch (source) {
    case 'scenario.housing':
      return plainValue(scenarioData.housing || {});
    case 'canon.power-system':
      return plainValue(powerSystemData || {});
    case 'canon.society.status_and_law':
      return plainValue(societyData.status_and_law || {});
    case 'canon.society.adventurer_guild':
      return plainValue(societyData.adventurer_guild || {});
    case 'canon.society.religion':
      return plainValue(societyData.religion || {});
    case 'canon.society.economy':
      return plainValue(societyData.economy || {});
    default:
      return '';
  }
}

function activeKeywordBooks(action = '', scene = {}) {
  const text = `${scene.location || ''}\n${scene.situation || ''}\n${action || ''}`;
  return (authoringData.keyword_books || []).filter((book) => (
    (book.keywords || []).some((keyword) => literalMention(text, keyword))
  )).map((book) => ({
    id: book.id,
    label: book.label,
    content: sourceForKeywordBook(book.source),
    keywords: book.keywords || [],
  })).filter((book) => book.content);
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
    pc.traits?.length ? `Trait: ${pc.traits.map((item) => cleanText(item, 240)).join(' / ')}.` : '',
    pc.authorities?.length ? `Authority: ${pc.authorities.map((item) => cleanText(item, 240)).join(' / ')}.` : '',
    pc.skills?.length ? `현재 스킬: ${pc.skills.map((item) => cleanText(item, 160)).join(' / ')}.` : '',
    pc.equipment?.length ? `현재 장비: ${pc.equipment.map((item) => cleanText(item, 180)).join(' / ')}.` : '',
    Number.isFinite(Number(pc.startingGold)) ? `현재 기준 금화: ${Math.max(0, Number(pc.startingGold))}.` : '',
    scene.presentCharacterKeys?.length ? `직전 continuity에 남아 있는 등록 인물 key: ${scene.presentCharacterKeys.join(', ')}.` : '',
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
    `RULE: ${cleanText(authoringData?.start_settings?.situation_rule, 1200)}`,
    `PLAY GUIDE: ${cleanText(authoringData?.start_settings?.play_guide, 1200)}`,
  ].filter(Boolean).join('\n');
}

function developmentExamples() {
  return (authoringData.development_examples || []).slice(0, 3).map((example, index) => (
    `EXAMPLE ${index + 1}\nUSER:\n${cleanText(example.user, 1000)}\n\nWRITER:\n${cleanText(example.writer, 3600)}`
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
    return 'MODE: CONTINUE\n새로운 player 행동은 없다. 바로 직전 장면에서 이미 움직이고 있던 인물·환경·즉각적 결과만 자연스럽게 이어간다. 새로운 중요한 player 선택이 필요하거나 장면이 자연스럽게 착지하면 멈춘다.';
  }
  if (mode === 'admin') {
    return `MODE: ADMIN PREVIEW\n이 요청은 저장된 진행을 바꾸지 않는 진단용 장면이다. 요청에 명시된 player 행동/대사만 사용할 수 있다.\nADMIN REQUEST:\n${action}`;
  }
  return `EXACT USER INPUT\n${action}`;
}

export function assembleAuthoring({ action = '', pc = {}, scene = {}, history = [], mode = 'action' } = {}) {
  const effectiveAction = mode === 'continue' ? '' : action;
  const addons = activeAddons(effectiveAction, scene, history);
  const books = activeKeywordBooks(effectiveAction, scene);
  const start = startSettings(scene, history, mode);

  const sections = [
    `STORY SETTINGS\n${authoringData.story_settings}`,
    `ADD-ONS\n${addons.map((module) => module.content).join('\n\n')}`,
    start ? `START SETTINGS\n${start}` : '',
    `DEVELOPMENT EXAMPLES\n${developmentExamples()}`,
    `RUNTIME STATE\n${currentRuntimeState(pc, scene)}`,
    `KEYWORD BOOKS\n${books.length ? books.map((book) => `[${book.label}]\n${cleanText(book.content, 5000)}`).join('\n\n') : '(현재 활성 Keyword Book 없음)'}`,
    `RECENT CHAT\n${recentChat(history)}`,
    exactUserEnvelope(mode, action),
  ].filter(Boolean);

  return {
    instructions: authoringData.prompt_template,
    input: sections.join('\n\n'),
    diagnostics: {
      story_id: authoringData.story_id,
      writer_runtime: 'crack-runtime-01',
      start_settings_active: Boolean(start),
      active_addons: addons.map(({ id, kind, activation }) => ({ id, kind, activation })),
      active_keyword_books: books.map(({ id, label }) => ({ id, label })),
      development_example_count: Math.min(3, (authoringData.development_examples || []).length),
      mode,
    },
  };
}

export const AUTHORING_DATA = authoringData;
