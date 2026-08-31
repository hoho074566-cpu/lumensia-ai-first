#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const index = readFileSync('index.html', 'utf8');
const ui = readFileSync('src/original-dialogue-ui.js', 'utf8');
const css = readFileSync('src/original-dialogue-ui.css', 'utf8');
const writer = readFileSync('api/write.js', 'utf8');

assert.match(index, /original-dialogue-ui\.css/, 'original-style dialogue CSS must be loaded');
assert.match(index, /client\.js[\s\S]*original-dialogue-ui\.js/, 'dialogue enhancer must run after the existing client renderer');

assert.match(ui, /CHARACTER_ASSETS, CHARACTER_NAMES/, 'dialogue UI must use the existing canonical asset manifest');
assert.match(ui, /function splitKnownSpeaker\(/, 'raw prose must be presentation-parsed only for known speaker prefixes');
assert.match(ui, /NAME_TO_KEY\.get\(speakerName\)/, 'only registered character names can trigger character art');
assert.match(ui, /assets\.portrait\?\.default/, 'raw dialogue uses the existing portrait asset');
assert.match(ui, /assets\.fullbody/, 'fullbody remains an image fallback');
assert.match(ui, /MutationObserver/, 'new Writer turns must be upgraded without changing Writer output');
assert.doesNotMatch(ui, /fetch\(['"]\/api\/write/, 'presentation layer must not create another Writer call');

assert.match(css, /\.original-character-image\s*\{[\s\S]*width:\s*100%/, 'character art must render large/full width');
assert.match(css, /object-fit:\s*cover/, 'portrait art must crop like a large scene image');
assert.match(css, /\.original-dialogue-copy/, 'dialogue copy must live below character art');
assert.match(css, /margin-left:\s*-13px/, 'mobile character art must reach the story edges');

assert.equal((writer.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'UI work must preserve the one Writer call architecture');

console.log('PASS original-style character image + dialogue UI contract');
