import { prepareKeeperBody, prepareWriterBody, restoreKeeperPayload } from './runtime-integrity-core.js';

const SAVE_KEY = 'lumensia.ai-first.v0.save.1';
const INTERRUPTED_MESSAGE = '이전 장면의 상태 기록이 완료되기 전에 앱이 종료되거나 새로고침되었습니다. 상태 기록 재시도를 먼저 실행해 주세요.';

function loadSave() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function saveRun(run) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(run));
}

function lastTurn(run) {
  return Array.isArray(run?.history) && run.history.length ? run.history[run.history.length - 1] : null;
}

function bookkeepingBlocked(run = loadSave()) {
  const status = lastTurn(run)?.stateKeeper?.status;
  return status === 'pending' || status === 'failed';
}

function recoverInterruptedBookkeeping() {
  const run = loadSave();
  const turn = lastTurn(run);
  if (!turn || turn?.stateKeeper?.status !== 'pending') return false;
  turn.stateKeeper = { status: 'failed', error: INTERRUPTED_MESSAGE };
  run.updatedAt = new Date().toISOString();
  saveRun(run);
  return true;
}

function markLastTurnPending() {
  const run = loadSave();
  const turn = lastTurn(run);
  if (!turn) return;
  turn.stateKeeper = { status: 'pending', error: '' };
  run.updatedAt = new Date().toISOString();
  saveRun(run);
}

function requestPath(input) {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.pathname;
  if (typeof Request !== 'undefined' && input instanceof Request) {
    try { return new URL(input.url, location.href).pathname; } catch { return input.url; }
  }
  return '';
}

function parseJsonBody(init = {}) {
  if (typeof init?.body !== 'string') return null;
  try { return JSON.parse(init.body); }
  catch { return null; }
}

function withJsonBody(init = {}, body) {
  return { ...init, body: JSON.stringify(body) };
}

recoverInterruptedBookkeeping();

const originalFetch = window.fetch.bind(window);
window.fetch = async function guardedFetch(input, init = {}) {
  const path = requestPath(input);

  if (path === '/api/write') {
    if (bookkeepingBlocked()) throw new Error('이전 장면의 상태 기록을 먼저 복구해야 다음 장면을 생성할 수 있습니다.');
    const body = parseJsonBody(init);
    if (body) init = withJsonBody(init, prepareWriterBody(body));
    return originalFetch(input, init);
  }

  if (path === '/api/state-keeper') {
    const body = parseJsonBody(init);
    if (!body) return originalFetch(input, init);
    const originalRunState = body.runState || {};
    markLastTurnPending();
    const response = await originalFetch(input, withJsonBody(init, prepareKeeperBody(body)));
    if (!response.ok) return response;

    const raw = await response.text();
    let payload;
    try { payload = raw ? JSON.parse(raw) : {}; }
    catch { return new Response(raw, { status: response.status, statusText: response.statusText, headers: response.headers }); }
    const restored = restoreKeeperPayload(payload, originalRunState);
    return new Response(JSON.stringify(restored), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  return originalFetch(input, init);
};

export { bookkeepingBlocked, recoverInterruptedBookkeeping };
