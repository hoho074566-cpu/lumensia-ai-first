const GRADE_PATTERN = 'SSS\\+|SSS-|SSS|SS\\+|SS-|SS|S\\+\\+|S\\+|S-|S|A\\+\\+|A\\+|A-|A|B\\+|B-|B|C\\+|C-|C|D\\+|D-|D|E\\+|E-|E|F\\+|F';
const RICH_SKILL_RE = new RegExp(`^(.+?)\\s*[:：]\\s*(${GRADE_PATTERN})(\\s*(?:—|–|-)\\s*.+)?$`, 'i');
const SIMPLE_SKILL_RE = new RegExp(`^(.+?)\\s*[:：]\\s*(${GRADE_PATTERN})$`, 'i');

function cloneJson(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function parseRichGradedSkill(value = '') {
  const text = String(value || '').trim();
  const match = text.match(RICH_SKILL_RE);
  if (!match) return null;
  return {
    name: match[1].trim(),
    grade: match[2].toUpperCase(),
    suffix: match[3] || '',
    original: text,
  };
}

function parseSimpleGradedSkill(value = '') {
  const text = String(value || '').trim();
  const match = text.match(SIMPLE_SKILL_RE);
  if (!match) return null;
  return { name: match[1].trim(), grade: match[2].toUpperCase(), original: text };
}

export function keeperSkillShadow(skills = []) {
  return (Array.isArray(skills) ? skills : []).map((row) => {
    const parsed = parseRichGradedSkill(row);
    return parsed ? `${parsed.name}:${parsed.grade}` : String(row || '').trim();
  }).filter(Boolean);
}

export function restoreRichSkillDescriptions(originalSkills = [], patchedSkills = []) {
  const richByName = new Map();
  for (const row of Array.isArray(originalSkills) ? originalSkills : []) {
    const parsed = parseRichGradedSkill(row);
    if (parsed?.suffix) richByName.set(parsed.name, parsed.suffix);
  }
  return (Array.isArray(patchedSkills) ? patchedSkills : []).map((row) => {
    const parsed = parseSimpleGradedSkill(row) || parseRichGradedSkill(row);
    if (!parsed) return String(row || '').trim();
    const suffix = richByName.get(parsed.name) || '';
    return `${parsed.name}:${parsed.grade}${suffix}`;
  }).filter(Boolean);
}

export function restoreExistingEquipmentDescriptions(originalEquipment = [], patchedEquipment = [], keeperLimit = 160) {
  const originals = (Array.isArray(originalEquipment) ? originalEquipment : []).map((row) => String(row || '').trim()).filter(Boolean);
  return (Array.isArray(patchedEquipment) ? patchedEquipment : []).map((row) => {
    const text = String(row || '').trim();
    const exact = originals.find((original) => original === text);
    if (exact) return exact;
    const restored = originals.find((original) => original.length > keeperLimit && original.slice(0, keeperLimit) === text);
    return restored || text;
  }).filter(Boolean);
}

function splitText(text, maxChars) {
  const out = [];
  let rest = String(text || '');
  while (rest.length > maxChars) {
    let cut = rest.lastIndexOf('\n', maxChars);
    if (cut < Math.floor(maxChars * 0.55)) cut = rest.lastIndexOf(' ', maxChars);
    if (cut < Math.floor(maxChars * 0.55)) cut = maxChars;
    out.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest) out.push(rest);
  return out;
}

export function splitSceneForKeeper(scene = [], maxChars = 2300) {
  const out = [];
  for (const beat of Array.isArray(scene) ? scene : []) {
    const text = String(beat?.text || '');
    const chunks = splitText(text, maxChars);
    if (!chunks.length) continue;
    for (const chunk of chunks) out.push({ ...beat, text: chunk });
  }
  return out;
}

export function compactWriterRunState(runState = {}, maxHistory = 8) {
  const copy = cloneJson(runState) || {};
  copy.history = (Array.isArray(copy.history) ? copy.history : []).slice(-maxHistory);
  return copy;
}

export function compactKeeperRunState(runState = {}) {
  const source = runState && typeof runState === 'object' ? runState : {};
  const copy = {
    version: source.version,
    id: source.id,
    scenarioId: source.scenarioId,
    knowledgeLevel: source.knowledgeLevel,
    pc: cloneJson(source.pc || {}),
    growth: cloneJson(source.growth || {}),
    relationships: cloneJson(source.relationships || {}),
    continuityMemory: cloneJson(source.continuityMemory || {}),
    scene: cloneJson(source.scene || {}),
  };
  if (copy.pc) copy.pc.skills = keeperSkillShadow(copy.pc.skills);
  return copy;
}

export function prepareWriterBody(body = {}) {
  const copy = cloneJson(body) || {};
  copy.runState = compactWriterRunState(copy.runState || {});
  return copy;
}

export function prepareKeeperBody(body = {}) {
  const copy = cloneJson(body) || {};
  copy.runState = compactKeeperRunState(copy.runState || {});
  if (copy.turn && typeof copy.turn === 'object') {
    copy.turn.scene = splitSceneForKeeper(copy.turn.scene, 2300);
  }
  return copy;
}

export function restoreKeeperPayload(payload = {}, originalRunState = {}) {
  const copy = cloneJson(payload) || {};
  const originalPc = originalRunState?.pc || {};
  if (Array.isArray(copy?.pc_patch?.skills)) {
    copy.pc_patch.skills = restoreRichSkillDescriptions(originalPc.skills, copy.pc_patch.skills);
  }
  if (Array.isArray(copy?.pc_patch?.equipment)) {
    copy.pc_patch.equipment = restoreExistingEquipmentDescriptions(originalPc.equipment, copy.pc_patch.equipment);
  }
  return copy;
}
