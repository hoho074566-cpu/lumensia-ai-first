# LUMENSIA NARRATIVE BASELINE — CURRENT

Status: **V3 ACCEPTED BASELINE LOCKED**

This document points future work to the current human-accepted narrative regression floor.

## Exact functional baseline

- Repository: `hoho074566-cpu/lumensia-ai-first`
- PR: `#25 — OPUS-PROSE-PACE-V3 — Social friction + affinity/conflict event density`
- Runtime branch: `codex/opus-prose-pace-v3-social-friction`
- Accepted functional head: `82160b6fa6625171b6e006826e22245eab374a2c`
- Immutable functional pointer: `baseline/narrative-v3-accepted-82160b6`
- Canon base: `01c5a3a3c1846916063fa343f963e7055fe93c5d`
- Detailed record: `docs/NARRATIVE_BASELINE_V3_ACCEPTED.md`

The later commits on the runtime branch are documentation-only baseline records. The functional Writer behavior is pinned to the exact SHA above.

## Human verdict

This is the strongest and most original-like AI-First Lumensia narrative build accepted so far.

The key acceptance scene demonstrated, in one short opening sequence:

- immediate PC-facing class/status friction;
- another freshman making a dismissive jab rather than harmless background chatter;
- Lillia intervening for her own character-consistent reason;
- direct PC contact and a natural invitation without stealing PC agency;
- social pressure remaining alive in the background;
- Emily entering with a short characterful line instead of a thematic lecture;
- fast progression into the meaningful human scene;
- no Narrative Director, Event Engine, NPC selector, relationship event engine, schedule engine, or extra planning model call.

## Protected qualities

### 1. Prose and progression speed

`ROUTINE COMPRESSES. IMPORTANT MOMENTS EXPAND.`

Routine procedure, walking, waiting and repeated demonstration compress. Human conflict, attraction, rivalry, discovery, combat, failure and aftermath may expand when they genuinely become meaningful.

### 2. PC presence and agency

PC remains the default camera anchor. NPCs and the world act independently without demoting PC into a spectator. Never invent new PC dialogue, explicit emotion, goal or meaningful choice.

### 3. Social friction / affinity / conflict density

Relationships do not remain indefinitely polite and low-friction. Status, skill, pride, rumors, curiosity, rivalry, invitations, jealousy, misunderstanding, taking sides, challenges and remembered details may naturally move scenes.

Relationship change is shown through changed behavior rather than announced as numbers or system messages.

### 4. Cast overlap without forced rotation

Populated academy spaces contain overlapping lives. Recurring play must not collapse into a single-character route, but named characters are not teleported in merely to satisfy variety.

### 5. Named-NPC portrayal continuity

Verified Canon/Lore presentation facts and voice are fixed portrayal facts.

Current verified anchors include:

- Lillia: red hair / golden eyes
- Sera: brown hair / blue eyes
- Emily: silver hair / blue eyes
- Artemis: tied-back white hair / red eyes
- Lena: silver hair / violet eyes

Unknown appearance details are not promoted into durable facts merely to decorate prose.

## Architecture remains frozen

`Base RP Template → Main Author Prompt → Relevant Lore → Start Setting → Development Examples → Runtime State → Active Keyword Books → Recent Chat → Exact User Input → ONE Writer call`

No Narrative Director, Event Engine, NPC selector, hook meter, schedule planner, relationship scoring engine, prose quota, or extra planning model call.

## Regression rule

Any later change that makes prose rhythm, progression speed, PC presence, social friction, cast variety, named-NPC continuity, or conversational naturalness worse than this baseline must be reverted rather than compensated for with a new subsystem.

Feature work comes after this baseline; it must preserve this narrative behavior rather than replace it.
