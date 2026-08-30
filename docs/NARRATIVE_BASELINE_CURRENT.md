# LUMENSIA NARRATIVE BASELINE — CURRENT

Status: **BASELINE LOCKED**

This document records the first Writer-facing build that reached the current human-accepted narrative baseline. Future tuning must treat this state as the regression floor.

## Exact baseline

- Repository: `hoho074566-cpu/lumensia-ai-first`
- PR: `#22 — AUTHORING-RUNTIME-01 — Frozen Crack-like Authoring Runtime`
- Runtime branch: `codex/authoring-runtime-01`
- Baseline commit: `e3a5dd862cb2a605d789ddc51764d9c82d86d94a`
- Immutable baseline pointer: `baseline/authoring-runtime-01-e3a5dd8`
- Canon base / merge-base: `01c5a3a3c1846916063fa343f963e7055fe93c5d`

## Human verdict

This is the most stable and most original-like Lumensia AI-First narrative build so far.

Observed strengths that must not regress:

- ordinary academy scenes now behave like scenes rather than administration/tutorial reports;
- named NPCs notice concrete PC-visible details and engage naturally;
- PC remains materially present while NPCs and the world retain initiative;
- relationship scenes can continue across ordinary locations without requiring a manufactured event;
- routine transitions can compress while meaningful interaction, discovery and combat receive depth;
- dialogue, movement, gaze, equipment and positioning carry characterization instead of repeated explanatory prose;
- combat exchanges evolve from the previous exchange instead of resetting into generic descriptions;
- no Narrative Director / Event Engine / NPC selector / hook meter / planner was required to reach this quality.

The lunch encounter with Sera and Lillia is a key acceptance signal: the scene remains ordinary, yet both NPCs respond to prior contact and to the PC's visible presence without inventing a major incident.

## Current target

The next qualitative target is **Opus 4.6-class prose feel and progression speed** while preserving the current PC presence and world initiative.

Only these axes may be tuned before feature expansion:

1. **Prose rhythm / original feel**
   - faster move from concrete detail into human action;
   - less redundant explanation after dialogue/action already conveys meaning;
   - more variation in sentence length and conversational breathing;
   - preserve character-specific voice and subtext.

2. **Progression speed**
   - compress routine movement, procedure, waiting and repeated demonstration;
   - stay longer only when relationship, conflict, discovery, danger or combat has genuinely become interesting;
   - avoid turning ordinary moments into mandatory mysteries or incidents;
   - avoid lingering on school procedure merely because it exists in Canon.

3. **PC presence / agency**
   - PC remains the default camera anchor;
   - NPC initiative may approach, notice, challenge or react to the PC;
   - never invent a new PC goal, voluntary dialogue, explicit emotion or meaningful choice;
   - do not let long NPC-only sequences demote the PC into a spectator.

## Regression rule

Any future prompt/example change that makes the output worse than this baseline on scene life, PC presence, named-NPC continuity, routine compression or conversational naturalness must be reverted rather than compensated for with a new subsystem.

Do not add feature work until the prose/pace target is accepted.

## Architecture remains frozen

`Base RP Template → Main Author Prompt → Relevant Lore → Start Setting → Development Examples → Runtime State → Active Keyword Books → Recent Chat → Exact User Input → ONE Writer call`

No additional narrative-planning model call is permitted in the critical path.
