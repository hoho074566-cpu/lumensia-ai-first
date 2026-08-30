import charactersData from '../../data/canon/characters/characters.json' with { type: 'json' };
import presentationData from '../../data/canon/characters/presentation.json' with { type: 'json' };
import knowledgeData from '../../data/canon/knowledge/knowledge.json' with { type: 'json' };
import academyData from '../../data/canon/world/academy.json' with { type: 'json' };
import geographyData from '../../data/canon/world/geography.json' with { type: 'json' };
import societyData from '../../data/canon/world/society.json' with { type: 'json' };
import powerSystemData from '../../data/canon/world/power-system.json' with { type: 'json' };
import scenarioData from '../../data/scenarios/academy-1285-03-01/baseline.json' with { type: 'json' };
import characterStateData from '../../data/scenarios/academy-1285-03-01/character-state.json' with { type: 'json' };
import relationshipsData from '../../data/scenarios/academy-1285-03-01/relationships.json' with { type: 'json' };
import groupAttitudesData from '../../data/scenarios/academy-1285-03-01/group-attitudes.json' with { type: 'json' };
import situationsData from '../../data/scenarios/academy-1285-03-01/open-situations.json' with { type: 'json' };

const CHARACTERS = charactersData.characters || {};
const PRESENTATION = presentationData.characters || {};
const CHARACTER_STATE = characterStateData.characters || {};
const RELATIONSHIPS = relationshipsData.relationships || [];
const GROUP_ATTITUDES = groupAttitudesData.attitudes || [];
const CHARACTER_KEYS = new Set(Object.keys(CHARACTERS));
const ACADEMY_PRESENCE = new Set(['academy_student', 'academy_faculty', 'academy_guest']);

const LOCATION_FACILITY_ALIASES = Object.freeze({
  knight: ['기사과', '기사동', '훈련장', '훈련동', '연무장', '대련장'],
  magic: ['마법과', '마법동', '마법 실습', '마법실습'],
  theology: ['신학부', '예배당', '성당', '신성력'],
  library: ['도서관', '대도서관', '서고', '열람실'],
  dorms: ['기숙사', '생활동', 'A동', 'B동', 'C동'],
  student_area: ['학생식당', '식당', '카페', '학생회관', '상점가'],
  student_council: ['학생회실', '학생회'],
  medical: ['의료실', '치료실', '치유의 샘'],
  duel_hall: ['결투의 전당', '공식 결투', '승급심사'],
});

const KNOWLEDGE_TOPIC_ALIASES = Object.freeze({
  imperial_succession: ['황위', '계승', '후계자', '아나스타샤', '이사벨'],
  celestial_four: ['천상사강'],
  demon_cult: ['마신교'],
  demon_cult_high_command: ['사도', '대죄주교'],
  lily_lumina: ['릴리', '신성력'],
  ridel: ['리델'],
  black_grail: ['검은 성배'],
});

const SOCIETY_TOPIC_ALIASES = Object.freeze({
  status_and_law: ['법', '재판', '범죄', '보안국', '귀족재판', '금서', '마신교'],
  adventurer_guild: ['길드', '의뢰', '모험가'],
  noble_culture: ['귀족', '작위', '황족', '예법', '결혼'],
  economy: ['금화', '은화', '동화', '가격', '비용', '돈'],
  medicine_and_death: ['치료', '의료', '부상', '죽음', '부활'],
  religion: ['도미너스', '교회', '성녀', '릴리', '마신교'],
});

const OPEN_SITUATION_ALIASES = Object.freeze({
  gray_wolf_forest: ['회색 늑대', '트윈헤드 울프'],
  silent_expansion: ['어비스 영향권', '동부 어비스', '마기 농도'],
  prima_glacie_missing_team: ['프리마 글라시에', '연구팀 실종'],
  orpheum_disappearances: ['오르페룸', '상인 실종'],
});

const SCHEDULE_QUERY_WORDS = ['시간', '일정', '언제', '오리엔테이션', '오티', '입학식', '집결', '정오'];

function cleanText(value, max = 500) {
  const text = String(value ?? '');
  return text.length > max ? text.slice(0, max) : text;
}

function includesAny(text, words = []) {
  const value = String(text || '');
  return words.some((word) => word && value.includes(word));
}

function exactMentionedCharacterKeys(action = '') {
  const found = [];
  const lowered = action.toLowerCase();
  for (const [key, character] of Object.entries(CHARACTERS)) {
    const name = String(character?.name || '');
    if (lowered.includes(key.toLowerCase()) || (name && action.includes(name))) found.push(key);
  }
  return found;
}

function recentSpeakerKeys(history = []) {
  const keys = [];
  for (const turn of history.slice(-4)) {
    for (const beat of turn?.scene || []) {
      if (beat?.kind === 'dialogue' && CHARACTER_KEYS.has(beat.speaker_key) && !keys.includes(beat.speaker_key)) keys.push(beat.speaker_key);
    }
  }
  return keys;
}

