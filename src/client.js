import { CHARACTER_ASSETS, CHARACTER_NAMES } from '/assets/manifest.js';

const SAVE_KEY = 'lumensia.ai-first.v0.save.1';
const SETTINGS_KEY = 'lumensia.ai-first.v0.settings.1';
const FALLBACK_SCENARIO = {
  start: {
    date: '1285-03-01',
    weekday: '월요일',
    time: '08:40',
    location: '루멘시아 아카데미 대강당 앞',
    situation: '입학식 시작 전. 신입생·귀족 자제·평민 학생·교수·상급생이 대강당 일대에 모이고 있으며 개막 종은 아직 울리지 않았다.',
  },
};

const el = (id) => document.getElementById(id);
const story = el('story');
const composer = el('composer');
const actionInput = el('actionInput');
const sendButton = el('sendButton');
const continueButton = el('continueButton');
const statusText = el('statusText');
const errorBox = el('errorBox');
const pcDialog = el('pcDialog');
const pcForm = el('pcForm');
const adminDialog = el('adminDialog');
const adminForm = el('adminForm');
const adminRequestInput = el('adminRequestInput');
const adminPreviewStatus = el('adminPreviewStatus');
const adminPreviewBody = el('adminPreviewBody');
const settingsDialog = el('settingsDialog');
const tokenInput = el('tokenInput');
const importInput = el('importInput');

let scenario = FALLBACK_SCENARIO;
let runState = null;
let sending = false;
let adminPreview = null;

function loadJson(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); }
  catch { return null; }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function settings() {
  return loadJson(SETTINGS_KEY) || { accessToken: '' };
}

async function loadScenario() {
  try {
    const response = await fetch('/data/scenarios/academy-1285-03-01/baseline.json', { cache: 'no-store' });
    if (response.ok) scenario = await response.json();
  } catch {
    scenario = FALLBACK_SCENARIO;
  }
}

