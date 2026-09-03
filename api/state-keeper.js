import charactersData from '../data/canon/characters/characters.json' with { type: 'json' };

export const config = { maxDuration: 120 };

export const GRADE_LADDER = Object.freeze([
  'F','F+','E-','E','E+','D-','D','D+','C-','C','C+','B-','B','B+','A-','A','A+','A++',
  'S-','S','S+','S++','SS-','SS','SS+','SSS-','SSS','SSS+',
]);

const CHARACTERS = charactersData.characters || {};
const CHARACTER_KEYS = new Set(Object.keys(CHARACTERS));
const STAT_KEYS = Object.freeze(['body', 'mana', 'intelligence', 'holy']);
const SIGNIFICANCE = new Set(['minor', 'meaningful', 'breakthrough']);
const RELATION_SIGNIFICANCE = new Set(['minor', 'meaningful', 'milestone']);
const DEFAULT_RELATION = '아는 사이';
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
    relationship_observations: {
      type: 'array',
      maxItems: 8,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          npc_key: { type: 'string', minLength: 1, maxLength: 64 },
          evidence: { type: 'string', minLength: 1, maxLength: 320 },
          significance: { type: 'string', enum: ['minor', 'meaningful', 'milestone'] },
        },
        required: ['npc_key', 'evidence', 'significance'],
      },
    },
    relationship_changes: {
      type: 'array',
      maxItems: 4,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          npc_key: { type: 'string', minLength: 1, maxLength: 64 },
          before_main: { type: 'string', minLength: 1, maxLength: 24 },
          after_main: { type: 'string', minLength: 1, maxLength: 24 },
          before_aux: { type: 'array', maxItems: 3, items: { type: 'string', minLength: 1, maxLength: 20 } },
          after_aux: { type: 'array', maxItems: 3, items: { type: 'string', minLength: 1, maxLength: 20 } },
          reason: { type: 'string', minLength: 1, maxLength: 320 },
          notice: { type: 'string', minLength: 1, maxLength: 140 },
        },
        required: ['npc_key', 'before_main', 'after_main', 'before_aux', 'after_aux', 'reason', 'notice'],
      },
    },
    pc_state_changes: {
      type: 'object',
      additionalProperties: false,
      properties: {
        equipment_add: { type: 'array', maxItems: 8, items: { type: 'string', minLength: 1, maxLength: 160 } },
        equipment_remove: { type: 'array', maxItems: 8, items: { type: 'string', minLength: 1, maxLength: 160 } },
        conditions_add: { type: 'array', maxItems: 8, items: { type: 'string', minLength: 1, maxLength: 180 } },
        conditions_remove: { type: 'array', maxItems: 8, items: { type: 'string', minLength: 1, maxLength: 180 } },
        gold_delta: { type: 'integer', minimum: -1000000000, maximum: 1000000000 },
        evidence: { type: 'array', maxItems: 8, items: { type: 'string', minLength: 1, maxLength: 320 } },
      },
      required: ['equipment_add', 'equipment_remove', 'conditions_add', 'conditions_remove', 'gold_delta', 'evidence'],
    },
    scene_state: {
      type: 'object',
      additionalProperties: false,
      properties: {
        date: { type: 'string', minLength: 10, maxLength: 10 },
        time: { type: 'string', minLength: 5, maxLength: 5 },
        location: { type: 'string', minLength: 1, maxLength: 220 },
        situation: { type: 'string', minLength: 1, maxLength: 700 },
        present_character_keys: { type: 'array', maxItems: 8, items: { type: 'string', minLength: 1, maxLength: 64 } },
      },
      required: ['date', 'time', 'location', 'situation', 'present_character_keys'],
    },
    continuity_memory: {
      type: 'object',
      additionalProperties: false,
      properties: {
        facts: { type: 'array', maxItems: 14, items: { type: 'string', minLength: 1, maxLength: 240 } },
        exchanges: { type: 'array', maxItems: 10, items: { type: 'string', minLength: 1, maxLength: 240 } },
        open_threads: { type: 'array', maxItems: 10, items: { type: 'string', minLength: 1, maxLength: 240 } },
      },
      required: ['facts', 'exchanges', 'open_threads'],
    },
  },
  required: ['observations', 'promotions', 'relationship_observations', 'relationship_changes', 'pc_state_changes', 'scene_state', 'continuity_memory'],
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

function normalizeAux(value = [], main = '') {
  const out = [];
  for (const item of Array.isArray(value) ? value : []) {
    const tag = cleanText(item, 20);
    if (!tag || tag === main || out.includes(tag)) continue;
    out.push(tag);
    if (out.length >= 3) break;
  }
  return out;
}

