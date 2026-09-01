export const config = { maxDuration: 120 };

export const GRADE_LADDER = Object.freeze([
  'F','F+','E-','E','E+','D-','D','D+','C-','C','C+','B-','B','B+','A-','A','A+','A++',
  'S-','S','S+','S++','SS-','SS','SS+','SSS-','SSS','SSS+',
]);

const STAT_KEYS = Object.freeze(['body', 'mana', 'intelligence', 'holy']);
const SIGNIFICANCE = new Set(['minor', 'meaningful', 'breakthrough']);
const MAX_SCENE_CHARS = 16000;
const MAX_ACTION_CHARS = 12000;

const STATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    observations: {
      type: 'array',
      maxItems: 8,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          domain: { type: 'string', enum: ['skill', 'stat'] },
          target: { type: 'string', minLength: 1, maxLength: 100 },
          evidence: { type: 'string', minLength: 1, maxLength: 320 },
          significance: { type: 'string', enum: ['minor', 'meaningful', 'breakthrough'] },
        },
        required: ['domain', 'target', 'evidence', 'significance'],
      },
    },
    promotions: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          domain: { type: 'string', enum: ['skill', 'stat'] },
          target: { type: 'string', minLength: 1, maxLength: 100 },
          from_grade: { type: 'string', minLength: 1, maxLength: 8 },
          to_grade: { type: 'string', minLength: 1, maxLength: 8 },
          reason: { type: 'string', minLength: 1, maxLength: 320 },
        },
        required: ['domain', 'target', 'from_grade', 'to_grade', 'reason'],
      },
    },
  },
  required: ['observations', 'promotions'],
};

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.end(JSON.stringify(payload));
}

function cleanText(value, max = 400) {
  const text = String(value ?? '').trim();
  return text.length > max ? text.slice(0, max) : text;
}

function cleanGrade(value) {
  const grade = cleanText(value, 8).toUpperCase();
  return GRADE_LADDER.includes(grade) ? grade : '';
}

function nextGrade(grade) {
  const index = GRADE_LADDER.indexOf(grade);
  return index >= 0 && index < GRADE_LADDER.length - 1 ? GRADE_LADDER[index + 1] : grade;
}

function parseGradedSkill(value) {
  const text = cleanText(value, 160);
  if (!text) return null;
  const grades = [...GRADE_LADDER].sort((a, b) => b.length - a.length);
  for (const grade of grades) {
    for (const delimiter of [':', '：', ' ']) {
      const suffix = `${delimiter}${grade}`;
      if (!text.toUpperCase().endsWith(suffix)) continue;
      const name = text.slice(0, -suffix.length).trim();
      if (name) return { name, grade, original: text };
    }
  }
  return null;
}

function skillMap(skills = []) {
  const map = new Map();
  for (const row of Array.isArray(skills) ? skills : []) {
    const parsed = parseGradedSkill(row);
    if (parsed && !map.has(parsed.name)) map.set(parsed.name, parsed);
  }
  return map;
}

function normalizeGrowth(raw = {}) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const evidence = (Array.isArray(source.evidence) ? source.evidence : []).slice(-60).map((row, index) => ({
    id: cleanText(row?.id || `legacy-${index}`, 80),
    domain: row?.domain === 'stat' ? 'stat' : 'skill',
    target: cleanText(row?.target, 100),
    note: cleanText(row?.note, 320),
    significance: SIGNIFICANCE.has(row?.significance) ? row.significance : 'minor',
    date: cleanText(row?.date, 10),
    time: cleanText(row?.time, 5),
    consumed: row?.consumed === true,
    consumedBy: cleanText(row?.consumedBy, 80),
  })).filter((row) => row.target && row.note);
  const changes = (Array.isArray(source.changes) ? source.changes : []).slice(-24).map((row, index) => ({
    id: cleanText(row?.id || `legacy-change-${index}`, 80),
    domain: row?.domain === 'stat' ? 'stat' : 'skill',
    target: cleanText(row?.target, 100),
    before: cleanGrade(row?.before),
    after: cleanGrade(row?.after),
    reason: cleanText(row?.reason, 320),
    date: cleanText(row?.date, 10),
    time: cleanText(row?.time, 5),
  })).filter((row) => row.target && row.before && row.after);
  return { version: 1, evidence, changes };
}

