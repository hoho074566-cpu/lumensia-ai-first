import authoringData from '../../data/authoring/lumensia-academy.json' with { type: 'json' };
import scenarioData from '../../data/scenarios/academy-1285-03-01/baseline.json' with { type: 'json' };

export const MAX_ACTIVE_KEYWORD_BOOKS = 3;
export const AUTHORING_TEMPLATE = String(authoringData?.template?.instructions || '').trim();
export const AUTHORING_VERSION = Number(authoringData?.version || 1);

function textSurface(value) {
  return String(value || '').toLocaleLowerCase('ko-KR');
}

function keywordHits(surface, keywords = []) {
  const text = textSurface(surface);
  return keywords.reduce((count, keyword) => {
    const token = textSurface(keyword).trim();
    return token && text.includes(token) ? count + 1 : count;
  }, 0);
}

function lastTurnSurface(history = []) {
  const last = history.at(-1);
  if (!last) return '';
  const beats = Array.isArray(last.scene) ? last.scene.map((beat) => beat?.text || '').join('\n') : '';
  return [last.action || '', last?.continuity?.location || '', last?.continuity?.situation || '', beats].join('\n');
}

export function selectKeywordBooks({ action = '', scene = {}, history = [] } = {}) {
  const surface = [
    action,
    scene?.location || '',
    scene?.situation || '',
    lastTurnSurface(history),
  ].join('\n');

  return (authoringData.keyword_books || [])
    .map((book, index) => {
      const hits = keywordHits(surface, book.keywords || []);
      return {
        index,
        hits,
        score: hits * 1000 + Number(book.priority || 0),
        book,
      };
    })
    .filter((row) => row.hits > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, MAX_ACTIVE_KEYWORD_BOOKS)
    .map(({ book }) => ({
      id: book.id,
      content: book.content,
      matched_keywords: (book.keywords || []).filter((keyword) => keywordHits(surface, [keyword]) > 0),
    }));
}

export function isOpeningState({ scene = {}, history = [], adminScenePreview = false } = {}) {
  if (adminScenePreview || history.length) return false;
  return scene.date === scenarioData.start.date
    && scene.time === scenarioData.start.time
    && scene.location === scenarioData.start.location;
}

export function buildAuthoringContext({ action = '', pc = {}, scene = {}, history = [], recentChat = [], adminScenePreview = false } = {}) {
  const opening = isOpeningState({ scene, history, adminScenePreview });
  return {
    authoring_version: AUTHORING_VERSION,
    template_id: authoringData?.template?.id || 'simulation',
    story_info: authoringData.story_info || '',
    start_setting: opening ? authoringData?.start_settings?.default || null : null,
    development_examples: (authoringData.development_examples || []).slice(0, 3),
    activated_keyword_books: selectKeywordBooks({ action, scene, history }),
    status: {
      pc,
      scene,
    },
    recent_chat: recentChat,
    semantics: {
      keyword_books: `Only the ${MAX_ACTIVE_KEYWORD_BOOKS} most relevant keyword books are injected for this turn. Activation supplies information, not a requirement to mention or dramatize it.`,
      story_info: 'Story info is the always-on compact world and cast layer.',
      start_setting: 'Start setting exists only at the untouched scenario opening and does not prescribe later event order.',
      development_examples: 'Examples calibrate progression and response behavior; their concrete details are not Canon and must not be copied into the current story without independent support.',
    },
  };
}

export const AUTHORING_CAST_COUNT = 12;
