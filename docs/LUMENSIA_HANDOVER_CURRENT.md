# LUMENSIA AI-FIRST — CURRENT HANDOVER

> **NEW CHAT ENTRYPOINT — READ THIS FIRST**
>
> This document is the handover for the long greenfield-rebuild conversation that became too large/slow to continue comfortably.
> The next ChatGPT/Work session must **not** reconstruct this history from old chat messages and must **not** resume Writer prompt tuning from memory.
> Start by reading this document, `docs/CANON_BASE_01_RECONCILIATION.md`, `docs/CANON_SOURCE_AUDIT.md`, and `docs/ARCHITECTURE.md`, then refetch the actual GitHub/PR state.
>
> **The most important current fact:** narrative experimentation was intentionally stopped because the Canon/base layer itself was found inconsistent and asymmetrically supplied to the Writer. The current work is **CANON-BASE-01**, not another Original-Feel prompt patch.

---

## 0. Repository / reset boundary

### New active repository

- Repository: `hoho074566-cpu/lumensia-ai-first`
- This is a **true greenfield AI-first restart**, not a subsystem replacement inside the legacy app.
- Core philosophy:
  - **System = Facts**
  - **User = New PC Intent**
  - **AI = Scene Composition**
  - **Less Engine, More AI**
  - **Less Prompt, More Signal**
  - `KNOW != MENTION`
  - `CONSTRAINT != CONTENT`
  - `STATE != STORY BEAT`
  - `PLAYER AUTONOMY != WORLD INACTIVITY`

### Legacy repository

- `hoho074566-cpu/lumencia-ac`
- Treat as **LEGACY / FROZEN / reference oracle**.
- It may be mined for authoritative world/character facts and hard-integrity lessons.
- Do **not** copy its narrative-control architecture, regex semantic engines, Director/event machinery, or old runtime choreography into AI-first.

### Pure rollback source of truth

- Exact Pure V0 baseline commit: `876e235918c99f4588c9ef4eb874ecee4541be97`
- Branch: `codex/v0-pure-ai-narrative`
- Pure V0 is the rollback ancestor used for isolated experiments.
- One Writer call, `store:false`, fixed high-quality model baseline, structured narration/dialogue stream, no Director/Event Engine/Suggested Actions.

---

## 1. Human acceptance standard

Do **not** call something PASS because it is cleaner, more coherent, more alive, or better than the previous Lumensia build.

The human bar is deliberately extreme:

> **PASS only when play naturally feels like “이거 원작인데?”**

The following are **not PASS**:

- “원작과 비슷하다”
- “좋아졌다”
- one good generated scene
- a scene produced after the user explicitly steered toward the desired Named NPC/event
- world activity without a strong PC-facing scene
- correct Canon with generic GPT prose

Always compare against the original reference experience, not against the previous Lumensia implementation.

---

## 2. Original reference findings that matter

Primary qualitative reference: `견본_260828_201340.txt`.
Secondary reference: `견본.txt`.
They are development-only reference material and must never be imported into production runtime or copied as prose/choreography.

### Reference scene grammar observed

#### Ceremony

- Emily opens warmly, then shifts tone by contrast rather than by becoming a generic motivational philosopher.
- Lena is not “a sleepy nice genius”; she actively undercuts the formal speech itself, pockets the script, says little, and leaves.
- Artemis is concise, military, procedural only when her role requires it; she is not a generic tutorial NPC.

#### Dorm

The reference does **not** spend the free morning as empty waiting time.

Pattern:

`arrival -> very short room/world grounding -> immediate local human contact -> PC-facing scene`

The famous sample used Sera next door and a broken trunk handle, but that exact choreography is **reference-specific and must not be hardcoded**.

#### Training ground

Pattern:

`place grounding -> sensory cue -> Lillia -> Lillia notices visible PC sword/stance -> asks -> curiosity deepens -> spar proposal`

The important thing is not “spawn Lillia in training ground”.
The important thing is that a character whose interests plausibly intersect the visible PC has a concrete reason to act.

#### Downtime / clubs / walking

- Conversation continues in motion.
- World activity becomes concrete scene bids toward the PC when causally appropriate.
- Routine roaming is compressed.
- Meaningful interaction gets depth.

#### Combat / failure

- Opponents do not all adapt identically.
- Adaptation depends on intelligence, experience, perception, available repertoire, condition, and power.
- Power gaps remain real.
- Injury/equipment damage/failure persist into later scenes.
- Rescue, if causally earned, changes the problem; it does not erase the failed state.

---

## 3. Original AI meta-analysis — useful behavioral evidence

