# Next Action

## Current accepted baseline

Repository: `hoho074566-cpu/lumensia-ai-first`

Golden3 is the human-accepted Writer regression floor.

- production Writer mode: **COMPACT / RAW**
- one narrative Writer call
- one unified State Keeper bookkeeping call
- no narrative Director / selector / scheduler machinery

## Current active human test

**PR #45 — WORLD-STIMULUS-01** (`codex/world-stimulus-01`), Draft / unmerged.

Human-test exact head when the whole-runtime audit started:

`4a97e04928c62307cb7f38f7fdfc10dfd6e62353`

Do not mutate that exact playtest head while the current qualitative session is being evaluated.

PR #45 is stacked on:

- PR #42 continuity/factual-state/runtime fixes
- PR #43 CANON-LIVING + Character Depth + broad cast
- PR #44 LIVING-CONSEQUENCE

## Parallel audit candidate

`codex/full-health-audit-01` is stacked on exact PR #45 and is a **hard-integrity candidate**, not a new Writer-tuning experiment.

It currently addresses:

- crash-safe / retryable State Keeper bookkeeping
- no gameplay advance while latest bookkeeping is pending/failed
- late async Writer/Keeper result rejection after new-game/import run replacement
- recent-history-only Writer transport and no-history Keeper transport
- rich `Skill:Grade — description` growth compatibility
- lossless transport of legal long Writer beat tails into Keeper
- preservation of unchanged long equipment descriptions
- Writer PC-list sanitizer length alignment
- accurate read-only NPC frequency diagnostic (`세레나` no longer counts `레나`)
- later-run truth overriding stale WORLD-STIMULUS start facts
- current stack/handover documentation repair

See `docs/FULL_HEALTH_AUDIT_01.md`.

The accepted Golden3 `prompt_template` remains unchanged.

## Exact next action

1. Finish full CI and Vercel verification on the exact latest `codex/full-health-audit-01` head.
2. Compare audit branch against PR #45 and confirm no accidental narrative-policy / Writer-prompt change.
3. Open the audit work as a Draft PR based on `codex/world-stimulus-01`; do **not** merge it while PR #45 human qualitative testing is still active.
4. Collect the human verdict on PR #45:
   - stimulus / pacing
   - cast diversity
   - NPC knowledge boundary
   - Character Depth
   - Living Consequence
   - Golden3 prose quality.
5. If PR #45 passes, separately sanity-test the audit candidate for gameplay equivalence plus integrity fixes.
6. Merge decisions only after human acceptance; CI green alone is insufficient.

## Human PR #45 gate

Verify:

- ordinary life no longer stays sleepy for long stretches;
- real world pressures can surface through natural information/location/person paths;
- opportunities and social competition create excitement without requiring attacks;
- other NPCs can pursue opportunities without waiting for the PC;
- mystery does not automatically become Abyss/cult/conspiracy;
- secret pressure does not leak as universal public knowledge;
- NPCs do not know undemonstrated PC techniques as facts;
- Named NPC use broadens without deterministic rotation;
- real promises/favors/rumors/aftermath persist without forced callback;
- Character Depth does not become a repeated gimmick;
- Golden3 prose quality / PC authority remain strong.

## Audit-specific follow-up gate

After PR #45 verdict, verify on the audit candidate:

- reload/app close during bookkeeping becomes retryable instead of silently losing state;
- failed bookkeeping cannot be skipped by generating another gameplay turn;
- old async response cannot contaminate a new/imported run;
- rich graded skills can accumulate/promote while retaining description text;
- long Writer beat ending consequences reach Keeper;
- long campaign request payload does not scale with the full transcript every turn;
- INFO NPC count does not false-count nested names;
- existing equipment descriptions are not shortened merely by Keeper normalization.

## Deferred / human operational checks

- Very long campaigns may eventually hit `localStorage` quota. Future fix should be IndexedDB/segmented history, not deleting old turns.
- Confirm `LUMENSIA_ACCESS_TOKEN` is configured in deployment if Vercel API endpoints are not intentionally public.
- Full mutable NPC long-term state overlay remains deferred; no scheduler/NPC simulation.
- `canon-context.js` retrieval tests are support/data tests; production Writer facts must also be validated through `authoring-runtime.js` when relevant.

## Do not do

Do not reintroduce:

- Event Director / Event Engine
- prose-controlling Schedule Engine
- random event / encounter tables
- NPC selector scores / cast rotation / cooldown
- threat / emotion / pressure / scene-temperature scores
- hook / attention / density meters
- prose quotas
- Korean semantic-regex narrative control
- extra planning calls merely to choose the next beat

`GOLDEN3_BASELINE: ACCEPTED`

`HANDOFF_READY: PASS`

`NEXT_ACTION: exact-head audit CI/Vercel + diff verification -> keep PR #45 frozen for human verdict -> audit Draft PR only -> human acceptance before any merge.`