function normalizeRelationshipRecord(raw = {}) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const main = cleanText(source.main, 24) || DEFAULT_RELATION;
  const evidence = (Array.isArray(source.evidence) ? source.evidence : []).slice(-16).map((row, index) => ({
    id: cleanText(row?.id || `rel-legacy-${index}`, 80),
    note: cleanText(row?.note, 320),
    significance: RELATION_SIGNIFICANCE.has(row?.significance) ? row.significance : 'minor',
    date: cleanText(row?.date, 10),
    time: cleanText(row?.time, 5),
  })).filter((row) => row.note);
  const changes = (Array.isArray(source.changes) ? source.changes : []).slice(-12).map((row, index) => {
    const beforeMain = cleanText(row?.before_main || row?.beforeMain, 24) || DEFAULT_RELATION;
    const afterMain = cleanText(row?.after_main || row?.afterMain, 24) || DEFAULT_RELATION;
    return {
      id: cleanText(row?.id || `rel-change-legacy-${index}`, 80),
      before_main: beforeMain,
      after_main: afterMain,
      before_aux: normalizeAux(row?.before_aux || row?.beforeAux, beforeMain),
      after_aux: normalizeAux(row?.after_aux || row?.afterAux, afterMain),
      reason: cleanText(row?.reason, 320),
      notice: cleanText(row?.notice, 140),
      date: cleanText(row?.date, 10),
      time: cleanText(row?.time, 5),
    };
  });
  return { main, aux: normalizeAux(source.aux, main), evidence, changes, updatedAt: cleanText(source.updatedAt, 32) };
}

export function normalizeRelationships(raw = {}) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const out = {};
  for (const [key, value] of Object.entries(source)) {
    if (!CHARACTER_KEYS.has(key)) continue;
    out[key] = normalizeRelationshipRecord(value);
  }
  return out;
}

function uniqueTexts(value, maxItems, maxChars) {
  const out = [];
  for (const item of Array.isArray(value) ? value : []) {
    const text = cleanText(item, maxChars);
    if (!text || out.includes(text)) continue;
    out.push(text);
    if (out.length >= maxItems) break;
  }
  return out;
}

export function normalizeContinuityMemory(raw = {}) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  return {
    version: 1,
    facts: uniqueTexts(source.facts, 14, 240),
    exchanges: uniqueTexts(source.exchanges, 10, 240),
    openThreads: uniqueTexts(source.openThreads || source.open_threads, 10, 240),
    updatedAt: cleanText(source.updatedAt, 32),
  };
}

export function sceneText(scene = []) {
  const text = (Array.isArray(scene) ? scene : []).map((beat) => cleanText(beat?.text, 2400)).filter(Boolean).join('\n\n');
  if (text.length <= MAX_SCENE_CHARS) return text;
  const marker = '\n\n[...중간 장면 생략 — 시작과 결말을 함께 제공...]\n\n';
  const headChars = 4000;
  const tailChars = Math.max(0, MAX_SCENE_CHARS - headChars - marker.length);
  return `${text.slice(0, headChars)}${marker}${text.slice(-tailChars)}`;
}

function stateSnapshot(pc = {}) {
  const stats = pc.stats && typeof pc.stats === 'object' ? pc.stats : {};
  const skills = (Array.isArray(pc.skills) ? pc.skills : []).map((row) => cleanText(row, 160)).filter(Boolean).slice(0, 24);
  const equipment = uniqueTexts(pc.equipment, 24, 160);
  const conditions = uniqueTexts(pc.conditions, 16, 180);
  const talents = pc.talents && typeof pc.talents === 'object' ? pc.talents : {};
  const gold = Number.isFinite(Number(pc.startingGold)) ? Math.max(0, Math.trunc(Number(pc.startingGold))) : 0;
  return [
    `PC: ${cleanText(pc.name, 80)}`,
    `무의 경지: ${cleanText(pc.realm, 120) || '-'}`,
    `마법 써클: ${pc.magicCircle == null || pc.magicCircle === '' ? '-' : pc.magicCircle}`,
    `재능: 魔 ${talents.magic ?? '-'} / 武 ${talents.martial ?? '-'} / 魂 ${talents.soul ?? '-'} / 智 ${talents.knowledge ?? '-'}`,
    `스탯: 신체 ${cleanText(stats.body, 16) || '-'} / 마나 ${cleanText(stats.mana, 16) || '-'} / 지능 ${cleanText(stats.intelligence, 16) || '-'} / 신성 ${cleanText(stats.holy, 16) || '-'}`,
    `스킬: ${skills.join(' / ') || '-'}`,
    `장비/소지품: ${equipment.join(' / ') || '-'}`,
    `현재 상태/부상: ${conditions.join(' / ') || '-'}`,
    `금화: ${gold}`,
  ].join('\n');
}