The original game AI was asked to analyze its own prior outputs. Treat its answers as **behavioral self-analysis, not disclosure of hidden system prompts**.

Use only statements supported by actual output patterns. Do not turn its speculative “weights”, “multiplication”, or imagined internal formulas into engines.

### High-confidence behavioral principles

1. **Ordinary actions receive the natural response of the place.**
   - “길드에 간다” can produce staff/procedure/board because those belong there.
   - Quiet does not require a random incident.

2. **NPC presence first asks: is this person plausible here now?**
   - place
   - time
   - dated membership/role
   - routine/habit/personality
   - previous continuity

3. **NPC initiative asks a different question:**

   > **“이 NPC가 이 상황에서 가만히 있는 것이 오히려 부자연스러운가?”**

   - staff should respond when approached because of role
   - Lillia can initiate around swords/strength because of character interest
   - Sera may remain background when no reason exists

4. **Early-story “living world” is NOT NPC-only theater.**
   - The reference AI said D+0 contained almost no independent NPC-only conversation scenes.
   - Living-world information is shown through things the PC can see/hear/feel: background people, already-open doors, rumors, existing tasks, environmental changes.
   - Do not turn the PC into CCTV watching NPCs entertain each other.

5. **Event density is causal, not numerical.**

   Preferred chain:

   `player choice -> world consequence -> player choice -> world consequence`

   Rejected failure seen in our experiments:

   `writer-created accident -> NPC resolves -> second writer-created accident -> NPC resolves`

6. **Broad actions advance through single-outcome routine until the first meaningful branch.**
   - movement / luggage unpacking / registration may compress
   - stop when the PC’s response or decision can materially change the path
   - “arrived at location” is not automatically a meaningful branch

7. **Scene depth tracks player agency/tension, not elapsed clock time.**
   - low-agency routine -> compress
   - high-agency conversation/conflict/discovery/combat -> zoom in

8. **Turn ending:** stop at the first genuine decision or immediate reaction point.
   - Do not manufacture fake natural-language menus such as “기다리거나 둘러보거나 대련장으로 갈 수 있다.”

9. **Named vs Generic:**
   - Generic NPC: function of place (staff, clerk, guard, passerby, crowd)
   - Named NPC: recurring personal relationship/conflict/cooperation/emotion where a Canon person matters

10. **Relationship and knowledge are different layers.**
   - relationship influences **how** a character reacts
   - knowledge determines whether that reaction is **possible**
   - liking the PC does not grant telepathy about the PC’s location/actions

11. **Characterization:**

   > **Character is shown through verbs, not adjectives.**

   Use action, timing, speech, silence, objects, choices and physical behavior instead of explanatory personality labels.

12. **Readable prose editing:**
   - omit details that do not affect the current scene/next choice
   - avoid repeating already established facts
   - bring dialogue close to the triggering action/sensory cue
   - under pressure: shorter sentences, lower information per paragraph
   - environment is described more when its geometry will constrain/enable later choices

13. **Persistent consequences matter.**
   - injury remains injury
   - broken equipment remains broken
   - relationship changes affect later tone/behavior
   - the old “foot” UI effectively acted as a narrative fact ledger

14. **Rescue is not protagonist immunity.**
   - plausible rescue can be based on prior setup, environment, or the enemy’s actual objective
   - it must not erase injuries/equipment loss/failure

### Do NOT implement the original AI’s speculative formulations literally

The original AI sometimes described its inferred behavior using phrases such as:

- `성격 × 관심사 × 장소 주도권 × 시각적 단서`
- “성격 가중치 최대”
- binary/weighted filters

It explicitly classified these as inference / not confirmed internal implementation.

**Do not create an NPC score, selector engine, threshold engine, event-density controller, or deterministic personality formula from this.**

---

## 4. Greenfield experiment history since the full reset

The purpose of these failed experiments is to preserve the lesson, not the implementation.

### Early isolated chain — PR #2 through #14

- R1/R2/R3 series explored content-delivery separation, hard facts vs story material, scene depth, PC authority, minimal social/knowledge facts, world motion, Canon named-cast discovery, single-room correction, PC/world collision.
- Useful lessons were extracted, but none reached Original-Feel acceptance.
- Do not revive the accumulated prompt stack.

### PR #15 — V0-R3R Original-Feel Focal Rebalance

Status: narrative FAIL / frozen experiment.

What it improved:

- stronger world population
- Canon cast presence
- Admin Scene Preview
- per-block Copy
- focal/phase wording

Why it failed:

- world became lively while PC still felt like CCTV
- Named NPCs performed activity around the PC rather than owning PC-facing scenes
- schedule/procedure still dominated
- prose remained polished generic GPT fantasy
- `08:55`/time metadata leaked into prose
- dorm Canon overcorrection

Important UX lesson:

- Admin preview worked
- explicit local preview close/cancel was missing at the time
- Continue should be a dedicated mode, not literal fake PC action text

### PR #16 — Pure Original Feel Core

Status: FAIL.

Failure signature:

- overemphasis on “world lives without waiting for PC” and event rhythm
- generated NPC life simulation and repeated accidents
- example: cart accident -> Sera resolves -> nail-box accident -> NPCs resolve -> PC asked at the end

Lesson:

> `Event density != number of incidents.`

### PR #17 — Minimal Original Scene Core V2

Status: FAIL.

Failure signature:

- overcorrected NPC overpopulation by hiding/limiting Canon cast too aggressively
- Canon Named NPCs effectively disappeared
- output became facility tourism / generic staff simulation
- location arrival was treated as scene completion

Lesson:

> Hiding most Canon characters prevents the AI from ever choosing them naturally.

### PR #18 — Observed Original Behavior Core

Status: **CLOSED / CORE FAIL / CANON BLOCKED**.

Observed human failure:

- opening somewhat cleaner but still generic GPT speeches
- living Named NPC presence remained sparse
- broad actions still ended at “arrival + location description”
- noon orientation acted as a gravity well: “still time before orientation” repeated instead of filling the morning with lived scenes
- time state leaked into fiction (e.g. `09:00` becoming “nine bells”)

Root causes identified:

- cast-selection starvation
- schedule gravity
- premature yield (`user action completed -> yield` instead of continuing to first meaningful branch)
- procedural/place-first prose
- time-state leakage + time freeze
- character voice under-supply / flattened source traits

This failure triggered the Canon/base audit.

**Do not reopen or incrementally patch #18.**

---

## 5. Why the Canon/base audit became necessary

The audit showed that the Writer was being blamed for failures partially caused by the facts and retrieval layer.

Examples found before CANON-BASE-01:

- dorm facts contradicted across files
- restricted Etera 9-circle truth leaked through ordinary dated character state
- immutable Canon mixed with dated offices/years/current realms
- `open-situations` contained schedules/politics that were not open story situations
- person-to-person relationships were mixed with person-to-group attitudes
- important Canon files existed but Pure Writer never read them
- public Knowledge/Open Situations were over-supplied every turn
- geography/relationships/presentation were under-supplied
- 32-character presentation facts were incomplete
- Cleanroom rewrites flattened some source character traits
- PC Canon allowed fields that the temporary UI/server silently dropped
- migration/development notes lived inside model-facing Canon data
- CI only checked parse/key integrity and could not catch cross-file contradictions

Therefore narrative prompt work was paused.

---

## 6. CURRENT ACTIVE WORK — PR #19 CANON-BASE-01

### PR

- PR: **#19 — `CANON-BASE-01 — Clean Canon Reconciliation`**
- Branch: `codex/canon-base-01-clean-reconciliation`
- Base: exact Pure V0 `876e235918c99f4588c9ef4eb874ecee4541be97`
- Current head at handover-writing start was `f5b3fc63a772ca93d18c5b3985da2f1de7947c4e`; **the handover-doc commit moves HEAD again, so the next session MUST refetch exact current HEAD rather than reuse this SHA.**
- Draft: YES
- Merged: NO
- Mergeable before handover doc update: YES

### Important rule

PR #19 is a **factual-base reconciliation**, not narrative acceptance.
A green PR #19 does not mean Original Feel is solved.

---

## 7. CANON-BASE-01 work completed

### A. Layer reconciliation

- A/B/C dorm contradiction removed.
- Current project Canon override:
  - A동/B동/C동 are student residence halls
  - no immutable global year-exclusive or department-exclusive mapping
  - individual hall/room assignment belongs to dated/run state
  - baseline room is single occupancy
- Current offices/year/realm/circle moved out of durable character core into dated `character-state.json`.
- Current imperial succession snapshot moved out of immutable succession law.
- Special-crime jurisdiction aligned to current project Canon around Imperial Security Bureau + imperial direct-response/guard authority, with specialist cooperation.

### B. Open Situations cleanup

Removed from `open-situations.json` because they are not unresolved story situations:

- entrance/orientation schedule
- freshman evaluation schedule
- imperial succession baseline
- student recruitment season
- Aria academy stay

