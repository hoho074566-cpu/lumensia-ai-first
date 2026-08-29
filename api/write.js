import charactersData from '../data/canon/characters/characters.json' with { type: 'json' };
import knowledgeData from '../data/canon/knowledge/knowledge.json' with { type: 'json' };
import academyData from '../data/canon/world/academy.json' with { type: 'json' };
import academicCalendarData from '../data/canon/world/academic-calendar.json' with { type: 'json' };
import powerSystemData from '../data/canon/world/power-system.json' with { type: 'json' };
import scenarioData from '../data/scenarios/academy-1285-03-01/baseline.json' with { type: 'json' };

export const config = { maxDuration: 300 };

const CHARACTERS = charactersData.characters || {};
const CHARACTER_KEYS = new Set(Object.keys(CHARACTERS));
const EXPRESSIONS = new Set([
  'default','smile','blush','serious','angry','sad','shock',
  'smug','annoyed','worried','confused','laugh','flustered',
]);
const FAMILIARITY = new Set(['stranger', 'met', 'acquaintance', 'familiar', 'close']);
const CONSEQUENCE_KINDS = new Set(['condition', 'equipment', 'world']);
const MAX_ACTION_CHARS = 12000;
const MAX_HISTORY_TURNS = 8;

const WRITER_CONTRACT = `Write the player's current experience as serialized fantasy fiction, not an RPG report.
Facts are true. Meaningful PC choices, verbatim PC speech, private thoughts, and voluntary emotions belong to the player.

Resolve the player's chosen action first. Pass quickly through movement, routine, waiting, and procedure when the result substantially converges. Slow down when the player's decisions, danger, conflict, discovery, or relationship interaction can materially change what happens. Stop at the first real point where a meaningful PC decision or immediate reaction can change the outcome. Do not invent a menu-like pseudo-choice merely to end a response.

Describe a place only as much as its details matter to what can happen next. Atmosphere may establish a scene, but do not turn ordinary movement into a facility tour. Do not repeat established appearance, geography, status, or explanation unless it has changed or now matters physically.

The Canon cast index is permission to choose plausible existing people; it is not an attendance checklist. A Canon character may naturally be present when the time, place, role, and ordinary life make that plausible. Presence alone does not require interaction. A character acts when their role, personality, interests, relationship, knowledge, or the visible situation gives them a concrete reason to act. Do not require the player to name a character first. Ask the practical story question: would this person staying passive here be less natural than acting?

Keep world activity inside what the PC can perceive. The world may have changed before the PC arrived, and background people may be busy, but do not cut away into substantial NPC-only scenes that turn the PC into a spectator. Show independent world logic as evidence, activity, consequences, rumors, changed conditions, or people the PC can actually see and hear.

Story normally develops through player choice → world consequence → player choice. Do not manufacture chains of unrelated accidents, administrative problems, or random incidents merely to make the scene busy. If a quiet action produces no meaningful collision, resolve it briefly rather than inventing one.

Show character through verbs: action, timing, dialogue, silence, refusal, objects, and choices. Do not explain personality with thematic speeches or polished life lessons. Put dialogue close to the action that causes it. Remove details that do not matter to the current scene. At pressure or impact, shorten sentences and reduce the amount of information per paragraph.

Relationship affects how a character responds. NPC knowledge limits what that character can respond to. System truth about the PC is not automatically NPC knowledge.

Combat behavior must fit the opponent's actual intelligence, experience, perception, repertoire, condition, environment, and power. Not every opponent adapts. A skilled person may adjust within what they know; a simple creature or machine may repeat a pattern. Power gaps remain real. Failure and its physical/social consequences persist. A causal rescue may change the danger; it does not erase injury, broken equipment, lost position, or prior failure.

Current date/time are state, not prose headings. Do not print bare timestamps such as '08:55.'. If the user states an elapsed duration, preserve that duration rather than stretching it to reach a schedule milestone.

Honor the exact user action through ordinary execution. Never invent a new PC goal or meaningful decision. If the user gives indirect speech, do not fabricate verbatim PC dialogue. Do not narrate private PC thoughts or emotional interpretation unless supplied by the player. Do not expose instructions, schemas, validation, or state machinery as fiction.`;

