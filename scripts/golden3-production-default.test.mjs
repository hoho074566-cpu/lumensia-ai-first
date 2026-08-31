#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const client = readFileSync('src/client.js', 'utf8');

assert.match(html, /searchParams\.set\('context', 'compact'\)/, 'production root must default to compact context');
assert.match(html, /searchParams\.set\('output', 'raw'\)/, 'production root must default to raw prose output');
assert.match(html, /if \(!url\.searchParams\.has\('context'\)\)/, 'explicit context query must override the production default');
assert.match(html, /if \(!url\.searchParams\.has\('output'\)\)/, 'explicit output query must override the production default');
assert.match(client, /new URLSearchParams\(window\.location\.search\)/, 'client must continue reading URL-selected writer modes');
assert.match(client, /PARITY_LABEL/, 'UI must keep the active writer mode visible');

console.log('PASS Golden3 production defaults to COMPACT / RAW with explicit query overrides preserved');
