# Migration Boundary

Source repository: `hoho074566-cpu/lumencia-ac`

Target repository: `hoho074566-cpu/lumensia-ai-first`

## Migration rule

The new project migrates **world/character content and hard-integrity lessons**, not the legacy narrative-control architecture.

### Migrate now

- cleaned world Canon facts
- cleaned character identity/core/personality/value/background data
- cleaned 32-character voice data
- knowledge visibility / rumor / restricted-fact semantics
- dated academy starting baseline
- PC creation field model and world-consistent power scales
- character asset manifest
- minimal deployment/security conventions
- reference logs as development-only qualitative benchmarks

### Reimplement later, only after V0 narrative acceptance

- memory persistence
- relationship persistence
- faction reputation
- skill growth
- rare awakening/talent evolution
- stale async result protection / atomic persistence
- Fate / Ending / Inheritance ledgers

These are concept migrations, not source-code migrations.

### Do not migrate

Any subsystem whose job is to decide how fiction should proceed, what beat comes next, when prose should stop, which NPC must speak, how many reactions should appear, or how Korean prose should be semantically classified.

See `QUARANTINE.md`.

## Canon clean-room transformation

Every migrated setting is classified as one of:

- `SOURCE_FACT` — preserved source fact
- `REFINED_CHARACTERIZATION` — source-supported interpretation rewritten so an AI can portray the character more naturally
- `BASELINE_STATE` — true at a dated starting point but expected to change during play
- `KNOWLEDGE_FACT` — fact/rumor/assessment with visibility metadata
- `MIGRATION_CHANGE` — stale/duplicate/conflicting legacy material resolved for the clean-room data
- `DROP` — legacy draft, runtime instruction, obsolete patch history, or narrative-control material

A migration audit must make meaningful refinements and conflict resolutions inspectable instead of silently rewriting source material.

## Reference boundary

Original/reference play logs may be stored under `reference/` for human QA and development evaluation. Production runtime code must not import them and production prompts must not contain copied reference prose, scene order, or reference-specific character choreography.