Remaining Open Situations are actual unresolved world conditions such as Gray Wolf Forest / Silent Expansion / missing researchers / Orpheum disappearances.

### C. Relationship schema cleanup

- `relationships.json` = person -> person dated stance
- `group-attitudes.json` = person -> group default stance
- no automatic individual relationship from a group attitude

Source-backed relationships omitted during first Cleanroom were restored, including:

- Isabel -> Anastasia
- Isabel -> Sera
- Sera -> Isabel
- Elena -> Lucia
- Elena -> Serena

### D. Character source-fidelity pass

First Cleanroom had over-refined some characters into safer/generic semantic summaries.
This pass restores source-backed axes and keeps reference-derived interpretations as refinements rather than replacements.

Important examples:

- Elena: restore free-spirited / playful / pleasure-seeking / curiosity-first axis; magic truth over power
- Artemis: worn greatsword, practical survival combat, “real knight” teaching goal
- Sera: cynical survival realism, practical wealth/stability goal
- Sia: spirit-affinity identity and explicit spirit toolkit
- Lillia: fair competition, real weaknesses (experience/deception/aura control), sword-driven aspiration
- Lena: Mana’s Beloved trait and low-energy/curiosity contrast
- Emily: playful/innocent surface + sharp insight; explicit guard against turning values into repeated thematic speeches
- Laris / Mirabelle / Serena / Chloe: source-backed strengths, weaknesses, interests and goals restored

### E. Presentation Canon

New: `data/canon/characters/presentation.json`

Only source-audited facts are asserted.

Opening benchmark characters currently have usable presentation facts:

- Emily: woman, silver hair, blue eyes, small build, white formal dress/principal mantle in reference opening
- Lena: woman, silver hair, purple eyes, small build, loose magic-department robe
- Artemis: woman, tied white hair, red eyes, military-like professor uniform, real sword
- Sera: woman, brown hair, blue eyes, plain/worn practical gear
- Lillia: woman, red hair, gold eyes, longsword, Valenhardt crest

Unverified characters remain explicitly unverified instead of being inferred from names/images/genre.

### F. Knowledge/secrecy

- Etera exact 9-circle fact no longer leaks through ordinary dated state.
- Ordinary state points to restricted Knowledge fact instead.
- Source-confirmed private truths whose exact visibility/known-by set is not audited are recorded as `access_unclassified`, not guessed into a visibility level.

Examples intentionally fail-closed:

- Laris covert non-family-school research
- Serena’s old offensive-magic trauma incident
- Chloe high-risk information dealing
- Elise personal Gaze of Charm trait

### G. Power-system reconciliation

Later clarified Canon now matches runtime data:

- Expert High: externalized aura / sword-energy
- Expert Peak: aura shaping + precise simultaneous internal/external control
- Master: aura blade / will-concept carried through aura
- Master does **not** automatically imply Authority

### H. PC creation base contract

Canon already allowed:

- Traits
- Authorities
- starting gold
- free character profile

Pure UI/client/server previously dropped them.
The base path now preserves them instead of deleting Canon freedom to match a temporary UI.

### I. Factual Canon retrieval base

New: `api/lib/canon-context.js`

This is **not** a Director, event engine, or narrative selector.
It performs bounded factual retrieval only.

It now supplies:

- academy cast from dated `presence` instead of a hand-picked cast list
- thin cast index + detailed packets only for directly relevant/current characters
- dated relationship/group-attitude context
- source-audited presentation facts
- location-relevant geography
- topic-relevant society facts
- subject-relevant visible Knowledge
- Open Situations only when explicitly reached/queried
- schedule facts only when imminent or explicitly queried

Critical regression guard:

> At 09:15, a normal dorm/training action does **not** receive the distant 12:00 orientation merely because it exists in state.

Clock state is fact/state and does not imply a fictional bell/event.

---

## 8. Canon/source conflict policy established

Do not silently overwrite Canon with the original reference log.

Example:

- Reference sample casually places knight area east of its local central plaza description.
- Latest legacy Canon v7 explicitly establishes main-building west = knight, east = magic.
- Geography keeps the authoritative Canon; reference choreography is not promoted to immutable world fact.

Dorm exception:

- Older legacy/reference material used first-year=A hall.
- Current project direction explicitly changed to A/B/C mixed residence assignment.
- This is a **project Canon override**, not an accidental inference from the reference.

Always distinguish:

1. source Canon
2. dated scenario fact
3. knowledge/rumor/assessment
4. project override
5. qualitative reference behavior

---

## 9. Tests / exact structural status before handover-doc commit

At PR #19 HEAD immediately before this handover documentation edit:

- Clean-room checks: PASS
- Pure V0 hard invariants: PASS
- CANON-BASE-01 cross-file invariants: PASS
- factual Canon retrieval invariants: PASS
- Vercel: SUCCESS

A previous CI failure during retrieval extraction was **test-boundary staleness**, not implementation failure: `canon-base-01.test.mjs` still expected `write.js` to directly import `character-state.json` after that import moved behind `canon-context.js`. Test was corrected to validate the new boundary; subsequent exact-head CI passed.

Because this handover file itself creates a new commit, **new session must refetch and re-check the new exact HEAD**.

---

## 10. Important unresolved Canon/base work

Do not invent these just to make the schema look complete.

- remaining source-audited presentation facts for the other Canon characters
- exact visibility/known-by for several confirmed private facts marked `access_unclassified`
- missing dated details not actually established by source
- exact residence floor/room-number topology
- any truly unresolved facts listed in `uncertainties.json`

These are not permission to add a simulation engine.

---

## 11. Writer / narrative direction for AFTER Canon-base acceptance

Do **not** reuse the accumulated R2/R3 prompt stack.

The best-supported observed behavior core from reference + original-AI meta-analysis is approximately:

- resolve the user’s chosen action first
- routine/single-outcome process can compress
- reach the first meaningful human/world contact or decision rather than stopping at mere arrival
- a Canon NPC may naturally be present when time/place/life make it plausible
- that NPC acts when role/personality/interest/relationship/knowledge/visible situation gives a concrete reason
- early world life stays in PC-perceivable experience; do not build NPC-only theater
- story grows primarily through `player choice -> world consequence -> player choice`
- do not manufacture chains of unrelated incidents to fake activity
- generic NPCs handle place-functions; Canon Named NPCs matter when personal recurring interaction matters
- relationship affects response style; knowledge gates whether a response is possible
- show character through verbs, timing, dialogue, silence and choices
- omit scene details that do not matter to what happens next
- combat behavior reflects the actual opponent, not a universal adaptation rule
- consequences persist; rescue does not erase failure

Keep this **short** when narrative work resumes.
Do not turn these into quotas, scores, state machines or extra AI calls.

---

## 12. DO NOT DO in the next session

- Do not restart analysis from legacy Phase 1/2/3.
- Do not modify `hoho074566-cpu/lumencia-ac`.
- Do not revive PR #15/#16/#17/#18.
- Do not stack another Writer correction onto a failed experiment branch.
- Do not infer Original-Feel PASS from green CI.
- Do not add Event Engine / Scheduler / Director / event queue / NPC goal tick / hook score / attention meter / cast rotation / prose quota / Korean semantic regex machinery.
- Do not dump every Canon file into every turn.
- Do not hide the Canon cast so aggressively that the Writer cannot naturally discover Named NPCs.
- Do not convert reference choreography into mandatory Canon events.
- Do not fill unknown Canon from genre intuition or image appearance unless source-audited and intentionally approved.
- Do not treat clock state or future schedule as a story beat merely because the Writer knows it.
- Do not spend model usage on broad narrative acceptance until the factual base is the intended one.

---

## 13. EXACT NEXT SESSION START

1. Open a **new chat/session**. This current conversation is intentionally being retired because its accumulated context makes it noticeably slow.
2. Read, in order:
   - `docs/LUMENSIA_HANDOVER_CURRENT.md`
   - `docs/CANON_BASE_01_RECONCILIATION.md`
   - `docs/CANON_SOURCE_AUDIT.md`
   - `docs/ARCHITECTURE.md`
   - `docs/NEXT_ACTION.md`
3. Refetch actual GitHub state for `hoho074566-cpu/lumensia-ai-first`.
4. Refetch PR #19 exact HEAD, draft/mergeable status, CI, Vercel, base/merge-base.
5. Do **not** rerun or re-explain the failed narrative experiments.
6. Review whether CANON-BASE-01 is a coherent factual foundation. Fix only factual/base defects if discovered.
7. Do not merge automatically unless the user explicitly directs it in the new session.
8. After the user accepts/merges the Canon base, start any new narrative experiment from the accepted Canon-base commit on a fresh branch.
9. The first post-Canon narrative experiment should be cheap and small: ordinary opening/broad-action probes with no user-steered Named NPC invocation before spending usage on a long suite.

---

## 14. Handover status

`HANDOFF_READY: PASS`

`NEXT_ACTION: NEW CHAT -> read this handover -> refetch PR #19 exact state -> finish/accept Canon-base before any new Original-Feel Writer experiment.`