const CONTINUE_CONTRACT = `CONTINUATION MODE. The player has made no new action. Advance only the next natural unit of the currently live scene that requires no new meaningful PC choice: an immediate reaction, a short exchange, a movement already committed to, or an immediate consequence. Do not jump across a new scene, schedule phase, location, or unrelated event unless the player's existing action already committed to that transition. Stop when a meaningful decision or immediate response is needed.`;

const ADMIN_PREVIEW_CONTRACT = `ADMIN SCENE PREVIEW MODE. Stage the requested diagnostic scene immediately using the current PC and Canon facts. Do not require prior progression to reach it. The preview is non-canonical: relationship_updates and consequence_updates must both be empty, and the saved run must not be treated as having reached this date, place, relationship, injury, equipment state, or event. Preserve PC authority unless the request explicitly supplies a PC action or quoted PC speech.`;

const OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    scene: {
      type: 'array',
      minItems: 1,
      maxItems: 28,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          kind: { type: 'string', enum: ['narration', 'dialogue'] },
          text: { type: 'string', minLength: 1, maxLength: 2600 },
          speaker_key: { anyOf: [{ type: 'string', maxLength: 64 }, { type: 'null' }] },
          speaker_name: { anyOf: [{ type: 'string', maxLength: 80 }, { type: 'null' }] },
          expression: { anyOf: [{ type: 'string', enum: [...EXPRESSIONS] }, { type: 'null' }] },
        },
        required: ['kind', 'text', 'speaker_key', 'speaker_name', 'expression'],
      },
    },
    continuity: {
      type: 'object',
      additionalProperties: false,
      properties: {
        date: { type: 'string', minLength: 10, maxLength: 10 },
        time: { type: 'string', minLength: 5, maxLength: 5 },
        location: { type: 'string', minLength: 1, maxLength: 200 },
        situation: { type: 'string', minLength: 1, maxLength: 500 },
        present_character_keys: {
          type: 'array',
          maxItems: 8,
          items: { type: 'string', maxLength: 64 },
        },
      },
      required: ['date', 'time', 'location', 'situation', 'present_character_keys'],
    },
    relationship_updates: {
      type: 'array',
      maxItems: 4,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          character_key: { type: 'string', enum: [...CHARACTER_KEYS] },
          familiarity: { anyOf: [{ type: 'string', enum: [...FAMILIARITY] }, { type: 'null' }] },
          affinity_delta: { type: 'integer', minimum: -10, maximum: 10 },
          stance: { anyOf: [{ type: 'string', maxLength: 120 }, { type: 'null' }] },
          notable_context: { anyOf: [{ type: 'string', maxLength: 220 }, { type: 'null' }] },
          knowledge_gain: { anyOf: [{ type: 'string', maxLength: 220 }, { type: 'null' }] },
        },
        required: ['character_key', 'familiarity', 'affinity_delta', 'stance', 'notable_context', 'knowledge_gain'],
      },
    },
    consequence_updates: {
      type: 'array',
      maxItems: 6,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          kind: { type: 'string', enum: [...CONSEQUENCE_KINDS] },
          operation: { type: 'string', enum: ['add', 'resolve'] },
          fact: { type: 'string', minLength: 1, maxLength: 220 },
        },
        required: ['kind', 'operation', 'fact'],
      },
    },
  },
  required: ['scene', 'continuity', 'relationship_updates', 'consequence_updates'],
};

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.end(JSON.stringify(payload));
}

function cleanText(value, max = 500) {
  const text = String(value ?? '');
  return text.length > max ? text.slice(0, max) : text;
}

