import assert from 'node:assert/strict';
import authoring from '../data/authoring/lumensia-academy.json' with { type: 'json' };
import presentation from '../data/canon/characters/presentation.json' with { type: 'json' };

const prompt = authoring.main_author_prompt || '';
const visible = presentation.characters || {};

assert.equal(visible.lillia?.hair, '붉은 머리', 'Canon presentation must keep Lillia red-haired');
assert.equal(visible.lillia?.eyes, '금안', 'Canon presentation must keep Lillia golden-eyed');
assert.equal(visible.sera?.hair, '갈색 머리', 'Canon presentation must keep Sera brown-haired');
assert.equal(visible.sera?.eyes, '청안', 'Canon presentation must keep Sera blue-eyed');
assert.equal(visible.emily?.hair, '은발', 'Canon presentation must keep Emily silver-haired');
assert.equal(visible.artemis?.eyes, '적안', 'Canon presentation must keep Artemis red-eyed');

assert.match(prompt, /릴리아는 붉은 머리와 금안/, 'Writer signal must explicitly preserve Lillia presentation');
assert.match(prompt, /세라는 갈색 머리와 청안/, 'Writer signal must explicitly preserve Sera presentation');
assert.match(prompt, /에밀리는 은발·청안/, 'Writer signal must explicitly preserve Emily presentation');
assert.match(prompt, /presentation facts와 말투는 고정된 portrayal 사실로 유지한다/, 'Named-NPC presentation and voice must be treated as fixed portrayal facts');
assert.match(prompt, /ROUTINE COMPRESSES\. IMPORTANT MOMENTS EXPAND\./, 'V3 pace baseline must remain intact');
assert.match(prompt, /저마찰 상태에 머물지 않는다/, 'V3 social-friction baseline must remain intact');
assert.match(prompt, /PC는 현재 장면의 기본 카메라 앵커다/, 'V3 PC presence baseline must remain intact');

console.log('PASS NARRATIVE-BASELINE-V3 portrayal + prose/pace/friction guards');
