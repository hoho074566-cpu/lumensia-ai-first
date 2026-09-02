# CONTINUITY-PERSIST-01

## Scope

Active branch: `codex/continuity-persist-01`
Active PR: #42
Status: Draft / human gameplay gate required before merge.

## Runtime continuity

The existing unified State Keeper now owns non-narrative persistence for:

- semantic continuity memory
- date / time / location / current situation
- present registered cast
- growth evidence / promotions
- PC-NPC semantic relationships
- factual PC equipment / condition / gold changes

Writer prose is saved and rendered **before** State Keeper bookkeeping. A bookkeeping failure never deletes or rewrites the Writer scene.

The latest failed bookkeeping turn may be retried without generating a new Writer scene.

## Semantic memory

State Keeper maintains a compact snapshot rather than an ever-growing transcript:

- important/completed facts
- already-shared key information / exchanges
- unresolved important threads

Completed events must not replay as new. Already-answered questions must not be asked as if unknown. Resolved procedure/evaluation/reporting must not remain an active thread merely through inertia.

## Scene state / cast release

`present_character_keys` means characters actually present at the end of the current scene.

It is not a casting recommendation.

Characters naturally leave when location/time/their own action changes. Previous presence alone is not a reason to keep them in the next scene.

## Writer context balance

- raw recent-chat context: latest **5 turns**
- older durable facts: semantic continuity memory
- PC realm/circle/talents/stats: high-salience core block before long profile prose
- accepted PC background/profile server lengths are preserved into Writer assembly
- present cast is explicitly framed as continuity, not fixed cast

The accepted Golden3 `prompt_template` remains unchanged.

## PC premise authority principle

PC settings, abilities, origin and demonstrated actions are world facts, not automatic plot commands.

NPC/world reactions depend on observable facts plus their own knowledge, experience and personality. New evidence can update judgment, distance and role assumptions.

Strong or unusual PCs do not automatically escalate danger, investigation, isolation, interrogation or research. This restriction does not flatten character-specific emotional reactions.

Routine procedure should compress/end when its purpose is satisfied.

No threat score, question counter, master-vs-master hardcode, cast rotation or emotion score is used.

## Factual PC-state persistence

State Keeper may persist **Writer-confirmed** actual changes to:

- equipment / inventory gained, lost, transferred, consumed or broken
- injuries / conditions added or removed
- gold actually gained, spent or lost

The user's attempted action alone is not enough. Routine costs are not estimated merely because eating, sleeping or travel happened.

This factual channel cannot alter:

- martial realm
- magic circle
- innate talents
- Trait
- Authority

Growth remains a separate semantic evidence system for existing graded skills and the four core stats.

## Long Writer scene protection

State Keeper input remains bounded, but when a Writer scene exceeds the State Keeper scene budget it retains:

- the beginning
- the ending
- an explicit middle-omission marker

This protects final outcomes such as victory, injury, location change, departed cast or other end-of-scene consequences from simple first-N-character truncation.

## Dated-scenario freshness

The academy scenario is a start snapshot, not permanent present tense.

- exact untouched opening can receive full start facts
- later turns do not receive the old `08:40 / bell not rung` opening situation
- already-past same-day dated facts are omitted
- start-day dated facts are omitted on later dates
- remaining scheduled facts are facts, not triggers or scene commands

## Full play-history durability

The save/export no longer deletes old prose at turn 40.

Full `history` remains durable. For mobile performance the UI initially renders a recent 40-turn chunk and allows earlier turns to be expanded on demand.

Rendering optimization must not mutate/delete the durable history.

## PC creator fidelity

- `현재 상태` reaches durable PC state
- human-readable paste or JSON/exported `pc` data can populate creator fields
- only recognized provided fields overwrite the form
- list fields use **one line per item**
- commas inside a Trait/Authority/skill/equipment/condition description are preserved

Example:

```text
이름: 아사
나이: 24
학과: 기사과
무의 경지: 익스퍼트 상급
재능: 마법 2 / 무 10 / 영혼 8 / 지식 6
스탯: 신체 A+ / 마나 B / 지능 C+ / 신성 F
배경: 다른 세계의 전장에서 싸웠다.
스킬:
사복검술:A
전장 감각:A+
장비:
탄약 추진식 사복검
현재 상태:
오른쪽 눈 손상, 과부하 시 통증과 출혈
```

## Presentation resilience

- image visibility does not depend on a possibly missed load-event opacity toggle
- RAW registered speaker labels can map to character art
- canonical full speaker labels beginning with the registered short name can map to the same asset
- expression inference remains presentation-only and never feeds Writer/state/relationship logic

## Development-example balance

The old novice Artemis drill example was replaced with an Emily scene that demonstrates visible emotional-mode change.

Purpose: avoid teaching the Writer that every Artemis/training scene is a novice tutorial and avoid having both development examples sit at the same low emotional temperature.

This changes the examples, not the accepted Golden3 `prompt_template`.

## Architecture boundaries

- Golden3 Writer prompt template unchanged
- one Writer narrative call
- one unified State Keeper bookkeeping call
- no Director
- no event stage
- no prose-controlling scheduler
- no threat scaler
- no NPC selector / cast rotation / cooldown
- no emotion score
- no intake/admission state machine
- no numeric XP/affection engine
- no extra planner/model call

## Deferred

Long-term mutable NPC state for year/office/realm/presence is not yet a complete run-state overlay. The dated character-state file is explicitly a start snapshot. Revisit this only when actual long-run play requires it.

## Verification

Automated structural checks live in the existing regression suite plus `scripts/runtime-health-audit.test.mjs`.

Human narrative acceptance remains mandatory. Use `docs/HEALTH_AUDIT.md`.

`CI GREEN != NARRATIVE QUALITY PASS`.