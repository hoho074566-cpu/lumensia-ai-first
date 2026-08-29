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
const MAX_ACTION_CHARS = 12000;
const MAX_HISTORY_TURNS = 8;
const EVERYDAY_ACADEMY_CAST = new Set([
  'anastasia','isabel','lucia','elena','artemis','sera','sia','lillia',
  'lena','emily','laris','mirabelle','serena','chloe','aria','elise',
]);

const WRITER_CONTRACT = `Write the next scene as Korean serialized fantasy fiction, not an RPG report.
Facts are true. The PC's meaningful choices, verbatim speech, private thoughts, and voluntary emotions belong to the player.

Resolve the exact user action first. Before spending substantial prose on independent background activity, let that action reach a concrete consequence, contact, discovery, obstacle, opportunity, or scene landing worth responding to. If nothing naturally changes, be brief; do not manufacture a side incident just to prove the world is active.

Move quickly through anything that does not change the PC's immediate situation. When a person or the world does react, stay with that interaction through its next meaningful change, then stop when a real PC decision is needed. Distinct scheduled phases remain distinct; do not turn one scene into the whole day.

NPCs act when the present situation gives them a character-specific reason. If curiosity, duty, rivalry, fear, need, or a personal goal intersects what the PC visibly does or what that NPC actually knows, let the NPC do something concrete: approach, ask, challenge, interrupt, refuse, invite, warn, test, help, leave, or change course. Do not reduce that to watching from the background. NPC-to-NPC activity may exist, but do not let it become the main scene while the PC is merely a camera unless the user explicitly chose to observe and nobody has a reason to involve them.

Keep background life brief and purposeful. A few concrete details can establish that a place is inhabited; then follow whatever actually changes the PC's situation. Do not chain unrelated accidents, administrative problems, or random incidents as a substitute for story.

Keep connective prose lean. When something lands, surprises, threatens, or changes tactics, shorten the rhythm. Let dialogue arrive quickly. Expand only where physical action, character reaction, relationship, mystery, or consequence changes. Characters reveal themselves by what they do, notice, avoid, interrupt, risk, or say in the moment; do not make them explain the theme of the scene in polished speeches.

Do not print bare clock-state sentences such as '08:55.' or '09:15.'. Time belongs in continuity state. If time matters in prose, express it through an in-world cue or remaining time. If the user states an explicit elapsed duration, preserve it exactly instead of stretching or shrinking it to meet a schedule.

System PC facts are not automatically NPC knowledge. npc_knows_about_pc is established personal knowledge; visible current-scene facts may be noticed normally. Familiarity is contact history, not automatic friendship or companionship. Relationship changes must be small and evidence-based.

Prefer plausible existing Canon Named NPCs for personal or potentially recurring roles. Unnamed people may fill crowds, staff, passersby, and short one-off functions, but do not invent a new named roommate, companion, rival, or recurring partner when a plausible Canon character already fills that kind of role.

Combat is physical and adaptive. Opponents react to what they actually see; distance, terrain, fatigue, injury, equipment, damage, and relative power change what is possible. Skill does not erase a real power gap. Failure changes the next story state; earned injury, damaged or lost equipment, witnesses, reputation, and institutional consequences persist.

Honor the exact user action through ordinary execution. Never invent a new PC goal or decision. When the user gives an indirect speech act, do not compose verbatim PC dialogue. Do not narrate private PC thoughts or emotional interpretation unless the player supplied them.`;

const STYLE_RHYTHM_SAMPLE = `RHYTHM SAMPLE — non-canon. Copy only pacing principles, never wording, people, objects, or events.

비가 막 그친 회랑은 조용했다.
챙.
모퉁이에서 금속이 한 번 울렸다.

벽에 기대 있던 학생이 떨어진 버클을 주워 들었다. 그러다 지나가던 사람의 손에 들린 낡은 장갑을 보고 시선이 멈췄다.

"그거, 직접 고친 거야?"

대답을 기다리며 길을 막지는 않았다. 버클을 손가락 사이에서 한 번 굴렸다.

"바느질은 엉망인데 안 풀리겠네."

짧게 웃었다.

"누가 가르쳤어?"

배경 설명은 여기서 끝난다. 이제 관심이 생긴 두 사람의 현재 장면을 따라간다.`;

