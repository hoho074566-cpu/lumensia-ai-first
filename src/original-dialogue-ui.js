import { CHARACTER_ASSETS, CHARACTER_NAMES } from '/assets/manifest.js';

const NAME_TO_KEY = new Map(
  Object.entries(CHARACTER_NAMES).map(([key, name]) => [String(name).trim(), key]),
);

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

function makeCharacterImage(key, preferredSrc = '') {
  const assets = CHARACTER_ASSETS[key];
  if (!assets) return null;

  const image = document.createElement('img');
  image.className = 'original-character-image';
  image.alt = CHARACTER_NAMES[key] || assets.name || key;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.src = preferredSrc || assets.portrait?.default || assets.fullbody || '';
  image.dataset.fallbackSrc = assets.fullbody || '';
  image.addEventListener('error', () => {
    const fallback = image.dataset.fallbackSrc;
    if (fallback && image.src !== fallback) {
      image.dataset.fallbackSrc = '';
      image.src = fallback;
      return;
    }
    image.hidden = true;
  });
  return image;
}

function makeDialogueBlock({ key, speakerName, dialogue, preferredSrc = '' }) {
  const block = document.createElement('section');
  block.className = 'original-dialogue-block';
  block.dataset.characterKey = key;
  block.dataset.originalDialogueUi = '1';

  const image = makeCharacterImage(key, preferredSrc);
  if (image) {
    const visual = document.createElement('figure');
    visual.className = 'original-character-visual';
    visual.appendChild(image);
    block.appendChild(visual);
  } else {
    block.classList.add('original-dialogue-no-image');
  }

  const copy = document.createElement('div');
  copy.className = 'original-dialogue-copy';

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

function upgradeRawNarration(paragraph) {
  if (!(paragraph instanceof HTMLElement)) return;
  if (paragraph.closest('[data-original-dialogue-ui="1"]')) return;

  const parsed = splitKnownSpeaker(paragraph.textContent);
  if (!parsed) return;

  paragraph.replaceWith(makeDialogueBlock(parsed));
}

function upgradeStructuredDialogue(card) {
  if (!(card instanceof HTMLElement)) return;
  if (card.dataset.originalDialogueUi === '1') return;

  const speakerElement = card.querySelector('.speaker-name');
  const dialogueElement = card.querySelector('.dialogue-text');
  if (!speakerElement || !dialogueElement) return;

  const speakerName = String(speakerElement.textContent || '').trim();
  const key = NAME_TO_KEY.get(speakerName);
  if (!key) return;

  const preferredSrc = card.querySelector('.portrait')?.getAttribute('src') || '';
  card.replaceWith(makeDialogueBlock({
    key,
    speakerName,
    dialogue: String(dialogueElement.textContent || '').trim(),
    preferredSrc,
  }));
}

function upgradeRoot(root) {
  if (!(root instanceof Element) && !(root instanceof Document)) return;

  if (root.matches?.('.narration')) upgradeRawNarration(root);
  if (root.matches?.('.dialogue-card')) upgradeStructuredDialogue(root);

  root.querySelectorAll?.('.narration').forEach(upgradeRawNarration);
  root.querySelectorAll?.('.dialogue-card').forEach(upgradeStructuredDialogue);
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

export { splitKnownSpeaker };
