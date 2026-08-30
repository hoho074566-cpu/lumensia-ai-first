import authoringData from '../../data/authoring/lumensia-academy.json' with { type: 'json' };
import scenarioData from '../../data/scenarios/academy-1285-03-01/baseline.json' with { type: 'json' };
import { buildCanonContext } from './canon-context.js';

const MAX_HISTORY_TURNS = 8;
const POWER_TERMS = ['마나', '오러', '검기', '검강', '경지', '써클', '마법', '검술', '무도', '심법', '권능', 'Trait', 'Authority'];
const HOUSING_TERMS = ['생활동', '기숙사', '호실', '방 배정', '방번호', '방 번호', 'A동', 'B동', 'C동'];

function cleanText(value, max = 2400) {
  const text = String(value ?? '').trim();
  return text.length > max ? text.slice(0, max) : text;
}

function includesAny(text, terms) {
  const value = String(text || '');
  return terms.some((term) => term && value.includes(term));
}

function plainValue(value, depth = 0) {
  if (value == null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map((item) => plainValue(item, depth + 1)).filter(Boolean).join(' / ');
  if (typeof value === 'object' && depth < 3) {
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

function sentenceList(items = []) {
  return items.map((item) => cleanText(item, 420)).filter(Boolean).join(' ');
}

function characterLore(character = {}) {
  const core = character.portrayal_core || {};
  const state = character.current_state || {};
  const voice = character.voice || {};
  const lines = [];
  const identity = sentenceList(core.identity || []);
  const background = sentenceList(core.background || []);
  const personality = sentenceList(core.personality || []);
  const presentation = plainValue(character.presentation || {});
  if (identity) lines.push(`${character.name}: ${identity}`);
  else lines.push(`${character.name}`);
  if (presentation) lines.push(`외형·가시 정보는 ${presentation}.`);
  if (background) lines.push(`배경은 ${background}`);
  if (personality) lines.push(`성격은 ${personality}`);
  if (core.aspiration) lines.push(`지향점은 ${cleanText(core.aspiration, 320)}.`);
  if (core.interests?.length) lines.push(`관심사는 ${sentenceList(core.interests)}.`);
  if (core.activities?.length) lines.push(`평소 활동은 ${sentenceList(core.activities)}.`);
  if (core.combat_identity) lines.push(`전투 성향은 ${cleanText(core.combat_identity, 360)}.`);
  if (core.specialty) lines.push(`특기는 ${cleanText(core.specialty, 320)}.`);
  if (voice.register) lines.push(`말투는 ${cleanText(voice.register, 240)}`);
  if (voice.tendencies?.length) lines.push(`말과 반응의 경향은 ${sentenceList(voice.tendencies)}.`);
  if (character.refined_characterization?.length) lines.push(sentenceList(character.refined_characterization));
  const stateText = plainValue(state);
  if (stateText) lines.push(`현재 시점 사실: ${stateText}.`);
  if (character.dated_relationships?.length) lines.push(`현재 관계 맥락: ${plainValue(character.dated_relationships)}.`);
  if (character.group_attitudes?.length) lines.push(`집단에 대한 태도: ${plainValue(character.group_attitudes)}.`);
  if (character.pc_visible_knowledge?.length) lines.push(`PC가 현재 알 수 있는 관련 사실: ${plainValue(character.pc_visible_knowledge)}.`);
  return lines.join(' ');
}

function locationLore(canon = {}) {
  const facilities = canon?.academy?.location_context?.relevant_facilities || {};
  return Object.entries(facilities).map(([key, value]) => {
    const text = plainValue(value);
    return text ? `장소 ${key}: ${text}.` : '';
  }).filter(Boolean);
}

function relevantLoreModules(canon = {}) {
  const modules = [];
  for (const character of canon.relevant_characters || []) {
    const text = characterLore(character);
    if (text) modules.push(text);
  }
  modules.push(...locationLore(canon));
  return modules.slice(0, 6);
}

function book(name, content, reason) {
  const text = cleanText(content, 2600);
  return text ? { name, content: text, reason } : null;
}

function activeKeywordBooks({ canon = {}, action = '', scene = {} }) {
  const candidates = [];
  const activationText = `${scene.location || ''}\n${scene.situation || ''}\n${action || ''}`;

  if (includesAny(activationText, HOUSING_TERMS)) {
    candidates.push(book(
      '학생 생활동 / 개인 배정',
      `생활동 관련 현재 사실: ${plainValue(canon?.academy?.housing || {})}. 개인 생활동과 방은 현재 run state에서 이미 확정된 값이 있을 때만 그 값을 사용한다. 미정이면 미정인 채 둔다.`,
      '현재 장면 또는 입력이 생활동/개인 방 배정을 직접 다룸',
    ));
  }

  if ((canon.schedule || []).length) {
    candidates.push(book(
      '현재 관련 학사 일정',
      `현재 행동과 직접 관련된 확정 일정: ${plainValue(canon.schedule)}. 일정은 세계의 사실이며 그 자체가 다음 장면 명령은 아니다.`,
      'Canon retrieval이 현재 행동과 관련된 일정 사실을 선택함',
    ));
  }

  if (canon.society && Object.keys(canon.society).length) {
    candidates.push(book(
      '사회 / 법 / 제도',
      plainValue(canon.society),
      '현재 입력이 관련 사회·법·제도 주제를 직접 언급함',
    ));
  }

  if (canon.dated_scenario && Object.keys(canon.dated_scenario).length) {
    candidates.push(book(
      '현재 시대·학사·정치 상태',
      plainValue(canon.dated_scenario),
      '현재 입력이 dated scenario 사실을 직접 요구함',
    ));
  }

  if (includesAny(activationText, POWER_TERMS)) {
    candidates.push(book(
      '마나 / 무도 / 마법 경지',
      plainValue(canon.power || {}),
      '현재 장면 또는 입력이 전투·마나·경지 체계를 직접 다룸',
    ));
  }

  if ((canon.pc_visible_knowledge || []).length) {
    candidates.push(book(
      'PC가 현재 알 수 있는 관련 세계 지식',
      plainValue(canon.pc_visible_knowledge),
      'Canon knowledge retrieval이 공개·가시 사실을 선택함',
    ));
  }

  if ((canon.relevant_open_situations || []).length) {
    candidates.push(book(
      '현재 접근 가능한 외부 상황',
      plainValue(canon.relevant_open_situations),
      '현재 입력이 해당 외부 상황을 직접 다룸',
    ));
  }

  const maxActive = Math.max(0, Math.min(3, Number(authoringData?.keyword_book_policy?.max_active) || 3));
  return candidates.filter(Boolean).slice(0, maxActive);
}

function currentRuntimeState(pc = {}, scene = {}) {
  const lines = [
    `현재 날짜와 시각: ${cleanText(scene.date, 10)} ${cleanText(scene.time, 5)}.`,
    `현재 장소: ${cleanText(scene.location, 220)}.`,
    scene.situation ? `현재 상황: ${cleanText(scene.situation, 620)}.` : '',
    `PC: ${cleanText(pc.name, 80)}, ${Number.isFinite(Number(pc.age)) ? `${Number(pc.age)}세` : '나이 미상'}${pc.gender ? `, ${cleanText(pc.gender, 40)}` : ''}${pc.department ? `, ${cleanText(pc.department, 80)}` : ''}.`,
    pc.origin ? `PC 출신: ${cleanText(pc.origin, 220)}.` : '',
    pc.socialStatus ? `PC 신분: ${cleanText(pc.socialStatus, 140)}.` : '',
    pc.realm ? `PC 무의 경지: ${cleanText(pc.realm, 140)}.` : '',
    pc.magicCircle != null && pc.magicCircle !== '' ? `PC 마법 써클: ${pc.magicCircle}.` : '',
    pc.characterProfile ? `PC 성격/행동 프로필: ${cleanText(pc.characterProfile, 900)}.` : '',
    pc.traits?.length ? `PC Trait: ${pc.traits.map((item) => cleanText(item, 220)).join(' / ')}.` : '',
    pc.authorities?.length ? `PC Authority: ${pc.authorities.map((item) => cleanText(item, 220)).join(' / ')}.` : '',
    pc.skills?.length ? `PC 현재 스킬: ${pc.skills.map((item) => cleanText(item, 140)).join(' / ')}.` : '',
    pc.equipment?.length ? `PC 현재 장비: ${pc.equipment.map((item) => cleanText(item, 180)).join(' / ')}.` : '',
    scene.presentCharacterKeys?.length ? `현재 scene state에 확정된 등장인물 키: ${scene.presentCharacterKeys.join(', ')}.` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

function recentChat(history = []) {
  const turns = history.slice(-MAX_HISTORY_TURNS);
  if (!turns.length) return '(아직 이전 대화 없음)';
  return turns.map((turn, index) => {
    const sceneText = Array.isArray(turn?.scene)
      ? turn.scene.slice(-18).map((beat) => {
          const text = cleanText(beat?.text, 1200);
          if (!text) return '';
          if (beat?.kind === 'dialogue') return `${cleanText(beat?.speaker_name || beat?.speaker_key || 'NPC', 80)}: ${text}`;
          return text;
        }).filter(Boolean).join('\n')
      : '';
    return `TURN ${index + 1}\nUSER: ${cleanText(turn?.action || '(continue)', 1800)}\nWRITER:\n${sceneText}`;
  }).join('\n\n');
}

function developmentExamples() {
  return (authoringData.development_examples || []).slice(0, 3).map((example, index) => (
    `EXAMPLE ${index + 1}\nUSER: ${cleanText(example.user, 900)}\nWRITER:\n${cleanText(example.writer, 3000)}`
  )).join('\n\n');
}

function startSetting(scene = {}, history = [], mode = 'action') {
  if (mode === 'admin' || history.length) return '';
  const start = scenarioData.start || {};
  const exactStart = scene.date === start.date && scene.time === start.time && scene.location === start.location;
  if (!exactStart) return '';
  return [
    cleanText(authoringData?.start_setting?.prologue, 1600),
    `정확한 시작 상태: ${cleanText(start.date, 10)} ${cleanText(start.time, 5)} · ${cleanText(start.location, 220)}. ${cleanText(start.situation, 720)}`,
    cleanText(authoringData?.start_setting?.situation_note, 1600),
  ].filter(Boolean).join('\n');
}

function exactUserEnvelope(mode, action) {
  if (mode === 'continue') {
    return 'MODE: CONTINUE\n새로운 PC 행동은 없다. 바로 직전 장면에서 이미 움직이고 있던 NPC·환경·즉각적 결과만 자연스럽게 이어서, 새 PC 결정이 필요한 지점이나 장면이 착지하는 지점에서 멈춘다.';
  }
  if (mode === 'admin') {
    return `MODE: ADMIN PREVIEW\n이 요청은 저장된 진행을 바꾸지 않는 진단용 장면 배치다. 요청에 명시된 PC 행동/대사만 사용할 수 있다.\nADMIN REQUEST:\n${action}`;
  }
  return `EXACT USER INPUT\n${action}`;
}

export function assembleAuthoring({ action = '', pc = {}, scene = {}, history = [], knowledgeLevel = 1, mode = 'action' } = {}) {
  const retrievalAction = mode === 'continue' ? '' : action;
  const canon = buildCanonContext({ action: retrievalAction, pc, scene, history, knowledgeLevel });
  const lore = relevantLoreModules(canon);
  const books = activeKeywordBooks({ canon, action: retrievalAction, scene });
  const start = startSetting(scene, history, mode);

  const sections = [
    `STORY INFORMATION\n${authoringData.main_author_prompt}`,
    `RELEVANT LORE MODULES\n${lore.length ? lore.map((item, i) => `[LORE ${i + 1}] ${item}`).join('\n\n') : '(현재 추가 Lore 없음)'}`,
    start ? `START SETTING\n${start}` : '',
    `DEVELOPMENT EXAMPLES\n${developmentExamples()}`,
    `CURRENT RUNTIME STATE\n${currentRuntimeState(pc, scene)}`,
    `ACTIVE KEYWORD BOOKS\n${books.length ? books.map((item, i) => `[BOOK ${i + 1}: ${item.name}]\n${item.content}`).join('\n\n') : '(현재 활성 Book 없음)'}`,
    `RECENT CHAT\n${recentChat(history)}`,
    exactUserEnvelope(mode, action),
  ].filter(Boolean);

  return {
    instructions: authoringData.base_rp_template,
    input: sections.join('\n\n'),
    diagnostics: {
      story_id: authoringData.story_id,
      start_setting_active: Boolean(start),
      relevant_lore_count: lore.length,
      active_keyword_books: books.map(({ name, reason }) => ({ name, reason })),
      development_example_count: Math.min(3, (authoringData.development_examples || []).length),
      mode,
    },
  };
}

export const AUTHORING_DATA = authoringData;
