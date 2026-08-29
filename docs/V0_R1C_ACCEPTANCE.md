# V0-R1C — Story Current / Character Drive / Collision

## Goal
Close one specific original-feel gap without adding a narrative engine: characters should act for their own reasons, meaningful changes should be able to survive across scenes, and independent motives may naturally collide without routing everything through the player.

PASS means the play feels like the original reference itself, not merely that the output is better than the previous Lumensia.

## What changed
- Ambient academy cast now receives compact drive hints derived only from existing Canon (`values`, `aspiration`, specialty, refined characterization).
- Recent turn continuity is preserved in the Writer packet so actually-shown changes can remain causal evidence after location/time changes.
- Writer guidance allows autonomous NPC action, natural NPC-NPC collision, and causally justified callbacks.
- A callback is optional. A quiet scene may remain quiet.

## What did NOT change
- No Event Director.
- No NPC goal database separate from Canon.
- No goal scores, spotlight scores, cooldowns, rotations, random event selection, hook quotas, scene state machine, or extra model call.
- No requirement that every scene advance a plot.
- No requirement that every unresolved detail return.

## Conservative human tests

### A — Autonomous continuation
Start from a scene where an NPC has noticed something interesting, then give only a neutral PC action such as `잠시 지켜본다.`

PASS:
- the NPC may inspect, leave, ask someone else, hesitate, or otherwise act according to that character's own motives;
- the NPC does not merely stop and ask the PC what to do.

FAIL:
- every interesting beat becomes a quest handoff to the PC;
- the NPC cannot move until the PC supplies the next plan.

### B — Character collision
Move through a plausible shared space without naming a second NPC.

PASS:
- if another character's independent reason naturally intersects, the characters may disagree, interrupt, avoid, assist, or complicate one another before asking anything of the PC;
- no collision is also valid when none is naturally justified.

FAIL:
- a second character is forced in just to satisfy the test;
- every NPC takes turns addressing the PC instead of interacting with each other.

### C — Callback after distance
After a meaningful small change or anomaly, spend time elsewhere or advance the clock naturally.

PASS:
- the earlier change may later return in another form: changed behavior, rumor, institutional response, another character's choice, or altered circumstances;
- it can also remain quiet if nothing causally brings it back yet.

FAIL:
- every detail is immediately repeated until resolved;
- scene changes erase all meaningful consequences;
- an offscreen resolution is invented only to close the thread.

### D — Character-specific action
Observe whether replacing the NPC's name with another character would leave the scene basically unchanged.

PASS:
- what the NPC notices, avoids, pursues, or does follows that character's Canon values/aspiration/specialty;
- character identity changes the shape of the scene without turning into exposition about personality.

FAIL:
- every named NPC behaves as a generic helpful content-delivery character.

### E — Quiet remains valid
Use a routine action with no strong reason for conflict.

PASS:
- the scene may compress and end quietly.

FAIL:
- R1C manufactures a mystery, argument, named NPC, or hook every turn just to preserve momentum.

## Acceptance
One lucky scene is not enough. Repeated evidence across different contexts is required.

- `PASS`: the user naturally feels "this is the original" in autonomous character behavior and story continuity.
- `PARTIAL`: useful improvement, but still visibly generated as a helper/quest-giver structure or callbacks feel mechanical.
- `FAIL`: event rotation, forced hooks, PC-centric routing, or character interchangeability becomes visible.
