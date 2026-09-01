import { CHARACTER_NAMES } from '/assets/manifest.js';

const SAVE_KEY = 'lumensia.ai-first.v0.save.1';
const STAT_KEYS = Object.freeze(['body', 'mana', 'intelligence', 'holy']);
const STAT_LABELS = Object.freeze({ body: '신체', mana: '마나', intelligence: '지능', holy: '신성' });
const TALENT_KEYS = Object.freeze(['magic', 'martial', 'soul', 'knowledge']);
const TALENT_LABELS = Object.freeze({ magic: '魔', martial: '武', soul: '魂', knowledge: '智' });

const el = (id) => document.getElementById(id);
const statusButton = el('statusButton');
const statusDialog = el('statusDialog');
const statusSummary = el('statusSummary');
const statusEditor = el('statusEditor');
const statusEditButton = el('statusEditButton');
const statusCloseButton = el('statusCloseButton');
const statusSaveButton = el('statusSaveButton');
const pcForm = el('pcForm');

function loadRun() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    return parsed && parsed.pc && parsed.pc.name ? parsed : null;
  } catch {
    return null;
  }
}

function saveRun(run) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(run));
}

function cleanGrade(value) {
  return String(value ?? '').trim().slice(0, 16);
}

function normalizeStats(raw = {}) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  return Object.fromEntries(STAT_KEYS.map((key) => [key, cleanGrade(source[key])]));
}

function normalizeList(value, maxItems = 24, maxChars = 220) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, maxItems)
    .map((item) => String(item ?? '').trim().slice(0, maxChars))
    .filter(Boolean);
}

function splitEditorLines(value, maxItems = 24, maxChars = 220) {
  return String(value || '')
    .split(/\n+/)
    .map((item) => item.trim().slice(0, maxChars))
    .filter(Boolean)
    .slice(0, maxItems);
}

function splitInitialList(value, maxItems = 24, maxChars = 220) {
  return String(value || '')
    .split(/[\n,]/)
    .map((item) => item.trim().slice(0, maxChars))
    .filter(Boolean)
    .slice(0, maxItems);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}

function valueOrDash(value) {
  const text = String(value ?? '').trim();
  return text || '—';
}

function listSection(title, values, extraClass = '') {
  const list = normalizeList(values);
  return `<section class="status-list-section ${extraClass}">
    <div class="status-section-title">${escapeHtml(title)}</div>
    ${list.length
      ? `<div class="status-chip-list">${list.map((item) => `<span class="status-chip">${escapeHtml(item)}</span>`).join('')}</div>`
      : '<div class="status-empty">없음</div>'}
  </section>`;
}

function relationshipSection(raw = {}) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const rows = Object.entries(source).map(([key, relation]) => {
    if (!relation || typeof relation !== 'object' || Array.isArray(relation)) return null;
    const main = String(relation.main || '아는 사이').trim().slice(0, 24) || '아는 사이';
    const aux = normalizeList(relation.aux, 3, 20).filter((tag) => tag !== main);
    return {
      key,
      name: CHARACTER_NAMES[key] || key,
      main,
      aux,
      updatedAt: String(relation.updatedAt || ''),
    };
  }).filter(Boolean);

  rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return `<section class="status-list-section status-relationship-section">
    <div class="status-section-title">RELATIONSHIP</div>
    ${rows.length
      ? `<div class="status-relationship-list">${rows.map((row) => `
        <article class="status-relationship-row">
          <span>${escapeHtml(row.name)}</span>
          <strong>${escapeHtml(row.main)}${row.aux.length ? `<small> · ${escapeHtml(row.aux.join(' · '))}</small>` : ''}</strong>
        </article>`).join('')}</div>`
      : '<div class="status-empty">아직 기록된 관계 없음</div>'}
  </section>`;
}