function unconsumedEvidenceText(growth) {
  const rows = growth.evidence.filter((row) => !row.consumed).slice(-20);
  if (!rows.length) return '(아직 미소비 성장 근거 없음)';
  return rows.map((row) => `- ${row.domain}:${row.target} [${row.significance}] ${row.note}`).join('\n');
}

function characterRosterText() {
  return Object.entries(CHARACTERS).map(([key, row]) => `${key}: ${cleanText(row?.name || key, 80)}`).join('\n');
}

function relationshipStateText(relationships = {}) {
  const rows = Object.entries(normalizeRelationships(relationships));
  if (!rows.length) return '(아직 PC와의 관계가 기록된 등록 인물 없음)';
  return rows.map(([key, relation]) => {
    const name = CHARACTERS[key]?.name || key;
    const label = [relation.main, ...relation.aux].filter(Boolean).join(' · ');
    const recent = relation.evidence.slice(-4).map((row) => `[${row.significance}] ${row.note}`).join(' / ');
    return `- ${key} (${name}): ${label}${recent ? ` | 최근 근거: ${recent}` : ''}`;
  }).join('\n');
}

function continuityMemoryText(memory = {}) {
  const normalized = normalizeContinuityMemory(memory);
  return [
    '확정 사실:',
    ...(normalized.facts.length ? normalized.facts.map((row) => `- ${row}`) : ['- 없음']),
    '이미 공유된 핵심 정보/대화:',
    ...(normalized.exchanges.length ? normalized.exchanges.map((row) => `- ${row}`) : ['- 없음']),
    '현재 미해결 흐름:',
    ...(normalized.openThreads.length ? normalized.openThreads.map((row) => `- ${row}`) : ['- 없음']),
  ].join('\n');
}

function sceneStateText(scene = {}) {
  return [
    `날짜: ${cleanText(scene.date, 10)}`,
    `시각: ${cleanText(scene.time, 5)}`,
    `장소: ${cleanText(scene.location, 220)}`,
    `상황: ${cleanText(scene.situation, 700)}`,
    `현재 등록 인물: ${(Array.isArray(scene.presentCharacterKeys) ? scene.presentCharacterKeys : []).join(', ') || '-'}`,
  ].join('\n');
}

export function buildStateKeeperInput({ pc = {}, growth = {}, relationships = {}, continuityMemory = {}, inputKind = 'intent', action = '', turn = {}, scene = {} } = {}) {
  const ledger = normalizeGrowth(growth);
  return [
    'TURN START PC STATE',
    stateSnapshot(pc),
    '',
    'TURN START SCENE STATE',
    sceneStateText(scene),
    '',
    'DURABLE CONTINUITY MEMORY',
    continuityMemoryText(continuityMemory),
    '',
    'UNCONSUMED GROWTH EVIDENCE',
    unconsumedEvidenceText(ledger),
    '',
    'CURRENT PC RELATIONSHIPS',
    relationshipStateText(relationships),
    '',
    'REGISTERED NPC KEYS',
    characterRosterText(),
    '',
    `INPUT KIND: ${inputKind === 'situation' ? 'SITUATION/NARRATION CONTEXT' : 'PC INTENT/ACTION'}`,
    'USER DECLARATION',
    cleanText(action || '(이어하기)', MAX_ACTION_CHARS),
    '',
    'WRITER-CONFIRMED RESULT',
    sceneText(turn?.scene),
  ].join('\n');
}

