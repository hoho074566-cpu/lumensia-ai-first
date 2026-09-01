#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const index = readFileSync('index.html', 'utf8');
const client = readFileSync('src/client.js', 'utf8');
const css = readFileSync('src/runtime-ux.css', 'utf8');
const writer = readFileSync('api/write.js', 'utf8');
const authoringRuntime = readFileSync('api/lib/authoring-runtime.js', 'utf8');

assert.match(index, /id="situationButton"[^>]*>상황 추가</, 'composer must expose a Situation button');
assert.match(index, /href="\/src\/runtime-ux\.css"/, 'runtime UX stylesheet must load');
assert.match(client, /actionInput\.value = '\*\*\*\*'/, 'Situation button must prepare Crack-style **|** input');
assert.match(client, /setSelectionRange\(2, 2\)/, 'cursor must land between the ** markers');
assert.match(client, /isSituationWrapped\(raw\)/, 'manually typed **...** must also enter situation mode');
assert.match(client, /inputKind: submittedInputKind/, 'Writer request must carry input authority');
assert.match(client, /JSON\.stringify\(\{ action, turn, inputKind, runState \}\)/, 'State Keeper request must carry input authority');
assert.match(writer, /const inputKind = body\.inputKind === 'situation' \? 'situation' : 'intent'/, 'server must sanitize situation-vs-intent input kind');
assert.match(authoringRuntime, /MODE: SITUATION\/NARRATION CONTEXT/, 'Writer envelope must explicitly distinguish situation context');
assert.match(authoringRuntime, /PC가 말했거나 행동했다는 뜻이 아니다/, 'situation text must not be converted into prior PC dialogue/action');

assert.match(client, /function growthTraceHtml\(turn\)/, 'meaningful pre-rank growth must have a visible renderer');
assert.match(client, /row\?\.significance === 'meaningful' \|\| row\?\.significance === 'breakthrough'/, 'only meaningful/breakthrough evidence should surface as growth traces');
assert.match(client, />성장 흔적</, 'visible pre-rank evidence must be labeled as growth trace');
assert.match(client, />숙련 상승</, 'actual rank-up must remain visually distinct');
assert.doesNotMatch(client, /호감도\s*\+|EXP\s*\+|XP\s*\+|hiddenXp/, 'visible feedback must not regress into numeric affection/XP spam');
assert.match(css, /\.growth-trace/, 'growth trace styling must exist');
assert.match(css, /\.situation-button\.is-active/, 'situation mode must be visibly active');
assert.match(css, /grid-template-columns: repeat\(3/, 'mobile composer must fit situation/continue/send controls');

console.log('PASS RUNTIME-UX situation authority + visible semantic growth feedback');