function renderStatusSummary(run = loadRun()) {
  if (!run) {
    statusSummary.innerHTML = '<div class="status-empty status-empty-large">현재 PC 세이브가 없습니다.</div>';
    return;
  }

  const pc = run.pc || {};
  const stats = normalizeStats(pc.stats);
  const talents = pc.talents && typeof pc.talents === 'object' ? pc.talents : {};
  const identity = [pc.age ? `${pc.age}세` : '', pc.gender, pc.department].filter(Boolean).join(' · ');
  const origin = [pc.origin, pc.socialStatus].filter(Boolean).join(' · ');

  statusSummary.innerHTML = `
    <section class="status-identity-card">
      <div class="status-name">${escapeHtml(pc.name)}</div>
      <div class="status-identity-line">${escapeHtml(identity || '정보 없음')}</div>
      ${origin ? `<div class="status-identity-sub">${escapeHtml(origin)}</div>` : ''}
    </section>

    <section class="status-primary-grid">
      <article><span>무의 경지</span><strong>${escapeHtml(valueOrDash(pc.realm))}</strong></article>
      <article><span>마법 써클</span><strong>${pc.magicCircle == null || pc.magicCircle === '' ? '—' : `${escapeHtml(pc.magicCircle)}서클`}</strong></article>
      <article><span>금화</span><strong>${Number.isFinite(Number(pc.startingGold)) ? Math.max(0, Number(pc.startingGold)).toLocaleString() : '0'}</strong></article>
    </section>

    <section class="status-section">
      <div class="status-section-title">STATUS</div>
      <div class="status-stat-grid">
        ${STAT_KEYS.map((key) => `<article><span>${STAT_LABELS[key]}</span><strong>${escapeHtml(valueOrDash(stats[key]))}</strong></article>`).join('')}
      </div>
    </section>

    <section class="status-section">
      <div class="status-section-title">TALENT</div>
      <div class="status-talent-grid">
        ${TALENT_KEYS.map((key) => `<article><span>${TALENT_LABELS[key]}</span><strong>${Number.isFinite(Number(talents[key])) ? Number(talents[key]) : '—'}</strong></article>`).join('')}
      </div>
    </section>

    ${relationshipSection(run.relationships)}
    ${listSection('SKILL', pc.skills)}
    ${listSection('TRAIT', pc.traits)}
    ${listSection('AUTHORITY', pc.authorities)}
    ${listSection('EQUIPMENT / INVENTORY', pc.equipment)}
    ${listSection('CURRENT CONDITION', pc.conditions, 'status-condition-section')}
  `;
}

function setEditorValue(id, value) {
  const node = el(id);
  if (node) node.value = value ?? '';
}

function fillStatusEditor(run = loadRun()) {
  if (!run) return;
  const pc = run.pc || {};
  const stats = normalizeStats(pc.stats);
  const talents = pc.talents && typeof pc.talents === 'object' ? pc.talents : {};

  setEditorValue('statusRealm', pc.realm || '');
  setEditorValue('statusMagicCircle', pc.magicCircle == null ? '' : pc.magicCircle);
  setEditorValue('statusGold', Number.isFinite(Number(pc.startingGold)) ? Math.max(0, Number(pc.startingGold)) : 0);
  setEditorValue('statusBody', stats.body);
  setEditorValue('statusMana', stats.mana);
  setEditorValue('statusIntelligence', stats.intelligence);
  setEditorValue('statusHoly', stats.holy);
  setEditorValue('statusTalentMagic', talents.magic ?? 5);
  setEditorValue('statusTalentMartial', talents.martial ?? 5);
  setEditorValue('statusTalentSoul', talents.soul ?? 5);
  setEditorValue('statusTalentKnowledge', talents.knowledge ?? 5);
  setEditorValue('statusSkills', normalizeList(pc.skills).join('\n'));
  setEditorValue('statusTraits', normalizeList(pc.traits, 16).join('\n'));
  setEditorValue('statusAuthorities', normalizeList(pc.authorities, 16).join('\n'));
  setEditorValue('statusEquipment', normalizeList(pc.equipment).join('\n'));
  setEditorValue('statusConditions', normalizeList(pc.conditions, 16).join('\n'));
}