const STATE_KEEPER_INSTRUCTIONS = `너는 LUMENSIA의 State Keeper다. 소설을 쓰지 않는다. 방금 Writer가 확정한 장면을 읽고 PC 성장, PC-NPC 관계, PC의 실제 소지/상태/금화 변화, 장면 연속성과 실제로 생긴 사회적·세계적 후속 파장의 사실만 구조화한다. 사용자 입력은 시도/선언일 뿐이며 Writer 본문에서 실제 결과로 확인되지 않은 주장을 사실로 만들지 않는다. 단 INPUT KIND가 SITUATION/NARRATION CONTEXT라면 사용자가 제공한 장면 전제이지만, 그 전제가 이번 장면에서 어떻게 실현되었는지는 Writer 본문을 기준으로 정리한다.\n\n[성장]\nGROWTH-01A 범위는 기존 스킬 숙련 등급과 신체/마나/지능/신성 스탯 등급뿐이다. 무의 경지, 마법 써클, 재능, Trait, Authority는 성장 변경 제안하지 않는다. 새로운 스킬을 창작하거나 획득시키지 않는다. observations에는 실제 훈련, 교정, 실전 적용, 의미 있는 실패에서의 학습, 명시적 깨달음처럼 이후 성장 판단에 재사용할 가치가 있는 근거만 기록한다. promotions는 현재 턴의 실제 향상과 미소비 성장 근거를 함께 보아 질적으로 한 단계 올라갔다고 확신할 때만 제안한다. routine 한 번으로 승급시키지 않는다. 장면 자체가 명백한 breakthrough라면 이전 근거가 적어도 가능하다. 재능은 개연성에 영향을 줄 수 있지만 고정 배율이나 XP처럼 계산하지 않는다. 승급은 한 대상당 한 단계만 제안한다. 등급 사다리: F, F+, E-, E, E+, D-, D, D+, C-, C, C+, B-, B, B+, A-, A, A+, A++, S-, S, S+, S++, SS-, SS, SS+, SSS-, SSS, SSS+.\n\n[PC 사실 상태]\npc_state_changes는 성장 보상이 아니라 Writer 본문에서 실제로 확정된 물리적·경제적 변화만 기록한다. 사용자 선언만으로 장비를 얻거나 잃었다고 처리하지 않는다. 장비/소지품을 실제 획득·구매·양도·분실·파손·소모했다면 equipment_add/equipment_remove에 반영한다. 부상·피로·저주 같은 상태가 실제 생기거나 회복·해제됐다면 conditions_add/conditions_remove에 반영한다. 금화를 실제 지불·획득·분실했다면 gold_delta에 증감액을 기록한다. 단순히 식사·숙박·이동을 했다는 이유로 비용을 추정하지 않는다. 변화가 없으면 각 배열은 비우고 gold_delta=0으로 둔다. evidence에는 이 변경이 Writer 본문에서 확정된 짧은 근거만 적는다. 이 채널로 무의 경지, 마법 써클, 재능, Trait, Authority를 바꾸지 않는다.\n\n[관계]\n숫자 호감도/신뢰도 XP를 계산하지 않는다. relationship_observations에는 등록 NPC가 PC를 실제로 대하거나 반응한 방식 중 이후 관계 판단에 재사용할 가치가 있는 근거만 남긴다. 평범한 잡담이나 사소한 친절도 minor 근거가 될 수 있으나 그것만으로 매 턴 관계명을 바꾸지 않는다. 관계는 선형 사다리가 아니다. main은 현재 관계를 가장 잘 설명하는 짧고 지속적인 대표 관계명이다. 예: 아는 사이, 친한 동기, 친구, 절친, 호감, 연인, 사제, 경쟁자, 불신, 혐오, 적대. aux는 신뢰, 경계, 인정, 존중, 흥미, 불안, 의존, 질투, 거리감처럼 main을 보완하는 0~3개의 짧은 태그다. relationship_changes는 플레이어가 알아차릴 만한 관계의 의미가 실제로 달라졌을 때만 제안한다. 평범한 대화 한 번, 선물 한 번, 도움 한 번마다 관계를 바꾸지 않는다. main 변경은 누적된 과거 관계 근거와 현재 meaningful/milestone 장면이 함께 있거나, 현재 장면 자체가 명백한 milestone일 때만 제안한다. aux 변화는 현재 meaningful/milestone 근거가 있을 때만 제안한다. '연인'은 고백을 했다는 사실, 고백을 들었다는 사실, 얼굴을 붉혔다는 사실만으로 성립하지 않는다. Writer 장면에서 상호 고백 수락이나 연애 관계의 성립이 명백하게 확정된 milestone일 때만 main=연인을 제안한다. 혐오/적대처럼 강한 관계명도 실제 강한 반응이나 누적 근거가 있어야 한다. 사용자 입력에 '세라는 나를 좋아한다'라고 적혀 있어도 Writer가 그렇게 확정하지 않았다면 관계 변화가 아니다. notice는 관계 변화가 실제 적용될 때 플레이어에게 보여 줄 한 문장이다. 시스템 용어나 수치 없이 장면에서 확정된 의미만 짧게 쓴다.\n\n[연속성]\n이 항목은 이야기 계획이나 Director가 아니다. 이미 일어난 사실을 다음 Writer가 잊지 않도록 압축하는 기록이다. scene_state는 이번 Writer 장면이 끝난 실제 현재 상태를 적는다. 날짜/시각/장소가 장면에서 명확히 이동·경과하지 않았다면 기존 값을 유지한다. 시각을 임의로 크게 점프시키지 않는다. scene_state의 situation은 장면 끝의 실제 현재 상황만 적고, 이미 목적을 달성한 절차·평가·보고를 계속 진행 중인 일처럼 유지하지 않는다. present_character_keys에는 현재 장면 끝에 실제로 함께 있거나 즉시 이어지는 등록 인물만 넣는다. 이전 장면에 있었다는 이유만으로 유지하지 않는다. 장소 전환·시간 경과·각자의 일정이나 행동으로 자연스럽게 떠났다면 제거한다.\n\ncontinuity_memory는 매 턴 델타가 아니라 지금까지 유지해야 할 '완성된 compact snapshot'을 반환한다. facts에는 이미 발생해 다시 처음처럼 재발생하면 안 되는 주요 사건·만남·완료 사실과 현재도 중요한 세계 사실을 남긴다. exchanges에는 PC와 NPC 사이에 이미 질문·답변·설명·약속·의뢰·고백 등으로 명확히 공유된 핵심 정보를 적는다. 같은 설명이나 같은 질문을 새 정보처럼 반복하지 않도록 하는 용도다. open_threads에는 아직 해결되지 않았고 이후 장면에도 실제로 의미가 남아 있는 문제·약속·조사·위협과 살아 있는 사회적·세계적 후속 파장만 남긴다.\n\n[LIVING CONSEQUENCE]\nopen_threads는 별도의 퀘스트 엔진이 아니라 이미 생긴 결과 중 현재도 살아 있는 의미만 보존하는 semantic snapshot이다. 장면에서 실제로 확정됐고 이후에도 의미가 남는 경우에만 다음 짧은 태그를 사용할 수 있다: [약속] 서로 실제로 성립한 약속·합의, [빚·호의] 갚거나 돌려줄 의미가 실제로 생긴 도움·채무·부탁, [소문] Writer 장면에서 실제로 퍼지기 시작했거나 누군가에게 전달된 소문, [평판] 특정 집단이나 인물이 PC를 보는 방식이 실제 사건 때문에 눈에 띄게 형성·변화한 경우, [의무] 실제로 떠맡은 책임·역할, [후속] 사건 뒤 아직 남아 있는 현실적 여파, [NPC 진행] Writer 장면에서 실제로 드러난 NPC 자신의 연구·훈련·갈등·개인 진행. 예: '[약속] 릴리아와 다음 자유훈련 때 다시 대련하기로 서로 합의했다.', '[빚·호의] 클로에는 PC에게 받은 도움을 나중에 갚겠다고 명확히 말했다.', '[소문] 기사과 학생들 사이에 PC의 공개 대련 이야기가 실제로 퍼지기 시작했다.'처럼 기록한다.\n\n인상적인 일이 일어났다는 이유만으로 소문이나 평판이 자동 발생했다고 만들지 않는다. NPC가 미래에 무언가 할 것 같다는 추측을 [NPC 진행]으로 만들지 않는다. 관계 근거 하나하나를 후속 파장으로 복제하지 않는다. 명시된 날짜·조건이 실제 대화에서 확정됐다면 사실로 보존할 수 있지만 이를 자동 실행 예약이나 카운트다운으로 바꾸지 않는다. 후속 파장은 다음 Writer가 반드시 회수해야 하는 장면 지시가 아니다. 현재 장소·시간·인물·관계와 자연스럽게 관련될 때 반영할 수 있는 현재 사실일 뿐이다. 약속이 이행되거나 빚이 갚히거나 소문이 소멸·대체되거나 후속 문제가 해결되면 open_threads의 해당 항목을 제거한다. 역사적으로 중요한 완료 결과는 필요하면 facts에 짧게 남긴다.\n\n끝난 절차·평가·보고를 open_threads에 남겨 다음 Writer가 계속 붙잡게 하지 않는다. 끝난 흐름은 제거하고, 같은 뜻의 문장을 여러 개 쌓지 말며, 사소한 대사까지 전부 보존하지 않는다. 단계 번호, event stage, 스케줄러 상태를 만들지 않는다. 미래 사건을 계획하거나 다음 장면을 지시하지 않는다.\n\n예: 입학식 개막 종과 환영사가 이미 장면에서 끝났다면 facts에 그 사실을 남겨 다음 Writer가 입학식을 다시 처음부터 시작하지 않게 한다. 이사벨이 이미 PC의 출신을 물었고 답을 들었다면 exchanges에 압축해 같은 질문을 반복하지 않게 한다. 릴리아와 '다음에 대련하자'는 말이 상호 약속으로 확정됐다면 open_threads에 [약속]으로 남기되, 다음 장면에 릴리아를 강제로 등장시키거나 대련을 자동 시작하지 않는다.\n\n출력은 지정된 JSON schema만 따른다.`;

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
  return { domain, target, evidence, significance: SIGNIFICANCE.has(row?.significance) ? row.significance : 'minor' };
}

