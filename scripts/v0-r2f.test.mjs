import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const api = readFileSync('api/write.js', 'utf8');

execFileSync(process.execPath, ['--check', 'api/write.js'], { stdio: 'pipe' });

assert.match(api, /academic-calendar\.json/, 'R2F should expose existing academic calendar facts to the Writer');
assert.match(api, /opening_baseline_period/, 'opening academic period must be labeled as opening baseline rather than current runtime state');
assert.match(api, /opening_day_dated_world_facts/, 'dated opening-day facts must be labeled as opening-only facts');
assert.match(api, /current_scene date and time are the authoritative present/, 'current continuity must outrank the opening baseline');
assert.match(api, /preserve that span instead of stretching or shrinking time/, 'explicit elapsed duration must not be stretched to hit a schedule milestone');
assert.match(api, /Familiarity records recognition and history of personal contact; it is not companionship/, 'familiarity must not imply companionship');
assert.match(api, /met or acquaintance alone is not a reason for an NPC to wait for the PC/, 'met/acquaintance must not auto-create proximity');
assert.match(api, /Do not invert this into universal distance/, 'social-distance correction must not make every stranger cold');
assert.match(api, /Affinity is affective temperature, not social access/, 'affinity must remain a signal rather than a behavior gate');
assert.match(api, /Do not use bells, doors opening, staff, professors, schedules, or authority figures as automatic punctuation/, 'institutional beats must not become generic scene closers');
assert.match(api, /Do not restate the exact user action as a second authored beat/, 'Writer should avoid redundant user-action replay');

assert.doesNotMatch(api, /parseRelativeTime|relativeTimeRegex|timeEngine|calendarEngine|companionState|affiliationState|partyState|socialAccessScore|proximityScore/i, 'R2F must not add deterministic time/social-control engines');
assert.equal((api.match(/https:\/\/api\.openai\.com\/v1\/responses/g) || []).length, 1, 'R2F remains one Writer call');

console.log('PASS V0-R2F Writer semantics rebalance invariants');