function safePc(raw = {}) {
  const pc = {
    name: cleanText(raw.name, 80).trim(),
    age: Number(raw.age),
    gender: cleanText(raw.gender, 40),
    department: cleanText(raw.department, 80),
    origin: cleanText(raw.origin, 180),
    socialStatus: cleanText(raw.socialStatus, 120),
    admission: cleanText(raw.admission, 160),
    appearance: cleanText(raw.appearance, 700),
    background: cleanText(raw.background, 1400),
    realm: cleanText(raw.realm, 120),
    magicCircle: raw.magicCircle == null || raw.magicCircle === '' ? null : Number(raw.magicCircle),
    talents: raw.talents && typeof raw.talents === 'object' ? raw.talents : {},
    skills: Array.isArray(raw.skills) ? raw.skills.slice(0, 24).map((x) => cleanText(x, 120)).filter(Boolean) : [],
    equipment: Array.isArray(raw.equipment) ? raw.equipment.slice(0, 24).map((x) => cleanText(x, 160)).filter(Boolean) : [],
  };
  if (!pc.name) throw new Error('PC 이름이 없습니다.');
  if (!Number.isFinite(pc.age) || pc.age < 1 || pc.age > 300) throw new Error('PC 나이가 올바르지 않습니다.');
  return pc;
}

function safeScene(raw = {}) {
  return {
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(raw.date || '')) ? String(raw.date) : scenarioData.start.date,
    time: /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(raw.time || '')) ? String(raw.time) : scenarioData.start.time,
    location: cleanText(raw.location || scenarioData.start.location, 200),
    situation: cleanText(raw.situation || scenarioData.start.situation, 500),
    presentCharacterKeys: Array.isArray(raw.presentCharacterKeys)
      ? [...new Set(raw.presentCharacterKeys.filter((key) => CHARACTER_KEYS.has(key)))].slice(0, 8)
      : [],
  };
}

function safeResidence(raw = {}) {
  const halls = Array.isArray(scenarioData?.housing?.first_year_halls) ? scenarioData.housing.first_year_halls : ['A동', 'B동', 'C동'];
  const building = halls.includes(raw?.building) ? raw.building : null;
  const room = cleanText(raw?.room || '', 20).trim() || null;
  return building && room ? { building, room } : null;
}

function safeRelationships(raw = {}) {
  const result = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;
  for (const [key, value] of Object.entries(raw)) {
    if (!CHARACTER_KEYS.has(key) || !value || typeof value !== 'object' || Array.isArray(value)) continue;
    const familiarity = FAMILIARITY.has(value.familiarity) ? value.familiarity : 'stranger';
    const affinityNumber = Number(value.affinity);
    const affinity = Number.isFinite(affinityNumber) ? Math.max(-100, Math.min(100, Math.trunc(affinityNumber))) : 0;
    const stance = cleanText(value.stance || '', 120).trim() || 'none';
    const sourceContext = Array.isArray(value.notableContext) ? value.notableContext : (Array.isArray(value.notable_context) ? value.notable_context : []);
    const sourceKnowledge = Array.isArray(value.knownFacts) ? value.knownFacts : (Array.isArray(value.known_facts) ? value.known_facts : []);
    const notableContext = sourceContext.slice(-8).map((item) => cleanText(item, 220).trim()).filter(Boolean);
    const knownFacts = sourceKnowledge.slice(-10).map((item) => cleanText(item, 220).trim()).filter(Boolean);
    result[key] = { familiarity, affinity, stance, notable_context: notableContext, known_facts: knownFacts };
  }
  return result;
}

function safeConsequences(raw = []) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const result = [];
  for (const row of raw) {
    const kind = CONSEQUENCE_KINDS.has(row?.kind) ? row.kind : null;
    const fact = cleanText(row?.fact || '', 220).trim();
    if (!kind || !fact) continue;
    const id = `${kind}:${fact}`;
    if (seen.has(id)) continue;
    seen.add(id);
    result.push({ kind, fact });
    if (result.length >= 30) break;
  }
  return result;
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

