# FULL-HEALTH-AUDIT-01 — Whole Runtime Audit

## Scope

Audit base: exact WORLD-STIMULUS-01 head `4a97e04928c62307cb7f38f7fdfc10dfd6e62353` (PR #45).

The human playtest target PR #45 is intentionally untouched. Audit fixes live only on `codex/full-health-audit-01` until separately reviewed.

The audit traced:

Writer input → Writer response → local durable save → State Keeper → next Writer → UI/INFO → import/export → long-run transport/storage → Canon/stimulus precedence.

Protected boundary remains:

- accepted Golden3 `prompt_template` unchanged
- one Writer narrative call
- one unified State Keeper bookkeeping call
- no Director / scheduler / selector / rotation / pressure counter / extra planner

## Hard defects found and corrected on the audit branch

### 1. P1 — bookkeeping was not crash-safe

Before:

- Writer prose was saved before State Keeper, which correctly protected the scene;
- but the saved turn was not durably marked `pending` before the Keeper request;
- reload/app close during Keeper could therefore leave a scene whose growth/relationship/inventory/gold/continuity bookkeeping was silently never recorded;
- after an explicit Keeper failure, normal Writer controls were re-enabled, so generating another turn could make the previous failed turn no longer retryable.

Audit correction:

- mark the latest turn `stateKeeper.status=pending` in durable local storage before Keeper transport;
- interrupted `pending` becomes retryable `failed` on boot/pageshow/import;
- gameplay Writer calls are blocked while the latest bookkeeping is `pending` or `failed`;
- read-only Admin Preview remains available;
- the existing retry still reuses the saved Writer scene and does not make another narrative call.

### 2. P1 — late async response could attach to a replaced run

Before:

`새 게임` / `불러오기` are not disabled while a request is in flight. A late Writer or Keeper response could therefore return after the durable run had been replaced and risk mutating the wrong in-memory run.

Audit correction:

- capture the request run identity/history length;
- before exposing a Writer/Keeper response to the gameplay client, compare it with the current durable run;
- if the run has been replaced, discard the stale result.

No narrative retry is created.

### 3. P1 — rich graded skills did not participate in growth

User-facing PC settings may contain:

`팔레르모 스파다:S — 설명`

The existing State Keeper graded-skill parser expects the grade at the end of the string and therefore only understands a form like `팔레르모 스파다:S`.

Audit transport correction:

- Keeper receives a shadow skill list with `이름:등급` only;
- promotion output is restored onto the original rich description;
- e.g. `팔레르모 스파다:S` → `S+` returns to the UI/save as `팔레르모 스파다:S+ — 설명`.

The Writer still receives the original rich skill text.

### 4. P1/P2 — legal Writer beat tail could be invisible to Keeper

Writer beat limit: 2600 chars.
State Keeper per-beat sanitizer: 2400 chars.

A consequence placed in the final ~200 chars of a legal beat could disappear before bookkeeping.

Audit correction:

- State Keeper transport splits long Writer beats into <=2300-char chunks before the existing Keeper sanitizer;
- concatenated scene text remains lossless before the existing whole-scene 16k head+tail compaction.

### 5. P1/P2 — full campaign transcript was uploaded twice every turn

Before:

- `/api/write` received the whole `runState.history`, then server code only used the recent window;
- `/api/state-keeper` also received the whole history even though the Keeper does not read history.

This caused request bodies, mobile data usage and latency to grow with the entire campaign.

Audit correction:

- Writer network transport carries only the latest 8 turns; Authoring Runtime still consumes latest 5;
- Keeper transport omits history entirely;
- full history remains unchanged in the local save/export and mobile paging behavior is unchanged.

### 6. P2 — NPC appearance diagnostic over-counted characters

Before:

- simple substring counting meant `세레나` could also count `레나`;
- RAW fallback `turn.continuity.present_character_keys` was counted even when authoritative `persistedSceneState` existed and had already removed that cast member.

Audit correction:

- longest names are matched/masked first;
- Keeper-persisted cast is authoritative when present; RAW fallback cast is only used when persisted state is absent;
- diagnostic remains read-only and never feeds Writer/State Keeper.

### 7. P2 — PC list-item sanitizer limits disagreed

Status/runtime accepted:

- Skill 160 chars
- Trait 240
- Authority 240
- Equipment 180
- Condition 180

`/api/write` previously reduced several of those again to 120/220/220/160.

Audit correction aligns Writer ingress to the accepted runtime limits so user-visible settings are not silently shortened before Writer context.

Existing long equipment descriptions that the Keeper's older 160-char normalization would otherwise shorten are restored by the audit transport when unchanged.

### 8. P2 — WORLD-STIMULUS starting facts could become stale forever

`open-situations.json` is a 1285-03-01 starting snapshot. Without precedence language, a resolved opportunity/pressure could conflict with later run continuity or a `current_week` opening could appear immortal.

Audit correction only adds semantic precedence:

- later run truth always overrides the starting snapshot;
- clearly expired horizon items are not reintroduced as active without current-run support.

No timer, scheduler or offscreen simulation is added.

### 9. Documentation drift

`LUMENSIA_HANDOVER_CURRENT.md` / `NEXT_ACTION.md` still called PR #42 the active top stack even though human play had moved through #43 → #44 → #45.

Audit docs are updated to the actual stack and current human gate.

## Test-confidence finding

`api/lib/canon-context.js` + `scripts/canon-retrieval.test.mjs` still test a selective Canon retrieval utility, including `knowledge.json` visibility handling.

The current Golden3 production Writer path is `api/lib/authoring-runtime.js`, not `canon-context.js`.

Therefore:

- those retrieval tests remain useful support/Canon-data invariants;
- they must not be interpreted as proof that every `knowledge.json` fact reaches the production Writer;
- production-path Canon claims should also be tested through `assembleAuthoring(...)` when they matter to current gameplay.

This audit does **not** reconnect the whole knowledge ledger to Writer because that would be a separate context/precision change with possible prompt-size and narrative effects.

## Deferred risks / not silently rebuilt in this audit

### Very-long-campaign localStorage quota

Full history is intentionally preserved in browser `localStorage`. UI paging only reduces rendering; it does not reduce save size.

A sufficiently long campaign can eventually hit browser origin storage limits. Correct long-term treatment is IndexedDB/segmented history storage with export compatibility, not deleting old turns.

Status: deferred stabilization candidate; implement when long-play measurements justify it.

### Deployment access-token enforcement

`/api/write` and `/api/state-keeper` require `LUMENSIA_ACCESS_TOKEN` only when the environment variable is configured. A public deployment without that variable would expose API-backed endpoints to unauthenticated callers and could consume the server OpenAI budget.

Human/deployment action: confirm the Vercel production/preview environment sets `LUMENSIA_ACCESS_TOKEN` if the deployment is not intentionally public.

The audit cannot inspect secret environment values and therefore does not fail closed in code without that confirmation.

### Full mutable NPC/world-state overlay

Year/office/realm/long-term presence remains deferred. Do not solve it with an NPC simulation tick or scheduler.

## Human gate after automated PASS

After PR #45 qualitative testing, compare the audit candidate for:

1. identical or better Golden3 prose quality;
2. no loss of Character Depth / Living Consequence / WORLD-STIMULUS behavior;
3. failed/interrupted State Keeper cannot be skipped into another gameplay turn;
4. reload during bookkeeping produces a retryable state, not silent data loss;
5. rich `Skill:Grade — description` can accumulate/promote without losing description;
6. long Writer beat conclusions remain visible to Keeper;
7. new game/import while an old request is in flight cannot contaminate the replacement run;
8. INFO NPC counts no longer count `세레나` as `레나`;
9. long-history network usage no longer scales with the full transcript on every request.

`CI GREEN != NARRATIVE QUALITY PASS` still applies.

`STATUS: DRAFT / HARD-INTEGRITY AUDIT`