export function relevantCharacterKeys({ action = '', scene = {}, history = [], limit = 4 } = {}) {
  const keys = [];
  const add = (key) => {
    if (CHARACTER_KEYS.has(key) && !keys.includes(key) && keys.length < limit) keys.push(key);
  };
  exactMentionedCharacterKeys(action).forEach(add);
  (scene.presentCharacterKeys || []).forEach(add);
  recentSpeakerKeys(history).forEach(add);
  if (!keys.length && String(scene.location || '').includes('대강당')) add('emily');
  return keys;
}

function relationshipHintsFor(key) {
  return RELATIONSHIPS
    .filter((row) => row.from === key || row.to === key)
    .slice(0, 8)
    .map((row) => ({ from: row.from, to: row.to, stance: row.stance || [], context: row.context || '' }));
}

function groupAttitudesFor(key) {
  return GROUP_ATTITUDES
    .filter((row) => row.from === key)
    .slice(0, 4)
    .map((row) => ({ toward_group: row.toward_group, stance: row.stance || [], context: row.context || '' }));
}

function coreForPortrayal(core = {}) {
  return {
    identity: Array.isArray(core.identity) ? core.identity.slice(0, 3) : [],
    background: Array.isArray(core.background) ? core.background.slice(0, 3) : [],
    personality: Array.isArray(core.personality) ? core.personality.slice(0, 5) : [],
    aspiration: cleanText(core.aspiration || '', 260) || null,
    combat_identity: cleanText(core.combat_identity || '', 320) || null,
    specialty: cleanText(core.specialty || '', 260) || null,
    capabilities: Array.isArray(core.capabilities) ? core.capabilities.slice(0, 6) : [],
    strengths: Array.isArray(core.strengths) ? core.strengths.slice(0, 5) : [],
    limitations: Array.isArray(core.limitations) ? core.limitations.slice(0, 5) : [],
    interests: Array.isArray(core.interests) ? core.interests.slice(0, 5) : [],
    activities: Array.isArray(core.activities) ? core.activities.slice(0, 5) : [],
    signature_equipment: Array.isArray(core.signature_equipment) ? core.signature_equipment.slice(0, 5) : [],
  };
}

export function academyCastIndex() {
  return Object.entries(CHARACTER_STATE)
    .filter(([, state]) => ACADEMY_PRESENCE.has(state?.presence))
    .filter(([key]) => CHARACTER_KEYS.has(key))
    .map(([key, state]) => {
      const row = CHARACTERS[key] || {};
      const core = row.core || {};
      return {
        key,
        name: row.name,
        current_state: state,
        presentation: PRESENTATION[key] || null,
        identity: Array.isArray(core.identity) ? core.identity.slice(0, 2) : [],
        personality_signals: Array.isArray(core.personality) ? core.personality.slice(0, 2) : [],
        aspiration: cleanText(core.aspiration || '', 180) || null,
        interests: Array.isArray(core.interests) ? core.interests.slice(0, 3) : [],
        activity_or_combat_signal: cleanText(core.combat_identity || core.specialty || '', 220) || null,
        voice_register: cleanText(row?.voice?.register || '', 160) || null,
        relationship_hints: relationshipHintsFor(key)
          .filter((rel) => ACADEMY_PRESENCE.has(CHARACTER_STATE[rel.from]?.presence) && ACADEMY_PRESENCE.has(CHARACTER_STATE[rel.to]?.presence))
          .slice(0, 3)
          .map(({ from, to, stance }) => ({ from, to, stance })),
        epistemic_boundary: 'Thin cast fields are system portrayal and continuity facts. They are not automatically PC knowledge, NPC-to-NPC knowledge, or facts that must be narrated; PC-facing facts are supplied separately through pc_visible_knowledge.',
      };
    });
}

function selectedKnowledgeSubjects(action, relevantKeys) {
  const subjects = new Set(relevantKeys);
  for (const [subject, aliases] of Object.entries(KNOWLEDGE_TOPIC_ALIASES)) {
    if (includesAny(action, aliases)) subjects.add(subject);
  }
  return subjects;
}

export function visibleRelevantKnowledge({ action = '', relevantKeys = [], knowledgeLevel = 1 } = {}) {
  const allowedLevel = Math.max(1, Math.min(5, Number(knowledgeLevel) || 1));
  const subjects = selectedKnowledgeSubjects(action, relevantKeys);
  if (!subjects.size) return [];
  return (knowledgeData.facts || [])
    .filter((row) => Number(row.visibility || 99) <= allowedLevel)
    .filter((row) => row.subject && subjects.has(row.subject))
    .slice(0, 16)
    .map(({ id, subject, fact, truth_status, visibility, public: isPublic }) => ({
      id, subject, fact, truth_status, visibility, public: Boolean(isPublic),
    }));
}

