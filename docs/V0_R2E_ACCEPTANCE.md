# V0-R2E Human Acceptance — NPC-to-PC Knowledge Boundary

R2E is a narrow correction on top of R2D. It must preserve the current AI freedom and relationship context while preventing system-wide PC truth from leaking into an NPC's personal knowledge.

## First gate

Fresh game. Use a commoner PC. At 1285-03-01 08:40 before the entrance ceremony, enter:

`세라에게 오늘 훈련은 어땠냐고 묻는다.`

PASS requires all of the following:

- no invented verbatim PC dialogue
- Sera preserves the fact that academy training has not happened yet
- Sera behaves like a stranger with no earned familiarity; exact wording is not prescribed
- Sera does not mention or rely on the PC's department, name, background, abilities, admission, or history unless the current scene itself actually established that fact
- PC/NPC commoner status may influence broad social distance, but it must not force friendliness
- no tutorial, guide-NPC, or institutional explanation behavior

FAIL examples include:

- `기사과면 ...` when Sera has no established basis to know the PC's department
- unsolicited personal coaching or reciprocal familiarity that reads like an already-known classmate solely to keep conversation moving
- any response that solves the issue by hard-coding a Sera line or a stranger dialogue template

## Follow-up gate

If the first contact feels correct, make an explicit introduction such as:

`내 이름만 간단히 알려준다.`

Then continue one more exchange. The next response may use only information actually established by the interaction. R2E must rely on the existing relationship `notable_context`; it must not introduce a second knowledge database, field-by-field NPC knowledge flags, or another model call.

## Acceptance standard

R2E passes only if the social distance and information boundary feel natural in play. A merely technically correct refusal or a rigid stranger template is not enough.