function normalizedRelationshipObservation(row) {
  const npcKey = cleanText(row?.npc_key, 64);
  if (!CHARACTER_KEYS.has(npcKey)) return null;
  const evidence = cleanText(row?.evidence, 320);
  if (!evidence) return null;
  return { npc_key: npcKey, evidence, significance: RELATION_SIGNIFICANCE.has(row?.significance) ? row.significance : 'minor' };
}

export function applyGrowthDecision({ pc = {}, growth = {}, decision = {}, date = '', time = '' } = {}) {
  const nextPc = { ...pc, stats: { ...(pc.stats && typeof pc.stats === 'object' ? pc.stats : {}) }, skills: Array.isArray(pc.skills) ? [...pc.skills] : [] };
  const nextGrowth = normalizeGrowth(growth);
  const priorUnconsumedKeys = new Set(nextGrowth.evidence.filter((row) => !row.consumed).map((row) => `${row.domain}:${row.target}`));
  const observations = (Array.isArray(decision?.observations) ? decision.observations : []).map((row) => normalizedObservation(row, nextPc)).filter(Boolean).slice(0, 8);
  const currentObservationKeys = new Set();
  let sequence = nextGrowth.evidence.length + nextGrowth.changes.length + 1;
  const batchId = Date.now().toString(36);
  for (const row of observations) {
    const id = `ev-${batchId}-${sequence++}`;
    nextGrowth.evidence.push({ id, domain: row.domain, target: row.target, note: row.evidence, significance: row.significance, date: cleanText(date, 10), time: cleanText(time, 5), consumed: false, consumedBy: '' });
    if (row.significance === 'meaningful' || row.significance === 'breakthrough') currentObservationKeys.add(`${row.domain}:${row.target}`);
  }
  const changes = [];
  const promotedKeys = new Set();
  for (const proposal of (Array.isArray(decision?.promotions) ? decision.promotions : []).slice(0, 3)) {
    const domain = proposal?.domain === 'stat' ? 'stat' : 'skill';
    const target = cleanText(proposal?.target, 100);
    const key = `${domain}:${target}`;
    if (promotedKeys.has(key) || !validTarget(domain, target, nextPc) || !currentObservationKeys.has(key)) continue;
    const before = currentGrade(domain, target, nextPc);
    const proposedFrom = cleanGrade(proposal?.from_grade);
    const proposedTo = cleanGrade(proposal?.to_grade);
    if (!before || proposedFrom !== before || proposedTo !== nextGrade(before) || proposedTo === before) continue;
    const currentObs = observations.find((row) => row.domain === domain && row.target === target);
    if (currentObs?.significance !== 'breakthrough' && !priorUnconsumedKeys.has(key)) continue;
    const changeId = `chg-${batchId}-${sequence++}`;
    if (domain === 'stat') nextPc.stats[target] = proposedTo;
    else {
      const existing = skillMap(nextPc.skills).get(target);
      if (!existing) continue;
      const index = nextPc.skills.findIndex((row) => cleanText(row, 160) === existing.original);
      if (index < 0) continue;
      nextPc.skills[index] = `${target}:${proposedTo}`;
    }
    const reason = cleanText(proposal?.reason, 320) || currentObs?.evidence || '누적 성장 근거';
    const change = { id: changeId, domain, target, before, after: proposedTo, reason, date: cleanText(date, 10), time: cleanText(time, 5) };
    changes.push(change);
    nextGrowth.changes.push(change);
    for (const row of nextGrowth.evidence) {
      if (!row.consumed && row.domain === domain && row.target === target) { row.consumed = true; row.consumedBy = changeId; }
    }
    promotedKeys.add(key);
  }
  nextGrowth.evidence = nextGrowth.evidence.slice(-60);
  nextGrowth.changes = nextGrowth.changes.slice(-24);
  return { pc_patch: { stats: nextPc.stats, skills: nextPc.skills }, growth: nextGrowth, observations, changes };
}

