# LUMENSIA — PERIODIC HEALTH AUDIT

This checklist is for periodic whole-game inspection after major Writer-context, persistence, UI, or state changes.

The purpose is not to add more narrative rules. It is to catch cross-layer drift before it becomes a long-play bug.

## Core rule

`CI GREEN != NARRATIVE QUALITY PASS`

Automated tests protect hard architecture and persistence contracts. Human gameplay is still required for pacing, emotional life, character voice, cast variety, and original feel.

## 1. Repository / deployment

- refetch current `main`, active stacked PRs and exact human-test head
- verify active PR base/head and Draft/merge state
- keep a frozen human-test head distinct from any parallel hard-integrity audit branch
- run full GitHub Actions suite
- verify Vercel exact-head deployment
- confirm no accidental extra Writer/planner call
- if deployment is not intentionally public, confirm `LUMENSIA_ACCESS_TOKEN` is actually configured in deployment environment

## 2. Writer architecture

Expected normal turn:

1. current Canon/sourcebook facts + current run state + continuity + recent chat + exact user input
2. one Golden3 Writer narrative call
3. save/render Writer prose immediately
4. one unified State Keeper bookkeeping call
5. persist factual changes for the next Writer turn

Must remain absent:

- Event Director / Event Engine
- prose-controlling schedule engine
- random encounter / forced-stimulus table
- NPC selector/scoring/rotation/cooldown
- emotion / threat / pressure / scene-temperature score
- prose quota
- semantic-regex narrative controller
- extra planning model call

## 3. Writer qualitative probes — fresh save

Use several different PC intensities, not only one favored PC.

Check:

- quiet ordinary life can remain quiet
- the world advances through routine without waiting for the user
- important scenes deepen instead of being summarized away
- procedures stop when their purpose is satisfied
- a strong/unusual PC does not automatically summon matching threats or institutional investigation
- PC hard facts such as realm, injuries and equipment materially affect plausible judgment
- observed competence changes informed NPC judgment when evidence warrants it
- NPCs do not treat unobserved PC techniques/habits/past acts as confirmed knowledge merely because Writer knows the PC sheet
- character emotional temperature differs by personality and situation
- surprise, anger, curiosity, fear, delight, embarrassment, tension, etc. are not all flattened into tiny polite reactions
- actual danger/conflict still receives proportionate consequences
- WORLD-STIMULUS can provide mystery/opportunity/social heat without making every scene an incident
- user retains new PC dialogue, emotion and meaningful decisions

## 4. Cast health

Check over a multi-scene run:

- current characters persist only while actually present
- characters can naturally leave after time/location/action changes
- previous `present_character_keys` do not behave like a fixed casting recommendation
- recent-history repetition does not trap the same Named NPC trio indefinitely
- other plausible academy-living Named characters remain available without forced rotation
- different real pressures/opportunities create different natural character relevance
- generic extras remain available for ordinary support roles
- no cast quota or rotation engine is introduced to solve taste problems
- read-only NPC frequency diagnostic does not false-count nested names such as `세레나` → `레나`
- authoritative Keeper-persisted cast supersedes stale RAW fallback cast in diagnostics

## 5. Continuity / scene state

Test at minimum:

- time progression
- location changes
- present cast leaving/joining
- completed events do not replay
- already-answered questions are not asked as new information
- open threads disappear when resolved
- completed procedure/evaluation/reporting does not remain the active situation
- long Writer scenes preserve their ending for State Keeper extraction
- legal Writer beats near the 2600-char limit do not lose their final consequence before Keeper sees them
- previous-day opening/schedule facts do not leak into later dates
- later run truth overrides resolved/changed WORLD-STIMULUS start facts
- clearly expired start-snapshot opportunities are not resurrected without current-run support

## 6. PC factual state

Verify Writer-confirmed changes persist into INFO and the next Writer turn:

- stats / graded skill growth
- equipment gained/lost/consumed
- injury / condition added or removed
- gold actually gained/spent/lost

Also verify:

- rich skill rows such as `Skill:S — description` participate in growth and keep their description after promotion
- unchanged long equipment descriptions are not shortened merely because State Keeper uses a smaller internal normalization limit
- Writer ingress accepts the same per-item limits as the status/runtime layer

Do not infer a cost merely because routine activity happened.

The factual-state channel must not silently modify:

- martial realm
- magic circle
- innate talents
- Trait
- Authority