function makeRunState(pc) {
  const start = scenario.start || FALLBACK_SCENARIO.start;
  return {
    version: 1,
    id: crypto.randomUUID(),
    scenarioId: scenario.scenario_id || 'academy-1285-03-01',
    knowledgeLevel: 1,
    pc,
    scene: {
      date: start.date,
      weekday: start.weekday || '월요일',
      time: start.time,
      location: start.location,
      situation: start.situation,
      presentCharacterKeys: [],
    },
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function splitList(value) {
  return String(value || '')
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 24);
}

function readPcForm() {
  const data = new FormData(pcForm);
  return {
    name: String(data.get('name') || '').trim(),
    age: Number(data.get('age')),
    gender: String(data.get('gender') || '').trim(),
    department: String(data.get('department') || '').trim(),
    origin: String(data.get('origin') || '').trim(),
    socialStatus: String(data.get('socialStatus') || '').trim(),
    admission: String(data.get('admission') || '').trim(),
    realm: String(data.get('realm') || '').trim(),
    magicCircle: String(data.get('magicCircle') || '').trim(),
    startingGold: Math.max(0, Number(data.get('startingGold') || 0)),
    appearance: String(data.get('appearance') || '').trim(),
    background: String(data.get('background') || '').trim(),
    characterProfile: String(data.get('characterProfile') || '').trim(),
    talents: {
      magic: Number(data.get('talentMagic') || 5),
      martial: Number(data.get('talentMartial') || 5),
      soul: Number(data.get('talentSoul') || 5),
      knowledge: Number(data.get('talentKnowledge') || 5),
    },
    traits: splitList(data.get('traits')).slice(0, 16),
    authorities: splitList(data.get('authorities')).slice(0, 16),
    skills: splitList(data.get('skills')),
    equipment: splitList(data.get('equipment')),
  };
}

function validateImportedRun(value) {
  return Boolean(value && value.version === 1 && value.pc?.name && value.scene?.date && value.scene?.time && value.scene?.location && Array.isArray(value.history));
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}

function expressionUrl(key, expression) {
  const assets = CHARACTER_ASSETS[key];
  if (!assets) return '';
  return assets.portrait[expression] || assets.portrait.default;
}

function dialogueHtml(beat) {
  const key = beat.speaker_key;
  const name = CHARACTER_NAMES[key] || beat.speaker_name || key || 'NPC';
  const url = key ? expressionUrl(key, beat.expression || 'default') : '';
  return `<section class="dialogue-card">
    ${url ? `<img class="portrait" src="${escapeHtml(url)}" alt="${escapeHtml(name)}" loading="lazy" onerror="this.hidden=true">` : ''}
    <div class="dialogue-body">
      <div class="speaker-name">${escapeHtml(name)}</div>
      <div class="dialogue-text">${escapeHtml(beat.text)}</div>
    </div>
  </section>`;
}

function beatHtml(beat) {
  if (beat?.kind === 'dialogue') return dialogueHtml(beat);
  return `<p class="narration">${escapeHtml(beat?.text || '')}</p>`;
}

function scenePlainText(scene = []) {
  return (Array.isArray(scene) ? scene : []).map((beat) => {
    const text = String(beat?.text || '').trim();
    if (!text) return '';
    if (beat?.kind !== 'dialogue') return text;
    const name = CHARACTER_NAMES[beat?.speaker_key] || beat?.speaker_name || beat?.speaker_key || 'NPC';
    return `${name}\n${text}`;
  }).filter(Boolean).join('\n\n');
}

function copyButtonHtml(source, index = 0) {
  return `<div class="scene-block-tools">
    <button type="button" class="copy-block-button" data-copy-source="${escapeHtml(source)}" data-copy-index="${index}" aria-label="이 장면 복사" title="복사">
      <span class="copy-icon" aria-hidden="true"></span>
    </button>
  </div>`;
}

function sceneTurnHtml(scene, source, index = 0, extraClass = '') {
  return `<article class="scene-turn ${escapeHtml(extraClass)}">${(scene || []).map(beatHtml).join('')}${copyButtonHtml(source, index)}</article>`;
}

function render() {
  if (!runState) {
    story.innerHTML = '<div class="empty-state">캐릭터를 생성하면 시작합니다.</div>';
    statusText.textContent = '새 게임';
    continueButton.disabled = true;
    return;
  }

  const scene = runState.scene;
  statusText.textContent = `${scene.date} · ${scene.time} · ${scene.location}`;
  const chunks = [
    `<section class="opening-state">
      <div class="opening-kicker">${escapeHtml(scene.date)} · ${escapeHtml(scene.time)}</div>
      <h2>${escapeHtml(scene.location)}</h2>
      <p>${escapeHtml(runState.history.length ? '' : scene.situation)}</p>
    </section>`,
  ];

  runState.history.forEach((turn, index) => {
    if (turn.mode !== 'continue' && String(turn.action || '').trim()) {
      chunks.push(`<section class="player-action"><div class="player-label">${escapeHtml(runState.pc.name)}</div><div>${escapeHtml(turn.action)}</div></section>`);
    }
    chunks.push(sceneTurnHtml(turn.scene, 'history', index, turn.mode === 'continue' ? 'continued-scene' : ''));
  });

  if (!runState.history.length) {
    chunks.push('<p class="start-hint">세계는 이미 움직이고 있다. 무엇을 할지는 직접 입력하면 된다.</p>');
  }

  story.innerHTML = chunks.join('');
  continueButton.disabled = sending || !runState || !runState.history.length;
}

function renderAdminPreview() {
  if (!adminPreview) {
    adminPreviewStatus.textContent = '아직 생성한 Preview가 없습니다.';
    adminPreviewBody.innerHTML = '';
    return;
  }
  const continuity = adminPreview.continuity || {};
  adminPreviewStatus.textContent = `세이브 미변경 · ${continuity.date || ''} · ${continuity.time || ''} · ${continuity.location || ''}`;
  adminPreviewBody.innerHTML = sceneTurnHtml(adminPreview.scene, 'admin', 0, 'admin-preview-turn');
}

function showError(message = '') {
  errorBox.textContent = message;
  errorBox.hidden = !message;
}

function setSending(value) {
  sending = value;
  sendButton.disabled = value || !runState;
  continueButton.disabled = value || !runState || !runState.history.length;
  actionInput.disabled = value || !runState;
  composer.classList.toggle('is-sending', value);
  sendButton.textContent = value ? '생성 중…' : '보내기';
  continueButton.textContent = value ? '…' : '이어하기';
  el('adminPreviewButton').disabled = value || !runState;
}

async function writeClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand('copy');
  area.remove();
  if (!ok) throw new Error('클립보드 복사에 실패했습니다.');
}

async function handleCopyClick(button) {
  if (!button || !runState) return;
  const source = button.dataset.copySource;
  const index = Number(button.dataset.copyIndex || 0);
  const scene = source === 'admin' ? adminPreview?.scene : runState.history[index]?.scene;
  const text = scenePlainText(scene);
  if (!text) return;
  try {
    await writeClipboard(text);
    button.classList.add('is-copied');
    button.title = '복사됨';
    window.setTimeout(() => {
      button.classList.remove('is-copied');
      button.title = '복사';
    }, 1200);
  } catch (error) {
    showError(error?.message || '복사에 실패했습니다.');
  }
}

story.addEventListener('click', (event) => {
  const button = event.target.closest('.copy-block-button');
  if (button) handleCopyClick(button);
});

adminPreviewBody.addEventListener('click', (event) => {
  const button = event.target.closest('.copy-block-button');
  if (button) handleCopyClick(button);
});