export function applyPcStateDecision({ pc = {}, decision = {} } = {}) {
  const raw = decision?.pc_state_changes && typeof decision.pc_state_changes === 'object' ? decision.pc_state_changes : {};
  const equipmentAdd = uniqueTexts(raw.equipment_add, 8, 160);
  const equipmentRemove = uniqueTexts(raw.equipment_remove, 8, 160);
  const conditionsAdd = uniqueTexts(raw.conditions_add, 8, 180);
  const conditionsRemove = uniqueTexts(raw.conditions_remove, 8, 180);
  const evidence = uniqueTexts(raw.evidence, 8, 320);
  const goldDelta = Number.isInteger(raw.gold_delta) ? Math.max(-1000000000, Math.min(1000000000, raw.gold_delta)) : 0;

  let equipment = uniqueTexts(pc.equipment, 24, 160).filter((item) => !equipmentRemove.includes(item));
  for (const item of equipmentAdd) if (!equipment.includes(item) && equipment.length < 24) equipment.push(item);

  let conditions = uniqueTexts(pc.conditions, 16, 180).filter((item) => !conditionsRemove.includes(item));
  for (const item of conditionsAdd) if (!conditions.includes(item) && conditions.length < 16) conditions.push(item);

  const currentGold = Number.isFinite(Number(pc.startingGold)) ? Math.max(0, Math.trunc(Number(pc.startingGold))) : 0;
  const startingGold = Math.max(0, currentGold + goldDelta);

  return {
    pc_patch: { equipment, conditions, startingGold },
    pc_state_changes: { equipment_add: equipmentAdd, equipment_remove: equipmentRemove, conditions_add: conditionsAdd, conditions_remove: conditionsRemove, gold_delta: goldDelta, evidence },
  };
}

