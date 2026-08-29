# V0 Observed Original Behavior Core — Human Acceptance

This experiment starts from exact Pure V0 `876e235918c99f4588c9ef4eb874ecee4541be97`.

## Acceptance bar

PASS is not “better”, “more alive”, or “similar to the reference”. PASS requires sustained play to feel naturally like the reference experience: **`이거 원작인데?`**

A single good scene is not enough.

## What this experiment is testing

The Writer is deliberately small. It is built from behavior observed in the reference logs and the reference AI's own output analysis where that analysis agreed with the logs:

- resolve the player's actual action first
- compress low-agency movement/routine/procedure
- expand when player judgment, danger, conflict, discovery, or relationship can change the result
- stop at a real meaningful branch, not a fake menu return
- place description only when it affects what can happen next
- all Canon characters are visible through a thin index; detailed dossiers are limited to current/mentioned/established contacts
- plausible presence and concrete reason-to-act are separate judgments
- world activity stays inside what the PC can perceive; no substantial NPC-only cutaways during early play
- progression normally grows through player choice → world consequence → player choice
- no unrelated accident chains used as fake story density
- character is shown through action/timing/dialogue/silence rather than explanatory personality prose
- relationship affects how an NPC responds; NPC knowledge limits what they can respond to
- combat behavior depends on the opponent's actual intelligence/experience/perception/repertoire/power
- failure residue persists through a minimal condition/equipment/world fact ledger

## Deliberately absent

Do not add an Event Director, event queue, scheduler, spawn table, NPC selector score, event-density score, attention meter, PC hook score, scene state machine, story current, time engine, relationship threshold engine, knowledge engine, or second model call.

Open-situation plot seeds are also withheld from ordinary Writer packets during this base-feel experiment.

## Unsteered opening run

Use an ordinary PC and do **not** type Canon NPC names to summon them.

Suggested human test path:

1. `입학식에 들어간다`
2. use `이어 진행` only when the current live scene genuinely has more that needs no PC decision
3. `생활동으로 가서 짐을 푼다`
4. `학교를 둘러본다`
5. `기사과 훈련장으로 간다`
6. `점심을 먹는다`
7. `기사과 오리엔테이션에 간다`

Then continue naturally for at least 10–15 normal player turns.

## Immediate FAIL signals

- generic staff/tutorial NPCs dominate personal scenes
- Canon NPCs vanish unless the player names them
- every plausible Canon NPC immediately targets the PC
- multiple Canon NPCs appear like attendance checking
- NPCs talk/play among themselves for long stretches while PC watches
- location/facility descriptions dominate ordinary movement
- output ends with `기다리거나 / 둘러보거나 / ...할 수 있다` style pseudo-options instead of a real branch
- unrelated accidents are chained to make the world look active
- Emily/Lena/Artemis become generic motivational/philosophical speakers
- prose remains uniformly dense and polished regardless of pressure
- scene repeats already established appearance/geography/status
- distinct Canon phases are fused merely to keep a response moving
- bare timestamps appear as prose
- PC speech/thoughts/emotions/meaningful choices are invented
- NPCs know PC facts with no information path
- affection/relationship acts like telepathic knowledge
- injury/equipment failure disappears on the next scene
- every opponent adapts like a tactical genius regardless of intelligence

## Positive signals

- the right Canon character can appear without being summoned by name
- presence does not automatically mean interaction
- an NPC acts when staying passive would be less natural for that specific person in that visible situation
- ordinary movement reaches the first meaningful human/world contact quickly
- safe routine is concise; meaningful interaction can breathe
- the PC experiences signs of a world that already has its own logic without losing the camera to NPC-only scenes
- dialogue arrives close to the action that causes it
- character differences are readable from verbs, timing, tone, refusal, objects, and choices
- consequences accumulate instead of resetting

Do not merge on structural/CI green alone. Human qualitative acceptance controls this PR.
