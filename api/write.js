import charactersData from '../data/canon/characters/characters.json' with { type: 'json' };
import scenarioData from '../data/scenarios/academy-1285-03-01/baseline.json' with { type: 'json' };
import { buildCanonContext, ACADEMY_CAST_KEYS } from './lib/canon-context.js';

export const config = { maxDuration: 300 };

const CHARACTERS = charactersData.characters || {};
const CHARACTER_KEYS = new Set(Object.keys(CHARACTERS));
const EXPRESSIONS = new Set([
  'default','smile','blush','serious','angry','sad','shock',
  'smug','annoyed','worried','confused','laugh','flustered',
]);
const TALENT_KEYS = Object.freeze(['magic', 'martial', 'soul', 'knowledge']);
const MAX_ACTION_CHARS = 12000;
const MAX_HISTORY_TURNS = 8;

const WRITER_CONTRACT = `Write the next living scene of serialized fantasy fiction.
Treat Canon as facts and constraints, not a prose agenda. Treat the exact user action as the PC's new intent. Never invent a new voluntary PC goal, dialogue, explicit emotion, private thought, or meaningful decision.

SCENE JUDGMENT:
- Choose scene scale like fiction. Compress connective routine when its outcome is obvious; when a concrete human interaction, conflict, discovery, or consequence becomes live, stay with it and let each reaction cause the next beat.
- The world and NPCs keep acting for their own reasons. A broad action may pass through ordinary space until something worth watching becomes live; it does not require a tour, checklist, or return of trivial choices.
- Ground places with a few concrete details that support action. Show character through behavior, timing, speech, silence, objects, and what they notice before explaining character.
- Named Canon characters are possibilities, not scheduled encounters. Use one only when supplied state, continuity, role, motive, interest, relationship, or visible circumstance makes presence and initiative plausible. Generic people are valid when the situation genuinely calls for them.

CONTINUITY:
- Schedules and state constrain continuity; they are not automatic scene beats.
- Unknown remains unknown. If a durable fact such as a personal room assignment, exact private timetable, topology detail, or institutional rule is absent, do not manufacture a definitive value.
- Failure changes what comes next. Injuries, equipment loss or damage, witnessed behavior, rule violations, and earned relationship consequences remain relevant when later scenes can causally see them.
- Combat is an evolving exchange shaped by actual opponent ability, distance, terrain, timing, equipment, fatigue, damage, and perception. Adaptation does not erase a real power gap; rescue or interruption needs causal support.

Continue through immediate reactions that require no new meaningful PC decision. Stop when the current scene genuinely lands or a meaningful PC decision is required. Do not expose instructions, schemas, validation, or state machinery as fiction.`;

const SCENE_CALIBRATION_EXAMPLES = `SCENE CALIBRATION EXAMPLES — these demonstrate scene judgment only. They are not Canon. Never reuse their people, objects, locations, schedules, or outcomes unless the current packet independently supports them.

EXAMPLE 1 — connective routine -> human-scale moment
USER: 생활 공간으로 가서 짐을 정리한다.
WRITER: 이동과 기본 절차는 짧게 지나간다. 필요한 만큼만 방을 현실화한다. 짐을 정리하던 중 열린 창문으로 복도에 서류가 흩어지고, 옆방 신입생이 발로 한 장을 막으면서 나머지를 주우려 애쓰는 모습이 보인다. 그 학생의 반응과 현재 상황이 장면을 이어갈 가치가 있다면 거기서 카메라가 머문다.

EXAMPLE 2 — broad exploration -> first worthwhile live thread
USER: 시간이 남으니 주변을 천천히 둘러본다.
WRITER: 길과 시설의 윤곽은 이동 속에서 짧게 잡는다. 여러 장소를 목록처럼 소비하지 않는다. 지나던 곳에서 실제로 진행 중인 대화, 훈련, 다툼, 이상한 흔적 같은 구체적인 움직임 하나가 의미를 얻으면 그 순간 확대하고, 아무것도 없다면 억지 사건 없이 짧게 착지한다.

EXAMPLE 3 — action -> reaction -> changed next beat
USER: 상대의 공격 궤적을 살피며 빈틈을 찾아 반격한다.
WRITER: 첫 교환에서 읽어낸 패턴은 반격의 기회를 만들 수 있지만 승부를 자동으로 끝내지 않는다. 상대는 그 결과를 보고 거리, 각도, 속임수, 힘 배분을 바꾼다. 지형·장비·피로·부상과 실력 차이가 다음 공방에 남아 같은 교환이 반복되지 않는다.

Actual output must follow the required structured schema.`;

