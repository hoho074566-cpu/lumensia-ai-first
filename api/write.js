import charactersData from '../data/canon/characters/characters.json' with { type: 'json' };
import characterStateData from '../data/scenarios/academy-1285-03-01/character-state.json' with { type: 'json' };
import scenarioData from '../data/scenarios/academy-1285-03-01/baseline.json' with { type: 'json' };
import { assembleAuthoring } from './lib/authoring-runtime.js';

export const config = { maxDuration: 300 };

const CHARACTERS = charactersData.characters || {};
const CHARACTER_KEYS = new Set(Object.keys(CHARACTERS));
const ACADEMY_PRESENCE = new Set(['academy_student', 'academy_faculty', 'academy_guest']);
const ACADEMY_CAST_KEYS = Object.freeze(
  Object.entries(characterStateData.characters || {})
    .filter(([key, state]) => CHARACTER_KEYS.has(key) && ACADEMY_PRESENCE.has(state?.presence))
    .map(([key]) => key),
);
const EXPRESSIONS = new Set([
  'default','smile','blush','serious','angry','sad','shock',
  'smug','annoyed','worried','confused','laugh','flustered',
]);
const TALENT_KEYS = Object.freeze(['magic', 'martial', 'soul', 'knowledge']);
const STAT_KEYS = Object.freeze(['body', 'mana', 'intelligence', 'holy']);
const MAX_ACTION_CHARS = 12000;
const MAX_HISTORY_TURNS = 8;
const RAW_PROSE_CONTRACT = '응답은 장면 본문만 일반 텍스트로 작성한다. JSON, 상태 메타데이터, 분석, 규칙 설명은 출력하지 않는다.';
const STRUCTURED_PROMPT_FRAGMENT = '등록된 인물이 말하면 supplied cast key를 speaker_key에 사용한다. 엑스트라는 speaker_key를 null로 두고 speaker_name을 사용한다. 실제 대사는 dialogue beat, 상황·행동·묘사는 narration beat로 분리한다. continuity에는 실제로 이 응답에서 확정된 변화만 기록한다.';

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

function safeStats(raw = {}) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const stats = {};
  for (const key of STAT_KEYS) {
    const value = cleanText(source[key], 16).trim();
    if (value) stats[key] = value;
  }
  return stats;
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
    stats: safeStats(raw.stats),
    traits: cleanList(raw.traits, 16, 220),
    authorities: cleanList(raw.authorities, 16, 220),
    skills: cleanList(raw.skills, 24, 120),
    equipment: cleanList(raw.equipment, 24, 160),
    conditions: cleanList(raw.conditions, 16, 180),
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

function rawWriterInstructions(instructions = '') {
  const withoutStructuredContract = String(instructions)
    .replace(`\n\n${STRUCTURED_PROMPT_FRAGMENT}`, '')
    .trim();
  return `${withoutStructuredContract}\n\n${RAW_PROSE_CONTRACT}`;
}

export function buildWriterRequestBody({ authoring, outputMode = 'structured' } = {}) {
  const rawMode = outputMode === 'raw';
  const body = {
    model: process.env.OPENAI_MODEL || 'gpt-5.6-terra',
    store: false,
    instructions: rawMode ? rawWriterInstructions(authoring?.instructions || '') : authoring?.instructions || '',
    input: authoring?.input || '',
    reasoning: { effort: 'medium' },
    max_output_tokens: 5600,
  };

  if (!rawMode) {
    body.text = {
      format: {
        type: 'json_schema',
        name: 'lumensia_authoring_scene',
        strict: true,
        schema: OUTPUT_SCHEMA,
      },
    };
  }

  return body;
}

function splitLongBlock(text, max = 2600) {
  const chunks = [];
  let rest = String(text || '').trim();
  while (rest.length > max) {
    let cut = rest.lastIndexOf('\n', max);
    if (cut < Math.floor(max * 0.55)) cut = rest.lastIndexOf(' ', max);
    if (cut < Math.floor(max * 0.55)) cut = max;
    chunks.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) chunks.push(rest);
  return chunks;
}