function sceneText(scene = []) {
  const text = (Array.isArray(scene) ? scene : []).map((beat) => cleanText(beat?.text, 2400)).filter(Boolean).join('\n\n');
  return text.length > MAX_SCENE_CHARS ? text.slice(0, MAX_SCENE_CHARS) : text;
}

function stateSnapshot(pc = {}) {
  const stats = pc.stats && typeof pc.stats === 'object' ? pc.stats : {};
  const skills = (Array.isArray(pc.skills) ? pc.skills : []).map((row) => cleanText(row, 160)).filter(Boolean).slice(0, 24);
  const talents = pc.talents && typeof pc.talents === 'object' ? pc.talents : {};
  return [
    `PC: ${cleanText(pc.name, 80)}`,
    `무의 경지: ${cleanText(pc.realm, 120) || '-'}`,
    `마법 써클: ${pc.magicCircle == null || pc.magicCircle === '' ? '-' : pc.magicCircle}`,
    `재능: 魔 ${talents.magic ?? '-'} / 武 ${talents.martial ?? '-'} / 魂 ${talents.soul ?? '-'} / 智 ${talents.knowledge ?? '-'}`,
    `스탯: 신체 ${cleanText(stats.body, 16) || '-'} / 마나 ${cleanText(stats.mana, 16) || '-'} / 지능 ${cleanText(stats.intelligence, 16) || '-'} / 신성 ${cleanText(stats.holy, 16) || '-'}`,
    `스킬: ${skills.join(' / ') || '-'}`,
  ].join('\n');
}

function unconsumedEvidenceText(growth) {
  const rows = growth.evidence.filter((row) => !row.consumed).slice(-20);
  if (!rows.length) return '(아직 미소비 성장 근거 없음)';
  return rows.map((row) => `- ${row.domain}:${row.target} [${row.significance}] ${row.note}`).join('\n');
}

export function buildStateKeeperInput({ pc = {}, growth = {}, action = '', turn = {}, scene = {} } = {}) {
  const ledger = normalizeGrowth(growth);
  return [
    'TURN START PC STATE',
    stateSnapshot(pc),
    '',
    'UNCONSUMED GROWTH EVIDENCE',
    unconsumedEvidenceText(ledger),
    '',
    'USER DECLARATION',
    cleanText(action || '(이어하기)', MAX_ACTION_CHARS),
    '',
    'WRITER-CONFIRMED RESULT',
    sceneText(turn?.scene),
    '',
    `WORLD TIME: ${cleanText(scene?.date, 10)} ${cleanText(scene?.time, 5)}`,
  ].join('\n');
}

const STATE_KEEPER_INSTRUCTIONS = `너는 LUMENSIA의 State Keeper다. 소설을 쓰지 않는다. 방금 Writer가 확정한 장면을 읽고 PC 성장의 사실만 구조화한다.\n\nGROWTH-01A 범위는 기존 스킬 숙련 등급과 신체/마나/지능/신성 스탯 등급뿐이다. 무의 경지, 마법 써클, 재능, Trait, Authority, 장비, 금화, 부상/상태, 관계는 절대 변경 제안하지 않는다. 새로운 스킬을 창작하거나 획득시키지 않는다.\n\n사용자 입력은 시도/선언일 뿐이다. Writer 본문에서 실제 결과로 확인되지 않은 주장(예: '나는 소드 마스터가 된다')을 성장 사실로 취급하지 않는다.\n\nobservations에는 실제 훈련, 교정, 실전 적용, 의미 있는 실패에서의 학습, 명시적 깨달음처럼 이후 성장 판단에 재사용할 가치가 있는 근거만 기록한다. 같은 행동의 단순 반복이나 무의미한 성공은 과대평가하지 않는다.\n\npromotions는 현재 턴의 실제 향상과 제공된 미소비 성장 근거를 함께 보아 숙련/능력이 질적으로 한 단계 올라갔다고 확신할 때만 제안한다. routine 한 번으로 승급시키지 않는다. 다만 장면 자체가 명백한 breakthrough라면 이전 근거가 적어도 가능하다. 재능은 성장 속도의 개연성에 영향을 줄 수 있지만 고정 배율이나 XP처럼 계산하지 않는다.\n\n승급은 한 대상당 한 단계만 제안한다. 등급 사다리: F, F+, E-, E, E+, D-, D, D+, C-, C, C+, B-, B, B+, A-, A, A+, A++, S-, S, S+, S++, SS-, SS, SS+, SSS-, SSS, SSS+.\n\n현재 등급을 모르면 승급을 제안하지 않는다. 출력은 지정된 JSON schema만 따른다.`;