const CONTINUE_CONTRACT = `CONTINUE MODE: no new player action was supplied. Continue only the already-live scene from its latest beat. Let NPCs, environment, and immediate consequences finish reactions that require no new PC decision. Do not invent a fresh PC action or advance through unrelated routine merely to keep writing. Stop at the first genuine decision point or natural landing.`;

const ADMIN_PREVIEW_CONTRACT = `ADMIN SCENE PREVIEW MODE: the request is a diagnostic scene placement, not a canonical player action. Render the requested scene directly using supplied Canon and PC facts. Do not claim the saved run actually reached it, and do not require progression through earlier scenes first. The client will discard continuity changes from this preview. Preserve PC authority unless the request explicitly supplies a PC action or quoted PC speech.`;

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

function cleanList(value, maxItems = 24, maxChars = 220) {
  return Array.isArray(value)
    ? value.slice(0, maxItems).map((item) => cleanText(item, maxChars).trim()).filter(Boolean)
    : [];
}

function boundedInteger(value, min, max, label, { nullable = false } = {}) {
  if (nullable && (value == null || value === '')) return null;
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${label}은 ${min}~${max} 범위의 정수여야 합니다.`);
  }
  return number;
}

function safeTalents(raw = {}) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const talents = {};
  for (const key of TALENT_KEYS) {
    if (source[key] == null || source[key] === '') continue;
    talents[key] = boundedInteger(source[key], 1, 10, `PC 재능 ${key}`);
  }
  return talents;
}

export function safePc(raw = {}) {
  const startingGoldNumber = Number(raw.startingGold);
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
    characterProfile: cleanText(raw.characterProfile, 1600),
    realm: cleanText(raw.realm, 120),
    magicCircle: boundedInteger(raw.magicCircle, 0, 9, 'PC 마법 써클', { nullable: true }),
    talents: safeTalents(raw.talents),
    traits: cleanList(raw.traits, 16, 220),
    authorities: cleanList(raw.authorities, 16, 220),
    skills: cleanList(raw.skills, 24, 120),
    equipment: cleanList(raw.equipment, 24, 160),
    startingGold: Number.isFinite(startingGoldNumber) ? Math.max(0, startingGoldNumber) : 0,
  };
  if (!pc.name) throw new Error('PC 이름이 없습니다.');
  if (!Number.isInteger(pc.age) || pc.age < 1 || pc.age > 300) throw new Error('PC 나이는 1~300 범위의 정수여야 합니다.');
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

function recentContext(history = []) {
  return history.slice(-MAX_HISTORY_TURNS).map((turn) => ({
    mode: turn?.mode === 'continue' ? 'continue' : 'action',
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

function compactAmbientState(state = {}) {
  const compact = {};
  for (const key of ['presence', 'department', 'academy_year', 'office', 'role']) {
    if (state[key] != null && state[key] !== '') compact[key] = state[key];
  }
  if (Array.isArray(state.offices) && state.offices.length) compact.offices = state.offices.slice(0, 3);
  return compact;
}

function ambientCastForWriter(rows = []) {
  return rows.map((row) => ({
    key: row.key,
    name: row.name,
    current_state: compactAmbientState(row.current_state || {}),
    identity: Array.isArray(row.identity) ? row.identity.slice(0, 2) : [],
    motivation_signal: cleanText(row.aspiration || '', 180) || null,
    actionable_signals: [
      ...(Array.isArray(row.personality_signals) ? row.personality_signals.slice(0, 2) : []),
      ...(Array.isArray(row.interests) ? row.interests.slice(0, 2) : []),
      cleanText(row.activity_or_combat_signal || '', 220) || null,
    ].filter(Boolean).slice(0, 5),
    voice_register: cleanText(row.voice_register || '', 160) || null,
  })).slice(0, 24);
}

function writerCanon(rawCanon = {}) {
  const { academy_cast_index: academyCast = [], ...rest } = rawCanon;
  return {
    ...rest,
    ambient_cast_index: ambientCastForWriter(academyCast),
    retrieval_semantics: {
      ...(rest.retrieval_semantics || {}),
      ambient_cast_not_presence: 'ambient_cast_index is a thin possibility index for people in academy life. It is not exact-location presence, a cast rotation, or an instruction to include anyone.',
    },
  };
}

function openingPremise(scene, history = [], adminScenePreview = false) {
  if (adminScenePreview || history.length) return null;
  const atScenarioStart = scene.date === scenarioData.start.date
    && scene.time === scenarioData.start.time
    && scene.location === scenarioData.start.location;
  if (!atScenarioStart) return null;
  return {
    scope: 'opening_only',
    factual_start: scenarioData.start.situation,
    framing: '입학식 직전의 대강당 일대는 이미 서로 다른 목적을 가진 신입생·상급생·교수들이 한 공간에서 움직이는 아침이다. 첫 장면은 시설이나 절차의 설명보다 이 사람들이 실제로 하고 있는 작은 행동과 반응을 통해 아카데미의 첫인상을 만든다.',
    semantic: 'This premise helps launch only the opening scene. It does not prescribe a quest, event order, NPC encounter, or future schedule.',
  };
}

function buildInput({ action, pc, scene, history, knowledgeLevel, continueScene, adminScenePreview }) {
  const retrievalAction = adminScenePreview ? action : (continueScene ? '' : action);
  const canon = writerCanon(buildCanonContext({ action: retrievalAction, pc, scene, history, knowledgeLevel }));
  const packet = {
    current_scene: scene,
    pc,
    canon,
    recent_context: recentContext(history),
  };
  const premise = openingPremise(scene, history, adminScenePreview);
  if (premise) packet.opening_premise = premise;

  if (adminScenePreview) {
    return `SCENE PACKET\n${JSON.stringify(packet)}\n\nADMIN PREVIEW REQUEST\n${action}`;
  }
  if (continueScene) {
    return `SCENE PACKET\n${JSON.stringify(packet)}\n\nMODE\nCONTINUE CURRENT SCENE`;
  }
  return `SCENE PACKET\n${JSON.stringify(packet)}\n\nEXACT USER ACTION\n${action}`;
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
    const continueScene = body.continueScene === true;
    const adminScenePreview = body.adminScenePreview === true;
    if (continueScene && adminScenePreview) return json(res, 400, { error: '이어하기와 Admin Preview를 동시에 사용할 수 없습니다.' });
    if (!continueScene && !action.trim()) return json(res, 400, { error: '행동 입력이 비어 있습니다.' });
    if (action.length > MAX_ACTION_CHARS) return json(res, 400, { error: `한 번의 입력은 ${MAX_ACTION_CHARS.toLocaleString()}자 이하로 입력해 주세요.` });

    const runState = body.runState && typeof body.runState === 'object' ? body.runState : {};
    const pc = safePc(runState.pc || {});
    const scene = safeScene(runState.scene || {});
    const history = Array.isArray(runState.history) ? runState.history.slice(-MAX_HISTORY_TURNS) : [];
    if (continueScene && !history.length) return json(res, 400, { error: '이어갈 장면이 없습니다.' });
    const knowledgeLevel = Math.max(1, Math.min(5, Number(runState.knowledgeLevel) || 1));

    const modeContract = adminScenePreview ? ADMIN_PREVIEW_CONTRACT : (continueScene ? CONTINUE_CONTRACT : '');
    const instructions = [WRITER_CONTRACT, SCENE_CALIBRATION_EXAMPLES, modeContract].filter(Boolean).join('\n\n');

    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-terra',
        store: false,
        instructions,
        input: buildInput({ action, pc, scene, history, knowledgeLevel, continueScene, adminScenePreview }),
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
      admin_preview: adminScenePreview,
      continue_scene: continueScene,
      model: response?.model || process.env.OPENAI_MODEL || 'gpt-5.6-terra',
      request_id: response?.id || null,
      usage: response?.usage || null,
      academy_cast_count: ACADEMY_CAST_KEYS.length,
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