function sameAux(a = [], b = []) {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

export function applyRelationshipDecision({ relationships = {}, decision = {}, date = '', time = '' } = {}) {
  const next = normalizeRelationships(relationships);
  const priorEvidenceKeys = new Set(Object.entries(next).filter(([, relation]) => relation.evidence.length > 0).map(([key]) => key));
  const observations = (Array.isArray(decision?.relationship_observations) ? decision.relationship_observations : []).map(normalizedRelationshipObservation).filter(Boolean).slice(0, 8);
  let sequence = Object.values(next).reduce((sum, relation) => sum + relation.evidence.length + relation.changes.length, 0) + 1;
  const batchId = Date.now().toString(36);
  const currentSignificance = new Map();
  const weight = { minor: 1, meaningful: 2, milestone: 3 };
  for (const row of observations) {
    if (!next[row.npc_key]) next[row.npc_key] = normalizeRelationshipRecord({});
    const relation = next[row.npc_key];
    relation.evidence.push({ id: `rel-ev-${batchId}-${sequence++}`, note: row.evidence, significance: row.significance, date: cleanText(date, 10), time: cleanText(time, 5) });
    relation.evidence = relation.evidence.slice(-16);
    relation.updatedAt = `${cleanText(date, 10)} ${cleanText(time, 5)}`.trim();
    const prior = currentSignificance.get(row.npc_key);
    if (!prior || weight[row.significance] > weight[prior]) currentSignificance.set(row.npc_key, row.significance);
  }
  const changes = [];
  const changedKeys = new Set();
  for (const proposal of (Array.isArray(decision?.relationship_changes) ? decision.relationship_changes : []).slice(0, 4)) {
    const npcKey = cleanText(proposal?.npc_key, 64);
    if (!CHARACTER_KEYS.has(npcKey) || changedKeys.has(npcKey) || !next[npcKey]) continue;
    const relation = next[npcKey];
    const beforeMain = cleanText(proposal?.before_main, 24) || DEFAULT_RELATION;
    const afterMain = cleanText(proposal?.after_main, 24) || DEFAULT_RELATION;
    const beforeAux = normalizeAux(proposal?.before_aux, beforeMain);
    const afterAux = normalizeAux(proposal?.after_aux, afterMain);
    if (beforeMain !== relation.main || !sameAux(beforeAux, relation.aux)) continue;
    const mainChanged = afterMain !== relation.main;
    const auxChanged = !sameAux(afterAux, relation.aux);
    if (!mainChanged && !auxChanged) continue;
    const significance = currentSignificance.get(npcKey);
    if (!significance || significance === 'minor') continue;
    if (mainChanged && significance !== 'milestone' && !priorEvidenceKeys.has(npcKey)) continue;
    if (afterMain === '연인' && significance !== 'milestone') continue;
    const reason = cleanText(proposal?.reason, 320);
    const notice = cleanText(proposal?.notice, 140);
    if (!reason || !notice) continue;
    const change = { id: `rel-chg-${batchId}-${sequence++}`, npc_key: npcKey, before_main: relation.main, after_main: afterMain, before_aux: [...relation.aux], after_aux: afterAux, reason, notice, date: cleanText(date, 10), time: cleanText(time, 5) };
    relation.main = afterMain;
    relation.aux = afterAux;
    relation.changes.push(change);
    relation.changes = relation.changes.slice(-12);
    relation.updatedAt = `${cleanText(date, 10)} ${cleanText(time, 5)}`.trim();
    changes.push(change);
    changedKeys.add(npcKey);
  }
  return { relationships: next, relationship_observations: observations, relationship_changes: changes };
}

export function applyContinuityDecision({ scene = {}, continuityMemory = {}, decision = {} } = {}) {
  const rawScene = decision?.scene_state && typeof decision.scene_state === 'object' ? decision.scene_state : {};
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(rawScene.date || '')) ? String(rawScene.date) : cleanText(scene.date, 10);
  const time = /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(rawScene.time || '')) ? String(rawScene.time) : cleanText(scene.time, 5);
  const location = cleanText(rawScene.location, 220) || cleanText(scene.location, 220);
  const situation = cleanText(rawScene.situation, 700) || cleanText(scene.situation, 700);
  const present = [...new Set((Array.isArray(rawScene.present_character_keys) ? rawScene.present_character_keys : []).filter((key) => CHARACTER_KEYS.has(key)))].slice(0, 8);
  const rawMemory = decision?.continuity_memory && typeof decision.continuity_memory === 'object' ? decision.continuity_memory : {};
  const normalized = normalizeContinuityMemory({
    facts: rawMemory.facts,
    exchanges: rawMemory.exchanges,
    openThreads: rawMemory.open_threads,
    updatedAt: new Date().toISOString(),
  });
  return {
    scene_state: { date, time, location, situation, present_character_keys: present },
    continuity_memory: normalized,
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
  if (requiredToken && req.headers['x-lumensia-token'] !== requiredToken) return json(res, 401, { error: '접속 토큰이 없거나 올바르지 않습니다.', code: 'BAD_ACCESS_TOKEN' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const runState = body.runState && typeof body.runState === 'object' ? body.runState : {};
    const pc = runState.pc && typeof runState.pc === 'object' ? runState.pc : {};
    const growth = normalizeGrowth(runState.growth);
    const relationships = normalizeRelationships(runState.relationships);
    const continuityMemory = normalizeContinuityMemory(runState.continuityMemory);
    const turn = body.turn && typeof body.turn === 'object' ? body.turn : {};
    const action = cleanText(body.action || '(이어하기)', MAX_ACTION_CHARS);
    const inputKind = body.inputKind === 'situation' ? 'situation' : 'intent';
    const scene = runState.scene && typeof runState.scene === 'object' ? runState.scene : {};
    const input = buildStateKeeperInput({ pc, growth, relationships, continuityMemory, inputKind, action, turn, scene });
    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_STATE_MODEL || process.env.OPENAI_MODEL || 'gpt-5.6-terra',
        store: false,
        instructions: STATE_KEEPER_INSTRUCTIONS,
        input,
        reasoning: { effort: 'low' },
        max_output_tokens: 4200,
        text: { format: { type: 'json_schema', name: 'lumensia_state_keeper', strict: true, schema: STATE_SCHEMA } },
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
    const continuityApplied = applyContinuityDecision({ scene, continuityMemory, decision });
    const recordDate = continuityApplied.scene_state.date || scene.date;
    const recordTime = continuityApplied.scene_state.time || scene.time;
    const growthApplied = applyGrowthDecision({ pc, growth, decision, date: recordDate, time: recordTime });
    const pcStateApplied = applyPcStateDecision({ pc, decision });
    const relationshipApplied = applyRelationshipDecision({ relationships, decision, date: recordDate, time: recordTime });
    return json(res, 200, {
      ...growthApplied,
      pc_patch: { ...growthApplied.pc_patch, ...pcStateApplied.pc_patch },
      pc_state_changes: pcStateApplied.pc_state_changes,
      ...relationshipApplied,
      ...continuityApplied,
      model: response?.model || process.env.OPENAI_STATE_MODEL || process.env.OPENAI_MODEL || 'gpt-5.6-terra',
      request_id: response?.id || null,
      usage: response?.usage || null,
    });
  } catch (error) {
    const timeout = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    return json(res, timeout ? 504 : 500, { error: timeout ? 'State Keeper 응답 시간이 초과되었습니다.' : (error?.message || 'State Keeper 오류'), code: timeout ? 'STATE_KEEPER_TIMEOUT' : 'STATE_KEEPER_ERROR' });
  }
}