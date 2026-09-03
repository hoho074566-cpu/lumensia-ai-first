# LIVING-CONSEQUENCE-01 — Semantic Social / World Aftermath

## Goal

Make prior play matter later without turning Lumensia into a quest scheduler or deterministic event engine.

The target feel is:

- a promise can still matter several scenes later;
- a favor or debt can change how a later interaction feels;
- a rumor that actually started spreading can exist outside the original scene;
- a public act can create a group-specific reputation when the story actually establishes that reaction;
- an accident, duel, failure, discovery, or success can leave realistic aftermath;
- an NPC's own research/training/conflict can remain an active fact when the Writer actually establishes it;
- none of these facts force the next scene to become their callback.

Core idea:

`세계가 움직인다 -> 세계가 기억한다 -> 관련될 때 자연스럽게 되받아친다`

## Minimal architecture

LIVING-CONSEQUENCE-01 deliberately does **not** add a new consequence engine or a new model call.

It reuses the existing durable `continuityMemory.openThreads` semantic snapshot produced by the unified State Keeper.

Why:

- Writer already receives this memory as current factual context;
- Writer already receives the boundary that continuity memory is past/current fact, not future planning;
- State Keeper already rewrites the compact snapshot each turn and can remove resolved items;
- no timer, callback queue, quest stage, trigger table, or scheduler is necessary;
- no additional Writer context section or new persistent state family is required.

## Semantic consequence tags

When a Writer-confirmed scene leaves a meaningful active consequence, State Keeper may keep a short tagged entry in `openThreads`:

- `[약속]` — an actual mutual promise or agreement that still matters.
- `[빚·호의]` — a favor, debt, request, or obligation that was explicitly created and can still matter.
- `[소문]` — a rumor that the Writer actually showed beginning to spread or being passed to others.
- `[평판]` — a meaningful way a specific person/group now sees the PC because the story actually established it.
- `[의무]` — a responsibility or role the PC/NPC actually accepted.
- `[후속]` — unresolved practical aftermath of an event.
- `[NPC 진행]` — an NPC's own ongoing research, training, conflict, or personal development actually established in scene.

Examples:

```text
[약속] 릴리아와 다음 자유훈련 때 다시 대련하기로 서로 합의했다.
[빚·호의] 클로에는 PC에게 받은 도움을 나중에 갚겠다고 명확히 말했다.
[소문] 기사과 학생들 사이에 PC의 공개 대련 이야기가 실제로 퍼지기 시작했다.
[NPC 진행] 세레나는 개인적으로 방어술식을 개량하는 연구를 계속하고 있다고 말했다.
```

## Evidence boundary

A consequence must come from **Writer-confirmed actual play**.

Do not infer:

- rumor merely because something impressive happened;
- reputation merely because someone could have seen the event;
- debt merely because one person helped another once;
- future NPC progress because it would be plausible;
- future conflict because two characters dislike each other;
- callback because a promise exists.

If the Writer only shows the event itself, keep the event fact if important. Do not manufacture its social spread.

## Snapshot, not ledger

`openThreads` remains a compact **current snapshot**, not an append-only history.

When:

- a promise is fulfilled;
- a favor is repaid;
- a rumor dies or is replaced;
- an obligation ends;
- an aftermath is resolved;
- an NPC's ongoing development reaches a new state;

State Keeper removes or rewrites the corresponding active consequence.

If a completed result is historically important, a short completed fact can move to ordinary `facts` instead.

## No forced callback

A living consequence is not a command to use it immediately.

Writer may reflect it when current:

- place,
- time,
- people,
- relationship,
- conversation,
- activity

make it naturally relevant.

A promise with Lillia does not force Lillia into the next library scene. A rumor in the knight department does not mean every student knows it. A debt to Chloe does not make Chloe appear until there is a plausible reason for her to be involved.

## NPC progress boundary

`[NPC 진행]` is especially strict.

It records only progression the Writer has actually established. State Keeper does not simulate an NPC's offscreen week, roll random progress, advance a training percentage, or invent a new plan.

This keeps the architecture AI-first:

- Canon gives the NPC motives and life;
- Writer decides what actually happens in fiction;
- State Keeper remembers what became true.

## Protected architecture

LIVING-CONSEQUENCE-01 adds no:

- Event Engine / Director
- schedule engine
- callback queue
- quest state machine
- due-date processor
- countdown
- event stage
- deterministic rumor propagation
- deterministic reputation score
- NPC simulation tick
- extra Writer call
- extra State Keeper call

Normal turn remains:

1. one Golden3 Writer narrative call;
2. scene saved/rendered;
3. one unified State Keeper bookkeeping call;
4. current semantic facts persist;
5. next Writer receives those facts.

Golden3 `prompt_template` remains unchanged.

## Human qualitative gate

Test through ordinary play rather than a forced test script.

Look for:

1. a real promise being remembered after unrelated scenes;
2. the promise not forcing an immediate callback;
3. an explicitly established favor/debt being remembered later;
4. rumors only appearing when the story actually established social spread;
5. different groups not automatically sharing the same reputation;
6. an event's practical aftermath remaining until actually resolved;
7. resolved consequences disappearing instead of accumulating forever;
8. NPC personal progression being remembered only after it actually appears in fiction;
9. no quest-log / scheduled-event feel;
10. no Writer prose-quality regression;
11. no loss of PC authority;
12. continuity, relationship, growth, PC hard-state, and Canon behavior remaining intact.

`STATUS: DRAFT / HUMAN QUALITATIVE GATE`