function hasEstablishedRelationship(state) {
  return Boolean(state && (
    state.familiarity !== 'stranger' || state.affinity !== 0 || state.stance !== 'none' ||
    state.notable_context?.length || state.known_facts?.length
  ));
}

function selectDetailedCharacterKeys({ action, scene, relationships }) {
  const keys = [];
  const add = (key) => {
    if (CHARACTER_KEYS.has(key) && !keys.includes(key) && keys.length < 6) keys.push(key);
  };
  exactMentionedCharacterKeys(action).forEach(add);
  scene.presentCharacterKeys.forEach(add);
  for (const [key, state] of Object.entries(relationships)) {
    if (hasEstablishedRelationship(state)) add(key);
  }
  if (!keys.length && scene.location.includes('대강당')) add('emily');
  return keys;
}

function immutableCharacterFacts(key) {
  const facts = scenarioData?.character_immutable_facts?.[key];
  return Array.isArray(facts) ? facts.slice(0, 8) : [];
}

function detailedCharacterPacket(key) {
  const row = CHARACTERS[key];
  if (!row) return null;
  return {
    key,
    name: row.name,
    immutable_facts: immutableCharacterFacts(key),
    core: row.core || {},
    voice: row.voice || {},
    current_baseline: row.baseline_1285_03_01 || {},
    refined_characterization: Array.isArray(row.refined_characterization) ? row.refined_characterization.slice(0, 4) : [],
  };
}

function thinCastIndex() {
  return Object.entries(CHARACTERS).map(([key, row]) => {
    const core = row.core || {};
    const baseline = row.baseline_1285_03_01 || {};
    return {
      key,
      name: row.name,
      current_role: {
        department: baseline.department || null,
        academy_year: baseline.academy_year || null,
        office: baseline.office || null,
        offices: Array.isArray(baseline.offices) ? baseline.offices.slice(0, 2) : [],
        admission: baseline.admission || null,
        realm: baseline.realm || null,
        circle: baseline.circle ?? null,
      },
      traits: Array.isArray(core.personality) ? core.personality.slice(0, 2) : [],
      interests: Array.isArray(core.values) ? core.values.slice(0, 2) : [],
      voice: cleanText(row?.voice?.register || '', 120) || null,
    };
  });
}

function visibleKnowledge(level = 1, detailedKeys = []) {
  const allowedLevel = Math.max(1, Math.min(5, Number(level) || 1));
  const relevant = new Set(detailedKeys);
  return (knowledgeData.facts || [])
    .filter((row) => Number(row.visibility || 99) <= allowedLevel)
    .filter((row) => !row.subject || relevant.has(row.subject) || Number(row.visibility) === 1)
    .slice(0, 32)
    .map(({ id, subject, fact, truth_status, visibility }) => ({ id, subject: subject || null, fact, truth_status, visibility }));
}

function recentContext(history = []) {
  return history.slice(-MAX_HISTORY_TURNS).map((turn) => ({
    mode: turn?.mode === 'continue' ? 'continue' : 'action',
    action: turn?.mode === 'continue' ? null : cleanText(turn?.action || '', 1800),
    continuity: turn?.continuity && typeof turn.continuity === 'object' ? {
      date: cleanText(turn.continuity.date || '', 10),
      time: cleanText(turn.continuity.time || '', 5),
      location: cleanText(turn.continuity.location || '', 200),
      situation: cleanText(turn.continuity.situation || '', 500),
      present_character_keys: Array.isArray(turn.continuity.present_character_keys)
        ? turn.continuity.present_character_keys.filter((key) => CHARACTER_KEYS.has(key)).slice(0, 8)
        : [],
    } : null,
    scene: Array.isArray(turn?.scene)
      ? turn.scene.slice(-16).map((beat) => ({
          kind: beat?.kind === 'dialogue' ? 'dialogue' : 'narration',
          speaker_key: CHARACTER_KEYS.has(beat?.speaker_key) ? beat.speaker_key : null,
          speaker_name: cleanText(beat?.speaker_name || '', 80) || null,
          text: cleanText(beat?.text || '', 1100),
        }))
      : [],
  }));
}

