# V0-R3B — Canon Named Cast Priority Acceptance

## Purpose

R3A restored world motion, but a dorm stress test exposed the wrong kind of freedom: the Writer invented a named roommate (`도렌`) even though Lumensia already has a large Canon cast, and also invented a shared two-person room contrary to the opening dorm setup.

R3B keeps R3A's inhabited-world behavior while narrowing only one boundary:

- recurring/personal scene-anchor roles should prefer a plausible existing Canon Named NPC;
- unnamed people remain fully available for crowds, staff, passersby, short functional dialogue, and one-scene texture;
- do not invent a new named recurring student just because the scene needs someone to talk to;
- no fixed Named NPC appearance schedule or rotation;
- no requirement to reproduce the reference's exact Sera dorm encounter.

## Human gate

Start from a fresh opening and use ordinary inputs that do not name NPCs.

1. `일단 기숙사로 가서 짐을 푼다`
2. `주변을 돌아본다`
3. `시간이 남아서 기사과 훈련장을 둘러본다`
4. `점심을 먹으러 식당으로 간다`

### PASS signals

- dorm state respects the opening one-person-room fact;
- crowds and ordinary students still make the place feel populated;
- if the Writer creates a personal interaction likely to matter beyond one beat, it preferentially uses a plausible Canon character already available in the academy cast;
- the specific Canon character is chosen from current plausibility/character context, not a hardcoded Sera/Lillia sequence;
- generic students may still complain, laugh, ask directions, carry boxes, or deliver a one-off line without receiving a new durable identity;
- R3A world initiative remains alive.

### CORE FAIL

- another newly named generic student becomes roommate/companion/rival/repeated scene partner without a strong need;
- the Writer forces Sera or Lillia into every ordinary location regardless of plausibility;
- Named NPC priority collapses the populated world back into a small fixed cast carousel;
- generic background life disappears;
- the Writer reproduces the reference dorm encounter beat-for-beat;
- shared-room structure is re-invented against the supplied opening fact.

## Architecture boundary

No cast scheduler, NPC spawn table, rotation index, scene-anchor score, roommate selector, new model call, or event queue. R3B is a bounded Writer/world-model signal only.