export function detailedCharacterPackets({ keys = [], action = '', knowledgeLevel = 1 } = {}) {
  const visibleKnowledge = visibleRelevantKnowledge({ action, relevantKeys: keys, knowledgeLevel });
  return keys.map((key) => {
    const row = CHARACTERS[key];
    if (!row) return null;
    return {
      key,
      name: row.name,
      portrayal_core: coreForPortrayal(row.core || {}),
      voice: row.voice || {},
      refined_characterization: Array.isArray(row.refined_characterization) ? row.refined_characterization.slice(0, 4) : [],
      current_state: CHARACTER_STATE[key] || {},
      presentation: PRESENTATION[key] || null,
      dated_relationships: relationshipHintsFor(key),
      group_attitudes: groupAttitudesFor(key),
      pc_visible_knowledge: visibleKnowledge.filter((fact) => fact.subject === key),
      epistemic_boundary: 'Portrayal/core truth helps portray the character but is not automatically PC knowledge, NPC-to-NPC knowledge, or something that must be narrated. pc_visible_knowledge is the supplied PC-facing knowledge layer.',
    };
  }).filter(Boolean);
}

function academyLocationContext(scene = {}, action = '') {
  const text = `${scene.location || ''}\n${action || ''}`;
  const facilities = geographyData?.academy_layout?.facilities || {};
  const selectedFacilities = {};
  for (const [facilityKey, aliases] of Object.entries(LOCATION_FACILITY_ALIASES)) {
    if (includesAny(text, aliases) && facilities[facilityKey]) selectedFacilities[facilityKey] = facilities[facilityKey];
  }
  return {
    scale: geographyData?.academy_layout?.scale || null,
    axis: geographyData?.academy_layout?.axis || null,
    zones: geographyData?.academy_layout?.zones || {},
    relevant_facilities: selectedFacilities,
  };
}

function timeToMinutes(value) {
  const match = String(value || '').match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function relevantScheduleFacts(scene = {}, action = '') {
  const current = timeToMinutes(scene.time);
  const explicitScheduleQuery = includesAny(action, SCHEDULE_QUERY_WORDS);
  return (scenarioData.dated_world_facts || []).filter((row) => {
    if (explicitScheduleQuery) return true;
    const eventTime = timeToMinutes(row.time);
    if (current == null || eventTime == null) return false;
    const delta = eventTime - current;
    return delta >= 0 && delta <= 45;
  }).map((row) => ({
    time: row.time,
    fact: row.fact,
    semantic: 'scheduled fact only; the clock value does not itself create a bell, announcement, scene beat, or waiting prose',
  }));
}

function relevantSociety(action = '') {
  const selected = {};
  for (const [section, aliases] of Object.entries(SOCIETY_TOPIC_ALIASES)) {
    if (includesAny(action, aliases) && societyData[section]) selected[section] = societyData[section];
    if (includesAny(action, aliases) && societyData.status_and_law?.[section]) selected[section] = societyData.status_and_law[section];
  }
  return selected;
}

export function relevantOpenSituations(action = '', knowledgeLevel = 1) {
  const allowedLevel = Math.max(1, Math.min(5, Number(knowledgeLevel) || 1));
  return (situationsData.situations || [])
    .filter((row) => Number(row.visibility || 99) <= allowedLevel)
    .filter((row) => includesAny(action, OPEN_SITUATION_ALIASES[row.id] || []))
    .map(({ id, horizon, fact, fixed }) => ({ id, horizon, fact, fixed }));
}

export function buildCanonContext({ action = '', pc = {}, scene = {}, history = [], knowledgeLevel = 1 } = {}) {
  const relevantKeys = relevantCharacterKeys({ action, scene, history });
  const selectedKnowledge = visibleRelevantKnowledge({ action, relevantKeys, knowledgeLevel });
  const departments = academyData?.academic_structure?.departments || {};
  return {
    relevant_character_keys: relevantKeys,
    relevant_characters: detailedCharacterPackets({ keys: relevantKeys, action, knowledgeLevel }),
    academy_cast_index: academyCastIndex(),
    academy: {
      institution: academyData.institution,
      years: academyData?.academic_structure?.years || null,
      pc_department: pc.department || null,
      pc_department_study: pc.department && Array.isArray(departments[pc.department]) ? departments[pc.department] : [],
      housing: scenarioData.housing || {},
      current_institution_state: scenarioData.institution_state || {},
      location_context: academyLocationContext(scene, action),
    },
    schedule: relevantScheduleFacts(scene, action),
    society: relevantSociety(action),
    power: {
      principles: powerSystemData.principles || {},
      martial_realms: powerSystemData.martial_realms || [],
      magic_circles: powerSystemData.magic_circles || {},
      trait_authority: powerSystemData.trait_authority || {},
    },
    pc_visible_knowledge: selectedKnowledge,
    relevant_open_situations: relevantOpenSituations(action, knowledgeLevel),
    retrieval_semantics: {
      canon_exists_but_not_selected: 'A fact omitted from this packet is not false; it is simply not currently selected for this turn.',
      know_not_mention: 'Receiving a fact does not require mentioning it in prose.',
      state_not_story_beat: 'State and schedules constrain continuity but do not prescribe a scene beat.',
      system_truth_not_knowledge: 'Character core, dated state, presentation, and relationship facts are system facts for portrayal and continuity; they do not automatically become PC or NPC knowledge. PC-facing facts are supplied separately through pc_visible_knowledge.',
    },
  };
}

export const ACADEMY_CAST_KEYS = Object.freeze(academyCastIndex().map((row) => row.key));