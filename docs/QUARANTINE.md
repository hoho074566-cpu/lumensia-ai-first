# Legacy Quarantine

The following legacy source paths are **reference-only** and must not be copied/imported/cherry-picked into the AI-first runtime.

## Narrative/runtime quarantine

```text
api/chat.js
api/chat-router.js
api/lib/context-router.js
api/lib/gm-rules.js
api/lib/memory.js
api/lib/prompt.js
api/lib/router.js
api/lib/schema.js
api/lib/utils.js

app.js
app-runtime.js

lib/active-threads.js
lib/combat-growth.js
lib/event-consequence.js
lib/event-progress.js
lib/faction-social-consequence.js
lib/npc-character-behavior.js
lib/npc-goal-tick.js
lib/npc-significance.js
lib/offscreen-progression.js
lib/scene-continuity.js
lib/scene-exit.js
lib/scene-momentum.js
lib/scene-novelty.js
lib/scene-orchestration.js
lib/scene-purpose.js
lib/skill-learning.js
lib/time-plan-parser.js
lib/time-plan-reconciliation.js
lib/turn-hook.js
lib/world-result-surfacing.js
lib/awakening-talent-evolution.js
```

Reason: these modules contain or are coupled to legacy narrative authority, regex semantic reconstruction, event/procedure choreography, model-facing checklists, or old Turn-schema assumptions.

## Later concept-only audit

The following may contain useful deterministic concepts, but must not be copied into V0:

```text
lib/fate-start.js
lib/fate-background.js
lib/fate-personal-story.js
lib/fate-ending.js
lib/fate-inheritance.js
lib/run-commit-boundary.js
save-migrations.js
```

Potentially reusable *concepts* include stale-run rejection, atomic persistence, first-discovery ledgers, and visibility metadata. Reimplement only after V0 narrative acceptance and only after a fresh audit.

## Old tests and automation

Legacy tests that enforce Context Router, Scene Momentum, Event Progress, Turn Hook, Scene Exit, time-plan parsing, NPC significance, or old stable file paths are not portable invariants.

Legacy Auto-PR / maintenance / merge-readiness automation stays in the old repository until the new repository has a small architecture worth protecting.

## What may be copied with minimal transformation

- character asset URLs/keys/expression inventory
- generic `.gitignore` entries
- deployment security-header intent
- user-facing PC creation field ideas
- pure source facts extracted into Canon Cleanroom

Everything else requires an explicit migration decision.
