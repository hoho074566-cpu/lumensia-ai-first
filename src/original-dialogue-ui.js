import { CHARACTER_ASSETS, CHARACTER_NAMES } from '/assets/manifest.js';

const NAME_TO_KEY = new Map(
  Object.entries(CHARACTER_NAMES).map(([key, name]) => [String(name).trim(), key]),
);

const SUPPORTED_EXPRESSIONS = new Set([
  'default', 'smile', 'blush', 'serious', 'angry', 'sad', 'shock',
  'smug', 'annoyed', 'worried', 'confused', 'laugh', 'flustered',
]);

const EXPRESSION_HINTS = Object.freeze([
  ['blush', ['홍조', '볼이 붉', '뺨이 붉', '얼굴이 붉어']],
  ['flustered', ['당황', '허둥', '말을 더듬', '시선을 피했다', '시선을 피하며', '머뭇', '말끝을 흐']],
  ['laugh', ['소리 내어 웃', '웃음을 터뜨', '하하', '아하하']],
  ['smug', ['입꼬리를 올', '입꼬리가 올라', '피식', '의기양양', '자신만만', '얄밉게 웃']],
  ['angry', ['분노', '화가 난', '화를 내', '이를 악', '쏘아보', '노려보', '짜증', '성난', '목소리가 날카로']],
  ['shock', ['경악', '놀라', '흠칫', '눈을 크게', '숨을 삼켰', '얼어붙', '화들짝']],
  ['sad', ['슬프', '울먹', '눈물', '침울', '고개를 떨', '쓸쓸', '풀이 죽']],
  ['worried', ['걱정', '불안', '초조', '망설', '조심스럽', '긴장한', '염려']],
  ['annoyed', ['귀찮', '질린', '심드렁', '한숨', '못마땅', '성가시']],
  ['confused', ['고개를 갸웃', '의아', '혼란', '어리둥절', '이해하지 못', '무슨 말인지']],
  ['serious', ['진지', '표정이 굳', '표정이 가라앉', '눈빛이 가라앉', '단호', '차갑게', '엄숙']],
  ['smile', ['미소', '웃으며', '웃었다', '웃어 보', '반갑', '환하게', '밝게 웃', '고맙']],
]);

function containsAny(text, hints) {
  const value = String(text || '');
  return hints.some((hint) => value.includes(hint));
}

function splitKnownSpeaker(text) {
  const value = String(text || '').trim();
  if (!value) return null;

  const asciiColon = value.indexOf(':');
  const wideColon = value.indexOf('：');
  const colonIndexes = [asciiColon, wideColon].filter((index) => index > 0 && index <= 40);
  if (!colonIndexes.length) return null;

  const colonIndex = Math.min(...colonIndexes);
  const speakerName = value.slice(0, colonIndex).trim();
  const key = NAME_TO_KEY.get(speakerName);
  if (!key) return null;

  const dialogue = value.slice(colonIndex + 1).trim();
  if (!dialogue) return null;

  return { key, speakerName, dialogue };
}

function inferExpression({ dialogue = '', context = '' } = {}) {
  const source = `${String(context || '')}\n${String(dialogue || '')}`;
  for (const [expression, hints] of EXPRESSION_HINTS) {
    if (containsAny(source, hints)) return expression;
  }

  const line = String(dialogue || '').trim();
  if (line.includes('?!') || line.includes('!?')) return 'shock';
  if ((line.match(/\?/g) || []).length >= 2) return 'confused';
  if (containsAny(line, ['후', '하아', '휴…', '휴...'])) return 'annoyed';
  return 'default';
}

