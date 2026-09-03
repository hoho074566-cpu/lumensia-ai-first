# LUMENSIA AI-FIRST — CURRENT ARCHITECTURE

## Core ownership

```text
System = Facts
User   = New PC Intent
AI     = Scene Composition
```

The project deliberately prefers **Less Engine, More AI**.

The system owns durable truth and validation. It does not choose dramatic beats, paragraph order, cast rotation, emotional intensity, or the next interesting event.

## Normal gameplay turn

```text
CLEAN CANON / FIXED SOURCEBOOK MATERIAL
+ CURRENT PC / SCENE / RELATIONSHIP FACTS
+ DURABLE SEMANTIC CONTINUITY
+ RECENT CHAT (latest 5 turns)
+ EXACT USER INPUT
                 │
                 ▼
       ONE GOLDEN3 WRITER CALL
        (COMPACT / RAW default)
                 │
                 ▼
          SAVE + RENDER PROSE
                 │
                 ▼
      ONE UNIFIED STATE KEEPER
  growth + relationship + factual PC state
        + semantic scene continuity
                 │
                 ▼
       DURABLE NEXT-TURN STATE
```

The Writer is the only narrative model call. The State Keeper is bookkeeping only and cannot rewrite the prose that was already shown to the player.

If State Keeper fails, the Writer scene remains saved. Bookkeeping may be retried without making another Writer call.

FULL-HEALTH-AUDIT hardens that boundary transactionally below Writer: the saved turn is marked pending before Keeper transport, interrupted/failed bookkeeping must be recovered before another gameplay Writer turn, and late async results from a replaced run are discarded. This is data integrity, not narrative control.

## Writer material

Production defaults:

- `context=compact`
- `output=raw`
- reasoning: medium
- one Writer call

COMPACT is a **fixed academy sourcebook profile**, not a turn-by-turn relevance or NPC selector system. It provides:

- academy Canon
- academy layout
- power system
- empire core
- dated scenario facts that are still applicable
- unresolved world stimuli as authorial facts, not an event queue
- all characters whose starting `presence` places them in the current academy living population

FULL remains a diagnostic profile with the wider durable sourcebook.

The old `api/lib/canon-context.js` may remain as factual Canon tooling/tests, but it is **not the production Golden3 Writer-material router**. Its retrieval tests do not by themselves prove that every `knowledge.json` fact reaches `assembleAuthoring(...)`.

## Dated scenario freshness

`data/scenarios/academy-1285-03-01/baseline.json` and `open-situations.json` are start snapshots, not permanent present-tense scenes.

- exact untouched opening may receive the full `start` facts
- after opening, the start situation is omitted from the normal sourcebook packet
- already-past same-day dated facts are omitted
- start-day dated facts are omitted on later dates
- remaining schedule facts are facts only, never event commands
- later run truth overrides a changed/resolved starting world-stimulus fact
- a clearly expired stimulus horizon is not reintroduced as active without current-run support

`09:00` is not itself a bell, event trigger, or scene instruction.

## Character data

Durable character Canon contains identity, personality, values, voice, capabilities and verified presentation.

`character-state.json` contains **1285-03-01 starting mutable state** such as academy presence, year, office, realm/circle. It is not immutable identity. Current run truth must win when play later establishes a changed state.

A complete long-term mutable NPC overlay is not yet implemented. Add one only when real long-run gameplay demonstrates a need; do not turn it into an NPC scheduler.

## PC runtime facts

Writer-facing PC facts include:

- identity / origin / status / admission
- martial realm / magic circle
- talents / stats
- background / profile
- Trait / Authority
- skills
- equipment / inventory
- conditions / injuries
- gold

High-salience core facts such as realm, circle, talents and stats are grouped before long prose fields so they are not buried by a large character profile.

Creator list fields use **one line per item** so commas inside descriptions remain part of the item. Writer ingress should preserve the same accepted per-item limits used by the status/runtime layer rather than silently shortening them again.

## PC premise authority principle

PC settings, abilities, origin and demonstrated actions are world facts, not automatic plot commands.

NPC/world reactions depend on observable facts plus their own knowledge, experience and personality. New evidence can update prior judgment, distance and role assumptions. Writer-level knowledge of the full PC sheet is not equivalent to an NPC knowing an unobserved PC technique or past act.

A strong or unusual PC does not automatically escalate danger, investigation, isolation, interrogation or research. This anti-escalation boundary does not suppress character-specific emotion. Once a routine procedure has achieved its purpose, it should not remain the story's active subject by inertia.