function validTarget(domain, target, pc) {
  if (domain === 'stat') return STAT_KEYS.includes(target);
  return skillMap(pc.skills).has(target);
}

function currentGrade(domain, target, pc) {
  if (domain === 'stat') return cleanGrade(pc?.stats?.[target]);
  return skillMap(pc.skills).get(target)?.grade || '';
}

function normalizedObservation(row, pc) {
  const domain = row?.domain === 'stat' ? 'stat' : 'skill';
  const target = cleanText(row?.target, 100);
  if (!validTarget(domain, target, pc)) return null;
  const evidence = cleanText(row?.evidence, 320);
  if (!evidence) return null;
  return {
    domain,
    target,
    evidence,
    significance: SIGNIFICANCE.has(row?.significance) ? row.significance : 'minor',
  };
}

export function applyGrowthDecision({ pc = {}, growth = {}, decision = {}, date = '', time = '' } = {}) {
  const nextPc = {
    ...pc,
    stats: { ...(pc.stats && typeof pc.stats === 'object' ? pc.stats : {}) },
    skills: Array.isArray(pc.skills) ? [...pc.skills] : [],
  };
  const nextGrowth = normalizeGrowth(growth);
  const priorUnconsumedKeys = new Set(
    nextGrowth.evidence
      .filter((row) => !row.consumed)
      .map((row) => `${row.domain}:${row.target}`),
  );
  const observations = (Array.isArray(decision?.observations) ? decision.observations : [])
    .map((row) => normalizedObservation(row, nextPc))
    .filter(Boolean)
    .slice(0, 8);

  const currentObservationKeys = new Set();
  let sequence = nextGrowth.evidence.length + nextGrowth.changes.length + 1;
  const batchId = Date.now().toString(36);
  for (const row of observations) {
    const id = `ev-${batchId}-${sequence++}`;
    nextGrowth.evidence.push({
      id,
      domain: row.domain,
      target: row.target,
      note: row.evidence,
      significance: row.significance,
      date: cleanText(date, 10),
      time: cleanText(time, 5),
      consumed: false,
      consumedBy: '',
    });
    if (row.significance === 'meaningful' || row.significance === 'breakthrough') {
      currentObservationKeys.add(`${row.domain}:${row.target}`);
    }
  }

  const changes = [];
  const promotedKeys = new Set();
  for (const proposal of (Array.isArray(decision?.promotions) ? decision.promotions : []).slice(0, 3)) {
    const domain = proposal?.domain === 'stat' ? 'stat' : 'skill';
    const target = cleanText(proposal?.target, 100);
    const key = `${domain}:${target}`;
    if (promotedKeys.has(key) || !validTarget(domain, target, nextPc)) continue;
    if (!currentObservationKeys.has(key)) continue;

    const before = currentGrade(domain, target, nextPc);
    const proposedFrom = cleanGrade(proposal?.from_grade);
    const proposedTo = cleanGrade(proposal?.to_grade);
    if (!before || proposedFrom !== before || proposedTo !== nextGrade(before) || proposedTo === before) continue;

    const currentObs = observations.find((row) => row.domain === domain && row.target === target);
    if (currentObs?.significance !== 'breakthrough' && !priorUnconsumedKeys.has(key)) continue;

    const changeId = `chg-${batchId}-${sequence++}`;
    if (domain === 'stat') {
      nextPc.stats[target] = proposedTo;
    } else {
      const map = skillMap(nextPc.skills);
      const existing = map.get(target);
      if (!existing) continue;
      const index = nextPc.skills.findIndex((row) => cleanText(row, 160) === existing.original);
      if (index < 0) continue;
      nextPc.skills[index] = `${target}:${proposedTo}`;
    }

    const reason = cleanText(proposal?.reason, 320) || currentObs?.evidence || '누적 성장 근거';
    const change = {
      id: changeId,
      domain,
      target,
      before,
      after: proposedTo,
      reason,
      date: cleanText(date, 10),
      time: cleanText(time, 5),
    };
    changes.push(change);
    nextGrowth.changes.push(change);
    for (const row of nextGrowth.evidence) {
      if (!row.consumed && row.domain === domain && row.target === target) {
        row.consumed = true;
        row.consumedBy = changeId;
      }
    }
    promotedKeys.add(key);
  }

  nextGrowth.evidence = nextGrowth.evidence.slice(-60);
  nextGrowth.changes = nextGrowth.changes.slice(-24);
  return {
    pc_patch: { stats: nextPc.stats, skills: nextPc.skills },
    growth: nextGrowth,
    observations,
    changes,
  };
}