Those need explicit separately reviewed mechanics or manual/admin state changes.

## 7. Relationship / growth

Relationship:

- no numeric affection/trust XP
- ordinary interaction does not spam relationship transitions
- meaningful/milestone evidence can change main/aux state
- mutual romance milestone required for `연인`
- next Writer naturally reflects relationship facts without speaking system labels

Growth:

- no XP threshold engine
- routine single action does not immediately rank up
- prior evidence + current meaningful evidence, or a true breakthrough, is required
- promotion is at most one grade step per target
- used evidence is consumed

## 8. Bookkeeping transaction safety

Explicitly test interruption, not only clean success/failure:

- immediately after Writer scene save, State Keeper turn becomes durably `pending`
- app close/reload during Keeper converts pending to retryable failed bookkeeping
- failed/pending latest bookkeeping blocks another **gameplay** Writer turn
- retry uses the saved Writer scene and never regenerates prose
- read-only Admin Preview may remain available while gameplay bookkeeping is blocked
- import of a save containing pending bookkeeping becomes retryable instead of deadlocking
- creating/importing a replacement run while an old Writer/Keeper request is in flight causes the old late result to be discarded

## 9. Request transport / long-run bandwidth

The durable save and network payload are different concerns.

Check:

- full play history remains in local save/export
- Writer request transport sends only a bounded recent history window
- State Keeper request transport does not send story history it never consumes
- request-size optimization never mutates or deletes local durable history
- long Writer beat splitting before Keeper is lossless

This matters for mobile/Starlink data use and long-run latency.

## 10. Save / long-run durability

- full play history remains in save/export; rendering optimization must not delete old turns
- older history can still be viewed on demand
- export/import preserves PC, scene, relationships, growth, continuity and history
- existing older saves migrate missing optional state objects safely

Known limitation: full campaign history still lives in browser `localStorage`. UI paging does not reduce stored bytes. Very long campaigns may eventually hit browser origin quota; future stabilization should use IndexedDB/segmented history rather than deleting old turns.

## 11. PC creator fidelity

Test a long pasted PC:

- realm/circle/talents/stats are visible as high-salience facts
- accepted background/profile tail is not silently truncated before Writer assembly
- Trait/Authority/skill/equipment/condition use one line per item
- commas inside an item description are preserved
- JSON and human-readable paste both work

## 12. UI / character art

- registered Named-character dialogue resolves to art
- canonical full-name speaker labels also resolve to the same character asset
- image load/cached-load does not leave valid art transparent
- expression inference remains presentation-only
- missing art fails soft without affecting narrative/state
- long-history paging remains usable on mobile

## 13. Canon / dated-state freshness

- immutable Canon remains intact
- dated scenario `start` facts appear only when actually applicable
- already-past same-day schedule facts leave ordinary Writer context
- previous-day schedule facts do not remain active
- dated character state is treated as a start snapshot, not immutable identity
- WORLD-STIMULUS is treated as authorial starting facts, not event queue
- secrecy/visibility facts are not automatically NPC/public knowledge

Test-confidence note: `api/lib/canon-context.js` and its retrieval tests are support Canon tooling. The current Golden3 production Writer path is `api/lib/authoring-runtime.js`; when a Canon fact materially matters to play, also verify it through production `assembleAuthoring(...)` rather than assuming a support retrieval PASS proves production exposure.

Long-play warning: mutable NPC academic year/office/realm/presence is not yet a complete durable overlay. Reassess when play begins spanning meaningful weeks/months or when an NPC state actually changes.

## 14. Documentation drift

After a major architecture change, verify these describe the actual code rather than an old experiment:

- `docs/LUMENSIA_HANDOVER_CURRENT.md`
- `docs/NEXT_ACTION.md`
- `docs/ARCHITECTURE.md`
- `docs/HEALTH_AUDIT.md`
- any active stacked feature/audit document

Historical experiment documents must be clearly marked historical/superseded if retained.

## Recommended cadence

Run this audit:

- after a major Writer/context change
- after a persistence/state-system expansion
- before merging a large stacked PR
- after several days of qualitative gameplay
- whenever multiple unrelated symptoms appear at once

Do not patch every one-off narrative oddity. First determine whether it is a repeatable cross-layer defect, a context bias, a factual-state bug, or ordinary model variance.

For the current whole-runtime findings, also read `docs/FULL_HEALTH_AUDIT_01.md`.