function numberInRange(id, min, max, fallback) {
  const value = Number(el(id)?.value);
  if (!Number.isInteger(value) || value < min || value > max) return fallback;
  return value;
}

function applyStatusEditor() {
  const run = loadRun();
  if (!run) return;
  const pc = run.pc || {};
  const existingTalents = pc.talents && typeof pc.talents === 'object' ? pc.talents : {};
  const circleText = String(el('statusMagicCircle')?.value || '').trim();
  const circleValue = circleText === '' ? null : Number(circleText);
  if (circleValue != null && (!Number.isInteger(circleValue) || circleValue < 0 || circleValue > 9)) return;

  pc.realm = String(el('statusRealm')?.value || '').trim().slice(0, 120);
  pc.magicCircle = circleValue;
  pc.startingGold = Math.max(0, Number(el('statusGold')?.value || 0) || 0);
  pc.stats = {
    body: cleanGrade(el('statusBody')?.value),
    mana: cleanGrade(el('statusMana')?.value),
    intelligence: cleanGrade(el('statusIntelligence')?.value),
    holy: cleanGrade(el('statusHoly')?.value),
  };
  pc.talents = {
    magic: numberInRange('statusTalentMagic', 1, 10, Number(existingTalents.magic) || 5),
    martial: numberInRange('statusTalentMartial', 1, 10, Number(existingTalents.martial) || 5),
    soul: numberInRange('statusTalentSoul', 1, 10, Number(existingTalents.soul) || 5),
    knowledge: numberInRange('statusTalentKnowledge', 1, 10, Number(existingTalents.knowledge) || 5),
  };
  pc.skills = splitEditorLines(el('statusSkills')?.value, 24, 160);
  pc.traits = splitEditorLines(el('statusTraits')?.value, 16, 240);
  pc.authorities = splitEditorLines(el('statusAuthorities')?.value, 16, 240);
  pc.equipment = splitEditorLines(el('statusEquipment')?.value, 24, 180);
  pc.conditions = splitEditorLines(el('statusConditions')?.value, 16, 180);
  run.pc = pc;
  run.pcStatusVersion = 1;
  run.updatedAt = new Date().toISOString();
  saveRun(run);

  // src/client.js keeps runState private. Reload once after explicit Admin mutation
  // so the in-memory runtime and the durable save are guaranteed to match.
  window.location.reload();
}

function openStatus() {
  const run = loadRun();
  if (!run) {
    el('newGameButton')?.click();
    return;
  }
  statusEditor.hidden = true;
  statusEditButton.hidden = false;
  statusSaveButton.hidden = true;
  renderStatusSummary(run);
  fillStatusEditor(run);
  if (!statusDialog.open) statusDialog.showModal();
}

statusButton?.addEventListener('click', openStatus);
statusCloseButton?.addEventListener('click', () => statusDialog.close());
statusEditButton?.addEventListener('click', () => {
  fillStatusEditor();
  statusEditor.hidden = false;
  statusEditButton.hidden = true;
  statusSaveButton.hidden = false;
});
statusSaveButton?.addEventListener('click', applyStatusEditor);

// The core client intentionally remains untouched. Its submit listener runs first,
// then this presentation/state companion persists the extra status fields.
pcForm?.addEventListener('submit', () => {
  window.setTimeout(() => {
    const run = loadRun();
    if (!run) return;
    const form = new FormData(pcForm);
    run.pc.stats = {
      body: cleanGrade(form.get('statBody')),
      mana: cleanGrade(form.get('statMana')),
      intelligence: cleanGrade(form.get('statIntelligence')),
      holy: cleanGrade(form.get('statHoly')),
    };
    run.pc.conditions = splitInitialList(form.get('conditions'), 16, 180);
    run.pcStatusVersion = 1;
    run.updatedAt = new Date().toISOString();
    saveRun(run);
    window.location.reload();
  }, 0);
});

export { normalizeStats, splitEditorLines, relationshipSection };
