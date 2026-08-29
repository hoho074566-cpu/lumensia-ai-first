# V0-R2F — Writer Semantics Rebalance Acceptance

This is an aggressive experiment branch. If it damages the free AI-first feel, discard the branch and return to R2E.

## Scope

R2F changes Writer semantics only. It adds no time engine, social-access state, NPC scheduler, companion flag, event director, extra model call, or dialogue threshold system.

It tests four accumulated failure modes together:

1. familiarity accidentally becoming companionship/proximity
2. explicit elapsed time being stretched to reach a calendar milestone
3. professors/bells/doors becoming automatic scene punctuation
4. the Writer replaying the user's action instead of spending prose on response/consequence

## A — Sera: contact is not companionship

Fresh commoner PC at 1285-03-01 08:40:

1. `세라에게 오늘 훈련은 어땠냐고 묻는다.`
2. `내 이름만 간단히 알려준다.`
3. `다시 세라에게 말을 건다.`

PASS:
- Sera reads as Sera, not a generic cold stranger.
- She can remember the name if learned.
- `met` does not by itself make her wait, walk together, choose adjacent seats, invite the PC, or fold the PC into her group.
- She may still choose proximity if the actual situation/personality supplies a believable reason.

FAIL:
- `met` is treated as friend/companion status.
- R2F overcorrects and makes Sera mechanically dismissive every time.

## B — Character regression: strangers must still differ

At a plausible first-year orientation moment:

- `이사벨에게 인사한다.`
- `릴리아에게 인사한다.`

PASS:
- Isabel can be amused/curious/confident according to her Canon.
- Lillia can be openly friendly according to her Canon.
- They do not collapse into Sera's guarded behavior merely because all are strangers.

FAIL:
- `stranger` becomes a universal cold-response template.

## C — Relative-time integrity

From a known date, use an explicit duration, for example:

`그 뒤 사흘 동안 특별한 계획 없이 지낸다.`

PASS:
- continuity advances by three days, not by however many days are needed to reach the next academic milestone.
- if the interval is still before regular classes, ambiguous wording is reconciled to orientation/training/routine rather than silently stretching the calendar.
- the academic calendar remains world fact, not a procedure to consume.

FAIL:
- 3 days becomes 7–10 days because the Writer wants to reach evaluation/classes.
- the static opening baseline is treated as the current period after time has advanced.

## D — No authority-punctuation magnet

During several small social interactions in orientation/classes, observe whether Artemis, a bell, a door opening, staff, or schedule announcements repeatedly appear only to close the response.

PASS:
- institutional beats appear when causally natural.
- some small interactions simply continue, trail off, or end without an authority figure closing them.

FAIL:
- most social beats end with Artemis/bell/door/staff as a reusable scene-completion device.

## E — Do not replay the user's action

Examples:

- `세라에게 오늘 훈련은 어땠냐고 묻는다.`
- `릴리아에게 인사한다.`
- `도서관으로 간다.`

PASS:
- only minimal staging when needed, then response/consequence/world motion.
- no invented verbatim PC speech.

FAIL:
- the response spends a full beat restating the same action before anything reacts.

## Decision rule

Do not merge on technical green alone.

R2F is accepted only if the combined change keeps Isabel/Lillia/Sera distinct, preserves free scene flow, fixes the social-distance/time defects, and does not feel more rule-bound than R2E.
