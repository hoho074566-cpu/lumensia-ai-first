import { CHARACTER_NAMES } from '/assets/manifest.js';
import { npcAppearanceStatsAccurate } from './npc-diagnostic-core.js';

const SAVE_KEY = 'lumensia.ai-first.v0.save.1';
const statusButton = document.getElementById('statusButton');
const statusSummary = document.getElementById('statusSummary');

function loadRun() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); }
  catch { return null; }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}

function diagnosticSection() {
  if (!statusSummary) return null;
  return [...statusSummary.querySelectorAll('.status-list-section')].find((section) =>
    section.querySelector('.status-section-title')?.textContent?.trim() === 'NPC APPEARANCE DIAGNOSTIC');
}

function renderAccurateDiagnostic() {
  const section = diagnosticSection();
  if (!section) return;
  const stats = npcAppearanceStatsAccurate(loadRun() || {}, CHARACTER_NAMES, 50);
  section.innerHTML = `
    <div class="status-section-title">NPC APPEARANCE DIAGNOSTIC</div>
    <div class="status-empty">최근 ${stats.sampleTurns}턴의 실제 등장/언급 턴 수 · Keeper 확정 cast 우선 · 읽기 전용</div>
    ${stats.rows.length
      ? `<div class="status-relationship-list">${stats.rows.slice(0, 20).map((row) => `
        <article class="status-relationship-row">
          <span>${escapeHtml(row.name)}</span>
          <strong>${row.count}턴</strong>
        </article>`).join('')}</div>`
      : '<div class="status-empty">아직 집계할 Named NPC가 없음</div>'}
  `;
}

statusButton?.addEventListener('click', () => queueMicrotask(renderAccurateDiagnostic));

export { renderAccurateDiagnostic };