function expressionFromPortraitSrc(src = '') {
  const value = String(src || '');
  const marker = '/portrait/';
  const start = value.lastIndexOf(marker);
  if (start < 0) return 'default';
  const tail = value.slice(start + marker.length);
  const expression = tail.split(/[.?#]/, 1)[0];
  return SUPPORTED_EXPRESSIONS.has(expression) ? expression : 'default';
}

function imageSources(key, expression = 'default', preferredSrc = '') {
  const assets = CHARACTER_ASSETS[key];
  if (!assets) return [];

  const normalized = SUPPORTED_EXPRESSIONS.has(expression) ? expression : 'default';
  return [
    preferredSrc,
    assets.portrait?.[normalized],
    assets.portrait?.default,
    assets.fullbody,
  ].filter((src, index, all) => src && all.indexOf(src) === index);
}

function makeCharacterImage(key, expression = 'default', preferredSrc = '') {
  const sources = imageSources(key, expression, preferredSrc);
  if (!sources.length) return null;

  const image = document.createElement('img');
  image.className = 'original-character-image';
  image.alt = CHARACTER_NAMES[key] || CHARACTER_ASSETS[key]?.name || key;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.dataset.sourceIndex = '0';

  image.addEventListener('load', () => image.classList.add('is-loaded'));
  image.addEventListener('error', () => {
    const nextIndex = Number(image.dataset.sourceIndex || 0) + 1;
    if (nextIndex < sources.length) {
      image.dataset.sourceIndex = String(nextIndex);
      image.src = sources[nextIndex];
      return;
    }
    image.hidden = true;
  });

  image.src = sources[0];
  return image;
}

function makeDialogueBlock({
  key,
  speakerName,
  dialogue,
  expression = 'default',
  preferredSrc = '',
  showImage = true,
  debug = false,
}) {
  const block = document.createElement('section');
  block.className = 'original-dialogue-block';
  block.dataset.characterKey = key;
  block.dataset.expression = expression;
  block.dataset.characterLabel = speakerName;
  block.dataset.originalDialogueUi = '1';

  if (showImage) {
    const image = makeCharacterImage(key, expression, preferredSrc);
    if (image) {
      const visual = document.createElement('figure');
      visual.className = 'original-character-visual';
      visual.appendChild(image);
      block.appendChild(visual);
    } else {
      block.classList.add('original-dialogue-no-image');
    }
  } else {
    block.classList.add('original-dialogue-continuation', 'original-dialogue-no-image');
  }

  const copy = document.createElement('div');
  copy.className = 'original-dialogue-copy';

  if (debug) {
    const debugLine = document.createElement('div');
    debugLine.className = 'original-expression-debug';
    debugLine.textContent = `${speakerName} · ${expression}${showImage ? '' : ' · image reuse'}`;
    copy.appendChild(debugLine);
  }

  const speaker = document.createElement('div');
  speaker.className = 'original-dialogue-speaker';

  const bubble = document.createElement('span');
  bubble.className = 'original-speaker-bubble';
  bubble.setAttribute('aria-hidden', 'true');

  const name = document.createElement('span');
  name.textContent = speakerName;

  const text = document.createElement('div');
  text.className = 'original-dialogue-text';
  text.textContent = dialogue;

  speaker.append(bubble, name);
  copy.append(speaker, text);
  block.appendChild(copy);
  return block;
}

function relevantNarration(state, speakerName, key) {
  const narration = String(state.lastNarration || '');
  if (!narration) return '';
  if (narration.includes(speakerName)) return narration;
  if (state.lastSpeakerKey === key) return narration;
  return '';
}

function shouldReuseImage(state, key, expression) {
  return state.lastSpeakerKey === key
    && state.lastExpression === expression
    && state.narrationSinceDialogue <= 1;
}

function upgradeRawNarration(paragraph, state, { debug = false } = {}) {
  if (!(paragraph instanceof HTMLElement)) return false;
  if (paragraph.closest('[data-original-dialogue-ui="1"]')) return false;

  const parsed = splitKnownSpeaker(paragraph.textContent);
  if (!parsed) return false;

  const context = relevantNarration(state, parsed.speakerName, parsed.key);
  const expression = inferExpression({ dialogue: parsed.dialogue, context });
  const showImage = !shouldReuseImage(state, parsed.key, expression);

  paragraph.replaceWith(makeDialogueBlock({
    ...parsed,
    expression,
    showImage,
    debug,
  }));

  state.lastSpeakerKey = parsed.key;
  state.lastExpression = expression;
  state.narrationSinceDialogue = 0;
  state.lastNarration = '';
  return true;
}

function upgradeStructuredDialogue(card, state, { debug = false } = {}) {
  if (!(card instanceof HTMLElement)) return false;
  if (card.dataset.originalDialogueUi === '1') return false;

  const speakerElement = card.querySelector('.speaker-name');
  const dialogueElement = card.querySelector('.dialogue-text');
  if (!speakerElement || !dialogueElement) return false;

  const speakerName = String(speakerElement.textContent || '').trim();
  const key = NAME_TO_KEY.get(speakerName);
  if (!key) return false;

  const preferredSrc = card.querySelector('.portrait')?.getAttribute('src') || '';
  const expression = expressionFromPortraitSrc(preferredSrc);
  const showImage = !shouldReuseImage(state, key, expression);

  card.replaceWith(makeDialogueBlock({
    key,
    speakerName,
    dialogue: String(dialogueElement.textContent || '').trim(),
    expression,
    preferredSrc,
    showImage,
    debug,
  }));

  state.lastSpeakerKey = key;
  state.lastExpression = expression;
  state.narrationSinceDialogue = 0;
  state.lastNarration = '';
  return true;
}

function upgradeSceneTurn(turn) {
  if (!(turn instanceof HTMLElement)) return;

  const debug = Boolean(turn.closest('#adminPreviewBody'));
  const state = {
    lastSpeakerKey: '',
    lastExpression: 'default',
    narrationSinceDialogue: Number.POSITIVE_INFINITY,
    lastNarration: '',
  };

  for (const child of [...turn.children]) {
    if (!(child instanceof HTMLElement)) continue;

    if (child.dataset.originalDialogueUi === '1') {
      state.lastSpeakerKey = child.dataset.characterKey || '';
      state.lastExpression = child.dataset.expression || 'default';
      state.narrationSinceDialogue = 0;
      state.lastNarration = '';
      continue;
    }

    if (child.classList.contains('narration')) {
      if (upgradeRawNarration(child, state, { debug })) continue;
      state.lastNarration = String(child.textContent || '').trim();
      state.narrationSinceDialogue += 1;
      continue;
    }

    if (child.classList.contains('dialogue-card')) {
      if (upgradeStructuredDialogue(child, state, { debug })) continue;
      state.lastSpeakerKey = '';
      state.lastExpression = 'default';
      state.narrationSinceDialogue = Number.POSITIVE_INFINITY;
      state.lastNarration = '';
    }
  }
}

function upgradeRoot(root) {
  if (!(root instanceof Element) && !(root instanceof Document)) return;

  const ownTurn = root.matches?.('.scene-turn') ? root : root.closest?.('.scene-turn');
  if (ownTurn) upgradeSceneTurn(ownTurn);
  root.querySelectorAll?.('.scene-turn').forEach(upgradeSceneTurn);
}

function observeRoot(root) {
  if (!root) return;
  upgradeRoot(root);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof Element) upgradeRoot(node);
      }
    }
  });
  observer.observe(root, { childList: true, subtree: true });
}

observeRoot(document.getElementById('story'));
observeRoot(document.getElementById('adminPreviewBody'));

export { splitKnownSpeaker, inferExpression, expressionFromPortraitSrc };
