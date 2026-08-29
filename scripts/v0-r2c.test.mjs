import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api = readFileSync('api/write.js', 'utf8');

assert.match(api, /Never write the PC's verbatim speech/, 'R2C must not compose PC dialogue for indirect speech acts');
assert.match(api, /Never narrate the PC's private thoughts/, 'R2C must preserve PC inner authority');
assert.match(api, /speakerName === pc\.name/, 'R2C must hard-reject model-authored PC dialogue beats');
assert.match(api, /Writer가 PC의 발화문을 대신 작성했습니다/, 'PC dialogue rejection must fail visibly outside fiction');

assert.doesNotMatch(api, /playerSpeechPattern|innerThoughtPattern|emotionRegex|intentRegex/i, 'R2C must not add semantic regex machinery');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'R2C stays one Writer call');

console.log('PASS V0-R2C PC authority guard invariants');
