# LUMENSIA NARRATIVE BASELINE V3 — ACCEPTED

Status: **ACCEPTED BASELINE**

This baseline captures the first AI-First Authoring Runtime build that the human reviewer judged genuinely close to the original Lumensia feel while remaining fast, token-light, and free of a Narrative Engine.

## Exact state

- Repository: `hoho074566-cpu/lumensia-ai-first`
- Working PR: `#25 — OPUS-PROSE-PACE-V3 — Social friction + affinity/conflict event density`
- Runtime branch: `codex/opus-prose-pace-v3-social-friction`
- Accepted functional head: `82160b6fa6625171b6e006826e22245eab374a2c`
- Parent experiment base: `45e275a8e2ce0843e03f8b5fd3fd864d036d9e24`
- Locked Canon base remains: `01c5a3a3c1846916063fa343f963e7055fe93c5d`

## Human acceptance signal

The accepted opening demonstrated all of the following at once:

- immediate PC-facing social friction rather than passive observation;
- a class/status jab from another freshman;
- Lillia stepping in for her own character-consistent reason;
- direct PC contact and a natural invitation to sit;
- rivalry/status pressure remaining in the background instead of disappearing;
- Emily entering with a short, characterful line instead of a thematic lecture;
- fast movement into the meaningful human scene;
- no Event Director, NPC selector, schedule engine, relationship event engine, or additional model call.

Human verdict: **this is the new regression floor.**

## Protected narrative qualities

Future work must not regress:

1. **Prose / pace**
   - `ROUTINE COMPRESSES. IMPORTANT MOMENTS EXPAND.`
   - routine movement and procedure compress;
   - meaningful human contact, combat, conflict, attraction, rivalry, failure and aftermath may expand.

2. **PC presence**
   - PC remains the default camera anchor;
   - NPC/world initiative does not turn PC into a spectator;
   - new PC dialogue, emotion, goal or meaningful choice is never invented.

3. **Social friction and affinity density**
   - relationships do not remain indefinitely polite and low-friction;
   - status, skill, rumors, pride, curiosity, rivalry, invitations, jealousy, misunderstandings and taking sides may naturally move scenes;
   - relationship change is shown through behavior, not numeric exposition.

4. **Cast overlap**
   - populated academy spaces contain overlapping lives;
   - recurring scenes do not collapse into a single-character route;
   - named cast appears when plausible, not by forced rotation or teleportation.

5. **Named-NPC portrayal facts**
   - Canon/Lore presentation facts and voice are fixed portrayal facts;
   - verified anchors include Lillia = red hair / golden eyes, Sera = brown hair / blue eyes, Emily = silver hair / blue eyes, Artemis = tied-back white hair / red eyes, Lena = silver hair / violet eyes;
   - unknown appearance details are not promoted into durable facts merely to decorate prose.

## Architecture remains frozen

`Base RP Template → Main Author Prompt → Relevant Lore → Start Setting → Development Examples → Runtime State → Active Keyword Books → Recent Chat → Exact User Input → ONE Writer call`

No Narrative Director, Event Engine, NPC selector, hook meter, schedule planner, relationship scoring engine, prose quota, or extra planning model call.

## Validation

Accepted functional head `82160b6fa6625171b6e006826e22245eab374a2c`:

- clean-room: PASS
- V0 hard invariants: PASS
- CANON-BASE reconciliation: PASS
- factual Canon retrieval: PASS
- Authoring Runtime checks: PASS
- Narrative Baseline V3 portrayal guards: PASS
- Vercel deployment: SUCCESS

## Regression rule

If later tuning makes the narrative feel worse than this baseline on prose rhythm, progression speed, PC presence, social friction, cast variety, or named-NPC continuity, revert the change instead of compensating with a new subsystem.

Feature expansion should proceed only after comparing against this baseline.
