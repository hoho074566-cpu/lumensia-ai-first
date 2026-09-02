# Lumensia Authoring Runtime Specification — HISTORICAL

> **SUPERSEDED**
>
> This document describes the older CRACK-RUNTIME-01 experiment and is retained only as historical design evidence.
>
> Do **not** implement current work from its Add-on / Keyword Book / relevance-routing descriptions.
>
> Current sources of truth:
>
> - `docs/GOLDEN3_BASELINE.md` — human-accepted Writer behavior floor
> - `docs/ARCHITECTURE.md` — current Writer + State Keeper architecture
> - `docs/CONTINUITY_PERSIST_01.md` — active PR #42 persistence/context work
> - `docs/HEALTH_AUDIT.md` — periodic whole-game audit checklist
> - `docs/LUMENSIA_HANDOVER_CURRENT.md` — current-session handover
> - `docs/NEXT_ACTION.md` — exact next action

## Historical prime directive that still applies

AI의 서사 판단을 코드로 대신하지 않는다.

The system supplies facts and durable state. The user supplies new PC intent. The Writer composes the scene.

## Historical value of CRACK-RUNTIME-01

This experiment helped establish several constraints that remain useful:

- one narrative Writer call
- no Event Director / Event Engine
- no prose-controlling Schedule Engine
- no NPC selector score or cast rotation
- no hook/attention/prose quota machinery
- no extra planning call just to choose the next beat
- Canon/runtime facts are not automatically character knowledge
- schedule facts are not event triggers
- Writer examples are behavioral demonstrations, not mandatory choreography

## What is no longer current

The following sections of the old specification are obsolete as production descriptions:

- Add-on activation as the main Writer material model
- Keyword Books as a production Writer layer
- literal turn-level character/world activation rules
- the old three Development Examples
- the old assembly order containing `ADD-ONS` and `KEYWORD BOOKS`

Golden3 production instead uses a fixed COMPACT/RAW sourcebook profile plus current runtime state, semantic continuity, a short recent-chat window and exact user input. See `docs/ARCHITECTURE.md`.

## Historical acceptance lessons

The experiments leading from CRACK-RUNTIME-01 to Golden3 showed that more routing and more Writer-side bookkeeping can reduce narrative quality even when the code is technically correct.

The accepted direction is therefore:

`Less Engine -> Better Signals -> One Writer`

Do not revive an older architecture merely because it appears in this historical document.