const CHARACTER_ASSET_BASE = 'https://raw.githubusercontent.com/dudghl/test/main/assets/characters-v2';

export const PORTRAIT_EXPRESSIONS = Object.freeze([
  'default',
  'smile',
  'blush',
  'serious',
  'angry',
  'sad',
  'shock',
  'smug',
  'annoyed',
  'worried',
  'confused',
  'laugh',
  'flustered',
]);

export const CHARACTER_NAMES = Object.freeze({
  anastasia: '아나스타샤',
  aria: '아리아',
  arien: '아리엔',
  aris: '아리스',
  artemis: '아르테미스',
  asmo: '아스모',
  beelzebub: '벨제붑',
  bellian: '벨리안',
  carne: '카르네',
  chloe: '클로에',
  delpirem: '델피렘',
  elena: '엘레나',
  elise: '엘리제',
  emily: '에밀리',
  etera: '에테라',
  fria: '프리아',
  isabel: '이사벨',
  kartia: '카르티아',
  laris: '라리스',
  lena: '레나',
  levian: '레비안',
  lillia: '릴리아',
  lily_lumina: '릴리 루미나',
  lucia: '루시아',
  mirabelle: '미라벨',
  nemesis: '네메시스',
  sera: '세라',
  serena: '세레나',
  seriel: '세리엘',
  sia: '시아',
  sloth: '슬로스',
  veradin: '베라딘',
});

function portraitUrl(key, expression) {
  return `${CHARACTER_ASSET_BASE}/${key}/portrait/${expression}.webp`;
}

function fullbodyUrl(key) {
  return `${CHARACTER_ASSET_BASE}/${key}/fullbody/default.webp`;
}

export const CHARACTER_ASSETS = Object.freeze(
  Object.fromEntries(Object.entries(CHARACTER_NAMES).map(([key, name]) => [key, Object.freeze({
    key,
    name,
    portrait: Object.freeze(Object.fromEntries(PORTRAIT_EXPRESSIONS.map((expression) => [expression, portraitUrl(key, expression)]))),
    fullbody: fullbodyUrl(key),
  })]))
);

export const CHARACTER_KEYS = Object.freeze(Object.keys(CHARACTER_ASSETS));
export { CHARACTER_ASSET_BASE };
