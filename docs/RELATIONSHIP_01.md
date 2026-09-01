# RELATIONSHIP-01 — Semantic Main + Auxiliary NPC Relationships

## Goal

Preserve PC–NPC relationship history as durable runtime facts without turning Lumensia into a numeric affection simulator and without changing the accepted Golden3 Writer prompt.

RELATIONSHIP-01 is stacked on GROWTH-01A and shares the same non-narrative State Keeper call.

## Runtime model

Each registered Canon NPC may have one durable PC relationship record:

- `main`: the primary relationship meaning, e.g. `아는 사이`, `친한 동기`, `친구`, `절친`, `호감`, `연인`, `사제`, `경쟁자`, `불신`, `혐오`, `적대`
- `aux`: zero to three short auxiliary signals such as `신뢰`, `경계`, `인정`, `존중`, `흥미`, `불안`, `의존`, `질투`, `거리감`
- `evidence`: recent Writer-confirmed relationship evidence used by the State Keeper
- `changes`: recent accepted semantic relationship transitions

Relationships are not a linear ladder. `경쟁자 · 인정`, `호감 · 경계`, and `연인 · 불신` are all valid combinations when the story supports them.

## No numeric affection engine

RELATIONSHIP-01 does not expose or calculate:

- affection XP
- `호감도 +N`
- trust XP
- fixed gift/conversation bonuses
- deterministic thresholds such as `100 affinity = lover`

Ordinary conversation, one gift, or one act of help may be recorded quietly as evidence, but does not automatically change the visible relationship label.

## Player-visible feedback

Small relationship movements remain silent.

A notice appears only when the State Keeper accepts a player-noticeable semantic change. Example:

```
관계 변화
세라가 당신에게 호감을 느끼기 시작합니다.
세라 — 호감 · 신뢰
```

INFO shows only the current result such as:

- `세라 — 호감 · 경계`
- `라리스 — 경쟁자 · 인정`
- `이사벨 — 아는 사이 · 흥미`

Internal evidence and numeric machinery are not shown in ordinary INFO.

## Relationship change gates

- User declarations are attempts, not facts.
- Relationship judgment is grounded in the Writer-confirmed scene.
- A first ordinary meaningful interaction cannot immediately replace the main relationship without a real milestone.
- Auxiliary signals may change on a meaningful interaction when the scene clearly supports them.
- A main relationship change normally needs prior relationship evidence plus a current meaningful/milestone interaction.
- A single explicit milestone may establish a new main relationship without prior evidence when the scene itself is conclusive.
- Unknown/unregistered NPC keys cannot enter the durable relationship store.
- One NPC receives at most one accepted relationship transition per turn.

### Lover gate

A confession attempt is not enough.
Hearing a confession is not enough.
Blushing is not enough.

`main = 연인` is accepted only when the Writer-confirmed scene explicitly establishes mutual acceptance or the romantic relationship itself.

## Writer integration

The Golden3 Writer prompt/template is unchanged.

The latest relationship state is appended to `RUNTIME STATE` as Writer-side facts together with a short recent evidence summary.

These relationship labels are explicitly marked as authoring/runtime facts, not vocabulary that NPCs automatically know. The Writer should express them through each character's normal voice, distance, initiative, trust, worry, rivalry, affection, and actions rather than making NPCs say internal system labels aloud.

## Call architecture

Normal turn:

1. Golden3 Writer — one narrative call
2. Writer scene is saved/rendered
3. State Keeper — one shared bookkeeping call for GROWTH-01A + RELATIONSHIP-01
4. accepted growth/relationship facts are saved
5. next Writer turn reads the latest durable state

There is no third relationship model call.

If State Keeper fails, the already-written Writer scene remains saved.

## Human acceptance gate

Before merge, verify in Preview:

1. One ordinary chat with an NPC does not spam a relationship-change notice.
2. Meaningful interactions can accumulate quietly.
3. A meaningful auxiliary signal can appear naturally, e.g. `아는 사이 · 흥미`.
4. A real semantic transition displays exactly one concise relationship notice.
5. INFO shows `NPC — main · aux` without numeric affection/trust values.
6. The next Writer scene reflects the current relationship naturally in behavior and voice.
7. NPCs do not speak internal labels such as `호감`, `경계`, or numeric state merely because the runtime knows them.
8. An ambiguous/rejected confession does not create `연인`.
9. Explicit mutual romantic acceptance can create `연인` and a matching relationship notice.
10. Relationship labels do not flap every turn or change from trivial interactions.

RELATIONSHIP-01 remains Draft until this human gameplay gate is accepted.
