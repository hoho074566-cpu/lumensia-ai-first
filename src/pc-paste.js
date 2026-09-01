const MULTILINE_FIELDS = new Set([
  'appearance','background','characterProfile','traits','authorities','skills','equipment','conditions',
]);

const ALIASES = new Map([
  ['이름','name'], ['name','name'],
  ['나이','age'], ['age','age'],
  ['성별','gender'], ['gender','gender'],
  ['학과','department'], ['department','department'],
  ['출신','origin'], ['출신지','origin'], ['origin','origin'],
  ['신분','socialStatus'], ['socialstatus','socialStatus'], ['사회적신분','socialStatus'],
  ['입학방식','admission'], ['입학','admission'], ['admission','admission'],
  ['무의경지','realm'], ['경지','realm'], ['realm','realm'],
  ['마법써클','magicCircle'], ['써클','magicCircle'], ['magiccircle','magicCircle'], ['circle','magicCircle'],
  ['초기금화','startingGold'], ['금화','startingGold'], ['startinggold','startingGold'],
  ['외형','appearance'], ['appearance','appearance'],
  ['배경','background'], ['background','background'],
  ['캐릭터프로필','characterProfile'], ['프로필','characterProfile'], ['성격','characterProfile'], ['characterprofile','characterProfile'],
  ['trait','traits'], ['traits','traits'], ['특성','traits'],
  ['authority','authorities'], ['authorities','authorities'], ['권능','authorities'],
  ['초기스킬','skills'], ['스킬','skills'], ['skills','skills'],
  ['초기장비','equipment'], ['장비','equipment'], ['소지품','equipment'], ['equipment','equipment'],
  ['현재상태','conditions'], ['상태','conditions'], ['conditions','conditions'],
  ['재능','__talents'], ['talents','__talents'],
  ['스탯','__stats'], ['stats','__stats'],
  ['마법재능','talentMagic'], ['talentmagic','talentMagic'],
  ['무재능','talentMartial'], ['무술재능','talentMartial'], ['talentmartial','talentMartial'],
  ['영혼재능','talentSoul'], ['talentsoul','talentSoul'],
  ['지식재능','talentKnowledge'], ['talentknowledge','talentKnowledge'],
  ['신체','statBody'], ['statbody','statBody'],
  ['마나','statMana'], ['statmana','statMana'],
  ['지능','statIntelligence'], ['statintelligence','statIntelligence'],
  ['신성','statHoly'], ['statholy','statHoly'],
]);

