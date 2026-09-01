import { applyPcSettingsToForm, parsePcSettings } from '/src/pc-paste.js';

const el = (id) => document.getElementById(id);
const pcForm = el('pcForm');
const toggle = el('pcPasteToggle');
const panel = el('pcPastePanel');
const input = el('pcPasteInput');
const status = el('pcPasteStatus');
const applyButton = el('pcPasteApply');
const clearButton = el('pcPasteClear');

function setStatus(message, tone = '') {
  if (!status) return;
  status.textContent = message;
  status.dataset.tone = tone;
}

function setOpen(open) {
  if (!panel || !toggle) return;
  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  toggle.textContent = open ? '설정 붙여넣기 닫기' : '설정 붙여넣기';
  if (open) input?.focus();
}

toggle?.addEventListener('click', () => setOpen(panel?.hidden !== false));

clearButton?.addEventListener('click', () => {
  if (input) input.value = '';
  setStatus('붙여넣을 설정을 비웠다. 기존 생성창 값은 유지된다.');
  input?.focus();
});

applyButton?.addEventListener('click', () => {
  const raw = input?.value || '';
  const parsed = parsePcSettings(raw);
  const applied = applyPcSettingsToForm(pcForm, parsed.values);
  if (!applied.length) {
    setStatus('인식한 설정 항목이 없다. `이름:`, `배경:`, `스킬:` 형식이나 JSON을 확인해 줘.', 'error');
    return;
  }
  const formatLabel = parsed.format === 'json' ? 'JSON' : '텍스트';
  setStatus(`${formatLabel} 설정에서 ${applied.length}개 항목을 생성창에 적용했다.`, 'success');
});

pcForm?.addEventListener('reset', () => {
  if (input) input.value = '';
  setStatus('기존 입력값은 붙여넣기에 포함된 항목만 덮어쓴다.');
});
