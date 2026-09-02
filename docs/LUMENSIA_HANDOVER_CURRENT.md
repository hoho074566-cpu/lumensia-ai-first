# LUMENSIA AI-FIRST — CURRENT HANDOVER

> **READ THIS FIRST IN A NEW SESSION**
>
> Repository: `hoho074566-cpu/lumensia-ai-first`
>
> Always refetch `main`, PR #42 and exact remote heads before acting. Do not assume a SHA written in an older conversation is still current.

---

## 1. Accepted production baseline

Golden3 is the human-accepted Writer regression floor and is already on `main`.

- Promotion PR #35: MERGED
- Production-default PR #36: MERGED
- Production Writer mode: **COMPACT / RAW**
- Accepted Writer principle: world-driven progression, routine compression, important-scene depth, natural Named Cast use, PC autonomy, Canon-compatible minor inference, natural handoff

Detailed accepted contract: `docs/GOLDEN3_BASELINE.md`.

---

## 2. Active stack

Active top PR:

**PR #42 — CONTINUITY-PERSIST-01**

- branch: `codex/continuity-persist-01`
- base: `codex/relationship-01`
- status: Draft / unmerged
- merge only after human gameplay acceptance

Stack underneath:

- PR #37 — original-style dialogue/character image UI
- PR #38 — PC status / INFO
- PR #39 — AI-first semantic growth evidence
- PR #40 — semantic relationships
- PR #42 — continuity + situation input + context/state stabilization

Do not separately re-implement these layers from `main`; PR #42 already contains the stacked work.

---

## 3. Current architecture

Normal gameplay turn:

1. fixed Canon/sourcebook material + current PC/scene/relationship facts + semantic continuity + latest 5 raw turns + exact user input
2. **one Golden3 Writer narrative call**
3. Writer prose is saved/rendered immediately
4. **one unified State Keeper bookkeeping call**
5. growth / relationships / factual PC state / scene state / semantic continuity are persisted
6. next Writer reads the latest durable facts

State Keeper does not rewrite narrative prose.

If bookkeeping fails, the Writer scene stays saved and the latest failed bookkeeping turn can be retried without another Writer call.

See `docs/ARCHITECTURE.md`.

---

## 4. CONTINUITY-PERSIST-01 current scope

Implemented on the active branch:

- durable semantic continuity memory
- date / time / location / situation / present-cast persistence
- Situation/Narration input distinct from PC intent
- visible growth traces + one-step semantic growth
- semantic PC-NPC relationships
- PC creator paste-settings
- character image visibility regression fix
- recent Writer raw context reduced from 8 to 5 turns
- high-salience PC core fact block for realm/circle/talents/stats
- present-cast release instead of repeated cast anchoring
- completed procedure/evaluation/reporting release
- consolidated exceptional-PC semantic boundary
- emotional-range few-shot balance without changing accepted Golden3 `prompt_template`
- creator `conditions` persistence fix
- factual equipment / condition / gold persistence from Writer-confirmed outcomes
- long State Keeper scene packets preserve both beginning and ending
- full play history is preserved; mobile UI pages older turns instead of deleting them at turn 40
- State Keeper failure retry control
- creator list fields use one line per item so commas inside descriptions survive
- canonical full-name dialogue labels may resolve to registered character art
- stale opening / already-past dated scenario facts are removed from later Writer context
- accepted background/profile lengths reach Writer runtime instead of being cut early

---

## 5. Protected Writer boundary

Do not reintroduce merely to supervise prose:

- Event Director / Event Engine
- prose-controlling Schedule Engine
- NPC selector score
- cast rotation/cooldown
- threat scaler
- emotion score
- hook / attention / event-density meters
- prose quotas
- Korean semantic-regex narrative control
- extra planning model calls merely to choose the next beat

The accepted Golden3 `prompt_template` is a protected regression floor.

Prefer fixing factual/context/persistence defects below the Writer over accumulating one-off prose rules.

---

## 6. PC premise / power semantics

Current consolidated boundary:

PC settings, abilities, origin and demonstrated actions are world facts, not plot commands. NPCs/world react according to observable facts and their own knowledge, experience and personality. New evidence can update judgment, distance and role assumptions.

Strong/unusual PC does not automatically mean stronger threats, investigation, quarantine, interrogation or research. This anti-escalation boundary does not suppress natural character-specific emotion.

Routine procedure should stop occupying the story after it has achieved its purpose.

Do not hard-code `master vs master`, numeric reaction rules, question counters or threat tiers.

---

## 7. Current human qualitative concerns / gate

Fresh-save gameplay must still verify that the newest context/state corrections improve behavior without degrading Golden3 prose.

Primary probes:

1. a long/strong PC such as Valencina — realm and demonstrated competence materially affect informed NPC judgment
2. quiet strong-PC daily life — no automatic threat/event escalation
3. otherworld/unregistered setup — plausible minimum handling then ordinary life, not endless authority handoff
4. Artemis interaction — no automatic novice tutorial loop after peer-level evidence
5. cast flow — Sera/Lillia/Artemis or another trio does not remain merely because it was recently saved
6. emotional range — Lillia/Emily/Elena/etc. show character-specific emotional movement rather than uniform calmness
7. procedure pacing — completed evaluation/report/intake does not become another nested evaluation
8. actual danger — still receives proportionate consequences
9. continuity after >5 turns — important completed facts/questions remain remembered through semantic memory
10. equipment / injuries / gold — Writer-confirmed changes appear in INFO and the next Writer context
11. long scene — final outcome/location/injury/cast is retained by State Keeper
12. long run — old story turns remain in save/export and can be opened in the UI
13. State Keeper failure — retry works without a second Writer generation

**DRAFT / DO NOT MERGE until this human gate passes.**

---

## 8. Known deferred item

A complete mutable NPC/world-state overlay for long-term changes such as:

- academic year
- office/role
- NPC realm/circle
- current long-term academy presence

is **not implemented yet**.

`character-state.json` is explicitly treated as the 1285-03-01 start snapshot, with later run truth intended to supersede it.

Do not build a scheduler or deterministic NPC simulation to solve this. Revisit when real gameplay spans enough time or an NPC state actually changes.

---

## 9. Periodic health audit

Read and use `docs/HEALTH_AUDIT.md` after major context/state changes and before large merges.

Remember:

`CI GREEN != NARRATIVE QUALITY PASS`

Automated tests catch hard regressions; human gameplay catches tone, pacing, cast inertia, emotional flattening and original-feel degradation.

---

## 10. New-session start order

1. Refetch actual `main` and PR #42.
2. Read this file.
3. Read `docs/GOLDEN3_BASELINE.md`.
4. Read `docs/NEXT_ACTION.md`.
5. Read `docs/ARCHITECTURE.md`.
6. Read `docs/HEALTH_AUDIT.md` if changing state/context/runtime behavior.
7. Do not reconstruct or resume old failed narrative experiments unless a specific comparison requires it.
8. Continue from the exact human gate / defect currently reported on PR #42.

`GOLDEN3_BASELINE: ACCEPTED`

`HANDOFF_READY: PASS`

`NEXT_ACTION: finish automated health-fix verification -> human fresh-save qualitative acceptance on PR #42 -> only then consider merge.`