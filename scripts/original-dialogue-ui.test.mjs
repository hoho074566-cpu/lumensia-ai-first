#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const index = readFileSync('index.html', 'utf8');
const ui = readFileSync('src/original-dialogue-ui.js', 'utf8');
const css = readFileSync('src/original-dialogue-ui.css', 'utf8');
const writer = readFileSync('api/write.js', 'utf8');
const authoring = readFileSync('data/authoring/lumensia-academy.json', 'utf8');

assert.match(index, /original-dialogue-ui\.css/, 'original-style dialogue CSS must be loaded');
assert.match(index, /client\.js[\s\S]*original-dialogue-ui\.js/, 'dialogue enhancer must run after the existing client renderer');

assert.match(ui, /CHARACTER_ASSETS, CHARACTER_NAMES/, 'dialogue UI must use the existing canonical asset manifest');
assert.match(ui, /function splitKnownSpeaker\(/, 'raw prose must be presentation-parsed only for known speaker prefixes');
assert.match(ui, /NAME_TO_KEY\.get\(speakerName\)/, 'only registered character names can trigger character art');
assert.match(ui, /function inferExpression\(/, 'RAW expression inference must stay in the presentation layer');
assert.match(ui, /EXPRESSION_HINTS/, 'RAW expression inference must use bounded visual hints');
assert.match(ui, /assets\.portrait\?\.\[normalized\]/, 'expression-specific portrait must be preferred when available');
assert.match(ui, /assets\.portrait\?\.default/, 'default portrait must remain a fallback');
assert.match(ui, /assets\.fullbody/, 'fullbody remains the final image fallback');
assert.match(ui, /function expressionFromPortraitSrc\(/, 'structured expression portraits must be preserved');
assert.match(ui, /function shouldReuseImage\(/, 'same speaker and expression should be able to reuse the existing visual');
assert.match(ui, /original-dialogue-continuation/, 'reused visuals must render as dialogue continuation blocks');
assert.match(ui, /original-expression-debug/, 'Admin preview must expose expression diagnostics');
assert.match(ui, /MutationObserver/, 'new Writer turns must be upgraded without changing Writer output');
assert.doesNotMatch(ui, /fetch\(['"]\/api\/write/, 'presentation layer must not create another Writer call');
assert.doesNotMatch(ui, /authoring-runtime|lumensia-academy\.json|prompt_template/, 'presentation layer must not touch Writer authoring inputs');

assert.match(css, /\.original-character-image\s*\{[\s\S]*width:\s*100%/, 'character art must render large/full width');
assert.match(css, /\.original-character-image\s*\{[\s\S]*opacity:\s*1/, 'character art must be visible without waiting for a load-event class');
assert.doesNotMatch(css, /\.original-character-image\s*\{[\s\S]{0,500}?opacity:\s*0\s*;/, 'base portrait style must never hide successfully loaded art behind opacity zero');
assert.match(css, /object-fit:\s*cover/, 'portrait art must crop like a large scene image');
assert.match(css, /\.original-dialogue-copy/, 'dialogue copy must live below character art');
assert.match(css, /\.original-dialogue-continuation/, 'same-expression continuation must avoid another large image');
assert.match(css, /\.admin-preview-body \.original-expression-debug\s*\{[\s\S]*display:\s*block/, 'expression debug text must only be visible in Admin preview');
assert.match(css, /margin-left:\s*-13px/, 'mobile character art must reach the story edges');
assert.match(css, /prefers-reduced-motion/, 'image transition must respect reduced-motion preference');

assert.equal((writer.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'UI work must preserve the one Writer call architecture');
assert.match(authoring, /세계는 player의 다음 입력을 기다리며 정지하지 않는다/, 'Golden3 Writer baseline must remain intact while UI changes');
assert.match(authoring, /일상·이동·절차는 빠르게 압축/, 'Golden3 pacing contract must remain intact while UI changes');

console.log('PASS original-style character image + expression UI contract');
