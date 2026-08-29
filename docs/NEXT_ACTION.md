# Next Action

## Current checkpoint

**CLEANROOM FOUNDATION — COMPLETE**

The new repository now has:

- AI-first repository rules
- explicit legacy quarantine
- Canon migration boundary/audit
- cleaned world Canon
- 32-character clean core/voice registry
- epistemic visibility/secret Canon
- explicit Canon uncertainties
- dated 1285-03-01 academy baseline
- dated relationship/open-situation baselines
- clean PC creation/progression rules
- 32-character / 13-expression image manifest
- reference QA policy + benchmark + source hashes
- minimal deployment/security skeleton
- repository-owned clean-room CI

No V0 production Writer/runtime implementation has been added yet.

## Exact next implementation

**V0 — Pure AI Narrative Prototype**

Build the smallest playable vertical slice from the clean-room data.

Target data flow:

```text
Canon + scenario/run state + exact user action
                  ↓
          thin scene packet
                  ↓
            one AI Writer
                  ↓
       hard-invariant validation
                  ↓
             save/render
```

### Initial V0 scope

Implement only what is necessary to play and compare narrative quality:

- minimal mobile story UI
- free PC creation using the clean PC field model
- current run state: PC, current time/location, recent scene/history
- relevant character/core/voice retrieval
- relevant knowledge visibility filtering
- exact USER ACTION preservation
- one Writer model call (initial quality baseline may use one fixed high-quality model rather than routing)
- free ordered narration/dialogue beat output
- registered `speaker_key` / portrait expression validation
- minimal save/export/import
- visible error handling that never becomes fiction

### Explicitly out of V0

- Suggested Actions
- AUTO/CONTINUE modes
- Event Engine
- Schedule Engine
- Turn Hook / Scene Exit / Scene Momentum
- NPC simulation/goal-tick engine
- off-screen simulation
- relationship/memory mutation engines
- skill growth/awakening automation
- Fate/Ending/Inheritance
- model routing by Korean keyword regex
- narrative scoring/rewriting validators

### First human gate

Before adding those systems, compare actual V0 play against `reference/QUALITY_BENCHMARK.md` using opening, routine, short-action, broad-intent, quiet conversation, NPC-vs-NPC, combat, suspense, failure/aftermath, unseen-scene, intent-boundary, and identity cases.

If V0 does not plainly read like a living novel scene, fix the thin Writer path before adding game systems.