function cleanLabel(value) {
  return String(value || '')
    .trim()
    .replace(/^[-*#\s]+/, '')
    .replace(/[\[\](){}]/g, '')
    .replace(/[\s_\-]+/g, '')
    .toLowerCase();
}

function stripFence(value) {
  const text = String(value || '').trim();
  const match = text.match(/^```(?:json|txt|text)?\s*\n?([\s\S]*?)\n?```$/i);
  return match ? match[1].trim() : text;
}

function stringValue(value) {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map((item) => String(item ?? '').trim()).filter(Boolean).join('\n');
  if (typeof value === 'object') return '';
  return String(value).trim();
}

function boundedNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  return String(Math.min(max, Math.max(min, Math.trunc(number))));
}

function jsonToFormValues(raw = {}) {
  const source = raw?.pc && typeof raw.pc === 'object' && !Array.isArray(raw.pc) ? raw.pc : raw;
  if (!source || typeof source !== 'object' || Array.isArray(source)) return {};
  const out = {};
  const direct = [
    ['name','name'], ['age','age'], ['gender','gender'], ['department','department'], ['origin','origin'],
    ['socialStatus','socialStatus'], ['admission','admission'], ['realm','realm'], ['magicCircle','magicCircle'],
    ['startingGold','startingGold'], ['appearance','appearance'], ['background','background'],
    ['characterProfile','characterProfile'], ['traits','traits'], ['authorities','authorities'], ['skills','skills'],
    ['equipment','equipment'], ['conditions','conditions'],
  ];
  for (const [sourceKey, formKey] of direct) {
    const value = stringValue(source[sourceKey]);
    if (value !== '') out[formKey] = value;
  }
  const talents = source.talents && typeof source.talents === 'object' && !Array.isArray(source.talents) ? source.talents : {};
  const stats = source.stats && typeof source.stats === 'object' && !Array.isArray(source.stats) ? source.stats : {};
  const talentMap = { magic: 'talentMagic', martial: 'talentMartial', soul: 'talentSoul', knowledge: 'talentKnowledge' };
  const statMap = { body: 'statBody', mana: 'statMana', intelligence: 'statIntelligence', holy: 'statHoly' };
  for (const [key, formKey] of Object.entries(talentMap)) {
    const value = boundedNumber(talents[key], 1, 10);
    if (value) out[formKey] = value;
  }
  for (const [key, formKey] of Object.entries(statMap)) {
    const value = stringValue(stats[key]);
    if (value) out[formKey] = value;
  }
  return out;
}

function appendValue(out, key, value) {
  const text = String(value || '').trim();
  if (!key || !text) return;
  if (MULTILINE_FIELDS.has(key) && out[key]) out[key] = `${out[key]}\n${text}`;
  else out[key] = text;
}

function parseNamedPairs(text, pairs) {
  const out = {};
  const normalized = String(text || '').replace(/[|,]/g, '/');
  for (const chunk of normalized.split('/')) {
    const part = chunk.trim();
    if (!part) continue;
    for (const [pattern, key] of pairs) {
      const match = part.match(pattern);
      if (match) {
        out[key] = match[1].trim();
        break;
      }
    }
  }
  return out;
}

function parseTalentText(text) {
  return parseNamedPairs(text, [
    [/^(?:마법|magic)\s*[:=]?\s*(\d{1,2})$/i, 'talentMagic'],
    [/^(?:무|무술|martial)\s*[:=]?\s*(\d{1,2})$/i, 'talentMartial'],
    [/^(?:영혼|soul)\s*[:=]?\s*(\d{1,2})$/i, 'talentSoul'],
    [/^(?:지식|knowledge)\s*[:=]?\s*(\d{1,2})$/i, 'talentKnowledge'],
  ]);
}

function parseStatText(text) {
  return parseNamedPairs(text, [
    [/^(?:신체|body)\s*[:=]?\s*([^\s]+)$/i, 'statBody'],
    [/^(?:마나|mana)\s*[:=]?\s*([^\s]+)$/i, 'statMana'],
    [/^(?:지능|intelligence)\s*[:=]?\s*([^\s]+)$/i, 'statIntelligence'],
    [/^(?:신성|holy)\s*[:=]?\s*([^\s]+)$/i, 'statHoly'],
  ]);
}

function parsePlainText(text) {
  const out = {};
  let current = '';
  let specialBuffer = '';

  const flushSpecial = () => {
    if (current === '__talents' && specialBuffer.trim()) Object.assign(out, parseTalentText(specialBuffer));
    if (current === '__stats' && specialBuffer.trim()) Object.assign(out, parseStatText(specialBuffer));
    specialBuffer = '';
  };

  for (const rawLine of String(text || '').split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      if (MULTILINE_FIELDS.has(current) && out[current] && !out[current].endsWith('\n')) out[current] += '\n';
      continue;
    }

    const match = line.match(/^\s*([^:：]{1,40})\s*[:：]\s*(.*)$/);
    const alias = match ? ALIASES.get(cleanLabel(match[1])) : '';
    if (alias) {
      flushSpecial();
      current = alias;
      const value = match[2].trim();
      if (alias === '__talents' || alias === '__stats') specialBuffer = value;
      else appendValue(out, alias, value);
      continue;
    }

    if ((current === '__talents' || current === '__stats')) {
      specialBuffer += `${specialBuffer ? ' / ' : ''}${line.trim()}`;
      continue;
    }
    if (MULTILINE_FIELDS.has(current)) appendValue(out, current, line.trim());
  }
  flushSpecial();

  for (const key of ['talentMagic','talentMartial','talentSoul','talentKnowledge']) {
    if (out[key]) out[key] = boundedNumber(out[key], 1, 10);
  }
  if (out.age) out.age = boundedNumber(out.age, 1, 300);
  if (out.magicCircle) out.magicCircle = boundedNumber(out.magicCircle, 0, 9);
  if (out.startingGold) {
    const number = Number(String(out.startingGold).replace(/,/g, ''));
    out.startingGold = Number.isFinite(number) ? String(Math.max(0, Math.trunc(number))) : '';
  }
  for (const key of MULTILINE_FIELDS) {
    if (out[key]) out[key] = out[key].replace(/\n{3,}/g, '\n\n').trim();
  }
  return out;
}

export function parsePcSettings(rawText) {
  const text = stripFence(rawText);
  if (!text) return { values: {}, format: 'empty' };
  try {
    const parsed = JSON.parse(text);
    const values = jsonToFormValues(parsed);
    if (Object.keys(values).length) return { values, format: 'json' };
  } catch {
    // Human-readable setting blocks are expected and fall through here.
  }
  return { values: parsePlainText(text), format: 'text' };
}

export function applyPcSettingsToForm(form, values = {}) {
  if (!form || !values || typeof values !== 'object') return [];
  const applied = [];
  for (const [name, value] of Object.entries(values)) {
    const field = form.elements?.namedItem?.(name);
    if (!field || value == null || value === '') continue;
    field.value = String(value);
    applied.push(name);
  }
  return applied;
}
