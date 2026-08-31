# Next Action

## Current accepted baseline

Repository: `hoho074566-cpu/lumensia-ai-first`

Golden3 is now the human-accepted AI-First Writer regression floor.

- Promotion PR: #35 — MERGED
- Accepted source head: `29c9ab29d1e051bd468cd90cf163d79a3ac41343`
- Promotion merge commit: `05d4765a1f4e0eb1e8c956f5260606a51ee8ddc0`
- Production Writer mode: **COMPACT / RAW**
- Full structural CI after promotion: PASS
- Vercel after promotion: PASS

Read `docs/GOLDEN3_BASELINE.md` for the accepted behavior contract.

## Exact next action

**CONTINUITY-PERSIST-01 — restore durable runtime continuity without changing the accepted Golden3 Writer behavior.**

The current RAW Writer deliberately writes prose only. Its compatibility wrapper therefore freezes structured date/time/location/situation continuity. The next feature must solve that state-persistence gap while treating Golden3 prose behavior as fixed unless human testing shows a regression.

Requirements:

- keep COMPACT / RAW as the Writer-facing production baseline;
- preserve one narrative Writer call;
- do not return structured bookkeeping requirements to the Writer prompt merely to recover state;
- preserve PC authority;
- preserve world-driven progression, routine compression, important-scene depth, natural Named Cast use, Canon-compatible minor inference and natural handoff;
- Canon/runtime truth must remain durable and auditable;
- test long continuation, location/time progression, present cast, injury/equipment/consequence persistence and save/export/import;
- compare narrative output against Golden3 before accepting any continuity implementation.

## Do not do

Do not reintroduce:

- Event Director / Event Engine
- Schedule Engine controlling prose
- NPC selector scores / cast rotation
- hook / attention / event-density meters
- prose quotas
- Korean semantic-regex narrative control
- extra planning model calls merely to choose the next beat

Do not reopen old failed narrative PRs as implementation bases. They remain historical experiments only.

Keep the architecture goal:

`System = Facts -> User = New PC Intent -> One AI Writer = Scene Composition`

`GOLDEN3_BASELINE: ACCEPTED`

`HANDOFF_READY: PASS`

`NEXT_ACTION: preserve Golden3 -> solve RAW continuity persistence without re-tuning the Writer.`
