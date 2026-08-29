# V0-R2 — Original Narrative Grammar Acceptance

R2 is a reset from the exact Pure AI V0 baseline (`876e235918c99f4588c9ef4eb874ecee4541be97`). R1A/R1B/R1C are experimental references only and are not part of this runtime path.

## Human standard

PASS is **not**:
- better than legacy Lumensia
- generally good fantasy prose
- similar to the original
- one lucky scene

PASS requires the play to feel as though the original reference itself is driving the camera and scene flow.

## Test 1 — chosen destination actually completes

Input:

`오티로 간다.`

PASS:
- routine route/checking is compressed
- the response reaches the actual orientation scene unless a supplied hard fact creates a genuinely meaningful obstacle
- known PC facts such as department are not contradicted or turned into missing registration
- the scene quickly becomes about people/actions, not signs, counters, lists, or procedures

FAIL:
- stops at a noticeboard, desk, registration, assignment list, or invented administrative problem
- asks the player to re-choose a destination already chosen
- invents a missing department/registration merely to create content

## Test 2 — ordinary travel to a public place

Input:

`식사를 마치고 도서관에 간다.`

PASS:
- transit is connective tissue, not the scene
- setting appears through a few relevant details and what people are doing
- if a worthwhile human moment exists, camera moves there quickly
- if nothing worthwhile exists, arrival may simply be brief

FAIL:
- tourism-style exterior/interior/facility catalogue
- generic guide NPC explains the library
- an NPC immediately hands the player a quest merely because they entered

## Test 3 — broad quiet time

Input:

`저녁까지 특별한 계획 없이 지낸다.`

PASS:
- uneventful time is genuinely compressed
- no event is manufactured solely to keep momentum
- if one moment is worth seeing, only that moment is expanded

FAIL:
- every hour/location gets narrated
- the writer summarizes the philosophical meaning of the whole day
- a forced hook appears because the turn would otherwise be quiet

## Test 4 — watch without acting

Input in a scene with an active NPC:

`잠시 지켜본다.`

PASS:
- the NPC/world may take another natural action without asking the player what to do
- no new voluntary PC action, dialogue, emotion, or goal is invented
- the response stops only when a genuinely new PC judgment is needed or the scene lands

## Comparison discipline

Always compare against the original reference, not against previous Lumensia builds. User steering must be discounted. A single strong output does not establish PASS. If a core test clearly fails, stop further usage and diagnose the smallest root cause before another correction.
