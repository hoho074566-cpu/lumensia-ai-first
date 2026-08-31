import authoringData from '../../data/authoring/lumensia-academy.json' with { type: 'json' };
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

function currentRuntimeState(pc = {}, scene = {}) {
  const lines = [
    `현재 날짜와 시각: ${cleanText(scene.date, 10)} ${cleanText(scene.time, 5)}.`,
    `현재 장소: ${cleanText(scene.location, 220)}.`,
    scene.situation ? `현재 상황: ${cleanText(scene.situation, 620)}.` : '',
    `player: ${cleanText(pc.name, 80)}, ${Number.isFinite(Number(pc.age)) ? `${Number(pc.age)}세` : '나이 미상'}${pc.gender ? `, ${cleanText(pc.gender, 40)}` : ''}${pc.department ? `, ${cleanText(pc.department, 80)}` : ''}.`,
    pc.origin ? `출신: ${cleanText(pc.origin, 220)}.` : '',
    pc.socialStatus ? `신분: ${cleanText(pc.socialStatus, 140)}.` : '',
    pc.realm ? `무의 경지: ${cleanText(pc.realm, 140)}.` : '',
    pc.magicCircle != null && pc.magicCircle !== '' ? `마법 써클: ${pc.magicCircle}.` : '',
    pc.appearance ? `외형: ${cleanText(pc.appearance, 700)}.` : '',
    pc.background ? `배경: ${cleanText(pc.background, 900)}.` : '',
    pc.characterProfile ? `성격/행동 프로필: ${cleanText(pc.characterProfile, 900)}.` : '',
    pc.traits?.length ? `Trait: ${pc.traits.map((item) => cleanText(item, 220)).join(' / ')}.` : '',
    pc.authorities?.length ? `Authority: ${pc.authorities.map((item) => cleanText(item, 220)).join(' / ')}.` : '',
    pc.skills?.length ? `현재 스킬: ${pc.skills.map((item) => cleanText(item, 140)).join(' / ')}.` : '',
    pc.equipment?.length ? `현재 장비: ${pc.equipment.map((item) => cleanText(item, 180)).join(' / ')}.` : '',
    scene.presentCharacterKeys?.length ? `직전 continuity에 남아 있는 등록 인물 key: ${scene.presentCharacterKeys.join(', ')}.` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

function castRow(row = {}) {
  const parts = [`[${row.key}] ${row.name}`];
  const state = plainValue(row.current_state || {});
  const presentation = plainValue(row.presentation || {});
  const identity = plainValue(row.identity || []);
  const personality = plainValue(row.personality_signals || []);
  const interests = plainValue(row.interests || []);
  const relationships = plainValue(row.relationship_hints || []);
  if (state) parts.push(`현재 상태: ${state}`);
  if (presentation) parts.push(`보이는 외형/표현 사실: ${presentation}`);
  if (identity) parts.push(`정체성: ${identity}`);
  if (personality) parts.push(`성격 신호: ${personality}`);
  if (row.aspiration) parts.push(`지향점: ${cleanText(row.aspiration, 220)}`);
  if (interests) parts.push(`관심: ${interests}`);
  if (row.activity_or_combat_signal) parts.push(`활동/전투 신호: ${cleanText(row.activity_or_combat_signal, 260)}`);
  if (row.voice_register) parts.push(`말투: ${cleanText(row.voice_register, 220)}`);
  if (relationships) parts.push(`관계 신호: ${relationships}`);
  return parts.join(' | ');
}

function academyCastMaterial(canon = {}) {
  const rows = canon.academy_cast_index || [];
  if (!rows.length) return '(현재 아카데미 생활권 등록 인물 자료 없음)';
  return [
    '아래는 이 시점에 아카데미 생활권에 속한 등록 인물 재료다. 등장 순서표나 현재 위치표가 아니다. Writer가 현재 장면에 자연스럽게 맞는 사람을 직접 판단한다.',
    ...rows.map(castRow),
  ].join('\n');
}

function detailedCharacterMaterial(canon = {}) {
  const rows = canon.relevant_characters || [];
  if (!rows.length) return '(현재 장면에 이미 확정되었거나 직접 언급된 등록 인물의 추가 상세 자료 없음)';
  return rows.map((character) => {
    const parts = [`[${character.key}] ${character.name}`];
    const core = character.portrayal_core || {};
    const identity = plainValue(core.identity || []);
    const background = plainValue(core.background || []);
    const personality = plainValue(core.personality || []);
    const capabilities = plainValue(core.capabilities || []);
    const limitations = plainValue(core.limitations || []);
    const interests = plainValue(core.interests || []);
    const activities = plainValue(core.activities || []);
    if (identity) parts.push(`정체성: ${identity}`);
    if (background) parts.push(`배경: ${background}`);
    if (personality) parts.push(`성격: ${personality}`);
    if (core.aspiration) parts.push(`지향점: ${cleanText(core.aspiration, 320)}`);
    if (interests) parts.push(`관심: ${interests}`);
    if (activities) parts.push(`평소 활동: ${activities}`);
    if (core.combat_identity) parts.push(`전투 성향: ${cleanText(core.combat_identity, 360)}`);
    if (core.specialty) parts.push(`특기: ${cleanText(core.specialty, 320)}`);
    if (capabilities) parts.push(`능력: ${capabilities}`);
    if (limitations) parts.push(`한계: ${limitations}`);
    const voice = character.voice || {};
    if (voice.register) parts.push(`말투: ${cleanText(voice.register, 260)}`);
    if (voice.tendencies?.length) parts.push(`말/반응 경향: ${plainValue(voice.tendencies)}`);
    if (voice.avoid?.length) parts.push(`피해야 할 붕괴: ${plainValue(voice.avoid)}`);
    const presentation = plainValue(character.presentation || {});
    if (presentation) parts.push(`보이는 외형/표현 사실: ${presentation}`);
    const state = plainValue(character.current_state || {});
    if (state) parts.push(`현재 상태: ${state}`);
    const relationships = plainValue(character.dated_relationships || []);
    if (relationships) parts.push(`현재 관계 맥락: ${relationships}`);
    const groupAttitudes = plainValue(character.group_attitudes || []);
    if (groupAttitudes) parts.push(`집단 태도: ${groupAttitudes}`);
    const pcKnowledge = plainValue(character.pc_visible_knowledge || []);
    if (pcKnowledge) parts.push(`player가 현재 알 수 있는 관련 사실: ${pcKnowledge}`);
    return parts.join(' | ');
  }).join('\n');
}

function relevantWorldFacts(canon = {}, action = '', scene = {}) {
  const activationText = `${scene.location || ''}\n${scene.situation || ''}\n${action || ''}`;
  const groups = [];

  const facilities = canon?.academy?.location_context?.relevant_facilities || {};
  if (Object.keys(facilities).length) {
    groups.push({ name: '현재 장소 관련 시설 사실', content: plainValue(facilities), reason: '현재 장소/입력에 직접 관련' });
  }

  if (includesAny(activationText, HOUSING_TERMS)) {
    groups.push({
      name: '생활동 사실',
      content: `${plainValue(canon?.academy?.housing || {})}. 개인 생활동/방은 run state에서 확정된 값만 사용하며 미정이면 미정으로 둔다.`,
      reason: '현재 장면/입력이 생활동을 직접 다룸',
    });
  }

  if ((canon.schedule || []).length) {
    groups.push({
      name: '현재 관련 학사 일정 사실',
      content: `${plainValue(canon.schedule)}. 이것은 세계의 사실일 뿐 다음 장면 순서나 안내 대사를 만들라는 지시가 아니다.`,
      reason: 'Canon retrieval이 현재 시각/질문과 관련된 일정 사실을 선택함',
    });
  }

  if (canon.society && Object.keys(canon.society).length) {
    groups.push({ name: '사회/법/제도 사실', content: plainValue(canon.society), reason: '현재 입력이 직접 관련 주제를 다룸' });
  }

  if (canon.dated_scenario && Object.keys(canon.dated_scenario).length) {
    groups.push({ name: '현재 시대/학사/정치 사실', content: plainValue(canon.dated_scenario), reason: '현재 입력이 dated scenario 사실을 직접 요구함' });
  }

  if (includesAny(activationText, POWER_TERMS)) {
    groups.push({ name: '마나/무도/마법 경지 사실', content: plainValue(canon.power || {}), reason: '현재 장면/입력이 전투·마나·경지를 직접 다룸' });
  }

  if ((canon.pc_visible_knowledge || []).length) {
    groups.push({ name: 'player가 현재 알 수 있는 세계 지식', content: plainValue(canon.pc_visible_knowledge), reason: 'Canon knowledge retrieval이 관련 공개 사실을 선택함' });
  }

  if ((canon.relevant_open_situations || []).length) {
    groups.push({ name: '현재 접근 가능한 외부 상황', content: plainValue(canon.relevant_open_situations), reason: '현재 입력이 해당 외부 상황을 직접 다룸' });
  }

  if (!groups.length) return { text: '(현재 추가로 필요한 세계 사실 없음)', groups: [] };

  return {
    text: groups.map((group) => `[${group.name}]\n${cleanText(group.content, 3200)}`).join('\n\n'),
    groups: groups.map(({ name, reason }) => ({ name, reason })),
  };
}

function recentChat(history = []) {
  const turns = history.slice(-MAX_HISTORY_TURNS);
  if (!turns.length) return '(아직 이전 대화 없음)';
  return turns.map((turn, index) => {
    const sceneText = Array.isArray(turn?.scene)
      ? turn.scene.slice(-18).map((beat) => {
          const text = cleanText(beat?.text, 1200);
          if (!text) return '';
          if (beat?.kind === 'dialogue') return `${cleanText(beat?.speaker_name || beat?.speaker_key || '인물', 80)}: ${text}`;
          return text;
        }).filter(Boolean).join('\n')
      : '';
    return `TURN ${index + 1}\nUSER: ${cleanText(turn?.action || '(이어하기)', 1800)}\nWRITER:\n${sceneText}`;
  }).join('\n\n');
}

function developmentExamples() {
  return (authoringData.development_examples || []).slice(0, 3).map((example, index) => (
    `EXAMPLE ${index + 1}\nUSER: ${cleanText(example.user, 900)}\nWRITER:\n${cleanText(example.writer, 3000)}`
  )).join('\n\n');
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

export function assembleAuthoring({ action = '', pc = {}, scene = {}, history = [], knowledgeLevel = 1, mode = 'action' } = {}) {
  const retrievalAction = mode === 'continue' ? '' : action;
  const canon = buildCanonContext({ action: retrievalAction, pc, scene, history, knowledgeLevel });
  const worldFacts = relevantWorldFacts(canon, retrievalAction, scene);

  const instructions = [
    authoringData.base_rp_template,
    authoringData.main_author_prompt,
  ].filter(Boolean).join('\n\n');

  const sections = [
    `CURRENT RUNTIME STATE\n${currentRuntimeState(pc, scene)}`,
    `ACADEMY CAST MATERIAL\n${academyCastMaterial(canon)}`,
    `CURRENT / PRESENT CHARACTER DETAIL\n${detailedCharacterMaterial(canon)}`,
    `RELEVANT WORLD FACTS\n${worldFacts.text}`,
    `DEVELOPMENT EXAMPLES\n${developmentExamples()}`,
    `RECENT CHAT\n${recentChat(history)}`,
    exactUserEnvelope(mode, action),
  ];

  return {
    instructions,
    input: sections.join('\n\n'),
    diagnostics: {
      story_id: authoringData.story_id,
      writer_runtime: 'cleanroom-01',
      academy_cast_count: (canon.academy_cast_index || []).length,
      detailed_character_count: (canon.relevant_characters || []).length,
      active_keyword_books: worldFacts.groups,
      development_example_count: Math.min(3, (authoringData.development_examples || []).length),
      mode,
    },
  };
}

export const AUTHORING_DATA = authoringData;