function relationshipFacts(relationships, detailedKeys) {
  return {
    default_for_unlisted_character: {
      familiarity: 'stranger', affinity: 0, stance: 'none', notable_context: [], npc_knows_about_pc: [],
    },
    detailed_characters: detailedKeys.map((key) => {
      const state = relationships[key] || { familiarity: 'stranger', affinity: 0, stance: 'none', notable_context: [], known_facts: [] };
      return {
        key,
        familiarity: state.familiarity,
        affinity: state.affinity,
        stance: state.stance,
        notable_context: state.notable_context,
        npc_knows_about_pc: state.known_facts,
      };
    }),
  };
}

function compactWorldPacket(pc, scene) {
  const departments = academyData?.academic_structure?.departments || {};
  const departmentStudy = pc.department && Array.isArray(departments[pc.department]) ? departments[pc.department] : [];
  const month = String(scene.date || '').slice(5, 7);
  return {
    academy: {
      institution: '루멘시아 아카데미',
      years: academyData?.academic_structure?.years || 3,
      pc_department: pc.department || null,
      pc_department_study: departmentStudy,
      current_roles: academyData?.baseline_1285_03_01 || {},
    },
    calendar: {
      system: academicCalendarData.system || {},
      current_month_pattern: academicCalendarData?.annual_pattern?.[month] || [],
      outside_mission_rule: academicCalendarData.outside_mission_rule || '',
    },
    power: {
      combat_outcome: powerSystemData?.principles?.combat_outcome || '',
      martial_realms: Array.isArray(powerSystemData?.martial_realms)
        ? powerSystemData.martial_realms.map(({ label, meaning }) => ({ label, meaning }))
        : [],
      magic_circles: powerSystemData?.magic_circles || {},
    },
  };
}

function hardFactsPacket(pc, residence, scene, relationships, consequences, detailedKeys) {
  return {
    pc,
    pc_residence: residence,
    current_scene: scene,
    persistent_consequences: consequences,
    relationship_and_npc_knowledge: relationshipFacts(relationships, detailedKeys),
    character_immutable_facts: scenarioData.character_immutable_facts || {},
    opening_scenario_facts_not_a_story_checklist: {
      scenario_id: scenarioData.scenario_id,
      academic_period: scenarioData.academic_period,
      dated_world_facts: scenarioData.dated_world_facts,
      housing: scenarioData.housing || {},
    },
  };
}

function buildInput({ action, mode, adminPreview, pc, residence, scene, history, knowledgeLevel, relationships, consequences }) {
  const detailedKeys = selectDetailedCharacterKeys({ action, scene, relationships });
  const facts = hardFactsPacket(pc, residence, scene, relationships, consequences, detailedKeys);
  const material = {
    canon_cast_index_thin_not_a_checklist: thinCastIndex(),
    detailed_characters_for_existing_or_established_contacts: detailedKeys.map(detailedCharacterPacket).filter(Boolean),
    visible_world_knowledge: visibleKnowledge(knowledgeLevel, detailedKeys),
    world: compactWorldPacket(pc, scene),
    recent_context: recentContext(history),
  };

  const base = `HARD FACTS — authoritative\n${JSON.stringify(facts)}\n\nSTORY MATERIAL — available context, not a checklist\n${JSON.stringify(material)}`;
  if (adminPreview) return `${base}\n\n${ADMIN_PREVIEW_CONTRACT}\n\nADMIN REQUEST\n${action}`;
  if (mode === 'continue') return `${base}\n\n${CONTINUE_CONTRACT}`;
  return `${base}\n\nEXACT USER ACTION\n${action}`;
}