function extractOutputText(response) {
  if (typeof response?.output_text === 'string' && response.output_text) return response.output_text;
  for (const item of response?.output || []) {
    if (item?.type !== 'message') continue;
    for (const content of item?.content || []) {
      if (content?.type === 'output_text' && typeof content.text === 'string') return content.text;
      if (content?.type === 'refusal') throw new Error(content.refusal || 'State Keeper가 응답을 거부했습니다.');
    }
  }
  return '';
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
    const runState = body.runState && typeof body.runState === 'object' ? body.runState : {};
    const pc = runState.pc && typeof runState.pc === 'object' ? runState.pc : {};
    const growth = normalizeGrowth(runState.growth);
    const turn = body.turn && typeof body.turn === 'object' ? body.turn : {};
    const action = cleanText(body.action || '(이어하기)', MAX_ACTION_CHARS);
    const scene = runState.scene && typeof runState.scene === 'object' ? runState.scene : {};
    const input = buildStateKeeperInput({ pc, growth, action, turn, scene });

    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_STATE_MODEL || process.env.OPENAI_MODEL || 'gpt-5.6-terra',
        store: false,
        instructions: STATE_KEEPER_INSTRUCTIONS,
        input,
        reasoning: { effort: 'low' },
        max_output_tokens: 1800,
        text: {
          format: {
            type: 'json_schema',
            name: 'lumensia_growth_state_keeper',
            strict: true,
            schema: STATE_SCHEMA,
          },
        },
      }),
      signal: AbortSignal.timeout(60_000),
    });

    const raw = await apiResponse.text();
    let response;
    try { response = raw ? JSON.parse(raw) : {}; }
    catch { throw new Error(`State Keeper가 JSON이 아닌 응답을 반환했습니다. HTTP ${apiResponse.status}`); }
    if (!apiResponse.ok) throw new Error(response?.error?.message || `State Keeper 요청 실패: HTTP ${apiResponse.status}`);

    const outputText = extractOutputText(response);
    if (!outputText) throw new Error('State Keeper 응답이 비어 있습니다.');
    let decision;
    try { decision = JSON.parse(outputText); }
    catch { throw new Error('State Keeper structured output을 해석하지 못했습니다.'); }

    const applied = applyGrowthDecision({
      pc,
      growth,
      decision,
      date: scene.date,
      time: scene.time,
    });

    return json(res, 200, {
      ...applied,
      model: response?.model || process.env.OPENAI_STATE_MODEL || process.env.OPENAI_MODEL || 'gpt-5.6-terra',
      request_id: response?.id || null,
      usage: response?.usage || null,
    });
  } catch (error) {
    const timeout = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    return json(res, timeout ? 504 : 500, {
      error: timeout ? 'State Keeper 응답 시간이 초과되었습니다.' : (error?.message || 'State Keeper 오류'),
      code: timeout ? 'STATE_KEEPER_TIMEOUT' : 'STATE_KEEPER_ERROR',
    });
  }
}
