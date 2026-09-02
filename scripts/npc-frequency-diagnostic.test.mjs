#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const statusUi = readFileSync('src/pc-status-ui.js', 'utf8');
const authoringRuntime = readFileSync('api/lib/authoring-runtime.js', 'utf8');
const stateKeeper = readFileSync('api/state-keeper.js', 'utf8');

assert.match(statusUi, /function npcAppearanceStats\(/, 'INFO must expose a local NPC appearance counter');
assert.match(statusUi, /\.slice\(-maxTurns\)/, 'diagnostic must use a bounded recent sample instead of rewriting history');
assert.match(statusUi, /persistedSceneState\?\.present_character_keys/, 'diagnostic may count persisted presence facts');
assert.match(statusUi, /beat\?\.speaker_key/, 'diagnostic may count structured speaker keys');
assert.match(statusUi, /text\.includes\(name\)/, 'RAW prose names must be observable for diagnostic counting');
assert.match(statusUi, /NPC APPEARANCE DIAGNOSTIC/, 'INFO must visibly label the diagnostic');
assert.match(statusUi, /읽기 전용이며 Writer 입력에는 사용하지 않음/, 'UI must state the diagnostic is read-only');

assert.doesNotMatch(statusUi, /fetch\(['"]\/api\/write/, 'NPC frequency diagnostic must never call the Writer');
assert.doesNotMatch(statusUi, /fetch\(['"]\/api\/state-keeper/, 'NPC frequency diagnostic must never call State Keeper');
assert.doesNotMatch(statusUi, /authoring-runtime|lumensia-academy\.json|prompt_template/, 'diagnostic must not touch Writer authoring inputs');
assert.doesNotMatch(authoringRuntime, /npcAppearanceStats|NPC APPEARANCE DIAGNOSTIC/, 'appearance frequency must not feed back into Writer context');
assert.doesNotMatch(stateKeeper, /npcAppearanceStats|NPC APPEARANCE DIAGNOSTIC/, 'appearance frequency must not become bookkeeping or cast control');

console.log('PASS read-only NPC appearance frequency diagnostic');