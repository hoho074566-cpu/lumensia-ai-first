# V0 Architecture

```text
CLEAN CANON + DATED SCENARIO + CURRENT RUN STATE + EXACT USER ACTION
                              │
                              ▼
                 FACTUAL CANON RETRIEVAL
                  (relevance, not plot)
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

## Canon layers

1. immutable world Canon
2. durable character core / voice / presentation
3. epistemic Knowledge Canon
4. dated Scenario state (institution, character state, relationships, group attitudes, unresolved situations)
5. mutable run state

A later layer supersedes an earlier dated value when play changes it. A system truth does not automatically become PC or NPC knowledge.

## Factual retrieval boundary

`api/lib/canon-context.js` selects facts for the current turn. Its job is **not** to select story beats or decide which NPC must act.

Allowed retrieval work includes:

- current/mentioned/recently involved character details
- a thin index of Canon characters whose dated presence places them in the current academy population
- current dated character state and audited presentation
- existing relationships / group attitudes involving relevant characters
- location-relevant academy geography
- institution facts that the current action actually asks about or uses
- PC-visible Knowledge for selected subjects
- unresolved world situations only when the current action actually reaches them
- scheduled facts when explicitly queried or close enough to constrain the current scene

Retrieval must fail closed rather than flood the Writer with every fact the system knows.

`KNOW != MENTION`

`STATE != STORY BEAT`

`SYSTEM TRUTH != PC/NPC KNOWLEDGE`

### Schedule rule

A scheduled fact such as `12:00 — 기사과 오리엔테이션` is continuity state, not a preparation recipe and not an instruction to fill every prior scene with waiting or countdown prose.

Distant future schedule facts are omitted from ordinary packets until they are actually relevant or imminent.

A clock state is not an event. `09:00` does not itself imply nine bell strikes or any other fictional effect.

## Scene packet

V0 should aim to supply only:

1. exact USER ACTION
2. current time/location/immediate situation
3. PC identity and immediately relevant hard state
4. thin current academy cast index
5. detailed packets only for currently relevant Named Characters
6. immediately relevant geography/institution/knowledge/schedule facts
7. recent meaningful beats
8. a very short Writer contract

A character's portrayal core may help the model portray that person, but it is not automatically something the PC knows or something narration should disclose. Explicit PC-facing facts are separately identified by Knowledge retrieval.

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
- Canon layer contradictions / restricted-fact leakage / factual retrieval flooding

Narrative taste is evaluated through human/reference QA, not deterministic prose scoring.
