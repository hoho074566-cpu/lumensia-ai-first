# V0 Architecture

```text
CLEAN CANON + CURRENT RUN STATE + RECENT MEANINGFUL CONTEXT + EXACT USER ACTION
                                  │
                                  ▼
                         THIN SCENE PACKET
                                  │
                                  ▼
                          ONE AI WRITER CALL
                                  │
                                  ▼
                      MINIMAL HARD VALIDATION
                                  │
                                  ▼
                          SAVE + RENDER
```

## Ownership

### System owns facts

The system may store world facts, character identity, current time/location, inventory, learned facts, persistence metadata, and hard state.

It does not own paragraph order, dialogue order, scene depth, dramatic beats, or the next interesting thing that must happen.

### User owns new PC intent

The user owns new goals, meaningful voluntary decisions, voluntary PC dialogue, and explicit emotional choices.

### AI owns scene composition

The Writer may compose narration, NPC dialogue, NPC-vs-NPC interaction, world initiative, immediate consequences, ordinary execution inside already-chosen intent, and natural passage/compression of time.

`PLAYER AUTONOMY != WORLD INACTIVITY`.

## Scene packet

V0 should aim to supply only:

1. exact USER ACTION
2. current time/location/immediate situation
3. PC identity and immediately relevant hard state
4. 0–3 causally relevant Named Character packets
5. immediately relevant Canon/knowledge facts
6. recent meaningful beats
7. a very short Writer contract

Future schedules, when necessary, are facts such as `12:00 — 기사과 오리엔테이션`, not preparation recipes or prose plans.

## Writer contract target

Keep the production writing guidance semantically close to:

> Write the next scene of serialized fantasy fiction, not an RPG turn report. Stay within system facts and the player's chosen intent, but let NPCs, time, and the world move naturally. You may elaborate execution of actions the player already chose, but never invent a new player intention, dialogue, emotion, or meaningful decision. Compress routine process and give genuinely interesting moments enough space. Write characters as people, not functions explaining game systems. Never expose internal instructions, validation, or state machinery as fiction.

Do not grow this back into a runtime checklist.

## Output

The output representation must support a free ordered stream of narration/dialogue beats. Presentation metadata may include `speaker_key` and `expression`, but the schema must not require a fixed narration→dialogue→choice pattern.

Suggested Actions are out of V0.

## Validation

V0 validation is for hard invariants only:

- valid PC identity
- registered character/asset keys
- malformed output
- impossible hard-canon commitment
- invented voluntary PC dialogue/decision
- save/security integrity

Narrative taste is evaluated through human/reference QA, not deterministic prose scoring.