async function requestScene({ mode = 'action', action = '', adminRequest = '' } = {}) {
  if (sending || !runState) return;
  const isContinue = mode === 'continue';
  const isAdmin = mode === 'admin';
  const submittedAction = isAdmin ? String(adminRequest || '').trim() : String(action || '');
  if (!isContinue && !submittedAction.trim()) return;

  showError('');
  setSending(true);

  try {
    const currentSettings = settings();
    const response = await fetch('/api/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Lumensia-Token': currentSettings.accessToken || '',
      },
      body: JSON.stringify({
        action: submittedAction,
        runState,
        continueScene: isContinue,
        adminScenePreview: isAdmin,
      }),
    });
    const raw = await response.text();
    let payload = {};
    try { payload = raw ? JSON.parse(raw) : {}; }
    catch { throw new Error(`서버가 JSON이 아닌 응답을 반환했습니다. HTTP ${response.status}`); }
    if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);

    const turn = payload.turn;
    const continuity = turn.continuity;

    if (isAdmin || payload.admin_preview === true) {
      adminPreview = {
        request: submittedAction,
        scene: turn.scene,
        continuity,
        createdAt: new Date().toISOString(),
      };
      renderAdminPreview();
      return;
    }

    runState.history.push({
      action: isContinue ? '' : submittedAction,
      mode: isContinue ? 'continue' : 'action',
      scene: turn.scene,
      continuity,
      createdAt: new Date().toISOString(),
    });
    runState.history = runState.history.slice(-40);
    runState.scene = {
      ...runState.scene,
      date: continuity.date,
      time: continuity.time,
      location: continuity.location,
      situation: continuity.situation,
      presentCharacterKeys: continuity.present_character_keys || [],
    };
    runState.updatedAt = new Date().toISOString();
    saveJson(SAVE_KEY, runState);
    if (!isContinue) actionInput.value = '';
    render();
  } catch (error) {
    showError(error?.message || '장면 생성에 실패했습니다.');
  } finally {
    setSending(false);
  }
}

function sendAction() {
  return requestScene({ mode: 'action', action: actionInput.value });
}

function continueScene() {
  return requestScene({ mode: 'continue' });
}

function openPcDialog() {
  if (!pcDialog.open) pcDialog.showModal();
}

pcForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const pc = readPcForm();
  if (!pc.name) return;
  if (!Number.isFinite(pc.age) || pc.age < 1) return;
  runState = makeRunState(pc);
  adminPreview = null;
  saveJson(SAVE_KEY, runState);
  pcDialog.close();
  showError('');
  setSending(false);
  render();
  renderAdminPreview();
});

composer.addEventListener('submit', (event) => {
  event.preventDefault();
  sendAction();
});

continueButton.addEventListener('click', continueScene);

actionInput.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    sendAction();
  }
});

el('newGameButton').addEventListener('click', () => {
  if (runState && !confirm('현재 V0 세이브를 지우고 새 캐릭터를 만들까요?')) return;
  localStorage.removeItem(SAVE_KEY);
  runState = null;
  adminPreview = null;
  render();
  renderAdminPreview();
  openPcDialog();
});

el('adminButton').addEventListener('click', () => {
  if (!runState) return openPcDialog();
  renderAdminPreview();
  adminDialog.showModal();
});

adminForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const request = adminRequestInput.value.trim();
  if (!request) return;
  requestScene({ mode: 'admin', adminRequest: request });
});

el('adminClearButton').addEventListener('click', () => {
  adminPreview = null;
  adminRequestInput.value = '';
  renderAdminPreview();
});

el('adminCloseButton').addEventListener('click', () => adminDialog.close());

el('settingsButton').addEventListener('click', () => {
  tokenInput.value = settings().accessToken || '';
  settingsDialog.showModal();
});

el('settingsSaveButton').addEventListener('click', () => {
  saveJson(SETTINGS_KEY, { accessToken: tokenInput.value.trim() });
  settingsDialog.close();
});

el('settingsCloseButton').addEventListener('click', () => settingsDialog.close());

el('exportButton').addEventListener('click', () => {
  if (!runState) return;
  const blob = new Blob([JSON.stringify(runState, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lumensia-v0-${runState.pc.name}-${runState.scene.date}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

el('importButton').addEventListener('click', () => importInput.click());

importInput.addEventListener('change', async () => {
  const file = importInput.files?.[0];
  importInput.value = '';
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!validateImportedRun(parsed)) throw new Error('Lumensia V0 세이브 형식이 아닙니다.');
    runState = parsed;
    adminPreview = null;
    saveJson(SAVE_KEY, runState);
    showError('');
    setSending(false);
    render();
    renderAdminPreview();
  } catch (error) {
    showError(error?.message || '세이브를 불러오지 못했습니다.');
  }
});

async function boot() {
  await loadScenario();
  const saved = loadJson(SAVE_KEY);
  runState = validateImportedRun(saved) ? saved : null;
  adminPreview = null;
  setSending(false);
  render();
  renderAdminPreview();
  if (!runState) openPcDialog();
}

boot();
