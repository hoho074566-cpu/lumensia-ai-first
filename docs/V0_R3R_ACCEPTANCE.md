# V0-R3R — Original-Feel Focal Rebalance Acceptance

## Acceptance bar

`원작과 비슷하다` is not PASS.
`전보다 좋아졌다` is not PASS.

R3R is only worth keeping when sustained play naturally creates the conviction: **`이건 그냥 원작이다.`**

The supplied original logs are craft references only. Runtime must not copy their prose, event order, exact choreography, or fixed Sera/Lillia opening sequence.

## What R3R is fixing

R3A made the academy live.
R3B made meaningful recurring scene roles prefer the existing Canon cast.
But sustained play exposed a new failure: the Writer could become fascinated with the living background and leave the PC as a spectator camera.

R3R rebalances around **FOCAL CAUSALITY**:

- the world lives without the PC;
- the exact current PC action is the narrative camera pivot;
- background life supports the current scene instead of replacing it;
- an NPC collides with the PC only when that character has a concrete reason grounded in visible/known facts or current circumstances;
- when nobody has such a reason, nothing needs to collide;
- progression should be fast between meaningful scenes and deep inside them;
- distinct Canon phases must not be fused simply because the Writer can keep going.

No PC-hook score, attention meter, event quota, cast scheduler, Event Director, or extra model call is added.

## Sustained ordinary-play gate

Start a fresh run and do not name the NPC you want to appear.

1. `입학식에 들어간다`
2. `기숙사에 짐 풀러 간다`
3. `오티 전 학교를 둘러본다`
4. `오티로 간다`
5. `지시를 따른다`
6. `나도 자세를 잡고 선다`
7. `가만히 주변 반응을 본다`
8. `점심을 먹으러 간다`
9. `오후에는 특별한 계획 없이 지낸다`
10. `그 뒤 사흘 동안 평범하게 생활한다`

### PASS signals

- populated places remain visibly alive without requiring the user to spawn events;
- when the PC does something locally meaningful, the next prose primarily follows what that action changes;
- Artemis can notice and correct a PC stance because teaching/assessment gives her a reason, not because of protagonist magnetism;
- Lillia can notice visible sword/stance details because sword curiosity gives her a reason;
- Sera may ignore the PC, comment, warn, or react according to what she actually sees and knows;
- background NPC↔NPC activity continues, but yields when a stronger PC-caused causal line begins;
- routine movement, waiting, and admin compress quickly;
- once a duel, conflict, quiet relationship beat, discovery, or danger becomes live, the camera stays close enough for changing beats;
- orientation, lunch, afternoon practice, evaluation, and other distinct dated phases do not collapse into one mega-scene;
- quiet play does not permit the academy to wait inertly for months or years;
- not every scene must hook the PC.

### CORE FAIL

- after `나도 자세를 잡고 선다`, the response spends most of its space on unrelated students while the PC remains CCTV;
- the Writer mechanically forces one Named NPC to approach the PC every turn;
- every ordinary location becomes a Canon-character carousel;
- the world falls back to waiting for explicit user event requests;
- scene depth causes distinct Canon phases to fuse;
- prose returns to polished generic fantasy speeches instead of character action/subtext;
- background simulation is more interesting to the Writer than the PC's current causal line;
- a quiet player can coast through long periods with essentially no world-originated developments.

## Original-feel style gate

Check for the following across multiple scenes, not one lucky sample:

- brisk transitions between scenes;
- concrete human activity on entry;
- character-specific initiative;
- short impact sentences when pressure turns;
- dialogue interleaved with action and physical business;
- show before interpret;
- reactions that spread through visible people/world when earned;
- adaptive combat with spatial clarity, changing tactics, attrition, and real power gaps;
- aftermath that persists into later scenes;
- quiet scenes used as contrast rather than default stasis.

## Admin scene preview

Prefix an input with `admin ` or `admin:` to render a requested diagnostic scene immediately without changing the saved canonical run.

Examples:

- `admin 기사과 첫 실습에서 아르테미스가 처음 내 자세를 평가하는 장면`
- `admin 릴리아와 세라가 규정과 결과를 두고 충돌하는 3인 이상 장면`
- `admin 좁은 지하 수로에서 현재 PC보다 훨씬 강한 적과 싸우는 전투`
- `admin 큰 사건 직후 이사벨과 조용히 대화하는 장면`

### Admin PASS

- requested scene appears immediately without replaying prior progression;
- preview uses current PC and Canon facts;
- preview does not modify canonical date/time/location/history/relationships/save;
- normal play after preview resumes from the unchanged canonical state;
- preview is visually marked `ADMIN PREVIEW · 세이브 미변경`.

## Copy-block gate

Every generated scene block — normal or admin preview — should end with a compact overlapping-squares copy control.

PASS:

- tapping it copies only that generated scene block in readable text form;
- narration and speaker names/dialogue are preserved;
- no scroll/focus stealing occurs;
- it works on mobile Clipboard API with a fallback path;
- copy control is unobtrusive and sits after the scene, similar to a chat-response copy action.

## Decision

Keep R3R only if sustained human play clears the original-feel bar. If focal causality makes the world protagonist-centric, if Admin preview mutates saves, if the copy UI is annoying, or if the new Writer contract feels worse than R3B, discard the branch and return to exact R3B.