function extractOutputText(response) {
  if (typeof response?.output_text === 'string' && response.output_text) return response.output_text;
  for (const item of response?.output || []) {
    if (item?.type !== 'message') continue;
    for (const content of item?.content || []) {
      if (content?.type === 'output_text' && typeof content.text === 'string') return content.text;
      if (content?.type === 'refusal') throw new Error(content.refusal || '모델이 응답을 거부했습니다.');
    }
  }
  return '';
}

function validateTurn(turn, pc, fallbackScene, adminPreview) {
  if (!turn || typeof turn !== 'object' || !Array.isArray(turn.scene) || !turn.scene.length) {
    throw new Error('Writer가 유효한 scene을 반환하지 않았습니다.');
  }

  const scene = turn.scene.slice(0, 28).map((beat) => {
    const kind = beat?.kind === 'dialogue' ? 'dialogue' : 'narration';
    const text = cleanText(beat?.text, 2600).trim();
    if (!text) throw new Error('빈 scene beat가 반환되었습니다.');
    if (kind === 'dialogue') {
      const registeredKey = CHARACTER_KEYS.has(beat?.speaker_key) ? beat.speaker_key : null;
      const speakerName = cleanText(beat?.speaker_name || '', 80).trim() || null;
      if (!registeredKey && !speakerName) throw new Error('dialogue에는 등록 speaker_key 또는 표시용 speaker_name이 필요합니다.');
      if (!registeredKey && speakerName === pc.name) throw new Error('Writer가 PC의 발화문을 대신 작성했습니다.');
      return {
        kind,
        text,
        speaker_key: registeredKey,
        speaker_name: registeredKey ? null : speakerName,
        expression: registeredKey && EXPRESSIONS.has(beat?.expression) ? beat.expression : (registeredKey ? 'default' : null),
      };
    }
    return { kind, text, speaker_key: null, speaker_name: null, expression: null };
  });

  if (pc.name !== 'Aaa' && scene.some((beat) => /\bAaa\b/.test(beat.text))) {
    throw new Error('Writer가 PC 이름 대신 legacy placeholder Aaa를 사용했습니다.');
  }

  const raw = turn.continuity || {};
  const continuity = {
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(raw.date || '')) ? String(raw.date) : fallbackScene.date,
    time: /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(raw.time || '')) ? String(raw.time) : fallbackScene.time,
    location: cleanText(raw.location || fallbackScene.location, 200),
    situation: cleanText(raw.situation || fallbackScene.situation, 500),
    present_character_keys: Array.isArray(raw.present_character_keys)
      ? [...new Set(raw.present_character_keys.filter((key) => CHARACTER_KEYS.has(key)))].slice(0, 8)
      : [],
  };

  if (adminPreview) return { scene, continuity, relationship_updates: [], consequence_updates: [] };

  const relationshipUpdates = Array.isArray(turn.relationship_updates)
    ? turn.relationship_updates.slice(0, 4).map((update) => ({
        character_key: CHARACTER_KEYS.has(update?.character_key) ? update.character_key : null,
        familiarity: FAMILIARITY.has(update?.familiarity) ? update.familiarity : null,
        affinity_delta: Math.max(-10, Math.min(10, Math.trunc(Number(update?.affinity_delta) || 0))),
        stance: cleanText(update?.stance || '', 120).trim() || null,
        notable_context: cleanText(update?.notable_context || '', 220).trim() || null,
        knowledge_gain: cleanText(update?.knowledge_gain || '', 220).trim() || null,
      })).filter((update) => update.character_key)
    : [];

  const consequenceUpdates = Array.isArray(turn.consequence_updates)
    ? turn.consequence_updates.slice(0, 6).map((update) => ({
        kind: CONSEQUENCE_KINDS.has(update?.kind) ? update.kind : null,
        operation: update?.operation === 'resolve' ? 'resolve' : 'add',
        fact: cleanText(update?.fact || '', 220).trim(),
      })).filter((update) => update.kind && update.fact)
    : [];

  return { scene, continuity, relationship_updates: relationshipUpdates, consequence_updates: consequenceUpdates };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST만 지원합니다.' });
  if (!process.env.OPENAI_API_KEY) return json(res, 503, { error: 'OPENAI_API_KEY가 설정되지 않았습니다.', code: 'NO_API_KEY' });

  const requiredToken = process.env.LUMENSIA_ACCESS_TOKEN;
  if (requiredToken && req.headers['x-lumensia-token'] !== requiredToken) {
    return json(res, 401, { error: '접속 토큰이 없거나 올바르지 않습니다.', code: 'BAD_ACCESS_TOKEN' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const mode = body.mode === 'continue' ? 'continue' : 'action';
    const adminPreview = body.adminScenePreview === true;
    const action = typeof body.action === 'string' ? body.action : '';
    if (mode !== 'continue' && !action.trim()) return json(res, 400, { error: '행동 입력이 비어 있습니다.' });
    if (action.length > MAX_ACTION_CHARS) return json(res, 400, { error: `한 번의 입력은 ${MAX_ACTION_CHARS.toLocaleString()}자 이하로 입력해 주세요.` });

    const runState = body.runState && typeof body.runState === 'object' ? body.runState : {};
    const pc = safePc(runState.pc || {});
    const residence = safeResidence(runState.residence || {});
    const scene = safeScene(runState.scene || {});
    const history = Array.isArray(runState.history) ? runState.history.slice(-MAX_HISTORY_TURNS) : [];
    const knowledgeLevel = Math.max(1, Math.min(5, Number(runState.knowledgeLevel) || 1));
    const relationships = safeRelationships(runState.relationships || {});
    const consequences = safeConsequences(runState.consequences || []);

    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-terra',
        store: false,
        instructions: WRITER_CONTRACT,
        input: buildInput({ action, mode, adminPreview, pc, residence, scene, history, knowledgeLevel, relationships, consequences }),
        reasoning: { effort: 'medium' },
        max_output_tokens: 5600,
        text: {
          format: {
            type: 'json_schema',
            name: 'lumensia_v0_scene',
            strict: true,
            schema: OUTPUT_SCHEMA,
          },
        },
      }),
      signal: AbortSignal.timeout(120_000),
    });

    const raw = await apiResponse.text();
    let response;
    try { response = raw ? JSON.parse(raw) : {}; }
    catch { throw new Error(`OpenAI가 JSON이 아닌 응답을 반환했습니다. HTTP ${apiResponse.status}`); }

    if (!apiResponse.ok) {
      const message = response?.error?.message || `OpenAI 요청 실패: HTTP ${apiResponse.status}`;
      const error = new Error(message);
      error.status = apiResponse.status;
      throw error;
    }

    const outputText = extractOutputText(response);
    if (!outputText) throw new Error('Writer 응답 본문이 비어 있습니다.');

    let parsed;
    try { parsed = JSON.parse(outputText); }
    catch { throw new Error('Writer structured output을 JSON으로 해석하지 못했습니다.'); }

    const turn = validateTurn(parsed, pc, scene, adminPreview);
    return json(res, 200, {
      turn,
      mode,
      admin_preview: adminPreview,
      model: response?.model || process.env.OPENAI_MODEL || 'gpt-5.6-terra',
      request_id: response?.id || null,
      usage: response?.usage || null,
    });
  } catch (error) {
    const timeout = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    const status = timeout ? 504 : (Number.isInteger(error?.status) ? error.status : 500);
    return json(res, status, {
      error: timeout ? 'Writer 응답 시간이 초과되었습니다. 게임 상태는 변경되지 않았습니다.' : (error?.message || 'Writer 요청 중 오류가 발생했습니다.'),
      code: timeout ? 'WRITER_TIMEOUT' : 'WRITER_ERROR',
    });
  }
}
