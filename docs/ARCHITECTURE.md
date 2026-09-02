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
- all characters whose starting `presence` places them in the current academy living population

FULL remains a diagnostic profile with the wider durable sourcebook.

The old `api/lib/canon-context.js` may remain as factual Canon tooling/tests, but it is **not the production Golden3 Writer-material router**.

## Dated scenario freshness

`data/scenarios/academy-1285-03-01/baseline.json` is a start snapshot, not a permanent present-tense scene.

- exact untouched opening may receive the full `start` facts
- after opening, the start situation is omitted from the normal sourcebook packet
- already-past same-day dated facts are omitted
- start-day dated facts are omitted on later dates
- remaining schedule facts are facts only, never event commands

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

Creator list fields use **one line per item** so commas inside descriptions remain part of the item.

## PC premise authority principle

PC settings, abilities, origin and demonstrated actions are world facts, not automatic plot commands.

NPC/world reactions depend on observable facts plus their own knowledge, experience and personality. New evidence can update prior judgment, distance and role assumptions.

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

## Factual PC-state bookkeeping

State Keeper may persist Writer-confirmed changes to:

- equipment / inventory gained, removed, consumed or lost
- injury / condition added or removed
- actual gold gained, spent or lost

It must not estimate routine costs that the fiction did not establish.

This factual-state channel does not modify realm, magic circle, innate talents, Trait or Authority.

Growth remains separately governed by the semantic evidence ledger for existing graded skills and four core stats.

## Long scene handling

State Keeper input is bounded, but long Writer scenes preserve both **the beginning and the ending**. The middle may be compacted when necessary.

This prevents the common failure where victory, injury, location change, departed cast or another final consequence appears after a simple first-N-character truncation.

## Save / history

The durable save preserves the full play history. Mobile rendering initially shows a recent chunk and allows older turns to be expanded on demand.

Rendering optimization must never delete old story turns from the save/export.

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

## Presentation

Character image/expression logic is presentation-only.

RAW prose is recognized only when a speaker label maps to a registered character. Both registered short names and canonical full labels beginning with that short name may map to the same asset.

Presentation inference never feeds back into Writer, Canon, relationship or state logic.

## Forbidden narrative machinery

Do not reintroduce merely to supervise prose:

- Event Director / Event Engine
- prose-controlling Schedule Engine
- NPC selector score
- cast rotation/cooldown system
- hook / attention / event-density meter
- threat scaler
- emotion score
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
- input authority
- save/history durability
- UI regressions

Narrative taste remains a human gate.

`CI GREEN != NARRATIVE QUALITY PASS`

See `docs/HEALTH_AUDIT.md` for the periodic whole-game audit procedure.