const CONTINUE_CONTRACT = `CONTINUATION MODE. The player made no new action. Continue only the already-live scene through immediate reaction, dialogue, movement, or consequence that needs no new meaningful PC choice. Do not start a fresh unrelated incident merely to continue. If the scene has landed, end briefly.`;

const ADMIN_PREVIEW_CONTRACT = `ADMIN SCENE PREVIEW MODE. Stage the requested diagnostic scene immediately using the current PC and Canon facts. Skip prior progression. The preview is non-canonical: return relationship_updates as an empty array and do not imply the saved run actually reached this date, place, relationship, or event. Preserve PC authority unless the request explicitly supplies PC action or quoted PC speech.`;

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
        },
        required: ['character_key', 'familiarity', 'affinity_delta', 'stance', 'notable_context'],
      },
    },
  },
  required: ['scene', 'continuity', 'relationship_updates'],
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
  const halls = Array.isArray(scenarioData?.housing?.first_year_halls)
    ? scenarioData.housing.first_year_halls
    : ['A동', 'B동', 'C동'];
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
    const affinity = Number.isFinite(affinityNumber)
      ? Math.max(-100, Math.min(100, Math.trunc(affinityNumber)))
      : 0;
    const stance = cleanText(value.stance || '', 120).trim() || 'none';
    const sourceContext = Array.isArray(value.notableContext)
      ? value.notableContext
      : (Array.isArray(value.notable_context) ? value.notable_context : []);
    const notableContext = sourceContext.slice(-8).map((item) => cleanText(item, 220).trim()).filter(Boolean);
    result[key] = { familiarity, affinity, stance, notable_context: notableContext };
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

function selectRelevantCharacters({ action, scene }) {
  const keys = [];
  const add = (key) => {
    if (CHARACTER_KEYS.has(key) && !keys.includes(key) && keys.length < 3) keys.push(key);
  };
  exactMentionedCharacterKeys(action).forEach(add);
  scene.presentCharacterKeys.forEach(add);
  if (!keys.length && scene.location.includes('대강당')) add('emily');
  return keys;
}

function immutableCharacterFacts(key) {
  const facts = scenarioData?.character_immutable_facts?.[key];
  return Array.isArray(facts) ? facts.slice(0, 8) : [];
}

function compactCharacterPacket(key) {
  const row = CHARACTERS[key];
  if (!row) return null;
  return {
    key,
    name: row.name,
    immutable_facts: immutableCharacterFacts(key),
    core: row.core || {},
    voice: row.voice || {},
    baseline: row.baseline_1285_03_01 || {},
    refined_characterization: Array.isArray(row.refined_characterization)
      ? row.refined_characterization.slice(0, 2)
      : [],
  };
}

function castIndex() {
  return Object.entries(CHARACTERS)
    .filter(([key]) => EVERYDAY_ACADEMY_CAST.has(key))
    .map(([key, row]) => {
      const core = row.core || {};
      return {
        key,
        name: row.name,
        identity: Array.isArray(core.identity) ? core.identity.slice(0, 2) : [],
        personality_signal: Array.isArray(core.personality) ? core.personality.slice(0, 2) : [],
        specialty: cleanText(core.combat_identity || core.aspiration || '', 180) || null,
        baseline: row.baseline_1285_03_01 || {},
      };
    });
}

function visibleKnowledge(level = 1, relevantKeys = []) {
  const allowedLevel = Math.max(1, Math.min(5, Number(level) || 1));
  const relevant = new Set(relevantKeys);
  return (knowledgeData.facts || [])
    .filter((row) => Number(row.visibility || 99) <= allowedLevel)
    .filter((row) => !row.subject || relevant.size === 0 || relevant.has(row.subject) || Number(row.visibility) === 1)
    .slice(0, 32)
    .map(({ id, subject, fact, truth_status, visibility }) => ({
      id, subject: subject || null, fact, truth_status, visibility,
    }));
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
          text: cleanText(beat?.text || '', 1000),
        }))
      : [],
  }));
}