This is a semantic Writer-facing boundary, not a threat engine, reaction score or procedural state machine.

## Recent chat and semantic continuity

Recent raw prose is intentionally limited to the latest **5 turns** to reduce cast/tone/context inertia.

Older durable information is carried by State Keeper semantic memory:

- important/completed facts
- already-shared key information / exchanges
- unresolved important threads
- actual current scene state

The compact snapshot is memory, not a plan. It must not invent future scenes.

Present-character keys record who is actually present at the end of a scene. They are not a recommendation for who should appear again. Characters who naturally leave must be removed.

## Request transport vs durable history

The full campaign history remains in the local save/export, but it must not be uploaded in full merely because the save contains it.

FULL-HEALTH-AUDIT transport rules:

- Writer request transport carries only a recent bounded history window; production Authoring Runtime still chooses the latest 5 Writer-facing turns;
- State Keeper transport omits story history because Keeper does not consume it;
- transport compaction must never delete or mutate durable local history;
- long Writer beats are split safely before Keeper's per-beat sanitizer so a legal beat ending is not lost.

These are bandwidth/integrity optimizations below narrative composition.

## Factual PC-state bookkeeping

State Keeper may persist Writer-confirmed changes to:

- equipment / inventory gained, removed, consumed or lost
- injury / condition added or removed
- actual gold gained, spent or lost

It must not estimate routine costs that the fiction did not establish.

This factual-state channel does not modify realm, magic circle, innate talents, Trait or Authority.

Growth remains separately governed by the semantic evidence ledger for existing graded skills and four core stats.

User-facing graded skill rows may include descriptive suffixes such as `대검술:A+ — 설명`. Keeper may receive a parseable grade-only shadow, but any applied promotion must preserve the user-visible description.

## Long scene handling

State Keeper input is bounded, but long Writer scenes preserve both **the beginning and the ending**. The middle may be compacted when necessary.

This prevents the common failure where victory, injury, location change, departed cast or another final consequence appears after a simple first-N-character truncation.

A legal Writer beat may be longer than Keeper's internal per-beat sanitizer, so transport must split the beat losslessly before that sanitizer rather than drop its tail.

## Save / history

The durable save preserves the full play history. Mobile rendering initially shows a recent chunk and allows older turns to be expanded on demand.

Rendering optimization must never delete old story turns from the save/export.

Current known long-run limitation: full history still lives in browser `localStorage`, so very long campaigns may eventually hit origin quota. Future storage stabilization should use IndexedDB/segmented history with export compatibility instead of deleting old turns.

## Relationships

Relationships are semantic:

- one main relationship label
- up to three auxiliary signals
- recent evidence

There is no numeric affection/trust XP. Relationship labels are Writer-side facts, not automatic NPC vocabulary.

## Growth

There is no XP threshold engine.

State Keeper may record semantic evidence and promote an existing graded skill or core stat by one grade step when the evidence contract is satisfied.

Realm, circle, innate talents, Trait and Authority are outside automatic GROWTH-01A promotion.

## Presentation / diagnostics

Character image/expression logic is presentation-only.

RAW prose is recognized only when a speaker label maps to a registered character. Both registered short names and canonical full labels beginning with that short name may map to the same asset.

Presentation inference never feeds back into Writer, Canon, relationship or state logic.

NPC appearance frequency is also read-only diagnostic data. Nested names such as `세레나`/`레나` must be counted without substring collisions, and authoritative Keeper-persisted cast should supersede stale RAW fallback cast when available.

## Forbidden narrative machinery

Do not reintroduce merely to supervise prose:

- Event Director / Event Engine
- prose-controlling Schedule Engine
- random encounter / forced stimulus table
- NPC selector score
- cast rotation/cooldown system
- hook / attention / event-density meter
- threat / emotion / pressure / scene-temperature scores
- prose quotas
- Korean semantic-regex narrative control
- extra planning model calls merely to choose the next beat

## Validation philosophy

Automated validation protects hard invariants:

- data/schema integrity
- one Writer + one State Keeper call architecture
- Canon boundaries
- PC state persistence
- growth / relationship invariants
- semantic continuity
- bookkeeping transaction/retry safety
- stale async result rejection
- request transport boundedness without local history deletion
- input authority
- save/history durability
- UI/diagnostic regressions

Narrative taste remains a human gate.

`CI GREEN != NARRATIVE QUALITY PASS`

See `docs/HEALTH_AUDIT.md` and `docs/FULL_HEALTH_AUDIT_01.md` for whole-game audit procedures and findings.
