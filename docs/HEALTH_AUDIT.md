# LUMENSIA — PERIODIC HEALTH AUDIT

This checklist is for periodic whole-game inspection after major Writer-context, persistence, UI, or state changes.

The purpose is not to add more narrative rules. It is to catch cross-layer drift before it becomes a long-play bug.

## Core rule

`CI GREEN != NARRATIVE QUALITY PASS`

Automated tests protect hard architecture and persistence contracts. Human gameplay is still required for pacing, emotional life, character voice, cast variety, and original feel.

## 1. Repository / deployment

- refetch current `main`, active branch and PR head
- verify active PR base/head and Draft/merge state
- run full GitHub Actions suite
- verify Vercel exact-head deployment
- confirm no accidental extra Writer/planner call

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
- NPC selector/scoring/rotation/cooldown
- emotion score
- threat scaler
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
- NPCs do not magically know internal/system-only ranks or facts
- character emotional temperature differs by personality and situation
- surprise, anger, curiosity, fear, delight, embarrassment, tension, etc. are not all flattened into tiny polite reactions
- actual danger/conflict still receives proportionate consequences
- user retains new PC dialogue, emotion and meaningful decisions

## 4. Cast health

Check over a multi-scene run:

- current characters persist only while actually present
- characters can naturally leave after time/location/action changes
- previous `present_character_keys` do not behave like a fixed casting recommendation
- recent-history repetition does not trap the same Named NPC trio indefinitely
- other plausible academy-living Named characters remain available without forced rotation
- generic extras remain available for ordinary support roles
- no cast quota or rotation engine is introduced to solve taste problems

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
- previous-day opening/schedule facts do not leak into later dates

## 6. PC factual state

Verify Writer-confirmed changes persist into INFO and the next Writer turn:

- stats / graded skill growth
- equipment gained/lost/consumed
- injury / condition added or removed
- gold actually gained/spent/lost

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

## 8. Save / long-run durability

- full play history remains in save/export; rendering optimization must not delete old turns
- older history can still be viewed on demand
- export/import preserves PC, scene, relationships, growth, continuity and history
- State Keeper failure leaves Writer prose intact
- failed bookkeeping can be retried without another Writer call
- existing older saves migrate missing optional state objects safely

## 9. PC creator fidelity

Test a long pasted PC:

- realm/circle/talents/stats are visible as high-salience facts
- accepted background/profile tail is not silently truncated before Writer assembly
- Trait/Authority/skill/equipment/condition use one line per item
- commas inside an item description are preserved
- JSON and human-readable paste both work

## 10. UI / character art

- registered Named-character dialogue resolves to art
- canonical full-name speaker labels also resolve to the same character asset
- image load/cached-load does not leave valid art transparent
- expression inference remains presentation-only
- missing art fails soft without affecting narrative/state
- long-history paging remains usable on mobile

## 11. Canon / dated-state freshness

- immutable Canon remains intact
- dated scenario `start` facts appear only when actually applicable
- already-past same-day schedule facts leave ordinary Writer context
- previous-day schedule facts do not remain active
- dated character state is treated as a start snapshot, not immutable identity

Long-play warning: mutable NPC academic year/office/realm/presence is not yet a complete durable overlay. Reassess when play begins spanning meaningful weeks/months or when an NPC state actually changes.

## 12. Documentation drift

After a major architecture change, verify these describe the actual code rather than an old experiment:

- `docs/LUMENSIA_HANDOVER_CURRENT.md`
- `docs/NEXT_ACTION.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTINUITY_PERSIST_01.md`
- this file

Historical experiment documents must be clearly marked historical/superseded if retained.

## Recommended cadence

Run this audit:

- after a major Writer/context change
- after a persistence/state-system expansion
- before merging a large stacked PR
- after several days of qualitative gameplay
- whenever multiple unrelated symptoms appear at once

Do not patch every one-off narrative oddity. First determine whether it is a repeatable cross-layer defect, a context bias, a factual-state bug, or ordinary model variance.