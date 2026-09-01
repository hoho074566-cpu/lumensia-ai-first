# GROWTH-01A — AI-First Growth State Keeper

Status: DRAFT / human gameplay gate required.

## Fixed boundary

Golden3 Writer is frozen. GROWTH-01A does not change `data/authoring/lumensia-academy.json`, the Writer prompt, the RAW prose contract, or narrative scene composition.

A normal gameplay turn is:

1. existing Golden3 Writer receives the current durable PC state;
2. Writer produces the scene;
3. the scene is saved and rendered unchanged;
4. a separate non-narrative State Keeper reads the starting PC state, exact user declaration, Writer-confirmed result, and unconsumed growth evidence;
5. validated growth bookkeeping updates only the durable PC stats/graded skills and growth ledger;
6. the next Writer turn reads the resulting current state through the existing RUNTIME STATE feed.

Admin Scene Preview never mutates growth.

## Scope

GROWTH-01A may record evidence and promote only:

- existing graded skills;
- body;
- mana;
- intelligence;
- holy.

It may NOT automatically change:

- martial realm;
- magic circle;
- innate talents;
- Trait;
- Authority;
- equipment/inventory;
- gold;
- injury/condition;
- NPC relationships;
- unknown/new skills.

Those domains require later, separately reviewed work.

## Grade order

`F → F+ → E- → E → E+ → D- → D → D+ → C- → C → C+ → B- → B → B+ → A- → A → A+ → A++ → S- → S → S+ → S++ → SS- → SS → SS+ → SSS- → SSS → SSS+`

The ladder is validation/notation only. There is no numeric XP or hidden progress counter.

## Evidence semantics

Useful evidence can include actual training, correction, successful real application, meaningful failure with demonstrated learning, or an explicit qualitative breakthrough.

A single ordinary meaningful turn without prior unconsumed evidence cannot promote a rank. A Writer-confirmed `breakthrough` may permit one immediate step. Otherwise a promotion requires both prior unconsumed evidence and a meaningful/breakthrough current observation.

Evidence consumed by a rank promotion is marked consumed and cannot justify the immediately following rank.

No promotion may jump more than one grade.

## Authority rule

User declarations are attempts, not facts. The State Keeper grounds growth in the Writer-confirmed result. A user statement such as `나는 소드 마스터가 된다` cannot change state unless the relevant result is actually established by the scene—and realm changes are outside GROWTH-01A regardless.

## Failure behavior

If State Keeper bookkeeping fails, the already-written Writer scene remains saved and visible. State Keeper failure must never erase or rewrite narrative output.

## Acceptance focus

Human gameplay should confirm:

- ordinary unrelated/social turns do not produce spammy growth;
- one routine training action does not rank up;
- repeated meaningful practice produces evidence without arbitrary XP behavior;
- demonstrated improvement after prior evidence can produce exactly one grade step;
- obvious breakthrough can produce one immediate step;
- the next Writer scene respects the newly promoted current grade;
- narrative quality remains Golden3-like.
