#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const authoring = JSON.parse(readFileSync(new URL('../data/authoring/lumensia-academy.json', import.meta.url), 'utf8'));
const presentation = JSON.parse(readFileSync(new URL('../data/canon/characters/presentation.json', import.meta.url), 'utf8'));
const prompt = String(authoring.prompt_template || '');

assert.equal(authoring.version, 5, 'Golden3 changes Writer behavior without introducing a new authoring pack format');

assert.match(prompt, /세계는 player의 다음 입력을 기다리며 정지하지 않는다/);
assert.match(prompt, /결과가 하나뿐인 구간은 필요한 만큼 압축/);
assert.match(prompt, /아직 시간이 남았거나/);
assert.match(prompt, /이유만으로 턴을 끝내지 않는다/);
assert.match(prompt, /중요한 대화·관계 변화·발견·갈등·전투/);
assert.match(prompt, /시간 경과보다 장면의 깊이를 우선/);
assert.match(prompt, /일상·이동·절차는 빠르게 압축/);
assert.match(prompt, /등록 인물이 자연스럽게 존재할 수 있다면 배경에서 숨기지 않는다/);
assert.match(prompt, /설정집이 비워 둔 사소한 생활·공간·수업·관습·엑스트라 등의 세부/);
assert.match(prompt, /자연스럽게 보완해도 된다/);
assert.match(prompt, /다음 경로를 바꿀 수 있는 첫 지점에서 넘긴다/);
assert.match(prompt, /선택지 목록이나 무엇을 할지 묻는 문장으로 반환하지 말고/);

assert.equal(presentation.characters?.serena?.hair, '백발', 'Serena presentation Canon must preserve white hair');

for (const forbidden of [
  /한 장면에.{0,20}(?:명|개)/,
  /NPC.{0,20}(?:점수|가중치|threshold|score)/i,
  /cast rotation/i,
  /prose quota/i,
]) {
  assert.doesNotMatch(prompt, forbidden, `Writer prompt must not add deterministic cast/prose quotas: ${forbidden}`);
}

console.log('PASS Golden3 Writer behavior contract');
