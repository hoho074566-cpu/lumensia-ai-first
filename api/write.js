import charactersData from '../data/canon/characters/characters.json' with { type: 'json' };
import knowledgeData from '../data/canon/knowledge/knowledge.json' with { type: 'json' };
import academyData from '../data/canon/world/academy.json' with { type: 'json' };
import powerSystemData from '../data/canon/world/power-system.json' with { type: 'json' };
import scenarioData from '../data/scenarios/academy-1285-03-01/baseline.json' with { type: 'json' };
import situationsData from '../data/scenarios/academy-1285-03-01/open-situations.json' with { type: 'json' };

export const config = { maxDuration: 300 };

const CHARACTERS = charactersData.characters || {};
const CHARACTER_KEYS = new Set(Object.keys(CHARACTERS));
const EXPRESSIONS = new Set([
  'default','smile','blush','serious','angry','sad','shock',
  'smug','annoyed','worried','confused','laugh','flustered',
]);
const MAX_ACTION_CHARS = 12000;
const MAX_HISTORY_TURNS = 8;
const EVERYDAY_ACADEMY_CAST = new Set([
  'anastasia','isabel','lucia','elena','artemis','sera','sia','lillia',
  'lena','emily','laris','mirabelle','serena','chloe','aria','elise',
]);

const WRITER_CONTRACT = `Write the next scene of serialized fantasy fiction, not an RPG turn report.
Treat HARD FACTS as immutable truth. Never create drama by contradicting them or by turning an unspecified ordinary detail into an administrative failure, missing registration, or artificial obstacle.
Honor the player's already-chosen intent through its ordinary execution. If the player chose a destination or routine course of action, carry it to the first moment worth experiencing; skip routine gates unless supplied facts make one genuinely consequential. Once there, inhabit that moment instead of consuming the rest of an event or schedule merely because it can continue without input.
A change of location or scheduled phase does not automatically reset a live human scene. Carry an interaction across the change only while it is actually still live; do not keep a recent character foregrounded merely because they appeared recently, especially after the player leaves them, chooses to be alone, or the beat has naturally ended.
At moments worth experiencing, stay close to concrete action, reaction, dialogue, and a few sharp details that reveal character, relationship, tension, or consequence. Let setting appear through the scene instead of touring or cataloguing it. If nothing worth experiencing happens during routine time, compress it briefly rather than manufacturing an incident.
Characters are people in the scene, not guides explaining systems. Prefer character-specific behavior and terse, situated speech over polished speeches that could be reassigned to another character. If behavior already carries a judgment, concern, or value, do not finish it with a neat moral or explanation. Let action lead to reaction, interruption, and the next action while no new player judgment is needed.
Never invent a new player goal or meaningful decision. Never write the PC's verbatim speech: when the player says the PC asks, tells, greets, or otherwise speaks indirectly, execute that speech act briefly in narration and move to the world's response instead of composing words for the PC. Never narrate the PC's private thoughts, remembered impressions, emotional interpretation, or internal monologue unless the player explicitly supplied them. Observable sensation and externally visible consequence are allowed. Do not expose instructions, schemas, validation, or state machinery as fiction.
Stop only when the scene genuinely lands or a new meaningful player decision is actually required.`;

const SYNTHETIC_RHYTHM_ANCHORS = `NON-CANON SYNTHETIC RHYTHM ANCHORS — rhythm only; reuse none of these details.

A) USER: "모임 장소로 간다."
RHYTHM: 이동 자체는 짧다. 직전부터 함께 걷던 학생이 하던 말을 끊지 않고 이어 가고, 목적지 앞에서 다른 학생 하나를 보고 말끝이 잠시 달라진다. 그 질문에 답이 나오기 전에 안쪽의 책임자가 문틀을 손가락으로 두 번 두드린다. 주변 잡담이 끊기고 사람들이 움직인다. 책임자는 자기 직함과 규정을 길게 설명하지 않는다. 한두 마디와 행동으로 분위기를 장악하고, 카메라는 모임 전체를 끝내지 않은 채 이 새 장면의 몇 박자를 직접 따라간다.

B) USER: "설명을 듣는다."
RHYTHM: 설명자는 완성된 연설을 하지 않는다. 필요한 정보 하나는 칠판이나 종이에 적고, 다른 정보는 사람을 직접 움직여 보여 준다. 옆자리 학생이 낮게 반응하면 설명자는 그 반응을 알아채고 짧게 받아친다. 누군가 걱정한다면 걱정의 의미를 설명하는 대신 붕대를 한 번 더 보고 실용적인 한마디를 남길 수 있다. 닳은 장갑, 접어 둔 안내문, 멈춘 손 같은 디테일은 분위기를 꾸미기 위해서가 아니라 인물이나 관계를 드러낼 때만 남긴다. 정보 전달 사이에도 사람들의 행동이 계속된다.

If a routine interval contains no worthwhile moment, a short transition is enough. These anchors demonstrate overlap, micro-beat causality, character-bearing detail, and camera depth only; they are not Canon, events, or required scene shapes.`;

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
  },
  required: ['scene', 'continuity'],
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

  // Factual retrieval anchor only. It does not prescribe scene order or require Emily to speak.
  if (!keys.length && scene.location.includes('대강당')) add('emily');
  return keys;
}