function relationshipFacts(pc, relationships, relevantKeys) {
  return {
    pc_social_status: pc.socialStatus || '미지정',
    default_for_unlisted_character: {
      familiarity: 'stranger',
      affinity: 0,
      stance: 'none',
      notable_context: [],
      npc_knows_about_pc: [],
    },
    relevant_characters: relevantKeys.map((key) => {
      const state = relationships[key] || {
        familiarity: 'stranger',
        affinity: 0,
        stance: 'none',
        notable_context: [],
      };
      return {
        key,
        ...state,
        npc_knows_about_pc: state.notable_context,
      };
    }),
  };
}

function compactWorldPacket(pc) {
  const departments = academyData?.academic_structure?.departments || {};
  return {
    academy: {
      institution: '루멘시아 아카데미',
      years: academyData?.academic_structure?.years || 3,
      pc_department: pc.department || null,
      pc_department_study: pc.department && Array.isArray(departments[pc.department])
        ? departments[pc.department]
        : [],
      current_roles: academyData?.baseline_1285_03_01 || {},
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

function hardFactsPacket(pc, residence, scene, relationships, relevantKeys) {
  return {
    pc,
    pc_residence: residence,
    current_scene: scene,
    relationship_context: relationshipFacts(pc, relationships, relevantKeys),
    character_immutable_facts: scenarioData.character_immutable_facts || {},
    scenario: {
      scenario_id: scenarioData.scenario_id,
      opening_baseline_period: scenarioData.academic_period,
      opening_day_dated_world_facts: scenarioData.dated_world_facts,
      housing: scenarioData.housing || {},
      academic_calendar: {
        system: academicCalendarData.system || {},
        annual_pattern: academicCalendarData.annual_pattern || {},
        outside_mission_rule: academicCalendarData.outside_mission_rule || '',
      },
    },
  };
}

function buildInput({ action, mode, adminPreview, pc, residence, scene, history, knowledgeLevel, relationships }) {
  const relevantKeys = selectRelevantCharacters({ action, scene });
  const storyMaterial = {
    relevant_characters: relevantKeys.map(compactCharacterPacket).filter(Boolean),
    cast_index: castIndex(),
    world: compactWorldPacket(pc),
    visible_knowledge: visibleKnowledge(knowledgeLevel, relevantKeys),
    recent_context: recentContext(history),
  };

  const facts = `HARD FACTS — authoritative\n${JSON.stringify(
    hardFactsPacket(pc, residence, scene, relationships, relevantKeys),
  )}`;
  const material = `STORY MATERIAL — optional material, not a checklist\n${JSON.stringify(storyMaterial)}`;
  const rhythm = STYLE_RHYTHM_SAMPLE;

  if (adminPreview) {
    return `${facts}\n\n${material}\n\n${rhythm}\n\n${ADMIN_PREVIEW_CONTRACT}\n\nADMIN REQUEST\n${action}`;
  }
  if (mode === 'continue') {
    return `${facts}\n\n${material}\n\n${rhythm}\n\n${CONTINUE_CONTRACT}`;
  }
  return `${facts}\n\n${material}\n\n${rhythm}\n\nEXACT USER ACTION\n${action}`;
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
      if (!registeredKey && !speakerName) {
        throw new Error('dialogue에는 등록 speaker_key 또는 표시용 speaker_name이 필요합니다.');
      }
      if (!registeredKey && speakerName === pc.name) {
        throw new Error('Writer가 PC의 발화문을 대신 작성했습니다.');
      }
      return {
        kind,
        text,
        speaker_key: registeredKey,
        speaker_name: registeredKey ? null : speakerName,
        expression: registeredKey && EXPRESSIONS.has(beat?.expression)
          ? beat.expression
          : (registeredKey ? 'default' : null),
      };
    }
    return { kind, text, speaker_key: null, speaker_name: null, expression: null };
  });

  if (pc.name !== 'Aaa' && scene.some((beat) => /\bAaa\b/.test(beat.text))) {
    throw new Error('Writer가 PC 이름 대신 legacy placeholder Aaa를 사용했습니다.');
  }

  const raw = turn.continuity || {};
  const continuity = {
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(raw.date || ''))
      ? String(raw.date)
      : fallbackScene.date,
    time: /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(raw.time || ''))
      ? String(raw.time)
      : fallbackScene.time,
    location: cleanText(raw.location || fallbackScene.location, 200),
    situation: cleanText(raw.situation || fallbackScene.situation, 500),
    present_character_keys: Array.isArray(raw.present_character_keys)
      ? [...new Set(raw.present_character_keys.filter((key) => CHARACTER_KEYS.has(key)))].slice(0, 8)
      : [],
  };

  const relationshipUpdates = adminPreview
    ? []
    : (Array.isArray(turn.relationship_updates)
        ? turn.relationship_updates.slice(0, 4).map((update) => ({
            character_key: CHARACTER_KEYS.has(update?.character_key) ? update.character_key : null,
            familiarity: FAMILIARITY.has(update?.familiarity) ? update.familiarity : null,
            affinity_delta: Math.max(-10, Math.min(10, Math.trunc(Number(update?.affinity_delta) || 0))),
            stance: cleanText(update?.stance || '', 120).trim() || null,
            notable_context: cleanText(update?.notable_context || '', 220).trim() || null,
          })).filter((update) => update.character_key)
        : []);

  return { scene, continuity, relationship_updates: relationshipUpdates };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST만 지원합니다.' });
  if (!process.env.OPENAI_API_KEY) {
    return json(res, 503, { error: 'OPENAI_API_KEY가 설정되지 않았습니다.', code: 'NO_API_KEY' });
  }

  const requiredToken = process.env.LUMENSIA_ACCESS_TOKEN;
  if (requiredToken && req.headers['x-lumensia-token'] !== requiredToken) {
    return json(res, 401, { error: '접속 토큰이 없거나 올바르지 않습니다.', code: 'BAD_ACCESS_TOKEN' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const mode = body.mode === 'continue' ? 'continue' : 'action';
    const adminPreview = body.adminScenePreview === true;
    const action = typeof body.action === 'string' ? body.action : '';

    if (mode !== 'continue' && !action.trim()) {
      return json(res, 400, { error: '행동 입력이 비어 있습니다.' });
    }
    if (action.length > MAX_ACTION_CHARS) {
      return json(res, 400, {
        error: `한 번의 입력은 ${MAX_ACTION_CHARS.toLocaleString()}자 이하로 입력해 주세요.`,
      });
    }

    const runState = body.runState && typeof body.runState === 'object' ? body.runState : {};
    const pc = safePc(runState.pc || {});
    const residence = safeResidence(runState.residence || {});
    const scene = safeScene(runState.scene || {});
    const history = Array.isArray(runState.history) ? runState.history.slice(-MAX_HISTORY_TURNS) : [];
    const knowledgeLevel = Math.max(1, Math.min(5, Number(runState.knowledgeLevel) || 1));
    const relationships = safeRelationships(runState.relationships || {});

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
        input: buildInput({
          action, mode, adminPreview, pc, residence, scene, history, knowledgeLevel, relationships,
        }),
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
    try {
      response = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error(`OpenAI가 JSON이 아닌 응답을 반환했습니다. HTTP ${apiResponse.status}`);
    }

    if (!apiResponse.ok) {
      const message = response?.error?.message || `OpenAI 요청 실패: HTTP ${apiResponse.status}`;
      const error = new Error(message);
      error.status = apiResponse.status;
      throw error;
    }

    const outputText = extractOutputText(response);
    if (!outputText) throw new Error('Writer 응답 본문이 비어 있습니다.');

    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      throw new Error('Writer structured output을 JSON으로 해석하지 못했습니다.');
    }

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
      error: timeout
        ? 'Writer 응답 시간이 초과되었습니다. 게임 상태는 변경되지 않았습니다.'
        : (error?.message || 'Writer 요청 중 오류가 발생했습니다.'),
      code: timeout ? 'WRITER_TIMEOUT' : 'WRITER_ERROR',
    });
  }
}