export function proseToTurn(text, fallbackScene = {}) {
  const normalized = String(text || '').replace(/\r\n/g, '\n').trim();
  if (!normalized) throw new Error('Writer 응답 본문이 비어 있습니다.');

  const blocks = normalized
    .split(/\n{2,}/)
    .flatMap((block) => splitLongBlock(block))
    .filter(Boolean)
    .slice(0, 48);

  if (!blocks.length) throw new Error('Writer가 표시 가능한 장면 본문을 반환하지 않았습니다.');

  return {
    scene: blocks.map((block) => ({
      kind: 'narration',
      text: block,
      speaker_key: null,
      speaker_name: null,
      expression: null,
    })),
    continuity: {
      date: fallbackScene.date,
      time: fallbackScene.time,
      location: fallbackScene.location,
      situation: fallbackScene.situation,
      present_character_keys: Array.isArray(fallbackScene.presentCharacterKeys)
        ? [...fallbackScene.presentCharacterKeys]
        : [],
    },
  };
}

export function validateTurn(turn, pc, fallbackScene) {
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
        return { kind: 'narration', text, speaker_key: null, speaker_name: null, expression: null };
      }
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
    const writerOutputMode = body.writerOutputMode === 'raw' ? 'raw' : 'structured';
    const writerContextMode = body.writerContextMode === 'compact' ? 'compact' : 'full';

    if (continueScene && adminScenePreview) {
      return json(res, 400, { error: '이어하기와 Admin Preview를 동시에 사용할 수 없습니다.' });
    }
    if (!continueScene && !action.trim()) return json(res, 400, { error: '행동 입력이 비어 있습니다.' });
    if (action.length > MAX_ACTION_CHARS) {
      return json(res, 400, { error: `한 번의 입력은 ${MAX_ACTION_CHARS.toLocaleString()}자 이하로 입력해 주세요.` });
    }

    const runState = body.runState && typeof body.runState === 'object' ? body.runState : {};
    const pc = safePc(runState.pc || {});
    const scene = safeScene(runState.scene || {});
    const relationships = runState.relationships && typeof runState.relationships === 'object' && !Array.isArray(runState.relationships)
      ? runState.relationships
      : {};
    const history = Array.isArray(runState.history) ? runState.history.slice(-MAX_HISTORY_TURNS) : [];
    if (continueScene && !history.length) return json(res, 400, { error: '이어갈 장면이 없습니다.' });

    const mode = adminScenePreview ? 'admin' : (continueScene ? 'continue' : 'action');
    const authoring = assembleAuthoring({
      action,
      pc,
      scene,
      relationships,
      history,
      mode,
      contextMode: writerContextMode,
    });

    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildWriterRequestBody({ authoring, outputMode: writerOutputMode })),
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
    if (pc.name !== 'Aaa' && /\bAaa\b/.test(outputText)) {
      throw new Error('Writer가 PC 이름 대신 legacy placeholder Aaa를 사용했습니다.');
    }

    let turn;
    if (writerOutputMode === 'raw') {
      turn = proseToTurn(outputText, scene);
    } else {
      let parsed;
      try {
        parsed = JSON.parse(outputText);
      } catch {
        throw new Error('Writer structured output을 JSON으로 해석하지 못했습니다.');
      }
      turn = validateTurn(parsed, pc, scene);
    }

    return json(res, 200, {
      turn,
      admin_preview: adminScenePreview,
      continue_scene: continueScene,
      writer_output_mode: writerOutputMode,
      writer_context_mode: writerContextMode,
      continuity_frozen_for_parity: writerOutputMode === 'raw',
      model: response?.model || process.env.OPENAI_MODEL || 'gpt-5.6-terra',
      request_id: response?.id || null,
      usage: response?.usage || null,
      academy_cast_count: ACADEMY_CAST_KEYS.length,
      authoring_diagnostics: authoring.diagnostics,
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