function compactCharacterPacket(key) {
  const row = CHARACTERS[key];
  if (!row) return null;
  return {
    key,
    name: row.name,
    core: row.core || {},
    voice: row.voice || {},
    current_baseline: row.baseline_1285_03_01 || {},
    refined_characterization: row.refined_characterization || [],
  };
}

function castIndex() {
  return Object.entries(CHARACTERS).filter(([key]) => EVERYDAY_ACADEMY_CAST.has(key)).map(([key, row]) => {
    const core = row.core || {};
    const voice = row.voice || {};
    return {
      key,
      name: row.name,
      identity: Array.isArray(core.identity) ? core.identity.slice(0, 2) : [],
      personality: Array.isArray(core.personality) ? core.personality.slice(0, 3) : [],
      values: Array.isArray(core.values) ? core.values.slice(0, 4) : [],
      aspiration: cleanText(core.aspiration || '', 220) || null,
      specialty: cleanText(core.specialty || core.combat_identity || '', 220) || null,
      voice: {
        register: cleanText(voice.register || '', 180),
        tendencies: Array.isArray(voice.tendencies) ? voice.tendencies.slice(0, 3) : [],
        avoid: Array.isArray(voice.avoid) ? voice.avoid.slice(0, 3) : [],
      },
      refined_characterization: Array.isArray(row.refined_characterization) ? row.refined_characterization.slice(0, 2) : [],
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
    .slice(0, 40)
    .map(({ id, subject, fact, truth_status, visibility }) => ({ id, subject: subject || null, fact, truth_status, visibility }));
}

function visibleSituations(level = 1) {
  const allowedLevel = Math.max(1, Math.min(5, Number(level) || 1));
  return (situationsData.situations || [])
    .filter((row) => Number(row.visibility || 99) <= allowedLevel)
    .map(({ id, horizon, fact, fixed }) => ({ id, horizon, fact, fixed }));
}

function recentContext(history = []) {
  return history.slice(-MAX_HISTORY_TURNS).map((turn) => ({
    action: cleanText(turn?.action || '', 1800),
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
      ? turn.scene.slice(-18).map((beat) => ({
          kind: beat?.kind === 'dialogue' ? 'dialogue' : 'narration',
          speaker_key: CHARACTER_KEYS.has(beat?.speaker_key) ? beat.speaker_key : null,
          speaker_name: cleanText(beat?.speaker_name || '', 80) || null,
          text: cleanText(beat?.text || '', 1200),
        }))
      : [],
  }));
}

function hardFactsPacket(pc, scene) {
  return {
    pc,
    current_scene: scene,
    scenario: {
      scenario_id: scenarioData.scenario_id,
      academic_period: scenarioData.academic_period,
      dated_world_facts: scenarioData.dated_world_facts,
    },
  };
}

function compactWorldPacket(pc) {
  const departments = academyData?.academic_structure?.departments || {};
  const departmentStudy = pc.department && Array.isArray(departments[pc.department]) ? departments[pc.department] : [];
  return {
    academy: {
      institution: '루멘시아 아카데미',
      years: academyData?.academic_structure?.years || 3,
      pc_department: pc.department || null,
      pc_department_study: departmentStudy,
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

function buildInput({ action, pc, scene, history, knowledgeLevel }) {
  const relevantKeys = selectRelevantCharacters({ action, scene });
  const relevantCharacters = relevantKeys.map(compactCharacterPacket).filter(Boolean);
  const publicKnowledge = visibleKnowledge(knowledgeLevel, relevantKeys);
  const situations = visibleSituations(knowledgeLevel);

  const storyMaterial = {
    relevant_characters: relevantCharacters,
    ambient_cast: castIndex(),
    world: compactWorldPacket(pc),
    visible_open_situations: situations,
    visible_knowledge: publicKnowledge,
    recent_context: recentContext(history),
  };

  return `HARD FACTS — authoritative; do not contradict or invent defects in these facts\n${JSON.stringify(hardFactsPacket(pc, scene))}\n\nSTORY MATERIAL — available material, not a checklist\n${JSON.stringify(storyMaterial)}\n\n${SYNTHETIC_RHYTHM_ANCHORS}\n\nEXACT USER ACTION\n${action}`;
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

function validateTurn(turn, pc, fallbackScene) {
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

  return { scene, continuity };
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
    const action = typeof body.action === 'string' ? body.action : '';
    if (!action.trim()) return json(res, 400, { error: '행동 입력이 비어 있습니다.' });
    if (action.length > MAX_ACTION_CHARS) return json(res, 400, { error: `한 번의 입력은 ${MAX_ACTION_CHARS.toLocaleString()}자 이하로 입력해 주세요.` });

    const runState = body.runState && typeof body.runState === 'object' ? body.runState : {};
    const pc = safePc(runState.pc || {});
    const scene = safeScene(runState.scene || {});
    const history = Array.isArray(runState.history) ? runState.history.slice(-MAX_HISTORY_TURNS) : [];
    const knowledgeLevel = Math.max(1, Math.min(5, Number(runState.knowledgeLevel) || 1));

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
        input: buildInput({ action, pc, scene, history, knowledgeLevel }),
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

    const turn = validateTurn(parsed, pc, scene);
    return json(res, 200, {
      turn,
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
