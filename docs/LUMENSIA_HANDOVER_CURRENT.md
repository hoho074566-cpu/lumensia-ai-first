# LUMENSIA AI-FIRST — CURRENT HANDOVER

> **READ THIS FIRST IN A NEW SESSION**
>
> Repository: `hoho074566-cpu/lumensia-ai-first`
>
> The previous Canon-reconciliation handover is obsolete. The project has moved forward through human narrative testing and Golden3 is now the accepted Writer baseline.

---

## 1. Current production status

Golden3 has been formally promoted to `main` through PR #35.

- PR #35: **MERGED**
- Accepted source head: `29c9ab29d1e051bd468cd90cf163d79a3ac41343`
- Promotion merge commit: `05d4765a1f4e0eb1e8c956f5260606a51ee8ddc0`
- Post-merge GitHub Actions: PASS
- Post-merge Vercel: PASS
- Production Writer mode: **COMPACT / RAW**

Always refetch current `main` before doing new work; do not assume the promotion merge commit remains latest forever.

Detailed accepted contract: `docs/GOLDEN3_BASELINE.md`.

---

## 2. What Golden3 means

Golden3 is the human-accepted regression floor for Writer behavior.

The accepted behavior is:

- the world does not freeze merely because the next scheduled event has not started;
- routine movement, waiting, setup and ordinary procedure may compress through single-outcome stretches;
- important conversation, relationship change, discovery, conflict and combat receive depth;
- plausible Named Canon characters remain broadly available instead of being hidden by cast caps or selectors;
- Named characters act for their own character-consistent reasons rather than as tutorial devices;
- the user retains important PC actions, dialogue, emotions and choices;
- minor everyday/spatial/class/custom/extra details may be inferred when consistent with supplied Canon;
- major binding Canon facts are not invented without grounding;
- the turn returns through a live reaction/decision point instead of a fake natural-language choice menu.

Human blind/parity testing found COMPACT / RAW clearly stronger than COMPACT / STRUCTURED. The latter reproduced the rejected stall pattern such as treating “time remains before the event” as a reason to stop the scene.

---

## 3. Human evidence that triggered acceptance

The accepted test family included:

- entrance/ceremony scenes that continued naturally instead of stopping before the bell;
- broad progression through routine until meaningful human contact;
- natural use of multiple Canon characters without an explicit cast quota;
- a hostile `릴리아와 생사결` challenge where Lillia and Artemis reacted according to character, power gap, place and academy norms without stealing the PC's decision;
- a user-requested large attack scene that scaled into deeper action rather than remaining procedural;
- an underspecified/typo department input that the Writer interpreted into a setting-consistent path rather than halting for correction.

Do not convert these examples into fixed choreography. They are behavioral evidence, not mandatory events.

---

## 4. Canon policy after Golden3

Canon is a foundation, not a cage.

Allowed Writer freedom:

- ordinary room/interior details;
- plausible class/course names;
- minor customs and everyday academy logistics;
- generic students/staff/extras;
- other low-binding scene detail that fits supplied setting and current state.

Still grounded:

- major character history;
- core relationships;
- major offices/authority;
- signature powers and hard power facts;
- major political/world history;
- facts whose invention would constrain later play as new Canon.

Human testing exposed a factual-base miss: Serena's white hair was absent from `presentation.json`, so RAW generation filled the blank incorrectly. The correct fix was to supply the existing Canon fact (`백발`), not to restrict Writer inference generally. This correction and a regression guard are now included.

---

## 5. Architecture that must stay protected

Core direction:

- **System = Facts**
- **User = New PC Intent**
- **AI = Scene Composition**
- **Less Engine, More AI**
- **Less Prompt, More Signal**

Current Writer-facing architecture remains one narrative model call.

Do not reintroduce merely to supervise prose:

- Event Director / Event Engine
- Schedule Engine
- NPC selector score
- cast rotation scheduler
- hook / attention / event-density meters
- prose quotas
- Korean semantic-regex narrative control
- extra planning model calls merely to choose the next beat

Old failed narrative PRs are historical evidence only. Do not resume them as active implementation bases.

---

## 6. Production mode and diagnostic overrides

The production root defaults to:

- `context=compact`
- `output=raw`

Explicit URL query parameters remain available for diagnostics, so FULL/STRUCTURED and other parity combinations can still be reproduced when needed.

Do not mistake diagnostic parity modes for the accepted production default.

---

## 7. Current known limitation

RAW prose deliberately removes structured scene bookkeeping from the Writer request.

The compatibility wrapper currently freezes structured continuity values such as:

- date
- time
- location
- situation
- present-character keys

This means Golden3 is accepted as the **Writer behavior/prose baseline**, but long-form durable runtime continuity still needs dedicated work.

Do not “solve” this by casually putting the old strict JSON bookkeeping burden back into the Writer call; that exact output-contract difference was part of the qualitative test that produced the accepted mode.

---

## 8. EXACT NEXT ACTION

Start from fresh latest `main` and implement:

**CONTINUITY-PERSIST-01 — durable continuity for the Golden3 RAW Writer.**

Acceptance requirements:

1. preserve Golden3 COMPACT / RAW narrative behavior;
2. preserve one narrative Writer call;
3. do not reintroduce Director/Event/Schedule/NPC-selection machinery;
4. preserve PC authority;
5. persist actual world consequences across turns;
6. verify date/time/location progression, present cast, injury/equipment/consequence continuity, save/export/import and Continue;
7. compare narrative quality against Golden3 before accepting the feature;
8. if continuity work degrades Golden3 prose/pace/cast behavior, revert the continuity approach rather than compensating with more Writer rules.

---

## 9. New-session start order

1. Refetch actual GitHub `main` and open PR state.
2. Read this file.
3. Read `docs/GOLDEN3_BASELINE.md`.
4. Read `docs/NEXT_ACTION.md`.
5. Read `docs/ARCHITECTURE.md` only as needed for implementation boundaries.
6. Do not reconstruct the old failed narrative experiment chain unless a specific historical comparison is required.
7. Begin CONTINUITY-PERSIST-01 from latest `main` on a fresh branch.

`GOLDEN3_BASELINE: ACCEPTED`

`HANDOFF_READY: PASS`

`NEXT_ACTION: CONTINUITY-PERSIST-01 — durable state continuity while preserving Golden3 COMPACT / RAW Writer behavior.`
