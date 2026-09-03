# LUMENSIA AI-FIRST — CURRENT HANDOVER

> **READ THIS FIRST IN A NEW SESSION**
>
> Repository: `hoho074566-cpu/lumensia-ai-first`
>
> Always refetch `main` and the active stacked PR heads before acting. Do not reuse an old SHA from a previous conversation.

---

## 1. Accepted production baseline

Golden3 is the human-accepted Writer regression floor and is already on `main`.

- Promotion PR #35: MERGED
- Production-default PR #36: MERGED
- Production Writer mode: **COMPACT / RAW**
- one narrative Writer call per normal turn
- accepted feel: world-driven progression, routine compression, important-scene depth, natural Named Cast, PC autonomy, Canon-compatible minor inference, natural handoff

The accepted Golden3 `prompt_template` is protected. See `docs/GOLDEN3_BASELINE.md`.

---

## 2. Actual active stack

Current human gameplay target:

**PR #45 — WORLD-STIMULUS-01**

- branch: `codex/world-stimulus-01`
- base: PR #44 / `codex/living-consequence-01`
- human-test exact head when FULL-HEALTH-AUDIT-01 started: `4a97e04928c62307cb7f38f7fdfc10dfd6e62353`
- status: Draft / unmerged
- do not mutate that exact human-test head while a qualitative test is in progress

Stack underneath:

1. PR #37 — original-style dialogue / character image UI
2. PR #38 — PC status / INFO
3. PR #39 — AI-first semantic growth
4. PR #40 — semantic PC-NPC relationships
5. PR #42 — continuity persistence / situation input / factual PC state / health fixes
6. PR #43 — CANON-LIVING / broad cast / Character Depth / anti-interrogation / read-only NPC frequency diagnostic
7. PR #44 — LIVING-CONSEQUENCE / semantic promise-favor-rumor-aftermath persistence
8. PR #45 — WORLD-STIMULUS / pressure + opportunity + social heat + NPC knowledge boundary

Do not separately re-implement layers already present in this stack.

---

## 3. Parallel hard-integrity audit candidate

A whole-runtime audit is being performed **above** the frozen PR #45 playtest head:

- branch: `codex/full-health-audit-01`
- base: `codex/world-stimulus-01`
- purpose: hard integrity, payload, persistence, diagnostic and stale-result defects only
- Writer prose policy / Golden3 prompt is not being retuned here
- document: `docs/FULL_HEALTH_AUDIT_01.md`

Important audit findings include:

- crash/reload during State Keeper could silently lose bookkeeping;
- failed bookkeeping could be skipped by generating another turn;
- late async results could contaminate a newly created/imported run;
- `Skill:Grade — description` was not parseable by the growth system;
- legal 2600-char Writer beat tails could be cut before Keeper saw them;
- full campaign history was unnecessarily uploaded on every Writer and Keeper request;
- NPC appearance diagnostic could count `세레나` as `레나`;
- Writer ingress silently shortened several accepted PC list fields;
- dated WORLD-STIMULUS start facts needed explicit later-run precedence;
- old handover docs still incorrectly named PR #42 as the top stack.

All audit fixes must remain below the Writer or be factual hard-boundary corrections. Do not turn them into narrative controllers.

---

## 4. Current normal-turn architecture

1. Canon/sourcebook + current PC/scene/relationship facts + semantic continuity + latest 5 Writer-facing raw turns + exact user input
2. **one Golden3 Writer narrative call**
3. Writer prose is saved/rendered immediately
4. **one unified State Keeper bookkeeping call**
5. growth / relationships / factual PC state / scene state / semantic continuity are persisted
6. next Writer reads the latest durable facts

State Keeper never rewrites Writer prose.

FULL-HEALTH-AUDIT candidate additionally makes bookkeeping transaction-safe below the Writer:

- the latest turn is durably marked pending before Keeper transport;
- pending/failed bookkeeping blocks another gameplay Writer turn until recovered;
- interrupted pending bookkeeping becomes retryable after reload/import;
- stale responses from a replaced run are discarded;
- read-only Admin Preview may still be used while gameplay bookkeeping is blocked.

---

## 5. Protected Writer boundary

Do not reintroduce merely to supervise prose:

- Event Director / Event Engine
- prose-controlling Schedule Engine
- random encounter / forced stimulus table
- NPC selector score
- cast rotation / cooldown / appearance quota
- threat / emotion / pressure / scene-temperature scores
- hook / attention / density meters
- prose quotas
- Korean semantic-regex narrative controller
- extra planning model calls merely to choose the next beat

Prefer factual/context/persistence fixes below Writer over one-off narrative rules.

---

## 6. Current qualitative targets

Human gameplay on PR #45 should verify:

- WORLD-STIMULUS adds danger/mystery/opportunity/social heat without random-event-machine behavior;
- calm scenes remain possible but the world no longer feels asleep for long stretches;
- different stimulus types naturally broaden the Named NPC cast instead of explicit rotation;
- NPCs do not know undemonstrated PC techniques as confirmed facts;
- Character Depth remains surprising-but-believable rather than gimmicky;
- LIVING-CONSEQUENCE remembers real promises/favors/rumors/aftermath without forced callbacks;
- supplied PC facts do not become interrogation/checklist loops;
- Golden3 prose quality and PC authority remain strong.

After that qualitative result, separately compare the FULL-HEALTH-AUDIT candidate for integrity regressions. Do not merge merely because automated checks are green.

---

## 7. Known deferred / operational items

### Very-long-run storage

Full story history is still persisted in browser `localStorage`. Mobile history paging reduces DOM cost, not storage size. Extremely long campaigns may eventually hit browser origin quota.

Correct future stabilization: IndexedDB / segmented history archive with export compatibility. Do not delete old story turns as a shortcut.

### Deployment access token

`/api/write` and `/api/state-keeper` enforce `LUMENSIA_ACCESS_TOKEN` only when that environment variable is configured. The repository cannot reveal whether Vercel secrets are configured.

If deployment is not intentionally public, human deployment configuration must confirm `LUMENSIA_ACCESS_TOKEN` is set.

### Mutable long-term NPC/world state

Academic year, office, NPC realm/circle and long-term presence overlay remain deferred until real long-play requires them. Do not solve with NPC simulation ticks or a scheduler.

### Canon retrieval test interpretation

`api/lib/canon-context.js` is a selective Canon retrieval utility and has its own regression tests, but the current Golden3 production Writer path is `api/lib/authoring-runtime.js`.

Therefore `canon-retrieval.test.mjs` is a support/data invariant, not proof that every `knowledge.json` fact reaches the production Writer. Production-path facts that matter to play should also be asserted through `assembleAuthoring(...)`.

---

## 8. New-session start order

1. Refetch actual `main`.
2. Refetch PR #45 and any FULL-HEALTH-AUDIT PR/candidate exact heads.
3. Read this file.
4. Read `docs/GOLDEN3_BASELINE.md`.
5. Read `docs/NEXT_ACTION.md`.
6. Read `docs/ARCHITECTURE.md`.
7. Read `docs/HEALTH_AUDIT.md` and `docs/FULL_HEALTH_AUDIT_01.md` before state/context/runtime work.
8. Keep the human-tested PR #45 head distinct from audit corrections above it.
9. Do not resume old failed narrative-engine experiments.

`GOLDEN3_BASELINE: ACCEPTED`

`HANDOFF_READY: PASS`

`NEXT_ACTION: finish exact-head FULL-HEALTH-AUDIT verification without mutating PR #45 -> collect human PR #45 qualitative verdict -> compare audit candidate separately -> merge decisions only after human acceptance.`
